

// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import { FaClock, FaUserCheck, FaCheckCircle, FaHourglassHalf, FaStopwatch } from 'react-icons/fa';

// dayjs.extend(isBetween);

// const isSameShift = (savedTime, now) => {
//   let shiftStart = dayjs().hour(21).minute(0).second(0);
//   let shiftEnd = dayjs().add(1, 'day').hour(9).minute(0).second(0);

//   if (now.isBefore(shiftStart)) {
//     shiftStart = shiftStart.subtract(1, 'day');
//     shiftEnd = shiftEnd.subtract(1, 'day');
//   }

//   return dayjs(savedTime).isBetween(shiftStart, shiftEnd, null, '[]');
// };

// const Timer = () => {
//   const [loginTime, setLoginTime] = useState(null);
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [isExpanded, setIsExpanded] = useState(false);

//   useEffect(() => {
//     const now = dayjs();
//     const savedLogin = localStorage.getItem('shiftLoginTime');

//     if (savedLogin && isSameShift(savedLogin, now)) {
//       setLoginTime(dayjs(savedLogin));
//     } else {
//       localStorage.setItem('shiftLoginTime', now.toISOString());
//       setLoginTime(now);
//     }

//     const interval = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   if (!loginTime) return null;

//   // const workedDuration = currentTime.diff(loginTime, 'minute') / 60;
//   // const remaining = Math.max(0, 9 - workedDuration).toFixed(2);

//   const totalMinutes = currentTime.diff(loginTime, 'minute');

// const workedHours = Math.floor(totalMinutes / 60);
// const workedMinutes = totalMinutes % 60;

// const remainingMinutes = Math.max(0, 540 - totalMinutes); // 9 hours = 540 minutes
// const remainingHours = Math.floor(remainingMinutes / 60);
// const remainingMins = remainingMinutes % 60;


//   return (
//     <>
//       {/* Mobile: Collapsed Icon View */}
//       <div className="sm:hidden fixed z-50 top-4 right-4">
//         <button 
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="p-3 bg-gradient-to-br from-white to-slate-100 rounded-full shadow-lg border border-blue-200 text-blue-600"
//           aria-label="Show timer"
//         >
//           <FaStopwatch className="text-xl" />
//         </button>
//       </div>

//       {/* Expanded Timer View (shown when icon clicked on mobile or always on desktop) */}
//       <div className={`fixed z-50 bg-gradient-to-br from-white to-slate-100 shadow-lg rounded-xl border border-blue-200 p-3 text-gray-800 font-medium backdrop-blur-lg
//         ${isExpanded ? 'block' : 'hidden'} sm:block
//         top-20 right-4 sm:top-4 sm:right-14 
//         w-[calc(100vw-2rem)] sm:w-80 max-w-[90vw] sm:max-w-none
//         flex flex-col sm:space-y-2`}>
        
//         <div className="flex items-center gap-2 text-blue-700 px-2 py-1">
//           <FaClock className="text-lg sm:text-xl" />
//           <span className="text-xs sm:text-sm text-gray-600">Current Time:</span>
//           <span className="ml-auto font-mono text-sm sm:text-base text-black">
//             {currentTime.format('h:mm:ss A')}
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-green-600 px-2 py-1">
//           <FaUserCheck className="text-lg sm:text-xl" />
//           <span className="text-xs sm:text-sm text-gray-600">Logged in at:</span>
//           <span className="ml-auto font-mono text-sm sm:text-base text-black">
//             {loginTime.format('h:mm:ss A')}
//           </span>
//         </div>

//         {/* <div className="flex items-center gap-2 text-emerald-700 px-2 py-1">
//           <FaCheckCircle className="text-lg sm:text-xl" />
//           <span className="text-xs sm:text-sm text-gray-600">You worked:</span>
//           <span className="ml-auto font-mono text-sm sm:text-base text-black">
//             {workedDuration.toFixed(2)} hrs
//           </span>
//         </div>

//         <div className="flex items-center gap-2 text-yellow-600 px-2 py-1">
//           <FaHourglassHalf className="text-lg sm:text-xl" />
//           <span className="text-xs sm:text-sm text-gray-600">Work more:</span>
//           <span className="ml-auto font-mono text-sm sm:text-base text-black">
//             {remaining} hrs
//           </span>
//         </div> */}

//         <div className="flex items-center gap-2 text-emerald-700 px-2 py-1">
//   <FaCheckCircle className="text-lg sm:text-xl" />
//   <span className="text-xs sm:text-sm text-gray-600">You worked:</span>
//   <span className="ml-auto font-mono text-sm sm:text-base text-black">
//     {`${workedHours} hr ${workedMinutes} min`}
//   </span>
// </div>

// <div className="flex items-center gap-2 text-yellow-600 px-2 py-1">
//   <FaHourglassHalf className="text-lg sm:text-xl" />
//   <span className="text-xs sm:text-sm text-gray-600">Work more:</span>
//   <span className="ml-auto font-mono text-sm sm:text-base text-black">
//     {`${remainingHours} hr ${remainingMins} min`}
//   </span>
// </div>


//         {/* Close button for mobile */}
//         <button 
//           onClick={() => setIsExpanded(false)}
//           className="sm:hidden mt-2 text-xs text-blue-600 self-end px-2 py-1"
//         >
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default Timer;




//====================





//==================================

// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import { FaClock, FaUserCheck, FaCheckCircle, FaHourglassHalf, FaStopwatch } from 'react-icons/fa';
// import API from '../api';
// import { useOutletContext } from 'react-router-dom';

// dayjs.extend(isBetween);

// const Timer = () => {
//   const { user } = useOutletContext() || {};
//   const [loginTime, setLoginTime] = useState(null);
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
//   const [workData, setWorkData] = useState({
//     workedHours: 0,
//     breakTimeLeft: 0,
//     inBreak: false,
//     breakCount: 0,
//     totalBreakTimeToday: '0:00'
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch work data from API
//   const fetchWorkData = async () => {
//     try {
//       if (!user?._id) {
//         console.warn('User ID not available');
//         return;
//       }

//       const res = await API.get(`/attendance/${user._id}/today`);
//       console.log('Work data response:', res.data); // Debug log
      
//       if (res.data) {
//         setWorkData({
//           workedHours: res.data.workedHours || 0,
//           breakTimeLeft: res.data.breakTimeLeft || 0,
//           inBreak: res.data.inBreak || false,
//           breakCount: res.data.breakCount || 0,
//           totalBreakTimeToday: res.data.totalBreakTimeToday || '0:00'
//         });
//       }
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching work data:', err);
//       setError('Failed to load work data');
//       // Fallback to calculate worked hours locally
//       if (loginTime) {
//         const minutesWorked = dayjs().diff(loginTime, 'minutes');
//         setWorkData(prev => ({
//           ...prev,
//           workedHours: minutesWorked / 60
//         }));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize login time and fetch data
//   useEffect(() => {
//     const now = dayjs();
//     const savedLogin = localStorage.getItem('shiftLoginTime');

//     if (savedLogin && isSameShift(savedLogin, now)) {
//       setLoginTime(dayjs(savedLogin));
//     } else {
//       const newLoginTime = now.toISOString();
//       localStorage.setItem('shiftLoginTime', newLoginTime);
//       setLoginTime(dayjs(newLoginTime));
//     }

//     fetchWorkData();
//     const interval = setInterval(fetchWorkData, 30000); // Refresh every 30 seconds

//     return () => clearInterval(interval);
//   }, [user?._id]);

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const isSameShift = (savedTime, now) => {
//     let shiftStart = dayjs().hour(9).minute(0).second(0);
//     let shiftEnd = dayjs().hour(21).minute(0).second(0);

//     if (now.isBefore(shiftStart)) {
//       shiftStart = shiftStart.subtract(1, 'day');
//       shiftEnd = shiftEnd.subtract(1, 'day');
//     }

//     return dayjs(savedTime).isBetween(shiftStart, shiftEnd, null, '[]');
//   };

//   // Calculate time values
//   const totalMinutes = loginTime ? currentTime.diff(loginTime, 'minute') : 0;
//   const workedHours = workData.workedHours || (totalMinutes / 60);
//   const workedMinutes = Math.floor((workedHours % 1) * 60);
//   const displayHours = Math.floor(workedHours);
  
//   const remainingMinutes = Math.max(0, 540 - (workedHours * 60)); // 9 hours = 540 minutes
//   const remainingHours = Math.floor(remainingMinutes / 60);
//   const remainingMins = Math.floor(remainingMinutes % 60);

//   const formattedBreakTime = workData.breakTimeLeft 
//     ? `${Math.floor(workData.breakTimeLeft / 60)}:${String(workData.breakTimeLeft % 60).padStart(2, '0')}`
//     : '0:00';

//   if (loading && !loginTime) {
//     return (
//       <div className="fixed top-4 right-14 bg-white p-3 rounded-lg shadow-md">
//         Loading timer data...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Mobile toggle */}
//       <div className="sm:hidden fixed z-50 top-4 right-4">
//         <button 
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="p-3 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600"
//         >
//           <FaStopwatch className="text-xl" />
//         </button>
//       </div>

//       {/* Timer panel */}
//       <div className={`fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-gray-800
//         ${isExpanded ? 'block' : 'hidden'} sm:block
//         top-20 right-4 sm:top-4 sm:right-14 
//         w-[calc(100vw-2rem)] sm:w-72
//         flex flex-col gap-2`}>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-2">
//             {error}
//           </div>
//         )}

//         <div className="flex items-center gap-2">
//           <FaClock className="text-blue-600" />
//           <span className="text-sm">Current:</span>
//           <span className="ml-auto font-mono">
//             {currentTime.format('h:mm:ss A')}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaUserCheck className="text-green-600" />
//           <span className="text-sm">Logged in:</span>
//           <span className="ml-auto font-mono">
//             {loginTime?.format('h:mm A') || '--:--'}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaCheckCircle className="text-emerald-600" />
//           <span className="text-sm">Worked:</span>
//           <span className="ml-auto font-mono">
//             {`${displayHours}h ${workedMinutes}m`}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaHourglassHalf className="text-yellow-600" />
//           <span className="text-sm">Remaining:</span>
//           <span className="ml-auto font-mono">
//             {`${remainingHours}h ${remainingMins}m`}
//           </span>
//         </div>

//         {workData.inBreak ? (
//           <div className="flex items-center gap-2 bg-orange-50 p-2 rounded">
//             <FaHourglassHalf className="text-orange-600" />
//             <span className="text-sm">Break ends in:</span>
//             <span className="ml-auto font-mono">
//               {formattedBreakTime}
//             </span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2 text-sm">
//             {/* <span>Breaks:</span>
//             <span className="ml-auto">
//               {workData.breakCount} (Total: {workData.totalBreakTimeToday})
//             </span> */}
//           </div>
//         )}

//         <button 
//           onClick={() => setIsExpanded(false)}
//           className="sm:hidden mt-2 text-sm text-blue-600 self-end"
//         >
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default Timer;
//==============================

// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import { FaClock, FaUserCheck, FaCheckCircle, FaHourglassHalf, FaStopwatch } from 'react-icons/fa';
// import API from '../api';
// import { useOutletContext } from 'react-router-dom';

// dayjs.extend(isBetween);

// const Timer = () => {
//   const { user } = useOutletContext() || {};
//   const [loginTime, setLoginTime] = useState(null);
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [isExpanded, setIsExpanded] = useState(true); // Default to expanded
//   const [workData, setWorkData] = useState({
//     workedHours: 0,
//     breakTimeLeft: 0,
//     inBreak: false,
//     breakCount: 0,
//     totalBreakTimeToday: '0:00'
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch work data from API
//   const fetchWorkData = async () => {
//     try {
//       if (!user?._id) {
//         console.warn('User ID not available');
//         return;
//       }

//       const res = await API.get(`/attendance/${user._id}/today`);
//       console.log('Work data response:', res.data); // Debug log
      
//       if (res.data) {
//         setWorkData({
//           workedHours: res.data.workedHours || 0,
//           breakTimeLeft: res.data.breakTimeLeft || 0,
//           inBreak: res.data.inBreak || false,
//           breakCount: res.data.breakCount || 0,
//           totalBreakTimeToday: res.data.totalBreakTimeToday || '0:00'
//         });
//       }
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching work data:', err);
//       setError('Failed to load work data');
//       // Fallback to calculate worked hours locally
//       if (loginTime) {
//         const minutesWorked = dayjs().diff(loginTime, 'minutes');
//         setWorkData(prev => ({
//           ...prev,
//           workedHours: minutesWorked / 60
//         }));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize login time and fetch data
//   useEffect(() => {
//     const now = dayjs();
//     const savedLogin = localStorage.getItem('shiftLoginTime');

//     if (savedLogin && isSameShift(savedLogin, now)) {
//       setLoginTime(dayjs(savedLogin));
//     } else {
//       const newLoginTime = now.toISOString();
//       localStorage.setItem('shiftLoginTime', newLoginTime);
//       setLoginTime(dayjs(newLoginTime));
//     }
//   if (!user?._id) return;
  
//     fetchWorkData();
//     const interval = setInterval(fetchWorkData, 30000); // Refresh every 30 seconds

//     return () => clearInterval(interval);
//   }, [user?._id]);

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const isSameShift = (savedTime, now) => {
//     let shiftStart = dayjs().hour(9).minute(0).second(0);
//     let shiftEnd = dayjs().hour(21).minute(0).second(0);

//     if (now.isBefore(shiftStart)) {
//       shiftStart = shiftStart.subtract(1, 'day');
//       shiftEnd = shiftEnd.subtract(1, 'day');
//     }

//     return dayjs(savedTime).isBetween(shiftStart, shiftEnd, null, '[]');
//   };

//   // Calculate time values
//   const totalMinutes = loginTime ? currentTime.diff(loginTime, 'minute') : 0;
//   const workedHours = workData.workedHours || (totalMinutes / 60);
//   const workedMinutes = Math.floor((workedHours % 1) * 60);
//   const displayHours = Math.floor(workedHours);
  
//   const remainingMinutes = Math.max(0, 540 - (workedHours * 60)); // 9 hours = 540 minutes
//   const remainingHours = Math.floor(remainingMinutes / 60);
//   const remainingMins = Math.floor(remainingMinutes % 60);

//   const formattedBreakTime = workData.breakTimeLeft 
//     ? `${Math.floor(workData.breakTimeLeft / 60)}:${String(workData.breakTimeLeft % 60).padStart(2, '0')}`
//     : '0:00';

//   if (loading && !loginTime) {
//     return (
//       <div className="fixed top-4 right-14 bg-white p-3 rounded-lg shadow-md">
//         Loading timer data...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Mobile toggle */}
//       <div className="sm:hidden fixed z-50 top-4 right-4">
//         <button 
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="p-3 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600"
//         >
//           <FaStopwatch className="text-xl" />
//         </button>
//       </div>

//       {/* Timer panel */}
//       <div className={`fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-gray-800
//         ${isExpanded ? 'block' : 'hidden'} sm:block
//         top-20 right-4 sm:top-4 sm:right-14 
//         w-[calc(100vw-2rem)] sm:w-72
//         flex flex-col gap-2`}>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-2">
//             {error}
//           </div>
//         )}

//         <div className="flex items-center gap-2">
//           <FaClock className="text-blue-600" />
//           <span className="text-sm">Current:</span>
//           <span className="ml-auto font-mono">
//             {currentTime.format('h:mm:ss A')}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaUserCheck className="text-green-600" />
//           <span className="text-sm">Logged in:</span>
//           <span className="ml-auto font-mono">
//             {loginTime?.format('h:mm A') || '--:--'}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaCheckCircle className="text-emerald-600" />
//           <span className="text-sm">Worked:</span>
//           <span className="ml-auto font-mono">
//             {`${displayHours}h ${workedMinutes}m`}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaHourglassHalf className="text-yellow-600" />
//           <span className="text-sm">Remaining:</span>
//           <span className="ml-auto font-mono">
//             {`${remainingHours}h ${remainingMins}m`}
//           </span>
//         </div>

//         {workData.inBreak ? (
//           <div className="flex items-center gap-2 bg-orange-50 p-2 rounded">
//             <FaHourglassHalf className="text-orange-600" />
//             <span className="text-sm">Break ends in:</span>
//             <span className="ml-auto font-mono">
//               {formattedBreakTime}
//             </span>
//           </div>
//         ) : (
//           <div className="flex items-center gap-2 text-sm">
//             {/* <span>Breaks:</span>
//             <span className="ml-auto">
//               {workData.breakCount} (Total: {workData.totalBreakTimeToday})
//             </span> */}
//           </div>
//         )}

//         <button 
//           onClick={() => setIsExpanded(false)}
//           className="sm:hidden mt-2 text-sm text-blue-600 self-end"
//         >
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default Timer;

//==============================

// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import { FaClock, FaUserCheck, FaCheckCircle, FaHourglassHalf, FaStopwatch } from 'react-icons/fa';
// import { useOutletContext } from 'react-router-dom';

// dayjs.extend(isBetween);

// const Timer = () => {
//   const { user, breakTimer } = useOutletContext() || {};
//   const [loginTime, setLoginTime] = useState(null);
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [isExpanded, setIsExpanded] = useState(true);
  
//   // Use breakTimer data directly
//   const {
//     workedHours = 0,
//     inBreak = false,
//     breakTimeLeft = 0,
//     totalBreakTimeToday = '0:00',
//     loading = false
//   } = breakTimer || {};

//   // Calculate time values consistently with breakTime.jsx
//   const totalMinutes = Math.floor(workedHours * 60);
//   const displayHours = Math.floor(totalMinutes / 60);
//   const displayMinutes = totalMinutes % 60;

//   const remainingTotalMinutes = Math.max(0, 540 - totalMinutes); // 9 hours = 540 minutes
//   const remainingHours = Math.floor(remainingTotalMinutes / 60);
//   const remainingMins = remainingTotalMinutes % 60;

//   const formattedBreakTime = breakTimeLeft 
//     ? `${Math.floor(breakTimeLeft / 60)}:${String(breakTimeLeft % 60).padStart(2, '0')}`
//     : '0:00';

//   // Initialize login time
//   useEffect(() => {
//     const now = dayjs();
//     const savedLogin = localStorage.getItem('shiftLoginTime');

//     if (savedLogin && isSameShift(savedLogin, now)) {
//       setLoginTime(dayjs(savedLogin));
//     } else {
//       const newLoginTime = now.toISOString();
//       localStorage.setItem('shiftLoginTime', newLoginTime);
//       setLoginTime(dayjs(newLoginTime));
//     }
//   }, [user?._id]);

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const isSameShift = (savedTime, now) => {
//     let shiftStart = dayjs().hour(9).minute(0).second(0);
//     let shiftEnd = dayjs().hour(21).minute(0).second(0);

//     if (now.isBefore(shiftStart)) {
//       shiftStart = shiftStart.subtract(1, 'day');
//       shiftEnd = shiftEnd.subtract(1, 'day');
//     }

//     return dayjs(savedTime).isBetween(shiftStart, shiftEnd, null, '[]');
//   };

//   if (loading && !loginTime) {
//     return (
//       <div className="fixed top-4 right-14 bg-white p-3 rounded-lg shadow-md">
//         Loading timer data...
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Mobile toggle */}
//       <div className="sm:hidden fixed z-50 top-4 right-4">
//         <button 
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="p-3 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600"
//         >
//           <FaStopwatch className="text-xl" />
//         </button>
//       </div>

//       {/* Timer panel */}
//       <div className={`fixed z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-gray-800
//         ${isExpanded ? 'block' : 'hidden'} sm:block
//         top-20 right-4 sm:top-4 sm:right-14 
//         w-[calc(100vw-2rem)] sm:w-72
//         flex flex-col gap-2`}>

//         <div className="flex items-center gap-2">
//           <FaClock className="text-blue-600" />
//           <span className="text-sm">Current:</span>
//           <span className="ml-auto font-mono">
//             {currentTime.format('h:mm:ss A')}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaUserCheck className="text-green-600" />
//           <span className="text-sm">Logged in:</span>
//           <span className="ml-auto font-mono">
//             {loginTime?.format('h:mm A') || '--:--'}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaCheckCircle className="text-emerald-600" />
//           <span className="text-sm">Worked:</span>
//           <span className="ml-auto font-mono">
//             {`${displayHours}h ${displayMinutes}m`}
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           <FaHourglassHalf className="text-yellow-600" />
//           <span className="text-sm">Remaining:</span>
//           <span className="ml-auto font-mono">
//             {`${remainingHours}h ${remainingMins}m`}
//           </span>
//         </div>

//         {inBreak && (
//           <div className="flex items-center gap-2 bg-orange-50 p-2 rounded">
//             <FaHourglassHalf className="text-orange-600" />
//             <span className="text-sm">Break ends in:</span>
//             <span className="ml-auto font-mono">
//               {formattedBreakTime}
//             </span>
//           </div>
//         )}

//         <button 
//           onClick={() => setIsExpanded(false)}
//           className="sm:hidden mt-2 text-sm text-blue-600 self-end"
//         >
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default Timer;
//===================================
// import React, { useEffect, useState } from 'react';
// import dayjs from 'dayjs';
// import { FaClock } from 'react-icons/fa';

// const CurrentTime = () => {
//   const [currentTime, setCurrentTime] = useState(dayjs());
  
//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="fixed top-4 right-14 bg-white p-3 rounded-lg shadow-md border border-gray-200 flex items-center gap-3">
//       <FaClock className="text-blue-500 text-xl" />
//       <div className="text-center">
//         <div className="text-sm text-gray-500">Current Time</div>
//         <div className="font-mono font-bold text-lg text-gray-700">
//           {currentTime.format('h:mm:ss A')}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrentTime;


//===========================ONLY TIME WILL BE SHOW=========

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FaClock, FaStopwatch } from 'react-icons/fa';

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640); // Tailwind's sm breakpoint

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop view - always show time
  if (!isMobile) {
    return (
      <div className="fixed top-4 right-14 bg-white p-3 rounded-lg shadow-md border border-gray-200 flex items-center gap-3">
        <FaClock className="text-blue-500 text-xl" />
        <div className="text-center">
          <div className="text-sm text-gray-500">Current Time</div>
          <div className="font-mono font-bold text-lg text-gray-700">
            {currentTime.format('h:mm:ss A')}
          </div>
        </div>
      </div>
    );
  }

  // Mobile view - toggleable time display
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed top-4 right-4 p-3 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600 z-50"
      >
        <FaStopwatch className="text-xl" />
      </button>

      {/* Time display (only when expanded) */}
      {isExpanded && (
        <div className="fixed top-16 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 flex items-center gap-3 z-50">
          <FaClock className="text-blue-500 text-xl" />
          <div className="text-center">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="font-mono font-bold text-lg text-gray-700">
              {currentTime.format('h:mm A')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentTime;

//============================TIME,LOGIN TIME,WORK,REMAIN TIME WILL BE SHOW=========

// import React, { useState, useEffect } from 'react';
// import dayjs from 'dayjs';
// import { FaClock, FaStopwatch } from 'react-icons/fa';

// const CurrentTime = () => {
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Update current time every second
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Update isMobile state on resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 640);
//     };
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Load login time from localStorage
//   useEffect(() => {
//     const storedLogin = localStorage.getItem('loginTime');
//     if (storedLogin) {
//       setLoggedInTime(dayjs(storedLogin));
//     }
//   }, []);

//   // Example worked hours
//   const workedHours = 1.57; // Replace with real logic if needed
//   const totalMinutes = Math.floor(workedHours * 60);
//   const displayHours = Math.floor(totalMinutes / 60);
//   const displayMinutes = totalMinutes % 60;
//   const remainingTotalMinutes = Math.max(0, 540 - totalMinutes);
//   const remainingHours = Math.floor(remainingTotalMinutes / 60);
//   const remainingMinutes = remainingTotalMinutes % 60;

//   const items = [
//     { label: 'Current Time', value: currentTime.format('hh:mm:ss A'), icon: '⏲️' },
//     { label: 'Logged In', value: loggedInTime ? loggedInTime.format('hh:mm A') : '—', icon: '🔑' },
//     { label: 'Worked', value: `${displayHours}h ${displayMinutes}m`, icon: '⏳' },
//     { label: 'Remaining', value: `${remainingHours}h ${remainingMinutes}m`, icon: '⌛' },
//   ];

//   const ContentBox = (
//     <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-72 mr-10">
//       <h3 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
//         <FaClock className="text-blue-500" />
//         Work Time Overview
//       </h3>
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="bg-gray-50 p-2 rounded border border-gray-100 text-center shadow-sm"
//           >
//             <div className="text-gray-500 text-xs flex items-center justify-center gap-1 mb-1">
//               <span>{item.icon}</span>
//               {item.label}
//             </div>
//             <div className="font-semibold text-gray-800 text-sm">{item.value}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Desktop View: always visible floating top-right
//   if (!isMobile) {
//     return (
//       <div className="fixed top-4 right-4 z-50">
//         {ContentBox}
//       </div>
//     );
//   }

//   // Mobile View: toggleable with button
//   return (
//     <>
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="fixed top-4 right-4 p-3 bg-white rounded-full shadow-lg border border-gray-200 text-blue-600 z-50"
//       >
//         <FaStopwatch className="text-xl" />
//       </button>

//       {isExpanded && (
//         <div className="fixed top-16 right-4 z-50">
//           {ContentBox}
//         </div>
//       )}
//     </>
//   );
// };

// export default CurrentTime;
