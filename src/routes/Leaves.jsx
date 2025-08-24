// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = ({ leaves, remainingLeaves, TOTAL_ANNUAL_LEAVES }) => {
//   const { approvedCount, rejectedCount, paidCount, sundayCount } = React.useMemo(() => {
//     const result = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       paidCount: 0,
//       sundayCount: 0
//     };

//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;

//       if (isSunday) {
//         result.sundayCount++;
//         return;
//       }

//       if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   return (
//     <PageWithCloseButton title="📝 Leaves">
//       <div className="space-y-4">
//         <div className="flex flex-wrap justify-center gap-3 text-sm">
//           <span>Total: <strong>{leaves.length || 0}</strong></span>
//           <span className="text-green-600">Approved: <strong>{approvedCount}</strong></span>
//           <span className="text-red-600">Rejected: <strong>{rejectedCount}</strong></span>
//           <span className="text-blue-600">Paid: <strong>{paidCount}</strong></span>
//           <span className="text-purple-600">Sundays: <strong>{sundayCount}</strong></span>
//         </div>

//         <p className="text-sm font-semibold text-gray-800">
//           🧮 Remaining Leaves:
//           <span className="text-blue-700"> {remainingLeaves} </span> / {TOTAL_ANNUAL_LEAVES}
//           <span className="text-xs text-gray-500 ml-2">(Sundays not deducted)</span>
//         </p>

//         {leaves.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left border rounded overflow-hidden">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 border">#</th>
//                   <th className="px-4 py-2 border">Type</th>
//                   <th className="px-4 py-2 border">From</th>
//                   <th className="px-4 py-2 border">To</th>
//                   <th className="px-4 py-2 border">Days</th>
//                   <th className="px-4 py-2 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.map((l, index) => {
//                   if (!l || !l.from || !l.to) return null;

//                   const fromDate = new Date(l.from);
//                   const toDate = new Date(l.to);
//                   if (isNaN(fromDate.getTime())) return null;

//                   const dayCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//                   const isSunday = fromDate.getDay() === 0 && toDate.getDay() === 0;

//                   return (
//                     <tr
//                       key={l._id || `leave-${index}`}
//                       className={isSunday ? 'text-purple-600' : ''}
//                     >
//                       <td className="px-4 py-2 border">{index + 1}</td>
//                       <td className="px-4 py-2 border">{isSunday ? '🌞 Sunday' : '📅 Leave'}</td>
//                       <td className="px-4 py-2 border">{fromDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{toDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{dayCount}</td>
//                       <td className={`px-4 py-2 border font-semibold ${l.status === 'Approved' ? 'text-green-600' :
//                         l.status === 'Rejected' ? 'text-red-500' :
//                           l.status === 'Paid Leave' ? 'text-blue-600' :
//                             'text-gray-600'
//                         }`}>
//                         {l.status || 'Pending'}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No leave records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//---------------------------------------

// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = ({
//   leaves = [],
//   remainingLeaves = 0,
//   TOTAL_ANNUAL_LEAVES = 24
// }) => {
//   const { approvedCount, rejectedCount, paidCount, sundayCount } = React.useMemo(() => {
//     const result = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       paidCount: 0,
//       sundayCount: 0
//     };

//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;

//       if (isSunday) {
//         result.sundayCount++;
//         return;
//       }

//       if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   return (
//     <PageWithCloseButton title="📝 Leaves">
//       <div className="space-y-4">
//         <div className="flex flex-wrap justify-center gap-3 text-sm">
//           <span>Total: <strong>{leaves.length}</strong></span>
//           <span className="text-green-600">Approved: <strong>{approvedCount}</strong></span>
//           <span className="text-red-600">Rejected: <strong>{rejectedCount}</strong></span>
//           <span className="text-blue-600">Paid: <strong>{paidCount}</strong></span>
//           <span className="text-purple-600">Sundays: <strong>{sundayCount}</strong></span>
//         </div>

//         <p className="text-sm font-semibold text-gray-800">
//           🧮 Remaining Leaves:
//           <span className="text-blue-700"> {remainingLeaves} </span> / {TOTAL_ANNUAL_LEAVES}
//           <span className="text-xs text-gray-500 ml-2">(Sundays not deducted)</span>
//         </p>

//         {leaves.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left border rounded overflow-hidden">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 border">#</th>
//                   <th className="px-4 py-2 border">Type</th>
//                   <th className="px-4 py-2 border">From</th>
//                   <th className="px-4 py-2 border">To</th>
//                   <th className="px-4 py-2 border">Days</th>
//                   <th className="px-4 py-2 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.map((l, index) => {
//                   if (!l || !l.from || !l.to) return null;

//                   const fromDate = new Date(l.from);
//                   const toDate = new Date(l.to);
//                   if (isNaN(fromDate.getTime())) return null;

//                   const dayCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//                   const isSunday = fromDate.getDay() === 0 && toDate.getDay() === 0;

//                   return (
//                     <tr
//                       key={l._id || `leave-${index}`}
//                       className={isSunday ? 'text-purple-600' : ''}
//                     >
//                       <td className="px-4 py-2 border">{index + 1}</td>
//                       <td className="px-4 py-2 border">{isSunday ? '🌞 Sunday' : '📅 Leave'}</td>
//                       <td className="px-4 py-2 border">{fromDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{toDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{dayCount}</td>
//                       <td className={`px-4 py-2 border font-semibold ${
//                         l.status === 'Approved' ? 'text-green-600' :
//                         l.status === 'Rejected' ? 'text-red-500' :
//                         l.status === 'Paid Leave' ? 'text-blue-600' :
//                         'text-gray-600'
//                       }`}>
//                         {l.status || 'Pending'}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No leave records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//----------------------------
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = () => {
//   const {
//     leaves = [],
//     remainingLeaves = 0,
//     TOTAL_ANNUAL_LEAVES = 24
//   } = useOutletContext();

//   const {
//     approvedCount,
//     rejectedCount,
//     paidCount,
//     sundayCount
//   } = React.useMemo(() => {
//     const result = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       paidCount: 0,
//       sundayCount: 0
//     };

//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;

//       if (isSunday) {
//         result.sundayCount++;
//         return;
//       }

//       if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

//   return (
//     <PageWithCloseButton title="📝 Leaves">
//       <div className="space-y-4">
//         <div className="flex flex-wrap justify-center gap-3 text-sm">
//           <span>Total: <strong>{leaves.length}</strong></span>
//           <span className="text-green-600">Approved: <strong>{approvedCount}</strong></span>
//           <span className="text-red-600">Rejected: <strong>{rejectedCount}</strong></span>
//           <span className="text-blue-600">Paid: <strong>{paidCount}</strong></span>
//           <span className="text-purple-600">Sundays: <strong>{sundayCount}</strong></span>
//         </div>

//         <p className="text-sm font-semibold text-gray-800">
//           🧮 Remaining Leaves:
//           <span className="text-blue-700"> {remainingLeaves} </span> / {TOTAL_ANNUAL_LEAVES}
//           <span className="text-xs text-gray-500 ml-2">(Sundays not deducted)</span>
//         </p>

//         {leaves.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left border rounded overflow-hidden">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 border">#</th>
//                   <th className="px-4 py-2 border">Type</th>
//                   <th className="px-4 py-2 border">From</th>
//                   <th className="px-4 py-2 border">To</th>
//                   <th className="px-4 py-2 border">Days</th>
//                   <th className="px-4 py-2 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.map((l, index) => {
//                   if (!l || !l.from || !l.to) return null;

//                   const fromDate = new Date(l.from);
//                   const toDate = new Date(l.to);
//                   if (isNaN(fromDate.getTime())) return null;

//                   const dayCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//                   const isSunday = fromDate.getDay() === 0 && toDate.getDay() === 0;

//                   return (
//                     <tr
//                       key={l._id || `leave-${index}`}
//                       className={isSunday ? 'text-purple-600' : ''}
//                     >
//                       <td className="px-4 py-2 border">{index + 1}</td>
//                       <td className="px-4 py-2 border">{isSunday ? '🌞 Sunday' : '📅 Leave'}</td>
//                       <td className="px-4 py-2 border">{fromDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{toDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{dayCount}</td>
//                       <td className={`px-4 py-2 border font-semibold ${
//                         l.status === 'Approved' ? 'text-green-600' :
//                         l.status === 'Rejected' ? 'text-red-500' :
//                         l.status === 'Paid Leave' ? 'text-blue-600' :
//                         'text-gray-600'
//                       }`}>
//                         {l.status || 'Pending'}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No leave records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//====================================
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = () => {
//   const {
//     leaves = [],
//     remainingLeaves = 0,
//     TOTAL_ANNUAL_LEAVES = 24
//   } = useOutletContext();

//   const monthlyQuota = TOTAL_ANNUAL_LEAVES / 12;

//   const {
//     approvedCount,
//     rejectedCount,
//     paidCount,
//     sundayCount
//   } = React.useMemo(() => {
//     const result = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       paidCount: 0,
//       sundayCount: 0
//     };

//     if (!Array.isArray(leaves)) return result;

//     leaves.forEach(l => {
//       if (!l || !l.from || !l.to) return;
//       const fromDay = new Date(l.from).getDay();
//       const toDay = new Date(l.to).getDay();
//       const isSunday = fromDay === 0 && toDay === 0;

//       if (isSunday) {
//         result.sundayCount++;
//         return;
//       }

//       if (l.status === 'Approved') result.approvedCount++;
//       else if (l.status === 'Rejected') result.rejectedCount++;
//       else if (l.status === 'Paid Leave') result.paidCount++;
//     });

//     return result;
//   }, [leaves]);

  
//   return (
//     <PageWithCloseButton title="📝 Leaves">
//       <div className="space-y-4">
//         <div className="flex flex-wrap justify-center gap-3 text-sm">
//           <span>Total: <strong>{leaves.length}</strong></span>
//           <span className="text-green-600">Approved: <strong>{approvedCount}</strong></span>
//           <span className="text-red-600">Rejected: <strong>{rejectedCount}</strong></span>
//           <span className="text-blue-600">Paid: <strong>{paidCount}</strong></span>
//           <span className="text-purple-600">Sundays: <strong>{sundayCount}</strong></span>
//         </div>

//         <p className="text-sm font-semibold text-gray-800">
//           🧮 Remaining Leaves:
//           <span className="text-blue-700"> {remainingLeaves} </span> / {TOTAL_ANNUAL_LEAVES}
//           <span className="text-xs text-gray-500 ml-2">(Sundays not deducted)</span>
//         </p>

//         <p className="text-sm text-gray-700">
//           📆 Monthly Leave Quota: <strong>{monthlyQuota.toFixed(1)}</strong> days/month
//         </p>

//         {leaves.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left border rounded overflow-hidden">
//               <thead className="bg-gray-100 text-gray-700">
//                 <tr>
//                   <th className="px-4 py-2 border">#</th>
//                   <th className="px-4 py-2 border">Type</th>
//                   <th className="px-4 py-2 border">From</th>
//                   <th className="px-4 py-2 border">To</th>
//                   <th className="px-4 py-2 border">Days</th>
//                   <th className="px-4 py-2 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves.map((l, index) => {
//                   if (!l || !l.from || !l.to) return null;

//                   const fromDate = new Date(l.from);
//                   const toDate = new Date(l.to);
//                   if (isNaN(fromDate.getTime())) return null;

//                   const dayCount = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
//                   const isSunday = fromDate.getDay() === 0 && toDate.getDay() === 0;

//                   return (
//                     <tr
//                       key={l._id || `leave-${index}`}
//                       className={isSunday ? 'text-purple-600' : ''}
//                     >
//                       <td className="px-4 py-2 border">{index + 1}</td>
//                       <td className="px-4 py-2 border">{isSunday ? '🌞 Sunday' : '📅 Leave'}</td>
//                       <td className="px-4 py-2 border">{fromDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{toDate.toLocaleDateString()}</td>
//                       <td className="px-4 py-2 border">{dayCount}</td>
//                       <td className={`px-4 py-2 border font-semibold ${
//                         l.status === 'Approved' ? 'text-green-600' :
//                         l.status === 'Rejected' ? 'text-red-500' :
//                         l.status === 'Paid Leave' ? 'text-blue-600' :
//                         'text-gray-600'
//                       }`}>
//                         {l.status || 'Pending'}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No leave records found.</p>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//=================================
// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = () => {
//   const {
//     leaves = [],
//     currentEmployee = {}
//   } = useOutletContext();

//   // Configuration
//   const DEFAULT_ANNUAL_LEAVE_QUOTA = 24; // Company policy of 24 days annual leave
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   // Calculate leave statistics
//   const {
//     approvedCount,
//     rejectedCount,
//     pendingCount,
//     sundayCount,
//     leaveStats
//   } = React.useMemo(() => {
//     // Initialize counters
//     const counters = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       pendingCount: 0,
//       sundayCount: 0
//     };

//     // Helper function to count Sundays between two dates
//     const countSundaysBetween = (startDate, endDate) => {
//       let sundays = 0;
//       const current = new Date(startDate);
//       const end = new Date(endDate);
      
//       while (current <= end) {
//         if (current.getDay() === 0) sundays++;
//         current.setDate(current.getDate() + 1);
//       }
//       return sundays;
//     };

//     // Process each leave record
//     const processedLeaves = leaves.map(leave => {
//       if (!leave?.from || !leave?.to) return null;

//       const fromDate = new Date(leave.from);
//       const toDate = new Date(leave.to);
      
//       // Validate dates
//       if (isNaN(fromDate.getTime())) return null;

//       const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
//       const sundays = countSundaysBetween(fromDate, toDate);
//       const leaveDays = totalDays - sundays;

//       // Update counters based on leave status
//       if (fromDate.getDay() === 0 && toDate.getDay() === 0) {
//         counters.sundayCount++;
//       } else {
//         switch (leave.status) {
//           case 'Approved': counters.approvedCount++; break;
//           case 'Rejected': counters.rejectedCount++; break;
//           case 'Pending': counters.pendingCount++; break;
//           default: break;
//         }
//       }

//       return {
//         ...leave,
//         fromDate,
//         toDate,
//         totalDays,
//         sundays,
//         leaveDays,
//         isSunday: fromDate.getDay() === 0 && toDate.getDay() === 0
//       };
//     }).filter(Boolean); // Remove null entries

//     // Calculate annual and monthly stats
//     const annualQuota = currentEmployee.leaveQuota || DEFAULT_ANNUAL_LEAVE_QUOTA;
//     const monthlyQuota = annualQuota / 12;

//     const approvedLeaves = processedLeaves.filter(l => l.status === 'Approved' && !l.isSunday);
//     const totalUsedDays = approvedLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const remainingDays = Math.max(annualQuota - totalUsedDays, 0);

//     // Monthly calculations
//     const currentMonthLeaves = approvedLeaves.filter(leave => {
//       return leave.fromDate.getMonth() + 1 === currentMonth && 
//              leave.fromDate.getFullYear() === currentYear;
//     });

//     const monthlyUsedDays = currentMonthLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const monthlySundays = currentMonthLeaves.reduce((sum, leave) => sum + leave.sundays, 0);
//     const monthlyTotalDays = currentMonthLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);

//     return {
//       ...counters,
//       leaveStats: {
//         annualQuota,
//         monthlyQuota,
//         totalUsedDays,
//         remainingDays,
//         monthlyUsedDays,
//         monthlySundays,
//         monthlyTotalDays,
//         processedLeaves
//       }
//     };
//   }, [leaves, currentEmployee, currentMonth, currentYear]);

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

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-100">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-100">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-blue-100">
//             <h3 className="text-sm font-medium text-gray-500">Pending</h3>
//             <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
//           </div>
//         </div>

//         {/* Leave Quota Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Annual Quota</h3>
//               <p className="text-xl font-semibold">{leaveStats.annualQuota} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used</h3>
//               <p className="text-xl font-semibold text-red-600">{leaveStats.totalUsedDays} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
//               <p className="text-xl font-semibold text-green-600">{leaveStats.remainingDays} days</p>
//             </div>
//           </div>
          
//           {/* Progress bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-sm text-gray-600 mb-1">
//               <span>0</span>
//               <span>{leaveStats.annualQuota} days</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{
//                   width: `${Math.min(100, (leaveStats.totalUsedDays / leaveStats.annualQuota) * 100)}%`
//                 }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">
//             {new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Summary
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Monthly Quota</h3>
//               <p className="text-lg font-semibold">{leaveStats.monthlyQuota.toFixed(1)} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used This Month</h3>
//               <p className="text-lg font-semibold">{leaveStats.monthlyUsedDays} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Sundays</h3>
//               <p className="text-lg font-semibold text-purple-600">{leaveStats.monthlySundays}</p>
//             </div>
//           </div>
//         </div>

//         {/* Leave History Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold">Leave History</h2>
//           </div>
          
//           {leaveStats.processedLeaves.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {leaveStats.processedLeaves.map((leave, index) => (
//                     <tr key={leave._id || index} className={leave.isSunday ? 'bg-purple-50' : ''}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {leave.totalDays} {leave.sundays > 0 && `(${leave.leaveDays} + ${leave.sundays} Sun)`}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {leave.isSunday ? 'Sunday' : leave.leaveType || 'Regular Leave'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <StatusBadge status={leave.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               No leave records found
//             </div>
//           )}
//         </div>

//         {/* Detailed Breakdown (collapsible) */}
//         <details className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <summary className="text-lg font-semibold cursor-pointer">Detailed Breakdown</summary>
//           <div className="mt-4 space-y-3">
//             {leaveStats.processedLeaves
//               .filter(leave => !leave.isSunday)
//               .map((leave, idx) => (
//                 <div key={idx} className="p-3 border border-gray-100 rounded-lg">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-medium">
//                         {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                       </p>
//                       <p className="text-sm text-gray-600">{leave.leaveType || 'Regular Leave'}</p>
//                     </div>
//                     <StatusBadge status={leave.status} />
//                   </div>
//                   <div className="mt-2 text-sm">
//                     <p>Total Days: {leave.totalDays} (Leave: {leave.leaveDays}, Sundays: {leave.sundays})</p>
//                     {leave.reason && <p className="text-gray-600 mt-1">Reason: {leave.reason}</p>}
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </details>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//=================================

// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = () => {
//   const {
//     leaves = [],
//     weeklyOffs = [], // Weekly off data from context
//     currentEmployee = {}
//   } = useOutletContext();

//   // Configuration
//   const DEFAULT_ANNUAL_LEAVE_QUOTA = 24;
//   const today = new Date();
//   const currentMonth = today.getMonth() + 1;
//   const currentYear = today.getFullYear();

//   // Get current employee's weekly off day
//   const employeeWeeklyOffDay = weeklyOffs.find(off => 
//     off.employeeId?._id === currentEmployee?._id || 
//     off.employeeId === currentEmployee?._id
//   )?.dayOfWeek || 'Sunday'; // Default to Sunday if not set

//   // Calculate leave statistics with weekly off integration
//   const {
//     approvedCount,
//     rejectedCount,
//     pendingCount,
//     weeklyOffCount,
//     leaveStats
//   } = React.useMemo(() => {
//     // Initialize counters
//     const counters = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       pendingCount: 0,
//       weeklyOffCount: 0
//     };

//     // Helper function to count weekly off days between two dates
//     const countWeeklyOffsBetween = (startDate, endDate, offDay) => {
//       let count = 0;
//       const current = new Date(startDate);
//       const end = new Date(endDate);
//       const dayMap = {
//         'Sunday': 0,
//         'Monday': 1,
//         'Tuesday': 2,
//         'Wednesday': 3,
//         'Thursday': 4,
//         'Friday': 5,
//         'Saturday': 6
//       };
//       const targetDay = dayMap[offDay];
      
//       while (current <= end) {
//         if (current.getDay() === targetDay) count++;
//         current.setDate(current.getDate() + 1);
//       }
//       return count;
//     };

//     // Process each leave record
//     const processedLeaves = leaves.map(leave => {
//       if (!leave?.from || !leave?.to) return null;

//       const fromDate = new Date(leave.from);
//       const toDate = new Date(leave.to);
      
//       // Validate dates
//       if (isNaN(fromDate.getTime())) return null;

//       const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
//       const weeklyOffs = countWeeklyOffsBetween(fromDate, toDate, employeeWeeklyOffDay);
//       const leaveDays = totalDays - weeklyOffs;

//       // Update counters based on leave status
//       if (weeklyOffs > 0) {
//         counters.weeklyOffCount += weeklyOffs;
//       }
      
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
//         weeklyOffs,
//         leaveDays,
//         isWeeklyOff: weeklyOffs > 0 && leaveDays === 0
//       };
//     }).filter(Boolean); // Remove null entries

//     // Calculate annual and monthly stats
//     const annualQuota = currentEmployee.leaveQuota || DEFAULT_ANNUAL_LEAVE_QUOTA;
//     const monthlyQuota = annualQuota / 12;

//     const approvedLeaves = processedLeaves.filter(l => l.status === 'Approved');
//     const totalUsedDays = approvedLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const remainingDays = Math.max(annualQuota - totalUsedDays, 0);

//     // Monthly calculations
//     const currentMonthLeaves = approvedLeaves.filter(leave => {
//       return leave.fromDate.getMonth() + 1 === currentMonth && 
//              leave.fromDate.getFullYear() === currentYear;
//     });

//     const monthlyUsedDays = currentMonthLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const monthlyWeeklyOffs = currentMonthLeaves.reduce((sum, leave) => sum + leave.weeklyOffs, 0);
//     const monthlyTotalDays = currentMonthLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);

//     return {
//       ...counters,
//       leaveStats: {
//         annualQuota,
//         monthlyQuota,
//         totalUsedDays,
//         remainingDays,
//         monthlyUsedDays,
//         monthlyWeeklyOffs,
//         monthlyTotalDays,
//         processedLeaves,
//         employeeWeeklyOffDay
//       }
//     };
//   }, [leaves, currentEmployee, currentMonth, currentYear, employeeWeeklyOffDay]);

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

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-100">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-100">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-blue-100">
//             <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//             <p className="text-2xl font-semibold text-purple-600">{weeklyOffCount}</p>
//           </div>
//         </div>

//         {/* Leave Quota Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Annual Quota</h3>
//               <p className="text-xl font-semibold">{leaveStats.annualQuota} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used</h3>
//               <p className="text-xl font-semibold text-red-600">{leaveStats.totalUsedDays} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
//               <p className="text-xl font-semibold text-green-600">{leaveStats.remainingDays} days</p>
//             </div>
//           </div>
          
//           {/* Progress bar */}
//           <div className="mt-4">
//             <div className="flex justify-between text-sm text-gray-600 mb-1">
//               <span>0</span>
//               <span>{leaveStats.annualQuota} days</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div 
//                 className="bg-blue-600 h-2.5 rounded-full" 
//                 style={{
//                   width: `${Math.min(100, (leaveStats.totalUsedDays / leaveStats.annualQuota) * 100)}%`
//                 }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">
//             {new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Summary
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Monthly Quota</h3>
//               <p className="text-lg font-semibold">{leaveStats.monthlyQuota.toFixed(1)} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used This Month</h3>
//               <p className="text-lg font-semibold">{leaveStats.monthlyUsedDays} days</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//               <p className="text-lg font-semibold text-purple-600">{leaveStats.monthlyWeeklyOffs}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Your Weekly Off</h3>
//               <p className="text-lg font-semibold">{leaveStats.employeeWeeklyOffDay}</p>
//             </div>
//           </div>
//         </div>

//         {/* Leave History Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold">Leave History</h2>
//           </div>
          
//           {leaveStats.processedLeaves.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {leaveStats.processedLeaves.map((leave, index) => (
//                     <tr 
//                       key={leave._id || index} 
//                       className={leave.isWeeklyOff ? 'bg-purple-50' : ''}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {leave.totalDays} {leave.weeklyOffs > 0 && `(${leave.leaveDays} + ${leave.weeklyOffs} ${leaveStats.employeeWeeklyOffDay})`}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {leave.isWeeklyOff ? 
//                           `Weekly Off (${leaveStats.employeeWeeklyOffDay})` : 
//                           leave.leaveType || 'Regular Leave'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <StatusBadge status={leave.status} />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               No leave records found
//             </div>
//           )}
//         </div>

//         {/* Detailed Breakdown (collapsible) */}
//         <details className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <summary className="text-lg font-semibold cursor-pointer">Detailed Breakdown</summary>
//           <div className="mt-4 space-y-3">
//             {leaveStats.processedLeaves.map((leave, idx) => (
//               <div 
//                 key={idx} 
//                 className={`p-3 border rounded-lg ${
//                   leave.isWeeklyOff ? 'border-purple-200 bg-purple-50' : 'border-gray-100'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="font-medium">
//                       {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {leave.isWeeklyOff ? 
//                         `Weekly Off (${leaveStats.employeeWeeklyOffDay})` : 
//                         leave.leaveType || 'Regular Leave'}
//                     </p>
//                   </div>
//                   <StatusBadge status={leave.status} />
//                 </div>
//                 <div className="mt-2 text-sm">
//                   <p>
//                     Total Days: {leave.totalDays} 
//                     {leave.weeklyOffs > 0 && ` (Leave: ${leave.leaveDays}, Weekly Off: ${leave.weeklyOffs})`}
//                   </p>
//                   {leave.reason && <p className="text-gray-600 mt-1">Reason: {leave.reason}</p>}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </details>
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default Leaves;

//==================================
// import React, { useState } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import dayjs from 'dayjs';
// import PageWithCloseButton from './PageWithCloseButton';

// const Leaves = () => {
//   const {
//     leaves = [],
//     weeklyOffs = [],
//     currentEmployee = {}
//   } = useOutletContext();

//   // Configuration
//   const DEFAULT_ANNUAL_LEAVE_QUOTA = 20;
//   const today = new Date();
  
//   // State for month/year selection
//   const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(today.getFullYear());

//   // Get current employee's weekly off day
//   const employeeWeeklyOffDay = weeklyOffs.find(off => 
//     off.employeeId?._id === currentEmployee?._id || 
//     off.employeeId === currentEmployee?._id
//   )?.dayOfWeek || 'Sunday';

//   // Generate month/year options
//   const monthOptions = Array.from({ length: 12 }, (_, i) => ({
//     value: i + 1,
//     label: new Date(0, i).toLocaleString('default', { month: 'long' })
//   }));

//   const yearOptions = Array.from({ length: 5 }, (_, i) => {
//     const year = today.getFullYear() - 2 + i;
//     return { value: year, label: year };
//   });




//    const {
//     approvedCount,
//     rejectedCount,
//     pendingCount,
//     weeklyOffCount,
//     leaveStats
//   } = React.useMemo(() => {
//     // Initialize counters
//     const counters = {
//       approvedCount: 0,
//       rejectedCount: 0,
//       pendingCount: 0,
//       weeklyOffCount: 0
//     };

//     // Helper function to count weekly off days between two dates
//     const countWeeklyOffsBetween = (startDate, endDate, offDay) => {
//       let count = 0;
//       const current = new Date(startDate);
//       const end = new Date(endDate);
//       const dayMap = {
//         'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
//         'Thursday': 4, 'Friday': 5, 'Saturday': 6
//       };
//       const targetDay = dayMap[offDay];
      
//       while (current <= end) {
//         if (current.getDay() === targetDay) count++;
//         current.setDate(current.getDate() + 1);
//       }
//       return count;
//     };

//     // Process each leave record
//     const processedLeaves = leaves.map(leave => {
//       if (!leave?.from || !leave?.to) return null;

//       const fromDate = new Date(leave.from);
//       const toDate = new Date(leave.to);
      
//       // Validate dates
//       if (isNaN(fromDate.getTime())) return null;

//       const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
//       const weeklyOffs = countWeeklyOffsBetween(fromDate, toDate, employeeWeeklyOffDay);
//       const leaveDays = totalDays - weeklyOffs;

//       // Update counters
//       counters.weeklyOffCount += weeklyOffs;
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
//         weeklyOffs,
//         leaveDays,
//         isWeeklyOff: weeklyOffs > 0 && leaveDays === 0,
//         month: fromDate.getMonth() + 1,
//         year: fromDate.getFullYear()
//       };
//     }).filter(Boolean);

//     // Calculate annual and monthly stats
//     const annualQuota = currentEmployee.leaveQuota || DEFAULT_ANNUAL_LEAVE_QUOTA;
//     const monthlyQuota = annualQuota / 12;

//     const approvedLeaves = processedLeaves.filter(l => l.status === 'Approved');
//     const totalUsedDays = approvedLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const remainingDays = Math.max(annualQuota - totalUsedDays, 0);

//     // Monthly calculations for selected period
//     const selectedMonthLeaves = approvedLeaves.filter(leave => 
//       leave.month === selectedMonth && 
//       leave.year === selectedYear
//     );

//     const monthlyUsedDays = selectedMonthLeaves.reduce((sum, leave) => sum + leave.leaveDays, 0);
//     const monthlyWeeklyOffs = selectedMonthLeaves.reduce((sum, leave) => sum + leave.weeklyOffs, 0);
//     const monthlyTotalDays = selectedMonthLeaves.reduce((sum, leave) => sum + leave.totalDays, 0);

//     // Calculate ALL weekly offs for the selected month (not just those in leave periods)
//     const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
//     let totalWeeklyOffsInMonth = 0;
//     const dayMap = {
//       'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
//       'Thursday': 4, 'Friday': 5, 'Saturday': 6
//     };
//     const targetDay = dayMap[employeeWeeklyOffDay];
    
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(selectedYear, selectedMonth - 1, day);
//       if (date.getDay() === targetDay) totalWeeklyOffsInMonth++;
//     }

//     return {
//       ...counters,
//       weeklyOffCount: totalWeeklyOffsInMonth, // Update to show total weekly offs in month
//       leaveStats: {
//         annualQuota,
//         monthlyQuota,
//         totalUsedDays,
//         remainingDays,
//         monthlyUsedDays,
//         monthlyWeeklyOffs,
//         monthlyTotalDays,
//         expectedWeeklyOffs: totalWeeklyOffsInMonth,
//         processedLeaves,
//         employeeWeeklyOffDay
//       }
//     };
//   }, [leaves, currentEmployee, selectedMonth, selectedYear, employeeWeeklyOffDay]);

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

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Month/Year Selection */}
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-3">Select Period</h2>
//           <div className="flex flex-wrap gap-4">
//             <div className="flex-1 min-w-[150px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//               <select
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {monthOptions.map(month => (
//                   <option key={month.value} value={month.value}>{month.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex-1 min-w-[150px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//               <select
//                 value={selectedYear}
//                 onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {yearOptions.map(year => (
//                   <option key={year.value} value={year.value}>{year.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-100">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-100">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-purple-100">
//             <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//             <p className="text-2xl font-semibold text-purple-600">{weeklyOffCount}</p>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">
//             {new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Summary
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Monthly Quota</h3>
//               {/* <p className="text-xl font-semibold">{leaveStats.monthlyQuota.toFixed(1)} days</p> */}
//               <p className="text-xl font-semibold">{leaveStats.monthlyQuota} days</p>

//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Used This Month</h3>
//               <p className="text-xl font-semibold">
//                 {leaveStats.monthlyUsedDays} / {leaveStats.monthlyQuota} days
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
//               <p className="text-xl font-semibold">{leaveStats.employeeWeeklyOffDay}</p>
//             </div>
//           </div>
//         </div>

//         {/* Leave History Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
//           <div className="p-4 border-b border-gray-200">
//             <h2 className="text-lg font-semibold">
//               Leave History for {monthOptions[selectedMonth - 1].label} {selectedYear}
//             </h2>
//           </div>
          
//           {leaveStats.processedLeaves
//             .filter(leave => leave.month === selectedMonth && leave.year === selectedYear)
//             .length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {leaveStats.processedLeaves
//                     .filter(leave => leave.month === selectedMonth && leave.year === selectedYear)
//                     .map((leave, index) => (
//                       <tr 
//                         key={leave._id || index} 
//                         className={leave.isWeeklyOff ? 'bg-purple-50' : ''}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {leave.totalDays} {leave.weeklyOffs > 0 && `(${leave.leaveDays} + ${leave.weeklyOffs} ${leaveStats.employeeWeeklyOffDay})`}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {leave.isWeeklyOff ? 
//                             `Weekly Off (${leaveStats.employeeWeeklyOffDay})` : 
//                             leave.leaveType || 'Regular Leave'}
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

//=============================


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

//   const [employeeId, setEmployeeId] = useState(null);
//   const [weeklyOffs, setWeeklyOffs] = useState([]);
//   const [loadingWeeklyOffs, setLoadingWeeklyOffs] = useState(true);
//   const [error, setError] = useState(null);

//   // First fetch current employee data to get the employeeId
//   useEffect(() => {
//     const fetchCurrentEmployee = async () => {
//       try {
//         const response = await API.get('/employees/me'); // Assuming you have an endpoint to get current employee
//         if (response.data?._id) {
//           setEmployeeId(response.data._id);
//         } else {
//           setError('Unable to fetch employee data');
//         }
//       } catch (err) {
//         console.error('Error fetching employee data:', err);
//         setError('Failed to load employee data');
//       }
//     };

//     fetchCurrentEmployee();
//   }, []);

//   // Fetch weekly off data for the employee once we have the ID
//   useEffect(() => {
//     if (!employeeId) return;

//     const fetchWeeklyOffs = async () => {
//       try {
//         const response = await API.get(`/weekly-offs/${employeeId}`);
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
//   }, [employeeId]);

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
//   if (loadingWeeklyOffs || !employeeId) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       </PageWithCloseButton>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm">{error}</div>
//       </PageWithCloseButton>
//     );
//   }

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Month Selector */}
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-3">Select Period</h2>
//           <div className="flex flex-wrap gap-4">
//             <DatePicker
//               picker="month"
//               format="MMM YYYY"
//               value={selectedMonth ? dayjs(selectedMonth) : null}
//               onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : null)}
//               allowClear
//               className="w-full sm:w-48 border-gray-300 rounded-lg hover:border-indigo-400 focus:border-indigo-500 transition-colors"
//             />
//             <button
//               onClick={() => setSelectedMonth(null)}
//               className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//             >
//               Clear filter
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-100">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-100">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-purple-100">
//             <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//             <p className="text-2xl font-semibold text-purple-600">{leaveStats.monthlyWeeklyOffs}</p>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">
//             {selectedMonth
//               ? dayjs(selectedMonth).format('MMMM YYYY')
//               : 'Current Month'} Summary
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
//           <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-xl p-6 shadow-md">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">Your Weekly Off Schedule</h2>
//             <p className="text-sm text-gray-600 mb-3">
//               Showing your weekly offs for{' '}
//               {selectedMonth
//                 ? dayjs(selectedMonth).format('MMMM YYYY')
//                 : 'all months'}.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {leaveStats.weeklyOffsData.map((off) => (
//                 <div
//                   key={off.id}
//                   className="px-3 py-1 rounded-lg text-sm bg-white text-indigo-800 border border-indigo-200 shadow-sm"
//                 >
//                   📅 {off.date.format('DD MMM')} • {off.dayOfWeek}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Leave History Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {leave.totalDays}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//         </div>
//       </PageWithCloseButton>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm">{error}</div>
//       </PageWithCloseButton>
//     );
//   }

//   // No employee ID state
//   if (!employeeId) {
//     return (
//       <PageWithCloseButton title="📝 Leave Management">
//         <div className="bg-yellow-50 text-yellow-600 p-6 rounded-xl shadow-sm">
//           Unable to load employee data. Please try logging in again or contact support.
//         </div>
//       </PageWithCloseButton>
//     );
//   }

//   return (
//     <PageWithCloseButton title="📝 Leave Management">
//       <div className="space-y-6">
//         {/* Month Selector */}
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-3">Select Period</h2>
//           <div className="flex flex-wrap gap-4">
//             <DatePicker
//               picker="month"
//               format="MMM YYYY"
//               value={selectedMonth ? dayjs(selectedMonth) : null}
//               onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : null)}
//               allowClear
//               className="w-full sm:w-48 border-gray-300 rounded-lg hover:border-indigo-400 focus:border-indigo-500 transition-colors"
//             />
//             <button
//               onClick={() => setSelectedMonth(null)}
//               className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
//             >
//               Clear filter
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
//             <p className="text-2xl font-semibold">{leaves.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-100">
//             <h3 className="text-sm font-medium text-gray-500">Approved</h3>
//             <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-100">
//             <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
//             <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-purple-100">
//             <h3 className="text-sm font-medium text-gray-500">Weekly Offs</h3>
//             <p className="text-2xl font-semibold text-purple-600">{leaveStats.monthlyWeeklyOffs}</p>
//           </div>
//         </div>

//         {/* Current Month Summary */}
//         <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
//           <h2 className="text-lg font-semibold mb-4">
//             {selectedMonth
//               ? dayjs(selectedMonth).format('MMMM YYYY')
//               : 'Current Month'} Summary
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
//           <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 rounded-xl p-6 shadow-md">
//             <h2 className="text-lg font-semibold text-indigo-700 mb-2">Your Weekly Off Schedule</h2>
//             <p className="text-sm text-gray-600 mb-3">
//               Showing your weekly offs for{' '}
//               {selectedMonth
//                 ? dayjs(selectedMonth).format('MMMM YYYY')
//                 : 'all months'}.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {leaveStats.weeklyOffsData.map((off) => (
//                 <div
//                   key={off.id}
//                   className="px-3 py-1 rounded-lg text-sm bg-white text-indigo-800 border border-indigo-200 shadow-sm"
//                 >
//                   📅 {off.date.format('DD MMM')} • {off.dayOfWeek}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Leave History Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
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
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {leave.totalDays}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100">
          <h2 className="text-lg font-semibold mb-4 text-indigo-800">Select Period</h2>
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker
              picker="month"
              format="MMM YYYY"
              value={selectedMonth ? dayjs(selectedMonth) : null}
              onChange={(date) => setSelectedMonth(date ? date.format('YYYY-MM') : null)}
              allowClear
              className="w-full sm:w-56 border-gray-300 rounded-lg hover:border-indigo-400 focus:border-indigo-500 transition-colors shadow-sm px-4 py-2"
            />
            {selectedMonth && (
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Leaves</h3>
            <p className="text-2xl font-semibold text-gray-800">{leaves.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Approved</h3>
            <p className="text-2xl font-semibold text-green-600">{approvedCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Rejected</h3>
            <p className="text-2xl font-semibold text-red-600">{rejectedCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Pending</h3>
            <p className="text-2xl font-semibold text-yellow-600">{pendingCount}</p>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-5 text-gray-800">
            {selectedMonth
              ? dayjs(selectedMonth).format('MMMM YYYY')
              : 'Current Month'} Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Annual Quota</h3>
              <p className="text-xl font-semibold text-blue-800">{leaveStats.annualQuota} days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm font-medium text-green-600 mb-1">Remaining</h3>
              <p className="text-xl font-semibold text-green-800">{leaveStats.remainingDays} days</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm font-medium text-purple-600 mb-1">Monthly Quota</h3>
              <p className="text-xl font-semibold text-purple-800">{leaveStats.monthlyQuota.toFixed(1)} days</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="text-sm font-medium text-amber-600 mb-1">Used This Month</h3>
              <p className="text-xl font-semibold text-amber-800">
                {leaveStats.monthlyUsedDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                      <tr key={leave._id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {dayjs(leave.fromDate).format('DD MMM YYYY')} - {dayjs(leave.toDate).format('DD MMM YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {leave.totalDays}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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