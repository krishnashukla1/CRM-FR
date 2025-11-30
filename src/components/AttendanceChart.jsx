import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import moment from 'moment';
 
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
 
const AttendanceChart = () => {
  const [data, setData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMM'));
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallStats, setOverallStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLeave: 0,
    totalWeeklyOff: 0,
    totalLate: 0,
    totalHalfDay: 0,
  });
  const [employeeStats, setEmployeeStats] = useState([]);
 
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // const years = Array.from({ length: 5 }, (_, i) => moment().year() - i); // Last 5 years


  const years = [
  ...Array.from({ length: 2 }, (_, i) => moment().year() - i),
  ...Array.from({ length: 10 }, (_, i) => moment().year() + 1 + i),
].sort((a, b) => a - b);



  const statusColors = {
    Present: '#10B981',
    Absent: '#EF4444',
    Leave: '#F59E0B',
    WeeklyOff: '#8B5CF6',
    Late: '#3B82F6',
    HalfDay: '#6366F1',
  };
 
  const processMonthlyData = (records) => {
    const monthMap = {};
    let totalStats = {
      Present: 0,
      Absent: 0,
      Leave: 0,
      WeeklyOff: 0,
      Late: 0,
      HalfDay: 0,
    };
 
    // Initialize monthMap for the selected year
    months.forEach((month) => {
      monthMap[month] = { name: month, Present: 0, Absent: 0, Leave: 0, WeeklyOff: 0, Late: 0, HalfDay: 0 };
    });
 
    records.forEach((record) => {
      const recordYear = moment(record.date).utc().year();
      const month = moment(record.date).utc().format('MMM');
      if (recordYear === selectedYear && monthMap[month]) {
        switch (record.status) {
          case 'Present':
            monthMap[month].Present++;
            totalStats.Present++;
            break;
          case 'Absent':
            monthMap[month].Absent++;
            totalStats.Absent++;
            break;
          case 'Leave':
            monthMap[month].Leave++;
            totalStats.Leave++;
            break;
          case 'Weekly Off':
            monthMap[month].WeeklyOff++;
            totalStats.WeeklyOff++;
            break;
          case 'Late':
            monthMap[month].Late++;
            totalStats.Late++;
            break;
          case 'HalfDay':
            monthMap[month].HalfDay++;
            totalStats.HalfDay++;
            break;
          default:
            break;
        }
      }
    });
 
    const chartData = months.map((m) => monthMap[m]);
    console.log('Processed Chart Data:', chartData);
    return { chartData, stats: totalStats };
  };
 
  const processEmployeeData = (records, month, year) => {
    const employeeMap = {};
    const monthNum = months.indexOf(month) + 1;
    const daysInMonth = moment(`${year}-${monthNum}`, 'YYYY-MM').daysInMonth();
 
    records.forEach((record) => {
      const recordMonth = moment(record.date).utc().month() + 1;
      const recordYear = moment(record.date).utc().year();
      if (recordMonth === monthNum && recordYear === year) {
        const employeeName = record.employeeId
          ? record.employeeId.name || `Employee ${record.employeeId._id}`
          : 'Unknown Employee';
        const employeeId = record.employeeId?._id || 'unknown';
 
        if (!employeeMap[employeeId]) {
          employeeMap[employeeId] = {
            id: employeeId,
            name: employeeName,
            email: record.employeeId?.email || 'N/A', // Include email if available
            role: record.employeeId?.role || 'N/A', // Include role if available
            Present: 0,
            Absent: 0,
            Leave: 0,
            WeeklyOff: 0,
            Late: 0,
            HalfDay: 0,
            totalDays: daysInMonth,
            daysWorked: 0,
          };
        }
 
        if (record.status) {
          const statusKey = record.status === 'Weekly Off' ? 'WeeklyOff' : record.status;
          employeeMap[employeeId][statusKey]++;
          if (record.status !== 'Absent' && record.status !== 'Weekly Off' && record.status !== 'Leave') {
            employeeMap[employeeId].daysWorked++;
          }
        }
      }
    });
 
    const result = Object.values(employeeMap).sort((a, b) => b.daysWorked - a.daysWorked);
    console.log('Processed Employee Data:', result);
    return result;
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
 
        // Fetch all attendance data with pagination
        let allRecords = [];
        let page = 1;
        let hasMore = true;
        const startDate = moment(`${selectedYear}-01-01`).utc().format('YYYY-MM-DD');
        const endDate = moment(`${selectedYear}-12-31`).utc().format('YYYY-MM-DD');
 
        while (hasMore) {
          const res = await axios.get(
            `${API_URL}/attendance?perPage=1000&page=${page}&startDate=${startDate}&endDate=${endDate}`
          );
          console.log('API Response (Page', page, '):', res.data.data);
          allRecords = [...allRecords, ...res.data.data];
          hasMore = res.data.data.length === 1000;
          page++;
        }
 
        // Process data
        const { chartData, stats } = processMonthlyData(allRecords);
        const employeeChartData = processEmployeeData(allRecords, selectedMonth, selectedYear);
 
        setData(chartData);
        setEmployeeData(employeeChartData);
 
        // Set overall stats
        setOverallStats({
          totalPresent: stats.Present,
          totalAbsent: stats.Absent,
          totalLeave: stats.Leave,
          totalWeeklyOff: stats.WeeklyOff,
          totalLate: stats.Late,
          totalHalfDay: stats.HalfDay,
        });
 
        // Set employee stats for summary table
        setEmployeeStats(
          employeeChartData.map((emp) => ({
            employeeId: emp.id,
            name: emp.name,
            email: emp.email,
            role: emp.role,
            present: emp.Present,
            absent: emp.Absent,
            leave: emp.Leave,
            weeklyOff: emp.WeeklyOff,
            late: emp.Late,
            halfDay: emp.HalfDay,
            totalDays: emp.totalDays,
            daysWorked: emp.daysWorked,
          }))
        );
 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError(error.response?.data?.message || 'Failed to fetch attendance data');
        setLoading(false);
      }
    };
 
    fetchData();
  }, [selectedMonth, selectedYear]);
 
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 min-w-[180px]">
          <p className="pb-2 mb-2 font-bold text-gray-800 border-b">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span style={{ color: entry.color }}>{entry.name}</span>
                </div>
                <span className="font-semibold">
                  {entry.value} <span className="text-xs text-gray-500">({Math.round((entry.value / total) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 mt-2 text-sm border-t">
            <span className="font-medium">Total: </span>
            <span className="font-bold">{total}</span>
          </div>
        </div>
      );
    }
    return null;
  };
 
  const EmployeeCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const employee = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200 min-w-[220px]">
          <p className="pb-2 mb-2 font-bold text-gray-800 border-b">{label}</p>
          <div className="space-y-2">
            {['Present', 'Late', 'HalfDay', 'Absent', 'Leave', 'WeeklyOff'].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: statusColors[status] }} />
                  <span className="text-gray-700">{status === 'WeeklyOff' ? 'Weekly Off' : status}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-800">{employee[status]} days</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 mt-3 text-sm border-t">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Days Worked: </span>
              <span className="font-bold text-gray-800">{employee.daysWorked}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Total Days in Month: </span>
              <span className="font-bold text-gray-800">{employee.totalDays}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
 
  const renderMonthlyChart = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Monthly Attendance Overview ({selectedYear})</h3>
          <p className="text-sm text-gray-500">Attendance distribution across all months</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 font-medium text-blue-600 bg-gray-200 border border-gray-500 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {years.map((year) => (
              <option key={year} value={year} className="text-black">
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-4 border border-gray-100 h-80 bg-gray-50 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <Bar dataKey="Present" name="Present" fill={statusColors.Present} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Absent" name="Absent" fill={statusColors.Absent} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Leave" name="Leave" fill={statusColors.Leave} radius={[4, 4, 0, 0]} />
            <Bar dataKey="WeeklyOff" name="Weekly Off" fill={statusColors.WeeklyOff} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Late" name="Late" fill={statusColors.Late} radius={[4, 4, 0, 0]} />
            <Bar dataKey="HalfDay" name="Half Day" fill={statusColors.HalfDay} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-6">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm font-medium text-gray-700">{status}</span>
            <span className="ml-auto text-sm font-bold" style={{ color }}>
              {status === 'Present'
                ? overallStats.totalPresent
                : status === 'Absent'
                ? overallStats.totalAbsent
                : status === 'Leave'
                ? overallStats.totalLeave
                : status === 'WeeklyOff'
                ? overallStats.totalWeeklyOff
                : status === 'Late'
                ? overallStats.totalLate
                : overallStats.totalHalfDay}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
 
  const renderEmployeeChart = () => {
    const monthStats = employeeData.reduce(
      (acc, employee) => ({
        Present: acc.Present + employee.Present,
        Absent: acc.Absent + employee.Absent,
        Leave: acc.Leave + employee.Leave,
        WeeklyOff: acc.WeeklyOff + employee.WeeklyOff,
        Late: acc.Late + employee.Late,
        HalfDay: acc.HalfDay + employee.HalfDay,
        totalDays: employee.totalDays,
      }),
      { Present: 0, Absent: 0, Leave: 0, WeeklyOff: 0, Late: 0, HalfDay: 0, totalDays: 0 }
    );
 
    return (
      <div className="mt-4">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Employee Attendance Details ({selectedMonth} {selectedYear})
            </h3>
            <p className="text-sm text-gray-500">Attendance breakdown by employee</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex space-x-3">
              {Object.entries(monthStats)
                .filter(([key]) => key !== 'totalDays')
                .map(([status, count]) => (
                  <div key={status} className="text-center px-2 py-1 bg-gray-50 rounded-lg min-w-[60px]">
                    <div className="text-xs font-medium text-gray-500">{status}</div>
                    <div className="text-sm font-bold" style={{ color: statusColors[status] }}>
                      {count}
                    </div>
                  </div>
                ))}
            </div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 font-medium text-blue-600 bg-gray-200 border border-gray-500 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {months.map((month) => (
                <option key={month} value={month} className="text-black">
                  {month}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 font-medium text-blue-600 bg-gray-200 border border-gray-500 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {years.map((year) => (
                <option key={year} value={year} className="text-black">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        {employeeData.length > 0 ? (
          <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
            <div className="h-[500px] overflow-y-auto pr-2">
              <ResponsiveContainer width="100%" height={employeeData.length * 60}>
                <BarChart
                  data={employeeData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    domain={[0, 'dataMax']}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    width={100}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<EmployeeCustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                  {['Present', 'Late', 'HalfDay', 'Leave', 'WeeklyOff', 'Absent'].map((status) => (
                    <Bar key={status} dataKey={status} name={status === 'WeeklyOff' ? 'Weekly Off' : status} stackId="a" fill={statusColors[status]}>
                      {employeeData.map((entry, index) => (
                        <Cell key={`cell-${status}-${index}`} fill={statusColors[status]} />
                      ))}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 mb-2 border-b-2 border-blue-500 rounded-full animate-spin" />
                <span>Loading employee data...</span>
              </div>
            ) : 'No attendance data available for this month'}
          </div>
        )}
      </div>
    );
  };
 
 
  const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
 
  const BriefcaseIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
 
  const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
 
  const XCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
 
  const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
 
  const MoonIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
 
  const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
 
  const HalfMoonIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
 
  const ChartBarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
 
  const renderEmployeeStatsTable = () => (
    <div className="mt-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Employee Attendance Summary ({selectedMonth} {selectedYear})
          </h3>
          <p className="text-sm text-gray-500">Detailed breakdown by employee</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 font-medium text-blue-600 bg-gray-200 border border-gray-500 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {months.map((month) => (
              <option key={month} value={month} className="text-black">
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 font-medium text-blue-600 bg-gray-200 border border-gray-500 rounded-md shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {years.map((year) => (
              <option key={year} value={year} className="text-black">
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Employee
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 mr-2" />
                    Role
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    Present
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
                    Late
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <HalfMoonIcon className="w-4 h-4 mr-2 text-indigo-500" />
                    Half Day
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <XCircleIcon className="w-4 h-4 mr-2 text-red-500" />
                    Absent
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                    Leave
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <MoonIcon className="w-4 h-4 mr-2 text-purple-500" />
                    Weekly Off
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-blue-900 uppercase border-b border-blue-100"
                >
                  <div className="flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 mr-2 text-gray-600" />
                    Total Days
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employeeStats.length > 0 ? (
                employeeStats.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="hover:bg-blue-50/50 transition-all duration-200 ease-in-out transform hover:scale-[1.002]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                          {employee.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
                          <div className="text-xs font-medium text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-green-800 bg-green-100 rounded-full">
                        {employee.present}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-800 bg-blue-100 rounded-full">
                        {employee.late}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-indigo-800 bg-indigo-100 rounded-full">
                        {employee.halfDay}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-red-800 bg-red-100 rounded-full">
                        {employee.absent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-yellow-800 bg-yellow-100 rounded-full">
                        {employee.leave}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-purple-800 bg-purple-100 rounded-full">
                        {employee.weeklyOff}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-10 h-10 text-sm font-bold text-gray-800 border border-gray-200 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                        {employee.totalDays}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    {loading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 mb-2 border-b-2 border-blue-500 rounded-full animate-spin" />
                        <span>Loading employee data...</span>
                      </div>
                    ) : 'No attendance data available for this month'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
 
  return (
    <div className="w-full p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Analytics</h2>
          <p className="text-sm text-gray-500">Visualize and analyze employee attendance patterns</p>
        </div>
        <div className="flex p-1 space-x-2 rounded-lg bg-gray-50">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`cursor-pointer px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'monthly'
                ? 'bg-white shadow-sm !text-blue-600 border border-gray-200'
                : '!text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly Overview
          </button>
          <button
            onClick={() => setActiveTab('employee')}
            className={`cursor-pointer px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'employee'
                ? '!bg-white shadow-sm !text-blue-600 border border-gray-200'
                : '!text-gray-600 hover:text-gray-800'
            }`}
          >
            Employee Details
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`cursor-pointer px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'summary'
                ? '!bg-white shadow-sm !text-blue-600 border border-gray-200'
                : '!text-gray-600 hover:text-gray-800'
            }`}
          >
            Employee Summary
          </button>
        </div>
      </div>
      {error && (
        <div className="p-4 mb-4 text-red-700 rounded-lg bg-red-50">
          {error}
        </div>
      )}
      {loading ? (
        <div className="py-12 text-center text-gray-500">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 mb-2 border-b-2 border-blue-500 rounded-full animate-spin" />
            <span>Loading data...</span>
          </div>
        </div>
      ) : activeTab === 'monthly' ? (
        renderMonthlyChart()
      ) : activeTab === 'employee' ? (
        renderEmployeeChart()
      ) : (
        renderEmployeeStatsTable()
      )}
    </div>
  );
};
 
export default AttendanceChart;
 