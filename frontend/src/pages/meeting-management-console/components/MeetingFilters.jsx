import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const MeetingFilters = ({ onFiltersChange, savedPresets, onSavePreset, onLoadPreset }) => {
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    attendanceThreshold: '',
    organizer: '',
    meetingType: '',
    status: '',
    searchQuery: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const organizerOptions = [
    { value: '', label: 'All Organizers' },
    { value: 'john.doe@company.com', label: 'John Doe' },
    { value: 'sarah.wilson@company.com', label: 'Sarah Wilson' },
    { value: 'mike.johnson@company.com', label: 'Mike Johnson' },
    { value: 'emily.davis@company.com', label: 'Emily Davis' },
    { value: 'alex.brown@company.com', label: 'Alex Brown' }
  ];

  const meetingTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'team-meeting', label: 'Team Meeting' },
    { value: 'project-review', label: 'Project Review' },
    { value: 'client-call', label: 'Client Call' },
    { value: 'training', label: 'Training Session' },
    { value: 'all-hands', label: 'All Hands' },
    { value: 'one-on-one', label: 'One-on-One' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const attendanceThresholdOptions = [
    { value: '', label: 'Any Attendance' },
    { value: '90', label: '90% or higher' },
    { value: '75', label: '75% or higher' },
    { value: '50', label: '50% or higher' },
    { value: '25', label: '25% or higher' },
    { value: '0', label: 'Below 25%' }
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: value
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      attendanceThreshold: '',
      organizer: '',
      meetingType: '',
      status: '',
      searchQuery: ''
    });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, filters);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.attendanceThreshold) count++;
    if (filters.organizer) count++;
    if (filters.meetingType) count++;
    if (filters.status) count++;
    if (filters.searchQuery) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Meeting Filters
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Less' : 'More'}
        </Button>
      </div>

      {/* Search */}
      <Input
        type="search"
        placeholder="Search meetings by title, organizer, or location..."
        value={filters.searchQuery}
        onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        className="w-full"
      />

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <div className="flex space-x-2">
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              placeholder="Start date"
            />
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              placeholder="End date"
            />
          </div>
        </div>

        <Select
          label="Meeting Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Organizer"
              options={organizerOptions}
              value={filters.organizer}
              onChange={(value) => handleFilterChange('organizer', value)}
              searchable
            />

            <Select
              label="Meeting Type"
              options={meetingTypeOptions}
              value={filters.meetingType}
              onChange={(value) => handleFilterChange('meetingType', value)}
            />

            <Select
              label="Attendance Rate"
              options={attendanceThresholdOptions}
              value={filters.attendanceThreshold}
              onChange={(value) => handleFilterChange('attendanceThreshold', value)}
            />
          </div>

          {/* Saved Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Filter Presets</label>
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                onClick={() => setShowSavePreset(!showSavePreset)}
              >
                Save Current
              </Button>
            </div>

            {showSavePreset && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                >
                  Save
                </Button>
              </div>
            )}

            {savedPresets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadPreset(preset)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={clearAllFilters}
          disabled={getActiveFiltersCount() === 0}
        >
          Clear All
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} applied
        </div>
      </div>
    </div>
  );
};

export default MeetingFilters;