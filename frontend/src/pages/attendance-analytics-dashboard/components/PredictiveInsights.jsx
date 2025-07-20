import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveInsights = () => {
  const [selectedInsight, setSelectedInsight] = useState(null);

  const insights = [
    {
      id: 1,
      type: 'risk',
      title: 'High Absence Risk Detected',
      description: 'Engineering team showing 15% increase in meeting absences over the past 2 weeks',
      impact: 'high',
      confidence: 87,
      recommendation: `Schedule one-on-one meetings with team leads to identify underlying issues.\nConsider adjusting meeting frequency or timing for better engagement.`,
      affectedEmployees: 12,
      estimatedCost: '$2,400',
      timeline: '2-3 weeks',
      icon: 'AlertTriangle'
    },
    {
      id: 2,
      type: 'opportunity',
      title: 'Optimal Meeting Time Identified',
      description: 'Tuesday 10:00 AM shows highest attendance rates across all departments',
      impact: 'medium',
      confidence: 92,
      recommendation: `Reschedule important meetings to Tuesday mornings for maximum participation.\nConsider blocking this time slot for critical team meetings.`,
      affectedEmployees: 45,
      estimatedSavings: '$1,800',
      timeline: '1 week',
      icon: 'TrendingUp'
    },
    {
      id: 3,
      type: 'efficiency',
      title: 'Meeting Duration Optimization',
      description: 'Meetings longer than 45 minutes show 23% higher late arrival rates',
      impact: 'medium',
      confidence: 78,
      recommendation: `Implement 30-45 minute meeting standards with clear agendas.\nUse time-boxing techniques to maintain focus and punctuality.`,
      affectedEmployees: 28,
      estimatedSavings: '$3,200',
      timeline: '2 weeks',
      icon: 'Clock'
    },
    {
      id: 4,
      type: 'trend',
      title: 'Remote vs In-Person Attendance',
      description: 'Hybrid meetings show 18% lower engagement than fully remote or in-person',
      impact: 'low',
      confidence: 65,
      recommendation: `Establish clear hybrid meeting protocols and technology standards.\nProvide training on effective hybrid meeting facilitation.`,
      affectedEmployees: 35,
      estimatedCost: '$1,200',
      timeline: '3-4 weeks',
      icon: 'Monitor'
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactBg = (impact) => {
    switch (impact) {
      case 'high': return 'bg-error/10';
      case 'medium': return 'bg-warning/10';
      case 'low': return 'bg-success/10';
      default: return 'bg-muted/10';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'risk': return 'AlertTriangle';
      case 'opportunity': return 'TrendingUp';
      case 'efficiency': return 'Zap';
      case 'trend': return 'BarChart3';
      default: return 'Info';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'risk': return 'text-error';
      case 'opportunity': return 'text-success';
      case 'efficiency': return 'text-primary';
      case 'trend': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border card-elevation">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Brain" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Predictive Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations based on attendance patterns
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
            <Button variant="outline" size="sm" iconName="Settings">
              Configure
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Insights List */}
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedInsight?.id === insight.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getImpactBg(insight.impact)}`}>
                    <Icon name={getTypeIcon(insight.type)} size={16} className={getTypeColor(insight.type)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {insight.title}
                      </h4>
                      <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {insight.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Target" size={12} />
                        <span>{insight.confidence}% confidence</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{insight.affectedEmployees} employees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Insight Details */}
          <div className="bg-muted/30 rounded-lg p-6">
            {selectedInsight ? (
              <div>
                <div className="flex items-start space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getImpactBg(selectedInsight.impact)}`}>
                    <Icon name={selectedInsight.icon} size={24} className={getTypeColor(selectedInsight.type)} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-heading font-semibold text-foreground mb-1">
                      {selectedInsight.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedInsight.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Impact Level</div>
                    <div className={`text-sm font-medium ${getImpactColor(selectedInsight.impact)}`}>
                      {selectedInsight.impact.charAt(0).toUpperCase() + selectedInsight.impact.slice(1)}
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                    <div className="text-sm font-medium text-foreground">
                      {selectedInsight.confidence}%
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                    <div className="text-sm font-medium text-foreground">
                      {selectedInsight.timeline}
                    </div>
                  </div>
                  <div className="bg-card rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {selectedInsight.estimatedCost ? 'Est. Cost' : 'Est. Savings'}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {selectedInsight.estimatedCost || selectedInsight.estimatedSavings}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="text-sm font-medium text-foreground mb-2">Recommendations</h5>
                  <div className="bg-card rounded-lg p-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedInsight.recommendation}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="default" size="sm" iconName="CheckCircle">
                    Implement
                  </Button>
                  <Button variant="outline" size="sm" iconName="Clock">
                    Schedule
                  </Button>
                  <Button variant="ghost" size="sm" iconName="X">
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-heading font-medium text-foreground mb-2">
                  Select an Insight
                </h4>
                <p className="text-sm text-muted-foreground">
                  Choose an insight from the list to view detailed recommendations and implementation steps.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveInsights;