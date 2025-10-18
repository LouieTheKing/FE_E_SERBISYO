import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, FileText, AlertTriangle, MessageSquare, Bell, Activity, FolderOpen, BarChart3 } from 'lucide-react';

const ReportDetailView = ({ data, selectedModules = [] }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper function to check if a module should be shown
  const shouldShowModule = (moduleKey) => {
    // If no modules are selected, show all modules
    if (selectedModules.length === 0) {
      return true;
    }
    // Otherwise, only show selected modules
    return selectedModules.includes(moduleKey);
  };

  const DetailSection = ({ title, icon, children, sectionKey }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );

  const OverviewSection = () => (
    <DetailSection
      title="Overview & Summary"
      icon={<BarChart3 className="text-blue-600 w-5 h-5" />}
      sectionKey="overview"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-blue-800">
            {data.overview?.totals?.total_users || 0}
          </div>
          <div className="text-sm text-blue-600">Total Users</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-green-800">
            {data.overview?.totals?.total_requests || 0}
          </div>
          <div className="text-sm text-green-600">Total Requests</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-orange-800">
            {data.overview?.totals?.total_blotters || 0}
          </div>
          <div className="text-sm text-orange-600">Total Blotters</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-lg font-semibold text-purple-800">
            {data.overview?.totals?.total_feedbacks || 0}
          </div>
          <div className="text-sm text-purple-600">Total Feedbacks</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Performance Rates</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completion Rate:</span>
              <span className="font-medium">{data.overview?.rates?.completion_rate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Satisfaction Rate:</span>
              <span className="font-medium">{data.overview?.rates?.satisfaction_rate?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Blotter Resolution:</span>
              <span className="font-medium">{data.overview?.rates?.blotter_resolution_rate?.toFixed(1) || 0}%</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Daily Averages</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Users:</span>
              <span className="font-medium">{data.overview?.averages?.daily_users?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Requests:</span>
              <span className="font-medium">{data.overview?.averages?.daily_requests?.toFixed(1) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Processing Time (days):</span>
              <span className="font-medium">{data.overview?.averages?.processing_time_days?.toFixed(1) || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );

  const UsersSection = () => (
    <DetailSection
      title="User Analytics"
      icon={<Users className="text-green-600 w-5 h-5" />}
      sectionKey="users"
    >
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-gray-800">
              {data.users?.summary?.total_registered || 0}
            </div>
            <div className="text-sm text-gray-600">Total Registered</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-gray-800">
              {data.users?.summary?.active_users || 0}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-gray-800">
              {data.users?.summary?.activation_rate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Activation Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">By User Type</h4>
            <div className="space-y-2">
              {data.users?.demographics?.by_type?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{item.type}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">By Municipality</h4>
            <div className="space-y-2">
              {data.users?.demographics?.by_municipality?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.municipality}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );

  const RequestsSection = () => (
    <DetailSection
      title="Request Analytics"
      icon={<FileText className="text-blue-600 w-5 h-5" />}
      sectionKey="requests"
    >
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-blue-800">
              {data.requests?.summary?.total_requests || 0}
            </div>
            <div className="text-sm text-blue-600">Total Requests</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-green-800">
              {data.requests?.summary?.completed_requests || 0}
            </div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-yellow-800">
              {data.requests?.summary?.pending_requests || 0}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-red-800">
              {data.requests?.summary?.rejected_requests || 0}
            </div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Performance Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <span className="font-medium">{data.requests?.performance_metrics?.completion_rate?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rejection Rate:</span>
                <span className="font-medium">{data.requests?.performance_metrics?.rejection_rate?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Processing Time:</span>
                <span className="font-medium">{data.requests?.performance_metrics?.average_processing_time_days?.toFixed(1) || 0} days</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Most Requested</h4>
            <div className="space-y-2">
              {data.requests?.document_analytics?.most_requested?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.document_name}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );

  const BlottersSection = () => (
    <DetailSection
      title="Blotter Cases"
      icon={<AlertTriangle className="text-orange-600 w-5 h-5" />}
      sectionKey="blotters"
    >
      <div className="mt-4 space-y-6">
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-semibold text-orange-800">
                {data.blotters?.total_cases || 0}
              </div>
              <div className="text-sm text-orange-600">Total Cases</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-orange-800">
                {data.blotters?.resolution_rate?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-orange-600">Resolution Rate</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">By Status</h4>
            <div className="space-y-2">
              {data.blotters?.by_status?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{item.status}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">By Case Type</h4>
            <div className="space-y-2">
              {data.blotters?.by_case_type?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.case_type}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );

  const FeedbacksSection = () => (
    <DetailSection
      title="Feedback Analytics"
      icon={<MessageSquare className="text-purple-600 w-5 h-5" />}
      sectionKey="feedbacks"
    >
      <div className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-purple-800">
              {data.feedbacks?.summary?.total_feedbacks || 0}
            </div>
            <div className="text-sm text-purple-600">Total Feedbacks</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-purple-800">
              {data.feedbacks?.summary?.average_rating?.toFixed(1) || 0}/5
            </div>
            <div className="text-sm text-purple-600">Average Rating</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-purple-800">
              {data.feedbacks?.summary?.satisfaction_rate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-purple-600">Satisfaction Rate</div>
          </div>
        </div>

        {data.feedbacks?.rating_analysis?.by_rating?.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {data.feedbacks.rating_analysis.by_rating.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.rating} Star:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DetailSection>
  );

  const AnnouncementsSection = () => (
    <DetailSection
      title="Announcements"
      icon={<Bell className="text-indigo-600 w-5 h-5" />}
      sectionKey="announcements"
    >
      <div className="mt-4 space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-semibold text-indigo-800">
            {data.announcements?.total_announcements || 0}
          </div>
          <div className="text-sm text-indigo-600">Total Announcements</div>
        </div>

        <div>
          <h4 className="font-medium text-gray-800 mb-3">By Type</h4>
          <div className="space-y-2">
            {data.announcements?.by_type?.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{item.type}:</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DetailSection>
  );

  const ActivityLogsSection = () => (
    <DetailSection
      title="Activity Logs"
      icon={<Activity className="text-red-600 w-5 h-5" />}
      sectionKey="activity_logs"
    >
      <div className="mt-4 space-y-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-semibold text-red-800">
            {data.activity_logs?.total_activities || 0}
          </div>
          <div className="text-sm text-red-600">Total Activities</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">By Module</h4>
            <div className="space-y-2">
              {data.activity_logs?.by_module?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.module}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Top Users</h4>
            <div className="space-y-2">
              {data.activity_logs?.top_users?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.user_name}:</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DetailSection>
  );

  return (
    <div className="space-y-4">
      {/* Conditionally show modules based on selection and data availability */}
      {shouldShowModule('overview') && data.overview && <OverviewSection />}
      {shouldShowModule('users') && data.users && <UsersSection />}
      {shouldShowModule('requests') && data.requests && <RequestsSection />}
      {shouldShowModule('blotters') && data.blotters && <BlottersSection />}
      {shouldShowModule('feedbacks') && data.feedbacks && <FeedbacksSection />}
      {shouldShowModule('announcements') && data.announcements && <AnnouncementsSection />}
      {shouldShowModule('activity_logs') && data.activity_logs && <ActivityLogsSection />}
      
      {/* Show message if no modules are visible */}
      {selectedModules.length > 0 && 
       !['overview', 'users', 'requests', 'blotters', 'feedbacks', 'announcements', 'activity_logs'].some(
         module => shouldShowModule(module) && data[module]
       ) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-2">
            <Activity className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Data Available for Selected Modules
          </h3>
          <p className="text-gray-600">
            The selected modules don't contain data for this period. Try selecting different modules or change the report period.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportDetailView;