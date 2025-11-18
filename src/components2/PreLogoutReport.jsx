// import React, { useEffect, useState } from 'react';

// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const PreLogoutReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [callLogs, setCallLogs] = useState([]);
//   const [showCallLogs, setShowCallLogs] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [todaysLogs, setTodaysLogs] = useState([]);

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       const userId = localStorage.getItem('userId');
//       const token = localStorage.getItem('token');

//       if (!token || !userId) {
//         setMessage('❌ Not authenticated. Redirecting to login...');
//         performLogout();
//         return;
//       }

//       try {
//         const response = await API.get(`/employees/by-user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data?.employee) {
//           setEmployee(response.data.employee);
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
//     fetchCallLogs();

//     return () => {};
//   }, []);

//   const performLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token) {
//         await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
//       }
//     } catch (err) {
//       console.error('Logout API error:', err);
//     } finally {
//       ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
//         (key) => localStorage.removeItem(key)
//       );
//       setTimeout(() => navigate('/login'), 1000);
//     }
//   };

//   const fetchCallLogs = async () => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) {
//         setMessage('❌ Employee ID missing. Please login again.');
//         throw new Error('Missing employee ID');
//       }

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('❌ Not authenticated. Redirecting to login...');
//         throw new Error('Not authenticated');
//       }

//       const now = new Date();
//       const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
//       const today = new Date(now.getTime() + istOffset).toISOString().split('T')[0]; // e.g., "2025-08-07"

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
//         logsRes.data.filter((log) => new Date(log.createdAt).toISOString().split('T')[0] === today)
//       );
//       setShowCallLogs(true);
//     } catch (err) {
//       console.error('Failed to fetch call logs:', err);
//       setMessage(
//         err.message.includes('employee ID') || err.message.includes('authenticated')
//           ? '❌ Session issue. Please login again.'
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
//       `DAILY WORK REPORT - ${new Date().toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       })}`,
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
//         `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: true,
//         })}`,
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
//     } catch (err) {
//       console.error('Email error:', err);
//       setMessage(
//         err.message.includes('employee ID') || err.message.includes('authenticated')
//           ? '❌ Session issue. Please login again.'
//           : `❌ ${err.response?.data?.message || 'Failed to send email'}`
//       );
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         performLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmLogout = () => {
//     performLogout();
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
//       <div className="w-full max-w-4xl p-6 bg-white shadow-md md:p-8 rounded-xl">
//         <h2 className="mb-2 text-xl font-bold text-center text-blue-600 md:text-2xl">
//           End of Day Report (Pre-Logout)
//         </h2>
//         <p className="mb-6 text-center text-gray-600">
//           {employee?.name ? `Review your work, ${employee.name}, before logging out!` : 'Your daily report'}
//         </p>

//         <div className="flex flex-col gap-4 mb-6 md:flex-row">
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
//               <div className="p-4 mb-6 rounded-lg bg-gray-50">
//                 <h3 className="mb-3 text-lg font-bold">Today's Summary</h3>
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Total Calls</p>
//                     <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Sales Converted</p>
//                     <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Profit Earned</p>
//                     <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Rejections</p>
//                     <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <h3 className="mb-3 text-lg font-bold">Today's Call Details ({todaysLogs.length})</h3>
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//               {todaysLogs.length > 0 ? (
//                 todaysLogs.map((log, index) => (
//                   <div key={log._id} className="overflow-hidden border rounded-lg">
//                     <div className="flex items-center justify-between p-3 bg-gray-100">
//                       <span className="font-medium">Call #{index + 1}</span>
//                       <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
//                     </div>
//                     <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
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
//                 <p className="py-4 text-center text-gray-500">
//                   {message.includes('Failed')
//                     ? 'Error fetching call logs. Please try again.'
//                     : 'No call logs found for today.'}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         <button
//           onClick={handleConfirmLogout}
//           className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600"
//         >
//           Confirm Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PreLogoutReport;

//===========================

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const PreLogoutReport = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [callLogs, setCallLogs] = useState([]);
//   const [showCallLogs, setShowCallLogs] = useState(false);
//   const [summary, setSummary] = useState(null);
//   const [todaysLogs, setTodaysLogs] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const userId = localStorage.getItem('userId');
//       const token = localStorage.getItem('token');

//       if (!token || !userId) {
//         setMessage('❌ Not authenticated. Redirecting to login...');
//         performLogout();
//         return;
//       }

//       try {
//         const response = await API.get(`/employees/by-user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data?.employee) {
//           setEmployee(response.data.employee);
//         } else {
//           setMessage('❌ Employee record not found. Contact HR.');
//           setTimeout(() => navigate('/login'), 2000);
//         }
//       } catch (err) {
//         console.error('Failed to fetch employee:', err);
//         setMessage('❌ Failed to fetch employee data. Redirecting to login...');
//         performLogout();
//       }

//       if (employee?._id) {
//         await fetchCallLogs();
//       }
//     };

//     fetchData();

//     return () => {};
//   }, []);

//   // const performLogout = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (token) {
//   //       try {
//   //         await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
//   //       } catch (logoutErr) {
//   //         console.warn('Logout API not found or failed:', logoutErr.message);
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error('Logout API error:', err);
//   //   } finally {
//   //     ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
//   //       (key) => localStorage.removeItem(key)
//   //     );
//   //     setTimeout(() => navigate('/login'), 1000);
//   //   }
//   // };


// const performLogout = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const employeeId = employee?._id || localStorage.getItem('employeeId');

//     if (!employeeId) {
//       console.error('Logout failed: No employeeId found');
//       setMessage('❌ Employee ID missing. Unable to logout properly.');
//       return;
//     }

//     if (!token) {
//       console.error('Logout failed: No token found');
//       setMessage('❌ Not authenticated. Unable to logout properly.');
//       return;
//     }

//     // Call backend to update logoutTime
//     await API.post(
//       '/login-hours/logout',
//       { employeeId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log('Logout API called successfully');

//     // Optionally call auth logout API
//     try {
//       await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
//       console.log('Auth logout API called successfully');
//     } catch (logoutErr) {
//       console.warn('Auth logout API not found or failed:', logoutErr.message);
//     }
//   } catch (err) {
//     console.error('Logout process error:', err.response?.data || err.message);
//     setMessage('❌ Failed to logout properly. Please try again.');
//   } finally {
//     // Clear all session data
//     ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
//       (key) => localStorage.removeItem(key)
//     );
//     setTimeout(() => navigate('/login'), 1000);
//   }
// };

//   const fetchCallLogs = async (retries = 2) => {
//     setLoading(true);
//     setMessage('');

//     try {
//       if (!employee?._id) {
//         setMessage('❌ Employee ID missing. Please login again.');
//         throw new Error('Missing employee ID');
//       }

//       const token = localStorage.getItem('token');
//       if (!token) {
//         setMessage('❌ Not authenticated. Redirecting to login...');
//         throw new Error('Not authenticated');
//       }

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
//         logsRes.data.filter((log) => new Date(log.createdAt).toISOString().split('T')[0] === today)
//       );
//       setShowCallLogs(true);
//     } catch (err) {
//       if (retries > 0 && !err.response?.status) {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         return fetchCallLogs(retries - 1);
//       }
//       console.error('Failed to fetch call logs:', err);
//       setMessage(
//         err.message.includes('employee ID') || err.message.includes('authenticated')
//           ? '❌ Session issue. Please login again.'
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
//       `DAILY WORK REPORT - ${new Date().toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       })}`,
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
//         `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//           hour: '2-digit',
//           minute: '2-digit',
//           hour12: true,
//         })}`,
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

//       const payload = {
//         name: employee.name,
//         role: employee.role,
//         reportContent,
//         summary: {
//           totalCalls: summary?.totalCalls || 0,
//           salesCount: summary?.salesCount || 0,
//           profitEarned: summary?.profitEarned || 0,
//           rejectionCount: summary?.rejectionCount || 0,
//         },
//         toEmail: 'hr@example.com', // Replace with actual HR email
//       };

//       const resp = await API.post('/daily-report/email', payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('Email response:', resp.data);
//       setMessage('📧 Daily report sent to HR successfully!');
//     } catch (err) {
//       console.error('Email error:', err.response?.data || err.message);
//       setMessage(
//         err.message.includes('employee ID') || err.message.includes('authenticated')
//           ? '❌ Session issue. Please login again.'
//           : `❌ ${err.response?.data?.message || 'Failed to send email'}`
//       );
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         performLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmLogout = () => {
//     performLogout();
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
//       <div className="w-full max-w-4xl p-6 bg-white shadow-md md:p-8 rounded-xl">
//         <h2 className="mb-2 text-xl font-bold text-center text-blue-600 md:text-2xl">
//           End of Day Report (Pre-Logout)
//         </h2>
//         <p className="mb-6 text-center text-gray-600">
//           {employee?.name ? `Review your work, ${employee.name}, before logging out!` : 'Your daily report'}
//         </p>

//         <div className="flex flex-col gap-4 mb-6 md:flex-row">
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
//               <div className="p-4 mb-6 rounded-lg bg-gray-50">
//                 <h3 className="mb-3 text-lg font-bold">Today's Summary</h3>
//                 <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Total Calls</p>
//                     <p className="text-xl font-bold">{summary.totalCalls || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Sales Converted</p>
//                     <p className="text-xl font-bold text-green-600">{summary.salesCount || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Profit Earned</p>
//                     <p className="text-xl font-bold text-green-600">${summary.profitEarned || 0}</p>
//                   </div>
//                   <div className="p-3 bg-white rounded shadow">
//                     <p className="text-sm text-gray-500">Rejections</p>
//                     <p className="text-xl font-bold text-red-600">{summary.rejectionCount || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <h3 className="mb-3 text-lg font-bold">Today's Call Details ({todaysLogs.length})</h3>
//             <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//               {todaysLogs.length > 0 ? (
//                 todaysLogs.map((log, index) => (
//                   <div key={log._id} className="overflow-hidden border rounded-lg">
//                     <div className="flex items-center justify-between p-3 bg-gray-100">
//                       <span className="font-medium">Call #{index + 1}</span>
//                       <span className="text-sm text-gray-600">{formatDate(log.createdAt)}</span>
//                     </div>
//                     <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
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
//                 <p className="py-4 text-center text-gray-500">
//                   {message.includes('Failed')
//                     ? 'Error fetching call logs. Please try again.'
//                     : 'No call logs found for today.'}
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         <button
//           onClick={handleConfirmLogout}
//           className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600"
//         >
//           Confirm Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PreLogoutReport;

///=================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);


const PreLogoutReport = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [summary, setSummary] = useState(null);
  const [todaysLogs, setTodaysLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!token || !userId) {
        setMessage('❌ Not authenticated. Redirecting to login...');
        performLogout();
        return;
      }

      try {
        const response = await API.get(`/employees/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.employee) {
          setEmployee(response.data.employee);
        } else {
          setMessage('❌ Employee record not found. Contact HR.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        console.error('Failed to fetch employee:', err);
        setMessage('❌ Failed to fetch employee data. Redirecting to login...');
        performLogout();
      }

      if (employee?._id) {
        await fetchCallLogs();
      }
    };

    fetchData();

    return () => {};
  }, []);

  // const performLogout = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
  //       } catch (logoutErr) {
  //         console.warn('Logout API not found or failed:', logoutErr.message);
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Logout API error:', err);
  //   } finally {
  //     ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
  //       (key) => localStorage.removeItem(key)
  //     );
  //     setTimeout(() => navigate('/login'), 1000);
  //   }
  // };


// const performLogout = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const employeeId = employee?._id || localStorage.getItem('employeeId');

//     if (!employeeId) {
//       console.error('Logout failed: No employeeId found');
//       setMessage('❌ Employee ID missing. Unable to logout properly.');
//       return;
//     }

//     if (!token) {
//       console.error('Logout failed: No token found');
//       setMessage('❌ Not authenticated. Unable to logout properly.');
//       return;
//     }

//     // Call backend to update logoutTime
//     await API.post(
//       '/login-hours/logout',
//       { employeeId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     console.log('Logout API called successfully');

//     // Optionally call auth logout API
//     try {
//       await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
//       console.log('Auth logout API called successfully');
//     } catch (logoutErr) {
//       console.warn('Auth logout API not found or failed:', logoutErr.message);
//     }
//   } catch (err) {
//     console.error('Logout process error:', err.response?.data || err.message);
//     setMessage('❌ Failed to logout properly. Please try again.');
//   } finally {
//     // Clear all session data
//     ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
//       (key) => localStorage.removeItem(key)
//     );
//     setTimeout(() => navigate('/login'), 1000);
//   }
// };
 const performLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const employeeId = employee?._id || localStorage.getItem('employeeId');

      if (!employeeId) {
        throw new Error('Employee ID missing');
      }

      // Get current IST time for logging
      const istNow = dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      console.log(`Attempting logout at IST: ${istNow}`);

      // 1. Mark logout in attendance system
      await API.post(
        '/hours/logout',
        { employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Optional: Call auth logout if endpoint exists
      // try {
      //   await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      // } catch (authErr) {
      //   console.warn('Auth logout optional:', authErr.message);
      // }

      // 3. Clear client-side data
      ['token', 'userId', 'employeeId', 'attendanceChecked', 'loginTime', 'totalWorkToday'].forEach(
        (key) => localStorage.removeItem(key)
      );

      // 4. Navigate to login with success state
      navigate('/login', { state: { logoutSuccess: true } });
    } catch (err) {
      console.error('Logout error:', err);
      setMessage(`❌ Logout failed: ${err.response?.data?.message || err.message}`);
      
      // Force logout even if API fails
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // const fetchCallLogs = async (retries = 2) => {
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
  //     const istOffset = 5.5 * 60 * 60 * 1000;
  //     const today = new Date(now.getTime() + istOffset).toISOString().split('T')[0];

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
  //   } catch (err) {
  //     if (retries > 0 && !err.response?.status) {
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       return fetchCallLogs(retries - 1);
  //     }
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




// const fetchCallLogs = async (retries = 2) => {
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
//       windowEnd: shiftEnd.toISOString()
//     });

//     const [summaryRes, logsRes] = await Promise.all([
//       API.get(`/call-logs/summary/today/${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           shift_date: shiftDateString,
//           shift_cutoff: shiftCutoffHour
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

//     // Verify consistency
//     if (summaryRes.data?.totalCalls !== filteredLogs.length) {
//       console.warn(`Data inconsistency: Summary shows ${summaryRes.data?.totalCalls} calls, but filtered ${filteredLogs.length} logs`);
//     }
//   } catch (err) {
//     console.error('Failed to fetch call logs:', err);
    
//     if (retries > 0 && !err.response?.status) {
//       console.log(`Retrying... ${retries} attempts left`);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return fetchCallLogs(retries - 1);
//     }

//     const errorMessage = err.response?.data?.message || err.message;
//     setMessage(
//       errorMessage.includes('employee ID') || errorMessage.includes('authenticated')
//         ? '❌ Session issue. Please login again.'
//         : `❌ Failed to fetch call data: ${errorMessage}`
//     );

//     if (err.response?.status === 401 || err.response?.status === 403) {
//       performLogout();
//     }
//   } finally {
//     setLoading(false);
//   }
// };




// const fetchCallLogs = async (retries = 2) => {
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

//     // ===== Shift-aware date calculation (5 PM IST → next day 4:59:59 PM IST) =====
//     const istNow = dayjs().tz('Asia/Kolkata');
//     const shiftCutoffHour = 17; // 5 PM IST

//     // Start of today's shift
//     let shiftStart = istNow.startOf('day').hour(shiftCutoffHour).minute(0).second(0).millisecond(0);

//     // If current IST time is before shift start, shiftStart should be yesterday at 5 PM
//     if (istNow.isBefore(shiftStart)) {
//       shiftStart = shiftStart.subtract(1, 'day');
//     }

//     // End of shift is next day at 4:59:59 PM IST
//     const shiftEnd = shiftStart.add(23, 'hours').add(59, 'minutes').add(59, 'seconds');

//     // The shift date label is the date when the shift started
//     const shiftDateString = shiftStart.format('YYYY-MM-DD');

//     console.log('Fetching data for shift:', {
//       shiftDate: shiftDateString,
//       windowStart: shiftStart.format(),
//       windowEnd: shiftEnd.format()
//     });

//     // ===== API calls =====
//     const [summaryRes, logsRes] = await Promise.all([
//       API.get(`/call-logs/summary/today/${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { 
//           shift_date: shiftDateString,
//           shift_cutoff: shiftCutoffHour
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
    
//     // ===== Filter logs to match shift window exactly =====
//     const filteredLogs = logsRes.data.filter(log => {
//       try {
//         const logDate = dayjs(log.createdAt);
//         return logDate.isAfter(shiftStart) && logDate.isBefore(shiftEnd);
//       } catch (e) {
//         console.error('Error processing log date:', log.createdAt, e);
//         return false;
//       }
//     });

//     console.log('Filtered logs count:', filteredLogs.length);
//     setTodaysLogs(filteredLogs);
//     setShowCallLogs(true);

//     // Verify consistency
//     if (summaryRes.data?.totalCalls !== filteredLogs.length) {
//       console.warn(`Data inconsistency: Summary shows ${summaryRes.data?.totalCalls} calls, but filtered ${filteredLogs.length} logs`);
//     }

//   } catch (err) {
//     console.error('Failed to fetch call logs:', err);
    
//     if (retries > 0 && !err.response?.status) {
//       console.log(`Retrying... ${retries} attempts left`);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return fetchCallLogs(retries - 1);
//     }

//     const errorMessage = err.response?.data?.message || err.message;
//     setMessage(
//       errorMessage.includes('employee ID') || errorMessage.includes('authenticated')
//         ? '❌ Session issue. Please login again.'
//         : `❌ Failed to fetch call data: ${errorMessage}`
//     );

//     if (err.response?.status === 401 || err.response?.status === 403) {
//       performLogout();
//     }
//   } finally {
//     setLoading(false);
//   }
// };
const fetchCallLogs = async (retries = 2) => {
  setLoading(true);
  setMessage('');

  try {
    if (!employee?._id) {
      setMessage('❌ Employee ID missing. Please login again.');
      throw new Error('Missing employee ID');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Not authenticated. Redirecting to login...');
      throw new Error('Not authenticated');
    }

    // Shift-aware date calculation (5 PM IST → next day 4:59:59 PM IST)
    const istNow = dayjs().tz('Asia/Kolkata');
    const shiftCutoffHour = 17; // 5 PM IST

    // Start of today's shift
    let shiftStart = istNow.startOf('day').hour(shiftCutoffHour).minute(0).second(0).millisecond(0);

    // If current IST time is before shift start, shiftStart should be yesterday at 5 PM
    if (istNow.isBefore(shiftStart)) {
      shiftStart = shiftStart.subtract(1, 'day');
    }

    // End of shift is next day at 4:59:59 PM IST
    const shiftEnd = shiftStart.add(23, 'hours').add(59, 'minutes').add(59, 'seconds');

    // The shift date label is the date when the shift started
    const shiftDateString = shiftStart.format('YYYY-MM-DD');

    console.log('Fetching data for shift:', {
      shiftDate: shiftDateString,
      windowStart: shiftStart.format(),
      windowEnd: shiftEnd.format()
    });

    // API calls with consistent shift window
    const [summaryRes, logsRes] = await Promise.all([
      API.get(`/call-logs/summary/today/${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          shift_date: shiftDateString,
          shift_start: shiftStart.toISOString(),
          shift_end: shiftEnd.toISOString(),
          shift_cutoff: shiftCutoffHour
        }
      }),
      API.get(`/call-logs/${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          shift_start: shiftStart.toISOString(),
          shift_end: shiftEnd.toISOString()
        }
      }),
    ]);

    // Debug logs
    console.log('Summary data:', summaryRes.data);
    console.log('Raw logs count:', logsRes.data.length);

    // Filter logs to match shift window exactly
    const filteredLogs = logsRes.data.filter(log => {
      try {
        const logDate = dayjs(log.createdAt);
        return logDate.isAfter(shiftStart) && logDate.isBefore(shiftEnd);
      } catch (e) {
        console.error('Error processing log date:', log.createdAt, e);
        return false;
      }
    });

    console.log('Filtered logs count:', filteredLogs.length);

    // Validate and adjust summary data to match filtered logs
    const computedSummary = {
      totalCalls: filteredLogs.length,
      salesCount: filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length,
      profitEarned: filteredLogs
        .filter(log => log.wasSaleConverted === 'Yes')
        .reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0),
      chargebackRefund: filteredLogs
        .filter(log => log.wasSaleConverted === 'Yes')
        .reduce((sum, log) => sum + (parseFloat(log.chargebackRefund) || 0), 0),
      netProfit: filteredLogs
        .filter(log => log.wasSaleConverted === 'Yes')
        .reduce((sum, log) => sum + (parseFloat(log.netProfit) || 0), 0),
      rejectionCount: filteredLogs.filter(log => log.wasSaleConverted === 'No').length,
      languageBarriers: filteredLogs.filter(log => log.reasonForNoSale?.toLowerCase().includes('language')).length,
      reasonBreakdown: filteredLogs
        .filter(log => log.wasSaleConverted === 'No')
        .reduce((acc, log) => {
          const reason = log.reasonForNoSale || 'Not specified';
          acc[reason] = (acc[reason] || 0) + 1;
          return acc;
        }, {})
    };

    // Merge API summary with computed summary, prioritizing computed values for consistency
    setSummary({
      ...summaryRes.data,
      ...computedSummary
    });

    setCallLogs(logsRes.data);
    setTodaysLogs(filteredLogs);
    setShowCallLogs(true);

    // Verify consistency
    if (summaryRes.data?.totalCalls !== filteredLogs.length) {
      console.warn(`Data inconsistency: API summary shows ${summaryRes.data?.totalCalls} calls, but computed ${filteredLogs.length} logs`);
    }

  } catch (err) {
    console.error('Failed to fetch call logs:', err);

    if (retries > 0 && !err.response?.status) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchCallLogs(retries - 1);
    }

    const errorMessage = err.response?.data?.message || err.message;
    setMessage(
      errorMessage.includes('employee ID') || errorMessage.includes('authenticated')
        ? '❌ Session issue. Please login again.'
        : `❌ Failed to fetch call data: ${errorMessage}`
    );

    if (err.response?.status === 401 || err.response?.status === 403) {
      performLogout();
    }
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

  // const handleDownload = async () => {
  //   setLoading(true);
  //   try {
  //     if (!employee?._id) throw new Error('Missing employee ID');
  //     if (todaysLogs.length === 0) throw new Error('No call logs for today');

  //     const reportContent = generateReportContent(todaysLogs);
  //     const blob = new Blob([reportContent], { type: 'text/plain' });
  //     const link = document.createElement('a');
  //     link.href = URL.createObjectURL(blob);
  //     link.download = `daily-report-${employee._id}-${new Date().toISOString().split('T')[0]}.txt`;
  //     link.click();

  //     setMessage('✅ Today\'s report downloaded');
  //   } catch (err) {
  //     console.error('Download failed:', err);
  //     setMessage(`❌ ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// const handleDownload = async () => {
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

  //     const payload = {
  //       name: employee.name,
  //       role: employee.role,
  //       reportContent,
  //       summary: {
  //         totalCalls: summary?.totalCalls || 0,
  //         salesCount: summary?.salesCount || 0,
  //         profitEarned: summary?.profitEarned || 0,
  //         rejectionCount: summary?.rejectionCount || 0,
  //       },
  //       toEmail: 'hr@example.com', // Replace with actual HR email
  //     };

  //     const resp = await API.post('/daily-report/email', payload, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     console.log('Email response:', resp.data);
  //     setMessage('📧 Daily report sent to HR successfully!');
  //   } catch (err) {
  //     console.error('Email error:', err.response?.data || err.message);
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
    if (!employee?._id) {
      throw new Error('Missing employee ID');
    }
    if (todaysLogs.length === 0) {
      throw new Error('No call logs to send');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }


              // Chargeback/Refund   chargebackRefund
          //  Net Profit Earned  netProfit
    const reportContent = generateReportContent(todaysLogs);

    const payload = {
      employeeId: employee._id, // Added employeeId to the payload
      name: employee.name,
      role: employee.role,
      reportContent,
      summary: {
        totalCalls: summary?.totalCalls || 0,
        salesCount: summary?.salesCount || 0,
        profitEarned: summary?.profitEarned || 0,
       chargebackRefund:summary?.chargebackRefund || 0,
       netProfit:summary?.netProfit || 0,
        rejectionCount: summary?.rejectionCount || 0,
      },
      toEmail: 'krishnaprasad24795@gmail.com', // Replace with actual HR email
    };

    const resp = await API.post('/daily-report/email', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Email response:', resp.data);
    setMessage('📧 Daily report sent to HR successfully!');
  } catch (err) {
    console.error('Email error:', err.response?.data || err);
    const errorMessage = err.response?.data?.message || err.message;
    setMessage(
      errorMessage.includes('employee ID') || errorMessage.includes('authenticated')
        ? '❌ Session issue. Please login again.'
        : `❌ Failed to send email: ${errorMessage}`
    );
    if (err.response?.status === 401 || err.response?.status === 403) {
      performLogout();
    }
  } finally {
    setLoading(false);
  }
};





  const handleConfirmLogout = () => {
    performLogout();
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
          End of Day Report (Pre-Logout)
        </h2>
        <p className="mb-6 text-center text-gray-600">
          {employee?.name ? `Review your work, ${employee.name}, before logging out!` : 'Your daily report'}
        </p>

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <button
            onClick={fetchCallLogs}
            disabled={loading || !employee?._id}
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md !text-white font-medium ${
              loading || !employee?._id
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Loading...' : '📞 View Today\'s Call Logs'}
          </button>

          <button
            onClick={handleDownload}
            disabled={loading || todaysLogs.length === 0 || !employee?._id}
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md !text-white font-medium ${
              loading || todaysLogs.length === 0 || !employee?._id
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : '⬇️ Download Today\'s Report'}
          </button>

          <button
            onClick={handleSendEmail}
            disabled={loading || todaysLogs.length === 0 || !employee?._id}
            className={`cursor-pointer flex-1 py-2 px-4 rounded-md !text-white font-medium ${
              loading || todaysLogs.length === 0 || !employee?._id
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'Sending...' : '📧 Send Report to HR'}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-center ${
              message.includes('✅') || message.includes('📧')
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
                <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
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
          


<div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
  {todaysLogs.length > 0 ? (
    todaysLogs.map((log, index) => (
      <div
        key={log._id}
        className="overflow-hidden transition-all bg-white border shadow-sm rounded-xl hover:shadow-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-purple-500">
          <span className="font-semibold text-white">📞 Call #{index + 1}</span>
          <span className="text-xs text-white/80">{formatDate(log.createdAt)}</span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 p-5 text-sm text-gray-700 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-800">Type:</span> {log.typeOfCall}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Category:</span> {log.callCategory || 'N/A'}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Reason:</span> {log.reasonForCall}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Description:</span> {log.callDescription}
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-800">Sale:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  log.wasSaleConverted === 'Yes'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {log.wasSaleConverted}
              </span>
            </p>

            <p>
              <span className="font-semibold text-gray-800">Sale Converted Through:</span>{' '}
              {log.saleConvertedThrough || 'N/A'}
            </p>

            {log.wasSaleConverted === 'Yes' && (
              <>
                <p>
                  <span className="font-semibold text-gray-800">Profit:</span>{' '}
                  <span className="font-bold text-emerald-600">${log.profitAmount}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Chargeback/Refund:</span>{' '}
                  <span className="font-medium text-red-500">${log.chargebackRefund || 0}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Net Profit:</span>{' '}
                  <span className="font-bold text-blue-600">${log.netProfit || 0}</span>
                </p>
              </>
            )}

            {log.wasSaleConverted === 'No' && (
              <p>
                <span className="font-semibold text-gray-800">Reason:</span>{' '}
                {log.reasonForNoSale || 'Not specified'}
              </p>
            )}

            <p>
              <span className="font-semibold text-gray-800">Customer:</span> {log.customerName}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Phone:</span> {log.customerPhone}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Language:</span> {log.language}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="py-6 italic text-center text-gray-400">
      {message.includes('Failed')
        ? '⚠️ Error fetching call logs. Please try again.'
        : 'No call logs found for today.'}
    </p>
  )}
</div>


          </div>
        )}

        {/* <button
          onClick={handleConfirmLogout}
          className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600"
        >
          Confirm Logout
        </button> */}

         <button
        onClick={performLogout}
        disabled={loading}
        className={`mt-6 w-full py-2 rounded shadow font-semibold ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-300 hover:bg-red-600 text-white cursor-pointer'
        }`}
      >
        {loading ? 'Logging out...' : 'Confirm Logout'}
      </button>

      </div>
    </div>
  );
};

export default PreLogoutReport;

//================net profit-----------------------------