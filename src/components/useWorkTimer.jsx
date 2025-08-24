// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration';

// dayjs.extend(duration);

// export const useWorkTimer = (employeeId, token) => {
//   const [loginTime, setLoginTime] = useState(null);
//   const [logoutTime, setLogoutTime] = useState(null);
//   const [breaks, setBreaks] = useState([]);
//   const [isOnBreak, setIsOnBreak] = useState(false);
//   const [currentBreakId, setCurrentBreakId] = useState(null);

//   // Fetch employee's session
//   useEffect(() => {
//     if (!employeeId || !token) return;

//     axios.get(`/api/hours/today/${employeeId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     }).then(res => {
//       const data = res.data;
//       setLoginTime(data.loginTime);
//       setLogoutTime(data.logoutTime);
//       setBreaks(data.breaks || []);

//       const activeBreak = (data.breaks || []).find(b => !b.end);
//       if (activeBreak) {
//         setIsOnBreak(true);
//         setCurrentBreakId(activeBreak._id);
//       }
//     }).catch(console.error);
//   }, [employeeId, token]);

//   const startBreak = async () => {
//     try {
//       const res = await axios.post('/api/hours/break/start', { employeeId }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const newBreak = res.data.break;
//       setBreaks(prev => [...prev, newBreak]);
//       setCurrentBreakId(newBreak._id);
//       setIsOnBreak(true);
//     } catch (err) {
//       console.error('Start break error', err);
//     }
//   };

//   const endBreak = async () => {
//     try {
//       await axios.put(`/api/hours/break/end/${currentBreakId}`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setBreaks(prev =>
//         prev.map(b =>
//           b._id === currentBreakId ? { ...b, end: new Date().toISOString() } : b
//         )
//       );
//       setIsOnBreak(false);
//       setCurrentBreakId(null);
//     } catch (err) {
//       console.error('End break error', err);
//     }
//   };

//   const getTotalBreakTime = () => {
//     let totalMs = 0;
//     breaks.forEach(b => {
//       if (b.start && b.end) {
//         totalMs += dayjs(b.end).diff(dayjs(b.start));
//       }
//     });
//     return dayjs.duration(totalMs);
//   };

//   return {
//     loginTime,
//     logoutTime,
//     breaks,
//     isOnBreak,
//     currentBreakId,
//     startBreak,
//     endBreak,
//     getTotalBreakTime,
//   };
// };
//================
// hooks/useWorkTimer.jsx
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const useWorkTimer = () => {
  const [loginTime, setLoginTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('shiftLoginTime');
    const now = dayjs();

    if (saved) {
      setLoginTime(dayjs(saved));
    } else {
      localStorage.setItem('shiftLoginTime', now.toISOString());
      setLoginTime(now);
    }

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedBreaks = parseInt(localStorage.getItem('totalBreakSeconds') || '0');
    setTotalBreakSeconds(storedBreaks);
  }, []);

  const totalWorkedSeconds = currentTime.diff(loginTime, 'second');
  const netWorkedSeconds = totalWorkedSeconds - totalBreakSeconds;

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return {
    loginTime,
    currentTime,
    workedDuration: formatDuration(totalWorkedSeconds),
    netDuration: formatDuration(netWorkedSeconds),
    remainingSeconds: Math.max(0, 9 * 3600 - netWorkedSeconds),
  };
};

export default useWorkTimer;
