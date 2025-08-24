
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import DashboardCards from '../components/DashboardCards';
import AttendanceChart from '../components/AttendanceChart';
import SalesChart from '../components/SalesChart';
import EmployeeOfMonth from '../components/EmployeeOfMonths';
import RecentLeaves from '../components/RecentLeaves';
import TaskOverview from '../components/TaskOverview';
import CallSummary from '../components/CallSummary';
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [logoutMessage, setLogoutMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('role');
  //   localStorage.removeItem('userId');
  //   localStorage.removeItem('user');
  //   setLogoutMessage('✅ You have successfully logged out.');
  //   setTimeout(() => {
  //     navigate('/login');
  //   }, 2000);
  // };

  return (
    <div className="flex min-h-screen w-full bg-[#92b7f8] text-white overflow-x-hidden">
      {/* Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 bg-[#72819a] w-64 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        {/* <Sidebar /> */}
        <Sidebar setLogoutMessage={setLogoutMessage} />

      </div>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 min-w-0">
        {/* Logout Message */}
        {logoutMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded shadow-md z-50 text-sm font-medium">
            {logoutMessage}
          </div>
        )}

        {/* Logout Button */}

        {/* <button
          onClick={handleLogout}
          className="fixed top-4 sm:top-5 right-2 sm:right-6 md:right-8 lg:right-15 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded z-40"
        >
          Logout
        </button> */}

        {/* Welcome */}
        <div className="mt-16 md:mt-0">
          <h1 className="text-center text-2xl sm:text-3xl bg-gradient-to-r from-green-200 via-green to-green-200 text-black inline-block px-6 py-2 rounded">
            Welcome Admin
          </h1>


        </div>
        {/* Call Summary */}
        <CallSummary />
        <SalesChart />
        <TaskOverview />
        <EmployeeOfMonth />


        {/* Summary Cards */}
        <DashboardCards />

        {/* Charts Row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        <div>

          <AttendanceChart />
          {/* <SalesChart /> */}
        </div>
        {/* <SalesChart /> */}

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <EmployeeOfMonth /> */}
          <RecentLeaves />
          {/* <TaskOverview /> */}
        </div>

        {/* Call Summary */}
        {/* <CallSummary /> */}
      </main>
    </div>
  );
};

export default Dashboard;