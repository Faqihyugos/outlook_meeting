import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ onFilterChange, onBulkAction, selectedMeetings, totalMeetings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [meetingType, setMeetingType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const meetingTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'team-meeting', label: 'Team Meeting' },
    { value: 'one-on-one', label: 'One-on-One' },
    { value: 'project-review', label: 'Project Review' },
    { value: 'client-call', label: 'Client Call' },
    { value: 'training', label: 'Training' },
    { value: 'all-hands', label: 'All Hands' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onFilterChange({ search: value, dateRange, meetingType, status: statusFilter });
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    onFilterChange({ search: searchQuery, dateRange: value, meetingType, status: statusFilter });
  };

  const handleMeetingTypeChange = (value) => {
    setMeetingType(value);
    onFilterChange({ search: searchQuery, dateRange, meetingType: value, status: statusFilter });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    onFilterChange({ search: searchQuery, dateRange, meetingType, status: value });
  };

  const handleBulkAttendance = (status) => {
    onBulkAction('attendance', status);
  };

  const handleExport = () => {
    onBulkAction('export', 'csv');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search meetings, organizers, locations..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-40"
            />
            
            <Select
              options={meetingTypeOptions}
              value={meetingType}
              onChange={handleMeetingTypeChange}
              className="w-40"
            />
            
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-36"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center space-x-2">
          {selectedMeetings.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedMeetings.length} of {totalMeetings} selected
              </span>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Check"
                  onClick={() => handleBulkAttendance('present')}
                >
                  Mark Present
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Clock"
                  onClick={() => handleBulkAttendance('late')}
                >
                  Mark Late
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="X"
                  onClick={() => handleBulkAttendance('absent')}
                >
                  Mark Absent
                </Button>
              </div>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-muted-foreground">Present: 12</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-muted-foreground">Late: 3</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span className="text-muted-foreground">Absent: 1</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <span className="text-muted-foreground">Pending: 8</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="RefreshCw" size={14} className="animate-spin" />
          <span>Last synced: 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;