import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, error
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);

  // Mock sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['synced', 'syncing'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setSyncStatus(randomStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Mock session timeout warning
  useEffect(() => {
    const timer = setTimeout(() => {
      setSessionTimeLeft(5);
      setShowSessionWarning(true);
    }, 25 * 60 * 1000); // 25 minutes

    return () => clearTimeout(timer);
  }, []);

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Icon name="RefreshCw" size={16} className="animate-spin text-warning" />;
      case 'error':
        return <Icon name="AlertCircle" size={16} className="text-error" />;
      default:
        return <Icon name="CheckCircle" size={16} className="text-success" />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing with Outlook...';
      case 'error':
        return 'Sync error - Check connection';
      default:
        return 'Synced with Outlook';
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/employee-meeting-dashboard':
        return 'My Meetings';
      case '/guest-meeting-selection':
        return 'Meeting Check-in';
      case '/meeting-management-console':
        return 'Meeting Management';
      case '/attendance-analytics-dashboard':
        return 'Analytics Dashboard';
      case '/user-permission-management':
        return 'User Management';
      case '/authentication-sso-landing':
        return 'Sign In';
      default:
        return 'Outlook Meeting Tracker';
    }
  };

  const handleExtendSession = () => {
    setShowSessionWarning(false);
    setSessionTimeLeft(null);
  };

  const handleLogout = () => {
    // Handle logout logic
    window.location.href = '/authentication-sso-landing';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section - Page Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-heading font-semibold text-foreground">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Section - Sync Status & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Sync Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-md">
              {getSyncStatusIcon()}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {getSyncStatusText()}
              </span>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronDown"
                iconPosition="right"
                className="hidden sm:flex"
              >
                John Doe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Session Timeout Warning Modal */}
      {showSessionWarning && (
        <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-enterprise-lg max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  Session Expiring Soon
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your session will expire in {sessionTimeLeft} minutes
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              To continue using the application, please extend your session or you will be automatically logged out.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={handleExtendSession}
                className="flex-1"
              >
                Extend Session
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1"
              >
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;