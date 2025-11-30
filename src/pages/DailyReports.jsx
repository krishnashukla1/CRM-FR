
//================================================TEST EMAIL IT IS WORKING===================

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [testMode, setTestMode] = useState(false); // Added test mode state

// useEffect(() => {

//   const storedUser = localStorage.getItem('user');

//   if (storedUser) {
//     try {
//       const parsedUser = JSON.parse(storedUser);
//       if (parsedUser && parsedUser._id && parsedUser.name) {
//         setEmployee(parsedUser);
//       } else {
//         console.warn('Invalid employee data in localStorage:', parsedUser);
//       }
//     } catch (err) {
//       console.error('Error parsing employee data:', err);
//     }
//   }

//   const autoLogoutTimer = setTimeout(() => {
//     if (!actionTaken) {
//       handleAutoLogout();
//     }
//   }, 30000);

//   return () => clearTimeout(autoLogoutTimer);
// }, [actionTaken]);


//   const handleAutoLogout = () => {
//     setMessage('Session expired. Logging out...');
//     performLogout();
//   };

//   const performLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('employee');
//     localStorage.removeItem('attendanceChecked');
//     setTimeout(() => navigate('/login'), 2000);
//   };

//   const handleDownload = () => {
//     setLoading(true);
//     try {
//       const reportContent = [
//         `DAILY WORK REPORT - ${new Date().toLocaleDateString()}`,
//         `Employee: ${employee?.name || 'N/A'}`,
//         `ID: ${employee?._id || 'N/A'}`,
//         '',
//         '=== Tasks Completed ===',
//         '- Completed project milestones',
//         '- Attended team meetings',
//         '- Resolved customer tickets',
//         '',
//         '=== Notes ===',
//         'All tasks completed successfully'
//       ].join('\n');

//       const blob = new Blob([reportContent], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `daily-report-${employee?._id || 'user'}-${new Date().toISOString().split('T')[0]}.txt`;
//       link.click();

//       setMessage('✅ Report downloaded successfully');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (error) {
//       setMessage('❌ Failed to download report');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmail = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (testMode) {
//         // Test mode - no auth needed
//         // const response = await fetch('http://localhost:5000/api/daily-report/email-test', {
//         const response = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email-test', {

//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: employee?.name || 'Test User',
//             role: employee?.role || 'Tester'
//           })
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Test failed');

//         setMessage('📧 Test email sent! Check backend.9developer@gmail.com');
//       } else {
//         // Production mode - requires proper auth
//         const token = localStorage.getItem('token');

//         if (!token) throw new Error('No authentication token found');
//         if (!employee?._id) throw new Error('Employee data missing');

//         // const response = await fetch('http://localhost:5000/api/daily-report/email', {
//         const response = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email', {

//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             employeeId: employee._id
//           })
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.message || 'Email failed');

//         setMessage('📧 Report sent to your email!');
//       }

//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (error) {
//       setMessage(`❌ ${error.message}`);
//       console.error('Email error details:', {
//         error,
//         testMode,
//         employee,
//         token: localStorage.getItem('token')
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleTestMode = () => {
//     setTestMode(!testMode);
//     setMessage(`Test mode ${!testMode ? 'enabled' : 'disabled'}`);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
//       <div className="w-full max-w-md p-6 bg-white shadow-md md:p-8 rounded-xl">
//         <h2 className="mb-2 text-xl font-bold text-center text-blue-600 md:text-2xl">
//           End of Day Report
//         </h2>
//         <p className="mb-6 text-center text-gray-600">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="mb-6 space-y-3">
//           <button
//             onClick={handleDownload}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
//               loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Report'}
//           </button>

//           <button
//             onClick={handleSendEmail}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
//               loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {loading ? 'Sending...' : '📧 Email Report'}
//           </button>


//           <button
//             onClick={toggleTestMode}
//             className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
//               testMode 
//                 ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
//                 : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
//             }`}
//           >
//             {testMode ? '🛑 Disable Test Mode' : '🧪 Enable Test Mode'}
//           </button>
//         </div>

//         {message && (
//           <div className={`p-3 rounded-md text-center ${
//             message.includes('✅') || message.includes('📧') || message.includes('Test mode')
//               ? 'bg-green-100 text-green-800' 
//               : message.includes('❌')
//                 ? 'bg-red-100 text-red-800'
//                 : 'bg-blue-100 text-blue-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         <div className="mt-6 text-sm text-center text-gray-500">
//           <p>You'll be logged out automatically after completing an action.</p>
//           <p className="mt-1">Session will expire in 30 seconds.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;
//=======================================================


import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { getShiftWindow } from '../components2/shiftDate';


const DailyReport = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [actionTaken, setActionTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [summary, setSummary] = useState(null);
  const [todaysLogs, setTodaysLogs] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!token || !userId) {
        setMessage('❌ Not authenticated. Redirecting to login...');
        performLogout();
        return;
      }

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?._id && parsed.name) {
            setEmployee(parsed);
            return;
          }
        } catch (err) {
          console.error('Failed to parse user:', err);
        }
      }

      try {
        const response = await API.get(`/employees/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.employee) {
          setEmployee(response.data.employee);
          localStorage.setItem('employee', JSON.stringify(response.data.employee));
        } else {
          setMessage('❌ Employee record not found. Contact HR.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Failed to fetch employee:', err);
        setMessage('❌ Failed to fetch employee data. Redirecting to login...');
        performLogout();
      }
    };

    fetchEmployeeData();
    fetchCallLogs(); // Ensure call logs are fetched on component mount

    if (!actionTaken) {
      startLogoutTimer();
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [actionTaken]);

  const performLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      ['token', 'user', 'employee', 'attendanceChecked', 'employeeId', 'userId'].forEach((key) =>
        localStorage.removeItem(key)
      );
      setEmployee(null);
      setCallLogs([]);
      setShowCallLogs(false);
      setSummary(null);
      setTodaysLogs([]);
      setTimeout(() => navigate('/login'), 1000);
    }
  };

  const startLogoutTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(30);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          performLogout();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setCountdown(null);
    setActionTaken(true);
    fetchCallLogs(); // Refresh data when resetting timer
  };

  const fetchCallLogs = async () => {
    setLoading(true);
    setMessage('');

    try {
      if (!employee?._id) throw new Error('Missing employee ID');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const { shiftDateString, shiftStartUTC, shiftEndUTC, currentIST } = getShiftWindow();

      console.log('Fetching for shift:', {
        shiftDateString,
        shiftStartUTC,
        shiftEndUTC,
        currentIST: currentIST.toISOString(),
      });

      const [summaryRes, logsRes] = await Promise.all([
        API.get(`/call-logs/summary/today/${employee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { shift_start: shiftStartUTC, shift_end: shiftEndUTC },
        }),
        API.get(`/call-logs/${employee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { shift_start: shiftStartUTC, shift_end: shiftEndUTC },
        }),
      ]);

      setSummary(summaryRes.data);

      const filteredLogs = logsRes.data.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= new Date(shiftStartUTC) && logDate < new Date(shiftEndUTC);
      });

      setCallLogs(filteredLogs);
      setTodaysLogs(filteredLogs);
      setShowCallLogs(true);

    } catch (err) {
      console.error('Failed to fetch call logs:', err);
      setMessage('❌ Failed to fetch call data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const generateReportContent = (logs) => {
    return [
      `DAILY WORK REPORT - ${new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}`,
      `Employee: ${employee?.name || 'Unknown'}`,
      `ID: ${employee?._id || 'N/A'}\n`,
      '=== SUMMARY ===',
      `- Total Calls Handled: ${summary?.totalCalls || 0}`,
      `- Sales Converted: ${summary?.salesCount || 0}`,
      `- Rejections: ${summary?.rejectionCount || 0}`,
      `- Profit Earned: $${summary?.profitEarned || 0}`,
      `- Chargeback/Refund: $${summary?.chargebackRefund || 0}`,
      `- Net Profit: $${summary?.netProfit || 0}`,
      `- Language Barrier Cases: ${summary?.languageBarriers || 0}`,
      `- Top No-Sale Reasons: ${summary?.reasonBreakdown
        ? Object.entries(summary.reasonBreakdown)
          .map(([r, c]) => `${r} (${c})`)
          .join(', ')
        : 'None'
      }\n`,
      '=== CALL DETAILS ===',
      ...logs.map((log, index) => [
        `\nCall ${index + 1}:`,
        `- ID: ${log._id}`,
        `- Call Direction: ${log.callDirection || 'N/A'}`,  // Added this line
        `- Type: ${log.typeOfCall}`,
        `- Category: ${log.callCategory || 'N/A'}`,
        `- Reason: ${log.reasonForCall}`,
        `- Description: ${log.callDescription}`,
        `- Sale Converted: ${log.wasSaleConverted}`,
        `- Sale Converted Through: ${log.saleConvertedThrough || 'N/A'}`,  // Added this line
        `- Profit: $${log.profitAmount || 0}`,
        `- Chargeback/Refund: $${log.chargebackRefund || 0}`,
        `- Net Profit: $${log.netProfit || 0}`,
        `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
        `- Customer: ${log.customerName}`,
        `- Email: ${log.customerEmail || 'N/A'}`,
        `- Phone: ${log.customerPhone}`,
        `- Language: ${log.language}`,
        `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}`,
      ].join('\n')),
      '\n=== NOTES ===',
      'All call logs saved successfully',
    ].join('\n');
  };

  //-------OR---fetchCallLogs, generateReportContent-----you can use this also if above not work-------

  /*
  const fetchCallLogs = async () => {
    setLoading(true);
    setMessage('');
  
    try {
      if (!employee?._id) throw new Error('Missing employee ID');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
  
      // Get shift window in proper timezone
      const now = dayjs().tz('Asia/Kolkata');
      const currentHour = now.hour();
      
      // Determine shift date (if before 5 PM IST, use previous day)
      const shiftDate = currentHour >= 17 ? now : now.subtract(1, 'day');
      const shiftDateString = shiftDate.format('YYYY-MM-DD');
      
      // Calculate exact shift window (5 PM to 5 PM IST)
      const shiftStart = dayjs.tz(`${shiftDateString} 17:00`, 'Asia/Kolkata');
      const shiftEnd = shiftStart.add(24, 'hours');
  
      console.log('Fetching for shift:', {
        shiftDate: shiftDateString,
        windowStart: shiftStart.format(),
        windowEnd: shiftEnd.format(),
        currentIST: now.format()
      });
  
      const [summaryRes, logsRes] = await Promise.all([
        API.get(`/call-logs/summary/today/${employee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            shift_start: shiftStart.toISOString(),
            shift_end: shiftEnd.toISOString()
          },
        }),
        API.get(`/call-logs/${employee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { 
            shift_start: shiftStart.toISOString(),
            shift_end: shiftEnd.toISOString()
          },
        }),
      ]);
  
      setSummary(summaryRes.data);
  
      // Filter logs in the exact shift window
      const filteredLogs = logsRes.data.filter(log => {
        const logDate = dayjs(log.createdAt).tz('Asia/Kolkata');
        return logDate.isAfter(shiftStart) && logDate.isBefore(shiftEnd);
      });
  
      setCallLogs(filteredLogs);
      setTodaysLogs(filteredLogs);
      setShowCallLogs(true);
  
    } catch (err) {
      console.error('Failed to fetch call logs:', err);
      setMessage('❌ Failed to fetch call data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const generateReportContent = (logs) => {
    // Get current IST time to determine the shift date
    const now = dayjs().tz('Asia/Kolkata');
    const reportDate = now.hour() >= 17 ? now : now.subtract(1, 'day');
  
    return [
      `DAILY WORK REPORT - ${reportDate.format('DD-MM-YYYY')} (Shift: 17:00 - 16:59 IST)`,
      `Employee: ${employee?.name || 'Unknown'}`,
      `ID: ${employee?._id || 'N/A'}\n`,
      '=== SUMMARY ===',
      `- Total Calls Handled: ${summary?.totalCalls || 0}`,
      `- Sales Converted: ${summary?.salesCount || 0}`,
      `- Rejections: ${summary?.rejectionCount || 0}`,
      `- Profit Earned: $${summary?.profitEarned || 0}`,
      `- Language Barrier Cases: ${summary?.languageBarriers || 0}`,
      `- Top No-Sale Reasons: ${
        summary?.reasonBreakdown
          ? Object.entries(summary.reasonBreakdown)
              .map(([r, c]) => `${r} (${c})`)
              .join(', ')
          : 'None'
      }\n`,
      '=== CALL DETAILS ===',
      ...logs.map((log, index) => [
        `\nCall ${index + 1}:`,
        `- ID: ${log._id}`,
        `- Call Direction: ${log.callDirection || 'N/A'}`,
        `- Type: ${log.typeOfCall}`,
        `- Category: ${log.callCategory || 'N/A'}`,
        `- Reason: ${log.reasonForCall}`,
        `- Description: ${log.callDescription}`,
        `- Sale Converted: ${log.wasSaleConverted}`,
        `- Sale Converted Through: ${log.saleConvertedThrough || 'N/A'}`,
        `- Profit: $${log.profitAmount || 0}`,
        `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
        `- Customer: ${log.customerName}`,
        `- Email: ${log.customerEmail || 'N/A'}`,
        `- Phone: ${log.customerPhone}`,
        `- Language: ${log.language}`,
        `- Time: ${dayjs(log.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A')}`,
      ].join('\n')),
      '\n=== NOTES ===',
      'All call logs saved successfully',
    ].join('\n');
  };
  
  */

  //-------------------------------------------------

  //notepad download
  // const handleDownload = async () => {
  //   setLoading(true);
  //   try {
  //       console.log("Using generateReportContent version:", generateReportContent.toString());

  //     if (!employee?._id) throw new Error('Missing employee ID');
  //     if (todaysLogs.length === 0) throw new Error('No call logs for today');

  //     const reportContent = generateReportContent(todaysLogs);
  //     const blob = new Blob([reportContent], { type: 'text/plain' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
  //     link.click();

  //     setMessage('✅ Today\'s report downloaded');
  //     setActionTaken(true);
  //     startLogoutTimer();
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //     setMessage(`❌ ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  //excel file download
  //   const handleDownload = async () => {
  //   setLoading(true);
  //   try {
  //     if (!employee?._id) throw new Error('Missing employee ID');
  //     if (todaysLogs.length === 0) throw new Error('No call logs for today');

  //     // Generate CSV content
  //     const csvHeader = "Call Time,Customer Name,Phone Number,Status\n";
  //     const csvRows = todaysLogs.map(log =>
  //       `${log.callTime},${log.customerName},${log.phoneNumber},${log.status}`
  //     ).join("\n");

  //     const csvContent = csvHeader + csvRows;

  //     // Create CSV blob
  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.csv`;
  //     link.click();

  //     setMessage('✅ Today\'s report downloaded as Excel (CSV)');
  //     setActionTaken(true);
  //     startLogoutTimer();
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //     setMessage(`❌ ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleDownload = async () => {
    setLoading(true);
    try {
      if (!employee?._id) throw new Error('Missing employee ID');
      if (todaysLogs.length === 0) throw new Error('No call logs for today');

      // Generate CSV header
      const headers = [
        'Call Time',
        'Call Direction',
        'Type',
        'Category',
        'Reason',
        'Description',
        'Sale Converted',
        'Sale Converted Through',
        'Profit Amount',
        'Chargeback/Refund',
        'Net Profit',
        'No Sale Reason',
        'Customer Name',
        'Customer Email',
        'Customer Phone',
        'Language'
      ];

      // Generate CSV rows
      const rows = todaysLogs.map(log => [
        formatDate(log.createdAt),
        log.callDirection || 'N/A',
        log.typeOfCall,
        log.callCategory || 'N/A',
        log.reasonForCall,
        log.callDescription,
        log.wasSaleConverted,
        log.saleConvertedThrough || 'N/A',
        log.profitAmount || 0,
        log.chargebackRefund || 0,
        log.netProfit || 0,
        log.reasonForNoSale || 'N/A',
        log.customerName,
        log.customerEmail || 'N/A',
        log.customerPhone,
        log.language
      ]);

      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create CSV blob
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      setMessage('✅ Today\'s report downloaded as Excel (CSV)');
      setActionTaken(true);
      startLogoutTimer();
    } catch (err) {
      console.error('Download failed:', err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };



  const handleSendEmail = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Validate prerequisites
      console.log('Employee data:', employee); // Debug: Log employee object
      if (!employee?._id) {
        throw new Error('Missing employee ID');
      }
      if (todaysLogs.length === 0) {
        throw new Error('No call logs to send');
      }
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug: Log token
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Use employee.email or fallback to a default
      // const toEmail = employee.email || 'meneiljohnson@gmail.com';
      const toEmail = employee.email || 'krishnaprasad24795@gmail.com';

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
        throw new Error('Invalid HR email address');
      }

      // Prepare payload matching backend expectations
      const payload = {
        employeeId: employee._id, // Required by backend
        email: toEmail, // Optional, defaults to employee.email in backend
        name: employee.name || 'Unknown Employee',
        role: employee.role || 'N/A',
        summary: {
          totalCalls: summary?.totalCalls || 0,
          salesCount: summary?.salesCount || 0,
          profitEarned: summary?.profitEarned || 0,
          chargebackRefund: summary?.chargebackRefund || 0,
          netProfit: summary?.netProfit || 0,
          rejectionCount: summary?.rejectionCount || 0,
          languageBarriers: summary?.languageBarriers || 0,
          reasonBreakdown: summary?.reasonBreakdown || {}
        },
        // Removed reportContent since backend doesn't use it
        toEmail: 'krishnaprasad24795@gmail.com', // Replace with actual HR email

      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2)); // Debug: Log payload

      // Make API call
      const resp = await API.post('/daily-report/email', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('Email sent successfully:', resp.data);
      setMessage('📧 Daily report sent to HR successfully!');
    } catch (err) {
      console.error('Email sending failed:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });

      let errorMessage = 'Failed to send email';
      if (err.message.includes('employee ID') || err.message.includes('authenticated')) {
        errorMessage = 'Session issue. Please login again.';
      } else if (err.message.includes('Invalid HR email')) {
        errorMessage = 'Invalid HR email address configured.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your network.';
      } else if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your network.';
      }

      setMessage(`❌ ${errorMessage}`);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn('Unauthorized or forbidden access. Initiating logout...');
        performLogout();
      }
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md md:p-8 rounded-xl">
        <h2 className="mb-2 text-xl font-bold text-center text-blue-600 md:text-2xl">
          End of Day Report
        </h2>
        <p className="mb-6 text-center text-gray-600">
          {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
        </p>

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <button
            onClick={fetchCallLogs}
            disabled={loading || !employee?._id}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading || !employee?._id
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            {loading ? 'Loading...' : '📞 View Today\'s Call Logs'}
          </button>

          <button
            onClick={handleDownload}
            disabled={loading || todaysLogs.length === 0 || !employee?._id}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading || todaysLogs.length === 0 || !employee?._id
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Processing...' : '⬇️ Download Today\'s Report'}
          </button>

          <button
            onClick={handleSendEmail}
            disabled={loading || todaysLogs.length === 0 || !employee?._id}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading || todaysLogs.length === 0 || !employee?._id
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {loading ? 'Sending...' : '📧 Send Report to HR'}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-center ${message.includes('✅') || message.includes('📧')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}
          >
            {message}
          </div>
        )}

        {showCallLogs && (
          <div className="mt-6">
            {summary && (
              <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <h3 className="mb-3 text-lg font-bold">Today's Summary</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Total Calls</p>
                    <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Sales Converted</p>
                    <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Profit Earned</p>
                    <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Chargeback/Refund</p>
                    <p className="text-xl font-bold text-green-600">${summary.chargebackRefund || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Net Profit Earned</p>
                    <p className="text-xl font-bold text-green-600">${summary.netProfit || 0}</p>
                  </div>
                  <div className="p-3 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Rejections</p>
                    <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
                  </div>
                </div>
              </div>
            )}

            <h3 className="mb-3 text-lg font-bold">Today's Call Details ({todaysLogs.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {todaysLogs.length > 0 ? (
                todaysLogs.map((log, index) => (
                  <div key={log._id} className="overflow-hidden border rounded-lg">
                    <div className="flex items-center justify-between p-3 bg-gray-100">
                      <span className="font-medium">Call #{index + 1}</span>
                      <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
                      <div>
                        <p>
                          <span className="font-medium">Type:</span> {log.typeOfCall}
                        </p>
                        <p>
                          <span className="font-medium">Call Direction:</span> {log.callDirection || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Category:</span> {log.callCategory || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Reason:</span> {log.reasonForCall}
                        </p>
                        <p>
                          <span className="font-medium">Description:</span> {log.callDescription}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-medium">Sale:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs ${log.wasSaleConverted === 'Yes'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {log.wasSaleConverted}
                          </span>
                        </p>

                        <p>
                          <span className="font-medium">Sale Converted Through:</span> {log.saleConvertedThrough || 'N/A'}
                        </p>
                        {log.wasSaleConverted === 'Yes' && (

                          <>
                            <p>
                              <span className="font-medium">Profit:</span> ${log.profitAmount}
                            </p>
                            <p>
                              <span className="font-medium">Chargeback/Refund:</span> ${log.chargebackRefund || 0}
                            </p>
                            <p>
                              <span className="font-medium">Net Profit:</span> ${log.netProfit || 0}
                            </p>
                          </>
                        )}
                        {log.wasSaleConverted === 'No' && (
                          <p>
                            <span className="font-medium">Reason:</span>{' '}
                            {log.reasonForNoSale || 'Not specified'}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Customer:</span> {log.customerName}
                        </p>
                        <p>
                          <span className="font-medium">Phone:</span> {log.customerPhone}
                        </p>
                        <p>
                          <span className="font-medium">Language:</span> {log.language}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  {message.includes('Failed')
                    ? 'Error fetching call logs. Please try again.'
                    : 'No call logs found for today.'}
                </p>
              )}
            </div>
          </div>
        )}

        {countdown !== null && (
          <div className="mt-6 animate-pulse">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray={`${100 - (countdown / 30) * 100}, 100`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600">{countdown}</span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-center text-red-600">
                Auto-logout in <span className="font-bold">{countdown}</span> second
                {countdown !== 1 ? 's' : ''}
              </p>
              <button
                onClick={resetTimer}
                className="px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Stay Logged In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReport;
