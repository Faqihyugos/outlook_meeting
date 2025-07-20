import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestAccessHeader from './components/GuestAccessHeader';
import GuestSearchPanel from './components/GuestSearchPanel';
import MeetingResultsList from './components/MeetingResultsList';
import GuestInformationForm from './components/GuestInformationForm';
import AttendanceConfirmation from './components/AttendanceConfirmation';
import IntegrationStatus from './components/IntegrationStatus';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';



const GuestMeetingSelection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('search'); // search, form, confirmation
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setSelectedMeeting(null);
  };

  // Handle meeting selection
  const handleMeetingSelect = (meeting) => {
    setSelectedMeeting(meeting);
    setCurrentStep('form');
    
    // Scroll to form section
    setTimeout(() => {
      const formElement = document.getElementById('guest-form-section');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle attendance submission
  const handleAttendanceSubmit = (data) => {
    setAttendanceData({
      ...data,
      meetingTitle: selectedMeeting.title,
      meetingTime: selectedMeeting.time,
      organizer: selectedMeeting.organizer
    });
    setCurrentStep('confirmation');
    
    // Scroll to confirmation
    setTimeout(() => {
      const confirmationElement = document.getElementById('confirmation-section');
      if (confirmationElement) {
        confirmationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle starting over
  const handleStartOver = () => {
    setCurrentStep('search');
    setSelectedMeeting(null);
    setAttendanceData(null);
    setSearchResults([]);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle receipt viewing
  const handleViewReceipt = (receiptData) => {
    // Mock receipt download
    const receiptContent = `
MEETING ATTENDANCE RECEIPT
========================

Attendance ID: ${receiptData.attendanceId}
Meeting: ${receiptData.meetingTitle}
Guest: ${receiptData.guestName}
Company: ${receiptData.company}
Status: ${receiptData.status.toUpperCase()}
Timestamp: ${new Date(receiptData.timestamp).toLocaleString()}

This receipt confirms your meeting attendance request.
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-attendance-${receiptData.attendanceId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (currentStep === 'form') {
          setCurrentStep('search');
          setSelectedMeeting(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background">
      {/* Guest Access Header */}
      <GuestAccessHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'search' ?'bg-primary text-primary-foreground' :'bg-success text-success-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium text-foreground">Find Meeting</span>
            </div>
            
            <div className={`w-8 h-0.5 ${
              currentStep === 'search' ? 'bg-border' : 'bg-success'
            }`} />
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'form' 
                  ? 'bg-primary text-primary-foreground' 
                  : currentStep === 'confirmation' ?'bg-success text-success-foreground' :'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium text-foreground">Your Info</span>
            </div>
            
            <div className={`w-8 h-0.5 ${
              currentStep === 'confirmation' ? 'bg-success' : 'bg-border'
            }`} />
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 'confirmation' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
              <span className="text-sm font-medium text-foreground">Confirmation</span>
            </div>
          </div>

          {/* Step 1: Search and Results */}
          {currentStep === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <GuestSearchPanel
                  onSearchResults={handleSearchResults}
                  onMeetingSelect={handleMeetingSelect}
                />
                
                {searchResults.length > 0 && (
                  <MeetingResultsList
                    meetings={searchResults}
                    onMeetingSelect={handleMeetingSelect}
                    selectedMeetingId={selectedMeeting?.id}
                  />
                )}
              </div>
              
              <div className="space-y-6">
                <IntegrationStatus />
                
                {/* Quick Help Card */}
                <div className="bg-card rounded-lg shadow-enterprise border border-border p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Icon name="Lightbulb" size={16} className="text-accent" />
                    </div>
                    <h3 className="text-lg font-heading font-medium text-foreground">
                      Quick Tips
                    </h3>
                  </div>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <Icon name="Search" size={14} className="mt-0.5 text-primary" />
                      <p>Search by meeting title, organizer, or location</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Calendar" size={14} className="mt-0.5 text-primary" />
                      <p>Use date filters to find meetings on specific days</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Shield" size={14} className="mt-0.5 text-primary" />
                      <p>Some meetings may require organizer approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guest Information Form */}
          {currentStep === 'form' && (
            <div id="guest-form-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <GuestInformationForm
                  selectedMeeting={selectedMeeting}
                  onSubmitAttendance={handleAttendanceSubmit}
                />
              </div>
              
              <div className="space-y-6">
                {/* Selected Meeting Summary */}
                {selectedMeeting && (
                  <div className="bg-card rounded-lg shadow-enterprise border border-border p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Calendar" size={16} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-heading font-medium text-foreground">
                        Selected Meeting
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-foreground">{selectedMeeting.title}</h4>
                        <p className="text-sm text-muted-foreground">{selectedMeeting.time}</p>
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Organizer:</strong> {selectedMeeting.organizer}</p>
                        <p><strong>Location:</strong> {selectedMeeting.location}</p>
                        <p><strong>Participants:</strong> {selectedMeeting.participantCount}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ArrowLeft"
                        iconPosition="left"
                        onClick={() => setCurrentStep('search')}
                        className="w-full"
                      >
                        Choose Different Meeting
                      </Button>
                    </div>
                  </div>
                )}
                
                <IntegrationStatus />
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 'confirmation' && (
            <div id="confirmation-section" className="max-w-4xl mx-auto">
              <AttendanceConfirmation
                attendanceData={attendanceData}
                onStartOver={handleStartOver}
                onViewReceipt={handleViewReceipt}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestMeetingSelection;