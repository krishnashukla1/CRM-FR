// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const RequestLeaves = ({ leaveForm, setLeaveForm, submitLeave }) => {
//   return (
//     <PageWithCloseButton title="➕ Request New Leave">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={leaveForm.from}
//               onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={leaveForm.to}
//               onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
//             <select
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               value={leaveForm.leaveType}
//               onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//             >
//               <option value="Paid Leave">Paid Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Document (Optional)</label>
//             <input
//               type="file"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//           <textarea
//             placeholder="Enter your reason for leave..."
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             rows="4"
//             value={leaveForm.reason}
//             onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//           />
//         </div>

//         <button
//           onClick={submitLeave}
//           className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow text-sm md:text-base"
//         >
//           Submit Leave Request
//         </button>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default RequestLeaves;

//-------------------------------------

// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const RequestLeaves = ({ leaveForm = {}, setLeaveForm, submitLeave }) => {
//   const { from = '', to = '', leaveType = 'Paid Leave', reason = '' } = leaveForm;

//   return (
//     <PageWithCloseButton title="➕ Request New Leave">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={from}
//               onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={to}
//               onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
//             <select
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               value={leaveType}
//               onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//             >
//               <option value="Paid Leave">Paid Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Document (Optional)</label>
//             <input
//               type="file"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//           <textarea
//             placeholder="Enter your reason for leave..."
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             rows="4"
//             value={reason}
//             onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//           />
//         </div>

//         <button
//           onClick={submitLeave}
//           className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow text-sm md:text-base"
//         >
//           Submit Leave Request
//         </button>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default RequestLeaves;

//====================================
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';

// const RequestLeaves = () => {
//   const { leaveForm = {}, setLeaveForm, submitLeave } = useOutletContext();

//   const { from = '', to = '', leaveType = 'Paid Leave', reason = '' } = leaveForm;

//   return (
//     <PageWithCloseButton title="➕ Request New Leave">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={from}
//               onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={to}
//               onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
//             <select
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               value={leaveType}
//               onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//             >
//               <option value="Paid Leave">Paid Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Document (Optional)</label>
//             <input
//               type="file"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//               onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//           <textarea
//             placeholder="Enter your reason for leave..."
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             rows="4"
//             value={reason}
//             onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//           />
//         </div>

//         <button
//           onClick={submitLeave}
//           className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow text-sm md:text-base"
//         >
//           Submit Leave Request
//         </button>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default RequestLeaves;

//------------------------------
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const RequestLeaves = () => {
//   const { leaveForm = {}, setLeaveForm, submitLeave } = useOutletContext();
//   const { from = null, to = null, leaveType = 'Paid Leave', reason = '' } = leaveForm;

//   return (
//     <PageWithCloseButton title="➕ Request New Leave">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">From Date</label>
//             <DatePicker
//               selected={from}
//               onChange={(date) => setLeaveForm({ ...leaveForm, from: date })}
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               placeholderText="Select date"
//               dateFormat="yyyy-MM-dd"
//               showPopperArrow={false}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">To Date</label>
//             <DatePicker
//               selected={to}
//               onChange={(date) => setLeaveForm({ ...leaveForm, to: date })}
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               placeholderText="Select date"
//               dateFormat="yyyy-MM-dd"
//               showPopperArrow={false}
//               minDate={from}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">Leave Type</label>
//             <select
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               value={leaveType}
//               onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//             >
//               <option value="Paid Leave">Paid Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">Document (Optional)</label>
//             <input
//               type="file"
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 shadow-sm transition"
//               onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-bold text-gray-800 mb-1">Reason</label>
//           <textarea
//             placeholder="Enter your reason for leave..."
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//             rows="4"
//             value={reason}
//             onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//           />
//         </div>

//         {/* <button
//           onClick={submitLeave}
//           className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-md text-sm md:text-base font-medium"
//         >
//           Submit Leave Request
//         </button> */}

//         <button
//   onClick={submitLeave}
//   className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
//              text-white px-6 py-2 rounded-xl shadow-lg text-sm md:text-base font-semibold
//              transform transition-all duration-300 ease-in-out
//              hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
//              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
// >
//    Submit Leave Request
// </button>

//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default RequestLeaves;
//----------------------------
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const RequestLeaves = () => {
//   const { leaveForm = {}, setLeaveForm, submitLeave } = useOutletContext();
//   const { from = null, to = null, leaveType = 'Paid Leave', reason = '' } = leaveForm;

//   return (
//     <PageWithCloseButton title="➕ Request New Leave">
//       <div className="space-y-6">
//         {/* Date Selection */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">From Date</label>
//             <DatePicker
//               selected={from}
//               onChange={(date) => setLeaveForm({ ...leaveForm, from: date })}
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               placeholderText="Select date"
//               dateFormat="yyyy-MM-dd"
//               showPopperArrow={false}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">To Date</label>
//             <DatePicker
//               selected={to}
//               onChange={(date) => setLeaveForm({ ...leaveForm, to: date })}
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               placeholderText="Select date"
//               dateFormat="yyyy-MM-dd"
//               showPopperArrow={false}
//               minDate={from}
//             />
//           </div>
//         </div>

//         {/* Leave Type and Document */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">Leave Type</label>
//             <select
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//               value={leaveType}
//               onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
//             >
//               <option value="Paid Leave">Paid Leave</option>
//               <option value="Leave Without Pay">Leave Without Pay</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-bold text-gray-800 mb-1">Document (Optional)</label>
//             <input
//               type="file"
//               className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 shadow-sm transition"
//               onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
//             />
//           </div>
//         </div>

//         {/* Reason */}
//         <div>
//           <label className="block text-sm font-bold text-gray-800 mb-1">Reason</label>
//           <textarea
//             placeholder="Enter your reason for leave..."
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
//             rows="4"
//             value={reason}
//             onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           onClick={submitLeave}
//           className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
//                      text-white px-6 py-2 rounded-xl shadow-lg text-sm md:text-base font-semibold
//                      transform transition-all duration-300 ease-in-out
//                      hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
//                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
//         >
//           Submit Leave Request
//         </button>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default RequestLeaves;
//----------------wth validation-----

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RequestLeaves = () => {
  const { leaveForm = {}, setLeaveForm, submitLeave } = useOutletContext();
  const { from = null, to = null, leaveType = 'Paid Leave', reason = '' } = leaveForm;

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    // Step 1: Frontend required fields validation
    if (!from || !to || !leaveType || !reason.trim()) {
      setErrorMessage('Please select From Date, To Date, Leave Type, and enter a Reason.');
      return;
    }

    setErrorMessage(''); // Clear old message

    try {
      const res = await submitLeave();

      // Step 2: Backend validations (more than 5 days / more than 4 leaves)
      if (res?.status === 'fail') {
        // Show exactly what backend sends
        if (res.message === 'More than 5 days please contact HR.') {
          setErrorMessage('More than 5 days please contact HR.');
        } else if (res.message === 'Maximum 4 leave requests per year. Please contact HR.') {
          setErrorMessage('Maximum 4 leave requests per year. Please contact HR.');
        } else {
          setErrorMessage(res.message || 'Something went wrong.');
        }
      } else {
        setErrorMessage('');
      }
    } catch (err) {
      console.error('Error submitting leave:', err);
      setErrorMessage(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (

    // <PageWithCloseButton title="➕ Request New Leave">
    //   <div className="space-y-6">
    //     {/* Date Selection */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       <div>
    //         <label className="block text-sm font-bold text-gray-800 mb-1">From Date</label>
    //         <DatePicker
    //           selected={from}
    //           onChange={(date) => setLeaveForm({ ...leaveForm, from: date })}
    //           className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
    //           placeholderText="Select date"
    //           dateFormat="yyyy-MM-dd"
    //           showPopperArrow={false}
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-bold text-gray-800 mb-1">To Date</label>
    //         <DatePicker
    //           selected={to}
    //           onChange={(date) => setLeaveForm({ ...leaveForm, to: date })}
    //           className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
    //           placeholderText="Select date"
    //           dateFormat="yyyy-MM-dd"
    //           showPopperArrow={false}
    //           minDate={from}
    //         />
    //       </div>
    //     </div>

    //     {/* Leave Type and Document */}
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       <div>
    //         <label className="block text-sm font-bold text-gray-800 mb-1">Leave Type</label>
    //         <select
    //           className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
    //           value={leaveType}
    //           onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
    //         >
    //           <option value="Paid Leave">Paid Leave</option>
    //           <option value="Leave Without Pay">Leave Without Pay</option>
    //         </select>
    //       </div>
    //       <div>
    //         <label className="block text-sm font-bold text-gray-800 mb-1">Document (Optional)</label>
    //         <input
    //           type="file"
    //           className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 shadow-sm transition"
    //           onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
    //         />
    //       </div>
    //     </div>

    //     {/* Reason */}
    //     <div>
    //       <label className="block text-sm font-bold text-gray-800 mb-1">Reason</label>
    //       <textarea
    //         placeholder="Enter your reason for leave..."
    //         className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
    //         rows="4"
    //         value={reason}
    //         onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
    //       />
    //     </div>

    //     {/* Error Message (Blue text) */}
    //     {errorMessage && (
    //       <div className="text-blue-600 text-sm font-medium">
    //         {errorMessage}
    //       </div>
    //     )}

    //     {/* Submit Button */}
    //     <button
    //       onClick={handleSubmit}
    //       className="w-full md:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
    //                  text-white px-6 py-2 rounded-xl shadow-lg text-sm md:text-base font-semibold
    //                  transform transition-all duration-300 ease-in-out
    //                  hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
    //                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
    //     >
    //       Submit Leave Request
    //     </button>
    //   </div>
    // </PageWithCloseButton>


<PageWithCloseButton title="➕ Request New Leave">
  <div className="space-y-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100">
    {/* Date Selection */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
        <DatePicker
          selected={from}
          onChange={(date) => setLeaveForm({ ...leaveForm, from: date })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     shadow-sm transition bg-white"
          placeholderText="📅 Select date"
          dateFormat="yyyy-MM-dd"
          showPopperArrow={false}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
        <DatePicker
          selected={to}
          onChange={(date) => setLeaveForm({ ...leaveForm, to: date })}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     shadow-sm transition bg-white"
          placeholderText="📅 Select date"
          dateFormat="yyyy-MM-dd"
          showPopperArrow={false}
          minDate={from}
        />
      </div>
    </div>

    {/* Leave Type and Document */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
        <select
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     shadow-sm transition bg-white"
          value={leaveType}
          onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
        >
          <option value="Paid Leave">💰 Paid Leave</option>
          <option value="Leave Without Pay">🚫 Leave Without Pay</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Document (Optional)</label>
        <input
          type="file"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                     file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 
                     file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 
                     hover:file:bg-indigo-100 shadow-sm transition bg-white"
          onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
        />
      </div>
    </div>

    {/* Reason */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
      <textarea
        placeholder="✍️ Enter your reason for leave..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   shadow-sm transition bg-white"
        rows="4"
        value={reason}
        onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
      />
    </div>

    {/* Error Message */}
    {errorMessage && (
      <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200">
        ⚠️ {errorMessage}
      </div>
    )}

    {/* Submit Button */}
    <div className="flex justify-end">
      <button
        onClick={handleSubmit}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                   text-white px-6 py-2 rounded-xl shadow-lg text-sm md:text-base font-semibold
                   transform transition-all duration-300 ease-in-out
                   hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
      >
        🚀 Submit Leave Request
      </button>
    </div>
  </div>
</PageWithCloseButton>


  );
};

export default RequestLeaves;
