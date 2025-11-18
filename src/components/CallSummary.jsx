

//======================================


// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiPhoneCall } from 'react-icons/fi';
// import { MdCheckCircleOutline } from 'react-icons/md';
// import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen } from 'react-icons/fa';
// import { DatePicker } from 'antd';
// import dayjs from 'dayjs';
// import 'antd/dist/reset.css';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

// const ALL_CATEGORIES = ['Flight', 'Hotel', 'Rental', 'Package', 'Other'];

// const iconMap = {
//   Hotel: <FaHotel className="text-xl text-pink-600" />,
//   Flight: <FaPlane className="text-xl text-blue-600" />,
//   Rental: <FaCar className="text-xl text-orange-500" />,
//   Package: <FaBoxOpen className="text-xl text-purple-600" />,
//   Other: <FaBoxOpen className="text-xl text-gray-500" />,
// };

// const { RangePicker } = DatePicker;

// const CallSummary = ({ employeeId }) => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
//   const [timeRange, setTimeRange] = useState('monthly');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0
//   });

//   const fetchAllCallLogs = async () => {
//     try {
//       setIsLoading(true);
//       setError('');

//       // First fetch all call logs (you might need to implement pagination handling)
//       const res = await axios.get(`${API_URL}/call-logs`, {
//         params: {
//           page: 1,
//           limit: 1000 // Adjust based on your expected data size
//         }
//       });

//       if (res.data.success && Array.isArray(res.data.data)) {
//         setCallLogs(res.data.data);
//         setPagination(res.data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalItems: res.data.data.length
//         });
//         filterLogs(res.data.data, dateRange[0], dateRange[1]);
//       } else {
//         setError('Invalid data format received');
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message ||
//         `Failed to load data (Status: ${err.response?.status || 'No response'})`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterLogs = (logs, startDate, endDate) => {
//     const filtered = logs.filter(log => {
//       const logDate = dayjs(log.createdAt);
//       return logDate.isAfter(startDate) && logDate.isBefore(endDate);
//     });
//     setFilteredLogs(filtered);
//     calculateSummary(filtered);
//   };

//   const calculateSummary = (logs) => {
//     const totalCalls = logs.length;
//     const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;
//     const totalProfit = logs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0);

//     // Calculate call categories
//     const categoryCounts = {};
//     logs.forEach(log => {
//       const category = log.typeOfCall === 'Sales Inquiry' ? (log.callCategory || 'Other') : 'Other';
//       categoryCounts[category] = (categoryCounts[category] || 0) + 1;
//     });

//     const topCallCategories = ALL_CATEGORIES.map(cat => ({
//       _id: cat,
//       count: categoryCounts[cat] || 0
//     }));

//     // Calculate call directions
//     const callDirectionStats = {};
//     logs.forEach(log => {
//       const direction = log.callDirection || 'Unknown';
//       callDirectionStats[direction] = (callDirectionStats[direction] || 0) + 1;
//     });

//     // Calculate conversion methods
//     const saleConvertedThroughStats = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const method = log.saleConvertedThrough || 'Unknown';
//       saleConvertedThroughStats[method] = (saleConvertedThroughStats[method] || 0) + 1;
//     });

//     // Calculate monthly sales
//     const monthlySales = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const month = dayjs(log.createdAt).format('YYYY-MM');
//       monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(log.profitAmount) || 0);
//     });

//     setSummary({
//       totalCalls,
//       totalSales,
//       totalProfit,
//       topCallCategories,
//       callDirectionStats: Object.entries(callDirectionStats).map(([_id, count]) => ({ _id, count })),
//       saleConvertedThroughStats: Object.entries(saleConvertedThroughStats).map(([_id, count]) => ({ _id, count })),
//       monthlySales: Object.entries(monthlySales).map(([month, total]) => ({ month, total }))
//     });
//   };

//   const handleTimeRangeChange = (value) => {
//     setTimeRange(value);
//     let newDateRange;

//     switch (value) {
//       case 'daily':
//         newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
//         break;
//       case 'weekly':
//         newDateRange = [dayjs().startOf('week'), dayjs().endOf('week')];
//         break;
//       case 'monthly':
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//         break;
//       default:
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//     }

//     setDateRange(newDateRange);
//     filterLogs(callLogs, newDateRange[0], newDateRange[1]);
//   };

//   const handleDateRangeChange = (dates) => {
//     if (dates) {
//       setDateRange(dates);
//       setTimeRange('custom');
//       filterLogs(callLogs, dates[0], dates[1]);
//     }
//   };

//   useEffect(() => {
//     fetchAllCallLogs();
//   }, [employeeId]);

//   if (isLoading) return <div className="py-4 text-center">Loading summary...</div>;
//   if (error) return <div className="py-4 text-center text-red-500">{error}</div>;
//   if (!summary) return <div className="py-4 text-center">No summary data available</div>;

//   return (
//     <div className="p-6 text-gray-800 bg-white shadow-md rounded-2xl">
//       <h2 className="flex items-center gap-2 mb-4 text-2xl font-semibold">
//         <FiPhoneCall className="text-blue-600" />
//         {employeeId ? 'Your Call Summary' : 'Team Call Summary'}
//       </h2>

//       {/* Date Range Selector */}
//       <div className="mb-6">
//         <div className="flex flex-col items-center gap-4 mb-4 sm:flex-row">
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleTimeRangeChange('daily')}
//               className={`px-3 py-1 rounded-md ${timeRange === 'daily' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100'}`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => handleTimeRangeChange('weekly')}
//               className={`px-3 py-1 rounded-md ${timeRange === 'weekly' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100'}`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => handleTimeRangeChange('monthly')}
//               className={`px-3 py-1 rounded-md ${timeRange === 'monthly' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100'}`}
//             >
//               This Month
//             </button>
//           </div>
//           <RangePicker
//             value={dateRange}
//             onChange={handleDateRangeChange}
//             className="w-full sm:w-auto"
//           />
//         </div>
//         <p className="text-sm text-gray-500">
//           Showing data from {dateRange[0].format('MMM D, YYYY')} to {dateRange[1].format('MMM D, YYYY')}
//           {filteredLogs.length > 0 && ` (${filteredLogs.length} calls)`}
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-4 mb-6 text-center sm:grid-cols-3">
//         <StatCard
//           icon={<FiPhoneCall className="text-2xl text-blue-700" />}
//           label="Total Calls"
//           value={summary.totalCalls}
//           bgClass="bg-blue-50"
//           borderClass="border-blue-100"
//         />
//         <StatCard
//           icon={<MdCheckCircleOutline className="text-2xl text-green-700" />}
//           label="Sales Converted"
//           value={summary.totalSales}
//           bgClass="bg-green-50"
//           borderClass="border-green-100"
//         />
//         <StatCard
//           icon={<FaDollarSign className="text-2xl text-amber-600" />}
//           label="Total Sales"
//           value={`$${summary.totalProfit.toLocaleString()}`}
//           bgClass="bg-amber-50"
//           borderClass="border-amber-100"
//         />
//       </div>

//       {/* Monthly Sales Data */}
//       {summary.monthlySales.length > 0 && (
//         <div className="mb-6">
//           <h3 className="flex items-center gap-2 mb-3 text-xl font-semibold">
//             <span className="text-green-600">📈</span>
//             Monthly Sales Breakdown
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-sm font-medium text-left text-gray-700 border-b">Month</th>
//                   <th className="px-4 py-2 text-sm font-medium text-right text-gray-700 border-b">Total Sales</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {summary.monthlySales.map((sale) => (
//                   <tr key={sale.month} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 text-sm text-gray-700 border-b">
//                       {dayjs(sale.month).format('MMM YYYY')}
//                     </td>
//                     <td className="px-4 py-2 text-sm text-right text-gray-700 border-b">
//                       ${sale.total?.toLocaleString() || '0'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* All Categories Display */}
//       <div className="mb-4">
//         <h3 className="flex items-center gap-2 mb-3 text-xl font-semibold">
//           <span className="text-purple-600">📊</span>
//           Top Call Categories
//         </h3>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
//           {summary.topCallCategories.map((cat) => (
//             <CategoryItem key={cat._id} category={cat} />
//           ))}
//         </div>
//       </div>

//       {/* Additional Stats */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <div>
//           <h3 className="mb-3 text-xl font-semibold">Call Directions</h3>
//           <div className="p-4 rounded-lg bg-gray-50">
//             {summary.callDirectionStats.map((stat) => (
//               <div key={stat._id} className="flex justify-between py-2 border-b border-gray-200">
//                 <span className="capitalize">{stat._id || 'Unknown'}</span>
//                 <span className="font-medium">{stat.count}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div>
//           <h3 className="mb-3 text-xl font-semibold">Conversion Methods</h3>
//           <div className="p-4 rounded-lg bg-gray-50">
//             {summary.saleConvertedThroughStats.map((stat) => (
//               <div key={stat._id} className="flex justify-between py-2 border-b border-gray-200">
//                 <span className="capitalize">{stat._id || 'Unknown'}</span>
//                 <span className="font-medium">{stat.count}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Stat Card Component
// const StatCard = ({ icon, label, value, bgClass, borderClass }) => (
//   <div className={`p-4 rounded-xl border ${borderClass} ${bgClass} flex flex-col items-center`}>
//     <div className="mb-1">{icon}</div>
//     <p className="text-lg font-semibold">{label}</p>
//     <p className="text-2xl font-bold">{value}</p>
//   </div>
// );

// // Reusable Category Item Component
// const CategoryItem = ({ category }) => (
//   <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
//     {iconMap[category._id] || <FaBoxOpen className="text-xl text-gray-500" />}
//     <span className="font-medium text-gray-700 capitalize">{category._id}</span>
//     <span className="ml-auto font-bold text-gray-900">
//       {category.count} {category.count === 1 ? 'call' : 'calls'}
//     </span>
//   </div>
// );

// export default CallSummary;
//===========================CORRECT=========

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiPhoneCall, FiCalendar } from 'react-icons/fi';
// import { MdCheckCircleOutline } from 'react-icons/md';
// import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen } from 'react-icons/fa';
// import { DatePicker } from 'antd';
// import dayjs from 'dayjs';
// import 'antd/dist/reset.css';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

// const ALL_CATEGORIES = ['Flight', 'Hotel', 'Rental', 'Package', 'Other'];

// const iconMap = {
//   Hotel: <FaHotel className="text-xl text-pink-600" />,
//   Flight: <FaPlane className="text-xl text-blue-600" />,
//   Rental: <FaCar className="text-xl text-orange-500" />,
//   Package: <FaBoxOpen className="text-xl text-purple-600" />,
//   Other: <FaBoxOpen className="text-xl text-gray-500" />,
// };

// const { RangePicker } = DatePicker;

// const CallSummary = ({ employeeId }) => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
//   const [timeRange, setTimeRange] = useState('monthly');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0
//   });

//   const fetchAllCallLogs = async () => {
//     try {
//       setIsLoading(true);
//       setError('');

//       const res = await axios.get(`${API_URL}/call-logs`, {
//         params: {
//           page: 1,
//           limit: 1000
//         }
//       });

//       if (res.data.success && Array.isArray(res.data.data)) {
//         setCallLogs(res.data.data);
//         setPagination(res.data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalItems: res.data.data.length
//         });
//         filterLogs(res.data.data, dateRange[0], dateRange[1]);
//       } else {
//         setError('Invalid data format received');
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message ||
//         `Failed to load data (Status: ${err.response?.status || 'No response'})`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterLogs = (logs, startDate, endDate) => {
//     const filtered = logs.filter(log => {
//       const logDate = dayjs(log.createdAt);
//       return logDate.isAfter(startDate) && logDate.isBefore(endDate);
//     });
//     setFilteredLogs(filtered);
//     calculateSummary(filtered);
//   };

//   const calculateSummary = (logs) => {
//     const totalCalls = logs.length;
//     const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;
//     const totalProfit = logs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0);

//     const categoryCounts = {};
//     logs.forEach(log => {
//       const category = log.typeOfCall === 'Sales Inquiry' ? (log.callCategory || 'Other') : 'Other';
//       categoryCounts[category] = (categoryCounts[category] || 0) + 1;
//     });

//     const topCallCategories = ALL_CATEGORIES.map(cat => ({
//       _id: cat,
//       count: categoryCounts[cat] || 0
//     }));

//     const callDirectionStats = {};
//     logs.forEach(log => {
//       const direction = log.callDirection || 'Unknown';
//       callDirectionStats[direction] = (callDirectionStats[direction] || 0) + 1;
//     });

//     const saleConvertedThroughStats = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const method = log.saleConvertedThrough || 'Unknown';
//       saleConvertedThroughStats[method] = (saleConvertedThroughStats[method] || 0) + 1;
//     });

//     const monthlySales = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const month = dayjs(log.createdAt).format('YYYY-MM');
//       monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(log.profitAmount) || 0);
//     });

//     setSummary({
//       totalCalls,
//       totalSales,
//       totalProfit,
//       topCallCategories,
//       callDirectionStats: Object.entries(callDirectionStats).map(([_id, count]) => ({ _id, count })),
//       saleConvertedThroughStats: Object.entries(saleConvertedThroughStats).map(([_id, count]) => ({ _id, count })),
//       monthlySales: Object.entries(monthlySales).map(([month, total]) => ({ month, total }))
//     });
//   };

//   const handleTimeRangeChange = (value) => {
//     setTimeRange(value);
//     let newDateRange;

//     switch (value) {
//       case 'daily':
//         newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
//         break;
//       case 'weekly':
//         newDateRange = [dayjs().startOf('week'), dayjs().endOf('week')];
//         break;
//       case 'monthly':
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//         break;
//       default:
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//     }

//     setDateRange(newDateRange);
//     filterLogs(callLogs, newDateRange[0], newDateRange[1]);
//   };

//   const handleDateRangeChange = (dates) => {
//     if (dates) {
//       setDateRange(dates);
//       setTimeRange('custom');
//       filterLogs(callLogs, dates[0], dates[1]);
//     }
//   };

//   useEffect(() => {
//     fetchAllCallLogs();
//   }, [employeeId]);

//   if (isLoading) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="max-w-md p-6 text-center text-red-700 bg-red-100 shadow-lg rounded-xl">
//         {error}
//         <button
//           onClick={fetchAllCallLogs}
//           className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   if (!summary) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="max-w-md p-6 text-center text-gray-700 bg-gray-100 shadow-lg rounded-xl">
//         No summary data available
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50 md:p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header with Date Range Display */}
//         <div className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl">
//           <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
//             <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 md:text-3xl">
//               <FiPhoneCall className="text-blue-600" />
//               {employeeId ? 'Your Call Summary' : 'Team Call Summary'}
//             </h2>

//             {/* Beautiful Date Range Display */}
//             <div className="flex items-center gap-3 px-4 py-3 border border-blue-100 rounded-lg bg-blue-50">
//               <FiCalendar className="text-xl text-blue-600" />
//               <div className="text-center">
//                 <span className="text-sm font-medium text-blue-700">Showing data from</span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-bold text-blue-800">
//                     {dateRange[0].format('MMM D, YYYY')}
//                   </span>
//                   <span className="text-blue-500">to</span>
//                   <span className="text-lg font-bold text-blue-800">
//                     {dateRange[1].format('MMM D, YYYY')}
//                   </span>
//                 </div>
//                 {filteredLogs.length > 0 && (
//                   <span className="mt-1 text-xs text-blue-600">
//                     ({filteredLogs.length} calls)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Date Range Selector */}
//         <div className="p-4 mb-6 bg-white border border-gray-200 shadow-md rounded-xl">
//           <div className="flex flex-col items-center gap-4 sm:flex-row">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => handleTimeRangeChange('daily')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'daily' 
//                     ? 'bg-blue-600 text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>Today</span>
//               </button>
//               <button
//                 onClick={() => handleTimeRangeChange('weekly')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'weekly' 
//                     ? 'bg-blue-600 text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>This Week</span>
//               </button>
//               <button
//                 onClick={() => handleTimeRangeChange('monthly')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'monthly' 
//                     ? 'bg-blue-600 text-white shadow-md' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>This Month</span>
//               </button>
//             </div>
//             <div className="flex-1">
//               <RangePicker
//                 value={dateRange}
//                 onChange={handleDateRangeChange}
//                 className="w-full"
//                 popupClassName="rounded-xl shadow-lg"
//                 suffixIcon={<FiCalendar className="text-gray-400" />}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
//           <StatCard
//             icon={<FiPhoneCall className="text-3xl text-blue-600" />}
//             label="Total Calls"
//             value={summary.totalCalls}
//             bgClass="bg-blue-50"
//             borderClass="border-blue-200"
//             textColor="text-blue-800"
//           />
//           <StatCard
//             icon={<MdCheckCircleOutline className="text-3xl text-green-600" />}
//             label="Sales Converted"
//             value={summary.totalSales}
//             bgClass="bg-green-50"
//             borderClass="border-green-200"
//             textColor="text-green-800"
//           />
//           <StatCard
//             icon={<FaDollarSign className="text-3xl text-amber-600" />}
//             label="Total Sales"
//             value={`$${summary.totalProfit.toLocaleString()}`}
//             bgClass="bg-amber-50"
//             borderClass="border-amber-200"
//             textColor="text-amber-800"
//           />
//         </div>

//         {/* Monthly Sales Data */}
//         {summary.monthlySales.length > 0 && (
//           <div className="p-6 mb-8 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-green-100 rounded-full">
//                 <span className="text-xl text-green-600">📈</span>
//               </span>
//               Monthly Sales Breakdown
//             </h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
//                       Month
//                     </th>
//                     <th className="px-6 py-3 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
//                       Total Sales
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {summary.monthlySales.map((sale) => (
//                     <tr key={sale.month} className="transition-colors hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="p-2 mr-3 bg-blue-100 rounded-lg">
//                             <FiCalendar className="text-blue-600" />
//                           </div>
//                           <span className="font-medium text-gray-800">
//                             {dayjs(sale.month).format('MMMM YYYY')}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-right whitespace-nowrap">
//                         <span className="font-bold text-green-600">
//                           ${sale.total?.toLocaleString() || '0'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Bottom Sections */}
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//           {/* Call Categories */}
//           <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-purple-100 rounded-full">
//                 <span className="text-xl text-purple-600">📊</span>
//               </span>
//               Top Call Categories
//             </h3>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {summary.topCallCategories.map((cat) => (
//                 <CategoryItem key={cat._id} category={cat} />
//               ))}
//             </div>
//           </div>

//           {/* Additional Stats */}
//           <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-blue-100 rounded-full">
//                 <span className="text-xl text-blue-600">ℹ️</span>
//               </span>
//               Additional Statistics
//             </h3>
//             <div className="space-y-4">
//               <div>
//                 <h4 className="mb-2 text-lg font-medium text-gray-700">Call Directions</h4>
//                 <div className="space-y-2">
//                   {summary.callDirectionStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
//                       <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
//                         {stat.count}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="mb-2 text-lg font-medium text-gray-700">Conversion Methods</h4>
//                 <div className="space-y-2">
//                   {summary.saleConvertedThroughStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
//                       <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
//                         {stat.count}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced Stat Card Component
// const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => (
//   <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>
//     <div className="p-3 mb-3 bg-white rounded-full shadow-sm">
//       {icon}
//     </div>
//     <p className={`text-lg font-medium ${textColor}`}>{label}</p>
//     <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
//   </div>
// );

// // Enhanced Category Item Component
// const CategoryItem = ({ category }) => (
//   <div className="flex items-center gap-4 p-4 transition-all border border-gray-200 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm">
//     <div className="p-2 bg-white rounded-lg shadow-sm">
//       {iconMap[category._id] || <FaBoxOpen className="text-xl text-gray-500" />}
//     </div>
//     <div className="flex-1">
//       <h4 className="font-medium text-gray-800 capitalize">{category._id}</h4>
//     </div>
//     <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
//       {category.count} {category.count === 1 ? 'call' : 'calls'}
//     </span>
//   </div>
// );

// export default CallSummary;

//==========================correct======================


// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiPhoneCall, FiCalendar } from 'react-icons/fi';
// import { MdCheckCircleOutline } from 'react-icons/md';
// import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen } from 'react-icons/fa';
// import { DatePicker } from 'antd';
// import dayjs from 'dayjs';
// import 'antd/dist/reset.css';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

// const ALL_CATEGORIES = ['Flight', 'Hotel', 'Rental', 'Package', 'Other'];

// const iconMap = {
//   Hotel: <FaHotel className="text-xl text-pink-600" />,
//   Flight: <FaPlane className="text-xl text-blue-600" />,
//   Rental: <FaCar className="text-xl text-orange-500" />,
//   Package: <FaBoxOpen className="text-xl text-purple-600" />,
//   Other: <FaBoxOpen className="text-xl text-gray-500" />,
// };

// const { RangePicker } = DatePicker;

// const CallSummary = ({ employeeId }) => {
//   const [callLogs, setCallLogs] = useState([]);
//   const [filteredLogs, setFilteredLogs] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
//   const [timeRange, setTimeRange] = useState('monthly');
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalItems: 0
//   });

//   const fetchAllCallLogs = async () => {
//     try {
//       setIsLoading(true);
//       setError('');

//       const res = await axios.get(`${API_URL}/call-logs`, {
//         params: {
//           page: 1,
//           limit: 1000
//         }
//       });

//       if (res.data.success && Array.isArray(res.data.data)) {
//         setCallLogs(res.data.data);
//         setPagination(res.data.pagination || {
//           currentPage: 1,
//           totalPages: 1,
//           totalItems: res.data.data.length
//         });
//         filterLogs(res.data.data, dateRange[0], dateRange[1]);
//       } else {
//         setError('Invalid data format received');
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message ||
//         `Failed to load data (Status: ${err.response?.status || 'No response'})`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterLogs = (logs, startDate, endDate) => {
//     const filtered = logs.filter(log => {
//       const logDate = dayjs(log.createdAt);
//       return logDate.isAfter(startDate) && logDate.isBefore(endDate);
//     });
//     setFilteredLogs(filtered);
//     calculateSummary(filtered);
//   };

//   const calculateSummary = (logs) => {
//     const totalCalls = logs.length;
//     const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;
//     const totalProfit = logs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0);

//     const categoryCounts = {};
//     logs.forEach(log => {
//       const category = log.typeOfCall === 'Sales Inquiry' ? (log.callCategory || 'Other') : 'Other';
//       categoryCounts[category] = (categoryCounts[category] || 0) + 1;
//     });

//     const topCallCategories = ALL_CATEGORIES.map(cat => ({
//       _id: cat,
//       count: categoryCounts[cat] || 0
//     }));

//     const callDirectionStats = {};
//     logs.forEach(log => {
//       const direction = log.callDirection || 'Unknown';
//       callDirectionStats[direction] = (callDirectionStats[direction] || 0) + 1;
//     });

//     const saleConvertedThroughStats = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const method = log.saleConvertedThrough || 'Unknown';
//       saleConvertedThroughStats[method] = (saleConvertedThroughStats[method] || 0) + 1;
//     });

//     const monthlySales = {};
//     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
//       const month = dayjs(log.createdAt).format('YYYY-MM');
//       monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(log.profitAmount) || 0);
//     });

//     setSummary({
//       totalCalls,
//       totalSales,
//       totalProfit,
//       topCallCategories,
//       callDirectionStats: Object.entries(callDirectionStats).map(([_id, count]) => ({ _id, count })),
//       saleConvertedThroughStats: Object.entries(saleConvertedThroughStats).map(([_id, count]) => ({ _id, count })),
//       monthlySales: Object.entries(monthlySales).map(([month, total]) => ({ month, total }))
//     });
//   };

//   const handleTimeRangeChange = (value) => {
//     setTimeRange(value);
//     let newDateRange;

//     switch (value) {
//       case 'daily':
//         newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
//         break;
//       case 'weekly':
//         newDateRange = [dayjs().startOf('week'), dayjs().endOf('week')];
//         break;
//       case 'monthly':
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//         break;
//       default:
//         newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
//     }

//     setDateRange(newDateRange);
//     filterLogs(callLogs, newDateRange[0], newDateRange[1]);
//   };

//   const handleDateRangeChange = (dates) => {
//     if (dates) {
//       setDateRange(dates);
//       setTimeRange('custom');
//       filterLogs(callLogs, dates[0], dates[1]);
//     }
//   };

//   useEffect(() => {
//     fetchAllCallLogs();
//   }, [employeeId]);

//   if (isLoading) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="max-w-md p-6 text-center text-red-700 bg-red-100 shadow-lg rounded-xl">
//         {error}
//         <button
//           onClick={fetchAllCallLogs}
//           className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );

//   if (!summary) return (
//     <div className="flex items-center justify-center h-screen">
//       <div className="max-w-md p-6 text-center text-gray-700 bg-gray-100 shadow-lg rounded-xl">
//         No summary data available
//       </div>
//     </div>
//   );

//   return (
//     // <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50 md:p-8">
//           <div className="w-full p-6 mx-auto border border-indigo-100 shadow-lg bg-gradient-to-br from-white to-indigo-50 rounded-2xl max-w-8xl">

//       <div className="mx-auto max-w-7xl">
//         {/* Header with Date Range Display */}
//         <div className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl">
//           <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
//             <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 md:text-3xl">
//               <FiPhoneCall className="text-blue-600" />
//               {employeeId ? 'Your Call Summary' : 'Team Call Summary'}
//             </h2>

//             {/* Beautiful Date Range Display */}
//             <div className="flex items-center gap-3 px-4 py-3 border border-blue-100 rounded-lg bg-blue-50">
//               <FiCalendar className="text-xl text-blue-600" />
//               <div className="text-center">
//                 <span className="text-sm font-medium text-blue-700">Showing data from</span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-bold text-blue-800">
//                     {dateRange[0].format('MMM D, YYYY')}
//                   </span>
//                   <span className="text-blue-500">to</span>
//                   <span className="text-lg font-bold text-blue-800">
//                     {dateRange[1].format('MMM D, YYYY')}
//                   </span>
//                 </div>
//                 {filteredLogs.length > 0 && (
//                   <span className="mt-1 text-xs text-blue-600">
//                     ({filteredLogs.length} calls)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Date Range Selector */}
//         <div className="p-4 mb-6 bg-white border border-gray-200 shadow-md rounded-xl">
//           <div className="flex flex-col items-center gap-4 sm:flex-row">
//             <div className="flex flex-wrap gap-2">
//               {/* <button
//                 onClick={() => handleTimeRangeChange('daily')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'daily' 
//                     ? 'bg-blue-600 !text-white shadow-md' 
//                     : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>Today</span>
//               </button>
//               <button
//                 onClick={() => handleTimeRangeChange('weekly')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'weekly' 
//                     ? 'bg-blue-600 !text-white shadow-md' 
//                     : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>This Week</span>
//               </button> */}
//               <button
//                 onClick={() => handleTimeRangeChange('monthly')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                   timeRange === 'monthly' 
//                     ? 'bg-blue-600 !text-white shadow-md' 
//                     : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span>This Month</span>
//               </button>
//             </div>
//             <div className="flex-1">
//               <RangePicker
//                 value={dateRange}
//                 onChange={handleDateRangeChange}
//                 className="w-full"
//                 popupClassName="rounded-xl shadow-lg"
//                 suffixIcon={<FiCalendar className="text-gray-400" />}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
//           <StatCard
//             icon={<FiPhoneCall className="text-3xl text-blue-600" />}
//             label="Total Calls"
//             value={summary.totalCalls}
//             bgClass="bg-blue-50"
//             borderClass="border-blue-200"
//             textColor="text-blue-800"
//           />

//           <StatCard
//             icon={<MdCheckCircleOutline className="text-3xl text-green-600" />}
//             label="Sales Converted"
//             value={summary.totalSales}
//             bgClass="bg-green-50"
//             borderClass="border-green-200"
//             textColor="text-green-800"
//           />
//           <StatCard
//             icon={<FaDollarSign className="text-3xl text-amber-600" />}
//             label="Total Sales"
//             value={`$${summary.totalProfit.toLocaleString()}`}
//             bgClass="bg-amber-50"
//             borderClass="border-amber-200"
//             textColor="text-amber-800"
//           />

//         </div>

//         {/* Monthly Sales Data */}
//         {summary.monthlySales.length > 0 && (
//           <div className="p-6 mb-8 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-green-100 rounded-full">
//                 <span className="text-xl text-green-600">📈</span>
//               </span>
//               Monthly Sales Breakdown
//             </h3>
//             {/* <div className="overflow-x-auto">
//               <table className="min-w-full">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
//                       Month
//                     </th>
//                     <th className="px-6 py-3 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
//                       Total Sales
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {summary.monthlySales.map((sale) => (
//                     <tr key={sale.month} className="transition-colors hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="p-2 mr-3 bg-blue-100 rounded-lg">
//                             <FiCalendar className="text-blue-600" />
//                           </div>
//                           <span className="font-medium text-gray-800">
//                             {dayjs(sale.month).format('MMMM YYYY')}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-right whitespace-nowrap">
//                         <span className="font-bold text-green-600">
//                           ${sale.total?.toLocaleString() || '0'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div> */}


// <div className="overflow-x-auto">
//   <table className="min-w-full">
//     <thead>
//       <tr className="bg-gray-50">
//         <th className="px-4 py-2 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
//           Month
//         </th>
//         <th className="px-4 py-2 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
//           Total Sales
//         </th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-gray-200">
//       {summary.monthlySales.map((sale) => (
//         <tr key={sale.month} className="transition-colors hover:bg-gray-50">
//           <td className="px-4 py-2 whitespace-nowrap">
//             <div className="flex items-center">
//               <div className="p-1 mr-2 bg-blue-100 rounded-lg">
//                 <FiCalendar className="text-sm text-blue-600" />
//               </div>
//               <span className="font-medium text-gray-800 text-lm">
//                 {dayjs(sale.month).format('MMMM YYYY')}
//               </span>
//             </div>
//           </td>
//           <td className="px-4 py-2 text-right whitespace-nowrap">
//             <span className="font-bold text-green-600 text-lm">
//               ${sale.total?.toLocaleString() || '0'}
//             </span>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>


//           </div>
//         )}

//         {/* Bottom Sections */}
//         {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

//           <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-purple-100 rounded-full">
//                 <span className="text-xl text-purple-600">📊</span>
//               </span>
//               Top Call Categories
//             </h3>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {summary.topCallCategories.map((cat) => (
//                 <CategoryItem key={cat._id} category={cat} />
//               ))}
//             </div>
//           </div>


//           <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
//               <span className="p-2 bg-blue-100 rounded-full">
//                 <span className="text-xl text-blue-600">ℹ️</span>
//               </span>
//               Additional Statistics
//             </h3>

//           <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>

//               <div>
//                 <h4 className="mb-2 text-lg font-medium text-gray-700">Call Directions</h4>
//                 <div className="space-y-2">
//                   {summary.callDirectionStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
//                       <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
//                         {stat.count}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="mb-2 text-lg font-medium text-gray-700">Conversion Methods</h4>
//                 <div className="space-y-2">
//                   {summary.saleConvertedThroughStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
//                       <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
//                         {stat.count}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div> */}


// <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//   {/* Call Categories */}
//   <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
//     <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
//       <span className="p-1 bg-purple-100 rounded-full">
//         <span className="text-lg text-purple-600">📊</span>
//       </span>
//       Top Call Categories
//     </h3>
//     <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//       {summary.topCallCategories.map((cat) => (
//         <CategoryItem key={cat._id} category={cat} />
//       ))}
//     </div>
//   </div>

//   {/* Additional Stats */}
//   <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
//     <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
//       <span className="p-1 bg-blue-100 rounded-full">
//         <span className="text-lg text-blue-600">ℹ️</span>
//       </span>
//       Additional Statistics
//     </h3>
//     <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//       <div>
//         <h4 className="mb-1 text-base font-medium text-gray-700">Call Directions</h4>
//         <div className="space-y-1">
//           {summary.callDirectionStats.map((stat) => (
//             <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
//               <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//               <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
//                 {stat.count}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div>
//         <h4 className="mb-1 text-base font-medium text-gray-700">Conversion Methods</h4>
//         <div className="space-y-1">
//           {summary.saleConvertedThroughStats.map((stat) => (
//             <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
//               <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//               <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
//                 {stat.count}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//       </div>
//     </div>
//   );
// };

// // Enhanced Stat Card Component
// // const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => (
// //   <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>
// //     <div className="p-3 mb-3 bg-white rounded-full shadow-sm">
// //       {icon}
// //     </div>
// //     <p className={`text-lg font-medium ${textColor}`}>{label}</p>
// //     <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
// //   </div>
// // );


// const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => {
//   return (
//     // <div className={`flex items-center p-3 rounded-xl border ${borderClass} ${bgClass}`}>
//       <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>

//       <div className="mr-3">{icon}</div>
//       <div className="flex flex-col">
//         <span className={`text-xl font-medium ${textColor}`}>{label}</span>
//         <span className={`text-xl font-semibold ${textColor}`}>{value}</span>
//       </div>
//     </div>
//   );
// };


// // Enhanced Category Item Component
// const CategoryItem = ({ category }) => (
//   <div className="flex items-center gap-4 p-4 transition-all border border-gray-200 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm">
//     <div className="p-2 bg-white rounded-lg shadow-sm">
//       {iconMap[category._id] || <FaBoxOpen className="text-xl text-gray-500" />}
//     </div>
//     <div className="flex-1">
//       <h4 className="font-medium text-gray-800 capitalize">{category._id}</h4>
//     </div>
//     <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
//       {category.count} {category.count === 1 ? 'call' : 'calls'}
//     </span>
//   </div>
// );

// export default CallSummary;

//========================net profit===========

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPhoneCall, FiCalendar } from 'react-icons/fi';
import { MdCheckCircleOutline } from 'react-icons/md';
import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen } from 'react-icons/fa';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';

const ALL_CATEGORIES = ['Flight', 'Hotel', 'Rental', 'Package', 'Other'];

const iconMap = {
  Hotel: <FaHotel className="text-xl text-pink-600" />,
  Flight: <FaPlane className="text-xl text-blue-600" />,
  Rental: <FaCar className="text-xl text-orange-500" />,
  Package: <FaBoxOpen className="text-xl text-purple-600" />,
  Other: <FaBoxOpen className="text-xl text-gray-500" />,
};

const { RangePicker } = DatePicker;

const CallSummary = ({ employeeId }) => {
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [timeRange, setTimeRange] = useState('monthly');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // const fetchAllCallLogs = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError('');

  //     const res = await axios.get(`${API_URL}/call-logs`, {
  //       params: {
  //         page: 1,
  //         limit: 1000
  //       }
  //     });

  //     if (res.data.success && Array.isArray(res.data.data)) {
  //       setCallLogs(res.data.data);
  //       setPagination(res.data.pagination || {
  //         currentPage: 1,
  //         totalPages: 1,
  //         totalItems: res.data.data.length
  //       });
  //       filterLogs(res.data.data, dateRange[0], dateRange[1]);
  //     } else {
  //       setError('Invalid data format received');
  //     }
  //   } catch (err) {
  //     console.error('API Error:', err);
  //     setError(err.response?.data?.message ||
  //       `Failed to load data (Status: ${err.response?.status || 'No response'})`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const fetchAllCallLogs = async () => {
    try {
      setIsLoading(true);
      setError('');
      let allLogs = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const res = await axios.get(`${API_URL}/call-logs`, {
          params: { page, limit: 100 }
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          allLogs = [...allLogs, ...res.data.data];
          const totalPages = res.data.pagination?.totalPages || 1;
          hasMore = page < totalPages;
          page++;
        } else {
          hasMore = false;
        }
      }

      setCallLogs(allLogs);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(allLogs.length / 100),
        totalItems: allLogs.length
      });
      filterLogs(allLogs, dateRange[0], dateRange[1]);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };
  const filterLogs = (logs, startDate, endDate) => {
    const filtered = logs.filter(log => {
      const logDate = dayjs(log.createdAt);
      return logDate.isAfter(startDate) && logDate.isBefore(endDate);
    });
    setFilteredLogs(filtered);
    calculateSummary(filtered);
  };

  //   const calculateSummary = (logs) => {
  //     const totalCalls = logs.length;
  //     const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;
  //     // const totalProfit = logs.reduce((sum, log) => sum + (parseFloat(log.profitAmount) || 0), 0);
  //     const totalProfit = logs.reduce((sum, log) => sum + (parseFloat(log.netProfit) || 0), 0);
  //     const totalChargebacks = logs.reduce((sum, log) => sum + (parseFloat(log.chargebackRefund) || 0), 0);

  //     const categoryCounts = {};
  //     logs.forEach(log => {
  //       const category = log.typeOfCall === 'Sales Inquiry' ? (log.callCategory || 'Other') : 'Other';
  //       categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  //     });

  //     const topCallCategories = ALL_CATEGORIES.map(cat => ({
  //       _id: cat,
  //       count: categoryCounts[cat] || 0
  //     }));

  //     const callDirectionStats = {};
  //     logs.forEach(log => {
  //       const direction = log.callDirection || 'Unknown';
  //       callDirectionStats[direction] = (callDirectionStats[direction] || 0) + 1;
  //     });

  //     const saleConvertedThroughStats = {};
  //     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
  //       const method = log.saleConvertedThrough || 'Unknown';
  //       saleConvertedThroughStats[method] = (saleConvertedThroughStats[method] || 0) + 1;
  //     });

  //     // const monthlySales = {};
  //     // logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
  //     //   const month = dayjs(log.createdAt).format('YYYY-MM');
  //     //   monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(log.profitAmount) || 0);
  //     // });
  // const monthlySales = {};
  //     logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
  //       const month = dayjs(log.createdAt).tz('Asia/Kolkata').format('YYYY-MM');
  //       monthlySales[month] = (monthlySales[month] || 0) + (parseFloat(log.netProfit) || 0);
  //     });


  //     setSummary({
  //       totalCalls,
  //       totalSales,
  //       totalProfit,
  //       topCallCategories,
  //       callDirectionStats: Object.entries(callDirectionStats).map(([_id, count]) => ({ _id, count })),
  //       saleConvertedThroughStats: Object.entries(saleConvertedThroughStats).map(([_id, count]) => ({ _id, count })),
  //       monthlySales: Object.entries(monthlySales).map(([month, total]) => ({ month, total }))
  //     });
  //   };


  const calculateSummary = (logs) => {
    const totalCalls = logs.length;
    const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;

    // Calculate total profit as net profit (profitAmount - chargebackAmount - refundAmount)
    const totalProfit = logs.reduce((sum, log) => {
      if (log.wasSaleConverted === 'Yes') {
        const profitAmount = parseFloat(log.profitAmount) || 0;
        const chargeback = parseFloat(log.chargebackAmount) || 0;
        const refund = parseFloat(log.refundAmount) || 0;
        const netProfit = profitAmount - (chargeback + refund);
        console.log(`Log ID: ${log._id}, Profit: ${profitAmount}, Chargeback: ${chargeback}, Refund: ${refund}, Net Profit: ${netProfit}`);
        return sum + netProfit;
      }
      return sum;
    }, 0);


    const totalChargebacks = logs.reduce((sum, log) => {
      const chargeback = parseFloat(log.chargebackAmount) || 0;
      const refund = parseFloat(log.refundAmount) || 0;
      return sum + (chargeback + refund);
    }, 0);

    const categoryCounts = {};
    logs.forEach(log => {
      const category = log.typeOfCall === 'Sales Inquiry' ? (log.callCategory || 'Other') : 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const topCallCategories = ALL_CATEGORIES.map(cat => ({
      _id: cat,
      count: categoryCounts[cat] || 0
    }));

    const callDirectionStats = {};
    logs.forEach(log => {
      const direction = log.callDirection || 'Unknown';
      callDirectionStats[direction] = (callDirectionStats[direction] || 0) + 1;
    });

    const saleConvertedThroughStats = {};
    logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
      const method = log.saleConvertedThrough || 'Unknown';
      saleConvertedThroughStats[method] = (saleConvertedThroughStats[method] || 0) + 1;
    });

    const monthlySales = {};
    logs.filter(log => log.wasSaleConverted === 'Yes').forEach(log => {
      const month = dayjs(log.createdAt).tz('Asia/Kolkata').format('YYYY-MM');
      const profitAmount = parseFloat(log.profitAmount) || 0;
      const chargeback = parseFloat(log.chargebackAmount) || 0;
      const refund = parseFloat(log.refundAmount) || 0;
      const netProfit = profitAmount - (chargeback + refund);
      monthlySales[month] = (monthlySales[month] || 0) + netProfit;
    });

    setSummary({
      totalCalls,
      totalSales,
      totalProfit,
      totalChargebacks,
      topCallCategories,
      callDirectionStats: Object.entries(callDirectionStats).map(([_id, count]) => ({ _id, count })),
      saleConvertedThroughStats: Object.entries(saleConvertedThroughStats).map(([_id, count]) => ({ _id, count })),
      monthlySales: Object.entries(monthlySales).map(([month, total]) => ({ month, total }))
    });
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    let newDateRange;

    switch (value) {
      case 'daily':
        newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
        break;
      case 'weekly':
        newDateRange = [dayjs().startOf('week'), dayjs().endOf('week')];
        break;
      case 'monthly':
        newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
        break;
      default:
        newDateRange = [dayjs().startOf('month'), dayjs().endOf('month')];
    }

    setDateRange(newDateRange);
    filterLogs(callLogs, newDateRange[0], newDateRange[1]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setTimeRange('custom');
      filterLogs(callLogs, dates[0], dates[1]);
    }
  };

  useEffect(() => {
    fetchAllCallLogs();
  }, [employeeId]);

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-6 text-center text-red-700 bg-red-100 shadow-lg rounded-xl">
        {error}
        <button
          onClick={fetchAllCallLogs}
          className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!summary) return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-6 text-center text-gray-700 bg-gray-100 shadow-lg rounded-xl">
        No summary data available
      </div>
    </div>
  );

  return (
    // <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-blue-50 md:p-8">
    <div className="w-full p-6 mx-auto border border-indigo-100 shadow-lg bg-gradient-to-br from-white to-indigo-50 rounded-2xl max-w-8xl">

      <div className="max-w-full mx-auto">
        {/* Header with Date Range Display */}
        <div className="p-6 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800 md:text-3xl">
              <FiPhoneCall className="text-blue-600" />
              {employeeId ? 'Your Call Summary' : 'Team Call Summary'}
            </h2>

            {/* Beautiful Date Range Display */}
            <div className="flex items-center gap-3 px-4 py-3 border border-blue-100 rounded-lg bg-blue-50">
              <FiCalendar className="text-xl text-blue-600" />
              <div className="text-center">
                <span className="text-sm font-medium text-blue-700">Showing data from</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-800">
                    {dateRange[0].format('MMM D, YYYY')}
                  </span>
                  <span className="text-blue-500">to</span>
                  <span className="text-lg font-bold text-blue-800">
                    {dateRange[1].format('MMM D, YYYY')}
                  </span>
                </div>
                {filteredLogs.length > 0 && (
                  <span className="mt-1 text-xs text-blue-600">
                    ({filteredLogs.length} calls)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="p-4 mb-6 bg-white border border-gray-200 shadow-md rounded-xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex flex-wrap gap-2">
              {/* <button
                onClick={() => handleTimeRangeChange('daily')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  timeRange === 'daily' 
                    ? 'bg-blue-600 !text-white shadow-md' 
                    : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>Today</span>
              </button>
              <button
                onClick={() => handleTimeRangeChange('weekly')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  timeRange === 'weekly' 
                    ? 'bg-blue-600 !text-white shadow-md' 
                    : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>This Week</span>
              </button> */}
              <button
                onClick={() => handleTimeRangeChange('monthly')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${timeRange === 'monthly'
                    ? 'bg-blue-600 !text-white shadow-md'
                    : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <span>This Month</span>
              </button>
            </div>
            <div className="flex-1">
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-full"
                popupClassName="rounded-xl shadow-lg"
                suffixIcon={<FiCalendar className="text-gray-400" />}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <StatCard
            icon={<FiPhoneCall className="text-3xl text-blue-600" />}
            label="Total Calls"
            value={summary.totalCalls}
            bgClass="bg-blue-50"
            borderClass="border-blue-200"
            textColor="text-blue-800"
          />

          <StatCard
            icon={<MdCheckCircleOutline className="text-3xl text-green-600" />}
            label="Sales Converted"
            value={summary.totalSales}
            bgClass="bg-green-50"
            borderClass="border-green-200"
            textColor="text-green-800"
          />
          <StatCard
            icon={<FaDollarSign className="text-3xl text-amber-600" />}
            label="Total Sales"
            value={`$${summary.totalProfit.toLocaleString()}`}
            bgClass="bg-amber-50"
            borderClass="border-amber-200"
            textColor="text-amber-800"
          />


        </div>

        {/* Monthly Sales Data */}
        {summary.monthlySales.length > 0 && (
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-md rounded-xl">
            <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
              <span className="p-2 bg-green-100 rounded-full">
                <span className="text-xl text-green-600">📈</span>
              </span>
              Monthly Sales Breakdown
            </h3>
            {/* <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
                      Month
                    </th>
                    <th className="px-6 py-3 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
                      Total Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.monthlySales.map((sale) => (
                    <tr key={sale.month} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                            <FiCalendar className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">
                            {dayjs(sale.month).format('MMMM YYYY')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className="font-bold text-green-600">
                          ${sale.total?.toLocaleString() || '0'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}


            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
                      Month
                    </th>
                    <th className="px-4 py-2 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
                      Total Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.monthlySales.map((sale) => (
                    <tr key={sale.month} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-1 mr-2 bg-blue-100 rounded-lg">
                            <FiCalendar className="text-sm text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800 text-lm">
                            {dayjs(sale.month).format('MMMM YYYY')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">
                        <span className="font-bold text-green-600 text-lm">
                          ${sale.total?.toLocaleString() || '0'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>
        )}

        {/* Bottom Sections */}
        {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
            <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
              <span className="p-2 bg-purple-100 rounded-full">
                <span className="text-xl text-purple-600">📊</span>
              </span>
              Top Call Categories
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {summary.topCallCategories.map((cat) => (
                <CategoryItem key={cat._id} category={cat} />
              ))}
            </div>
          </div>

       
          <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
            <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
              <span className="p-2 bg-blue-100 rounded-full">
                <span className="text-xl text-blue-600">ℹ️</span>
              </span>
              Additional Statistics
            </h3>
         
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>

              <div>
                <h4 className="mb-2 text-lg font-medium text-gray-700">Call Directions</h4>
                <div className="space-y-2">
                  {summary.callDirectionStats.map((stat) => (
                    <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                      <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-lg font-medium text-gray-700">Conversion Methods</h4>
                <div className="space-y-2">
                  {summary.saleConvertedThroughStats.map((stat) => (
                    <div key={stat._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                      <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div> */}


        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Call Categories */}
          <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
              <span className="p-1 bg-purple-100 rounded-full">
                <span className="text-lg text-purple-600">📊</span>
              </span>
              Top Call Categories
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {summary.topCallCategories.map((cat) => (
                <CategoryItem key={cat._id} category={cat} />
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
              <span className="p-1 bg-blue-100 rounded-full">
                <span className="text-lg text-blue-600">ℹ️</span>
              </span>
              Additional Statistics
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 text-base font-medium text-gray-700">Call Directions</h4>
                <div className="space-y-1">
                  {summary.callDirectionStats.map((stat) => (
                    <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-1 text-base font-medium text-gray-700">Conversion Methods</h4>
                <div className="space-y-1">
                  {summary.saleConvertedThroughStats.map((stat) => (
                    <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Enhanced Stat Card Component
// const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => (
//   <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>
//     <div className="p-3 mb-3 bg-white rounded-full shadow-sm">
//       {icon}
//     </div>
//     <p className={`text-lg font-medium ${textColor}`}>{label}</p>
//     <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
//   </div>
// );


const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => {
  return (
    // <div className={`flex items-center p-3 rounded-xl border ${borderClass} ${bgClass}`}>
    <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>

      <div className="mr-3">{icon}</div>
      <div className="flex flex-col">
        <span className={`text-xl font-medium ${textColor}`}>{label}</span>
        <span className={`text-xl font-semibold ${textColor}`}>{value}</span>
      </div>
    </div>
  );
};


// Enhanced Category Item Component
const CategoryItem = ({ category }) => (
  <div className="flex items-center gap-4 p-4 transition-all border border-gray-200 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm">
    <div className="p-2 bg-white rounded-lg shadow-sm">
      {iconMap[category._id] || <FaBoxOpen className="text-xl text-gray-500" />}
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800 capitalize">{category._id}</h4>
    </div>
    <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
      {category.count} {category.count === 1 ? 'call' : 'calls'}
    </span>
  </div>
);

export default CallSummary;
