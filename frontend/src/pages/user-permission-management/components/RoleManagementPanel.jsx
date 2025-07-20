import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const RoleManagementPanel = ({ onCreateRole, onUpdateRole }) => {
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      userCount: 5,
      permissions: ['user_management', 'meeting_management', 'analytics', 'system_settings', 'audit_logs'],
      color: 'error'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Department-level management with reporting access',
      userCount: 23,
      permissions: ['meeting_management', 'analytics', 'team_oversight'],
      color: 'warning'
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Standard user with meeting attendance capabilities',
      userCount: 456,
      permissions: ['meeting_attendance', 'profile_management'],
      color: 'success'
    },
    {
      id: 'guest',
      name: 'Guest',
      description: 'Limited access for external meeting participants',
      userCount: 12,
      permissions: ['meeting_attendance'],
      color: 'muted'
    }
  ];

  const availablePermissions = [
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and manage user accounts' },
    { id: 'meeting_management', name: 'Meeting Management', description: 'Manage meetings and attendance settings' },
    { id: 'analytics', name: 'Analytics Access', description: 'View reports and analytics dashboards' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system-wide settings' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'Access system audit and activity logs' },
    { id: 'team_oversight', name: 'Team Oversight', description: 'Manage team members and permissions' },
    { id: 'meeting_attendance', name: 'Meeting Attendance', description: 'Mark attendance for meetings' },
    { id: 'profile_management', name: 'Profile Management', description: 'Manage personal profile settings' }
  ];

  const handleCreateRole = () => {
    if (newRole.name && newRole.permissions.length > 0) {
      onCreateRole(newRole);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowCreateRole(false);
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getRoleColor = (color) => {
    switch (color) {
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Role Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <Button
          variant="default"
          iconName="Plus"
          onClick={() => setShowCreateRole(true)}
        >
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`border rounded-lg p-4 ${getRoleColor(role.color)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{role.name}</h4>
              <span className="text-xs px-2 py-1 bg-background/50 rounded">
                {role.userCount} users
              </span>
            </div>
            
            <p className="text-sm opacity-80 mb-3">
              {role.description}
            </p>
            
            <div className="space-y-1">
              <span className="text-xs font-medium opacity-70">Permissions:</span>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="text-xs px-2 py-1 bg-background/30 rounded"
                  >
                    {availablePermissions.find(p => p.id === permission)?.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={() => onUpdateRole(role)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Users"
              >
                View Users
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-enterprise-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">
                Create New Role
              </h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowCreateRole(false)}
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Role Name"
                placeholder="Enter role name"
                value={newRole.name}
                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <Input
                label="Description"
                placeholder="Enter role description"
                value={newRole.description}
                onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Permissions
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <Checkbox
                        checked={newRole.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">
                          {permission.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {permission.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="default"
                onClick={handleCreateRole}
                disabled={!newRole.name || newRole.permissions.length === 0}
                className="flex-1"
              >
                Create Role
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateRole(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementPanel;