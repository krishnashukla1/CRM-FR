
//=================5===fully correct==========

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fixed: Get shift date based on the login time, not current time
//   const getShiftDate = (date) => {
//     const checkTime = moment(date);
//     const SHIFT_START_HOUR = 17; // 5 PM

//     if (checkTime.hour() < SHIFT_START_HOUR) {
//       // If before 5 PM, it belongs to previous day's shift
//       return checkTime.subtract(1, 'day').format('YYYY-MM-DD');
//     }
//     return checkTime.format('YYYY-MM-DD');
//   };

//   // Check if two dates are in the same shift period
//   const isInSameShift = (date1, date2) => {
//     return getShiftDate(date1) === getShiftDate(date2);
//   };

//   // Check if login is within current shift (5 PM to next day 4:59 PM)
//   const isInCurrentShift = (loginTime) => {
//     const now = moment();
//     return isInSameShift(loginTime, now);
//   };

//   // Filter function - show only current shift entries for non-supervisors
//   const isWithinLogicDay = (entry, isSupervisor = false) => {
//     if (isSupervisor) return true; // Skip filter for supervisors
//     if (!entry.loginTime) return false;

//     return isInCurrentShift(entry.loginTime);
//   };

//   // Calculate durations for display
//   const calculateDurations = (entry) => {
//     const loginMoment = moment(entry.loginTime);
//     const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();

//     if (!loginMoment.isValid() || logoutMoment.isBefore(loginMoment)) {
//       return {
//         loginDuration: "0h 0m",
//         breakDuration: "0h 0m",
//         workingDuration: "0h 0m",
//       };
//     }

//     const loginDuration = moment.duration(logoutMoment.diff(loginMoment));

//     // Breaks
//     let totalBreakSeconds = 0;
//     if (entry.breaks && entry.breaks.length > 0) {
//       entry.breaks.forEach((breakItem) => {
//         if (breakItem.start && breakItem.end) {
//           const breakStart = moment(breakItem.start);
//           const breakEnd = moment(breakItem.end);
//           if (breakEnd.isAfter(breakStart)) {
//             totalBreakSeconds += breakEnd.diff(breakStart, "seconds");
//           }
//         }
//       });
//     }

//     const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//     const workingDuration = moment.duration(loginDuration.asSeconds() - totalBreakSeconds, "seconds");

//     return {
//       loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//       breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//       workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//     };
//   };

//   useEffect(() => {
//     fetchLoginData();
//   }, []);

//   const fetchLoginData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       let response;
//       try {
//         response = await axios.get(`${API_URL}/hours/all`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         console.log('Raw /hours/all response:', response.data);
//       } catch (e) {
//         console.log('Trying fallback endpoint...');
//         response = await axios.get(`${API_URL}/hours`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         console.log('Raw /hours fallback response:', response.data);
//       }

//       // Get current time for shift calculation
//       const now = moment();
//       console.log('Current time:', now.format('YYYY-MM-DD HH:mm:ss'));
//       console.log('Current shift date:', getShiftDate(now));

//       // Filter data - show only current shift for non-supervisors
//       const filteredData = response.data.filter(entry => {
//         if (!entry.loginTime) return false;
//         if (!entry.employeeId?.name) return false;

//         const supervisorId = '689cde47d21934b1fe602a33';
//         const isSupervisor = entry.employeeId?._id === supervisorId;

//         // Determine status
//         let status = 'Logged Out';

//         if (isSupervisor) {
//           // Supervisor should always show "Logged In" if this is their record
//           status = 'Logged In';
//         } else {
//           // Normal logic for other employees
//           status = entry.logoutTime ? 'Logged Out' : 'Logged In';
//         }

//         entry.status = status;

//         return isWithinLogicDay(entry, isSupervisor);
//       });

//       console.log('Filtered login data:', filteredData);

//       setLoginData(filteredData);
//     } catch (error) {
//       console.error('Failed to fetch login data:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       setError(error.response?.data?.message || error.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const EmployeeStatusTable = ({ loginData }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const entriesPerPage = 10;
//     const totalPages = Math.ceil(loginData.length / entriesPerPage);

//     // Get current page data
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//     // Change page
//     const paginate = (pageNumber) => setCurrentPage(pageNumber);
//     const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//     const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//     return (
//       <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
//         <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//           Employee Attendance Dashboard
//         </h2>

//         <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Login Time
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Logout Time
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Break Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Total Duration
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Break Time
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                   Working Hours
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentEntries.map((item, index) => {
//                 const name = item.employeeId?.name || 'N/A';
//                 const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
//                 // Only show logout time if the user has actually logged out
//                 const logoutTime = item.logoutTime && item.status === 'Logged Out' 
//                   ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
//                   : '—';
//                 const status = item.status || (item.logoutTime ? 'Logged Out' : 'Logged In');

//                 // Determine break status
//                 let breakStatus = 'Not on Break';
//                 if (item.breaks && item.breaks.length > 0) {
//                   const lastBreak = item.breaks[item.breaks.length - 1];
//                   if (lastBreak.start && !lastBreak.end) {
//                     breakStatus = 'On Break';
//                   }
//                 }

//                 const durations = calculateDurations(item);

//                 return (
//                   <tr
//                     key={index}
//                     className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <span className="text-blue-600 font-medium">
//                             {name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {loginTime}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       {logoutTime === '—' ? (
//                         <span className="text-gray-500">{logoutTime}</span>
//                       ) : (
//                         <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
//                           {logoutTime}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'Logged In'
//                           ? 'bg-blue-100 text-blue-800 animate-pulse'
//                           : 'bg-gray-100 text-gray-800'
//                         }`}>
//                         {status}
//                       </span>
//                     </td>

//                     {/* Break Status Cell */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
//                           ? 'bg-yellow-100 text-yellow-800 animate-pulse'
//                           : 'bg-gray-100 text-gray-800'
//                         }`}>
//                         {breakStatus}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                       {durations.loginDuration}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                       {durations.breakDuration}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
//                       {durations.workingDuration}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         {loginData.length > entriesPerPage && (
//           <div className="mt-6 flex items-center justify-between">
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <span className="h-3 w-3 rounded-full bg-blue-500"></span>
//               <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
//                   'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                   'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                   }`}
//               >
//                 Previous
//               </button>

//               <div className="flex space-x-1">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                   <button
//                     key={number}
//                     onClick={() => paginate(number)}
//                     className={`w-10 h-10 rounded-md ${currentPage === number ?
//                       'bg-blue-600 text-white font-medium' :
//                       'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
//                       }`}
//                   >
//                     {number}
//                   </button>
//                 ))}
//               </div>

//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
//                   'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                   'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                   }`}
//               >
//                 Next
//               </button>
//             </div>

//             <div className="text-sm text-gray-500">
//               Page {currentPage} of {totalPages}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           Error: {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading attendance data...
//           </div>
//         </div>
//       ) : loginData.length > 0 ? (
//         <EmployeeStatusTable loginData={loginData} />
//       ) : (
//         <div className="p-6 text-center text-gray-500">
//           No attendance records found for the current shift (5PM to 4:59PM next day).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             Current shift date: {getShiftDate(moment())}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;

//===============6=======================
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterName, setFilterName] = useState('');

//   const supervisorId = '689cde47d21934b1fe602a33';

//   const getShiftDate = (date) => {
//     const checkTime = moment(date);
//     const SHIFT_START_HOUR = 17; // 5 PM
//     if (checkTime.hour() < SHIFT_START_HOUR) {
//       return checkTime.subtract(1, 'day').format('YYYY-MM-DD');
//     }
//     return checkTime.format('YYYY-MM-DD');
//   };

//   const isInSameShift = (date1, date2) => getShiftDate(date1) === getShiftDate(date2);

//   const isInCurrentShift = (loginTime) => isInSameShift(loginTime, moment());

//   const isWithinLogicDay = (entry, isSupervisor = false) => {
//     if (isSupervisor) return true;
//     if (!entry.loginTime) return false;
//     return isInCurrentShift(entry.loginTime);
//   };

//   const calculateDurations = (entry) => {
//     const loginMoment = moment(entry.loginTime);
//     const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();

//     if (!loginMoment.isValid() || logoutMoment.isBefore(loginMoment)) {
//       return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
//     }

//     const loginDuration = moment.duration(logoutMoment.diff(loginMoment));

//     let totalBreakSeconds = 0;
//     if (entry.breaks && entry.breaks.length > 0) {
//       entry.breaks.forEach((breakItem) => {
//         if (breakItem.start && breakItem.end) {
//           const breakStart = moment(breakItem.start);
//           const breakEnd = moment(breakItem.end);
//           if (breakEnd.isAfter(breakStart)) totalBreakSeconds += breakEnd.diff(breakStart, "seconds");
//         }
//       });
//     }

//     const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//     const workingDuration = moment.duration(loginDuration.asSeconds() - totalBreakSeconds, "seconds");

//     return {
//       loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//       breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//       workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//     };
//   };

//   const fetchLoginData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       let response = await axios.get(`${API_URL}/hours/all`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       }).catch(async () => {
//         return axios.get(`${API_URL}/hours`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//       });

//       const filtered = response.data
//         .filter(entry => entry.loginTime && entry.employeeId?.name)
//         .map(entry => {
//           const isSupervisor = entry.employeeId?._id === supervisorId;
//           entry.status = isSupervisor ? 'Logged In' : (entry.logoutTime ? 'Logged Out' : 'Logged In');
//           return entry;
//         })
//         .filter(entry => isWithinLogicDay(entry, entry.employeeId?._id === supervisorId));

//       setLoginData(filtered);
//       setFilteredData(filtered); // Initial filtered data
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter table dynamically
//   useEffect(() => {
//     const filtered = loginData.filter(entry =>
//       entry.employeeId?.name.toLowerCase().includes(filterName.toLowerCase())
//     );
//     setFilteredData(filtered);
//   }, [filterName, loginData]);

//   useEffect(() => { fetchLoginData(); }, []);

//   return (
//     <div>
//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           Error: {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading attendance data...
//           </div>
//         </div>
//       ) : filteredData.length > 0 ? (
//         <>
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Filter by employee name..."
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <EmployeeStatusTable loginData={filteredData} calculateDurations={calculateDurations} />
//         </>
//       ) : (
//         <div className="p-6 text-center text-gray-500">
//           No attendance records found for the current shift (5PM to 4:59PM next day).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             Current shift date: {getShiftDate(moment())}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Table Component
// const EmployeeStatusTable = ({ loginData, calculateDurations }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 10;
//   const totalPages = Math.ceil(loginData.length / entriesPerPage);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//         Employee Attendance Dashboard
//       </h2>

//       <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Employee
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Login Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Logout Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Total Duration
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Working Hours
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentEntries.map((item, index) => {
//               const name = item.employeeId?.name || 'N/A';
//               const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
              
//               // Only show logout time if employee has logged out
//               const logoutTime = item.status === 'Logged Out' && item.logoutTime 
//                 ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
//                 : '—';
              
//               // Determine break status
//               let breakStatus = 'Not on Break';
//               if (item.breaks && item.breaks.length > 0) {
//                 const lastBreak = item.breaks[item.breaks.length - 1];
//                 if (lastBreak.start && !lastBreak.end) {
//                   breakStatus = 'On Break';
//                 }
//               }

//               const durations = calculateDurations(item);

//               return (
//                 <tr
//                   key={index}
//                   className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium">
//                           {name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
//                       {loginTime}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     {logoutTime === '—' ? (
//                       <span className="text-gray-500">{logoutTime}</span>
//                     ) : (
//                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {logoutTime}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Logged In'
//                         ? 'bg-blue-100 text-blue-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
//                         ? 'bg-yellow-100 text-yellow-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {breakStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.loginDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.breakDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
//                     {durations.workingDuration}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {loginData.length > entriesPerPage && (
//         <div className="mt-6 flex items-center justify-between">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="h-3 w-3 rounded-full bg-blue-500"></span>
//             <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Previous
//             </button>

//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`w-10 h-10 rounded-md ${currentPage === number ?
//                     'bg-blue-600 text-white font-medium' :
//                     'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
//                     }`}
//                 >
//                   {number}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Next
//             </button>
//           </div>

//           <div className="text-sm text-gray-500">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;
//====================7===correct=====
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterName, setFilterName] = useState('');

//   const supervisorId = '689cde47d21934b1fe602a33';

//   console.log('AdminLoginStatus component rendered');
//   console.log('Supervisor ID:', supervisorId);

//   const getShiftDate = (date) => {
//     const checkTime = moment(date);
//     const SHIFT_START_HOUR = 17; // 5 PM
//     if (checkTime.hour() < SHIFT_START_HOUR) {
//       return checkTime.subtract(1, 'day').format('YYYY-MM-DD');
//     }
//     return checkTime.format('YYYY-MM-DD');
//   };
// const getCurrentShiftBoundaries = () => {
//   const now = moment();
//   let shiftStart, shiftEnd;
  
//   if (now.hour() >= 17) {
//     // After 5 PM today - shift started today at 5 PM
//     shiftStart = moment().hour(17).minute(0).second(0);
//     shiftEnd = moment().add(1, 'day').hour(16).minute(59).second(59);
//   } else {
//     // Before 5 PM today - shift started yesterday at 5 PM
//     shiftStart = moment().subtract(1, 'day').hour(17).minute(0).second(0);
//     shiftEnd = moment().hour(16).minute(59).second(59);
//   }
  
//   return { shiftStart, shiftEnd };
// };


//   const isInSameShift = (date1, date2) => {
//     const shift1 = getShiftDate(date1);
//     const shift2 = getShiftDate(date2);
//     console.log(`Comparing shifts: ${shift1} vs ${shift2}`);
//     return shift1 === shift2;
//   };

//   // const isInCurrentShift = (loginTime) => {
//   //   const result = isInSameShift(loginTime, moment());
//   //   console.log(`Is login time ${loginTime} in current shift? ${result}`);
//   //   return result;
//   // };

//   const isInCurrentShift = (loginTime) => {
//   const loginMoment = moment(loginTime);
//   const now = moment();
  
//   // Determine current shift start (5 PM of appropriate day)
//   const currentShiftStart = now.hour() >= 17 
//     ? moment().hour(17).minute(0).second(0)
//     : moment().subtract(1, 'day').hour(17).minute(0).second(0);
  
//   const result = loginMoment.isSameOrAfter(currentShiftStart);
//   console.log(`Is login time ${loginTime} in current shift? ${result}, Current shift started at: ${currentShiftStart.format()}`);
//   return result;
// };


//   // const isWithinLogicDay = (entry, isSupervisor = false) => {
//   //   if (isSupervisor) {
//   //     console.log(`Supervisor entry always included: ${entry.employeeId?.name}`);
//   //     return true;
//   //   }
//   //   if (!entry.loginTime) {
//   //     console.log(`Entry without login time excluded: ${entry.employeeId?.name}`);
//   //     return false;
//   //   }
    
//   //   const result = isInCurrentShift(entry.loginTime);
//   //   console.log(`Entry ${entry.employeeId?.name} is in current shift: ${result}`);
//   //   return result;
//   // };

// const isWithinLogicDay = (entry, isSupervisor = false) => {
//   if (isSupervisor) {
//     console.log(`Supervisor entry always included: ${entry.employeeId?.name}`);
//     return true;
//   }
//   if (!entry.loginTime) {
//     console.log(`Entry without login time excluded: ${entry.employeeId?.name}`);
//     return false;
//   }
  
//   // Get current time and calculate shift boundaries
//   const now = moment();
//   const currentShiftStart = now.hour() >= 17 
//     ? moment().hour(17).minute(0).second(0) // Today 5 PM
//     : moment().subtract(1, 'day').hour(17).minute(0).second(0); // Yesterday 5 PM
  
//   const currentShiftEnd = currentShiftStart.clone().add(24, 'hours').subtract(1, 'minute'); // Next day 4:59 PM
  
//   const loginTime = moment(entry.loginTime);
//   const isInCurrentShift = loginTime.isBetween(currentShiftStart, currentShiftEnd);
  
//   console.log(`Entry ${entry.employeeId?.name}: Login ${loginTime.format()}, Shift ${currentShiftStart.format()} to ${currentShiftEnd.format()}, In shift: ${isInCurrentShift}`);
  
//   return isInCurrentShift;
// };


//   const calculateDurations = (entry) => {
//     console.log(`Calculating durations for: ${entry.employeeId?.name}`);
//     const loginMoment = moment(entry.loginTime);
//     const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();

//     if (!loginMoment.isValid()) {
//       console.log(`Invalid login time for: ${entry.employeeId?.name}`);
//       return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
//     }

//     if (logoutMoment.isBefore(loginMoment)) {
//       console.log(`Logout time before login time for: ${entry.employeeId?.name}`);
//       return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
//     }

//     const loginDuration = moment.duration(logoutMoment.diff(loginMoment));
//     console.log(`Login duration for ${entry.employeeId?.name}: ${loginDuration.asHours()} hours`);

//     let totalBreakSeconds = 0;
//     if (entry.breaks && entry.breaks.length > 0) {
//       console.log(`Processing ${entry.breaks.length} breaks for: ${entry.employeeId?.name}`);
//       entry.breaks.forEach((breakItem, index) => {
//         if (breakItem.start && breakItem.end) {
//           const breakStart = moment(breakItem.start);
//           const breakEnd = moment(breakItem.end);
//           if (breakEnd.isAfter(breakStart)) {
//             const breakSeconds = breakEnd.diff(breakStart, "seconds");
//             totalBreakSeconds += breakSeconds;
//             console.log(`Break ${index+1} for ${entry.employeeId?.name}: ${breakSeconds} seconds`);
//           }
//         }
//       });
//     }

//     const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//     const workingDuration = moment.duration(loginDuration.asSeconds() - totalBreakSeconds, "seconds");

//     console.log(`Final durations for ${entry.employeeId?.name}: 
//       Login: ${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m
//       Break: ${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m
//       Working: ${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`);

//     return {
//       loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//       breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//       workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//     };
//   };


// //  const fetchLoginData = async () => {
// //   try {
// //     setLoading(true);
// //     setError(null);

// //     let response = await axios.get(`${API_URL}/hours/all`, {
// //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //     }).catch(async () => {
// //       return axios.get(`${API_URL}/hours`, {
// //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
// //       });
// //     });

// //     // Step 1: Filter valid entries
// //     let filtered = response.data
// //       .filter(entry => entry.loginTime && entry.employeeId?.name)
// //       .map(entry => {
// //         const isSupervisor = entry.employeeId?._id === supervisorId;
// //         entry.status = isSupervisor
// //           ? 'Logged In'
// //           : (entry.logoutTime ? 'Logged Out' : 'Logged In');
// //         return entry;
// //       })
// //       .filter(entry => isWithinLogicDay(entry, entry.employeeId?._id === supervisorId));

// //     // Step 2: Remove duplicates → keep only latest login per employee
// //     const latestByEmployee = {};
// //     filtered.forEach(entry => {
// //       const empId = entry.employeeId?._id;
// //       if (!latestByEmployee[empId]) {
// //         latestByEmployee[empId] = entry;
// //       } else {
// //         const currentLatest = latestByEmployee[empId];
// //         if (moment(entry.loginTime).isAfter(moment(currentLatest.loginTime))) {
// //           latestByEmployee[empId] = entry;
// //         }
// //       }
// //     });

// //     filtered = Object.values(latestByEmployee);

// //     setLoginData(filtered);
// //     setFilteredData(filtered);
// //   } catch (err) {
// //     console.error(err);
// //     setError(err.response?.data?.message || err.message || 'Failed to fetch data');
// //   } finally {
// //     setLoading(false);
// //   }
// // };

//  const fetchLoginData = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     let response = await axios.get(`${API_URL}/hours/all`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     }).catch(async () => {
//       return axios.get(`${API_URL}/hours`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//     });

//     // Step 1: Filter valid entries and calculate shift boundaries
//     const { shiftStart, shiftEnd } = getCurrentShiftBoundaries();
//     console.log(`Current shift: ${shiftStart.format()} to ${shiftEnd.format()}`);

//     let filtered = response.data
//       .filter(entry => entry.loginTime && entry.employeeId?.name)
//       .map(entry => {
//         const isSupervisor = entry.employeeId?._id === supervisorId;
//         entry.status = isSupervisor
//           ? 'Logged In'
//           : (entry.logoutTime ? 'Logged Out' : 'Logged In');
        
//         // Calculate duration for this entry
//         const loginMoment = moment(entry.loginTime);
//         const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
//         const durationMs = logoutMoment.diff(loginMoment);
//         entry.durationMs = durationMs > 0 ? durationMs : 0;
        
//         return entry;
//       })
//       .filter(entry => {
//         if (entry.employeeId?._id === supervisorId) return true;
        
//         const loginTime = moment(entry.loginTime);
//         return loginTime.isBetween(shiftStart, shiftEnd);
//       });

//     // Step 2: Remove duplicates → keep only latest login per employee
//     const latestByEmployee = {};
//     filtered.forEach(entry => {
//       const empId = entry.employeeId?._id;
//       if (!latestByEmployee[empId]) {
//         latestByEmployee[empId] = entry;
//       } else {
//         const currentLatest = latestByEmployee[empId];
//         if (moment(entry.loginTime).isAfter(moment(currentLatest.loginTime))) {
//           latestByEmployee[empId] = entry;
//         }
//       }
//     });

//     filtered = Object.values(latestByEmployee);
//     console.log('Final filtered data:', filtered);

//     setLoginData(filtered);
//     setFilteredData(filtered);
//   } catch (err) {
//     console.error(err);
//     setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//   } finally {
//     setLoading(false);
//   }
// };
//   useEffect(() => {
//     console.log('Filtering data with name:', filterName);
//     const filtered = loginData.filter(entry =>
//       entry.employeeId?.name.toLowerCase().includes(filterName.toLowerCase())
//     );
//     console.log(`Filtered ${filtered.length} entries from ${loginData.length}`);
//     setFilteredData(filtered);
//   }, [filterName, loginData]);

//   useEffect(() => { 
//     console.log('Component mounted, fetching data');
//     fetchLoginData(); 
//   }, []);

//   return (
//     <div>
//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           Error: {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading attendance data...
//           </div>
//         </div>
//       ) : filteredData.length > 0 ? (
//         <>
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Filter by employee name..."
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <EmployeeStatusTable loginData={filteredData} calculateDurations={calculateDurations} />
//         </>
//       ) : (
//         <div className="p-6 text-center text-gray-500">
//           No attendance records found for the current shift (5PM to 4:59PM next day).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             Current shift date: {getShiftDate(moment())}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Table Component
// const EmployeeStatusTable = ({ loginData, calculateDurations }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 10;
//   const totalPages = Math.ceil(loginData.length / entriesPerPage);

//   console.log('EmployeeStatusTable rendered with', loginData.length, 'entries');
//   console.log('Current page:', currentPage, 'Total pages:', totalPages);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//   console.log('Showing entries', indexOfFirstEntry + 1, 'to', indexOfLastEntry);

//   const paginate = (pageNumber) => {
//     console.log('Changing to page:', pageNumber);
//     setCurrentPage(pageNumber);
//   };
  
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       console.log('Moving to next page:', currentPage + 1);
//       setCurrentPage(currentPage + 1);
//     }
//   };
  
//   const prevPage = () => {
//     if (currentPage > 1) {
//       console.log('Moving to previous page:', currentPage - 1);
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//         Employee Attendance Dashboard
//       </h2>

//       <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Employee
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Login Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Logout Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Total Duration
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Working Hours
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentEntries.map((item, index) => {
//               const name = item.employeeId?.name || 'N/A';
//               const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
              
//               // Only show logout time if employee has logged out
//               const logoutTime = item.status === 'Logged Out' && item.logoutTime 
//                 ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
//                 : '—';
              
//               // Determine break status
//               let breakStatus = 'Not on Break';
//               if (item.breaks && item.breaks.length > 0) {
//                 const lastBreak = item.breaks[item.breaks.length - 1];
//                 if (lastBreak.start && !lastBreak.end) {
//                   breakStatus = 'On Break';
//                 }
//               }

//               console.log(`Rendering row ${index}: ${name}, Status: ${item.status}, Break: ${breakStatus}`);

//               const durations = calculateDurations(item);

//               return (
//                 <tr
//                   key={index}
//                   className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium">
//                           {name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
//                       {loginTime}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     {logoutTime === '—' ? (
//                       <span className="text-gray-500">{logoutTime}</span>
//                     ) : (
//                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {logoutTime}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Logged In'
//                         ? 'bg-blue-100 text-blue-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
//                         ? 'bg-yellow-100 text-yellow-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {breakStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.loginDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.breakDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
//                     {durations.workingDuration}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {loginData.length > entriesPerPage && (
//         <div className="mt-6 flex items-center justify-between">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="h-3 w-3 rounded-full bg-blue-500"></span>
//             <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Previous
//             </button>

//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`w-10 h-10 rounded-md ${currentPage === number ?
//                     'bg-blue-600 text-white font-medium' :
//                     'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
//                     }`}
//                 >
//                   {number}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Next
//             </button>
//           </div>

//           <div className="text-sm text-gray-500">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;
//----------------------7--1---done correct---------

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterName, setFilterName] = useState('');

//   const supervisorId = '689cde47d21934b1fe602a33';

//   console.log('AdminLoginStatus component rendered');
//   console.log('Supervisor ID:', supervisorId);

//   const getShiftDate = (date) => {
//     const checkTime = moment(date);
//     const SHIFT_START_HOUR = 17; // 5 PM
//     if (checkTime.hour() < SHIFT_START_HOUR) {
//       return checkTime.subtract(1, 'day').format('YYYY-MM-DD');
//     }
//     return checkTime.format('YYYY-MM-DD');
//   };
// const getCurrentShiftBoundaries = () => {
//   const now = moment();
//   let shiftStart, shiftEnd;
  
//   if (now.hour() >= 17) {
//     // After 5 PM today - shift started today at 5 PM
//     shiftStart = moment().hour(17).minute(0).second(0);
//     shiftEnd = moment().add(1, 'day').hour(16).minute(59).second(59);
//   } else {
//     // Before 5 PM today - shift started yesterday at 5 PM
//     shiftStart = moment().subtract(1, 'day').hour(17).minute(0).second(0);
//     shiftEnd = moment().hour(16).minute(59).second(59);
//   }
  
//   return { shiftStart, shiftEnd };
// };


//   const isInSameShift = (date1, date2) => {
//     const shift1 = getShiftDate(date1);
//     const shift2 = getShiftDate(date2);
//     console.log(`Comparing shifts: ${shift1} vs ${shift2}`);
//     return shift1 === shift2;
//   };

//   const isInCurrentShift = (loginTime) => {
//   const loginMoment = moment(loginTime);
//   const now = moment();
  
//   // Determine current shift start (5 PM of appropriate day)
//   const currentShiftStart = now.hour() >= 17 
//     ? moment().hour(17).minute(0).second(0)
//     : moment().subtract(1, 'day').hour(17).minute(0).second(0);
  
//   const result = loginMoment.isSameOrAfter(currentShiftStart);
//   console.log(`Is login time ${loginTime} in current shift? ${result}, Current shift started at: ${currentShiftStart.format()}`);
//   return result;
// };



// const isWithinLogicDay = (entry, isSupervisor = false) => {
//   if (isSupervisor) {
//     console.log(`Supervisor entry always included: ${entry.employeeId?.name}`);
//     return true;
//   }
//   if (!entry.loginTime) {
//     console.log(`Entry without login time excluded: ${entry.employeeId?.name}`);
//     return false;
//   }
  
//   // Get current time and calculate shift boundaries
//   const now = moment();
//   const currentShiftStart = now.hour() >= 17 
//     ? moment().hour(17).minute(0).second(0) // Today 5 PM
//     : moment().subtract(1, 'day').hour(17).minute(0).second(0); // Yesterday 5 PM
  
//   const currentShiftEnd = currentShiftStart.clone().add(24, 'hours').subtract(1, 'minute'); // Next day 4:59 PM
  
//   const loginTime = moment(entry.loginTime);
//   const isInCurrentShift = loginTime.isBetween(currentShiftStart, currentShiftEnd);
  
//   console.log(`Entry ${entry.employeeId?.name}: Login ${loginTime.format()}, Shift ${currentShiftStart.format()} to ${currentShiftEnd.format()}, In shift: ${isInCurrentShift}`);
  
//   return isInCurrentShift;
// };



// // const calculateDurations = (entry) => {
// //   console.log(`Calculating durations for: ${entry.employeeId?.name}`);
  
// //   // Use the cumulative time if available, otherwise calculate from single session
// //   let totalSeconds = 0;
  
// //   if (entry.totalDurationMs) {
// //     // Use the pre-calculated cumulative time
// //     totalSeconds = Math.floor(entry.totalDurationMs / 1000);
// //     console.log(`Using cumulative time: ${totalSeconds} seconds`);
// //   } else {
// //     // Fallback to single session calculation
// //     const loginMoment = moment(entry.loginTime);
// //     const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
    
// //     if (!loginMoment.isValid()) {
// //       console.log(`Invalid login time for: ${entry.employeeId?.name}`);
// //       return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
// //     }

// //     if (logoutMoment.isBefore(loginMoment)) {
// //       console.log(`Logout time before login time for: ${entry.employeeId?.name}`);
// //       return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
// //     }

// //     totalSeconds = Math.floor(logoutMoment.diff(loginMoment) / 1000);
// //   }

// //   const loginDuration = moment.duration(totalSeconds, "seconds");
// //   console.log(`Total duration for ${entry.employeeId?.name}: ${loginDuration.asHours()} hours`);

// //   let totalBreakSeconds = 0;
// //   if (entry.breaks && entry.breaks.length > 0) {
// //     console.log(`Processing ${entry.breaks.length} breaks for: ${entry.employeeId?.name}`);
// //     entry.breaks.forEach((breakItem, index) => {
// //       if (breakItem.start && breakItem.end) {
// //         const breakStart = moment(breakItem.start);
// //         const breakEnd = moment(breakItem.end);
// //         if (breakEnd.isAfter(breakStart)) {
// //           const breakSeconds = breakEnd.diff(breakStart, "seconds");
// //           totalBreakSeconds += breakSeconds;
// //           console.log(`Break ${index+1} for ${entry.employeeId?.name}: ${breakSeconds} seconds`);
// //         }
// //       }
// //     });
// //   }

// //   const breakDuration = moment.duration(totalBreakSeconds, "seconds");
// //   const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

// //   console.log(`Final durations for ${entry.employeeId?.name}: 
// //     Login: ${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m
// //     Break: ${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m
// //     Working: ${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`);

// //   return {
// //     loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
// //     breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
// //     workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
// //   };
// // };

// const calculateDurations = (entry) => {
//   console.log(`Calculating durations for: ${entry.employeeId?.name}`);

//   // Prefer workedSeconds (from backend), else fall back to totalDurationMs
//   let totalSeconds = entry.workedSeconds || (entry.totalDurationMs ? Math.floor(entry.totalDurationMs / 1000) : 0);

//   // If employee is still logged in, add current active session
//   if (!entry.logoutTime && entry.loginTime) {
//     const sessionSeconds = moment().diff(moment(entry.loginTime), "seconds");
//     totalSeconds += sessionSeconds;
//   }

//   const loginDuration = moment.duration(totalSeconds, "seconds");

//   // Calculate total break time
//   let totalBreakSeconds = 0;
//   if (entry.breaks && entry.breaks.length > 0) {
//     entry.breaks.forEach((b) => {
//       if (b.start && b.end) {
//         const breakStart = moment(b.start);
//         const breakEnd = moment(b.end);
//         if (breakEnd.isAfter(breakStart)) {
//           totalBreakSeconds += breakEnd.diff(breakStart, "seconds");
//         }
//       }
//     });
//   }

//   const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//   const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

//   return {
//     loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//     breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//     workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//   };
// };


// const fetchLoginData = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     let response = await axios.get(`${API_URL}/hours/all`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     }).catch(async () => {
//       return axios.get(`${API_URL}/hours`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//     });

//     // Step 1: Filter valid entries and calculate shift boundaries
//     const { shiftStart, shiftEnd } = getCurrentShiftBoundaries();
//     console.log(`Current shift: ${shiftStart.format()} to ${shiftEnd.format()}`);

//     // Get all records for current shift
//     let allShiftRecords = response.data
//       .filter(entry => entry.loginTime && entry.employeeId?.name)
//       .filter(entry => {
//         if (entry.employeeId?._id === supervisorId) return true;
//         const loginTime = moment(entry.loginTime);
//         return loginTime.isBetween(shiftStart, shiftEnd);
//       });

//     // Group by employee and calculate total time
//     const employeesMap = {};
    
//     allShiftRecords.forEach(entry => {
//       const empId = entry.employeeId?._id;
//       const empName = entry.employeeId?.name;
      
//       if (!employeesMap[empId]) {
//         employeesMap[empId] = {
//           employeeId: entry.employeeId,
//           loginTime: entry.loginTime, // Keep the latest login time
//           logoutTime: entry.logoutTime,
//           breaks: entry.breaks || [],
//           status: entry.logoutTime ? 'Logged Out' : 'Logged In',
//           totalDurationMs: 0,
//           latestRecord: entry
//         };
//       }
      
//       // Update to keep the latest login time
//       if (moment(entry.loginTime).isAfter(moment(employeesMap[empId].loginTime))) {
//         employeesMap[empId].loginTime = entry.loginTime;
//         employeesMap[empId].latestRecord = entry;
//       }
      
//       // Update logout time if this record has a later logout
//       if (entry.logoutTime && 
//           (!employeesMap[empId].logoutTime || 
//            moment(entry.logoutTime).isAfter(moment(employeesMap[empId].logoutTime)))) {
//         employeesMap[empId].logoutTime = entry.logoutTime;
//       }
      
//       // Calculate duration for this session
//       const loginMoment = moment(entry.loginTime);
//       const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
//       const durationMs = Math.max(0, logoutMoment.diff(loginMoment));
      
//       // Add to total duration
//       employeesMap[empId].totalDurationMs += durationMs;
      
//       // Merge breaks
//       if (entry.breaks && entry.breaks.length > 0) {
//         employeesMap[empId].breaks = [...(employeesMap[empId].breaks || []), ...entry.breaks];
//       }
//     });

//     // Convert map to array and set status
//     let filtered = Object.values(employeesMap).map(employee => {
//       const isSupervisor = employee.employeeId._id === supervisorId;
//       return {
//         ...employee.latestRecord,
//         employeeId: employee.employeeId,
//         loginTime: employee.loginTime, // Use the latest login time for display
//         logoutTime: employee.logoutTime,
//         breaks: employee.breaks,
//         // status: isSupervisor ? 'Logged In' : (employee.logoutTime ? 'Logged Out' : 'Logged In'),
//         status: employee.logoutTime ? 'Logged Out' : 'Logged In',
//         totalDurationMs: employee.totalDurationMs // Store total duration for calculation
//       };
//     });

//     console.log('Final filtered data with cumulative time:', filtered);

//     setLoginData(filtered);
//     setFilteredData(filtered);
//   } catch (err) {
//     console.error(err);
//     setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     console.log('Filtering data with name:', filterName);
//     const filtered = loginData.filter(entry =>
//       entry.employeeId?.name.toLowerCase().includes(filterName.toLowerCase())
//     );
//     console.log(`Filtered ${filtered.length} entries from ${loginData.length}`);
//     setFilteredData(filtered);
//   }, [filterName, loginData]);

//   useEffect(() => { 
//     console.log('Component mounted, fetching data');
//     fetchLoginData(); 
//   }, []);

//   return (
//     <div>
//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           Error: {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading attendance data...
//           </div>
//         </div>
//       ) : filteredData.length > 0 ? (
//         <>
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Filter by employee name..."
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <EmployeeStatusTable loginData={filteredData} calculateDurations={calculateDurations} />
//         </>
//       ) : (
//         <div className="p-6 text-center text-gray-500">
//           No attendance records found for the current shift (5PM to 4:59PM next day).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             Current shift date: {getShiftDate(moment())}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Table Component
// const EmployeeStatusTable = ({ loginData, calculateDurations }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 10;
//   const totalPages = Math.ceil(loginData.length / entriesPerPage);

//   console.log('EmployeeStatusTable rendered with', loginData.length, 'entries');
//   console.log('Current page:', currentPage, 'Total pages:', totalPages);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//   console.log('Showing entries', indexOfFirstEntry + 1, 'to', indexOfLastEntry);

//   const paginate = (pageNumber) => {
//     console.log('Changing to page:', pageNumber);
//     setCurrentPage(pageNumber);
//   };
  
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       console.log('Moving to next page:', currentPage + 1);
//       setCurrentPage(currentPage + 1);
//     }
//   };
  
//   const prevPage = () => {
//     if (currentPage > 1) {
//       console.log('Moving to previous page:', currentPage - 1);
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//         Employee Attendance Dashboard
//       </h2>

//       <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Employee
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Login Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Logout Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Total Duration
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Working Hours
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentEntries.map((item, index) => {
//               const name = item.employeeId?.name || 'N/A';
//               const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
              
//               // Only show logout time if employee has logged out
//               const logoutTime = item.status === 'Logged Out' && item.logoutTime 
//                 ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
//                 : '—';
              
//               // Determine break status
//               let breakStatus = 'Not on Break';
//               if (item.breaks && item.breaks.length > 0) {
//                 const lastBreak = item.breaks[item.breaks.length - 1];
//                 if (lastBreak.start && !lastBreak.end) {
//                   breakStatus = 'On Break';
//                 }
//               }

//               console.log(`Rendering row ${index}: ${name}, Status: ${item.status}, Break: ${breakStatus}`);

//               const durations = calculateDurations(item);

//               return (
//                 <tr
//                   key={index}
//                   className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium">
//                           {name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
//                       {loginTime}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     {logoutTime === '—' ? (
//                       <span className="text-gray-500">{logoutTime}</span>
//                     ) : (
//                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {logoutTime}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Logged In'
//                         ? 'bg-blue-100 text-blue-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
//                         ? 'bg-yellow-100 text-yellow-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {breakStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.loginDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.breakDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
//                     {durations.workingDuration}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {loginData.length > entriesPerPage && (
//         <div className="mt-6 flex items-center justify-between">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="h-3 w-3 rounded-full bg-blue-500"></span>
//             <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Previous
//             </button>

//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`w-10 h-10 rounded-md ${currentPage === number ?
//                     'bg-blue-600 text-white font-medium' :
//                     'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
//                     }`}
//                 >
//                   {number}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Next
//             </button>
//           </div>

//           <div className="text-sm text-gray-500">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;

//---------------------grok--------------------

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AdminLoginStatus = () => {
  const [loginData, setLoginData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [supervisorIds, setSupervisorIds] = useState([]); // Dynamic list of supervisor IDs

  console.log('AdminLoginStatus component rendered');

  // Fetch supervisor IDs from backend or config
useEffect(() => {
  const fetchSupervisors = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees/supervisors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSupervisorIds(response.data.map(sup => sup._id));
    } catch (err) {
      console.error('Error fetching supervisors:', err);
      setSupervisorIds([]); // Fallback to empty array
    }
  };
  fetchSupervisors();
}, []);

  const getShiftDate = (date) => {
    const checkTime = moment(date);
    const SHIFT_START_HOUR = 17; // 5 PM
    if (checkTime.hour() < SHIFT_START_HOUR) {
      return checkTime.subtract(1, 'day').format('YYYY-MM-DD');
    }
    return checkTime.format('YYYY-MM-DD');
  };

  const getCurrentShiftBoundaries = () => {
    const now = moment();
    let shiftStart, shiftEnd;
    
    if (now.hour() >= 17) {
      shiftStart = moment().hour(17).minute(0).second(0);
      shiftEnd = moment().add(1, 'day').hour(16).minute(59).second(59);
    } else {
      shiftStart = moment().subtract(1, 'day').hour(17).minute(0).second(0);
      shiftEnd = moment().hour(16).minute(59).second(59);
    }
    
    return { shiftStart, shiftEnd };
  };

  const isInSameShift = (date1, date2) => {
    const shift1 = getShiftDate(date1);
    const shift2 = getShiftDate(date2);
    console.log(`Comparing shifts: ${shift1} vs ${shift2}`);
    return shift1 === shift2;
  };

  const isInCurrentShift = (loginTime) => {
    const loginMoment = moment(loginTime);
    const now = moment();
    
    const currentShiftStart = now.hour() >= 17 
      ? moment().hour(17).minute(0).second(0)
      : moment().subtract(1, 'day').hour(17).minute(0).second(0);
    
    const result = loginMoment.isSameOrAfter(currentShiftStart);
    console.log(`Is login time ${loginTime} in current shift? ${result}, Current shift started at: ${currentShiftStart.format()}`);
    return result;
  };

  const isWithinLogicDay = (entry, isSupervisor = false) => {
    if (isSupervisor) {
      console.log(`Supervisor entry always included: ${entry.employeeId?.name}`);
      return true;
    }
    if (!entry.loginTime) {
      console.log(`Entry without login time excluded: ${entry.employeeId?.name}`);
      return false;
    }
    
    const now = moment();
    const currentShiftStart = now.hour() >= 17 
      ? moment().hour(17).minute(0).second(0)
      : moment().subtract(1, 'day').hour(17).minute(0).second(0);
    
    const currentShiftEnd = currentShiftStart.clone().add(24, 'hours').subtract(1, 'minute');
    
    const loginTime = moment(entry.loginTime);
    const isInCurrentShift = loginTime.isBetween(currentShiftStart, currentShiftEnd);
    
    console.log(`Entry ${entry.employeeId?.name}: Login ${loginTime.format()}, Shift ${currentShiftStart.format()} to ${currentShiftEnd.format()}, In shift: ${isInCurrentShift}`);
    
    return isInCurrentShift;
  };

  // const calculateDurations = (entry) => {
  //   console.log(`Calculating durations for: ${entry.employeeId?.name}`);

  //   let totalSeconds = entry.workedSeconds || (entry.totalDurationMs ? Math.floor(entry.totalDurationMs / 1000) : 0);

  //   if (!entry.logoutTime && entry.loginTime) {
  //     const sessionSeconds = moment().diff(moment(entry.loginTime), "seconds");
  //     totalSeconds += sessionSeconds;
  //   }

  //   const loginDuration = moment.duration(totalSeconds, "seconds");

  //   let totalBreakSeconds = 0;
  //   if (entry.breaks && entry.breaks.length > 0) {
  //     entry.breaks.forEach((b) => {
  //       if (b.start && b.end) {
  //         const breakStart = moment(b.start);
  //         const breakEnd = moment(b.end);
  //         if (breakEnd.isAfter(breakStart)) {
  //           totalBreakSeconds += breakEnd.diff(breakStart, "seconds");
  //         }
  //       }
  //     });
  //   }

  //   const breakDuration = moment.duration(totalBreakSeconds, "seconds");
  //   const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

  //   return {
  //     loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
  //     breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
  //     workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
  //   };
  // };


//   const calculateDurations = (entry) => {
//   console.log(`Calculating durations for: ${entry.employeeId?.name}`, entry);

//   // Prefer workedSeconds from backend, else fall back to totalDurationMs
//   let totalSeconds = entry.workedSeconds || (entry.totalDurationMs ? Math.floor(entry.totalDurationMs / 1000) : 0);
//   console.log(`Initial totalSeconds from backend: ${totalSeconds} seconds`);

//   // Add active session time if no logoutTime
//   if (!entry.logoutTime && entry.loginTime) {
//     const loginMoment = moment(entry.loginTime);
//     const sessionSeconds = moment().diff(loginMoment, "seconds");
//     console.log(`Adding active session: ${sessionSeconds} seconds from ${loginMoment.format()} to ${moment().format()}`);
//     totalSeconds += sessionSeconds;
//   }
//   console.log(`Final totalSeconds: ${totalSeconds} seconds`);

//   const loginDuration = moment.duration(totalSeconds, "seconds");

//   let totalBreakSeconds = 0;
//   if (entry.breaks && entry.breaks.length > 0) {
//     entry.breaks.forEach((b) => {
//       if (b.start && b.end) {
//         const breakStart = moment(b.start);
//         const breakEnd = moment(b.end);
//         if (breakEnd.isAfter(breakStart)) {
//           totalBreakSeconds += breakEnd.diff(breakStart, "seconds");
//         }
//       }
//     });
//     console.log(`Total break seconds: ${totalBreakSeconds}`);
//   }

//   const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//   const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

//   return {
//     loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//     breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//     workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//   };
// };


const calculateDurations = (entry) => {
  let totalSeconds = entry.workedSeconds || 0;
  if (!entry.logoutTime && entry.loginTime) {
    const loginMoment = moment(entry.loginTime);
    const sessionSeconds = moment().diff(loginMoment, "seconds");
    totalSeconds += sessionSeconds;
  }

  const loginDuration = moment.duration(totalSeconds, "seconds");
  let totalBreakSeconds = 0;
  if (entry.breaks && entry.breaks.length > 0) {
    entry.breaks.forEach((b) => {
      if (b.start && b.end) {
        totalBreakSeconds += moment(b.end).diff(moment(b.start), "seconds");
      }
    });
  }

  const breakDuration = moment.duration(totalBreakSeconds, "seconds");
  const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

  return {
    loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
    breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
    workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
  };
};

const fetchLoginData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch all login hours
    const response = await axios.get(`${API_URL}/hours/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const { shiftStart, shiftEnd } = getCurrentShiftBoundaries();
    console.log(`Current shift: ${shiftStart.format()} to ${shiftEnd.format()}`);

    let allShiftRecords = response.data
      .filter(entry => entry.loginTime && entry.employeeId?.name)
      .filter(entry => {
        const isSupervisor = supervisorIds.includes(entry.employeeId?._id);
        return isSupervisor || isWithinLogicDay(entry);
      });

    const employeesMap = {};
    allShiftRecords.forEach(entry => {
      const empId = entry.employeeId?._id;
      if (!employeesMap[empId]) {
        employeesMap[empId] = {
          employeeId: entry.employeeId,
          loginTime: entry.loginTime,
          logoutTime: entry.logoutTime,
          breaks: entry.breaks || [],
          status: entry.logoutTime ? 'Logged Out' : 'Logged In',
          totalDurationMs: 0,
          latestRecord: entry
        };
      }
        
        if (moment(entry.loginTime).isAfter(moment(employeesMap[empId].loginTime))) {
          employeesMap[empId].loginTime = entry.loginTime;
          employeesMap[empId].latestRecord = entry;
        }
        
        if (entry.logoutTime && 
            (!employeesMap[empId].logoutTime || 
             moment(entry.logoutTime).isAfter(moment(employeesMap[empId].logoutTime)))) {
          employeesMap[empId].logoutTime = entry.logoutTime;
        }
        
        const loginMoment = moment(entry.loginTime);
        const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
        const durationMs = Math.max(0, logoutMoment.diff(loginMoment));
        
        employeesMap[empId].totalDurationMs += durationMs;
        
        if (entry.breaks && entry.breaks.length > 0) {
          employeesMap[empId].breaks = [...(employeesMap[empId].breaks || []), ...entry.breaks];
        }
      });

     let filtered = Object.values(employeesMap).map(employee => ({
      ...employee.latestRecord,
      employeeId: employee.employeeId,
      loginTime: employee.loginTime,
      logoutTime: employee.logoutTime,
      breaks: employee.breaks,
      status: employee.logoutTime ? 'Logged Out' : 'Logged In',
      totalDurationMs: employee.totalDurationMs
    }));

    console.log('Final filtered data with cumulative time:', filtered);
    setLoginData(filtered);
    setFilteredData(filtered);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message || 'Failed to fetch data');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    console.log('Filtering data with name:', filterName);
    const filtered = loginData.filter(entry =>
      entry.employeeId?.name.toLowerCase().includes(filterName.toLowerCase())
    );
    console.log(`Filtered ${filtered.length} entries from ${loginData.length}`);
    setFilteredData(filtered);
  }, [filterName, loginData]);

  useEffect(() => {
    console.log('Component mounted, fetching data');
    fetchLoginData();
  }, [supervisorIds]);

  return (
    <div>
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      )}
      {loading ? (
        <div className="p-6 text-center">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading attendance data...
          </div>
        </div>
      ) : filteredData.length > 0 ? (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Filter by employee name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <EmployeeStatusTable loginData={filteredData} calculateDurations={calculateDurations} />
        </>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No attendance records found for the current shift (5PM to 4:59PM next day).
          <div className="mt-4 text-sm">
            Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
            <br />
            Current shift date: {getShiftDate(moment())}
          </div>
        </div>
      )}
    </div>
  );
};

// Table Component (unchanged)
const EmployeeStatusTable = ({ loginData, calculateDurations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const totalPages = Math.ceil(loginData.length / entriesPerPage);

  console.log('EmployeeStatusTable rendered with', loginData.length, 'entries');
  console.log('Current page:', currentPage, 'Total pages:', totalPages);

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

  console.log('Showing entries', indexOfFirstEntry + 1, 'to', indexOfLastEntry);

  const paginate = (pageNumber) => {
    console.log('Changing to page:', pageNumber);
    setCurrentPage(pageNumber);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      console.log('Moving to next page:', currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      console.log('Moving to previous page:', currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
        Employee Attendance Dashboard
      </h2>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Login Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Logout Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Break Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Total Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Break Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Working Hours
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEntries.map((item, index) => {
              const name = item.employeeId?.name || 'N/A';
              const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
              
              const logoutTime = item.status === 'Logged Out' && item.logoutTime 
                ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
                : '—';
              
              let breakStatus = 'Not on Break';
              if (item.breaks && item.breaks.length > 0) {
                const lastBreak = item.breaks[item.breaks.length - 1];
                if (lastBreak.start && !lastBreak.end) {
                  breakStatus = 'On Break';
                }
              }

              console.log(`Rendering row ${index}: ${name}, Status: ${item.status}, Break: ${breakStatus}`);

              const durations = calculateDurations(item);

              return (
                <tr
                  key={index}
                  className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {loginTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {logoutTime === '—' ? (
                      <span className="text-gray-500">{logoutTime}</span>
                    ) : (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {logoutTime}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Logged In'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
                        ? 'bg-yellow-100 text-yellow-800 animate-pulse'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {breakStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {durations.loginDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {durations.breakDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    {durations.workingDuration}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loginData.length > entriesPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
                'bg-gray-100 text-gray-400 cursor-not-allowed' :
                'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
                }`}
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-md ${currentPage === number ?
                    'bg-blue-600 text-white font-medium' :
                    'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
                'bg-gray-100 text-gray-400 cursor-not-allowed' :
                'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
                }`}
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoginStatus;

//=================7--3=if many supervisor then---------

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterName, setFilterName] = useState('');
//   const [lastUpdated, setLastUpdated] = useState(moment());

//   console.log('AdminLoginStatus component rendered');

//   // Check if an employee is a supervisor based on role
//   const isSupervisor = (employee) => {
//     return employee?.role === 'supervisor' || employee?.role === 'admin';
//   };

//   const getCurrentShiftBoundaries = () => {
//     const now = moment();
//     let shiftStart, shiftEnd;
    
//     if (now.hour() >= 17) {
//       // After 5 PM today - shift started today at 5 PM
//       shiftStart = moment().hour(17).minute(0).second(0);
//       shiftEnd = moment().add(1, 'day').hour(16).minute(59).second(59);
//     } else {
//       // Before 5 PM today - shift started yesterday at 5 PM
//       shiftStart = moment().subtract(1, 'day').hour(17).minute(0).second(0);
//       shiftEnd = moment().hour(16).minute(59).second(59);
//     }
    
//     return { shiftStart, shiftEnd };
//   };

//   const calculateDurations = (entry) => {
//     console.log(`Calculating durations for: ${entry.employeeId?.name}`);
    
//     // Use the cumulative time if available, otherwise calculate from single session
//     let totalSeconds = 0;
    
//     if (entry.totalDurationMs) {
//       // Use the pre-calculated cumulative time
//       totalSeconds = Math.floor(entry.totalDurationMs / 1000);
//       console.log(`Using cumulative time: ${totalSeconds} seconds`);
//     } else {
//       // Fallback to single session calculation
//       const loginMoment = moment(entry.loginTime);
//       const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
      
//       if (!loginMoment.isValid()) {
//         console.log(`Invalid login time for: ${entry.employeeId?.name}`);
//         return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
//       }

//       if (logoutMoment.isBefore(loginMoment)) {
//         console.log(`Logout time before login time for: ${entry.employeeId?.name}`);
//         return { loginDuration: "0h 0m", breakDuration: "0h 0m", workingDuration: "0h 0m" };
//       }

//       totalSeconds = Math.floor(logoutMoment.diff(loginMoment) / 1000);
//     }

//     const loginDuration = moment.duration(totalSeconds, "seconds");
//     console.log(`Total duration for ${entry.employeeId?.name}: ${loginDuration.asHours()} hours`);

//     let totalBreakSeconds = 0;
//     if (entry.breaks && entry.breaks.length > 0) {
//       console.log(`Processing ${entry.breaks.length} breaks for: ${entry.employeeId?.name}`);
//       entry.breaks.forEach((breakItem, index) => {
//         if (breakItem.start && breakItem.end) {
//           const breakStart = moment(breakItem.start);
//           const breakEnd = moment(breakItem.end);
//           if (breakEnd.isAfter(breakStart)) {
//             const breakSeconds = breakEnd.diff(breakStart, "seconds");
//             totalBreakSeconds += breakSeconds;
//             console.log(`Break ${index+1} for ${entry.employeeId?.name}: ${breakSeconds} seconds`);
//           }
//         }
//       });
//     }

//     const breakDuration = moment.duration(totalBreakSeconds, "seconds");
//     const workingDuration = moment.duration(totalSeconds - totalBreakSeconds, "seconds");

//     console.log(`Final durations for ${entry.employeeId?.name}: 
//       Login: ${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m
//       Break: ${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m
//       Working: ${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`);

//     return {
//       loginDuration: `${Math.floor(loginDuration.asHours())}h ${loginDuration.minutes()}m`,
//       breakDuration: `${Math.floor(breakDuration.asHours())}h ${breakDuration.minutes()}m`,
//       workingDuration: `${Math.floor(workingDuration.asHours())}h ${workingDuration.minutes()}m`,
//     };
//   };

//   const fetchLoginData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       let response = await axios.get(`${API_URL}/hours/all`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       }).catch(async () => {
//         return axios.get(`${API_URL}/hours`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//       });

//       // Step 1: Filter valid entries and calculate shift boundaries
//       const { shiftStart, shiftEnd } = getCurrentShiftBoundaries();
//       console.log(`Current shift: ${shiftStart.format()} to ${shiftEnd.format()}`);

//       // Get all records for current shift
//       let allShiftRecords = response.data
//         .filter(entry => entry.loginTime && entry.employeeId?.name)
//         .filter(entry => {
//           // Always include supervisors
//           if (isSupervisor(entry.employeeId)) return true;
          
//           // For regular employees, check if they're in current shift
//           const loginTime = moment(entry.loginTime);
//           return loginTime.isBetween(shiftStart, shiftEnd);
//         });

//       // Group by employee and calculate total time
//       const employeesMap = {};
      
//       allShiftRecords.forEach(entry => {
//         const empId = entry.employeeId?._id;
//         const empName = entry.employeeId?.name;
        
//         if (!employeesMap[empId]) {
//           employeesMap[empId] = {
//             employeeId: entry.employeeId,
//             loginTime: entry.loginTime, // Keep the latest login time
//             logoutTime: entry.logoutTime,
//             breaks: entry.breaks || [],
//             status: isSupervisor(entry.employeeId) ? 'Logged In' : (entry.logoutTime ? 'Logged Out' : 'Logged In'),
//             totalDurationMs: 0,
//             latestRecord: entry
//           };
//         }
        
//         // Update to keep the latest login time
//         if (moment(entry.loginTime).isAfter(moment(employeesMap[empId].loginTime))) {
//           employeesMap[empId].loginTime = entry.loginTime;
//           employeesMap[empId].latestRecord = entry;
//         }
        
//         // Update logout time if this record has a later logout
//         if (entry.logoutTime && 
//             (!employeesMap[empId].logoutTime || 
//              moment(entry.logoutTime).isAfter(moment(employeesMap[empId].logoutTime)))) {
//           employeesMap[empId].logoutTime = entry.logoutTime;
//         }
        
//         // Calculate duration for this session
//         const loginMoment = moment(entry.loginTime);
//         const logoutMoment = entry.logoutTime ? moment(entry.logoutTime) : moment();
//         const durationMs = Math.max(0, logoutMoment.diff(loginMoment));
        
//         // Add to total duration
//         employeesMap[empId].totalDurationMs += durationMs;
        
//         // Merge breaks
//         if (entry.breaks && entry.breaks.length > 0) {
//           employeesMap[empId].breaks = [...(employeesMap[empId].breaks || []), ...entry.breaks];
//         }
//       });

//       // Convert map to array
//       let filtered = Object.values(employeesMap).map(employee => {
//         return {
//           ...employee.latestRecord,
//           employeeId: employee.employeeId,
//           loginTime: employee.loginTime, // Use the latest login time for display
//           logoutTime: employee.logoutTime,
//           breaks: employee.breaks,
//           status: isSupervisor(employee.employeeId) ? 'Logged In' : (employee.logoutTime ? 'Logged Out' : 'Logged In'),
//           totalDurationMs: employee.totalDurationMs // Store total duration for calculation
//         };
//       });

//       console.log('Final filtered data with cumulative time:', filtered);

//       setLoginData(filtered);
//       setFilteredData(filtered);
//       setLastUpdated(moment());
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || err.message || 'Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-refresh data every 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log('Auto-refreshing data...');
//       fetchLoginData();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     console.log('Filtering data with name:', filterName);
//     const filtered = loginData.filter(entry =>
//       entry.employeeId?.name.toLowerCase().includes(filterName.toLowerCase())
//     );
//     console.log(`Filtered ${filtered.length} entries from ${loginData.length}`);
//     setFilteredData(filtered);
//   }, [filterName, loginData]);

//   useEffect(() => { 
//     console.log('Component mounted, fetching data');
//     fetchLoginData(); 
//   }, []);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Employee Attendance Dashboard</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-gray-500">
//             Last updated: {lastUpdated.format('HH:mm:ss')}
//           </span>
//           <button
//             onClick={fetchLoginData}
//             disabled={loading}
//             className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
//           >
//             {loading ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           Error: {error}
//         </div>
//       )}
//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Loading attendance data...
//           </div>
//         </div>
//       ) : filteredData.length > 0 ? (
//         <>
//           <div className="mb-6">
//             <input
//               type="text"
//               placeholder="Filter by employee name..."
//               value={filterName}
//               onChange={(e) => setFilterName(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//           <EmployeeStatusTable loginData={filteredData} calculateDurations={calculateDurations} />
//         </>
//       ) : (
//         <div className="p-6 text-center text-gray-500">
//           No attendance records found for the current shift (5PM to 4:59PM next day).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Table Component (keep your existing EmployeeStatusTable component as is)
// const EmployeeStatusTable = ({ loginData, calculateDurations }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const entriesPerPage = 10;
//   const totalPages = Math.ceil(loginData.length / entriesPerPage);

//   console.log('EmployeeStatusTable rendered with', loginData.length, 'entries');
//   console.log('Current page:', currentPage, 'Total pages:', totalPages);

//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//   console.log('Showing entries', indexOfFirstEntry + 1, 'to', indexOfLastEntry);

//   const paginate = (pageNumber) => {
//     console.log('Changing to page:', pageNumber);
//     setCurrentPage(pageNumber);
//   };
  
//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       console.log('Moving to next page:', currentPage + 1);
//       setCurrentPage(currentPage + 1);
//     }
//   };
  
//   const prevPage = () => {
//     if (currentPage > 1) {
//       console.log('Moving to previous page:', currentPage - 1);
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//         Employee Attendance Dashboard
//       </h2>

//       <div className="overflow-hidden rounded-xl border border-gray-200 shadow-2xl">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//             <tr>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Employee
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Login Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Logout Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Status
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Total Duration
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Break Time
//               </th>
//               <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
//                 Working Hours
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentEntries.map((item, index) => {
//               const name = item.employeeId?.name || 'N/A';
//               const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
              
//               // Only show logout time if employee has logged out
//               const logoutTime = item.status === 'Logged Out' && item.logoutTime 
//                 ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') 
//                 : '—';
              
//               // Determine break status
//               let breakStatus = 'Not on Break';
//               if (item.breaks && item.breaks.length > 0) {
//                 const lastBreak = item.breaks[item.breaks.length - 1];
//                 if (lastBreak.start && !lastBreak.end) {
//                   breakStatus = 'On Break';
//                 }
//               }

//               console.log(`Rendering row ${index}: ${name}, Status: ${item.status}, Break: ${breakStatus}`);

//               const durations = calculateDurations(item);

//               return (
//                 <tr
//                   key={index}
//                   className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-600 font-medium">
//                           {name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{name}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
//                       {loginTime}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     {logoutTime === '—' ? (
//                       <span className="text-gray-500">{logoutTime}</span>
//                     ) : (
//                       <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
//                         {logoutTime}
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Logged In'
//                         ? 'bg-blue-100 text-blue-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${breakStatus === 'On Break'
//                         ? 'bg-yellow-100 text-yellow-800 animate-pulse'
//                         : 'bg-gray-100 text-gray-800'
//                       }`}>
//                       {breakStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.loginDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
//                     {durations.breakDuration}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
//                     {durations.workingDuration}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       {loginData.length > entriesPerPage && (
//         <div className="mt-6 flex items-center justify-between">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="h-3 w-3 rounded-full bg-blue-500"></span>
//             <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//           </div>

//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border ${currentPage === 1 ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Previous
//             </button>

//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`w-10 h-10 rounded-md ${currentPage === number ?
//                     'bg-blue-600 text-white font-medium' :
//                     'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
//                     }`}
//                 >
//                   {number}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={nextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md border ${currentPage === totalPages ?
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
//             >
//               Next
//             </button>
//           </div>

//           <div className="text-sm text-gray-500">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;
