

//======================================
// import * as XLSX from 'xlsx';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Layout from '../components/Layout';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Attendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState({ employeeId: '', date: '' });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(10);
//   const [downloadLoading, setDownloadLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, [page]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
//       setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Failed to fetch employees:', err);
//       setEmployees([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance`);
//       setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Attendance fetch failed:', err);
//       setAttendance([]);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
//       fetchAttendance();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const filtered = attendance.filter(att => {
//     const matchesEmployee = filter.employeeId ? att.employeeId?._id === filter.employeeId : true;
//     const matchesDate = filter.date 
//       ? dayjs(att.date).local().format('YYYY-MM-DD') === filter.date 
//       : true;

//     if (!filter.date) {
//       const attDate = new Date(att.date);
//       const matchesMonth = attDate.getMonth() + 1 === selectedMonth;
//       const matchesYear = attDate.getFullYear() === selectedYear;
//       return matchesEmployee && matchesMonth && matchesYear;
//     }

//     return matchesEmployee && matchesDate;
//   });

//   const paginated = filtered.slice((page - 1) * perPage, page * perPage);

//   const statusBadge = (status) => {
//     switch (status) {
//       case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
//       case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
//       case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
//       default: return status;
//     }
//   };

//   // const downloadReport = async (type) => {
//   //   setDownloadLoading(true);
//   //   try {
//   //     let dataToExport = filtered;

//   //     if (type === 'all') {
//   //       // If date filter is applied, use that for export
//   //       if (filter.date) {
//   //         dataToExport = attendance.filter(att => 
//   //           dayjs(att.date).local().format('YYYY-MM-DD') === filter.date
//   //         );
//   //       } else {
//   //         // Otherwise use month/year filter
//   //         dataToExport = attendance.filter(att => {
//   //           const attDate = new Date(att.date);
//   //           return (
//   //             attDate.getMonth() + 1 === selectedMonth && 
//   //             attDate.getFullYear() === selectedYear
//   //           );
//   //         });
//   //       }
//   //     }

//   //     const reportContent = [
//   //       `ATTENDANCE REPORT - ${type === 'all' ? 'ALL EMPLOYEES' : employees.find(e => e._id === filter.employeeId)?.name}`,
//   //       filter.date 
//   //         ? `Date: ${new Date(filter.date).toLocaleDateString()}`
//   //         : `Period: ${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`,
//   //       `Generated: ${new Date().toLocaleString()}\n`,
//   //       `Total Records: ${dataToExport.length}\n`,

//   //       ...dataToExport.map((att, index) => [
//   //         `Record ${index + 1}:`,
//   //         `Employee: ${att.employeeId?.name || 'N/A'}`,
//   //         `Email: ${att.employeeId?.email || 'N/A'}`,
//   //         `Date: ${new Date(att.date).toLocaleDateString()}`,
//   //         `Status: ${att.status}`,
//   //         `Recorded At: ${new Date(att.createdAt).toLocaleString()}`,
//   //         '------------------------------------'
//   //       ].join('\n'))
//   //     ].join('\n');

//   //     const blob = new Blob([reportContent], { type: 'text/plain' });
//   //     const link = document.createElement('a');
//   //     link.href = URL.createObjectURL(blob);

//   //     // Set filename based on filters
//   //     let filename = `attendance-${type}`;
//   //     if (filter.date) {
//   //       filename += `-${filter.date}`;
//   //     } else {
//   //       filename += `-${selectedMonth}-${selectedYear}`;
//   //     }

//   //     link.download = `${filename}.txt`;
//   //     link.click();

//   //   } catch (err) {
//   //     console.error('Download failed:', err);
//   //     alert('Failed to generate report');
//   //   } finally {
//   //     setDownloadLoading(false);
//   //   }
//   // };


//    const downloadReport = async (type) => {
//     setDownloadLoading(true);
//     try {
//       let dataToExport = filtered;

//       if (type === 'all') {
//         if (filter.date) {
//           dataToExport = attendance.filter(att => 
//             dayjs(att.date).local().format('YYYY-MM-DD') === filter.date
//           );
//         } else {
//           dataToExport = attendance.filter(att => {
//             const attDate = new Date(att.date);
//             return (
//               attDate.getMonth() + 1 === selectedMonth && 
//               attDate.getFullYear() === selectedYear
//             );
//           });
//         }
//       }

//       // Prepare the data for Excel
//       const excelData = [
//         // Header row
//         [
//           'Employee Name', 
//           'Email', 
//           'Date', 
//           'Status', 
//           'Recorded At'
//         ],
//         // Data rows
//         ...dataToExport.map(att => [
//           att.employeeId?.name || 'N/A',
//           att.employeeId?.email || 'N/A',
//           new Date(att.date).toLocaleDateString(),
//           att.status,
//           new Date(att.createdAt).toLocaleString()
//         ])
//       ];

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(excelData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);

//       let filename = `attendance-${type}`;
//       if (filter.date) {
//         filename += `-${filter.date}`;
//       } else {
//         filename += `-${selectedMonth}-${selectedYear}`;
//       }

//       link.download = `${filename}.xlsx`;
//       link.click();

//     } catch (err) {
//       console.error('Download failed:', err);
//       alert('Failed to generate report');
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
//           <select
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filter.employeeId}
//             onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
//           >
//             <option value="">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>{emp.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filter.date}
//             onChange={e => setFilter({ ...filter, date: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 12}, (_, i) => (
//               <option key={i+1} value={i+1}>
//                 {new Date(0, i).toLocaleString('default', {month: 'long'})}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 5}, (_, i) => {
//               const year = new Date().getFullYear() - 2 + i;
//               return <option key={year} value={year}>{year}</option>;
//             })}
//           </select>
//         </div>

//         {/* Download Buttons */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button 
//             onClick={() => downloadReport('all')}
//             disabled={downloadLoading || (!filter.date && !selectedMonth && !selectedYear)}
//             className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 {filter.date ? 'Download Date Data' : 'Download All Data'}
//               </>
//             )}
//           </button>

//           <button 
//             onClick={() => downloadReport('employee')}
//             disabled={!filter.employeeId || downloadLoading}
//             className="bg-blue-600 !text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Employee Report
//               </>
//             )}
//           </button>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-30  w-7xl">
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
//             <p className="text-2xl font-bold">{filtered.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Present</h3>
//             <p className="text-2xl font-bold text-green-600">
//               {filtered.filter(a => a.status === 'Present').length}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Absent/Leave</h3>
//             <p className="text-2xl font-bold text-red-600">
//               {filtered.filter(a => a.status !== 'Present').length}
//             </p>
//           </div>
//         </div>

//         {/* Mobile Cards View */}
//         <div className="sm:hidden space-y-4">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             paginated.map((att) => (
//               <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
//                     <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
//                   </div>
//                   <span className="text-sm">{new Date(att.date).toLocaleDateString()}</span>
//                 </div>

//                 <div className="mt-3 flex justify-between items-center">
//                   <div>{statusBadge(att.status)}</div>
//                   <select
//                     value={att.status}
//                     onChange={e => handleStatusChange(att._id, e.target.value)}
//                     className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
//                   >
//                     <option value="Present">Present</option>
//                     <option value="Absent">Absent</option>
//                     <option value="Leave">Leave</option>
//                   </select>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden sm:block">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg shadow-md max-w-6xl mx-auto">
//               <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
//                 <thead className="bg-indigo-200">
//                   <tr>
//                     <th className="p-3 text-left">Employee</th>
//                     <th className="p-3 text-left">Email</th>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Status</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((att) => (
//                     <tr key={att._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
//                       <td className="p-3">{att.employeeId?.email || 'N/A'}</td>
//                       <td className="p-3">{new Date(att.date).toLocaleDateString('en-GB')}</td>
//                       <td className="p-3">{statusBadge(att.status)}</td>
//                       <td className="p-3">
//                         <select
//                           value={att.status}
//                           onChange={e => handleStatusChange(att._id, e.target.value)}
//                           className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
//                         >
//                           <option value="Present">Present</option>
//                           <option value="Absent">Absent</option>
//                           <option value="Leave">Leave</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filtered.length > perPage && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               ⬅ Previous
//             </button>
//             <span className="font-semibold">Page {page} of {Math.ceil(filtered.length / perPage)}</span>
//             <button
//               disabled={(page * perPage) >= filtered.length}
//               onClick={() => setPage(page + 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               Next ➡
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;

//-------------------new----------------

// import * as XLSX from 'xlsx';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Layout from '../components/Layout';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Attendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState({ 
//     employeeId: '', 
//     startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
//     endDate: dayjs().format('YYYY-MM-DD')
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     perPage: 10,
//     totalPages: 1,
//     totalCount: 0
//   });
//   const [overallStats, setOverallStats] = useState({
//     totalPresent: 0,
//     totalAbsent: 0,
//     totalLeave: 0,
//     totalWeeklyOff: 0
//   });
//   const [employeeStats, setEmployeeStats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [downloadLoading, setDownloadLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, [filter, pagination.page]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
//       setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Failed to fetch employees:', err);
//       setEmployees([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.page,
//         perPage: pagination.perPage,
//         ...(filter.employeeId && { employeeId: filter.employeeId }),
//         ...(filter.startDate && { startDate: filter.startDate }),
//         ...(filter.endDate && { endDate: filter.endDate })
//       };

//       const res = await axios.get(`${API_URL}/attendance`, { params });

//       if (res.data.status === 'success') {
//         setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
//         setPagination({
//           ...pagination,
//           totalPages: res.data.totalPages,
//           totalCount: res.data.totalCount
//         });
//         setOverallStats(res.data.overallStats || {
//           totalPresent: 0,
//           totalAbsent: 0,
//           totalLeave: 0,
//           totalWeeklyOff: 0
//         });
//         setEmployeeStats(Array.isArray(res.data.employeeStats) ? res.data.employeeStats : []);
//       }
//     } catch (err) {
//       console.error('Attendance fetch failed:', err);
//       setAttendance([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
//       fetchAttendance(); // Refresh the data
//     } catch (err) {
//       console.error('Failed to update status:', err);
//       alert('Failed to update attendance status');
//     }
//   };

//   const statusBadge = (status) => {
//     switch (status) {
//       case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
//       case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
//       case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
//       case 'Weekly Off': return <span className="text-blue-600 font-semibold">🔵 Weekly Off</span>;
//       default: return <span className="text-gray-600 font-semibold">{status}</span>;
//     }
//   };

//   const downloadReport = async (type) => {
//     setDownloadLoading(true);
//     try {
//       // Fetch all data without pagination for the export
//       const params = {
//         perPage: 10000, // Large number to get all records
//         page: 1,
//         ...(filter.employeeId && { employeeId: filter.employeeId }),
//         ...(filter.startDate && { startDate: filter.startDate }),
//         ...(filter.endDate && { endDate: filter.endDate })
//       };

//       const res = await axios.get(`${API_URL}/attendance`, { params });
//       const dataToExport = Array.isArray(res.data.data) ? res.data.data : [];

//       // Prepare the data for Excel
//       const excelData = [
//         // Header row
//         [
//           'Employee Name', 
//           'Email', 
//           'Role',
//           'Date', 
//           'Status', 
//           'Reason',
//           'Record Type'
//         ],
//         // Data rows
//         ...dataToExport.map(att => [
//           att.employeeId?.name || 'N/A',
//           att.employeeId?.email || 'N/A',
//           att.employeeId?.role || 'N/A',
//           dayjs(att.date).format('YYYY-MM-DD'),
//           att.status,
//           att.reason || 'N/A',
//           att.isVirtual ? 'Virtual' : 'Actual'
//         ])
//       ];

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(excelData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);

//       let filename = `attendance-report`;
//       if (filter.employeeId) {
//         const employee = employees.find(e => e._id === filter.employeeId);
//         filename += `-${employee?.name || 'employee'}`;
//       }
//       if (filter.startDate && filter.endDate) {
//         filename += `-${filter.startDate}-to-${filter.endDate}`;
//       }

//       link.download = `${filename}.xlsx`;
//       link.click();

//     } catch (err) {
//       console.error('Download failed:', err);
//       alert('Failed to generate report');
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
//           <select
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filter.employeeId}
//             onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
//           >
//             <option value="">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>{emp.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filter.startDate}
//             onChange={e => setFilter({ ...filter, startDate: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <input
//             type="date"
//             value={filter.endDate}
//             onChange={e => setFilter({ ...filter, endDate: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <button
//             onClick={fetchAttendance}
//             className="bg-indigo-600 !text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Loading...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
//                 </svg>
//                 Refresh
//               </>
//             )}
//           </button>
//         </div>

//         {/* Download Button */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button 
//             onClick={downloadReport}
//             disabled={downloadLoading || attendance.length === 0}
//             className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Download Excel Report
//               </>
//             )}
//           </button>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
//             <p className="text-2xl font-bold">{pagination.totalCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Present</h3>
//             <p className="text-2xl font-bold text-green-600">
//               {overallStats.totalPresent}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Absent</h3>
//             <p className="text-2xl font-bold text-red-600">
//               {overallStats.totalAbsent}
//             </p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Leave/Weekly Off</h3>
//             <p className="text-2xl font-bold text-blue-600">
//               {overallStats.totalLeave + overallStats.totalWeeklyOff}
//             </p>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex justify-center my-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>
//         )}

//         {/* Mobile Cards View */}
//         {!loading && (
//           <div className="sm:hidden space-y-4">
//             {attendance.length === 0 ? (
//               <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                 <p className="text-gray-500">No attendance records found for selected filters</p>
//               </div>
//             ) : (
//               attendance.map((att) => (
//                 <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
//                       <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
//                     </div>
//                     <span className="text-sm">{dayjs(att.date).format('YYYY-MM-DD')}</span>
//                   </div>

//                   <div className="mt-3 flex justify-between items-center">
//                     <div>{statusBadge(att.status)}</div>
//                     {att.isVirtual ? (
//                       <span className="text-xs text-gray-500 italic">System Generated</span>
//                     ) : (
//                       <select
//                         value={att.status}
//                         onChange={e => handleStatusChange(att._id, e.target.value)}
//                         className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
//                       >
//                         <option value="Present">Present</option>
//                         <option value="Absent">Absent</option>
//                         <option value="Leave">Leave</option>
//                         <option value="Weekly Off">Weekly Off</option>
//                       </select>
//                     )}
//                   </div>
//                   {att.reason && (
//                     <div className="mt-2 text-sm text-gray-600">
//                       Reason: {att.reason}
//                     </div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Desktop Table View */}
//         {!loading && (
//           <div className="hidden sm:block">
//             {attendance.length === 0 ? (
//               <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                 <p className="text-gray-500">No attendance records found for selected filters</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto rounded-lg shadow-md">
//                 <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
//                   <thead className="bg-indigo-200">
//                     <tr>
//                       <th className="p-3 text-left">Employee</th>
//                       <th className="p-3 text-left">Email</th>
//                       <th className="p-3 text-left">Date</th>
//                       <th className="p-3 text-left">Status</th>
//                       <th className="p-3 text-left">Reason</th>
//                       <th className="p-3 text-left">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {attendance.map((att) => (
//                       <tr key={att._id} className="border-b hover:bg-gray-50">
//                         <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
//                         <td className="p-3">{att.employeeId?.email || 'N/A'}</td>
//                         <td className="p-3">{dayjs(att.date).format('YYYY-MM-DD')}</td>
//                         <td className="p-3">{statusBadge(att.status)}</td>
//                         <td className="p-3">{att.reason || 'N/A'}</td>
//                         <td className="p-3">
//                           {att.isVirtual ? (
//                             <span className="text-xs text-gray-500 italic">System Generated</span>
//                           ) : (
//                             <select
//                               value={att.status}
//                               onChange={e => handleStatusChange(att._id, e.target.value)}
//                               className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
//                             >
//                               <option value="Present">Present</option>
//                               <option value="Absent">Absent</option>
//                               <option value="Leave">Leave</option>
//                               <option value="Weekly Off">Weekly Off</option>
//                             </select>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {!loading && pagination.totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={pagination.page === 1}
//               onClick={() => setPagination({...pagination, page: pagination.page - 1})}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               ⬅ Previous
//             </button>
//             <span className="font-semibold">Page {pagination.page} of {pagination.totalPages}</span>
//             <button
//               disabled={pagination.page >= pagination.totalPages}
//               onClick={() => setPagination({...pagination, page: pagination.page + 1})}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               Next ➡
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;

//------------------
// import * as XLSX from 'xlsx';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Layout from '../components/Layout';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Attendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState({ employeeId: '', date: '' });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(10);
//   const [downloadLoading, setDownloadLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, [page]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
//       setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Failed to fetch employees:', err);
//       setEmployees([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance`);
//       setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Attendance fetch failed:', err);
//       setAttendance([]);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
//       fetchAttendance();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };
// // Utility: Convert actual timestamp to shiftDate
// const getShiftDate = (dateString) => {
//   const d = dayjs(dateString).local(); // use local time
//   const shiftStart = d.hour() >= 17;   // If 5 PM or later, it's today’s shift

//   if (shiftStart) {
//     // Example: 20th Aug 20:30 → shift date = 20th Aug
//     return d.format("YYYY-MM-DD");
//   } else {
//     // Example: 21st Aug 02:00 → belongs to 20th Aug shift
//     return d.subtract(1, "day").format("YYYY-MM-DD");
//   }
// };
// const filtered = attendance.filter(att => {
//   const matchesEmployee = filter.employeeId ? att.employeeId?._id === filter.employeeId : true;

//   const shiftDate = getShiftDate(att.date);

//   const matchesDate = filter.date 
//     ? shiftDate === filter.date
//     : true;

//   if (!filter.date) {
//     const [year, month] = shiftDate.split("-");
//     return (
//       matchesEmployee &&
//       parseInt(month) === selectedMonth &&
//       parseInt(year) === selectedYear
//     );
//   }

//   return matchesEmployee && matchesDate;
// });

//   // const filtered = attendance.filter(att => {
//   //   const matchesEmployee = filter.employeeId ? att.employeeId?._id === filter.employeeId : true;
//   //   const matchesDate = filter.date 
//   //     ? dayjs(att.date).local().format('YYYY-MM-DD') === filter.date 
//   //     : true;

//   //   if (!filter.date) {
//   //     const attDate = new Date(att.date);
//   //     const matchesMonth = attDate.getMonth() + 1 === selectedMonth;
//   //     const matchesYear = attDate.getFullYear() === selectedYear;
//   //     return matchesEmployee && matchesMonth && matchesYear;
//   //   }

//   //   return matchesEmployee && matchesDate;
//   // });

//   const paginated = filtered.slice((page - 1) * perPage, page * perPage);

//   const statusBadge = (status) => {
//     switch (status) {
//       case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
//       case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
//       case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
//       case 'Weekly Off': return <span className="text-blue-600 font-semibold">🔵 Weekly Off</span>;
//       default: return status;
//     }
//   };

//   const downloadReport = async (type) => {
//     setDownloadLoading(true);
//     try {
//       let dataToExport = filtered;

//       if (type === 'all') {
//         if (filter.date) {
//           dataToExport = attendance.filter(att => 
//             dayjs(att.date).local().format('YYYY-MM-DD') === filter.date
//           );
//         } else {
//           dataToExport = attendance.filter(att => {
//             const attDate = new Date(att.date);
//             return (
//               attDate.getMonth() + 1 === selectedMonth && 
//               attDate.getFullYear() === selectedYear
//             );
//           });
//         }
//       }

//       // Prepare the data for Excel
//       const excelData = [
//         // Header row
//         [
//           'Employee Name', 
//           'Email', 
//           'Date', 
//           'Status', 
//           'Recorded At'
//         ],
//         // Data rows
//         ...dataToExport.map(att => [
//           att.employeeId?.name || 'N/A',
//           att.employeeId?.email || 'N/A',
//           // new Date(att.date).toLocaleDateString(),
//           getShiftDate(att.date),

//           att.status,
//           new Date(att.createdAt).toLocaleString()
//         ])
//       ];

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(excelData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);

//       let filename = `attendance-${type}`;
//       if (filter.date) {
//         filename += `-${filter.date}`;
//       } else {
//         filename += `-${selectedMonth}-${selectedYear}`;
//       }

//       link.download = `${filename}.xlsx`;
//       link.click();

//     } catch (err) {
//       console.error('Download failed:', err);
//       alert('Failed to generate report');
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   // Calculate statistics
//   const presentCount = filtered.filter(a => a.status === 'Present').length;
//   const absentCount = filtered.filter(a => a.status === 'Absent').length;
//   const leaveCount = filtered.filter(a => a.status === 'Leave').length;
//   const weeklyOffCount = filtered.filter(a => a.status === 'Weekly Off').length;

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
//           <select
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filter.employeeId}
//             onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
//           >
//             <option value="">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>{emp.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filter.date}
//             onChange={e => setFilter({ ...filter, date: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 12}, (_, i) => (
//               <option key={i+1} value={i+1}>
//                 {new Date(0, i).toLocaleString('default', {month: 'long'})}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 5}, (_, i) => {
//               const year = new Date().getFullYear() - 2 + i;
//               return <option key={year} value={year}>{year}</option>;
//             })}
//           </select>
//         </div>

//         {/* Download Buttons */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button 
//             onClick={() => downloadReport('all')}
//             disabled={downloadLoading || (!filter.date && !selectedMonth && !selectedYear)}
//             className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 {filter.date ? 'Download Date Data' : 'Download All Data'}
//               </>
//             )}
//           </button>

//           <button 
//             onClick={() => downloadReport('employee')}
//             disabled={!filter.employeeId || downloadLoading}
//             className="bg-blue-600 !text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Employee Report
//               </>
//             )}
//           </button>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-30 w-7xl">
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
//             <p className="text-2xl font-bold">{filtered.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Present</h3>
//             <p className="text-2xl font-bold text-green-600">{presentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Absent</h3>
//             <p className="text-2xl font-bold text-red-600">{absentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Leave</h3>
//             <p className="text-2xl font-bold text-yellow-600">{leaveCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Weekly Off</h3>
//             <p className="text-2xl font-bold text-blue-600">{weeklyOffCount}</p>
//           </div>
//         </div>

//         {/* Mobile Cards View */}
//         <div className="sm:hidden space-y-4">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             paginated.map((att) => (
//               <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
//                     <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
//                   </div>
//                   <span className="text-sm">{new Date(att.date).toLocaleDateString()}</span>
//                 </div>

//                 <div className="mt-3 flex justify-between items-center">
//                   <div>{statusBadge(att.status)}</div>
//                   <select
//                     value={att.status}
//                     onChange={e => handleStatusChange(att._id, e.target.value)}
//                     className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
//                   >
//                     <option value="Present">Present</option>
//                     <option value="Absent">Absent</option>
//                     <option value="Leave">Leave</option>
//                     <option value="Weekly Off">Weekly Off</option>
//                   </select>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden sm:block">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg shadow-md max-w-6xl mx-auto">
//               <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
//                 <thead className="bg-indigo-200">
//                   <tr>
//                     <th className="p-3 text-left">Employee</th>
//                     <th className="p-3 text-left">Email</th>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Status</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((att) => (
//                     <tr key={att._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
//                       <td className="p-3">{att.employeeId?.email || 'N/A'}</td>
//                       <td className="p-3">{new Date(att.date).toLocaleDateString('en-GB')}</td>
//                       <td className="p-3">{statusBadge(att.status)}</td>
//                       <td className="p-3">
//                         <select
//                           value={att.status}
//                           onChange={e => handleStatusChange(att._id, e.target.value)}
//                           className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
//                         >
//                           <option value="Present">Present</option>
//                           <option value="Absent">Absent</option>
//                           <option value="Leave">Leave</option>
//                           <option value="Weekly Off">Weekly Off</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filtered.length > perPage && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               ⬅ Previous
//             </button>
//             <span className="font-semibold">Page {page} of {Math.ceil(filtered.length / perPage)}</span>
//             <button
//               disabled={(page * perPage) >= filtered.length}
//               onClick={() => setPage(page + 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               Next ➡
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;



//===================================
// import * as XLSX from 'xlsx';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Layout from '../components/Layout';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Attendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState({ employeeId: '', date: '' });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(10);
//   const [downloadLoading, setDownloadLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, [page]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
//       setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Failed to fetch employees:', err);
//       setEmployees([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance`);
//       setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Attendance fetch failed:', err);
//       setAttendance([]);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
//       fetchAttendance();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   // Utility: Convert actual timestamp to shiftDate
//   const getShiftDate = (dateString) => {
//     const d = dayjs(dateString).local(); // use local time
//     const shiftStart = d.hour() >= 17;   // If 5 PM or later, it's today's shift

//     if (shiftStart) {
//       // Example: 20th Aug 20:30 → shift date = 20th Aug
//       return d.format("YYYY-MM-DD");
//     } else {
//       // Example: 21st Aug 02:00 → belongs to 20th Aug shift
//       return d.subtract(1, "day").format("YYYY-MM-DD");
//     }
//   };

//   const filtered = attendance.filter(att => {
//     const matchesEmployee = filter.employeeId ? att.employeeId?._id === filter.employeeId : true;

//     const shiftDate = getShiftDate(att.date);

//     const matchesDate = filter.date 
//       ? shiftDate === filter.date
//       : true;

//     if (!filter.date) {
//       const [year, month] = shiftDate.split("-");
//       return (
//         matchesEmployee &&
//         parseInt(month) === selectedMonth &&
//         parseInt(year) === selectedYear
//       );
//     }

//     return matchesEmployee && matchesDate;
//   });

//   const paginated = filtered.slice((page - 1) * perPage, page * perPage);

//   const statusBadge = (status) => {
//     switch (status) {
//       case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
//       case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
//       case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
//       case 'Weekly Off': return <span className="text-blue-600 font-semibold">🔵 Weekly Off</span>;
//       default: return status;
//     }
//   };

//   // Check if status is editable
//   const isStatusEditable = (status) => {
//     return status === 'Present' || status === 'Absent';
//   };

//   const downloadReport = async (type) => {
//     setDownloadLoading(true);
//     try {
//       let dataToExport = filtered;

//       if (type === 'all') {
//         if (filter.date) {
//           dataToExport = attendance.filter(att => 
//             dayjs(att.date).local().format('YYYY-MM-DD') === filter.date
//           );
//         } else {
//           dataToExport = attendance.filter(att => {
//             const attDate = new Date(att.date);
//             return (
//               attDate.getMonth() + 1 === selectedMonth && 
//               attDate.getFullYear() === selectedYear
//             );
//           });
//         }
//       }

//       // Prepare the data for Excel
//       const excelData = [
//         // Header row
//         [
//           'Employee Name', 
//           'Email', 
//           'Date', 
//           'Status', 
//           'Recorded At'
//         ],
//         // Data rows
//         ...dataToExport.map(att => [
//           att.employeeId?.name || 'N/A',
//           att.employeeId?.email || 'N/A',
//           getShiftDate(att.date),
//           att.status,
//           new Date(att.createdAt).toLocaleString()
//         ])
//       ];

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(excelData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);

//       let filename = `attendance-${type}`;
//       if (filter.date) {
//         filename += `-${filter.date}`;
//       } else {
//         filename += `-${selectedMonth}-${selectedYear}`;
//       }

//       link.download = `${filename}.xlsx`;
//       link.click();

//     } catch (err) {
//       console.error('Download failed:', err);
//       alert('Failed to generate report');
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   // Calculate statistics
//   const presentCount = filtered.filter(a => a.status === 'Present').length;
//   const absentCount = filtered.filter(a => a.status === 'Absent').length;
//   const leaveCount = filtered.filter(a => a.status === 'Leave').length;
//   const weeklyOffCount = filtered.filter(a => a.status === 'Weekly Off').length;

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
//           <select
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filter.employeeId}
//             onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
//           >
//             <option value="">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>{emp.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filter.date}
//             onChange={e => setFilter({ ...filter, date: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 12}, (_, i) => (
//               <option key={i+1} value={i+1}>
//                 {new Date(0, i).toLocaleString('default', {month: 'long'})}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 5}, (_, i) => {
//               const year = new Date().getFullYear() - 2 + i;
//               return <option key={year} value={year}>{year}</option>;
//             })}
//           </select>
//         </div>

//         {/* Download Buttons */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button 
//             onClick={() => downloadReport('all')}
//             disabled={downloadLoading || (!filter.date && !selectedMonth && !selectedYear)}
//             className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 {filter.date ? 'Download Date Data' : 'Download All Data'}
//               </>
//             )}
//           </button>

//           <button 
//             onClick={() => downloadReport('employee')}
//             disabled={!filter.employeeId || downloadLoading}
//             className="bg-blue-600 !text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Employee Report
//               </>
//             )}
//           </button>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-30 w-7xl">
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
//             <p className="text-2xl font-bold">{filtered.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Present</h3>
//             <p className="text-2xl font-bold text-green-600">{presentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Absent</h3>
//             <p className="text-2xl font-bold text-red-600">{absentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Leave</h3>
//             <p className="text-2xl font-bold text-yellow-600">{leaveCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Weekly Off</h3>
//             <p className="text-2xl font-bold text-blue-600">{weeklyOffCount}</p>
//           </div>
//         </div>

//         {/* Mobile Cards View */}
//         <div className="sm:hidden space-y-4">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             paginated.map((att) => (
//               <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
//                     <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
//                   </div>
//                   <span className="text-sm">{new Date(att.date).toLocaleDateString()}</span>
//                 </div>

//                 <div className="mt-3 flex justify-between items-center">
//                   <div>{statusBadge(att.status)}</div>
//                   {isStatusEditable(att.status) ? (
//                     <select
//                       value={att.status}
//                       onChange={e => handleStatusChange(att._id, e.target.value)}
//                       className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
//                     >
//                       <option value="Present">Present</option>
//                       <option value="Absent">Absent</option>
//                     </select>
//                   ) : (
//                     <span className="text-sm text-gray-500 italic">System Generated</span>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden sm:block">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg shadow-md max-w-6xl mx-auto">
//               <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
//                 <thead className="bg-indigo-200">
//                   <tr>
//                     <th className="p-3 text-left">Employee</th>
//                     {/* <th className="p-3 text-left">Email</th> */}
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Status</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((att) => (
//                     <tr key={att._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
//                       {/* <td className="p-3">{att.employeeId?.email || 'N/A'}</td> */}
//                       <td className="p-3">{new Date(att.date).toLocaleDateString('en-GB')}</td>
//                       <td className="p-3">{statusBadge(att.status)}</td>
//                       <td className="p-3">
//                         {isStatusEditable(att.status) ? (
//                           <select
//                             value={att.status}
//                             onChange={e => handleStatusChange(att._id, e.target.value)}
//                             className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
//                           >
//                             <option value="Present">Present</option>
//                             <option value="Absent">Absent</option>
//                           </select>
//                         ) : (
//                           <span className="text-gray-500 italic">System Generated</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filtered.length > perPage && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               ⬅ Previous
//             </button>
//             <span className="font-semibold">Page {page} of {Math.ceil(filtered.length / perPage)}</span>
//             <button
//               disabled={(page * perPage) >= filtered.length}
//               onClick={() => setPage(page + 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               Next ➡
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;

//-----
// import * as XLSX from 'xlsx';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs';
// import Layout from '../components/Layout';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Attendance = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filter, setFilter] = useState({ employeeId: '', date: '' });
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [page, setPage] = useState(1);
//   const [perPage] = useState(10);
//   const [downloadLoading, setDownloadLoading] = useState(false);

//   useEffect(() => {
//     fetchEmployees();
//     fetchAttendance();
//   }, [page]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
//       setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Failed to fetch employees:', err);
//       setEmployees([]);
//     }
//   };

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/attendance`);
//       setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
//     } catch (err) {
//       console.error('Attendance fetch failed:', err);
//       setAttendance([]);
//     }
//   };

//   const handleStatusChange = async (id, newStatus) => {
//     try {
//       await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
//       fetchAttendance();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   // Utility: Convert actual timestamp to shiftDate
//   const getShiftDate = (dateString) => {
//     const d = dayjs(dateString).local(); // use local time
//     const shiftStart = d.hour() >= 17;   // If 5 PM or later, it's today's shift

//     if (shiftStart) {
//       // Example: 20th Aug 20:30 → shift date = 20th Aug
//       return d.format("YYYY-MM-DD");
//     } else {
//       // Example: 21st Aug 02:00 → belongs to 20th Aug shift
//       return d.subtract(1, "day").format("YYYY-MM-DD");
//     }
//   };

//   // Check if status is editable
//   const isStatusEditable = (status) => {
//     return status === 'Present' || status === 'Absent';
//   };

//   // Fix for date filtering issue
//   const filtered = attendance.filter(att => {
//     const matchesEmployee = filter.employeeId ? att.employeeId?._id === filter.employeeId : true;

//     // Get the shift date for filtering
//     const shiftDate = getShiftDate(att.date);
//     const attDate = new Date(att.date);

//     // Check if we're filtering by specific date or by month/year
//     if (filter.date) {
//       // Specific date filter
//       return matchesEmployee && shiftDate === filter.date;
//     } else {
//       // Month/Year filter
//       const matchesMonth = attDate.getMonth() + 1 === selectedMonth;
//       const matchesYear = attDate.getFullYear() === selectedYear;
//       return matchesEmployee && matchesMonth && matchesYear;
//     }
//   });

//   const paginated = filtered.slice((page - 1) * perPage, page * perPage);

//   const statusBadge = (status) => {
//     switch (status) {
//       case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
//       case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
//       case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
//       case 'Weekly Off': return <span className="text-blue-600 font-semibold">🔵 Weekly Off</span>;
//       default: return status;
//     }
//   };

//   const downloadReport = async (type) => {
//     setDownloadLoading(true);
//     try {
//       let dataToExport = filtered;

//       if (type === 'all') {
//         if (filter.date) {
//           dataToExport = attendance.filter(att => 
//             dayjs(att.date).local().format('YYYY-MM-DD') === filter.date
//           );
//         } else {
//           dataToExport = attendance.filter(att => {
//             const attDate = new Date(att.date);
//             return (
//               attDate.getMonth() + 1 === selectedMonth && 
//               attDate.getFullYear() === selectedYear
//             );
//           });
//         }
//       }

//       // Prepare the data for Excel
//       const excelData = [
//         // Header row
//         [
//           'Employee Name', 
//           'Email', 
//           'Date', 
//           'Status', 
//           'Recorded At'
//         ],
//         // Data rows
//         ...dataToExport.map(att => [
//           att.employeeId?.name || 'N/A',
//           att.employeeId?.email || 'N/A',
//           getShiftDate(att.date),
//           att.status,
//           new Date(att.createdAt).toLocaleString()
//         ])
//       ];

//       // Create workbook and worksheet
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.aoa_to_sheet(excelData);

//       // Add worksheet to workbook
//       XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//       const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

//       // Create download link
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);

//       let filename = `attendance-${type}`;
//       if (filter.date) {
//         filename += `-${filter.date}`;
//       } else {
//         filename += `-${selectedMonth}-${selectedYear}`;
//       }

//       link.download = `${filename}.xlsx`;
//       link.click();

//     } catch (err) {
//       console.error('Download failed:', err);
//       alert('Failed to generate report');
//     } finally {
//       setDownloadLoading(false);
//     }
//   };

//   // Calculate statistics
//   const presentCount = filtered.filter(a => a.status === 'Present').length;
//   const absentCount = filtered.filter(a => a.status === 'Absent').length;
//   const leaveCount = filtered.filter(a => a.status === 'Leave').length;
//   const weeklyOffCount = filtered.filter(a => a.status === 'Weekly Off').length;

//   return (
//     <Layout>
//       <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
//         <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

//         {/* Filters */}
//         <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
//           <select
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             value={filter.employeeId}
//             onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
//           >
//             <option value="">All Employees</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>{emp.name}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={filter.date}
//             onChange={e => setFilter({ ...filter, date: e.target.value })}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//           />

//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 12}, (_, i) => (
//               <option key={i+1} value={i+1}>
//                 {new Date(0, i).toLocaleString('default', {month: 'long'})}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200"
//             disabled={!!filter.date}
//           >
//             {Array.from({length: 5}, (_, i) => {
//               const year = new Date().getFullYear() - 2 + i;
//               return <option key={year} value={year}>{year}</option>;
//             })}
//           </select>
//         </div>

//         {/* Download Buttons */}
//         <div className="flex justify-center gap-4 mb-6">
//           <button 
//             onClick={() => downloadReport('all')}
//             disabled={downloadLoading || (!filter.date && !selectedMonth && !selectedYear)}
//             className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 {filter.date ? 'Download Date Data' : 'Download All Data'}
//               </>
//             )}
//           </button>

//           <button 
//             onClick={() => downloadReport('employee')}
//             disabled={!filter.employeeId || downloadLoading}
//             className="bg-blue-600 !text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {downloadLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//                 Employee Report
//               </>
//             )}
//           </button>
//         </div>

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-30 w-7xl">
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
//             <p className="text-2xl font-bold">{filtered.length}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Present</h3>
//             <p className="text-2xl font-bold text-green-600">{presentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Absent</h3>
//             <p className="text-2xl font-bold text-red-600">{absentCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Leave</h3>
//             <p className="text-2xl font-bold text-yellow-600">{leaveCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-md text-center">
//             <h3 className="text-gray-500 text-sm font-medium">Weekly Off</h3>
//             <p className="text-2xl font-bold text-blue-600">{weeklyOffCount}</p>
//           </div>
//         </div>

//         {/* Mobile Cards View */}
//         <div className="sm:hidden space-y-4">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             paginated.map((att) => (
//               <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
//                     <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
//                   </div>
//                   <span className="text-sm">{new Date(att.date).toLocaleDateString()}</span>
//                 </div>

//                 <div className="mt-3 flex justify-between items-center">
//                   <div>{statusBadge(att.status)}</div>
//                   {isStatusEditable(att.status) ? (
//                     <select
//                       value={att.status}
//                       onChange={e => handleStatusChange(att._id, e.target.value)}
//                       className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
//                     >
//                       <option value="Present">Present</option>
//                       <option value="Absent">Absent</option>
//                     </select>
//                   ) : (
//                     <span className="text-sm text-gray-500 italic">System Generated</span>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Desktop Table View */}
//         <div className="hidden sm:block">
//           {paginated.length === 0 ? (
//             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//               <p className="text-gray-500">No attendance records found for selected filters</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto rounded-lg shadow-md max-w-6xl mx-auto">
//               <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
//                 <thead className="bg-indigo-200">
//                   <tr>
//                     <th className="p-3 text-left">Employee</th>
//                     {/* <th className="p-3 text-left">Email</th> */}
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Status</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginated.map((att) => (
//                     <tr key={att._id} className="border-b hover:bg-gray-50">
//                       <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
//                       {/* <td className="p-3">{att.employeeId?.email || 'N/A'}</td> */}
//                       <td className="p-3">{new Date(att.date).toLocaleDateString('en-GB')}</td>
//                       <td className="p-3">{statusBadge(att.status)}</td>
//                       <td className="p-3">
//                         {isStatusEditable(att.status) ? (
//                           <select
//                             value={att.status}
//                             onChange={e => handleStatusChange(att._id, e.target.value)}
//                             className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
//                           >
//                             <option value="Present">Present</option>
//                             <option value="Absent">Absent</option>
//                           </select>
//                         ) : (
//                           <span className="text-gray-500 italic">System Generated</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filtered.length > perPage && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               ⬅ Previous
//             </button>
//             <span className="font-semibold">Page {page} of {Math.ceil(filtered.length / perPage)}</span>
//             <button
//               disabled={(page * perPage) >= filtered.length}
//               onClick={() => setPage(page + 1)}
//               className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
//             >
//               Next ➡
//             </button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;
//-----------------correct
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../components/Layout';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

 
  const getShiftDate = () => {
  const now = dayjs();
  const shiftStart = now.startOf("day").hour(17); // 5 PM same day

  if (now.isBefore(shiftStart)) {
    // Before 5 AM, still previous shift
    return now.subtract(1, "day").format("YYYY-MM-DD");
  } else {
    return now.format("YYYY-MM-DD");
  }
};

const todayShiftDate = getShiftDate();

const [filter, setFilter] = useState({
  employeeId: '',
  startDate: dayjs(todayShiftDate).startOf('month').format('YYYY-MM-DD'),
  endDate: todayShiftDate
});

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalCount: 0
  });
  const [overallStats, setOverallStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLeave: 0,
    totalWeeklyOff: 0
  });
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);




  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [filter, pagination.page]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
      setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        perPage: pagination.perPage,
        ...(filter.employeeId && { employeeId: filter.employeeId }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate })
      };

      const res = await axios.get(`${API_URL}/attendance`, { params });

      if (res.data.status === 'success') {
        setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
        setPagination({
          ...pagination,
          totalPages: res.data.totalPages,
          totalCount: res.data.totalCount
        });
        setOverallStats(res.data.overallStats || {
          totalPresent: 0,
          totalAbsent: 0,
          totalLeave: 0,
          totalWeeklyOff: 0
        });
      }
    } catch (err) {
      console.error('Attendance fetch failed:', err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
      fetchAttendance(); // Refresh the data
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update attendance status');
    }
  };

  // Check if status is editable
  const isStatusEditable = (status, isVirtual) => {
    // Only allow editing of Present/Absent for non-virtual records
    return (status === 'Present' || status === 'Absent') && !isVirtual;
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Present': return <span className="text-green-600 font-semibold">✅ Present</span>;
      case 'Absent': return <span className="text-red-600 font-semibold">❌ Absent</span>;
      case 'Leave': return <span className="text-yellow-600 font-semibold">🟡 Leave</span>;
      case 'Weekly Off': return <span className="text-blue-600 font-semibold">🔵 Weekly Off</span>;
      default: return <span className="text-gray-600 font-semibold">{status}</span>;
    }
  };

  const downloadReport = async () => {
    setDownloadLoading(true);
    try {
      // Fetch all data without pagination for the export
      const params = {
        perPage: 10000, // Large number to get all records
        page: 1,
        ...(filter.employeeId && { employeeId: filter.employeeId }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate })
      };

      const res = await axios.get(`${API_URL}/attendance`, { params });
      const dataToExport = Array.isArray(res.data.data) ? res.data.data : [];

      // Prepare the data for Excel
      const excelData = [
        // Header row
        [
          'Employee Name',
          'Email',
          'Role',
          'Date',
          'Status',
          'Reason',
          'Record Type'
        ],
        // Data rows
        ...dataToExport.map(att => [
          att.employeeId?.name || 'N/A',
          att.employeeId?.email || 'N/A',
          att.employeeId?.role || 'N/A',
          dayjs(att.date).format('YYYY-MM-DD'),
          att.status,
          att.reason || 'N/A',
          att.isVirtual ? 'System Generated' : 'Manual'
        ])
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      let filename = `attendance-report`;
      if (filter.employeeId) {
        const employee = employees.find(e => e._id === filter.employeeId);
        filename += `-${employee?.name || 'employee'}`;
      }
      if (filter.startDate && filter.endDate) {
        filename += `-${filter.startDate}-to-${filter.endDate}`;
      }

      link.download = `${filename}.xlsx`;
      link.click();

    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate report');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 min-h-screen bg-gray-100 text-gray-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-indigo-700">🕒 Attendance Management</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 flex-wrap">
          <select
            className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.employeeId}
            onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={e => setFilter({ ...filter, startDate: e.target.value })}
            className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="date"
            value={filter.endDate}
            onChange={e => setFilter({ ...filter, endDate: e.target.value })}
            className="p-2 rounded-lg bg-white text-black shadow-md border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            onClick={fetchAttendance}
            className="bg-indigo-600 !text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Download Button */}
        <div className="flex justify-center gap-4 mb-6">
       
       
       
       
       <button
  type="button"
  onClick={downloadReport}
  disabled={downloadLoading || attendance.length === 0}
  className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
>
  Download Excel Report
</button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
            <p className="text-2xl font-bold">{pagination.totalCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm font-medium">Present</h3>
            <p className="text-2xl font-bold text-green-600">
              {overallStats.totalPresent}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm font-medium">Absent</h3>
            <p className="text-2xl font-bold text-red-600">
              {overallStats.totalAbsent}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm font-medium">Leave</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {overallStats.totalLeave}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="text-gray-500 text-sm font-medium">Weekly Off</h3>
            <p className="text-2xl font-bold text-blue-600">
              {overallStats.totalWeeklyOff}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Mobile Cards View */}
        {!loading && (
          <div className="sm:hidden space-y-4">
            {attendance.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No attendance records found for selected filters</p>
              </div>
            ) : (
              attendance.map((att) => (
                <div key={att._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
                      <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
                    </div>
                    <span className="text-sm">{dayjs(att.date).format('YYYY-MM-DD')}</span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div>{statusBadge(att.status)}</div>
                    {isStatusEditable(att.status, att.isVirtual) ? (
                      <select
                        value={att.status}
                        onChange={e => handleStatusChange(att._id, e.target.value)}
                        className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      <span className="text-xs text-gray-500 italic">System Generated</span>
                    )}
                  </div>
                  {att.reason && (
                    <div className="mt-2 text-sm text-gray-600">
                      Reason: {att.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && (
          <div className="hidden sm:block">
            {attendance.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No attendance records found for selected filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white text-black rounded-lg overflow-hidden">
                  <thead className="bg-indigo-200">
                    <tr>
                      <th className="p-3 text-center">Employee</th>
                      <th className="p-3 text-center">Date</th>
                      <th className="p-3 text-center">Status</th>
                    
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((att) => (
                      <tr key={att._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{att.employeeId?.name || 'N/A'}</td>
                
                        <td className="p-3">{dayjs(att.date).format('YYYY-MM-DD')}</td>
                        <td className="p-3">{statusBadge(att.status)}</td>
                
                        <td className="p-3">
                          {isStatusEditable(att.status, att.isVirtual) ? (
                            <select
                              value={att.status}
                              onChange={e => handleStatusChange(att._id, e.target.value)}
                              className="p-2 rounded-lg bg-white text-black shadow border border-gray-200"
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                            </select>
                          ) : (
                            <span className="text-xs text-gray-500 italic">System Generated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            {/* <button
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              ⬅ Previous
            </button> */}

            <button
  type="button"   // 👈 Add this line
  disabled={pagination.page === 1}
  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
  className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
>
  ⬅ Previous
</button>
            <span className="font-semibold">Page {pagination.page} of {pagination.totalPages}</span>
            {/* <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              Next ➡
            </button> */}

            <button
  type="button"   // 👈 Add this line
  disabled={pagination.page >= pagination.totalPages}
  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
  className="bg-gray-300 px-4 py-2 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50 transition-colors"
>
  Next ➡
</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
//------------
