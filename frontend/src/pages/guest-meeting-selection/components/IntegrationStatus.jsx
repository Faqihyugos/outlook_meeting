import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatus = () => {
  const [integrationStatus, setIntegrationStatus] = useState({
    outlook: 'connected',
    calendar: 'synced',
    lastSync: new Date(),
    totalMeetings: 0,
    validMeetings: 0
  });
  
  const [showDetails, setShowDetails] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock status updates
  useEffect(() => {
    const updateStatus = () => {
      setIntegrationStatus(prev => ({
        ...prev,
        totalMeetings: Math.floor(Math.random() * 20) + 10,
        validMeetings: Math.floor(Math.random() * 15) + 8,
        lastSync: new Date()
      }));
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': case'synced':
        return { icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10' };
      case 'syncing':
        return { icon: 'RefreshCw', color: 'text-warning animate-spin', bg: 'bg-warning/10' };
      case 'error':
        return { icon: 'AlertCircle', color: 'text-error', bg: 'bg-error/10' };
      default:
        return { icon: 'Clock', color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setIntegrationStatus(prev => ({ ...prev, calendar: 'syncing' }));
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrationStatus(prev => ({
      ...prev,
      calendar: 'synced',
      lastSync: new Date(),
      totalMeetings: Math.floor(Math.random() * 20) + 10,
      validMeetings: Math.floor(Math.random() * 15) + 8
    }));
    
    setIsRefreshing(false);
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const outlookStatus = getStatusIcon(integrationStatus.outlook);
  const calendarStatus = getStatusIcon(integrationStatus.calendar);

  return (
    <div className="bg-card rounded-lg shadow-enterprise border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-medium text-foreground">
                Integration Status
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time calendar sync
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? 'animate-spin' : ''}
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName={showDetails ? "ChevronUp" : "ChevronDown"}
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="hidden sm:inline">
                {showDetails ? 'Less' : 'Details'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Main Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${outlookStatus.bg} rounded-full flex items-center justify-center`}>
              <Icon name={outlookStatus.icon} size={16} className={outlookStatus.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Outlook 365</p>
              <p className="text-xs text-muted-foreground capitalize">
                {integrationStatus.outlook}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${calendarStatus.bg} rounded-full flex items-center justify-center`}>
              <Icon name={calendarStatus.icon} size={16} className={calendarStatus.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Calendar Sync</p>
              <p className="text-xs text-muted-foreground">
                {formatLastSync(integrationStatus.lastSync)}
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-md">
            <div className="text-2xl font-heading font-bold text-foreground">
              {integrationStatus.totalMeetings}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Meetings
            </div>
          </div>
          
          <div className="text-center p-3 bg-success/10 rounded-md">
            <div className="text-2xl font-heading font-bold text-success">
              {integrationStatus.validMeetings}
            </div>
            <div className="text-xs text-success/80">
              Available Today
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">API Status</label>
                <p className="text-foreground">Microsoft Graph API Connected</p>
              </div>
              
              <div>
                <label className="font-medium text-muted-foreground">Sync Frequency</label>
                <p className="text-foreground">Every 5 minutes</p>
              </div>
              
              <div>
                <label className="font-medium text-muted-foreground">Data Source</label>
                <p className="text-foreground">Company Outlook Calendar</p>
              </div>
              
              <div>
                <label className="font-medium text-muted-foreground">Security</label>
                <p className="text-foreground">OAuth 2.0 Authenticated</p>
              </div>
            </div>
            
            <div className="p-3 bg-primary/10 rounded-md">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary">
                    Real-time Verification
                  </p>
                  <p className="text-xs text-primary/80">
                    All meetings are verified against the company calendar to ensure accuracy and prevent unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationStatus;