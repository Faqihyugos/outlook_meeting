import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SSOLoginPanel from './components/SSOLoginPanel';
import GuestAccessPanel from './components/GuestAccessPanel';
import SystemStatusPanel from './components/SystemStatusPanel';
import SecurityCompliancePanel from './components/SecurityCompliancePanel';

const AuthenticationSSOLanding = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // login, guest, status, security

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrentTime = () => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabOptions = [
    { id: 'login', label: 'Employee Login', icon: 'Building2' },
    { id: 'guest', label: 'Guest Access', icon: 'UserCheck' },
    { id: 'status', label: 'System Status', icon: 'Activity' },
    { id: 'security', label: 'Security', icon: 'Shield' }
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'login':
        return <SSOLoginPanel />;
      case 'guest':
        return <GuestAccessPanel />;
      case 'status':
        return <SystemStatusPanel />;
      case 'security':
        return <SecurityCompliancePanel />;
      default:
        return <SSOLoginPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Calendar" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-semibold text-foreground">
                  Outlook Meeting Tracker
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Enterprise Meeting Attendance Management
                </p>
              </div>
            </div>

            {/* Current Time */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatCurrentTime()}
                </p>
                <p className="text-xs text-muted-foreground">
                  System Time (UTC-5)
                </p>
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              iconName="Menu"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
            Welcome to Meeting Tracker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your meeting attendance with seamless Microsoft 365 integration. 
            Sign in with your corporate account or access as a guest for quick check-ins.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Panel - Employee Login (60%) */}
            <div className="col-span-7">
              <SSOLoginPanel />
            </div>

            {/* Right Panel - Guest Access (40%) */}
            <div className="col-span-5">
              <GuestAccessPanel />
            </div>
          </div>

          {/* Bottom Section - System Status and Security */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <SystemStatusPanel />
            <SecurityCompliancePanel />
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-6 overflow-x-auto">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[600px]">
            {renderActiveContent()}
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                Enterprise Solution
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Integrated with Microsoft 365 ecosystem for seamless meeting management 
                and attendance tracking across your organization.
              </p>
              <div className="flex items-center space-x-2">
                <Icon name="Building2" size={16} className="text-primary" />
                <span className="text-sm text-muted-foreground">
                  Trusted by 500+ enterprises
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                Quick Access
              </h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full"
                  iconName="HelpCircle"
                  iconPosition="left"
                >
                  Help & Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full"
                  iconName="FileText"
                  iconPosition="left"
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start w-full"
                  iconName="Settings"
                  iconPosition="left"
                >
                  System Settings
                </Button>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                Support
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} />
                  <span>support@company.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>24/7 Technical Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Company Name. All rights reserved. 
              Microsoft 365 and Outlook are trademarks of Microsoft Corporation.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthenticationSSOLanding;