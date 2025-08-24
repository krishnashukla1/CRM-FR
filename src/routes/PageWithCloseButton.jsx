// // components/PageWithCloseButton.jsx
// import { useNavigate } from 'react-router-dom';

// const PageWithCloseButton = ({ title, children }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative bg-white p-4 md:p-6 rounded-xl shadow-md">
//       <button
//         onClick={() => navigate('/user-dashboard')}
//         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//         aria-label="Close"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>
      
//       <h2 className="text-xl font-semibold mb-4">{title}</h2>
//       {children}
//     </div>
//   );
// };

// export default PageWithCloseButton;


//=============
// import { useNavigate } from 'react-router-dom';

// const PageWithCloseButton = ({ title, children }) => {
//   const navigate = useNavigate();

//   const handleClose = () => {
//     // Navigate to the parent route (user-dashboard)
//     navigate('/user-dashboard');
//   };

//   return (
//     <div className="relative bg-white p-4 md:p-6 rounded-xl shadow-md">
//       <button
//         onClick={handleClose}
//         className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         aria-label="Close"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>
      
//       <h2 className="text-xl font-semibold mb-4">{title}</h2>
//       {children}
//     </div>
//   );
// };

// export default PageWithCloseButton;

// ==============================

import { useNavigate } from 'react-router-dom';

const PageWithCloseButton = ({ title, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleClose = () => {
    // Navigate to the parent route (user-dashboard)
    navigate('/user-dashboard');
  };

  return (
    <div className="relative bg-white p-4 md:p-6 rounded-xl shadow-md">
      {/* Show close button only if NOT supervisor */}
      {user?.role !== "supervisor" && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default PageWithCloseButton;
