import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const MeetingDataTable = ({ 
  meetings, 
  selectedMeetings, 
  onMeetingSelect, 
  onMeetingClick, 
  onBulkAction,
  sortConfig,
  onSort 
}) => {
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleSelectAll = (checked) => {
    if (checked) {
      onMeetingSelect(meetings.map(m => m.id));
    } else {
      onMeetingSelect([]);
    }
  };

  const handleMeetingSelect = (meetingId, checked) => {
    if (checked) {
      onMeetingSelect([...selectedMeetings, meetingId]);
    } else {
      onMeetingSelect(selectedMeetings.filter(id => id !== meetingId));
    }
  };

  const startEditing = (meeting) => {
    setEditingMeeting(meeting.id);
    setEditValues({
      title: meeting.title,
      location: meeting.location
    });
  };

  const saveEdit = () => {
    // Auto-save functionality would be implemented here
    console.log('Saving edit:', editValues);
    setEditingMeeting(null);
    setEditValues({});
  };

  const cancelEdit = () => {
    setEditingMeeting(null);
    setEditValues({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-blue-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const isAllSelected = selectedMeetings.length === meetings.length && meetings.length > 0;
  const isIndeterminate = selectedMeetings.length > 0 && selectedMeetings.length < meetings.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedMeetings.length > 0 && (
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">
                {selectedMeetings.length} meeting{selectedMeetings.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => onBulkAction('export', selectedMeetings)}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Bell"
                onClick={() => onBulkAction('remind', selectedMeetings)}
              >
                Send Reminders
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => onBulkAction('edit', selectedMeetings)}
              >
                Bulk Edit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('title')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Meeting Title</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('startTime')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Date & Time</span>
                  {getSortIcon('startTime')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => onSort('organizer')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Organizer</span>
                  {getSortIcon('organizer')}
                </button>
              </th>
              <th className="text-center p-4">
                <button
                  onClick={() => onSort('totalInvitees')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Invitees</span>
                  {getSortIcon('totalInvitees')}
                </button>
              </th>
              <th className="text-center p-4">
                <button
                  onClick={() => onSort('attendanceRate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Attendance</span>
                  {getSortIcon('attendanceRate')}
                </button>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-foreground">Late Arrivals</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {meetings.map((meeting) => (
              <tr
                key={meeting.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onMeetingClick(meeting)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedMeetings.includes(meeting.id)}
                    onChange={(e) => handleMeetingSelect(meeting.id, e.target.checked)}
                  />
                </td>
                <td className="p-4">
                  {editingMeeting === meeting.id ? (
                    <input
                      type="text"
                      value={editValues.title}
                      onChange={(e) => setEditValues({...editValues, title: e.target.value})}
                      className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-foreground">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground">{meeting.location}</div>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{formatDate(meeting.startTime)}</div>
                    <div className="text-muted-foreground">
                      {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-medium">
                        {meeting.organizer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{meeting.organizer}</span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm font-medium text-foreground">{meeting.totalInvitees}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-medium ${getAttendanceColor(meeting.attendanceRate)}`}>
                      {meeting.attendanceRate}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {meeting.attendedCount}/{meeting.totalInvitees}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-sm text-foreground">{meeting.lateArrivals}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  {editingMeeting === meeting.id ? (
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Check"
                        onClick={saveEdit}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={cancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => startEditing(meeting)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreHorizontal"
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meetings.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No meetings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria to find meetings.
          </p>
        </div>
      )}
    </div>
  );
};

export default MeetingDataTable;