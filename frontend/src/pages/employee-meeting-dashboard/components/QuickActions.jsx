import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const QuickActions = ({ onQuickAction }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const quickActions = [
    {
      id: 'mark-all-present',
      label: 'Mark All Present',
      icon: 'CheckCircle',
      variant: 'default',
      description: 'Mark attendance as present for all today\'s meetings'
    },
    {
      id: 'sync-calendar',
      label: 'Sync Calendar',
      icon: 'RefreshCw',
      variant: 'outline',
      description: 'Force sync with Outlook calendar'
    },
    {
      id: 'export-today',
      label: 'Export Today',
      icon: 'Download',
      variant: 'outline',
      description: 'Export today\'s attendance report'
    },
    {
      id: 'schedule-meeting',
      label: 'New Meeting',
      icon: 'Plus',
      variant: 'secondary',
      description: 'Schedule a new meeting in Outlook'
    }
  ];

  const keyboardShortcuts = [
    { key: 'J/K', action: 'Navigate meetings' },
    { key: 'P', action: 'Mark present' },
    { key: 'A', action: 'Mark absent' },
    { key: 'L', action: 'Mark late' },
    { key: 'Space', action: 'View details' },
    { key: 'Ctrl+A', action: 'Select all' },
    { key: 'Ctrl+E', action: 'Export' },
    { key: 'Ctrl+R', action: 'Refresh' }
  ];

  const handleQuickAction = (actionId) => {
    onQuickAction(actionId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Quick Actions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="Keyboard"
          onClick={() => setShowShortcuts(!showShortcuts)}
        >
          Shortcuts
        </Button>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            iconName={action.icon}
            onClick={() => handleQuickAction(action.id)}
            className="h-auto py-3 flex-col space-y-1"
            title={action.description}
          >
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Keyboard Shortcuts
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {keyboardShortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="font-medium text-foreground">15 of 24 meetings</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '62.5%' }}></div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <span>62.5% complete</span>
          <span>9 remaining</span>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;