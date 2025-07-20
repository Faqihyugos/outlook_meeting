import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFilterChange, onSaveFilter, savedFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    role: '',
    status: '',
    lastLogin: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'guest', label: 'Guest' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const lastLoginOptions = [
    { value: '', label: 'Any Time' },
    { value: '1day', label: 'Last 24 hours' },
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      department: '',
      role: '',
      status: '',
      lastLogin: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const handleSaveFilter = () => {
    const filterName = prompt('Enter filter name:');
    if (filterName) {
      onSaveFilter(filterName, filters);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-foreground">Filters</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Save"
            onClick={handleSaveFilter}
          >
            Save Filter
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName={showAdvanced ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            Advanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="col-span-full md:col-span-2"
        />

        <Select
          placeholder="Department"
          options={departmentOptions}
          value={filters.department}
          onChange={(value) => handleFilterChange('department', value)}
        />

        <Select
          placeholder="Role"
          options={roleOptions}
          value={filters.role}
          onChange={(value) => handleFilterChange('role', value)}
        />
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <Select
            placeholder="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          />

          <Select
            placeholder="Last Login"
            options={lastLoginOptions}
            value={filters.lastLogin}
            onChange={(value) => handleFilterChange('lastLogin', value)}
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {savedFilters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-2">Saved Filters</h4>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters(filter.filters);
                  onFilterChange(filter.filters);
                }}
                className="text-xs"
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;