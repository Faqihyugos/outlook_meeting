import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsWidgets = () => {
  // Mock analytics data
  const attendanceTrendData = [
    { month: 'Jul', attendance: 85 },
    { month: 'Aug', attendance: 88 },
    { month: 'Sep', attendance: 82 },
    { month: 'Oct', attendance: 90 },
    { month: 'Nov', attendance: 87 },
    { month: 'Dec', attendance: 92 },
    { month: 'Jan', attendance: 89 }
  ];

  const meetingTypeData = [
    { name: 'Team Meetings', value: 45, color: '#0078d4' },
    { name: 'Client Calls', value: 25, color: '#8764b8' },
    { name: 'Training', value: 15, color: '#107c10' },
    { name: 'Reviews', value: 15, color: '#ff8c00' }
  ];

  const frequentNoShows = [
    { name: 'Alex Thompson', meetings: 12, noShows: 8, rate: 67 },
    { name: 'Sarah Chen', meetings: 15, noShows: 6, rate: 40 },
    { name: 'Mike Rodriguez', meetings: 10, noShows: 4, rate: 40 },
    { name: 'Emma Wilson', meetings: 8, noShows: 3, rate: 38 }
  ];

  const weeklyStats = [
    { day: 'Mon', meetings: 24, attendance: 89 },
    { day: 'Tue', meetings: 31, attendance: 92 },
    { day: 'Wed', meetings: 28, attendance: 85 },
    { day: 'Thu', meetings: 35, attendance: 88 },
    { day: 'Fri', meetings: 22, attendance: 94 }
  ];

  const kpiData = [
    {
      title: 'Average Attendance',
      value: '89.2%',
      change: '+2.1%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'On-Time Rate',
      value: '76.8%',
      change: '-1.3%',
      trend: 'down',
      icon: 'Clock',
      color: 'text-warning'
    },
    {
      title: 'Meeting Effectiveness',
      value: '8.4/10',
      change: '+0.2',
      trend: 'up',
      icon: 'Star',
      color: 'text-success'
    },
    {
      title: 'No-Show Rate',
      value: '10.8%',
      change: '-0.5%',
      trend: 'down',
      icon: 'UserX',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={kpi.icon} size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${kpi.color}`}>
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Attendance Trend
            </h3>
            <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Meeting Types Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Meeting Types
            </h3>
            <Icon name="PieChart" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={meetingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {meetingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {meetingTypeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Performance & No-Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Weekly Performance
            </h3>
            <Icon name="Calendar" size={20} className="text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="day" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="meetings" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Frequent No-Shows */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Frequent No-Shows
            </h3>
            <Icon name="UserX" size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {frequentNoShows.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-medium">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{person.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {person.noShows}/{person.meetings} meetings
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-error">{person.rate}%</div>
                  <div className="text-xs text-muted-foreground">no-show rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meeting Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Meeting Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Peak Meeting Time</span>
            </div>
            <p className="text-xs text-blue-700">
              Most meetings occur between 10 AM - 11 AM with 94% attendance rate
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Optimal Size</span>
            </div>
            <p className="text-xs text-green-700">
              Meetings with 5-8 participants have the highest engagement scores
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Calendar" size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Best Day</span>
            </div>
            <p className="text-xs text-yellow-700">
              Tuesday meetings have the highest attendance and lowest cancellation rates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidgets;