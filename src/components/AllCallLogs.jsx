
// ===============================
// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign, FiCalendar, FiUser, FiFilter
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({ byEmployee: {}, byMonth: {}, total: 0 });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch employees first
// const employeesRes = await API.get('/employees', {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('token')}`
//   }
// });
// // Compatible structure handling
// const employeeData = employeesRes.data.data || employeesRes.data;
// if (Array.isArray(employeeData)) {
//   setEmployees(employeeData);
// } else {
//   throw new Error("Invalid employee data format");
// }
        
//         if (employeesRes.data.success) {
//           setEmployees(employeesRes.data.data);
//         }
        
//         // Then fetch call logs
//         const logsRes = await API.get(`/call-logs?page=${currentPage}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//           setCallLogs(logsRes.data.data);
//           setFilteredLogs(logsRes.data.data);
//           setTotalPages(logsRes.data.pagination?.totalPages || 1);
//           calculateProfitSummary(logsRes.data.data);
//         } else {
//           setCallLogs([]);
//           setFilteredLogs([]);
//           setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage]);

//   const calculateProfitSummary = (logs) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employee = log.employeeId?.name || 'Unassigned';
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const profit = parseFloat(log.profitAmount) || 0;

//         // By Employee
//         byEmployee[employee] = (byEmployee[employee] || 0) + profit;

//         // By Month
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;

//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   const applyFilters = () => {
//     let results = callLogs;

//     // Apply search term filter
//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       );
//     }

//     // Apply category filter
//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     // Apply sale status filter
//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     // Apply employee filter
//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     // Apply date range filter
//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate >= filters.startDate && logDate <= filters.endDate;
//       });
//     }

//     // Apply sorting
//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         // Handle nested objects (like employeeId.name)
//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         // Handle date comparison
//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const formatMonth = (monthKey) => {
//     const [year, month] = monthKey.split('-').map(Number);
//     return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   isClearable={true}
//                   placeholderText="Select date range"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button 
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;
//================================


// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign, 
//   FiCalendar, FiUser, FiFilter, FiTarget
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({ 
//     byEmployee: {}, 
//     byMonth: {}, 
//     total: 0 
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null,
//     month: new Date().toLocaleString('default', { month: 'short' })
//   });
//   const [sortConfig, setSortConfig] = useState({ 
//     key: 'createdAt', 
//     direction: 'desc' 
//   });
// const [targets, setTargets] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch employees
//         const employeesRes = await API.get('/employees', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
        
//         // Handle different response structures
//         const employeeData = employeesRes.data.data || employeesRes.data;
//         if (Array.isArray(employeeData)) {
//           setEmployees(employeeData);
//         } else {
//           throw new Error("Invalid employee data format");
//         }
        
//         // Fetch employee targets
//         const targetsRes = await API.get('/performance/performance/all', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         if (targetsRes.data?.data) {
//   setTargets(targetsRes.data.data);
// }

//         if (targetsRes.data.success && Array.isArray(targetsRes.data.data)) {
//           const targetsMap = {};
//           targetsRes.data.data.forEach(target => {
//             if (!targetsMap[target.employeeId]) {
//               targetsMap[target.employeeId] = {};
//             }
//             targetsMap[target.employeeId][target.month] = target.target;
//           });
//           setEmployeeTargets(targetsMap);
//         }
        
//         // Fetch call logs
//         const logsRes = await API.get(`/call-logs?page=${currentPage}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//           setCallLogs(logsRes.data.data);
//           setFilteredLogs(logsRes.data.data);
//           setTotalPages(logsRes.data.pagination?.totalPages || 1);
//           // calculateProfitSummary(logsRes.data.data);
//           calculateProfitSummary(logsRes.data.data, targets);
//         } else {
//           setCallLogs([]);
//           setFilteredLogs([]);
//           setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage]);

//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig, employeeTargets]);

//   // const calculateProfitSummary = (logs) => {
//   //   const byEmployee = {};
//   //   const byMonth = {};
//   //   let total = 0;

//   //   logs.forEach(log => {
//   //     if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//   //       const employee = log.employeeId?.name || 'Unassigned';
//   //       const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//   //       const date = new Date(log.createdAt);
//   //       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//   //       const monthName = date.toLocaleString('default', { month: 'short' });
//   //       const profit = parseFloat(log.profitAmount) || 0;

//   //       // By Employee
//   //       if (!byEmployee[employee]) {
//   //         byEmployee[employee] = {
//   //           profit: 0,
//   //           target: employeeId && employeeTargets[employeeId]?.[monthName] || 0
//   //         };
//   //       }
//   //       byEmployee[employee].profit += profit;

//   //       // By Month
//   //       byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;

//   //       total += profit;
//   //     }
//   //   });

//   //   setProfitSummary({ byEmployee, byMonth, total });
//   // };


// const calculateProfitSummary = (logs, targets) => {  // Add targets as parameter
//   const byEmployee = {};
//   const byMonth = {};
//   let total = 0;

//   logs.forEach(log => {
//     if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//       const employeeName = log.employeeId?.name || 'Unassigned';
//       const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//       const date = new Date(log.createdAt);
//       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//       const monthName = date.toLocaleString('default', { month: 'short' });
//       const profit = parseFloat(log.profitAmount) || 0;

//       // Find the employee's target for this month
//       let target = 0;
//       const targetEntry = targets?.find(t => 
//         (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) && 
//         t.month === monthName
//       );
      
//       if (targetEntry) {
//         target = targetEntry.target || 0;
//       }

//       if (!byEmployee[employeeName]) {
//         byEmployee[employeeName] = {
//           profit: 0,
//           target: target,
//           employeeId: employeeId
//         };
//       }

//       if (target > 0 && byEmployee[employeeName].target === 0) {
//         byEmployee[employeeName].target = target;
//       }

//       byEmployee[employeeName].profit += profit;
//       byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//       total += profit;
//     }
//   });

//   setProfitSummary({ byEmployee, byMonth, total });
// };



//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   // const applyFilters = () => {
//   //   let results = callLogs;

//   //   // Apply search term filter
//   //   if (searchTerm) {
//   //     const lowerTerm = searchTerm.toLowerCase();
//   //     results = results.filter(log =>
//   //       (log.customerName?.toLowerCase().includes(lowerTerm) ||
//   //       log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//   //       (typeof log.employeeId === 'string'
//   //         ? log.employeeId?.toLowerCase().includes(lowerTerm)
//   //         : log.employeeId?.name?.toLowerCase().includes(lowerTerm)))
//   //     );
//   //   }

//   //   // Apply category filter
//   //   if (filters.callCategory) {
//   //     results = results.filter(log => log.callCategory === filters.callCategory);
//   //   }

//   //   // Apply sale status filter
//   //   if (filters.wasSaleConverted) {
//   //     results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//   //   }

//   //   // Apply employee filter
//   //   if (filters.employeeId) {
//   //     results = results.filter(log => {
//   //       if (typeof log.employeeId === 'string') {
//   //         return log.employeeId === filters.employeeId;
//   //       }
//   //       return log.employeeId?._id === filters.employeeId;
//   //     });
//   //   }

//   //   // Apply date range filter
//   //   if (filters.startDate && filters.endDate) {
//   //     results = results.filter(log => {
//   //       const logDate = new Date(log.createdAt);
//   //       return logDate >= filters.startDate && logDate <= filters.endDate;
//   //     });
//   //   }

//   //   // Apply sorting
//   //   if (sortConfig.key) {
//   //     results.sort((a, b) => {
//   //       let aValue, bValue;

//   //       // Handle nested objects (like employeeId.name)
//   //       if (sortConfig.key.includes('.')) {
//   //         const keys = sortConfig.key.split('.');
//   //         aValue = keys.reduce((obj, key) => obj?.[key], a);
//   //         bValue = keys.reduce((obj, key) => obj?.[key], b);
//   //       } else {
//   //         aValue = a[sortConfig.key];
//   //         bValue = b[sortConfig.key];
//   //       }

//   //       // Handle date comparison
//   //       if (sortConfig.key === 'createdAt') {
//   //         aValue = new Date(aValue).getTime();
//   //         bValue = new Date(bValue).getTime();
//   //       }

//   //       if (aValue < bValue) {
//   //         return sortConfig.direction === 'asc' ? -1 : 1;
//   //       }
//   //       if (aValue > bValue) {
//   //         return sortConfig.direction === 'asc' ? 1 : -1;
//   //       }
//   //       return 0;
//   //     });
//   //   }

//   //   setFilteredLogs(results);
//   //   // calculateProfitSummary(results);
//   //   calculateProfitSummary(results, targets);
//   // };



// // Inside AllCallLogs component

// const applyFilters = () => {
//   let results = callLogs;

//   // Apply search term filter
//   if (searchTerm) {
//     const lowerTerm = searchTerm.toLowerCase();
//     results = results.filter(log =>
//       (log.customerName?.toLowerCase().includes(lowerTerm) ||
//       log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//       (typeof log.employeeId === 'string'
//         ? log.employeeId?.toLowerCase().includes(lowerTerm)
//         : log.employeeId?.name?.toLowerCase().includes(lowerTerm)))
//     );
//   }

//   // Apply category filter
//   if (filters.callCategory) {
//     results = results.filter(log => log.callCategory === filters.callCategory);
//   }

//   // Apply sale status filter
//   if (filters.wasSaleConverted) {
//     results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//   }

//   // Apply employee filter
//   if (filters.employeeId) {
//     results = results.filter(log => {
//       if (typeof log.employeeId === 'string') {
//         return log.employeeId === filters.employeeId;
//       }
//       return log.employeeId?._id === filters.employeeId;
//     });
//   }

//   // Apply month filter
//   if (filters.month) {
//     results = results.filter(log => {
//       const logDate = new Date(log.createdAt);
//       const monthName = logDate.toLocaleString('default', { month: 'short' });
//       return monthName === filters.month;
//     });
//   }

//   // Apply date range filter
//   if (filters.startDate && filters.endDate) {
//     results = results.filter(log => {
//       const logDate = new Date(log.createdAt);
//       // Ensure endDate includes the full day
//       const endDate = new Date(filters.endDate);
//       endDate.setHours(23, 59, 59, 999); // Set to end of the day
//       return logDate >= filters.startDate && logDate <= endDate;
//     });
//   }

//   // Apply sorting
//   if (sortConfig.key) {
//     results.sort((a, b) => {
//       let aValue, bValue;

//       // Handle nested objects (like employeeId.name)
//       if (sortConfig.key.includes('.')) {
//         const keys = sortConfig.key.split('.');
//         aValue = keys.reduce((obj, key) => obj?.[key], a);
//         bValue = keys.reduce((obj, key) => obj?.[key], b);
//       } else {
//         aValue = a[sortConfig.key];
//         bValue = b[sortConfig.key];
//       }

//       // Handle date comparison
//       if (sortConfig.key === 'createdAt') {
//         aValue = new Date(aValue).getTime();
//         bValue = new Date(bValue).getTime();
//       }

//       // Handle undefined or null values
//       if (aValue == null) aValue = '';
//       if (bValue == null) bValue = '';

//       if (aValue < bValue) {
//         return sortConfig.direction === 'asc' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//   }

//   setFilteredLogs(results);
//   calculateProfitSummary(results, targets);
// };


//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// console.log('Targets data:', targets);
// console.log('Employee performance:', profitSummary.byEmployee);
//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   name="month"
//                   value={filters.month}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
   
//               </div>

//               <div>
//   <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//   <DatePicker
//     selectsRange
//     startDate={filters.startDate}
//     endDate={filters.endDate}
//     onChange={handleDateChange}
//     className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//     placeholderText="Select date range"
//   />
// </div>
  
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0 
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>



//         {/* Employee Performance Summary */}
//         {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiUser className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => (
//                   <tr key={employee}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <span className="text-blue-700 font-medium">
//                             {employee.charAt(0)?.toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{employee}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       ${data.target.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       <div className="flex items-center">
//                         <FiDollarSign className="text-gray-500" />
//                         <span className={`ml-1 font-medium ${
//                           data.profit > 0 ? 'text-green-600' : 'text-gray-900'
//                         }`}>
//                           {data.profit.toFixed(2)}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div 
//                             className={`h-2.5 rounded-full ${
//                               getAchievementPercentage(employee) >= 100 ? 'bg-green-600' : 
//                               getAchievementPercentage(employee) >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                             }`} 
//                             style={{ width: `${Math.min(getAchievementPercentage(employee), 100)}%` }}
//                           ></div>
//                         </div>
//                         <span className="ml-2 text-sm font-medium text-gray-700">
//                           {getAchievementPercentage(employee)}%
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div> */}



// {/* Employee Performance vs Targets */}
// <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//   <div className="p-4 border-b border-gray-200">
//     <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//       <FiTarget className="mr-2" /> Employee Performance vs Targets
//     </h3>
//   </div>
//   <div className="overflow-x-auto">
//     <table className="min-w-full divide-y divide-gray-200">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Employee
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Target ($)
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Achieved ($)
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//             Achievement
//           </th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//           const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//           return (
//             <tr key={employee}>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-700 font-medium">
//                       {employee.charAt(0)?.toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="ml-4">
//                     <div className="text-sm font-medium text-gray-900">{employee}</div>
//                   </div>
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                 ${data.target.toFixed(2)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                 <div className="flex items-center">
//                   <FiDollarSign className="text-gray-500" />
//                   <span className={`ml-1 font-medium ${
//                     data.profit > 0 ? 'text-green-600' : 'text-gray-900'
//                   }`}>
//                     {data.profit.toFixed(2)}
//                   </span>
//                 </div>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="flex items-center">
//                   <div className="w-full bg-gray-200 rounded-full h-2.5">
//                     <div 
//                       className={`h-2.5 rounded-full ${
//                         achievement >= 100 ? 'bg-green-600' : 
//                         achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                       }`} 
//                       style={{ width: `${Math.min(achievement, 100)}%` }}
//                     ></div>
//                   </div>
//                   <span className="ml-2 text-sm font-medium text-gray-700">
//                     {Math.round(achievement)}%
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         })}
//         {Object.keys(profitSummary.byEmployee).length === 0 && (
//           <tr>
//             <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//               No employee performance data available
//             </td>
//           </tr>
//         )}
//       </tbody>
//     </table>
//   </div>
// </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button 
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null,
//                               month: new Date().toLocaleString('default', { month: 'short' })
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//============================
// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true); // For initial load
//   const [loadingPage, setLoadingPage] = useState(false); // For pagination
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null,
//     month: new Date().toLocaleString('default', { month: 'short' })
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch employees and targets only once on mount
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       if (Array.isArray(employeeData)) {
//         setEmployees(employeeData);
//       } else {
//         throw new Error("Invalid employee data format");
//       }

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         if (targetsRes.data.success && Array.isArray(targetsRes.data.data)) {
//           const targetsMap = {};
//           targetsRes.data.data.forEach(target => {
//             if (!targetsMap[target.employeeId]) {
//               targetsMap[target.employeeId] = {};
//             }
//             targetsMap[target.employeeId][target.month] = target.target;
//           });
//           setEmployeeTargets(targetsMap);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs for the current page
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true); // Set pagination-specific loading state
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Initial data fetch on mount
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters whenever searchTerm, callLogs, filters, or sortConfig changes
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig, employeeTargets]);

//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const profit = parseFloat(log.profitAmount) || 0;

//         let target = 0;
//         const targetEntry = targets?.find(t =>
//           (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//           t.month === monthName
//         );

//         if (targetEntry) {
//           target = targetEntry.target || 0;
//         }

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             profit: 0,
//             target: target,
//             employeeId: employeeId
//           };
//         }

//         if (target > 0 && byEmployee[employeeName].target === 0) {
//           byEmployee[employeeName].target = target;
//         }

//         byEmployee[employeeName].profit += profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   const applyFilters = () => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm)))
//       );
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (filters.month) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const monthName = logDate.toLocaleString('default', { month: 'short' });
//         return monthName === filters.month;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Show full-screen spinner only for initial load
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   name="month"
//                   value={filters.month}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table with Optional Loading Indicator */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null,
//                               month: new Date().toLocaleString('default', { month: 'short' })
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//========================================
// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true); // For initial load
//   const [loadingPage, setLoadingPage] = useState(false); // For pagination
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null,
//     month: new Date().toLocaleString('default', { month: 'short' })
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch employees and targets only once on mount
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       if (Array.isArray(employeeData)) {
//         setEmployees(employeeData);
//       } else {
//         throw new Error("Invalid employee data format");
//       }

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         if (targetsRes.data.success && Array.isArray(targetsRes.data.data)) {
//           const targetsMap = {};
//           targetsRes.data.data.forEach(target => {
//             if (!targetsMap[target.employeeId]) {
//               targetsMap[target.employeeId] = {};
//             }
//             targetsMap[target.employeeId][target.month] = target.target;
//           });
//           setEmployeeTargets(targetsMap);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs for the current page
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true); // Set pagination-specific loading state
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Initial data fetch on mount
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters whenever searchTerm, callLogs, filters, or sortConfig changes
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig, employeeTargets]);

//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const profit = parseFloat(log.profitAmount) || 0;

//         let target = 0;
//         const targetEntry = targets?.find(t =>
//           (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//           t.month === monthName
//         );

//         if (targetEntry) {
//           target = targetEntry.target || 0;
//         }

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             profit: 0,
//             target: target,
//             employeeId: employeeId
//           };
//         }

//         if (target > 0 && byEmployee[employeeName].target === 0) {
//           byEmployee[employeeName].target = target;
//         }

//         byEmployee[employeeName].profit += profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   const applyFilters = () => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm)))
//       );
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (filters.month) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const monthName = logDate.toLocaleString('default', { month: 'short' });
//         return monthName === filters.month;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Show full-screen spinner only for initial load
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// const downloadCallLogReport = (log) => {
//   const reportContent = [
//     `CALL LOG DETAILS - ${new Date(log.createdAt).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     })}`,
//     `Employee: ${log.employeeId?.name || 'Unknown'}`,
//     `Customer: ${log.customerName}`,
//     `Phone: ${log.customerPhone}`,
//     `Email: ${log.customerEmail || 'N/A'}\n`,
//     '=== CALL DETAILS ===',
//     `- ID: ${log._id}`,
//     `- Call Direction: ${log.callDirection || 'N/A'}`,
//     `- Type: ${log.typeOfCall}`,
//     `- Category: ${log.callCategory || 'N/A'}`,
//     `- Reason: ${log.reasonForCall}`,
//     `- Description: ${log.callDescription}`,
//     `- Sale Converted: ${log.wasSaleConverted}`,
//     `- Sale Converted Through: ${log.saleConvertedThrough || 'N/A'}`,
//     `- Profit: $${log.profitAmount || 0}`,
//     `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//     `- Language: ${log.language}`,
//     `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     })}`,
//     '\n=== NOTES ===',
//     'Call log details',
//   ].join('\n');

//   const blob = new Blob([reportContent], { type: 'text/plain' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-log-${log._id}-${new Date(log.createdAt).toISOString().split('T')[0]}.txt`;
//   link.click();
// };

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   name="month"
//                   value={filters.month}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table with Optional Loading Indicator */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//   Actions
// </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//           <button
//             onClick={() => downloadCallLogReport(log)}
//             className="text-blue-600 hover:text-blue-900"
//             title="Download call log report"
//           >
//             Download
//           </button>
//         </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null,
//                               month: new Date().toLocaleString('default', { month: 'short' })
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//====================================CORRECT=============
// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget, FiDownload
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [detailedStats, setDetailedStats] = useState({
//     callDirections: {},
//     callCategories: {},
//     saleMethods: {},
//     languages: {}
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch initial data
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       setEmployees(Array.isArray(employeeData) ? employeeData : []);

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         const targetsMap = {};
//         targetsRes.data.data.forEach(target => {
//           if (!targetsMap[target.employeeId]) {
//             targetsMap[target.employeeId] = {};
//           }
//           targetsMap[target.employeeId][target.month] = target.target;
//         });
//         setEmployeeTargets(targetsMap);
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true);
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//         calculateDetailedStats(logsRes.data.data);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         setDetailedStats({
//           callDirections: {},
//           callCategories: {},
//           saleMethods: {},
//           languages: {}
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Calculate detailed statistics
//   const calculateDetailedStats = (logs) => {
//     const directions = {};
//     const categories = {};
//     const methods = {};
//     const languages = {};

//     logs.forEach(log => {
//       directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
//       categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
      
//       if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
//         methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
//       }
      
//       languages[log.language] = (languages[log.language] || 0) + 1;
//     });

//     setDetailedStats({
//       callDirections: directions,
//       callCategories: categories,
//       saleMethods: methods,
//       languages: languages
//     });
//   };

//   // Calculate profit summary
//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const profit = parseFloat(log.profitAmount) || 0;

//         let target = 0;
//         const targetEntry = targets?.find(t =>
//           (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//           t.month === monthName
//         );

//         if (targetEntry) {
//           target = targetEntry.target || 0;
//         }

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             profit: 0,
//             target: target,
//             employeeId: employeeId
//           };
//         }

//         if (target > 0 && byEmployee[employeeName].target === 0) {
//           byEmployee[employeeName].target = target;
//         }

//         byEmployee[employeeName].profit += profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   // Apply filters
//   const applyFilters = useCallback(() => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       ));
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (selectedMonth && selectedYear) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate.getMonth() + 1 === selectedMonth && 
//                logDate.getFullYear() === selectedYear;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//     calculateDetailedStats(results);
//   }, [callLogs, searchTerm, filters, selectedMonth, selectedYear, sortConfig, targets]);

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle date range change
//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   // Request sort
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Download individual call log
//   const downloadCallLogReport = (log) => {
//     const reportContent = [
//       `CALL LOG DETAILS - ${new Date(log.createdAt).toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       })}`,
//       `Employee: ${log.employeeId?.name || 'Unknown'}\n`,
//       '=== CALL DETAILS ===',
//       `- ID: ${log._id}`,
//       `- Type: ${log.typeOfCall}`,
//       `- Category: ${log.callCategory || 'N/A'}`,
//       `- Reason: ${log.reasonForCall}`,
//       `- Description: ${log.callDescription}`,
//       `- Sale Converted: ${log.wasSaleConverted}`,
//       `- Profit: $${log.profitAmount || 0}`,
//       `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//       `- Customer: ${log.customerName}`,
//       `- Email: ${log.customerEmail || 'N/A'}`,
//       `- Phone: ${log.customerPhone}`,
//       `- Language: ${log.language}`,
//       `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })}`,
//       '\n=== NOTES ===',
//       'Call log details',
//     ].join('\n');

//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `call-log-${log._id}-${new Date(log.createdAt).toISOString().split('T')[0]}.txt`;
//     link.click();
//   };

//   // Download detailed report
// const downloadDetailedReport = () => {
//   const reportContent = [
//     `DETAILED CALL LOGS REPORT - ${new Date().toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     })}`,
//     `Filters: ${JSON.stringify({
//       employee: filters.employeeId ? employees.find(e => e._id === filters.employeeId)?.name : 'All Employees',
//       month: selectedMonth,
//       year: selectedYear,
//       callCategory: filters.callCategory || 'All',
//       saleStatus: filters.wasSaleConverted || 'All'
//     }, null, 2)}`,
//     '\n=== SUMMARY ===',
//     `Total Calls: ${filteredLogs.length}`,
//     `Converted Sales: ${filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}`,
//     `Total Profit: $${filteredLogs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0).toFixed(2)}`,
//     '\n=== BREAKDOWNS ===',
//     'Call Directions:',
//     ...Object.entries(detailedStats.callDirections).map(([dir, count]) => `- ${dir}: ${count}`),
//     '\nCall Categories:',
//     ...Object.entries(detailedStats.callCategories).map(([cat, count]) => `- ${cat || 'Uncategorized'}: ${count}`),
//     '\nSale Methods:',
//     ...(Object.entries(detailedStats.saleMethods).length > 0 
//       ? Object.entries(detailedStats.saleMethods).map(([method, count]) => `- ${method}: ${count}`)
//       : ['- No sales data']),
//     '\nLanguages:',
//     ...Object.entries(detailedStats.languages).map(([lang, count]) => `- ${lang}: ${count}`),
//     '\n=== CALL LOGS ===',
//     ...filteredLogs.map((log, index) => [
//       `\nCall ${index + 1}:`,
//       `- ID: ${log._id}`,
//       `- Direction: ${log.callDirection}`,
//       `- Type: ${log.typeOfCall}`,
//       `- Category: ${log.callCategory || 'N/A'}`,
//       `- Customer: ${log.customerName}`,
//       `- Phone: ${log.customerPhone}`,
//       `- Sale: ${log.wasSaleConverted}`,
//       `- Method: ${log.saleConvertedThrough || 'N/A'}`,
//       `- Profit: $${log.profitAmount || 0}`,
//       `- Time: ${new Date(log.createdAt).toLocaleString()}`,
//     ].join('\n'))
//   ].join('\n');
  
//   const blob = new Blob([reportContent], { type: 'text/plain' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `detailed-report-${new Date().toISOString().split('T')[0]}.txt`;
//   link.click();
// };


//   // Get category icon
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Car Rental': return <FaCar className="text-orange-600" />;
//       case 'Packages': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   // Get achievement percentage
//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters when dependencies change
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, selectedMonth, selectedYear, sortConfig, applyFilters]);

//   // Loading state
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   // Error state
//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Car Rental</option>
//                   <option value="Package">Packages</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>
//                       {employee.name} ({employee.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 12}, (_, i) => i + 1).map(month => (
//                     <option key={month} value={month}>
//                       {new Date(2000, month - 1, 1).toLocaleString('default', {month: 'long'})}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={downloadDetailedReport}
//                 disabled={filteredLogs.length === 0}
//                 className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
//                   filteredLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 <FiDownload className="mr-2" />
//                 Download Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Statistics */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">Detailed Statistics</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Directions</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
//                   <li key={direction} className="flex justify-between">
//                     <span className="text-gray-600">{direction}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Categories</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callCategories).map(([category, count]) => (
//                   <li key={category} className="flex justify-between">
//                     <span className="text-gray-600">{category || 'Uncategorized'}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Sale Methods</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
//                   <li key={method} className="flex justify-between">
//                     <span className="text-gray-600">{method}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//                 {Object.keys(detailedStats.saleMethods).length === 0 && (
//                   <li className="text-gray-500">No sales data</li>
//                 )}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.languages).map(([language, count]) => (
//                   <li key={language} className="flex justify-between">
//                     <span className="text-gray-600">{language}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => downloadCallLogReport(log)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Download call log report"
//                         >
//                           <FiDownload />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                             setSelectedMonth(new Date().getMonth() + 1);
//                             setSelectedYear(new Date().getFullYear());
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//==================================

// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget, FiDownload
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [detailedStats, setDetailedStats] = useState({
//     callDirections: {},
//     callCategories: {},
//     saleMethods: {},
//     languages: {}
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch initial data
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       setEmployees(Array.isArray(employeeData) ? employeeData : []);

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         const targetsMap = {};
//         targetsRes.data.data.forEach(target => {
//           if (!targetsMap[target.employeeId]) {
//             targetsMap[target.employeeId] = {};
//           }
//           targetsMap[target.employeeId][target.month] = target.target;
//         });
//         setEmployeeTargets(targetsMap);
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true);
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//         calculateDetailedStats(logsRes.data.data);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         setDetailedStats({
//           callDirections: {},
//           callCategories: {},
//           saleMethods: {},
//           languages: {}
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Calculate detailed statistics
//   const calculateDetailedStats = (logs) => {
//     const directions = {};
//     const categories = {};
//     const methods = {};
//     const languages = {};

//     logs.forEach(log => {
//       directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
//       categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
      
//       if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
//         methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
//       }
      
//       languages[log.language] = (languages[log.language] || 0) + 1;
//     });

//     setDetailedStats({
//       callDirections: directions,
//       callCategories: categories,
//       saleMethods: methods,
//       languages: languages
//     });
//   };

//   // Calculate profit summary
//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const profit = parseFloat(log.profitAmount) || 0;

//         let target = 0;
//         const targetEntry = targets?.find(t =>
//           (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//           t.month === monthName
//         );

//         if (targetEntry) {
//           target = targetEntry.target || 0;
//         }

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             profit: 0,
//             target: target,
//             employeeId: employeeId
//           };
//         }

//         if (target > 0 && byEmployee[employeeName].target === 0) {
//           byEmployee[employeeName].target = target;
//         }

//         byEmployee[employeeName].profit += profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   // Apply filters
//   const applyFilters = useCallback(() => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       ));
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (selectedMonth && selectedYear) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate.getMonth() + 1 === selectedMonth && 
//                logDate.getFullYear() === selectedYear;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//     calculateDetailedStats(results);
//   }, [callLogs, searchTerm, filters, selectedMonth, selectedYear, sortConfig, targets]);

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle date range change
//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   // Request sort
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Download individual call log
//   // const downloadCallLogReport = (log) => {
//   //   const reportContent = [
//   //     `CALL LOG DETAILS - ${new Date(log.createdAt).toLocaleDateString('en-IN', {
//   //       year: 'numeric',
//   //       month: '2-digit',
//   //       day: '2-digit',
//   //     })}`,
//   //     `Employee: ${log.employeeId?.name || 'Unknown'}\n`,
//   //     '=== CALL DETAILS ===',
//   //     `- ID: ${log._id}`,
//   //     `- Type: ${log.typeOfCall}`,
//   //     `- Category: ${log.callCategory || 'N/A'}`,
//   //     `- Reason: ${log.reasonForCall}`,
//   //     `- Description: ${log.callDescription}`,
//   //     `- Sale Converted: ${log.wasSaleConverted}`,
//   //     `- Profit: $${log.profitAmount || 0}`,
//   //     `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//   //     `- Customer: ${log.customerName}`,
//   //     `- Email: ${log.customerEmail || 'N/A'}`,
//   //     `- Phone: ${log.customerPhone}`,
//   //     `- Language: ${log.language}`,
//   //     `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//   //       year: 'numeric',
//   //       month: '2-digit',
//   //       day: '2-digit',
//   //       hour: '2-digit',
//   //       minute: '2-digit',
//   //       hour12: true,
//   //     })}`,
//   //     '\n=== NOTES ===',
//   //     'Call log details',
//   //   ].join('\n');

//   //   const blob = new Blob([reportContent], { type: 'text/plain' });
//   //   const link = document.createElement('a');
//   //   link.href = URL.createObjectURL(blob);
//   //   link.download = `call-log-${log._id}-${new Date(log.createdAt).toISOString().split('T')[0]}.txt`;
//   //   link.click();
//   // };

//   // Download detailed report
// // const downloadDetailedReport = () => {
// //   const reportContent = [
// //     `DETAILED CALL LOGS REPORT - ${new Date().toLocaleDateString('en-IN', {
// //       year: 'numeric',
// //       month: '2-digit',
// //       day: '2-digit',
// //     })}`,
// //     `Filters: ${JSON.stringify({
// //       employee: filters.employeeId ? employees.find(e => e._id === filters.employeeId)?.name : 'All Employees',
// //       month: selectedMonth,
// //       year: selectedYear,
// //       callCategory: filters.callCategory || 'All',
// //       saleStatus: filters.wasSaleConverted || 'All'
// //     }, null, 2)}`,
// //     '\n=== SUMMARY ===',
// //     `Total Calls: ${filteredLogs.length}`,
// //     `Converted Sales: ${filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}`,
// //     `Total Profit: $${filteredLogs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0).toFixed(2)}`,
// //     '\n=== BREAKDOWNS ===',
// //     'Call Directions:',
// //     ...Object.entries(detailedStats.callDirections).map(([dir, count]) => `- ${dir}: ${count}`),
// //     '\nCall Categories:',
// //     ...Object.entries(detailedStats.callCategories).map(([cat, count]) => `- ${cat || 'Uncategorized'}: ${count}`),
// //     '\nSale Methods:',
// //     ...(Object.entries(detailedStats.saleMethods).length > 0 
// //       ? Object.entries(detailedStats.saleMethods).map(([method, count]) => `- ${method}: ${count}`)
// //       : ['- No sales data']),
// //     '\nLanguages:',
// //     ...Object.entries(detailedStats.languages).map(([lang, count]) => `- ${lang}: ${count}`),
// //     '\n=== CALL LOGS ===',
// //     ...filteredLogs.map((log, index) => [
// //       `\nCall ${index + 1}:`,
// //       `- ID: ${log._id}`,
// //       `- Direction: ${log.callDirection}`,
// //       `- Type: ${log.typeOfCall}`,
// //       `- Category: ${log.callCategory || 'N/A'}`,
// //       `- Customer: ${log.customerName}`,
// //       `- Phone: ${log.customerPhone}`,
// //       `- Sale: ${log.wasSaleConverted}`,
// //       `- Method: ${log.saleConvertedThrough || 'N/A'}`,
// //       `- Profit: $${log.profitAmount || 0}`,
// //       `- Time: ${new Date(log.createdAt).toLocaleString()}`,
// //     ].join('\n'))
// //   ].join('\n');
  
// //   const blob = new Blob([reportContent], { type: 'text/plain' });
// //   const link = document.createElement('a');
// //   link.href = URL.createObjectURL(blob);
// //   link.download = `detailed-report-${new Date().toISOString().split('T')[0]}.txt`;
// //   link.click();
// // };




// // Replace the downloadCallLogReport function with this:
// const downloadCallLogReport = (log) => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Call Direction', 'Type', 'Category', 'Reason',
//     'Description', 'Sale Converted', 'Sale Method', 'Profit Amount',
//     'No Sale Reason', 'Customer Name', 'Email', 'Phone', 'Language'
//   ];

//   // Create CSV row
//   const row = [
//     formatDate(log.createdAt),
//     log.callDirection || 'N/A',
//     log.typeOfCall,
//     log.callCategory || 'N/A',
//     log.reasonForCall,
//     log.callDescription,
//     log.wasSaleConverted,
//     log.saleConvertedThrough || 'N/A',
//     log.profitAmount || 0,
//     log.reasonForNoSale || 'N/A',
//     log.customerName,
//     log.customerEmail || 'N/A',
//     log.customerPhone,
//     log.language
//   ];

//   // Escape fields containing commas/quotes
//   const escapedRow = row.map(field => 
//     `"${String(field).replace(/"/g, '""')}"`
//   );

//   // Combine header and row
//   const csvContent = [
//     headers.join(','),
//     escapedRow.join(',')
//   ].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-log-${log._id}.csv`;
//   link.click();
// };

// // Replace the downloadDetailedReport function with this:
// const downloadDetailedReport = () => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
//     'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Employee'
//   ];

//   // Create CSV rows
//   const rows = filteredLogs.map(log => [
//     formatDate(log.createdAt),
//     log.callDirection,
//     log.typeOfCall,
//     log.callCategory || 'N/A',
//     log.customerName,
//     log.customerPhone,
//     log.wasSaleConverted,
//     log.saleConvertedThrough || 'N/A',
//     log.profitAmount || 0,
//     log.employeeId?.name || 'Unassigned'
//   ]);

//   // Escape all fields
//   const escapedRows = rows.map(row => 
//     row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
//   );

//   // Combine header and rows
//   const csvContent = [
//     headers.join(','),
//     ...escapedRows
//   ].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-logs-report-${new Date().toISOString().split('T')[0]}.csv`;
//   link.click();
// };









//   // Get category icon
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Car Rental': return <FaCar className="text-orange-600" />;
//       case 'Packages': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   // Get achievement percentage
//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters when dependencies change
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, selectedMonth, selectedYear, sortConfig, applyFilters]);

//   // Loading state
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   // Error state
//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Car Rental</option>
//                   <option value="Package">Packages</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>
//                       {employee.name} ({employee.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 12}, (_, i) => i + 1).map(month => (
//                     <option key={month} value={month}>
//                       {new Date(2000, month - 1, 1).toLocaleString('default', {month: 'long'})}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={downloadDetailedReport}
//                 disabled={filteredLogs.length === 0}
//                 className={`flex items-center px-4 py-2 bg-indigo-600 !text-white rounded-md hover:bg-indigo-700 ${
//                   filteredLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               >
//                 <FiDownload className="mr-2" />
//                 Download Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Statistics */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">Detailed Statistics</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Directions</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
//                   <li key={direction} className="flex justify-between">
//                     <span className="text-gray-600">{direction}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Categories</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callCategories).map(([category, count]) => (
//                   <li key={category} className="flex justify-between">
//                     <span className="text-gray-600">{category || 'Uncategorized'}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Sale Methods</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
//                   <li key={method} className="flex justify-between">
//                     <span className="text-gray-600">{method}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//                 {Object.keys(detailedStats.saleMethods).length === 0 && (
//                   <li className="text-gray-500">No sales data</li>
//                 )}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.languages).map(([language, count]) => (
//                   <li key={language} className="flex justify-between">
//                     <span className="text-gray-600">{language}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => downloadCallLogReport(log)}
//                           className="!text-blue-600 hover:text-blue-900"
//                           title="Download call log report"
//                         >
//                           <FiDownload />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                             setSelectedMonth(new Date().getMonth() + 1);
//                             setSelectedYear(new Date().getFullYear());
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;
//================================


// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget, FiDownload
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [detailedStats, setDetailedStats] = useState({
//     callDirections: {},
//     callCategories: {},
//     saleMethods: {},
//     languages: {}
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch initial data
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       setEmployees(Array.isArray(employeeData) ? employeeData : []);

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         const targetsMap = {};
//         targetsRes.data.data.forEach(target => {
//           if (!targetsMap[target.employeeId]) {
//             targetsMap[target.employeeId] = {};
//           }
//           targetsMap[target.employeeId][target.month] = target.target;
//         });
//         setEmployeeTargets(targetsMap);
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true);
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//         calculateDetailedStats(logsRes.data.data);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         setDetailedStats({
//           callDirections: {},
//           callCategories: {},
//           saleMethods: {},
//           languages: {}
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Calculate detailed statistics
//   const calculateDetailedStats = (logs) => {
//     const directions = {};
//     const categories = {};
//     const methods = {};
//     const languages = {};

//     logs.forEach(log => {
//       directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
//       categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
      
//       if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
//         methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
//       }
      
//       languages[log.language] = (languages[log.language] || 0) + 1;
//     });

//     setDetailedStats({
//       callDirections: directions,
//       callCategories: categories,
//       saleMethods: methods,
//       languages: languages
//     });
//   };

//   // Calculate profit summary
//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const profit = parseFloat(log.profitAmount) || 0;

//         let target = 0;
//         const targetEntry = targets?.find(t =>
//           (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//           t.month === monthName
//         );

//         if (targetEntry) {
//           target = targetEntry.target || 0;
//         }

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             profit: 0,
//             target: target,
//             employeeId: employeeId
//           };
//         }

//         if (target > 0 && byEmployee[employeeName].target === 0) {
//           byEmployee[employeeName].target = target;
//         }

//         byEmployee[employeeName].profit += profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   // Apply filters
//   const applyFilters = useCallback(() => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       ));
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (selectedMonth && selectedYear) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate.getMonth() + 1 === selectedMonth && 
//                logDate.getFullYear() === selectedYear;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//     calculateDetailedStats(results);
//   }, [callLogs, searchTerm, filters, selectedMonth, selectedYear, sortConfig, targets]);

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle date range change
//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   // Request sort
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };


// const downloadCallLogReport = (log) => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Call Direction', 'Type', 'Category', 'Reason',
//     'Description', 'Sale Converted', 'Sale Method', 'Profit Amount',
//     'No Sale Reason', 'Customer Name', 'Email', 'Phone', 'Language'
//   ];

//   // Create CSV row
//   const row = [
//     formatDate(log.createdAt),
//     log.callDirection || 'N/A',
//     log.typeOfCall,
//     log.callCategory || 'N/A',
//     log.reasonForCall,
//     log.callDescription,
//     log.wasSaleConverted,
//     log.saleConvertedThrough || 'N/A',
//     log.profitAmount || 0,
//     log.reasonForNoSale || 'N/A',
//     log.customerName,
//     log.customerEmail || 'N/A',
//     log.customerPhone,
//     log.language
//   ];

//   // Escape fields containing commas/quotes
//   const escapedRow = row.map(field => 
//     `"${String(field).replace(/"/g, '""')}"`
//   );

//   // Combine header and row
//   const csvContent = [
//     headers.join(','),
//     escapedRow.join(',')
//   ].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-log-${log._id}.csv`;
//   link.click();
// };

// // Replace the downloadDetailedReport function with this:
// const downloadDetailedReport = () => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
//     'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Employee'
//   ];

//   // Create CSV rows
//   const rows = filteredLogs.map(log => [
//     formatDate(log.createdAt),
//     log.callDirection,
//     log.typeOfCall,
//     log.callCategory || 'N/A',
//     log.customerName,
//     log.customerPhone,
//     log.wasSaleConverted,
//     log.saleConvertedThrough || 'N/A',
//     log.profitAmount || 0,
//     log.employeeId?.name || 'Unassigned'
//   ]);

//   // Escape all fields
//   const escapedRows = rows.map(row => 
//     row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
//   );

//   // Combine header and rows
//   const csvContent = [
//     headers.join(','),
//     ...escapedRows
//   ].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-logs-report-${new Date().toISOString().split('T')[0]}.csv`;
//   link.click();
// };


//   // Get category icon
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Car Rental': return <FaCar className="text-orange-600" />;
//       case 'Packages': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   // Get achievement percentage
//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters when dependencies change
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, selectedMonth, selectedYear, sortConfig, applyFilters]);




//   // Add this function to your component
// const fetchAllCallLogs = async () => {
//   try {
//     const logsRes = await API.get('/call-logs', {  // You'll need to create this endpoint on your backend
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });

//     if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//       return logsRes.data.data;
//     }
//     return [];
//   } catch (err) {
//     console.error('Error fetching all call logs:', err);
//     setError('Failed to load all call logs');
//     return [];
//   }
// };

// const downloadAllCallLogsReport = async () => {
//   try {
//     // Show loading state
//     setLoadingPage(true);
    
//     // Fetch all call logs
//     const allLogs = await fetchAllCallLogs();
    
//     if (allLogs.length === 0) {
//       alert('No call logs found to download');
//       return;
//     }

//     // Create CSV header
//     const headers = [
//       'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
//       'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Employee'
//     ];

//     // Create CSV rows
//     const rows = allLogs.map(log => [
//       formatDate(log.createdAt),
//       log.callDirection,
//       log.typeOfCall,
//       log.callCategory || 'N/A',
//       log.customerName,
//       log.customerPhone,
//       log.wasSaleConverted,
//       log.saleConvertedThrough || 'N/A',
//       log.profitAmount || 0,
//       log.employeeId?.name || 'Unassigned'
//     ]);

//     // Escape all fields
//     const escapedRows = rows.map(row => 
//       row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
//     );

//     // Combine header and rows
//     const csvContent = [
//       headers.join(','),
//       ...escapedRows
//     ].join('\n');

//     // Create and download CSV file
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   } catch (error) {
//     console.error('Error downloading all call logs:', error);
//     alert('Failed to download all call logs');
//   } finally {
//     setLoadingPage(false);
//   }
// };

//   // Loading state
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   // Error state
//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Car Rental</option>
//                   <option value="Package">Packages</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>
//                       {employee.name} ({employee.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 12}, (_, i) => i + 1).map(month => (
//                     <option key={month} value={month}>
//                       {new Date(2000, month - 1, 1).toLocaleString('default', {month: 'long'})}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mt-4">
         

// <div className="flex justify-end mt-4 space-x-3">
//   <button
//     onClick={downloadDetailedReport}
//     disabled={filteredLogs.length === 0}
//     className={`flex items-center px-4 py-2 bg-indigo-600 !text-white rounded-md hover:bg-indigo-700 ${
//       filteredLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//     }`}
//   >
//     <FiDownload className="mr-2" />
//     Download Filtered Report
//   </button>
  
//   <button
//     onClick={downloadAllCallLogsReport}
//     disabled={loadingPage}
//     className={`flex items-center px-4 py-2 bg-green-600 !text-white rounded-md hover:bg-green-700 ${
//       loadingPage ? 'opacity-50 cursor-not-allowed' : ''
//     }`}
//   >
//     <FiDownload className="mr-2" />
//     Download All Call Logs
//   </button>
// </div>
//             </div>
            
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Statistics */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">Detailed Statistics</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Directions</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
//                   <li key={direction} className="flex justify-between">
//                     <span className="text-gray-600">{direction}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Categories</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callCategories).map(([category, count]) => (
//                   <li key={category} className="flex justify-between">
//                     <span className="text-gray-600">{category || 'Uncategorized'}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Sale Methods</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
//                   <li key={method} className="flex justify-between">
//                     <span className="text-gray-600">{method}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//                 {Object.keys(detailedStats.saleMethods).length === 0 && (
//                   <li className="text-gray-500">No sales data</li>
//                 )}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.languages).map(([language, count]) => (
//                   <li key={language} className="flex justify-between">
//                     <span className="text-gray-600">{language}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => downloadCallLogReport(log)}
//                           className="!text-blue-600 hover:text-blue-900"
//                           title="Download call log report"
//                         >
//                           <FiDownload />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                             setSelectedMonth(new Date().getMonth() + 1);
//                             setSelectedYear(new Date().getFullYear());
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;


//------------------------with net profit-----------

// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget, FiDownload
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [detailedStats, setDetailedStats] = useState({
//     callDirections: {},
//     callCategories: {},
//     saleMethods: {},
//     languages: {},
//     chargebacks: 0,
//     netProfit: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch initial data
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       setEmployees(Array.isArray(employeeData) ? employeeData : []);

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         const targetsMap = {};
//         targetsRes.data.data.forEach(target => {
//           if (!targetsMap[target.employeeId]) {
//             targetsMap[target.employeeId] = {};
//           }
//           targetsMap[target.employeeId][target.month] = target.target;
//         });
//         setEmployeeTargets(targetsMap);
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true);
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//         calculateDetailedStats(logsRes.data.data);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         setDetailedStats({
//           callDirections: {},
//           callCategories: {},
//           saleMethods: {},
//           languages: {},
//           chargebacks: 0,
//           netProfit: 0
//         });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Calculate detailed statistics
//   // const calculateDetailedStats = (logs) => {
//   //   const directions = {};
//   //   const categories = {};
//   //   const methods = {};
//   //   const languages = {};
//   //   let totalChargebacks = 0;
//   //   let totalNetProfit = 0;

//   //   logs.forEach(log => {
//   //     directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
//   //     categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
      
//   //     if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
//   //       methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
//   //     }
      
//   //     languages[log.language] = (languages[log.language] || 0) + 1;
//   //     totalChargebacks += parseFloat(log.chargebackRefund || 0);
//   //     totalNetProfit += parseFloat(log.netProfit || 0);
//   //   });

//   //   setDetailedStats({
//   //     callDirections: directions,
//   //     callCategories: categories,
//   //     saleMethods: methods,
//   //     languages: languages,
//   //     chargebacks: totalChargebacks,
//   //     netProfit: totalNetProfit
//   //   });
//   // };
// const calculateDetailedStats = (logs) => {
//   const directions = {};
//   const categories = {};
//   const methods = {};
//   const languages = {};
//   let totalChargebacks = 0;
//   let totalNetProfit = 0;

//   logs.forEach(log => {
//     directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
//     categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
    
//     if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
//       methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
//     }
    
//     languages[log.language] = (languages[log.language] || 0) + 1;
//     const chargeback = parseFloat(log.chargebackAmount || 0);
//     const refund = parseFloat(log.refundAmount || 0);
//     const profit = parseFloat(log.profitAmount || 0);
//     const netProfit = profit - (chargeback + refund); // Calculate net profit

//     totalChargebacks += chargeback;
//     totalNetProfit += netProfit;
//   });

//   setDetailedStats({
//     callDirections: directions,
//     callCategories: categories,
//     saleMethods: methods,
//     languages: languages,
//     chargebacks: totalChargebacks,
//     netProfit: totalNetProfit
//   });
// console.log('Chargebacks:', totalChargebacks, 'Net Profit:', totalNetProfit);

// };

//   // Calculate profit summary
//   // const calculateProfitSummary = (logs, targets) => {
//   //   const byEmployee = {};
//   //   const byMonth = {};
//   //   let total = 0;

//   //   logs.forEach(log => {
//   //     // if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//   //     if (log.wasSaleConverted === 'Yes' && log.netProfit) {
//   //       const employeeName = log.employeeId?.name || 'Unassigned';
//   //       const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//   //       const date = new Date(log.createdAt);
//   //       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//   //       const monthName = date.toLocaleString('default', { month: 'short' });
//   //       // const profit = parseFloat(log.profitAmount) || 0;
//   //       const profit = parseFloat(log.netProfit) || 0;

//   //       let target = 0;
//   //       const targetEntry = targets?.find(t =>
//   //         (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//   //         t.month === monthName
//   //       );

//   //       if (targetEntry) {
//   //         target = targetEntry.target || 0;
//   //       }

//   //       if (!byEmployee[employeeName]) {
//   //         byEmployee[employeeName] = {
//   //           profit: 0,
//   //           target: target,
//   //           employeeId: employeeId
//   //         };
//   //       }

//   //       if (target > 0 && byEmployee[employeeName].target === 0) {
//   //         byEmployee[employeeName].target = target;
//   //       }

//   //       byEmployee[employeeName].profit += profit;
//   //       byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//   //       total += profit;
//   //     }
//   //   });

//   //   setProfitSummary({ byEmployee, byMonth, total });
//   // };
// const calculateProfitSummary = (logs, targets) => {
//   const byEmployee = {};
//   const byMonth = {};
//   let total = 0;

//   logs.forEach(log => {
//     if (log.wasSaleConverted === 'Yes') {
//       const employeeName = log.employeeId?.name || 'Unassigned';
//       const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
//       const date = new Date(log.createdAt);
//       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//       const monthName = date.toLocaleString('default', { month: 'short' });
//       const profitAmount = parseFloat(log.profitAmount) || 0;
//       const chargeback = parseFloat(log.chargebackAmount) || 0;
//       const refund = parseFloat(log.refundAmount) || 0;
//       const profit = profitAmount - (chargeback + refund); // Calculate net profit

//       let target = 0;
//       const targetEntry = targets?.find(t =>
//         (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//         t.month === monthName
//       );

//       if (targetEntry) {
//         target = targetEntry.target || 0;
//       }

//       if (!byEmployee[employeeName]) {
//         byEmployee[employeeName] = {
//           profit: 0,
//           target: target,
//           employeeId: employeeId
//         };
//       }

//       if (target > 0 && byEmployee[employeeName].target === 0) {
//         byEmployee[employeeName].target = target;
//       }

//       byEmployee[employeeName].profit += profit;
//       byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//       total += profit;
//     }
//   });

//   setProfitSummary({ byEmployee, byMonth, total });
// };
//   // Apply filters
//   const applyFilters = useCallback(() => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       ));
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (selectedMonth && selectedYear) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate.getMonth() + 1 === selectedMonth && 
//                logDate.getFullYear() === selectedYear;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//     calculateDetailedStats(results);
//   }, [callLogs, searchTerm, filters, selectedMonth, selectedYear, sortConfig, targets]);

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle date range change
//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   // Request sort
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };



// // const downloadCallLogReport = (log) => {
// //   // Create CSV header
// //   const headers = [
// //     'Call Time', 'Call Direction', 'Type', 'Category', 'Reason',
// //     'Description', 'Sale Converted', 'Sale Method', 'Profit Amount','Chargeback/Refund', 'Net Profit',
// //     'No Sale Reason', 'Customer Name', 'Email', 'Phone', 'Language'
// //   ];

// //   // Create CSV row
// //   const row = [
// //     formatDate(log.createdAt),
// //     log.callDirection || 'N/A',
// //     log.typeOfCall,
// //     log.callCategory || 'N/A',
// //     log.reasonForCall,
// //     log.callDescription,
// //     log.wasSaleConverted,
// //     log.saleConvertedThrough || 'N/A',
// //     log.profitAmount || 0,
// //     log.chargebackRefund || 0,
// //       log.netProfit || 0,
// //     log.reasonForNoSale || 'N/A',
// //     log.customerName,
// //     log.customerEmail || 'N/A',
// //     log.customerPhone,
// //     log.language
// //   ];

// //   // Escape fields containing commas/quotes
// //   const escapedRow = row.map(field => 
// //     `"${String(field).replace(/"/g, '""')}"`
// //   );

// //   // Combine header and row
// //   const csvContent = [
// //     headers.join(','),
// //     escapedRow.join(',')
// //   ].join('\n');

// //   // Create and download CSV file
// //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //   const link = document.createElement('a');
// //   link.href = URL.createObjectURL(blob);
// //   link.download = `call-log-${log._id}.csv`;
// //   link.click();
// // };

// // Replace the downloadDetailedReport function with this:


// const downloadCallLogReport = (log) => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Call Direction', 'Type', 'Category', 'Reason',
//     'Description', 'Sale Converted', 'Sale Method', 'Profit Amount', 'Chargeback/Refund', 'Net Profit',
//     'No Sale Reason', 'Customer Name', 'Email', 'Phone', 'Language'
//   ];

//   // Calculate net profit
//   const profitAmount = parseFloat(log.profitAmount || 0);
//   const chargeback = parseFloat(log.chargebackAmount || 0);
//   const refund = parseFloat(log.refundAmount || 0);
//   const netProfit = profitAmount - (chargeback + refund);

//   // Create CSV row
//   const row = [
//     formatDate(log.createdAt),
//     log.callDirection || 'N/A',
//     log.typeOfCall,
//     log.callCategory || 'N/A',
//     log.reasonForCall,
//     log.callDescription,
//     log.wasSaleConverted,
//     log.saleConvertedThrough || 'N/A',
//     profitAmount.toFixed(2),
//     chargeback.toFixed(2),
//     netProfit.toFixed(2),
//     log.reasonForNoSale || 'N/A',
//     log.customerName,
//     log.customerEmail || 'N/A',
//     log.customerPhone,
//     log.language
//   ];

//   // Escape fields containing commas/quotes
//   const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);

//   // Combine header and row
//   const csvContent = [headers.join(','), escapedRow.join(',')].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-log-${log._id}.csv`;
//   link.click();
// };


// // const downloadDetailedReport = () => {
// //   // Create CSV header
// //   const headers = [
// //     'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
// //     'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit','Employee'
// //   ];

// //   // Create CSV rows
// //   const rows = filteredLogs.map(log => [
// //     formatDate(log.createdAt),
// //     log.callDirection,
// //     log.typeOfCall,
// //     log.callCategory || 'N/A',
// //     log.customerName,
// //     log.customerPhone,
// //     log.wasSaleConverted,
// //     log.saleConvertedThrough || 'N/A',
// //     log.profitAmount || 0,
// //     log.chargebackRefund || 0,
// //       log.netProfit || 0,
// //     log.employeeId?.name || 'Unassigned'
// //   ]);

// //   // Escape all fields
// //   const escapedRows = rows.map(row => 
// //     row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
// //   );

// //   // Combine header and rows
// //   const csvContent = [
// //     headers.join(','),
// //     ...escapedRows
// //   ].join('\n');

// //   // Create and download CSV file
// //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //   const link = document.createElement('a');
// //   link.href = URL.createObjectURL(blob);
// //   link.download = `call-logs-report-${new Date().toISOString().split('T')[0]}.csv`;
// //   link.click();
// // };









//   // Get category icon
  
  
//   const downloadDetailedReport = () => {
//   // Create CSV header
//   const headers = [
//     'Call Time', 'Direction', 'Type', 'Category', 'Customer',
//     'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
//   ];

//   // Create CSV rows
//   const rows = filteredLogs.map(log => {
//     const profitAmount = parseFloat(log.profitAmount || 0);
//     const chargeback = parseFloat(log.chargebackAmount || 0);
//     const refund = parseFloat(log.refundAmount || 0);
//     const netProfit = profitAmount - (chargeback + refund);
//     return [
//       formatDate(log.createdAt),
//       log.callDirection,
//       log.typeOfCall,
//       log.callCategory || 'N/A',
//       log.customerName,
//       log.customerPhone,
//       log.wasSaleConverted,
//       log.saleConvertedThrough || 'N/A',
//       profitAmount.toFixed(2),
//       chargeback.toFixed(2),
//       netProfit.toFixed(2),
//       log.employeeId?.name || 'Unassigned'
//     ];
//   });

//   // Escape all fields
//   const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

//   // Combine header and rows
//   const csvContent = [headers.join(','), ...escapedRows].join('\n');

//   // Create and download CSV file
//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-logs-report-${new Date().toISOString().split('T')[0]}.csv`;
//   link.click();
// };
  
//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Car Rental': return <FaCar className="text-orange-600" />;
//       case 'Packages': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   // Get achievement percentage
//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.target === 0) return 0;
//     return Math.round((employeeData.profit / employeeData.target) * 100);
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters when dependencies change
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, selectedMonth, selectedYear, sortConfig, applyFilters]);




//   // Add this function to your component
// const fetchAllCallLogs = async () => {
//   try {
//     const logsRes = await API.get('/call-logs', {  // You'll need to create this endpoint on your backend
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });

//     if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//       return logsRes.data.data;
//     }
//     return [];
//   } catch (err) {
//     console.error('Error fetching all call logs:', err);
//     setError('Failed to load all call logs');
//     return [];
//   }
// };

// // const downloadAllCallLogsReport = async () => {
// //   try {
// //     // Show loading state
// //     setLoadingPage(true);
    
// //     // Fetch all call logs
// //     const allLogs = await fetchAllCallLogs();
    
// //     if (allLogs.length === 0) {
// //       alert('No call logs found to download');
// //       return;
// //     }

// //     // Create CSV header
// //     const headers = [
// //       'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
// //       'Phone', 'Sale Status', 'Sale Method', 'Profit','Chargeback/Refund', 'Net Profit', 'Employee'
// //     ];

// //     // Create CSV rows
// //     const rows = allLogs.map(log => [
// //       formatDate(log.createdAt),
// //       log.callDirection,
// //       log.typeOfCall,
// //       log.callCategory || 'N/A',
// //       log.customerName,
// //       log.customerPhone,
// //       log.wasSaleConverted,
// //       log.saleConvertedThrough || 'N/A',
// //       log.profitAmount || 0,
// //       log.chargebackRefund || 0,
// //         log.netProfit || 0,
// //       log.employeeId?.name || 'Unassigned'
// //     ]);

// //     // Escape all fields
// //     const escapedRows = rows.map(row => 
// //       row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
// //     );

// //     // Combine header and rows
// //     const csvContent = [
// //       headers.join(','),
// //       ...escapedRows
// //     ].join('\n');

// //     // Create and download CSV file
// //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     link.href = URL.createObjectURL(blob);
// //     link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
// //     link.click();
// //   } catch (error) {
// //     console.error('Error downloading all call logs:', error);
// //     alert('Failed to download all call logs');
// //   } finally {
// //     setLoadingPage(false);
// //   }
// // };


// const downloadAllCallLogsReport = async () => {
//   try {
//     setLoadingPage(true);
//     const allLogs = await fetchAllCallLogs();
    
//     if (allLogs.length === 0) {
//       alert('No call logs found to download');
//       return;
//     }

//     const headers = [
//       'Call Time', 'Direction', 'Type', 'Category', 'Customer',
//       'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
//     ];

//     const rows = allLogs.map(log => {
//       const profitAmount = parseFloat(log.profitAmount || 0);
//       const chargeback = parseFloat(log.chargebackAmount || 0);
//       const refund = parseFloat(log.refundAmount || 0);
//       const netProfit = profitAmount - (chargeback + refund);
//       return [
//         formatDate(log.createdAt),
//         log.callDirection,
//         log.typeOfCall,
//         log.callCategory || 'N/A',
//         log.customerName,
//         log.customerPhone,
//         log.wasSaleConverted,
//         log.saleConvertedThrough || 'N/A',
//         profitAmount.toFixed(2),
//         chargeback.toFixed(2),
//         netProfit.toFixed(2),
//         log.employeeId?.name || 'Unassigned'
//       ];
//     });

//     const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

//     const csvContent = [headers.join(','), ...escapedRows].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   } catch (error) {
//     console.error('Error downloading all call logs:', error);
//     alert('Failed to download all call logs');
//   } finally {
//     setLoadingPage(false);
//   }
// };


//   // Loading state
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   // Error state
//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Car Rental</option>
//                   <option value="Package">Packages</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>
//                       {employee.name} ({employee.role})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   value={selectedMonth}
//                   onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 12}, (_, i) => i + 1).map(month => (
//                     <option key={month} value={month}>
//                       {new Date(2000, month - 1, 1).toLocaleString('default', {month: 'long'})}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end mt-4">
         

// <div className="flex justify-end mt-4 space-x-3">
//   <button
//     onClick={downloadDetailedReport}
//     disabled={filteredLogs.length === 0}
//     className={`flex items-center px-4 py-2 bg-indigo-600 !text-white rounded-md hover:bg-indigo-700 ${
//       filteredLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//     }`}
//   >
//     <FiDownload className="mr-2" />
//     Download Filtered Report
//   </button>
  
//   <button
//     onClick={downloadAllCallLogsReport}
//     disabled={loadingPage}
//     className={`flex items-center px-4 py-2 bg-green-600 !text-white rounded-md hover:bg-green-700 ${
//       loadingPage ? 'opacity-50 cursor-not-allowed' : ''
//     }`}
//   >
//     <FiDownload className="mr-2" />
//     Download All Call Logs
//   </button>
// </div>


//             </div>
            
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           {/* <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Net Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div> */}

//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//   <div className="flex items-center justify-between">
//     <div>
//       <p className="text-sm font-medium text-gray-500">Total Net Profit</p>
//       <p className="text-3xl font-bold text-green-600">${detailedStats.netProfit.toFixed(2)}</p>
//     </div>
//     <div className="p-3 bg-green-100 rounded-full">
//       <FiDollarSign className="text-green-600 text-xl" />
//     </div>
//   </div>
// </div>

//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Statistics */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800">Detailed Statistics</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Directions</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
//                   <li key={direction} className="flex justify-between">
//                     <span className="text-gray-600">{direction}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Call Categories</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.callCategories).map(([category, count]) => (
//                   <li key={category} className="flex justify-between">
//                     <span className="text-gray-600">{category || 'Uncategorized'}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Sale Methods</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
//                   <li key={method} className="flex justify-between">
//                     <span className="text-gray-600">{method}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//                 {Object.keys(detailedStats.saleMethods).length === 0 && (
//                   <li className="text-gray-500">No sales data</li>
//                 )}
//               </ul>
//             </div>
            

//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Financials</h4>
//               <ul className="space-y-1">
//                 <li className="flex justify-between">
//                   <span className="text-gray-600">Total Chargebacks:</span>
//                   <span className="font-medium">${detailedStats.chargebacks.toFixed(2)}</span>
//                 </li>
//                 <li className="flex justify-between">
//                   <span className="text-gray-600">Total Net Profit:</span>
//                   <span className="font-medium">${detailedStats.netProfit.toFixed(2)}</span>
//                 </li>
//               </ul>
//             </div>


//             <div>
//               <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
//               <ul className="space-y-1">
//                 {Object.entries(detailedStats.languages).map(([language, count]) => (
//                   <li key={language} className="flex justify-between">
//                     <span className="text-gray-600">{language}:</span>
//                     <span className="font-medium">{count}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.target.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.profit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>


//                   {/* <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('chargebackRefund')}
//                   >
//                     <div className="flex items-center">
//                       Chargeback
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th> */}

//                   <th
//   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//   onClick={() => requestSort('chargebackAmount')}
// >
//   <div className="flex items-center">
//     Chargeback
//     <FaSortAmountDown className="ml-1 text-gray-400" />
//   </div>
// </th>


//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('netProfit')}
//                   >
//                     <div className="flex items-center">
//                       Net Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               {/* <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${log.chargebackRefund || 0}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${log.netProfit || 0}
//                       </td>
                      
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => downloadCallLogReport(log)}
//                           className="!text-blue-600 hover:text-blue-900"
//                           title="Download call log report"
//                         >
//                           <FiDownload />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                             setSelectedMonth(new Date().getMonth() + 1);
//                             setSelectedYear(new Date().getFullYear());
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody> */}
// <tbody className="bg-white divide-y divide-gray-200">
//   {filteredLogs.length > 0 ? (
//     filteredLogs.map((log) => {
//       const profitAmount = parseFloat(log.profitAmount || 0);
//       const chargeback = parseFloat(log.chargebackAmount || 0);
//       const refund = parseFloat(log.refundAmount || 0);
//       const netProfit = profitAmount - (chargeback + refund); // Calculate net profit
//       return (
//         <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                 <span className="text-blue-700 font-medium">
//                   {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                 </span>
//               </div>
//               <div className="ml-4">
//                 <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                 <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//               </div>
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="flex items-center">
//               {getCategoryIcon(log.callCategory)}
//               <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <span
//               className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                 log.wasSaleConverted === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {log.wasSaleConverted === 'Yes' ? <FiCheck className="inline mr-1" /> : <FiX className="inline mr-1" />}
//               {log.wasSaleConverted}
//             </span>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap">
//             <div className="flex items-center">
//               <FiDollarSign className="text-gray-500" />
//               <span className={`ml-1 font-medium ${profitAmount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                 {profitAmount.toFixed(2)}
//               </span>
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${chargeback.toFixed(2)}</td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${netProfit.toFixed(2)}</td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//             <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//               {log.customerPhone}
//             </a>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//             <div className="flex items-center">
//               <FiUser className="text-gray-400 mr-1" />
//               {log.employeeId?.name || 'Unassigned'}
//             </div>
//           </td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.createdAt)}</td>
//           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//             <button
//               onClick={() => downloadCallLogReport(log)}
//               className="!text-blue-600 hover:text-blue-900"
//               title="Download call log report"
//             >
//               <FiDownload />
//             </button>
//           </td>
//         </tr>
//       );
//     })
//   ) : (
//     <tr>
//       <td colSpan="11" className="px-6 py-12 text-center">
//         <div className="flex flex-col items-center justify-center">
//           <FiSearch className="text-gray-400 text-4xl mb-4" />
//           <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//           <button
//             onClick={() => {
//               setSearchTerm('');
//               setFilters({
//                 callCategory: '',
//                 wasSaleConverted: '',
//                 employeeId: '',
//                 startDate: null,
//                 endDate: null
//               });
//               setSelectedMonth(new Date().getMonth() + 1);
//               setSelectedYear(new Date().getFullYear());
//             }}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </td>
//     </tr>
//   )}
// </tbody>


//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//------------------------with css add amd filter--------
import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import {
  FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
  FiCalendar, FiUser, FiFilter, FiTarget, FiDownload
} from 'react-icons/fi';
import {
  FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AllCallLogs = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [profitSummary, setProfitSummary] = useState({
    byEmployee: {},
    byMonth: {},
    total: 0
  });
  const [detailedStats, setDetailedStats] = useState({
    callDirections: {},
    callCategories: {},
    saleMethods: {},
    languages: {},
    chargebacks: 0,
    netProfit: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [employeeTargets, setEmployeeTargets] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    callCategory: '',
    wasSaleConverted: '',
    employeeId: '',
    startDate: null,
    endDate: null
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [targets, setTargets] = useState([]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoadingInitial(true);

      // Fetch employees
      const employeesRes = await API.get('/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const employeeData = employeesRes.data.data || employeesRes.data;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);

      // Fetch employee targets
      const targetsRes = await API.get('/performance/performance/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (targetsRes.data?.data) {
        setTargets(targetsRes.data.data);
        const targetsMap = {};
        targetsRes.data.data.forEach(target => {
          if (!targetsMap[target.employeeId]) {
            targetsMap[target.employeeId] = {};
          }
          targetsMap[target.employeeId][target.month] = target.target;
        });
        setEmployeeTargets(targetsMap);
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load initial data');
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  // Fetch call logs
  const fetchCallLogs = useCallback(async (page) => {
    try {
      setLoadingPage(true);
      const logsRes = await API.get(`/call-logs?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
        setCallLogs(logsRes.data.data);
        setFilteredLogs(logsRes.data.data);
        setTotalPages(logsRes.data.pagination?.totalPages || 1);
        calculateProfitSummary(logsRes.data.data, targets);
        calculateDetailedStats(logsRes.data.data);
      } else {
        setCallLogs([]);
        setFilteredLogs([]);
        setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
        setDetailedStats({
          callDirections: {},
          callCategories: {},
          saleMethods: {},
          languages: {},
          chargebacks: 0,
          netProfit: 0
        });
      }
    } catch (err) {
      console.error('Error fetching call logs:', err);
      setError('Failed to load call logs');
    } finally {
      setLoadingPage(false);
    }
  }, [targets]);

  // Calculate detailed statistics
  // const calculateDetailedStats = (logs) => {
  //   const directions = {};
  //   const categories = {};
  //   const methods = {};
  //   const languages = {};
  //   let totalChargebacks = 0;
  //   let totalNetProfit = 0;

  //   logs.forEach(log => {
  //     directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
  //     categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
      
  //     if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
  //       methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
  //     }
      
  //     languages[log.language] = (languages[log.language] || 0) + 1;
  //     totalChargebacks += parseFloat(log.chargebackRefund || 0);
  //     totalNetProfit += parseFloat(log.netProfit || 0);
  //   });

  //   setDetailedStats({
  //     callDirections: directions,
  //     callCategories: categories,
  //     saleMethods: methods,
  //     languages: languages,
  //     chargebacks: totalChargebacks,
  //     netProfit: totalNetProfit
  //   });
  // };
const calculateDetailedStats = (logs) => {
  const directions = {};
  const categories = {};
  const methods = {};
  const languages = {};
  let totalChargebacks = 0;
  let totalNetProfit = 0;

  logs.forEach(log => {
    directions[log.callDirection] = (directions[log.callDirection] || 0) + 1;
    categories[log.callCategory] = (categories[log.callCategory] || 0) + 1;
    
    if (log.wasSaleConverted === 'Yes' && log.saleConvertedThrough) {
      methods[log.saleConvertedThrough] = (methods[log.saleConvertedThrough] || 0) + 1;
    }
    
    languages[log.language] = (languages[log.language] || 0) + 1;
    const chargeback = parseFloat(log.chargebackAmount || 0);
    const refund = parseFloat(log.refundAmount || 0);
    const profit = parseFloat(log.profitAmount || 0);
    const netProfit = profit - (chargeback + refund); // Calculate net profit

    totalChargebacks += chargeback;
    totalNetProfit += netProfit;
  });

  setDetailedStats({
    callDirections: directions,
    callCategories: categories,
    saleMethods: methods,
    languages: languages,
    chargebacks: totalChargebacks,
    netProfit: totalNetProfit
  });
console.log('Chargebacks:', totalChargebacks, 'Net Profit:', totalNetProfit);

};

  // Calculate profit summary
  // const calculateProfitSummary = (logs, targets) => {
  //   const byEmployee = {};
  //   const byMonth = {};
  //   let total = 0;

  //   logs.forEach(log => {
  //     // if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
  //     if (log.wasSaleConverted === 'Yes' && log.netProfit) {
  //       const employeeName = log.employeeId?.name || 'Unassigned';
  //       const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
  //       const date = new Date(log.createdAt);
  //       const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
  //       const monthName = date.toLocaleString('default', { month: 'short' });
  //       // const profit = parseFloat(log.profitAmount) || 0;
  //       const profit = parseFloat(log.netProfit) || 0;

  //       let target = 0;
  //       const targetEntry = targets?.find(t =>
  //         (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
  //         t.month === monthName
  //       );

  //       if (targetEntry) {
  //         target = targetEntry.target || 0;
  //       }

  //       if (!byEmployee[employeeName]) {
  //         byEmployee[employeeName] = {
  //           profit: 0,
  //           target: target,
  //           employeeId: employeeId
  //         };
  //       }

  //       if (target > 0 && byEmployee[employeeName].target === 0) {
  //         byEmployee[employeeName].target = target;
  //       }

  //       byEmployee[employeeName].profit += profit;
  //       byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
  //       total += profit;
  //     }
  //   });

  //   setProfitSummary({ byEmployee, byMonth, total });
  // };
const calculateProfitSummary = (logs, targets) => {
  const byEmployee = {};
  const byMonth = {};
  let total = 0;

  logs.forEach(log => {
    if (log.wasSaleConverted === 'Yes') {
      const employeeName = log.employeeId?.name || 'Unassigned';
      const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;
      const date = new Date(log.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      const profitAmount = parseFloat(log.profitAmount) || 0;
      const chargeback = parseFloat(log.chargebackAmount) || 0;
      const refund = parseFloat(log.refundAmount) || 0;
      const profit = profitAmount - (chargeback + refund); // Calculate net profit

      let target = 0;
      const targetEntry = targets?.find(t =>
        (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
        t.month === monthName
      );

      if (targetEntry) {
        target = targetEntry.target || 0;
      }

      if (!byEmployee[employeeName]) {
        byEmployee[employeeName] = {
          profit: 0,
          target: target,
          employeeId: employeeId
        };
      }

      if (target > 0 && byEmployee[employeeName].target === 0) {
        byEmployee[employeeName].target = target;
      }

      byEmployee[employeeName].profit += profit;
      byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
      total += profit;
    }
  });

  setProfitSummary({ byEmployee, byMonth, total });
};
  // Apply filters
  const applyFilters = useCallback(() => {
    let results = callLogs;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(log =>
        (log.customerName?.toLowerCase().includes(lowerTerm) ||
        log.customerPhone?.toLowerCase().includes(lowerTerm) ||
        (typeof log.employeeId === 'string'
          ? log.employeeId?.toLowerCase().includes(lowerTerm)
          : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
      ));
    }

    if (filters.callCategory) {
      results = results.filter(log => log.callCategory === filters.callCategory);
    }

    if (filters.wasSaleConverted) {
      results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
    }

    if (filters.employeeId) {
      results = results.filter(log => {
        if (typeof log.employeeId === 'string') {
          return log.employeeId === filters.employeeId;
        }
        return log.employeeId?._id === filters.employeeId;
      });
    }

    if (selectedMonth && selectedYear) {
      results = results.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate.getMonth() + 1 === selectedMonth && 
               logDate.getFullYear() === selectedYear;
      });
    }

    if (filters.startDate && filters.endDate) {
      results = results.filter(log => {
        const logDate = new Date(log.createdAt);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        return logDate >= filters.startDate && logDate <= endDate;
      });
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue == null) aValue = '';
        if (bValue == null) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredLogs(results);
    calculateProfitSummary(results, targets);
    calculateDetailedStats(results);
  }, [callLogs, searchTerm, filters, selectedMonth, selectedYear, sortConfig, targets]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date range change
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
  };

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };



const downloadCallLogReport = (log) => {
  // Create CSV header
  const headers = [
    'Call Time', 'Call Direction', 'Type', 'Category', 'Reason',
    'Description', 'Sale Converted', 'Sale Method', 'Profit Amount', 'Chargeback/Refund', 'Net Profit',
    'No Sale Reason', 'Customer Name', 'Email', 'Phone', 'Language'
  ];

  // Calculate net profit
  const profitAmount = parseFloat(log.profitAmount || 0);
  const chargeback = parseFloat(log.chargebackAmount || 0);
  const refund = parseFloat(log.refundAmount || 0);
  const netProfit = profitAmount - (chargeback + refund);

  // Create CSV row
  const row = [
    formatDate(log.createdAt),
    log.callDirection || 'N/A',
    log.typeOfCall,
    log.callCategory || 'N/A',
    log.reasonForCall,
    log.callDescription,
    log.wasSaleConverted,
    log.saleConvertedThrough || 'N/A',
    profitAmount.toFixed(2),
    chargeback.toFixed(2),
    netProfit.toFixed(2),
    log.reasonForNoSale || 'N/A',
    log.customerName,
    log.customerEmail || 'N/A',
    log.customerPhone,
    log.language
  ];

  // Escape fields containing commas/quotes
  const escapedRow = row.map(field => `"${String(field).replace(/"/g, '""')}"`);

  // Combine header and row
  const csvContent = [headers.join(','), escapedRow.join(',')].join('\n');

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `call-log-${log._id}.csv`;
  link.click();
};
// Fetch filtered call logs from the backend
const fetchFilteredCallLogs = async () => {
  try {
    let allLogs = [];
    let page = 1;
    let hasMore = true;

    // Build query parameters based on active filters
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (filters.callCategory) queryParams.append('callCategory', filters.callCategory);
    if (filters.wasSaleConverted) queryParams.append('wasSaleConverted', filters.wasSaleConverted);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);
    if (selectedMonth) queryParams.append('month', selectedMonth);
    if (selectedYear) queryParams.append('year', selectedYear);
    if (filters.startDate) queryParams.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      queryParams.append('endDate', endDate.toISOString());
    }

    while (hasMore) {
      queryParams.set('page', page);
      const logsRes = await API.get(`/call-logs?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
        allLogs = [...allLogs, ...logsRes.data.data];
        const totalPages = logsRes.data.pagination?.totalPages || 1;
        hasMore = page < totalPages;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allLogs;
  } catch (err) {
    console.error('Error fetching filtered call logs:', err);
    setError('Failed to load filtered call logs');
    return [];
  }
};
const downloadDetailedReport = async () => {
  try {
    setLoadingPage(true);
    const filteredLogs = await fetchFilteredCallLogs();

    if (filteredLogs.length === 0) {
      alert('No call logs found matching the current filters');
      return;
    }

    // Create CSV header
    const headers = [
      'Call Time', 'Direction', 'Type', 'Category', 'Customer',
      'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
    ];

    // Create CSV rows
    const rows = filteredLogs.map(log => {
      const profitAmount = parseFloat(log.profitAmount || 0);
      const chargeback = parseFloat(log.chargebackAmount || 0);
      const refund = parseFloat(log.refundAmount || 0);
      const netProfit = profitAmount - (chargeback + refund);
      return [
        formatDate(log.createdAt),
        log.callDirection || 'N/A',
        log.typeOfCall || 'N/A',
        log.callCategory || 'N/A',
        log.customerName || 'N/A',
        log.customerPhone || 'N/A',
        log.wasSaleConverted || 'N/A',
        log.saleConvertedThrough || 'N/A',
        profitAmount.toFixed(2),
        (chargeback + refund).toFixed(2), // Combine chargeback and refund
        netProfit.toFixed(2),
        log.employeeId?.name || 'Unassigned'
      ];
    });

    // Escape all fields
    const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    // Combine header and rows
    const csvContent = [headers.join(','), ...escapedRows].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `filtered-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  } catch (error) {
    console.error('Error downloading filtered report:', error);
    alert(`Failed to download filtered report: ${error.message || 'Unknown error'}`);
  } finally {
    setLoadingPage(false);
  }

  // const downloadDetailedReport = () => {
  // // Create CSV header
  // const headers = [
  //   'Call Time', 'Direction', 'Type', 'Category', 'Customer',
  //   'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
  // ];

  // Create CSV rows
  const rows = filteredLogs.map(log => {
    const profitAmount = parseFloat(log.profitAmount || 0);
    const chargeback = parseFloat(log.chargebackAmount || 0);
    const refund = parseFloat(log.refundAmount || 0);
    const netProfit = profitAmount - (chargeback + refund);
    return [
      formatDate(log.createdAt),
      log.callDirection,
      log.typeOfCall,
      log.callCategory || 'N/A',
      log.customerName,
      log.customerPhone,
      log.wasSaleConverted,
      log.saleConvertedThrough || 'N/A',
      profitAmount.toFixed(2),
      chargeback.toFixed(2),
      netProfit.toFixed(2),
      log.employeeId?.name || 'Unassigned'
    ];
  });

  // Escape all fields
  const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

  // Combine header and rows
  const csvContent = [headers.join(','), ...escapedRows].join('\n');

  // Create and download CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `call-logs-report-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Flight': return <FaPlane className="text-blue-600" />;
      case 'Hotel': return <FaHotel className="text-pink-600" />;
      case 'Car Rental': return <FaCar className="text-orange-600" />;
      case 'Packages': return <FaBoxOpen className="text-purple-600" />;
      default: return <FaQuestion className="text-gray-600" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Get achievement percentage
  const getAchievementPercentage = (employeeName) => {
    const employeeData = profitSummary.byEmployee[employeeName];
    if (!employeeData || employeeData.target === 0) return 0;
    return Math.round((employeeData.profit / employeeData.target) * 100);
  };

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Fetch call logs when currentPage changes
  useEffect(() => {
    fetchCallLogs(currentPage);
  }, [currentPage, fetchCallLogs]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, callLogs, filters, selectedMonth, selectedYear, sortConfig, applyFilters]);




  // Add this function to your component
// const fetchAllCallLogs = async () => {
//   try {
//     const logsRes = await API.get('/call-logs', {  // You'll need to create this endpoint on your backend
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     });

//     if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//       return logsRes.data.data;
//     }
//     return [];
//   } catch (err) {
//     console.error('Error fetching all call logs:', err);
//     setError('Failed to load all call logs');
//     return [];
//   }
// };
// Helper function to fetch all call logs (handles pagination if needed)
const fetchAllCallLogs = async () => {
  try {
    let allLogs = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const logsRes = await API.get(`/call-logs?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
        allLogs = [...allLogs, ...logsRes.data.data];
        const totalPages = logsRes.data.pagination?.totalPages || 1;
        hasMore = page < totalPages;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allLogs;
  } catch (err) {
    console.error('Error fetching all call logs:', err);
    setError('Failed to load all call logs');
    return [];
  }
};

// Updated downloadAllCallLogsReport function
const downloadAllCallLogsReport = async () => {
  try {
    setLoadingPage(true);
    const allLogs = await fetchAllCallLogs();

    if (allLogs.length === 0) {
      alert('No call logs found to download');
      return;
    }

    const headers = [
      'Call Time', 'Direction', 'Type', 'Category', 'Customer',
      'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
    ];

    const rows = allLogs.map(log => {
      const profitAmount = parseFloat(log.profitAmount || 0);
      const chargeback = parseFloat(log.chargebackAmount || 0);
      const refund = parseFloat(log.refundAmount || 0);
      const netProfit = profitAmount - (chargeback + refund);
      return [
        formatDate(log.createdAt),
        log.callDirection || 'N/A',
        log.typeOfCall || 'N/A',
        log.callCategory || 'N/A',
        log.customerName || 'N/A',
        log.customerPhone || 'N/A',
        log.wasSaleConverted || 'N/A',
        log.saleConvertedThrough || 'N/A',
        profitAmount.toFixed(2),
        (chargeback + refund).toFixed(2), // Combine chargeback and refund
        netProfit.toFixed(2),
        log.employeeId?.name || 'Unassigned'
      ];
    });

    const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    const csvContent = [headers.join(','), ...escapedRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  } catch (error) {
    console.error('Error downloading all call logs:', error);
    alert(`Failed to download all call logs: ${error.message || 'Unknown error'}`);
  } finally {
    setLoadingPage(false);
  }
};
// const downloadAllCallLogsReport = async () => {
//   try {
//     // Show loading state
//     setLoadingPage(true);
    
//     // Fetch all call logs
//     const allLogs = await fetchAllCallLogs();
    
//     if (allLogs.length === 0) {
//       alert('No call logs found to download');
//       return;
//     }

//     // Create CSV header
//     const headers = [
//       'Call Time', 'Direction', 'Type', 'Category', 'Customer', 
//       'Phone', 'Sale Status', 'Sale Method', 'Profit','Chargeback/Refund', 'Net Profit', 'Employee'
//     ];

//     // Create CSV rows
//     const rows = allLogs.map(log => [
//       formatDate(log.createdAt),
//       log.callDirection,
//       log.typeOfCall,
//       log.callCategory || 'N/A',
//       log.customerName,
//       log.customerPhone,
//       log.wasSaleConverted,
//       log.saleConvertedThrough || 'N/A',
//       log.profitAmount || 0,
//       log.chargebackRefund || 0,
//         log.netProfit || 0,
//       log.employeeId?.name || 'Unassigned'
//     ]);

//     // Escape all fields
//     const escapedRows = rows.map(row => 
//       row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
//     );

//     // Combine header and rows
//     const csvContent = [
//       headers.join(','),
//       ...escapedRows
//     ].join('\n');

//     // Create and download CSV file
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   } catch (error) {
//     console.error('Error downloading all call logs:', error);
//     alert('Failed to download all call logs');
//   } finally {
//     setLoadingPage(false);
//   }
// };


// const downloadAllCallLogsReport = async () => {
//   try {
//     setLoadingPage(true);
//     const allLogs = await fetchAllCallLogs();
    
//     if (allLogs.length === 0) {
//       alert('No call logs found to download');
//       return;
//     }

//     const headers = [
//       'Call Time', 'Direction', 'Type', 'Category', 'Customer',
//       'Phone', 'Sale Status', 'Sale Method', 'Profit', 'Chargeback/Refund', 'Net Profit', 'Employee'
//     ];

//     const rows = allLogs.map(log => {
//       const profitAmount = parseFloat(log.profitAmount || 0);
//       const chargeback = parseFloat(log.chargebackAmount || 0);
//       const refund = parseFloat(log.refundAmount || 0);
//       const netProfit = profitAmount - (chargeback + refund);
//       return [
//         formatDate(log.createdAt),
//         log.callDirection,
//         log.typeOfCall,
//         log.callCategory || 'N/A',
//         log.customerName,
//         log.customerPhone,
//         log.wasSaleConverted,
//         log.saleConvertedThrough || 'N/A',
//         profitAmount.toFixed(2),
//         chargeback.toFixed(2),
//         netProfit.toFixed(2),
//         log.employeeId?.name || 'Unassigned'
//       ];
//     });

//     const escapedRows = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

//     const csvContent = [headers.join(','), ...escapedRows].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `all-call-logs-${new Date().toISOString().split('T')[0]}.csv`;
//     link.click();
//   } catch (error) {
//     console.error('Error downloading all call logs:', error);
//     alert('Failed to download all call logs');
//   } finally {
//     setLoadingPage(false);
//   }
// };


  // Loading state
  if (loadingInitial) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
            <FiPhone className="text-white text-4xl mr-4" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500 text-lg" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              placeholder="Search by customer, phone, or employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center mb-3">
              <FiFilter className="text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="callCategory"
                  value={filters.callCategory}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Rental">Car Rental</option>
                  <option value="Package">Packages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
                <select
                  name="wasSaleConverted"
                  value={filters.wasSaleConverted}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Yes">Converted</option>
                  <option value="No">Not Converted</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  name="employeeId"
                  value={filters.employeeId}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Employees</option>
                  {employees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} ({employee.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1, 1).toLocaleString('default', {month: 'long'})}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <DatePicker
                  selectsRange
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select date range"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
         

<div className="flex justify-end mt-4 space-x-3">
  <button
    onClick={downloadDetailedReport}
    disabled={filteredLogs.length === 0}
    className={`flex items-center px-4 py-2 bg-indigo-600 !text-white rounded-md hover:bg-indigo-700 ${
      filteredLogs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    <FiDownload className="mr-2" />
    Download Filtered Report
  </button>
  
  <button
    onClick={downloadAllCallLogsReport}
    disabled={loadingPage}
    className={`flex items-center px-4 py-2 bg-green-600 !text-white rounded-md hover:bg-green-700 ${
      loadingPage ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    <FiDownload className="mr-2" />
    Download All Call Logs
  </button>
</div>


            </div>
            
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Calls</p>
                <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiPhone className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Converted Sales</p>
                <p className="text-3xl font-bold text-gray-800">
                  {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheck className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          {/* <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Net Profit</p>
                <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
          </div> */}

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">Total Net Profit</p>
      <p className="text-3xl font-bold text-green-600">${detailedStats.netProfit.toFixed(2)}</p>
    </div>
    <div className="p-3 bg-green-100 rounded-full">
      <FiDollarSign className="text-green-600 text-xl" />
    </div>
  </div>
</div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {Object.keys(profitSummary.byEmployee).length > 0
                    ? `${Math.round(
                        Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
                          const achievement = emp.target > 0 ? (emp.profit / emp.target) * 100 : 0;
                          return sum + achievement;
                        }, 0) / Object.keys(profitSummary.byEmployee).length
                      )}%`
                    : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <FiTarget className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg !font-bold text-gray-800">Detailed Statistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            <div>
              <h4 className="!font-bold text-gray-700 mb-2">Call Directions</h4>
              <ul className="space-y-1">
                {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
                  <li key={direction} className="flex justify-between">
                    <span className="text-gray-600">{direction}:</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Call Categories</h4>
              <ul className="space-y-1">
                {Object.entries(detailedStats.callCategories).map(([category, count]) => (
                  <li key={category} className="flex justify-between">
                    <span className="text-gray-600">{category || 'Uncategorized'}:</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Sale Methods</h4>
              <ul className="space-y-1">
                {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
                  <li key={method} className="flex justify-between">
                    <span className="text-gray-600">{method}:</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
                {Object.keys(detailedStats.saleMethods).length === 0 && (
                  <li className="text-gray-500">No sales data</li>
                )}
              </ul>
            </div>
            

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Financials</h4>
              <ul className="space-y-1">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Chargebacks:</span>
                  <span className="font-medium">${detailedStats.chargebacks.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Net Profit:</span>
                  <span className="font-medium">${detailedStats.netProfit.toFixed(2)}</span>
                </li>
              </ul>
            </div>


            <div>
              <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
              <ul className="space-y-1">
                {Object.entries(detailedStats.languages).map(([language, count]) => (
                  <li key={language} className="flex justify-between">
                    <span className="text-gray-600">{language}:</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div> */}
<div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-10">
  {/* Header */}
  <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <h3 className="text-xl font-bold text-white tracking-wide">📊 Detailed Statistics</h3>
  </div>

  {/* Grid Content */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
    {/* Card Item */}
    <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">Call Directions</h4>
      <ul className="space-y-2 text-sm">
        {Object.entries(detailedStats.callDirections).map(([direction, count]) => (
          <li key={direction} className="flex justify-between text-gray-600">
            <span>{direction}:</span>
            <span className="font-bold text-indigo-600">{count}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">Call Categories</h4>
      <ul className="space-y-2 text-sm">
        {Object.entries(detailedStats.callCategories).map(([category, count]) => (
          <li key={category} className="flex justify-between text-gray-600">
            <span>{category || 'Uncategorized'}:</span>
            <span className="font-bold text-purple-600">{count}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">Sale Methods</h4>
      <ul className="space-y-2 text-sm">
        {Object.entries(detailedStats.saleMethods).map(([method, count]) => (
          <li key={method} className="flex justify-between text-gray-600">
            <span>{method}:</span>
            <span className="font-bold text-green-600">{count}</span>
          </li>
        ))}
        {Object.keys(detailedStats.saleMethods).length === 0 && (
          <li className="text-gray-400 italic">No sales data</li>
        )}
      </ul>
    </div>

    <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">Financials</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between text-gray-600">
          <span>Total Chargebacks:</span>
          <span className="font-bold text-red-500">${detailedStats.chargebacks.toFixed(2)}</span>
        </li>
        <li className="flex justify-between text-gray-600">
          <span>Total Net Profit:</span>
          <span className="font-bold text-emerald-600">${detailedStats.netProfit.toFixed(2)}</span>
        </li>
      </ul>
    </div>

    <div className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all">
      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-1">Languages</h4>
      <ul className="space-y-2 text-sm">
        {Object.entries(detailedStats.languages).map(([language, count]) => (
          <li key={language} className="flex justify-between text-gray-600">
            <span>{language}:</span>
            <span className="font-bold text-blue-600">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

        {/* Employee Performance vs Targets */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiTarget className="mr-2" /> Employee Performance vs Targets
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achieved ($)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
                  const achievement = data.target > 0 ? (data.profit / data.target) * 100 : 0;
                  return (
                    <tr key={employee}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-medium">
                              {employee.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${data.target.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-500" />
                          <span className={`ml-1 font-medium ${data.profit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {data.profit.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                achievement >= 100 ? 'bg-green-600' :
                                achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(achievement, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {Math.round(achievement)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(profitSummary.byEmployee).length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No employee performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
          {loadingPage && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('customerName')}
                  >
                    <div className="flex items-center">
                      Customer
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('callCategory')}
                  >
                    <div className="flex items-center">
                      Category
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('wasSaleConverted')}
                  >
                    <div className="flex items-center">
                      Status
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('profitAmount')}
                  >
                    <div className="flex items-center">
                      Profit
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>


                  {/* <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('chargebackRefund')}
                  >
                    <div className="flex items-center">
                      Chargeback
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th> */}

                  <th
  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
  onClick={() => requestSort('chargebackAmount')}
>
  <div className="flex items-center">
    Chargeback
    <FaSortAmountDown className="ml-1 text-gray-400" />
  </div>
</th>


                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('netProfit')}
                  >
                    <div className="flex items-center">
                      Net Profit
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('employeeId.name')}
                  >
                    <div className="flex items-center">
                      Employee
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      <FaSortAmountDown className="ml-1 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              {/* <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-medium">
                              {log.customerName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
                            <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getCategoryIcon(log.callCategory)}
                          <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.wasSaleConverted === 'Yes'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.wasSaleConverted === 'Yes' ? (
                            <FiCheck className="inline mr-1" />
                          ) : (
                            <FiX className="inline mr-1" />
                          )}
                          {log.wasSaleConverted}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-500" />
                          <span className={`ml-1 font-medium ${
                            log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {log.profitAmount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${log.chargebackRefund || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ${log.netProfit || 0}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
                          {log.customerPhone}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FiUser className="text-gray-400 mr-1" />
                          {log.employeeId?.name || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => downloadCallLogReport(log)}
                          className="!text-blue-600 hover:text-blue-900"
                          title="Download call log report"
                        >
                          <FiDownload />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiSearch className="text-gray-400 text-4xl mb-4" />
                        <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setFilters({
                              callCategory: '',
                              wasSaleConverted: '',
                              employeeId: '',
                              startDate: null,
                              endDate: null
                            });
                            setSelectedMonth(new Date().getMonth() + 1);
                            setSelectedYear(new Date().getFullYear());
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody> */}
<tbody className="bg-white divide-y divide-gray-200">
  {filteredLogs.length > 0 ? (
    filteredLogs.map((log) => {
      const profitAmount = parseFloat(log.profitAmount || 0);
      const chargeback = parseFloat(log.chargebackAmount || 0);
      const refund = parseFloat(log.refundAmount || 0);
      const netProfit = profitAmount - (chargeback + refund); // Calculate net profit
      return (
        <tr key={log._id} className="hover:bg-blue-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-medium">
                  {log.customerName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
                <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              {getCategoryIcon(log.callCategory)}
              <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span
              className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                log.wasSaleConverted === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {log.wasSaleConverted === 'Yes' ? <FiCheck className="inline mr-1" /> : <FiX className="inline mr-1" />}
              {log.wasSaleConverted}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <FiDollarSign className="text-gray-500" />
              <span className={`ml-1 font-medium ${profitAmount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {profitAmount.toFixed(2)}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${chargeback.toFixed(2)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${netProfit.toFixed(2)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
              {log.customerPhone}
            </a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-1" />
              {log.employeeId?.name || 'Unassigned'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.createdAt)}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              onClick={() => downloadCallLogReport(log)}
              className="!text-blue-600 hover:text-blue-900"
              title="Download call log report"
            >
              <FiDownload />
            </button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="11" className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <FiSearch className="text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                callCategory: '',
                wasSaleConverted: '',
                employeeId: '',
                startDate: null,
                endDate: null
              });
              setSelectedMonth(new Date().getMonth() + 1);
              setSelectedYear(new Date().getFullYear());
            }}
            className="mt-4 px-4 py-2 bg-blue-600 !text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </td>
    </tr>
  )}
</tbody>


            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loadingPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loadingPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1 || loadingPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>
                    «
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loadingPage}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={loadingPage}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loadingPage}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || loadingPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>
                    »
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCallLogs;


//======================================CORRECT=============================

// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign,
//   FiCalendar, FiUser, FiFilter, FiTarget
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({
//     byEmployee: {},
//     byMonth: {},
//     total: 0
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loadingInitial, setLoadingInitial] = useState(true); // For initial load
//   const [loadingPage, setLoadingPage] = useState(false); // For pagination
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [employeeTargets, setEmployeeTargets] = useState({});
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null,
//     month: new Date().toLocaleString('default', { month: 'short' }),
//     callDirection: '',
//     saleConvertedThrough: ''
//   });
//   const [sortConfig, setSortConfig] = useState({
//     key: 'createdAt',
//     direction: 'desc'
//   });
//   const [targets, setTargets] = useState([]);

//   // Fetch employees and targets only once on mount
//   const fetchInitialData = useCallback(async () => {
//     try {
//       setLoadingInitial(true);

//       // Fetch employees
//       const employeesRes = await API.get('/employees', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       const employeeData = employeesRes.data.data || employeesRes.data;
//       if (Array.isArray(employeeData)) {
//         setEmployees(employeeData);
//       } else {
//         throw new Error("Invalid employee data format");
//       }

//       // Fetch employee targets
//       const targetsRes = await API.get('/performance/performance/all', {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       if (targetsRes.data?.data) {
//         setTargets(targetsRes.data.data);
//         if (targetsRes.data.success && Array.isArray(targetsRes.data.data)) {
//           const targetsMap = {};
//           targetsRes.data.data.forEach(target => {
//             if (!targetsMap[target.employeeId]) {
//               targetsMap[target.employeeId] = {};
//             }
//             targetsMap[target.employeeId][target.month] = target.target;
//           });
//           setEmployeeTargets(targetsMap);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching initial data:', err);
//       setError('Failed to load initial data');
//     } finally {
//       setLoadingInitial(false);
//     }
//   }, []);

//   // Fetch call logs for the current page
//   const fetchCallLogs = useCallback(async (page) => {
//     try {
//       setLoadingPage(true); // Set pagination-specific loading state
//       const logsRes = await API.get(`/call-logs?page=${page}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });

//       if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//         setCallLogs(logsRes.data.data);
//         setFilteredLogs(logsRes.data.data);
//         setTotalPages(logsRes.data.pagination?.totalPages || 1);
//         calculateProfitSummary(logsRes.data.data, targets);
//       } else {
//         setCallLogs([]);
//         setFilteredLogs([]);
//         setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//       }
//     } catch (err) {
//       console.error('Error fetching call logs:', err);
//       setError('Failed to load call logs');
//     } finally {
//       setLoadingPage(false);
//     }
//   }, [targets]);

//   // Initial data fetch on mount
//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   // Fetch call logs when currentPage changes
//   useEffect(() => {
//     fetchCallLogs(currentPage);
//   }, [currentPage, fetchCallLogs]);

//   // Apply filters whenever searchTerm, callLogs, filters, or sortConfig changes
//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig, employeeTargets]);

//   const calculateProfitSummary = (logs, targets) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const profit = parseFloat(log.profitAmount) || 0;
//         const date = new Date(log.createdAt);
//         const monthName = date.toLocaleString('default', { month: 'short' });
//         const year = date.getFullYear();
//         const monthKey = `${year}-${monthName}`;
//         const employeeName = log.employeeId?.name || 'Unassigned';
//         const employeeId = typeof log.employeeId === 'string' ? log.employeeId : log.employeeId?._id;

//         if (!byEmployee[employeeName]) {
//           byEmployee[employeeName] = {
//             months: {},
//             totalProfit: 0,
//             totalTarget: 0,
//             employeeId
//           };
//         }

//         if (!byEmployee[employeeName].months[monthKey]) {
//           const targetEntry = targets.find(t =>
//             (t.employeeId === employeeId || t.name?.trim() === employeeName.trim()) &&
//             t.month === monthName
//           );
//           const target = targetEntry ? targetEntry.target || 0 : 0;
//           byEmployee[employeeName].months[monthKey] = {
//             profit: 0,
//             target
//           };
//         }

//         byEmployee[employeeName].months[monthKey].profit += profit;
//         byEmployee[employeeName].totalProfit += profit;
//         byEmployee[employeeName].totalTarget += byEmployee[employeeName].months[monthKey].target;

//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   const applyFilters = () => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         (log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm)))
//       );
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (filters.month) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const monthName = logDate.toLocaleString('default', { month: 'short' });
//         return monthName === filters.month;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         const endDate = new Date(filters.endDate);
//         endDate.setHours(23, 59, 59, 999);
//         return logDate >= filters.startDate && logDate <= endDate;
//       });
//     }

//     if (filters.callDirection) {
//       results = results.filter(log => log.callDirection === filters.callDirection.toUpperCase());
//     }

//     if (filters.saleConvertedThrough) {
//       results = results.filter(log => log.saleConvertedThrough === filters.saleConvertedThrough);
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue == null) aValue = '';
//         if (bValue == null) bValue = '';

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results, targets);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const getAchievementPercentage = (employeeName) => {
//     const employeeData = profitSummary.byEmployee[employeeName];
//     if (!employeeData || employeeData.totalTarget === 0) return 0;
//     return Math.round((employeeData.totalProfit / employeeData.totalTarget) * 100);
//   };

//   const summaries = useMemo(() => {
//     const directions = { Inbound: 0, Outbound: 0 };
//     const categories = {};
//     const conversions = {};
//     filteredLogs.forEach(log => {
//       const dir = log.callDirection?.toUpperCase() || '';
//       if (dir === 'INBOUND') directions.Inbound++;
//       else if (dir === 'OUTBOUND') directions.Outbound++;
//       const cat = log.callCategory || 'Other';
//       categories[cat] = (categories[cat] || 0) + 1;
//       if (log.wasSaleConverted === 'Yes') {
//         const through = log.saleConvertedThrough || 'Unknown';
//         conversions[through] = (conversions[through] || 0) + 1;
//       }
//     });
//     const totalCalls = filteredLogs.length;
//     const totalConverted = filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length;
//     return { directions, categories, conversions, totalCalls, totalConverted };
//   }, [filteredLogs]);

//   // Show full-screen spinner only for initial load
//   if (loadingInitial) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

// const downloadCallLogReport = (log) => {
//   const reportContent = [
//     `CALL LOG DETAILS - ${new Date(log.createdAt).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//     })}`,
//     `Employee: ${log.employeeId?.name || 'Unknown'}`,
//     `Customer: ${log.customerName}`,
//     `Phone: ${log.customerPhone}`,
//     `Email: ${log.customerEmail || 'N/A'}\n`,
//     '=== CALL DETAILS ===',
//     `- ID: ${log._id}`,
//     `- Call Direction: ${log.callDirection || 'N/A'}`,
//     `- Type: ${log.typeOfCall}`,
//     `- Category: ${log.callCategory || 'N/A'}`,
//     `- Reason: ${log.reasonForCall}`,
//     `- Description: ${log.callDescription}`,
//     `- Sale Converted: ${log.wasSaleConverted}`,
//     `- Sale Converted Through: ${log.saleConvertedThrough || 'N/A'}`,
//     `- Profit: $${log.profitAmount || 0}`,
//     `- No Sale Reason: ${log.reasonForNoSale || 'N/A'}`,
//     `- Language: ${log.language}`,
//     `- Time: ${new Date(log.createdAt).toLocaleString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     })}`,
//     '\n=== NOTES ===',
//     'Call log details',
//   ].join('\n');

//   const blob = new Blob([reportContent], { type: 'text/plain' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = `call-log-${log._id}-${new Date(log.createdAt).toISOString().split('T')[0]}.txt`;
//   link.click();
// };

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
//                 <select
//                   name="month"
//                   value={filters.month}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
//                     <option key={m} value={m}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   placeholderText="Select date range"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Call Direction</label>
//                 <select
//                   name="callDirection"
//                   value={filters.callDirection}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Directions</option>
//                   <option value="Inbound">Inbound</option>
//                   <option value="Outbound">Outbound</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Converted Through</label>
//                 <select
//                   name="saleConvertedThrough"
//                   value={filters.saleConvertedThrough}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Methods</option>
//                   <option value="Phone">Phone</option>
//                   <option value="WhatsApp">WhatsApp</option>
//                   <option value="Email">Email</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Avg. Target Achievement</p>
//                 <p className="text-3xl font-bold text-indigo-600">
//                   {Object.keys(profitSummary.byEmployee).length > 0
//                     ? `${Math.round(
//                         Object.values(profitSummary.byEmployee).reduce((sum, emp) => {
//                           const achievement = emp.totalTarget > 0 ? (emp.totalProfit / emp.totalTarget) * 100 : 0;
//                           return sum + achievement;
//                         }, 0) / Object.keys(profitSummary.byEmployee).length
//                       )}%`
//                     : 'N/A'}
//                 </p>
//               </div>
//               <div className="p-3 bg-indigo-100 rounded-full">
//                 <FiTarget className="text-indigo-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Breakdown Sections */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <FiPhone className="mr-2 text-gray-600" /> Call Directions
//             </h3>
//             <div className="space-y-2">
//               <p>Inbound: {summaries.directions.Inbound} {summaries.totalCalls > 0 ? `(${Math.round((summaries.directions.Inbound / summaries.totalCalls) * 100)}%)` : ''}</p>
//               <p>Outbound: {summaries.directions.Outbound} {summaries.totalCalls > 0 ? `(${Math.round((summaries.directions.Outbound / summaries.totalCalls) * 100)}%)` : ''}</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <FaQuestion className="mr-2 text-gray-600" /> Call Categories
//             </h3>
//             <div className="space-y-2">
//               {Object.entries(summaries.categories).map(([cat, count]) => (
//                 <p key={cat}>{cat}: {count} {summaries.totalCalls > 0 ? `(${Math.round((count / summaries.totalCalls) * 100)}%)` : ''}</p>
//               ))}
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold mb-4 flex items-center">
//               <FiCheck className="mr-2 text-gray-600" /> Conversion Methods
//             </h3>
//             <div className="space-y-2">
//               {Object.entries(summaries.conversions).map(([method, count]) => (
//                 <p key={method}>{method}: {count} {summaries.totalConverted > 0 ? `(${Math.round((count / summaries.totalConverted) * 100)}%)` : ''}</p>
//               ))}
//               {Object.keys(summaries.conversions).length === 0 && <p className="text-gray-500">No conversions</p>}
//             </div>
//           </div>
//         </div>

//         {/* Employee Performance vs Targets */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//               <FiTarget className="mr-2" /> Employee Performance vs Targets
//             </h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achieved ($)
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achievement
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {Object.entries(profitSummary.byEmployee).map(([employee, data]) => {
//                   const achievement = data.totalTarget > 0 ? (data.totalProfit / data.totalTarget) * 100 : 0;
//                   return (
//                     <tr key={employee}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {employee.charAt(0)?.toUpperCase()}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{employee}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ${data.totalTarget.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${data.totalProfit > 0 ? 'text-green-600' : 'text-gray-900'}`}>
//                             {data.totalProfit.toFixed(2)}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                               className={`h-2.5 rounded-full ${
//                                 achievement >= 100 ? 'bg-green-600' :
//                                 achievement >= 50 ? 'bg-yellow-500' : 'bg-red-600'
//                               }`}
//                               style={{ width: `${Math.min(achievement, 100)}%` }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm font-medium text-gray-700">
//                             {Math.round(achievement)}%
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//                 {Object.keys(profitSummary.byEmployee).length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                       No employee performance data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Table with Optional Loading Indicator */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8 relative">
//           {loadingPage && (
//             <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           )}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callDirection')}
//                   >
//                     <div className="flex items-center">
//                       Direction
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('saleConvertedThrough')}
//                   >
//                     <div className="flex items-center">
//                       Converted Through
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.callDirection || '-'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {log.wasSaleConverted === 'Yes' ? log.saleConvertedThrough || '-' : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => downloadCallLogReport(log)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Download call log report"
//                         >
//                           Download
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="11" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null,
//                               month: new Date().toLocaleString('default', { month: 'short' }),
//                               callDirection: '',
//                               saleConvertedThrough: ''
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1 || loadingPage}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages || loadingPage}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1 || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         disabled={loadingPage}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         } ${loadingPage ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages || loadingPage}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

//=====================================
// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import {
//   FiSearch, FiPhone, FiCheck, FiX, FiDollarSign, FiCalendar, FiUser, FiFilter, FiTarget
// } from 'react-icons/fi';
// import {
//   FaPlane, FaHotel, FaCar, FaBoxOpen, FaQuestion, FaSortAmountDown
// } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const AllCallLogs = () => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [profitSummary, setProfitSummary] = useState({ byEmployee: {}, byMonth: {}, total: 0 });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [employees, setEmployees] = useState([]);
//   const [targets, setTargets] = useState([]);
//   const [filters, setFilters] = useState({
//     callCategory: '',
//     wasSaleConverted: '',
//     employeeId: '',
//     startDate: null,
//     endDate: null
//   });
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch employees
//         const employeesRes = await API.get('/employees', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const employeeData = employeesRes.data.data || employeesRes.data;
//         if (Array.isArray(employeeData)) {
//           setEmployees(employeeData);
//         } else {
//           throw new Error("Invalid employee data format");
//         }

//         // Fetch performance targets
//         const targetsRes = await API.get('/performance/performance/all', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         const targetData = targetsRes.data.data || targetsRes.data;
//         if (Array.isArray(targetData)) {
//           setTargets(targetData);
//         } else {
//           throw new Error("Invalid target data format");
//         }

//         // Fetch call logs
//         const logsRes = await API.get(`/call-logs?page=${currentPage}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (logsRes.data.success && Array.isArray(logsRes.data.data)) {
//           setCallLogs(logsRes.data.data);
//           setFilteredLogs(logsRes.data.data);
//           setTotalPages(logsRes.data.pagination?.totalPages || 1);
//           calculateProfitSummary(logsRes.data.data);
//         } else {
//           setCallLogs([]);
//           setFilteredLogs([]);
//           setProfitSummary({ byEmployee: {}, byMonth: {}, total: 0 });
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [currentPage]);

//   const calculateProfitSummary = (logs) => {
//     const byEmployee = {};
//     const byMonth = {};
//     let total = 0;

//     logs.forEach(log => {
//       if (log.wasSaleConverted === 'Yes' && log.profitAmount) {
//         const employee = log.employeeId?.name || 'Unassigned';
//         const date = new Date(log.createdAt);
//         const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         const profit = parseFloat(log.profitAmount) || 0;

//         byEmployee[employee] = (byEmployee[employee] || 0) + profit;
//         byMonth[monthKey] = (byMonth[monthKey] || 0) + profit;
//         total += profit;
//       }
//     });

//     setProfitSummary({ byEmployee, byMonth, total });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setFilters(prev => ({
//       ...prev,
//       startDate: start,
//       endDate: end
//     }));
//   };

//   const applyFilters = () => {
//     let results = callLogs;

//     if (searchTerm) {
//       const lowerTerm = searchTerm.toLowerCase();
//       results = results.filter(log =>
//         log.customerName?.toLowerCase().includes(lowerTerm) ||
//         log.customerPhone?.toLowerCase().includes(lowerTerm) ||
//         (typeof log.employeeId === 'string'
//           ? log.employeeId?.toLowerCase().includes(lowerTerm)
//           : log.employeeId?.name?.toLowerCase().includes(lowerTerm))
//       );
//     }

//     if (filters.callCategory) {
//       results = results.filter(log => log.callCategory === filters.callCategory);
//     }

//     if (filters.wasSaleConverted) {
//       results = results.filter(log => log.wasSaleConverted === filters.wasSaleConverted);
//     }

//     if (filters.employeeId) {
//       results = results.filter(log => {
//         if (typeof log.employeeId === 'string') {
//           return log.employeeId === filters.employeeId;
//         }
//         return log.employeeId?._id === filters.employeeId;
//       });
//     }

//     if (filters.startDate && filters.endDate) {
//       results = results.filter(log => {
//         const logDate = new Date(log.createdAt);
//         return logDate >= filters.startDate && logDate <= filters.endDate;
//       });
//     }

//     if (sortConfig.key) {
//       results.sort((a, b) => {
//         let aValue, bValue;

//         if (sortConfig.key.includes('.')) {
//           const keys = sortConfig.key.split('.');
//           aValue = keys.reduce((obj, key) => obj?.[key], a);
//           bValue = keys.reduce((obj, key) => obj?.[key], b);
//         } else {
//           aValue = a[sortConfig.key];
//           bValue = b[sortConfig.key];
//         }

//         if (sortConfig.key === 'createdAt') {
//           aValue = new Date(aValue).getTime();
//           bValue = new Date(bValue).getTime();
//         }

//         if (aValue < bValue) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aValue > bValue) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     setFilteredLogs(results);
//     calculateProfitSummary(results);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [searchTerm, callLogs, filters, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getCategoryIcon = (category) => {
//     switch (category) {
//       case 'Flight': return <FaPlane className="text-blue-600" />;
//       case 'Hotel': return <FaHotel className="text-pink-600" />;
//       case 'Rental': return <FaCar className="text-orange-600" />;
//       case 'Package': return <FaBoxOpen className="text-purple-600" />;
//       default: return <FaQuestion className="text-gray-600" />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleString('en-US', options);
//   };

//   const formatMonth = (monthKey) => {
//     const [year, month] = monthKey.split('-').map(Number);
//     return new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
//   };

//   if (loading) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center max-w-md shadow-lg">
//         {error}
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <div className="inline-flex items-center justify-center p-5 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
//             <FiPhone className="text-white text-4xl mr-4" />
//             <h1 className="text-3xl font-bold text-white tracking-tight">Call Logs Dashboard</h1>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="relative w-full max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-500 text-lg" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-12 pr-5 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
//               placeholder="Search by customer, phone, or employee"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
//             <div className="flex items-center mb-3">
//               <FiFilter className="text-gray-600 mr-2" />
//               <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="callCategory"
//                   value={filters.callCategory}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Flight">Flight</option>
//                   <option value="Hotel">Hotel</option>
//                   <option value="Rental">Rental</option>
//                   <option value="Package">Package</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
//                 <select
//                   name="wasSaleConverted"
//                   value={filters.wasSaleConverted}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Yes">Converted</option>
//                   <option value="No">Not Converted</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
//                 <select
//                   name="employeeId"
//                   value={filters.employeeId}
//                   onChange={handleFilterChange}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">All Employees</option>
//                   {employees.map(employee => (
//                     <option key={employee._id} value={employee._id}>{employee.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={filters.startDate}
//                   endDate={filters.endDate}
//                   onChange={handleDateChange}
//                   isClearable={true}
//                   placeholderText="Select date range"
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Calls</p>
//                 <p className="text-3xl font-bold text-gray-800">{filteredLogs.length}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <FiPhone className="text-blue-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Converted Sales</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {filteredLogs.filter(log => log.wasSaleConverted === 'Yes').length}
//                 </p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiCheck className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Total Profit</p>
//                 <p className="text-3xl font-bold text-green-600">${profitSummary.total.toFixed(2)}</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <FiDollarSign className="text-green-600 text-xl" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Targets Section */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="p-4 flex items-center">
//             <FiTarget className="text-gray-600 mr-2" />
//             <h3 className="text-lg font-semibold text-gray-800">Employee Targets</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Employee
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Month
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Target ($)
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {targets.length > 0 ? (
//                   targets.map((target) => (
//                     <tr key={`${target.employeeId?._id}-${target.month}`} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           <span className="text-sm font-medium text-gray-900">{target.employeeId?.name || 'Unknown'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{target.month}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className="ml-1 font-medium text-green-600">{target.target.toFixed(2)}</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="3" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiTarget className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No targets assigned</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Main Call Logs Table */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mb-8">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('customerName')}
//                   >
//                     <div className="flex items-center">
//                       Customer
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('callCategory')}
//                   >
//                     <div className="flex items-center">
//                       Category
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('wasSaleConverted')}
//                   >
//                     <div className="flex items-center">
//                       Status
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('profitAmount')}
//                   >
//                     <div className="flex items-center">
//                       Profit
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('employeeId.name')}
//                   >
//                     <div className="flex items-center">
//                       Employee
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                     onClick={() => requestSort('createdAt')}
//                   >
//                     <div className="flex items-center">
//                       Date
//                       <FaSortAmountDown className="ml-1 text-gray-400" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredLogs.length > 0 ? (
//                   filteredLogs.map((log) => (
//                     <tr key={log._id} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//                             <span className="text-blue-700 font-medium">
//                               {log.customerName?.charAt(0)?.toUpperCase() || '?'}
//                             </span>
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{log.customerName || '-'}</div>
//                             <div className="text-sm text-gray-500">{log.customerEmail || ''}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {getCategoryIcon(log.callCategory)}
//                           <span className="ml-2 text-sm font-medium text-gray-900">{log.callCategory || 'Other'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.typeOfCall}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           log.wasSaleConverted === 'Yes'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {log.wasSaleConverted === 'Yes' ? (
//                             <FiCheck className="inline mr-1" />
//                           ) : (
//                             <FiX className="inline mr-1" />
//                           )}
//                           {log.wasSaleConverted}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <FiDollarSign className="text-gray-500" />
//                           <span className={`ml-1 font-medium ${
//                             log.profitAmount > 0 ? 'text-green-600' : 'text-gray-900'
//                           }`}>
//                             {log.profitAmount || 0}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         <a href={`tel:${log.customerPhone}`} className="text-blue-600 hover:text-blue-800">
//                           {log.customerPhone}
//                         </a>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <div className="flex items-center">
//                           <FiUser className="text-gray-400 mr-1" />
//                           {log.employeeId?.name || 'Unassigned'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(log.createdAt)}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center">
//                         <FiSearch className="text-gray-400 text-4xl mb-4" />
//                         <p className="text-gray-500 text-lg">No call logs found matching your criteria</p>
//                         <button 
//                           onClick={() => {
//                             setSearchTerm('');
//                             setFilters({
//                               callCategory: '',
//                               wasSaleConverted: '',
//                               employeeId: '',
//                               startDate: null,
//                               endDate: null
//                             });
//                           }}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                         >
//                           Reset Filters
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing page <span className="font-medium">{currentPage}</span> of{' '}
//                   <span className="font-medium">{totalPages}</span>
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">First</span>
//                     «
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           currentPage === pageNum
//                             ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                   >
//                     <span className="sr-only">Last</span>
//                     »
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllCallLogs;

