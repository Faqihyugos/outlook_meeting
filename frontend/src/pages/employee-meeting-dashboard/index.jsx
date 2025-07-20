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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Fetch today's meetings from backend
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const date = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams({
          date,
          domain: import.meta.env.VITE_COMPANY_DOMAIN || 'kpk.go.id'
        });
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/meetings?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMeetings(data.meetings || []);
        setFilteredMeetings(data.meetings || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch meetings failed', err);
        setIsLoading(false);
      }
    };
    fetchMeetings();
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
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ meetingId, status })
      });

      setMeetings(prev =>
        prev.map(m => (m.id === meetingId ? { ...m, attendanceStatus: status } : m))
      );
    } catch (err) {
      console.error('Attendance update failed', err);
    }
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