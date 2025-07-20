import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import AttendanceChart from './components/AttendanceChart';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import PredictiveInsights from './components/PredictiveInsights';
import IntegrationStatus from './components/IntegrationStatus';

const AttendanceAnalyticsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    department: 'all',
    meetingType: 'all',
    employeeRole: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Overall Attendance Rate',
      value: '87.3%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Users',
      description: 'Average attendance across all meetings',
      trend: 87
    },
    {
      title: 'Meeting Frequency',
      value: '342',
      change: '+15',
      changeType: 'positive',
      icon: 'Calendar',
      description: 'Total meetings this month',
      trend: 78
    },
    {
      title: 'Cost Per Meeting',
      value: '$127',
      change: '-$8',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'Average cost based on attendance',
      trend: 65
    },
    {
      title: 'Late Arrivals',
      value: '12.4%',
      change: '+1.2%',
      changeType: 'negative',
      icon: 'Clock',
      description: 'Percentage of late attendees',
      trend: 12
    }
  ];

  // Mock data for charts
  const attendanceByDepartment = [
    { name: 'Engineering', value: 89 },
    { name: 'Marketing', value: 92 },
    { name: 'Sales', value: 85 },
    { name: 'HR', value: 94 },
    { name: 'Finance', value: 88 },
    { name: 'Operations', value: 91 }
  ];

  const attendanceByTimeOfDay = [
    { name: '9:00 AM', value: 95 },
    { name: '10:00 AM', value: 92 },
    { name: '11:00 AM', value: 88 },
    { name: '12:00 PM', value: 75 },
    { name: '1:00 PM', value: 82 },
    { name: '2:00 PM', value: 89 },
    { name: '3:00 PM', value: 91 },
    { name: '4:00 PM', value: 87 },
    { name: '5:00 PM', value: 78 }
  ];

  const meetingTypeDistribution = [
    { name: 'Daily Standups', value: 35 },
    { name: 'Review Meetings', value: 25 },
    { name: 'Planning Sessions', value: 20 },
    { name: 'Training', value: 12 },
    { name: 'All Hands', value: 8 }
  ];

  const weeklyTrend = [
    { name: 'Week 1', value: 85 },
    { name: 'Week 2', value: 87 },
    { name: 'Week 3', value: 89 },
    { name: 'Week 4', value: 87 },
    { name: 'Week 5', value: 91 },
    { name: 'Week 6', value: 88 },
    { name: 'Week 7', value: 92 }
  ];

  // Mock data for performance table
  const performanceData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      department: 'Engineering',
      attendanceRate: 96,
      meetingsAttended: 28,
      lateArrivals: 2,
      status: 'high',
      role: 'Senior Developer'
    },
    {
      id: 2,
      name: 'Michael Chen',
      department: 'Marketing',
      attendanceRate: 94,
      meetingsAttended: 22,
      lateArrivals: 1,
      status: 'high',
      role: 'Marketing Manager'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      department: 'Sales',
      attendanceRate: 91,
      meetingsAttended: 25,
      lateArrivals: 3,
      status: 'medium',
      role: 'Sales Representative'
    },
    {
      id: 4,
      name: 'David Kim',
      department: 'HR',
      attendanceRate: 98,
      meetingsAttended: 31,
      lateArrivals: 0,
      status: 'high',
      role: 'HR Specialist'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      department: 'Finance',
      attendanceRate: 87,
      meetingsAttended: 19,
      lateArrivals: 4,
      status: 'medium',
      role: 'Financial Analyst'
    },
    {
      id: 6,
      name: 'James Wilson',
      department: 'Operations',
      attendanceRate: 82,
      meetingsAttended: 16,
      lateArrivals: 6,
      status: 'low',
      role: 'Operations Coordinator'
    }
  ];

  const performanceColumns = [
    { key: 'name', label: 'Employee', sortable: true, type: 'avatar' },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'attendanceRate', label: 'Attendance Rate', sortable: true, type: 'percentage' },
    { key: 'meetingsAttended', label: 'Meetings', sortable: true, type: 'number' },
    { key: 'lateArrivals', label: 'Late Arrivals', sortable: true, type: 'number' },
    { key: 'status', label: 'Performance', sortable: true, type: 'status' }
  ];

  // Mock data for meeting effectiveness table
  const meetingEffectivenessData = [
    {
      id: 1,
      meetingTitle: 'Weekly Engineering Standup',
      organizer: 'Sarah Johnson',
      attendanceRate: 94,
      avgDuration: 25,
      costPerMeeting: 145,
      effectiveness: 'high',
      frequency: 'Weekly'
    },
    {
      id: 2,
      meetingTitle: 'Product Review Meeting',
      organizer: 'Michael Chen',
      attendanceRate: 89,
      avgDuration: 60,
      costPerMeeting: 280,
      effectiveness: 'medium',
      frequency: 'Bi-weekly'
    },
    {
      id: 3,
      meetingTitle: 'Sales Team Huddle',
      organizer: 'Emily Rodriguez',
      attendanceRate: 91,
      avgDuration: 30,
      costPerMeeting: 165,
      effectiveness: 'high',
      frequency: 'Daily'
    },
    {
      id: 4,
      meetingTitle: 'Monthly All Hands',
      organizer: 'David Kim',
      attendanceRate: 96,
      avgDuration: 90,
      costPerMeeting: 450,
      effectiveness: 'high',
      frequency: 'Monthly'
    },
    {
      id: 5,
      meetingTitle: 'Budget Planning Session',
      organizer: 'Lisa Thompson',
      attendanceRate: 78,
      avgDuration: 120,
      costPerMeeting: 520,
      effectiveness: 'low',
      frequency: 'Quarterly'
    }
  ];

  const effectivenessColumns = [
    { key: 'meetingTitle', label: 'Meeting Title', sortable: true },
    { key: 'organizer', label: 'Organizer', sortable: true },
    { key: 'frequency', label: 'Frequency', sortable: true },
    { key: 'attendanceRate', label: 'Attendance', sortable: true, type: 'percentage' },
    { key: 'avgDuration', label: 'Avg Duration (min)', sortable: true, type: 'number' },
    { key: 'costPerMeeting', label: 'Cost per Meeting', sortable: true, type: 'number' },
    { key: 'effectiveness', label: 'Effectiveness', sortable: true, type: 'status' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  const handleExport = (format) => {
    // Handle export functionality
    console.log(`Exporting data as ${format}`);
    // In a real app, this would trigger a download
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Analytics Dashboard - Outlook Meeting Tracker</title>
          <meta name="description" content="Comprehensive attendance analytics and insights for data-driven meeting management decisions." />
        </Helmet>
        
        <Header />
        <Sidebar />
        
        <main className="lg:ml-64 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Loading Analytics Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Fetching attendance data and generating insights...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Analytics Dashboard - Outlook Meeting Tracker</title>
        <meta name="description" content="Comprehensive attendance analytics and insights for data-driven meeting management decisions." />
      </Helmet>
      
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Attendance Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights and trends for meeting attendance optimization
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Filters Panel */}
          <FilterPanel 
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
          />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                description={metric.description}
                trend={metric.trend}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceChart
              type="bar"
              data={attendanceByDepartment}
              title="Attendance Rate by Department"
              height={300}
            />
            <AttendanceChart
              type="line"
              data={attendanceByTimeOfDay}
              title="Attendance by Time of Day"
              height={300}
            />
            <AttendanceChart
              type="pie"
              data={meetingTypeDistribution}
              title="Meeting Type Distribution"
              height={300}
            />
            <AttendanceChart
              type="line"
              data={weeklyTrend}
              title="Weekly Attendance Trend"
              height={300}
            />
          </div>

          {/* Data Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <DataTable
              title="Employee Performance"
              data={performanceData}
              columns={performanceColumns}
              actions={true}
            />
            <DataTable
              title="Meeting Effectiveness"
              data={meetingEffectivenessData}
              columns={effectivenessColumns}
              actions={true}
            />
          </div>

          {/* Advanced Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PredictiveInsights />
            <IntegrationStatus />
          </div>

          {/* Footer */}
          <div className="text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Outlook Meeting Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceAnalyticsDashboard;