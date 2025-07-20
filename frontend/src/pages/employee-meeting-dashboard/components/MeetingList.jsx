import React, { useState, useEffect } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import MeetingCard from './MeetingCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MeetingList = ({ 
  meetings, 
  onAttendanceUpdate, 
  onSelectMeeting, 
  selectedMeeting,
  onBulkSelect,
  selectedMeetings,
  filters 
}) => {
  const [sortBy, setSortBy] = useState('time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('card'); // card, list, compact
  const [selectedMeetingIds, setSelectedMeetingIds] = useState([]);

  useEffect(() => {
    onBulkSelect(selectedMeetingIds);
  }, [selectedMeetingIds, onBulkSelect]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMeetingIds(meetings.map(m => m.id));
    } else {
      setSelectedMeetingIds([]);
    }
  };

  const handleSelectMeeting = (meetingId, checked) => {
    if (checked) {
      setSelectedMeetingIds(prev => [...prev, meetingId]);
    } else {
      setSelectedMeetingIds(prev => prev.filter(id => id !== meetingId));
    }
  };

  const sortedMeetings = [...meetings].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'time':
        aValue = new Date(a.startTime);
        bValue = new Date(b.startTime);
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'organizer':
        aValue = a.organizer.toLowerCase();
        bValue = b.organizer.toLowerCase();
        break;
      case 'status':
        aValue = a.attendanceStatus || 'pending';
        bValue = b.attendanceStatus || 'pending';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  if (meetings.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Calendar" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No meetings found
        </h3>
        <p className="text-muted-foreground mb-4">
          {filters.search 
            ? `No meetings match your search criteria "${filters.search}"`
            : "You don't have any meetings scheduled for the selected time period."
          }
        </p>
        <Button
          variant="outline"
          iconName="RefreshCw"
          onClick={() => window.location.reload()}
        >
          Refresh Calendar
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* List Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedMeetingIds.length === meetings.length}
            indeterminate={selectedMeetingIds.length > 0 && selectedMeetingIds.length < meetings.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span className="text-sm font-medium text-foreground">
            {meetings.length} meetings
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort Options */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName={getSortIcon('time')}
              onClick={() => handleSort('time')}
              className={sortBy === 'time' ? 'bg-primary/10 text-primary' : ''}
            >
              Time
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName={getSortIcon('title')}
              onClick={() => handleSort('title')}
              className={sortBy === 'title' ? 'bg-primary/10 text-primary' : ''}
            >
              Title
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName={getSortIcon('status')}
              onClick={() => handleSort('status')}
              className={sortBy === 'status' ? 'bg-primary/10 text-primary' : ''}
            >
              Status
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              iconName="LayoutGrid"
              onClick={() => setViewMode('card')}
              className="rounded-r-none"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              iconName="List"
              onClick={() => setViewMode('list')}
              className="rounded-none border-x-0"
            />
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              iconName="Rows"
              onClick={() => setViewMode('compact')}
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>

      {/* Meeting List */}
      <div className={`
        ${viewMode === 'card' ? 'p-4 space-y-4' : ''}
        ${viewMode === 'list' ? 'divide-y divide-border' : ''}
        ${viewMode === 'compact' ? 'divide-y divide-border' : ''}
      `}>
        {sortedMeetings.map((meeting) => (
          <div key={meeting.id} className={`
            ${viewMode === 'card' ? '' : 'p-4'}
            ${viewMode === 'compact' ? 'py-2' : ''}
          `}>
            {viewMode === 'card' ? (
              <div className="flex items-start space-x-3">
                <div className="pt-1">
                  <Checkbox
                    checked={selectedMeetingIds.includes(meeting.id)}
                    onChange={(e) => handleSelectMeeting(meeting.id, e.target.checked)}
                  />
                </div>
                <div className="flex-1">
                  <MeetingCard
                    meeting={meeting}
                    onAttendanceUpdate={onAttendanceUpdate}
                    onSelectMeeting={onSelectMeeting}
                    isSelected={selectedMeeting?.id === meeting.id}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedMeetingIds.includes(meeting.id)}
                  onChange={(e) => handleSelectMeeting(meeting.id, e.target.checked)}
                />
                
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4">
                    <h4 className="font-medium text-foreground truncate">
                      {meeting.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {meeting.organizer}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-foreground">
                      {new Date(meeting.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  <div className="col-span-3">
                    <p className="text-sm text-muted-foreground truncate">
                      {meeting.location}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      meeting.attendanceStatus === 'present' ? 'text-success bg-success/10' :
                      meeting.attendanceStatus === 'absent' ? 'text-error bg-error/10' :
                      meeting.attendanceStatus === 'late'? 'text-warning bg-warning/10' : 'text-muted-foreground bg-muted'
                    }`}>
                      {meeting.attendanceStatus || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ChevronRight"
                      onClick={() => onSelectMeeting(meeting)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingList;