// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Logout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//     navigate('/login');
//   }, [navigate]);

//   return (
//     <div className="flex justify-center items-center h-screen text-xl">
//       Logging out...
//     </div>
//   );
// };

// export default Logout;

//============================
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if logout was successful
    const success = location.state?.logoutSuccess;
    
    if (success) {
      toast.success('Logged out successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
    }

    // Final cleanup
    localStorage.clear();
    setTimeout(() => navigate('/login'), success ? 3000 : 0);
  }, [navigate, location]);

  return (
    <div className="flex justify-center items-center h-screen text-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Completing logout process...</p>
      </div>
    </div>
  );
};

export default Logout;
