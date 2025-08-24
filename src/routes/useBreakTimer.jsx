// hooks/useBreakTimer.js
// import { useState, useEffect } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimer, setBreakTimer] = useState(null);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);

//   const fetchTodayStats = async () => {
//     if (!employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${employee._id}`, headers);
//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//     } catch (err) {
//       console.error('Stats fetch failed:', err);
//     }
//   };

//   const startBreak = async () => {
//     if (!employee?._id) return;
//     if (inBreak || breakCount >= 3) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/break/start', { employeeId: employee._id }, headers);

//       setInBreak(true);
//       setBreakCount(prev => prev + 1);
//       setBreakTimeLeft(300);

//       const timer = setInterval(() => {
//         setBreakTimeLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       setBreakTimer(timer);
//     } catch (err) {
//       console.error('Break start failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/break/end', { employeeId: employee._id }, headers);

//       setInBreak(false);
//       clearInterval(breakTimer);
//       setBreakTimeLeft(0);

//       if (auto) {
//         alert("⏱️ Your break ended automatically after 5 minutes.");
//       } else {
//         alert("🕐 Break ended. Get back to work!");
//       }
//     } catch (err) {
//       console.error("Error ending break:", err);
//     }
//   };

//   useEffect(() => {
//     fetchTodayStats();
//   }, [employee?._id]);

//   return {
//     workedHours,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats
//   };
// }

//======================================

// import { useState, useEffect, useRef } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300); // default 5 min
//   const [loading, setLoading] = useState(false);
// const [breaksToday, setBreaksToday] = useState([]);
//   const breakTimerRef = useRef(null);



// const fetchTodayStats = async () => {
//   if (!employee?._id) return;

//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error("Missing token");

//     const headers = { headers: { Authorization: `Bearer ${token}` } };
//     const res = await API.get(`/hours/today/${employee._id}`, headers);

//     setWorkedHours(res.data.workedHoursToday || 0);
//     setBreakCount(res.data.totalBreaksToday || 0);
//     setBreaksToday(res.data.breaks || []); // 👈 NEW LINE
//   } catch (err) {
//     console.error("Failed to fetch today's stats:", err);
//   }
// };

//   // const startBreak = async (selectedBreak) => {
//   //   if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//   //   try {
//   //     setLoading(true);
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error("Missing token");

//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };

//   //     await API.post('/hours/break/start', {
//   //       employeeId: employee._id,
//   //       duration: selectedBreak.duration,
//   //     }, headers);

//   //     setInBreak(true);
//   //     setBreakCount(prev => prev + 1);
//   //     setBreakTimeLeft(selectedBreak.duration);

//   //     const timer = setInterval(() => {
//   //       setBreakTimeLeft(prev => {
//   //         if (prev <= 1) {
//   //           clearInterval(breakTimerRef.current);
//   //           breakTimerRef.current = null;
//   //           endBreak(true);
//   //           return 0;
//   //         }
//   //         return prev - 1;
//   //       });
//   //     }, 1000);

//   //     breakTimerRef.current = timer;
//   //   } catch (err) {
//   //     console.error("❌ Failed to start break:", err?.response?.data || err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const startBreak = async (selectedBreak) => {
//   if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//   try {
//     setLoading(true);

//     const token = localStorage.getItem('token');
//     if (!token) throw new Error("Missing token");

//     const headers = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };

//     const payload = {
//       employeeId: employee._id,
//       duration: selectedBreak.duration
//     };

//     const response = await API.post('/hours/break/start', payload, headers);

//     // Optional: log server response for debugging
//     console.log("✅ Break started:", response.data);

//     setInBreak(true);
//     setBreakCount(prev => prev + 1);
//     setBreakTimeLeft(selectedBreak.duration);

//     const timer = setInterval(() => {
//       setBreakTimeLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(breakTimerRef.current);
//           breakTimerRef.current = null;
//           endBreak(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     breakTimerRef.current = timer;
//   } catch (err) {
//     console.error("❌ Failed to start break:", err?.response?.data || err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id || !inBreak) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Missing token");

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/break/end', { employeeId: employee._id }, headers);

//       await fetchTodayStats(); 
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       alert(auto
//         ? "⏱️ Your break ended automatically after the set duration."
//         : "🕐 Break ended. Get back to work!");
//     } catch (err) {
//       console.error("❌ Failed to end break:", err?.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTodayStats();

//     return () => {
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id]);

//   return {
//     workedHours,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats,
//     breaksToday 
//   };
// }

//==========================
// import { useState, useEffect, useRef } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);
//   const [breaksToday, setBreaksToday] = useState([]);
//   const [totalBreakTimeToday, setTotalBreakTimeToday] = useState('00:00:00');
//   const breakTimerRef = useRef(null);

//   const fetchTodayStats = async () => {
//     if (!employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Missing token");

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${employee._id}`, headers);

//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//       setTotalBreakTimeToday(res.data.totalBreakTimeToday || '00:00:00');
//       setBreaksToday(res.data.breaks || []);
//     } catch (err) {
//       console.error("Failed to fetch today's stats:", err);
//     }
//   };

//   const startBreak = async (selectedBreak) => {
//     if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//     try {
//       setLoading(true);

//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Missing token");

//       const headers = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       };

//       const payload = {
//         employeeId: employee._id,
//         duration: selectedBreak.duration
//       };

//       const response = await API.post('/hours/break/start', payload, headers);
//       console.log("✅ Break started:", response.data);

//       setInBreak(true);
//       setBreakCount(prev => prev + 1);
//       setBreakTimeLeft(selectedBreak.duration);

//       const timer = setInterval(() => {
//         setBreakTimeLeft(prev => {
//           if (prev <= 1) {
//             clearInterval(breakTimerRef.current);
//             breakTimerRef.current = null;
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       breakTimerRef.current = timer;
//     } catch (err) {
//       console.error("❌ Failed to start break:", err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id || !inBreak) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error("Missing token");

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/break/end', { employeeId: employee._id }, headers);

//       await fetchTodayStats();
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       alert(auto
//         ? "⏱️ Your break ended automatically after the set duration."
//         : "🕐 Break ended. Get back to work!");
//     } catch (err) {
//       console.error("❌ Failed to end break:", err?.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTodayStats();
//     return () => {
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id]);

//   return {
//     workedHours,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats,
//     breaksToday,
//     totalBreakTimeToday // exported
//   };
// }

//=========================

// useBreakTimer.js
// import { useState, useEffect, useRef } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);
//   const [breaksToday, setBreaksToday] = useState([]);
//   const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0); // Store in seconds
//   const breakTimerRef = useRef(null);

//   // const fetchTodayStats = async () => {
//   //   if (!employee?._id) {
//   //     console.error('No employee ID provided');
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error('Missing token');

//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const res = await API.get(`/hours/today/${employee._id}`, headers);
//   //     console.log('API response:', res.data); // Debug API response

//   //     // Parse totalBreakTimeToday (e.g., '00:01:29' to seconds)
//   //     const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//   //       ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//   //       : 0;

//   //     setWorkedHours(res.data.workedHoursToday || 0);
//   //     setBreakCount(res.data.totalBreaksToday || 0);
//   //     setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//   //     setTotalBreakTimeToday(totalBreakTimeSeconds);
//   //   } catch (err) {
//   //     console.error("Failed to fetch today's stats:", err);
//   //     setBreaksToday([]);
//   //     setBreakCount(0);
//   //     setTotalBreakTimeToday(0);
//   //   }
//   // };

//   // Helper function to parse HH:mm:ss to seconds



//   const fetchTodayStats = async () => {
//   const empId = employee?._id || localStorage.getItem("employeeId");

//   if (!empId) {
//     console.error('No employee ID found');
//     return;
//   }

//   try {
//     const token = localStorage.getItem('token');
//     if (!token) throw new Error('Missing token');

//     const headers = { headers: { Authorization: `Bearer ${token}` } };
//     const res = await API.get(`/hours/today/${empId}`, headers);
//     console.log('API response:', res.data);

//     const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//       ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//       : 0;

//     setWorkedHours(res.data.workedHoursToday || 0);
//     setBreakCount(res.data.totalBreaksToday || 0);
//     setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//     setTotalBreakTimeToday(totalBreakTimeSeconds);
//   } catch (err) {
//     console.error("Failed to fetch today's stats:", err);
//     setBreaksToday([]);
//     setBreakCount(0);
//     setTotalBreakTimeToday(0);
//   }
// };


//   const parseTimeToSeconds = (timeStr) => {
//     if (!timeStr || typeof timeStr !== 'string') return 0;
//     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//     return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
//   };

//   const startBreak = async (selectedBreak) => {
//     if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       };

//       const payload = {
//         employeeId: employee._id,
//         duration: selectedBreak.duration,
//         start: new Date().toISOString(), // Ensure start time is sent
//       };

//       const response = await API.post('/hours/break/start', payload, headers);
//       console.log('✅ Break started:', response.data);

//       setInBreak(true);
//       setBreakCount((prev) => prev + 1);
//       setBreakTimeLeft(selectedBreak.duration);
//       setBreaksToday((prev) => [...prev, response.data]); // Add new break to array

//       const timer = setInterval(() => {
//         setBreakTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(breakTimerRef.current);
//             breakTimerRef.current = null;
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       breakTimerRef.current = timer;
//     } catch (err) {
//       console.error('❌ Failed to start break:', err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id || !inBreak) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await API.post(
//         '/hours/break/end',
//         { employeeId: employee._id, end: new Date().toISOString() },
//         headers
//       );
//       console.log('✅ Break ended:', response.data);

//       await fetchTodayStats(); // Refresh stats after ending break
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       alert(
//         auto
//           ? '⏱️ Your break ended automatically after the set duration.'
//           : '🕐 Break ended. Get back to work!'
//       );
//     } catch (err) {
//       console.error('❌ Failed to end break:', err?.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     fetchTodayStats();
//     return () => {
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id]);

//   return {
//     workedHours,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats,
//     breaks: breaksToday, // Map breaksToday to breaks
//     totalBreakTimeToday,
//     employeeId: employee?._id,
//   };
// }

//=================

// import { useState, useEffect, useRef } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);
//   const [breaksToday, setBreaksToday] = useState([]);
//   const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0); // Store in seconds
//   const breakTimerRef = useRef(null);

//   const fetchTodayStats = async () => {
//     const empId = employee?._id || localStorage.getItem("employeeId");

//     if (!empId) {
//       console.error('No employee ID found');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${empId}`, headers);
//       console.log('API response:', res.data);

//       const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//         ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//         : 0;

//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//       setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//       setTotalBreakTimeToday(totalBreakTimeSeconds);
//     } catch (err) {
//       console.error("Failed to fetch today's stats:", err);
//       setBreaksToday([]);
//       setBreakCount(0);
//       setTotalBreakTimeToday(0);
//     }
//   };

//   const parseTimeToSeconds = (timeStr) => {
//     if (!timeStr || typeof timeStr !== 'string') return 0;
//     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//     return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
//   };

//   const startBreak = async (selectedBreak) => {
//     if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       };

//       const payload = {
//         employeeId: employee._id,
//         duration: selectedBreak.duration,
//         start: new Date().toISOString(),
//         type: selectedBreak.type, // Include break type in payload
//       };

//       const response = await API.post('/hours/break/start', payload, headers);
//       console.log('✅ Break started:', response.data);

//       setInBreak(true);
//       setBreakCount((prev) => prev + 1);
//       setBreakTimeLeft(selectedBreak.duration);
//       setBreaksToday((prev) => [...prev, response.data]);

//       const timer = setInterval(() => {
//         setBreakTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(breakTimerRef.current);
//             breakTimerRef.current = null;
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       breakTimerRef.current = timer;
//     } catch (err) {
//       console.error('❌ Failed to start break:', err?.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id || !inBreak) return;

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const response = await API.post(
//         '/hours/break/end',
//         { employeeId: employee._id, end: new Date().toISOString() },
//         headers
//       );
//       console.log('✅ Break ended:', response.data);

//       await fetchTodayStats();
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       if (!auto) {
//         alert('🕐 Break ended. Get back to work!');
//       }
//     } catch (err) {
//       console.error('❌ Failed to end break:', err?.response?.data || err.message);
//       if (!auto) {
//         alert('❌ Failed to end break: ' + (err?.response?.data?.message || err.message));
//       }
//     }
//   };

//   useEffect(() => {
//     fetchTodayStats();
//     return () => {
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id]);

//   return {
//     workedHours,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats,
//     breaks: breaksToday,
//     totalBreakTimeToday,
//     employeeId: employee?._id,
//   };
// }

//==================
// import { useState, useEffect, useRef } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);
//   const [breaksToday, setBreaksToday] = useState([]);
//   const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0); // Store in seconds
//   const breakTimerRef = useRef(null);
//   const [totalWorkedWithBreak, setTotalWorkedWithBreak] = useState(0);

//   // const fetchTodayStats = async () => {
//   //   const empId = employee?._id || localStorage.getItem("employeeId");

//   //   if (!empId) {
//   //     console.error('No employee ID found');
//   //     return;
//   //   }

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error('Missing token');

//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const res = await API.get(`/hours/today/${empId}`, headers);
//   //     console.log('API response:', res.data);

//   //     const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//   //       ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//   //       : 0;

//   //     setWorkedHours(res.data.workedHoursToday || 0);
//   //     setBreakCount(res.data.totalBreaksToday || 0);
//   //     setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//   //     setTotalBreakTimeToday(totalBreakTimeSeconds);
//   //   } catch (err) {
//   //     console.error("Failed to fetch today's stats:", err);
//   //     setBreaksToday([]);
//   //     setBreakCount(0);
//   //     setTotalBreakTimeToday(0);
//   //   }
//   // };




//   //   const fetchTodayStats = async () => {
//   //   const empId = employee?._id || localStorage.getItem("employeeId");
//   //   if (!empId) return;

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const res = await API.get(`/hours/today/${empId}`, headers);

//   //     const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//   //       ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//   //       : 0;

//   //     setWorkedHours(res.data.workedHoursToday || 0);
//   //     setBreakCount(res.data.totalBreaksToday || 0);
//   //     setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//   //     setTotalBreakTimeToday(totalBreakTimeSeconds);

//   //     // 👉 new state for total work including breaks
//   //     setTotalWorkedWithBreak(res.data.totalWorkedWithBreak || 0);
//   //   } catch (err) {
//   //     console.error("Failed to fetch today's stats:", err);
//   //   }
//   // };



//   const fetchTodayStats = async () => {
//     const empId = employee?._id || localStorage.getItem("employeeId");
//     if (!empId) {
//       console.error('No employee ID found');
//       return { error: 'No employee ID found' };
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${empId}`, headers);

//       const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//         ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//         : 0;

//       // Update all relevant states
//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//       setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//       setTotalBreakTimeToday(totalBreakTimeSeconds);
//       setTotalWorkedWithBreak(res.data.totalWorkedWithBreak || 0);

//       return { success: true, data: res.data };
//     } catch (err) {
//       console.error("Failed to fetch today's stats:", err);
//       setBreaksToday([]);
//       setBreakCount(0);
//       setTotalBreakTimeToday(0);
//       return { error: err.message || 'Failed to fetch data' };
//     } finally {
//       setLoading(false);
//     }
//   };




//   const parseTimeToSeconds = (timeStr) => {
//     if (!timeStr || typeof timeStr !== 'string') return 0;
//     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//     return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
//   };

//   // const startBreak = async (selectedBreak) => {
//   //   if (!employee?._id || inBreak || !selectedBreak?.duration) return;

//   //   try {
//   //     setLoading(true);
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error('Missing token');

//   //     const headers = {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         'Content-Type': 'application/json',
//   //       },
//   //     };

//   //     const payload = {
//   //       employeeId: employee._id,
//   //       duration: selectedBreak.duration,
//   //       start: new Date().toISOString(),
//   //       type: selectedBreak.type, // Include break type in payload
//   //     };

//   //     const response = await API.post('/hours/break/start', payload, headers);
//   //     console.log('✅ Break started:', response.data);

//   //     setInBreak(true);
//   //     setBreakCount((prev) => prev + 1);
//   //     setBreakTimeLeft(selectedBreak.duration);
//   //     setBreaksToday((prev) => [...prev, response.data]);

//   //     const timer = setInterval(() => {
//   //       setBreakTimeLeft((prev) => {
//   //         if (prev <= 1) {
//   //           clearInterval(breakTimerRef.current);
//   //           breakTimerRef.current = null;
//   //           endBreak(true);
//   //           return 0;
//   //         }
//   //         return prev - 1;
//   //       });
//   //     }, 1000);

//   //     breakTimerRef.current = timer;
//   //   } catch (err) {
//   //     console.error('❌ Failed to start break:', err?.response?.data || err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const endBreak = async (auto = false) => {
//   //   if (!employee?._id || !inBreak) return;

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error('Missing token');

//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const response = await API.post(
//   //       '/hours/break/end',
//   //       { employeeId: employee._id, end: new Date().toISOString() },
//   //       headers
//   //     );
//   //     console.log('✅ Break ended:', response.data);

//   //     await fetchTodayStats();
//   //     setInBreak(false);
//   //     setBreakTimeLeft(0);

//   //     if (breakTimerRef.current) {
//   //       clearInterval(breakTimerRef.current);
//   //       breakTimerRef.current = null;
//   //     }

//   //     if (!auto) {
//   //       alert('🕐 Break ended. Get back to work!');
//   //     }
//   //   } catch (err) {
//   //     console.error('❌ Failed to end break:', err?.response?.data || err.message);
//   //     if (!auto) {
//   //       alert('❌ Failed to end break: ' + (err?.response?.data?.message || err.message));
//   //     }
//   //   }
//   // };


//   const startBreak = async (selectedBreak) => {
//     if (!employee?._id || inBreak || !selectedBreak?.duration) {
//       return { error: 'Invalid break request' };
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       };

//       const payload = {
//         employeeId: employee._id,
//         duration: selectedBreak.duration,
//         start: new Date().toISOString(),
//         type: selectedBreak.type,
//       };

//       const response = await API.post('/hours/break/start', payload, headers);

//       // Update local state immediately
//       setInBreak(true);
//       setBreakCount((prev) => prev + 1);
//       setBreakTimeLeft(selectedBreak.duration);
//       setBreaksToday((prev) => [...prev, response.data]);

//       // Start countdown timer
//       const timer = setInterval(() => {
//         setBreakTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(breakTimerRef.current);
//             breakTimerRef.current = null;
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       breakTimerRef.current = timer;

//       // Refresh all data from server
//       await fetchTodayStats();

//       return { success: true, data: response.data };
//     } catch (err) {
//       console.error('Failed to start break:', err);
//       return { error: err?.response?.data?.message || err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!employee?._id || !inBreak) {
//       return { error: 'Invalid break end request' };
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const endTime = new Date().toISOString();

//       const response = await API.post(
//         '/hours/break/end',
//         { employeeId: employee._id, end: endTime },
//         headers
//       );

//       // Update local state immediately
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       // Refresh all data from server
//       await fetchTodayStats();

//       if (!auto) {
//         return {
//           success: true,
//           message: 'Break ended successfully',
//           data: response.data
//         };
//       }

//       return { success: true, data: response.data };
//     } catch (err) {
//       console.error('Failed to end break:', err);
//       return { error: err?.response?.data?.message || err.message };
//     }
//   };


//   // const endBreak = async (auto = false) => {
//   //   if (!employee?._id || !inBreak) return;

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) throw new Error('Missing token');

//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const endTime = new Date().toISOString();
//   //     const response = await API.post(
//   //       '/hours/break/end',
//   //       { employeeId: employee._id, end: endTime },
//   //       headers
//   //     );
//   //     console.log('✅ Break ended:', response.data);

//   //     // Calculate break duration and update local state immediately
//   //     if (response.data?.break) {
//   //       const breakStart = new Date(response.data.break.start);
//   //       const breakEnd = new Date(response.data.break.end || endTime);
//   //       const breakDurationSeconds = (breakEnd - breakStart) / 1000;
//   //       setTotalWorkedWithBreak(prev => prev + (breakDurationSeconds / 3600));
//   //     }

//   //     await fetchTodayStats(); // Get authoritative values from server
//   //     setInBreak(false);
//   //     setBreakTimeLeft(0);

//   //     if (breakTimerRef.current) {
//   //       clearInterval(breakTimerRef.current);
//   //       breakTimerRef.current = null;
//   //     }

//   //     if (!auto) {
//   //       alert('🕐 Break ended. Get back to work!');
//   //     }
//   //   } catch (err) {
//   //     console.error('❌ Failed to end break:', err?.response?.data || err.message);
//   //     if (!auto) {
//   //       alert('❌ Failed to end break: ' + (err?.response?.data?.message || err.message));
//   //     }
//   //   }
//   // };



//   // useEffect(() => {
//   //   fetchTodayStats();
//   //   return () => {
//   //     if (breakTimerRef.current) {
//   //       clearInterval(breakTimerRef.current);
//   //       breakTimerRef.current = null;
//   //     }
//   //   };
//   // }, [employee?._id]);

//   //   useEffect(() => {
//   //   fetchTodayStats();

//   //   // 🔁 auto refresh every 15 minutes (900000 ms)
//   //   const interval = setInterval(() => {
//   //     fetchTodayStats();
//   //   }, 15 * 60 * 1000);

//   //   return () => {
//   //     clearInterval(interval);
//   //     if (breakTimerRef.current) {
//   //       clearInterval(breakTimerRef.current);
//   //       breakTimerRef.current = null;
//   //     }
//   //   };
//   // }, [employee?._id]);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isMounted) {
//         await fetchTodayStats();
//       }
//     };

//     // Initial fetch
//     fetchData();

//     // Auto refresh every 5 minutes (300000 ms) - more frequent than before
//     const interval = setInterval(fetchData, 5 * 60 * 1000);

//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id]);



//   return {
//     // workedHours,
//     // totalWorkedWithBreak,  // 👈 added
//     // breakCount,
//     // inBreak,
//     // breakTimeLeft,
//     // loading,
//     // startBreak,
//     // endBreak,
//     // fetchTodayStats,
//     // breaks: breaksToday,
//     // totalBreakTimeToday,
//     // employeeId: employee?._id,

//      workedHours,
//   totalWorkedWithBreak,
//   breakCount,
//   inBreak,
//   breakTimeLeft,
//   loading,
//   startBreak,
//   endBreak,
//   fetchTodayStats,
//   breaks: breaksToday,
//   totalBreakTimeToday,
//   employeeId: employee?._id,
//   // Additional status flags if needed
//   isRefreshing: loading, // You might want to separate this
//   };
// }



//=====================correct below code=====

// import { useState, useEffect, useRef, useCallback } from 'react';
// import API from '../api';

// export default function useBreakTimer(employee) {
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const [loading, setLoading] = useState(false);
//   const [breaksToday, setBreaksToday] = useState([]);
//   const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0);
//   const [totalWorkedWithBreak, setTotalWorkedWithBreak] = useState(0);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const breakTimerRef = useRef(null);

//   const parseTimeToSeconds = useCallback((timeStr) => {
//     if (!timeStr || typeof timeStr !== 'string') return 0;
//     const [hours, minutes, seconds] = timeStr.split(':').map(Number);
//     return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
//   }, []);

//   const fetchTodayStats = useCallback(async () => {
//     const empId = employee?._id || localStorage.getItem("employeeId");
//     if (!empId) {
//       console.error('No employee ID found');
//       return { error: 'No employee ID found' };
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${empId}`, headers);

//       const totalBreakTimeSeconds = res.data.totalBreakTimeToday
//         ? parseTimeToSeconds(res.data.totalBreakTimeToday)
//         : 0;

//       // Update all relevant states
//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//       setBreaksToday(Array.isArray(res.data.breaks) ? res.data.breaks : []);
//       setTotalBreakTimeToday(totalBreakTimeSeconds);
//       setTotalWorkedWithBreak(res.data.totalWorkedWithBreak || 0);
//       setLastUpdated(new Date());

//       return { success: true, data: res.data };
//     } catch (err) {
//       console.error("Failed to fetch today's stats:", err);
//       setBreaksToday([]);
//       setBreakCount(0);
//       setTotalBreakTimeToday(0);
//       return { error: err.message || 'Failed to fetch data' };
//     } finally {
//       setLoading(false);
//     }
//   }, [employee?._id, parseTimeToSeconds]);

//   const startBreak = useCallback(async (selectedBreak) => {
//     if (!employee?._id || inBreak || !selectedBreak?.duration) {
//       return { error: 'Invalid break request' };
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       };

//       const payload = {
//         employeeId: employee._id,
//         duration: selectedBreak.duration,
//         start: new Date().toISOString(),
//         type: selectedBreak.type,
//       };

//       const response = await API.post('/hours/break/start', payload, headers);

//       // Update local state immediately
//       setInBreak(true);
//       setBreakCount((prev) => prev + 1);
//       setBreakTimeLeft(selectedBreak.duration);
//       setBreaksToday((prev) => [...prev, response.data]);

//       // Start countdown timer
//       const timer = setInterval(() => {
//         setBreakTimeLeft((prev) => {
//           if (prev <= 1) {
//             clearInterval(breakTimerRef.current);
//             breakTimerRef.current = null;
//             endBreak(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);

//       breakTimerRef.current = timer;

//       // Refresh all data from server
//       await fetchTodayStats();

//       return { success: true, data: response.data };
//     } catch (err) {
//       console.error('Failed to start break:', err);
//       return { error: err?.response?.data?.message || err.message };
//     } finally {
//       setLoading(false);
//     }
//   }, [employee?._id, inBreak, fetchTodayStats]);

//   const endBreak = useCallback(async (auto = false) => {
//     if (!employee?._id || !inBreak) {
//       return { error: 'Invalid break end request' };
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('Missing token');

//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const endTime = new Date().toISOString();

//       const response = await API.post(
//         '/hours/break/end',
//         { employeeId: employee._id, end: endTime },
//         headers
//       );

//       // Update local state immediately
//       setInBreak(false);
//       setBreakTimeLeft(0);

//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }

//       // Refresh all data from server
//       await fetchTodayStats();

//       if (!auto) {
//         return {
//           success: true,
//           message: 'Break ended successfully',
//           data: response.data
//         };
//       }

//       return { success: true, data: response.data };
//     } catch (err) {
//       console.error('Failed to end break:', err);
//       return { error: err?.response?.data?.message || err.message };
//     }
//   }, [employee?._id, inBreak, fetchTodayStats]);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isMounted) {
//         await fetchTodayStats();
//       }
//     };

//     // Initial fetch
//     fetchData();

//     // Auto refresh every 5 minutes (300000 ms)
//     const interval = setInterval(fetchData, 5 * 60 * 1000);

//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//       if (breakTimerRef.current) {
//         clearInterval(breakTimerRef.current);
//         breakTimerRef.current = null;
//       }
//     };
//   }, [employee?._id, fetchTodayStats]);

//   return {
//     workedHours,
//     totalWorkedWithBreak,
//     breakCount,
//     inBreak,
//     breakTimeLeft,
//     loading,
//     startBreak,
//     endBreak,
//     fetchTodayStats,
//     breaks: breaksToday,
//     totalBreakTimeToday,
//     employeeId: employee?._id,
//     lastUpdated,
//   };
// }

//-------------------grok--------------


import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../api';

export default function useBreakTimer(employee) {
  const [workedHours, setWorkedHours] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [inBreak, setInBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0); // Real-time duration of current break
  const [loading, setLoading] = useState(false);
  const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0);
  const [totalWorkedWithBreak, setTotalWorkedWithBreak] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const breakTimerRef = useRef(null);

  const parseTimeToSeconds = useCallback((timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }, []);

  const fetchTodayStats = useCallback(async () => {
    const empId = employee?._id || localStorage.getItem("employeeId");
    if (!empId) {
      console.error('No employee ID found');
      return { error: 'No employee ID found' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const res = await API.get(`/hours/today/${empId}`, headers);

      const totalBreakTimeSeconds = res.data.totalBreakTimeToday
        ? parseTimeToSeconds(res.data.totalBreakTimeToday)
        : 0;

      setWorkedHours(res.data.workedHoursToday || 0);
      setBreakCount(res.data.totalBreaksToday || 0);
      setInBreak(res.data.isOnBreak || false);
      setTotalBreakTimeToday(totalBreakTimeSeconds);
      setTotalWorkedWithBreak(res.data.totalWorkedWithBreak || 0);
      setAttendanceStatus(res.data.attendanceStatus || 'present');
      setLastUpdated(new Date());

      if (res.data.isOnBreak && res.data.breaks?.length > 0) {
        const activeBreak = res.data.breaks.find(b => !b.end);
        if (activeBreak && activeBreak.start) {
          const startTime = new Date(activeBreak.start);
          const currentTime = new Date();
          setBreakDuration(Math.floor((currentTime - startTime) / 1000));
        }
      } else {
        setBreakDuration(0);
      }

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Failed to fetch today's stats:", err);
      setBreakCount(0);
      setTotalBreakTimeToday(0);
      setBreakDuration(0);
      return { error: err.message || 'Failed to fetch data' };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, parseTimeToSeconds]);

  const startBreak = useCallback(async () => {
    if (!employee?._id) {
      return { error: 'Invalid break request' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const payload = {
        employeeId: employee._id,
      };

      const response = await API.post('/hours/break/start', payload, headers);

      setInBreak(true);
      setBreakCount((prev) => prev + 1);
      setBreakDuration(0);

      await fetchTodayStats();

      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to start break:', err);
      return { error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, fetchTodayStats]);

  const endBreak = useCallback(async () => {
    if (!employee?._id || !inBreak) {
      return { error: 'Invalid break end request' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.post(
        '/hours/break/end',
        { employeeId: employee._id },
        headers
      );

      setInBreak(false);
      setBreakDuration(0);

      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }

      await fetchTodayStats();

      return {
        success: true,
        message: 'Break ended successfully',
        data: response.data
      };
    } catch (err) {
      console.error('Failed to end break:', err);
      return { error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, inBreak, fetchTodayStats]);

  // Auto-end break if total exceeds limits
  useEffect(() => {
    if (inBreak && totalBreakTimeToday + breakDuration > 90 * 60) {
      endBreak(); // Auto-end if total exceeds 90 minutes
      setAttendanceStatus('absent');
    } else if (inBreak && totalBreakTimeToday + breakDuration > 70 * 60) {
      endBreak(); // Auto-end if total exceeds 70 minutes
      setAttendanceStatus('half-day');
    }
  }, [inBreak, breakDuration, totalBreakTimeToday, endBreak]);

  // Real-time break duration update
  useEffect(() => {
    if (inBreak) {
      breakTimerRef.current = setInterval(() => {
        setBreakDuration((prev) => prev + 1);
      }, 1000);
    } else if (breakTimerRef.current) {
      clearInterval(breakTimerRef.current);
      breakTimerRef.current = null;
    }

    return () => {
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
    };
  }, [inBreak]);

  // Periodic stats refresh
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchTodayStats();
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
    };
  }, [fetchTodayStats]);

  return {
    workedHours,
    totalWorkedWithBreak,
    breakCount,
    inBreak,
    breakDuration,
    loading,
    startBreak,
    endBreak,
    fetchTodayStats,
    totalBreakTimeToday,
    attendanceStatus,
    employeeId: employee?._id,
    lastUpdated,
  };
}



