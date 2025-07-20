import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserDetailPanel = ({ user, onClose, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editedUser, setEditedUser] = useState(user);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'attendance', label: 'Attendance', icon: 'Calendar' },
    { id: 'audit', label: 'Audit Trail', icon: 'FileText' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'guest', label: 'Guest' }
  ];

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const permissions = [
    { id: 'meeting_attendance', name: 'Meeting Attendance', granted: true },
    { id: 'profile_management', name: 'Profile Management', granted: true },
    { id: 'team_oversight', name: 'Team Oversight', granted: false },
    { id: 'analytics', name: 'Analytics Access', granted: false },
    { id: 'user_management', name: 'User Management', granted: false }
  ];

  const attendanceHistory = [
    { date: '2025-01-17', meetings: 4, attended: 3, late: 1, absent: 0 },
    { date: '2025-01-16', meetings: 3, attended: 3, late: 0, absent: 0 },
    { date: '2025-01-15', meetings: 5, attended: 4, late: 0, absent: 1 },
    { date: '2025-01-14', meetings: 2, attended: 2, late: 0, absent: 0 },
    { date: '2025-01-13', meetings: 3, attended: 2, late: 1, absent: 0 }
  ];

  const auditTrail = [
    {
      timestamp: '2025-01-18T03:45:00Z',
      action: 'Role Updated',
      details: 'Role changed from Employee to Manager',
      performedBy: 'admin@company.com'
    },
    {
      timestamp: '2025-01-17T14:30:00Z',
      action: 'Profile Updated',
      details: 'Department changed to Engineering',
      performedBy: 'hr@company.com'
    },
    {
      timestamp: '2025-01-16T09:15:00Z',
      action: 'Permission Granted',
      details: 'Analytics access granted',
      performedBy: 'admin@company.com'
    },
    {
      timestamp: '2025-01-15T11:20:00Z',
      action: 'Login',
      details: 'Successful login from 192.168.1.100',
      performedBy: user.email
    }
  ];

  const handleSave = () => {
    onSave(editedUser);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const ProfileTab = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="User" size={32} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
            user.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}>
            {user.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={editMode ? editedUser.name : user.name}
          onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
          disabled={!editMode}
        />
        
        <Input
          label="Email Address"
          type="email"
          value={editMode ? editedUser.email : user.email}
          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
          disabled={!editMode}
        />
        
        <Input
          label="Employee ID"
          value={editMode ? editedUser.employeeId : user.employeeId}
          onChange={(e) => setEditedUser(prev => ({ ...prev, employeeId: e.target.value }))}
          disabled={!editMode}
        />
        
        <Select
          label="Department"
          options={departmentOptions}
          value={editMode ? editedUser.department : user.department}
          onChange={(value) => setEditedUser(prev => ({ ...prev, department: value }))}
          disabled={!editMode}
        />
        
        <Select
          label="Role"
          options={roleOptions}
          value={editMode ? editedUser.role : user.role}
          onChange={(value) => setEditedUser(prev => ({ ...prev, role: value }))}
          disabled={!editMode}
        />
        
        <Input
          label="Manager"
          value={editMode ? editedUser.manager : user.manager}
          onChange={(e) => setEditedUser(prev => ({ ...prev, manager: e.target.value }))}
          disabled={!editMode}
        />
        
        <Input
          label="Location"
          value={editMode ? editedUser.location : user.location}
          onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
          disabled={!editMode}
        />
        
        <Input
          label="Join Date"
          type="date"
          value={editMode ? editedUser.joinDate : user.joinDate}
          onChange={(e) => setEditedUser(prev => ({ ...prev, joinDate: e.target.value }))}
          disabled={!editMode}
        />
      </div>
    </div>
  );

  const PermissionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground">User Permissions</h4>
        <span className="text-sm text-muted-foreground">
          Role: {user.role}
        </span>
      </div>
      
      <div className="space-y-3">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">{permission.name}</div>
              <div className="text-sm text-muted-foreground">
                {permission.granted ? 'Access granted' : 'Access denied'}
              </div>
            </div>
            <Checkbox
              checked={permission.granted}
              disabled={!editMode}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const AttendanceTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <div className="text-2xl font-bold text-success">87%</div>
          <div className="text-sm text-muted-foreground">Attendance Rate</div>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <div className="text-2xl font-bold text-warning">3</div>
          <div className="text-sm text-muted-foreground">Late Arrivals</div>
        </div>
        <div className="text-center p-3 bg-error/10 rounded-lg">
          <div className="text-2xl font-bold text-error">2</div>
          <div className="text-sm text-muted-foreground">Absences</div>
        </div>
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">17</div>
          <div className="text-sm text-muted-foreground">Total Meetings</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-foreground">Recent Attendance</h4>
        {attendanceHistory.map((day) => (
          <div key={day.date} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="font-medium text-foreground">{day.date}</div>
            <div className="flex space-x-4 text-sm">
              <span className="text-success">{day.attended} attended</span>
              <span className="text-warning">{day.late} late</span>
              <span className="text-error">{day.absent} absent</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AuditTab = () => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Activity Log</h4>
      <div className="space-y-3">
        {auditTrail.map((entry, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Activity" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground">{entry.action}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{entry.details}</p>
              <span className="text-xs text-muted-foreground">by {entry.performedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-enterprise-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-medium text-foreground">User Details</h2>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <Button variant="default" size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'permissions' && <PermissionsTab />}
          {activeTab === 'attendance' && <AttendanceTab />}
          {activeTab === 'audit' && <AuditTab />}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPanel;