// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaUserClock, FaCalendarCheck, FaWalking, FaTasks, FaUserTie, FaMoneyBill, FaPowerOff, FaMedal } from 'react-icons/fa';

// const Sidebar = () => {
//   return (
//     <div className="fixed flex flex-col w-64 h-screen p-4 text-white bg-gray-800">
//       <h2 className="mb-6 text-xl font-bold">User Panel</h2>

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
//         <Link to="/logout" className="flex items-center gap-2 mt-auto text-red-400 hover:text-red-600">
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
//           className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full shadow-md"
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
//             <Link to="my-tasks" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>🧾 My Tasks</Link>
//           </li>

//           <li>
//             <Link to="top-performers" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>🏆 Top 3 Performers</Link>
//           </li>
//           <li>
//             <Link to="attendance" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>📅 Attendance</Link>
//           </li>
//           <li>
//             <Link to="leaves" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>📝 Leaves</Link>
//           </li>
//           <li>
//             <Link to="weekly-off" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>📆 Weekly Off</Link>
//           </li>
//           <li>
//             <Link to="salary" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>💰 Salary Details</Link>
//           </li>
//           <li>
//             <Link to="request-leave" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>➕ Request New Leave</Link>
//           </li>
//           <li>
//             <Link to="break-time" className="block hover:text-yellow-300" onClick={() => setSidebarOpen(false)}>⏱️ Break Time</Link>
//           </li>

//         </ul>
//       </div>

//       <button
//         onClick={markLogout}
//         className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow hover:bg-red-600"
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
      {/* {employee?.photo && (
        <img
          src={
            employee.photo.startsWith('http')
              ? employee.photo
              : `https://crm-backend-f4lj.onrender.com/uploads/${employee.photo}`
          }
          alt="User"
          className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full shadow-md"
        />
      )} */}

 <img
  src={
    employee?.photo && employee.photo.startsWith("http")
      ? employee.photo
      : "https://cdn-icons-png.flaticon.com/512/6069/6069202.png" // always fallback avatar
  }
  alt="User"
  className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full shadow-md"
  onError={(e) => {
    e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/6069/6069202.png"; // fallback if broken
  }}
/>



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
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              🧾 My Tasks
            </Link>
          </li>
          <li>
            <Link
              to="top-performers"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              🏆 Top 3 Performers
            </Link>
          </li>
          <li>
            <Link
              to="attendance"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              📅 Attendance
            </Link>
          </li>
          <li>
            <Link
              to="leaves"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              📝 Leaves
            </Link>
          </li>
          <li>
            <Link
              to="weekly-off"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              📆 Weekly Off
            </Link>
          </li>
          <li>
            <Link
              to="salary"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              💰 Salary Details
            </Link>
          </li>
          <li>
            <Link
              to="request-leave"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              ➕ Request New Leave
            </Link>
          </li>
          <li>
            <Link
              to="break-time"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              ⏱️ Break Time
            </Link>
          </li>
          <li>
            <Link
              to="policy"
              className="block hover:text-yellow-300"
              onClick={() => setSidebarOpen(false)}
            >
              📜 Policy
            </Link>
          </li>
        </ul>
      </div>

      <button
        onClick={initiateLogout}
        className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow cursor-pointer hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
