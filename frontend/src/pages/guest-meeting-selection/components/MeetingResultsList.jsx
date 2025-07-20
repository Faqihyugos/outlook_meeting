import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MeetingResultsList = ({ meetings, onMeetingSelect, selectedMeetingId }) => {
  const [expandedMeeting, setExpandedMeeting] = useState(null);

  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'all-hands':
        return 'Users';
      case 'department':
        return 'Building';
      case 'project':
        return 'Briefcase';
      default:
        return 'Calendar';
    }
  };

  const getMeetingTypeLabel = (type) => {
    switch (type) {
      case 'all-hands':
        return 'All-Hands';
      case 'department':
        return 'Department';
      case 'project':
        return 'Project';
      default:
        return 'Meeting';
    }
  };

  const getMeetingStatusBadge = (meeting) => {
    if (!meeting.isValid) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          Invalid
        </span>
      );
    }
    
    if (meeting.requiresApproval) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
          <Icon name="Shield" size={12} className="mr-1" />
          Approval Required
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
        <Icon name="CheckCircle" size={12} className="mr-1" />
        Open Access
      </span>
    );
  };

  const handleMeetingToggle = (meetingId) => {
    setExpandedMeeting(expandedMeeting === meetingId ? null : meetingId);
  };

  const handleSelectMeeting = (meeting) => {
    onMeetingSelect(meeting);
  };

  if (!meetings || meetings.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-enterprise border border-border p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No Meetings Found
        </h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search criteria or date range to find available meetings.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>• Check if the meeting date is correct</p>
          <p>• Try searching with different keywords</p>
          <p>• Contact the meeting organizer if you believe this is an error</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-enterprise border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">
                Available Meetings
              </h2>
              <p className="text-sm text-muted-foreground">
                Found {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} for your search
              </p>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <Icon name="Clock" size={16} className="inline mr-1" />
            Updated just now
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={getMeetingTypeIcon(meeting.type)} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-heading font-semibold text-foreground truncate">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Icon name="Clock" size={14} className="mr-1" />
                        {meeting.time}
                      </span>
                      <span className="flex items-center">
                        <Icon name="User" size={14} className="mr-1" />
                        {meeting.organizer}
                      </span>
                      <span className="flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1" />
                        {meeting.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {getMeetingTypeLabel(meeting.type)}
                  </span>
                  {getMeetingStatusBadge(meeting)}
                  <span className="text-xs text-muted-foreground">
                    {meeting.participantCount} participants
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedMeeting === meeting.id && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-md space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Agenda</h4>
                      <p className="text-sm text-muted-foreground">{meeting.agenda}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Dial-in Information</h4>
                      <p className="text-sm text-muted-foreground font-mono">{meeting.dialIn}</p>
                    </div>
                    
                    {meeting.requiresApproval && (
                      <div className="p-3 bg-warning/10 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Icon name="Shield" size={16} className="text-warning" />
                          <span className="text-sm font-medium text-warning">Approval Required</span>
                        </div>
                        <p className="text-xs text-warning/80 mt-1">
                          Your attendance request will be sent to the organizer for approval.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  iconName={expandedMeeting === meeting.id ? "ChevronUp" : "ChevronDown"}
                  iconPosition="right"
                  onClick={() => handleMeetingToggle(meeting.id)}
                >
                  {expandedMeeting === meeting.id ? 'Less' : 'Details'}
                </Button>
                
                <Button
                  variant={selectedMeetingId === meeting.id ? "default" : "outline"}
                  size="sm"
                  iconName={selectedMeetingId === meeting.id ? "Check" : "UserPlus"}
                  iconPosition="left"
                  onClick={() => handleSelectMeeting(meeting)}
                  disabled={!meeting.isValid}
                >
                  {selectedMeetingId === meeting.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Selection Footer */}
      {meetings.length > 1 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Icon name="Info" size={14} className="inline mr-1" />
              Attending multiple consecutive meetings? Select each one individually.
            </div>
            <Button variant="ghost" size="sm" iconName="HelpCircle">
              Help
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingResultsList;