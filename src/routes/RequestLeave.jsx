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

    <PageWithCloseButton title="➕ Request New Leave">
      <div className="p-6 space-y-8 border border-gray-100 shadow-lg bg-white/80 backdrop-blur-lg rounded-2xl">
        {/* Date Selection */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">From Date</label>
            <DatePicker
              selected={from}
              onChange={(date) => setLeaveForm({ ...leaveForm, from: date })}
              className="w-full px-4 py-2 text-sm transition bg-white border border-gray-300 shadow-sm cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholderText="📅 Select date"
              dateFormat="yyyy-MM-dd"
              showPopperArrow={false}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">To Date</label>
            <DatePicker
              selected={to}
              onChange={(date) => setLeaveForm({ ...leaveForm, to: date })}
              className="w-full px-4 py-2 text-sm transition bg-white border border-gray-300 shadow-sm cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholderText="📅 Select date"
              dateFormat="yyyy-MM-dd"
              showPopperArrow={false}
              minDate={from}
            />
          </div>
        </div>

        {/* Leave Type and Document */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Leave Type</label>
            <select
              className="w-full px-4 py-2 text-sm transition bg-white border border-gray-300 shadow-sm cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={leaveType}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
            >
              <option value="Paid Leave">💰 Paid Leave</option>
              <option value="Leave Without Pay">🚫 Leave Without Pay</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Upload Document (Optional)</label>
            <input
              type="file"
              className="cursor-pointer w-full border border-gray-300 rounded-xl px-4 py-2 text-sm 
                     file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 
                     file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 
                     hover:file:bg-indigo-100 shadow-sm transition bg-white"
              onChange={(e) => setLeaveForm({ ...leaveForm, document: e.target.files[0] })}
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Reason</label>
          <textarea
            placeholder="✍️ Enter your reason for leave..."
            className="w-full px-4 py-3 text-sm transition bg-white border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            value={reason}
            onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg bg-red-50">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white transition-all duration-300 ease-in-out transform shadow-lg cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl md:text-base hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
          >
            🚀 Submit Leave Request
          </button>
        </div>
      </div>
    </PageWithCloseButton>
  );
};

export default RequestLeaves;
