
//-----------------------------For TODAYS'S present,leave,total employee will be showing------------------------------

/*


import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardCards = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPresent, setTotalPresent] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Employees
        const empRes = await axios.get('http://localhost:5000/api/employees');
        setTotalEmployees(empRes.data.totalCount || empRes.data.data?.length || 0);

        // 2. Attendance - get all and use latest date
        const attRes = await axios.get(`http://localhost:5000/api/attendance?perPage=100`);
        const attendanceData = attRes.data.data || [];

        // Get latest attendance date
        const dates = [...new Set(attendanceData.map(a => a.date))].sort().reverse();
        const latestDate = dates[0];

        const todayAttendance = attendanceData.filter(a => a.date === latestDate && a.status === 'Present');
        setTotalPresent(todayAttendance.length);

        // 3. Leaves - pending only
        const leaveRes = await axios.get(`http://localhost:5000/api/leaves?status=pending&perPage=100`);
        setPendingLeaves(leaveRes.data.totalCount || leaveRes.data.data?.length || 0);

      } catch (err) {
        console.error('Dashboard stats error:', err);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Employees', value: totalEmployees, color: 'bg-blue-100', textColor: 'text-blue-800' },
    { title: 'Total Present', value: totalPresent, color: 'bg-green-100', textColor: 'text-green-800' },
    { title: 'Pending Leaves', value: pendingLeaves, color: 'bg-yellow-100', textColor: 'text-yellow-800' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-2xl shadow-md ${stat.color} ${stat.textColor}`}
        >
          <p className="text-sm opacity-80">{stat.title}</p>
          <p className="text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
*/


//----------------------------ALL DAYS present,leave,total employee will be showing-----------



// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const DashboardCards = () => {
//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [presentCount, setPresentCount] = useState(0);
//   const [leaveCount, setLeaveCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // ✅ 1. Total Employees
//         const empRes = await axios.get('http://localhost:5000/api/employees');
//         setTotalEmployees(empRes.data.totalCount || empRes.data.data?.length || 0);

//         // ✅ 2. Attendance: Count ALL status entries (not only latest day)
//         const attRes = await axios.get(`http://localhost:5000/api/attendance?perPage=1000`);
//         const allAttendance = attRes.data.data || [];

//         const present = allAttendance.filter(a => a.status === 'Present').length;
//         const leave = allAttendance.filter(a => a.status === 'Leave').length;
//         const absent = allAttendance.filter(a => a.status === 'Absent').length;

//         setPresentCount(present);
//         setLeaveCount(leave);
//         setAbsentCount(absent);
//       } catch (err) {
//         console.error('Dashboard stats error:', err);
//       }
//     };

//     fetchStats();
//   }, []);

//   const stats = [
//     { title: 'Total Employees', value: totalEmployees, color: 'bg-blue-100', textColor: 'text-blue-800' },
//     { title: 'Total Present (All)', value: presentCount, color: 'bg-green-100', textColor: 'text-green-800' },
//     { title: 'Total Leave (All)', value: leaveCount, color: 'bg-yellow-100', textColor: 'text-yellow-800' },
//     { title: 'Total Absent (All)', value: absentCount, color: 'bg-red-100', textColor: 'text-red-800' },
//   ];

//   return (
//     <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
//       {stats.map((stat, index) => (
//         <div
//           key={index}
//           className={`p-6 rounded-2xl shadow-md ${stat.color} ${stat.textColor}`}
//         >
//           <p className="text-sm opacity-80">{stat.title}</p>
//           <p className="text-3xl font-bold">{stat.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;

//-------------------PER DAY,PERMONTH OR, ALL DAYS present,leave,total employee will be showing-----------

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const DashboardCards = () => {
//   // const [filter, setFilter] = useState('all'); // 'all' | 'today' | 'monthly'
//   const [filter, setFilter] = useState('today');

//   const [totalEmployees, setTotalEmployees] = useState(0);
//   const [presentCount, setPresentCount] = useState(0);
//   const [leaveCount, setLeaveCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // ✅ 1. Total Employees
//         // const empRes = await axios.get('http://localhost:5000/api/employees');

//         const empRes = await axios.get(`${API_URL}/employees`);

//         setTotalEmployees(empRes.data.totalCount || empRes.data.data?.length || 0);

//         // ✅ 2. Attendance
//         // const attRes = await axios.get(`http://localhost:5000/api/attendance?perPage=1000`);

//          const attRes = await axios.get(`${API_URL}/attendance?perPage=1000`);

//         const allAttendance = attRes.data.data || [];

//         let filteredAttendance = allAttendance;

//         if (filter === 'today') {
//           const today = moment().format('YYYY-MM-DD');
//           filteredAttendance = allAttendance.filter(
//             a => moment(a.date).format('YYYY-MM-DD') === today
//           );
//         } else if (filter === 'monthly') {
//           const currentMonth = moment().format('YYYY-MM');
//           filteredAttendance = allAttendance.filter(
//             a => moment(a.date).format('YYYY-MM') === currentMonth
//           );
//         }

//         const present = filteredAttendance.filter(a => a.status === 'Present').length;
//         const leave = filteredAttendance.filter(a => a.status === 'Leave').length;
//         const absent = filteredAttendance.filter(a => a.status === 'Absent').length;

//         setPresentCount(present);
//         setLeaveCount(leave);
//         setAbsentCount(absent);
//       } catch (err) {
//         console.error('Dashboard stats error:', err);
//       }
//     };

//     fetchStats();
//   }, [filter]);

//   const stats = [
//     { title: 'Total Employees', value: totalEmployees, color: 'bg-blue-100', textColor: 'text-blue-800' },
//     { title: `Total Present`, value: presentCount, color: 'bg-green-100', textColor: 'text-green-800' },
//     { title: `Total Leave`, value: leaveCount, color: 'bg-yellow-100', textColor: 'text-yellow-800' },
//     { title: `Total Absent`, value: absentCount, color: 'bg-red-100', textColor: 'text-red-800' },
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Dropdown filter */}
//      <div className="flex justify-end">
//   <select
//     className="px-4 py-2 text-gray-700 transition duration-150 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//     value={filter}
//     onChange={(e) => setFilter(e.target.value)}
//   >
//     <option value="today">Today's Attendance</option>
//     <option value="monthly">Monthly Attendance</option>
//     <option value="all">All Attendance</option>
//   </select>
// </div>


//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className={`p-6 rounded-2xl shadow-md ${stat.color} ${stat.textColor}`}
//           >
//             <p className="text-sm opacity-80">{stat.title}</p>
//             <p className="text-3xl font-bold">{stat.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardCards;

//=========================================

import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
 
const DashboardCards = () => {
  const [filter, setFilter] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMM'));
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    presentCount: 0,
    leaveCount: 0,
    absentCount: 0,
    lateCount: 0,
    halfDayCount: 0,
    weeklyOffCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
 
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 5 }, (_, i) => moment().year() - i);
 
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
 
      try {
        const api = axios.create({
          baseURL: API_URL,
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' },
        });
 
        // 1. Employees
        const empRes = await api.get('/employees');
        const totalEmployees = empRes.data.totalCount || empRes.data.data?.length || 0;
 
        // 2. Fetch attendance for the selected year (use local YYYY-MM-DD)
        let allAttendance = [];
        let page = 1;
        let hasMore = true;
 
 
        const startDate = moment(`${selectedYear}-01-01`).utc().format('YYYY-MM-DD');
        const endDate = moment(`${selectedYear}-12-31`).utc().format('YYYY-MM-DD');
        const res = await axios.get(
          `${API_URL}/attendance?perPage=1000&page=${page}&startDate=${startDate}&endDate=${endDate}`
        );
 
        while (hasMore) {
          const attRes = await api.get(`/attendance?perPage=1000&page=${page}&startDate=${startDate}&endDate=${endDate}`);
          const records = attRes.data.data || [];
          console.log('API Response (Page', page, '):', records.length);
          allAttendance = [...allAttendance, ...records];
          hasMore = records.length === 1000;
          page++;
        }
 
        console.log('Total attendance fetched:', allAttendance.length);
 
        // --- IMPORTANT: use local-day comparisons (no .utc()) to avoid shifting dates across midnight ---
        let filteredAttendance = allAttendance;
        const todayLocal = moment().startOf('day'); // local day start
        const selectedMonthStart = moment(`${selectedMonth} ${selectedYear}`, 'MMM YYYY').startOf('month');
        const selectedMonthEnd = selectedMonthStart.clone().endOf('month');
 
        console.log('Selected Month Range (local):', selectedMonthStart.format('YYYY-MM-DD'), 'to', selectedMonthEnd.format('YYYY-MM-DD'));
 
        if (filter === 'today') {
          filteredAttendance = allAttendance.filter((a) => {
            if (!a?.date) return false;
            const attendanceDate = moment(a.date).startOf('day'); // local
            return attendanceDate.isSame(todayLocal, 'day');
          });
        } else if (filter === 'monthly') {
          filteredAttendance = allAttendance.filter((a) => {
            if (!a?.date) return false;
            const attendanceDate = moment(a.date).startOf('day'); // local
            const inSelected = attendanceDate.isBetween(selectedMonthStart, selectedMonthEnd, 'day', '[]'); // inclusive
            // debug log (remove later)
            console.log('raw:', a.date, 'parsed-day:', attendanceDate.format('YYYY-MM-DD'), 'inSelectedMonth:', inSelected);
            return inSelected;
          });
        } // else 'all' -> don't filter
 
        // Count statuses
        const present = filteredAttendance.filter((a) => a.status === 'Present').length;
        const leave = filteredAttendance.filter((a) => a.status === 'Leave').length;
        const absent = filteredAttendance.filter((a) => a.status === 'Absent').length;
        const late = filteredAttendance.filter((a) => a.status === 'Late').length;
        const halfDay = filteredAttendance.filter((a) => a.status === 'HalfDay').length;
        const weeklyOff = filteredAttendance.filter((a) => a.status === 'Weekly Off').length;
 
        console.log('Counts (present, leave, absent):', present, leave, absent);
 
        setStatsData({
          totalEmployees,
          presentCount: present,
          leaveCount: leave,
          absentCount: absent,
          lateCount: late,
          halfDayCount: halfDay,
          weeklyOffCount: weeklyOff,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
 
    fetchStats();
  }, [filter, selectedMonth, selectedYear, API_URL]);
 
  const stats = [
    { title: 'Total Employees', value: statsData.totalEmployees, color: 'bg-blue-100', textColor: 'text-blue-800', icon: '👥' },
    { title: `Total Present${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.presentCount, color: 'bg-green-100', textColor: 'text-green-800', icon: '✅' },
    // { title: `Total Late${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.lateCount, color: 'bg-blue-200', textColor: 'text-blue-800', icon: '⏰' },
    // { title: `Total Half Day${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.halfDayCount, color: 'bg-indigo-100', textColor: 'text-indigo-800', icon: '🌗' },
    { title: `Total Absent${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.absentCount, color: 'bg-red-100', textColor: 'text-red-800', icon: '❌' },
    { title: `Total Leave${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.leaveCount, color: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '🌴' },
    // { title: `Total Weekly Off${filter === 'monthly' ? ` (${selectedMonth} ${selectedYear})` : filter === 'today' ? ' (Today)' : ''}`, value: statsData.weeklyOffCount, color: 'bg-purple-100', textColor: 'text-purple-800', icon: '🌙' },
  ];
 
  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} disabled={loading} className="px-4 py-2 bg-black border rounded-lg cursor-pointer">
          <option value="today">Today's Attendance</option>
          <option value="monthly">Monthly Attendance</option>
          <option value="all">All Attendance</option>
        </select>
 
        {filter === 'monthly' && (
          <>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} disabled={loading} className="px-4 py-2 bg-black border rounded-lg cursor-pointer"
              >
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
 
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} disabled={loading} className="px-4 py-2 bg-black border rounded-lg cursor-pointer">
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </>
        )}
      </div>
 
      {error && <div className="p-4 text-red-700 rounded-lg bg-red-50">{error}</div>}
 
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl shadow-md ${stat.color} ${stat.textColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-80">{stat.title}</p>
                <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default DashboardCards;

 
 
