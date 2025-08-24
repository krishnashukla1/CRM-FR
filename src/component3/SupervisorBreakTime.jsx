// import React, { useState, useEffect } from 'react';

// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();
  
//   // State management
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loginDuration, setLoginDuration] = useState('00:00:00');
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');

//   // Update real-time clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Set login time and session time
//   useEffect(() => {
//     const storedLogin = localStorage.getItem('loginTime');
//     if (storedLogin) {
//       setLoggedInTime(dayjs(storedLogin));
//     }

//     const sessionStart = sessionStorage.getItem('sessionStart');
//     if (sessionStart) {
//       setSessionStartTime(dayjs(sessionStart));
//     } else {
//       const now = new Date().toISOString();
//       sessionStorage.setItem('sessionStart', now);
//       setSessionStartTime(dayjs(now));
//     }
//   }, []);

//   // Calculate session, login durations, and total worked time
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (sessionStartTime) {
//         const duration = dayjs.duration(dayjs().diff(sessionStartTime));
//         setSessionDuration(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
//       }

//       if (loggedInTime) {
//         const duration = dayjs.duration(dayjs().diff(loggedInTime));
//         setLoginDuration(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
        
//         // Calculate total worked time (same as login duration for now)
//         setTotalWorked(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [sessionStartTime, loggedInTime]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-6">
//         <span className="text-2xl">⏱️</span>
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Supervisor Time Tracking
//         </span>
//       </div>
    
//       {/* Time Overview Card */}
//       <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-5 border border-blue-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-blue-600">🕒</span>
//           Time Tracking Overview
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//           {[
//             { label: 'Current Time', value: currentTime.format('hh:mm:ss A'), icon: '⏲️' },
//             { label: 'Logged In At', value: loggedInTime ? loggedInTime.format('hh:mm A') : '—', icon: '🔑' },
//             { label: 'Login Duration', value: loginDuration, icon: '⏱️' },
//             { label: 'Session Duration', value: sessionDuration, icon: '🖥️' },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm"
//             >
//               <div className="flex items-center gap-2 text-gray-500 mb-1">
//                 <span>{item.icon}</span>
//                 <span className="text-xs">{item.label}</span>
//               </div>
//               <p className="font-semibold text-gray-800 text-lg">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Total Worked Time Card */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-5 border border-green-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-green-600">📊</span>
//           Work Summary
//         </h3>
//         <div className="grid grid-cols-1 gap-4 text-sm">
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm text-center">
//             <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center">
//               <span>⏰</span>
//               <span className="text-xs">Total Worked Today</span>
//             </div>
//             <p className="font-semibold text-gray-800 text-2xl">{totalWorked}</p>
//           </div>
//         </div>
//       </div>

//       {/* Supervisor Information */}
//       <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-4 text-sm text-purple-800 shadow-sm">
//         <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//           <span>👨‍💼</span>
//           Supervisor Information
//         </p>
//         <p className="mb-2">
//           As a supervisor, your time is tracked for accountability and management purposes.
//         </p>
//         <p>
//           Your total worked time includes all active session time since login.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//=================================

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// dayjs.extend(duration);
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();
  
//   // State management
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loginDuration, setLoginDuration] = useState('00:00:00');
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [shiftInfo, setShiftInfo] = useState('');

//   // Calculate shift start and end times
//   const getShiftTimes = () => {
//     const now = dayjs();
//     let shiftStart, shiftEnd;
    
//     // If current time is before 5 PM, shift started yesterday at 5 PM
//     if (now.hour() < 17) {
//       shiftStart = now.subtract(1, 'day').hour(17).minute(0).second(0);
//       shiftEnd = now.hour(16).minute(59).second(59);
//     } else {
//       // If current time is 5 PM or later, shift started today at 5 PM
//       shiftStart = now.hour(17).minute(0).second(0);
//       shiftEnd = now.add(1, 'day').hour(16).minute(59).second(59);
//     }
    
//     return { shiftStart, shiftEnd };
//   };

//   // Update real-time clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Set login time and session time
//   useEffect(() => {
//     const storedLogin = localStorage.getItem('loginTime');
//     if (storedLogin) {
//       const loginTime = dayjs(storedLogin);
//       setLoggedInTime(loginTime);
      
//       // Set shift information
//       const { shiftStart, shiftEnd } = getShiftTimes();
//       const shiftDate = shiftStart.date();
//       const shiftMonth = shiftStart.format('MMM');
      
//       setShiftInfo(`Shift: ${shiftDate} ${shiftMonth} 5:00 PM - ${shiftEnd.date()} ${shiftEnd.format('MMM')} 4:59 PM`);
//     }

//     const sessionStart = sessionStorage.getItem('sessionStart');
//     if (sessionStart) {
//       setSessionStartTime(dayjs(sessionStart));
//     } else {
//       const now = new Date().toISOString();
//       sessionStorage.setItem('sessionStart', now);
//       setSessionStartTime(dayjs(now));
//     }
//   }, []);

//   // Calculate session, login durations, and total worked time
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (sessionStartTime) {
//         const duration = dayjs.duration(dayjs().diff(sessionStartTime));
//         setSessionDuration(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
//       }

//       if (loggedInTime) {
//         const duration = dayjs.duration(dayjs().diff(loggedInTime));
//         setLoginDuration(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
        
//         // Calculate total worked time (same as login duration for now)
//         setTotalWorked(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [sessionStartTime, loggedInTime]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <span className="text-2xl">⏱️</span>
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Supervisor Time Tracking
//         </span>
//       </div>
      
//       {/* Shift Information */}
//       {shiftInfo && (
//         <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg p-3 mb-6">
//           <div className="flex items-center justify-center">
//             <span className="text-blue-600 mr-2">🔄</span>
//             <span className="text-sm font-medium text-blue-800">{shiftInfo}</span>
//           </div>
//         </div>
//       )}
    
//       {/* Time Overview Card */}
//       <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-5 border border-blue-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-blue-600">🕒</span>
//           Time Tracking Overview
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//           {[
//             { label: 'Current Time', value: currentTime.format('hh:mm:ss A'), icon: '⏲️' },
//             { label: 'Logged In At', value: loggedInTime ? loggedInTime.format('hh:mm A') : '—', icon: '🔑' },
//             { label: 'Login Duration', value: loginDuration, icon: '⏱️' },
//             { label: 'Session Duration', value: sessionDuration, icon: '🖥️' },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm"
//             >
//               <div className="flex items-center gap-2 text-gray-500 mb-1">
//                 <span>{item.icon}</span>
//                 <span className="text-xs">{item.label}</span>
//               </div>
//               <p className="font-semibold text-gray-800 text-lg">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Total Worked Time Card */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-5 border border-green-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-green-600">📊</span>
//           Work Summary
//         </h3>
//         <div className="grid grid-cols-1 gap-4 text-sm">
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm text-center">
//             <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center">
//               <span>⏰</span>
//               <span className="text-xs">Total Worked This Shift</span>
//             </div>
//             <p className="font-semibold text-gray-800 text-2xl">{totalWorked}</p>
//           </div>
//         </div>
//       </div>

//       {/* Shift Progress */}
//       <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-5 border border-orange-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-orange-600">📈</span>
//           Shift Progress
//         </h3>
//         <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
//             style={{ width: `${Math.min((dayjs().diff(getShiftTimes().shiftStart) / 86400000) * 100, 100)}%` }}
//           ></div>
//         </div>
//         <div className="flex justify-between text-xs text-gray-600">
//           <span>Shift Start</span>
//           <span>Shift End</span>
//         </div>
//         <div className="flex justify-between text-sm font-medium text-gray-800 mt-1">
//           <span>{getShiftTimes().shiftStart.format('DD MMM, hh:mm A')}</span>
//           <span>{getShiftTimes().shiftEnd.format('DD MMM, hh:mm A')}</span>
//         </div>
//       </div>

//       {/* Supervisor Information */}
//       <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-4 text-sm text-purple-800 shadow-sm">
//         <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//           <span>👨‍💼</span>
//           Supervisor Information
//         </p>
//         <p className="mb-2">
//           Your shift follows a unique schedule from 5:00 PM to 4:59 PM the next day.
//         </p>
//         <p>
//           Your total worked time includes all active session time since login during this shift period.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//======================

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// dayjs.extend(duration);
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();
  
//   // State management
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [loginDuration, setLoginDuration] = useState('00:00:00');
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [shiftInfo, setShiftInfo] = useState('');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');

//   // Calculate shift start and end times
//   const getShiftTimes = () => {
//     const now = dayjs();
//     let shiftStart, shiftEnd;
    
//     // If current time is before 5 PM, shift started yesterday at 5 PM
//     if (now.hour() < 17) {
//       shiftStart = now.subtract(1, 'day').hour(17).minute(0).second(0);
//       shiftEnd = now.hour(16).minute(59).second(59);
//     } else {
//       // If current time is 5 PM or later, shift started today at 5 PM
//       shiftStart = now.hour(17).minute(0).second(0);
//       shiftEnd = now.add(1, 'day').hour(16).minute(59).second(59);
//     }
    
//     return { shiftStart, shiftEnd };
//   };

//   // Update real-time clock
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(dayjs());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Set login time and session time
//   useEffect(() => {
//     const storedLogin = localStorage.getItem('loginTime');
//     if (storedLogin) {
//       const loginTime = dayjs(storedLogin);
//       setLoggedInTime(loginTime);
      
//       // Set shift information
//       const { shiftStart, shiftEnd } = getShiftTimes();
//       const shiftDate = shiftStart.date();
//       const shiftMonth = shiftStart.format('MMM');
      
//       setShiftInfo(`Shift: ${shiftDate} ${shiftMonth} 5:00 PM - ${shiftEnd.date()} ${shiftEnd.format('MMM')} 4:59 PM`);
//     }

//     const sessionStart = sessionStorage.getItem('sessionStart');
//     if (sessionStart) {
//       setSessionStartTime(dayjs(sessionStart));
//     } else {
//       const now = new Date().toISOString();
//       sessionStorage.setItem('sessionStart', now);
//       setSessionStartTime(dayjs(now));
//     }
//   }, []);

//   // Calculate session, login durations, and total worked time
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (sessionStartTime) {
//         const duration = dayjs.duration(dayjs().diff(sessionStartTime));
//         setSessionDuration(
//           `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
//         );
//       }

//       if (loggedInTime) {
//         const duration = dayjs.duration(dayjs().diff(loggedInTime));
//         const totalSeconds = duration.asSeconds();
//         const hours = Math.floor(totalSeconds / 3600);
//         const minutes = Math.floor((totalSeconds % 3600) / 60);
//         const seconds = Math.floor(totalSeconds % 60);
        
//         setLoginDuration(
//           `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
//         );
        
//         // Calculate total worked time (same as login duration for now)
//         setTotalWorked(
//           `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
//         );
        
//         // Calculate login progress (9 hours = 32400 seconds)
//         const progress = Math.min((totalSeconds / 32400) * 100, 100);
//         setLoginProgress(progress);
        
//         // Calculate remaining time for 9-hour workday
//         const remainingSeconds = Math.max(0, 32400 - totalSeconds);
//         const remHours = Math.floor(remainingSeconds / 3600);
//         const remMinutes = Math.floor((remainingSeconds % 3600) / 60);
//         const remSeconds = Math.floor(remainingSeconds % 60);
        
//         setRemainingTime(
//           `${String(remHours).padStart(2, '0')}:${String(remMinutes).padStart(2, '0')}:${String(remSeconds).padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [sessionStartTime, loggedInTime]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <span className="text-2xl">⏱️</span>
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Supervisor Time Tracking
//         </span>
//       </div>
      
//       {/* Shift Information */}
//       {shiftInfo && (
//         <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg p-3 mb-6">
//           <div className="flex items-center justify-center">
//             <span className="text-blue-600 mr-2">🔄</span>
//             <span className="text-sm font-medium text-blue-800">{shiftInfo}</span>
//           </div>
//         </div>
//       )}
    
//       {/* Time Overview Card */}
//       <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-5 border border-blue-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-blue-600">🕒</span>
//           Time Tracking Overview
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//           {[
//             { label: 'Current Time', value: currentTime.format('hh:mm:ss A'), icon: '⏲️' },
//             { label: 'Logged In At', value: loggedInTime ? loggedInTime.format('hh:mm A') : '—', icon: '🔑' },
//             { label: 'Login Duration', value: loginDuration, icon: '⏱️' },
//             { label: 'Session Duration', value: sessionDuration, icon: '🖥️' },
//           ].map((item, index) => (
//             <div
//               key={index}
//               className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm"
//             >
//               <div className="flex items-center gap-2 text-gray-500 mb-1">
//                 <span>{item.icon}</span>
//                 <span className="text-xs">{item.label}</span>
//               </div>
//               <p className="font-semibold text-gray-800 text-lg">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Total Worked Time Card */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-5 border border-green-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-green-600">📊</span>
//           Work Summary
//         </h3>
//         <div className="grid grid-cols-1 gap-4 text-sm">
//           <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-100 shadow-sm text-center">
//             <div className="flex items-center gap-2 text-gray-500 mb-1 justify-center">
//               <span>⏰</span>
//               <span className="text-xs">Total Worked This Shift</span>
//             </div>
//             <p className="font-semibold text-gray-800 text-2xl">{totalWorked}</p>
//           </div>
//         </div>
//       </div>

//       {/* Login Progress */}
//       <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-5 border border-orange-100 mb-6 transition-all hover:shadow-lg">
//         <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
//           <span className="text-orange-600">📈</span>
//           Login Progress (9 Hours Target)
//         </h3>
        
//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-500"
//             style={{ width: `${loginProgress}%` }}
//           ></div>
//         </div>
        
//         {/* Progress Percentage */}
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-sm font-medium text-gray-700">Progress</span>
//           <span className="text-sm font-bold text-purple-700">
//             {loginProgress.toFixed(1)}%
//           </span>
//         </div>
        
//         {/* Time Information */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
//             <div className="text-xs text-gray-500 mb-1">Logged In Time</div>
//             <div className="font-semibold text-gray-800">{loginDuration}</div>
//           </div>
//           <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
//             <div className="text-xs text-gray-500 mb-1">Remaining Time</div>
//             <div className="font-semibold text-gray-800">{remainingTime}</div>
//           </div>
//         </div>
        
    //     {/* Completion Status */}
    //     {loginProgress >= 100 ? (
    //       <div className="mt-4 p-2 bg-green-100 border border-green-200 rounded text-center">
    //         <span className="text-green-700 font-medium">🎉 You've completed your 9-hour workday!</span>
    //       </div>
    //     ) : (
    //       <div className="mt-4 p-2 bg-blue-100 border border-blue-200 rounded text-center">
    //         <span className="text-blue-700 text-sm">
    //           {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
    //         </span>
    //       </div>
    //     )}
    //   </div>

    //   {/* Supervisor Information */}
    //   <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-4 text-sm text-purple-800 shadow-sm">
    //     <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
    //       <span>👨‍💼</span>
    //       Supervisor Information
    //     </p>
    //     <p className="mb-2">
    //       Your shift follows a unique schedule from 5:00 PM to 4:59 PM the next day.
    //     </p>
    //     <p>
    //       Your total worked time includes all active session time since login during this shift period.
    //       The progress bar shows your completion toward the 9-hour workday target.
    //     </p>
    //   </div>
    // </div>
//   );
// };

// export default SupervisorBreakTime;

//===============
// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// dayjs.extend(duration);
// dayjs.extend(isSameOrBefore);
// dayjs.extend(isSameOrAfter);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   // State
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [shiftInfo, setShiftInfo] = useState('');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);

//   // Shift times
//   const getShiftTimes = () => {
//     const now = dayjs();
//     let shiftStart, shiftEnd;
//     if (now.hour() < 17) {
//       shiftStart = now.subtract(1, 'day').hour(17).minute(0).second(0);
//       shiftEnd = now.hour(16).minute(59).second(59);
//     } else {
//       shiftStart = now.hour(17).minute(0).second(0);
//       shiftEnd = now.add(1, 'day').hour(16).minute(59).second(59);
//     }
//     return { shiftStart, shiftEnd };
//   };

//   // Live clock
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Init login/session
//   useEffect(() => {
//     // Persisted login time
//     let originalLoginTime = localStorage.getItem('originalLoginTime');
//     if (!originalLoginTime) {
//       originalLoginTime = new Date().toISOString();
//       localStorage.setItem('originalLoginTime', originalLoginTime);
//     }
//     setLoggedInTime(dayjs(originalLoginTime));

//     // Shift info
//     const { shiftStart, shiftEnd } = getShiftTimes();
//     setShiftInfo(
//       `Shift: ${shiftStart.date()} ${shiftStart.format('MMM')} 5:00 PM - ${shiftEnd.date()} ${shiftEnd.format('MMM')} 4:59 PM`
//     );

//     // Session start
//     const now = new Date().toISOString();
//     setSessionStartTime(dayjs(now));

//     // Load previous worked time
//     const savedWorked = localStorage.getItem('totalWorkedTime');
//     if (savedWorked) {
//       setTotalWorkedSeconds(parseInt(savedWorked));
//     }
//   }, []);

//   // Update timers
//   useEffect(() => {
//     const timer = setInterval(() => {
//       if (!sessionStartTime) return;

//       // Current session duration
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2, '0')}:${String(dur.minutes()).padStart(2, '0')}:${String(dur.seconds()).padStart(2, '0')}`
//       );

//       // Total worked (previous + current)
//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec / 3600);
//       const m = Math.floor((totalSec % 3600) / 60);
//       const s = totalSec % 60;
//       setTotalWorked(
//         `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
//       );

//       // Progress
//       const progress = Math.min((totalSec / 32400) * 100, 100);
//       setLoginProgress(progress);

//       // Remaining
//       const rem = Math.max(0, 32400 - totalSec);
//       const rh = Math.floor(rem / 3600);
//       const rm = Math.floor((rem % 3600) / 60);
//       const rs = rem % 60;
//       setRemainingTime(
//         `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`
//       );
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Persist time when leaving (logout/refresh)
//   useEffect(() => {
//     const saveBeforeExit = () => {
//       if (!sessionStartTime) return;
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());
//     };
//     window.addEventListener('beforeunload', saveBeforeExit);
//     return () => {
//       saveBeforeExit();
//       window.removeEventListener('beforeunload', saveBeforeExit);
//     };
//   }, [sessionStartTime, totalWorkedSeconds]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Supervisor Time Tracking</h2>
//       <p>{shiftInfo}</p>
//       <div className="mt-4 space-y-2">
//         <div>⏲ Current Time: {currentTime.format('hh:mm:ss A')}</div>
//         <div>🔑 Logged In At: {loggedInTime?.format('hh:mm A')}</div>
//         <div>⏱ Session Duration: {sessionDuration}</div>
//         <div>🖥 Total Worked: {totalWorked}</div>
//         <div>📈 Progress: {loginProgress.toFixed(1)}%</div>
//         <div>⌛ Remaining: {remainingTime}</div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;







// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // On first mount: restore persisted times
//   useEffect(() => {
//     let originalLoginTime = localStorage.getItem('originalLoginTime');
//     if (!originalLoginTime) {
//       originalLoginTime = new Date().toISOString();
//       localStorage.setItem('originalLoginTime', originalLoginTime);
//     }
//     setLoggedInTime(dayjs(originalLoginTime));

//     const now = new Date().toISOString();
//     setSessionStartTime(dayjs(now));

//     const savedWorked = localStorage.getItem('totalWorkedTime');
//     if (savedWorked) setTotalWorkedSeconds(parseInt(savedWorked));
//   }, []);

//   // Update timers
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       // Current session seconds
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       // Total worked = previous + current
//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       // Progress + remaining
//       const progress = Math.min((totalSec/32400)*100, 100);
//       setLoginProgress(progress);

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);
//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Persist worked time when leaving
//   useEffect(() => {
//     const save = () => {
//       if (!sessionStartTime) return;
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());
//     };
//     window.addEventListener('beforeunload', save);
//     return () => {
//       save();
//       window.removeEventListener('beforeunload', save);
//     };
//   }, [sessionStartTime, totalWorkedSeconds]);

//   return (
//     <div className="p-6">
//       <h2 className="font-bold text-xl mb-4">Supervisor Time Tracking</h2>
//       <p>⏲ Current: {currentTime.format('hh:mm:ss A')}</p>
//       <p>🔑 Logged In: {loggedInTime?.format('hh:mm A')}</p>
//       <p>⏱ Session: {sessionDuration}</p>
//       <p>🖥 Total Worked: {totalWorked}</p>
//       <p>📈 Progress: {loginProgress.toFixed(1)}%</p>
//       <p>⌛ Remaining: {remainingTime}</p>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//=====================correct==========================

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // On first mount: restore persisted times
//   useEffect(() => {
//     let originalLoginTime = localStorage.getItem('originalLoginTime');
//     if (!originalLoginTime) {
//       originalLoginTime = new Date().toISOString();
//       localStorage.setItem('originalLoginTime', originalLoginTime);
//     }
//     setLoggedInTime(dayjs(originalLoginTime));

//     const now = new Date().toISOString();
//     setSessionStartTime(dayjs(now));

//     const savedWorked = localStorage.getItem('totalWorkedTime');
//     if (savedWorked) setTotalWorkedSeconds(parseInt(savedWorked));
//   }, []);

//   // Update timers
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       const progress = Math.min((totalSec/32400)*100, 100);
//       setLoginProgress(progress);

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);
//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Persist worked time
//   useEffect(() => {
//     const save = () => {
//       if (!sessionStartTime) return;
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());
//     };
//     window.addEventListener('beforeunload', save);
//     return () => {
//       save();
//       window.removeEventListener('beforeunload', save);
//     };
//   }, [sessionStartTime, totalWorkedSeconds]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
    


// <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//   <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//     {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//   </div>
//   <h3 className="text-xl font-bold text-gray-800">
//     👤 {employee?.name || 'Employee'}
//   </h3>
//   <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//   <p className="text-sm text-gray-500">
//     🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//   </p>
// </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//====================connect to API also and persist=======

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // Import your API instance

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);
//   const [loginRecordId, setLoginRecordId] = useState(null);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Create login record when component mounts
//   useEffect(() => {
//     const createLoginRecord = async () => {
//       try {
//         if (employee?._id) {
//           const res = await API.post("/hours/login", { employeeId: employee._id });
//           setLoggedInTime(dayjs(res.data.loginTime));
//           setLoginRecordId(res.data._id);
          
//           // Store in localStorage for persistence
//           localStorage.setItem('originalLoginTime', res.data.loginTime);
//           localStorage.setItem('loginRecordId', res.data._id);
//         }
//       } catch (err) {
//         console.error("Error creating login record:", err);
//         // Fallback to local storage if API fails
//         let originalLoginTime = localStorage.getItem('originalLoginTime');
//         if (!originalLoginTime) {
//           originalLoginTime = new Date().toISOString();
//           localStorage.setItem('originalLoginTime', originalLoginTime);
//         }
//         setLoggedInTime(dayjs(originalLoginTime));
//       }
//     };

//     createLoginRecord();
//   }, [employee]);

//   // On component mount: restore persisted times
//   useEffect(() => {
//     const savedLoginTime = localStorage.getItem('originalLoginTime');
//     const savedRecordId = localStorage.getItem('loginRecordId');
//     const savedWorked = localStorage.getItem('totalWorkedTime');
    
//     if (savedLoginTime) {
//       setLoggedInTime(dayjs(savedLoginTime));
//     }
    
//     if (savedRecordId) {
//       setLoginRecordId(savedRecordId);
//     }
    
//     if (savedWorked) {
//       setTotalWorkedSeconds(parseInt(savedWorked));
//     }

//     const now = new Date().toISOString();
//     setSessionStartTime(dayjs(now));
//   }, []);

//   // Update timers
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       const progress = Math.min((totalSec/32400)*100, 100);
//       setLoginProgress(progress);

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);
//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Fetch worked hours from API periodically
//   useEffect(() => {
//     const fetchWorkedHours = async () => {
//       if (!employee?._id) return;
      
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         const data = res.data;
        
//         // Convert worked hours to seconds
//         if (data.workedHoursToday) {
//           const workedSeconds = Math.floor(data.workedHoursToday * 3600);
//           setTotalWorkedSeconds(workedSeconds);
//           localStorage.setItem('totalWorkedTime', workedSeconds.toString());
//         }
//       } catch (err) {
//         console.error("Error fetching worked hours:", err);
//       }
//     };

//     // Fetch initially
//     fetchWorkedHours();
    
//     // Set up interval to fetch periodically (every 5 minutes)
//     const interval = setInterval(fetchWorkedHours, 5 * 60 * 1000);
    
//     return () => clearInterval(interval);
//   }, [employee]);

//   // Persist worked time and mark logout when component unmounts
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;
      
//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());
      
//       // Mark logout in API
//       try {
//         await API.post("/hours/logout", { employeeId: employee._id });
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener('beforeunload', saveAndLogout);
//     return () => {
//       saveAndLogout();
//       window.removeEventListener('beforeunload', saveAndLogout);
//     };
//   }, [sessionStartTime, totalWorkedSeconds, employee]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//           <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//             {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//           </div>
//           <h3 className="text-xl font-bold text-gray-800">
//             👤 {employee?.name || 'Employee'}
//           </h3>
//           <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//           <p className="text-sm text-gray-500">
//             🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//           </p>
//         </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//=================================new

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // Import your API instance

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);
//   const [loginRecordId, setLoginRecordId] = useState(null);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Restore or create login record
//   useEffect(() => {
//     const initLogin = async () => {
//       if (!employee?._id) return;

//       const savedLoginTime = localStorage.getItem('originalLoginTime');
//       const savedRecordId = localStorage.getItem('loginRecordId');

//       if (savedLoginTime && savedRecordId) {
//         // ✅ Restore from localStorage
//         setLoggedInTime(dayjs(savedLoginTime));
//         setLoginRecordId(savedRecordId);
//       } else {
//         // ✅ First time login → create record in backend
//         try {
//           const res = await API.post("/hours/login", { employeeId: employee._id });
//           setLoggedInTime(dayjs(res.data.loginTime));
//           setLoginRecordId(res.data._id);

//           localStorage.setItem('originalLoginTime', res.data.loginTime);
//           localStorage.setItem('loginRecordId', res.data._id);
//         } catch (err) {
//           console.error("Error creating login record:", err);
//           const fallbackTime = new Date().toISOString();
//           setLoggedInTime(dayjs(fallbackTime));
//           localStorage.setItem('originalLoginTime', fallbackTime);
//         }
//       }

//       setSessionStartTime(dayjs());
//     };

//     initLogin();
//   }, [employee]);

//   // Restore worked time
//   useEffect(() => {
//     const savedWorked = localStorage.getItem('totalWorkedTime');
//     if (savedWorked) setTotalWorkedSeconds(parseInt(savedWorked));
//   }, []);

//   // Update timers every second
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       setLoginProgress(Math.min((totalSec/32400)*100, 100));

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);

//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Fetch worked hours from API every 5 mins
//   useEffect(() => {
//     const fetchWorkedHours = async () => {
//       if (!employee?._id) return;
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         if (res.data?.workedHoursToday) {
//           const workedSeconds = Math.floor(res.data.workedHoursToday * 3600);
//           setTotalWorkedSeconds(workedSeconds);
//           localStorage.setItem('totalWorkedTime', workedSeconds.toString());
//         }
//       } catch (err) {
//         console.error("Error fetching worked hours:", err);
//       }
//     };

//     fetchWorkedHours();
//     const interval = setInterval(fetchWorkedHours, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [employee]);

//   // Save worked time + logout on unmount
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());

//       try {
//         await API.post("/hours/logout", { employeeId: employee._id });
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener('beforeunload', saveAndLogout);
//     return () => {
//       saveAndLogout();
//       window.removeEventListener('beforeunload', saveAndLogout);
//     };
//   }, [sessionStartTime, totalWorkedSeconds, employee]);

//   return (
//  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//           <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//             {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//           </div>
//           <h3 className="text-xl font-bold text-gray-800">
//             👤 {employee?.name || 'Employee'}
//           </h3>
//           <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//           <p className="text-sm text-gray-500">
//             🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//           </p>
//         </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//====


// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // axios instance with auth

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [totalWorkedSeconds, setTotalWorkedSeconds] = useState(0);
//   const [loginRecordId, setLoginRecordId] = useState(null);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Restore state OR create login record
//   useEffect(() => {
//     const initLogin = async () => {
//       if (!employee?._id) return;

//       const savedLoginTime = localStorage.getItem("originalLoginTime");
//       const savedRecordId = localStorage.getItem("loginRecordId");
//       const savedWorked = localStorage.getItem("totalWorkedTime");

//       if (savedLoginTime && savedRecordId) {
//         // ✅ Restore existing session
//         setLoggedInTime(dayjs(savedLoginTime));
//         setLoginRecordId(savedRecordId);
//         setTotalWorkedSeconds(parseInt(savedWorked || "0"));
//       } else {
//         // ✅ First time login today → create record
//         try {
//           const res = await API.post("/hours/login", { employeeId: employee._id });
//           setLoggedInTime(dayjs(res.data.loginTime));
//           setLoginRecordId(res.data._id);

//           localStorage.setItem("originalLoginTime", res.data.loginTime);
//           localStorage.setItem("loginRecordId", res.data._id);
//           localStorage.setItem("totalWorkedTime", "0");
//         } catch (err) {
//           console.error("Error creating login record:", err);
//           // fallback: local only
//           const now = new Date().toISOString();
//           setLoggedInTime(dayjs(now));
//           localStorage.setItem("originalLoginTime", now);
//         }
//       }

//       setSessionStartTime(dayjs()); // new session every mount
//     };

//     initLogin();
//   }, [employee]);

//   // Update timers
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, "second");
//       const dur = dayjs.duration(sessionSec, "seconds");

//       setSessionDuration(
//         `${String(dur.hours()).padStart(2, "0")}:${String(dur.minutes()).padStart(2, "0")}:${String(dur.seconds()).padStart(2, "0")}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       const h = Math.floor(totalSec / 3600);
//       const m = Math.floor((totalSec % 3600) / 60);
//       const s = totalSec % 60;

//       setTotalWorked(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);

//       const progress = Math.min((totalSec / 32400) * 100, 100);
//       setLoginProgress(progress);

//       const rem = Math.max(0, 32400 - totalSec);
//       const rh = Math.floor(rem / 3600);
//       const rm = Math.floor((rem % 3600) / 60);
//       const rs = rem % 60;

//       setRemainingTime(`${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}:${String(rs).padStart(2, "0")}`);
//     }, 1000);

//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Save worked time periodically
//   useEffect(() => {
//     const saveWorked = () => {
//       if (!sessionStartTime) return;
//       const sessionSec = dayjs().diff(sessionStartTime, "second");
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem("totalWorkedTime", newTotal.toString());
//     };

//     const t = setInterval(saveWorked, 60 * 1000); // save every 1 min
//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // On unmount/logout → persist + API call
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;

//       const sessionSec = dayjs().diff(sessionStartTime, "second");
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem("totalWorkedTime", newTotal.toString());

//       try {
//         await API.post("/hours/logout", { employeeId: employee._id });
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener("beforeunload", saveAndLogout);
//     return () => {
//       saveAndLogout();
//       window.removeEventListener("beforeunload", saveAndLogout);
//     };
//   }, [sessionStartTime, totalWorkedSeconds, employee]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold">Supervisor Time Tracking ⏱</h2>
//       <p>Current Time: {currentTime.format("hh:mm:ss A")}</p>
//       <p>Logged In: {loggedInTime?.format("hh:mm A")}</p>
//       <p>Session Duration: {sessionDuration}</p>
//       <p>Total Worked: {totalWorked}</p>
//       <p>Progress: {loginProgress.toFixed(1)}%</p>
//       <p>Remaining: {remainingTime}</p>
//     </div>
//   );
// };

// export default SupervisorBreakTime;


//=============================1===correct persist the value=======


// import React, { useState, useEffect, useMemo } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // Import your API instance

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [loginRecordId, setLoginRecordId] = useState(null);

//   // Use useMemo to persist values across sessions
//   const totalWorkedSeconds = useMemo(() => {
//     const saved = localStorage.getItem('totalWorkedTime');
//     return saved ? parseInt(saved) : 0;
//   }, []);

//   // Determine if we're in the current shift (5 PM to next day 4:59 PM)
//   const isInCurrentShift = useMemo(() => {
//     const now = dayjs();
//     const today5PM = dayjs().hour(17).minute(0).second(0);
//     const tomorrow459PM = dayjs().add(1, 'day').hour(16).minute(59).second(59);
    
//     return now.isAfter(today5PM) && now.isBefore(tomorrow459PM);
//   }, [currentTime]);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Restore or create login record
//   useEffect(() => {
//     const initLogin = async () => {
//       if (!employee?._id) return;

//       // Check if we need to reset for a new shift
//       const lastShiftDate = localStorage.getItem('lastShiftDate');
//       const today = dayjs().format('YYYY-MM-DD');
      
//       if (lastShiftDate !== today && isInCurrentShift) {
//         // New shift, clear previous data
//         localStorage.removeItem('originalLoginTime');
//         localStorage.removeItem('loginRecordId');
//         localStorage.removeItem('totalWorkedTime');
//         localStorage.setItem('lastShiftDate', today);
//       }

//       const savedLoginTime = localStorage.getItem('originalLoginTime');
//       const savedRecordId = localStorage.getItem('loginRecordId');

//       if (savedLoginTime && savedRecordId) {
//         // ✅ Restore from localStorage
//         setLoggedInTime(dayjs(savedLoginTime));
//         setLoginRecordId(savedRecordId);
//       } else {
//         // ✅ First time login in this shift → create record in backend
//         try {
//           const res = await API.post("/hours/login", { employeeId: employee._id });
//           setLoggedInTime(dayjs(res.data.loginTime));
//           setLoginRecordId(res.data._id);

//           localStorage.setItem('originalLoginTime', res.data.loginTime);
//           localStorage.setItem('loginRecordId', res.data._id);
//         } catch (err) {
//           console.error("Error creating login record:", err);
//           const fallbackTime = new Date().toISOString();
//           setLoggedInTime(dayjs(fallbackTime));
//           localStorage.setItem('originalLoginTime', fallbackTime);
//         }
//       }

//       setSessionStartTime(dayjs());
//     };

//     initLogin();
//   }, [employee, isInCurrentShift]);

//   // Update timers every second
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', totalSec.toString());
      
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       setLoginProgress(Math.min((totalSec/32400)*100, 100));

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);

//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Fetch worked hours from API every 5 mins
//   useEffect(() => {
//     const fetchWorkedHours = async () => {
//       if (!employee?._id) return;
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         if (res.data?.workedHoursToday) {
//           const workedSeconds = Math.floor(res.data.workedHoursToday * 3600);
//           localStorage.setItem('totalWorkedTime', workedSeconds.toString());
//         }
//       } catch (err) {
//         console.error("Error fetching worked hours:", err);
//       }
//     };

//     fetchWorkedHours();
//     const interval = setInterval(fetchWorkedHours, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [employee]);

//   // Save worked time + logout on unmount
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());

//       try {
//         await API.post("/hours/logout", { 
//           employeeId: employee._id,
//           recordId: loginRecordId
//         });
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener('beforeunload', saveAndLogout);
//     return () => {
//       saveAndLogout();
//       window.removeEventListener('beforeunload', saveAndLogout);
//     };
//   }, [sessionStartTime, totalWorkedSeconds, employee, loginRecordId]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//           <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//             {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//           </div>
//           <h3 className="text-xl font-bold text-gray-800">
//             👤 {employee?.name || 'Employee'}
//           </h3>
//           <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//           <p className="text-sm text-gray-500">
//             🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//           </p>
//         </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;

//===========================2====correct persist the value more accurate===

// import React, { useState, useEffect, useMemo } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // Import your API instance

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);
//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');
//   const [loginRecordId, setLoginRecordId] = useState(null);
//   const [hasExistingRecord, setHasExistingRecord] = useState(false);

//   // Use useMemo to persist values across sessions
//   const totalWorkedSeconds = useMemo(() => {
//     const saved = localStorage.getItem('totalWorkedTime');
//     return saved ? parseInt(saved) : 0;
//   }, []);

//   // Determine if we're in the current shift (5 PM to next day 4:59 PM)
//   const isInCurrentShift = useMemo(() => {
//     const now = dayjs();
//     const today5PM = dayjs().hour(17).minute(0).second(0);
//     const tomorrow459PM = dayjs().add(1, 'day').hour(16).minute(59).second(59);
    
//     return now.isAfter(today5PM) && now.isBefore(tomorrow459PM);
//   }, [currentTime]);

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Check for existing records in the API
//   useEffect(() => {
//     const checkExistingRecords = async () => {
//       if (!employee?._id) return;
      
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         if (res.data && res.data.loginTime) {
//           // Check if this record is from today's shift
//           const recordDate = dayjs(res.data.loginTime);
//           const today5PM = dayjs().hour(17).minute(0).second(0);
//           const isFromTodayShift = recordDate.isAfter(today5PM.subtract(1, 'day'));
          
//           if (isFromTodayShift) {
//             setHasExistingRecord(true);
//             setLoggedInTime(dayjs(res.data.loginTime));
//             setLoginRecordId(res.data._id);
//             localStorage.setItem('originalLoginTime', res.data.loginTime);
//             localStorage.setItem('loginRecordId', res.data._id);
//           }
//         }
//       } catch (err) {
//         console.error("Error checking existing records:", err);
//       }
//     };

//     checkExistingRecords();
//   }, [employee]);

//   // Restore or create login record
//   useEffect(() => {
//     const initLogin = async () => {
//       if (!employee?._id) return;

//       // Check if we need to reset for a new shift
//       const lastShiftDate = localStorage.getItem('lastShiftDate');
//       const today = dayjs().format('YYYY-MM-DD');
      
//       if (lastShiftDate !== today && isInCurrentShift) {
//         // New shift, clear previous data
//         localStorage.removeItem('originalLoginTime');
//         localStorage.removeItem('loginRecordId');
//         localStorage.removeItem('totalWorkedTime');
//         localStorage.setItem('lastShiftDate', today);
//         setHasExistingRecord(false);
//       }

//       const savedLoginTime = localStorage.getItem('originalLoginTime');
//       const savedRecordId = localStorage.getItem('loginRecordId');

//       if (savedLoginTime && savedRecordId && hasExistingRecord) {
//         // ✅ Restore from localStorage and existing API record
//         setLoggedInTime(dayjs(savedLoginTime));
//         setLoginRecordId(savedRecordId);
        
//         // Update the existing record with new login time
//         try {
//           await API.patch(`/hours/${savedRecordId}`, { 
//             loginTime: new Date().toISOString() 
//           });
//         } catch (err) {
//           console.error("Error updating login record:", err);
//         }
//       } else if (!hasExistingRecord) {
//         // ✅ First time login in this shift → create record in backend
//         try {
//           const res = await API.post("/hours/login", { employeeId: employee._id });
//           setLoggedInTime(dayjs(res.data.loginTime));
//           setLoginRecordId(res.data._id);
//           setHasExistingRecord(true);

//           localStorage.setItem('originalLoginTime', res.data.loginTime);
//           localStorage.setItem('loginRecordId', res.data._id);
//         } catch (err) {
//           console.error("Error creating login record:", err);
//           const fallbackTime = new Date().toISOString();
//           setLoggedInTime(dayjs(fallbackTime));
//           localStorage.setItem('originalLoginTime', fallbackTime);
//         }
//       }

//       setSessionStartTime(dayjs());
//     };

//     initLogin();
//   }, [employee, isInCurrentShift, hasExistingRecord]);

//   // Update timers every second
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2,'0')}:${String(dur.minutes()).padStart(2,'0')}:${String(dur.seconds()).padStart(2,'0')}`
//       );

//       const totalSec = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', totalSec.toString());
      
//       const h = Math.floor(totalSec/3600);
//       const m = Math.floor((totalSec%3600)/60);
//       const s = totalSec%60;
//       setTotalWorked(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);

//       setLoginProgress(Math.min((totalSec/32400)*100, 100));

//       const rem = Math.max(0, 32400-totalSec);
//       const rh = Math.floor(rem/3600);
//       const rm = Math.floor((rem%3600)/60);
//       const rs = rem%60;
//       setRemainingTime(`${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}:${String(rs).padStart(2,'0')}`);
//     },1000);

//     return () => clearInterval(t);
//   }, [sessionStartTime, totalWorkedSeconds]);

//   // Fetch worked hours from API every 5 mins
//   useEffect(() => {
//     const fetchWorkedHours = async () => {
//       if (!employee?._id) return;
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         if (res.data?.workedHoursToday) {
//           const workedSeconds = Math.floor(res.data.workedHoursToday * 3600);
//           localStorage.setItem('totalWorkedTime', workedSeconds.toString());
//         }
//       } catch (err) {
//         console.error("Error fetching worked hours:", err);
//       }
//     };

//     fetchWorkedHours();
//     const interval = setInterval(fetchWorkedHours, 5 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [employee]);

//   // Save worked time + logout on unmount
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second');
//       const newTotal = totalWorkedSeconds + sessionSec;
//       localStorage.setItem('totalWorkedTime', newTotal.toString());

//       try {
//         await API.patch(`/hours/${loginRecordId}`, { 
//           logoutTime: new Date().toISOString(),
//           workedSeconds: newTotal
//         });
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener('beforeunload', saveAndLogout);
//     return () => {
//       saveAndLogout();
//       window.removeEventListener('beforeunload', saveAndLogout);
//     };
//   }, [sessionStartTime, totalWorkedSeconds, employee, loginRecordId]);

//   return (
//    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//           <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//             {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//           </div>
//           <h3 className="text-xl font-bold text-gray-800">
//             👤 {employee?.name || 'Employee'}
//           </h3>
//           <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//           <p className="text-sm text-gray-500">
//             🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//           </p>
//         </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;



//=================correct3===========


// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';
// import API from "../api"; // axios instance with auth

// dayjs.extend(duration);

// const SupervisorBreakTime = () => {
//   const { employee } = useOutletContext();

//   // -------------------------------
//   // Helpers for the 5PM → next day 4:59:59 PM shift window
//   // -------------------------------
//   const getCurrentShiftBounds = () => {
//     const now = dayjs();
//     const today5PM = dayjs().hour(17).minute(0).second(0);

//     if (now.isSame(today5PM) || now.isAfter(today5PM)) {
//       // Current shift started today at 5PM
//       const start = today5PM;
//       const end = dayjs().add(1, 'day').hour(16).minute(59).second(59);
//       return { start, end, key: start.format('YYYY-MM-DD') };
//     }

//     // Before 5PM → still in yesterday's shift
//     const yesterday5PM = dayjs().subtract(1, 'day').hour(17).minute(0).second(0);
//     const start = yesterday5PM;
//     const end = dayjs().hour(16).minute(59).second(59);
//     return { start, end, key: start.format('YYYY-MM-DD') };
//   };

//   // -------------------------------
//   // UI state
//   // -------------------------------
//   const [currentTime, setCurrentTime] = useState(dayjs());
//   const [loggedInTime, setLoggedInTime] = useState(null);
//   const [sessionStartTime, setSessionStartTime] = useState(null);

//   const [sessionDuration, setSessionDuration] = useState('00:00:00');
//   const [totalWorked, setTotalWorked] = useState('00:00:00');
//   const [loginProgress, setLoginProgress] = useState(0);
//   const [remainingTime, setRemainingTime] = useState('09:00:00');

//   const [loginRecordId, setLoginRecordId] = useState(null);
//   const [hasExistingRecord, setHasExistingRecord] = useState(false);

//   // Cumulative worked seconds BEFORE the current live session.
//   const [baseWorkedSeconds, setBaseWorkedSeconds] = useState(() => {
//     const saved = parseInt(localStorage.getItem('totalWorkedTime') || '0', 10);
//     return Number.isFinite(saved) ? saved : 0;
//   });

//   // Live clock
//   useEffect(() => {
//     const t = setInterval(() => setCurrentTime(dayjs()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // -------------------------------
//   // Initialize / restore login & worked seconds for current shift
//   // -------------------------------
//   useEffect(() => {
//     const init = async () => {
//       if (!employee?._id) return;

//       const { start: shiftStart, end: shiftEnd, key: shiftKey } = getCurrentShiftBounds();

//       // Shift key handling: reset when shift changes
//       const lastShiftKey = localStorage.getItem('lastShiftKey');
//       if (lastShiftKey !== shiftKey) {
//         localStorage.removeItem('originalLoginTime');
//         localStorage.removeItem('loginRecordId');
//         localStorage.removeItem('totalWorkedTime');
//         localStorage.setItem('lastShiftKey', shiftKey);
//         setHasExistingRecord(false);
//         setBaseWorkedSeconds(0);
//       }

//       try {
//         // Try to find today's/this shift's record from backend
//         const res = await API.get(`/hours/today/${employee._id}`);
//         const data = res?.data || null;

//         let inThisShift = false;
//         if (data?.loginTime) {
//           const recordLogin = dayjs(data.loginTime);
//           // record belongs to this shift if loginTime ∈ [shiftStart, shiftEnd]
//           inThisShift = (recordLogin.isAfter(shiftStart) || recordLogin.isSame(shiftStart)) &&
//                         (recordLogin.isBefore(shiftEnd) || recordLogin.isSame(shiftEnd));
//         }

//         if (data && inThisShift) {
//           // Restore existing record within shift
//           setHasExistingRecord(true);
//           setLoggedInTime(dayjs(data.loginTime));
//           setLoginRecordId(data._id);
//           localStorage.setItem('originalLoginTime', data.loginTime);
//           localStorage.setItem('loginRecordId', data._id);

//           // Restore worked seconds (prefer exact seconds; else hours → seconds; else LS)
//           const fromSeconds = Number.isFinite(data.workedSeconds) ? data.workedSeconds : null;
//           const fromHours = Number.isFinite(data.workedHoursToday) ? Math.floor(data.workedHoursToday * 3600) : null;
//           const savedLS = parseInt(localStorage.getItem('totalWorkedTime') || '0', 10);
//           const restored = Number.isFinite(fromSeconds)
//             ? fromSeconds
//             : Number.isFinite(fromHours)
//             ? fromHours
//             : (Number.isFinite(savedLS) ? savedLS : 0);

//           setBaseWorkedSeconds(restored);
//           localStorage.setItem('totalWorkedTime', String(restored));
//         } else {
//           // No record (or record not in this shift) → create new login record
//           const create = await API.post("/hours/login", { employeeId: employee._id });
//           const created = create?.data || {};
//           setLoggedInTime(dayjs(created.loginTime || new Date().toISOString()));
//           setLoginRecordId(created._id || null);
//           setHasExistingRecord(true);

//           localStorage.setItem('originalLoginTime', created.loginTime || new Date().toISOString());
//           if (created._id) localStorage.setItem('loginRecordId', created._id);
//           setBaseWorkedSeconds(0);
//           localStorage.setItem('totalWorkedTime', '0');
//         }
//       } catch (err) {
//         console.error("Error initializing login record:", err);
//         // Fallback minimal init (local only)
//         const fallbackTime = new Date().toISOString();
//         setLoggedInTime(dayjs(fallbackTime));
//         localStorage.setItem('originalLoginTime', fallbackTime);
//       }

//       // Start live session timing from *now*
//       setSessionStartTime(dayjs());
//     };

//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [employee]);

//   // -------------------------------
//   // 5-minute backend sync for worked seconds (safe, no double-count)
//   // -------------------------------
//   useEffect(() => {
//     if (!employee?._id) return;

//     const sync = async () => {
//       try {
//         const res = await API.get(`/hours/today/${employee._id}`);
//         const data = res?.data || null;
//         if (!data) return;

//         const fromSeconds = Number.isFinite(data.workedSeconds) ? data.workedSeconds : null;
//         const fromHours = Number.isFinite(data.workedHoursToday) ? Math.floor(data.workedHoursToday * 3600) : null;
//         const serverTotal = Number.isFinite(fromSeconds) ? fromSeconds : (Number.isFinite(fromHours) ? fromHours : null);

//         if (Number.isFinite(serverTotal)) {
//           setBaseWorkedSeconds(serverTotal);
//           localStorage.setItem('totalWorkedTime', String(serverTotal));
//           // Reset session baseline so we don't double add elapsed seconds
//           setSessionStartTime(dayjs());
//         }
//       } catch (err) {
//         console.error("Error syncing worked hours:", err);
//       }
//     };

//     sync();
//     const id = setInterval(sync, 5 * 60 * 1000);
//     return () => clearInterval(id);
//   }, [employee]);

//   // -------------------------------
//   // Tick every second: compute totals from base + live session
//   // -------------------------------
//   useEffect(() => {
//     const t = setInterval(() => {
//       if (!sessionStartTime) return;

//       const sessionSec = dayjs().diff(sessionStartTime, 'second'); // live this session
//       const dur = dayjs.duration(sessionSec, 'seconds');
//       setSessionDuration(
//         `${String(dur.hours()).padStart(2, '0')}:${String(dur.minutes()).padStart(2, '0')}:${String(dur.seconds()).padStart(2, '0')}`
//       );

//       const totalSec = baseWorkedSeconds + sessionSec;

//       // Persist snapshot for safety
//       localStorage.setItem('totalWorkedTime', String(totalSec));

//       const h = Math.floor(totalSec / 3600);
//       const m = Math.floor((totalSec % 3600) / 60);
//       const s = totalSec % 60;
//       setTotalWorked(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);

//       setLoginProgress(Math.min((totalSec / 32400) * 100, 100)); // 9 hours = 32400s

//       const rem = Math.max(0, 32400 - totalSec);
//       const rh = Math.floor(rem / 3600);
//       const rm = Math.floor((rem % 3600) / 60);
//       const rs = rem % 60;
//       setRemainingTime(`${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`);
//     }, 1000);

//     return () => clearInterval(t);
//   }, [sessionStartTime, baseWorkedSeconds]);

//   // -------------------------------
//   // Save worked seconds & mark logout on unload/unmount
//   // -------------------------------
//   useEffect(() => {
//     const saveAndLogout = async () => {
//       if (!sessionStartTime || !employee?._id) return;

//       try {
//         const sessionSec = dayjs().diff(sessionStartTime, 'second');
//         const newTotal = baseWorkedSeconds + sessionSec;

//         localStorage.setItem('totalWorkedTime', String(newTotal));

//         if (loginRecordId) {
//           await API.patch(`/hours/${loginRecordId}`, {
//             logoutTime: new Date().toISOString(),
//             workedSeconds: newTotal
//           });
//         }
//       } catch (err) {
//         console.error("Error marking logout:", err);
//       }
//     };

//     window.addEventListener('beforeunload', saveAndLogout);
//     return () => {
//       // on component unmount
//       saveAndLogout();
//       window.removeEventListener('beforeunload', saveAndLogout);
//     };
//   }, [sessionStartTime, baseWorkedSeconds, employee, loginRecordId]);

//   // -------------------------------
//   // Pre-render derived fields from base (instant UI before first tick)
//   // -------------------------------
//   useEffect(() => {
//     if (!sessionStartTime) {
//       const totalSec = baseWorkedSeconds;
//       const h = Math.floor(totalSec / 3600);
//       const m = Math.floor((totalSec % 3600) / 60);
//       const s = totalSec % 60;
//       setTotalWorked(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
//       setLoginProgress(Math.min((totalSec / 32400) * 100, 100));
//       const rem = Math.max(0, 32400 - totalSec);
//       const rh = Math.floor(rem / 3600);
//       const rm = Math.floor((rem % 3600) / 60);
//       const rs = rem % 60;
//       setRemainingTime(`${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`);
//     }
//   }, [baseWorkedSeconds, sessionStartTime]);

//   // -------------------------------
//   // Render
//   // -------------------------------
//   const { start: shiftStart, end: shiftEnd } = getCurrentShiftBounds();
//   const isInCurrentShift = currentTime.isAfter(shiftStart) && currentTime.isBefore(shiftEnd);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
//       <div className="max-w-5xl mx-auto space-y-6">
//         <h2 className="text-3xl font-extrabold text-gray-800 text-center">
//           Supervisor Time Tracking ⏱
//         </h2>

//         {/* Employee Card */}
//         <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
//           <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
//             {employee?.name ? employee.name.charAt(0).toUpperCase() : 'E'}
//           </div>
//           <h3 className="text-xl font-bold text-gray-800">
//             👤 {employee?.name || 'Employee'}
//           </h3>
//           <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
//           <p className="text-sm text-gray-500">
//             🆔 <span className="font-medium">{employee?._id || 'N/A'}</span>
//           </p>
//         </div>

//         {/* Grid layout */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Current Time</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {currentTime.format('hh:mm:ss A')}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Logged In</p>
//             <p className="text-2xl font-bold text-green-600">
//               {loggedInTime?.format('hh:mm A') || '--:-- --'}
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Session Duration</p>
//             <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Total Worked</p>
//             <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Progress</p>
//             <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
//               <div
//                 className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
//                 style={{ width: `${loginProgress}%` }}
//               />
//             </div>
//             <p className="mt-2 text-lg font-semibold text-indigo-600">
//               {loginProgress.toFixed(1)}%
//             </p>
//           </div>

//           <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
//             <p className="text-gray-500 mb-2">Remaining</p>
//             <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
//           </div>
//         </div>

//         {/* ✅ Completion Status */}
//         {loginProgress >= 100 ? (
//           <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
//             <span className="text-green-700 font-medium">
//               🎉 You've completed your 9-hour workday!
//             </span>
//           </div>
//         ) : (
//           <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
//             <span className="text-blue-700 text-sm">
//               {Math.floor(parseInt(remainingTime.split(':')[0]))} hours {parseInt(remainingTime.split(':')[1])} minutes remaining to complete your 9-hour workday
//             </span>
//           </div>
//         )}

//         {/* ℹ️ Supervisor Information */}
//         <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
//           <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <span>👨‍💼</span> Supervisor Information
//           </p>
//           <p className="mb-2">
//             Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
//           </p>
//           <p>
//             Your total worked time includes all active session time since login during this shift period.
//             The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
//           </p>
//           {!isInCurrentShift && (
//             <p className="mt-2 text-xs text-purple-600">
//               Note: You are currently outside the active shift window; timers will resume in the next shift.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupervisorBreakTime;
//-------------------grok------------




import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import API from "../api";

dayjs.extend(duration);

const SupervisorBreakTime = () => {
  const { employee } = useOutletContext();

  const getCurrentShiftBounds = () => {
    const now = dayjs();
    const today5PM = dayjs().hour(17).minute(0).second(0);

    if (now.isSame(today5PM) || now.isAfter(today5PM)) {
      const start = today5PM;
      const end = dayjs().add(1, "day").hour(16).minute(59).second(59);
      return { start, end, key: start.format("YYYY-MM-DD") };
    }

    const yesterday5PM = dayjs().subtract(1, "day").hour(17).minute(0).second(0);
    const start = yesterday5PM;
    const end = dayjs().hour(16).minute(59).second(59);
    return { start, end, key: start.format("YYYY-MM-DD") };
  };

  const [currentTime, setCurrentTime] = useState(dayjs());
  const [loggedInTime, setLoggedInTime] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  const [sessionDuration, setSessionDuration] = useState("00:00:00");
  const [totalWorked, setTotalWorked] = useState("00:00:00");
  const [loginProgress, setLoginProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState("09:00:00");

  const [loginRecordId, setLoginRecordId] = useState(null);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [baseWorkedSeconds, setBaseWorkedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!employee?._id) return;

      const { start: shiftStart, end: shiftEnd, key: shiftKey } = getCurrentShiftBounds();
      const lastShiftKey = localStorage.getItem("lastShiftKey");

      if (lastShiftKey !== shiftKey) {
        localStorage.removeItem("originalLoginTime");
        localStorage.removeItem("loginRecordId");
        localStorage.removeItem("totalWorkedTime");
        localStorage.setItem("lastShiftKey", shiftKey);
        setHasExistingRecord(false);
        setBaseWorkedSeconds(0);
      }

      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/hours/today/${employee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res?.data || null;

        let inThisShift = false;
        if (data?.loginTime) {
          const recordLogin = dayjs(data.loginTime);
          inThisShift =
            (recordLogin.isAfter(shiftStart) || recordLogin.isSame(shiftStart)) &&
            (recordLogin.isBefore(shiftEnd) || recordLogin.isSame(shiftEnd));
        }

        if (data && inThisShift) {
          setHasExistingRecord(true);
          const persistedLoginTime = localStorage.getItem("originalLoginTime") || data.loginTime;
          setLoggedInTime(dayjs(persistedLoginTime));
          setLoginRecordId(data._id);
          localStorage.setItem("loginRecordId", data._id);
          localStorage.setItem("originalLoginTime", persistedLoginTime);

          const workedSeconds = Number.isFinite(data.workedSeconds)
            ? data.workedSeconds
            : Number.isFinite(data.workedHoursToday)
            ? Math.floor(data.workedHoursToday * 3600)
            : 0;
          setBaseWorkedSeconds(workedSeconds);
          localStorage.setItem("totalWorkedTime", String(workedSeconds));
          console.log("Re-login: Restored workedSeconds =", workedSeconds); // Debug log
        } else {
          const create = await API.post("/hours/login", { employeeId: employee._id });
          const created = create?.data || {};
          setLoggedInTime(dayjs(created.loginTime || new Date().toISOString()));
          setLoginRecordId(created._id || null);
          setHasExistingRecord(true);
          localStorage.setItem("originalLoginTime", created.loginTime || new Date().toISOString());
          if (created._id) localStorage.setItem("loginRecordId", created._id);
          setBaseWorkedSeconds(0);
          localStorage.setItem("totalWorkedTime", "0");
        }

        // Restore or set session start time
        const lastSessionStart = sessionStorage.getItem("sessionStart") || data.loginTime;
        setSessionStartTime(dayjs(lastSessionStart));
        if (!sessionStorage.getItem("sessionStart")) {
          sessionStorage.setItem("sessionStart", new Date().toISOString());
        }
      } catch (err) {
        console.error("Error initializing login record:", err);
        const fallbackTime = localStorage.getItem("originalLoginTime") || new Date().toISOString();
        setLoggedInTime(dayjs(fallbackTime));
        localStorage.setItem("originalLoginTime", fallbackTime);
      }
    };

    init();
  }, [employee]);

  useEffect(() => {
    if (!employee?._id) return;

    const sync = async () => {
      try {
        const res = await API.get(`/hours/today/${employee._id}`);
        const data = res?.data || null;
        if (data) {
          const workedSeconds = Number.isFinite(data.workedSeconds)
            ? data.workedSeconds
            : Number.isFinite(data.workedHoursToday)
            ? Math.floor(data.workedHoursToday * 3600)
            : 0;
          setBaseWorkedSeconds(workedSeconds);
          localStorage.setItem("totalWorkedTime", String(workedSeconds));
          if (data.loginTime && dayjs(data.loginTime).isAfter(sessionStartTime)) {
            setSessionStartTime(dayjs(data.loginTime));
            sessionStorage.setItem("sessionStart", data.loginTime);
          }
        }
      } catch (err) {
        console.error("Error syncing worked hours:", err);
      }
    };

    sync();
    const interval = setInterval(sync, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [employee, sessionStartTime]);

  useEffect(() => {
    if (!sessionStartTime || !loggedInTime) return;

    const timer = setInterval(() => {
      const sessionSec = dayjs().diff(sessionStartTime, "second");
      const dur = dayjs.duration(sessionSec, "seconds");
      setSessionDuration(
        `${String(dur.hours()).padStart(2, "0")}:${String(dur.minutes()).padStart(2, "0")}:${String(
          dur.seconds()
        ).padStart(2, "0")}`
      );

      const totalSec = baseWorkedSeconds + sessionSec;
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTotalWorked(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);

      setLoginProgress(Math.min((totalSec / 32400) * 100, 100));

      const rem = Math.max(0, 32400 - totalSec);
      const rh = Math.floor(rem / 3600);
      const rm = Math.floor((rem % 3600) / 60);
      const rs = rem % 60;
      setRemainingTime(`${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}:${String(rs).padStart(2, "0")}`);

      localStorage.setItem("totalWorkedTime", String(totalSec));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime, loggedInTime, baseWorkedSeconds]);

  useEffect(() => {
    const saveAndLogout = async () => {
      if (!sessionStartTime || !employee?._id || !loginRecordId) return;

      try {
        const sessionSec = dayjs().diff(sessionStartTime, "second");
        const newTotal = baseWorkedSeconds + sessionSec;

        await API.patch(`/hours/${loginRecordId}`, {
          logoutTime: new Date().toISOString(),
          workedSeconds: newTotal,
        });
        localStorage.setItem("totalWorkedTime", String(newTotal));
      } catch (err) {
        console.error("Error marking logout:", err);
      }
    };

    window.addEventListener("beforeunload", saveAndLogout);
    return () => {
      saveAndLogout();
      window.removeEventListener("beforeunload", saveAndLogout);
    };
  }, [sessionStartTime, baseWorkedSeconds, employee, loginRecordId]);

  useEffect(() => {
    if (!sessionStartTime) {
      const totalSec = baseWorkedSeconds;
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTotalWorked(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
      setLoginProgress(Math.min((totalSec / 32400) * 100, 100));
      const rem = Math.max(0, 32400 - totalSec);
      const rh = Math.floor(rem / 3600);
      const rm = Math.floor((rem % 3600) / 60);
      const rs = rem % 60;
      setRemainingTime(`${String(rh).padStart(2, "0")}:${String(rm).padStart(2, "0")}:${String(rs).padStart(2, "0")}`);
    }
  }, [baseWorkedSeconds, sessionStartTime]);

  const { start: shiftStart, end: shiftEnd } = getCurrentShiftBounds();
  const isInCurrentShift = currentTime.isAfter(shiftStart) && currentTime.isBefore(shiftEnd);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          Supervisor Time Tracking ⏱
        </h2>

        <div className="bg-white shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
            {employee?.name ? employee.name.charAt(0).toUpperCase() : "E"}
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            👤 {employee?.name || "Employee"}
          </h3>
          <div className="w-12 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full my-3"></div>
          <p className="text-sm text-gray-500">
            🆔 <span className="font-medium">{employee?._id || "N/A"}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Current Time</p>
            <p className="text-2xl font-bold text-indigo-600">
              {currentTime.format("hh:mm:ss A")}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Logged In</p>
            <p className="text-2xl font-bold text-green-600">
              {loggedInTime?.format("hh:mm A") || "--:-- --"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Session Duration</p>
            <p className="text-2xl font-bold text-blue-600">{sessionDuration}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Total Worked</p>
            <p className="text-2xl font-bold text-purple-600">{totalWorked}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${loginProgress}%` }}
              />
            </div>
            <p className="mt-2 text-lg font-semibold text-indigo-600">
              {loginProgress.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
            <p className="text-gray-500 mb-2">Remaining</p>
            <p className="text-2xl font-bold text-red-500">{remainingTime}</p>
          </div>
        </div>

        {loginProgress >= 100 ? (
          <div className="p-4 bg-green-100 border border-green-200 rounded-lg text-center shadow-sm">
            <span className="text-green-700 font-medium">
              🎉 You've completed your 9-hour workday!
            </span>
          </div>
        ) : (
          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg text-center shadow-sm">
            <span className="text-blue-700 text-sm">
              {Math.floor(parseInt(remainingTime.split(":")[0]))} hours{" "}
              {parseInt(remainingTime.split(":")[1])} minutes remaining to complete your 9-hour workday
            </span>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-purple-400 rounded-lg p-5 text-sm text-purple-800 shadow-md">
          <p className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <span>👨‍💼</span> Supervisor Information
          </p>
          <p className="mb-2">
            Your shift follows a unique schedule from <strong>5:00 PM to 4:59 PM</strong> the next day.
          </p>
          <p>
            Your total worked time includes all active session time since login during this shift period.
            The progress bar shows your completion toward the <strong>9-hour workday target</strong>.
          </p>
          {!isInCurrentShift && (
            <p className="mt-2 text-xs text-purple-600">
              Note: You are currently outside the active shift window; timers will resume in the next shift.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorBreakTime;