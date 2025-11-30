import Sidebar from './SideBar';
import { Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  // Hide sidebar only on /call-logs route
  // const shouldHideSidebar = location.pathname === '/call-logs';
  const shouldHideSidebar = ['/call-logs', '/performance','/admin-login-status','/admin-reset-password'].includes(location.pathname);


  return (
    <div className="flex">
      {shouldHideSidebar && <Sidebar />}
      {/* {!shouldHideSidebar && <Sidebar />} */}
      <main className="flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

