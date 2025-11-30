//=======================CORRECT CODE WEEKLY OF SHO BUT HARDCODED===============================

// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import PageWithCloseButton from './PageWithCloseButton';
// import API from '../api';
// import { DatePicker } from 'antd';

// const Leaves = () => {
//   const {
//     leaves = [],
//     currentEmployee = {}
//   } = useOutletContext();

//   // Use employeeId from context or fallback to Krishna Shukla's ID for testing
//   const employeeId = currentEmployee?.employeeId || '688bd8c22797d36735470d7c'; // Temporary fallback

//   // State for weekly offs
//   const [weeklyOffs, setWeeklyOffs] = useState([]);
//   const [loadingWeeklyOffs, setLoadingWeeklyOffs] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch weekly off data
//   useEffect(() => {
//     const fetchWeeklyOffs = async () => {
//       try {
//         const response = await API.get('/weekly-offs');
//         const enhancedOffs = (response.data || []).map((off) => ({
//           ...off,
//           employeeId: off.employeeId?._id || off.employeeId,
//           dayOfWeek: off.dayOfWeek || (off.date ? dayjs(off.date).format('dddd') : ''),
//           date: off.date ? dayjs(off.date) : null
//         }));
//         setWeeklyOffs(enhancedOffs);
//         console.log('Fetched weekly offs:', enhancedOffs);
//       } catch (err) {
//         console.error('Error fetching weekly offs:', err);
//         setError('Failed to load weekly off data');
//       } finally {
//         setLoadingWeeklyOffs(false);
//       }
//     };

//     fetchWeeklyOffs();
//   }, []);

//   // Configuration
//   const DEFAULT_ANNUAL_LEAVE_QUOTA = 20;

//   // State for month/year selection
//   const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

//   // Group weekly offs by employee
//   const groupWeeklyOffsByEmployee = () => {
//     const grouped = {};

//     weeklyOffs.forEach((off) => {
//       const empId = off.employeeId;
//       if (!empId) return;

//       if (!grouped[empId]) {
//         grouped[empId] = {
//           employeeId: empId,
//           dates: []
//         };
//       }

//       // Only include entries with a specific date
//       if (off.date) {
//         grouped[empId].dates.push({
//           date: off.date,
//           id: off._id,
//           dayOfWeek: off.dayOfWeek
//         });
//       }
//     });

//     return Object.values(grouped).map((item) => ({
//       ...item,
//       dates: item.dates
//         .filter((d) => selectedMonth ? d.date.format('YYYY-MM') === selectedMonth : true)
//         .sort((a, b) => a.date - b.date)
//     }));
//   };

//   // Get current employee's weekly offs
//   const processedWeeklyOffs = groupWeeklyOffsByEmployee();
//   const myWeeklyOff = processedWeeklyOffs.find(
//     (off) => off.employeeId === employeeId
//   );

//   // Debug: Log employeeId and weekly offs
//   useEffect(() => {
//     console.log('Employee ID:', employeeId);
//     console.log('My Weekly Off:', myWeeklyOff);
//   }, [employeeId, myWeeklyOff]);

//   // Calculate leave statistics
//   const {
//     approvedCount,
//     rejectedCount,
//     pendingCount,
//     leaveStats
//   } = React.useMemo(() => {
//     const counters = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       pendingCount: 0
//     };

//     const processedLeaves = leaves.map(leave => {
//       if (!leave?.from || !leave?.to) return null;

//       const fromDate = new Date(leave.from);
//       const toDate = new Date(leave.to);

//       if (isNaN(fromDate.getTime())) return null;

//       const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;

//       switch (leave.status) {
//         case 'Approved': counters.approvedCount++; break;
//         case 'Rejected': counters.rejectedCount++; break;
//         case 'Pending': counters.pendingCount++; break;
//         default: break;
//       }

//       return {
//         ...leave,
//         fromDate,
//         toDate,
//         totalDays,
//         leaveDays: totalDays,
//         month: fromDate.getMonth() + 1,
//         year: fromDate.getFullYear()
//       };
//     }).filter(Boolean);

//     const annualQuota = currentEmployee.leaveQuota || DEFAULT_ANNUAL_LEAVE_QUOTA;
//     const monthlyQuota = annualQuota / 12;

//     const approvedLeaves = processedLeaves.filter(l => l.status === 'Approved');
//     const totalUsedDays = approvedLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const remainingDays = Math.max(annualQuota - totalUsedDays, 0);

//     const selectedMonthLeaves = approvedLeaves.filter(leave =>
//       selectedMonth ?
//         leave.month === parseInt(selectedMonth.split('-')[1]) &&
//         leave.year === parseInt(selectedMonth.split('-')[0])
//         : true
//     );

//     const monthlyUsedDays = selectedMonthLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const totalWeeklyOffsInMonth = myWeeklyOff?.dates.length || 0;
//     const weeklyOffDays = myWeeklyOff?.dates.map(d => d.dayOfWeek) || [];

//     return {
//       ...counters,
//       weeklyOffCount: totalWeeklyOffsInMonth,
//       leaveStats: {
//         annualQuota,
//         monthlyQuota,
//         totalUsedDays,
//         remainingDays,
//         monthlyUsedDays,
//         monthlyWeeklyOffs: totalWeeklyOffsInMonth,
//         expectedWeeklyOffs: totalWeeklyOffsInMonth,
//         processedLeaves,
//         employeeWeeklyOffDays: weeklyOffDays,
//         weeklyOffsData: myWeeklyOff?.dates || []
//       }
//     };
//   }, [leaves, currentEmployee, selectedMonth, myWeeklyOff]);

//   // Status badge component
//   const StatusBadge = ({ status }) => {
//     const statusClasses = {
//       Approved: 'bg-green-100 text-green-800',
//       Rejected: 'bg-red-100 text-red-800',
//       Pending: 'bg-yellow-100 text-yellow-800',
//       'Paid Leave': 'bg-blue-100 text-blue-800'
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {status}
//       </span>
//     );
//   };

//   // Loading state
//   if (loadingWeeklyOffs) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
//         </div>
//       </PageWithCloseButton>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="p-6 text-red-600 shadow-sm bg-red-50 rounded-xl">{error}</div>
//       </PageWithCloseButton>
//     );
//   }

//   // No employee ID state
//   if (!employeeId) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="p-6 text-yellow-600 shadow-sm bg-yellow-50 rounded-xl">
//           Unable to load employee data. Please try logging in again or contact support.
//         </div>
//       </PageWithCloseButton>
//     );
//   }

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Month Selector */}
//         <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
//           <h2 className="mb-3 text-lg font-semibold">Select Period</h2>
//           <div className="flex flex-wrap gap-4">
//             <DatePicker
//               picker="month"
//               format="MMM YYYY"
//               value={selectedMonth ? dayjs(selectedMonth) : null}
//               onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : null)}
//               allowClear
//               className="w-full transition-colors border-gray-300 rounded-lg sm:w-48 hover:border-indigo-400 focus:border-indigo-500"
//             />
//             <button
//               onClick={() => setSelectedMonth(null)}
//               className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
//             >
//               Clear filter
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="p-4 bg-white border border-green-100 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="p-4 bg-white border border-red-100 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="p-4 bg-white border border-purple-100 rounded-lg shadow">
//             <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//             <p className="text-2xl font-semibold text-purple-600">{leaveStats.monthlyWeeklyOffs}</p>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="p-5 bg-white border border-gray-200 rounded-lg shadow">
//           <h2 className="mb-4 text-lg font-semibold">
//             {selectedMonth
//               ? dayjs(selectedMonth).format('MMMM YYYY')
//               : 'Current Month'} Summary
//           </h2>
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Monthly Quota</h3>
//               <p className="text-xl font-semibold">{leaveStats.monthlyQuota.toFixed(1)} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used This Month</h3>
//               <p className="text-xl font-semibold">
//                 {leaveStats.monthlyUsedDays} / {leaveStats.monthlyQuota.toFixed(1)} days
//               </p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//               <p className="text-xl font-semibold text-purple-600">
//                 {leaveStats.monthlyWeeklyOffs} / {leaveStats.expectedWeeklyOffs}
//               </p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Your Weekly Off</h3>
//               <p className="text-xl font-semibold">
//                 {leaveStats.employeeWeeklyOffDays.length > 0
//                   ? [...new Set(leaveStats.employeeWeeklyOffDays)].join(', ')
//                   : 'Not set'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Weekly Off Schedule Card */}
//         {leaveStats.weeklyOffsData.length > 0 && (
//           <div className="p-6 border-l-4 border-indigo-500 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
//             <h2 className="mb-2 text-lg font-semibold text-indigo-700">Your Weekly Off Schedule</h2>
//             <p className="mb-3 text-sm text-gray-600">
//               Showing your weekly offs for{' '}
//               {selectedMonth
//                 ? dayjs(selectedMonth).format('MMMM YYYY')
//                 : 'all months'}.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {leaveStats.weeklyOffsData.map((off) => (
//                 <div
//                   key={off.id}
//                   className="px-3 py-1 text-sm text-indigo-800 bg-white border border-indigo-200 rounded-lg shadow-sm"
//                 >
//                   📅 {off.date.format('DD MMM')} • {off.dayOfWeek}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Leave History Table */}
//         <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold">
//               Leave History for {selectedMonth
//                 ? dayjs(selectedMonth).format('MMMM YYYY')
//                 : 'Current Month'}
//             </h2>
//           </div>

//           {leaveStats.processedLeaves
//             .filter(leave => selectedMonth
//               ? leave.month === parseInt(selectedMonth.split('-')[1]) &&
//                 leave.year === parseInt(selectedMonth.split('-')[0])
//               : true
//             )
//             .length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">#</th>
//                     <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Period</th>
//                     <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Days</th>
//                     <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
//                     <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {leaveStats.processedLeaves
//                     .filter(leave => selectedMonth
//                       ? leave.month === parseInt(selectedMonth.split('-')[1]) &&
//                         leave.year === parseInt(selectedMonth.split('-')[0])
//                       : true
//                     )
//                     .map((leave, index) => (
//                       <tr key={leave._id || index}>
//                         <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                           {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                           {leave.totalDays}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                           {leave.leaveType || 'Regular Leave'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <StatusBadge status={leave.status} />
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               No leave records found for selected period
//             </div>
//           )}
//         </div>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//=============================CORRECT ALSO NEW WEEKLY OFF NOT SHOW================

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import PageWithCloseButton from './PageWithCloseButton';
import { DatePicker } from 'antd';

const Leaves = () => {
  const {
    leaves = [],
    currentEmployee = {}
  } = useOutletContext();

  // Use employeeId from context or fallback to Krishna Shukla's ID for testing
  const employeeId = currentEmployee?.employeeId || '688bd8c22797d36735470d7c'; // Temporary fallback

  // Configuration
  const DEFAULT_ANNUAL_LEAVE_QUOTA = 20;

  // State for month/year selection
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  // Calculate leave statistics
  const {
    approvedCount,
    rejectedCount,
    pendingCount,
    leaveStats
  } = React.useMemo(() => {
    const counters = {
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: 0
    };

    const processedLeaves = leaves.map(leave => {
      if (!leave?.from || !leave?.to) return null;

      const fromDate = new Date(leave.from);
      const toDate = new Date(leave.to);

      if (isNaN(fromDate.getTime())) return null;

      const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;

      switch (leave.status) {
        case 'Approved': counters.approvedCount++; break;
        case 'Rejected': counters.rejectedCount++; break;
        case 'Pending': counters.pendingCount++; break;
        default: break;
      }

      return {
        ...leave,
        fromDate,
        toDate,
        totalDays,
        leaveDays: totalDays,
        month: fromDate.getMonth() + 1,
        year: fromDate.getFullYear()
      };
    }).filter(Boolean);

    const annualQuota = currentEmployee.leaveQuota || DEFAULT_ANNUAL_LEAVE_QUOTA;
    const monthlyQuota = annualQuota / 12;

    const approvedLeaves = processedLeaves.filter(l => l.status === 'Approved');
    const totalUsedDays = approvedLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
    const remainingDays = Math.max(annualQuota - totalUsedDays, 0);

    const selectedMonthLeaves = approvedLeaves.filter(leave =>
      selectedMonth ?
        leave.month === parseInt(selectedMonth.split('-')[1]) &&
        leave.year === parseInt(selectedMonth.split('-')[0])
        : true
    );

    const monthlyUsedDays = selectedMonthLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);

    return {
      ...counters,
      leaveStats: {
        annualQuota,
        monthlyQuota,
        totalUsedDays,
        remainingDays,
        monthlyUsedDays,
        processedLeaves
      }
    };
  }, [leaves, currentEmployee, selectedMonth]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      'Paid Leave': 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <PageWithCloseButton title="📝 Leave Management">
      <div className="space-y-6">
        {/* Month Selector */}
        <div className="p-6 border border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
          <h2 className="mb-4 text-lg font-semibold text-indigo-800">Select Period</h2>
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker
              picker="month"
              format="MMM YYYY"
              value={selectedMonth ? dayjs(selectedMonth) : null}
              onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : null)}
              allowClear
              className="w-full px-4 py-2 transition-colors border-gray-300 rounded-lg shadow-sm cursor-pointer sm:w-56 hover:border-indigo-400 focus:border-indigo-500"
            />
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth(null)}
                className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="p-5 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="mb-1 text-sm font-medium text-gray-500">Total Leaves</h3>
            <p className="text-2xl font-semibold text-gray-800">{leaves.length}</p>
          </div>
          <div className="p-5 transition-shadow bg-white border border-green-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="mb-1 text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
          </div>
          <div className="p-5 transition-shadow bg-white border border-red-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="mb-1 text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
          </div>
          <div className="p-5 transition-shadow bg-white border border-yellow-100 shadow-sm rounded-xl hover:shadow-md">
            <h3 className="mb-1 text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            {selectedMonth
              ? dayjs(selectedMonth).format('MMMM YYYY')
              : 'Current Month'} Summary
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              <h3 className="mb-1 text-sm font-medium text-blue-600">Annual Quota</h3>
              <p className="text-xl font-semibold text-blue-800">{leaveStats.annualQuota} days</p>
            </div>
            <div className="p-4 border border-green-100 rounded-lg bg-green-50">
              <h3 className="mb-1 text-sm font-medium text-green-600">Remaining</h3>
              <p className="text-xl font-semibold text-green-800">{leaveStats.remainingDays} days</p>
            </div>
            <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
              <h3 className="mb-1 text-sm font-medium text-purple-600">Monthly Quota</h3>
              <p className="text-xl font-semibold text-purple-800">{leaveStats.monthlyQuota.toFixed(1)} days</p>
            </div>
            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
              <h3 className="mb-1 text-sm font-medium text-amber-600">Used This Month</h3>
              <p className="text-xl font-semibold text-amber-800">
                {leaveStats.monthlyUsedDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-indigo-800">
              Leave History for {selectedMonth
                ? dayjs(selectedMonth).format('MMMM YYYY')
                : 'Current Month'}
            </h2>
          </div>

          {leaveStats.processedLeaves
            .filter(leave => selectedMonth
              ? leave.month === parseInt(selectedMonth.split('-')[1]) &&
              leave.year === parseInt(selectedMonth.split('-')[0])
              : true
            )
            .length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Days</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leaveStats.processedLeaves
                    .filter(leave => selectedMonth
                      ? leave.month === parseInt(selectedMonth.split('-')[1]) &&
                      leave.year === parseInt(selectedMonth.split('-')[0])
                      : true
                    )
                    .map((leave, index) => (
                      <tr key={leave._id || index} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {leave.totalDays}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {leave.leaveType || 'Regular Leave'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={leave.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-b-xl">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-700">No leave records found</h3>
              <p className="mt-1 text-sm text-gray-500">No leave applications for the selected period.</p>
            </div>
          )}
        </div>
      </div>
    </PageWithCloseButton>
  );
};

export default Leaves;