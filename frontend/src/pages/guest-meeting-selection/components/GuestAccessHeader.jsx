import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GuestAccessHeader = () => {
  const [sessionTimeLeft, setSessionTimeLeft] = useState(30); // 30 minutes
  const [showHelp, setShowHelp] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');

  // Session countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          // Handle session timeout
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock sync status
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['synced', 'syncing'];
      setSyncStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Icon name="RefreshCw" size={14} className="animate-spin text-warning" />;
      default:
        return <Icon name="CheckCircle" size={14} className="text-success" />;
    }
  };

  const getTimeWarningColor = () => {
    if (sessionTimeLeft <= 5) return 'text-error';
    if (sessionTimeLeft <= 10) return 'text-warning';
    return 'text-muted-foreground';
  };

  const helpTopics = [
    {
      title: 'How to find my meeting',
      content: 'Use the search box to type meeting title, organizer name, or location. You can also filter by date and meeting type.'
    },
    {
      title: 'What information do I need?',
      content: 'You\'ll need your full name, email address, company name, and your role/relationship to the meeting.'
    },
    {
      title: 'Approval required meetings',
      content: 'Some meetings require organizer approval. Your request will be sent for review and you\'ll receive an email notification.'
    },
    {
      title: 'Technical issues',
      content: 'If you experience any problems, try refreshing the page or contact the meeting organizer directly.'
    }
  ];

  return (
    <>
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Guest Access Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-accent" />
                </div>
                <div>
                  <h1 className="text-lg font-heading font-semibold text-foreground">
                    Guest Meeting Check-in
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    No account required • Secure access
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Status & Actions */}
            <div className="flex items-center space-x-4">
              {/* Sync Status */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-md">
                {getSyncStatusIcon()}
                <span className="text-xs text-muted-foreground">
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Up to date'}
                </span>
              </div>

              {/* Session Timer */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-muted/50 rounded-md">
                <Icon name="Clock" size={14} className={getTimeWarningColor()} />
                <span className={`text-xs font-medium ${getTimeWarningColor()}`}>
                  {sessionTimeLeft}m left
                </span>
              </div>

              {/* Help Button */}
              <Button
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                onClick={() => setShowHelp(true)}
              >
                <span className="hidden sm:inline">Help</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Session Warning Banner */}
        {sessionTimeLeft <= 10 && (
          <div className="bg-warning/10 border-t border-warning/20 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-medium">
                  Session expires in {sessionTimeLeft} minutes
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-warning hover:bg-warning/10"
              >
                Extend Session
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-enterprise-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="HelpCircle" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-foreground">
                      Guest Check-in Help
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Quick guide to marking your meeting attendance
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-6">
                {helpTopics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-heading font-medium text-foreground">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {topic.content}
                    </p>
                  </div>
                ))}

                <div className="p-4 bg-primary/10 rounded-md">
                  <div className="flex items-start space-x-3">
                    <Icon name="Shield" size={20} className="text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-1">
                        Privacy & Security
                      </h4>
                      <p className="text-sm text-primary/80">
                        Your information is encrypted and only used for meeting attendance tracking. 
                        We comply with GDPR and enterprise security standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="default"
                  onClick={() => setShowHelp(false)}
                  className="flex-1"
                >
                  Got it, thanks!
                </Button>
                <Button
                  variant="outline"
                  iconName="ExternalLink"
                  iconPosition="right"
                  onClick={() => window.open('mailto:support@company.com', '_blank')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GuestAccessHeader;