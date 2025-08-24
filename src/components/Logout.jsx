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
      onLogout(<div className="bg-blue-500 text-white text-center px-4 py-3 rounded shadow-lg font-medium">
     ✅ You have successfully logged out.
   </div>);
      
    }
//-------------------------or-----------------------
//     if (onLogout) {
//   onLogout(
//     <div className="text-4xl font-extrabold text-green-200 bg-black bg-opacity-80 px-12 py-8 rounded-2xl shadow-2xl text-center">
//       ✅ You have successfully logged out.
//     </div>
//   );
// }
//--------------------------or----------------------
// if (onLogout) {
//   onLogout(
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div className="text-3xl font-bold text-green-700 bg-white px-10 py-6 rounded-xl shadow-lg border border-gray-300">
//         ✅ You have successfully logged out.
//       </div>
//     </div>
//   );
// }
//------------------------or-----------------------
// if (onLogout) {
//   onLogout(
//    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
//   <div className="bg-green-500 text-white text-center px-4 py-3 rounded shadow-lg font-medium">
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
      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${className}`}
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       {/* <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Report</h2>
//         <p className="text-gray-600 mb-6">
//           Thank you for your work today, {employee?.name || 'Employee'}.
//         </p>

//         {!logoutStarted ? (
//           <>
//             <button
//               onClick={handleDownloadReport}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-3 w-full transition-colors"
//             >
//               ⬇️ Download Report
//             </button>
//             <button
//               onClick={handleSendEmail}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full transition-colors"
//             >
//               📧 Send Report to Email
//             </button>
//             <button
//               onClick={() => {
//                 setStatusMessage('⏩ Skipping report. Logging out...');
//                 setReportActionTaken(true);
//                 startFinalLogout();
//               }}
//               className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full transition-colors"
//             >
//               Skip and Logout
//             </button>
//           </>
//         ) : (
//           <div className="py-4">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
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
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Logout</h2>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full transition-colors"
//         >
//           Logout
//         </button>
//         {statusMessage && (
//           <p className="mt-4 text-green-600 text-sm">{statusMessage}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Logout;
