
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/SideBar';
// import DashboardCards from '../components/DashboardCards';
// import AttendanceChart from '../components/AttendanceChart';
// import SalesChart from '../components/SalesChart';
// import EmployeeOfMonth from '../components/EmployeeOfMonths';
// import RecentLeaves from '../components/RecentLeaves';
// import TaskOverview from '../components/TaskOverview';
// import CallSummary from '../components/CallSummary';
// import { FaBars } from 'react-icons/fa';

// const Dashboard = () => {
//   const [user, setUser] = useState({});
//   const [logoutMessage, setLogoutMessage] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   // const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // const handleLogout = () => {
//   //   localStorage.removeItem('token');
//   //   localStorage.removeItem('role');
//   //   localStorage.removeItem('userId');
//   //   localStorage.removeItem('user');
//   //   setLogoutMessage('✅ You have successfully logged out.');
//   //   setTimeout(() => {
//   //     navigate('/login');
//   //   }, 2000);
//   // };

//   return (
//     // <div className="flex min-h-screen w-full bg-[#92b7f8] text-white overflow-x-hidden">
// <div className="flex min-h-screen w-full bg-gradient-to-r from-[#1e3c72] via-[#2a5298] to-[#1e3c72] text-white overflow-x-hidden">

//       {/* Hamburger Button */}
//       <button
//         className="fixed z-50 p-2 text-gray-700 bg-white rounded-md shadow-md md:hidden top-4 left-4"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//       >
//         <FaBars className="w-6 h-6" />
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 bg-[#72819a] w-64 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//           }`}
//       >
//         {/* <Sidebar /> */}
//         <Sidebar setLogoutMessage={setLogoutMessage} />

//       </div>

//       {/* Main content */}
//       <main className="flex-1 min-w-0 p-4 space-y-6 sm:p-6">
//         {/* Logout Message */}
//         {logoutMessage && (
//           <div className="fixed z-50 px-6 py-3 text-sm font-medium text-green-800 transform -translate-x-1/2 bg-green-100 rounded shadow-md top-4 left-1/2">
//             {logoutMessage}
//           </div>
//         )}

//         {/* Logout Button */}

//         {/* <button
//           onClick={handleLogout}
//           className="fixed z-40 px-4 py-2 text-white bg-red-500 rounded top-4 sm:top-5 right-2 sm:right-6 md:right-8 lg:right-15 hover:bg-red-600"
//         >
//           Logout
//         </button> */}

//         {/* Welcome */}
//         <div className="mt-16 md:mt-0">
//           <h1 className="inline-block px-6 py-2 text-2xl text-center text-black rounded sm:text-3xl bg-gradient-to-r from-green-200 via-green to-green-200">
//             Welcome Admin
//           </h1>


//         </div>
//         {/* Call Summary */}
//         <CallSummary />
//         <SalesChart />
//         <TaskOverview />
//         <EmployeeOfMonth />


//         {/* Summary Cards */}
//         <DashboardCards />

//         {/* Charts Row */}
//         {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> */}
//         <div>

//           <AttendanceChart />
//           {/* <SalesChart /> */}
//         </div>
//         {/* <SalesChart /> */}

//         {/* Bottom Section */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//           {/* <EmployeeOfMonth /> */}
//           <RecentLeaves />
//           {/* <TaskOverview /> */}
//         </div>

//         {/* Call Summary */}
//         {/* <CallSummary /> */}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


//====================correct==================


 
// import { useEffect, useState } from 'react';
// import { FaBars } from 'react-icons/fa';
// import Sidebar from '../components/SideBar';
// import DashboardCards from '../components/DashboardCards';
// import AttendanceChart from '../components/AttendanceChart';
// import SalesChart from '../components/SalesChart';
// import EmployeeOfMonth from '../components/EmployeeOfMonths';
// import RecentLeaves from '../components/RecentLeaves';
// import TaskOverview from '../components/TaskOverview';
// import CallSummary from '../components/CallSummary';
 
// const Dashboard = () => {
//   const [user, setUser] = useState({});
//   const [logoutMessage, setLogoutMessage] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
 
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
 
//   return (
//     // <div className="flex h-screen w-full bg-gradient-to-br from-[#4a90e2] via-[#92b7f8] to-[#a0c4ff] text-white overflow-hidden transition-all duration-300">
 
//     //   {/* Hamburger Button */}
//     //   <button
//     //     className="fixed z-50 p-2 text-gray-700 bg-white rounded-md shadow-md md:hidden top-4 left-4"
//     //     onClick={() => setSidebarOpen(!sidebarOpen)}
//     //   >
//     //     <FaBars className="w-6 h-6" />
//     //   </button>
 
//     //   {/* Sidebar with its own scroll */}
//     //   <div
//     //     className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 bg-[#72819a] w-65 h-screen overflow-y-auto overflow-x-hidden transition-transform duration-300
//     //       ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
//     //   >
//     //     <Sidebar setLogoutMessage={setLogoutMessage} />
//     //   </div>
 
//     //   {/* Main content with its own scroll */}
//     //   <main className="flex-1 h-screen p-4 space-y-6 overflow-x-hidden overflow-y-auto sm:p-6">
//     //     {/* Logout Message */}
//     //     {logoutMessage && (
//     //       <div className="fixed z-50 px-6 py-3 text-sm font-medium text-green-800 transform -translate-x-1/2 bg-green-100 rounded shadow-md top-4 left-1/2">
//     //         {logoutMessage}
//     //       </div>
//     //     )}
 
//     //     {/* Welcome */}
//     //     <div className="mt-16 md:mt-0">
//     //       <h1 className="inline-block px-6 py-2 text-2xl text-center text-black rounded sm:text-3xl bg-gradient-to-r from-green-200 via-green to-green-200">
//     //         Welcome Admin
//     //       </h1>
//     //     </div>
 
//     //     {/* Content Sections */}
//     //     <CallSummary />
//     //     <SalesChart />
//     //     <TaskOverview />
//     //     <EmployeeOfMonth />
//     //     <DashboardCards />
 
//     //     <div>
//     //       <AttendanceChart />
//     //     </div>
 
//     //     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//     //       <RecentLeaves />
//     //     </div>
//     //   </main>
//     // </div>

//     <div className="flex h-screen w-full bg-gradient-to-br from-[#4a90e2] via-[#92b7f8] to-[#a0c4ff] text-white">
  
//   {/* Sidebar with its own scroll */}
//   <div
//     className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 
//                 bg-[#72819a] w-65 h-screen overflow-y-auto overflow-x-hidden 
//                 transition-transform duration-300
//                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
//   >
//     <Sidebar setLogoutMessage={setLogoutMessage} />
//   </div>

//   {/* Main content with its own scroll */}
//   <main className="flex-1 h-screen p-4 space-y-6 overflow-x-hidden overflow-y-auto sm:p-6">
//     {/* Logout Message */}
//     {logoutMessage && (
//       <div className="fixed z-50 px-6 py-3 text-sm font-medium text-green-800 transform -translate-x-1/2 bg-green-100 rounded shadow-md top-4 left-1/2">
//         {logoutMessage}
//       </div>
//     )}

//     {/* Welcome */}
//     <div className="mt-16 md:mt-0">
//       <h1 className="inline-block px-6 py-2 text-2xl text-center text-black rounded sm:text-3xl bg-gradient-to-r from-green-200 via-green to-green-200">
//         Welcome Admin
//       </h1>
//     </div>

//     {/* Content Sections */}
//     <CallSummary />
//     <SalesChart />
//     <TaskOverview />
//     <EmployeeOfMonth />
//     <DashboardCards />

//     <div>
//       <AttendanceChart />
//     </div>

//     <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//       <RecentLeaves />
//     </div>
//   </main>
// </div>

//   );
// };
 
// export default Dashboard;

//=================new on 18 nov ===========


 
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/SideBar';
import DashboardCards from '../components/DashboardCards';
import AttendanceChart from '../components/AttendanceChart';
import SalesChart from '../components/SalesChart';
import EmployeeOfMonth from '../components/EmployeeOfMonths';
import RecentLeaves from '../components/RecentLeaves';
import TaskOverview from '../components/TaskOverview';
import CallSummary from '../components/CallSummary';
 
const Dashboard = () => {
  const [user, setUser] = useState({});
  const [logoutMessage, setLogoutMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
 
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#4a90e2] via-[#92b7f8] to-[#a0c4ff] text-white overflow-hidden transition-all duration-300">
 
      {/* Hamburger Button */}
      <button
        className="fixed z-50 p-2 text-gray-700 bg-white rounded-md shadow-md md:hidden top-4 left-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars className="w-6 h-6" />
      </button>
 
      {/* Sidebar with its own scroll */}
      <div
        className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 bg-[#72819a] w-65 h-screen overflow-y-auto overflow-x-hidden transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <Sidebar setLogoutMessage={setLogoutMessage} />
      </div>
 
      {/* Main content with its own scroll */}
      <main className="flex-1 h-screen p-4 space-y-6 overflow-x-hidden overflow-y-auto sm:p-6">
        {/* Logout Message */}
        {logoutMessage && (
          <div className="fixed z-50 px-6 py-3 text-sm font-medium text-green-800 transform -translate-x-1/2 bg-green-100 rounded shadow-md top-4 left-1/2">
            {logoutMessage}
          </div>
        )}
 
        {/* Welcome */}
        <div className="mt-16 md:mt-0">
          {/* <h1 className="inline-block px-6 py-2 text-2xl text-center text-black rounded sm:text-3xl bg-gradient-to-r from-green-200 via-green to-green-200">
            Welcome Admin
          </h1> */}
 
          <h1 className="inline-block px-6 py-3 text-2xl font-extrabold tracking-wide text-center text-blue-800 shadow-sm md:text-3xl bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-xl">
            Welcome Admin
          </h1>
 
        </div>
 
        {/* Content Sections */}
        <CallSummary />
        <SalesChart />
        {/* <TaskOverview /> */}
        <EmployeeOfMonth />
        <DashboardCards />
 
        <div>
          <AttendanceChart />
        </div>
 
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TaskOverview />
 
          <RecentLeaves />
        </div>
      </main>
    </div>
  );
};
 
export default Dashboard;
 

 
 