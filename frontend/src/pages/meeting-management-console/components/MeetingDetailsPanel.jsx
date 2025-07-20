import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const MeetingDetailsPanel = ({ meeting, onClose, onUpdateMeeting }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState({
    title: meeting?.title || '',
    location: meeting?.location || '',
    description: meeting?.description || ''
  });

  if (!meeting) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Meeting Selected</h3>
          <p className="text-muted-foreground">
            Select a meeting from the list to view details and manage participants.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'participants', label: 'Participants', icon: 'Users' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const handleSave = () => {
    onUpdateMeeting(meeting.id, editValues);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditValues({
      title: meeting.title,
      location: meeting.location,
      description: meeting.description
    });
    setEditMode(false);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Meeting Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Meeting Information</h4>
          {!editMode ? (
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                iconName="Check"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {editMode ? (
          <div className="space-y-4">
            <Input
              label="Meeting Title"
              value={editValues.title}
              onChange={(e) => setEditValues({...editValues, title: e.target.value})}
            />
            <Input
              label="Location"
              value={editValues.location}
              onChange={(e) => setEditValues({...editValues, location: e.target.value})}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={editValues.description}
                onChange={(e) => setEditValues({...editValues, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Title</label>
              <p className="text-sm font-medium text-foreground">{meeting.title}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Organizer</label>
              <p className="text-sm text-foreground">{meeting.organizer}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Date & Time</label>
              <p className="text-sm text-foreground">{formatDateTime(meeting.startTime)}</p>
              <p className="text-xs text-muted-foreground">
                Duration: {Math.round((new Date(meeting.endTime) - new Date(meeting.startTime)) / (1000 * 60))} minutes
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Location</label>
              <p className="text-sm text-foreground">{meeting.location}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide">Description</label>
              <p className="text-sm text-foreground">{meeting.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-primary">{meeting.attendanceRate}%</div>
          <div className="text-xs text-muted-foreground">Attendance Rate</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-foreground">{meeting.lateArrivals}</div>
          <div className="text-xs text-muted-foreground">Late Arrivals</div>
        </div>
      </div>
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Participants ({meeting.participants?.length || 0})
        </h4>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="UserPlus"
          >
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Bell"
          >
            Remind All
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {meeting.participants?.map((participant, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{participant.name}</div>
                <div className="text-xs text-muted-foreground">{participant.email}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(participant.status)}`}>
                {participant.status}
              </span>
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h4 className="text-sm font-medium text-foreground">Meeting Analytics</h4>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">On Time Arrivals</span>
            <span className="text-sm font-medium text-foreground">
              {meeting.attendedCount - meeting.lateArrivals}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${((meeting.attendedCount - meeting.lateArrivals) / meeting.totalInvitees) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Late Arrivals</span>
            <span className="text-sm font-medium text-foreground">{meeting.lateArrivals}</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${(meeting.lateArrivals / meeting.totalInvitees) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Absent</span>
            <span className="text-sm font-medium text-foreground">
              {meeting.totalInvitees - meeting.attendedCount}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${((meeting.totalInvitees - meeting.attendedCount) / meeting.totalInvitees) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <h5 className="text-sm font-medium text-foreground mb-3">Meeting Insights</h5>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Average arrival time: 2 minutes after start</p>
          <p>• Most common late reason: Traffic/Transport</p>
          <p>• Attendance trend: +5% vs last month</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Meeting Details
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClose}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'participants' && renderParticipantsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default MeetingDetailsPanel;