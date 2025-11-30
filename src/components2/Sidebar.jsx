// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import API from '../api';
// import { toast } from 'react-toastify';

// const Sidebar = ({ user, employee, sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();

//   const initiateLogout = () => {
//     // Navigate to pre-logout report page without clearing session yet

//     // Store current time in localStorage before navigating
//     const now = new Date().toISOString();
//     localStorage.setItem('logoutInitiatedAt', now);

//     navigate('/pre-logout-report');
//   };

//   return (
//     <div
//       className={`fixed md:relative z-40 md:z-0 w-64  h-100% min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//     >
//       {/* {employee?.photo && (
//         <img
//           src={
//             employee.photo.startsWith('http')
//               ? employee.photo
//               : `https://crm-backend-f4lj.onrender.com/uploads/${employee.photo}`
//           }
//           alt="User"
//           className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full shadow-md"
//         />
//       )} */}

//  <img
//   src={
//     employee?.photo && employee.photo.startsWith("http")
//       ? employee.photo
//       : "https://cdn-icons-png.flaticon.com/512/6069/6069202.png" // always fallback avatar
//   }
//   alt="User"
//   className="object-cover w-24 h-24 mb-4 border-4 border-white rounded-full shadow-md"
//   onError={(e) => {
//     e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/6069/6069202.png"; // fallback if broken
//   }}
// />



//       <h2 className="text-xl font-bold text-center">{user?.name || 'Employee'}</h2>
//       <p className="text-sm text-center text-white/80">{user?.email || 'user@example.com'}</p>

//       <div className="w-full mt-6 space-y-2 text-sm">
//         <p><span className="font-semibold">📌 Post:</span> {employee?.role || 'User'}</p>
//         <p><span className="font-semibold">🆔 Employee ID:</span> {employee?._id || 'N/A'}</p>
//         <p><span className="font-semibold">🎓 Role:</span> {user?.role || 'Employee'}</p>
//         <p><span className="font-semibold">🔑 User ID:</span> {user?._id || 'N/A'}</p>
//         <p>
//           <span className="font-semibold">📅 Date of Joining:</span>{' '}
//           {employee?.dateOfJoining
//             ? new Date(employee.dateOfJoining).toLocaleDateString('en-GB')
//             : 'N/A'}
//         </p>

//         <hr className="my-4 border-white/30" />

//         <ul className="space-y-2 text-sm font-semibold text-white">
//           <li>
//             <Link
//               to="my-tasks"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               🧾 My Tasks
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="top-performers"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               🏆 Top 3 Performers
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="attendance"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Attendance
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="leaves"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📝 Leaves
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="weekly-off"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📆 Weekly Off
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="salary"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               💰 Salary Details
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="request-leave"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ➕ Request New Leave
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="break-time"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ⏱️ Break Time
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="policy"
//               className="block hover:text-yellow-300"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📜 Policy
//             </Link>
//           </li>
//         </ul>
//       </div>

//       <button
//         onClick={initiateLogout}
//         className="w-full py-2 mt-6 font-semibold text-white bg-red-500 rounded shadow cursor-pointer hover:bg-red-600"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Sidebar;


//========================================
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Trophy,
  Calendar,
  FileText,
  CalendarDays,
  Wallet,
  PlusCircle,
  Timer,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";

const Sidebar = ({ user, employee, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initiateLogout = () => {
    const now = new Date().toISOString();
    localStorage.setItem("logoutInitiatedAt", now);
    navigate("/pre-logout-report");
  };

  const menuItems = [
    { label: "My Tasks", icon: <ClipboardList size={18} />, path: "my-tasks" },
    { label: "Top Performers", icon: <Trophy size={18} />, path: "top-performers" },
    { label: "Attendance", icon: <Calendar size={18} />, path: "attendance" },
    { label: "Leaves", icon: <FileText size={18} />, path: "leaves" },
    { label: "Weekly Off", icon: <CalendarDays size={18} />, path: "weekly-off" },
    { label: "Salary Details", icon: <Wallet size={18} />, path: "salary" },
    { label: "Request Leave", icon: <PlusCircle size={18} />, path: "request-leave" },
    { label: "Break Time", icon: <Timer size={18} />, path: "break-time" },
    { label: "Policy", icon: <BookOpen size={18} />, path: "policy" },
  ];

  return (
    <div
      className={`fixed md:relative z-50 w-72 min-h-screen shadow-2xl border-r border-white/20 
      bg-gradient-to-b from-[#4b5563] to-[#1f2937] 
      text-white p-6 flex flex-col items-center transition-all duration-300 
      backdrop-blur-xl bg-opacity-90
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={
              employee?.photo?.startsWith("http")
                ? employee.photo
                : "https://cdn-icons-png.flaticon.com/512/6069/6069202.png"
            }
            className="object-cover w-24 h-24 border-4 border-white rounded-full shadow-lg"
            alt="User"
            onError={(e) => {
              e.currentTarget.src =
                "https://cdn-icons-png.flaticon.com/512/6069/6069202.png";
            }}
          />
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-1 right-1"></span>
        </div>

        <h2 className="mt-4 text-xl font-bold">{user?.name || "Employee"}</h2>
        <p className="text-sm text-gray-300">{user?.email || "user@example.com"}</p>
      </div>

      {/* Details */}
      <div className="w-full mb-4 space-y-2 text-sm">
        <p><span className="font-semibold text-gray-200">📌 Post:</span> {employee?.role || "User"}</p>
        <p><span className="font-semibold text-gray-200">🆔 Employee ID:</span> {employee?._id || "N/A"}</p>
        <p><span className="font-semibold text-gray-200">🎓 Role:</span> {user?.role || "Employee"}</p>
        <p><span className="font-semibold text-gray-200">🔑 User ID:</span> {user?._id || "N/A"}</p>
        <p>
          <span className="font-semibold text-gray-200">📅 Joining:</span>{" "}
          {employee?.dateOfJoining
            ? new Date(employee.dateOfJoining).toLocaleDateString("en-GB")
            : "N/A"}
        </p>
      </div>

      <hr className="w-full mb-4 border-white/20" />

      {/* Menu */}
      <ul className="w-full space-y-2">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium 
                transition-all duration-200 cursor-pointer
                ${
                  pathname.includes(item.path)
                    ? "bg-white/20 text-yellow-300 shadow-md"
                    : "hover:bg-white/10 hover:text-yellow-300"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout button */}
      <button
        onClick={initiateLogout}
        className="flex items-center justify-center w-full gap-2 py-2 mt-6 mt-auto font-semibold transition bg-red-500 rounded-lg shadow-lg cursor-pointer hover:bg-red-600"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
