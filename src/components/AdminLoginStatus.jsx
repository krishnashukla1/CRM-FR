//=======================ALL DAYS LOGIN=================

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);

//   useEffect(() => {
//     fetchLoginData();
//   }, []);

//   const fetchLoginData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/hours/all`);
//       setLoginData(response.data);
//     } catch (error) {
//       console.error('Failed to fetch login data', error);
//     }
//   };

//   const EmployeeStatusTable = ({ loginData }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const entriesPerPage = 5;
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
//       <div className="p-6 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
//         <h2 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//           Employee Attendance Dashboard
//         </h2>
        
//         <div className="overflow-hidden border border-gray-200 shadow-2xl rounded-xl">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//               <tr>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Employee
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Email
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Login Time
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Logout Time
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentEntries.map((item, index) => {
//                 const name = item.employeeId?.name || 'N/A';
//                 const email = item.employeeId?.email || 'N/A';
//                 const loginTime = moment(item.loginTime).format('hh:mm A');
//                 const logoutTime = item.logoutTime ? moment(item.logoutTime).format('hh:mm A') : '—';
//                 const status = item.logoutTime ? 'Logged Out' : 'Logged In';
//                 const date = moment(item.date).format('YYYY-MM-DD');

//                 return (
//                   <tr 
//                     key={index} 
//                     className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
//                           <span className="font-medium text-blue-600">
//                             {name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                       {email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="inline-block px-3 py-1 text-sm text-gray-900 bg-gray-100 rounded-full">
//                         {date}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
//                       <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                         {loginTime}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
//                       {logoutTime === '—' ? (
//                         <span className="text-gray-500">{logoutTime}</span>
//                       ) : (
//                         <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
//                           {logoutTime}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         status === 'Logged In' 
//                           ? 'bg-blue-100 text-blue-800 animate-pulse' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination Controls */}
//         <div className="flex items-center justify-between mt-6">
//           <div className="flex items-center space-x-2 text-sm text-gray-600">
//             <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
//             <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//           </div>
          
//           <div className="flex space-x-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 
//                 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
//                 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//               }`}
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
//                   }`}
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
//               }`}
//             >
//               Next
//             </button>
//           </div>
          
//           <div className="text-sm text-gray-500">
//             Page {currentPage} of {totalPages}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div>
//       {loginData.length > 0 ? (
//         <EmployeeStatusTable loginData={loginData} />
//       ) : (
//         <div className="p-6 text-center">
//           <p>Loading employee data...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;

//===========================TODAYS EMPLOYEE LOGIN=============

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const AdminLoginStatus = () => {
//   const [loginData, setLoginData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Custom function to check if a date is within the current "logic day" (9PM to 8:59PM next day)
//   const isWithinLogicDay = (date) => {
//     const checkTime = moment(date);
//     const today9PM = moment().set({ hour: 21, minute: 0, second: 0 });
//     const yesterday9PM = moment().subtract(1, 'day').set({ hour: 21, minute: 0, second: 0 });
    
//     return checkTime.isBetween(yesterday9PM, today9PM);
//   };

//   useEffect(() => {
//     fetchLoginData();
//   }, []);

//   const fetchLoginData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Try multiple endpoints if needed
//       let response;
//       try {
//         response = await axios.get(`${API_URL}/hours/all`);
//       } catch (e) {
//         console.log('Trying fallback endpoint...');
//         response = await axios.get(`${API_URL}/hours`);
//       }
      
//       // Filter for current logic day (9PM to 8:59PM)
//       const filteredData = response.data.filter(entry => 
//         entry.loginTime && isWithinLogicDay(entry.loginTime)
//       );
      
//       // If no data found, check if we're in the "gap" period
//       if (filteredData.length === 0) {
//         const now = moment();
//         const today9PM = moment().set({ hour: 21, minute: 0, second: 0 });
//         const yesterday9PM = moment().subtract(1, 'day').set({ hour: 21, minute: 0, second: 0 });
        
//         if (now.isBefore(today9PM)) {
//           // If before 9PM today, show yesterday's data
//           const yesterdayData = response.data.filter(entry => 
//             entry.loginTime && moment(entry.loginTime).isBetween(
//               yesterday9PM.subtract(1, 'day'),
//               yesterday9PM
//             )
//           );
//           setLoginData(yesterdayData);
//         } else {
//           setLoginData([]);
//         }
//       } else {
//         setLoginData(filteredData);
//       }
//     } catch (error) {
//       console.error('Failed to fetch login data', error);
//       setError(error.response?.data?.message || error.message || 'Failed to fetch data');
      
//       // For testing purposes, you can uncomment this to use mock data
//       // setLoginData(mockData.filter(entry => isWithinLogicDay(entry.loginTime)));
//     } finally {
//       setLoading(false);
//     }
//   };


//   const EmployeeStatusTable = ({ loginData }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const entriesPerPage = 5;
//     const totalPages = Math.ceil(loginData.length / entriesPerPage);

//     // Get current page data
//     const indexOfLastEntry = currentPage * entriesPerPage;
//     const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//     const currentEntries = loginData.slice(indexOfFirstEntry, indexOfLastEntry);

//     // Change page
//     const paginate = (pageNumber) => setCurrentPage(pageNumber);
//     const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//     const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

//     // Determine current status more accurately
//     const getCurrentStatus = (item) => {
//       if (!item.logoutTime) return 'Logged In';
//       const logoutMoment = moment(item.logoutTime);
//       const loginMoment = moment(item.loginTime);
//       return moment().isBetween(loginMoment, logoutMoment) ? 'Logged In' : 'Logged Out';
//     };

//     return (
//       <div className="p-6 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
//         <h2 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
//           Employee Attendance (9PM to 8:59PM)
//         </h2>
        
//         <div className="overflow-hidden border border-gray-200 shadow-2xl rounded-xl">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
//               <tr>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Employee
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Email
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Login Time
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Logout Time
//                 </th>
//                 <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
//                   Current Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentEntries.map((item, index) => {
//                 const name = item.employeeId?.name || 'N/A';
//                 const email = item.employeeId?.email || 'N/A';
//                 const loginTime = moment(item.loginTime).format('YYYY-MM-DD hh:mm A');
//                 const logoutTime = item.logoutTime ? moment(item.logoutTime).format('YYYY-MM-DD hh:mm A') : '—';
//                 const status = getCurrentStatus(item);

//                 return (
//                   <tr 
//                     key={index} 
//                     className="transition-all duration-150 hover:bg-blue-50 hover:shadow-inner"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
//                           <span className="font-medium text-blue-600">
//                             {name.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                       {email}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
//                       <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
//                         {loginTime}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
//                       {logoutTime === '—' ? (
//                         <span className="text-gray-500">{logoutTime}</span>
//                       ) : (
//                         <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
//                           {logoutTime}
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                         status === 'Logged In' 
//                           ? 'bg-blue-100 text-blue-800 animate-pulse' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination Controls */}
//         {loginData.length > entriesPerPage && (
//           <div className="flex items-center justify-between mt-6">
//             <div className="flex items-center space-x-2 text-sm text-gray-600">
//               <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
//               <span>Showing {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, loginData.length)} of {loginData.length} entries</span>
//             </div>
            
//             <div className="flex space-x-2">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 
//                   'bg-gray-100 text-gray-400 cursor-not-allowed' : 
//                   'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 hover:shadow-md transition-all'
//                 }`}
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
//                     }`}
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
//                 }`}
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
//           Error: {error} - Showing available data
//         </div>
//       )}
      
//       {loading ? (
//         <div className="p-6 text-center">
//           <div className="inline-flex items-center">
//             <svg className="w-5 h-5 mr-3 -ml-1 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
//           No attendance records found for the current period (9PM to 8:59PM).
//           <div className="mt-4 text-sm">
//             Current server time: {moment().format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             Showing data between: {moment().subtract(1, 'day').set({ hour: 21, minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss')}
//             <br />
//             and: {moment().set({ hour: 21, minute: 0, second: 0 }).format('YYYY-MM-DD HH:mm:ss')}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLoginStatus;

//============================================================


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
            <svg className="w-5 h-5 mr-3 -ml-1 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading attendance data...
          </div>
        </div>
      ) : filteredData.length > 0 ? (
        <>
          <div className="mb-6 mt-15">
            <input
              type="text"
              placeholder="Filter by employee name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    <div className="p-6 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <h2 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
        Employee Attendance Dashboard
      </h2>

      <div className="overflow-hidden border border-gray-200 shadow-2xl rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Employee
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Login Time
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Logout Time
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Break Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Total Duration
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
                Break Time
              </th>
              <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-white uppercase">
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
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                        <span className="font-medium text-blue-600">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      {loginTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {logoutTime === '—' ? (
                      <span className="text-gray-500">{logoutTime}</span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
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
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                    {durations.loginDuration}
                  </td>
                  <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                    {durations.breakDuration}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                    {durations.workingDuration}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {loginData.length > entriesPerPage && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
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
