import axios from '../axios';
import * as XLSX from 'xlsx';

export const generateReport = async (reportData) => {
  try {
    const response = await axios.post('/dashboard/generate-report', reportData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to generate report';
  }
};

export const exportReportToExcel = async (reportData) => {
  try {
    // First get the report data
    const response = await generateReport(reportData);
    
    // Create Excel workbook from the JSON data
    const workbook = generateExcelWorkbook(response);
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true 
    });
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `${reportData.report_type}_report_${reportData.period}.xlsx`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    throw error.message || 'Failed to export report';
  }
};

// Helper function to generate Excel workbook from report JSON
const generateExcelWorkbook = (reportData) => {
  const workbook = XLSX.utils.book_new();
  
  // Helper function to create styled headers
  const createStyledSheet = (data, sheetName) => {
    const sheet = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = [];
    data.forEach(row => {
      row.forEach((cell, colIndex) => {
        const cellLength = cell ? cell.toString().length : 0;
        if (!colWidths[colIndex] || colWidths[colIndex] < cellLength) {
          colWidths[colIndex] = Math.min(Math.max(cellLength + 2, 10), 50);
        }
      });
    });
    
    sheet['!cols'] = colWidths.map(width => ({ width }));
    
    // Apply styles to cells
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellAddress]) continue;
        
        const cellValue = sheet[cellAddress].v;
        
        // Style main headers (ALL CAPS sections)
        if (typeof cellValue === 'string' && 
            (cellValue.includes('SUMMARY') || cellValue.includes('ANALYTICS') || 
             cellValue.includes('TYPES') || cellValue.includes('STATUS') || 
             cellValue.includes('ACTIVITIES') || cellValue.includes('USERS') ||
             cellValue === 'REPORT SUMMARY' || cellValue === 'USER ANALYTICS' ||
             cellValue === 'REQUEST ANALYTICS' || cellValue === 'BLOTTER ANALYTICS' ||
             cellValue === 'ANNOUNCEMENTS' || cellValue === 'ACTIVITY LOGS')) {
          sheet[cellAddress].s = {
            font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2563EB" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
        // Style table headers (Metric, Value, etc.)
        else if (typeof cellValue === 'string' && 
                 (cellValue === 'Metric' || cellValue === 'Value' || cellValue === 'Type' || 
                  cellValue === 'Count' || cellValue === 'Document' || cellValue === 'Status' ||
                  cellValue === 'Percentage' || cellValue === 'Municipality' || cellValue === 'User' ||
                  cellValue === 'Activities' || cellValue === 'Module')) {
          sheet[cellAddress].s = {
            font: { bold: true, size: 11, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "059669" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
        // Style data rows
        else if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
          const isEvenRow = row % 2 === 0;
          sheet[cellAddress].s = {
            font: { size: 10 },
            fill: { fgColor: { rgb: isEvenRow ? "F8FAFC" : "FFFFFF" } },
            alignment: { horizontal: typeof cellValue === 'number' ? "right" : "left", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "E2E8F0" } },
              bottom: { style: "thin", color: { rgb: "E2E8F0" } },
              left: { style: "thin", color: { rgb: "E2E8F0" } },
              right: { style: "thin", color: { rgb: "E2E8F0" } }
            }
          };
          
          // Special formatting for percentages
          if (typeof cellValue === 'string' && cellValue.includes('%')) {
            sheet[cellAddress].s.font.color = { rgb: "059669" };
            sheet[cellAddress].s.font.bold = true;
          }
          
          // Special formatting for numbers
          if (typeof cellValue === 'number') {
            sheet[cellAddress].s.numFmt = '#,##0';
          }
        }
      }
    }
    
    return sheet;
  };
  
  // Create Summary sheet with improved formatting
  const summaryData = [
    ['📊 BARANGAY E-SERBISYO REPORT SUMMARY'],
    [''],
    ['📋 Report Information', ''],
    ['Report Title', reportData.report_info?.title || 'Monthly Report'],
    ['Generated Date', new Date(reportData.report_info?.generated_at || new Date()).toLocaleDateString()],
    ['Report Period From', reportData.report_info?.date_range?.from || 'N/A'],
    ['Report Period To', reportData.report_info?.date_range?.to || 'N/A'],
    ['Generated By', reportData.report_info?.generated_by || 'System Administrator'],
    [''],
    ['']
  ];

  // Add overview data if available
  if (reportData.data?.overview) {
    summaryData.push(['📈 OVERVIEW SUMMARY'], ['']);
    
    const overview = reportData.data.overview;
    if (overview.totals) {
      summaryData.push(['📊 SYSTEM TOTALS'], ['']);
      summaryData.push(['Metric', 'Value']);
      Object.entries(overview.totals).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        summaryData.push([`📋 ${formattedKey}`, typeof value === 'number' ? value.toLocaleString() : value]);
      });
      summaryData.push([''], ['']);
    }
    
    if (overview.rates) {
      summaryData.push(['🎯 PERFORMANCE RATES'], ['']);
      summaryData.push(['Metric', 'Percentage']);
      Object.entries(overview.rates).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        summaryData.push([`📊 ${formattedKey}`, `${value}%`]);
      });
      summaryData.push([''], ['']);
    }
    
    if (overview.averages) {
      summaryData.push(['📅 DAILY AVERAGES'], ['']);
      summaryData.push(['Metric', 'Value']);
      Object.entries(overview.averages).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        summaryData.push([`📈 ${formattedKey}`, typeof value === 'number' ? value.toLocaleString() : value]);
      });
    }
  }

  const summarySheet = createStyledSheet(summaryData, 'Summary');
  XLSX.utils.book_append_sheet(workbook, summarySheet, '📊 Summary');

  // Create Users sheet if data available
  if (reportData.data?.users) {
    const usersData = [
      ['👥 USER ANALYTICS REPORT'],
      [''],
      ['Generated on:', new Date().toLocaleDateString()],
      ['']
    ];
    
    const users = reportData.data.users;
    if (users.summary) {
      usersData.push(['📊 USER SUMMARY'], ['']);
      usersData.push(['Metric', 'Value']);
      Object.entries(users.summary).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        usersData.push([`👤 ${formattedKey}`, typeof value === 'number' ? value.toLocaleString() : value]);
      });
      usersData.push([''], ['']);
    }
    
    if (users.demographics?.by_type) {
      usersData.push(['🏷️ USER TYPES DISTRIBUTION'], ['']);
      usersData.push(['Type', 'Count']);
      users.demographics.by_type.forEach(item => {
        const icon = item.type.toLowerCase().includes('admin') ? '👨‍💼' : 
                    item.type.toLowerCase().includes('resident') ? '👨‍👩‍👧‍👦' : '👤';
        usersData.push([`${icon} ${item.type.toUpperCase()}`, item.count]);
      });
      usersData.push([''], ['']);
    }
    
    if (users.demographics?.by_municipality) {
      usersData.push(['🏘️ MUNICIPALITY DISTRIBUTION'], ['']);
      usersData.push(['Municipality', 'Count']);
      users.demographics.by_municipality.forEach(item => {
        usersData.push([`🏘️ ${item.municipality}`, item.count]);
      });
    }
    
    const usersSheet = createStyledSheet(usersData, 'Users');
    XLSX.utils.book_append_sheet(workbook, usersSheet, '👥 Users');
  }

  // Create Requests sheet if data available
  if (reportData.data?.requests) {
    const requestsData = [
      ['📋 DOCUMENT REQUEST ANALYTICS'],
      [''],
      ['Report Period:', `${reportData.report_info?.date_range?.from || 'N/A'} - ${reportData.report_info?.date_range?.to || 'N/A'}`],
      ['']
    ];
    
    const requests = reportData.data.requests;
    if (requests.summary) {
      requestsData.push(['📊 REQUEST SUMMARY'], ['']);
      requestsData.push(['Metric', 'Value']);
      Object.entries(requests.summary).forEach(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const icon = key.includes('total') ? '📄' : key.includes('pending') ? '⏳' : 
                    key.includes('approved') ? '✅' : key.includes('rejected') ? '❌' : '📊';
        requestsData.push([`${icon} ${formattedKey}`, typeof value === 'number' ? value.toLocaleString() : value]);
      });
      requestsData.push([''], ['']);
    }
    
    if (requests.document_analytics?.most_requested) {
      requestsData.push(['🏆 MOST REQUESTED DOCUMENTS'], ['']);
      requestsData.push(['Document', 'Count']);
      requests.document_analytics.most_requested.forEach((item, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄';
        requestsData.push([`${medal} ${item.document_name}`, item.count]);
      });
    }
    
    const requestsSheet = createStyledSheet(requestsData, 'Requests');
    XLSX.utils.book_append_sheet(workbook, requestsSheet, '📋 Requests');
  }

  // Create Blotters sheet if data available
  if (reportData.data?.blotters) {
    const blottersData = [
      ['⚖️ BLOTTER CASE ANALYTICS'],
      [''],
      ['📊 Case Overview', ''],
      ['Total Cases Filed', (reportData.data.blotters.total_cases || 0).toLocaleString()],
      ['Resolution Success Rate', `${reportData.data.blotters.resolution_rate || 0}%`],
      ['Report Period', `${reportData.report_info?.date_range?.from || 'N/A'} - ${reportData.report_info?.date_range?.to || 'N/A'}`],
      ['']
    ];
    
    if (reportData.data.blotters.by_status) {
      blottersData.push(['📋 CASE STATUS BREAKDOWN'], ['']);
      blottersData.push(['Status', 'Count']);
      reportData.data.blotters.by_status.forEach(item => {
        const icon = item.status.toLowerCase().includes('resolved') ? '✅' : 
                    item.status.toLowerCase().includes('pending') ? '⏳' : 
                    item.status.toLowerCase().includes('ongoing') ? '🔄' : '📄';
        blottersData.push([`${icon} ${item.status.toUpperCase()}`, item.count]);
      });
      blottersData.push([''], ['']);
    }
    
    if (reportData.data.blotters.by_case_type) {
      blottersData.push(['🏷️ CASE TYPE ANALYSIS'], ['']);
      blottersData.push(['Type', 'Count']);
      reportData.data.blotters.by_case_type.forEach(item => {
        blottersData.push([`⚖️ ${item.case_type}`, item.count]);
      });
    }
    
    const blottersSheet = createStyledSheet(blottersData, 'Blotters');
    XLSX.utils.book_append_sheet(workbook, blottersSheet, '⚖️ Blotters');
  }

  // Create Announcements sheet if data available
  if (reportData.data?.announcements) {
    const announcementsData = [
      ['📢 ANNOUNCEMENTS REPORT'],
      [''],
      ['📊 Summary Information', ''],
      ['Total Announcements Published', (reportData.data.announcements.total_announcements || 0).toLocaleString()],
      ['Report Period', `${reportData.report_info?.date_range?.from || 'N/A'} - ${reportData.report_info?.date_range?.to || 'N/A'}`],
      ['']
    ];
    
    if (reportData.data.announcements.by_type) {
      announcementsData.push(['🏷️ ANNOUNCEMENT CATEGORIES'], ['']);
      announcementsData.push(['Type', 'Count']);
      reportData.data.announcements.by_type.forEach(item => {
        const icon = item.type.toLowerCase().includes('event') ? '🎉' : 
                    item.type.toLowerCase().includes('notice') ? '📋' : 
                    item.type.toLowerCase().includes('emergency') ? '🚨' : '📢';
        announcementsData.push([`${icon} ${item.type.toUpperCase()}`, item.count]);
      });
    }
    
    const announcementsSheet = createStyledSheet(announcementsData, 'Announcements');
    XLSX.utils.book_append_sheet(workbook, announcementsSheet, '📢 Announcements');
  }

  // Create Activity Logs sheet if data available
  if (reportData.data?.activity_logs) {
    const activityData = [
      ['📊 SYSTEM ACTIVITY LOGS'],
      [''],
      ['📈 Activity Overview', ''],
      ['Total System Activities', (reportData.data.activity_logs.total_activities || 0).toLocaleString()],
      ['Monitoring Period', `${reportData.report_info?.date_range?.from || 'N/A'} - ${reportData.report_info?.date_range?.to || 'N/A'}`],
      ['']
    ];
    
    if (reportData.data.activity_logs.by_module) {
      activityData.push(['🔧 ACTIVITY BY SYSTEM MODULE'], ['']);
      activityData.push(['Module', 'Count']);
      reportData.data.activity_logs.by_module.forEach(item => {
        const icon = item.module.toLowerCase().includes('user') ? '👥' : 
                    item.module.toLowerCase().includes('document') ? '📋' : 
                    item.module.toLowerCase().includes('blotter') ? '⚖️' : 
                    item.module.toLowerCase().includes('announcement') ? '📢' : '🔧';
        activityData.push([`${icon} ${item.module}`, item.count]);
      });
      activityData.push([''], ['']);
    }
    
    if (reportData.data.activity_logs.top_users) {
      activityData.push(['🏆 MOST ACTIVE USERS'], ['']);
      activityData.push(['User', 'Activities']);
      reportData.data.activity_logs.top_users.forEach((item, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤';
        activityData.push([`${medal} ${item.user_name}`, item.count]);
      });
    }
    
    const activitySheet = createStyledSheet(activityData, 'Activity Logs');
    XLSX.utils.book_append_sheet(workbook, activitySheet, '📊 Activity Logs');
  }

  return workbook;
};