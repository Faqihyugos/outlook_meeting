import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatus = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const integrations = [
    {
      id: 'outlook',
      name: 'Microsoft Outlook 365',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      syncFrequency: 'Every 5 minutes',
      dataPoints: '1,247 meetings synced',
      health: 98,
      icon: 'Mail',
      description: 'Calendar events and meeting data'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      status: 'connected',
      lastSync: new Date(Date.now() - 180000), // 3 minutes ago
      syncFrequency: 'Real-time',
      dataPoints: '892 participants tracked',
      health: 95,
      icon: 'Video',
      description: 'Meeting attendance and participation'
    },
    {
      id: 'hr',
      name: 'HR Information System',
      status: 'connected',
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      syncFrequency: 'Hourly',
      dataPoints: '456 employee records',
      health: 100,
      icon: 'Users',
      description: 'Employee data and organizational structure'
    },
    {
      id: 'finance',
      name: 'Financial Systems',
      status: 'warning',
      lastSync: new Date(Date.now() - 7200000), // 2 hours ago
      syncFrequency: 'Daily',
      dataPoints: 'Cost data pending',
      health: 75,
      icon: 'DollarSign',
      description: 'Meeting cost calculations and budgets'
    },
    {
      id: 'facilities',
      name: 'Room Booking System',
      status: 'error',
      lastSync: new Date(Date.now() - 86400000), // 24 hours ago
      syncFrequency: 'Every 15 minutes',
      dataPoints: 'Connection failed',
      health: 0,
      icon: 'MapPin',
      description: 'Meeting room availability and usage'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      default: return 'bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-success';
    if (health >= 70) return 'text-warning';
    return 'text-error';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const handleReconnect = (integrationId) => {
    // Handle reconnection logic
    console.log(`Reconnecting ${integrationId}`);
  };

  const handleConfigure = (integrationId) => {
    // Handle configuration logic
    console.log(`Configuring ${integrationId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border card-elevation">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Integration Status
              </h3>
              <p className="text-sm text-muted-foreground">
                System connections and data synchronization
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              Last updated: {formatTimeAgo(lastUpdated)}
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              loading={refreshing}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-muted/30 rounded-lg p-4 border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusBg(integration.status)}`}>
                    <Icon name={integration.icon} size={20} className={getStatusColor(integration.status)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      {integration.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(integration.status)} 
                    size={16} 
                    className={getStatusColor(integration.status)} 
                  />
                  <span className={`text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Last Sync:</span>
                  <span className="text-foreground">{formatTimeAgo(integration.lastSync)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="text-foreground">{integration.syncFrequency}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Data Points:</span>
                  <span className="text-foreground">{integration.dataPoints}</span>
                </div>
              </div>

              {/* Health Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Health Score</span>
                  <span className={`font-medium ${getHealthColor(integration.health)}`}>
                    {integration.health}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      integration.health >= 90 ? 'bg-success' :
                      integration.health >= 70 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${integration.health}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {integration.status === 'error' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    onClick={() => handleReconnect(integration.id)}
                  >
                    Reconnect
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  onClick={() => handleConfigure(integration.id)}
                >
                  Configure
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                >
                  View Logs
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Overall System Health */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="Activity" size={16} className="text-success" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Overall System Health</h4>
                <p className="text-xs text-muted-foreground">
                  {integrations.filter(i => i.status === 'connected').length} of {integrations.length} integrations active
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-heading font-semibold text-success">94%</div>
              <div className="text-xs text-muted-foreground">Operational</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatus;