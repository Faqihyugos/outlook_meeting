import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onFiltersChange, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    department: 'all',
    meetingType: 'all',
    employeeRole: 'all',
    customStartDate: '',
    customEndDate: ''
  });

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const meetingTypeOptions = [
    { value: 'all', label: 'All Meeting Types' },
    { value: 'standup', label: 'Daily Standups' },
    { value: 'review', label: 'Review Meetings' },
    { value: 'planning', label: 'Planning Sessions' },
    { value: 'training', label: 'Training Sessions' },
    { value: 'allhands', label: 'All Hands' },
    { value: 'oneOnOne', label: 'One-on-One' }
  ];

  const employeeRoleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'manager', label: 'Managers' },
    { value: 'senior', label: 'Senior Staff' },
    { value: 'mid', label: 'Mid-level' },
    { value: 'junior', label: 'Junior Staff' },
    { value: 'intern', label: 'Interns' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: 'last30days',
      department: 'all',
      meetingType: 'all',
      employeeRole: 'all',
      customStartDate: '',
      customEndDate: ''
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { value: 'excel', label: 'Export as Excel', icon: 'FileSpreadsheet' },
    { value: 'csv', label: 'Export as CSV', icon: 'Download' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-elevation mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Analytics Filters</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Quick Filters - Always Visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Department</label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {departmentOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Meeting Type</label>
          <select
            value={filters.meetingType}
            onChange={(e) => handleFilterChange('meetingType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {meetingTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Employee Role</label>
          <select
            value={filters.employeeRole}
            onChange={(e) => handleFilterChange('employeeRole', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {employeeRoleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Advanced Filters</h3>
          
          {filters.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="date"
                label="Start Date"
                value={filters.customStartDate}
                onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={filters.customEndDate}
                onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" size="sm" iconName="Clock">
              Meeting Duration
            </Button>
            <Button variant="outline" size="sm" iconName="MapPin">
              Location
            </Button>
            <Button variant="outline" size="sm" iconName="Users">
              Team Size
            </Button>
            <Button variant="outline" size="sm" iconName="Repeat">
              Recurring Only
            </Button>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Export Reports</span>
          </div>
          <div className="flex space-x-2">
            {exportOptions.map(option => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                iconName={option.icon}
                onClick={() => onExport(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;