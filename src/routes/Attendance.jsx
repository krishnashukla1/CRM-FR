//==========================adjust proper weekly off show but i think hardcoded weekly off==========

import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';
import dayjs from 'dayjs';
import axios from 'axios';

const Attendance = () => {
  const { attendance = [] } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status configuration with colors and icons
  const statusConfig = {
    Present: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '✅'
    },
    Absent: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: '❌'
    },
    Late: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      icon: '⏰'
    },
    'Half Day': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '½'
    },
    'Weekly Off': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: '🌴'
    },
    Holiday: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: '🎉'
    }
  };

  useEffect(() => {
    const fetchWeeklyOffs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/weekly-offs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeeklyOffs(response.data);
      } catch (error) {
        console.error('Failed to fetch weekly offs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyOffs();

    const markAttendance = async () => {
      const now = dayjs();
      const startWindow = dayjs().hour(17).minute(0).second(0); // 5:00 PM today
      const endWindow = dayjs().hour(23).minute(59).second(59); // 11:59 PM today

      let status = 'Absent';
      if (now.isAfter(startWindow)) {
        status = 'Present';
      }

      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Failed to mark attendance:', error);
      }
    };

    markAttendance();
  }, []);

  // StatusBadge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: 'ℹ️'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Function to check if a date is a weekly off
  const isWeeklyOff = (date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return weeklyOffs.some(off => off.dayOfWeek === dayOfWeek);
  };

  // Combine attendance with weekly offs
  const combinedRecords = attendance.map(record => {
    const dateObj = new Date(record.date);
    const isSunday = dateObj.getDay() === 0;
    const isWeeklyOffDay = isWeeklyOff(dateObj);

    let status = record.status;
    if (isWeeklyOffDay) {
      status = 'Weekly Off';
    } else if (isSunday) {
      status = 'Weekly Off'; // Default Sunday off
    }

    return {
      ...record,
      status
    };
  });

  return (
    <PageWithCloseButton title="📅 Attendance">
      <div className="space-y-4">
        {/* Attendance Table */}
        <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-indigo-800">Attendance Records</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              <div className="w-12 h-12 mx-auto border-b-2 border-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading attendance records...</p>
            </div>
          ) : combinedRecords.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">

                    <tr>
                      <th className="px-16 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase ml-30">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                        Day
                      </th>
                      <th className="px-6 py-3 ml-10 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>

                  </thead>
                  {/* <tbody className="bg-white divide-y divide-gray-200">
                    {combinedRecords
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((a) => {
                        const dateObj = new Date(a.date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        const formattedDate = dateObj.toLocaleDateString();

                        return (
                          <tr
                            key={a._id}
                            className={`${statusConfig[a.status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                              {formattedDate}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${a.status === 'Present' ? 'bg-green-500' :
                                    a.status === 'Absent' ? 'bg-red-500' :
                                      a.status === 'Half Day' ? 'bg-orange-500' :
                                        'bg-blue-500'
                                  }`}></span>
                                {dayName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={a.status} />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody> */}
                  <tbody className="text-center bg-white divide-y divide-gray-200">
  {combinedRecords
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((a) => {
      const dateObj = new Date(a.date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString();

      return (
        <tr
          key={a._id}
          className={`${statusConfig[a.status]?.bg || 'bg-white'} bg-opacity-30 hover:bg-opacity-50 transition-colors`}
        >
          <td className="px-6 py-4 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
            {formattedDate}
          </td>
          <td className="px-6 py-4 text-sm text-center text-gray-600 whitespace-nowrap">
            <div className="flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  a.status === 'Present'
                    ? 'bg-green-500'
                    : a.status === 'Absent'
                    ? 'bg-red-500'
                    : a.status === 'Half Day'
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
              ></span>
              {dayName}
            </div>
          </td>
          <td className="px-6 py-4 text-center whitespace-nowrap">
            <StatusBadge status={a.status} />
          </td>
        </tr>
      );
    })}
</tbody>

                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === Math.ceil(combinedRecords.length / itemsPerPage)}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === Math.ceil(combinedRecords.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, combinedRecords.length)}
                      </span> of <span className="font-medium">{combinedRecords.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {Array.from({ length: Math.ceil(combinedRecords.length / itemsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1 ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === Math.ceil(combinedRecords.length / itemsPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === Math.ceil(combinedRecords.length / itemsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-gray-50">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-700">No attendance records found</h3>
              <p className="mt-1 text-sm text-gray-500">Your attendance records will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </PageWithCloseButton>
  );
};

export default Attendance;

//=========================================================================
/*
✅ What Functionality Is Added?

1. Automatic Attendance Marking on Page Load

As soon as the component loads (useEffect), it captures the current login time.

Based on the time:

Before 10:00 PM → "Present"
After 10:00 PM but before 11:59 PM → "Late"
After 11:59 PM → "Next Day or Absent"
Then, it marks attendance automatically via a POST request to /attendance/mark with the calculated status.

2. Token-based Authorization

Sends a JWT token from localStorage in the Authorization header to securely mark attendance.

3. Attendance Table Display
Fetches attendance from the router outlet context and displays:

Date (formatted)
Day (e.g., Sun, Mon, etc.)
Status (e.g., Present, Late)
Sundays are highlighted and shown as “Weekly Off (Sunday)” with different styling.

✅ Summary of Conditions:

Time of Login	Attendance Status
Before 10:00 PM	Present
Between 10:00–11:59 PM	Late
After 11:59 PM	Next Day or Absent


*/
