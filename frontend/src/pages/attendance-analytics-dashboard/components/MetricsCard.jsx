import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, description, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-elevation">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-2xl font-heading font-semibold text-foreground">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      
      {trend && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                changeType === 'positive' ? 'bg-success' : 
                changeType === 'negative' ? 'bg-error' : 'bg-primary'
              }`}
              style={{ width: `${Math.abs(trend)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
};

export default MetricsCard;