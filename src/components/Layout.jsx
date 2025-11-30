// import { useState } from 'react';
// import Sidebar from './SideBar';
// import MobileMenuToggle from './MobileMenuToggle';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex bg-[#e4e8ef] min-h-screen w-full overflow-x-hidden">
//       {/* Hamburger for Mobile */}
//       <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)} />

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 z-40 md:relative md:flex-shrink-0 md:translate-x-0 bg-[#72819a] w-64 h-full transition-transform duration-300 ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <Sidebar />
//       </div>

//       {/* Content */}
//       <main className="flex-1 min-w-0 p-4 md:ml-0">{children}</main>
//     </div>
//   );
// };

// export default Layout;

//======================stop scrolling of sidebar================================

import { useState } from 'react';
import Sidebar from './SideBar';
import MobileMenuToggle from './MobileMenuToggle';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#e4e8ef] min-h-screen w-full overflow-x-hidden">

      {/* Mobile Hamburger */}
      <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 
          w-64 h-screen 
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default Layout;
