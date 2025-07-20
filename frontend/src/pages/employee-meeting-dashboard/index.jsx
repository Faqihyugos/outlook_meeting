import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import FilterToolbar from './components/FilterToolbar';
import QuickActions from './components/QuickActions';
import MeetingList from './components/MeetingList';
import MeetingDetailsSidebar from './components/MeetingDetailsSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const EmployeeMeetingDashboard = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: 'today',
    meetingType: 'all',
    status: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [showDetailsSidebar, setShowDetailsSidebar] = useState(false);

  // Mock meeting data
  const mockMeetings = [
    {
      id: 1,
      title: "Weekly Team Standup",
      startTime: "2025-01-18T09:00:00Z",
      endTime: "2025-01-18T09:30:00Z",
      organizer: "Sarah Johnson",
      location: "Conference Room A / Teams",
      attendeeCount: 8,
      attendanceStatus: "present",
      type: "team-meeting",
      isRecurring: true,
      hasConflict: false,
      description: "Weekly team sync to discuss project progress and blockers."
    },
    {
      id: 2,
      title: "Q1 Budget Review",
      startTime: "2025-01-18T10:30:00Z",
      endTime: "2025-01-18T11:30:00Z",
      organizer: "Michael Chen",
      location: "Executive Boardroom",
      attendeeCount: 12,
      attendanceStatus: "late",
      type: "project-review",
      isRecurring: false,
      hasConflict: false,
      description: "Quarterly budget review and planning session."
    },
    {
      id: 3,
      title: "Client Presentation - Acme Corp",
      startTime: "2025-01-18T14:00:00Z",
      endTime: "2025-01-18T15:00:00Z",
      organizer: "Emily Rodriguez",
      location: "Client Meeting Room",
      attendeeCount: 6,
      attendanceStatus: null,
      type: "client-call",
      isRecurring: false,
      hasConflict: true,
      description: "Product demonstration and proposal presentation."
    },
    {
      id: 4,
      title: "One-on-One with Manager",
      startTime: "2025-01-18T15:30:00Z",
      endTime: "2025-01-18T16:00:00Z",
      organizer: "David Kim",
      location: "Manager\'s Office",
      attendeeCount: 2,
      attendanceStatus: null,
      type: "one-on-one",
      isRecurring: true,
      hasConflict: false,
      description: "Monthly career development and feedback session."
    },
    {
      id: 5,
      title: "Product Training Session",
      startTime: "2025-01-18T16:30:00Z",
      endTime: "2025-01-18T17:30:00Z",
      organizer: "Lisa Wang",
      location: "Training Room B / Teams",
      attendeeCount: 25,
      attendanceStatus: "absent",
      type: "training",
      isRecurring: false,
      hasConflict: false,
      description: "New product features training for all team members."
    },
    {
      id: 6,
      title: "All Hands Meeting",
      startTime: "2025-01-19T09:00:00Z",
      endTime: "2025-01-19T10:00:00Z",
      organizer: "John Smith",
      location: "Main Auditorium / Teams",
      attendeeCount: 150,
      attendanceStatus: null,
      type: "all-hands",
      isRecurring: false,
      hasConflict: false,
      description: "Monthly company-wide updates and announcements."
    }
  ];

  useEffect(() => {
    // Simulate loading and data fetch
    setIsLoading(true);
    setTimeout(() => {
      setMeetings(mockMeetings);
      setFilteredMeetings(mockMeetings);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = meetings;

    if (filters.search) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        meeting.organizer.toLowerCase().includes(filters.search.toLowerCase()) ||
        meeting.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.meetingType !== 'all') {
      filtered = filtered.filter(meeting => meeting.type === filters.meetingType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(meeting => {
        if (filters.status === 'pending') {
          return !meeting.attendanceStatus;
        }
        return meeting.attendanceStatus === filters.status;
      });
    }

    if (filters.dateRange === 'today') {
      const today = new Date().toDateString();
      filtered = filtered.filter(meeting => 
        new Date(meeting.startTime).toDateString() === today
      );
    }

    setFilteredMeetings(filtered);
  }, [meetings, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAttendanceUpdate = async (meetingId, status) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, attendanceStatus: status }
        : meeting
    ));

    // Show success notification
    console.log(`Attendance updated: Meeting ${meetingId} marked as ${status}`);
  };

  const handleBulkAction = async (action, value) => {
    switch (action) {
      case 'attendance':
        for (const meetingId of selectedMeetings) {
          await handleAttendanceUpdate(meetingId, value);
        }
        setSelectedMeetings([]);
        break;
      case 'export':
        // Simulate export
        console.log('Exporting attendance data...');
        break;
      default:
        break;
    }
  };

  const handleQuickAction = async (actionId) => {
    switch (actionId) {
      case 'mark-all-present':
        const todayMeetings = filteredMeetings.filter(meeting => {
          const today = new Date().toDateString();
          return new Date(meeting.startTime).toDateString() === today;
        });
        for (const meeting of todayMeetings) {
          await handleAttendanceUpdate(meeting.id, 'present');
        }
        break;
      case 'sync-calendar': setSyncStatus('syncing');
        setTimeout(() => setSyncStatus('synced'), 2000);
        break;
      case 'export-today':
        console.log('Exporting today\'s attendance...');
        break;
      case 'schedule-meeting':
        window.open('https://outlook.office.com/calendar/0/deeplink/compose', '_blank');
        break;
      default:
        break;
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetailsSidebar(true);
  };

  const handleBulkSelect = (meetingIds) => {
    setSelectedMeetings(meetingIds);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'p':
          if (selectedMeeting) {
            handleAttendanceUpdate(selectedMeeting.id, 'present');
          }
          break;
        case 'a':
          if (selectedMeeting) {
            handleAttendanceUpdate(selectedMeeting.id, 'absent');
          }
          break;
        case 'l':
          if (selectedMeeting) {
            handleAttendanceUpdate(selectedMeeting.id, 'late');
          }
          break;
        case ' ':
          e.preventDefault();
          if (selectedMeeting) {
            setShowDetailsSidebar(!showDetailsSidebar);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMeeting, showDetailsSidebar]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Icon name="RefreshCw" size={32} className="animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your meetings...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className={`lg:ml-64 pt-16 ${showDetailsSidebar ? 'mr-96' : ''} transition-all duration-300`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                My Meetings
              </h1>
              <p className="text-muted-foreground">
                Track your attendance across all scheduled meetings
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md ${
                syncStatus === 'syncing' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
              }`}>
                <Icon 
                  name={syncStatus === 'syncing' ? 'RefreshCw' : 'CheckCircle'} 
                  size={14} 
                  className={syncStatus === 'syncing' ? 'animate-spin' : ''} 
                />
                <span className="text-sm font-medium">
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Synced'}
                </span>
              </div>
              
              <Button
                variant="outline"
                iconName="Settings"
                onClick={() => navigate('/meeting-management-console')}
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions onQuickAction={handleQuickAction} />

          {/* Filter Toolbar */}
          <FilterToolbar
            onFilterChange={handleFilterChange}
            onBulkAction={handleBulkAction}
            selectedMeetings={selectedMeetings}
            totalMeetings={filteredMeetings.length}
          />

          {/* Meeting List */}
          <MeetingList
            meetings={filteredMeetings}
            onAttendanceUpdate={handleAttendanceUpdate}
            onSelectMeeting={handleSelectMeeting}
            selectedMeeting={selectedMeeting}
            onBulkSelect={handleBulkSelect}
            selectedMeetings={selectedMeetings}
            filters={filters}
          />
        </div>
      </main>

      {/* Meeting Details Sidebar */}
      {showDetailsSidebar && (
        <MeetingDetailsSidebar
          meeting={selectedMeeting}
          onClose={() => setShowDetailsSidebar(false)}
          onAttendanceUpdate={handleAttendanceUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeMeetingDashboard;