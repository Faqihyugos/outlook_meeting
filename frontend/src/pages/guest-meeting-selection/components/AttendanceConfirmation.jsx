import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceConfirmation = ({ attendanceData, onStartOver, onViewReceipt }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getStatusIcon = () => {
    switch (attendanceData.status) {
      case 'confirmed':
        return { icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning', bg: 'bg-warning/10' };
      default:
        return { icon: 'AlertCircle', color: 'text-error', bg: 'bg-error/10' };
    }
  };

  const getStatusMessage = () => {
    switch (attendanceData.status) {
      case 'confirmed':
        return {
          title: 'Attendance Confirmed!',
          message: 'Your attendance has been successfully recorded for this meeting.',
          action: 'You can now join the meeting at the scheduled time.'
        };
      case 'pending':
        return {
          title: 'Approval Pending',
          message: 'Your attendance request has been sent to the meeting organizer.',
          action: 'You will receive an email notification once your request is approved.'
        };
      default:
        return {
          title: 'Something went wrong',
          message: 'There was an issue processing your attendance.',
          action: 'Please try again or contact support.'
        };
    }
  };

  const statusInfo = getStatusIcon();
  const statusMessage = getStatusMessage();

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadReceipt = () => {
    // Mock receipt generation
    const receiptData = {
      attendanceId: `ATT-${Date.now()}`,
      meetingTitle: attendanceData.meetingTitle || 'Meeting',
      guestName: attendanceData.guestInfo.fullName,
      company: attendanceData.guestInfo.company,
      timestamp: attendanceData.timestamp,
      status: attendanceData.status
    };
    
    onViewReceipt(receiptData);
  };

  return (
    <div className="bg-card rounded-lg shadow-enterprise border border-border overflow-hidden">
      {/* Header with Status */}
      <div className={`p-6 ${statusInfo.bg} border-b border-border`}>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 ${statusInfo.bg} rounded-full flex items-center justify-center border-2 border-white shadow-sm`}>
            <Icon name={statusInfo.icon} size={28} className={statusInfo.color} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
              {statusMessage.title}
            </h2>
            <p className="text-muted-foreground">
              {statusMessage.message}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Action Message */}
        <div className="p-4 bg-muted/30 rounded-md">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                What's Next?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {statusMessage.action}
              </p>
            </div>
          </div>
        </div>

        {/* Meeting Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Meeting Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Meeting</label>
                <p className="text-sm text-foreground font-medium">
                  {attendanceData.meetingTitle || 'Meeting Title'}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                <p className="text-sm text-foreground">
                  {attendanceData.guestInfo.fullName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company</label>
                <p className="text-sm text-foreground">
                  {attendanceData.guestInfo.company}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm text-foreground capitalize">
                  {attendanceData.guestInfo.role}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Submitted</label>
                <p className="text-sm text-foreground">
                  {formatDateTime(attendanceData.timestamp)}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  attendanceData.status === 'confirmed' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  <Icon name={statusInfo.icon} size={12} className="mr-1" />
                  {attendanceData.status === 'confirmed' ? 'Confirmed' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Toggle */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            iconName={showDetails ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Additional Details'}
          </Button>
          
          {showDetails && (
            <div className="p-4 bg-muted/30 rounded-md space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm text-foreground">{attendanceData.guestInfo.email}</p>
              </div>
              
              {attendanceData.guestInfo.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm text-foreground">{attendanceData.guestInfo.phone}</p>
                </div>
              )}
              
              {attendanceData.guestInfo.additionalNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm text-foreground">{attendanceData.guestInfo.additionalNotes}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Attendance ID</label>
                <p className="text-sm text-foreground font-mono">ATT-{attendanceData.timestamp.slice(-8)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Receipt Notice */}
        {attendanceData.guestInfo.emailReceipt && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-md">
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">
                  Email Receipt Sent
                </p>
                <p className="text-sm text-primary/80">
                  A confirmation email has been sent to {attendanceData.guestInfo.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownloadReceipt}
            className="flex-1"
          >
            Download Receipt
          </Button>
          
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onStartOver}
            className="flex-1"
          >
            Mark Another Meeting
          </Button>
          
          <Button
            variant="ghost"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.open('/help/guest-attendance', '_blank')}
          >
            Help & Support
          </Button>
        </div>
        
        {countdown > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              This page will refresh in {countdown} seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceConfirmation;