

//=======================================
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
//   Pie,
//   LabelList
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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

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


// const employeePerformance = [
//   { name: 'Krishna', sales: 100 },
//   { name: 'Amit', sales: 90 },
//   { name: 'Priya', sales: 120 },
//   { name: 'Rahul', sales: 85 },
//   { name: 'Sneha', sales: 95 }
// ];
//   const employeeNames = employeePerformance.map((emp) => emp.name);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch profit data
//         const profitRes = await axios.get(`${API_URL}/call-logs/summary`);
//         const profit = parseFloat(profitRes.data?.totalProfit || profitRes.data?.data?.totalProfit || 0);
//         setTotalProfit(profit);

//         // Fetch call summary
//         const callSummaryRes = await axios.get(`${API_URL}/call-logs/summary`);
//         const categories = callSummaryRes.data?.data?.topCallCategories || [];
//         setCallCategorySummary(categories.map(item => ({
//           name: item._id,
//           value: item.count,
//         })));

//         // Fetch performance data
//         const token = localStorage.getItem('token');
//         const performanceRes = await axios.get(`${API_URL}/performance/performance/all`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (performanceRes.data.status === 'success' && performanceRes.data.data) {
//           setRawData(performanceRes.data.data);
//           processPerformanceData(performanceRes.data.data, performanceView);
//         } else {
//           throw new Error('Invalid performance data structure');
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (rawData.length > 0) {
//       processPerformanceData(rawData, performanceView);
//     }
//   }, [performanceView, rawData]);

//   const processPerformanceData = (rawData, viewType = 'monthly') => {
//     try {
//       let groupedData = {};
//       const allEmployees = new Set();
//       const employeeDetails = {};

//       // Initialize employee details
//       rawData.forEach(item => {
//         if (item.name && item.employeeId) {
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           allEmployees.add(employeeKey);

//           if (!employeeDetails[employeeKey]) {
//             employeeDetails[employeeKey] = {
//               id: item.employeeId,
//               name: item.name,
//               totalSales: 0,
//               totalTarget: 0,
//               totalProfit: 0,
//               performanceRatio: 0
//             };
//           }
//         }
//       });

//       // Process data based on view type
//       if (viewType === 'monthly') {
//         const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//         const normalizeMonth = (m) => {
//           const lower = m.toLowerCase();
//           const map = {
//             jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
//             may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
//             sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
//           };
//           return map[lower.substring(0, 3)] || m;
//         };

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.month) return;

//           const month = normalizeMonth(item.month);
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0);
//           const target = parseFloat(item.target || 0);
//           const profit = parseFloat(item.profit || 0);

//           if (!groupedData[month]) groupedData[month] = {};
//           if (!groupedData[month][employeeKey]) {
//             groupedData[month][employeeKey] = { sales: 0, target: 0 };
//           }

//           groupedData[month][employeeKey].sales += sales;
//           groupedData[month][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = monthOrder
//           .filter(month => groupedData[month])
//           .map(month => {
//             const row = { month };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = groupedData[month][empKey]?.sales || 0;
//               row[`${empKey} Target`] = groupedData[month][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       }
//       else if (viewType === 'weekly') {
//         const weeklyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date);
//           const week = date.week();
//           const year = date.year();
//           const weekKey = `W${week} ${year}`;
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0);
//           const target = parseFloat(item.target || 0);
//           const profit = parseFloat(item.profit || 0);

//           if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
//           if (!weeklyData[weekKey][employeeKey]) {
//             weeklyData[weekKey][employeeKey] = { sales: 0, target: 0 };
//           }

//           weeklyData[weekKey][employeeKey].sales += sales;
//           weeklyData[weekKey][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(weeklyData)
//           .sort((a, b) => {
//             const [weekA, yearA] = a.split(' ').map(Number);
//             const [weekB, yearB] = b.split(' ').map(Number);
//             return yearA === yearB ? weekA - weekB : yearA - yearB;
//           })
//           .map(week => {
//             const row = { week };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = weeklyData[week][empKey]?.sales || 0;
//               row[`${empKey} Target`] = weeklyData[week][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       }
//       else if (viewType === 'daily') {
//         const dailyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date).format('YYYY-MM-DD');
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0);
//           const target = parseFloat(item.target || 0);
//           const profit = parseFloat(item.profit || 0);

//           if (!dailyData[date]) dailyData[date] = {};
//           if (!dailyData[date][employeeKey]) {
//             dailyData[date][employeeKey] = { sales: 0, target: 0 };
//           }

//           dailyData[date][employeeKey].sales += sales;
//           dailyData[date][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(dailyData)
//           .sort((a, b) => new Date(a) - new Date(b))
//           .map(date => {
//             const row = { date };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = dailyData[date][empKey]?.sales || 0;
//               row[`${empKey} Target`] = dailyData[date][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       }

//       // Calculate performance ratios
//       Object.keys(employeeDetails).forEach(empKey => {
//         employeeDetails[empKey].performanceRatio = employeeDetails[empKey].totalTarget > 0
//           ? (employeeDetails[empKey].totalSales / employeeDetails[empKey].totalTarget) * 100
//           : 0;
//       });

//       // Determine top performers
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
//         .sort((a, b) => b.performance - a.performance)
//         .slice(0, 3);

//       setTopPerformers(performers);
//       setEmployeeDetails(employeeDetails);

//       // Calculate overall metrics
//       const overallSales = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalSales, 0);
//       const overallTarget = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalTarget, 0);
//       const remaining = Math.max(overallTarget - overallSales, 0);
//       const perDayGoal = Math.ceil(remaining / 7);

//       setTargetInfo({
//         overall: {
//           totalSales: overallSales,
//           totalTarget: overallTarget,
//           remaining,
//           perDayGoal
//         },
//         employees: employeeDetails,
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
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = 0;
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
//     const sales = details.totalSales;
//     const target = details.totalTarget;
//     const percent = details.performanceRatio;
//     const profit = details.totalProfit;

//     let performanceData = [];
//     if (performanceView === 'monthly') {
//       performanceData = selectedMonths.map(month => ({
//         name: month,
//         performance: Math.round(
//           (chartData.find(d => d.month === month)?.[`${employeeKey} Sales`] /
//             chartData.find(d => d.month === month)?.[`${employeeKey} Target`] || 0) * 100
//       )}));
//     } else if (performanceView === 'weekly') {
//       performanceData = filteredChartData().map(week => ({
//         name: week.week,
//         performance: Math.round(
//           (week[`${employeeKey} Sales`] / week[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     } else if (performanceView === 'daily') {
//       performanceData = filteredChartData().map(day => ({
//         name: day.date,
//         performance: Math.round(
//           (day[`${employeeKey} Sales`] / day[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     }

//     return (
//       <div key={index} className="overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-blue-100">
//         <div className="p-5">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
//               <p className="text-xs text-gray-500">ID: {id}</p>
//             </div>
//             <span className={`px-2 py-1 text-xs rounded-full font-medium ${percent >= 100 ? 'bg-green-100 text-green-800' :
//               percent >= 75 ? 'bg-blue-100 text-blue-800' :
//                 percent >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//               }`}>
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
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
//                   background: percent >= 100 ? 'linear-gradient(90deg, #10B981, #34D399)' :
//                     percent >= 75 ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' :
//                       percent >= 50 ? 'linear-gradient(90deg, #F59E0B, #FBBF24)' : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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

//     const monthlyPerformance = selectedMonths.map((month) => {
//       const sales = chartData.find((d) => d.month === month)?.[`${performer.key} Sales`] || 0;
//       const target = chartData.find((d) => d.month === month)?.[`${performer.key} Target`] || 0;
//       return {
//         month,
//         percentage: target > 0 ? Math.round((sales / target) * 100) : 0,
//         target
//       };
//     });

//     const validMonths = monthlyPerformance.filter((m) => m.target > 0);
//     const avgMonthlyPerformance = validMonths.length > 0
//       ? Math.round(validMonths.reduce((sum, m) => sum + m.percentage, 0) / validMonths.length)
//       : 0;

//     const [startIndex, setStartIndex] = useState(0);
//     const itemsPerPage = 4;
//     const visibleMonths = monthlyPerformance.slice(startIndex, startIndex + itemsPerPage);

//     const handlePrev = () => {
//       setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
//     };

//     const handleNext = () => {
//       if (startIndex + itemsPerPage < monthlyPerformance.length) {
//         setStartIndex((prev) => prev + itemsPerPage);
//       }
//     };

//     return (
//       <div className={`rounded-xl p-5 shadow-md ${badgeColors[index] || 'bg-gray-300'} text-white`}>
//         <div className="flex items-start justify-between mb-4">
//           <div>
//             <h3 className="text-lg font-semibold">{titles[index]}</h3>
//             <h2 className="mt-1 text-xl font-bold">{performer.name}</h2>
//             <p className="text-sm opacity-80">ID: {performer.id}</p>
//           </div>
//           <div className="text-3xl">{medalIcons[index] || ''}</div>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `${monthData.percentage}%`}
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                   <span>{Math.round((targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%`
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                       }`}
//                   >
//                     Weekly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
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
//               {employeeNames.length > 4 && (
//                 <button
//                   onClick={() => setShowAllEmployees(!showAllEmployees)}
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
//               {(showAllEmployees ? employeeNames : employeeNames.slice(0, 3)).map((employee, index) =>
//                 renderPerformanceCard(employee, index)
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
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option>All Employees</option>
//                     {employeeNames.map(name => (
//                       <option key={name} value={name}>{name}</option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none right-3">
//                     <svg className="w-2 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 24">
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
//                       tick={{
//                         fill: '#4B5563',
//                         fontSize: 12,
//                         fontWeight: 500
//                       }}
//                       axisLine={{
//                         stroke: '#E5E7EB',
//                         strokeWidth: 1
//                       }}
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
//                       tick={{
//                         fill: '#4B5563',
//                         fontSize: 12,
//                         fontWeight: 500
//                       }}
//                       axisLine={{
//                         stroke: '#E5E7EB',
//                         strokeWidth: 1
//                       }}
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
//                       itemStyle={{
//                         color: '#1F2937',
//                         padding: '4px 0',
//                         textTransform: 'capitalize'
//                       }}
//                       labelStyle={{
//                         fontWeight: '600',
//                         color: '#111827',
//                         marginBottom: '8px',
//                         borderBottom: '1px solid #F3F4F6',
//                         paddingBottom: '6px'
//                       }}
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
//                       wrapperStyle={{
//                         paddingBottom: 25,
//                         fontSize: '0.8125rem',
//                         fontWeight: 500
//                       }}
//                       iconSize={12}
//                       iconType="circle"
//                       formatter={(value) => {
//                         return value.replace(' Sales', '').replace(' Target', '');
//                       }}
//                     />

//                     {displayedEmployees.map((name, index) => {
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

//=====================correct=====================
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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         const allLogs = await fetchAllPages(token);
//         const [summaryRes] = await Promise.all([
//           axios.get(`${API_URL}/call-logs/summary`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         const summary = summaryRes.data?.data || {};
//         setTotalProfit(parseFloat(summary?.totalProfit || 0));
//         const categories = summary?.topCallCategories || [];
//         setCallCategorySummary(
//           categories.map(item => ({
//             name: item._id,
//             value: item.count
//           }))
//         );

//         setRawData(allLogs);
//         processPerformanceData(allLogs, performanceView);
//       } catch (err) {
//         console.error('Error fetching data:', err.response?.data || err.message);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchAllPages = async (token) => {
//       let allLogs = [];
//       let page = 1;
//       while (true) {
//         const res = await axios.get(`${API_URL}/call-logs`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page }
//         });
//         allLogs = [...allLogs, ...res.data.data];
//         if (page >= res.data.pagination.totalPages) break;
//         page++;
//       }
//       return allLogs;
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (data, viewType) => {
//     try {
//       const groupedData = {};
//       const employeeDetails = {};
//       const allEmployees = new Set();

//       data.forEach(item => {
//         const empId = item.employeeId?._id || item.employeeId;
//         const empName = item.employeeId?.name || 'Unknown';
//         if (!empId) return; // Skip entries with no employeeId

//         const empKey = `${empId}|${empName}`;
//         allEmployees.add(empKey);

//         if (!employeeDetails[empKey]) {
//           employeeDetails[empKey] = {
//             id: empId,
//             name: empName,
//             totalSales: 0,
//             totalTarget: 0, // Placeholder, adjust if target exists
//             totalProfit: 0,
//             performanceRatio: 0
//           };
//         }

//         const sales = item.wasSaleConverted === 'Yes' ? parseFloat(item.profitAmount || 0) : 0;
//         const profit = parseFloat(item.profitAmount || 0);

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
//       });

//       const formatted = Object.keys(groupedData)
//         .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//         .map(key => {
//           const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//           allEmployees.forEach(empKey => {
//             row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//             row[`${empKey} Target`] = 0; // Placeholder, adjust if target exists
//           });
//           return row;
//         });

//       Object.keys(employeeDetails).forEach(empKey => {
//         const emp = employeeDetails[empKey];
//         emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
//       });

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
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = 0;
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
//               className={`px-2 py-1 text-xs rounded-full font-medium ${
//                 percent >= 100
//                   ? 'bg-green-100 text-green-800'
//                   : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
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
//                       ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                       : percent >= 50
//                       ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                       : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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
//       return {
//         month,
//         percentage: sales,
//         target: 0 // Placeholder
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0);
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
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `$${monthData.percentage.toFixed(2)}`}
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                   <span>{Math.round((targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%`
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Weekly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
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
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>{name}</option>
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
//                     {displayedEmployees.map((name, index) => {
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

//======================correct==================

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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';
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
//           axios.get(`${PERFORMANCE_API_URL}/performance/performance/all`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         const summary = summaryRes.data?.data || {};
//         setTotalProfit(parseFloat(summary?.totalProfit || 0));
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

//     const fetchAllPages = async (token) => {
//       let allLogs = [];
//       let page = 1;
//       while (true) {
//         const res = await axios.get(`${API_URL}/call-logs`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page }
//         });
//         allLogs = [...allLogs, ...res.data.data];
//         if (page >= res.data.pagination.totalPages) break;
//         page++;
//       }
//       return allLogs;
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (data, performanceData, viewType) => {
//     try {
//       const groupedData = {};
//       const employeeDetails = {};
//       const allEmployees = new Set();

//       // Map performance targets by employeeId and month
//       const targetMap = {};
//       const currentMonth = dayjs().format('MMM'); // e.g., 'Aug'
//       performanceData.forEach(item => {
//         if (item.month === currentMonth) {
//           targetMap[item.employeeId] = {
//             target: item.target || 0,
//             name: item.name,
//             photo: item.photo
//           };
//         }
//       });

//       data.forEach(item => {
//         const empId = item.employeeId?._id || item.employeeId;
//         const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
//         if (!empId) return; // Skip entries with no employeeId

//         const empKey = `${empId}|${empName}`;
//         allEmployees.add(empKey);

//         if (!employeeDetails[empKey]) {
//           employeeDetails[empKey] = {
//             id: empId,
//             name: empName,
//             totalSales: 0,
//             totalTarget: targetMap[empId]?.target || 0,
//             totalProfit: 0,
//             performanceRatio: 0
//           };
//         }

//         const sales = item.wasSaleConverted === 'Yes' ? parseFloat(item.profitAmount || 0) : 0;
//         const profit = parseFloat(item.profitAmount || 0);

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
//         groupedData[key][empKey].target = targetMap[empId]?.target || 0;
//       });

//       const formatted = Object.keys(groupedData)
//         .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//         .map(key => {
//           const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//           allEmployees.forEach(empKey => {
//             const [empId] = empKey.split('|');
//             row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//             row[`${empKey} Target`] = targetMap[empId]?.target || 0;
//           });
//           return row;
//         });

//       Object.keys(employeeDetails).forEach(empKey => {
//         const emp = employeeDetails[empKey];
//         emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
//       });

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
//               className={`px-2 py-1 text-xs rounded-full font-medium ${
//                 percent >= 100
//                   ? 'bg-green-100 text-green-800'
//                   : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
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
//                       ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                       : percent >= 50
//                       ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                       : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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
//       const [empId] = performer.key.split('|');
//       return {
//         month,
//         percentage: sales,
//         target: data[`${performer.key} Target`] || employeeDetails[performer.key]?.totalTarget || 0
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0);
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
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `$${monthData.percentage.toFixed(2)}`}
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Weekly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
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
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>{name}</option>
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
//                     {displayedEmployees.map((name, index) => {
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

//================correct=======================

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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';
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
//         setTotalProfit(parseFloat(summary?.totalProfit || 0));
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

//     const fetchAllPages = async (token) => {
//       let allLogs = [];
//       let page = 1;
//       while (true) {
//         const res = await axios.get(`${API_URL}/call-logs`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page }
//         });
//         allLogs = [...allLogs, ...res.data.data];
//         if (page >= res.data.pagination.totalPages) break;
//         page++;
//       }
//       return allLogs;
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (data, performanceData, viewType) => {
//     try {
//       const groupedData = {};
//       const employeeDetails = {};
//       const allEmployees = new Set();

//       // Map performance targets by employeeId and month
//       const targetMap = {};
//       const currentMonth = dayjs().format('MMM'); // e.g., 'Aug'
//       performanceData.forEach(item => {
//         if (item.month === currentMonth) {
//           targetMap[item.employeeId] = {
//             target: item.target || 0,
//             name: item.name,
//             photo: item.photo
//           };
//         }
//       });

//       data.forEach(item => {
//         const empId = item.employeeId?._id || item.employeeId;
//         const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
//         if (!empId) return; // Skip entries with no employeeId

//         const empKey = `${empId}|${empName}`;
//         allEmployees.add(empKey);

//         if (!employeeDetails[empKey]) {
//           employeeDetails[empKey] = {
//             id: empId,
//             name: empName,
//             totalSales: 0,
//             totalTarget: targetMap[empId]?.target || 0,
//             totalProfit: 0,
//             performanceRatio: 0
//           };
//         }

//         const sales = item.wasSaleConverted === 'Yes' ? parseFloat(item.profitAmount || 0) : 0;
//         const profit = parseFloat(item.profitAmount || 0);

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
//         groupedData[key][empKey].target = targetMap[empId]?.target || 0;
//       });

//       const formatted = Object.keys(groupedData)
//         .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
//         .map(key => {
//           const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
//           allEmployees.forEach(empKey => {
//             const [empId] = empKey.split('|');
//             row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
//             row[`${empKey} Target`] = targetMap[empId]?.target || 0;
//           });
//           return row;
//         });

//       Object.keys(employeeDetails).forEach(empKey => {
//         const emp = employeeDetails[empKey];
//         emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
//       });

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
//               className={`px-2 py-1 text-xs rounded-full font-medium ${
//                 percent >= 100
//                   ? 'bg-green-100 text-green-800'
//                   : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
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
//                       ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                       : percent >= 50
//                       ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                       : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   {/* <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Weekly
//                   </button> */}
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 !text-white'
//                       : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
//                     }`}
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                   {/* <select
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
//                           {id} - {name}
//                         </option>
//                       );
//                     })}
//                   </select> */}

//                   <select
//   value={selectedEmployee}
//   onChange={(e) => setSelectedEmployee(e.target.value)}
//   className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// >
//   <option value="all" className="text-gray-900">
//     All Employees
//   </option>
//   {Object.keys(employeeDetails).map(empKey => {
//     const [id, name] = empKey.split('|');
//     return (
//       <option key={empKey} value={empKey} className="text-gray-900">
//         {id} - {name}
//       </option>
//     );
//   })}
// </select>

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
//                   {/* <select
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>{name}</option>
//                       );
//                     })}
//                   </select> */}


// <select
//   className="block w-full px-4 py-2 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//   value={selectedEmployee}
//   onChange={(e) => setSelectedEmployee(e.target.value)}
// >
//   <option value="all" className="text-gray-900">
//     All Employees
//   </option>
//   {Object.keys(employeeDetails).map(empKey => {
//     const [, name] = empKey.split('|');
//     return (
//       <option key={empKey} value={empKey} className="text-gray-900">
//         {name}
//       </option>
//     );
//   })}
// </select>


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
//                     {displayedEmployees.map((name, index) => {
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


//======================net profit=====

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
  FiChevronUp
} from 'react-icons/fi';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);
import { FaDollarSign } from 'react-icons/fa';

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
            console.log(`Log ID: ${log._id}, Net Profit: ${netProfit}`);
            return sum + netProfit;
          }
          return sum;
        }, 0);
        setTotalProfit(calculatedTotalProfit);

        const categories = summary?.topCallCategories || [];
        setCallCategorySummary(
          categories.map(item => ({
            name: item._id,
            value: item.count
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

      // Map performance targets by employeeId and month
      const targetMap = {};
      const currentMonth = dayjs().format('MMM'); // e.g., 'Aug'
      performanceData.forEach(item => {
        if (item.month === currentMonth) {
          targetMap[item.employeeId] = {
            target: item.target || 0,
            name: item.name,
            photo: item.photo
          };
        }
      });

      data.forEach(item => {
        const empId = item.employeeId?._id || item.employeeId;
        const empName = item.employeeId?.name || targetMap[empId]?.name || 'Unknown';
        if (!empId) return; // Skip entries with no employeeId

        const empKey = `${empId}|${empName}`;
        allEmployees.add(empKey);

        if (!employeeDetails[empKey]) {
          employeeDetails[empKey] = {
            id: empId,
            name: empName,
            totalSales: 0,
            totalTarget: targetMap[empId]?.target || 0,
            totalProfit: 0,
            performanceRatio: 0
          };
        }

        // Calculate net profit for sales and profit
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
          key = date.format('MMM'); // e.g., 'Aug'
        } else if (viewType === 'weekly') {
          key = `W${date.isoWeek()} ${date.year()}`;
        } else {
          key = date.format('YYYY-MM-DD');
        }

        if (!groupedData[key]) groupedData[key] = {};
        if (!groupedData[key][empKey]) groupedData[key][empKey] = { sales: 0, target: 0 };

        groupedData[key][empKey].sales += sales;
        groupedData[key][empKey].target = targetMap[empId]?.target || 0;
      });

      const formatted = Object.keys(groupedData)
        .sort((a, b) => (viewType === 'daily' ? new Date(a) - new Date(b) : a.localeCompare(b)))
        .map(key => {
          const row = viewType === 'daily' ? { date: key } : viewType === 'weekly' ? { week: key } : { month: key };
          allEmployees.forEach(empKey => {
            const [empId] = empKey.split('|');
            row[`${empKey} Sales`] = groupedData[key][empKey]?.sales || 0;
            row[`${empKey} Target`] = targetMap[empId]?.target || 0;
          });
          return row;
        });

      Object.keys(employeeDetails).forEach(empKey => {
        const emp = employeeDetails[empKey];
        emp.performanceRatio = emp.totalTarget > 0 ? (emp.totalSales / emp.totalTarget) * 100 : 0;
      });

      const performers = Array.from(allEmployees)
        .filter(empKey => employeeDetails[empKey].totalSales > 0)
        .map(empKey => ({
          key: empKey,
          name: employeeDetails[empKey].name,
          id: employeeDetails[empKey].id,
          totalSales: employeeDetails[empKey].totalSales,
          performance: employeeDetails[empKey].performanceRatio,
          totalProfit: employeeDetails[empKey].totalProfit
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
            row[`${empKey} Target`] = employeeDetails[empKey]?.totalTarget || 0;
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
        return { name: month, performance: saleVal > 0 ? saleVal : 0 };
      });
    } else if (performanceView === 'weekly') {
      performanceData = filteredChartData().map(week => {
        const saleVal = week[`${employeeKey} Sales`] || 0;
        return { name: week.week, performance: saleVal };
      });
    } else if (performanceView === 'daily') {
      performanceData = filteredChartData().map(day => {
        const saleVal = day[`${employeeKey} Sales`] || 0;
        return { name: day.date, performance: saleVal };
      });
    }

    return (
      <div
        key={index}
        className="overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md hover:border-blue-100"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{name}</h4>
              <p className="text-xs text-gray-500">ID: {id}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${percent >= 100
                ? 'bg-green-100 text-green-800'
                : percent >= 75
                  ? 'bg-blue-100 text-blue-800'
                  : percent >= 50
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
            >
              {Math.round(percent)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="flex items-center mb-1 text-xs text-gray-600">
                <FiDollarSign className="mr-1" /> Net Profit
              </p>
              <p className="text-lg font-bold text-blue-600">
                ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 border border-purple-100 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="flex items-center mb-1 text-xs text-gray-600">
                <FiTarget className="mr-1" /> Target
              </p>
              <p className="text-lg font-bold text-purple-600">
                ${target.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1 text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="h-2 overflow-hidden bg-gray-100 rounded-full">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(percent, 100)}%`,
                  background:
                    percent >= 100
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : percent >= 75
                        ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                        : percent >= 50
                          ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                          : 'linear-gradient(90deg, #EF4444, #F87171)'
                }}
              ></div>
            </div>
          </div>

          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <LineChart
                  type="monotone"
                  dataKey="performance"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 3, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
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
      'bg-gradient-to-r from-yellow-400 to-yellow-500',
      'bg-gradient-to-r from-gray-400 to-gray-500',
      'bg-gradient-to-r from-amber-600 to-amber-700'
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
      const target = data[`${performer.key} Target`] || employeeDetails[performer.key]?.totalTarget || 0;
      const percentage = target > 0 ? (sales / target) * 100 : 0;
      return {
        month,
        percentage,
        target
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
      <div className={`rounded-xl p-5 shadow-md ${badgeColors[index] || 'bg-gray-300'} text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{titles[index] || 'Performer'}</h3>
            <h2 className="mt-1 text-xl font-bold">{performer.name}</h2>
            <p className="text-sm opacity-80">ID: {performer.id}</p>
          </div>
          <div className="text-3xl">{medalIcons[index] || ''}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
            <p className="text-xs">Total Net Profit</p>
            <p className="text-lg font-bold">
              ${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs">Target: ${totalTarget.toLocaleString()}</p>
          </div>
          <div className="p-2 text-black bg-white rounded-lg bg-opacity-20">
            <p className="text-xs">Avg Monthly</p>
            <p className="text-lg font-bold">{avgMonthlyPerformance}%</p>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
            >
              ◀
            </button>
            <span className="text-sm font-semibold">Monthly Performance</span>
            <button
              onClick={handleNext}
              disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
              className="text-sm px-2 py-1 bg-white !text-black rounded disabled:opacity-50"
            >
              ▶
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            {visibleMonths.map((monthData, i) => (
              <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
                <p className="font-semibold">{monthData.month}</p>
                <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
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
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
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
    <div className="p-4 bg-gray-50 sm:p-6 rounded-xl">
      {/* Dashboard Header */}
      <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Team Performance Dashboard</h1>
          <p className="mt-1 text-gray-600">Track and analyze your team's sales performance</p>
        </div>
        <div className="flex mt-4 space-x-2 md:mt-0">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
          >
            <FiCalendar className="mr-2" /> Monthly
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white !text-gray-700 border border-gray-200'}`}
          >
            <FiBarChart2 className="mr-2" /> Yearly
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
          <p className="font-medium">Error loading data:</p>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : targetInfo ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">


            <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-1 text-sm text-gray-600">
                    <FaDollarSign className="mr-1" /> Total Net Profit
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
                  <FaDollarSign className="text-xl" />
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <div className="flex justify-between mb-1 text-xs text-gray-500">
                  <span>Target: ${targetInfo.overall.totalTarget.toLocaleString()}</span>
                  <span>{Math.round((targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                    style={{
                      width: `${Math.min(100, (targetInfo.overall.totalSales / (targetInfo.overall.totalTarget || 1)) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>


            <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-1 text-sm text-gray-600">
                    <FiTarget className="mr-1" /> Remaining Target
                  </p>
                  <p className="text-2xl font-bold text-gray-800">${targetInfo.overall.remaining.toLocaleString()}</p>
                </div>
                <div className="p-2 text-blue-600 bg-blue-100 rounded-lg">
                  <FiTarget className="text-xl" />
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="mb-1 text-xs text-gray-500">Daily Goal (7 days)</p>
                <p className="text-sm font-medium text-gray-800">
                  ${targetInfo.overall.perDayGoal.toLocaleString()} per day
                </p>
              </div>
            </div>

            <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-1 text-sm text-gray-600">
                    <FiUser className="mr-1" /> Total Employees
                  </p>
                  <p className="text-2xl font-bold text-gray-800">{Object.keys(employeeDetails).length}</p>
                </div>
                <div className="p-2 text-purple-600 bg-purple-100 rounded-lg">
                  <FiUser className="text-xl" />
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="mb-1 text-xs text-gray-500">Active this period</p>
                <p className="text-sm font-medium text-gray-800">
                  {Object.keys(employeeDetails).length} employees
                </p>
              </div>
            </div>

            <div className="p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="flex items-center mb-1 text-sm text-gray-600">
                    <FiAward className="mr-1" /> Top Performer
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {topPerformers.length > 0 ? topPerformers[0].name : 'N/A'}
                  </p>
                </div>
                <div className="p-2 text-yellow-600 bg-yellow-100 rounded-lg">
                  <FiAward className="text-xl" />
                </div>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100">
                <p className="mb-1 text-xs text-gray-500">Performance</p>
                <p className="text-sm font-medium text-gray-800">
                  {topPerformers.length > 0 ? Math.round(topPerformers[0].performance) : 0}%
                </p>
              </div>
            </div>
          </div>

          {callCategorySummary?.length > 0 && (
            <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                📊 Call Category Distribution
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
                      outerRadius={100}
                      dataKey="value"
                    >
                      {callCategorySummary.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {topPerformers.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                <FiAward className="mr-2 text-yellow-500" /> Top Performers
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h3 className="flex items-center mb-3 text-lg font-semibold text-gray-800">
              <FiFilter className="mr-2 text-gray-500" /> Filter Data
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-4">
                <label className="block mb-2 text-base font-medium text-gray-800">Time Period</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPerformanceView('monthly')}
                    className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
                      ? 'bg-blue-600 !text-white'
                      : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    Monthly
                  </button>
                  {/* <button
                    onClick={() => setPerformanceView('weekly')}
                    className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
                      ? 'bg-blue-600 !text-white'
                      : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Weekly
                  </button> */}
                  <button
                    onClick={() => setPerformanceView('daily')}
                    className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
                      ? 'bg-blue-600 !text-white'
                      : 'bg-gray-100 !text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    Daily
                  </button>
                </div>
              </div>

              {performanceView === 'monthly' && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Months</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
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
                        className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full">
                <label className="block mb-3 text-sm font-medium text-gray-700">Employee</label>
                <div className="relative">
                  {/* <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Employees</option>
                    {Object.keys(employeeDetails).map(empKey => {
                      const [id, name] = empKey.split('|');
                      return (
                        <option key={empKey} value={empKey}>
                          {id} - {name}
                        </option>
                      );
                    })}
                  </select> */}

                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all" className="text-gray-900">
                      All Employees
                    </option>
                    {Object.keys(employeeDetails).map(empKey => {
                      const [id, name] = empKey.split('|');
                      return (
                        <option key={empKey} value={empKey} className="text-gray-900">
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
          </div>

          {/* Employee Performance Grid */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
              {Object.keys(employeeDetails).length > 3 && (
                <button
                  onClick={() => setShowAllEmployees(!showAllEmployees)}
                  className="text-sm !text-blue-600 hover:text-blue-800 flex items-center"
                >
                  {showAllEmployees ? (
                    <>
                      <FiChevronUp className="mr-1" /> Show Less
                    </>
                  ) : (
                    <>
                      <FiChevronDown className="mr-1" /> Show More
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {(showAllEmployees ? Object.keys(employeeDetails) : Object.keys(employeeDetails).slice(0, 3)).map((empKey, index) =>
                renderPerformanceCard(empKey, index)
              )}
            </div>
          </div>

          {/* Performance Trend Chart */}
          <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex flex-col items-start justify-between gap-3 mb-5 sm:flex-row sm:items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {performanceView === 'monthly' && 'Monthly Performance Trend'}
                {performanceView === 'weekly' && 'Weekly Performance Trend'}
                {performanceView === 'daily' && 'Daily Performance Trend'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <div className="relative">
              


                  <select
                    className="block w-full px-4 py-2 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="all" className="text-gray-900">
                      All Employees
                    </option>
                    {Object.keys(employeeDetails).map(empKey => {
                      const [, name] = empKey.split('|');
                      return (
                        <option key={empKey} value={empKey} className="text-gray-900">
                          {name}
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

            <div className="pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
              <div className="min-w-[1000px] h-[450px]">

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    barSize={28}
                    barGap={8}
                    barCategoryGap={24}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F3F4F6"
                      strokeWidth={0.5}
                    />
                    <XAxis
                      dataKey={performanceView === 'monthly' ? 'month' : performanceView === 'weekly' ? 'week' : 'date'}
                      tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={false}
                      label={{
                        value: getXAxisLabel(),
                        position: 'bottom',
                        offset: 30,
                        fill: '#6B7280',
                        fontSize: 13,
                        fontWeight: 500
                      }}
                    />
                    <YAxis
                      tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                      axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                      tickLine={false}
                      label={{
                        value: 'Amount ($)',
                        angle: -90,
                        position: 'left',
                        offset: 10,
                        fill: '#6B7280',
                        fontSize: 13,
                        fontWeight: 500
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#E5E7EB',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        padding: '12px 16px',
                        fontSize: '14px'
                      }}
                      itemStyle={{ color: '#1F2937', padding: '4px 0', textTransform: 'capitalize' }}
                      labelStyle={{ fontWeight: '600', color: '#111827', marginBottom: '8px', borderBottom: '1px solid #F3F4F6', paddingBottom: '6px' }}
                      formatter={(value, name) => {
                        const amount = new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(value);
                        return [amount, name.replace(' Sales', '').replace(' Target', '')];
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="center"
                      wrapperStyle={{ paddingBottom: 25, fontSize: '0.8125rem', fontWeight: 500 }}
                      iconSize={12}
                      iconType="circle"
                      formatter={(value) => value.replace(' Sales', '').replace(' Target', '')}
                    />
                    {/* {displayedEmployees.map((name, index) => {
                      const baseColor = COLORS[index % COLORS.length];
                      return (
                        <React.Fragment key={name}>
                          <Bar
                            dataKey={`${name} Sales`}
                            fill={baseColor}
                            name={`${name} Sales`}
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          />
                          <Bar
                            dataKey={`${name} Target`}
                            fill={`${baseColor}33`}
                            stroke={baseColor}
                            strokeWidth={1}
                            strokeDasharray="4 2"
                            name={`${name} Target`}
                            radius={[6, 6, 0, 0]}
                            animationDuration={1800}
                            animationEasing="ease-out"
                          />
                        </React.Fragment>
                      );
                    })} */}
{/* Bars */}
{displayedEmployees.map((empKey, index) => {
  const [id, name] = empKey.split('|'); // extract only name
  const baseColor = COLORS[index % COLORS.length];
  return (
    <React.Fragment key={empKey}>
      <Bar
        dataKey={`${empKey} Sales`}   // keep empKey for data mapping
        fill={baseColor}
        name={`${name} (Sales) Sales`}        // show only name in legend/tooltip
        radius={[6, 6, 0, 0]}
        animationDuration={1400}
        animationEasing="ease-out"
      />
      <Bar
        dataKey={`${empKey} Target`}
        fill={`${baseColor}22`}
        stroke={baseColor}
        strokeWidth={1.5}
        strokeDasharray="5 3"
        name={`${name} (Target) Target`}       // show only name in legend/tooltip
        radius={[6, 6, 0, 0]}
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

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-xs text-gray-500">
                <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
                <span className="mr-3">Sales</span>
                <span className="inline-block w-3 h-3 mr-1 border border-blue-500 rounded-full bg-blue-500/20"></span>
                <span>Target</span>
              </div>
              <div className="text-xs text-gray-500">
                {performanceView === 'monthly' && `Showing: ${selectedMonths.join(', ')}`}
                {performanceView === 'weekly' && `Showing: Last 8 weeks`}
                {performanceView === 'daily' && `Showing: Last 14 days`}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <p className="text-gray-500">No performance data available</p>
        </div>
      )}
    </div>
  );
};

export default SalesChart;








//=====================================

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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         const [profitRes, callSummaryRes, performanceRes] = await Promise.all([
//           axios.get(`${API_URL}/call-logs/summary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/call-logs/summary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/performance/performance/all`, { headers: { Authorization: `Bearer ${token}` } })
//         ]);

//         const profit = parseFloat(profitRes.data?.totalProfit || profitRes.data?.data?.totalProfit || 0);
//         setTotalProfit(profit);

//         const categories = callSummaryRes.data?.data?.topCallCategories || [];
//         setCallCategorySummary(categories.map(item => ({
//           name: item._id,
//           value: item.count
//         })));

//         if (performanceRes.data.status === 'success' && performanceRes.data.data) {
//           setRawData(performanceRes.data.data);
//           processPerformanceData(performanceRes.data.data, performanceView);
//         } else {
//           throw new Error('Invalid performance data structure');
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (rawData, viewType = 'monthly') => {
//     try {
//       let groupedData = {};
//       const allEmployees = new Set();
//       const employeeDetails = {};

//       // Initialize employee details
//       rawData.forEach(item => {
//         if (item.name && item.employeeId) {
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           allEmployees.add(employeeKey);

//           if (!employeeDetails[employeeKey]) {
//             employeeDetails[employeeKey] = {
//               id: item.employeeId,
//               name: item.name,
//               totalSales: 0,
//               totalTarget: 0,
//               totalProfit: 0,
//               performanceRatio: 0
//             };
//           }
//         }
//       });

//       // Process data based on view type
//       if (viewType === 'monthly') {
//         const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//         const normalizeMonth = (m) => {
//           const lower = m.toLowerCase();
//           const map = {
//             jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
//             may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
//             sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec'
//           };
//           return map[lower.substring(0, 3)] || m;
//         };

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.month) return;

//           const month = normalizeMonth(item.month);
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0) || 0; // Ensure sales is parsed correctly
//           const target = parseFloat(item.target || 0) || 0; // Ensure target is parsed correctly
//           const profit = parseFloat(item.profit || 0) || 0;

//           if (!groupedData[month]) groupedData[month] = {};
//           if (!groupedData[month][employeeKey]) {
//             groupedData[month][employeeKey] = { sales: 0, target: 0 };
//           }

//           groupedData[month][employeeKey].sales += sales;
//           groupedData[month][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = monthOrder
//           .filter(month => groupedData[month])
//           .map(month => {
//             const row = { month };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = groupedData[month][empKey]?.sales || 0;
//               row[`${empKey} Target`] = groupedData[month][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       } else if (viewType === 'weekly') {
//         const weeklyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date);
//           const week = date.week();
//           const year = date.year();
//           const weekKey = `W${week} ${year}`;
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0) || 0;
//           const target = parseFloat(item.target || 0) || 0;
//           const profit = parseFloat(item.profit || 0) || 0;

//           if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
//           if (!weeklyData[weekKey][employeeKey]) {
//             weeklyData[weekKey][employeeKey] = { sales: 0, target: 0 };
//           }

//           weeklyData[weekKey][employeeKey].sales += sales;
//           weeklyData[weekKey][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(weeklyData)
//           .sort((a, b) => {
//             const [weekA, yearA] = a.split(' ').map(Number);
//             const [weekB, yearB] = b.split(' ').map(Number);
//             return yearA === yearB ? weekA - weekB : yearA - yearB;
//           })
//           .map(week => {
//             const row = { week };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = weeklyData[week][empKey]?.sales || 0;
//               row[`${empKey} Target`] = weeklyData[week][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       } else if (viewType === 'daily') {
//         const dailyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date).format('YYYY-MM-DD');
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales || 0) || 0;
//           const target = parseFloat(item.target || 0) || 0;
//           const profit = parseFloat(item.profit || 0) || 0;

//           if (!dailyData[date]) dailyData[date] = {};
//           if (!dailyData[date][employeeKey]) {
//             dailyData[date][employeeKey] = { sales: 0, target: 0 };
//           }

//           dailyData[date][employeeKey].sales += sales;
//           dailyData[date][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(dailyData)
//           .sort((a, b) => new Date(a) - new Date(b))
//           .map(date => {
//             const row = { date };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = dailyData[date][empKey]?.sales || 0;
//               row[`${empKey} Target`] = dailyData[date][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       }

//       // Calculate performance ratios
//       Object.keys(employeeDetails).forEach(empKey => {
//         employeeDetails[empKey].performanceRatio = employeeDetails[empKey].totalTarget > 0
//           ? (employeeDetails[empKey].totalSales / employeeDetails[empKey].totalTarget) * 100
//           : 0;
//       });

//       // Determine top performers
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
//         .sort((a, b) => b.performance - a.performance)
//         .slice(0, 3);

//       setTopPerformers(performers);
//       setEmployeeDetails(employeeDetails);

//       // Calculate overall metrics
//       const overallSales = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalSales, 0);
//       const overallTarget = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalTarget, 0);
//       const remaining = Math.max(overallTarget - overallSales, 0);
//       const perDayGoal = Math.ceil(remaining / 7);

//       setTargetInfo({
//         overall: {
//           totalSales: overallSales,
//           totalTarget: overallTarget,
//           remaining,
//           perDayGoal
//         },
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
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = 0;
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
//       performanceData = selectedMonths.map(month => ({
//         name: month,
//         performance: Math.round(
//           (chartData.find(d => d.month === month)?.[`${employeeKey} Sales`] /
//             chartData.find(d => d.month === month)?.[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     } else if (performanceView === 'weekly') {
//       performanceData = filteredChartData().map(week => ({
//         name: week.week,
//         performance: Math.round(
//           (week[`${employeeKey} Sales`] / week[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     } else if (performanceView === 'daily') {
//       performanceData = filteredChartData().map(day => ({
//         name: day.date,
//         performance: Math.round(
//           (day[`${employeeKey} Sales`] / day[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
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
//               className={`px-2 py-1 text-xs rounded-full font-medium ${
//                 percent >= 100
//                   ? 'bg-green-100 text-green-800'
//                   : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
//               </p>
//               <p className="text-lg font-bold text-blue-600">
//                 ${sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
//                       ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                       : percent >= 50
//                       ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                       : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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
//       const sales = chartData.find(d => d.month === month)?.[`${performer.key} Sales`] || 0;
//       const target = chartData.find(d => d.month === month)?.[`${performer.key} Target`] || 0;
//       return {
//         month,
//         percentage: target > 0 ? Math.round((sales / target) * 100) : 0,
//         target
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0);
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
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `${monthData.percentage}%`}
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                   <span>{Math.round((targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%`
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Weekly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
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
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>{name}</option>
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
//                       itemStyle={{
//                         color: '#1F2937',
//                         padding: '4px 0',
//                         textTransform: 'capitalize'
//                       }}
//                       labelStyle={{
//                         fontWeight: '600',
//                         color: '#111827',
//                         marginBottom: '8px',
//                         borderBottom: '1px solid #F3F4F6',
//                         paddingBottom: '6px'
//                       }}
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
//                       wrapperStyle={{
//                         paddingBottom: 25,
//                         fontSize: '0.8125rem',
//                         fontWeight: 500
//                       }}
//                       iconSize={12}
//                       iconType="circle"
//                       formatter={(value) => {
//                         return value.replace(' Sales', '').replace(' Target', '');
//                       }}
//                     />
//                     {displayedEmployees.map((name, index) => {
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

//========================================

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

// const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm-backend-f4lj.onrender.com/api';

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

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = localStorage.getItem('token');
//         const [profitRes, callSummaryRes, performanceRes] = await Promise.all([
//           axios.get(`${API_URL}/call-logs/summary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/call-logs/summary`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/performance/performance/all`, { headers: { Authorization: `Bearer ${token}` } })
//         ]);

//         const profit = parseFloat(profitRes.data?.totalProfit || profitRes.data?.data?.totalProfit || 0);
//         setTotalProfit(profit);

//         const categories = callSummaryRes.data?.data?.topCallCategories || [];
//         setCallCategorySummary(categories.map(item => ({
//           name: item._id,
//           value: item.count
//         })));

//         if (performanceRes.data.status === 'success' && performanceRes.data.data) {
//           console.log('Raw performance data:', performanceRes.data.data); // Debug: Log raw data
//           setRawData(performanceRes.data.data);
//           processPerformanceData(performanceRes.data.data, performanceView);
//         } else {
//           throw new Error('Invalid performance data structure');
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [performanceView]);

//   const processPerformanceData = (rawData, viewType = 'monthly') => {
//     try {
//       let groupedData = {};
//       const allEmployees = new Set();
//       const employeeDetails = {};

//       // Initialize employee details
//       rawData.forEach(item => {
//         if (item.name && item.employeeId) {
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           allEmployees.add(employeeKey);

//           if (!employeeDetails[employeeKey]) {
//             employeeDetails[employeeKey] = {
//               id: item.employeeId,
//               name: item.name,
//               totalSales: 0,
//               totalTarget: 0,
//               totalProfit: 0,
//               performanceRatio: 0
//             };
//           }
//         }
//       });

//       // Process data based on view type
//       if (viewType === 'monthly') {
//         const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//         const normalizeMonth = (m) => {
//           const lower = m.toLowerCase();
//           const map = {
//             jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
//             may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
//             sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec'
//           };
//           return map[lower.substring(0, 3)] || m;
//         };

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.month) return;

//           const month = normalizeMonth(item.month);
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales) || 0; // Debug: Ensure sales is parsed
//           const target = parseFloat(item.target) || 0;
//           const profit = parseFloat(item.profit) || 0;

//           console.log(`Processing: ${employeeKey}, Month: ${month}, Sales: ${sales}, Target: ${target}`); // Debug: Log each item

//           if (!groupedData[month]) groupedData[month] = {};
//           if (!groupedData[month][employeeKey]) {
//             groupedData[month][employeeKey] = { sales: 0, target: 0 };
//           }

//           groupedData[month][employeeKey].sales += sales;
//           groupedData[month][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = monthOrder
//           .filter(month => groupedData[month])
//           .map(month => {
//             const row = { month };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = groupedData[month][empKey]?.sales || 0;
//               row[`${empKey} Target`] = groupedData[month][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       } else if (viewType === 'weekly') {
//         const weeklyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date);
//           const week = date.week();
//           const year = date.year();
//           const weekKey = `W${week} ${year}`;
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales) || 0;
//           const target = parseFloat(item.target) || 0;
//           const profit = parseFloat(item.profit) || 0;

//           if (!weeklyData[weekKey]) weeklyData[weekKey] = {};
//           if (!weeklyData[weekKey][employeeKey]) {
//             weeklyData[weekKey][employeeKey] = { sales: 0, target: 0 };
//           }

//           weeklyData[weekKey][employeeKey].sales += sales;
//           weeklyData[weekKey][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(weeklyData)
//           .sort((a, b) => {
//             const [weekA, yearA] = a.split(' ').map(Number);
//             const [weekB, yearB] = b.split(' ').map(Number);
//             return yearA === yearB ? weekA - weekB : yearA - yearB;
//           })
//           .map(week => {
//             const row = { week };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = weeklyData[week][empKey]?.sales || 0;
//               row[`${empKey} Target`] = weeklyData[week][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       } else if (viewType === 'daily') {
//         const dailyData = {};

//         rawData.forEach(item => {
//           if (!item.name || !item.employeeId || !item.date) return;

//           const date = dayjs(item.date).format('YYYY-MM-DD');
//           const employeeKey = `${item.employeeId}|${item.name}`;
//           const sales = parseFloat(item.sales) || 0;
//           const target = parseFloat(item.target) || 0;
//           const profit = parseFloat(item.profit) || 0;

//           if (!dailyData[date]) dailyData[date] = {};
//           if (!dailyData[date][employeeKey]) {
//             dailyData[date][employeeKey] = { sales: 0, target: 0 };
//           }

//           dailyData[date][employeeKey].sales += sales;
//           dailyData[date][employeeKey].target += target;
//           employeeDetails[employeeKey].totalSales += sales;
//           employeeDetails[employeeKey].totalTarget += target;
//           employeeDetails[employeeKey].totalProfit += profit;
//         });

//         const formatted = Object.keys(dailyData)
//           .sort((a, b) => new Date(a) - new Date(b))
//           .map(date => {
//             const row = { date };
//             Array.from(allEmployees).forEach(empKey => {
//               row[`${empKey} Sales`] = dailyData[date][empKey]?.sales || 0;
//               row[`${empKey} Target`] = dailyData[date][empKey]?.target || 0;
//             });
//             return row;
//           });

//         setChartData(formatted);
//       }

//       // Calculate performance ratios
//       Object.keys(employeeDetails).forEach(empKey => {
//         employeeDetails[empKey].performanceRatio = employeeDetails[empKey].totalTarget > 0
//           ? (employeeDetails[empKey].totalSales / employeeDetails[empKey].totalTarget) * 100
//           : 0;
//       });

//       // Determine top performers
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
//         .sort((a, b) => b.performance - a.performance)
//         .slice(0, 3);

//       setTopPerformers(performers);
//       setEmployeeDetails(employeeDetails);

//       // Calculate overall metrics
//       const overallSales = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalSales, 0);
//       const overallTarget = Object.values(employeeDetails).reduce((acc, val) => acc + val.totalTarget, 0);
//       const remaining = Math.max(overallTarget - overallSales, 0);
//       const perDayGoal = Math.ceil(remaining / 7);

//       setTargetInfo({
//         overall: {
//           totalSales: overallSales,
//           totalTarget: overallTarget,
//           remaining,
//           perDayGoal
//         },
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
//             row[`${empKey} Sales`] = 0;
//             row[`${empKey} Target`] = 0;
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
//       performanceData = selectedMonths.map(month => ({
//         name: month,
//         performance: Math.round(
//           (chartData.find(d => d.month === month)?.[`${employeeKey} Sales`] /
//             chartData.find(d => d.month === month)?.[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     } else if (performanceView === 'weekly') {
//       performanceData = filteredChartData().map(week => ({
//         name: week.week,
//         performance: Math.round(
//           (week[`${employeeKey} Sales`] / week[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
//     } else if (performanceView === 'daily') {
//       performanceData = filteredChartData().map(day => ({
//         name: day.date,
//         performance: Math.round(
//           (day[`${employeeKey} Sales`] / day[`${employeeKey} Target`] || 0) * 100
//         )
//       }));
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
//               className={`px-2 py-1 text-xs rounded-full font-medium ${
//                 percent >= 100
//                   ? 'bg-green-100 text-green-800'
//                   : percent >= 75
//                   ? 'bg-blue-100 text-blue-800'
//                   : percent >= 50
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {Math.round(percent)}%
//             </span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="p-3 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
//               <p className="flex items-center mb-1 text-xs text-gray-600">
//                 <FiDollarSign className="mr-1" /> Sales
//               </p>
//               <p className="text-lg font-bold text-blue-600">
//                 ${sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
//                       ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
//                       : percent >= 50
//                       ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
//                       : 'linear-gradient(90deg, #EF4444, #F87171)'
//                 }}
//               ></div>
//             </div>
//           </div>

//           <div className="h-20">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
//                 <Line
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
//       const sales = chartData.find(d => d.month === month)?.[`${performer.key} Sales`] || 0;
//       const target = chartData.find(d => d.month === month)?.[`${performer.key} Target`] || 0;
//       return {
//         month,
//         percentage: target > 0 ? Math.round((sales / target) * 100) : 0,
//         target
//       };
//     });

//     const validMonths = monthlyPerformance.filter(m => m.target > 0);
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
//             <p className="text-xs">Total Sales</p>
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
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ◀
//             </button>
//             <span className="text-sm font-semibold">Monthly Performance</span>
//             <button
//               onClick={handleNext}
//               disabled={startIndex + itemsPerPage >= monthlyPerformance.length}
//               className="px-2 py-1 text-sm text-black bg-white rounded disabled:opacity-50"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2 text-xs text-center">
//             {visibleMonths.map((monthData, i) => (
//               <div key={i} className="p-2 text-black bg-white rounded bg-opacity-20">
//                 <p className="font-semibold">{monthData.month}</p>
//                 <p className={`font-medium ${monthData.target === 0 ? 'text-gray-400' : ''}`}>
//                   {monthData.target === 0 ? 'N/A' : `${monthData.percentage}%`}
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
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
//           >
//             <FiCalendar className="mr-2" /> Monthly
//           </button>
//           <button
//             onClick={() => setActiveTab('yearly')}
//             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${activeTab === 'yearly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
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
//                     <FaDollarSign className="mr-1" /> Total Sales
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
//                   <span>{Math.round((targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-1.5">
//                   <div
//                     className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
//                     style={{
//                       width: `${Math.min(100, (targetInfo.overall.totalSales / targetInfo.overall.totalTarget) * 100)}%`
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
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'monthly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Monthly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('weekly')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'weekly'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
//                   >
//                     Weekly
//                   </button>
//                   <button
//                     onClick={() => setPerformanceView('daily')}
//                     className={`px-14 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${performanceView === 'daily'
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                     }`}
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
//                         className={`py-1 px-2 text-xs rounded-md ${selectedMonths.includes(month)
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
//                     className="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [id, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>
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
//                   className="flex items-center text-sm text-blue-600 hover:text-blue-800"
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
//                     className="block w-full px-4 py-2 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     value={selectedEmployee}
//                     onChange={(e) => setSelectedEmployee(e.target.value)}
//                   >
//                     <option value="all">All Employees</option>
//                     {Object.keys(employeeDetails).map(empKey => {
//                       const [, name] = empKey.split('|');
//                       return (
//                         <option key={empKey} value={empKey}>{name}</option>
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
//                       itemStyle={{
//                         color: '#1F2937',
//                         padding: '4px 0',
//                         textTransform: 'capitalize'
//                       }}
//                       labelStyle={{
//                         fontWeight: '600',
//                         color: '#111827',
//                         marginBottom: '8px',
//                         borderBottom: '1px solid #F3F4F6',
//                         paddingBottom: '6px'
//                       }}
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
//                       wrapperStyle={{
//                         paddingBottom: 25,
//                         fontSize: '0.8125rem',
//                         fontWeight: 500
//                       }}
//                       iconSize={12}
//                       iconType="circle"
//                       formatter={(value) => {
//                         return value.replace(' Sales', '').replace(' Target', '');
//                       }}
//                     />
//                     {displayedEmployees.map((name, index) => {
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