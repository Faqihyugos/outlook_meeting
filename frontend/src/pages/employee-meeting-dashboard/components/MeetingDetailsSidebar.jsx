import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const MeetingDetailsSidebar = ({ meeting, onClose, onAttendanceUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!meeting) return null;

  const handleAttendanceUpdate = async (status) => {
    setIsUpdating(true);
    await onAttendanceUpdate(meeting.id, status);
    setIsUpdating(false);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    };
  };

  const startDateTime = formatDateTime(meeting.startTime);
  const endDateTime = formatDateTime(meeting.endTime);

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'participants', label: 'Participants', icon: 'Users' },
    { id: 'agenda', label: 'Agenda', icon: 'FileText' },
    { id: 'attachments', label: 'Files', icon: 'Paperclip' }
  ];

  const mockParticipants = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Organizer",
      status: "present",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Required",
      status: "late",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Optional",
      status: "present",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      role: "Required",
      status: "absent",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    }
  ];

  const mockAgenda = [
    {
      id: 1,
      title: "Project Status Review",
      duration: "15 min",
      presenter: "Sarah Johnson",
      completed: true
    },
    {
      id: 2,
      title: "Q3 Budget Discussion",
      duration: "20 min",
      presenter: "Michael Chen",
      completed: false
    },
    {
      id: 3,
      title: "Next Steps & Action Items",
      duration: "10 min",
      presenter: "Emily Rodriguez",
      completed: false
    }
  ];

  const mockAttachments = [
    {
      id: 1,
      name: "Q3_Budget_Report.pdf",
      size: "2.4 MB",
      type: "pdf",
      uploadedBy: "Sarah Johnson",
      uploadedAt: "2025-01-17T10:30:00Z"
    },
    {
      id: 2,
      name: "Project_Timeline.xlsx",
      size: "1.8 MB",
      type: "excel",
      uploadedBy: "Michael Chen",
      uploadedAt: "2025-01-17T09:15:00Z"
    },
    {
      id: 3,
      name: "Meeting_Presentation.pptx",
      size: "5.2 MB",
      type: "powerpoint",
      uploadedBy: "Emily Rodriguez",
      uploadedAt: "2025-01-17T08:45:00Z"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-success bg-success/10';
      case 'absent':
        return 'text-error bg-error/10';
      case 'late':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'excel':
        return 'FileSpreadsheet';
      case 'powerpoint':
        return 'Presentation';
      default:
        return 'File';
    }
  };

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border shadow-enterprise-lg z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-heading font-semibold text-foreground">
            Meeting Details
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Meeting Title & Time */}
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-foreground mb-2">
            {meeting.title}
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={14} />
              <span>{startDateTime.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} />
              <span>{startDateTime.time} - {endDateTime.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={14} />
              <span>{meeting.location}</span>
            </div>
          </div>

          {/* Attendance Actions */}
          <div className="flex items-center space-x-2 mt-4">
            <Button
              variant={meeting.attendanceStatus === 'present' ? 'default' : 'outline'}
              size="sm"
              iconName="Check"
              onClick={() => handleAttendanceUpdate('present')}
              disabled={isUpdating}
              className="flex-1"
            >
              Present
            </Button>
            <Button
              variant={meeting.attendanceStatus === 'late' ? 'warning' : 'outline'}
              size="sm"
              iconName="Clock"
              onClick={() => handleAttendanceUpdate('late')}
              disabled={isUpdating}
              className="flex-1"
            >
              Late
            </Button>
            <Button
              variant={meeting.attendanceStatus === 'absent' ? 'destructive' : 'outline'}
              size="sm"
              iconName="X"
              onClick={() => handleAttendanceUpdate('absent')}
              disabled={isUpdating}
              className="flex-1"
            >
              Absent
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {meeting.description || "Weekly team sync to discuss project progress, blockers, and upcoming milestones. Please come prepared with your status updates and any questions."}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Organizer</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{meeting.organizer}</p>
                    <p className="text-xs text-muted-foreground">sarah.johnson@company.com</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Meeting Type</h4>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent">
                  {meeting.type || 'Team Meeting'}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Recurring</h4>
                <p className="text-sm text-muted-foreground">
                  {meeting.isRecurring ? 'Weekly on Fridays' : 'One-time meeting'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="space-y-3">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {participant.name}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(participant.status)}`}>
                        {participant.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {participant.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {participant.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-3">
              {mockAgenda.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      item.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.completed ? <Icon name="Check" size={12} /> : index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-foreground">
                        {item.title}
                      </h5>
                      <span className="text-xs text-muted-foreground">
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Presenter: {item.presenter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-3">
              {mockAttachments.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name={getFileIcon(file.type)} size={16} className="text-accent" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.size} • Uploaded by {file.uploadedBy}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsSidebar;