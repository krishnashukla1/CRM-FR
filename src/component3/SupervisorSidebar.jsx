// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// function apiOrigin() {
//   const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
//   return api.replace(/\/api\/?$/, "");
// }

// function buildPhotoUrl(photo) {
//   if (!photo) return "";
//   if (photo.startsWith("http")) return photo;
//   return `${apiOrigin()}/uploads/${photo}`;
// }

// const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   // useEffect(() => {
//   //   const fetchEmployee = async () => {
//   //     try {
//   //       const { data } = await axios.get(`${API_BASE}/employees`);
//   //       if (data?.status === "success" && Array.isArray(data.data)) {
//   //         const emp = data.data.find((e) => String(e.userId) === String(user._id));
//   //         if (emp) {
//   //           setEmployee(emp);
//   //           localStorage.setItem("employee", JSON.stringify(emp));
//   //         }
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching employee data", err);
//   //     }
//   //   };
//   //   if (user?._id) {
//   //     fetchEmployee();
//   //   }
//   // }, [user?._id]);


// useEffect(() => {
//   const fetchEmployee = async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/employees`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure token is included if required
//         }
//       });
//       console.log('API response:', response); // Debug: Log full response
//       const responseData = response.data; // Avoid destructuring directly

//       if (responseData?.status === "success" && Array.isArray(responseData.data)) {
//         const emp = responseData.data.find((e) => String(e.userId) === String(user._id));
//         if (emp) {
//           setEmployee(emp);
//           localStorage.setItem("employee", JSON.stringify(emp));
//           console.log('Matched employee:', emp); // Debug: Log matched employee
//         } else {
//           console.warn('No matching employee found for user ID:', user._id);
//         }
//       } else {
//         console.warn('Unexpected response structure:', responseData);
//       }
//     } catch (err) {
//       console.error('Error fetching employee data:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//       });
//     }
//   };

//   if (user?._id) {
//     fetchEmployee();
//   } else {
//     console.warn('No user ID found in localStorage');
//   }
// }, [user?._id]);



//   const initiateLogout = () => {
//     localStorage.clear();
//     alert("✅ You have successfully logged out.");
//     navigate("/login");
//   };

//   const display = {
//     name: employee?.name ?? "Supervisor",
//     email: employee?.email ?? user?.email ?? "supervisor@example.com",
//     role: employee?.role ?? "Supervisor",
//     employeeId: employee?._id ?? "N/A",
//     userId: employee?.userId ?? user?._id ?? "N/A",
//     dateOfJoining: employee?.dateOfJoining ?? null,
//     photoUrl: buildPhotoUrl(employee?.photo ?? ""),
//   };

//   return (
//     <div
//       className={`fixed md:relative z-40 md:z-0 w-64 min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         }`}
//     >
//       {display.photoUrl && (
//         <img
//           src={display.photoUrl}
//           alt={display.name}
//           className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
//         />
//       )}

//       <h2 className="text-xl font-bold text-center">{display.name}</h2>
//       <p className="text-sm text-center text-white/80">{display.email}</p>

//       <div className="w-full mt-6 space-y-2 text-sm">
//         <p>
//           <span className="font-semibold">📌 Post:</span> {display.role}
//         </p>
//         <p>
//           <span className="font-semibold">🆔 Employee ID:</span> {display.employeeId}
//         </p>
//         <p>
//           <span className="font-semibold">🔑 User ID:</span> {display.userId}
//         </p>
//         <p>
//           <span className="font-semibold">📅 Date of Joining:</span>{" "}
//           {display.dateOfJoining
//             ? new Date(display.dateOfJoining).toLocaleDateString("en-GB")
//             : "N/A"}
//         </p>

//         <hr className="my-4 border-white/30" />

//         <h3 className="text-lg font-semibold">Admin Controls</h3>
//         <ul className="space-y-2 text-sm font-semibold text-white">
//           {/* <li>
//             <Link
//               to="/supervisor-dashboard/admin/dashboard"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               🏠 Dashboard
//             </Link>
//           </li> */}
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/employees"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               👥 Employees
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/login-status"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✅ Login Status
//             </Link>
//           </li>
//           {/* <li>
//             <Link
//               to="/supervisor-dashboard/admin/performance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📈 Performance
//             </Link>
//           </li> */}
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/attendance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Attendance
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/tasks"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Tasks
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/leave"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📝 Leave
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/weekly-off"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📆 Weekly Off
//             </Link>
//           </li>
//         </ul>

//         <hr className="my-4 border-white/30" />

//         <h3 className="text-lg font-semibold">Supervisor Controls</h3>
//         <ul className="space-y-2 text-sm font-semibold text-white">
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/top-performers"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               🏆 Top 3 Performers
//             </Link>
//           </li>
//           {/* <li>
//             <Link
//               to="/supervisor-dashboard/user/attendance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Attendance
//             </Link>
//           </li> */}

//           <li>
//             <Link
//               to="/supervisor-dashboard/attendance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Your Attendance
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/leaves"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📝 Leaves
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/weekly-off"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📆 Weekly Off
//             </Link>
//           </li>
//           {/* <li>
//             <Link
//               to="/supervisor-dashboard/user/salary"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               💰 Salary Details
//             </Link>
//           </li> */}
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/leaves/request-leave"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ➕ Request New Leave
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/supervisor-dashboard/user/break-time"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ⏱️ Break Time
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/my-tasks"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📋 Assign Tasks
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/policy"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📜 Policy
//             </Link>
//           </li>
//         </ul>
//       </div>

//       <button
//         onClick={initiateLogout}
//         className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default SupervisorSidebar;

//======================
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// function apiOrigin() {
//   const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
//   return api.replace(/\/api\/?$/, "");
// }

// function buildPhotoUrl(photo) {
//   if (!photo) return "";
//   if (photo.startsWith("http")) return photo;
//   return `${apiOrigin()}/uploads/${photo}`;
// }

// const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const [loginStatus, setLoginStatus] = useState(null); // New state for login status
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const response = await axios.get(`${API_BASE}/employees`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//         console.log("API response:", response); // Debug: Log full response
//         const responseData = response.data;

//         if (responseData?.status === "success" && Array.isArray(responseData.data)) {
//           const emp = responseData.data.find((e) => String(e.userId) === String(user._id));
//           if (emp) {
//             setEmployee(emp);
//             localStorage.setItem("employee", JSON.stringify(emp));
//             console.log("Matched employee:", emp); // Debug: Log matched employee
//           } else {
//             console.warn("No matching employee found for user ID:", user._id);
//           }
//         } else {
//           console.warn("Unexpected response structure:", responseData);
//         }
//       } catch (err) {
//         console.error("Error fetching employee data:", {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//       }
//     };

//     const fetchLoginStatus = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const empId = employee?._id || localStorage.getItem("employeeId");
//         if (!empId) {
//           console.warn("No employee ID available for fetching login status");
//           return;
//         }
//         const response = await axios.get(`${API_BASE}/hours/today/${empId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Supervisor login status:", response.data); // Debug: Log login status
//         setLoginStatus(response.data);
//       } catch (err) {
//         console.error("Error fetching login status:", {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//         });
//       }
//     };

//     if (user?._id) {
//       fetchEmployee();
//     } else {
//       console.warn("No user ID found in localStorage");
//     }

//     if (employee?._id) {
//       fetchLoginStatus();
//     }
//   }, [user?._id, employee?._id]);

//   const initiateLogout = () => {
//     localStorage.clear();
//     alert("✅ You have successfully logged out.");
//     navigate("/login");
//   };

//   const display = {
//     name: employee?.name ?? "Supervisor",
//     email: employee?.email ?? user?.email ?? "supervisor@example.com",
//     role: employee?.role ?? "Supervisor",
//     employeeId: employee?._id ?? "N/A",
//     userId: employee?.userId ?? user?._id ?? "N/A",
//     dateOfJoining: employee?.dateOfJoining ?? null,
//     photoUrl: buildPhotoUrl(employee?.photo ?? ""),
//     loginStatus: loginStatus?.isOnBreak ? "On Break" : loginStatus?.breakStatus || "Unknown",
//   };

//   return (
//     <div
//       className={`fixed md:relative z-40 md:z-0 w-64 min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${
//         sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//       }`}
//     >
//       {display.photoUrl && (
//         <img
//           src={display.photoUrl}
//           alt={display.name}
//           className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
//         />
//       )}

//       <h2 className="text-xl font-bold text-center">{display.name}</h2>
//       <p className="text-sm text-center text-white/80">{display.email}</p>

//       <div className="w-full mt-6 space-y-2 text-sm">
//         <p>
//           <span className="font-semibold">📌 Post:</span> {display.role}
//         </p>
//         <p>
//           <span className="font-semibold">🆔 Employee ID:</span> {display.employeeId}
//         </p>
//         <p>
//           <span className="font-semibold">🔑 User ID:</span> {display.userId}
//         </p>
//         <p>
//           <span className="font-semibold">📅 Date of Joining:</span>{" "}
//           {display.dateOfJoining
//             ? new Date(display.dateOfJoining).toLocaleDateString("en-GB")
//             : "N/A"}
//         </p>
//         <p>
//           <span className="font-semibold">🔐 Login Status:</span> {display.loginStatus}
//         </p>

//         <hr className="my-4 border-white/30" />

//         <h3 className="text-lg font-semibold">Admin Controls</h3>
//         <ul className="space-y-2 text-sm font-semibold text-white">
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/employees"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               👥 Employees
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/login-status"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ✅ Login Status
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/attendance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Attendance
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/tasks"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Tasks
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/leave"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📝 Leave
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/admin/weekly-off"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📆 Weekly Off
//             </Link>
//           </li>
//         </ul>

//         <hr className="my-4 border-white/30" />

//         <h3 className="text-lg font-semibold">Supervisor Controls</h3>
//         <ul className="space-y-2 text-sm font-semibold text-white">
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/top-performers"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               🏆 Top 3 Performers
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/attendance"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📅 Your Attendance
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/leaves"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📝 Leaves
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/weekly-off"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📆 Weekly Off
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/leaves/request-leave"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ➕ Request New Leave
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/break-time"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ⏱️ Break Time
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/my-tasks"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📋 Assign Tasks
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/supervisor-dashboard/user/policy"
//               className="hover:text-yellow-300 block"
//               onClick={() => setSidebarOpen(false)}
//             >
//               📜 Policy
//             </Link>
//           </li>
//         </ul>
//       </div>

//       <button
//         onClick={initiateLogout}
//         className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow font-semibold"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default SupervisorSidebar;

//--------------------grok---------------
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function apiOrigin() {
  const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  return api.replace(/\/api\/?$/, "");
}

function buildPhotoUrl(photo) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  return `${apiOrigin()}/uploads/${photo}`;
}

const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${API_BASE}/employees`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const responseData = response.data;

        if (responseData?.status === "success" && Array.isArray(responseData.data)) {
          const emp = responseData.data.find((e) => String(e.userId) === String(user._id));
          if (emp) {
            setEmployee(emp);
            localStorage.setItem("employee", JSON.stringify(emp));
          } else {
            console.warn("No matching employee found for user ID:", user._id);
          }
        } else {
          console.warn("Unexpected response structure:", responseData);
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    const fetchLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const empId = employee?._id || localStorage.getItem("employeeId");
        if (!empId) {
          console.warn("No employee ID available for fetching login status");
          return;
        }
        const response = await axios.get(`${API_BASE}/hours/today/${empId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setLoginStatus({
          isOnBreak: data.isOnBreak || false,
          breakStatus: data.breakStatus || "Unknown",
          workedHours: data.workedHoursToday || 0,
          attendanceStatus: data.attendanceStatus || "present",
        });
      } catch (err) {
        console.error("Error fetching login status:", err);
        setLoginStatus({ isOnBreak: false, breakStatus: "Unknown", workedHours: 0, attendanceStatus: "present" });
      }
    };

    if (user?._id) fetchEmployee();
    if (employee?._id) fetchLoginStatus();
  }, [user?._id, employee?._id]);

  const initiateLogout = () => {
    localStorage.setItem('lastLogoutTime', new Date().toISOString());
    localStorage.clear();
    alert("✅ You have successfully logged out.");
    navigate("/login");
  };

  const display = {
    name: employee?.name ?? "Supervisor",
    email: employee?.email ?? user?.email ?? "supervisor@example.com",
    role: employee?.role ?? "Supervisor",
    employeeId: employee?._id ?? "N/A",
    userId: employee?.userId ?? user?._id ?? "N/A",
    dateOfJoining: employee?.dateOfJoining ?? null,
    photoUrl: buildPhotoUrl(employee?.photo ?? ""),
    loginStatus: loginStatus?.isOnBreak
      ? "On Break"
      : loginStatus?.attendanceStatus === "half-day"
      ? "Half Day"
      : loginStatus?.attendanceStatus === "absent"
      ? "Absent"
      : "Logged In",
  };

  return (
    <div
      className={`fixed md:relative z-40 md:z-0 w-64 min-h-screen bg-[#72819a] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {display.photoUrl && (
        <img
          src={display.photoUrl}
          alt={display.name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover"
        />
      )}

      <h2 className="text-xl font-bold text-center">{display.name}</h2>
      <p className="text-sm text-center text-white/80">{display.email}</p>

      <div className="w-full mt-6 space-y-2 text-sm">
        <p><span className="font-semibold">📌 Post:</span> {display.role}</p>
        <p><span className="font-semibold">🆔 Employee ID:</span> {display.employeeId}</p>
        <p><span className="font-semibold">🔑 User ID:</span> {display.userId}</p>
        <p><span className="font-semibold">📅 Date of Joining:</span>{display.dateOfJoining ? new Date(display.dateOfJoining).toLocaleDateString("en-GB") : "N/A"}</p>
        <p><span className="font-semibold">🔐 Login Status:</span> {display.loginStatus}</p>

        <hr className="my-4 border-white/30" />

        <h3 className="text-lg font-semibold">Admin Controls</h3>
        <ul className="space-y-2 text-sm font-semibold text-white">
          <li><Link to="/supervisor-dashboard/admin/employees" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>👥 Employees</Link></li>
          <li><Link to="/supervisor-dashboard/admin/login-status" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>✅ Login Status</Link></li>
          <li><Link to="/supervisor-dashboard/admin/attendance" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📅 Attendance</Link></li>
          <li><Link to="/supervisor-dashboard/admin/tasks" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📅 Tasks</Link></li>
          <li><Link to="/supervisor-dashboard/admin/leave" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📝 Leave</Link></li>
          <li><Link to="/supervisor-dashboard/admin/weekly-off" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📆 Weekly Off</Link></li>
        </ul>

        <hr className="my-4 border-white/30" />

        <h3 className="text-lg font-semibold">Supervisor Controls</h3>
        <ul className="space-y-2 text-sm font-semibold text-white">
          <li><Link to="/supervisor-dashboard/user/top-performers" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>🏆 Top 3 Performers</Link></li>
          <li><Link to="/supervisor-dashboard/attendance" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📅 Your Attendance</Link></li>
          <li><Link to="/supervisor-dashboard/user/leaves" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📝 Leaves</Link></li>
          <li><Link to="/supervisor-dashboard/user/weekly-off" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📆 Weekly Off</Link></li>
          <li><Link to="/supervisor-dashboard/user/leaves/request-leave" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>➕ Request New Leave</Link></li>
          <li><Link to="/supervisor-dashboard/user/break-time" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>⏱️ Break Time</Link></li>
          <li><Link to="/supervisor-dashboard/user/my-tasks" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📋 Assign Tasks</Link></li>
          <li><Link to="/supervisor-dashboard/user/policy" className="hover:text-yellow-300 block" onClick={() => setSidebarOpen(false)}>📜 Policy</Link></li>
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

export default SupervisorSidebar;

































//=====================

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// function apiOrigin() {
//   const api = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
//   return api.replace(/\/api\/?$/, "");
// }

// function buildPhotoUrl(photo) {
//   if (!photo) return "";
//   if (photo.startsWith("http")) return photo;
//   return `${apiOrigin()}/uploads/${photo}`;
// }

// const SupervisorSidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const { data } = await axios.get(`${API_BASE}/employees`);
//         if (data?.status === "success" && Array.isArray(data.data)) {
//           const emp = data.data.find((e) => String(e.userId) === String(user._id));
//           if (emp) {
//             setEmployee(emp);
//             localStorage.setItem("employee", JSON.stringify(emp));
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching employee data", err);
//       }
//     };
//     if (user?._id) {
//       fetchEmployee();
//     }
//   }, [user?._id]);

//   const initiateLogout = () => {
//     localStorage.clear();
//     alert("✅ You have successfully logged out.");
//     navigate("/login");
//   };

//   const display = {
//     name: employee?.name ?? "Supervisor",
//     email: employee?.email ?? user?.email ?? "supervisor@example.com",
//     role: employee?.role ?? "Supervisor",
//     employeeId: employee?._id ?? "N/A",
//     userId: employee?.userId ?? user?._id ?? "N/A",
//     dateOfJoining: employee?.dateOfJoining ?? null,
//     photoUrl: buildPhotoUrl(employee?.photo ?? ""),
//   };

//   return (
//     <div
//       className={`fixed md:relative z-40 md:z-0 w-64 min-h-screen bg-gradient-to-b from-[#2c3e50] to-[#4a6491] text-white px-6 py-8 shadow-xl flex flex-col items-center transition-all duration-300 transform ${
//         sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//       }`}
//       style={{ fontFamily: "'Poppins', sans-serif" }}
//     >
//       {/* Profile Section */}
//       <div className="flex flex-col items-center mb-8">
//         {display.photoUrl && (
//           <img
//             src={display.photoUrl}
//             alt={display.name}
//             className="w-28 h-28 rounded-full border-4 border-white/30 shadow-lg mb-4 object-cover hover:border-white/60 transition-all duration-300"
//           />
//         )}

//         <h2 className="text-2xl font-bold text-center text-white tracking-wide">
//           {display.name}
//         </h2>
//         <p className="text-sm text-center text-white/80 mt-1 font-light">
//           {display.email}
//         </p>
//       </div>

//       {/* Info Section */}
//       <div className="w-full mb-6 space-y-3 text-sm bg-white/10 p-4 rounded-lg backdrop-blur-sm">
//         <p className="flex items-center">
//           <span className="font-medium mr-2">📌</span> 
//           <span>{display.role}</span>
//         </p>
//         <p className="flex items-center">
//           <span className="font-medium mr-2">🆔</span> 
//           <span>{display.employeeId}</span>
//         </p>
//         <p className="flex items-center">
//           <span className="font-medium mr-2">🔑</span> 
//           <span>{display.userId}</span>
//         </p>
//         <p className="flex items-center">
//           <span className="font-medium mr-2">📅</span>
//           <span>
//             {display.dateOfJoining
//               ? new Date(display.dateOfJoining).toLocaleDateString("en-GB")
//               : "N/A"}
//           </span>
//         </p>
//       </div>

//       {/* Navigation Sections */}
//       <div className="w-full flex-1 overflow-y-auto custom-scrollbar">
//         {/* Admin Controls */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-white/20 tracking-wide">
//             Admin Controls
//           </h3>
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/employees"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">👨‍💼</span>
//                 <span>Employees</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/login-status"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">✅</span>
//                 <span>Login Status</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/attendance"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📅</span>
//                 <span>Attendance</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/tasks"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📝</span>
//                 <span>Tasks</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/leave"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📋</span>
//                 <span>Leave</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/admin/weekly-off"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📆</span>
//                 <span>Weekly Off</span>
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Supervisor Controls */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-white/20 tracking-wide">
//             Supervisor Controls
//           </h3>
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/top-performers"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">🏆</span>
//                 <span>Top 3 Performers</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/attendance"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📊</span>
//                 <span>Your Attendance</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/leaves"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📅</span>
//                 <span>Leaves</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/weekly-off"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">⏸️</span>
//                 <span>Weekly Off</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/leaves/request-leave"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">➕</span>
//                 <span>Request New Leave</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/my-tasks"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📋</span>
//                 <span>Assign Tasks</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/supervisor-dashboard/user/policy"
//                 className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <span className="mr-2 group-hover:scale-110 transition-transform">📜</span>
//                 <span>Policy</span>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={initiateLogout}
//         className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-lg shadow-md font-medium tracking-wide transition-all duration-300 flex items-center justify-center"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5 mr-2"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//           />
//         </svg>
//         Logout
//       </button>
//     </div>
//   );
// };

// export default SupervisorSidebar;



//