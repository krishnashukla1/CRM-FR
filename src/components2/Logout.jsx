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
    <div className="flex items-center justify-center h-screen text-xl">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p>Completing logout process...</p>
      </div>
    </div>
  );
};

export default Logout;
