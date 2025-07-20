import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionToolbar = ({ selectedCount, onBulkAction, onImport, onExport }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select Action' },
    { value: 'activate', label: 'Activate Users' },
    { value: 'deactivate', label: 'Deactivate Users' },
    { value: 'change-role', label: 'Change Role' },
    { value: 'reset-password', label: 'Reset Password' },
    { value: 'send-invitation', label: 'Send Invitation' },
    { value: 'delete', label: 'Delete Users' }
  ];

  const handleBulkAction = () => {
    if (!bulkAction) return;
    
    if (bulkAction === 'delete') {
      setShowConfirm(true);
    } else {
      onBulkAction(bulkAction);
      setBulkAction('');
    }
  };

  const confirmBulkAction = () => {
    onBulkAction(bulkAction);
    setBulkAction('');
    setShowConfirm(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center space-x-2">
                <Select
                  placeholder="Bulk Actions"
                  options={bulkActionOptions}
                  value={bulkAction}
                  onChange={setBulkAction}
                  className="w-48"
                />
                <Button
                  variant="default"
                  size="sm"
                  iconName="Play"
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                >
                  Execute
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              onClick={onImport}
            >
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={onExport}
            >
              Export
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="UserPlus"
            >
              Add User
            </Button>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Quick Actions:</span>
              <Button
                variant="ghost"
                size="sm"
                iconName="UserCheck"
                onClick={() => onBulkAction('activate')}
              >
                Activate All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="UserX"
                onClick={() => onBulkAction('deactivate')}
              >
                Deactivate All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Mail"
                onClick={() => onBulkAction('send-invitation')}
              >
                Send Invites
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-200 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-enterprise-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  Confirm Bulk Action
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to {bulkAction.replace('-', ' ')} {selectedCount} selected user{selectedCount !== 1 ? 's' : ''}?
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={confirmBulkAction}
                className="flex-1"
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionToolbar;