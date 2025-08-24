// // routes/attendance.jsx
// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const Attendance = ({ attendance }) => {
//   return (
//     <PageWithCloseButton title="📅 Attendance">
//       <div className="overflow-x-auto mt-4">
//         {attendance.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                 <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendance.map((a) => {
//                 const dateObj = new Date(a.date);
//                 const isSunday = dateObj.getDay() === 0;
//                 const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

//                 return (
//                   <tr key={a._id} className={isSunday ? 'bg-blue-50' : ''}>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
//                       {dateObj.toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
//                       {dayName}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm">
//                       <span className={isSunday ? 'text-blue-700 font-medium' : 'text-gray-800'}>
//                         {isSunday ? 'Weekly Off (Sunday)' : a.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No attendance records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Attendance;

//-------------------------------------------------
/*
officialStart = 9:00 PM
bufferLimit = 10:00 PM
So if employee logs in after 10:00 PM, they are marked Late
If login is before or by 10:00 PM, they are marked Present
*/

// import React, { useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// import dayjs from "dayjs";
// import axios from 'axios';

// const Attendance = () => {
//   const { attendance = [] } = useOutletContext();

// useEffect(() => {
//   const loginTime = dayjs(); // current login time
//   // const officialStart = dayjs().hour(10).minute(0).second(0); // 10:00 AM
//   const officialStart = dayjs().hour(21).minute(0).second(0); // 9:00 PM (21:00 in 24-hour format)
//   const bufferLimit = officialStart.add(1, 'hour'); // 11:00 AM

//   let status = "";

//   if (loginTime.isAfter(bufferLimit)) {
//     status = "Late";
//   } else {
//     status = "Present";
//   }

//  // Call API to mark attendance (once per login)
//     const token = localStorage.getItem("token");
//     const markAttendance = async () => {
//       try {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
//           { status },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.error("Failed to mark attendance:", error);
//       }
//     };

//     markAttendance();
//   }, []);

//   return (
//     <PageWithCloseButton title="📅 Attendance">
//       <div className="overflow-x-auto mt-4">
//         {attendance.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                 <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>

//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendance.map((a) => {
//                 const dateObj = new Date(a.date);
//                 const isSunday = dateObj.getDay() === 0;
//                 const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

//                 return (
//                   <tr key={a._id} className={isSunday ? 'bg-blue-50' : ''}>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
//                       {dateObj.toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
//                       {dayName}
//                     </td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm">
//                       <span className={isSunday ? 'text-blue-700 font-medium' : 'text-gray-800'}>
//                         {isSunday ? 'Weekly Off (Sunday)' : a.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No attendance records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Attendance;

//=======================================
/*Time of Login	Attendance Status
Before 10:00 PM	Present
Between 10:00–11:59 PM	Late
After 11:59 PM	Next Day or Absent */

//------------------------this code is correct---------------------------
// import React, { useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// import dayjs from 'dayjs';
// import axios from 'axios';

// const Attendance = () => {
//   const { attendance = [] } = useOutletContext();

//   // useEffect(() => {
//   //   const loginTime = dayjs(); // current login time
//   //   const officialStart = dayjs().hour(21).minute(0).second(0); // 9:00 PM
//   //   const bufferLimit = officialStart.add(1, 'hour'); // 10:00 PM
//   //   const endOfDay = dayjs().hour(23).minute(59).second(59); // 11:59 PM

//   //   let status = 'Present';
//   //   if (loginTime.isAfter(endOfDay)) {
//   //     status = 'Next Day or Absent';
//   //   } else if (loginTime.isAfter(bufferLimit)) {
//   //     status = 'Late';
//   //   }

//   //   const token = localStorage.getItem('token');

//   //   const markAttendance = async () => {
//   //     try {
//   //       await axios.post(
//   //         `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
//   //         { status },
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${token}`,
//   //           },
//   //         }
//   //       );
//   //     } catch (error) {
//   //       console.error('Failed to mark attendance:', error);
//   //     }
//   //   };

//   //   markAttendance();
//   // }, []);




//   //FOR 5 PM TO 4:59 PM MARK ATTENDANCE



//   useEffect(() => {
//   const now = dayjs(); // current time
//   //buffer 1 hour
//   // const officialStart = dayjs().hour(17).minute(0).second(0); // 5:00 PM today
//   // const bufferLimit = officialStart.add(1, 'hour'); // 6:00 PM today
//   // const endOfWindow = officialStart.add(23, 'hour').add(59, 'minute').add(59, 'second'); // next day 4:59:59 PM

//   //no buffer End time is same day 11:59 PM, not next day.
//   const startWindow = dayjs().hour(17).minute(0).second(0); // 5:00 PM today
//     const endWindow = dayjs().hour(23).minute(59).second(59); // 11:59 PM today


//   // let status = 'Present';
//   // if (now.isAfter(endOfWindow)) {
//   //   status = 'Next Day or Absent';
//   // } else if (now.isAfter(bufferLimit)) {
//   //   status = 'Late';
//   // }
//  let status = 'Absent';
//   if (now.isAfter(startWindow) && now.isBefore(endWindow)) {
//     status = 'Present';
//   }

//   const token = localStorage.getItem('token');

//   const markAttendance = async () => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     } catch (error) {
//       console.error('Failed to mark attendance:', error);
//     }
//   };

//   markAttendance();
// }, []);

//   return (
//     <PageWithCloseButton title="📅 Attendance">
//       <div className="overflow-x-auto mt-4">
//         {attendance.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                 <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendance.map((a) => {
//                 const dateObj = new Date(a.date);
//                 const isSunday = dateObj.getDay() === 0;
//                 const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//                 const formattedDate = dateObj.toLocaleDateString();

//                 return (
//                   <tr key={a._id} className={isSunday ? 'bg-blue-50' : ''}>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formattedDate}</td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{dayName}</td>
//                     <td className="px-4 py-2 whitespace-nowrap text-sm">
//                       <span className={isSunday ? 'text-blue-700 font-medium' : 'text-gray-800'}>
//                         {isSunday ? 'Weekly Off (Sunday)' : a.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-500">No attendance records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };



// export default Attendance;
//===================below code just same as above only css add==================

// import React, { useEffect,useState } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// import dayjs from 'dayjs';
// import axios from 'axios';

// const Attendance = () => {
//   const { attendance = [] } = useOutletContext();
// const [currentPage, setCurrentPage] = useState(1);
// const [itemsPerPage] = useState(10);


//   // Status configuration with colors and icons
//   const statusConfig = {
//     Present: {
//       bg: 'bg-green-50',
//       text: 'text-green-700',
//       border: 'border-green-200',
//       icon: '✅'
//     },
//     Absent: {
//       bg: 'bg-red-50',
//       text: 'text-red-700',
//       border: 'border-red-200',
//       icon: '❌'
//     },
//     Late: {
//       bg: 'bg-yellow-50',
//       text: 'text-yellow-700',
//       border: 'border-yellow-200',
//       icon: '⏰'
//     },
//     'Half Day': {
//       bg: 'bg-orange-50',
//       text: 'text-orange-700',
//       border: 'border-orange-200',
//       icon: '½'
//     },
//     'Weekly Off': {
//       bg: 'bg-blue-50',
//       text: 'text-blue-700',
//       border: 'border-blue-200',
//       icon: '🌴'
//     },
//     Holiday: {
//       bg: 'bg-purple-50',
//       text: 'text-purple-700',
//       border: 'border-purple-200',
//       icon: '🎉'
//     }
//   };

//   useEffect(() => {
//     const now = dayjs();
//     const startWindow = dayjs().hour(17).minute(0).second(0); // 5:00 PM today
//     const endWindow = dayjs().hour(23).minute(59).second(59); // 11:59 PM today

//     let status = 'Absent';
//     if (now.isAfter(startWindow) && now.isBefore(endWindow)) {
//       status = 'Present';
//     }

//     const token = localStorage.getItem('token');

//     const markAttendance = async () => {
//       try {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
//           { status },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//       } catch (error) {
//         console.error('Failed to mark attendance:', error);
//       }
//     };

//     markAttendance();
//   }, []);

//   // StatusBadge component
//   const StatusBadge = ({ status }) => {
//     const config = statusConfig[status] || { 
//       bg: 'bg-gray-100', 
//       text: 'text-gray-800',
//       border: 'border-gray-200',
//       icon: 'ℹ️'
//     };
//     return (
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
//         <span className="mr-1">{config.icon}</span>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <PageWithCloseButton title="📅 Attendance">

//       <div className="space-y-4">
//         {/* Attendance Table */}


//         {/* <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
//           <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
//             <h2 className="text-lg font-semibold text-indigo-800">Attendance Records</h2>
//           </div>

//           {attendance.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 ml-10text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                     <th className="px-6 py-3 ml-10text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {attendance.map((a) => {
//                     const dateObj = new Date(a.date);
//                     const isSunday = dateObj.getDay() === 0;
//                     const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//                     const formattedDate = dateObj.toLocaleDateString();
//                     const status = isSunday ? 'Weekly Off' : a.status;

//                     return (
//                       <tr 
//                         key={a._id} 
//                         className={`${statusConfig[status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {formattedDate}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center">
//                             <span className={`w-2 h-2 rounded-full mr-2 ${
//                               status === 'Present' ? 'bg-green-500' :
//                               status === 'Absent' ? 'bg-red-500' :
//                               status === 'Half Day' ? 'bg-orange-500' :
//                               'bg-blue-500'
//                             }`}></span>
//                             {dayName}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <StatusBadge status={status} />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500 bg-gray-50">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-700">No attendance records found</h3>
//               <p className="mt-1 text-sm text-gray-500">Your attendance records will appear here.</p>
//             </div>
//           )}
//         </div> */}

//  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
//     <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
//       <h2 className="text-lg font-semibold text-indigo-800">Attendance Records</h2>
//     </div>

//     {attendance.length > 0 ? (
//       <>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 ml-10text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                 <th className="px-6 py-3 ml-10text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {attendance.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((a) => {
//                 const dateObj = new Date(a.date);
//                 const isSunday = dateObj.getDay() === 0;
//                 const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//                 const formattedDate = dateObj.toLocaleDateString();
//                 const status = isSunday ? 'Weekly Off' : a.status;

//                 return (
//                   <tr 
//                     key={a._id} 
//                     className={`${statusConfig[status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {formattedDate}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       <div className="flex items-center">
//                         <span className={`w-2 h-2 rounded-full mr-2 ${
//                           status === 'Present' ? 'bg-green-500' :
//                           status === 'Absent' ? 'bg-red-500' :
//                           status === 'Half Day' ? 'bg-orange-500' :
//                           'bg-blue-500'
//                         }`}></span>
//                         {dayName}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <StatusBadge status={status} />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentPage(prev => prev + 1)}
//               disabled={currentPage === Math.ceil(attendance.length / itemsPerPage)}
//               className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === Math.ceil(attendance.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
//                   {Math.min(currentPage * itemsPerPage, attendance.length)}
//                 </span> of <span className="font-medium">{attendance.length}</span> results
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
//                 >
//                   <span className="sr-only">Previous</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//                 {Array.from({ length: Math.ceil(attendance.length / itemsPerPage) }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentPage(index + 1)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage(prev => prev + 1)}
//                   disabled={currentPage === Math.ceil(attendance.length / itemsPerPage)}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(attendance.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
//                 >
//                   <span className="sr-only">Next</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </>
//     ) : (
//       <div className="p-8 text-center text-gray-500 bg-gray-50">
//         <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//         <h3 className="mt-2 text-sm font-medium text-gray-700">No attendance records found</h3>
//         <p className="mt-1 text-sm text-gray-500">Your attendance records will appear here.</p>
//       </div>
//     )}
//   </div>


//       </div>



//     </PageWithCloseButton>
//   );
// };

// export default Attendance;

//==========================adjust proper weekly off show but i think hardcoded weekly off==========

import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';
import dayjs from 'dayjs';
import axios from 'axios';

const Attendance = () => {
  const { attendance = [] } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status configuration with colors and icons
  const statusConfig = {
    Present: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '✅'
    },
    Absent: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: '❌'
    },
    Late: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: '⏰'
    },
    'Half Day': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '½'
    },
    'Weekly Off': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: '🌴'
    },
    Holiday: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: '🎉'
    }
  };

  useEffect(() => {
    const fetchWeeklyOffs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/weekly-offs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeeklyOffs(response.data);
      } catch (error) {
        console.error('Failed to fetch weekly offs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyOffs();

    const markAttendance = async () => {
      const now = dayjs();
      const startWindow = dayjs().hour(17).minute(0).second(0); // 5:00 PM today
      const endWindow = dayjs().hour(23).minute(59).second(59); // 11:59 PM today

      let status = 'Absent';
      if (now.isAfter(startWindow)) {
        status = 'Present';
      }

      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Failed to mark attendance:', error);
      }
    };

    markAttendance();
  }, []);

  // StatusBadge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: 'ℹ️'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Function to check if a date is a weekly off
  const isWeeklyOff = (date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return weeklyOffs.some(off => off.dayOfWeek === dayOfWeek);
  };

  // Combine attendance with weekly offs
  const combinedRecords = attendance.map(record => {
    const dateObj = new Date(record.date);
    const isSunday = dateObj.getDay() === 0;
    const isWeeklyOffDay = isWeeklyOff(dateObj);

    let status = record.status;
    if (isWeeklyOffDay) {
      status = 'Weekly Off';
    } else if (isSunday) {
      status = 'Weekly Off'; // Default Sunday off
    }

    return {
      ...record,
      status
    };
  });

  return (
    <PageWithCloseButton title="📅 Attendance">
      <div className="space-y-4">
        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-indigo-800">Attendance Records</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading attendance records...</p>
            </div>
          ) : combinedRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">

                    <tr>
                      <th className="px-16 py-3 ml-30 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 ml-10 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>

                  </thead>
                  {/* <tbody className="bg-white divide-y  divide-gray-200">
                    {combinedRecords
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((a) => {
                        const dateObj = new Date(a.date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const formattedDate = dateObj.toLocaleDateString();

                        return (
                          <tr
                            key={a._id}
                            className={`${statusConfig[a.status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${a.status === 'Present' ? 'bg-green-500' :
                                    a.status === 'Absent' ? 'bg-red-500' :
                                      a.status === 'Half Day' ? 'bg-orange-500' :
                                        'bg-blue-500'
                                  }`}></span>
                                {dayName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={a.status} />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody> */}
                  <tbody className="bg-white divide-y divide-gray-200 text-center">
  {combinedRecords
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((a) => {
      const dateObj = new Date(a.date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString();

      return (
        <tr
          key={a._id}
          className={`${statusConfig[a.status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
        >
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
            {formattedDate}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
            <div className="flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  a.status === 'Present'
                    ? 'bg-green-500'
                    : a.status === 'Absent'
                    ? 'bg-red-500'
                    : a.status === 'Half Day'
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
              ></span>
              {dayName}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <StatusBadge status={a.status} />
          </td>
        </tr>
      );
    })}
</tbody>

                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === Math.ceil(combinedRecords.length / itemsPerPage)}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === Math.ceil(combinedRecords.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, combinedRecords.length)}
                      </span> of <span className="font-medium">{combinedRecords.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: Math.ceil(combinedRecords.length / itemsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === Math.ceil(combinedRecords.length / itemsPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(combinedRecords.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-700">No attendance records found</h3>
              <p className="mt-1 text-sm text-gray-500">Your attendance records will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </PageWithCloseButton>
  );
};

export default Attendance;

//=========================================================================
/*
✅ What Functionality Is Added?

1. Automatic Attendance Marking on Page Load

As soon as the component loads (useEffect), it captures the current login time.

Based on the time:

Before 10:00 PM → "Present"
After 10:00 PM but before 11:59 PM → "Late"
After 11:59 PM → "Next Day or Absent"
Then, it marks attendance automatically via a POST request to /attendance/mark with the calculated status.

2. Token-based Authorization

Sends a JWT token from localStorage in the Authorization header to securely mark attendance.

3. Attendance Table Display
Fetches attendance from the router outlet context and displays:

Date (formatted)
Day (e.g., Sun, Mon, etc.)
Status (e.g., Present, Late)
Sundays are highlighted and shown as “Weekly Off (Sunday)” with different styling.

✅ Summary of Conditions:

Time of Login	Attendance Status
Before 10:00 PM	Present
Between 10:00–11:59 PM	Late
After 11:59 PM	Next Day or Absent


*/
