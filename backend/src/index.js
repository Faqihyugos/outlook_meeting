import 'isomorphic-fetch';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { syncOutlookMeetings, updateMeetingAttendance } from './outlook.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';

dotenv.config();

// Verify required environment variables
const requiredEnvVars = [
  'COMPANY_DOMAIN',
  'JWT_SECRET',
  'AZURE_TENANT_ID',
  'AZURE_CLIENT_ID',
  'AZURE_CLIENT_SECRET',
  'REDIRECT_URI',
  'DATABASE_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Sync meetings from Outlook every 5 minutes

app.use(cors());
app.use(express.json());

// Sync meetings from Outlook every 5 minutes
async function syncMeetings() {
  try {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0] + 'T00:00:00Z';
    const endDate = today.toISOString().split('T')[0] + 'T23:59:59Z';
    const outlookMeetings = await syncOutlookMeetings(startDate, endDate, process.env.COMPANY_DOMAIN);

    for (const meeting of outlookMeetings) {
      await prisma.meeting.upsert({
        where: { outlookEventId: meeting.outlookEventId },
        update: meeting,
        create: meeting
      });
    }
    console.log(`Synced ${outlookMeetings.length} meetings from Outlook`);
  } catch (error) {
    console.error('Meeting sync failed:', error);
  }
}

syncMeetings();
setInterval(syncMeetings, 5 * 60 * 1000);

// AUTH: Microsoft login URL
app.post('/auth/microsoft', async (req, res) => {
  const { domain, redirectUrl } = req.body;
  if (!domain) return res.status(400).json({ message: 'Domain is required' });

  if (domain.toLowerCase() !== process.env.COMPANY_DOMAIN) {
    return res.status(401).json({ message: `Only ${process.env.COMPANY_DOMAIN} domain is allowed` });
  }

  const authUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?` +
    `client_id=${process.env.AZURE_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
    `&scope=openid profile offline_access User.Read Calendars.Read` +
    `&response_mode=query` +
    `&prompt=consent`;

  res.json({ authUrl });
});

// AUTH: OAuth2 callback handler
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: 'Authorization code not found' });

  try {
    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'User.Read Calendars.Read offline_access'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const msUser = userRes.data;
    const domain = msUser.mail?.split('@')[1]?.toLowerCase();
    if (domain !== process.env.COMPANY_DOMAIN) {
      return res.status(401).json({ message: 'Unauthorized domain' });
    }

    let user = await prisma.user.findUnique({ where: { email: msUser.mail.toLowerCase() } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: msUser.mail.toLowerCase(),
          fullName: msUser.displayName,
          role: 'employee',
          isActive: true
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // const redirectUrl = `${process.env.FRONTEND_REDIRECT_URL}?token=${token}`;
    const redirectUrl = `http://localhost:4028/sso-handler?token=${token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error('SSO callback error:', err.response?.data || err.message);
    res.status(500).json({ message: 'SSO login failed' });
  }
});

// AUTH: Email-password login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain !== process.env.COMPANY_DOMAIN) {
      return res.status(401).json({ message: `Please use your ${process.env.COMPANY_DOMAIN} email address` });
    }

    const user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.isActive) return res.status(401).json({ message: 'Account is inactive' });
    if (!user.password) return res.status(401).json({ message: 'Please use Microsoft SSO to login' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// GET /api/meetings?date=YYYY-MM-DD&domain=company.com&search=&type=
app.get('/api/meetings', async (req, res) => {
  const { date, domain, search, type } = req.query;
  try {
    // Filter meetings by date and domain
    const where = {
      companyDomain: domain,
      startTime: {
        gte: new Date(date + 'T00:00:00.000Z'),
        lt: new Date(date + 'T23:59:59.999Z'),
      },
    };
    if (type && type !== 'all') where.meetingType = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    const dbMeetings = await prisma.meeting.findMany({
      where,
      include: {
        organizer: true,
        attendees: {
          include: {
            user: true
          }
        },
        guestAttendees: true,
      },
      orderBy: { startTime: 'asc' },
    });

    // Transform meetings to match frontend format
    const meetings = dbMeetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      time: new Date(meeting.startTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      endTime: new Date(meeting.endTime).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      organizer: meeting.organizer ? meeting.organizer.fullName : 'Unknown',
      location: meeting.location || 'Not specified',
      attendees: meeting.attendees.length + meeting.guestAttendees.length,
      type: meeting.meetingType,
      outlookEventId: meeting.outlookEventId
    }));

    // Get meeting types from enum and format them
    const meetingTypes = Object.values(prisma._dmmf.datamodel.enums.find(e => e.name === 'MeetingType').values)
      .map(type => type.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));

    res.json({ meetings, meetingTypes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// POST /api/meetings - create a new meeting if the room is available
app.post('/api/meetings', async (req, res) => {
  const { title, description, startTime, endTime, location, organizerEmail, meetingType } = req.body;
  if (!title || !startTime || !endTime || !location || !organizerEmail) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const organizer = await prisma.user.findFirst({ where: { email: organizerEmail.toLowerCase() } });
    if (!organizer) {
      return res.status(404).json({ message: 'Organizer not found' });
    }

    const conflict = await prisma.meeting.findFirst({
      where: {
        location,
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } }
        ]
      }
    });

    if (conflict) {
      return res.status(409).json({ message: 'Room is fully booked for the selected time' });
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        organizerId: organizer.id,
        meetingType: meetingType || 'team_meeting',
        companyDomain: process.env.COMPANY_DOMAIN
      }
    });

    res.json({ meeting });
  } catch (error) {
    console.error('Meeting creation error:', error);
    res.status(500).json({ message: 'Failed to create meeting' });
  }
});

// GET /api/rooms/:room/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
app.get('/api/rooms/:room/availability', async (req, res) => {
  const { room } = req.params;
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ message: 'start and end are required' });

  const startDate = new Date(start + 'T00:00:00Z');
  const endDate = new Date(end + 'T23:59:59Z');

  try {
    const bookings = await prisma.meeting.findMany({
      where: {
        location: room,
        startTime: { lt: endDate },
        endTime: { gt: startDate }
      },
      select: { startTime: true, endTime: true }
    });

    const hoursPerDay = {};
    bookings.forEach(b => {
      const key = b.startTime.toISOString().slice(0, 10);
      const duration = (b.endTime - b.startTime) / 3600000;
      hoursPerDay[key] = (hoursPerDay[key] || 0) + duration;
    });

    const fullyBooked = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayKey = d.toISOString().slice(0, 10);
      if ((hoursPerDay[dayKey] || 0) >= 8) {
        fullyBooked.push(dayKey);
      }
    }

    res.json({ bookings, fullyBooked });
  } catch (err) {
    console.error('Room availability error:', err);
    res.status(500).json({ message: 'Failed to check availability' });
  }
});

// POST /api/attendance - update attendance status for logged in user
app.post('/api/attendance', async (req, res) => {
  const { meetingId, status } = req.body;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    const domain = user.email.split('@')[1].toLowerCase();
    if (domain !== process.env.COMPANY_DOMAIN) {
      return res.status(401).json({ message: 'Unauthorized domain' });
    }

    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

    await prisma.meetingAttendee.upsert({
      where: {
        meetingId_userId: {
          meetingId,
          userId: user.id
        }
      },
      update: { attendanceStatus: status },
      create: { meetingId, userId: user.id, attendanceStatus: status }
    });

    if (meeting.outlookEventId) {
      await updateMeetingAttendance(meeting.outlookEventId, user.email, status);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Attendance update error:', err);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});

// POST /api/guest-checkin
app.post('/api/guest-checkin', async (req, res) => {
  const { guestInfo, meetingId, date } = req.body;
  if (!guestInfo || !meetingId) return res.status(400).json({ errors: { general: 'Missing data' } });
  try {
    // Check meeting exists and is on the correct date
    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting || meeting.startTime.toISOString().slice(0, 10) !== date) {
      return res.status(404).json({ errors: { meeting: 'Meeting not found for selected date' } });
    }
    // Register guest attendee
    await prisma.guestAttendee.create({
      data: {
        meetingId,
        name: guestInfo.name,
        email: guestInfo.email,
        company: guestInfo.company || null,
      },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ errors: { general: 'Check-in failed' } });
  }
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
