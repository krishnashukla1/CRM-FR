import { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeOfMonth = () => {
  const [topEmployee, setTopEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`${API_URL}/performance/performance/all`);
        if (response.data.status === 'success') {
          setPerformanceData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  useEffect(() => {
    const fetchTopPerformerWithAttendance = async () => {
      setLoading(true);
      try {
        // 1. Fetch all call logs (pagination)
        let allCallLogs = [];
        let currentPage = 1;
        let totalPages = 1;

        while (currentPage <= totalPages) {
          const callLogsRes = await axios.get(`${API_URL}/call-logs?page=${currentPage}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { data, pagination } = callLogsRes.data;
          allCallLogs = [...allCallLogs, ...(data || [])];
          totalPages = pagination?.totalPages || 1;
          currentPage += 1;
        }

        // 2. Fetch attendance
        const attendanceRes = await axios.get(`${API_URL}/attendance?perPage=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const attendance = attendanceRes.data?.data || [];

        if (!allCallLogs.length) {
          console.warn('⚠️ No call logs returned.');
          return;
        }

        // 3. Calculate profit per employee for current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const employeeProfitMap = {};
        allCallLogs.forEach((log) => {
          const logDate = new Date(log.createdAt);
          if (
            logDate.getMonth() === currentMonth &&
            logDate.getFullYear() === currentYear &&
            log.employeeId
          ) {
            const empId = log.employeeId._id.toString();
            const profit = log.profitAmount || 0;

            if (!employeeProfitMap[empId]) {
              employeeProfitMap[empId] = {
                employeeId: log.employeeId._id,
                name: log.employeeId.name,
                email: log.employeeId.email,
                totalProfit: 0,
                role: log.employeeId.role,
                photo: log.employeeId.photo,
              };
            }
            employeeProfitMap[empId].totalProfit += profit;
          }
        });

        // 4. Find top performer
        const topEmployeeData = Object.values(employeeProfitMap).reduce(
          (top, emp) => (emp.totalProfit > (top?.totalProfit || 0) ? emp : top),
          null
        );
        if (!topEmployeeData) return;

        // 5. Count present days
        let presentDays = 0;
        attendance.forEach((record) => {
          const recordDate = new Date(record.date);
          const empId = typeof record.employeeId === 'object'
            ? record.employeeId?._id?.toString()
            : record.employeeId?.toString();

          const isCurrentMonth =
            recordDate.getMonth() === currentMonth &&
            recordDate.getFullYear() === currentYear;

          if (
            record.status === 'Present' &&
            empId === topEmployeeData.employeeId.toString() &&
            isCurrentMonth
          ) {
            presentDays += 1;
          }
        });

        // 6. Performance target lookup
        const employeePerformance = performanceData.find((perf) => {
          const perfId = typeof perf.employeeId === "object"
            ? perf.employeeId._id?.toString()
            : perf.employeeId?.toString();
          return perfId === topEmployeeData.employeeId.toString();
        });

        const target = employeePerformance ? employeePerformance.target : 10000;

        // 7. Handle photo from storage
        const storedEmployee = JSON.parse(localStorage.getItem('employee') || '{}');
        const photoToUse = topEmployeeData.photo || storedEmployee.photo || '';

        // 8. Final top employee object
        setTopEmployee({
          _id: topEmployeeData.employeeId,
          name: topEmployeeData.name,
          email: topEmployeeData.email,
          photo: photoToUse,
          totalSales: topEmployeeData.totalProfit || 0,
          role: topEmployeeData.role || 'N/A',
          presentDays,
          target,
        });
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (performanceData.length > 0) {
      fetchTopPerformerWithAttendance();
    }
  }, [performanceData, API_URL, token]);

  // 📷 Photo upload
  // const handlePhotoUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !topEmployee) return;

  //   const formData = new FormData();
  //   formData.append('photo', file);

  //   try {
  //     const res = await axios.patch(
  //       `${API_URL}/employees/${topEmployee._id}/photo`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     alert('📷 Photo updated!');
  //     const newPhoto = res.data.filename;

  //     const updatedUser = { ...topEmployee, photo: newPhoto };
  //     setTopEmployee(updatedUser);
  //     localStorage.setItem('employee', JSON.stringify(updatedUser));
  //   } catch (err) {
  //     alert('❌ Failed to upload photo');
  //     console.error(err);
  //   }
  // };

  // const getPhotoURL = (photo) => {
  //   if (!photo) {
  //     return 'https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png';
  //   }
  //   const baseUrl = API_URL.replace('/api', '');
  //   return photo.startsWith('http')
  //     ? `${photo}?ts=${Date.now()}`
  //     : `${baseUrl}/uploads/${photo}?ts=${Date.now()}`;
  // };

  const getDisplayId = (employee) => {
    if (!employee) return '';
    return employee.employeeCode || `FBZ-${employee._id?.slice(-6).toUpperCase()}`;
  };
  console.log("Top Employee Data:", topEmployee);

  return (
    <div className="w-full p-6 mx-auto border border-indigo-100 shadow-lg bg-gradient-to-br from-white to-indigo-50 rounded-2xl max-w-8xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-800">🏆 Employee of the Month</h2>
          <p className="text-sm text-indigo-600/80">
            Top performer based on <span className="font-semibold">profit generated</span>
          </p>
        </div>
        <div className="px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
          {new Date().toLocaleString('default', { month: 'long' })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-indigo-200 rounded-full"></div>
            <div className="flex-1 py-1 space-y-4">
              <div className="w-3/4 h-4 bg-indigo-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-indigo-200 rounded"></div>
                <div className="w-5/6 h-4 bg-indigo-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : topEmployee ? (
        // <div className="flex flex-col gap-6 sm:flex-row">


        //   <div className="relative self-center flex-shrink-0">
        //     <div className="relative group">
        //       <div className="flex items-center justify-center w-24 h-24 mb-12 transition-transform duration-300 bg-yellow-400 border-4 border-yellow-400 rounded-full shadow-md group-hover:scale-105">
        //         <svg
        //           viewBox="0 0 24 24"
        //           className="w-12 h-12 text-white"
        //           fill="currentColor"
        //           aria-hidden="true"
        //         >
        //           <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z" />
        //         </svg>
        //       </div>

        //       <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow-sm">
        //         #1 PERFORMER
        //       </div>
        //     </div>
        //   </div>

        //   <div className="flex-1">

        //     <div className="grid h-20 grid-cols-3 gap-3">
        //       <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Name</div>
        //         <div className="font-bold text-indigo-900">{topEmployee.name}</div>
        //       </div>

        //       <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Employee ID</div>
        //         <div className="font-mono text-sm text-gray-700">{getDisplayId(topEmployee)}</div>
        //       </div>

        //       <div className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Present Days</div>
        //         <div className="font-bold text-green-600">{topEmployee.presentDays}</div>
        //       </div>
        //     </div>


        //     <div className="grid grid-cols-3 gap-3 mt-4">
        //       <div className="p-3 text-center bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Profit</div>
        //         <div className="font-bold text-green-600">${(topEmployee.totalSales || 0).toLocaleString()}</div>
        //       </div>
        //       <div className="p-3 text-center bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Target</div>
        //         <div className="font-bold text-blue-600">${(topEmployee.target || 0).toLocaleString()}</div>
        //       </div>
        //       <div className="p-3 text-center bg-white border border-gray-100 rounded-lg shadow-sm">
        //         <div className="text-xs font-medium text-gray-500">Achieved</div>
        //         <div className="font-bold text-indigo-600">
        //           {(((topEmployee.totalSales || 0) / (topEmployee.target || 1)) * 100).toFixed(1)}%
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>


<div className="flex flex-col gap-6 p-6 transition-all duration-300 transform border border-indigo-100 shadow-lg sm:flex-row bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl hover:shadow-xl">
  {/* Employee Avatar Section */}
  <div className="relative self-center flex-shrink-0">
    <div className="relative group">
      <div className="flex items-center justify-center transition-all duration-300 border-4 border-white rounded-full shadow-2xl w-28 h-28 bg-gradient-to-br from-yellow-400 to-amber-500 group-hover:scale-105 transform-gpu">
        <svg
          viewBox="0 0 24 24"
          className="text-white w-14 h-14 drop-shadow-sm"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z" />
        </svg>
      </div>

      {/* Performance Badge */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap shadow-lg ring-2 ring-white ring-opacity-50">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          TOP PERFORMER
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute w-6 h-6 bg-yellow-400 rounded-full -top-2 -right-2 opacity-80 animate-pulse"></div>
      <div className="absolute w-5 h-5 rounded-full -bottom-4 -left-2 bg-amber-400 opacity-60"></div>
    </div>
  </div>

  {/* Employee Details Section */}
  <div className="flex-1">
    {/* First Row - Basic Info */}
    <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-3">
      <div className="p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md group">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1.5">Name</div>
        <div className="text-lg font-bold text-indigo-900 truncate transition-colors group-hover:text-indigo-600">{topEmployee.name}</div>
      </div>

      <div className="p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md group">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1.5">Employee ID</div>
        <div className="font-mono text-sm font-semibold text-gray-700 truncate">{getDisplayId(topEmployee)}</div>
      </div>

      <div className="p-4 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md group">
        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1.5">Present Days</div>
        <div className="flex items-center text-xl font-bold text-green-600">
          {topEmployee.presentDays}
          <svg className="w-5 h-5 ml-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    {/* Second Row - Performance Metrics */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="p-4 text-center transition-all duration-200 border border-green-100 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md group">
        <div className="mb-2 text-xs font-medium tracking-wide text-green-600 uppercase">Profit</div>
        <div className="text-xl font-bold text-green-700">
          ${(topEmployee.totalSales || 0).toLocaleString()}
        </div>
        <div className="w-12 h-1 mx-auto mt-1 bg-green-200 rounded-full">
          <div className="h-1 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>
      
      <div className="p-4 text-center transition-all duration-200 border border-blue-100 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md group">
        <div className="mb-2 text-xs font-medium tracking-wide text-blue-600 uppercase">Target</div>
        <div className="text-xl font-bold text-blue-700">
          ${(topEmployee.target || 0).toLocaleString()}
        </div>
        <div className="w-12 h-1 mx-auto mt-1 bg-blue-200 rounded-full">
          <div className="h-1 bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
        </div>
      </div>
      
      <div className="p-4 text-center transition-all duration-200 border border-purple-100 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl hover:shadow-md group">
        <div className="mb-2 text-xs font-medium tracking-wide text-purple-600 uppercase">Achieved</div>
        <div className="text-xl font-bold text-purple-700">
          {(((topEmployee.totalSales || 0) / (topEmployee.target || 1)) * 100).toFixed(1)}%
        </div>
        <div className="w-12 h-1 mx-auto mt-1 bg-purple-200 rounded-full">
          <div 
            className="h-1 bg-purple-500 rounded-full" 
            style={{ width: `${Math.min(100, ((topEmployee.totalSales || 0) / (topEmployee.target || 1)) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>

    {/* Achievement Bar */}
    <div className="p-3 mt-6 bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">Performance Progress</span>
        <span className="text-xs font-bold text-indigo-600">
          {Math.min(100, ((topEmployee.totalSales || 0) / (topEmployee.target || 1)) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full" 
          style={{ width: `${Math.min(100, ((topEmployee.totalSales || 0) / (topEmployee.target || 1)) * 100)}%` }}
        ></div>
      </div>
    </div>
  </div>
</div>


      ) : (
        <div className="py-8 text-center text-gray-500">
          No employee data available for this month.
        </div>
      )}
    </div>
  );
};

export default EmployeeOfMonth;




