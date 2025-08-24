// import React, { useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import SupervisorSidebar from './SupervisorSidebar';
// import axios from 'axios';

// const SupervisorLayout = ({ sidebarOpen, setSidebarOpen }) => {
//   const [employee, setEmployee] = useState(JSON.parse(localStorage.getItem('employee')) || {});
//   const [attendance, setAttendance] = useState([]);

//   useEffect(() => {
//     const fetchEmployeeAndAttendance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const employee = JSON.parse(localStorage.getItem('employee')) || {};
//         const employeeId = employee._id || localStorage.getItem('employeeId');
        
//         if (!employeeId) {
//           console.error("Employee ID not found");
//           return;
//         }

//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/attendance/${employeeId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` }
//           }
//         );
//         setAttendance(res.data || []);
//       } catch (error) {
//         console.error('Error fetching attendance:', error);
//       }
//     };

//     fetchEmployeeAndAttendance();
//   }, [employee?._id]);

//   return (
//     <div className="flex min-h-screen">
//       <SupervisorSidebar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//         employee={employee}
//       />
//       <main className="flex-1 p-4 md:p-6">
//         <Outlet context={{ employee, attendance }} />
//       </main>
//     </div>
//   );
// };

// export default SupervisorLayout;
//===================

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SupervisorSidebar from './SupervisorSidebar';
import axios from 'axios';

const SupervisorLayout = ({ sidebarOpen, setSidebarOpen }) => {
  const [employee, setEmployee] = useState(JSON.parse(localStorage.getItem('employee')) || {});
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const currentEmployee = JSON.parse(localStorage.getItem('employee')) || {};
      const employeeId = currentEmployee._id || localStorage.getItem('employeeId');
      
      if (!employeeId || !token) throw new Error('Authentication data missing');

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}`;
      
      const [attendanceRes, leavesRes] = await Promise.all([
        axios.get(`${apiUrl}/attendance/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${apiUrl}/leaves`, {  // Modified endpoint
          params: { employeeId },
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('Leaves API Response:', leavesRes?.data);

      // Handle different response formats
      let leavesData = [];
      if (Array.isArray(leavesRes?.data)) {
        leavesData = leavesRes.data;
      } else if (leavesRes?.data?.leaves) {
        leavesData = leavesRes.data.leaves;
      } else if (leavesRes?.data?.data) {
        leavesData = leavesRes.data.data;
      }

      const processedLeaves = leavesData.map(leave => ({
        _id: leave._id,
        employeeId: leave.employeeId?._id || employeeId,
        employeeName: leave.employeeId?.name || currentEmployee.name,
        from: leave.from || leave.startDate || leave.fromDate,
        to: leave.to || leave.endDate || leave.toDate,
        status: leave.status,
        leaveType: leave.leaveType || 'Regular Leave',
        reason: leave.reason || ''
      }));

      console.log('Processed Leaves:', processedLeaves);
      
      setEmployee(currentEmployee);
      setAttendance(attendanceRes?.data || []);
      setLeaves(processedLeaves);
      setError(null);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <div className="flex min-h-screen">
      <SupervisorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        employee={employee}
      />
      <main className="flex-1 p-4 md:p-6">
        <Outlet context={{ 
          employee,
          currentEmployee: employee,
          attendance,
          leaves,
          loading,
          error
        }} />
      </main>
    </div>
  );
};

export default SupervisorLayout;
//------------------------



