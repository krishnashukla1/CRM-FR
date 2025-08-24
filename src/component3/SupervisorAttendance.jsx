//=====================================================
// import React, { useEffect } from 'react';
// import useAttendance from './SupervisorUseAttendance';
// import Modal from 'react-modal';

// Modal.setAppElement('#root');

// const SupervisorAttendance = ({ employee, navigate }) => {
//   const {
//     showModal,
//     setShowModal,
//     agree,
//     setAgree,
//     modalMessage,
//     checkAttendance,
//     markAttendance,
//   } = useAttendance(employee, navigate);

//   // Run checkAttendance only when employee is loaded
//   useEffect(() => {
//     if (employee?._id) {
//       checkAttendance();
//     }
//   }, [employee, checkAttendance]);

//   const handleProceed = async () => {
//     if (!agree) {
//       setShowModal(true);
//       return;
//     }
//     const success = await markAttendance();
//     if (success) {
//       setTimeout(() => {
//         setShowModal(false);
//         window.location.reload(); // optional refresh after marking
//       }, 1500);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Supervisor Dashboard</h1>

//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
//         contentLabel="Attendance Confirmation"
//         className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//       >
//         <div>
//           <h2 className="text-base md:text-xl font-bold text-center text-indigo-700 mb-3 md:mb-4">
//             🕒 Mark Your Attendance
//           </h2>
//           <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
//             {modalMessage || (
//               <>
//                 By continuing, you confirm that you are starting work and will aim to complete at least{' '}
//                 <strong>8 hours</strong> today.
//                 <br />
//                 <span className="text-red-500 font-medium block mt-1">
//                   Less than 8 hrs = Half Day, less than 5 hrs = Absent.
//                 </span>
//               </>
//             )}
//           </p>

//           <label className="flex items-start gap-2 mb-3 md:mb-4">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={() => setAgree(!agree)}
//               className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
//             />
//             <span className="text-gray-800 text-xs md:text-sm font-medium">
//               I agree to mark my attendance
//             </span>
//           </label>

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm text-white rounded transition-all duration-300 ${
//                 agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
//               }`}
//             >
//               ✅ Proceed to Dashboard
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SupervisorAttendance

//=================correct


// import React, { useEffect,useState } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import axios from 'axios';
// import Modal from 'react-modal';

// const SupervisorAttendance = () => {
//   const { attendance = [], employee } = useOutletContext();
//   const [showModal, setShowModal] = React.useState(false);
//   const [agree, setAgree] = React.useState(false);
//   const [modalMessage, setModalMessage] = React.useState('');
// const [currentPage, setCurrentPage] = useState(0);
//   useEffect(() => {
//     const checkAttendance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.data?.marked) {
//           setModalMessage('Please mark your attendance for today');
//           setShowModal(true);
//         }
//       } catch (error) {
//         console.error('Attendance check failed:', error);
//         setModalMessage(error.response?.data?.message || 'Unable to verify attendance. Please try again.');
//         setShowModal(true);
//       }
//     };

//     checkAttendance();
//   }, []);

//   const handleProceed = async () => {
//     if (!agree) {
//       setModalMessage('You must agree to mark attendance');
//       return;
//     }

//     try {
//       const now = dayjs();
//       const startWindow = dayjs().hour(17).minute(0).second(0);
//       const endWindow = dayjs().hour(23).minute(59).second(59);

//       let status = 'Absent';
//       if (now.isAfter(startWindow)) {
//         status = now.isBefore(endWindow) ? 'Present' : 'Late';
//       }

//       const token = localStorage.getItem('token');
//       const employeeId = employee?._id || localStorage.getItem('employeeId');

//       if (!employeeId) {
//         throw new Error('Employee ID not found');
//       }

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
//         {
//           status,
//           employeeId,
//           date: now.format('YYYY-MM-DD')
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setModalMessage(response?.data?.message || 'Attendance marked successfully');
//       setTimeout(() => setShowModal(false), 1500);
//     } catch (error) {
//       console.error('Attendance marking failed:', error);
//       setModalMessage(error.response?.data?.message || 'Failed to mark attendance. Please try again.');
//     }
//   };


//   return (
//     <>
//       <div className="mt-8">



//         {/* Attractive Centered Heading */}
//         {/* <div className="text-center mb-8">
//     <h2 className="text-3xl font-bold text-indigo-700 inline-block relative pb-2">
//       Attendance Records
//       <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></span>
//     </h2>
//   </div> */}

//         {/* Enhanced Table Styling */}
//         {/* <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-100">
//     {attendance.length > 0 ? (
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
//           <tr>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//               Date
//             </th>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//               Day
//             </th>
//             <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//               Status
//             </th>
//           </tr>
//         </thead>

//         <tbody className="bg-white divide-y divide-gray-200">
//           {attendance.map((a) => {
//             const attendanceRecord = a.employeeId ? a : a;
//             const dateObj = new Date(attendanceRecord.date);
//             const isSunday = dateObj.getDay() === 0;
//             const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//             const formattedDate = dateObj.toLocaleDateString();

//             return (
//               <tr 
//                 key={attendanceRecord._id} 
//                 className={`transition-colors duration-200 hover:bg-gray-50 ${isSunday ? 'bg-blue-50' : ''}`}
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
//                   {formattedDate}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                   {dayName}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                   <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                     isSunday 
//                       ? 'bg-blue-100 text-blue-800' 
//                       : attendanceRecord.status === 'Present' 
//                         ? 'bg-green-100 text-green-800'
//                         : attendanceRecord.status === 'Late' 
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                   }`}>
//                     {isSunday ? 'Weekly Off (Sunday)' : attendanceRecord.status}
//                   </span>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     ) : (
//       <div className="bg-white p-8 text-center rounded-lg">
//         <p className="text-gray-500 text-lg">
//           No attendance records found.
//         </p>
//       </div>
//     )}
//   </div> */}



// <div className="text-center mb-8">
//     <h2 className="text-3xl font-bold text-indigo-700 inline-block relative pb-2">
//       Attendance Records
//       <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></span>
//     </h2>
//   </div>

//   {/* Enhanced Table Styling */}
//   <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-100">
//     {attendance.length > 0 ? (
//       <>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
//             <tr>
//               <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//                 Day
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
//                 Status
//               </th>
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {attendance.slice(currentPage * 10, (currentPage + 1) * 10).map((a) => {
//               const attendanceRecord = a.employeeId ? a : a;
//               const dateObj = new Date(attendanceRecord.date);
//               const isSunday = dateObj.getDay() === 0;
//               const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
//               const formattedDate = dateObj.toLocaleDateString();

//               return (
//                 <tr 
//                   key={attendanceRecord._id} 
//                   className={`transition-colors duration-200 hover:bg-gray-50 ${isSunday ? 'bg-blue-50' : ''}`}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
//                     {formattedDate}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                     {dayName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center">
//                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
//                       isSunday 
//                         ? 'bg-blue-100 text-blue-800' 
//                         : attendanceRecord.status === 'Present' 
//                           ? 'bg-green-100 text-green-800'
//                           : attendanceRecord.status === 'Late' 
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-red-100 text-red-800'
//                     }`}>
//                       {isSunday ? 'Weekly Off (Sunday)' : attendanceRecord.status}
//                     </span>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
        
//         {/* Pagination Controls */}
//         <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
//               disabled={currentPage === 0}
//               className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                 currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => setCurrentPage(prev => (attendance.length > (prev + 1) * 10 ? prev + 1 : prev))}
//               disabled={attendance.length <= (currentPage + 1) * 10}
//               className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
//                 attendance.length <= (currentPage + 1) * 10 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{currentPage * 10 + 1}</span> to{' '}
//                 <span className="font-medium">{Math.min((currentPage + 1) * 10, attendance.length)}</span> of{' '}
//                 <span className="font-medium">{attendance.length}</span> records
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
//                   disabled={currentPage === 0}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
//                     currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="sr-only">Previous</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//                 {Array.from({ length: Math.ceil(attendance.length / 10) }).map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentPage(index)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                       currentPage === index
//                         ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                         : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                     }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage(prev => (attendance.length > (prev + 1) * 10 ? prev + 1 : prev))}
//                   disabled={attendance.length <= (currentPage + 1) * 10}
//                   className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
//                     attendance.length <= (currentPage + 1) * 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="sr-only">Next</span>
//                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                     <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </>
//     ) : (
//       <div className="bg-white p-8 text-center rounded-lg">
//         <p className="text-gray-500 text-lg">
//           No attendance records found.
//         </p>
//       </div>
//     )}
//   </div>


//       </div>

//       <Modal
//         isOpen={showModal}
//         onRequestClose={() => setShowModal(false)}
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
//               By marking attendance, you confirm you are starting work and will aim to complete at least{' '}
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
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleProceed}
//               disabled={!agree}
//               className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
//                 }`}
//             >
//               ✅ Proceed
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default SupervisorAttendance;
// ================



import React, { useEffect,useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import Modal from 'react-modal';

const SupervisorAttendance = () => {
  const { attendance = [], employee } = useOutletContext();
  const [showModal, setShowModal] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');
const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data?.marked) {
          setModalMessage('Please mark your attendance for today');
          setShowModal(true);
        }
      } catch (error) {
        console.error('Attendance check failed:', error);
        setModalMessage(error.response?.data?.message || 'Unable to verify attendance. Please try again.');
        setShowModal(true);
      }
    };

    checkAttendance();
  }, []);

  const handleProceed = async () => {
    if (!agree) {
      setModalMessage('You must agree to mark attendance');
      return;
    }

    try {
      const now = dayjs();
      const startWindow = dayjs().hour(17).minute(0).second(0);
      const endWindow = dayjs().hour(23).minute(59).second(59);

      let status = 'Absent';
      if (now.isAfter(startWindow)) {
        status = now.isBefore(endWindow) ? 'Present' : 'Late';
      }

      const token = localStorage.getItem('token');
      const employeeId = employee?._id || localStorage.getItem('employeeId');

      if (!employeeId) {
        throw new Error('Employee ID not found');
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
        {
          status,
          employeeId,
          date: now.format('YYYY-MM-DD')
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setModalMessage(response?.data?.message || 'Attendance marked successfully');
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      console.error('Attendance marking failed:', error);
      setModalMessage(error.response?.data?.message || 'Failed to mark attendance. Please try again.');
    }
  };
  return (
    <>
      <div className="mt-8">

<div className="text-center mb-8">
    <h2 className="text-3xl font-bold text-indigo-700 inline-block relative pb-2">
      Attendance Records
      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></span>
    </h2>
  </div>

  {/* Enhanced Table Styling */}
  <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-100">
    {attendance.length > 0 ? (
      <>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.slice(currentPage * 10, (currentPage + 1) * 10).map((a) => {
              const attendanceRecord = a.employeeId ? a : a;
              const dateObj = new Date(attendanceRecord.date);
              const isSunday = dateObj.getDay() === 0;
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const formattedDate = dateObj.toLocaleDateString();

              return (
                <tr 
                  key={attendanceRecord._id} 
                  className={`transition-colors duration-200 hover:bg-gray-50 ${isSunday ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                    {formattedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {dayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      isSunday 
                        ? 'bg-blue-100 text-blue-800' 
                        : attendanceRecord.status === 'Present' 
                          ? 'bg-green-100 text-green-800'
                          : attendanceRecord.status === 'Late' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                      {isSunday ? 'Weekly Off (Sunday)' : attendanceRecord.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => (attendance.length > (prev + 1) * 10 ? prev + 1 : prev))}
              disabled={attendance.length <= (currentPage + 1) * 10}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                attendance.length <= (currentPage + 1) * 10 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{currentPage * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min((currentPage + 1) * 10, attendance.length)}</span> of{' '}
                <span className="font-medium">{attendance.length}</span> records
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: Math.ceil(attendance.length / 10) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => (attendance.length > (prev + 1) * 10 ? prev + 1 : prev))}
                  disabled={attendance.length <= (currentPage + 1) * 10}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    attendance.length <= (currentPage + 1) * 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="bg-white p-8 text-center rounded-lg">
        <p className="text-gray-500 text-lg">
          No attendance records found.
        </p>
      </div>
    )}
  </div>


      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Attendance Confirmation"
        className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg focus:outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div>
          <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">
            🕒 Mark Your Attendance
          </h2>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            {modalMessage}
            <br />
            <span className="text-red-500 font-medium block mt-2 leading-relaxed">
              By marking attendance, you confirm you are starting work and will aim to complete at least{' '}
              <strong>8 hours</strong> today.
              <br />
              Less than 8 hrs = Half Day, less than 5 hrs = Absent.
            </span>

          </p>

          <label className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="form-checkbox h-4 w-4 text-indigo-600 mt-1"
            />
            <span className="text-gray-800 text-sm font-medium">
              I agree to mark my attendance
            </span>
          </label>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={handleProceed}
              disabled={!agree}
              className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${agree ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
                }`}
            >
              ✅ Proceed
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SupervisorAttendance;
