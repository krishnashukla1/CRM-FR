
// ======================================it is proper working


// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate, Routes, Route, Link } from 'react-router-dom';
// import API from '../api';
// import Modal from 'react-modal';
// import dayjs from 'dayjs';
// import CallInquiryForm from './CallInquiryForm';
// import Clock from '../components/Timer';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// Modal.setAppElement('#root');

// const UserDashboard = () => {
//   const navigate = useNavigate();

//   // State declarations
//   const [user, setUser] = useState(null);
//   const [employee, setEmployee] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [performance, setPerformance] = useState(null);
//   const [remainingLeaves, setRemainingLeaves] = useState(0);
//   const [topPerformers, setTopPerformers] = useState([]);
//   const [workedHours, setWorkedHours] = useState(0);
//   const [breakCount, setBreakCount] = useState(0);
//   const [inBreak, setInBreak] = useState(false);
//   const [breakTimer, setBreakTimer] = useState(null);
//   const [breakTimeLeft, setBreakTimeLeft] = useState(300);
//   const TOTAL_ANNUAL_LEAVES = 6;

//   const [salaryInfo, setSalaryInfo] = useState(null);
//   const [salaryError, setSalaryError] = useState('');
//   const [loading, setLoading] = useState(true);

//   // Modal states
//   const [showModal, setShowModal] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [logoutMessage, setLogoutMessage] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const TOTAL_WORKING_DAYS = 30;
//   const presentDays = salaryInfo?.presentDays || 0;
//   const perDaySalary = Number(salaryInfo?.perDaySalary || 0);
//   const calculatedSalary = (presentDays * perDaySalary).toFixed(1);
//   const absentDays = TOTAL_WORKING_DAYS - presentDays;

//   const employeeId = localStorage.getItem('userId');

//   // Leave form state
//   const [leaveForm, setLeaveForm] = useState({
//     from: '',
//     to: '',
//     reason: '',
//     document: null,
//     leaveType: 'Paid Leave',
//   });

//   // Check session on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       handleSessionExpired();
//       return;
//     }

//     const fetchInitialData = async () => {
//       try {
//         await fetchUserData();
//         await fetchTopPerformers();
//       } catch (error) {
//         console.error('Initial data fetch failed:', error);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           handleSessionExpired();
//         }
//       }
//     };

//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (employee?._id && !localStorage.getItem("attendanceChecked")) {
//       checkAttendance();
//       markLogin();
//       fetchTodayStats();
//       fetchLeaves();
//       localStorage.setItem("attendanceChecked", "true");
//     }
//   }, [employee]);

//   const handleSessionExpired = () => {
//     setTimeout(() => {
//       alert('Session expired. Please login again.');
//       localStorage.clear();
//       navigate('/login');
//     }, 300);
//   };

//   const verifyToken = () => {
//     const token = localStorage.getItem('token');
//     if (!token || token === 'undefined') {
//       handleSessionExpired();
//       return false;
//     }
//     return true;
//   };

//   const checkAttendance = async () => {
//     const token = localStorage.getItem('token');
//     if (!token || !employee?._id) return;

//     try {
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get('/attendance/today', headers);

//       if (!res.data.marked) {
//         setModalMessage('Please mark your attendance for today');
//         setShowModal(true);
//       }
//     } catch (err) {
//       console.error('Attendance check failed:', err);

//       if (err.response?.status === 401 || err.response?.status === 403) {
//         setModalMessage('Session expired. Please login again.');
//         setShowModal(true);
//       } else {
//         setModalMessage('Unable to verify attendance. Please try again.');
//         setShowModal(true);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!employee || !employee._id) return;

//     const fetchSalary = async () => {
//       try {
//         const month = new Date().toISOString().slice(0, 7);
//         const res = await API.get(`/employees/salary/${employee._id}/${month}`);
//         setSalaryInfo(res.data);
//       } catch (err) {
//         console.error('Error fetching salary:', err);
//         setSalaryError('❌ Failed to load salary details.');
//       }
//     };

//     fetchSalary();
//   }, [employee]);

//   const fetchUserData = async () => {
//     setLoading(true);
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };

//       const profileRes = await API.get('/user/profile', headers);
//       const userData = profileRes.data;
//       setUser(userData);

//       const employeesRes = await API.get('/employees', headers);
//       const employeeData = employeesRes.data.data.find(emp =>
//         emp.email === userData.email || emp.userId === userData._id
//       );

//       if (!employeeData) {
//         console.error("No employee found for user:", userData.email);
//         setModalMessage('Your employee record is missing. Contact HR.');
//         setShowModal(true);
//         return;
//       }

//       setEmployee(employeeData);
//       const empId = employeeData._id;

//       const [attRes, leaveRes, perfRes] = await Promise.all([
//         API.get(`/attendance?employeeId=${empId}&perPage=50`, headers),
//         API.get(`/leaves?employeeId=${empId}`, headers),
//         // API.get(`/performance/user/${empId}`, headers),
//         API.get(`/performance/employee/${empId}`, headers),
//         // API.get(`/performance/employee/${userId}`, headers),


//       ]);

//       setAttendance(attRes.data.data || []);
//       setLeaves(leaveRes.data.data || []);
//       setPerformance(perfRes.data.summary);

//       const approvedLeaves = leaveRes.data.data.filter(l =>
//         l.status === 'Approved' || l.status === 'Paid Leave'
//       );

//       const validLeaves = approvedLeaves.filter(leave => {
//         const fromDate = new Date(leave.from);
//         const toDate = new Date(leave.to);
//         return fromDate.getDay() !== 0 && toDate.getDay() !== 0;
//       });

//       setRemainingLeaves(TOTAL_ANNUAL_LEAVES - validLeaves.length);
//     } catch (err) {
//       console.error('User data fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert('Failed to load your data. Please refresh.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };




//   const fetchTopPerformers = async () => {
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       };
//       const res = await API.get('/performance/top', config);
//       setTopPerformers(res.data.data || []);
//     } catch (err) {
//       console.error('Failed to fetch top performers:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const fetchLeaves = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/leaves?employeeId=${employee._id}`, headers);

//       if (res.data && res.data.data) {
//         setLeaves(res.data.data);
//       } else {
//         setLeaves([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch leaves:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//       setLeaves([]);
//     }
//   };

//   const fetchTodayStats = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/hours/today/${employee._id}`, headers);
//       setWorkedHours(res.data.workedHoursToday || 0);
//       setBreakCount(res.data.totalBreaksToday || 0);
//     } catch (err) {
//       console.error('Stats fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const markLogin = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/login', { employeeId: employee._id }, headers);
//     } catch (err) {
//       console.error("Login time tracking failed:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   // const markLogout = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token');

//   //     if (token && employee?._id) {
//   //       const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //       await API.post('/hours/logout', { employeeId: employee._id }, headers);
//   //     }
//   //   } catch (err) {
//   //     console.error('Logout tracking failed:', err);
//   //   } finally {
//   //     setLogoutMessage('✅ You have successfully logged out.');
//   //     localStorage.removeItem('token');
//   //     localStorage.removeItem('attendanceChecked');
//   //     setTimeout(() => {
//   //       navigate('/login');
//   //     }, 2000);
//   //   }
//   // };




//   const markLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       if (token && employee?._id) {
//         const headers = { headers: { Authorization: `Bearer ${token}` } };
//         await API.post('/hours/logout', { employeeId: employee._id }, headers); // adjust route if needed
//       }
//     } catch (err) {
//       console.error('Logout tracking failed:', err);
//     } finally {
//       setLogoutMessage('✅ You have successfully logged out.');
//       localStorage.removeItem('token');
//       localStorage.removeItem('attendanceChecked');

//       setTimeout(() => {
//         navigate('/login'); // or navigate('/daily-report') if that’s the goal
//       }, 2000);
//     }
//   };


//   const startBreak = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     if (inBreak) {
//       alert("⏳ You're already on break!");
//       return;
//     }
//     if (breakCount >= 3) {
//       alert("❌ Max 3 breaks allowed today.");
//       return;
//     }

//     try {
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
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert(err.response?.data?.message || "Failed to start break. Try again.");
//       }
//     }
//   };

//   const endBreak = async (auto = false) => {
//     if (!verifyToken() || !employee?._id) return;

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
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert("Error ending break. Please try again.");
//       }
//     }
//   };

//   const submitLeave = async () => {
//     if (!leaveForm.from || !leaveForm.to) {
//       return alert("❗ Please select both From and To dates.");
//     }

//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('employeeId', employee._id);
//       formData.append('from', leaveForm.from);
//       formData.append('to', leaveForm.to);
//       formData.append('reason', leaveForm.reason);
//       formData.append('leaveType', leaveForm.leaveType || 'Paid Leave');

//       if (leaveForm.document) {
//         formData.append('document', leaveForm.document);
//       }

//       await API.post('/leaves', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       alert('✅ Leave request submitted successfully.');
//       setLeaveForm({ from: '', to: '', reason: '', document: null, leaveType: 'Paid Leave' });
//       fetchUserData();
//     } catch (err) {
//       console.error('Leave submission failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert('❌ Failed to submit leave. Try again.');
//       }
//     }
//   };

//   const markAttendance = async () => {
//     if (!verifyToken() || !employee?._id) return false;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/attendance/mark', { employeeId: employee._id }, headers);
//       return true;
//     } catch (err) {
//       console.error('Attendance marking failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         setModalMessage('Failed to mark attendance. Please try again.');
//         setShowModal(true);
//       }
//       return false;
//     }
//   };

//   const handleProceed = async () => {
//     if (!agree) {
//       setModalMessage('You must agree to mark attendance');
//       return;
//     }
//     const success = await markAttendance();
//     if (success) {
//       setShowModal(false);
//       fetchUserData();
//     }
//   };

//   const { approvedCount, rejectedCount, paidCount, sundayCount } = useMemo(() => {
//     const result = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       paidCount: 0,
//       sundayCount: 0
//     };

//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;

//       if (isSunday) {
//         result.sundayCount++;
//         return;
//       }

//       if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(prev => prev - 1);
//   };

//   return (

//     <div className={`transition-all duration-300 ${showModal ? 'blur-lg pointer-events-none select-none' : ''}`}>
//       {/* Mobile Sidebar Toggle */}
//       <div className="md:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="bg-[#72819a] text-white p-2 rounded-lg shadow-lg"
//         >
//           {sidebarOpen ? (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>
//       </div>

//       <div className="min-h-screen flex bg-gray-100">
//         {/* Top-right fixed clock */}

//         <Clock />

//         {/* Sidebar */}

//         <div className={`fixed md:relative z-40 md:z-0 w-64 h-20 min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

//           {employee?.photo && (
//             <img
//               src={
//                 employee.photo.startsWith('http')
//                   ? employee.photo
//                   : `https://crm-backend-f4lj.onrender.com/uploads/${employee.photo}`
//               }
//               alt="User"
//               className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
//             />
//           )}

//           <h2 className="text-xl font-bold text-center">{user?.name || 'Employee'}</h2>
//           <p className="text-sm text-center text-white/80">{user?.email || 'user@example.com'}</p>

//           {/* <div className="w-full mt-6 space-y-2 text-sm">
//             <p><span className="font-semibold">📌 Post:</span> {employee?.role || 'User'}</p>
//             <p><span className="font-semibold">🆔 Employee ID:</span> {employee?._id || 'N/A'}</p>
//             <p><span className="font-semibold">🎓 Role:</span> {user?.role || 'Employee'}</p>
//             <p><span className="font-semibold">🔑 User ID:</span> {user?._id || 'N/A'}</p>
//             <p>
//               <span className="font-semibold">📅 Date of Joining:</span>{' '}
//               {employee?.dateOfJoining
//                 ? new Date(employee.dateOfJoining).toLocaleDateString()
//                 : 'N/A'}
//             </p>
//           </div> */}

//           <div className="w-full mt-6 space-y-2 text-sm">
//             <p><span className="font-semibold">📌 Post:</span> {employee?.role || 'User'}</p>
//             <p><span className="font-semibold">🆔 Employee ID:</span> {employee?._id || 'N/A'}</p>
//             <p><span className="font-semibold">🎓 Role:</span> {user?.role || 'Employee'}</p>
//             <p><span className="font-semibold">🔑 User ID:</span> {user?._id || 'N/A'}</p>
//             <p><span className="font-semibold">📅 Date of Joining:</span> {employee?.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}</p>

//             <hr className="my-4 border-white/30" />

//             {/* Navigation Links */}
//             <ul className="space-y-2 text-sm font-semibold text-white">
//               {/* <li><a href="#top-performers" className="hover:text-yellow-300">🏆 Top 3 Performers</a></li>
//               <li><a href="#attendance" className="hover:text-yellow-300">📅 Attendance</a></li>
//               <li><a href="#leaves" className="hover:text-yellow-300">📝 Leaves</a></li>
//               <li><a href="#weekly-off" className="hover:text-yellow-300">📆 Weekly Off Roster</a></li>
//               <li><a href="#salary" className="hover:text-yellow-300">💰 Salary Details</a></li>
//               <li><a href="#new-leave" className="hover:text-yellow-300">➕ Request New Leave</a></li> */}

//             <Link to="/dashboard/top-performers" className="hover:text-yellow-300">🏆 Top 3 Performers</Link>
//             <Link to="/dashboard/attendance" className="hover:text-yellow-300">📅 Attendance</Link>
// <Link to="/dashboard/leaves" className="hover:text-yellow-300">📝 Leaves</Link>
// <Link to="/dashboard/top-performers" className="hover:text-yellow-300">🏆 Top 3 Performers</Link>
// <Link to="/dashboard/salary" className="hover:text-yellow-300">💰 Salary Details</Link>
// <Link to="/dashboard/request-leave" className="hover:text-yellow-300">➕ Request New Leave</Link>




//             </ul>



//           </div>

//          {/* <button
//             onClick={markLogout}
//             className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
//           >
//             Logout
//           </button> */}

//           <button
//             onClick={() => navigate('/daily-report')}
//             className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
//           >
//             Logout
//           </button>

//           {/* <div className="flex-1 p-4 md:p-8"></div>
//           <Routes>
//             <Route path="/logout" element={<Logout />} />
//             <Route path="/daily-report" element={<DailyReport />} />

//           </Routes> */}
//         </div>

//         {/* Main Content */}
//         <div className="w-full p-4 md:p-6 space-y-6">
//           <h1 className="text-center text-2xl md:text-3xl bg-gradient-to-r from-green-200 via-white to-green-200 inline-block px-4 py-2 rounded">
//             Welcome {user?.name || 'User'}
//           </h1>

//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">👤 Your Dashboard</h1>

//           {/* CALL LOG */}
//           <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mx-auto mb-6 md:mb-10">
//             <h1 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-700">📞 Log Customer Call Inquiry</h1>
//             <CallInquiryForm employeeId={employeeId} />
//           </div>


//           {/* Performance */}

//           <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-blue-600 mb-2">📊 Performance</h2>
//             <div id="top-performers" className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//               <h2 className="text-lg font-semibold text-purple-600 mb-4">🏆 Top 3 Performers</h2>
//               {topPerformers.length > 0 ? (
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   {[...topPerformers]
//                     .sort((a, b) => b.bestPerformance - a.bestPerformance)
//                     .slice(0, 3)
//                     .map((emp) => (
//                       <li key={emp._id} className="bg-purple-50 rounded-lg p-4 shadow text-center">
//                         <img
//                           src={
//                             emp.photo
//                               ? `https://crm-backend-f4lj.onrender.com/uploads/${emp.photo}`
//                               : 'https://cdn-icons-png.flaticon.com/512/219/219983.png'
//                           }
//                           alt={emp.name}
//                           className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-2 object-cover border-2 border-purple-400"
//                         />
//                         <p className="font-bold text-purple-800">{emp.name}</p>
//                         <p className="text-sm text-gray-600">💰 Sales: ${emp.sales.toLocaleString()}</p>
//                         <p className="text-sm text-gray-600">🎯 Target: ${emp.target.toLocaleString()}</p>
//                         <p className="text-sm text-green-600 font-medium">📈 Performance: {emp.bestPerformance.toFixed(1)}%</p>
//                       </li>
//                     ))}
//                 </ul>

//               ) : (
//                 <p className="text-gray-500">No top performer data found.</p>
//               )}
//             </div>
//           </div>

//           {/* Attendance */}

//           <div id="attendance" className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-green-700 mb-4">📅 Attendance</h2>

//             {attendance.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {attendance.map((a) => {
//                       const dateObj = new Date(a.date);
//                       const isSunday = dateObj.getDay() === 0;
//                       const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

//                       return (
//                         <tr key={a._id} className={isSunday ? 'bg-blue-50' : ''}>
//                           <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
//                             {dateObj.toLocaleDateString()}
//                           </td>
//                           <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
//                             {dayName}
//                           </td>
//                           <td className="px-4 py-2 whitespace-nowrap text-sm">
//                             <span className={isSunday ? 'text-blue-700 font-medium' : 'text-gray-800'}>
//                               {isSunday ? 'Weekly Off (Sunday)' : a.status}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-gray-500">No attendance records found.</p>
//             )}
//           </div>

//           {/* Leaves */}

//           <div id="leaves" className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-yellow-600 mb-4">📝 Leaves</h2>

//             {/* Summary counts */}
//             <div className="flex flex-wrap justify-center gap-3 text-sm mb-4">
//               <span>Total: <strong>{leaves.length || 0}</strong></span>
//               <span className="text-green-600">Approved: <strong>{approvedCount}</strong></span>
//               <span className="text-red-600">Rejected: <strong>{rejectedCount}</strong></span>
//               <span className="text-blue-600">Paid: <strong>{paidCount}</strong></span>
//               <span className="text-purple-600">Sundays: <strong>{sundayCount}</strong></span>
//             </div>

//             <p className="text-sm font-semibold text-gray-800 mb-2">
//               🧮 Remaining Leaves:
//               <span className="text-blue-700"> {remainingLeaves} </span> / {TOTAL_ANNUAL_LEAVES}
//               <span className="text-xs text-gray-500 ml-2">(Sundays not deducted)</span>
//             </p>

//             {/* Table View */}
//             {leaves.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border rounded overflow-hidden">
//                   <thead className="bg-gray-100 text-gray-700">
//                     <tr>
//                       <th className="px-4 py-2 border">#</th>
//                       <th className="px-4 py-2 border">Type</th>
//                       <th className="px-4 py-2 border">From</th>
//                       <th className="px-4 py-2 border">To</th>
//                       <th className="px-4 py-2 border">Days</th>
//                       <th className="px-4 py-2 border">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {leaves.map((l, index) => {
//                       if (!l || !l.from || !l.to) return null;

//                       const fromDate = new Date(l.from);
//                       const toDate = new Date(l.to);
//                       if (isNaN(fromDate.getTime())) return null;

//                       const dayCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//                       const isSunday = fromDate.getDay() === 0 && toDate.getDay() === 0;

//                       return (
//                         <tr
//                           key={l._id || `leave-${index}`}
//                           className={isSunday ? 'text-purple-600' : ''}
//                         >
//                           <td className="px-4 py-2 border">{index + 1}</td>
//                           <td className="px-4 py-2 border">{isSunday ? '🌞 Sunday' : '📅 Leave'}</td>
//                           <td className="px-4 py-2 border">{fromDate.toLocaleDateString()}</td>
//                           <td className="px-4 py-2 border">{toDate.toLocaleDateString()}</td>
//                           <td className="px-4 py-2 border">{dayCount}</td>
//                           <td className={`px-4 py-2 border font-semibold ${l.status === 'Approved' ? 'text-green-600' :
//                             l.status === 'Rejected' ? 'text-red-500' :
//                               l.status === 'Paid Leave' ? 'text-blue-600' :
//                                 'text-gray-600'
//                             }`}>
//                             {l.status || 'Pending'}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-gray-500 mt-4">No leave records found.</p>
//             )}
//           </div>

//           {/* Weekly Off Roster */}
//           <div id="weekly-off" className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//             <h2 className="text-lg font-semibold text-indigo-600 mb-2">📅 Weekly Off Roster</h2>
//             <p className="text-sm">{user?.name} — <strong className="text-blue-600">Sunday</strong></p>
//           </div>

//           {/* Break Info */}
//           <div className="bg-white p-4 rounded-xl shadow-md">
//             {workedHours < 9 && (
//               <p className="text-red-600 font-semibold text-sm md:text-base">
//                 ⏳ You worked {workedHours.toFixed(2)} hrs. Work {(9 - workedHours).toFixed(2)} hrs more today.
//               </p>
//             )}
//             {inBreak && (
//               <p className="text-orange-700 mt-2 text-sm md:text-base">
//                 Break time left: {Math.floor(breakTimeLeft / 60)}:{String(breakTimeLeft % 60).padStart(2, '0')} min
//               </p>
//             )}
//             {inBreak && (
//               <button
//                 onClick={() => endBreak(false)}
//                 className="mt-2 bg-red-500 text-white px-3 py-1 text-sm md:text-base md:px-4 rounded hover:bg-red-600 shadow"
//               >
//                 🛑 Stop Break
//               </button>
//             )}
//             <button
//               onClick={startBreak}
//               disabled={loading || inBreak || breakCount >= 3}
//               className={`mt-3 bg-yellow-400 text-black font-semibold px-3 py-1 text-sm md:text-base md:px-4 md:py-2 rounded hover:bg-yellow-500 shadow ${loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//             >
//               {loading ? 'Loading...' : `💤 Take Break (${breakCount}/3)`}
//             </button>
//           </div>

//           {logoutMessage && (
//             <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 md:px-6 md:py-3 rounded shadow-md z-50 text-xs md:text-sm font-medium transition duration-300">
//               {logoutMessage}
//             </div>
//           )}

//           {/* SALARY */}
//           <div id="salary" className="bg-white p-4 md:p-6 rounded-xl shadow-md">
//             <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-4 flex items-center justify-center gap-2 text-center">
//               💰 Salary Details
//             </h2>

//             {salaryError && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 md:px-4 md:py-2 rounded mb-4 text-xs md:text-sm text-center">
//                 {salaryError}
//               </div>
//             )}

//             {salaryInfo ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs md:text-sm text-gray-800">
//                 <div className="flex justify-between border-b pb-1">
//                   <span className="font-medium">👤 Name:</span>
//                   <span>{salaryInfo.name}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1">
//                   <span className="font-medium">📅 Month:</span>
//                   <span>{salaryInfo.month}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1">
//                   <span className="font-medium">📆 Total Working Days:</span>
//                   <span>{salaryInfo.totalWorkingDays}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1 text-green-700">
//                   <span className="font-medium">✅ Present Days:</span>
//                   <span>{salaryInfo.presentDays}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1 text-yellow-600">
//                   <span className="font-medium">🟩 Paid Leave Days:</span>
//                   <span>{salaryInfo.paidLeaveDays}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1 text-red-600">
//                   <span className="font-medium">🟥 LWP (Unpaid Leave Days):</span>
//                   <span>{salaryInfo.unpaidLeaveDays}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1 text-red-500">
//                   <span className="font-medium">🚫 Total Absent:</span>
//                   <span>{salaryInfo.totalAbsent}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1">
//                   <span className="font-medium">💰 Total Salary:</span>
//                   <span>${salaryInfo.totalSalary}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1">
//                   <span className="font-medium">📆 Per Day Salary:</span>
//                   <span>${parseFloat(salaryInfo.perDaySalary).toFixed(1)}</span>
//                 </div>
//                 <div className="flex justify-between border-b pb-1 font-semibold text-indigo-700">
//                   <span>🧮 Final Calculated Salary:</span>
//                   <span>${salaryInfo.calculatedSalary}</span>
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center text-xs md:text-sm">Loading salary details...</p>
//             )}
//           </div>



//           {/* LEAVE REQUEST FORM */}
//           <div id="new-leave" className="bg-white p-4 md:p-6 rounded-xl shadow-md mx-auto mb-6 md:mb-10">
//             <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-700">➕ Request New Leave</h2>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 value={leaveForm.from}
//                 onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
//               />
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 value={leaveForm.to}
//                 onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
//               />
//               <select
//                 className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm"
//                 value={leaveForm.leaveType}
//                 onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//               >
//                 <option value="Paid Leave">Paid Leave</option>
//                 <option value="Leave Without Pay">Leave Without Pay</option>
//               </select>
//               <input
//                 type="file"
//                 className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                 onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//               />
//             </div>

//             <textarea
//               placeholder="📝 Reason for Leave"
//               className="w-full border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 mb-3 md:mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs md:text-sm"
//               rows="3"
//               value={leaveForm.reason}
//               onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//             />

//             <button
//               onClick={submitLeave}
//               className="bg-indigo-600 text-white px-4 py-1 md:px-6 md:py-2 rounded-lg hover:bg-indigo-700 transition-all shadow text-sm md:text-base"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>


//       {/* Attendance Modal */}

//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto mt-24 bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//           <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
//             🕒 Mark Your Attendance
//           </h2>
//           <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
//             By continuing, you confirm that you are starting work and will aim to complete at least <strong>8 hours</strong> today.
//             <br />
//             <span className="text-red-500 font-medium block mt-1">
//               Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//             </span>
//           </p>

//           <label className="flex items-start gap-2 mb-3 md:mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-xs md:text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => {
//                 localStorage.clear();
//                 navigate('/login');
//               }}
//               className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
//             >
//               ❌ Cancel
//             </button>

//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
//                 }`}
//             >
//               ✅ Proceed to Dashboard
//             </button>
//           </div>
//         </div>
//       </Modal>


//     </div>
//   );
// };

// export default UserDashboard;


//--------------------------------

// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate, Routes, Route, Link, Outlet } from 'react-router-dom';
// import API from '../api';
// import Modal from 'react-modal';
// import dayjs from 'dayjs';
// import CallInquiryForm from './CallInquiryForm';
// import Clock from '../components/Timer';

// import TopPerformance from '../routes/TopPerformance';
// import Attendance from '../routes/Attendance';
// import BreakTime from '../routes/BreakTime';
// import Leaves from '../routes/Leaves';
// import RequestLeaves from '../routes/RequestLeave';
// import SalaryDetails from '../routes/SalaryDetails';
// import WeeklyOff from '../routes/WeeklyOff';
// import Sidebar from '../components2/Sidebar';
// import useBreakTimer from '../routes/useBreakTimer';
// import EmployeeTasks from '../routes/EmployeeTasks';


// Modal.setAppElement('#root');

// const UserDashboard = () => {
//   const navigate = useNavigate();

//   const [employee, setEmployee] = useState(null);
//   const [user, setUser] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [performance, setPerformance] = useState(null);
//   const [remainingLeaves, setRemainingLeaves] = useState(0);
//   const [topPerformers, setTopPerformers] = useState([]);
//   const breakTimer = useBreakTimer(employee);
//   const TOTAL_ANNUAL_LEAVES = 20;

//   const [salaryInfo, setSalaryInfo] = useState(null);
//   const [salaryError, setSalaryError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const TOTAL_WORKING_DAYS = 30;
//   const presentDays = salaryInfo?.presentDays || 0;
//   const perDaySalary = Number(salaryInfo?.perDaySalary || 0);
//   const calculatedSalary = (presentDays * perDaySalary).toFixed(1);
//   const absentDays = TOTAL_WORKING_DAYS - presentDays;

//   // const employeeId = localStorage.getItem('userId');
// const employeeId = localStorage.getItem('employeeId');

//   const [leaveForm, setLeaveForm] = useState({
//     from: '',
//     to: '',
//     reason: '',
//     document: null,
//     leaveType: 'Paid Leave',
//   });


// const fetchEmployeeIdByUserId = async () => {
//   try {
//     const userId = localStorage.getItem("userId"); // from login
//     const res = await API.get(`/employees/by-user/${userId}`);
//     if (res.data?.employee?._id) {
//       localStorage.setItem("employeeId", res.data.employee._id);
//       console.log("Employee ID stored:", res.data.employee._id);
//     } else {
//       console.log("Employee not found");
//     }
//   } catch (err) {
//     console.error("Error fetching employee ID", err);
//   }
// };
// useEffect(() => {
//   fetchEmployeeIdByUserId(); // Set employeeId to localStorage
// }, []);



//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       handleSessionExpired();
//       return;
//     }

//     const fetchInitialData = async () => {
//       try {
//         await fetchUserData();
//         await fetchTopPerformers();
//         // await fetchEmployeeInfo(); // 👈 This is the line to add

//       } catch (error) {
//         console.error('Initial data fetch failed:', error);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           handleSessionExpired();
//         }
//       }
//     };

//     fetchInitialData();
//   }, []);

//   useEffect(() => {
//     if (employee?._id && !localStorage.getItem("attendanceChecked")) {
//       checkAttendance();
//       markLogin();
//       fetchTodayStats();
//       fetchLeaves();
//       localStorage.setItem("attendanceChecked", "true");
//     }
//   }, [employee]);

//   const handleSessionExpired = () => {
//     setTimeout(() => {
//       alert('Session expired. Please login again.');
//       localStorage.clear();
//       navigate('/login');
//     }, 300);
//   };

//   const verifyToken = () => {
//     const token = localStorage.getItem('token');
//     if (!token || token === 'undefined') {
//       handleSessionExpired();
//       return false;
//     }
//     return true;
//   };

//   // const checkAttendance = async () => {
//   //   const token = localStorage.getItem('token');
//   //   if (!token || !employee?._id) return;

//   //   try {
//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const res = await API.get('/attendance/today', headers);

//   //     if (!res.data.marked) {
//   //       setModalMessage('Please mark your attendance for today');
//   //       setShowModal(true);
//   //     }
//   //   } catch (err) {
//   //     console.error('Attendance check failed:', err);
//   //     setModalMessage('Unable to verify attendance. Please try again.');
//   //     setShowModal(true);
//   //   }
//   // };

//   const checkAttendance = async () => {
//     const token = localStorage.getItem('token');
//     const storedEmployee = localStorage.getItem('employee');
//     const employee = storedEmployee ? JSON.parse(storedEmployee) : null;

//     if (!token || !employee?._id) {
//       console.warn('Missing token or employee data');
//       return;
//     }

//     try {
//       console.log('Token being sent:', token); // ✅ DEBUG
//       console.log('User ID:', employee._id); // ✅ DEBUG

//       const res = await API.get('/attendance/today', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       console.log('Attendance API response:', res.data); // ✅ DEBUG

//       if (!res.data?.marked) {
//         console.log("Attendance not marked — showing modal");
//         setModalMessage('Please mark your attendance for today');
//         setShowModal(true);
//       }
//     } catch (err) {
//       console.error('Attendance check failed:', err);
//       if (err.response?.status === 401) {
//         setModalMessage('Session expired or unauthorized. Please log in again.');
//       } else {
//         setModalMessage('Unable to verify attendance. Please try again.');
//       }
//       setShowModal(true);
//     }
//   };



//   useEffect(() => {
//     if (!employee || !employee._id) return;

//     const fetchSalary = async () => {
//       try {
//         const month = new Date().toISOString().slice(0, 7);
//         const res = await API.get(`/employees/salary/${employee._id}/${month}`);
//         setSalaryInfo(res.data);
//       } catch (err) {
//         console.error('Error fetching salary:', err);
//         setSalaryError('❌ Failed to load salary details.');
//       }
//     };

//     fetchSalary();
//   }, [employee]);

//   const fetchUserData = async () => {
//     setLoading(true);
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };

//       const profileRes = await API.get('/user/profile', headers);
//       const userData = profileRes.data;
//       setUser(userData);

//       const employeesRes = await API.get('/employees', headers);
//       const employeeData = employeesRes.data.data.find(emp =>
//         emp.email === userData.email || emp.userId === userData._id
//       );

//       if (!employeeData) {
//         console.error("No employee found for user:", userData.email);
//         setModalMessage('Your employee record is missing. Contact HR.');
//         setShowModal(true);
//         return;
//       }

//       setEmployee(employeeData);
//       const empId = employeeData._id;

//       const [attRes, leaveRes, perfRes] = await Promise.all([
//         API.get(`/attendance?employeeId=${empId}&perPage=50`, headers),
//         API.get(`/leaves?employeeId=${empId}`, headers),
//         API.get(`/performance/employee/${empId}`, headers),
//       ]);

//       setAttendance(attRes.data.data || []);
//       setLeaves(leaveRes.data.data || []);
//       setPerformance(perfRes.data.summary);

//       const approvedLeaves = leaveRes.data.data.filter(l =>
//         l.status === 'Approved' || l.status === 'Paid Leave'
//       );

//       const validLeaves = approvedLeaves.filter(leave => {
//         const fromDate = new Date(leave.from);
//         const toDate = new Date(leave.to);
//         return fromDate.getDay() !== 0 && toDate.getDay() !== 0;
//       });

//       setRemainingLeaves(TOTAL_ANNUAL_LEAVES - validLeaves.length);
//     } catch (err) {
//       console.error('User data fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert('Failed to load your data. Please refresh.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTopPerformers = async () => {
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const config = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get('/performance/top', config);
//       setTopPerformers(res.data.data || []);
//     } catch (err) {
//       console.error('Failed to fetch top performers:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const fetchLeaves = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       const res = await API.get(`/leaves?employeeId=${employee._id}`, headers);
//       setLeaves(res.data?.data || []);
//     } catch (err) {
//       console.error("Failed to fetch leaves:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//       setLeaves([]);
//     }
//   };

//   const fetchTodayStats = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.get(`/hours/today/${employee._id}`, headers);
//     } catch (err) {
//       console.error('Stats fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const markLogin = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };
//       await API.post('/hours/login', { employeeId: employee._id }, headers);
//     } catch (err) {
//       console.error("Login time tracking failed:", err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const submitLeave = async () => {
//     if (!leaveForm.from || !leaveForm.to) {
//       return alert("❗ Please select both From and To dates.");
//     }

//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('employeeId', employee._id);
//       formData.append('from', leaveForm.from);
//       formData.append('to', leaveForm.to);
//       formData.append('reason', leaveForm.reason);
//       formData.append('leaveType', leaveForm.leaveType || 'Paid Leave');

//       if (leaveForm.document) {
//         formData.append('document', leaveForm.document);
//       }

//       await API.post('/leaves', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       alert('✅ Leave request submitted successfully.');
//       setLeaveForm({ from: '', to: '', reason: '', document: null, leaveType: 'Paid Leave' });
//       fetchUserData();
//     } catch (err) {
//       console.error('Leave submission failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         alert('❌ Failed to submit leave. Try again.');
//       }
//     }
//   };

//   // const markAttendance = async () => {
//   //   if (!verifyToken() || !employee?._id) return false;

//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const headers = { headers: { Authorization: `Bearer ${token}` } };
//   //     const response = await API.post('/attendance/mark', { employeeId: employee._id }, headers);
//   //     console.log("Attendance response:", response.data);
//   //     const message = response?.data?.message || 'Attendance marked';
//   //     setModalMessage(message);     
//   //     setShowModal(true);       
//   //     return true;
//   //   } catch (err) {
//   //     console.error('Attendance marking failed:', err);
//   //     setModalMessage('Failed to mark attendance. Please try again.');
//   //     setShowModal(true);
//   //     return false;
//   //   }
//   // };

// const markAttendance = async () => {
//   if (!verifyToken() || !employee?._id) return false;

//   try {
//     const now = new Date();
//     const istOffset = 5.5 * 60 * 60 * 1000;
//     const istNow = new Date(now.getTime() + istOffset);
//     const istDate = istNow.toISOString().slice(0, 10); // YYYY-MM-DD (IST)

//     const token = localStorage.getItem('token');
//     const headers = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await API.post(
//       '/attendance/mark',
//       { employeeId: employee._id, date: istDate },
//       headers
//     );

//     console.log("Attendance response:", response.data);
//     setModalMessage(response?.data?.message || 'Attendance marked');
//     setShowModal(true);
//     return true;
//   } catch (err) {
//     console.error('Attendance marking failed:', err);
//     setModalMessage('Failed to mark attendance. Please try again.');
//     setShowModal(true);
//     return false;
//   }
// };

//   const handleProceed = async () => {
//     if (!agree) {
//       setModalMessage('You must agree to mark attendance');
//       setShowModal(true);
//       return;
//     }

//     const success = await markAttendance();
//     if (success) {
//       // Delay to show modal before redirect (optional)
//       setTimeout(() => {
//         setShowModal(false);
//         fetchUserData();
//       }, 1500);
//     }
//   };


//   const { approvedCount, rejectedCount, paidCount, sundayCount } = useMemo(() => {
//     const result = { approvedCount: 0, rejectedCount: 0, paidCount: 0, sundayCount: 0 };
//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;
//       if (isSunday) result.sundayCount++;
//       else if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`transition-all duration-300 ${showModal ? 'blur-lg pointer-events-none select-none' : ''}`}>
//       <div className="md:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="bg-[#72819a] text-white p-2 rounded-lg shadow-lg"
//         >
//           {sidebarOpen ? '❌' : '☰'}
//         </button>
//       </div>

//       <div className="min-h-screen flex bg-gray-100">
//         <Clock />
//         <Sidebar
//           user={user}
//           employee={employee}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         <div className="w-full p-4 md:p-6 space-y-6">
//           <h1 className="text-center text-2xl md:text-3xl bg-gradient-to-r from-green-200 via-white to-green-200 inline-block px-4 py-2 rounded">
//             Welcome {user?.name || 'User'}
//           </h1>

//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">👤 Your Dashboard</h1>

//           <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mx-auto mb-6 md:mb-10">
//             <h1 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-700">📞 Log Customer Call Inquiry</h1>
//             <CallInquiryForm employeeId={employeeId} />
//           </div>


//           <Outlet context={{
//             employee,
//             breakTimer,
//             topPerformers,
//             attendance,
//             leaves,
//             remainingLeaves,
//             TOTAL_ANNUAL_LEAVES,
//             salaryInfo,
//             salaryError,
//             presentDays,
//             perDaySalary,
//             calculatedSalary,
//             absentDays,
//             leaveForm,
//             setLeaveForm,
//             submitLeave,
//             user,
            
//           }} />


//         </div>
//       </div>

//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto mt-24 bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//           <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
//             🕒 Mark Your Attendance
//           </h2>
//           <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
//             By continuing, you confirm that you are starting work and will aim to complete at least <strong>8 hours</strong> today.
//             <br />
//             <span className="text-red-500 font-medium block mt-1">
//               Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//             </span>
//           </p>

//           <label className="flex items-start gap-2 mb-3 md:mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-xs md:text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => {
//                 localStorage.clear();
//                 navigate('/login');
//               }}
//               className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
//             >
//               ❌ Cancel
//             </button>

//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
//             >
//               ✅ Proceed to Dashboard
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserDashboard;

//=====================================

// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { useNavigate, Outlet } from 'react-router-dom';
// import API from '../api';
// import Modal from 'react-modal';
// import CallInquiryForm from './CallInquiryForm';
// import Clock from '../components/Timer';
// import TopPerformance from '../routes/TopPerformance';
// import Attendance from '../routes/Attendance';
// import BreakTime from '../routes/BreakTime';
// import Leaves from '../routes/Leaves';
// import RequestLeaves from '../routes/RequestLeave';
// import SalaryDetails from '../routes/SalaryDetails';
// import WeeklyOff from '../routes/WeeklyOff';
// import Sidebar from '../components2/Sidebar';
// import useBreakTimer from '../routes/useBreakTimer';
// import EmployeeTasks from '../routes/EmployeeTasks';

// Modal.setAppElement('#root');

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [user, setUser] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [leaves, setLeaves] = useState([]);
//   const [performance, setPerformance] = useState(null);
//   const [remainingLeaves, setRemainingLeaves] = useState(0);
//   const [topPerformers, setTopPerformers] = useState([]);
//   const breakTimer = useBreakTimer(employee);
//   const TOTAL_ANNUAL_LEAVES = 20;
//   const [salaryInfo, setSalaryInfo] = useState(null);
//   const [salaryError, setSalaryError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [error, setError] = useState('');
//   // Added leaveForm state
//   const [leaveForm, setLeaveForm] = useState({
//     from: '',
//     to: '',
//     reason: '',
//     document: null,
//     leaveType: 'Paid Leave',
//   });

//   const TOTAL_WORKING_DAYS = 30;
//   const presentDays = salaryInfo?.presentDays || 0;
//   const perDaySalary = Number(salaryInfo?.perDaySalary || 0);
//   const calculatedSalary = (presentDays * perDaySalary).toFixed(1);
//   const absentDays = TOTAL_WORKING_DAYS - presentDays;

//   const fetchEmployeeIdByUserId = useCallback(async () => {
//     try {
//       const userId = localStorage.getItem('userId');
//       const token = localStorage.getItem('token');
//       if (!userId || !token) {
//         throw new Error('User not authenticated');
//       }
//       const res = await API.get(`/employees/by-user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data?.employee?._id) {
//         localStorage.setItem('employeeId', res.data.employee._id);
//         setEmployee(res.data.employee);
//         return res.data.employee._id;
//       } else {
//         throw new Error('Employee not found');
//       }
//     } catch (err) {
//       console.error('Error fetching employee ID:', err);
//       setError('❌ Failed to fetch employee data. Please login again.');
//       setShowModal(true);
//       setTimeout(() => navigate('/login'), 2000);
//       return null;
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       handleSessionExpired();
//       return;
//     }

//     const fetchInitialData = async () => {
//       try {
//         await fetchUserData();
//         await fetchTopPerformers();
//       } catch (error) {
//         console.error('Initial data fetch failed:', error);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           handleSessionExpired();
//         } else {
//           setError('❌ Failed to load dashboard data. Please try again.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, [fetchEmployeeIdByUserId]);

//   useEffect(() => {
//     if (employee?._id && !localStorage.getItem('attendanceChecked')) {
//       checkAttendance();
//       markLogin();
//       fetchTodayStats();
//       fetchLeaves();
//       localStorage.setItem('attendanceChecked', 'true');
//     }
//   }, [employee]);

//   const handleSessionExpired = () => {
//     setTimeout(() => {
//       setError('❌ Session expired. Please login again.');
//       localStorage.clear();
//       navigate('/login');
//     }, 300);
//   };

//   const verifyToken = () => {
//     const token = localStorage.getItem('token');
//     if (!token || token === 'undefined') {
//       handleSessionExpired();
//       return false;
//     }
//     return true;
//   };

//   const checkAttendance = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await API.get('/attendance/today', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.data?.marked) {
//         setModalMessage('Please mark your attendance for today');
//         setShowModal(true);
//       }
//     } catch (err) {
//       console.error('Attendance check failed:', err);
//       setModalMessage(
//         err.response?.status === 401
//           ? 'Session expired or unauthorized. Please log in again.'
//           : 'Unable to verify attendance. Please try again.'
//       );
//       setShowModal(true);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   useEffect(() => {
//     if (!employee?._id) return;

//     const fetchSalary = async () => {
//       try {
//         const token = localStorage.getItem('token'); // Fixed: Define token
//         if (!token) {
//           throw new Error('Not authenticated');
//         }
//         const month = new Date().toISOString().slice(0, 7);
//         const res = await API.get(`/employees/salary/${employee._id}/${month}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSalaryInfo(res.data);
//       } catch (err) {
//         console.error('Error fetching salary:', err);
//         setSalaryError('❌ Failed to load salary details.');
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           handleSessionExpired();
//         }
//       }
//     };

//     fetchSalary();
//   }, [employee]);

//   const fetchUserData = async () => {
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const headers = { headers: { Authorization: `Bearer ${token}` } };

//       const profileRes = await API.get('/user/profile', headers);
//       const userData = profileRes.data;
//       setUser(userData);

//       const empId = await fetchEmployeeIdByUserId();
//       if (!empId) return;

//       const [attRes, leaveRes, perfRes] = await Promise.all([
//         API.get(`/attendance?employeeId=${empId}&perPage=50`, headers),
//         API.get(`/leaves?employeeId=${empId}`, headers),
//         API.get(`/performance/employee/${empId}`, headers),
//       ]);

//       setAttendance(attRes.data.data || []);
//       setLeaves(leaveRes.data.data || []);
//       setPerformance(perfRes.data.summary);

//       const approvedLeaves = leaveRes.data.data.filter(
//         (l) => l.status === 'Approved' || l.status === 'Paid Leave'
//       );

//       const usedLeaveDays = approvedLeaves.reduce((total, leave) => {
//         const from = new Date(leave.from);
//         const to = new Date(leave.to);
//         if (from.getDay() === 0 || to.getDay() === 0) return total;
//         return total + Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
//       }, 0);

//       setRemainingLeaves(TOTAL_ANNUAL_LEAVES - usedLeaveDays);
//     } catch (err) {
//       console.error('User data fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         setError('❌ Failed to load your data. Please refresh.');
//       }
//     }
//   };

//   const fetchTopPerformers = async () => {
//     if (!verifyToken()) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await API.get('/performance/top', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTopPerformers(res.data.data || []);
//     } catch (err) {
//       console.error('Failed to fetch top performers:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const fetchLeaves = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const res = await API.get(`/leaves?employeeId=${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLeaves(res.data?.data || []);
//     } catch (err) {
//       console.error('Failed to fetch leaves:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//       setLeaves([]);
//     }
//   };

//   const fetchTodayStats = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       await API.get(`/hours/today/${employee._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (err) {
//       console.error('Stats fetch failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const markLogin = async () => {
//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       await API.post(
//         '/hours/login',
//         { employeeId: employee._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error('Login time tracking failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       }
//     }
//   };

//   const submitLeave = async () => {
//     if (!leaveForm.from || !leaveForm.to) {
//       setError('❗ Please select both From and To dates.');
//       return;
//     }

//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('employeeId', employee._id);
//       formData.append('from', leaveForm.from);
//       formData.append('to', leaveForm.to);
//       formData.append('reason', leaveForm.reason);
//       formData.append('leaveType', leaveForm.leaveType || 'Paid Leave');

//       if (leaveForm.document) {
//         formData.append('document', leaveForm.document);
//       }

//       await API.post('/leaves', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setError('');
//       alert('✅ Leave request submitted successfully.');
//       setLeaveForm({ from: '', to: '', reason: '', document: null, leaveType: 'Paid Leave' });
//       fetchUserData();
//     } catch (err) {
//       console.error('Leave submission failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         setError('❌ Failed to submit leave. Try again.');
//       }
//     }
//   };

//   const markAttendance = async () => {
//     if (!verifyToken() || !employee?._id) return false;

//     try {
//       const now = new Date();
//       const istOffset = 5.5 * 60 * 60 * 1000;
//       const istNow = new Date(now.getTime() + istOffset);
//       const istDate = istNow.toISOString().slice(0, 10);

//       const token = localStorage.getItem('token');
//       const response = await API.post(
//         '/attendance/mark',
//         { employeeId: employee._id, date: istDate },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setModalMessage(response?.data?.message || 'Attendance marked');
//       setShowModal(true);
//       return true;
//     } catch (err) {
//       console.error('Attendance marking failed:', err);
//       setModalMessage('Failed to mark attendance. Please try again.');
//       setShowModal(true);
//       return false;
//     }
//   };

//   const handleProceed = async () => {
//     if (!agree) {
//       setModalMessage('You must agree to mark attendance');
//       setShowModal(true);
//       return;
//     }

//     const success = await markAttendance();
//     if (success) {
//       setTimeout(() => {
//         setShowModal(false);
//         fetchUserData();
//       }, 1500);
//     }
//   };

//   const { approvedCount, rejectedCount, paidCount, sundayCount } = useMemo(() => {
//     const result = { approvedCount: 0, rejectedCount: 0, paidCount: 0, sundayCount: 0 };
//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach((l) => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;
//       if (isSunday) result.sundayCount++;
//       else if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-700">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`transition-all duration-300 ${showModal ? 'blur-lg pointer-events-none select-none' : ''}`}>
//       <div className="md:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="bg-[#72819a] text-white p-2 rounded-lg shadow-lg"
//         >
//           {sidebarOpen ? '❌' : '☰'}
//         </button>
//       </div>

//       <div className="min-h-screen flex bg-gray-100">
//         <Clock />
//         <Sidebar
//           user={user}
//           employee={employee}
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />

//         <div className="w-full p-4 md:p-6 space-y-6">
//           {error && (
//             <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
//           )}
//           <h1 className="text-center text-2xl md:text-3xl bg-gradient-to-r from-green-200 via-white to-green-200 inline-block px-4 py-2 rounded">
//             Welcome {user?.name || 'User'}
//           </h1>

//           <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">👤 Your Dashboard</h1>

//           <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mx-auto mb-6 md:mb-10">
//             <h1 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-700">
//               📞 Log Customer Call Inquiry
//             </h1>
//             <CallInquiryForm employeeId={employee?._id} />
//           </div>

//           <Outlet
//             context={{
//               employee,
//               breakTimer,
//               topPerformers,
//               attendance,
//               leaves,
//               remainingLeaves,
//               TOTAL_ANNUAL_LEAVES,
//               salaryInfo,
//               salaryError,
//               presentDays,
//               perDaySalary,
//               calculatedSalary,
//               absentDays,
//               leaveForm, // Fixed: Added leaveForm
//               setLeaveForm,
//               submitLeave,
//               user,
//             }}
//           />
//         </div>
//       </div>

//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto mt-24 bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//           <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
//             🕒 Mark Your Attendance
//           </h2>
//           <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
//             By continuing, you confirm that you are starting work and will aim to complete at least{' '}
//             <strong>8 hours</strong> today.
//             <br />
//             <span className="text-red-500 font-medium block mt-1">
//               Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//             </span>
//           </p>

//           <label className="flex items-start gap-2 mb-3 md:mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-xs md:text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${
//                 agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
//               }`}
//             >
//               ✅ Proceed to Dashboard
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default UserDashboard;

//---
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import API from '../api';
import Modal from 'react-modal';
import CallInquiryForm from './CallInquiryForm';
import Clock from '../components/Timer';
import TopPerformance from '../routes/TopPerformance';
import Attendance from '../routes/Attendance';
import BreakTime from '../routes/BreakTime';
import Leaves from '../routes/Leaves';
import RequestLeaves from '../routes/RequestLeave';
import SalaryDetails from '../routes/SalaryDetails';
import WeeklyOff from '../routes/WeeklyOff';
import Sidebar from '../components2/Sidebar';
import useBreakTimer from '../routes/useBreakTimer';
import EmployeeTasks from '../routes/EmployeeTasks';

Modal.setAppElement('#root');

const UserDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);
  const breakTimer = useBreakTimer(employee);
  const TOTAL_ANNUAL_LEAVES = 20;
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [salaryError, setSalaryError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [leaveForm, setLeaveForm] = useState({
    from: '',
    to: '',
    reason: '',
    document: null,
    leaveType: 'Paid Leave',
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const TOTAL_WORKING_DAYS = 30;
  const presentDays = salaryInfo?.presentDays || 0;
  const perDaySalary = Number(salaryInfo?.perDaySalary || 0);
  const calculatedSalary = (presentDays * perDaySalary).toFixed(1);
  const absentDays = TOTAL_WORKING_DAYS - presentDays;

  const fetchEmployeeIdByUserId = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        throw new Error('User not authenticated');
      }
      const res = await API.get(`/employees/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.employee?._id) {
        localStorage.setItem('employeeId', res.data.employee._id);
        setEmployee(res.data.employee);
        return res.data.employee._id;
      } else {
        throw new Error('Employee not found');
      }
    } catch (err) {
      console.error('Error fetching employee ID:', err);
      setError('❌ Failed to fetch employee data. Please login again.');
      setShowModal(true);
      setTimeout(() => navigate('/login'), 2000);
      return null;
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleSessionExpired();
      return;
    }

    const fetchInitialData = async () => {
      try {
        await fetchUserData();
        await fetchTopPerformers();
      } catch (error) {
        console.error('Initial data fetch failed:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleSessionExpired();
        } else {
          setError('❌ Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchEmployeeIdByUserId]);

  useEffect(() => {
    if (employee?._id && !localStorage.getItem('attendanceChecked')) {
      checkAttendance();
      markLogin();
      fetchTodayStats();
      fetchLeaves();
      localStorage.setItem('attendanceChecked', 'true');
    }
  }, [employee]);

  const handleSessionExpired = () => {
    setTimeout(() => {
      setError('❌ Session expired. Please login again.');
      localStorage.clear();
      navigate('/login');
    }, 300);
  };

  const verifyToken = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') {
      handleSessionExpired();
      return false;
    }
    return true;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await API.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (err) {
      console.error('Logout API error:', err);
      setError('❌ Failed to logout cleanly. Proceeding anyway.');
    } finally {
      ['token', 'user', 'employee', 'attendanceChecked', 'employeeId', 'userId'].forEach((key) =>
        localStorage.removeItem(key)
      );
      setEmployee(null);
      setUser(null);
      setAttendance([]);
      setLeaves([]);
      setPerformance(null);
      setRemainingLeaves(0);
      setTopPerformers([]);
      setSalaryInfo(null);
      setSalaryError('');
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  const checkAttendance = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/attendance/today', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.marked) {
        setModalMessage('Please mark your attendance for today');
        setShowModal(true);
      }
    } catch (err) {
      console.error('Attendance check failed:', err);
      setModalMessage(
        err.response?.status === 401
          ? 'Session expired or unauthorized. Please log in again.'
          : 'Unable to verify attendance. Please try again.'
      );
      setShowModal(true);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  useEffect(() => {
    if (!employee?._id) return;

    const fetchSalary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        const month = new Date().toISOString().slice(0, 7);
        const res = await API.get(`/employees/salary/${employee._id}/${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalaryInfo(res.data);
      } catch (err) {
        console.error('Error fetching salary:', err);
        setSalaryError('❌ Failed to load salary details.');
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleSessionExpired();
        }
      }
    };

    fetchSalary();
  }, [employee]);

  const fetchUserData = async () => {
    if (!verifyToken()) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const profileRes = await API.get('/user/profile', headers);
      const userData = profileRes.data;
      setUser(userData);

      const empId = await fetchEmployeeIdByUserId();
      if (!empId) return;

      const [attRes, leaveRes, perfRes] = await Promise.all([
        API.get(`/attendance?employeeId=${empId}&perPage=50`, headers),
        API.get(`/leaves?employeeId=${empId}`, headers),
        API.get(`/performance/employee/${empId}`, headers),
      ]);

      setAttendance(attRes.data.data || []);
      setLeaves(leaveRes.data.data || []);
      setPerformance(perfRes.data.summary);

      const approvedLeaves = leaveRes.data.data.filter(
        (l) => l.status === 'Approved' || l.status === 'Paid Leave'
      );

      const usedLeaveDays = approvedLeaves.reduce((total, leave) => {
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        if (from.getDay() === 0 || to.getDay() === 0) return total;
        return total + Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      }, 0);

      setRemainingLeaves(TOTAL_ANNUAL_LEAVES - usedLeaveDays);
    } catch (err) {
      console.error('User data fetch failed:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      } else {
        setError('❌ Failed to load your data. Please refresh.');
      }
    }
  };

  const fetchTopPerformers = async () => {
    if (!verifyToken()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/performance/top', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopPerformers(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch top performers:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  const fetchLeaves = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem('token');
      const res = await API.get(`/leaves?employeeId=${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
      setLeaves([]);
    }
  };

  const fetchTodayStats = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem('token');
      await API.get(`/hours/today/${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Stats fetch failed:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  const markLogin = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem('token');
      await API.post(
        '/hours/login',
        { employeeId: employee._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Login time tracking failed:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

//   const submitLeave = async () => {
//     if (!leaveForm.from || !leaveForm.to) {
//       setError('❗ Please select both From and To dates.');
//       return;
//     }

//     if (!verifyToken() || !employee?._id) return;

//     try {
//       const token = localStorage.getItem('token');
//       const formData = new FormData();
//       formData.append('employeeId', employee._id);
//       formData.append('from', leaveForm.from);
//       formData.append('to', leaveForm.to);
//       formData.append('reason', leaveForm.reason);
//       formData.append('leaveType', leaveForm.leaveType || 'Paid Leave');

//       if (leaveForm.document) {
//         formData.append('document', leaveForm.document);
//       }

//       await API.post('/leaves', formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setError('');
//       alert('✅ Leave request submitted successfully.');
//       setLeaveForm({ from: '', to: '', reason: '', document: null, leaveType: 'Paid Leave' });
//       fetchUserData();
//     } catch (err) {
//       console.error('Leave submission failed:', err);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         handleSessionExpired();
//       } else {
//         setError('❌ Failed to submit leave. Try again.');
// setError('More than 5 days or more than 4 leave requests per year. Please contact HR.');
//       }
//     }
//   };


const submitLeave = async () => {
  if (!leaveForm.from || !leaveForm.to || !leaveForm.reason || !leaveForm.leaveType) {
    setError('❗ Please select all required fields: From date, To date, Leave Type, and Reason.');
    return;
  }

  if (!verifyToken() || !employee?._id) return;

  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('employeeId', employee._id);
    formData.append('from', leaveForm.from);
    formData.append('to', leaveForm.to);
    formData.append('reason', leaveForm.reason);
    formData.append('leaveType', leaveForm.leaveType || 'Paid Leave');

    if (leaveForm.document) {
      formData.append('document', leaveForm.document);
    }

    const res = await API.post('/leaves', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // ✅ success case
    setError('');
    alert('✅ Leave request submitted successfully.');
    setLeaveForm({ from: '', to: '', reason: '', document: null, leaveType: 'Paid Leave' });
    fetchUserData();

    return res.data; // important: return backend JSON
  } catch (err) {
    console.error('Leave submission failed:', err);

    if (err.response?.status === 401 || err.response?.status === 403) {
      handleSessionExpired();
      return;
    }

    // ✅ show backend's own message
    const backendMsg = err.response?.data?.message;
    if (backendMsg) {
      setError(backendMsg); // "More than 5 days please contact HR." or "Maximum 4 leave requests per year. Please contact HR."
    } else {
      setError('❌ Failed to submit leave. Try again.');
    }

    return err.response?.data; // return so caller can also check
  }
};

  const markAttendance = async () => {
    if (!verifyToken() || !employee?._id) return false;

    try {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + istOffset);
      const istDate = istNow.toISOString().slice(0, 10);

      const token = localStorage.getItem('token');
      const response = await API.post(
        '/attendance/mark',
        { employeeId: employee._id, date: istDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalMessage(response?.data?.message || 'Attendance marked');
      setShowModal(true);
      return true;
    } catch (err) {
      console.error('Attendance marking failed:', err);
      setModalMessage('Failed to mark attendance. Please try again.');
      setShowModal(true);
      return false;
    }
  };

  const handleProceed = async () => {
    if (!agree) {
      setModalMessage('You must agree to mark attendance');
      setShowModal(true);
      return;
    }

    const success = await markAttendance();
    if (success) {
      setTimeout(() => {
        setShowModal(false);
        fetchUserData();
      }, 1500);
    }
  };

  const { approvedCount, rejectedCount, paidCount, sundayCount } = useMemo(() => {
    const result = { approvedCount: 0, rejectedCount: 0, paidCount: 0, sundayCount: 0 };
    if (!Array.isArray(leaves)) return result;

    leaves.forEach((l) => {
      if (!l || !l.from || !l.to) return;
      const fromDay = new Date(l.from).getDay();
      const toDay = new Date(l.to).getDay();
      const isSunday = fromDay === 0 && toDay === 0;
      if (isSunday) result.sundayCount++;
      else if (l.status === 'Approved') result.approvedCount++;
      else if (l.status === 'Rejected') result.rejectedCount++;
      else if (l.status === 'Paid Leave') result.paidCount++;
    });

    return result;
  }, [leaves]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ${showModal ? 'blur-lg pointer-events-none select-none' : ''}`}>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#72819a] text-white p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? '❌' : '☰'}
        </button>
      </div>

      {/* <div className="min-h-screen flex bg-gray-100"> */}
<div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100">


        <Clock />
        <Sidebar
          user={user}
          employee={employee}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        <div className="w-full p-4 md:p-6 space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>
          )}
          <h1 className="text-center text-2xl md:text-3xl bg-gradient-to-r from-green-200 via-white to-green-200 inline-block px-4 py-2 rounded">
            Welcome {user?.name || 'User'}
          </h1>

          <div className="flex justify-end">
            {/* <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-4 py-2 text-white rounded ${
                isLoggingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button> */}
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">👤 Your Dashboard</h1>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mx-auto mb-6 md:mb-10">
            <h1 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-green-700">
              📞 Log Customer Call Inquiry
            </h1>
            <CallInquiryForm employeeId={employee?._id} />
          </div>

          <Outlet
            context={{
              employee,
              breakTimer,
              topPerformers,
              attendance,
              leaves,
              remainingLeaves,
              TOTAL_ANNUAL_LEAVES,
              salaryInfo,
              salaryError,
              presentDays,
              perDaySalary,
              calculatedSalary,
              absentDays,
              leaveForm,
              setLeaveForm,
              submitLeave,
              user,
            }}
          />
        </div>
      </div>

      {/* <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Attendance Confirmation"
        className="w-[90%] max-w-md mx-auto  bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div>
          <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
            🕒 Mark Your Attendance
          </h2>
          <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
            By continuing, you confirm that you are starting work and will aim to complete at least{' '}
            <strong>8 hours</strong> today.
            <br />
            <span className="text-red-500 font-medium block mt-1">
              Less than 8 hrs = Half Day, less than 5 hrs = Absent.
            </span>
          </p>

          <label className="flex items-start gap-2 mb-3 md:mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
            />
            <span className="text-gray-800 text-xs md:text-sm font-medium">
              I agree to mark my attendance
            </span>
          </label>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={handleProceed}
              disabled={!agree}
              className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${
                agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
              }`}
            >
              ✅ Proceed to Dashboard
            </button>
          </div>
        </div>
      </Modal> */}


      <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}  // just close
  contentLabel="Attendance Confirmation"
  className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
>
  <div>
    <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
      🕒 Mark Your Attendance
    </h2>
    <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
      By continuing, you confirm that you are starting work and will aim to complete at least{' '}
      <strong>8 hours</strong> today.
      <br />
      <span className="text-red-500 font-medium block mt-1">
        Less than 8 hrs = Half Day, less than 5 hrs = Absent.
      </span>
    </p>

    <label className="flex items-start gap-2 mb-3 md:mb-4">
      <input
        type="checkbox"
        checked={agree}
        onChange={() => setAgree(!agree)}
        className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
      />
      <span className="text-gray-800 text-xs md:text-sm font-medium">
        I agree to mark my attendance
      </span>
    </label>

    <div className="flex justify-between mt-4">
      {/* Close just hides modal */}
      {/* <button
        onClick={() => setShowModal(false)}
        className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
      >
        Close
      </button> */}
      <button
  onClick={() => {
    setShowModal(false);
    localStorage.clear(); // optional: clear session
    navigate('/login');   // redirect to login
  }}
  className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 hover:text-gray-900 transition-colors"
>
  ✖ Close
</button>


      {/* Proceed goes to dashboard */}
      <button
        onClick={handleProceed}
        disabled={!agree}
        className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${
          agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
        }`}
      >
        ✅ Proceed to Dashboard
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default UserDashboard;