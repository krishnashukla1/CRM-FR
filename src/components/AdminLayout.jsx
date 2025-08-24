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
      <main className="flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;


//---------------

/*

import Sidebar from './SideBar';
import { Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  // Define routes where sidebar should be hidden
  const hideSidebarRoutes = [
    '/call-logs', 
    '/performance',
    '/admin-login-status',
    '/admin-reset-password',
    '/employees',
    '/attendance',
    '/leave',
    '/tasks',
    '/weekly-off',
  ];



  // Show sidebar on all routes EXCEPT those in hideSidebarRoutes
  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <main className="flex-1 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

*/
