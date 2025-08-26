
// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import UserDashboard from './pages/userDashboard';
// // import UserDashboard from './pages/a';
// import AdminLayout from './components/AdminLayout';
// import Attendance from './pages/Attendance';
// import Leave from './pages/Leave';
// import Tasks from './pages/Tasks';
// import Employees from './pages/Employees';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import Logout from './components/Logout';
// import DailyReport from './pages/DailyReports';
// import WeeklyOffAdmin from './components/WeeklyOffRosterAdmin'
// import AllCallLogs from './components/AllCallLogs'
// import Performance from './components/Performance'
// import AdminLoginStatus from './components/AdminLoginStatus';
// import AdminPasswordReset from './components/AdminPasswordReset';
// import Unauthorized from './components/Unauthorized';
// import PreLogoutReport from './components2/PreLogoutReport'
// import AdminSidebar from './components/SideBar'
// // import AdminDashboard from './components/DashboardCards'
// import AdminDashboard from './pages/Dashboard'




// import TopPerformance from './routes/TopPerformance';
// import UserAttendance from './routes/Attendance';
// import Leaves from './routes/Leaves';
// import RequestLeaves from './routes/RequestLeave';
// import SalaryDetails from './routes/SalaryDetails';
// import WeeklyOff from './routes/WeeklyOff';
// import BreakTime from './routes/BreakTime';
// import EmployeeTasks from './routes/EmployeeTasks'
// import Policy from './routes/Policy'


// import SupervisorDashboard from './pages/SupervisorDashboard';
// import SupervisorAttendance from './pages/SupervisorAttendance';
// import SupervisorSidebar from './pages/SupervisorSidebar';
// import SupervisorLayout from './pages/SupervisorLayout'


// // Protected Route Wrapper
// const ProtectedRoute = ({ roleRequired }) => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roleRequired && role !== roleRequired) {
//     return <Navigate to={role === 'admin' ? '/dashboard' : '/user-dashboard'} replace />;
//   }

//   return <Outlet />;
// };

// const App = () => {
//   const user = JSON.parse(localStorage.getItem('user')); // ← define user here safely
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />

//         {/* Redirect root based on role */}
//         {/* <Route
//           path="/"
//           element={
//             localStorage.getItem('token')
//               ? localStorage.getItem('role') === 'admin'
//                 ? <Navigate to="/dashboard" replace />
//                 : <Navigate to="/user-dashboard" replace />
//               : <Navigate to="/login" replace />
//           }
//         /> */}



//         <Route
//           path="/"
//           element={
//             localStorage.getItem('token')
//               ? localStorage.getItem('role') === 'admin'
//                 ? <Navigate to="/dashboard" replace />
//                 : localStorage.getItem('role') === 'supervisor'
//                   ? <Navigate to="/supervisor-dashboard" replace />
//                   : <Navigate to="/user-dashboard" replace />
//               : <Navigate to="/login" replace />
//           }
//         />


//         {/* Admin-only routes */}
//         {/* <Route element={<ProtectedRoute roleRequired="admin" />}>
//           <Route element={<AdminLayout />}> </Route>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/call-logs" element={<AllCallLogs />} />
//             <Route path="/attendance" element={<Attendance />} />
//             <Route path="/leave" element={<Leave />} />
//             <Route path="/tasks" element={<Tasks />} />
//             <Route path="/employees" element={<Employees />} />
//             <Route path="/weekly-off" element={<WeeklyOffAdmin />} />
//         </Route> */}


//         <Route element={<ProtectedRoute roleRequired="admin" />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/call-logs" element={<AllCallLogs />} />
//             <Route path="/performance" element={<Performance />} />
//             <Route path="/admin-login-status" element={<AdminLoginStatus />} />
//             {/* <Route path="/admin-reset-password" element={<AdminPasswordReset />} /> */}
//             <Route
//               path="/admin-reset-password"
//               element={user?.email === 'fbadmin@gmail.com' ? <AdminPasswordReset /> : <Navigate to="/unauthorized" />}
//             />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/attendance" element={<Attendance />} />
//             <Route path="/leave" element={<Leave />} />
//             <Route path="/tasks" element={<Tasks />} />
//             <Route path="/employees" element={<Employees />} />
//             <Route path="/weekly-off" element={<WeeklyOffAdmin />} />
//           </Route>
//         </Route>





//         {/* Supervisor-only routes */}
//         {/* <Route element={<ProtectedRoute roleRequired="supervisor" />}>
//           <Route
//             path="/supervisor-dashboard"
//             element={
//               <div className="flex">
//                 <SupervisorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//                 <SupervisorDashboard />
//               </div>
//             }
//           >
//             <Route path="top-performers" element={<TopPerformance />} />
//             <Route path="attendance" element={<UserAttendance />} />
//             <Route path="leaves" element={<Leaves />} />
//             <Route path="weekly-off" element={<WeeklyOff />} />
//             <Route path="salary" element={<SalaryDetails />} />
//             <Route path="request-leave" element={<RequestLeaves />} />
//             <Route path="break-time" element={<BreakTime />} />
//             <Route path="my-tasks" element={<EmployeeTasks />} />
//             <Route path="policy" element={<Policy />} />
//           </Route>
//         </Route> */}


//         <Route element={<ProtectedRoute roleRequired="supervisor" />}>
//           <Route
//             path="/supervisor-dashboard"
//             element={
//               <div className="flex">
//                 <SupervisorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//                 <SupervisorDashboard /> {/* This contains <Outlet context={...} /> */}
//               </div>
//             }
//           >

//              {/* Admin routes inside supervisor dashboard */}

//             <Route path="dashboard" element={<Dashboard />} />
//             {/* <Route path="call-logs" element={<AllCallLogs />} /> */}
//             <Route path="employees" element={<Employees />} />
//             <Route path="admin-login-status" element={<AdminLoginStatus />} />
//             <Route path="performance" element={<Performance />} />
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="tasks" element={<Tasks />} />
//             <Route path="leave" element={<Leave />} />
//             <Route path="weekly-off" element={<WeeklyOffAdmin />} />



//             {/* Supervisor-specific routes */}

//             <Route path="top-performers" element={<TopPerformance />} />
//             <Route path="attendance" element={<UserAttendance />} />
//             <Route path="leaves" element={<Leaves />} />
//             <Route path="weekly-off" element={<WeeklyOff />} />
//             <Route path="salary" element={<SalaryDetails />} />
//             <Route path="request-leave" element={<RequestLeaves />} />
//             <Route path="break-time" element={<BreakTime />} />
//             <Route path="my-tasks" element={<EmployeeTasks />} />
//             <Route path="policy" element={<Policy />} />



//           </Route>
//         </Route>

//         {/* Admin Routes */}
//         <Route element={<ProtectedRoute roleRequired="supervisor" />}>
//           <Route
//             path="/admin-dashboard"
//             element={
//               <div className="flex">
//                 <AdminSidebar /> {/* Only admin sidebar here */}
//                 <AdminDashboard /> {/* Contains <Outlet /> for admin routes */}
//               </div>
//             }
//           >
//             {/* Admin routes */}
//           </Route>
//         </Route>








//         {/* User-only route */}
//         <Route element={<ProtectedRoute roleRequired="user" />}>
//           {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
//           {/* <Route path="/user-dashboard/*" element={<UserDashboard />} /> */}


//           <Route path="/user-dashboard" element={<UserDashboard />}>
//             <Route path="top-performers" element={<TopPerformance />} />
//             <Route path="attendance" element={<UserAttendance />} />
//             <Route path="leaves" element={<Leaves />} />
//             <Route path="weekly-off" element={<WeeklyOff />} />
//             <Route path="salary" element={<SalaryDetails />} />
//             <Route path="request-leave" element={<RequestLeaves />} />
//             <Route path="break-time" element={<BreakTime />} />
//             <Route path="my-tasks" element={<EmployeeTasks />} />
//             <Route path="policy" element={<Policy />} />
//           </Route>
//         </Route>

//         {/* Fallback route */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//         <Route path="/daily-report" element={<DailyReport />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/pre-logout-report" element={<PreLogoutReport />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

//============================




// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import Dashboard from './pages/Dashboard';
// import UserDashboard from './pages/userDashboard';
// import AdminLayout from './components/AdminLayout';
// import Attendance from './pages/Attendance';
// import Leave from './pages/Leave';
// import Tasks from './pages/Tasks';
// import Employees from './pages/Employees';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import Logout from './components/Logout';
// import DailyReport from './pages/DailyReports';
// import WeeklyOffAdmin from './components/WeeklyOffRosterAdmin';
// import AllCallLogs from './components/AllCallLogs';
// import Performance from './components/Performance';
// import AdminLoginStatus from './components/AdminLoginStatus';
// import AdminPasswordReset from './components/AdminPasswordReset';
// import Unauthorized from './components/Unauthorized';
// import PreLogoutReport from './components2/PreLogoutReport';
// import AdminSidebar from './components/SideBar';
// import AdminDashboard from './pages/Dashboard';
// import SupervisorDashboard from './pages/SupervisorDashboard';
// import SupervisorSidebar from './pages/SupervisorSidebar';
// import SupervisorLayout from './pages/SupervisorLayout'; // Updated import
// import TopPerformance from './routes/TopPerformance';
// import UserAttendance from './routes/Attendance';
// import Leaves from './routes/Leaves';
// import RequestLeaves from './routes/RequestLeave';
// import SalaryDetails from './routes/SalaryDetails';
// import WeeklyOff from './routes/WeeklyOff';
// import BreakTime from './routes/BreakTime';
// import EmployeeTasks from './routes/EmployeeTasks';
// import Policy from './routes/Policy';

// // Protected Route Wrapper
// const ProtectedRoute = ({ roleRequired }) => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (roleRequired && role !== roleRequired) {
//     return (
//       <Navigate
//         to={
//           role === 'admin'
//             ? '/dashboard'
//             : role === 'supervisor'
//               ? '/supervisor-dashboard'
//               : '/user-dashboard'
//         }
//         replace
//       />
//     );
//   }

//   return <Outlet />;
// };

// const App = () => {
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/daily-report" element={<DailyReport />} />
//         <Route path="/pre-logout-report" element={<PreLogoutReport />} />

//         {/* Root redirect based on role */}
//         <Route
//           path="/"
//           element={
//             localStorage.getItem('token') ? (
//               localStorage.getItem('role') === 'admin' ? (
//                 <Navigate to="/dashboard" replace />
//               ) : localStorage.getItem('role') === 'supervisor' ? (
//                 <Navigate to="/supervisor-dashboard" replace />
//               ) : (
//                 <Navigate to="/user-dashboard" replace />
//               )
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />

//         {/* Admin routes under AdminLayout */}
//         <Route element={<ProtectedRoute roleRequired="admin" />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/call-logs" element={<AllCallLogs />} />
//             <Route path="/performance" element={<Performance />} />
//             <Route path="/admin-login-status" element={<AdminLoginStatus />} />
//             <Route
//               path="/admin-reset-password"
//               element={
//                 user?.email === 'fbadmin@gmail.com' ? (
//                   <AdminPasswordReset />
//                 ) : (
//                   <Navigate to="/unauthorized" replace />
//                 )
//               }
//             />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/attendance" element={<Attendance />} />
//             <Route path="/leave" element={<Leave />} />
//             <Route path="/tasks" element={<Tasks />} />
//             <Route path="/employees" element={<Employees />} />
//             <Route path="/weekly-off" element={<WeeklyOffAdmin />} />
//           </Route>
//         </Route>

//         {/* Supervisor routes */}
//         <Route element={<ProtectedRoute roleRequired="supervisor" />}>
//           <Route
//             path="/supervisor-dashboard"
//             element={<SupervisorLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
//           >


//             {/* Admin-related routes for supervisors */}
//             <Route path="admin/dashboard" element={<Dashboard />} />
//             <Route path="admin/employees" element={<Employees />} />
//             <Route path="admin/login-status" element={<AdminLoginStatus />} />
//             <Route path="admin/performance" element={<Performance />} />
//             <Route path="admin/attendance" element={<Attendance />} />
//             <Route path="admin/tasks" element={<Tasks />} />
//             <Route path="admin/leave" element={<Leave />} />
//             <Route path="admin/weekly-off" element={<WeeklyOffAdmin />} />

//             {/* Supervisor-specific (user-related) routes */}
//             <Route path="user/top-performers" element={<TopPerformance />} />
//             <Route path="user/attendance" element={<UserAttendance />} />
//             <Route path="user/leaves" element={<Leaves />} />
//             <Route path="user/weekly-off" element={<WeeklyOff />} />
//             <Route path="user/salary" element={<SalaryDetails />} />
//             <Route path="user/request-leave" element={<RequestLeaves />} />
//             <Route path="user/break-time" element={<BreakTime />} />
//             <Route path="user/my-tasks" element={<EmployeeTasks />} />
//             <Route path="user/policy" element={<Policy />} />
//           </Route>
//         </Route>



//         {/* Admin dashboard routes (standalone) */}
//         <Route element={<ProtectedRoute roleRequired="admin" />}>
//           <Route
//             path="admin-dashboard"
//             element={
//               <div className="flex">
//                 {/* <AdminDashboard /> */}
//               </div>
//             }
//           >


//             <Route path="dashboard" element={<Dashboard />} />
//             <Route path="call-logs" element={<AllCallLogs />} />
//             <Route path="performance" element={<Performance />} />
//             <Route path="login-status" element={<AdminLoginStatus />} />
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="tasks" element={<Tasks />} />
//             <Route path="leave" element={<Leave />} />
//             <Route path="employees" element={<Employees />} />
//             <Route path="weekly-off" element={<WeeklyOffAdmin />} />
//           </Route>
//         </Route>

//         {/* User routes */}
//         <Route element={<ProtectedRoute roleRequired="user" />}>
//           <Route path="/user-dashboard" element={<UserDashboard />}>
//             <Route path="top-performers" element={<TopPerformance />} />
//             <Route path="attendance" element={<UserAttendance />} />
//             <Route path="leaves" element={<Leaves />} />
//             <Route path="weekly-off" element={<WeeklyOff />} />
//             <Route path="salary" element={<SalaryDetails />} />
//             <Route path="request-leave" element={<RequestLeaves />} />
//             <Route path="break-time" element={<BreakTime />} />
//             <Route path="my-tasks" element={<EmployeeTasks />} />
//             <Route path="policy" element={<Policy />} />
//           </Route>
//         </Route>

//         {/* Fallback route */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

//==========================================

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/userDashboard';
import AdminLayout from './components/AdminLayout';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Logout from './components/Logout';
import DailyReport from './pages/DailyReports';
import WeeklyOffAdmin from './components/WeeklyOffRosterAdmin';
import AllCallLogs from './components/AllCallLogs';
import Performance from './components/Performance';
import AdminLoginStatus from './components/AdminLoginStatus';
import AdminPasswordReset from './components/AdminPasswordReset';
// import Unauthorized from './components/Unauthorized';
import PreLogoutReport from './components2/PreLogoutReport';
import TopPerformance from './routes/TopPerformance';
import UserAttendance from './routes/Attendance';
import Leaves from './routes/Leaves';
import RequestLeaves from './routes/RequestLeave';
import SalaryDetails from './routes/SalaryDetails';
import WeeklyOff from './routes/WeeklyOff';
import BreakTime from './routes/BreakTime';
import EmployeeTasks from './routes/EmployeeTasks';
import Policy from './routes/Policy';




import SupervisorAttendance from './component3/SupervisorAttendance';
import SupervisorLayout from './component3/SupervisorLayout';
import SupervisorDashboard from './component3/SupervisorDashboard'
import LeavesLayout from './component3/SuperLeavesLayout'

import SuperAttendance from './component3/SuperAttendance'
import SuperEmployees from './component3/SuperEmployees'
import SuperTasks from './component3/SuperTasks'
import SuperWeeklyOff from './component3/SuperWeeklyOff'
import SuperLeave from './component3/SuperLeave'
import SuperLoginStatus from './component3/SuperLoginStatus'
import SupervisorBreakTime from './component3/SupervisorBreakTime'

// Protected Route Wrapper
const ProtectedRoute = ({ roleRequired }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    return (
      <Navigate
        to={
          role === 'admin'
            ? '/dashboard'
            : role === 'supervisor'
              ? '/supervisor-dashboard'
              : '/user-dashboard'
        }
        replace
      />
    );
  }

  return <Outlet />;
};

const App = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/daily-report" element={<DailyReport />} />
        <Route path="/pre-logout-report" element={<PreLogoutReport />} />

        {/* Root redirect based on role */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              localStorage.getItem('role') === 'admin' ? (
                <Navigate to="/dashboard" replace />
              ) : localStorage.getItem('role') === 'supervisor' ? (
                <Navigate to="/supervisor-dashboard" replace />
              ) : (
                <Navigate to="/user-dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* =======================================ADMIN======================================= */}
        {/* Admin routes under AdminLayout */}
        <Route element={<ProtectedRoute roleRequired="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/call-logs" element={<AllCallLogs />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/admin-login-status" element={<AdminLoginStatus />} />
            {/* <Route
              path="/admin-reset-password"
              element={
                user?.email === 'abc@gmail.com' ? (
                  <AdminPasswordReset />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              }
            /> */}

            <Route path="/admin-reset-password" element={<AdminPasswordReset />} />



            {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/weekly-off" element={<WeeklyOffAdmin />} />
          </Route>
        </Route>
        {/* =======================================SUPERVISOR======================================= */}

        {/* Supervisor routes under SupervisorLayout */}
        <Route element={<ProtectedRoute roleRequired="supervisor" />}>
          <Route
            path="/supervisor-dashboard"
            element={<SupervisorLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
          >
            <Route index element={<SupervisorDashboard />} />
            <Route path="admin/employees" element={<SuperEmployees />} />
            <Route path="admin/login-status" element={<SuperLoginStatus />} />
            {/* <Route path="performance" element={<SuperPerformance />} /> */}
            <Route path="admin/attendance" element={<SuperAttendance />} />
            <Route path="admin/tasks" element={<SuperTasks />} />
            <Route path="admin/leave" element={<SuperLeave />} />
            <Route path="admin/weekly-off" element={<SuperWeeklyOff />} />


            {/* Supervisor-specific (user-related) routes */}
            <Route path="user/top-performers" element={<TopPerformance />} />
            <Route path="attendance" element={<SupervisorAttendance />} />
            <Route path="user/leaves" element={<Leaves />} />
            <Route path="/supervisor-dashboard/user/leaves" element={<Leaves />} />
            <Route path="user/weekly-off" element={<WeeklyOff />} />
            <Route path="/supervisor-dashboard/user/leaves" element={<LeavesLayout />}>
              <Route path="request-leave" element={<RequestLeaves />} />
            </Route>
            <Route path="user/my-tasks" element={<EmployeeTasks />} />
            <Route path="user/policy" element={<Policy />} />


            {/* <Route path="user/attendance" element={<UserAttendance />} /> */}
            {/* <Route path="user/salary" element={<SalaryDetails />} /> */}
            {/* <Route path="/supervisor-dashboard/user/salary" element={<SalaryDetails />} /> */}
            {/* <Route path="user/break-time" element={<BreakTime />} /> */}

           
<Route path="/supervisor-dashboard/user/break-time" element={<SupervisorBreakTime />} />


          </Route>
        </Route>

        {/* =======================================USER======================================= */}

        {/* User routes */}
        <Route element={<ProtectedRoute roleRequired="user" />}>
          <Route path="/user-dashboard" element={<UserDashboard />}>
            <Route path="top-performers" element={<TopPerformance />} />
            <Route path="attendance" element={<UserAttendance />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="weekly-off" element={<WeeklyOff />} />
            <Route path="salary" element={<SalaryDetails />} />
            <Route path="request-leave" element={<RequestLeaves />} />
            <Route path="break-time" element={<BreakTime />} />
            <Route path="my-tasks" element={<EmployeeTasks />} />
            <Route path="policy" element={<Policy />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

//==============================

