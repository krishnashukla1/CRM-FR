// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";

// const SupervisorDashboard = () => {
//   const navigate = useNavigate();

//   // Redirect to login status page on first render
//   useEffect(() => {
//     navigate("admin/login-status", { replace: true });
//   }, [navigate]);

//   // Safely retrieve employee data from localStorage
//   const employee = JSON.parse(localStorage.getItem("employee") || "{}");
//   const breakTimer = {}; 
//   const attendance = {};  

//   return (
//     <div className="flex-1 p-4">
//       <Outlet context={{ employee, breakTimer, attendance }} />
//     </div>
//   );
// };

// export default SupervisorDashboard;

//===============
// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import useAttendance from "./SupervisorUseAttendance"; // your custom hook
// import Modal from "react-modal";

// const SupervisorDashboard = () => {
//   const navigate = useNavigate();
//   const employee = JSON.parse(localStorage.getItem("employee") || "{}");
//   const { 
//     showModal, setShowModal, 
//     agree, setAgree, 
//     modalMessage, 
//     checkAttendance, 
//     markAttendance 
//   } = useAttendance();

//   useEffect(() => {
//     // Check attendance immediately after login
//     checkAttendance();
//   }, [checkAttendance]);

//   const handleProceed = async () => {
//     if (!agree) return;
//     const success = await markAttendance(employee?._id || localStorage.getItem("employeeId"));
//     if (success) {
//       setShowModal(false);
//       navigate("admin/login-status", { replace: true });
//     }
//   };

//   return (
//     <div className="flex-1 p-4">
//       <Outlet context={{ employee }} />

//       {/* Attendance Popup */}



//           <Modal
//               isOpen={showModal}
//               onRequestClose={() => setShowModal(false)}
//               contentLabel="Attendance Confirmation"
//               className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg focus:outline-none"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//             >
//               <div>
//                 <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">
//                   🕒 Mark Your Attendance
//                 </h2>
//                 <p className="text-sm text-gray-700 mb-4 leading-relaxed">
//                   {modalMessage}
//                   <br />
//                   <span className="text-red-500 font-medium block mt-2 leading-relaxed">
//                     By marking attendance, you confirm you are starting work and will aim to complete at least{' '}
//                     <strong>8 hours</strong> today.
//                     <br />
//                     Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//                   </span>

//                 </p>

//                 <label className="flex items-start gap-2 mb-4">
//                   <input
//                     type="checkbox"
//                     checked={agree}
//                     onChange={() => setAgree(!agree)}
//                     className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//                   />
//                   <span className="text-gray-800 text-sm font-medium">
//                     I agree to mark my attendance
//                   </span>
//                 </label>

//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//                   >
//                     Close
//                   </button>
//                   <button
//                     onClick={handleProceed}
//                     disabled={!agree}
//                     className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
//                       }`}
//                   >
//                     ✅ Proceed
//                   </button>
//                 </div>
//               </div>
//             </Modal>
//     </div>
//   );
// };

// export default SupervisorDashboard;

//====================correct=================================

// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import useAttendance from "./SupervisorUseAttendance"; 
// import Modal from "react-modal";

// const SupervisorDashboard = () => {
//   const navigate = useNavigate();
//   const employee = JSON.parse(localStorage.getItem("employee") || "{}");
//   const { 
//     showModal, setShowModal, 
//     agree, setAgree, 
//     modalMessage, 
//     checkAttendance, 
//     markAttendance 
//   } = useAttendance();

//   useEffect(() => {
//     // Check attendance immediately after login
//     checkAttendance();
//   }, [checkAttendance]);

//   const handleProceed = async () => {
//     if (!agree) return;
//     const success = await markAttendance(employee?._id || localStorage.getItem("employeeId"));
//     if (success) {
//       setShowModal(false);
//       navigate("admin/login-status", { replace: true });
//     }
//   };

//   const handleClose = () => {
//     // Clear session + redirect to login page
//     localStorage.removeItem("token");
//     localStorage.removeItem("employee");
//     localStorage.removeItem("employeeId");
//     setShowModal(false);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="flex-1 p-4">
//       <Outlet context={{ employee }} />

//       {/* Attendance Popup */}
//       <Modal
//         isOpen={showModal}
//         onRequestClose={handleClose}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//           <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">
//             🕒 Mark Your Attendance
//           </h2>
//           <p className="text-sm text-gray-700 mb-4 leading-relaxed">
//             {modalMessage}
//             <br />
//             <span className="text-red-500 font-medium block mt-2 leading-relaxed">
//               By marking attendance, you confirm you are starting work and will aim to complete at least{" "}
//               <strong>8 hours</strong> today.
//               <br />
//               Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//             </span>
//           </p>

//           <label className="flex items-start gap-2 mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handleClose}
//               className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${
//                 agree
//                   ? "bg-indigo-600 hover:bg-indigo-700"
//                   : "bg-indigo-300 cursor-not-allowed"
//               }`}
//             >
//               ✅ Proceed
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SupervisorDashboard;

//===========================================

// import React, { useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import useAttendance from "./SupervisorUseAttendance";
// import Modal from "react-modal";
// import axios from "axios";

// const SupervisorDashboard = () => {
//   const navigate = useNavigate();
//   const employee = JSON.parse(localStorage.getItem("employee") || "{}");
//   const {
//     showModal,
//     setShowModal,
//     agree,
//     setAgree,
//     modalMessage,
//     setModalMessage, // Add this destructuring
//     checkAttendance,
//     markAttendance
//   } = useAttendance();

//   useEffect(() => {
//     const verifyAttendance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.data?.marked) {
//           setModalMessage('Please mark your attendance for today');
//           setShowModal(true);
//         } else if (!window.location.pathname.includes('login-status')) {
//           navigate('admin/login-status', { replace: true });
//         }
//       } catch (error) {
//         console.error('Attendance verification failed:', error);
//         setModalMessage(error.response?.data?.message || 'Unable to verify attendance. Please try again.');
//         setShowModal(true);
//       }
//     };

//     verifyAttendance();
//   }, [navigate, setModalMessage, setShowModal]);

//   const handleProceed = async () => {
//     if (!agree) return;
//     const success = await markAttendance(employee?._id || localStorage.getItem("employeeId"));
//     if (success) {
//       setShowModal(false);
//       navigate("admin/login-status", { replace: true });
//     }
//   };

//   const handleClose = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("employee");
//     localStorage.removeItem("employeeId");
//     setShowModal(false);
//     navigate("/login", { replace: true });
//   };

//   return (
//     <div className="flex-1 p-4">
//       <Outlet context={{ employee }} />


//       {/* Attendance Popup */}
//       <Modal
//         isOpen={showModal}
//         onRequestClose={handleClose}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//     <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
//       🕒 Mark Your Attendance
//     </h2>
//     <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
//       By continuing, you confirm that you are starting work and will aim to complete at least{' '}
//       <strong>8 hours</strong> today.
//       <br />
//       <span className="text-red-500 font-medium block mt-1">
//         Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//       </span>
//     </p>

//           <label className="flex items-start gap-2 mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
// <button
//   onClick={handleClose}
//   className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 hover:text-gray-900 transition-colors"
// >
//   ✖ Close
// </button>

//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${agree
//                   ? "bg-indigo-400 hover:bg-indigo-700"
//                   : "bg-indigo-300 cursor-not-allowed"
//                 }`}
//             >
//               ✅ Proceed
//             </button>
//           </div>
//         </div>

//       </Modal>
//     </div>
//   );
// };

// export default SupervisorDashboard;

//----------grok------------
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAttendance from "./SupervisorUseAttendance";
import Modal from "react-modal";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

Modal.setAppElement("#root"); // Required for accessibility

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee") || "{}");
  const employeeId = employee?._id || localStorage.getItem("employeeId");

  const {
    showModal,
    setShowModal,
    agree,
    setAgree,
    modalMessage,
    setModalMessage,
    checkAttendance,
    markAttendance,
  } = useAttendance();

  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Initialize or restore login state
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!employeeId) {
        setModalMessage("No employee ID found. Please log in again.");
        setShowModal(true);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setModalMessage("Authentication token missing. Please log in again.");
          setShowModal(true);
          return;
        }

        // Verify attendance and fetch initial state
        const attendanceRes = await axios.get(`${API_BASE}/attendance/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const hoursRes = await axios.get(`${API_BASE}/hours/today/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const attendanceData = attendanceRes.data;
        const hoursData = hoursRes.data;

        // Persist or restore worked time
        const savedWorkedSeconds = localStorage.getItem("totalWorkedTime");
        if (hoursData.workedSeconds && (!savedWorkedSeconds || parseInt(savedWorkedSeconds, 10) < hoursData.workedSeconds)) {
          localStorage.setItem("totalWorkedTime", String(hoursData.workedSeconds));
        }

        if (!attendanceData.marked) {
          setModalMessage("Please mark your attendance for today");
          setShowModal(true);
        } else if (!window.location.pathname.includes("login-status")) {
          navigate("admin/login-status", { replace: true });
        }
      } catch (error) {
        console.error("Attendance verification failed:", error);
        setModalMessage(
          error.response?.data?.message || "Unable to verify attendance. Please try again."
        );
        setShowModal(true);
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    initializeDashboard();
  }, [navigate, employeeId, setModalMessage, setShowModal]);

  const handleProceed = async () => {
    if (!agree || loading) return;
    setLoading(true);
    try {
      const success = await markAttendance(employeeId);
      if (success) {
        setShowModal(false);
        navigate("admin/login-status", { replace: true });
      } else {
        setModalMessage("Failed to mark attendance. Please try again.");
      }
    } catch (error) {
      console.error("Mark attendance error:", error);
      setModalMessage(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    localStorage.clear();
    setShowModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex-1 p-4">
      <Outlet context={{ employee }} />

      {/* Attendance Popup */}
      <Modal
        isOpen={showModal}
        onRequestClose={handleClose}
        contentLabel="Attendance Confirmation"
        className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg focus:outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div>
          <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
            🕒 Mark Your Attendance
          </h2>
          <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
            By continuing, you confirm that you are starting work and will aim to complete at least{' '}
            <strong>8 hours</strong> today.
            <br />
            <span className="text-red-500 font-medium block mt-1">
              Less than 8 hrs = Half Day, less than 5 hrs = Absent.
            </span>
          </p>

          <label className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
              disabled={loading}
            />
            <span className="text-gray-800 text-sm font-medium">
              I agree to mark my attendance
            </span>
          </label>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              ✖ Close
            </button>
            <button
              onClick={handleProceed}
              disabled={!agree || loading}
              className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${
                agree && !loading
                  ? "bg-indigo-400 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "✅ Proceed"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupervisorDashboard;
