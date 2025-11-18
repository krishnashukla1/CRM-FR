

//========================================

// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import Layout from '../components/Layout';
// import dayjs from 'dayjs';
// import { DatePicker } from 'antd';

// const WeeklyOffPage = () => {
//   const [weeklyOffs, setWeeklyOffs] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({
//     employeeId: '',
//     date: null,
//     reason: ''
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // ✅ Show next 4 weekly offs (every 7 days)
//   const getUpcomingDates = (startDate) => {
//     const dates = [];
//     const base = dayjs(startDate);
//     for (let i = 0; i < 4; i++) {
//       const d = base.add(i * 7, 'day');
//       dates.push(d.format('DD MMM YYYY(ddd)'));
//     }
//     return dates.join(', ');
//   };

//   // ✅ Fetch data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [employeesRes, offsRes] = await Promise.all([
//           API.get('/employees'),
//           API.get('/weekly-offs')
//         ]);
//         setEmployees(employeesRes.data?.data || []);
//         setWeeklyOffs(offsRes.data || []);
//       } catch (err) {
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;

//   const filtered = weeklyOffs.filter((off) => {
//     const lower = searchQuery.toLowerCase();
//     const empName = off.employeeId?.name?.toLowerCase() || '';
//     const dateStr = off.date ? dayjs(off.date).format('DD MMM YYYY (ddd)') : '';
//     return (
//       empName.includes(lower) ||
//       dateStr.includes(lower) ||
//       off.reason.toLowerCase().includes(lower)
//     );
//   });

//   const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / recordsPerPage);

//   const paginate = (page) => setCurrentPage(page);

//   // ✅ Submit Form (Add or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.employeeId || !form.date || !form.reason) return;

//     const payload = {
//       employeeId: form.employeeId,
//       date: dayjs(form.date).format('YYYY-MM-DD'), // ✅ send as string
//       reason: form.reason
//     };

//     try {
//       if (editingId) {
//         await API.put(`/weekly-offs/${editingId}`, payload);
//       } else {
//         await API.post('/weekly-offs', payload);
//       }

//       const res = await API.get('/weekly-offs');
//       setWeeklyOffs(res.data || []);
//       resetForm();
//     } catch (err) {
//       console.error('Add/Update failed:', err);
//       alert('Failed to save. Check backend console.');
//     }
//   };

//   // ✅ Edit form pre-fill
//   const handleEdit = (off) => {
//     setForm({
//       employeeId: off.employeeId?._id || off.employeeId,
//       date: dayjs(off.date),
//       reason: off.reason
//     });
//     setEditingId(off._id);
//   };

//   // ✅ Delete record
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure to delete this record?')) return;

//     try {
//       await API.delete(`/weekly-offs/${id}`); // ✅ Use document `_id`, not employeeId
//       setWeeklyOffs((prev) => prev.filter((w) => w._id !== id));
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert('Delete failed. Check backend logs.');
//     }
//   };

//   const resetForm = () => {
//     setForm({ employeeId: '', date: null, reason: '' });
//     setEditingId(null);
//   };

//   const handleDateChange = (date) => {
//     setForm({ ...form, date });
//   };

//   return (
//     <Layout>
//       <div className="max-w-6xl p-6 mx-auto">
//         <div className="p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
//           <h1 className="text-3xl font-bold">📆 Weekly Off Roster</h1>
//           <p className="mt-1 opacity-90">Manage employee weekly off days</p>
//         </div>

//         {/* Form */}
//         <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
//           <h2 className="mb-4 text-xl font-semibold">
//             {editingId ? '✏️ Edit Record' : '➕ Add New Record'}
//           </h2>
//           <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-sm font-medium">Employee *</label>
//               <select
//                 value={form.employeeId}
//                 onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 required
//                 disabled={editingId}
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-sm font-medium">Date *</label>
//               <DatePicker
//                 className="w-full px-3 py-2 border rounded-md"
//                 onChange={handleDateChange}
//                 value={form.date}
//                 format="DD MMM YYYY"
//               />
//             </div>

//             <div>
//               <label className="block mb-1 text-sm font-medium">Reason *</label>
//               <input
//                 type="text"
//                 value={form.reason}
//                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md"
//                 placeholder="e.g. Weekly Off"
//                 required
//               />
//             </div>

//             <div className="flex gap-4 mt-2 md:col-span-3">
//               <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md">
//                 {editingId ? 'Update' : 'Add'}
//               </button>
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-4 py-2 border rounded-md"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Table */}
//         <div className="p-6 bg-white rounded-lg shadow-md">
//           <h2 className="mb-4 text-xl font-semibold">🧾 Weekly Off List</h2>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Employee</th>
//                   <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Selected Date</th>
//                   <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Upcoming Offs</th>
//                   <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Reason</th>
//                   <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentRecords.map((off) => {
//                   const selectedDate = off.date ? dayjs(off.date) : null;
//                   return (
//                     <tr key={off._id}>
//                       <td className="px-4 py-2">{off.employeeId?.name || 'N/A'}</td>
//                       <td className="px-4 py-2">{selectedDate ? selectedDate.format('DD MMM YYYY(ddd)') : 'N/A'}</td>
//                       <td className="px-4 py-2">{off.date ? getUpcomingDates(off.date) : 'N/A'}</td>
//                       <td className="px-4 py-2">{off.reason}</td>
//                       <td className="px-4 py-2">
//                         <button onClick={() => handleEdit(off)} className="mr-4 text-blue-600">Edit</button>
//                         <button onClick={() => handleDelete(off._id)} className="text-red-600">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default WeeklyOffPage;

//==================================

// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import Layout from '../components/Layout';
// import dayjs from 'dayjs';
// import { DatePicker, Popconfirm, message } from 'antd';

// const WeeklyOffPage = () => {
//   const [weeklyOffs, setWeeklyOffs] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({
//     employeeId: '',
//     date: null
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   // Fetch data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [employeesRes, offsRes] = await Promise.all([
//           API.get('/employees'),
//           API.get('/weekly-offs')
//         ]);
//         setEmployees(employeesRes.data?.data || []);
//         setWeeklyOffs(offsRes.data || []);
//       } catch (err) {
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Group weekly offs by employee with original IDs
//   const groupedWeeklyOffs = weeklyOffs.reduce((acc, off) => {
//     const empId = off.employeeId?._id || off.employeeId;
//     if (!acc[empId]) {
//       acc[empId] = {
//         employee: off.employeeId,
//         dates: [] // Will store { date, id } objects
//       };
//     }
//     if (off.date) {
//       acc[empId].dates.push({
//         date: dayjs(off.date),
//         id: off._id
//       });
//     }
//     return acc;
//   }, {});

//   // Convert grouped object to array and sort dates
//   const processedWeeklyOffs = Object.values(groupedWeeklyOffs).map(item => ({
//     employee: item.employee,
//     dates: item.dates.sort((a, b) => a.date - b.date) // Sort dates chronologically
//   }));

//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;

//   const filtered = processedWeeklyOffs.filter((off) => {
//     const lower = searchQuery.toLowerCase();
//     const empName = off.employee?.name?.toLowerCase() || '';
//     const dateStr = off.dates.map(d => d.date.format('DD MMM YYYY (ddd)')).join(', ');
//     return (
//       empName.includes(lower) ||
//       dateStr.includes(lower)
//     );
//   });

//   const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / recordsPerPage);

//   const paginate = (page) => setCurrentPage(page);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.employeeId || !form.date) {
//       message.error('Please select both employee and date');
//       return;
//     }

//     try {
//       await API.post('/weekly-offs', {
//         employeeId: form.employeeId,
//         date: dayjs(form.date).format('YYYY-MM-DD')
//       });

//       const res = await API.get('/weekly-offs');
//       setWeeklyOffs(res.data || []);
//       setForm({ employeeId: '', date: null });
//       message.success('Weekly off added successfully');
//     } catch (err) {
//       console.error('Add failed:', err);
//       message.error('Failed to add weekly off');
//     }
//   };

//   // Handle date deletion
//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/weekly-offs/${id}`);
//       setWeeklyOffs(prev => prev.filter(off => off._id !== id));
//       message.success('Date deleted successfully');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       message.error('Failed to delete date');
//     }
//   };

//   const handleDateChange = (date) => {
//     setForm({ ...form, date });
//   };

//   return (
//     <Layout>
//       <div className="max-w-6xl p-6 mx-auto">
//         <div className="p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
//           <h1 className="text-3xl font-bold">📆 Weekly Off Roster</h1>
//           <p className="mt-1 opacity-90">Manage employee weekly off days</p>
//         </div>

//         {/* Add New Weekly Off */}
//         <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-md">
//           <h2 className="mb-4 text-xl font-semibold text-gray-800">
//             ➕ Add New Weekly Off
//           </h2>
//           <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Employee *</label>
//               <select
//                 value={form.employeeId}
//                 onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Date *</label>
//               <DatePicker
//                 className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleDateChange}
//                 value={form.date}
//                 format="DD MMM YYYY"
//               />
//             </div>

//             <div className="flex gap-4 mt-2 md:col-span-3">
//               <button 
//                 type="submit" 
//                 className="px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
//               >
//                 Add Date
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Weekly Off List */}
//         <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">🧾 Weekly Off Schedule</h2>
//             <input
//               type="text"
//               placeholder="Search employees or dates..."
//               className="w-64 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Scheduled Off Days</th>
//                   <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentRecords.map((off, index) => (
//                   <tr key={off.employee?._id || index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
//                           <span className="font-medium text-blue-600">
//                             {off.employee?.name?.charAt(0) || '?'}
//                           </span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{off.employee?.name || 'N/A'}</div>
//                           <div className="text-sm text-gray-500">{off.employee?.designation || ''}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-wrap gap-2">
//                         {off.dates.map((d) => (
//                           <div 
//                             key={d.id} 
//                             className="flex items-center px-3 py-1 text-sm text-blue-800 rounded-full bg-blue-50"
//                           >
//                             {d.date.format('DD MMM YYYY (ddd)')}
//                             <Popconfirm
//                               title="Are you sure to delete this date?"
//                               onConfirm={() => handleDelete(d.id)}
//                               okText="Yes"
//                               cancelText="No"
//                             >
//                               <button className="ml-2 text-red-500 hover:text-red-700">
//                                 ×
//                               </button>
//                             </Popconfirm>
//                           </div>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
//                       <button 
//                         onClick={() => setForm({ 
//                           employeeId: off.employee?._id || off.employee,
//                           date: null 
//                         })}
//                         className="mr-4 text-blue-600 hover:text-blue-900"
//                       >
//                         Add More
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-6">
//               <nav className="inline-flex rounded-md shadow">
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => paginate(page)}
//                     className={`px-4 py-2 border ${currentPage === page 
//                       ? 'bg-blue-600 text-white border-blue-600' 
//                       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </nav>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default WeeklyOffPage;

//=========================================
// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import Layout from '../components/Layout';
// import dayjs from 'dayjs';
// import { DatePicker, Popconfirm, message, Select } from 'antd';

// const { Option } = Select;

// const WeeklyOffPage = () => {
//   const [weeklyOffs, setWeeklyOffs] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({
//     employeeId: '',
//     date: null
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
//   const recordsPerPage = 10;

//   // Fetch data on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [employeesRes, offsRes] = await Promise.all([
//           API.get('/employees'),
//           API.get('/weekly-offs')
//         ]);
//         setEmployees(employeesRes.data?.data || []);
//         setWeeklyOffs(offsRes.data || []);
//       } catch (err) {
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter weekly offs by selected month
//   const filterByMonth = (offs) => {
//     if (!selectedMonth) return offs;
//     return offs.filter(off => {
//       return dayjs(off.date).format('YYYY-MM') === selectedMonth;
//     });
//   };

//   // Group weekly offs by employee with original IDs
//   const groupedWeeklyOffs = weeklyOffs.reduce((acc, off) => {
//     const empId = off.employeeId?._id || off.employeeId;
//     if (!acc[empId]) {
//       acc[empId] = {
//         employee: off.employeeId,
//         dates: [] // Will store { date, id } objects
//       };
//     }
//     if (off.date) {
//       acc[empId].dates.push({
//         date: dayjs(off.date),
//         id: off._id
//       });
//     }
//     return acc;
//   }, {});

//   // Convert grouped object to array, sort dates, and filter by month
//   const processedWeeklyOffs = Object.values(groupedWeeklyOffs)
//     .map(item => ({
//       employee: item.employee,
//       dates: item.dates
//         .filter(d => selectedMonth ? d.date.format('YYYY-MM') === selectedMonth : true)
//         .sort((a, b) => a.date - b.date) // Sort dates chronologically
//     }))
//     .filter(item => item.dates.length > 0); // Only include employees with dates in selected month

//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;

//   const filtered = processedWeeklyOffs.filter((off) => {
//     const lower = searchQuery.toLowerCase();
//     const empName = off.employee?.name?.toLowerCase() || '';
//     const dateStr = off.dates.map(d => d.date.format('DD MMM YYYY (ddd)')).join(', ');
//     return (
//       empName.includes(lower) ||
//       dateStr.includes(lower)
//     );
//   });

//   const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / recordsPerPage);

//   const paginate = (page) => setCurrentPage(page);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.employeeId || !form.date) {
//       message.error('Please select both employee and date');
//       return;
//     }

//     try {
//       await API.post('/weekly-offs', {
//         employeeId: form.employeeId,
//         date: dayjs(form.date).format('YYYY-MM-DD')
//       });

//       const res = await API.get('/weekly-offs');
//       setWeeklyOffs(res.data || []);
//       setForm({ employeeId: '', date: null });
//       message.success('Weekly off added successfully');
//     } catch (err) {
//       console.error('Add failed:', err);
//       message.error('Failed to add weekly off');
//     }
//   };

//   // Handle date deletion
//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/weekly-offs/${id}`);
//       setWeeklyOffs(prev => prev.filter(off => off._id !== id));
//       message.success('Date deleted successfully');
//     } catch (err) {
//       console.error('Delete failed:', err);
//       message.error('Failed to delete date');
//     }
//   };

//   const handleDateChange = (date) => {
//     setForm({ ...form, date });
//   };

//   const handleMonthChange = (date) => {
//     if (date) {
//       setSelectedMonth(dayjs(date).format('YYYY-MM'));
//     } else {
//       setSelectedMonth(null);
//     }
//     setCurrentPage(1); // Reset to first page when changing month
//   };

//   return (


//     <Layout>
//       <div className="max-w-6xl p-6 mx-auto">
//         {/* Header with gradient background */}
//         <div className="p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
//           <h1 className="text-3xl font-bold">📆 Weekly Off Roster</h1>
//           <p className="mt-1 opacity-90">Manage employee weekly off days</p>
//         </div>

//         {/* Add New Weekly Off Form */}
//         <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-md">
//           <h2 className="mb-4 text-xl font-semibold text-gray-800">
//             ➕ Add New Weekly Off
//           </h2>
//           <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Employee *</label>
//               <select
//                 value={form.employeeId}
//                 onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
//                 className="w-full px-3 py-2 transition-all border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block mb-1 text-sm font-medium text-gray-700">Date *</label>
//               <DatePicker
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={handleDateChange}
//                 value={form.date}
//                 format="DD MMM YYYY"
//               />
//             </div>

//             <div className="flex gap-4 mt-2 md:col-span-3">
         

//               <button 
//   type="submit" 
//   className="bg-blue-600 hover:bg-blue-700 !text-white
//              px-4 py-2 rounded-md transition duration-200 
//              shadow hover:shadow-md transform hover:-translate-y-0.5"
// >
//   Add Date
// </button>


//             </div>
//           </form>
//         </div>

//         {/* Weekly Off List */}
//         <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
//           <div className="flex flex-col gap-4 mb-4 md:flex-row md:justify-between md:items-center">
//             <h2 className="text-xl font-semibold text-gray-800">🧾 Weekly Off Schedule</h2>
            
//             <div className="flex flex-col gap-4 md:flex-row">
//               <DatePicker
//                 picker="month"
//                 format="MMM YYYY"
//                 className="w-full border-gray-300 rounded-md md:w-48 focus:ring-blue-500 focus:border-blue-500"
//                 value={selectedMonth ? dayjs(selectedMonth) : null}
//                 onChange={handleMonthChange}
//                 allowClear
//                 placeholder="Select month"
//               />
              
//               <input
//                 type="text"
//                 placeholder="Search employees..."
//                 className="w-full px-3 py-2 transition-all border border-gray-300 rounded-md md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {processedWeeklyOffs.length === 0 ? (
//             <div className="py-8 text-center text-gray-500">
//               {selectedMonth 
//                 ? `No weekly offs scheduled for ${dayjs(selectedMonth).format('MMMM YYYY')}`
//                 : 'No weekly offs scheduled'}
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
//                       <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Scheduled Off Days</th>
//                       <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {currentRecords.map((off, index) => (
//                       <tr key={off.employee?._id || index} className="transition-colors hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
//                               <span className="font-medium text-blue-600">
//                                 {off.employee?.name?.charAt(0) || '?'}
//                               </span>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{off.employee?.name || 'N/A'}</div>
//                               <div className="text-sm text-gray-500">{off.employee?.designation || ''}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-wrap gap-2">
//                             {/* {off.dates.map((d) => (
//                               <div 
//                                 key={d.id} 
//                                 className="flex items-center px-3 py-1 text-sm text-blue-800 rounded-full bg-blue-50"
//                               >
//                                 {d.date.format('DD MMM YYYY (ddd)')}
//                                 <Popconfirm
//                                   title="Are you sure to delete this date?"
//                                   onConfirm={() => handleDelete(d.id)}
//                                   okText="Yes"
//                                   cancelText="No"
//                                 >
//                                   <button className="ml-2 text-lg font-bold text-red-500 transition-colors hover:text-red-700">
//                                     ×
//                                   </button>
//                                 </Popconfirm>
//                               </div>
//                             ))} */}

//                             {off.dates.map((d) => (
//   <div 
//     key={d.id} 
//     className="flex items-center px-3 py-1 text-sm text-blue-800 rounded-full bg-blue-50"
//   >
//     {d.date.format('DD MMM YYYY (ddd)')}
//     <Popconfirm
//       title="Are you sure to delete this date?"
//       onConfirm={() => handleDelete(d.id)}
//       okText="Yes"
//       cancelText="No"
//     >
//       <span className="ml-2 text-lg font-bold text-red-500 transition-colors cursor-pointer hover:text-red-700">
//         ×
//       </span>
//     </Popconfirm>
//   </div>
// ))}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
//                           <button 
//                             onClick={() => setForm({ 
//                               employeeId: off.employee?._id || off.employee,
//                               date: null 
//                             })}
//                             className="!text-blue-600 hover:text-blue-900 mr-4 transition-colors"
//                           >
//                             Add More
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center mt-6">
//                   <nav className="inline-flex rounded-md shadow">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                       <button
//                         key={page}
//                         onClick={() => paginate(page)}
//                         className={`px-4 py-2 border ${currentPage === page 
//                           ? 'bg-blue-600 text-white border-blue-600' 
//                           : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} transition-colors`}
//                       >
//                         {page}
//                       </button>
//                     ))}
//                   </nav>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default WeeklyOffPage;

//================================

import React, { useEffect, useState } from 'react';
import API from '../api';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import { DatePicker, Popconfirm, message, Select } from 'antd';

const { Option } = Select;

const WeeklyOffPage = () => {
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: '',
    date: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const recordsPerPage = 10;

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesRes, offsRes] = await Promise.all([
          API.get('/employees'),
          API.get('/weekly-offs')
        ]);
        setEmployees(employeesRes.data?.data || []);
        setWeeklyOffs(offsRes.data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter weekly offs by selected month
  const filterByMonth = (offs) => {
    if (!selectedMonth) return offs;
    return offs.filter(off => {
      return dayjs(off.date).format('YYYY-MM') === selectedMonth;
    });
  };

  // Group weekly offs by employee with original IDs
  const groupedWeeklyOffs = weeklyOffs.reduce((acc, off) => {
    const empId = off.employeeId?._id || off.employeeId;
    if (!acc[empId]) {
      acc[empId] = {
        employee: off.employeeId,
        dates: [] // Will store { date, id } objects
      };
    }
    if (off.date) {
      acc[empId].dates.push({
        date: dayjs(off.date),
        id: off._id
      });
    }
    return acc;
  }, {});

  // Convert grouped object to array, sort dates, and filter by month
  const processedWeeklyOffs = Object.values(groupedWeeklyOffs)
    .map(item => ({
      employee: item.employee,
      dates: item.dates
        .filter(d => selectedMonth ? d.date.format('YYYY-MM') === selectedMonth : true)
        .sort((a, b) => a.date - b.date) // Sort dates chronologically
    }))
    .filter(item => item.dates.length > 0); // Only include employees with dates in selected month

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const filtered = processedWeeklyOffs.filter((off) => {
    const lower = searchQuery.toLowerCase();
    const empName = off.employee?.name?.toLowerCase() || '';
    const dateStr = off.dates.map(d => d.date.format('DD MMM YYYY (ddd)')).join(', ');
    return (
      empName.includes(lower) ||
      dateStr.includes(lower)
    );
  });

  const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  const paginate = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.date) {
      message.error('Please select both employee and date');
      return;
    }

    try {
      await API.post('/weekly-offs', {
        employeeId: form.employeeId,
        date: dayjs(form.date).format('YYYY-MM-DD')
      });

      const res = await API.get('/weekly-offs');
      setWeeklyOffs(res.data || []);
      setForm({ employeeId: '', date: null });
      message.success('Weekly off added successfully');
    } catch (err) {
      console.error('Add failed:', err);
      message.error('Failed to add weekly off');
    }
  };

  // Handle date deletion
  const handleDelete = async (id) => {
    try {
      await API.delete(`/weekly-offs/${id}`);
      setWeeklyOffs(prev => prev.filter(off => off._id !== id));
      message.success('Date deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      message.error('Failed to delete date');
    }
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date });
  };

  const handleMonthChange = (date) => {
    if (date) {
      setSelectedMonth(dayjs(date).format('YYYY-MM'));
    } else {
      setSelectedMonth(null);
    }
    setCurrentPage(1); // Reset to first page when changing month
  };

  return (
    <Layout>
      <div className="max-w-full p-6 mx-auto">
        {/* Header with gradient background */}
        <div className="p-6 mb-6 text-white rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700">
          <h1 className="text-3xl font-bold">📆 Weekly Off Roster</h1>
          <p className="mt-1 opacity-90">Manage employee weekly off days</p>
        </div>

        {/* Add New Weekly Off Form */}
        <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            ➕ Add New Weekly Off
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Employee *</label>
              <select
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-md cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Date *</label>
              <DatePicker
                className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={handleDateChange}
                value={form.date}
                format="DD MMM YYYY"
              />
            </div>

            <div className="flex gap-4 mt-2 md:col-span-3">
              <button 
                type="submit" 
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 !text-white
                           px-4 py-2 rounded-md transition duration-200 
                           shadow hover:shadow-md transform hover:-translate-y-0.5"
              >
                Add Date
              </button>
            </div>
          </form>
        </div>

        {/* Weekly Off List */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="flex flex-col gap-4 mb-4 md:flex-row md:justify-between md:items-center">
            <h2 className="text-xl font-semibold text-gray-800">🧾 Weekly Off Schedule</h2>
            
            <div className="flex flex-col gap-4 md:flex-row ">
              <DatePicker
                picker="month"
                format="MMM YYYY"
                className="w-full border-gray-300 rounded-md cursor-pointer md:w-48 focus:ring-blue-500 focus:border-blue-500"
                value={selectedMonth ? dayjs(selectedMonth) : null}
                onChange={handleMonthChange}
                allowClear
                placeholder="Select month"
              />
              
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full px-3 py-2 transition-all border border-gray-300 rounded-md md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {processedWeeklyOffs.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {selectedMonth 
                ? `No weekly offs scheduled for ${dayjs(selectedMonth).format('MMMM YYYY')}`
                : 'No weekly offs scheduled'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Scheduled Off Days</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.map((off, index) => (
                      <tr key={off.employee?._id || index} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                              <span className="font-medium text-blue-600">
                                {off.employee?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{off.employee?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{off.employee?.designation || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {off.dates.map((d) => (
                              <div 
                                key={d.id} 
                                className="flex items-center px-3 py-1 text-sm text-blue-800 rounded-full bg-blue-50"
                              >
                                {d.date.format('DD MMM YYYY (ddd)')}
                                <Popconfirm
                                  title="Are you sure to delete this date?"
                                  onConfirm={() => handleDelete(d.id)}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <span className="ml-2 text-lg font-bold text-red-500 transition-colors cursor-pointer hover:text-red-700">
                                    ×
                                  </span>
                                </Popconfirm>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button 
                            onClick={() => setForm({ 
                              employeeId: off.employee?._id || off.employee,
                              date: null 
                            })}
                            className="!text-blue-600 hover:text-blue-900 mr-4 transition-colors cursor-pointer"
                          >
                            Add More
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-6 space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 border ${currentPage === page 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} transition-colors`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border rounded-md ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                  
                  <span className="ml-4 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WeeklyOffPage;