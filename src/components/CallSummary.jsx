// //========================net profit===========

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiPhoneCall, FiCalendar } from 'react-icons/fi';
// import { MdCheckCircleOutline } from 'react-icons/md';
// import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen } from 'react-icons/fa';
// import { DatePicker } from 'antd';
// import dayjs from 'dayjs';
// import 'antd/dist/reset.css';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';

// const ALL_CATEGORIES = ['Flight', 'Hotel', 'Car Rental', 'Packages', 'Other'];


// const iconMap = {
//   Flight: <FaPlane className="text-xl text-blue-600" />,
//   Hotel: <FaHotel className="text-xl text-pink-600" />,
//   Car_Rental: <FaCar className="text-xl text-orange-500" />,
//   Packages: <FaBoxOpen className="text-xl text-purple-600" />,
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
//       let allLogs = [];
//       let page = 1;
//       let hasMore = true;

//       while (hasMore) {
//         const res = await axios.get(`${API_URL}/call-logs`, {
//           params: { page, limit: 100 }
//         });

//         if (res.data.success && Array.isArray(res.data.data)) {
//           allLogs = [...allLogs, ...res.data.data];
//           const totalPages = res.data.pagination?.totalPages || 1;
//           hasMore = page < totalPages;
//           page++;
//         } else {
//           hasMore = false;
//         }
//       }

//       setCallLogs(allLogs);
//       setPagination({
//         currentPage: 1,
//         totalPages: Math.ceil(allLogs.length / 100),
//         totalItems: allLogs.length
//       });
//       filterLogs(allLogs, dateRange[0], dateRange[1]);
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.response?.data?.message || 'Failed to load data');
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

//     // Calculate total profit as net profit (profitAmount - chargebackAmount - refundAmount)
//     const totalProfit = logs.reduce((sum, log) => {
//       if (log.wasSaleConverted === 'Yes') {
//         const profitAmount = parseFloat(log.profitAmount) || 0;
//         const chargeback = parseFloat(log.chargebackAmount) || 0;
//         const refund = parseFloat(log.refundAmount) || 0;
//         const netProfit = profitAmount - (chargeback + refund);
//         console.log(`Log ID: ${log._id}, Profit: ${profitAmount}, Chargeback: ${chargeback}, Refund: ${refund}, Net Profit: ${netProfit}`);
//         return sum + netProfit;
//       }
//       return sum;
//     }, 0);


//     const totalChargebacks = logs.reduce((sum, log) => {
//       const chargeback = parseFloat(log.chargebackAmount) || 0;
//       const refund = parseFloat(log.refundAmount) || 0;
//       return sum + (chargeback + refund);
//     }, 0);

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
//       const month = dayjs(log.createdAt).tz('Asia/Kolkata').format('YYYY-MM');
//       const profitAmount = parseFloat(log.profitAmount) || 0;
//       const chargeback = parseFloat(log.chargebackAmount) || 0;
//       const refund = parseFloat(log.refundAmount) || 0;
//       const netProfit = profitAmount - (chargeback + refund);
//       monthlySales[month] = (monthlySales[month] || 0) + netProfit;
//     });

//     setSummary({
//       totalCalls,
//       totalSales,
//       totalProfit,
//       totalChargebacks,
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
//     <div className="w-full p-6 mx-auto border border-indigo-100 shadow-lg bg-gradient-to-br from-white to-indigo-50 rounded-2xl max-w-8xl">

//       <div className="max-w-full mx-auto">
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
//                 onClick={() => handleTimeRangeChange('monthly')}
//                 className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${timeRange === 'monthly'
//                   ? 'bg-blue-600 !text-white shadow-md'
//                   : 'bg-gray-100 !text-gray-700 hover:bg-gray-200'
//                   }`}
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
//                     <th className="px-4 py-2 text-sm font-medium tracking-wider text-left text-gray-700 uppercase rounded-tl-lg">
//                       Month
//                     </th>
//                     <th className="px-4 py-2 text-sm font-medium tracking-wider text-right text-gray-700 uppercase rounded-tr-lg">
//                       Total Sales
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {summary.monthlySales.map((sale) => (
//                     <tr key={sale.month} className="transition-colors hover:bg-gray-50">
//                       <td className="px-4 py-2 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="p-1 mr-2 bg-blue-100 rounded-lg">
//                             <FiCalendar className="text-sm text-blue-600" />
//                           </div>
//                           <span className="font-medium text-gray-800 text-lm">
//                             {dayjs(sale.month).format('MMMM YYYY')}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-2 text-right whitespace-nowrap">
//                         <span className="font-bold text-green-600 text-lm">
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

//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//           {/* Call Categories */}
//           <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
//               <span className="p-1 bg-purple-100 rounded-full">
//                 <span className="text-lg text-purple-600">📊</span>
//               </span>
//               Top Call Categories
//             </h3>
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//               {summary.topCallCategories.map((cat) => (
//                 <CategoryItem key={cat._id} category={cat} />
//               ))}
//             </div>
//           </div>

//           {/* Additional Stats */}
//           <div className="p-4 bg-white border border-gray-200 shadow-md rounded-xl">
//             <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-gray-800">
//               <span className="p-1 bg-blue-100 rounded-full">
//                 <span className="text-lg text-blue-600">ℹ️</span>
//               </span>
//               Additional Statistics
//             </h3>
//             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
//               <div>
//                 <h4 className="mb-1 text-base font-medium text-gray-700">Call Directions</h4>
//                 <div className="space-y-1">
//                   {summary.callDirectionStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
//                       <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
//                         {stat.count}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <h4 className="mb-1 text-base font-medium text-gray-700">Conversion Methods</h4>
//                 <div className="space-y-1">
//                   {summary.saleConvertedThroughStats.map((stat) => (
//                     <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
//                       <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
//                       <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
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

// const StatCard = ({ icon, label, value, bgClass, borderClass, textColor }) => {
//   return (
//     // <div className={`flex items-center p-3 rounded-xl border ${borderClass} ${bgClass}`}>
//     <div className={`p-6 rounded-xl border-2 ${borderClass} ${bgClass} flex flex-col items-center transition-all hover:shadow-md hover:-translate-y-1`}>

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



//==================
//========================net profit===========
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPhoneCall, FiCalendar, FiTrendingUp, FiPieChart } from 'react-icons/fi';
import { MdCheckCircleOutline, MdBarChart } from 'react-icons/md';
import { FaDollarSign, FaHotel, FaPlane, FaCar, FaBoxOpen, FaChartLine } from 'react-icons/fa';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';

const ALL_CATEGORIES = ['Flight', 'Hotel', 'Car Rental', 'Packages', 'Other'];

const iconMap = {
  Flight: <FaPlane className="text-lg text-blue-500" />,
  Hotel: <FaHotel className="text-lg text-pink-500" />,
  'Car Rental': <FaCar className="text-lg text-orange-400" />,
  Packages: <FaBoxOpen className="text-lg text-purple-500" />,
  Other: <FaBoxOpen className="text-lg text-gray-400" />,
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

  const calculateSummary = (logs) => {
    const totalCalls = logs.length;
    const totalSales = logs.filter(log => log.wasSaleConverted === 'Yes').length;

    const totalProfit = logs.reduce((sum, log) => {
      if (log.wasSaleConverted === 'Yes') {
        const profitAmount = parseFloat(log.profitAmount) || 0;
        const chargeback = parseFloat(log.chargebackAmount) || 0;
        const refund = parseFloat(log.refundAmount) || 0;
        const netProfit = profitAmount - (chargeback + refund);
        return sum + netProfit;
      }
      return sum;
    }, 0);

    const totalChargebacks = logs.reduce((sum, log) => {
      const chargeback = parseFloat(log.chargebackAmount) || 0;
      const refund = parseFloat(log.refundAmount) || 0;
      return sum + (chargeback + refund);
    }, 0);

    const categorySummary = ALL_CATEGORIES.map(category => {
      const categoryLogs = logs.filter(log => {
        const logCategory = log.callCategory?.replace('_', ' ') || 'Other';
        return logCategory === category || (category === 'Other' && logCategory !== 'Flight' && logCategory !== 'Hotel' && logCategory !== 'Car Rental' && logCategory !== 'Packages');
      });

      const calls = categoryLogs.length;
      const sales = categoryLogs.filter(log => log.wasSaleConverted === 'Yes').length;

      const profit = categoryLogs.reduce((sum, log) => {
        if (log.wasSaleConverted === 'Yes') {
          const profitAmount = parseFloat(log.profitAmount) || 0;
          const chargeback = parseFloat(log.chargebackAmount) || 0;
          const refund = parseFloat(log.refundAmount) || 0;
          return sum + (profitAmount - (chargeback + refund));
        }
        return sum;
      }, 0);

      return {
        category,
        calls,
        sales,
        profit: Math.round(profit * 100) / 100,
        percentage: totalCalls > 0 ? ((calls / totalCalls) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.profit - a.profit);

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
      topCallCategories: categorySummary,
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
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading call analytics...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md p-6 text-center text-red-700 border border-red-200 bg-red-50 rounded-xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <FiPhoneCall className="text-xl text-red-600" />
        </div>
        {error}
        <button
          onClick={fetchAllCallLogs}
          className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!summary) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md p-6 text-center text-gray-600 border border-gray-200 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full">
          <FiPieChart className="text-xl text-gray-400" />
        </div>
        No summary data available
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 mx-auto space-y-4 bg-white rounded-xl max-w-8xl">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FiPhoneCall className="text-blue-600" />
            </div>
            {employeeId ? 'Your Call Analytics' : 'Team Performance Dashboard'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">Comprehensive call performance and sales metrics</p>
        </div>

        {/* Date Range Display */}
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-blue-100 rounded-lg shadow-sm">
          <FiCalendar className="text-blue-500" />
          <div className="text-sm">
            <span className="font-medium text-blue-700">
              {dateRange[0].format('MMM D')} - {dateRange[1].format('MMM D, YYYY')}
            </span>
            {filteredLogs.length > 0 && (
              <span className="block text-xs text-blue-600">
                {filteredLogs.length} calls analyzed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Date Selector */}
      <div className="p-3 rounded-lg bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Quick select:</span>
          {['daily', 'weekly', 'monthly'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`cursor-pointer px-3 py-1.5 text-sm rounded-lg transition-all capitalize ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
          <div className="flex-1 min-w-[200px]">
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className="w-full text-sm"
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MetricCard
          icon={<FiPhoneCall className="text-xl" />}
          label="Total Calls"
          value={summary.totalCalls}
          trend={`${summary.totalSales} sales`}
          color="blue"
        />
        <MetricCard
          icon={<MdCheckCircleOutline className="text-xl" />}
          label="Conversions"
          value={summary.totalSales}
          trend={`${((summary.totalSales / summary.totalCalls) * 100).toFixed(1)}% rate`}
          color="green"
        />
        <MetricCard
          icon={<FaDollarSign className="text-xl" />}
          label="Net Profit"
          value={`$${summary.totalProfit.toLocaleString()}`}
          trend="Total revenue"
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column - Categories */}
        <div className="space-y-4 lg:col-span-2">
          {/* Category Performance */}
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FiPieChart className="text-blue-500" />
                Category Performance
              </h3>
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                Sorted by Profit
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {summary.topCallCategories.map((cat, index) => (
                <div key={cat.category} className="p-3 transition-colors border border-gray-100 rounded-lg hover:border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-50">
                        {iconMap[cat.category]}
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-900">{cat.category}</span>
                        <span className="text-xs text-gray-500">{cat.calls} calls • {cat.sales} sales</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${cat.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-gray-600">{cat.percentage}% of total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Sales */}
          {summary.monthlySales.length > 0 && (
            <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                <FaChartLine className="text-green-500" />
                Monthly Sales Trend
              </h3>
              <div className="space-y-2">
                {summary.monthlySales.map((sale) => (
                  <div key={sale.month} className="flex items-center justify-between p-2 transition-colors rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-50 rounded-lg">
                        <FiCalendar className="text-sm text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {dayjs(sale.month).format('MMM YYYY')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      ${sale.total?.toLocaleString() || '0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Analytics */}
        <div className="space-y-4">
          {/* Call Directions */}
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-900">
              <MdBarChart className="text-blue-500" />
              Call Directions
            </h3>
            <div className="space-y-2">
              {summary.callDirectionStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                  <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Methods */}
          <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-900">
              <FiTrendingUp className="text-green-500" />
              Conversion Methods
            </h3>
            <div className="space-y-2">
              {summary.saleConvertedThroughStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700 capitalize">{stat._id || 'Unknown'}</span>
                  <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Metric Card Component
const MetricCard = ({ icon, label, value, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800'
  };

  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]} transition-all hover:shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-xs opacity-70">{trend}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CallSummary;