import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityCompliancePanel = () => {
  const [showGDPRDetails, setShowGDPRDetails] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Enterprise Security',
      description: 'End-to-end encryption with Azure AD integration'
    },
    {
      icon: 'Lock',
      title: 'Data Protection',
      description: 'GDPR compliant data handling and storage'
    },
    {
      icon: 'Eye',
      title: 'Audit Trail',
      description: 'Complete activity logging for compliance'
    },
    {
      icon: 'Clock',
      title: 'Session Management',
      description: 'Automatic timeout and secure session handling'
    }
  ];

  const complianceStandards = [
    { name: 'GDPR', status: 'Compliant', icon: 'CheckCircle' },
    { name: 'SOX', status: 'Compliant', icon: 'CheckCircle' },
    { name: 'ISO 27001', status: 'Certified', icon: 'Award' },
    { name: 'SOC 2', status: 'Type II', icon: 'Shield' }
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Security Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">
                  {feature.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Compliance Standards
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {complianceStandards.map((standard, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <Icon name={standard.icon} size={16} className="text-success" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {standard.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {standard.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Compliance Notice */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Privacy & Data Protection
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGDPRDetails(!showGDPRDetails)}
            iconName={showGDPRDetails ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showGDPRDetails ? 'Hide' : 'Details'}
          </Button>
        </div>

        <div className="flex items-start space-x-3 mb-4">
          <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            We are committed to protecting your privacy and ensuring GDPR compliance. 
            Your meeting attendance data is processed securely and stored only as long as necessary.
          </p>
        </div>

        {showGDPRDetails && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Data Collection:</strong> We collect only meeting attendance information necessary for business operations.</p>
              <p><strong>Data Storage:</strong> All data is encrypted and stored in EU-compliant data centers.</p>
              <p><strong>Data Retention:</strong> Attendance records are retained for 90 days, then archived according to company policy.</p>
              <p><strong>Your Rights:</strong> You have the right to access, correct, or delete your personal data at any time.</p>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="gdpr-consent"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="gdpr-consent" className="text-sm text-foreground">
                I acknowledge and accept the data processing terms
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Security Badges */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Security Certifications
        </h3>
        
        <div className="flex items-center justify-center space-x-6 py-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Shield" size={24} className="text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Microsoft</p>
            <p className="text-xs text-muted-foreground">Certified</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Award" size={24} className="text-success" />
            </div>
            <p className="text-xs text-muted-foreground">ISO 27001</p>
            <p className="text-xs text-muted-foreground">Certified</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Lock" size={24} className="text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">SOC 2</p>
            <p className="text-xs text-muted-foreground">Type II</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCompliancePanel;