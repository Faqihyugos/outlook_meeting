import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/lib/src/authentication/azureTokenCredentials/index.js';
import { ClientSecretCredential } from '@azure/identity';

// Azure AD app registration credentials
const credentials = {
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET
};

// Create Azure credential
const credential = new ClientSecretCredential(
  credentials.tenantId,
  credentials.clientId,
  credentials.clientSecret
);

// Create auth provider
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default']
});

// Create Microsoft Graph client
const graphClient = Client.initWithMiddleware({ 
  authProvider,
  defaultVersion: 'v1.0',
  debugLogging: true
});

async function checkMailboxStatus(userId) {
  try {
    await graphClient.api(`/users/${userId}/mailboxSettings`).get();
    return true;
  } catch (error) {
    return false;
  }
}

export async function syncOutlookMeetings(startDate, endDate, companyDomain) {
  try {
    console.log('Starting Outlook calendar sync...');
    
    // Get all users with the company domain
    const users = await graphClient.api('/users')
      .select('id,mail,displayName,userPrincipalName')
      .get();
    
    // Filter users with matching domain and valid company accounts
    const filteredUsers = users.value.filter(user => {
      if (!user.mail || !user.userPrincipalName) return false;
      
      const emailDomain = user.mail.toLowerCase().split('@')[1];
      const upnDomain = user.userPrincipalName.toLowerCase().split('@')[1];
      
      // Check both email and UPN domain match the company domain
      // Also verify the account is a member account, not a guest
      return emailDomain === companyDomain.toLowerCase() &&
             upnDomain === companyDomain.toLowerCase() &&
             !user.userPrincipalName.includes('#EXT#');
    });

    console.log(`Found ${filteredUsers.length} valid company users with domain ${companyDomain}`);
    
    // Then get calendar events for each user
    const allEvents = [];
    for (const user of filteredUsers) {
      try {
        // Check if mailbox is active before attempting to get calendar
        const isMailboxActive = await checkMailboxStatus(user.id);
        if (!isMailboxActive) {
          console.log(`Skipping inactive mailbox for user ${user.mail}`);
          continue;
        }

        console.log(`Fetching calendar events for ${user.mail}`);
        
        const userEvents = await graphClient.api('/calendar/getSchedule')
          .post({
            schedules: [user.mail],
            startTime: {
              dateTime: startDate,
              timeZone: 'UTC'
            },
            endTime: {
              dateTime: endDate,
              timeZone: 'UTC'
            },
            availabilityViewInterval: 60
          });

        if (userEvents.value && userEvents.value.length > 0) {
          const events = await graphClient.api(`/users/${user.id}/calendar/events`)
            .filter(`start/dateTime ge '${startDate}' and end/dateTime le '${endDate}'`)
            .select('id,subject,bodyPreview,start,end,location,organizer,recurrence')
            .get();

          allEvents.push(...events.value.map(event => ({
            outlookEventId: event.id,
            title: event.subject,
            description: event.bodyPreview,
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime),
            location: event.location?.displayName,
            organizer: event.organizer?.emailAddress?.name,
            organizerEmail: event.organizer?.emailAddress?.address,
            isRecurring: !!event.recurrence,
            companyDomain
          })));
        }
      } catch (userError) {
        console.error(`Error fetching events for user ${user.mail}:`, userError);
        // Continue with next user
      }
    }

    console.log(`Successfully synced ${allEvents.length} calendar events`);
    return allEvents;
  } catch (error) {
    console.error('Error syncing Outlook meetings:', error);
    throw error;
  }
}

export async function updateMeetingAttendance(outlookEventId, attendeeEmail, status) {
  try {
    // Check if mailbox is active
    const user = await graphClient.api('/users')
      .filter(`mail eq '${attendeeEmail}'`)
      .select('id,mail')
      .get();

    if (!user.value || user.value.length === 0) {
      throw new Error('User not found');
    }

    const isMailboxActive = await checkMailboxStatus(user.value[0].id);
    if (!isMailboxActive) {
      throw new Error('Mailbox is not active');
    }

    // Update attendance status
    let response;
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'present':
        response = await graphClient.api(`/users/${attendeeEmail}/events/${outlookEventId}/accept`)
          .post({
            sendResponse: true,
            comment: "Marked as present"
          });
        break;
      case 'declined':
      case 'absent':
        response = await graphClient.api(`/users/${attendeeEmail}/events/${outlookEventId}/decline`)
          .post({
            sendResponse: true,
            comment: "Marked as absent"
          });
        break;
      default:
        response = await graphClient.api(`/users/${attendeeEmail}/events/${outlookEventId}/tentativelyAccept`)
          .post({
            sendResponse: true,
            comment: `Attendance status: ${status}`
          });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating meeting attendance:', error);
    throw error;
  }
}
