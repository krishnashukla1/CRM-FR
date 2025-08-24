
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
//     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
//     value={filter}
//     onChange={(e) => setFilter(e.target.value)}
//   >
//     <option value="today">Today's Attendance</option>
//     <option value="monthly">Monthly Attendance</option>
//     <option value="all">All Attendance</option>
//   </select>
// </div>


//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    presentCount: 0,
    leaveCount: 0,
    absentCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API URL from environment variables with fallback
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Create axios instance with base configuration
        const api = axios.create({
          baseURL: API_URL,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        // 1. Fetch total employees
        const empRes = await api.get('/employees');
        const totalEmployees = empRes.data.totalCount || empRes.data.data?.length || 0;

        // 2. Fetch attendance data
        const attRes = await api.get('/attendance?perPage=1000');
        const allAttendance = attRes.data.data || [];

        // Filter based on selected time period
        let filteredAttendance = allAttendance;
        
        // Get current date in UTC to match database format
        const todayUTC = moment().utc().startOf('day');
        const currentMonthUTC = moment().utc().startOf('month');

        if (filter === 'today') {
          filteredAttendance = allAttendance.filter(a => {
            const attendanceDate = moment(a.date).utc().startOf('day');
            return attendanceDate.isSame(todayUTC, 'day');
          });
        } else if (filter === 'monthly') {
          filteredAttendance = allAttendance.filter(a => {
            const attendanceDate = moment(a.date).utc().startOf('day');
            return attendanceDate.isSame(currentMonthUTC, 'month');
          });
        }

        // Count statuses
        const present = filteredAttendance.filter(a => a.status === 'Present').length;
        const leave = filteredAttendance.filter(a => a.status === 'Leave').length;
        const absent = filteredAttendance.filter(a => a.status === 'Absent').length;

        setStatsData({
          totalEmployees,
          presentCount: present,
          leaveCount: leave,
          absentCount: absent
        });

      } catch (err) {
        console.error('Dashboard stats error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filter, API_URL]);

  const stats = [
    {
      title: 'Total Employees',
      value: statsData.totalEmployees,
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '👥'
    },
    {
      title: `Total Present`,
      value: statsData.presentCount,
      color: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '✅'
    },
    {
      title: `Total Leave`,
      value: statsData.leaveCount,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '🌴'
    },
    {
      title: `Total Absent`,
      value: statsData.absentCount,
      color: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '❌'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter dropdown */}
      <div className="flex justify-end">
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 !text-gray-700 !bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={loading}
        >
          <option value="today">Today's Attendance</option>
          <option value="monthly">Monthly Attendance</option>
          <option value="all">All Attendance</option>
        </select>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl shadow-md ${stat.color} ${stat.textColor} transition-all hover:shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-80">{stat.title}</p>
                <p className="text-3xl font-bold">
                  {loading ? '...' : stat.value}
                </p>
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
