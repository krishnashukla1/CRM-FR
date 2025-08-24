// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaUserClock, FaCalendarCheck, FaWalking, FaTasks, FaUserTie, FaMoneyBill, FaPowerOff, FaMedal } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4 fixed">
//       <h2 className="text-xl font-bold mb-6">User Panel</h2>

//       <nav className="flex flex-col gap-4">
//         <Link to="/dashboard/attendance" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaUserClock /> Attendance
//         </Link>
//         <Link to="/dashboard/breaktime" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaWalking /> Break Time
//         </Link>
//         <Link to="/dashboard/leaves" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaCalendarCheck /> Leaves
//         </Link>
//         <Link to="/dashboard/tasks" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaTasks /> Tasks
//         </Link>
//         <Link to="/dashboard/weeklyoff" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaUserTie /> Weekly Off Roster
//         </Link>
//         <Link to="/dashboard/salary" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaMoneyBill /> Salary Details
//         </Link>
//         <Link to="/dashboard/request-leave" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaCalendarCheck /> Request New Leave
//         </Link>
//         <Link to="/dashboard/top-performers" className="flex items-center gap-2 hover:text-yellow-400">
//           <FaMedal /> Top 3 Performers
//         </Link>
//         <Link to="/logout" className="flex items-center gap-2 text-red-400 mt-auto hover:text-red-600">
//           <FaPowerOff /> Logout
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

//--------------------------------

// components/Sidebar.jsx


// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import API from '../api'; // make sure this points to your axios instance
// import { toast } from 'react-toastify';


// const Sidebar = ({ user, employee, sidebarOpen, setSidebarOpen, setLogoutMessage }) => {
//   const navigate = useNavigate();

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
//   //     toast.success('✅ You have successfully logged out.');
//   //     localStorage.removeItem('token');
//   //     localStorage.removeItem('attendanceChecked');

//   //     // ⛔ Do NOT navigate to login here!
//   //     navigate('/daily-report'); // ✅ Redirect to report page instead
//   //   }
//   // };

//   const markLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       // 🕒 Calculate and store session time before removing loginTime
//       const loginTimeStr = localStorage.getItem('loginTime');
//       if (loginTimeStr) {
//         const loginTime = new Date(loginTimeStr);
//         const logoutTime = new Date();
//         const sessionDuration = (logoutTime - loginTime) / (1000 * 60 * 60); // hours

//         const prevWork = parseFloat(localStorage.getItem('totalWorkToday')) || 0;
//         const newTotal = prevWork + sessionDuration;

//         localStorage.setItem('totalWorkToday', newTotal.toFixed(2));
//       }

//       // 🧹 Remove loginTime AFTER session is saved
//       localStorage.removeItem('loginTime');

//       if (token && employee?._id) {
//         const headers = { headers: { Authorization: `Bearer ${token}` } };
//         await API.post('/hours/logout', { employeeId: employee._id }, headers);
//       }
//     } catch (err) {
//       console.error('Logout tracking failed:', err);
//     } finally {
//       toast.success('✅ You have successfully logged out.');
//       localStorage.removeItem('token');
//       localStorage.removeItem('attendanceChecked');

//       // ✅ Go to report page
//       navigate('/daily-report');
//     }
//   };


//   return (
//     <div className={`fixed md:relative z-40 md:z-0 w-64 h-20 min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
//       {employee?.photo && (
//         <img
//           src={
//             employee.photo.startsWith('http')
//               ? employee.photo
//               : `https://crm-backend-f4lj.onrender.com/uploads/${employee.photo}`
//           }
//           alt="User"
//           className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
//         />
//       )}

//       <h2 className="text-xl font-bold text-center">{user?.name || 'Employee'}</h2>
//       <p className="text-sm text-center text-white/80">{user?.email || 'user@example.com'}</p>

//       <div className="w-full mt-6 space-y-2 text-sm">
//         <p><span className="font-semibold">📌 Post:</span> {employee?.role || 'User'}</p>
//         <p><span className="font-semibold">🆔 Employee ID:</span> {employee?._id || 'N/A'}</p>
//         <p><span className="font-semibold">🎓 Role:</span> {user?.role || 'Employee'}</p>
//         <p><span className="font-semibold">🔑 User ID:</span> {user?._id || 'N/A'}</p>
//         {/* <p><span className="font-semibold">📅 Date of Joining:</span> {employee?.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}</p> */}

//         <p>
//           <span className="font-semibold">📅 Date of Joining:</span>{" "}
//           {employee?.dateOfJoining
//             ? new Date(employee.dateOfJoining).toLocaleDateString("en-GB")
//             : "N/A"}
//         </p>

//         <hr className="my-4 border-white/30" />

//         <ul className="space-y-2 text-sm font-semibold text-white">
//           <li>
//             <Link to="my-tasks" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>🧾 My Tasks</Link>
//           </li>

//           <li>
//             <Link to="top-performers" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>🏆 Top 3 Performers</Link>
//           </li>
//           <li>
//             <Link to="attendance" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📅 Attendance</Link>
//           </li>
//           <li>
//             <Link to="leaves" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📝 Leaves</Link>
//           </li>
//           <li>
//             <Link to="weekly-off" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📆 Weekly Off</Link>
//           </li>
//           <li>
//             <Link to="salary" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>💰 Salary Details</Link>
//           </li>
//           <li>
//             <Link to="request-leave" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>➕ Request New Leave</Link>
//           </li>
//           <li>
//             <Link to="break-time" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>⏱️ Break Time</Link>
//           </li>

//         </ul>
//       </div>

//       <button
//         onClick={markLogout}
//         className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Sidebar;

//===============

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';

const Sidebar = ({ user, employee, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const initiateLogout = () => {
    // Navigate to pre-logout report page without clearing session yet

    // Store current time in localStorage before navigating
    const now = new Date().toISOString();
    localStorage.setItem('logoutInitiatedAt', now);

    navigate('/pre-logout-report');
  };

  return (
    <div
      className={`fixed md:relative z-40 md:z-0 w-64  h-100% min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
    >
      {employee?.photo && (
        <img
          src={
            employee.photo.startsWith('http')
              ? employee.photo
              : `https://crm-backend-f4lj.onrender.com/uploads/${employee.photo}`
          }
          alt="User"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
        />
      )}

      <h2 className="text-xl font-bold text-center">{user?.name || 'Employee'}</h2>
      <p className="text-sm text-center text-white/80">{user?.email || 'user@example.com'}</p>

      <div className="w-full mt-6 space-y-2 text-sm">
        <p><span className="font-semibold">📌 Post:</span> {employee?.role || 'User'}</p>
        <p><span className="font-semibold">🆔 Employee ID:</span> {employee?._id || 'N/A'}</p>
        <p><span className="font-semibold">🎓 Role:</span> {user?.role || 'Employee'}</p>
        <p><span className="font-semibold">🔑 User ID:</span> {user?._id || 'N/A'}</p>
        <p>
          <span className="font-semibold">📅 Date of Joining:</span>{' '}
          {employee?.dateOfJoining
            ? new Date(employee.dateOfJoining).toLocaleDateString('en-GB')
            : 'N/A'}
        </p>

        <hr className="my-4 border-white/30" />

        <ul className="space-y-2 text-sm font-semibold text-white">
          <li>
            <Link
              to="my-tasks"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              🧾 My Tasks
            </Link>
          </li>
          <li>
            <Link
              to="top-performers"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              🏆 Top 3 Performers
            </Link>
          </li>
          <li>
            <Link
              to="attendance"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              📅 Attendance
            </Link>
          </li>
          <li>
            <Link
              to="leaves"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              📝 Leaves
            </Link>
          </li>
          <li>
            <Link
              to="weekly-off"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              📆 Weekly Off
            </Link>
          </li>
          <li>
            <Link
              to="salary"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              💰 Salary Details
            </Link>
          </li>
          <li>
            <Link
              to="request-leave"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              ➕ Request New Leave
            </Link>
          </li>
          <li>
            <Link
              to="break-time"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              ⏱️ Break Time
            </Link>
          </li>
          <li>
            <Link
              to="policy"
              className="hover:text-yellow-300 block"
              onClick={() => setSidebarOpen(false)}
            >
              📜 Policy
            </Link>
          </li>
        </ul>
      </div>

      <button
        onClick={initiateLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
