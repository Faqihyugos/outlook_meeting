import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const GuestInformationForm = ({ selectedMeeting, onSubmitAttendance }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    gdprConsent: false,
    emailReceipt: true,
    additionalNotes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = [
    { value: '', label: 'Select your role...' },
    { value: 'vendor', label: 'Vendor/Supplier' },
    { value: 'partner', label: 'Business Partner' },
    { value: 'candidate', label: 'Job Candidate' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'client', label: 'Client' },
    { value: 'investor', label: 'Investor' },
    { value: 'other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'You must consent to data processing';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const attendanceData = {
        meetingId: selectedMeeting.id,
        guestInfo: formData,
        timestamp: new Date().toISOString(),
        status: selectedMeeting.requiresApproval ? 'pending' : 'confirmed'
      };
      
      onSubmitAttendance(attendanceData);
    } catch (error) {
      console.error('Attendance submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedMeeting) {
    return (
      <div className="bg-card rounded-lg shadow-enterprise border border-border p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserPlus" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Select a Meeting First
        </h3>
        <p className="text-muted-foreground">
          Please search for and select a meeting before providing your information.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-enterprise border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="UserCheck" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Guest Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Please provide your details to mark attendance for: <span className="font-medium">{selectedMeeting.title}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={errors.fullName}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company/Organization"
              type="text"
              placeholder="Your company name"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              error={errors.company}
              required
            />
            
            <Select
              label="Your Role"
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              error={errors.role}
              required
            />
          </div>
          
          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            description="For meeting organizer contact if needed"
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground">
            Additional Information
          </h3>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Additional Notes (Optional)
            </label>
            <textarea
              placeholder="Any additional information for the organizer..."
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Consent and Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-medium text-foreground">
            Consent & Preferences
          </h3>
          
          <div className="space-y-3">
            <Checkbox
              label="I consent to the processing of my personal data for meeting attendance tracking"
              description="Required for GDPR compliance. Your data will only be used for meeting attendance purposes."
              checked={formData.gdprConsent}
              onChange={(e) => handleInputChange('gdprConsent', e.target.checked)}
              error={errors.gdprConsent}
              required
            />
            
            <Checkbox
              label="Send me an email receipt of my attendance"
              description="You'll receive a confirmation email with meeting details and attendance status."
              checked={formData.emailReceipt}
              onChange={(e) => handleInputChange('emailReceipt', e.target.checked)}
            />
          </div>
        </div>

        {/* Meeting Verification Notice */}
        {selectedMeeting.requiresApproval && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-md">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-warning mb-1">
                  Approval Required
                </h4>
                <p className="text-sm text-warning/80">
                  This meeting requires organizer approval. Your attendance request will be sent to {selectedMeeting.organizer} for review. You'll receive an email notification once approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="UserCheck"
            iconPosition="left"
            className="flex-1"
            disabled={!formData.gdprConsent}
          >
            {isSubmitting 
              ? 'Submitting Attendance...' 
              : selectedMeeting.requiresApproval 
                ? 'Request Attendance Approval' :'Mark Attendance'
            }
          </Button>
          
          <Button
            type="button"
            variant="outline"
            iconName="HelpCircle"
            onClick={() => window.open('/help/guest-attendance', '_blank')}
          >
            Need Help?
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GuestInformationForm;