import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GuestAccessPanel = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [showMeetings, setShowMeetings] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [errors, setErrors] = useState({});

  // Meetings data will be fetched from backend
  // Backend API endpoint: /api/meetings?date=YYYY-MM-DD&domain=company.com
  // For Outlook integration, backend should sync events from Outlook 365

  // Meeting type options will be fetched from backend or derived from schema
  const [meetingTypeOptions, setMeetingTypeOptions] = useState([
    { value: 'all', label: 'All Meeting Types' }
  ]);

  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    // Fetch meetings from backend when date or search/type changes
    const fetchMeetings = async () => {
      try {
        const params = new URLSearchParams({
          date: selectedDate,
          search: searchQuery,
          type: selectedType !== 'all' ? selectedType : '',
          domain: window.location.hostname.split('.').slice(-2).join('.') // Example: company.com
        });
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/meetings?${params.toString()}`);
        const data = await res.json();
        setFilteredMeetings(data.meetings || []);
        if (data.meetingTypes) {
          setMeetingTypeOptions([
            { value: 'all', label: 'All Meeting Types' },
            ...data.meetingTypes.map(type => ({ value: type, label: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))
          ]);
        }
      } catch (err) {
        setFilteredMeetings([]);
      }
    };
    if (showMeetings) fetchMeetings();
  }, [selectedDate, searchQuery, selectedType, showMeetings]);

  const handleSearch = () => {
    setShowMeetings(true);
  };

  const handleMeetingSelect = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGuestAccess = async (e) => {
    e.preventDefault();
    // Validate guest information
    const newErrors = {};
    if (!guestInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!guestInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!selectedMeeting) {
      newErrors.meeting = 'Please select a meeting';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Submit guest check-in to backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/api/guest-checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestInfo,
          meetingId: selectedMeeting.id,
          date: selectedDate
        })
      });
      if (res.ok) {
        navigate('/guest-meeting-selection', {
          state: {
            guestInfo,
            selectedMeeting,
            selectedDate
          }
        });
      } else {
        const errorData = await res.json();
        setErrors(errorData.errors || { general: 'Check-in failed' });
      }
    } catch (err) {
      setErrors({ general: 'Network error' });
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-enterprise p-8 h-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserCheck" size={32} className="text-accent-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Guest Access
        </h2>
        <p className="text-muted-foreground">
          Quick meeting check-in for external attendees
        </p>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <Input
          label="Meeting Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-4"
        />
      </div>

      {/* Meeting Search */}
      <div className="space-y-4 mb-6">
        <Input
          label="Search Meetings"
          type="search"
          placeholder="Search by meeting title, organizer, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Select
          label="Meeting Type"
          options={meetingTypeOptions}
          value={selectedType}
          onChange={setSelectedType}
        />
        
        <Button
          variant="outline"
          fullWidth
          onClick={handleSearch}
          iconName="Search"
          iconPosition="left"
        >
          Find Meetings
        </Button>
      </div>

      {/* Meeting Results */}
      {showMeetings && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Available Meetings ({filteredMeetings.length})
          </h4>
          
          {filteredMeetings.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => handleMeetingSelect(meeting)}
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-colors duration-150
                    ${selectedMeeting?.id === meeting.id
                      ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-foreground truncate">
                        {meeting.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {meeting.time} - {meeting.endTime} • {meeting.organizer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {meeting.location} • {meeting.attendees} attendees
                      </p>
                    </div>
                    {selectedMeeting?.id === meeting.id && (
                      <Icon name="Check" size={16} className="text-primary flex-shrink-0 ml-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Calendar" size={48} className="mx-auto mb-3 opacity-50" />
              <p>No meetings found for the selected criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Guest Information Form */}
      <form onSubmit={handleGuestAccess} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={guestInfo.name}
          onChange={handleGuestInfoChange}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />
        
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={guestInfo.email}
          onChange={handleGuestInfoChange}
          placeholder="your.email@company.com"
          error={errors.email}
          required
        />
        
        <Input
          label="Company/Organization"
          type="text"
          name="company"
          value={guestInfo.company}
          onChange={handleGuestInfoChange}
          placeholder="Your company name (optional)"
        />

        {errors.meeting && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-3">
            <p className="text-sm text-error">{errors.meeting}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          disabled={!selectedMeeting}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Check-in
        </Button>
      </form>

      {/* Guest Access Info */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Guest Access Features</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>Quick meeting check-in</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={12} />
            <span>Secure temporary access</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={12} />
            <span>No account creation required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestAccessPanel;