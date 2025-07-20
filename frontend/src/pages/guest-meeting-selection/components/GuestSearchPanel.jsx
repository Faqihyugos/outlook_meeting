import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const GuestSearchPanel = ({ onSearchResults, onMeetingSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingType, setMeetingType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock meeting data for search
  const mockMeetings = [
    {
      id: 'mtg-001',
      title: 'Q4 Strategic Planning Session',
      time: '09:00 AM - 11:00 AM',
      organizer: 'Sarah Johnson',
      location: 'Conference Room A / Teams',
      type: 'all-hands',
      participantCount: 25,
      agenda: 'Review Q4 objectives, budget planning, and strategic initiatives for next quarter.',
      dialIn: '+1-555-0123, Conference ID: 987654321',
      isValid: true,
      requiresApproval: false
    },
    {
      id: 'mtg-002',
      title: 'Product Development Review',
      time: '02:00 PM - 03:30 PM',
      organizer: 'Michael Chen',
      location: 'Innovation Lab',
      type: 'department',
      participantCount: 12,
      agenda: 'Sprint review, feature demonstrations, and roadmap updates.',
      dialIn: '+1-555-0123, Conference ID: 456789123',
      isValid: true,
      requiresApproval: true
    },
    {
      id: 'mtg-003',
      title: 'Client Partnership Discussion',
      time: '04:00 PM - 05:00 PM',
      organizer: 'Emma Rodriguez',
      location: 'Executive Boardroom',
      type: 'project',
      participantCount: 8,
      agenda: 'Partnership opportunities, contract negotiations, and collaboration frameworks.',
      dialIn: '+1-555-0123, Conference ID: 789123456',
      isValid: true,
      requiresApproval: true
    },
    {
      id: 'mtg-004',
      title: 'Weekly Team Standup',
      time: '10:30 AM - 11:00 AM',
      organizer: 'David Park',
      location: 'Teams Meeting',
      type: 'department',
      participantCount: 15,
      agenda: 'Weekly progress updates, blockers discussion, and sprint planning.',
      dialIn: '+1-555-0123, Conference ID: 321654987',
      isValid: true,
      requiresApproval: false
    }
  ];

  const meetingTypeOptions = [
    { value: 'all', label: 'All Meeting Types' },
    { value: 'all-hands', label: 'All-Hands Meetings' },
    { value: 'department', label: 'Department Meetings' },
    { value: 'project', label: 'Project Meetings' }
  ];

  // Handle search with fuzzy matching
  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredMeetings = mockMeetings;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filteredMeetings = filteredMeetings.filter(meeting =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by meeting type
    if (meetingType !== 'all') {
      filteredMeetings = filteredMeetings.filter(meeting => meeting.type === meetingType);
    }
    
    setIsSearching(false);
    onSearchResults(filteredMeetings);
  };

  // Auto-complete suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = mockMeetings
        .filter(meeting =>
          meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.organizer.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map(meeting => ({
          id: meeting.id,
          text: meeting.title,
          organizer: meeting.organizer
        }));
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch();
  };

  // Auto-search on date or type change
  useEffect(() => {
    if (selectedDate || meetingType !== 'all') {
      handleSearch();
    }
  }, [selectedDate, meetingType]);

  return (
    <div className="bg-card rounded-lg shadow-enterprise border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Search" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Find Your Meeting
          </h2>
          <p className="text-sm text-muted-foreground">
            Search for meetings by title, organizer, or location
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Input with Autocomplete */}
        <div className="relative">
          <Input
            label="Meeting Search"
            type="search"
            placeholder="Search meetings, organizers, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-12"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            disabled={isSearching}
            className="absolute right-2 top-8"
          >
            {isSearching ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Search" size={16} />
            )}
          </Button>
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-md shadow-enterprise-lg mt-1 max-h-48 overflow-y-auto">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-150 border-b border-border last:border-b-0"
                >
                  <div className="text-sm font-medium text-foreground">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Organized by {suggestion.organizer}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date and Type Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Meeting Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
          <Select
            label="Meeting Type"
            options={meetingTypeOptions}
            value={meetingType}
            onChange={setMeetingType}
          />
        </div>

        {/* Search Button */}
        <Button
          variant="default"
          onClick={handleSearch}
          loading={isSearching}
          iconName="Search"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          {isSearching ? 'Searching Meetings...' : 'Search Meetings'}
        </Button>
      </div>

      {/* Search Tips */}
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-sm font-medium text-foreground mb-2">Search Tips:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Type meeting title, organizer name, or location</li>
          <li>• Use date filter to find meetings on specific days</li>
          <li>• Filter by meeting type for targeted results</li>
          <li>• Search suggestions appear as you type</li>
        </ul>
      </div>
    </div>
  );
};

export default GuestSearchPanel;