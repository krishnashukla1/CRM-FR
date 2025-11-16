import PropTypes from 'prop-types';


import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    // Notify parent component
    // if (onLogout) {
    //   onLogout('✅ You have successfully logged out.');
      
    // }

     if (onLogout) {
      onLogout(<div className="px-4 py-3 font-medium text-center text-white bg-blue-500 rounded shadow-lg">
     ✅ You have successfully logged out.
   </div>);
      
    }
//-------------------------or-----------------------
//     if (onLogout) {
//   onLogout(
//     <div className="px-12 py-8 text-4xl font-extrabold text-center text-green-200 bg-black shadow-2xl bg-opacity-80 rounded-2xl">
//       ✅ You have successfully logged out.
//     </div>
//   );
// }
//--------------------------or----------------------
// if (onLogout) {
//   onLogout(
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="px-10 py-6 text-3xl font-bold text-green-700 bg-white border border-gray-300 shadow-lg rounded-xl">
//         ✅ You have successfully logged out.
//       </div>
//     </div>
//   );
// }
//------------------------or-----------------------
// if (onLogout) {
//   onLogout(
//    <div className="fixed z-50 w-full max-w-md transform -translate-x-1/2 top-4 left-1/2">
//   <div className="px-4 py-3 font-medium text-center text-white bg-green-500 rounded shadow-lg">
//     ✅ You have successfully logged out.
//   </div>
// </div>

//   );
// }



//----------------------------------------

    
    // Redirect after delay
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${className}`}
    >
      Logout
    </button>
  );
};

Logout.propTypes = {
  onLogout: PropTypes.func,
  className: PropTypes.string
};

export default Logout;

//--------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const Logout = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [statusMessage, setStatusMessage] = useState('');
//   const [logoutStarted, setLogoutStarted] = useState(false);
//   const [reportActionTaken, setReportActionTaken] = useState(false);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('employee');
//     if (storedUser) {
//       setEmployee(JSON.parse(storedUser));
//     }
//   }, []);

//   const markLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token && employee?._id) {
//         await API.post(
//           '/hours/logout',
//           { employeeId: employee._id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//     } catch (err) {
//       console.error('Logout tracking failed:', err);
//     } finally {
//       // Clear user data
//       localStorage.removeItem('token');
//       localStorage.removeItem('employee');
//       localStorage.removeItem('attendanceChecked');
      
//       // Redirect to login after a delay
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//     }
//   };

//   const handleDownloadReport = () => {
//     // Create a simple report content
//     const reportContent = [
//       `Daily Report for ${employee?.name || 'Employee'}`,
//       `Date: ${new Date().toLocaleDateString()}`,
//       'Summary:',
//       '- Completed all assigned tasks',
//       '- Attended all meetings',
//       '- Met daily targets'
//     ].join('\n');

//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `daily-report-${new Date().toISOString().split('T')[0]}.txt`;
//     link.click();

//     setStatusMessage('✅ Report downloaded. Logging out...');
//     setReportActionTaken(true);
//     startFinalLogout();
//   };

//   const handleSendEmail = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token || !employee?._id) return;

//       await API.post('/daily-report/email', {
//         employeeId: employee._id,
//         email: employee.email,
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setStatusMessage('📧 Report sent to your email. Logging out...');
//       setReportActionTaken(true);
//       startFinalLogout();
//     } catch (error) {
//       setStatusMessage('❌ Failed to send email. Try downloading instead.');
//       console.error(error);
//     }
//   };

//   const startFinalLogout = () => {
//     if (!reportActionTaken) return;
    
//     setLogoutStarted(true);
//     setTimeout(() => {
//       markLogout();
//     }, 3000);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
//       {/* <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
//         <h2 className="mb-4 text-xl font-semibold text-gray-800">Daily Report</h2>
//         <p className="mb-6 text-gray-600">
//           Thank you for your work today, {employee?.name || 'Employee'}.
//         </p>

//         {!logoutStarted ? (
//           <>
//             <button
//               onClick={handleDownloadReport}
//               className="w-full px-4 py-2 mb-3 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
//             >
//               ⬇️ Download Report
//             </button>
//             <button
//               onClick={handleSendEmail}
//               className="w-full px-4 py-2 text-white transition-colors bg-green-500 rounded hover:bg-green-600"
//             >
//               📧 Send Report to Email
//             </button>
//             <button
//               onClick={() => {
//                 setStatusMessage('⏩ Skipping report. Logging out...');
//                 setReportActionTaken(true);
//                 startFinalLogout();
//               }}
//               className="w-full px-4 py-2 mt-3 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
//             >
//               Skip and Logout
//             </button>
//           </>
//         ) : (
//           <div className="py-4">
//             <div className="w-8 h-8 mx-auto mb-3 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//             <p className="text-gray-700">Logging you out...</p>
//           </div>
//         )}

//         {statusMessage && (
//           <p className={`mt-4 text-sm ${statusMessage.includes('✅') || statusMessage.includes('📧') ? 'text-green-600' : 'text-red-600'}`}>
//             {statusMessage}
//           </p>
//         )}
//       </div> */}
//     </div>
//   );
// };

// export default Logout;

//----------------------------

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// const Logout = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [statusMessage, setStatusMessage] = useState('');

//   useEffect(() => {
//     const storedUser = localStorage.getItem('employee');
//     if (storedUser) {
//       setEmployee(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (token && employee?._id) {
//         await API.post(
//           '/hours/logout',
//           { employeeId: employee._id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }
//     } catch (err) {
//       console.error('Logout tracking failed:', err);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('employee');
//       localStorage.removeItem('attendanceChecked');

//       setStatusMessage('✅ You have successfully logged out.');

//       // Redirect to login after 2 seconds
//       setTimeout(() => navigate('/login'), 2000);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
//       <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
//         <h2 className="mb-4 text-xl font-semibold text-gray-800">Logout</h2>
//         <button
//           onClick={handleLogout}
//           className="w-full px-4 py-2 text-white transition-colors bg-red-500 rounded hover:bg-red-600"
//         >
//           Logout
//         </button>
//         {statusMessage && (
//           <p className="mt-4 text-sm text-green-600">{statusMessage}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Logout;
