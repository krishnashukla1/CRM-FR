import React, { useEffect, useState } from 'react';
import API from '../api';
import Layout from '../components/Layout';
import dayjs from 'dayjs';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Leave = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newLeaveQuota, setNewLeaveQuota] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [updatingQuota, setUpdatingQuota] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [editingQuota, setEditingQuota] = useState(null);
  const [editingUsedDays, setEditingUsedDays] = useState(null);
  const [tempUsedDays, setTempUsedDays] = useState('');
  const [editingLeave, setEditingLeave] = useState(null);
  const leavesPerPage = 10;

  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchEmployees(), fetchLeaves(), fetchWeeklyOffs()]);
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await API.get('/employees');
      setEmployees(res.data.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get('/leaves?populate=employeeId');
      setLeaves(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching leaves:', err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyOffs = async () => {
    try {
      const res = await API.get('/weekly-offs');
      setWeeklyOffs(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching weekly offs:', err);
      setWeeklyOffs([]);
    }
  };

  const handleUpdateQuota = async (empId) => {
    setUpdatingQuota(true);
    try {
      await API.patch(`/employees/${empId}/leave-quota`, { leaveQuota: newLeaveQuota });
      await fetchEmployees(); // Refresh to get updated remainingDays from server
      setEditingQuota(null);
    } catch (err) {
      console.error('Error updating leave quota:', err);
      await fetchEmployees();
    } finally {
      setUpdatingQuota(false);
    }
  };

  const handleUsedDaysChange = async (employeeId, newUsedDays) => {
    try {
      setUpdatingQuota(true);
      const response = await API.patch(`/employees/${employeeId}/used-days`, {
        usedDays: parseInt(newUsedDays, 10),
      });

      // Update local state with the complete employee data from the response
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp._id === employeeId ? response.data.data : emp
        )
      );

      setEditingUsedDays(null);
      setTempUsedDays('');
    } catch (error) {
      console.error('Error updating used days:', error);
      await fetchEmployees();
    } finally {
      setUpdatingQuota(false);
    }
  };

  const { employeeStats, globalStats, processedLeaves } = React.useMemo(() => {
    const globalStats = {
      totalLeaves: 0,
      approvedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
      weeklyOffCount: 0,
    };

    const employeeStats = {};
    const allProcessedLeaves = [];

    employees.forEach((emp) => {
      const weeklyOff = weeklyOffs.find(
        (off) => off.employeeId?._id === emp._id || off.employeeId === emp._id
      );

      // Use database values for usedDays and remainingDays
      const usedDays = emp.usedDays ?? 0;
      const annualQuota = emp.leaveQuota ?? 20;
      const remainingDays = emp.remainingDays ?? Math.max(annualQuota - usedDays, 0);

      employeeStats[emp._id] = {
        ...emp,
        annualQuota,
        usedDays,
        remainingDays,
        weeklyOffDay: weeklyOff?.dayOfWeek || 'Sunday',
        monthlyUsedDays: 0,
        leaves: [],
      };
    });

    const countWeeklyOffsBetween = (startDate, endDate, offDay) => {
      let count = 0;
      const current = new Date(startDate);
      const end = new Date(endDate);
      const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };
      const targetDay = dayMap[offDay];

      while (current <= end) {
        if (current.getDay() === targetDay) count++;
        current.setDate(current.getDate() + 1);
      }
      return count;
    };

    leaves.forEach((leave) => {
      if (!leave?.from || !leave?.to || !leave?.employeeId) return;

      const employeeId = leave.employeeId._id || leave.employeeId;
      const employee = employeeStats[employeeId];
      if (!employee) return;

      const fromDate = new Date(leave.from);
      const toDate = new Date(leave.to);

      if (isNaN(fromDate.getTime())) return;

      const totalDays = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
      const weeklyOffs = countWeeklyOffsBetween(fromDate, toDate, employee.weeklyOffDay);
      const leaveDays = totalDays - weeklyOffs;

      const processedLeave = {
        ...leave,
        employeeId,
        employeeName: employee.name,
        fromDate,
        toDate,
        totalDays,
        weeklyOffs,
        leaveDays,
        isWeeklyOff: weeklyOffs > 0 && leaveDays === 0,
        month: fromDate.getMonth() + 1,
        year: fromDate.getFullYear(),
      };

      globalStats.totalLeaves++;
      switch (leave.status) {
        case 'Approved':
          globalStats.approvedCount++;
          break;
        case 'Rejected':
          globalStats.rejectedCount++;
          break;
        case 'Pending':
          globalStats.pendingCount++;
          break;
        default:
          break;
      }

      employee.leaves.push(processedLeave);
      allProcessedLeaves.push(processedLeave);

      if (
        leave.status === 'Approved' &&
        fromDate.getMonth() + 1 === selectedMonth &&
        fromDate.getFullYear() === selectedYear
      ) {
        employee.monthlyUsedDays += leaveDays;
      }
    });

    return { employeeStats, globalStats, processedLeaves: allProcessedLeaves };
  }, [leaves, employees, weeklyOffs, selectedMonth, selectedYear]);

  const StatusDropdown = ({ currentStatus, leaveId, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    const handleStatusSelect = async (status) => {
      setSelectedStatus(status);
      setIsOpen(false);
      await onStatusChange(leaveId, status);
    };

    return (
      <div className="relative inline-block text-left">
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex justify-center w-full rounded-md px-4 py-2 text-sm font-medium ${statusColors[selectedStatus]} hover:bg-opacity-80 focus:outline-none`}
          >
            {selectedStatus}
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 z-10 w-32 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {['Approved', 'Rejected', 'Pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`block w-full text-left px-4 py-2 text-sm ${statusColors[status]} hover:bg-opacity-70`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await API.put(`/leaves/${leaveId}/status`, { status: newStatus });
      await fetchLeaves();
      await fetchEmployees(); // Refresh to update usedDays/remainingDays
      alert('Status updated successfully!');
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Error updating status');
    }
  };

  const handleSaveLeave = async (leaveId, updatedData) => {
    try {
      await API.put(`/leaves/${leaveId}`, updatedData);
      await fetchLeaves();
      await fetchEmployees(); // Refresh to update usedDays/remainingDays
      alert('Leave updated successfully!');
    } catch (err) {
      console.error('Error updating leave:', err);
      alert('Failed to update leave');
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      leave.reason?.toLowerCase().includes(searchLower) ||
      leave.leaveType?.toLowerCase().includes(searchLower) ||
      leave.status?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredLeaves.length / leavesPerPage);
  const currentLeaves = filteredLeaves.slice(
    (currentPage - 1) * leavesPerPage,
    currentPage * leavesPerPage
  );

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 1 + i;
    return { value: year, label: year };
  });

  const adminFilteredLeaves = React.useMemo(() => {
    let result = processedLeaves.filter(
      (leave) => leave.month === selectedMonth && leave.year === selectedYear
    );

    if (selectedEmployee !== 'all') {
      result = result.filter((leave) => leave.employeeId === selectedEmployee);
    }

    return result;
  }, [processedLeaves, selectedMonth, selectedYear, selectedEmployee]);

  const EditLeaveModal = ({ leave, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      from: leave.from,
      to: leave.to,
      reason: leave.reason,
      leaveType: leave.leaveType,
      status: leave.status,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSave(leave._id, formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Edit Leave</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md cursor-pointer"
                >
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Leave Without Pay">Leave Without Pay</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md cursor-pointer"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 text-gray-900 bg-gray-100">
        <h1 className="mb-6 text-2xl font-bold text-indigo-700">📝 Leave Management</h1>

        {/* Filters */}
        <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow">
          <h2 className="mb-3 text-lg font-semibold">Filters</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {yearOptions.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Leaves</h3>
            <p className="text-2xl font-semibold">{globalStats.totalLeaves}</p>
          </div>
          <div className="p-4 bg-white border border-green-100 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-semibold text-green-600">{globalStats.approvedCount}</p>
          </div>
          <div className="p-4 bg-white border border-red-100 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-semibold text-red-600">{globalStats.rejectedCount}</p>
          </div>
          <div className="p-4 bg-white border border-yellow-100 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-semibold text-yellow-600">{globalStats.pendingCount}</p>
          </div>
        </div>

        {/* Employee Leave Quotas */}
        <div className="p-5 mb-6 bg-white border border-gray-200 rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">Employee Leave Quotas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Annual Quota
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Used Days
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Remaining Days
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((emp) => {
                  const stats = employeeStats[emp._id] || {};
                  const isEditingQuota = editingQuota === emp._id;
                  const isEditingUsedDays = editingUsedDays === emp._id;

                  return (
                    <tr key={emp._id}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {isEditingQuota ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={newLeaveQuota}
                              onChange={(e) => setNewLeaveQuota(e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                              min="0"
                            />
                            <button
                              onClick={() => handleUpdateQuota(emp._id)}
                              className="!text-green-600 !hover:text-green-800 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingQuota(null)}
                              className="!text-red-600 !hover:text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {emp.leaveQuota || 20}
                            <button
                              onClick={() => {
                                setEditingQuota(emp._id);
                                setNewLeaveQuota(emp.leaveQuota || 20);
                              }}
                              className="!text-blue-600 !hover:text-blue-800 text-xs cursor-pointer"

                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {isEditingUsedDays ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={tempUsedDays}
                              onChange={(e) => setTempUsedDays(e.target.value)}
                              className="w-20 px-2 py-1 border rounded"
                              min="0"
                              max={emp.leaveQuota || 20}
                            />
                            <button
                              onClick={() => handleUsedDaysChange(emp._id, tempUsedDays)}
                              className="!text-green-600 !hover:text-green-800 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUsedDays(null)}
                              className="!text-red-600 hover:text-gray-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {emp.usedDays ?? 0}
                            <button
                              onClick={() => {
                                setEditingUsedDays(emp._id);
                                setTempUsedDays(emp.usedDays ?? 0);
                              }}
                              className="!text-blue-600 hover:text-blue-800 text-xs cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {stats.remainingDays}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEmployee(emp._id)}
                          className="!text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          View Leaves
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="p-5 mb-6 bg-white border border-gray-200 rounded-lg shadow">
          <h2 className="mb-4 text-lg font-semibold">
            {new Date(selectedYear, selectedMonth - 1, 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}{' '}
            Summary
          </h2>
          {selectedEmployee === 'all' ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
                <h3 className="text-sm font-medium text-gray-700">Total Leaves Taken</h3>
                <p className="text-xl font-semibold">
                  {adminFilteredLeaves.filter((l) => l.status === 'Approved').length}
                </p>
              </div>
              <div className="p-4 border border-yellow-100 rounded-lg bg-yellow-50">
                <h3 className="text-sm font-medium text-gray-700">Pending Approvals</h3>
                <p className="text-xl font-semibold text-yellow-600">
                  {adminFilteredLeaves.filter((l) => l.status === 'Pending').length}
                </p>
              </div>
              <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
                <h3 className="text-sm font-medium text-gray-700">Weekly Offs</h3>
                <p className="text-xl font-semibold text-purple-600">
                  {adminFilteredLeaves.filter((l) => l.isWeeklyOff).length}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Monthly Quota</h3>
                <p className="text-xl font-semibold">
                  {((employeeStats[selectedEmployee]?.annualQuota || 12) / 12).toFixed(1)} days
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Used This Month</h3>
                <p className="text-xl font-semibold">
                  {employeeStats[selectedEmployee]?.monthlyUsedDays || 0} days
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Leave History Table */}
        <div className="mb-6 overflow-hidden bg-white border border-gray-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Leave History for {monthOptions[selectedMonth - 1].label} {selectedYear}
              {selectedEmployee !== 'all' && ` - ${employeeStats[selectedEmployee]?.name}`}
            </h2>
          </div>

          {adminFilteredLeaves.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      #
                    </th>
                    {selectedEmployee === 'all' && (
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Employee
                      </th>
                    )}
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Period
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Days
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Document
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminFilteredLeaves.map((leave, index) => (
                    <tr key={leave._id || index} className={leave.isWeeklyOff ? 'bg-purple-50' : ''}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {index + 1}
                      </td>
                      {selectedEmployee === 'all' && (
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {leave.employeeName}
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {dayjs(leave.fromDate).format('DD MMM YYYY')} -{' '}
                        {dayjs(leave.toDate).format('DD MMM YYYY')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {leave.totalDays}{' '}
                        {leave.weeklyOffs > 0 &&
                          `(${leave.leaveDays} + ${leave.weeklyOffs} ${employeeStats[leave.employeeId]?.weeklyOffDay
                          })`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {leave.isWeeklyOff
                          ? `Weekly Off (${employeeStats[leave.employeeId]?.weeklyOffDay})`
                          : leave.leaveType || 'Regular Leave'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {leave.document ? (
                          <a
                            href={`${API_URL}/uploads/documents/${leave.document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            View Document
                          </a>
                        ) : (
                          <span className="text-gray-400">No Document</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusDropdown
                          currentStatus={leave.status}
                          leaveId={leave._id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <button
                          onClick={() => setEditingLeave(leave)}
                          className="mr-2 text-blue-600 cursor-pointer hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No leave records found for selected filters
            </div>
          )}
        </div>

        {editingLeave && (
          <EditLeaveModal
            leave={editingLeave}
            onClose={() => setEditingLeave(null)}
            onSave={handleSaveLeave}
          />
        )}
      </div>
    </Layout>
  );
};

export default Leave;

