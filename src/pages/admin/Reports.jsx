import React, { useState } from 'react';
import { Calendar, Download, FileText, BarChart3, Users, MessageSquare, Bell, ClipboardList, Activity, FolderOpen } from 'lucide-react';
import { FaFilePdf, FaFileExcel, FaEye, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { generateReport, exportReportToExcel } from '../../api/reportApi';
import { showCustomToast } from '../../components/Toast/CustomToast';
import Select from '../../components/reusable/Select';
import ReportSummary from '../../components/reports/ReportSummary';
import ReportDetailView from '../../components/reports/ReportDetailView';

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    report_type: 'monthly',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    modules: [],
    format: 'json'
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'

  const reportTypeOptions = [
    { label: 'Monthly Report', value: 'monthly' },
    { label: 'Yearly Report', value: 'yearly' }
  ];

  const moduleOptions = [
    { label: 'Overview', value: 'overview', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Users', value: 'users', icon: <Users className="w-4 h-4" /> },
    { label: 'Requests', value: 'requests', icon: <FileText className="w-4 h-4" /> },
    { label: 'Blotters', value: 'blotters', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Feedbacks', value: 'feedbacks', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Announcements', value: 'announcements', icon: <Bell className="w-4 h-4" /> },
    { label: 'Certificates', value: 'certificates', icon: <FileText className="w-4 h-4" /> },
    { label: 'Activity Logs', value: 'activity_logs', icon: <Activity className="w-4 h-4" /> },
    { label: 'Documents', value: 'documents', icon: <FolderOpen className="w-4 h-4" /> }
  ];

  // Get current period suggestions
  const getCurrentPeriods = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const periods = [];
    
    if (reportConfig.report_type === 'monthly') {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth - 1 - i, 1);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        periods.push({ label, value: `${year}-${month}` });
      }
    } else {
      // Last 5 years
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i;
        periods.push({ label: year.toString(), value: year.toString() });
      }
    }
    
    return periods;
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      
      // Create request payload, excluding modules if empty
      const requestPayload = {
        report_type: reportConfig.report_type,
        period: reportConfig.period,
        format: reportConfig.format
      };
      
      // Only include modules if there are selected modules
      if (reportConfig.modules.length > 0) {
        requestPayload.modules = reportConfig.modules;
      }
      
      const response = await generateReport(requestPayload);
      setReportData(response);
      showCustomToast('Report generated successfully', 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      
      // Create request payload, excluding modules if empty
      const requestPayload = {
        report_type: reportConfig.report_type,
        period: reportConfig.period,
        format: reportConfig.format
      };
      
      // Only include modules if there are selected modules
      if (reportConfig.modules.length > 0) {
        requestPayload.modules = reportConfig.modules;
      }
      
      const result = await exportReportToExcel(requestPayload);
      showCustomToast(`Report exported successfully as ${result.filename}`, 'success');
    } catch (error) {
      showCustomToast(error.message || 'Failed to export report', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleModuleToggle = (moduleValue) => {
    setReportConfig(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleValue)
        ? prev.modules.filter(m => m !== moduleValue)
        : [...prev.modules, moduleValue]
    }));
  };

  const resetConfig = () => {
    setReportConfig({
      report_type: 'monthly',
      period: new Date().toISOString().slice(0, 7),
      modules: [],
      format: 'json'
    });
    setReportData(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-red-900" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Generate comprehensive reports for barangay operations and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaFilter className="text-red-900" />
              Report Configuration
            </h2>

            <div className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <Select
                  options={reportTypeOptions}
                  value={reportTypeOptions.find(opt => opt.value === reportConfig.report_type)}
                  onChange={(option) => setReportConfig(prev => ({ 
                    ...prev, 
                    report_type: option.value,
                    period: option.value === 'yearly' 
                      ? new Date().getFullYear().toString()
                      : new Date().toISOString().slice(0, 7)
                  }))}
                  isClearable={false}
                />
              </div>

              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period
                </label>
                <Select
                  options={getCurrentPeriods()}
                  value={getCurrentPeriods().find(opt => opt.value === reportConfig.period)}
                  onChange={(option) => setReportConfig(prev => ({ ...prev, period: option.value }))}
                  isClearable={false}
                />
              </div>

              {/* Module Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Include Modules (Optional)
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {moduleOptions.map((module) => (
                    <label 
                      key={module.value} 
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={reportConfig.modules.includes(module.value)}
                        onChange={() => handleModuleToggle(module.value)}
                        className="rounded border-gray-300 text-red-900 focus:ring-red-500"
                      />
                      <div className="ml-3 flex items-center gap-2">
                        {module.icon}
                        <span className="text-sm font-medium text-gray-700">
                          {module.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave empty to include all modules
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaEye />
                      Generate Report
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={exporting || !reportData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileExcel />
                      Export to Excel
                    </>
                  )}
                </button>

                <button
                  onClick={resetConfig}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset Configuration
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Display */}
        <div className="xl:col-span-2">
          {reportData ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {reportData.report_info?.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Period: {reportData.report_info?.date_range?.from} to {reportData.report_info?.date_range?.to}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'summary' ? 'detailed' : 'summary')}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {viewMode === 'summary' ? 'Detailed View' : 'Summary View'}
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Generated: {reportData.report_info?.generated_at}</p>
                  <p>Generated by: {reportData.report_info?.generated_by}</p>
                </div>
              </div>

              {/* Report Content */}
              {viewMode === 'summary' ? (
                <ReportSummary 
                  data={reportData.data} 
                  selectedModules={reportConfig.modules} 
                />
              ) : (
                <ReportDetailView 
                  data={reportData.data} 
                  selectedModules={reportConfig.modules} 
                />
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-md mx-auto">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Report Generated
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure your report settings and click "Generate Report" to view analytics and insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>Comprehensive Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Download className="w-4 h-4" />
                    <span>Excel Export</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;