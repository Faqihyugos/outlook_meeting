import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationPanel = () => {
  const [syncStatus, setSyncStatus] = useState('connected');
  const [lastSync, setLastSync] = useState(new Date());
  const [roomConflicts, setRoomConflicts] = useState([]);
  const [authHealth, setAuthHealth] = useState('healthy');

  // Mock data for integration status
  const integrationData = {
    outlook: {
      status: 'connected',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      syncedMeetings: 247,
      errors: 0
    },
    rooms: {
      totalRooms: 15,
      availableRooms: 12,
      conflicts: [
        {
          id: 1,
          room: 'Conference Room A',
          meeting1: 'Team Standup',
          meeting2: 'Client Presentation',
          time: '2:00 PM - 3:00 PM',
          date: '2025-01-18'
        },
        {
          id: 2,
          room: 'Meeting Room 3',
          meeting1: 'Project Review',
          meeting2: 'Training Session',
          time: '10:30 AM - 11:30 AM',
          date: '2025-01-19'
        }
      ]
    },
    calendar: {
      authStatus: 'healthy',
      permissions: ['read', 'write'],
      tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
  };

  useEffect(() => {
    setRoomConflicts(integrationData.rooms.conflicts);
  }, []);

  const handleManualSync = () => {
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('connected');
      setLastSync(new Date());
    }, 3000);
  };

  const handleReauthorize = () => {
    // Simulate reauthorization
    setAuthHealth('reauthorizing');
    setTimeout(() => {
      setAuthHealth('healthy');
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': case'healthy':
        return 'text-green-600';
      case 'syncing': case'reauthorizing':
        return 'text-yellow-600';
      case 'error': case'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': case'healthy':
        return 'CheckCircle';
      case 'syncing': case'reauthorizing':
        return 'RefreshCw';
      case 'error': case'expired':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Integration Status
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className={syncStatus === 'syncing' ? 'animate-spin' : ''}
        >
          Sync Now
        </Button>
      </div>

      {/* Outlook Integration */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Microsoft Outlook 365</h4>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon(syncStatus)} 
                size={16} 
                className={`${getStatusColor(syncStatus)} ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} 
              />
              <span className="text-sm font-medium text-foreground">
                {syncStatus === 'connected' ? 'Connected' : 
                 syncStatus === 'syncing' ? 'Syncing...' : 'Disconnected'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Last sync: {formatTimeAgo(lastSync)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Synced Meetings:</span>
              <span className="ml-2 font-medium text-foreground">{integrationData.outlook.syncedMeetings}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Sync Errors:</span>
              <span className="ml-2 font-medium text-foreground">{integrationData.outlook.errors}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Authorization */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Calendar Authorization</h4>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={getStatusIcon(authHealth)} 
                size={16} 
                className={`${getStatusColor(authHealth)} ${authHealth === 'reauthorizing' ? 'animate-spin' : ''}`} 
              />
              <span className="text-sm font-medium text-foreground">
                {authHealth === 'healthy' ? 'Authorized' : 
                 authHealth === 'reauthorizing' ? 'Reauthorizing...' : 'Authorization Required'}
              </span>
            </div>
            {authHealth !== 'healthy' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReauthorize}
                disabled={authHealth === 'reauthorizing'}
              >
                Reauthorize
              </Button>
            )}
          </div>
          
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Permissions:</span>
              <span className="font-medium text-foreground">
                {integrationData.calendar.permissions.join(', ')}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Token Expires:</span>
              <span className="font-medium text-foreground">
                {formatTimeAgo(integrationData.calendar.tokenExpiry)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Booking Conflicts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Room Booking Status</h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {integrationData.rooms.availableRooms}/{integrationData.rooms.totalRooms} available
            </span>
          </div>
        </div>
        
        {roomConflicts.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-warning">
              <Icon name="AlertTriangle" size={16} />
              <span>{roomConflicts.length} room conflict{roomConflicts.length !== 1 ? 's' : ''} detected</span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {roomConflicts.map((conflict) => (
                <div key={conflict.id} className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{conflict.room}</div>
                      <div className="text-xs text-muted-foreground">
                        {conflict.date} • {conflict.time}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Resolve
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Conflicts: {conflict.meeting1} vs {conflict.meeting2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span>No room conflicts detected</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            className="text-xs"
          >
            Sync Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Key"
            className="text-xs"
          >
            Manage Auth
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="MapPin"
            className="text-xs"
          >
            Room Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Activity"
            className="text-xs"
          >
            View Logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;