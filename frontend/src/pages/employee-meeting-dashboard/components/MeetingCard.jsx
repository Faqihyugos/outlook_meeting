import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MeetingCard = ({ meeting, onAttendanceUpdate, onSelectMeeting, isSelected }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAttendanceClick = async (status) => {
    setIsUpdating(true);
    await onAttendanceUpdate(meeting.id, status);
    setIsUpdating(false);
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return 'CheckCircle';
      case 'absent':
        return 'XCircle';
      case 'late':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const formatTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  };

  const isUpcoming = new Date(meeting.startTime) > new Date();
  const isOngoing = new Date(meeting.startTime) <= new Date() && new Date(meeting.endTime) >= new Date();

  return (
    <div 
      className={`
        bg-card border border-border rounded-lg p-4 hover:shadow-enterprise-hover transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-primary border-primary' : ''}
        ${isOngoing ? 'border-l-4 border-l-primary' : ''}
      `}
      onClick={() => onSelectMeeting(meeting)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate mb-1">
            {meeting.title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{formatTime(meeting.startTime, meeting.endTime)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span className="truncate">{meeting.location}</span>
            </div>
          </div>
        </div>
        
        {isOngoing && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icon name="User" size={14} />
            <span>{meeting.organizer}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{meeting.attendeeCount} attendees</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(meeting.attendanceStatus)}`}>
            <Icon name={getStatusIcon(meeting.attendanceStatus)} size={12} />
            <span className="capitalize">{meeting.attendanceStatus || 'Pending'}</span>
          </div>

          {!isUpcoming && (
            <div className="flex items-center space-x-1">
              <Button
                variant={meeting.attendanceStatus === 'present' ? 'default' : 'outline'}
                size="xs"
                iconName="Check"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAttendanceClick('present');
                }}
                disabled={isUpdating}
                className="h-7 px-2"
              >
                Present
              </Button>
              <Button
                variant={meeting.attendanceStatus === 'late' ? 'warning' : 'outline'}
                size="xs"
                iconName="Clock"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAttendanceClick('late');
                }}
                disabled={isUpdating}
                className="h-7 px-2"
              >
                Late
              </Button>
              <Button
                variant={meeting.attendanceStatus === 'absent' ? 'destructive' : 'outline'}
                size="xs"
                iconName="X"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAttendanceClick('absent');
                }}
                disabled={isUpdating}
                className="h-7 px-2"
              >
                Absent
              </Button>
            </div>
          )}
        </div>
      </div>

      {meeting.hasConflict && (
        <div className="mt-2 flex items-center space-x-1 text-xs text-warning">
          <Icon name="AlertTriangle" size={12} />
          <span>Calendar conflict detected</span>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;