import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemStatusPanel = () => {
  const [integrationStatus, setIntegrationStatus] = useState({
    outlook365: 'connected',
    microsoftGraph: 'connected',
    azureAD: 'connected',
    calendar: 'syncing'
  });
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);

  // Mock status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrationStatus(prev => ({
        ...prev,
        calendar: prev.calendar === 'syncing' ? 'connected' : 'syncing'
      }));
      
      if (Math.random() > 0.7) {
        setLastSyncTime(new Date());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'syncing':
        return <Icon name="RefreshCw" size={16} className="text-warning animate-spin" />;
      case 'error':
        return <Icon name="AlertCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Circle" size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const integrationServices = [
    {
      name: 'Outlook 365',
      key: 'outlook365',
      description: 'Email and calendar integration'
    },
    {
      name: 'Microsoft Graph API',
      key: 'microsoftGraph',
      description: 'Data access and synchronization'
    },
    {
      name: 'Azure Active Directory',
      key: 'azureAD',
      description: 'Authentication and user management'
    },
    {
      name: 'Calendar Sync',
      key: 'calendar',
      description: 'Meeting data synchronization'
    }
  ];

  const formatLastSync = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          System Status
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          iconName={showDetails ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          {showDetails ? 'Hide' : 'Details'}
        </Button>
      </div>

      {/* Overall Status */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-foreground">All Systems Operational</span>
      </div>

      {/* Integration Health Badges */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {integrationServices.map((service) => (
          <div
            key={service.key}
            className="flex items-center space-x-2 p-2 bg-muted rounded-md"
          >
            {getStatusIcon(integrationStatus[service.key])}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {service.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {getStatusText(integrationStatus[service.key])}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Last Sync Information */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <span>Last Sync:</span>
        <span className="font-medium">{formatLastSync(lastSyncTime)}</span>
      </div>

      {/* Detailed Status */}
      {showDetails && (
        <div className="space-y-3 pt-4 border-t border-border">
          {integrationServices.map((service) => (
            <div key={service.key} className="flex items-start space-x-3">
              {getStatusIcon(integrationStatus[service.key])}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {service.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {service.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {getStatusText(integrationStatus[service.key])}
                </p>
              </div>
            </div>
          ))}
          
          {/* Additional System Info */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium text-foreground mb-2">System Information</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>API Version:</span>
                <span>v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span>&lt;200ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span>1,247</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Documentation Link */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          iconName="HelpCircle"
          iconPosition="left"
        >
          Help & Documentation
        </Button>
      </div>
    </div>
  );
};

export default SystemStatusPanel;