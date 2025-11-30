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
      <div className="fixed flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-md top-4 right-14">
        <FaClock className="text-xl text-blue-500" />
        <div className="text-center">
          <div className="text-sm text-gray-500">Current Time</div>
          <div className="font-mono text-lg font-bold text-gray-700">
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
        className="fixed z-50 p-3 text-blue-600 bg-white border border-gray-200 rounded-full shadow-lg top-4 right-4"
      >
        <FaStopwatch className="text-xl" />
      </button>

      {/* Time display (only when expanded) */}
      {isExpanded && (
        <div className="fixed z-50 flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-md top-16 right-4">
          <FaClock className="text-xl text-blue-500" />
          <div className="text-center">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="font-mono text-lg font-bold text-gray-700">
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
//     <div className="p-4 mr-10 bg-white border border-gray-200 rounded-lg shadow-md w-72">
//       <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
//         <FaClock className="text-blue-500" />
//         Work Time Overview
//       </h3>
//       <div className="grid grid-cols-2 gap-2 text-sm">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="p-2 text-center border border-gray-100 rounded shadow-sm bg-gray-50"
//           >
//             <div className="flex items-center justify-center gap-1 mb-1 text-xs text-gray-500">
//               <span>{item.icon}</span>
//               {item.label}
//             </div>
//             <div className="text-sm font-semibold text-gray-800">{item.value}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Desktop View: always visible floating top-right
//   if (!isMobile) {
//     return (
//       <div className="fixed z-50 top-4 right-4">
//         {ContentBox}
//       </div>
//     );
//   }

//   // Mobile View: toggleable with button
//   return (
//     <>
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="fixed z-50 p-3 text-blue-600 bg-white border border-gray-200 rounded-full shadow-lg top-4 right-4"
//       >
//         <FaStopwatch className="text-xl" />
//       </button>

//       {isExpanded && (
//         <div className="fixed z-50 top-16 right-4">
//           {ContentBox}
//         </div>
//       )}
//     </>
//   );
// };

// export default CurrentTime;
