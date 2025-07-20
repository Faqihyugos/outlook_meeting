import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MeetingFilters from './components/MeetingFilters';
import MeetingDataTable from './components/MeetingDataTable';
import MeetingDetailsPanel from './components/MeetingDetailsPanel';
import IntegrationPanel from './components/IntegrationPanel';
import AnalyticsWidgets from './components/AnalyticsWidgets';

import Button from '../../components/ui/Button';

const MeetingManagementConsole = () => {
  const navigate = useNavigate();
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', direction: 'desc' });
  const [savedPresets, setSavedPresets] = useState([]);
  const [activeView, setActiveView] = useState('table'); // table, analytics
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Mock meetings data
  const mockMeetings = [
    {
      id: 1,
      title: "Weekly Team Standup",
      organizer: "Sarah Wilson",
      startTime: "2025-01-18T09:00:00",
      endTime: "2025-01-18T09:30:00",
      location: "Conference Room A",
      description: "Weekly team sync to discuss progress, blockers, and upcoming tasks for the development team.",
      totalInvitees: 12,
      attendedCount: 11,
      attendanceRate: 92,
      lateArrivals: 2,
      status: "completed",
      type: "team-meeting",
      participants: [
        { name: "John Doe", email: "john.doe@company.com", status: "present" },
        { name: "Jane Smith", email: "jane.smith@company.com", status: "present" },
        { name: "Mike Johnson", email: "mike.johnson@company.com", status: "late" },
        { name: "Emily Davis", email: "emily.davis@company.com", status: "present" },
        { name: "Alex Brown", email: "alex.brown@company.com", status: "late" },
        { name: "Lisa Wilson", email: "lisa.wilson@company.com", status: "present" },
        { name: "David Chen", email: "david.chen@company.com", status: "present" },
        { name: "Maria Garcia", email: "maria.garcia@company.com", status: "present" },
        { name: "Robert Taylor", email: "robert.taylor@company.com", status: "present" },
        { name: "Jennifer Lee", email: "jennifer.lee@company.com", status: "present" },
        { name: "Thomas Anderson", email: "thomas.anderson@company.com", status: "present" },
        { name: "Amanda White", email: "amanda.white@company.com", status: "absent" }
      ]
    },
    {
      id: 2,
      title: "Client Presentation - Q1 Results",
      organizer: "Mike Johnson",
      startTime: "2025-01-18T14:00:00",
      endTime: "2025-01-18T15:30:00",
      location: "Executive Boardroom",
      description: "Quarterly business review presentation to key stakeholders and client representatives.",
      totalInvitees: 8,
      attendedCount: 7,
      attendanceRate: 88,
      lateArrivals: 1,
      status: "in-progress",
      type: "client-call",
      participants: [
        { name: "Sarah Wilson", email: "sarah.wilson@company.com", status: "present" },
        { name: "Mike Johnson", email: "mike.johnson@company.com", status: "present" },
        { name: "Emily Davis", email: "emily.davis@company.com", status: "present" },
        { name: "Alex Brown", email: "alex.brown@company.com", status: "late" },
        { name: "Lisa Wilson", email: "lisa.wilson@company.com", status: "present" },
        { name: "David Chen", email: "david.chen@company.com", status: "present" },
        { name: "Maria Garcia", email: "maria.garcia@company.com", status: "present" },
        { name: "Robert Taylor", email: "robert.taylor@company.com", status: "absent" }
      ]
    },
    {
      id: 3,
      title: "Project Alpha Review",
      organizer: "Emily Davis",
      startTime: "2025-01-19T10:30:00",
      endTime: "2025-01-19T12:00:00",
      location: "Meeting Room 3",
      description: "Comprehensive review of Project Alpha deliverables, timeline, and resource allocation.",
      totalInvitees: 15,
      attendedCount: 12,
      attendanceRate: 80,
      lateArrivals: 3,
      status: "scheduled",
      type: "project-review",
      participants: [
        { name: "John Doe", email: "john.doe@company.com", status: "present" },
        { name: "Jane Smith", email: "jane.smith@company.com", status: "present" },
        { name: "Mike Johnson", email: "mike.johnson@company.com", status: "present" },
        { name: "Emily Davis", email: "emily.davis@company.com", status: "present" },
        { name: "Alex Brown", email: "alex.brown@company.com", status: "late" },
        { name: "Lisa Wilson", email: "lisa.wilson@company.com", status: "late" },
        { name: "David Chen", email: "david.chen@company.com", status: "present" },
        { name: "Maria Garcia", email: "maria.garcia@company.com", status: "present" },
        { name: "Robert Taylor", email: "robert.taylor@company.com", status: "late" },
        { name: "Jennifer Lee", email: "jennifer.lee@company.com", status: "present" },
        { name: "Thomas Anderson", email: "thomas.anderson@company.com", status: "present" },
        { name: "Amanda White", email: "amanda.white@company.com", status: "present" },
        { name: "Kevin Martinez", email: "kevin.martinez@company.com", status: "absent" },
        { name: "Rachel Green", email: "rachel.green@company.com", status: "absent" },
        { name: "Steven Clark", email: "steven.clark@company.com", status: "absent" }
      ]
    },
    {
      id: 4,
      title: "Security Training Session",
      organizer: "Alex Brown",
      startTime: "2025-01-20T13:00:00",
      endTime: "2025-01-20T14:30:00",
      location: "Training Room B",
      description: "Mandatory cybersecurity awareness training for all employees covering latest threats and best practices.",
      totalInvitees: 25,
      attendedCount: 23,
      attendanceRate: 92,
      lateArrivals: 4,
      status: "scheduled",
      type: "training",
      participants: Array.from({ length: 25 }, (_, i) => ({
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        status: i < 23 ? (i < 19 ? 'present' : 'late') : 'absent'
      }))
    },
    {
      id: 5,
      title: "All Hands Meeting",
      organizer: "John Doe",
      startTime: "2025-01-21T15:00:00",
      endTime: "2025-01-21T16:00:00",
      location: "Main Auditorium",
      description: "Monthly company-wide meeting to share updates, announcements, and celebrate team achievements.",
      totalInvitees: 150,
      attendedCount: 142,
      attendanceRate: 95,
      lateArrivals: 8,
      status: "scheduled",
      type: "all-hands",
      participants: Array.from({ length: 150 }, (_, i) => ({
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@company.com`,
        status: i < 142 ? (i < 134 ? 'present' : 'late') : 'absent'
      }))
    }
  ];

  useEffect(() => {
    setFilteredMeetings(mockMeetings);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...mockMeetings];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(query) ||
        meeting.organizer.toLowerCase().includes(query) ||
        meeting.location.toLowerCase().includes(query)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(meeting => {
        const meetingDate = new Date(meeting.startTime);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && meetingDate < startDate) return false;
        if (endDate && meetingDate > endDate) return false;
        return true;
      });
    }

    // Apply other filters
    if (filters.organizer) {
      filtered = filtered.filter(meeting => meeting.organizer === filters.organizer);
    }

    if (filters.meetingType) {
      filtered = filtered.filter(meeting => meeting.type === filters.meetingType);
    }

    if (filters.status) {
      filtered = filtered.filter(meeting => meeting.status === filters.status);
    }

    if (filters.attendanceThreshold) {
      const threshold = parseInt(filters.attendanceThreshold);
      if (threshold === 0) {
        filtered = filtered.filter(meeting => meeting.attendanceRate < 25);
      } else {
        filtered = filtered.filter(meeting => meeting.attendanceRate >= threshold);
      }
    }

    setFilteredMeetings(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedMeetings = [...filteredMeetings].sort((a, b) => {
      if (key === 'startTime') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (typeof a[key] === 'number') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
      
      return direction === 'asc' 
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setFilteredMeetings(sortedMeetings);
    setSortConfig({ key, direction });
  };

  const handleMeetingClick = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetailsPanel(true);
  };

  const handleBulkAction = (action, meetingIds) => {
    console.log(`Performing ${action} on meetings:`, meetingIds);
    // Implement bulk actions here
    switch (action) {
      case 'export':
        // Export functionality
        break;
      case 'remind':
        // Send reminders functionality
        break;
      case 'edit':
        // Bulk edit functionality
        break;
      default:
        break;
    }
  };

  const handleSavePreset = (name, filters) => {
    const newPreset = { name, filters };
    setSavedPresets([...savedPresets, newPreset]);
  };

  const handleLoadPreset = (preset) => {
    // This would trigger the filters to update
    console.log('Loading preset:', preset);
  };

  const handleUpdateMeeting = (meetingId, updates) => {
    const updatedMeetings = filteredMeetings.map(meeting =>
      meeting.id === meetingId ? { ...meeting, ...updates } : meeting
    );
    setFilteredMeetings(updatedMeetings);
    
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({ ...selectedMeeting, ...updates });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Meeting Management Console
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive oversight of meeting attendance and participant management
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={activeView === 'table' ? 'default' : 'outline'}
                size="sm"
                iconName="Table"
                onClick={() => setActiveView('table')}
              >
                Table View
              </Button>
              <Button
                variant={activeView === 'analytics' ? 'default' : 'outline'}
                size="sm"
                iconName="BarChart3"
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Filters & Integration (20%) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <MeetingFilters
                onFiltersChange={handleFiltersChange}
                savedPresets={savedPresets}
                onSavePreset={handleSavePreset}
                onLoadPreset={handleLoadPreset}
              />
              <IntegrationPanel />
            </div>

            {/* Center Panel - Main Content (50% or 70% when details closed) */}
            <div className={`col-span-12 ${showDetailsPanel ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
              {activeView === 'table' ? (
                <MeetingDataTable
                  meetings={filteredMeetings}
                  selectedMeetings={selectedMeetings}
                  onMeetingSelect={setSelectedMeetings}
                  onMeetingClick={handleMeetingClick}
                  onBulkAction={handleBulkAction}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ) : (
                <AnalyticsWidgets />
              )}
            </div>

            {/* Right Panel - Meeting Details (30%) */}
            {showDetailsPanel && (
              <div className="col-span-12 lg:col-span-3">
                <MeetingDetailsPanel
                  meeting={selectedMeeting}
                  onClose={() => setShowDetailsPanel(false)}
                  onUpdateMeeting={handleUpdateMeeting}
                />
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Help */}
          <div className="fixed bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              iconName="Keyboard"
              className="bg-card shadow-enterprise"
            >
              Shortcuts
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeetingManagementConsole;