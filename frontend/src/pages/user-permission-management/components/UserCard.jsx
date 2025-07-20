import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const UserCard = ({ user, onEdit, onToggleStatus, onBulkSelect, isSelected }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-error/10 text-error';
      case 'manager':
        return 'bg-warning/10 text-warning';
      case 'employee':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-error text-error-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onBulkSelect(user.id, e.target.checked)}
            className="mt-1"
          />
          
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-foreground truncate">
                {user.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground truncate mb-1">
              {user.email}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{user.department}</span>
              <span>•</span>
              <span>Last login: {user.lastLogin}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            onClick={() => setShowDetails(!showDetails)}
          />
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Employee ID:</span>
              <span className="ml-2 text-foreground">{user.employeeId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Join Date:</span>
              <span className="ml-2 text-foreground">{user.joinDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Manager:</span>
              <span className="ml-2 text-foreground">{user.manager}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <span className="ml-2 text-foreground">{user.location}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              onClick={() => onEdit(user)}
            >
              Edit User
            </Button>
            <Button
              variant={user.status === 'active' ? 'destructive' : 'default'}
              size="sm"
              iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
              onClick={() => onToggleStatus(user.id)}
            >
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;