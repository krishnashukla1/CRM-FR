import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
const Logout = ({ onLogout, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');

    // Notify parent component
    // if (onLogout) {
    //   onLogout('✅ You have successfully logged out.');

    // }

    if (onLogout) {
      onLogout(<div className="px-4 py-3 font-medium text-center text-white bg-blue-500 rounded shadow-lg">
        ✅ You have successfully logged out.
      </div>);

    }
    //-------------------------or-----------------------
    //     if (onLogout) {
    //   onLogout(
    //     <div className="px-12 py-8 text-4xl font-extrabold text-center text-green-200 bg-black shadow-2xl bg-opacity-80 rounded-2xl">
    //       ✅ You have successfully logged out.
    //     </div>
    //   );
    // }
    //--------------------------or----------------------
    // if (onLogout) {
    //   onLogout(
    //     <div className="fixed inset-0 z-50 flex items-center justify-center">
    //       <div className="px-10 py-6 text-3xl font-bold text-green-700 bg-white border border-gray-300 shadow-lg rounded-xl">
    //         ✅ You have successfully logged out.
    //       </div>
    //     </div>
    //   );
    // }
    //------------------------or-----------------------
    // if (onLogout) {
    //   onLogout(
    //    <div className="fixed z-50 w-full max-w-md transform -translate-x-1/2 top-4 left-1/2">
    //   <div className="px-4 py-3 font-medium text-center text-white bg-green-500 rounded shadow-lg">
    //     ✅ You have successfully logged out.
    //   </div>
    // </div>

    //   );
    // }



    //----------------------------------------


    // Redirect after delay
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${className}`}
    >
      Logout
    </button>
  );
};

Logout.propTypes = {
  onLogout: PropTypes.func,
  className: PropTypes.string
};

export default Logout;
