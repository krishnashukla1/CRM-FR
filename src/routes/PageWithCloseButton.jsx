import { useNavigate } from 'react-router-dom';

const PageWithCloseButton = ({ title, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClose = () => {
    // Navigate to the parent route (user-dashboard)
    navigate('/user-dashboard');
  };

  return (
    <div className="relative p-4 bg-white shadow-md md:p-6 rounded-xl">
      {/* Show close button only if NOT supervisor */}
      {user?.role !== "supervisor" && (
        <button
          onClick={handleClose}
          className="absolute text-gray-500 cursor-pointer top-4 right-4 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default PageWithCloseButton;
