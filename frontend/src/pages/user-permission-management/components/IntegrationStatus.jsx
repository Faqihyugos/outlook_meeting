import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatus = ({ onResolveConflict, onSyncNow }) => {
  const [syncStatus, setSyncStatus] = useState('healthy');
  const [lastSync, setLastSync] = useState(new Date());
  const [conflicts, setConflicts] = useState([]);

  // Mock integration status data
  const integrationData = {
    azureAD: {
      status: 'connected',
      lastSync: '2025-01-18T03:45:00Z',
      usersSynced: 1247,
      groupsSynced: 45,
      errors: 0
    },
    outlook365: {
      status: 'connected',
      lastSync: '2025-01-18T03:50:00Z',
      calendarsSynced: 1247,
      meetingsSynced: 3456,
      errors: 2
    },
    provisioning: {
      status: 'warning',
      pendingUsers: 12,
      failedProvisions: 3,
      lastRun: '2025-01-18T03:30:00Z'
    }
  };

  const mockConflicts = [
    {
      id: 1,
      type: 'user_mismatch',
      user: 'john.doe@company.com',
      description: 'User exists in Azure AD but not in local system',
      severity: 'medium',
      timestamp: '2025-01-18T03:25:00Z'
    },
    {
      id: 2,
      type: 'permission_conflict',
      user: 'sarah.wilson@company.com',
      description: 'Role mismatch between Azure AD and local permissions',
      severity: 'high',
      timestamp: '2025-01-18T03:20:00Z'
    },
    {
      id: 3,
      type: 'group_sync_error',
      group: 'Engineering Team',
      description: 'Group membership sync failed - network timeout',
      severity: 'low',
      timestamp: '2025-01-18T03:15:00Z'
    }
  ];

  useEffect(() => {
    setConflicts(mockConflicts);
    
    // Simulate periodic sync status updates
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-muted/10 text-muted-foreground border-border';
      default:
        return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-foreground">Integration Status</h3>
          <p className="text-sm text-muted-foreground">
            Azure AD and Outlook 365 synchronization
          </p>
        </div>
        <Button
          variant="outline"
          iconName="RefreshCw"
          onClick={onSyncNow}
        >
          Sync Now
        </Button>
      </div>

      {/* Integration Services Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Azure AD</h4>
            <Icon 
              name={getStatusIcon(integrationData.azureAD.status)} 
              size={20} 
              className={getStatusColor(integrationData.azureAD.status)} 
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Users:</span>
              <span className="text-foreground">{integrationData.azureAD.usersSynced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Groups:</span>
              <span className="text-foreground">{integrationData.azureAD.groupsSynced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sync:</span>
              <span className="text-foreground">
                {formatTimestamp(integrationData.azureAD.lastSync)}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Outlook 365</h4>
            <Icon 
              name={getStatusIcon(integrationData.outlook365.status)} 
              size={20} 
              className={getStatusColor(integrationData.outlook365.status)} 
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calendars:</span>
              <span className="text-foreground">{integrationData.outlook365.calendarsSynced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meetings:</span>
              <span className="text-foreground">{integrationData.outlook365.meetingsSynced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Errors:</span>
              <span className="text-error">{integrationData.outlook365.errors}</span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Provisioning</h4>
            <Icon 
              name={getStatusIcon(integrationData.provisioning.status)} 
              size={20} 
              className={getStatusColor(integrationData.provisioning.status)} 
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending:</span>
              <span className="text-warning">{integrationData.provisioning.pendingUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Failed:</span>
              <span className="text-error">{integrationData.provisioning.failedProvisions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Run:</span>
              <span className="text-foreground">
                {formatTimestamp(integrationData.provisioning.lastRun)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conflicts and Issues */}
      {conflicts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">
              Sync Conflicts ({conflicts.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              iconName="AlertTriangle"
            >
              Resolve All
            </Button>
          </div>

          <div className="space-y-3">
            {conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className={`border rounded-lg p-4 ${getSeverityColor(conflict.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium">
                        {conflict.user || conflict.group}
                      </span>
                      <span className="text-xs px-2 py-1 bg-background/50 rounded">
                        {conflict.severity}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 mb-2">
                      {conflict.description}
                    </p>
                    <span className="text-xs opacity-60">
                      {formatTimestamp(conflict.timestamp)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    onClick={() => onResolveConflict(conflict.id)}
                  >
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationStatus;