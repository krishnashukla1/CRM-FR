
import { FaTachometerAlt, FaUserFriends, FaLock, FaCalendarCheck, FaChartLine, FaTasks, FaBell, FaRegCalendarMinus, FaPhoneAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

import Logout from './Logout';
// const Sidebar = () => {
const Sidebar = ({ setLogoutMessage }) => {
  const items = [
    { path: '/', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { path: '/call-logs', icon: <FaPhoneAlt />, label: 'All Call Logs' },
    { path: '/performance', icon: <FaChartLine />, label: 'Performance' },
    { path: '/employees', icon: <FaUserFriends />, label: 'Employees' },
    { path: '/admin-login-status', icon: <FaCalendarCheck />, label: 'Login Status' },
    { path: '/admin-reset-password', icon: <FaLock />, label: 'Reset Password' },

    { path: '/attendance', icon: <FaCalendarCheck />, label: 'Attendance' },
    { path: '/leave', icon: <FaBell />, label: 'Leave' },
    { path: '/tasks', icon: <FaTasks />, label: 'Tasks' },
    { path: '/weekly-off', icon: <FaRegCalendarMinus />, label: 'Weekly Off' },

  ];

  return (

    <aside className="w-64 min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 shadow-xl">

      {/* Top - Logo and Nav */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-8 text-2xl font-bold tracking-wide text-center text-indigo-200">
          <img
            src="/d2.png"
            // src="/favicon.svg"

            alt="Logo"
            className="w-8 h-8 rounded-full"
          />
          FareBuzzer
        </div>
        <nav>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-gray-300'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="pt-6">
          <Logout onLogout={setLogoutMessage} className="w-full" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
