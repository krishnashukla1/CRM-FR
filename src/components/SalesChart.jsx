// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   Cell,
//   PieChart,
//   Pie
// } from 'recharts';
// import axios from 'axios';
// import {
//   FiTrendingUp,
//   FiAward,
//   FiTarget,
//   FiBarChart2,
//   FiUser,
//   FiFilter,
//   FiCalendar,
//   FiDollarSign,
//   FiChevronDown,
//   FiChevronUp
// } from 'react-icons/fi';
// import dayjs from 'dayjs';
// import weekOfYear from 'dayjs/plugin/weekOfYear';
// dayjs.extend(weekOfYear);
// import { FaDollarSign } from 'react-icons/fa';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';
// const PERFORMANCE_API_URL = 'http://localhost:5000/api';

// const COLORS = [
//   '#4F46E5', // Indigo
//   '#10B981', // Emerald
//   '#F59E0B', // Amber
//   '#EF4444', // Red
//   '#8B5CF6', // Violet
//   '#EC4899', // Pink
//   '#14B8A6', // Teal
//   '#F97316'  // Orange
// ];

// const SalesChart = () => {
//   const [chartData, setChartData] = useState([]);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [targetInfo, setTargetInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('monthly');
//   const [topPerformers, setTopPerformers] = useState([]);
//   const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
//   const [selectedEmployee, setSelectedEmployee] = useState('all');
//   const [callCategorySummary, setCallCategorySummary] = useState([]);
//   const [performanceView, setPerformanceView] = useState('monthly');
//   const [showAllEmployees, setShowAllEmployees] = useState(false);
//   const [rawData, setRawData] = useState([]);
//   const [totalProfit, setTotalProfit] = useState(0);
//   const [error, setError] = useState(null);


//   const fetchAllPages = async (token) => {
//     let allLogs = [];
//     let page = 1;
//     while (true) {
//       const res = await axios.get(`${API_URL}/call-logs`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page }
//       });
//       allLogs = [...allLogs, ...res.data.data];
//       if (page >= res.data.pagination.totalPages) break;
//       page++;
//     }
//     return allLogs;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         const [allLogs, summaryRes, performanceRes] = await Promise.all([
//           fetchAllPages(token),
//           axios.get(`${API_URL}/call-logs/summary`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           axios.get(`${API_URL}/performance/performance/all`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         const summary = summaryRes.data?.data || {};


//         const calculatedTotalProfit = allLogs.reduce((sum, log) => {
//           if (log.wasSaleConverted === 'Yes') {
//             const profitAmount = parseFloat(log.profitAmount) || 0;
//             const chargeback = parseFloat(log.chargebackAmount) || 0;
//             const refund = parseFloat(log.refundAmount) || 0;
//             const netProfit = profitAmount - (chargeback + refund);
//             console.log(`Log ID: ${log._id}, Net Profit: ${netProfit}`);
//             return sum + netProfit;
//           }
//           return sum;
//         }, 0);
//         setTotalProfit(calculatedTotalProfit);

//         const categories = summary?.topCallCategories || [];
//         setCallCategorySummary(
//           categories.map(item => ({
//             name: item._id,
//             value: item.count
//           }))
//         );

//         const performanceData = performanceRes.data?.data || [];
//         setRawData(allLogs);
//         processPerformanceData(allLogs, performanceData, performanceView);
//       } catch (err) {
//         console.error('Error fetching data:', err.response?.data || err.message);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [performanceView]);


//   // const processPerformanceData = (data, performanceData, viewType) => {
//   //   try {
//   //     const groupedData = {};
//   //     const employeeDetails = {};
//   //     const allEmployees = new Set();

//   //     // Map performance targets by employeeId and month
//   //     const targetMap = {};
//   //     const currentMonth = dayjs().format('MMM'); // e.g., 'Aug'
//   //     performanceData.forEach(item => {
//   //       if (item.month === currentMonth) {
//   //         targetMap[item.employeeId] = {
//   //           target: item.target || 0,
//   //           name: item.name,
//   //           photo: item.photo
//   //         };
//   //       }
//   //     });

//   //     data.forEach(item => {
//   //       const empId = item.employeeId?._id || item.employeeId;
//   //       const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
//   //       if (!empId) return; // Skip entries with no employeeId

//   //       const empKey = `${empId}|${empName}`;
//   //       allEmployees.add(empKey);

//   //       if (!employeeDetails[empKey]) {
//   //         employeeDetails[empKey] = {
//   //           id: empId,
//   //           name: empName,
//   //           totalSales: 0,
//   //           totalTarget: targetMap[empId]?.target || 0,
//   //           totalProfit: 0,
//   //           performanceRatio: 0
//   //         };
//   //       }

//   //       // Calculate net profit for sales and profit
//   //       let sales = 0;
//   //       let profit = 0;
//   //       if (item.wasSaleConverted === 'Yes') {
//   //         const profitAmount = parseFloat(item.profitAmount) || 0;
//   //         const chargeback = parseFloat(item.chargebackAmount) || 0;
//   //         const refund = parseFloat(item.refundAmount) || 0;
//   //         sales = profitAmount - (chargeback + refund);
//   //         profit = profitAmount - (chargeback + refund);
//   //       }

//   //       employeeDetails[empKey].totalSales += sales;
//   //       employeeDetails[empKey].totalProfit += profit;

//   //       const date = dayjs(item.createdAt);
//   //       let key;
//   //       if (viewType === 'monthly') {
//   //         key = date.format('MMM'); // e.g., 'Aug'
//   //       } else if (viewType === 'weekly') {
//   //         key = `W${date.isoWeek()} ${date.year()}`;
//   //       } else {
//   //         key = date.format('YYYY-MM-DD');
//   //       }

//   //       if (!groupedData[key]) groupedData[key] = {};
//   //       if (!groupedData[key][empKey]) groupedData[key][empKey] = { sales: 0, target: 0 };

//   //       groupedData[key][empKey].sales += sales;
//   //       groupedData[key][empKey].target = targetMap[empId]?.target || 0;
//   //     });

//   //     const formatted = Object.keys(groupedData)
//   //       .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//   //       .map(key => {
//   //         const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//   //         allEmployees.forEach(empKey => {
//   //           const [empId] = empKey.split('|');
//   //           row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//   //           row[`${empKey} Target`] = targetMap[empId]?.target || 0;
//   //         });
//   //         return row;
//   //       });

//   //     Object.keys(employeeDetails).forEach(empKey => {
//   //       const emp = employeeDetails[empKey];
//   //       emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
//   //     });

//   //     const performers = Array.from(allEmployees)
//   //       .filter(empKey => employeeDetails[empKey].totalSales > 0)
//   //       .map(empKey => ({
//   //         key: empKey,
//   //         name: employeeDetails[empKey].name,
//   //         id: employeeDetails[empKey].id,
//   //         totalSales: employeeDetails[empKey].totalSales,
//   //         performance: employeeDetails[empKey].performanceRatio,
//   //         totalProfit: employeeDetails[empKey].totalProfit
//   //       }))
//   //       .sort((a, b) => b.totalSales - a.totalSales)
//   //       .slice(0, 3);

//   //     setTopPerformers(performers);
//   //     setEmployeeDetails(employeeDetails);
//   //     setChartData(formatted);

//   //     const totalSales = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalSales, 0);
//   //     const totalTarget = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalTarget, 0);
//   //     const remaining = Math.max(totalTarget - totalSales, 0);
//   //     const perDayGoal = Math.ceil(remaining / 7);

//   //     setTargetInfo({
//   //       overall: { totalSales, totalTarget, remaining, perDayGoal },
//   //       employees: employeeDetails
//   //     });
//   //   } catch (err) {
//   //     console.error('Error processing performance data:', err);
//   //     setError('Failed to process performance data');
//   //   }
//   // };

// const processPerformanceData = (data, performanceData, viewType) => {
//   try {
//     const groupedData = {};
//     const employeeDetails = {};
//     const allEmployees = new Set();

//     // FIXED: Map targets per employee *and* per month (no currentMonth filter)
//     const targetMap = {}; // { empId: { month: target, name: '...', photo: '...' } }
//     performanceData.forEach(item => {
//       const empId = item.employeeId;
//       const targetNum = Number(item.target) || 0;  // NEW: Parse to number immediately
//       if (!targetMap[empId]) {
//         targetMap[empId] = {
//           name: item.name,
//           photo: item.photo
//         };
//       }
//       // targetMap[empId][item.month] = item.target || 0; // All months loaded
//       targetMap[empId][item.month] = targetNum;  // Now always a number
//     });

//     data.forEach(item => {
//       const empId = item.employeeId?._id || item.employeeId;
//       const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
//       if (!empId) return;

//       const empKey = `${empId}|${empName}`;
//       allEmployees.add(empKey);

//       if (!employeeDetails[empKey]) {
//         employeeDetails[empKey] = {
//           id: empId,
//           name: empName,
//           totalSales: 0,
//           totalTarget: 0, // FIXED: Will sum per-month targets below
//           totalProfit: 0,
//           performanceRatio: 0
//         };
//       }

//       // Calculate net profit for sales and profit
//       let sales = 0;
//       let profit = 0;
//       if (item.wasSaleConverted === 'Yes') {
//         const profitAmount = parseFloat(item.profitAmount) || 0;
//         const chargeback = parseFloat(item.chargebackAmount) || 0;
//         const refund = parseFloat(item.refundAmount) || 0;
//         sales = profitAmount - (chargeback + refund);
//         profit = profitAmount - (chargeback + refund);
//       }

//       employeeDetails[empKey].totalSales += sales;
//       employeeDetails[empKey].totalProfit += profit;

//       const date = dayjs(item.createdAt);
//       let key;
//       if (viewType === 'monthly') {
//         key = date.format('MMM'); // e.g., 'Aug'
//       } else if (viewType === 'weekly') {
//         key = `W${date.isoWeek()} ${date.year()}`;
//       } else {
//         key = date.format('YYYY-MM-DD');
//       }

//       if (!groupedData[key]) groupedData[key] = {};
//       if (!groupedData[key][empKey]) groupedData[key][empKey] = { sales: 0, target: 0 };

//       groupedData[key][empKey].sales += sales;
      
//       // FIXED: Use per-month target for monthly view; fallback to current for others
//       const currentMonth = dayjs().format('MMM');
//       const empTarget = viewType === 'monthly' 
//         ? (targetMap[empId]?.[key] || 0)  // Per-month target
//         : (targetMap[empId]?.[currentMonth] || 0);  // Current month for weekly/daily
//       groupedData[key][empKey].target = empTarget;
//     });

//     // FIXED: For totals, sum targets over *all* months (or selectedMonths for consistency)
//  // FIXED: For totals, sum targets over *all* months (or selectedMonths for consistency)
// const currentMonth = dayjs().format('MMM');
// Object.keys(employeeDetails).forEach(empKey => {
//   const [empId] = empKey.split('|');
//   const monthlyTargets = targetMap[empId] || {};
//   // Sum all available monthly targets (numbers only)
//   const totalTargetSum = Object.keys(monthlyTargets)
//     .filter(m => m !== 'name' && m !== 'photo')  // Skip non-month keys
//     .reduce((sum, m) => sum + (Number(monthlyTargets[m]) || 0), 0);  // Double-safe parse
//   employeeDetails[empKey].totalTarget = totalTargetSum || (Number(targetMap[empId]?.[currentMonth]) || 0);  // Fallback to current, parsed

//   const emp = employeeDetails[empKey];
//   emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
// });

//     const formatted = Object.keys(groupedData)
//       .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//       .map(key => {
//         const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//         allEmployees.forEach(empKey => {
//           const [empId] = empKey.split('|');
//           row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//           row[`${empKey} Target`] = groupedData[key][empKey]?.target || 0;  // Now per-period
//         });
//         return row;
//       });

//     const performers = Array.from(allEmployees)
//       .filter(empKey => employeeDetails[empKey].totalSales > 0)
//       .map(empKey => ({
//         key: empKey,
//         name: employeeDetails[empKey].name,
//         id: employeeDetails[empKey].id,
//         totalSales: employeeDetails[empKey].totalSales,
//         performance: employeeDetails[empKey].performanceRatio,
//         totalProfit: employeeDetails[empKey].totalProfit
//       }))
//       .sort((a, b) => b.totalSales - a.totalSales)
//       .slice(0, 3);

//     setTopPerformers(performers);
//     setEmployeeDetails(employeeDetails);
//     setChartData(formatted);

//     const totalSales = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalSales, 0);
//     const totalTarget = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalTarget, 0);
//     const remaining = Math.max(totalTarget - totalSales, 0);
//     const perDayGoal = Math.ceil(remaining / 7);

//     setTargetInfo({
//       overall: { totalSales, totalTarget, remaining, perDayGoal },
//       employees: employeeDetails
//     });
//   } catch (err) {
//     console.error('Error processing performance data:', err);
//     setError('Failed to process performance data');
//   }
// };
  
//   const filteredChartData = () => {
//     if (!chartData || chartData.length === 0) return [];

//     if (performanceView === 'monthly') {
//       return selectedMonths.map(month => {
//         const match = chartData.find(d => d.month === month);
//         if (!match) {
//           const row = { month };
//           Object.keys(employeeDetails).forEach(empKey => {
//             const [empId] = empKey.split('|');
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = employeeDetails[empKey]?.totalTarget || 0;
//           });
//           return row;
//         }
//         return match;
//       });
//     } else if (performanceView === 'weekly') {
//       return chartData.slice(-8);
//     } else if (performanceView === 'daily') {
//       return chartData.slice(-14);
//     }
//     return chartData;
//   };

//   const displayedEmployees = selectedEmployee === 'all'
//     ? Object.keys(employeeDetails)
//     : [selectedEmployee];


//   const renderPerformanceCard = (employeeKey, index) => {
//     const details = employeeDetails[employeeKey];
//     if (!details) return null;

//     const [id, name] = employeeKey.split('|');
//     const sales = details.totalSales || 0;
//     const target = details.totalTarget || 0;
//     const percent = details.performanceRatio || 0;
//     const profit = details.totalProfit || 0;

//     let performanceData = [];
//     if (performanceView === 'monthly') {
//       performanceData = selectedMonths.map(month => {
//         const data = chartData.find(d => d.month === month) || {};
//         const saleVal = data[`${employeeKey} Sales`] || 0;
//         return { name: month, performance: saleVal > 0 ? saleVal : 0 };
//       });
//     } else if (performanceView === 'weekly') {
//       performanceData = filteredChartData().map(week => {
//         const saleVal = week[`${employeeKey} Sales`] || 0;
//         return { name: week.week, performance: saleVal };
//       });
//     } else if (performanceView === 'daily') {
//       performanceData = filteredChartData().map(day => {
//         const saleVal = day[`${employeeKey} Sales`] || 0;
//         return { name: day.date, performance: saleVal };
//       });
//     }

//     return (
//       <div
//         key={index}
//         className="overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-blue-100"
//       >
//         <div className="p-5">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
//               <p className="text-xs text-gray-500">ID: {id}</p>
//             </div>
//             <span
//               className={`px-2 py-1 text-xs rounded-full font-medium ${percent >= 100
//                 ? 'bg-green-100 text-green-800'
//                 : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                     ? 'bg-yellow-100 text-yellow-800'
//                     : 'bg-red-100 text-red-800'
//                 }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Net Profit
//               </p>
//               <p className="text-lg font-bold text-blue-600">
//                 ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </p>
//             </div>
//             <div className="p-3 border border-purple-100 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiTarget className="mr-1" /> Target
//               </p>
//               <p className="text-lg font-bold text-purple-600">
//                 ${target.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <div className="flex justify-between mb-1 text-xs text-gray-500">
//               <span>0%</span>
//               <span>100%</span>
//             </div>
//             <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
//               <div
//                 className="h-full transition-all duration-500 rounded-full"
//                 style={{
//                   width: `${Math.min(percent, 100)}%`,
//                   background:
//                     percent >= 100
//                       ? 'linear-gradient(90deg, #10B981, #34D399)'
//                       : percent >= 75
//                         ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                         : percent >= 50
//                           ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                           : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <LineChart
//                   type="monotone"
//                   dataKey="performance"
//                   stroke="#8884d8"
//                   strokeWidth={2}
//                   dot={{ r: 3, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
//                   activeDot={{ r: 5, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const TopPerformerCard = ({ performer, index }) => {
//     if (!performer || !employeeDetails[performer.key]) return null;

//     const badgeColors = [
//       'bg-gradient-to-r from-yellow-400 to-yellow-500',
//       'bg-gradient-to-r from-gray-400 to-gray-500',
//       'bg-gradient-to-r from-amber-600 to-amber-700'
//     ];
//     const medalIcons = ['🥇', '🥈', '🥉'];
//     const titles = ['Top Performer', 'Runner Up', 'Third Place'];

//     const employeeData = employeeDetails[performer.key];
//     const totalSales = employeeData.totalSales || 0;
//     const totalTarget = employeeData.totalTarget || 0;
//     const totalProfit = employeeData.totalProfit || 0;

//     const monthlyPerformance = selectedMonths.map(month => {
//       const data = chartData.find(d => d.month === month) || {};
//       const sales = data[`${performer.key} Sales`] || 0;
//       const target = data[`${performer.key} Target`] || employeeDetails[performer.key]?.totalTarget || 0;
//       const percentage = target > 0 ? (sales / target) * 100 : 0;
//       return {
//         month,
//         percentage,
//         target
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0 && m.percentage > 0);
//     const avgMonthlyPerformance = validMonths.length > 0
//       ? Math.round(validMonths.reduce((sum, m) => sum + m.percentage, 0) / validMonths.length)
//       : 0;

//     const [startIndex, setStartIndex] = useState(0);
//     const itemsPerPage = 4;
//     const visibleMonths = monthlyPerformance.slice(startIndex, startIndex + itemsPerPage);

//     const handlePrev = () => {
//       setStartIndex(prev => Math.max(prev - itemsPerPage, 0));
//     };

//     const handleNext = () => {
//       if (startIndex + itemsPerPage < monthlyPerformance.length) {
//         setStartIndex(prev => prev + itemsPerPage);
//       }
//     };

//     return (
//       <div className={`rounded-xl p-5 shadow-md ${badgeColors[index] || 'bg-gray-300'} text-white`}>
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <h3 className="text-lg font-semibold">{titles[index] || 'Performer'}</h3>
//             <h2 className="mt-1 text-xl font-bold">{performer.name}</h2>
//             <p className="text-sm opacity-80">ID: {performer.id}</p>
//           </div>
//           <div className="text-3xl">{medalIcons[index] || ''}</div>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
//             <p className="text-xs">Total Net Profit</p>
//             <p className="text-lg font-bold">
//               ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             <p className="mt-1 text-xs">Target: ${totalTarget.toLocaleString()}</p>
//           </div>
//           <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
//             <p className="text-xs">Avg Monthly</p>
//             <p className="text-lg font-bold">{avgMonthlyPerformance}%</p>
//           </div>
//         </div>

//         <div className="w-full">
//           <div className="flex items-center justify-between mb-2">
//             <button
//               onClick={handlePrev}
//               disabled={startIndex === 0}
//               className="cursor-pointer text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="cursor-pointer text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `${monthData.percentage.toFixed(1)}%`}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const RADIAN = Math.PI / 180;

//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
//     const radius = outerRadius + 20;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#333"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         fontSize={12}
//       >
//         {`${name}: ${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   const getXAxisLabel = () => {
//     switch (performanceView) {
//       case 'monthly': return 'Months';
//       case 'weekly': return 'Weeks';
//       case 'daily': return 'Days';
//       default: return 'Time Period';
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-50 sm:p-6 rounded-xl">
//       {/* Dashboard Header */}
//       <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Team Performance Dashboard</h1>
//           <p className="mt-1 text-gray-600">Track and analyze your team's sales performance</p>
//         </div>
//         <div className="flex mt-4 space-x-2 md:mt-0">
//           <button
//             onClick={() => setActiveTab('monthly')}
//             className={`cursor-pointer   px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
//           >
//             <FiBarChart2 className="mr-2" /> Yearly
//           </button>
//         </div>
//       </div>

//       {error ? (
//         <div className="p-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
//           <p className="font-medium">Error loading data:</p>
//           <p>{error}</p>
//         </div>
//       ) : loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//         </div>
//       ) : targetInfo ? (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">


//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FaDollarSign className="mr-1" /> Total Net Profit
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                   </p>
//                 </div>
//                 <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
//                   <FaDollarSign className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <div className="flex justify-between mb-1 text-xs text-gray-500">
//                   <span>Target: ${targetInfo.overall.totalTarget.toLocaleString()}</span>
//                   <span>{Math.round((targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%`
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>


//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiTarget className="mr-1" /> Remaining Target
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">${targetInfo.overall.remaining.toLocaleString()}</p>
//                 </div>
//                 <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
//                   <FiTarget className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Daily Goal (7 days)</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   ${targetInfo.overall.perDayGoal.toLocaleString()} per day
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiUser className="mr-1" /> Total Employees
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">{Object.keys(employeeDetails).length}</p>
//                 </div>
//                 <div className="p-2 text-purple-600 bg-purple-100 rounded-lg">
//                   <FiUser className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Active this period</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   {Object.keys(employeeDetails).length} employees
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiAward className="mr-1" /> Top Performer
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'}
//                   </p>
//                 </div>
//                 <div className="p-2 text-yellow-600 bg-yellow-100 rounded-lg">
//                   <FiAward className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Performance</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   {topPerformers.length > 0 ? Math.round(topPerformers[0].performance) : 0}%
//                 </p>
//               </div>
//             </div>
//           </div>

//           {callCategorySummary?.length > 0 && (
//             <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//               <h3 className="mb-4 text-xl font-semibold text-gray-800">
//                 📊 Call Category Distribution
//               </h3>
//               <div className="w-full h-80">
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={callCategorySummary}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderCustomizedLabel}
//                       outerRadius={100}
//                       dataKey="value"
//                     >
//                       {callCategorySummary.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend
//                       layout="horizontal"
//                       verticalAlign="bottom"
//                       align="center"
//                       iconType="circle"
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}

//           {topPerformers.length > 0 && (
//             <div className="mb-6">
//               <h3 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
//                 <FiAward className="mr-2 text-yellow-500" /> Top Performers
//               </h3>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 {topPerformers.map((performer, index) => (
//                   <TopPerformerCard
//                     key={index}
//                     performer={performer}
//                     index={index}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Filters */}
//           <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//             <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
//               <FiFilter className="mr-2 text-gray-500" /> Filter Data
//             </h3>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="mb-4">
//                 <label className="block mb-2 text-base font-medium text-gray-800">Time Period</label>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => setPerformanceView('monthly')}
//                     className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Daily
//                   </button>
//                 </div>
//               </div>

//               {performanceView === 'monthly' && (
//                 <div>
//                   <label className="block mb-1 text-sm font-medium text-gray-700">Months</label>
//                   <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
//                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
//                       <button
//                         key={month}
//                         onClick={() => {
//                           if (selectedMonths.includes(month)) {
//                             setSelectedMonths(selectedMonths.filter(m => m !== month));
//                           } else {
//                             setSelectedMonths([...selectedMonths, month]);
//                           }
//                         }}
//                         className={`cursor-pointer py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                       >
//                         {month}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="w-full">
//                 <label className="block mb-3 text-sm font-medium text-gray-700">Employee</label>
//                 <div className="relative">
//                   <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="block w-full px-3 py-2 text-sm !text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>

//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={id} value={empKey} className="text-gray-900">
//                           {id} - {name}
//                         </option>
//                       );
//                     })}
//                   </select>


//                   <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Employee Performance Grid */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
//               {Object.keys(employeeDetails).length > 3 && (
//                 <button
//                   onClick={() => setShowAllEmployees(!showAllEmployees)}
//                   className="text-sm !text-blue-600 hover:text-blue-800 flex items-center"
//                 >
//                   {showAllEmployees ? (
//                     <>
//                       <FiChevronUp className="mr-1" /> Show Less
//                     </>
//                   ) : (
//                     <>
//                       <FiChevronDown className="mr-1" /> Show More
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
//               {(showAllEmployees ? Object.keys(employeeDetails) : Object.keys(employeeDetails).slice(0, 3)).map((empKey, index) =>
//                 renderPerformanceCard(empKey, index)
//               )}
//             </div>
//           </div>

//           {/* Performance Trend Chart */}
//           <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//             <div className="flex flex-col items-start justify-between gap-3 mb-5 sm:flex-row sm:items-center">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {performanceView === 'monthly' && 'Monthly Performance Trend'}
//                 {performanceView === 'weekly' && 'Weekly Performance Trend'}
//                 {performanceView === 'daily' && 'Daily Performance Trend'}
//               </h3>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">View:</span>
//                 <div className="relative">
//                   <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="block w-full px-3 py-2 text-sm !text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all" className="text-gray-900">
//                       All Employees
//                     </option>

//                     {Object.keys(employeeDetails).map((empKey) => {
//                       const [id, name] = empKey.split("|");
//                       return (
//                         <option key={id} value={empKey} className="text-gray-900">
//                           {id} - {name}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
//               <div className="min-w-[1000px] h-[450px]">

//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={filteredChartData()}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
//                     barSize={28}
//                     barGap={8}
//                     barCategoryGap={24}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#F3F4F6"
//                       strokeWidth={0.5}
//                     />
//                     <XAxis
//                       dataKey={performanceView === 'monthly' ? 'month' : performanceView === 'weekly' ? 'week' : 'date'}
//                       tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
//                       axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
//                       tickLine={false}
//                       label={{
//                         value: getXAxisLabel(),
//                         position: 'bottom',
//                         offset: 30,
//                         fill: '#6B7280',
//                         fontSize: 13,
//                         fontWeight: 500
//                       }}
//                     />
//                     <YAxis
//                       tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
//                       axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
//                       tickLine={false}
//                       label={{
//                         value: 'Amount ($)',
//                         angle: -90,
//                         position: 'left',
//                         offset: 10,
//                         fill: '#6B7280',
//                         fontSize: 13,
//                         fontWeight: 500
//                       }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: '#ffffff',
//                         borderColor: '#E5E7EB',
//                         borderRadius: '0.75rem',
//                         boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//                         padding: '12px 16px',
//                         fontSize: '14px'
//                       }}
//                       itemStyle={{ color: '#1F2937', padding: '4px 0', textTransform: 'capitalize' }}
//                       labelStyle={{ fontWeight: '600', color: '#111827', marginBottom: '8px', borderBottom: '1px solid #F3F4F6', paddingBottom: '6px' }}
//                       formatter={(value, name) => {
//                         const amount = new Intl.NumberFormat('en-US', {
//                           style: 'currency',
//                           currency: 'USD',
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         }).format(value);
//                         return [amount, name.replace(' Sales', '').replace(' Target', '')];
//                       }}
//                     />
//                     <Legend
//                       verticalAlign="top"
//                       align="center"
//                       wrapperStyle={{ paddingBottom: 25, fontSize: '0.8125rem', fontWeight: 500 }}
//                       iconSize={12}
//                       iconType="circle"
//                       formatter={(value) => value.replace(' Sales', '').replace(' Target', '')}
//                     />
//                     {/* {displayedEmployees.map((name, index) => {
//                       const baseColor = COLORS[index % COLORS.length];
//                       return (
//                         <React.Fragment key={name}>
//                           <Bar
//                             dataKey={`${name} Sales`}
//                             fill={baseColor}
//                             name={`${name} Sales`}
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1500}
//                             animationEasing="ease-out"
//                           />
//                           <Bar
//                             dataKey={`${name} Target`}
//                             fill={`${baseColor}33`}
//                             stroke={baseColor}
//                             strokeWidth={1}
//                             strokeDasharray="4 2"
//                             name={`${name} Target`}
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1800}
//                             animationEasing="ease-out"
//                           />
//                         </React.Fragment>
//                       );
//                     })} */}
//                     {/* Bars */}
//                     {displayedEmployees.map((empKey, index) => {
//                       const [id, name] = empKey.split('|'); // extract only name
//                       const baseColor = COLORS[index % COLORS.length];
//                       return (
//                         <React.Fragment key={empKey}>
//                           <Bar
//                             dataKey={`${empKey} Sales`}   // keep empKey for data mapping
//                             fill={baseColor}
//                             name={`${name} (Sales) Sales`}        // show only name in legend/tooltip
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1400}
//                             animationEasing="ease-out"
//                           />
//                           <Bar
//                             dataKey={`${empKey} Target`}
//                             fill={`${baseColor}22`}
//                             stroke={baseColor}
//                             strokeWidth={1.5}
//                             strokeDasharray="5 3"
//                             name={`${name} (Target) Target`}       // show only name in legend/tooltip
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1600}
//                             animationEasing="ease-out"
//                           />
//                         </React.Fragment>
//                       );
//                     })}

//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="flex items-center justify-between mt-4">
//               <div className="flex items-center text-xs text-gray-500">
//                 <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
//                 <span className="mr-3">Sales</span>
//                 <span className="inline-block w-3 h-3 mr-1 border border-blue-500 rounded-full bg-blue-500/20"></span>
//                 <span>Target</span>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {performanceView === 'monthly' && `Showing: ${selectedMonths.join(', ')}`}
//                 {performanceView === 'weekly' && `Showing: Last 8 weeks`}
//                 {performanceView === 'daily' && `Showing: Last 14 days`}
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="py-10 text-center">
//           <p className="text-gray-500">No performance data available</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesChart;

//===========================correct======================================

// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   Cell,
//   PieChart,
//   Pie
// } from 'recharts';
// import axios from 'axios';
// import {
//   FiTrendingUp,
//   FiAward,
//   FiTarget,
//   FiBarChart2,
//   FiUser,
//   FiFilter,
//   FiCalendar,
//   FiDollarSign,
//   FiChevronDown,
//   FiChevronUp
// } from 'react-icons/fi';
// import dayjs from 'dayjs';
// import weekOfYear from 'dayjs/plugin/weekOfYear';
// dayjs.extend(weekOfYear);
// import { FaDollarSign } from 'react-icons/fa';

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';
// const PERFORMANCE_API_URL = 'http://localhost:5000/api';

// const COLORS = [
//   '#4F46E5', // Indigo
//   '#10B981', // Emerald
//   '#F59E0B', // Amber
//   '#EF4444', // Red
//   '#8B5CF6', // Violet
//   '#EC4899', // Pink
//   '#14B8A6', // Teal
//   '#F97316'  // Orange
// ];

// const SalesChart = () => {
//   const [chartData, setChartData] = useState([]);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [targetInfo, setTargetInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('monthly');
//   const [topPerformers, setTopPerformers] = useState([]);
//   const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
//   const [selectedEmployee, setSelectedEmployee] = useState('all');
//   const [callCategorySummary, setCallCategorySummary] = useState([]);
//   const [performanceView, setPerformanceView] = useState('monthly');
//   const [showAllEmployees, setShowAllEmployees] = useState(false);
//   const [rawData, setRawData] = useState([]);
//   const [totalProfit, setTotalProfit] = useState(0);
//   const [error, setError] = useState(null);
//   const [targetMapState, setTargetMapState] = useState({});

//   const fetchAllPages = async (token) => {
//     let allLogs = [];
//     let page = 1;
//     while (true) {
//       const res = await axios.get(`${API_URL}/call-logs`, {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { page }
//       });
//       allLogs = [...allLogs, ...res.data.data];
//       if (page >= res.data.pagination.totalPages) break;
//       page++;
//     }
//     return allLogs;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         const [allLogs, summaryRes, performanceRes] = await Promise.all([
//           fetchAllPages(token),
//           axios.get(`${API_URL}/call-logs/summary`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           axios.get(`${API_URL}/performance/performance/all`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         const summary = summaryRes.data?.data || {};

//         const calculatedTotalProfit = allLogs.reduce((sum, log) => {
//           if (log.wasSaleConverted === 'Yes') {
//             const profitAmount = parseFloat(log.profitAmount) || 0;
//             const chargeback = parseFloat(log.chargebackAmount) || 0;
//             const refund = parseFloat(log.refundAmount) || 0;
//             const netProfit = profitAmount - (chargeback + refund);
//             console.log(`Log ID: ${log._id}, Net Profit: ${netProfit}`);
//             return sum + netProfit;
//           }
//           return sum;
//         }, 0);
//         setTotalProfit(calculatedTotalProfit);

//         const categories = summary?.topCallCategories || [];
//         setCallCategorySummary(
//           categories.map(item => ({
//             name: item._id,
//             value: item.count
//           }))
//         );

//         const performanceData = performanceRes.data?.data || [];
//         setRawData(allLogs);
//         processPerformanceData(allLogs, performanceData, performanceView);
//       } catch (err) {
//         console.error('Error fetching data:', err.response?.data || err.message);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (data, performanceData, viewType) => {
//     try {
//       const groupedData = {};
//       const employeeDetails = {};
//       const allEmployees = new Set();

//       // FIXED: Map targets per employee *and* per month (no currentMonth filter), and parse to Number
//       const targetMap = {}; // { empId: { month: target (NUMBER), name: '...', photo: '...' } }
//       performanceData.forEach(item => {
//         const empId = item.employeeId;
//         const targetNum = Number(item.target) || 0;  // Parse to number immediately
//         if (!targetMap[empId]) {
//           targetMap[empId] = {
//             name: item.name,
//             photo: item.photo
//           };
//         }
//         targetMap[empId][item.month] = targetNum;  // Now always a number
//       });
//       setTargetMapState(targetMap);  // Store for use in filteredChartData and cards

//       data.forEach(item => {
//         const empId = item.employeeId?._id || item.employeeId;
//         const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
//         if (!empId) return;

//         const empKey = `${empId}|${empName}`;
//         allEmployees.add(empKey);

//         if (!employeeDetails[empKey]) {
//           employeeDetails[empKey] = {
//             id: empId,
//             name: empName,
//             totalSales: 0,
//             totalTarget: 0, // FIXED: Will sum per-month targets below
//             totalProfit: 0,
//             performanceRatio: 0
//           };
//         }

//         // Calculate net profit for sales and profit
//         let sales = 0;
//         let profit = 0;
//         if (item.wasSaleConverted === 'Yes') {
//           const profitAmount = parseFloat(item.profitAmount) || 0;
//           const chargeback = parseFloat(item.chargebackAmount) || 0;
//           const refund = parseFloat(item.refundAmount) || 0;
//           sales = profitAmount - (chargeback + refund);
//           profit = profitAmount - (chargeback + refund);
//         }

//         employeeDetails[empKey].totalSales += sales;
//         employeeDetails[empKey].totalProfit += profit;

//         const date = dayjs(item.createdAt);
//         let key;
//         if (viewType === 'monthly') {
//           key = date.format('MMM'); // e.g., 'Aug'
//         } else if (viewType === 'weekly') {
//           key = `W${date.isoWeek()} ${date.year()}`;
//         } else {
//           key = date.format('YYYY-MM-DD');
//         }

//         if (!groupedData[key]) groupedData[key] = {};
//         if (!groupedData[key][empKey]) groupedData[key][empKey] = { sales: 0, target: 0 };

//         groupedData[key][empKey].sales += sales;
        
//         // FIXED: Use per-month target for monthly view; fallback to current for others
//         const currentMonth = dayjs().format('MMM');
//         const empTarget = viewType === 'monthly' 
//           ? (Number(targetMap[empId]?.[key]) || 0)  // Per-month target, parsed
//           : (Number(targetMap[empId]?.[currentMonth]) || 0);  // Current month for weekly/daily, parsed
//         groupedData[key][empKey].target = empTarget;
//       });

//       // FIXED: For totals, sum targets over *all* months (or selectedMonths for consistency)
//       const currentMonth = dayjs().format('MMM');
//       Object.keys(employeeDetails).forEach(empKey => {
//         const [empId] = empKey.split('|');
//         const monthlyTargets = targetMap[empId] || {};
//         // Sum all available monthly targets (numbers only)
//         const totalTargetSum = Object.keys(monthlyTargets)
//           .filter(m => m !== 'name' && m !== 'photo')  // Skip non-month keys
//           .reduce((sum, m) => sum + (Number(monthlyTargets[m]) || 0), 0);  // Double-safe parse
//         employeeDetails[empKey].totalTarget = totalTargetSum || (Number(targetMap[empId]?.[currentMonth]) || 0);  // Fallback to current, parsed

//         const emp = employeeDetails[empKey];
//         emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
//       });

//       const formatted = Object.keys(groupedData)
//         .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//         .map(key => {
//           const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//           allEmployees.forEach(empKey => {
//             const [empId] = empKey.split('|');
//             row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//             row[`${empKey} Target`] = groupedData[key][empKey]?.target || 0;  // Now per-period
//           });
//           return row;
//         });

//       const performers = Array.from(allEmployees)
//         .filter(empKey => employeeDetails[empKey].totalSales > 0)
//         .map(empKey => ({
//           key: empKey,
//           name: employeeDetails[empKey].name,
//           id: employeeDetails[empKey].id,
//           totalSales: employeeDetails[empKey].totalSales,
//           performance: employeeDetails[empKey].performanceRatio,
//           totalProfit: employeeDetails[empKey].totalProfit
//         }))
//         .sort((a, b) => b.totalSales - a.totalSales)
//         .slice(0, 3);

//       setTopPerformers(performers);
//       setEmployeeDetails(employeeDetails);
//       setChartData(formatted);

//       const totalSales = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalSales, 0);
//       const totalTarget = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalTarget, 0);
//       const remaining = Math.max(totalTarget - totalSales, 0);
//       const perDayGoal = Math.ceil(remaining / 7);

//       setTargetInfo({
//         overall: { totalSales, totalTarget, remaining, perDayGoal },
//         employees: employeeDetails
//       });
//     } catch (err) {
//       console.error('Error processing performance data:', err);
//       setError('Failed to process performance data');
//     }
//   };
  
//   const filteredChartData = () => {
//     if (!chartData || chartData.length === 0) return [];

//     if (performanceView === 'monthly') {
//       return selectedMonths.map(month => {
//         const match = chartData.find(d => d.month === month);
//         if (!match) {
//           const row = { month };
//           Object.keys(employeeDetails).forEach(empKey => {
//             const [empId] = empKey.split('|');
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = Number(targetMapState[empId]?.[month]) || 0;  // FIXED: Per-month target
//           });
//           return row;
//         }
//         return match;
//       });
//     } else if (performanceView === 'weekly') {
//       return chartData.slice(-8);
//     } else if (performanceView === 'daily') {
//       return chartData.slice(-14);
//     }
//     return chartData;
//   };

//   const displayedEmployees = selectedEmployee === 'all'
//     ? Object.keys(employeeDetails)
//     : [selectedEmployee];

//   const renderPerformanceCard = (employeeKey, index) => {
//     const details = employeeDetails[employeeKey];
//     if (!details) return null;

//     const [id, name] = employeeKey.split('|');
//     const sales = details.totalSales || 0;
//     const target = details.totalTarget || 0;
//     const percent = details.performanceRatio || 0;
//     const profit = details.totalProfit || 0;

//     let performanceData = [];
//     if (performanceView === 'monthly') {
//       performanceData = selectedMonths.map(month => {
//         const data = chartData.find(d => d.month === month) || {};
//         const saleVal = data[`${employeeKey} Sales`] || 0;
//         return { name: month, performance: saleVal > 0 ? saleVal : 0 };
//       });
//     } else if (performanceView === 'weekly') {
//       performanceData = filteredChartData().map(week => {
//         const saleVal = week[`${employeeKey} Sales`] || 0;
//         return { name: week.week, performance: saleVal };
//       });
//     } else if (performanceView === 'daily') {
//       performanceData = filteredChartData().map(day => {
//         const saleVal = day[`${employeeKey} Sales`] || 0;
//         return { name: day.date, performance: saleVal };
//       });
//     }

//     return (
//       <div
//         key={index}
//         className="overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-blue-100"
//       >
//         <div className="p-5">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
//               <p className="text-xs text-gray-500">ID: {id}</p>
//             </div>
//             <span
//               className={`px-2 py-1 text-xs rounded-full font-medium ${percent >= 100
//                 ? 'bg-green-100 text-green-800'
//                 : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                     ? 'bg-yellow-100 text-yellow-800'
//                     : 'bg-red-100 text-red-800'
//                 }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Net Profit
//               </p>
//               <p className="text-lg font-bold text-blue-600">
//                 ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </p>
//             </div>
//             <div className="p-3 border border-purple-100 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiTarget className="mr-1" /> Target
//               </p>
//               <p className="text-lg font-bold text-purple-600">
//                 ${target.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <div className="flex justify-between mb-1 text-xs text-gray-500">
//                {/* <span>{Math.max(0, Math.min(percent, 100))}%</span>  */}
//                <span>{Math.round(Math.max(0, Math.min(percent, 100)))}%</span>

//               <span>100%</span>
//             </div>
//             <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
//               <div
//                 className="h-full transition-all duration-500 rounded-full"
//                 style={{
//                   width: `${Math.min(percent, 100)}%`,
//                   background:
//                     percent >= 100
//                       ? 'linear-gradient(90deg, #10B981, #34D399)'
//                       : percent >= 75
//                         ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                         : percent >= 50
//                           ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                           : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line  // FIXED: Was <LineChart>, now <Line>
//                   type="monotone"
//                   dataKey="performance"
//                   stroke="#8884d8"
//                   strokeWidth={2}
//                   dot={{ r: 3, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
//                   activeDot={{ r: 5, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const TopPerformerCard = ({ performer, index }) => {
//     if (!performer || !employeeDetails[performer.key]) return null;

//     const badgeColors = [
//       'bg-gradient-to-r from-yellow-400 to-yellow-500',
//       'bg-gradient-to-r from-gray-400 to-gray-500',
//       'bg-gradient-to-r from-amber-600 to-amber-700'
//     ];
//     const medalIcons = ['🥇', '🥈', '🥉'];
//     const titles = ['Top Performer', 'Runner Up', 'Third Place'];

//     const employeeData = employeeDetails[performer.key];
//     const totalSales = employeeData.totalSales || 0;
//     const totalTarget = employeeData.totalTarget || 0;
//     const totalProfit = employeeData.totalProfit || 0;

//     const monthlyPerformance = selectedMonths.map(month => {
//       const data = chartData.find(d => d.month === month) || {};
//       const sales = data[`${performer.key} Sales`] || 0;
//       // FIXED: Use per-month target from targetMapState
//       const target = data[`${performer.key} Target`] || Number(targetMapState[performer.id]?.[month]) || 0;
//       const percentage = target > 0 ? (sales / target) * 100 : 0;
//       return {
//         month,
//         percentage,
//         target
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0 && m.percentage > 0);
//     const avgMonthlyPerformance = validMonths.length > 0
//       ? Math.round(validMonths.reduce((sum, m) => sum + m.percentage, 0) / validMonths.length)
//       : 0;

//     const [startIndex, setStartIndex] = useState(0);
//     const itemsPerPage = 4;
//     const visibleMonths = monthlyPerformance.slice(startIndex, startIndex + itemsPerPage);

//     const handlePrev = () => {
//       setStartIndex(prev => Math.max(prev - itemsPerPage, 0));
//     };

//     const handleNext = () => {
//       if (startIndex + itemsPerPage < monthlyPerformance.length) {
//         setStartIndex(prev => prev + itemsPerPage);
//       }
//     };

//     return (
//       <div className={`rounded-xl p-5 shadow-md ${badgeColors[index] || 'bg-gray-300'} text-white`}>
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <h3 className="text-lg font-semibold">{titles[index] || 'Performer'}</h3>
//             <h2 className="mt-1 text-xl font-bold">{performer.name}</h2>
//             <p className="text-sm opacity-80">ID: {performer.id}</p>
//           </div>
//           <div className="text-3xl">{medalIcons[index] || ''}</div>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
//             <p className="text-xs">Total Sales  {/* FIXED: Label consistency - was "Total Net Profit" but value is sales/net calc */}
//             </p>
//             <p className="text-lg font-bold">
//               ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//             </p>
//             <p className="mt-1 text-xs">Target: ${totalTarget.toLocaleString()}</p>
//           </div>
//           <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
//             <p className="text-xs">Avg Monthly</p>
//             <p className="text-lg font-bold">{avgMonthlyPerformance}%</p>
//           </div>
//         </div>

//         <div className="w-full">
//           <div className="flex items-center justify-between mb-2">
//             <button
//               onClick={handlePrev}
//               disabled={startIndex === 0}
//               className="cursor-pointer text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="cursor-pointer text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `${monthData.percentage.toFixed(1)}%`}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const RADIAN = Math.PI / 180;

//   const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
//     const radius = outerRadius + 20;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);

//     return (
//       <text
//         x={x}
//         y={y}
//         fill="#333"
//         textAnchor={x > cx ? "start" : "end"}
//         dominantBaseline="central"
//         fontSize={12}
//       >
//         {`${name}: ${(percent * 100).toFixed(0)}%`}
//       </text>
//     );
//   };

//   const getXAxisLabel = () => {
//     switch (performanceView) {
//       case 'monthly': return 'Months';
//       case 'weekly': return 'Weeks';
//       case 'daily': return 'Days';
//       default: return 'Time Period';
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-50 sm:p-6 rounded-xl">
//       {/* Dashboard Header */}
//       <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Team Performance Dashboard</h1>
//           <p className="mt-1 text-gray-600">Track and analyze your team's sales performance</p>
//         </div>
//         <div className="flex mt-4 space-x-2 md:mt-0">
//           <button
//             onClick={() => setActiveTab('monthly')}
//             className={`cursor-pointer   px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
//           >
//             <FiBarChart2 className="mr-2" /> Yearly
//           </button>
//         </div>
//       </div>

//       {error ? (
//         <div className="p-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
//           <p className="font-medium">Error loading data:</p>
//           <p>{error}</p>
//         </div>
//       ) : loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
//         </div>
//       ) : targetInfo ? (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FaDollarSign className="mr-1" /> Total Net Profit
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                   </p>
//                 </div>
//                 <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
//                   <FaDollarSign className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <div className="flex justify-between mb-1 text-xs text-gray-500">
//                   <span>Target: ${targetInfo.overall.totalTarget.toLocaleString()}</span>
//                   <span>{Math.round((targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%`
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiTarget className="mr-1" /> Remaining Target
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">${targetInfo.overall.remaining.toLocaleString()}</p>
//                 </div>
//                 <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
//                   <FiTarget className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Daily Goal (7 days)</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   ${targetInfo.overall.perDayGoal.toLocaleString()} per day
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiUser className="mr-1" /> Total Employees
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">{Object.keys(employeeDetails).length}</p>
//                 </div>
//                 <div className="p-2 text-purple-600 bg-purple-100 rounded-lg">
//                   <FiUser className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Active this period</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   {Object.keys(employeeDetails).length} employees
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="flex items-center mb-1 text-sm text-gray-600">
//                     <FiAward className="mr-1" /> Top Performer
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'}
//                   </p>
//                 </div>
//                 <div className="p-2 text-yellow-600 bg-yellow-100 rounded-lg">
//                   <FiAward className="text-xl" />
//                 </div>
//               </div>
//               <div className="pt-3 mt-3 border-t border-gray-100">
//                 <p className="mb-1 text-xs text-gray-500">Performance</p>
//                 <p className="text-sm font-medium text-gray-800">
//                   {topPerformers.length > 0 ? Math.round(topPerformers[0].performance) : 0}%
//                 </p>
//               </div>
//             </div>
//           </div>

//           {callCategorySummary?.length > 0 && (
//             <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//               <h3 className="mb-4 text-xl font-semibold text-gray-800">
//                 📊 Call Category Distribution
//               </h3>
//               <div className="w-full h-80">
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={callCategorySummary}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={false}
//                       label={renderCustomizedLabel}
//                       outerRadius={100}
//                       dataKey="value"
//                     >
//                       {callCategorySummary.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Legend
//                       layout="horizontal"
//                       verticalAlign="bottom"
//                       align="center"
//                       iconType="circle"
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           )}

//           {topPerformers.length > 0 && (
//             <div className="mb-6">
//               <h3 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
//                 <FiAward className="mr-2 text-yellow-500" /> Top Performers
//               </h3>
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 {topPerformers.map((performer, index) => (
//                   <TopPerformerCard
//                     key={index}
//                     performer={performer}
//                     index={index}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Filters */}
//           <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//             <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
//               <FiFilter className="mr-2 text-gray-500" /> Filter Data
//             </h3>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div className="mb-4">
//                 <label className="block mb-2 text-base font-medium text-gray-800">Time Period</label>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={() => setPerformanceView('monthly')}
//                     className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`cursor-pointer px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Daily
//                   </button>
//                 </div>
//               </div>

//               {performanceView === 'monthly' && (
//                 <div>
//                   <label className="block mb-1 text-sm font-medium text-gray-700">Months</label>
//                   <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
//                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
//                       <button
//                         key={month}
//                         onClick={() => {
//                           if (selectedMonths.includes(month)) {
//                             setSelectedMonths(selectedMonths.filter(m => m !== month));
//                           } else {
//                             setSelectedMonths([...selectedMonths, month]);
//                           }
//                         }}
//                         className={`cursor-pointer py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                       >
//                         {month}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="w-full">
//                 <label className="block mb-3 text-sm font-medium text-gray-700">Employee</label>
//                 <div className="relative">
//                   <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="block w-full px-3 py-2 text-sm !text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>

//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={id} value={empKey} className="text-gray-900">
//                           {id} - {name}
//                         </option>
//                       );
//                     })}
//                   </select>

//                   <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Employee Performance Grid */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
//               {Object.keys(employeeDetails).length > 3 && (
//                 <button
//                   onClick={() => setShowAllEmployees(!showAllEmployees)}
//                   className="text-sm !text-blue-600 hover:text-blue-800 flex items-center"
//                 >
//                   {showAllEmployees ? (
//                     <>
//                       <FiChevronUp className="mr-1" /> Show Less
//                     </>
//                   ) : (
//                     <>
//                       <FiChevronDown className="mr-1" /> Show More
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
//               {(showAllEmployees ? Object.keys(employeeDetails) : Object.keys(employeeDetails).slice(0, 3)).map((empKey, index) =>
//                 renderPerformanceCard(empKey, index)
//               )}
//             </div>
//           </div>

//           {/* Performance Trend Chart */}
//           <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//             <div className="flex flex-col items-start justify-between gap-3 mb-5 sm:flex-row sm:items-center">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {performanceView === 'monthly' && 'Monthly Performance Trend'}
//                 {performanceView === 'weekly' && 'Weekly Performance Trend'}
//                 {performanceView === 'daily' && 'Daily Performance Trend'}
//               </h3>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">View:</span>
//                 <div className="relative">
//                   <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="block w-full px-3 py-2 text-sm !text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all" className="text-gray-900">
//                       All Employees
//                     </option>

//                     {Object.keys(employeeDetails).map((empKey) => {
//                       const [id, name] = empKey.split("|");
//                       return (
//                         <option key={id} value={empKey} className="text-gray-900">
//                           {id} - {name}
//                         </option>
//                       );
//                     })}
//                   </select>
//                   <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
//               <div className="min-w-[1000px] h-[450px]">

//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={filteredChartData()}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
//                     barSize={28}
//                     barGap={8}
//                     barCategoryGap={24}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#F3F4F6"
//                       strokeWidth={0.5}
//                     />
//                     <XAxis
//                       dataKey={performanceView === 'monthly' ? 'month' : performanceView === 'weekly' ? 'week' : 'date'}
//                       tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
//                       axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
//                       tickLine={false}
//                       label={{
//                         value: getXAxisLabel(),
//                         position: 'bottom',
//                         offset: 30,
//                         fill: '#6B7280',
//                         fontSize: 13,
//                         fontWeight: 500
//                       }}
//                     />
//                     <YAxis
//                       tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
//                       axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
//                       tickLine={false}
//                       label={{
//                         value: 'Amount ($)',
//                         angle: -90,
//                         position: 'left',
//                         offset: 10,
//                         fill: '#6B7280',
//                         fontSize: 13,
//                         fontWeight: 500
//                       }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: '#ffffff',
//                         borderColor: '#E5E7EB',
//                         borderRadius: '0.75rem',
//                         boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//                         padding: '12px 16px',
//                         fontSize: '14px'
//                       }}
//                       itemStyle={{ color: '#1F2937', padding: '4px 0', textTransform: 'capitalize' }}
//                       labelStyle={{ fontWeight: '600', color: '#111827', marginBottom: '8px', borderBottom: '1px solid #F3F4F6', paddingBottom: '6px' }}
//                       formatter={(value, name) => {
//                         const amount = new Intl.NumberFormat('en-US', {
//                           style: 'currency',
//                           currency: 'USD',
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2
//                         }).format(value);
//                         return [amount, name.replace(' Sales', '').replace(' Target', '')];
//                       }}
//                     />
//                     <Legend
//                       verticalAlign="top"
//                       align="center"
//                       wrapperStyle={{ paddingBottom: 25, fontSize: '0.8125rem', fontWeight: 500 }}
//                       iconSize={12}
//                       iconType="circle"
//                       formatter={(value) => value.replace(/ (Sales|Target)$/, '')}  // FIXED: Clean legend names
//                     />
//                     {/* Bars */}
//                     {displayedEmployees.map((empKey, index) => {
//                       const [id, name] = empKey.split('|'); // extract only name
//                       const baseColor = COLORS[index % COLORS.length];
//                       return (
//                         <React.Fragment key={empKey}>
//                           <Bar
//                             dataKey={`${empKey} Sales`}   // keep empKey for data mapping
//                             fill={baseColor}
//                             name={`${name} Sales`}  // FIXED: Simplified name for legend/tooltip
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1400}
//                             animationEasing="ease-out"
//                           />
//                           <Bar
//                             dataKey={`${empKey} Target`}
//                             fill={`${baseColor}22`}
//                             stroke={baseColor}
//                             strokeWidth={1.5}
//                             strokeDasharray="5 3"
//                             name={`${name} Target`}  // FIXED: Simplified name for legend/tooltip
//                             radius={[6, 6, 0, 0]}
//                             animationDuration={1600}
//                             animationEasing="ease-out"
//                           />
//                         </React.Fragment>
//                       );
//                     })}

//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="flex items-center justify-between mt-4">
//               <div className="flex items-center text-xs text-gray-500">
//                 <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
//                 <span className="mr-3">Sales</span>
//                 <span className="inline-block w-3 h-3 mr-1 border border-blue-500 rounded-full bg-blue-500/20"></span>
//                 <span>Target</span>
//               </div>
//               <div className="text-xs text-gray-500">
//                 {performanceView === 'monthly' && `Showing: ${selectedMonths.join(', ')}`}
//                 {performanceView === 'weekly' && `Showing: Last 8 weeks`}
//                 {performanceView === 'daily' && `Showing: Last 14 days`}
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="py-10 text-center">
//           <p className="text-gray-500">No performance data available</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesChart;

//=====================stylish================

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import axios from 'axios';
import {
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiBarChart2,
  FiUser,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiPieChart,
  FiUsers
} from 'react-icons/fi';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);
import { FaDollarSign, FaChartLine, FaBullseye } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-ba.onrender.com/api';
const PERFORMANCE_API_URL = 'http://localhost:5000/api';

const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316'  // Orange
];

const GRADIENT_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];

const SalesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [targetInfo, setTargetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [callCategorySummary, setCallCategorySummary] = useState([]);
  const [performanceView, setPerformanceView] = useState('monthly');
  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [error, setError] = useState(null);
  const [targetMapState, setTargetMapState] = useState({});

  const fetchAllPages = async (token) => {
    let allLogs = [];
    let page = 1;
    while (true) {
      const res = await axios.get(`${API_URL}/call-logs`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page }
      });
      allLogs = [...allLogs, ...res.data.data];
      if (page >= res.data.pagination.totalPages) break;
      page++;
    }
    return allLogs;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        const [allLogs, summaryRes, performanceRes] = await Promise.all([
          fetchAllPages(token),
          axios.get(`${API_URL}/call-logs/summary`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_URL}/performance/performance/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const summary = summaryRes.data?.data || {};

        const calculatedTotalProfit = allLogs.reduce((sum, log) => {
          if (log.wasSaleConverted === 'Yes') {
            const profitAmount = parseFloat(log.profitAmount) || 0;
            const chargeback = parseFloat(log.chargebackAmount) || 0;
            const refund = parseFloat(log.refundAmount) || 0;
            const netProfit = profitAmount - (chargeback + refund);
            return sum + netProfit;
          }
          return sum;
        }, 0);
        setTotalProfit(calculatedTotalProfit);

        const categories = summary?.topCallCategories || [];
        setCallCategorySummary(
          categories.map(item => ({
            name: item._id,
            value: item.count,
            fill: COLORS[categories.indexOf(item) % COLORS.length]
          }))
        );

        const performanceData = performanceRes.data?.data || [];
        setRawData(allLogs);
        processPerformanceData(allLogs, performanceData, performanceView);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err.message);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [performanceView]);

  const processPerformanceData = (data, performanceData, viewType) => {
    try {
      const groupedData = {};
      const employeeDetails = {};
      const allEmployees = new Set();

      const targetMap = {};
      performanceData.forEach(item => {
        const empId = item.employeeId;
        const targetNum = Number(item.target) || 0;
        if (!targetMap[empId]) {
          targetMap[empId] = {
            name: item.name,
            photo: item.photo
          };
        }
        targetMap[empId][item.month] = targetNum;
      });
      setTargetMapState(targetMap);

      data.forEach(item => {
        const empId = item.employeeId?._id || item.employeeId;
        const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
        if (!empId) return;

        const empKey = `${empId}|${empName}`;
        allEmployees.add(empKey);

        if (!employeeDetails[empKey]) {
          employeeDetails[empKey] = {
            id: empId,
            name: empName,
            totalSales: 0,
            totalTarget: 0,
            totalProfit: 0,
            performanceRatio: 0,
            monthlyTargets: {}
          };
        }

        let sales = 0;
        let profit = 0;
        if (item.wasSaleConverted === 'Yes') {
          const profitAmount = parseFloat(item.profitAmount) || 0;
          const chargeback = parseFloat(item.chargebackAmount) || 0;
          const refund = parseFloat(item.refundAmount) || 0;
          sales = profitAmount - (chargeback + refund);
          profit = profitAmount - (chargeback + refund);
        }

        employeeDetails[empKey].totalSales += sales;
        employeeDetails[empKey].totalProfit += profit;

        const date = dayjs(item.createdAt);
        let key;
        if (viewType === 'monthly') {
          key = date.format('MMM');
        } else if (viewType === 'weekly') {
          key = `W${date.isoWeek()} ${date.year()}`;
        } else {
          key = date.format('YYYY-MM-DD');
        }

        if (!groupedData[key]) groupedData[key] = {};
        if (!groupedData[key][empKey]) groupedData[key][empKey] = { sales: 0, target: 0 };

        groupedData[key][empKey].sales += sales;
        
        const currentMonth = dayjs().format('MMM');
        const empTarget = viewType === 'monthly' 
          ? (Number(targetMap[empId]?.[key]) || 0)
          : (Number(targetMap[empId]?.[currentMonth]) || 0);
        groupedData[key][empKey].target = empTarget;
      });

      const currentMonth = dayjs().format('MMM');
      Object.keys(employeeDetails).forEach(empKey => {
        const [empId] = empKey.split('|');
        const monthlyTargets = targetMap[empId] || {};
        const totalTargetSum = Object.keys(monthlyTargets)
          .filter(m => m !== 'name' && m !== 'photo')
          .reduce((sum, m) => sum + (Number(monthlyTargets[m]) || 0), 0);
        employeeDetails[empKey].totalTarget = totalTargetSum || (Number(targetMap[empId]?.[currentMonth]) || 0);
        employeeDetails[empKey].monthlyTargets = monthlyTargets;

        const emp = employeeDetails[empKey];
        emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
      });

      const formatted = Object.keys(groupedData)
        .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
        .map(key => {
          const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
          allEmployees.forEach(empKey => {
            const [empId] = empKey.split('|');
            row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
            row[`${empKey} Target`] = groupedData[key][empKey]?.target || 0;
          });
          return row;
        });

      const performers = Array.from(allEmployees)
        .filter(empKey => employeeDetails[empKey].totalSales > 0)
        .map(empKey => ({
          key: empKey,
          name: employeeDetails[empKey].name,
          id: employeeDetails[empKey].id,
          totalSales: employeeDetails[empKey].totalSales,
          performance: employeeDetails[empKey].performanceRatio,
          totalProfit: employeeDetails[empKey].totalProfit,
          monthlyTargets: employeeDetails[empKey].monthlyTargets
        }))
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 3);

      setTopPerformers(performers);
      setEmployeeDetails(employeeDetails);
      setChartData(formatted);

      const totalSales = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalSales, 0);
      const totalTarget = Object.values(employeeDetails).reduce((sum, e) => sum + e.totalTarget, 0);
      const remaining = Math.max(totalTarget - totalSales, 0);
      const perDayGoal = Math.ceil(remaining / 7);

      setTargetInfo({
        overall: { totalSales, totalTarget, remaining, perDayGoal },
        employees: employeeDetails
      });
    } catch (err) {
      console.error('Error processing performance data:', err);
      setError('Failed to process performance data');
    }
  };
  
  const filteredChartData = () => {
    if (!chartData || chartData.length === 0) return [];

    if (performanceView === 'monthly') {
      return selectedMonths.map(month => {
        const match = chartData.find(d => d.month === month);
        if (!match) {
          const row = { month };
          Object.keys(employeeDetails).forEach(empKey => {
            const [empId] = empKey.split('|');
            row[`${empKey} Sales`] = 0;
            row[`${empKey} Target`] = Number(targetMapState[empId]?.[month]) || 0;
          });
          return row;
        }
        return match;
      });
    } else if (performanceView === 'weekly') {
      return chartData.slice(-8);
    } else if (performanceView === 'daily') {
      return chartData.slice(-14);
    }
    return chartData;
  };

  const displayedEmployees = selectedEmployee === 'all'
    ? Object.keys(employeeDetails)
    : [selectedEmployee];

  const renderPerformanceCard = (employeeKey, index) => {
    const details = employeeDetails[employeeKey];
    if (!details) return null;

    const [id, name] = employeeKey.split('|');
    const sales = details.totalSales || 0;
    const target = details.totalTarget || 0;
    const percent = details.performanceRatio || 0;
    const profit = details.totalProfit || 0;

    let performanceData = [];
    if (performanceView === 'monthly') {
      performanceData = selectedMonths.map(month => {
        const data = chartData.find(d => d.month === month) || {};
        const saleVal = data[`${employeeKey} Sales`] || 0;
        const targetVal = data[`${employeeKey} Target`] || 0;
        return { 
          name: month, 
          performance: saleVal > 0 ? saleVal : 0,
          target: targetVal
        };
      });
    } else if (performanceView === 'weekly') {
      performanceData = filteredChartData().map(week => {
        const saleVal = week[`${employeeKey} Sales`] || 0;
        const targetVal = week[`${employeeKey} Target`] || 0;
        return { name: week.week, performance: saleVal, target: targetVal };
      });
    } else if (performanceView === 'daily') {
      performanceData = filteredChartData().map(day => {
        const saleVal = day[`${employeeKey} Sales`] || 0;
        const targetVal = day[`${employeeKey} Target`] || 0;
        return { name: day.date, performance: saleVal, target: targetVal };
      });
    }

    const getPerformanceColor = (percentage) => {
      if (percentage >= 100) return 'from-emerald-500 to-green-500';
      if (percentage >= 80) return 'from-blue-500 to-cyan-500';
      if (percentage >= 60) return 'from-amber-500 to-orange-500';
      return 'from-red-500 to-pink-500';
    };

    return (
      <div
        key={index}
        className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 hover:scale-[1.02]"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">{name}</h4>
              <p className="text-xs font-medium text-gray-500">ID: {id}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${percent >= 100
                ? 'bg-emerald-100 text-emerald-800'
                : percent >= 80
                  ? 'bg-blue-100 text-blue-800'
                  : percent >= 60
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
            >
              {Math.round(percent)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-3 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="flex items-center mb-1 text-xs font-semibold text-blue-700">
                <FiDollarSign className="mr-1" /> Net Profit
              </p>
              <p className="text-lg font-bold text-blue-900">
                ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="flex items-center mb-1 text-xs font-semibold text-purple-700">
                <FiTarget className="mr-1" /> Target
              </p>
              <p className="text-lg font-bold text-purple-900">
                ${target.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
              <span>Progress</span>
              <span>{Math.round(Math.max(0, Math.min(percent, 100)))}%</span>
            </div>
            <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
              <div
                className={`h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r ${getPerformanceColor(percent)}`}
                style={{
                  width: `${Math.min(percent, 100)}%`
                }}
              ></div>
            </div>
          </div>

          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <Line
                  type="monotone"
                  dataKey="performance"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 3, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5, stroke: '#4F46E5', strokeWidth: 2, fill: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const TopPerformerCard = ({ performer, index }) => {
    if (!performer || !employeeDetails[performer.key]) return null;

    const badgeColors = [
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-gray-400 to-gray-600',
      'bg-gradient-to-br from-amber-600 to-amber-800'
    ];
    const medalIcons = ['🥇', '🥈', '🥉'];
    const titles = ['Top Performer', 'Runner Up', 'Third Place'];

    const employeeData = employeeDetails[performer.key];
    const totalSales = employeeData.totalSales || 0;
    const totalTarget = employeeData.totalTarget || 0;
    const totalProfit = employeeData.totalProfit || 0;

    const monthlyPerformance = selectedMonths.map(month => {
      const data = chartData.find(d => d.month === month) || {};
      const sales = data[`${performer.key} Sales`] || 0;
      const target = data[`${performer.key} Target`] || Number(targetMapState[performer.id]?.[month]) || 0;
      const percentage = target > 0 ? (sales / target) * 100 : 0;
      return {
        month,
        percentage,
        target,
        sales
      };
    });

    const validMonths = monthlyPerformance.filter(m => m.target > 0 && m.percentage > 0);
    const avgMonthlyPerformance = validMonths.length > 0
      ? Math.round(validMonths.reduce((sum, m) => sum + m.percentage, 0) / validMonths.length)
      : 0;

    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 4;
    const visibleMonths = monthlyPerformance.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
      setStartIndex(prev => Math.max(prev - itemsPerPage, 0));
    };

    const handleNext = () => {
      if (startIndex + itemsPerPage < monthlyPerformance.length) {
        setStartIndex(prev => prev + itemsPerPage);
      }
    };

    return (
      <div className={`rounded-2xl p-6 shadow-xl ${badgeColors[index] || 'bg-gray-300'} text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 bg-white rounded-full opacity-10"></div>
        
        <div className="relative z-10 flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold opacity-90">{titles[index] || 'Performer'}</h3>
            <h2 className="mt-1 text-2xl font-bold">{performer.name}</h2>
            <p className="text-sm font-medium opacity-80">ID: {performer.id}</p>
          </div>
          <div className="text-4xl">{medalIcons[index] || ''}</div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mb-5">
          <div className="p-3 bg-black bg-opacity-20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold opacity-90">Total Sales</p>
            <p className="text-xl font-bold">
              ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs opacity-80">Target: ${totalTarget.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-black bg-opacity-20 rounded-xl backdrop-blur-sm">
            <p className="text-xs font-semibold opacity-90">Avg Monthly</p>
            <p className="text-xl font-bold">{avgMonthlyPerformance}%</p>
          </div>
        </div>

        <div className="relative z-10 w-full">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="px-3 py-1 text-sm font-semibold text-white bg-black cursor-pointer bg-opacity-30 rounded-xl disabled:opacity-50 backdrop-blur-sm"
            >
              ◀
            </button>
            <span className="text-sm font-semibold">Monthly Performance</span>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
              className="px-3 py-1 text-sm font-semibold text-white bg-black cursor-pointer bg-opacity-30 rounded-xl disabled:opacity-50 backdrop-blur-sm"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            {visibleMonths.map((monthData, i) => (
              <div key={i} className="p-2 bg-black rounded-lg bg-opacity-20 backdrop-blur-sm">
                <p className="font-bold">{monthData.month}</p>
                <p className={`font-semibold ${monthData.target === 0 ? 'text-gray-300' : ''}`}>
                  {monthData.target === 0 ? 'N/A' : `${monthData.percentage.toFixed(1)}%`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const getXAxisLabel = () => {
    switch (performanceView) {
      case 'monthly': return 'Months';
      case 'weekly': return 'Weeks';
      case 'daily': return 'Days';
      default: return 'Time Period';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Dashboard Header */}
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-transparent text-gray-900 md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Sales Performance Dashboard
          </h1>
          <p className="mt-2 font-medium text-gray-600">Track and analyze your team's sales performance in real-time</p>
        </div>
        <div className="flex mt-4 space-x-3 md:mt-0">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold flex items-center transition-all duration-300 ${activeTab === 'monthly' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-700 border border-gray-300 hover:shadow-md'}`}
          >
            <FiCalendar className="mr-2" /> Monthly
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold flex items-center transition-all duration-300 ${activeTab === 'yearly' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
              : 'bg-gray-300 text-gray-700 border border-gray-300 hover:shadow-md'}`}
          >
            <FiBarChart2 className="mr-2" /> Yearly
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-6 mb-6 text-red-800 border border-red-300 shadow-sm rounded-2xl bg-red-50">
          <p className="font-semibold">Error loading data:</p>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 font-medium text-gray-600">Loading performance data...</p>
          </div>
        </div>
      ) : targetInfo ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-2 text-sm font-semibold text-gray-600">
                    <FaDollarSign className="mr-2" /> Total Net Profit
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 text-green-600 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                  <FaDollarSign className="text-2xl" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
                  <span>Target Progress</span>
                  <span>{Math.round((targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                    style={{
                      width: `${Math.min(100, (targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-2 text-sm font-semibold text-gray-600">
                    <FaBullseye className="mr-2" /> Remaining Target
                  </p>
                  <p className="text-2xl font-bold text-gray-900">${targetInfo.overall.remaining.toLocaleString()}</p>
                </div>
                <div className="p-3 text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <FaBullseye className="text-2xl" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="mb-1 text-sm font-medium text-gray-600">Daily Goal (7 days)</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${targetInfo.overall.perDayGoal.toLocaleString()} per day
                </p>
              </div>
            </div>

            <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-2 text-sm font-semibold text-gray-600">
                    <FiUsers className="mr-2" /> Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(employeeDetails).length}</p>
                </div>
                <div className="p-3 text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <FiUsers className="text-2xl" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="mb-1 text-sm font-medium text-gray-600">Active this period</p>
                <p className="text-lg font-semibold text-gray-800">
                  {Object.keys(employeeDetails).length} employees
                </p>
              </div>
            </div>

            <div className="p-6 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-xl hover:border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-2 text-sm font-semibold text-gray-600">
                    <FiAward className="mr-2" /> Top Performer
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'}
                  </p>
                </div>
                <div className="p-3 text-yellow-600 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                  <FiAward className="text-2xl" />
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="mb-1 text-sm font-medium text-gray-600">Performance</p>
                <p className="text-lg font-semibold text-gray-800">
                  {topPerformers.length > 0 ? Math.round(topPerformers[0].performance) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* {callCategorySummary?.length > 0 && (
            <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <h3 className="flex items-center mb-5 text-2xl font-bold text-gray-900">
                <FiPieChart className="mr-3 text-blue-600" /> 
                Call Category Distribution
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={callCategorySummary}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      innerRadius={60}
                      dataKey="value"
                    >
                      {callCategorySummary.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )} */}



          {callCategorySummary?.length > 0 && (
  <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
    <h3 className="flex items-center mb-6 text-2xl font-bold text-gray-900">
      <FiPieChart className="mr-3 text-blue-600" /> 
      Call Category Distribution
    </h3>

    {/* Left-Right Grid */}
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

      {/* LEFT — PIE CHART */}
      <div className="flex items-center justify-center w-full border h-80 bg-gray-50 rounded-xl">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={callCategorySummary}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {callCategorySummary.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: 20 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RIGHT — TABLE VIEW */}
      <div className="p-4 overflow-hidden border bg-gray-50 rounded-xl">
        <h4 className="mb-3 text-lg font-semibold text-gray-800">Category Summary</h4>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-700 bg-gray-200">
              <th className="p-2">Category</th>
              <th className="p-2 text-center">Count</th>
              <th className="p-2 text-center">Percentage</th>
            </tr>
          </thead>

          <tbody>
            {callCategorySummary.map((item, index) => (
              <tr
                key={index}
                className="text-black transition-all border-b hover:bg-gray-100"
              >
                <td className="flex items-center gap-2 p-3 font-medium ">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill || COLORS[index % COLORS.length] }}
                  ></span>
                  {item.name}
                </td>
                <td className="p-3 text-center">{item.value}</td>
                <td className="p-3 font-semibold text-center">
                  {((item.value /
                    callCategorySummary.reduce((sum, d) => sum + d.value, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
)}


          {topPerformers.length > 0 && (
            <div className="mb-8">
              <h3 className="flex items-center mb-5 text-2xl font-bold text-gray-900">
                <FiAward className="mr-3 text-yellow-500" /> 
                Top Performers
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {topPerformers.map((performer, index) => (
                  <TopPerformerCard
                    key={index}
                    performer={performer}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <h3 className="flex items-center mb-4 text-xl font-bold text-gray-900">
              <FiFilter className="mr-3 text-blue-600" /> 
              Filter Data
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-3 text-base font-semibold text-gray-800">Time Period</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setPerformanceView('monthly')}
                    className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm ${performanceView === 'monthly'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-400 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setPerformanceView('daily')}
                    className={`cursor-pointer px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm ${performanceView === 'daily'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-400 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                      }`}
                  >
                    Daily
                  </button>
                </div>
              </div>

              {performanceView === 'monthly' && (
                <div>
                  <label className="block mb-3 text-base font-semibold text-gray-800">Months</label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                      <button
                        key={month}
                        onClick={() => {
                          if (selectedMonths.includes(month)) {
                            setSelectedMonths(selectedMonths.filter(m => m !== month));
                          } else {
                            setSelectedMonths([...selectedMonths, month]);
                          }
                        }}
                        className={`cursor-pointer py-2 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${selectedMonths.includes(month)
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'bg-gray-400 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-3 text-base font-semibold text-gray-800">Employee</label>
                <div className="relative">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="block w-full px-4 py-3 text-sm !text-gray-900 bg-white border border-gray-300 rounded-xl shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  >
                    <option value="all">All Employees</option>
                    {Object.keys(employeeDetails).map(empKey => {
                      const [id, name] = empKey.split('|');
                      return (
                        <option key={id} value={empKey} className="text-gray-900">
                          {id} - {name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Performance Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Team Performance</h3>
              {Object.keys(employeeDetails).length > 3 && (
                <button
                  onClick={() => setShowAllEmployees(!showAllEmployees)}
                  className="text-sm !text-blue-600 hover:text-blue-800 flex items-center font-semibold"
                >
                  {showAllEmployees ? (
                    <>
                      <FiChevronUp className="mr-2" /> Show Less
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="mr-2" /> Show More
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(showAllEmployees ? Object.keys(employeeDetails) : Object.keys(employeeDetails).slice(0, 3)).map((empKey, index) =>
                renderPerformanceCard(empKey, index)
              )}
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="p-6 mb-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
            <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {performanceView === 'monthly' && '📈 Monthly Performance Trend'}
                {performanceView === 'weekly' && '📈 Weekly Performance Trend'}
                {performanceView === 'daily' && '📈 Daily Performance Trend'}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">View:</span>
                <div className="relative">
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="block w-full px-4 py-2 text-sm !text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  >
                    <option value="all" className="text-gray-900">
                      All Employees
                    </option>
                    {Object.keys(employeeDetails).map((empKey) => {
                      const [id, name] = empKey.split("|");
                      return (
                        <option key={id} value={empKey} className="text-gray-900">
                          {id} - {name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="min-w-[1000px] h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    barSize={32}
                    barGap={8}
                    barCategoryGap={24}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                      strokeWidth={1}
                    />
                    <XAxis
                      dataKey={performanceView === 'monthly' ? 'month' : performanceView === 'weekly' ? 'week' : 'date'}
                      tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={false}
                      label={{
                        value: getXAxisLabel(),
                        position: 'bottom',
                        offset: 40,
                        fill: '#6b7280',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                      angle={performanceView === 'daily' ? -45 : 0}
                      textAnchor={performanceView === 'daily' ? 'end' : 'middle'}
                    />
                    <YAxis
                      tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={false}
                      label={{
                        value: 'Amount ($)',
                        angle: -90,
                        position: 'left',
                        offset: 15,
                        fill: '#6b7280',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      itemStyle={{ color: '#1f2937', padding: '6px 0', textTransform: 'capitalize' }}
                      labelStyle={{ 
                        fontWeight: '700', 
                        color: '#111827', 
                        marginBottom: '10px', 
                        borderBottom: '2px solid #f3f4f6', 
                        paddingBottom: '8px',
                        fontSize: '15px'
                      }}
                      formatter={(value, name) => {
                        const amount = new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(value);
                        const cleanName = name.replace(' Sales', '').replace(' Target', '');
                        return [amount, cleanName];
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      wrapperStyle={{ 
                        paddingBottom: 30, 
                        fontSize: '14px', 
                        fontWeight: 600,
                        color: '#374151'
                      }}
                      iconSize={14}
                      iconType="circle"
                      formatter={(value) => value.replace(/ (Sales|Target)$/, '')}
                    />
                    {displayedEmployees.map((empKey, index) => {
                      const [id, name] = empKey.split('|');
                      const baseColor = COLORS[index % COLORS.length];
                      return (
                        <React.Fragment key={empKey}>
                          <Bar
                            dataKey={`${empKey} Sales`}
                            fill={baseColor}
                            name={`${name} Sales`}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1400}
                            animationEasing="ease-out"
                          />
                          <Bar
                            dataKey={`${empKey} Target`}
                            fill={`${baseColor}22`}
                            stroke={baseColor}
                            strokeWidth={2}
                            strokeDasharray="5 3"
                            name={`${name} Target`}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1600}
                            animationEasing="ease-out"
                          />
                        </React.Fragment>
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center text-sm font-medium text-gray-600">
                <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-full"></span>
                <span className="mr-4">Sales</span>
                <span className="inline-block w-4 h-4 mr-2 border-2 border-blue-500 rounded-full bg-blue-500/20"></span>
                <span>Target</span>
              </div>
              <div className="text-sm font-medium text-gray-600">
                {performanceView === 'monthly' && `Showing: ${selectedMonths.join(', ')}`}
                {performanceView === 'weekly' && `Showing: Last 8 weeks`}
                {performanceView === 'daily' && `Showing: Last 14 days`}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl text-gray-400">📊</div>
          <p className="text-lg font-medium text-gray-500">No performance data available</p>
          <p className="mt-2 text-gray-400">Start tracking sales to see performance metrics</p>
        </div>
      )}
    </div>
  );
};

export default SalesChart;