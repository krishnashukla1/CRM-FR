
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="space-y-3 mb-6">
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

//         <div className="mt-6 text-center text-sm text-gray-500">
//           <p>You'll be logged out automatically after completing an action.</p>
//           <p className="mt-1">Session will expire in 30 seconds.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;


//===========================================================================


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [testMode, setTestMode] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed?._id && parsed.name) setEmployee(parsed);
//         else console.warn('Invalid employee data', parsed);
//       } catch (err) {
//         console.error('Failed to parse user:', err);
//       }
//     }

//     const timer = setTimeout(() => {
//       if (!actionTaken) {
//         setMessage('Session expired. Logging out...');
//         performLogout();
//       }
//     }, 30000);

//     return () => clearTimeout(timer);
//   }, [actionTaken]);

//   const performLogout = () => {
//     ['token', 'user', 'employee', 'attendanceChecked'].forEach(key => localStorage.removeItem(key));
//     setTimeout(() => navigate('/login'), 2000);
//   };

// const handleDownload = async () => {
//   setLoading(true);
//   const employeeId = employee?._id;

//   if (!employeeId) {
//     setMessage('❌ Missing employee ID');
//     setLoading(false);
//     return;
//   }

//   try {
//     const res = await API.get(`/call-logs/summary/today/${employeeId}`);

//     const data = res.data;

//     const lines = [
//       `DAILY WORK REPORT - ${new Date().toLocaleDateString()}`,
//       `Employee: ${employee.name}`,
//       `ID: ${employee._id}`,
//       '',
//       '=== Tasks Completed ===',
//       `- Total Calls Handled: ${data.totalCalls || 0}`,
//       `- Sales Converted: ${data.salesCount || 0}`,
//       `- Rejections: ${data.rejectionCount || 0}`,
//       `- Profit Earned: $${data.profitEarned || 0}`,
//       `- Language Barrier Cases: ${data.languageBarriers || 0}`,
//       `- Top No‑Sale Reasons: ${
//         Object.entries(data.reasonBreakdown || {})
//           .map(([r, c]) => `${r} (${c})`)
//           .join(', ') || 'None'
//       }`,
//       '',
//       '=== Notes ===',
//       'All call logs saved successfully'
//     ];

//     const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
//     link.click();

//     setMessage('✅ Report downloaded successfully');
//     setActionTaken(true);
//     setTimeout(performLogout, 3000);
//   } catch (err) {
//     console.error('Report download failed:', err);
//     setMessage('❌ Failed to fetch call-summary');
//   } finally {
//     setLoading(false);
//   }
// };



//   // const handleSendEmail = async () => {
//   //   setLoading(true);
//   //   setMessage('');
//   //   // const token = localStorage.getItem('token');

//   //   try {
//   //     if (testMode) {
//   //       const resp = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email-test', {
//   //         method: 'POST',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify({
//   //           name: employee?.name,
//   //           role: employee?.role
//   //         })
//   //       });

//   //       const data = await resp.json();
//   //       if (!resp.ok) throw new Error(data.message);
//   //       setMessage('📧 Test email sent!');
//   //     } else {
//   //       // if (!token) throw new Error('No authentication token found');
//   //       if (!employee?._id) throw new Error('Missing employee ID');

//   //       const resp = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email', {
//   //         method: 'POST',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //           // Authorization: `Bearer ${token}`
//   //         },
//   //         body: JSON.stringify({ employeeId: employee._id })
//   //       });

//   //       const data = await resp.json();
//   //       if (!resp.ok) throw new Error(data.message);
//   //       setMessage('📧 Report sent to your email!');
//   //     }

//   //     setActionTaken(true);
//   //     setTimeout(performLogout, 3000);
//   //   } catch (err) {
//   //     console.error('Email error:', err);
//   //     setMessage(`❌ ${err.message}`);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleSendEmail = async () => {
//   setLoading(true);
//   setMessage('');

//   try {
//     if (!employee?._id) throw new Error('Missing employee ID');

//     // Step 1: Fetch call summary (same as download)
//     const summaryRes = await API.get(`/call-logs/summary/today/${employee._id}`);
//     const summary = summaryRes.data;

//     // Step 2: Send to email endpoint
//     const endpoint = testMode
//       ? 'https://crm-backend-f4lj.onrender.com/api/daily-report/email-test'
//       : 'https://crm-backend-f4lj.onrender.com/api/daily-report/email';

//     const body = testMode
//       ? {
//           name: employee.name,
//           role: employee.role,
//           summary, // include summary in test too if backend supports it
//         }
//       : {
//           employeeId: employee._id,
//           summary, // 💡 Send live summary data
//         };

//     const resp = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });

//     const data = await resp.json();
//     if (!resp.ok) throw new Error(data.message);

//     setMessage(testMode ? '📧 Test email sent!' : '📧 Report sent to your email!');
//     setActionTaken(true);
//     setTimeout(performLogout, 3000);
//   } catch (err) {
//     console.error('Email error:', err);
//     setMessage(`❌ ${err.message}`);
//   } finally {
//     setLoading(false);
//   }
// };

//   const toggleTestMode = () => {
//     setTestMode(prev => !prev);
//     setMessage(`Test mode ${!testMode ? 'enabled' : 'disabled'}`);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="space-y-3 mb-6">
//           <button
//             onClick={handleDownload}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Report'}
//           </button>

//           <button
//             onClick={handleSendEmail}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {loading ? 'Sending...' : '📧 Email Report'}
//           </button>

//           <button
//             onClick={toggleTestMode}
//             className={`w-full py-2 px-4 rounded-md font-medium ${
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
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         <p className="mt-6 text-center text-sm text-gray-500">
//           You'll be logged out automatically after completing an action.<br />
//           Session expires in 30 seconds.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;

//==============================1=============================================

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed?._id && parsed.name) setEmployee(parsed);
//         else console.warn('Invalid employee data', parsed);
//       } catch (err) {
//         console.error('Failed to parse user:', err);
//       }
//     }

//     const timer = setTimeout(() => {
//       if (!actionTaken) {
//         setMessage('Session expired. Logging out...');
//         performLogout();
//       }
//     }, 30000);

//     return () => clearTimeout(timer);
//   }, [actionTaken]);

//   const performLogout = () => {
//     ['token', 'user', 'employee', 'attendanceChecked'].forEach(key => localStorage.removeItem(key));
//     setTimeout(() => navigate('/login'), 2000);
//   };

//   const handleDownload = async () => {
//     setLoading(true);
//     const employeeId = employee?._id;

//     if (!employeeId) {
//       setMessage('❌ Missing employee ID');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await API.get(`/call-logs/summary/today/${employeeId}`);
//       const data = res.data;

//       const lines = [
//         `DAILY WORK REPORT - ${new Date().toLocaleDateString()}`,
//         `Employee: ${employee.name}`,
//         `ID: ${employee._id}`,
//         '',
//         '=== Tasks Completed ===',
//         `- Total Calls Handled: ${data.totalCalls || 0}`,
//         `- Sales Converted: ${data.salesCount || 0}`,
//         `- Rejections: ${data.rejectionCount || 0}`,
//         `- Profit Earned: $${data.profitEarned || 0}`,
//         `- Language Barrier Cases: ${data.languageBarriers || 0}`,
//         `- Top No‑Sale Reasons: ${
//           Object.entries(data.reasonBreakdown || {})
//             .map(([r, c]) => `${r} (${c})`)
//             .join(', ') || 'None'
//         }`,
//         '',
//         '=== Notes ===',
//         'All call logs saved successfully'
//       ];

//       const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
//       link.click();

//       setMessage('✅ Report downloaded successfully');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (err) {
//       console.error('Report download failed:', err);
//       setMessage('❌ Failed to fetch call-summary');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmail = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');

//       const summaryRes = await API.get(`/call-logs/summary/today/${employee._id}`);
//       const summary = summaryRes.data;

//       const resp = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email-test', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: employee.name,
//           role: employee.role,
//           summary
//         })
//       });

//       const data = await resp.json();
//       if (!resp.ok) throw new Error(data.message);

//       setMessage('📧 Report sent to your email!');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (err) {
//       console.error('Email error:', err);
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-md">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="space-y-3 mb-6">
//           <button
//             onClick={handleDownload}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Report'}
//           </button>

//           <button
//             onClick={handleSendEmail}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {loading ? 'Sending...' : '📧 Send E-mail'}
//           </button>
//         </div>

//         {message && (
//           <div className={`p-3 rounded-md text-center ${
//             message.includes('✅') || message.includes('📧')
//               ? 'bg-green-100 text-green-800'
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         <p className="mt-6 text-center text-sm text-gray-500">
//           You'll be logged out automatically after completing an action.<br />
//           Session expires in 30 seconds.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;

//============================2========================
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [callLogs, setCallLogs] = useState([]);
//   const [showCallLogs, setShowCallLogs] = useState(false);
//   const [summary, setSummary] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed?._id && parsed.name) setEmployee(parsed);
//         else console.warn('Invalid employee data', parsed);
//       } catch (err) {
//         console.error('Failed to parse user:', err);
//       }
//     }

//     const timer = setTimeout(() => {
//       if (!actionTaken) {
//         setMessage('Session expired. Logging out...');
//         performLogout();
//       }
//     }, 30000);

//     return () => clearTimeout(timer);
//   }, [actionTaken]);

//   const performLogout = () => {
//     ['token', 'user', 'employee', 'attendanceChecked'].forEach(key => localStorage.removeItem(key));
//     setTimeout(() => navigate('/login'), 2000);
//   };

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');

//       // Fetch both summary and detailed call logs
//       const [summaryRes, logsRes] = await Promise.all([
//         API.get(`/call-logs/summary/today/${employee._id}`),
//         API.get(`/call-logs/${employee._id}`)
//       ]);

//       setSummary(summaryRes.data);
//       setCallLogs(logsRes.data);
//       setShowCallLogs(true);
//       setActionTaken(true);
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//       setMessage('❌ Failed to fetch call data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async () => {
//     setLoading(true);
//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');

//       // Create detailed report content
//       const reportContent = [
//         `DAILY WORK REPORT - ${new Date().toLocaleDateString()}`,
//         `Employee: ${employee.name}`,
//         `ID: ${employee._id}\n`,
//         '=== SUMMARY ===',
//         `- Total Calls Handled: ${summary?.totalCalls || 0}`,
//         `- Sales Converted: ${summary?.salesCount || 0}`,
//         `- Rejections: ${summary?.rejectionCount || 0}`,
//         `- Profit Earned: $${summary?.profitEarned || 0}`,
//         `- Language Barrier Cases: ${summary?.languageBarriers || 0}`,
//         `- Top No‑Sale Reasons: ${
//           summary?.reasonBreakdown 
//             ? Object.entries(summary.reasonBreakdown)
//                 .map(([r, c]) => `${r} (${c})`)
//                 .join(', ')
//             : 'None'
//         }\n`,
//         '=== CALL DETAILS ===',
//         ...callLogs.map((log, index) => [
//           `\nCall ${index + 1}:`,
//           `- ID: ${log._id}`,
//           `- Type: ${log.typeOfCall}`,
//           `- Category: ${log.callCategory}`,
//           `- Reason: ${log.reasonForCall}`,
//           `- Description: ${log.callDescription}`,
//           `- Sale Converted: ${log.wasSaleConverted}`,
//           `- Profit: $${log.profitAmount || 0}`,
//           `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//           `- Customer: ${log.customerName}`,
//           `- Email: ${log.customerEmail || 'N/A'}`,
//           `- Phone: ${log.customerPhone}`,
//           `- Language: ${log.language}`,
//           `- Time: ${new Date(log.createdAt).toLocaleString()}`,
//         ].join('\n')),
//         '\n=== NOTES ===',
//         'All call logs saved successfully'
//       ].join('\n');

//       const blob = new Blob([reportContent], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `detailed-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
//       link.click();

//       setMessage('✅ Detailed report downloaded');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (err) {
//       console.error('Download failed:', err);
//       setMessage('❌ Failed to generate report');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: '2-digit', 
//       day: '2-digit',
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true
//     };
//     return new Date(dateString).toLocaleString('en-IN', options);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-4xl">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <button
//             onClick={fetchCallLogs}
//             disabled={loading}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
//             }`}
//           >
//             {loading ? 'Loading...' : '📞 View Full Call Logs'}
//           </button>

//           <button
//             onClick={handleDownload}
//             disabled={loading || !callLogs.length}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
//               loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//             } ${!callLogs.length ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Full Report'}
//           </button>
//         </div>

//         {message && (
//           <div className={`p-3 rounded-md text-center ${
//             message.includes('✅') ? 'bg-green-100 text-green-800' :
//             message.includes('❌') ? 'bg-red-100 text-red-800' :
//             'bg-blue-100 text-blue-800'
//           }`}>
//             {message}
//           </div>
//         )}

//         {showCallLogs && (
//           <div className="mt-6">
//             {summary && (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-bold text-lg mb-3">Daily Summary</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Total Calls</p>
//                     <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Sales Converted</p>
//                     <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Profit Earned</p>
//                     <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <h3 className="font-bold text-lg mb-3">Call Details</h3>
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//               {callLogs.length > 0 ? (
//                 callLogs.map((log, index) => (
//                   <div key={log._id} className="border rounded-lg overflow-hidden">
//                     <div className="bg-gray-100 p-3 flex justify-between items-center">
//                       <span className="font-medium">Call #{index + 1}</span>
//                       <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
//                     </div>
//                     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p><span className="font-medium">Type:</span> {log.typeOfCall}</p>
//                         <p><span className="font-medium">Category:</span> {log.callCategory}</p>
//                         <p><span className="font-medium">Reason:</span> {log.reasonForCall}</p>
//                         <p><span className="font-medium">Description:</span> {log.callDescription}</p>
//                       </div>
//                       <div>
//                         <p><span className="font-medium">Sale:</span> 
//                           <span className={`ml-2 px-2 py-1 rounded text-xs ${
//                             log.wasSaleConverted === 'Yes' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {log.wasSaleConverted}
//                           </span>
//                         </p>
//                         {log.wasSaleConverted === 'Yes' && (
//                           <p><span className="font-medium">Profit:</span> ${log.profitAmount}</p>
//                         )}
//                         {log.wasSaleConverted === 'No' && (
//                           <p><span className="font-medium">Reason:</span> {log.reasonForNoSale || 'Not specified'}</p>
//                         )}
//                         <p><span className="font-medium">Customer:</span> {log.customerName}</p>
//                         <p><span className="font-medium">Phone:</span> {log.customerPhone}</p>
//                         <p><span className="font-medium">Language:</span> {log.language}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-4 text-gray-500">No call logs found</p>
//               )}
//             </div>
//           </div>
//         )}

//         <p className="mt-6 text-center text-sm text-gray-500">
//           You'll be logged out automatically after completing an action.<br />
//           Session expires in 30 seconds.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default DailyReport;

//============================3========

// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [callLogs, setCallLogs] = useState([]);
//   const [showCallLogs, setShowCallLogs] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [todaysLogs, setTodaysLogs] = useState([]);
//   const [countdown, setCountdown] = useState(null);
//   const countdownIntervalRef = useRef(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed?._id && parsed.name) setEmployee(parsed);
//         else console.warn('Invalid employee data', parsed);
//       } catch (err) {
//         console.error('Failed to parse user:', err);
//       }
//     }

//     const timer = setTimeout(() => {
//       if (!actionTaken) {
//         setMessage('Session expired. Logging out...');
//         performLogout();
//       }
//     }, 30000);

//     return () => clearTimeout(timer);
//   }, [actionTaken]);

//   const performLogout = () => {
//     ['token', 'user', 'employee', 'attendanceChecked'].forEach(key => localStorage.removeItem(key));
//     setTimeout(() => navigate('/login'), 2000);
//   };
//   const startLogoutTimer = () => {
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current); // clear any existing interval
//     }
//     setCountdown(30); // 30 seconds to logout

//     // const intervalId = setInterval(() => {
//     countdownIntervalRef.current = setInterval(() => {
//       setCountdown(prev => {
//         if (prev === 1) {
//           // clearInterval(intervalId);
//           clearInterval(countdownIntervalRef.current);
//           countdownIntervalRef.current = null;
//           performLogout();
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };
//   // Optional: cleanup on component unmount
//   useEffect(() => {
//     return () => {
//       if (countdownIntervalRef.current) {
//         clearInterval(countdownIntervalRef.current);
//       }
//     };
//   }, []);


//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');

//       // Fetch both summary and detailed call logs
//       const today = new Date().toISOString().split('T')[0];
//       const [summaryRes, logsRes] = await Promise.all([
//         API.get(`/call-logs/summary/today/${employee._id}`),
//         API.get(`/call-logs/${employee._id}?date=${today}`)
//       ]);

//       setSummary(summaryRes.data);
//       setCallLogs(logsRes.data);
//       setTodaysLogs(logsRes.data.filter(log =>
//         new Date(log.createdAt).toISOString().split('T')[0] === today
//       ));
//       setShowCallLogs(true);
//       setActionTaken(true);
//       // Start logout timer after action taken
//       startLogoutTimer();
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//       setMessage('❌ Failed to fetch call data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReportContent = (logs) => {
//     return [
//       `DAILY WORK REPORT - ${new Date().toLocaleDateString()}`,
//       `Employee: ${employee.name}`,
//       `ID: ${employee._id}\n`,
//       '=== SUMMARY ===',
//       `- Total Calls Handled: ${summary?.totalCalls || 0}`,
//       `- Sales Converted: ${summary?.salesCount || 0}`,
//       `- Rejections: ${summary?.rejectionCount || 0}`,
//       `- Profit Earned: $${summary?.profitEarned || 0}`,
//       `- Language Barrier Cases: ${summary?.languageBarriers || 0}`,
//       `- Top No‑Sale Reasons: ${summary?.reasonBreakdown
//         ? Object.entries(summary.reasonBreakdown)
//           .map(([r, c]) => `${r} (${c})`)
//           .join(', ')
//         : 'None'
//       }\n`,
//       '=== CALL DETAILS ===',
//       ...logs.map((log, index) => [
//         `\nCall ${index + 1}:`,
//         `- ID: ${log._id}`,
//         `- Type: ${log.typeOfCall}`,
//         `- Category: ${log.callCategory}`,
//         `- Reason: ${log.reasonForCall}`,
//         `- Description: ${log.callDescription}`,
//         `- Sale Converted: ${log.wasSaleConverted}`,
//         `- Profit: $${log.profitAmount || 0}`,
//         `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//         `- Customer: ${log.customerName}`,
//         `- Email: ${log.customerEmail || 'N/A'}`,
//         `- Phone: ${log.customerPhone}`,
//         `- Language: ${log.language}`,
//         `- Time: ${new Date(log.createdAt).toLocaleString()}`,
//       ].join('\n')),
//       '\n=== NOTES ===',
//       'All call logs saved successfully'
//     ].join('\n');
//   };

//   const handleDownload = async () => {
//     setLoading(true);
//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');
//       if (todaysLogs.length === 0) throw new Error('No call logs for today');

//       const reportContent = generateReportContent(todaysLogs);

//       const blob = new Blob([reportContent], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
//       link.click();

//       setMessage('✅ Today\'s report downloaded');
//       setActionTaken(true);
//     } catch (err) {
//       console.error('Download failed:', err);
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmail = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');
//       if (todaysLogs.length === 0) throw new Error('No call logs to send');

//       const reportContent = generateReportContent(todaysLogs);

//       const resp = await fetch('https://crm-backend-f4lj.onrender.com/api/daily-report/email-test', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: employee.name,
//           role: employee.role,
//           reportContent,
//           summary: {
//             totalCalls: summary?.totalCalls || 0,
//             salesCount: summary?.salesCount || 0,
//             profitEarned: summary?.profitEarned || 0,
//             rejectionCount: summary?.rejectionCount || 0
//           }
//         })
//       });

//       const data = await resp.json();
//       if (!resp.ok) throw new Error(data.message || 'Failed to send email');

//       setMessage('📧 Daily report sent to HR successfully!');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (err) {
//       console.error('Email error:', err);
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     };
//     return new Date(dateString).toLocaleString('en-IN', options);
//   };


//   useEffect(() => {
//     const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed?._id && parsed.name) setEmployee(parsed);
//         else console.warn('Invalid employee data', parsed);
//       } catch (err) {
//         console.error('Failed to parse user:', err);
//       }
//     }

//     // 🔽 Start countdown as soon as page loads if no action taken yet
//     if (!actionTaken) {
//       startLogoutTimer();
//     }

//     // Backup timeout in case countdown logic fails
//     //   const timer = setTimeout(() => {
//     //     if (!actionTaken) {
//     //       setMessage('Session expired. Logging out...');
//     //       performLogout();
//     //     }
//     //   }, 30000);

//     //   return () => clearTimeout(timer);
//     // }, []);

// {message && (
//   <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-900 border border-green-400 font-medium px-6 py-3 rounded-lg shadow-md z-50 transition-all duration-300">
//     {message}
//   </div>
// )}


//     const timer = setTimeout(() => {
//       if (!actionTaken) {
//         // setMessage('⚠️ Your session has expired due to inactivity. Logging out...');
//          setMessage('✅ Session expired due to inactivity. Logging out...');
//         performLogout();
//       }
//     }, 30000); // 30 seconds timeout

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-4xl">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <button
//             onClick={fetchCallLogs}
//             disabled={loading}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
//               }`}
//           >
//             {loading ? 'Loading...' : '📞 View Today\'s Call Logs'}
//           </button>

//           <button
//             onClick={handleDownload}
//             disabled={loading || todaysLogs.length === 0}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
//               } ${todaysLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Today\'s Report'}
//           </button>

//           <button
//             onClick={handleSendEmail}
//             disabled={loading || todaysLogs.length === 0}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
//               } ${todaysLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             {loading ? 'Sending...' : '📧 Send Report to HR'}
//           </button>
//         </div>

//         {message && (
//           <div className={`p-3 rounded-md text-center ${message.includes('✅') || message.includes('📧')
//             ? 'bg-green-100 text-green-800'
//             : 'bg-red-100 text-red-800'
//             }`}>
//             {message}
//           </div>
//         )}

//         {showCallLogs && (
//           <div className="mt-6">
//             {summary && (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-bold text-lg mb-3">Today's Summary</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Total Calls</p>
//                     <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Sales Converted</p>
//                     <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Profit Earned</p>
//                     <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Rejections</p>
//                     <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <h3 className="font-bold text-lg mb-3">Today's Call Details ({todaysLogs.length})</h3>
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//               {todaysLogs.length > 0 ? (
//                 todaysLogs.map((log, index) => (
//                   <div key={log._id} className="border rounded-lg overflow-hidden">
//                     <div className="bg-gray-100 p-3 flex justify-between items-center">
//                       <span className="font-medium">Call #{index + 1}</span>
//                       <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
//                     </div>
//                     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p><span className="font-medium">Type:</span> {log.typeOfCall}</p>
//                         <p><span className="font-medium">Category:</span> {log.callCategory}</p>
//                         <p><span className="font-medium">Reason:</span> {log.reasonForCall}</p>
//                         <p><span className="font-medium">Description:</span> {log.callDescription}</p>
//                       </div>
//                       <div>
//                         <p><span className="font-medium">Sale:</span>
//                           <span className={`ml-2 px-2 py-1 rounded text-xs ${log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                             }`}>
//                             {log.wasSaleConverted}
//                           </span>
//                         </p>
//                         {log.wasSaleConverted === 'Yes' && (
//                           <p><span className="font-medium">Profit:</span> ${log.profitAmount}</p>
//                         )}
//                         {log.wasSaleConverted === 'No' && (
//                           <p><span className="font-medium">Reason:</span> {log.reasonForNoSale || 'Not specified'}</p>
//                         )}
//                         <p><span className="font-medium">Customer:</span> {log.customerName}</p>
//                         <p><span className="font-medium">Phone:</span> {log.customerPhone}</p>
//                         <p><span className="font-medium">Language:</span> {log.language}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-4 text-gray-500">No call logs found for today</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* <p className="mt-6 text-center text-sm text-gray-500">
//           You'll be logged out automatically after completing an action.<br />
//           Session expires in 30 seconds.
//         </p> */}

//         {/* {countdown !== null && (
//           <p className="mt-6 text-center text-sm text-red-600">
//             You'll be logged out automatically after completing an action.<br />
//             Session expires in {countdown} second{countdown !== 1 ? 's' : ''}.
//           </p>
//         )} */}
//         {countdown !== null && (
//           <div className="mt-6 animate-pulse">
//             <div className="flex flex-col items-center justify-center">
//               <div className="relative h-16 w-16">
//                 {/* Circular progress background */}
//                 <svg className="h-full w-full" viewBox="0 0 36 36">
//                   <path
//                     d="M18 2.0845
//              a 15.9155 15.9155 0 0 1 0 31.831
//              a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="#E5E7EB"
//                     strokeWidth="3"
//                   />
//                   {/* Animated progress bar */}
//                   <path
//                     d="M18 2.0845
//              a 15.9155 15.9155 0 0 1 0 31.831
//              a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="#EF4444"
//                     strokeWidth="3"
//                     strokeDasharray={`${100 - (countdown / 60) * 100}, 100`}
//                     className="transition-all duration-1000 ease-linear"
//                   />
//                 </svg>
//                 {/* Countdown number */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-lg font-bold text-red-600">{countdown}</span>
//                 </div>
//               </div>
//               <p className="mt-2 text-center text-sm font-medium text-red-600">
//                 Auto-logout in <span className="font-bold">{countdown}</span> second{countdown !== 1 ? 's' : ''}
//               </p>
//               <p className="text-xs text-gray-500 mt-1">Complete your action quickly</p>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default DailyReport;
//=========================
// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const DailyReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [actionTaken, setActionTaken] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [callLogs, setCallLogs] = useState([]);
//   const [showCallLogs, setShowCallLogs] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [todaysLogs, setTodaysLogs] = useState([]);
//   const [countdown, setCountdown] = useState(null);
//   const countdownIntervalRef = useRef(null);

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       const storedUser = localStorage.getItem('user') || localStorage.getItem('employee');
//       const userId = localStorage.getItem('userId');
//       const token = localStorage.getItem('token');

//       if (!token || !userId) {
//         setMessage('❌ Not authenticated. Redirecting to login...');
//         performLogout();
//         return;
//       }

//       if (storedUser) {
//         try {
//           const parsed = JSON.parse(storedUser);
//           if (parsed?._id && parsed.name) {
//             setEmployee(parsed);
//             return;
//           }
//         } catch (err) {
//           console.error('Failed to parse user:', err);
//         }
//       }

//       try {
//         const response = await API.get(`/employees/by-user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data?.employee) {
//           setEmployee(response.data.employee);
//           localStorage.setItem('employee', JSON.stringify(response.data.employee));
//         } else {
//           setMessage('❌ Employee record not found. Contact HR.');
//           setTimeout(() => navigate('/login'), 2000);
//         }
//       } catch (err) {
//         console.error('Failed to fetch employee:', err);
//         setMessage('❌ Failed to fetch employee data. Redirecting to login...');
//         performLogout();
//       }
//     };

//     fetchEmployeeData();

//     if (!actionTaken) {
//       startLogoutTimer();
//     }

//     return () => {
//       if (countdownIntervalRef.current) {
//         clearInterval(countdownIntervalRef.current);
//       }
//     };
//   }, [actionTaken]);

//   const performLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
//       }
//     } catch (err) {
//       console.error('Logout API error:', err);
//     } finally {
//       ['token', 'user', 'employee', 'attendanceChecked', 'employeeId', 'userId'].forEach((key) =>
//         localStorage.removeItem(key)
//       );
//       setTimeout(() => navigate('/login'), 1000);
//     }
//   };

//   const startLogoutTimer = () => {
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//     }
//     setCountdown(30);
//     countdownIntervalRef.current = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(countdownIntervalRef.current);
//           countdownIntervalRef.current = null;
//           performLogout();
//           return null;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const resetTimer = () => {
//     if (countdownIntervalRef.current) {
//       clearInterval(countdownIntervalRef.current);
//     }
//     setCountdown(null);
//     setActionTaken(true);
//   };

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');

//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Not authenticated');

//       const now = new Date();
//       const istOffset = 5.5 * 60 * 60 * 1000;
//       const today = new Date(now.getTime() + istOffset).toISOString().split('T')[0];

//       const [summaryRes, logsRes] = await Promise.all([
//         API.get(`/call-logs/summary/today/${employee._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         API.get(`/call-logs/${employee._id}?date=${today}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setSummary(summaryRes.data);
//       setCallLogs(logsRes.data);
//       setTodaysLogs(
//         logsRes.data.filter(
//           (log) => new Date(log.createdAt).toISOString().split('T')[0] === today
//         )
//       );
//       setShowCallLogs(true);
//       setActionTaken(true);
//       startLogoutTimer();
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//       setMessage(
//         err.message.includes('employee ID')
//           ? '❌ Employee ID missing. Please login again.'
//           : '❌ Failed to fetch call data. Please try again.'
//       );
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         performLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReportContent = (logs) => {
//     return [
//       `DAILY WORK REPORT - ${new Date().toLocaleDateString('en-IN')}`,
//       `Employee: ${employee?.name || 'Unknown'}`,
//       `ID: ${employee?._id || 'N/A'}\n`,
//       '=== SUMMARY ===',
//       `- Total Calls Handled: ${summary?.totalCalls || 0}`,
//       `- Sales Converted: ${summary?.salesCount || 0}`,
//       `- Rejections: ${summary?.rejectionCount || 0}`,
//       `- Profit Earned: $${summary?.profitEarned || 0}`,
//       `- Language Barrier Cases: ${summary?.languageBarriers || 0}`,
//       `- Top No-Sale Reasons: ${
//         summary?.reasonBreakdown
//           ? Object.entries(summary.reasonBreakdown)
//               .map(([r, c]) => `${r} (${c})`)
//               .join(', ')
//           : 'None'
//       }\n`,
//       '=== CALL DETAILS ===',
//       ...logs.map((log, index) => [
//         `\nCall ${index + 1}:`,
//         `- ID: ${log._id}`,
//         `- Type: ${log.typeOfCall}`,
//         `- Category: ${log.callCategory || 'N/A'}`,
//         `- Reason: ${log.reasonForCall}`,
//         `- Description: ${log.callDescription}`,
//         `- Sale Converted: ${log.wasSaleConverted}`,
//         `- Profit: $${log.profitAmount || 0}`,
//         `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//         `- Customer: ${log.customerName}`,
//         `- Email: ${log.customerEmail || 'N/A'}`,
//         `- Phone: ${log.customerPhone}`,
//         `- Language: ${log.language}`,
//         `- Time: ${new Date(log.createdAt).toLocaleString('en-IN')}`,
//       ].join('\n')),
//       '\n=== NOTES ===',
//       'All call logs saved successfully',
//     ].join('\n');
//   };

//   const handleDownload = async () => {
//     setLoading(true);
//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');
//       if (todaysLogs.length === 0) throw new Error('No call logs for today');

//       const reportContent = generateReportContent(todaysLogs);
//       const blob = new Blob([reportContent], { type: 'text/plain' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
//       link.click();

//       setMessage('✅ Today\'s report downloaded');
//       setActionTaken(true);
//       startLogoutTimer();
//     } catch (err) {
//       console.error('Download failed:', err);
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendEmail = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) throw new Error('Missing employee ID');
//       if (todaysLogs.length === 0) throw new Error('No call logs to send');

//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Not authenticated');

//       const reportContent = generateReportContent(todaysLogs);

//       const resp = await API.post(
//         '/daily-report/email',
//         {
//           name: employee.name,
//           role: employee.role,
//           reportContent,
//           summary: {
//             totalCalls: summary?.totalCalls || 0,
//             salesCount: summary?.salesCount || 0,
//             profitEarned: summary?.profitEarned || 0,
//             rejectionCount: summary?.rejectionCount || 0,
//           },
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setMessage('📧 Daily report sent to HR successfully!');
//       setActionTaken(true);
//       setTimeout(performLogout, 3000);
//     } catch (err) {
//       console.error('Email error:', err);
//       setMessage(
//         err.message.includes('employee ID')
//           ? '❌ Employee ID missing. Please login again.'
//           : `❌ ${err.response?.data?.message || 'Failed to send email'}`
//       );
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         performLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     };
//     return new Date(dateString).toLocaleString('en-IN', options);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-4xl">
//         <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
//           End of Day Report
//         </h2>
//         <p className="text-gray-600 text-center mb-6">
//           {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
//         </p>

//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <button
//             onClick={fetchCallLogs}
//             disabled={loading || !employee?._id}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
//               loading || !employee?._id
//                 ? 'bg-purple-400 cursor-not-allowed'
//                 : 'bg-purple-600 hover:bg-purple-700'
//             }`}
//           >
//             {loading ? 'Loading...' : '📞 View Today\'s Call Logs'}
//           </button>

//           <button
//             onClick={handleDownload}
//             disabled={loading || todaysLogs.length === 0 || !employee?._id}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
//               loading || todaysLogs.length === 0 || !employee?._id
//                 ? 'bg-blue-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : '⬇️ Download Today\'s Report'}
//           </button>

//           <button
//             onClick={handleSendEmail}
//             disabled={loading || todaysLogs.length === 0 || !employee?._id}
//             className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
//               loading || todaysLogs.length === 0 || !employee?._id
//                 ? 'bg-green-400 cursor-not-allowed'
//                 : 'bg-green-600 hover:bg-green-700'
//             }`}
//           >
//             {loading ? 'Sending...' : '📧 Send Report to HR'}
//           </button>
//         </div>

//         {message && (
//           <div
//             className={`p-3 rounded-md text-center ${
//               message.includes('✅') || message.includes('📧')
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-red-100 text-red-800'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {showCallLogs && (
//           <div className="mt-6">
//             {summary && (
//               <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <h3 className="font-bold text-lg mb-3">Today's Summary</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Total Calls</p>
//                     <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Sales Converted</p>
//                     <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Profit Earned</p>
//                     <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
//                   </div>
//                   <div className="bg-white p-3 rounded shadow">
//                     <p className="text-sm text-gray-500">Rejections</p>
//                     <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <h3 className="font-bold text-lg mb-3">Today's Call Details ({todaysLogs.length})</h3>
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//               {todaysLogs.length > 0 ? (
//                 todaysLogs.map((log, index) => (
//                   <div key={log._id} className="border rounded-lg overflow-hidden">
//                     <div className="bg-gray-100 p-3 flex justify-between items-center">
//                       <span className="font-medium">Call #{index + 1}</span>
//                       <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
//                     </div>
//                     <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p>
//                           <span className="font-medium">Type:</span> {log.typeOfCall}
//                         </p>
//                         <p>
//                           <span className="font-medium">Category:</span> {log.callCategory || 'N/A'}
//                         </p>
//                         <p>
//                           <span className="font-medium">Reason:</span> {log.reasonForCall}
//                         </p>
//                         <p>
//                           <span className="font-medium">Description:</span> {log.callDescription}
//                         </p>
//                       </div>
//                       <div>
//                         <p>
//                           <span className="font-medium">Sale:</span>
//                           <span
//                             className={`ml-2 px-2 py-1 rounded text-xs ${
//                               log.wasSaleConverted === 'Yes'
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}
//                           >
//                             {log.wasSaleConverted}
//                           </span>
//                         </p>
//                         {log.wasSaleConverted === 'Yes' && (
//                           <p>
//                             <span className="font-medium">Profit:</span> ${log.profitAmount}
//                           </p>
//                         )}
//                         {log.wasSaleConverted === 'No' && (
//                           <p>
//                             <span className="font-medium">Reason:</span>{' '}
//                             {log.reasonForNoSale || 'Not specified'}
//                           </p>
//                         )}
//                         <p>
//                           <span className="font-medium">Customer:</span> {log.customerName}
//                         </p>
//                         <p>
//                           <span className="font-medium">Phone:</span> {log.customerPhone}
//                         </p>
//                         <p>
//                           <span className="font-medium">Language:</span> {log.language}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center py-4 text-gray-500">
//                   {message.includes('Failed')
//                     ? 'Error fetching call logs. Please try again.'
//                     : 'No call logs found for today.'}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {countdown !== null && (
//           <div className="mt-6 animate-pulse">
//             <div className="flex flex-col items-center justify-center">
//               <div className="relative h-16 w-16">
//                 <svg className="h-full w-full" viewBox="0 0 36 36">
//                   <path
//                     d="M18 2.0845
//                      a 15.9155 15.9155 0 0 1 0 31.831
//                      a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="#E5E7EB"
//                     strokeWidth="3"
//                   />
//                   <path
//                     d="M18 2.0845
//                      a 15.9155 15.9155 0 0 1 0 31.831
//                      a 15.9155 15.9155 0 0 1 0 -31.831"
//                     fill="none"
//                     stroke="#EF4444"
//                     strokeWidth="3"
//                     strokeDasharray={`${100 - (countdown / 30) * 100}, 100`}
//                     className="transition-all duration-1000 ease-linear"
//                   />
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-lg font-bold text-red-600">{countdown}</span>
//                 </div>
//               </div>
//               <p className="mt-2 text-center text-sm font-medium text-red-600">
//                 Auto-logout in <span className="font-bold">{countdown}</span> second
//                 {countdown !== 1 ? 's' : ''}
//               </p>
//               <button
//                 onClick={resetTimer}
//                 className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Stay Logged In
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DailyReport;
//====================
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

  // const fetchCallLogs = async () => {
  //   setLoading(true);
  //   setMessage('');

  //   try {
  //     if (!employee?._id) {
  //       setMessage('❌ Employee ID missing. Please login again.');
  //       throw new Error('Missing employee ID');
  //     }

  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setMessage('❌ Not authenticated. Redirecting to login...');
  //       throw new Error('Not authenticated');
  //     }

  //     const now = new Date();
  //     const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  //     const today = new Date(now.getTime() + istOffset).toISOString().split('T')[0]; // e.g., "2025-08-07"

  //     console.log('Fetching call logs for employee:', employee._id, 'on date:', today);

  //     const [summaryRes, logsRes] = await Promise.all([
  //       API.get(`/call-logs/summary/today/${employee._id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //       API.get(`/call-logs/${employee._id}?date=${today}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }),
  //     ]);

  //     setSummary(summaryRes.data);
  //     setCallLogs(logsRes.data);
  //     setTodaysLogs(
  //       logsRes.data.filter((log) => new Date(log.createdAt).toISOString().split('T')[0] === today)
  //     );
  //     setShowCallLogs(true);
  //     setActionTaken(true);
  //     startLogoutTimer();
  //   } catch (err) {
  //     console.error('Failed to fetch call logs:', err);
  //     setMessage(
  //       err.message.includes('employee ID') || err.message.includes('authenticated')
  //         ? '❌ Session issue. Please login again.'
  //         : '❌ Failed to fetch call data. Please try again.'
  //     );
  //     if (err.response?.status === 401 || err.response?.status === 403) {
  //       performLogout();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };


// const fetchCallLogs = async () => {
//   setLoading(true);
//   setMessage('');

//   try {
//     if (!employee?._id) {
//       setMessage('❌ Employee ID missing. Please login again.');
//       throw new Error('Missing employee ID');
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setMessage('❌ Not authenticated. Redirecting to login...');
//       throw new Error('Not authenticated');
//     }

//     // Shift-aware date calculation (5 PM to 5 PM IST)
//     const now = new Date();
//     const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
//     const currentIST = new Date(now.getTime() + istOffset);
    
//     // Determine shift date (if before 5 PM IST, use previous day)
//     const shiftCutoffHour = 17; // 5 PM
//     let shiftDate = new Date(currentIST);
//     if (currentIST.getHours() < shiftCutoffHour) {
//       shiftDate.setDate(shiftDate.getDate() - 1);
//     }
//     const shiftDateString = shiftDate.toISOString().split('T')[0];
    
//     // Calculate exact shift window (5 PM to 5 PM)
//     const shiftStart = new Date(shiftDate);
//     shiftStart.setHours(shiftCutoffHour, 0, 0, 0);
//     const shiftEnd = new Date(shiftStart);
//     shiftEnd.setDate(shiftEnd.getDate() + 1);

//     console.log('Fetching data for shift:', {
//       shiftDate: shiftDateString,
//       windowStart: shiftStart.toISOString(),
//       windowEnd: shiftEnd.toISOString(),
//       currentIST: currentIST.toISOString()
//     });

//     const [summaryRes, logsRes] = await Promise.all([
//       API.get(`/call-logs/summary/today/${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           shift_start: shiftStart.toISOString(),
//           shift_end: shiftEnd.toISOString()
//         }
//       }),
//       API.get(`/call-logs/${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           shift_start: shiftStart.toISOString(),
//           shift_end: shiftEnd.toISOString()
//         }
//       }),
//     ]);

//     // Debug logs
//     console.log('Summary data:', summaryRes.data);
//     console.log('Raw logs count:', logsRes.data.length);

//     setSummary(summaryRes.data);
//     setCallLogs(logsRes.data);
    
//     // Filter logs that fall within the exact shift window
//     const filteredLogs = logsRes.data.filter(log => {
//       try {
//         const logDate = new Date(log.createdAt);
//         return logDate >= shiftStart && logDate < shiftEnd;
//       } catch (e) {
//         console.error('Error processing log date:', log.createdAt, e);
//         return false;
//       }
//     });

//     console.log('Filtered logs count:', filteredLogs.length);
//     setTodaysLogs(filteredLogs);
//     setShowCallLogs(true);

//     // Verify consistency between summary and filtered logs
//     if (summaryRes.data?.totalCalls !== filteredLogs.length) {
//       console.warn(`Data inconsistency: Summary shows ${summaryRes.data?.totalCalls} calls, but filtered ${filteredLogs.length} logs`);
//     }
//   } catch (err) {
//     console.error('Failed to fetch call logs:', err);
//     setMessage(
//       err.message.includes('employee ID') || err.message.includes('authenticated')
//         ? '❌ Session issue. Please login again.'
//         : '❌ Failed to fetch call data. Please try again.'
//     );
//   } finally {
//     setLoading(false);
//   }
// };




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

  // const handleSendEmail = async () => {
  //   setLoading(true);
  //   setMessage('');

  //   try {
  //     if (!employee?._id) throw new Error('Missing employee ID');
  //     if (todaysLogs.length === 0) throw new Error('No call logs to send');

  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');

  //     const reportContent = generateReportContent(todaysLogs);

  //     const resp = await API.post(
  //       '/daily-report/email',
  //       {
  //         name: employee.name,
  //         role: employee.role,
  //         reportContent,
  //         summary: {
  //           totalCalls: summary?.totalCalls || 0,
  //           salesCount: summary?.salesCount || 0,
  //           profitEarned: summary?.profitEarned || 0,
  //           rejectionCount: summary?.rejectionCount || 0,
  //         },
  //         toEmail: 'backend.9developer@gmail.com',
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setMessage('📧 Daily report sent to HR successfully!');
  //     setActionTaken(true);
  //     setTimeout(performLogout, 3000);
  //   } catch (err) {
  //     console.error('Email error:', err);
  //     setMessage(
  //       err.message.includes('employee ID') || err.message.includes('authenticated')
  //         ? '❌ Session issue. Please login again.'
  //         : `❌ ${err.response?.data?.message || 'Failed to send email'}`
  //     );
  //     if (err.response?.status === 401 || err.response?.status === 403) {
  //       performLogout();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
    const toEmail = employee.email || 'meneiljohnson@gmail.com';
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
            chargebackRefund:summary?.chargebackRefund || 0,
       netProfit:summary?.netProfit || 0,
        rejectionCount: summary?.rejectionCount || 0,
        languageBarriers: summary?.languageBarriers || 0,
        reasonBreakdown: summary?.reasonBreakdown || {}
      },
      // Removed reportContent since backend doesn't use it
            toEmail: 'meneiljohnson@gmail.com', // Replace with actual HR email

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 mb-2">
          End of Day Report
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {employee?.name ? `Good work today, ${employee.name}!` : 'Your daily report'}
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Today's Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Total Calls</p>
                    <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Sales Converted</p>
                    <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Profit Earned</p>
                    <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
                  </div>
                   <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Chargeback/Refund</p>
                    <p className="text-xl font-bold text-green-600">${summary.chargebackRefund || 0}</p>
                  </div>
                    <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Net Profit Earned</p>
                    <p className="text-xl font-bold text-green-600">${summary.netProfit || 0}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow">
                    <p className="text-sm text-gray-500">Rejections</p>
                    <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
                  </div>
                </div>
              </div>
            )}

            <h3 className="font-bold text-lg mb-3">Today's Call Details ({todaysLogs.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {todaysLogs.length > 0 ? (
                todaysLogs.map((log, index) => (
                  <div key={log._id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 p-3 flex justify-between items-center">
                      <span className="font-medium">Call #{index + 1}</span>
                      <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-center py-4 text-gray-500">
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
              <div className="relative h-16 w-16">
                <svg className="h-full w-full" viewBox="0 0 36 36">
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
              <p className="mt-2 text-center text-sm font-medium text-red-600">
                Auto-logout in <span className="font-bold">{countdown}</span> second
                {countdown !== 1 ? 's' : ''}
              </p>
              <button
                onClick={resetTimer}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
