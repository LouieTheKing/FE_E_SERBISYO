import React from 'react';
import { Users, FileText, AlertTriangle, MessageSquare, Bell, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from '../reusable/StatCard';

const ReportSummary = ({ data, selectedModules = [] }) => {
  const { overview, users, requests, blotters, feedbacks, announcements } = data || {};

  // Helper function to check if a module should be shown
  const shouldShowModule = (moduleKey) => {
    // If no modules are selected, show all modules
    if (selectedModules.length === 0) {
      return true;
    }
    // Otherwise, only show selected modules
    return selectedModules.includes(moduleKey);
  };

  // Only show stats for modules that are available in the data
  const summaryStats = [];
  
  // Add stats based on available data and selected modules
  if (overview?.totals && shouldShowModule('overview')) {
    if (overview.totals.hasOwnProperty('total_users') && shouldShowModule('users')) {
      summaryStats.push({
        icon: <Users className="text-blue-600" />,
        label: "Total Users",
        value: overview.totals.total_users || 0,
        color: "bg-white border-gray-200",
        trend: users?.summary?.activation_rate > 80 ? 1 : (users?.summary?.activation_rate !== undefined ? 0 : undefined),
        percentage: users?.summary?.activation_rate || 0
      });
    }
    
    if (overview.totals.hasOwnProperty('total_requests') && shouldShowModule('requests')) {
      summaryStats.push({
        icon: <FileText className="text-green-600" />,
        label: "Total Requests",
        value: overview.totals.total_requests || 0,
        color: "bg-white border-gray-200", 
        trend: requests?.performance_metrics?.completion_rate > 70 ? 1 : (requests?.performance_metrics?.completion_rate !== undefined ? 0 : undefined),
        percentage: requests?.performance_metrics?.completion_rate || 0
      });
    }
    
    if (overview.totals.hasOwnProperty('total_blotters') && shouldShowModule('blotters')) {
      summaryStats.push({
        icon: <AlertTriangle className="text-orange-600" />,
        label: "Blotter Cases",
        value: overview.totals.total_blotters || 0,
        color: "bg-white border-gray-200",
        trend: blotters?.resolution_rate > 50 ? 1 : (blotters?.resolution_rate !== undefined ? 0 : undefined),
        percentage: blotters?.resolution_rate || 0
      });
    }
    
    if (overview.totals.hasOwnProperty('total_feedbacks') && shouldShowModule('feedbacks')) {
      summaryStats.push({
        icon: <MessageSquare className="text-purple-600" />,
        label: "Feedbacks",
        value: overview.totals.total_feedbacks || 0,
        color: "bg-white border-gray-200",
        trend: feedbacks?.summary?.average_rating >= 4 ? 1 : (feedbacks?.summary?.average_rating !== undefined ? 0 : undefined),
        percentage: feedbacks?.summary?.satisfaction_rate || 0
      });
    }
    
    if (overview.totals.hasOwnProperty('total_announcements') && shouldShowModule('announcements')) {
      summaryStats.push({
        icon: <Bell className="text-indigo-600" />,
        label: "Announcements",
        value: overview.totals.total_announcements || 0,
        color: "bg-white border-gray-200",
        trend: undefined,
        percentage: 0
      });
    }
    
    if (overview.totals.hasOwnProperty('total_activity_logs') && shouldShowModule('activity_logs')) {
      summaryStats.push({
        icon: <Activity className="text-red-600" />,
        label: "Activity Logs",
        value: overview.totals.total_activity_logs || 0,
        color: "bg-white border-gray-200",
        trend: undefined,
        percentage: 0
      });
    }
  }

  // If no overview data but we have users data, show user-specific stats
  if (!overview && users?.summary && shouldShowModule('users')) {
    summaryStats.push({
      icon: <Users className="text-blue-600" />,
      label: "Registered Users",
      value: users.summary.total_registered || 0,
      color: "bg-white border-gray-200",
      trend: users.summary.activation_rate > 80 ? 1 : 0,
      percentage: users.summary.activation_rate || 0
    });
    
    summaryStats.push({
      icon: <Users className="text-green-600" />,
      label: "Active Users",
      value: users.summary.active_users || 0,
      color: "bg-white border-gray-200",
      trend: users.summary.activation_rate > 50 ? 1 : 0,
      percentage: users.summary.activation_rate || 0
    });
  }

  const KeyMetrics = () => {
    // Only show metrics if we have overview data and overview module is selected
    if (!overview?.rates && !overview?.averages && !users?.summary) {
      return null;
    }

    // Only show if overview is selected or no modules are selected
    if (!shouldShowModule('overview')) {
      return null;
    }

    const metrics = [];
    
    // Add metrics based on available data
    if (overview?.rates?.completion_rate !== undefined) {
      metrics.push({
        value: `${overview.rates.completion_rate.toFixed(1)}%`,
        label: "Request Completion Rate",
        color: "bg-blue-50 text-blue-600"
      });
    }
    
    if (overview?.rates?.satisfaction_rate !== undefined) {
      metrics.push({
        value: `${overview.rates.satisfaction_rate.toFixed(1)}%`,
        label: "Satisfaction Rate",
        color: "bg-green-50 text-green-600"
      });
    }
    
    if (overview?.rates?.blotter_resolution_rate !== undefined) {
      metrics.push({
        value: `${overview.rates.blotter_resolution_rate.toFixed(1)}%`,
        label: "Blotter Resolution Rate",
        color: "bg-orange-50 text-orange-600"
      });
    }
    
    if (overview?.averages?.processing_time_days !== undefined) {
      metrics.push({
        value: overview.averages.processing_time_days.toFixed(1),
        label: "Avg Processing Days",
        color: "bg-purple-50 text-purple-600"
      });
    }

    // Add user-specific metrics if available
    if (users?.summary?.activation_rate !== undefined) {
      metrics.push({
        value: `${users.summary.activation_rate.toFixed(1)}%`,
        label: "User Activation Rate",
        color: "bg-indigo-50 text-indigo-600"
      });
    }

    if (overview?.rates?.user_engagement_rate !== undefined) {
      metrics.push({
        value: `${overview.rates.user_engagement_rate.toFixed(1)}%`,
        label: "User Engagement Rate",
        color: "bg-teal-50 text-teal-600"
      });
    }

    if (metrics.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className={`text-center p-4 rounded-lg ${metric.color}`}>
              <div className={`text-2xl font-bold ${metric.color.split(' ')[1]}`}>
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuickInsights = () => {
    // Collect available insights
    const activeAreas = [];
    const performanceIndicators = [];

    // Most Active Areas
    if (requests?.document_analytics?.most_requested?.[0]?.document_name && shouldShowModule('requests')) {
      activeAreas.push({
        label: "Most Requested:",
        value: requests.document_analytics.most_requested[0].document_name
      });
    }
    
    if (blotters?.by_case_type?.[0]?.case_type && shouldShowModule('blotters')) {
      activeAreas.push({
        label: "Top Case Type:",
        value: blotters.by_case_type[0].case_type
      });
    }
    
    if (users?.demographics?.by_municipality?.[0]?.municipality && shouldShowModule('users')) {
      activeAreas.push({
        label: "Top Municipality:",
        value: users.demographics.by_municipality[0].municipality
      });
    }

    // Performance Indicators
    if (overview?.averages?.daily_users !== undefined && shouldShowModule('overview')) {
      performanceIndicators.push({
        label: "Daily User Registrations:",
        value: overview.averages.daily_users.toFixed(1),
        trend: overview.averages.daily_users > 1 ? 'up' : 'down'
      });
    }
    
    if (users?.summary?.daily_average_registrations !== undefined && shouldShowModule('users')) {
      performanceIndicators.push({
        label: "Daily Average Registrations:",
        value: users.summary.daily_average_registrations.toFixed(1),
        trend: users.summary.daily_average_registrations > 0.5 ? 'up' : 'down'
      });
    }
    
    if (overview?.averages?.daily_requests !== undefined && shouldShowModule('overview')) {
      performanceIndicators.push({
        label: "Daily Requests:",
        value: overview.averages.daily_requests.toFixed(1),
        trend: overview.averages.daily_requests > 5 ? 'up' : 'down'
      });
    }
    
    if (overview?.averages?.daily_blotters !== undefined && shouldShowModule('overview')) {
      performanceIndicators.push({
        label: "Daily Blotters:",
        value: overview.averages.daily_blotters.toFixed(1),
        trend: overview.averages.daily_blotters < 1 ? 'up' : 'down' // Less blotters is better
      });
    }

    // Show insights only if there's data
    if (activeAreas.length === 0 && performanceIndicators.length === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="space-y-4">
          
          {/* Most Active Areas */}
          {activeAreas.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Most Active Areas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {activeAreas.map((area, index) => (
                  <div key={index}>
                    <span className="text-gray-600">{area.label}</span>
                    <p className="font-medium">{area.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Indicators */}
          {performanceIndicators.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Performance Indicators</h4>
              <div className="space-y-2">
                {performanceIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{indicator.label}</span>
                    <div className="flex items-center gap-1">
                      {indicator.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="font-medium">{indicator.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      {summaryStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryStats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <KeyMetrics />

      {/* Quick Insights */}
      <QuickInsights />

      {/* If no data available, show message */}
      {summaryStats.length === 0 && !overview && !users && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-2">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Summary Data Available
          </h3>
          <p className="text-gray-600">
            The selected modules don't contain summary data. Try selecting the "Overview" module or switch to detailed view.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportSummary;