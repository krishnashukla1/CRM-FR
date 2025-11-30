//-----------------correct
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../components/Layout';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);

  const getShiftDate = () => {
    const now = dayjs();
    const shiftStart = now.startOf("day").hour(17); // 5 PM same day

    if (now.isBefore(shiftStart)) {
      // Before 5 AM, still previous shift
      return now.subtract(1, "day").format("YYYY-MM-DD");
    } else {
      return now.format("YYYY-MM-DD");
    }
  };

  const todayShiftDate = getShiftDate();

  const [filter, setFilter] = useState({
    employeeId: '',
    startDate: dayjs(todayShiftDate).startOf('month').format('YYYY-MM-DD'),
    endDate: todayShiftDate
  });

  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalCount: 0
  });
  const [overallStats, setOverallStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalLeave: 0,
    totalWeeklyOff: 0
  });
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [filter, pagination.page]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees?perPage=100&page=1`);
      setEmployees(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setEmployees([]);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        perPage: pagination.perPage,
        ...(filter.employeeId && { employeeId: filter.employeeId }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate })
      };

      const res = await axios.get(`${API_URL}/attendance`, { params });

      if (res.data.status === 'success') {
        setAttendance(Array.isArray(res.data.data) ? res.data.data : []);
        setPagination({
          ...pagination,
          totalPages: res.data.totalPages,
          totalCount: res.data.totalCount
        });
        setOverallStats(res.data.overallStats || {
          totalPresent: 0,
          totalAbsent: 0,
          totalLeave: 0,
          totalWeeklyOff: 0
        });
      }
    } catch (err) {
      console.error('Attendance fetch failed:', err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/attendance/${id}/status`, { status: newStatus });
      fetchAttendance(); // Refresh the data
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update attendance status');
    }
  };

  // Check if status is editable
  const isStatusEditable = (status, isVirtual) => {
    // Only allow editing of Present/Absent for non-virtual records
    return (status === 'Present' || status === 'Absent') && !isVirtual;
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Present': return <span className="font-semibold text-green-600">✅ Present</span>;
      case 'Absent': return <span className="font-semibold text-red-600">❌ Absent</span>;
      case 'Leave': return <span className="font-semibold text-yellow-600">🟡 Leave</span>;
      case 'Weekly Off': return <span className="font-semibold text-blue-600">🔵 Weekly Off</span>;
      default: return <span className="font-semibold text-gray-600">{status}</span>;
    }
  };

  const downloadReport = async () => {
    setDownloadLoading(true);
    try {
      // Fetch all data without pagination for the export
      const params = {
        perPage: 10000, // Large number to get all records
        page: 1,
        ...(filter.employeeId && { employeeId: filter.employeeId }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate })
      };

      const res = await axios.get(`${API_URL}/attendance`, { params });
      const dataToExport = Array.isArray(res.data.data) ? res.data.data : [];

      // Prepare the data for Excel
      const excelData = [
        // Header row
        [
          'Employee Name',
          'Email',
          'Role',
          'Date',
          'Status',
          'Reason',
          'Record Type'
        ],
        // Data rows
        ...dataToExport.map(att => [
          att.employeeId?.name || 'N/A',
          att.employeeId?.email || 'N/A',
          att.employeeId?.role || 'N/A',
          dayjs(att.date).format('YYYY-MM-DD'),
          att.status,
          att.reason || 'N/A',
          att.isVirtual ? 'System Generated' : 'Manual'
        ])
      ];

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");

      // Generate Excel file
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      let filename = `attendance-report`;
      if (filter.employeeId) {
        const employee = employees.find(e => e._id === filter.employeeId);
        filename += `-${employee?.name || 'employee'}`;
      }
      if (filter.startDate && filter.endDate) {
        filename += `-${filter.startDate}-to-${filter.endDate}`;
      }

      link.download = `${filename}.xlsx`;
      link.click();

    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to generate report');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 text-gray-900 bg-gray-100 md:p-6">
        <h2 className="mb-6 text-2xl font-bold text-center text-indigo-700 md:text-3xl">🕒 Attendance Management</h2>

        {/* Filters */}
        <div className="flex flex-col flex-wrap justify-center gap-4 mb-6 sm:flex-row">
          <select
            className="p-2 text-black bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.employeeId}
            onChange={e => setFilter({ ...filter, employeeId: e.target.value })}
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={e => setFilter({ ...filter, startDate: e.target.value })}
            className="p-2 text-black bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <input
            type="date"
            value={filter.endDate}
            onChange={e => setFilter({ ...filter, endDate: e.target.value })}
            className="p-2 text-black bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />

          <button
            onClick={fetchAttendance}
            className="bg-indigo-600 !text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {/* Download Button */}
        <div className="flex justify-center gap-4 mb-6">

          <button
            type="button"
            onClick={downloadReport}
            disabled={downloadLoading || attendance.length === 0}
            className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            Download Excel Report
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
            <p className="text-2xl font-bold">{pagination.totalCount}</p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Present</h3>
            <p className="text-2xl font-bold text-green-600">
              {overallStats.totalPresent}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Absent</h3>
            <p className="text-2xl font-bold text-red-600">
              {overallStats.totalAbsent}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Leave</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {overallStats.totalLeave}
            </p>
          </div>
          <div className="p-4 text-center bg-white rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Weekly Off</h3>
            <p className="text-2xl font-bold text-blue-600">
              {overallStats.totalWeeklyOff}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Mobile Cards View */}
        {!loading && (
          <div className="space-y-4 sm:hidden">
            {attendance.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No attendance records found for selected filters</p>
              </div>
            ) : (
              attendance.map((att) => (
                <div key={att._id} className="p-4 bg-white rounded-lg shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{att.employeeId?.name || 'N/A'}</h3>
                      <p className="text-sm text-gray-600">{att.employeeId?.email || 'N/A'}</p>
                    </div>
                    <span className="text-sm">{dayjs(att.date).format('YYYY-MM-DD')}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>{statusBadge(att.status)}</div>
                    {isStatusEditable(att.status, att.isVirtual) ? (
                      <select
                        value={att.status}
                        onChange={e => handleStatusChange(att._id, e.target.value)}
                        className="p-1.5 text-sm rounded-lg border border-gray-300 shadow-sm cursor-pointer"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      <span className="text-xs italic text-gray-500">System Generated</span>
                    )}
                  </div>
                  {att.reason && (
                    <div className="mt-2 text-sm text-gray-600">
                      Reason: {att.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && (
          <div className="hidden sm:block">
            {attendance.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No attendance records found for selected filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full overflow-hidden text-black bg-white rounded-lg">
                  <thead className="bg-indigo-200 ">
                    <tr>
                      <th className="p-3 text-center">Employee</th>
                      <th className="p-3 text-center">Date</th>
                      <th className="p-3 text-center">Status</th>

                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((att) => (
                      <tr key={att._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{att.employeeId?.name || 'N/A'}</td>

                        <td className="p-3">{dayjs(att.date).format('YYYY-MM-DD')}</td>
                        <td className="p-3">{statusBadge(att.status)}</td>

                        <td className="p-3">
                          {isStatusEditable(att.status, att.isVirtual) ? (
                            <select
                              value={att.status}
                              onChange={e => handleStatusChange(att._id, e.target.value)}
                              className="p-2 text-black bg-white border border-gray-200 rounded-lg shadow cursor-pointer"
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                            </select>
                          ) : (
                            <span className="text-xs italic text-gray-500">System Generated</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* <button
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="px-4 py-2 transition-colors bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
            >
              ⬅ Previous
            </button> */}

            <button
              type="button"   // 👈 Add this line
              disabled={pagination.page === 1}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className="px-4 py-2 transition-colors bg-gray-300 rounded-lg shadow cursor-pointer hover:bg-gray-400 disabled:opacity-50"
            >
              ⬅ Previous
            </button>
            <span className="font-semibold">Page {pagination.page} of {pagination.totalPages}</span>
            {/* <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="px-4 py-2 transition-colors bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
            >
              Next ➡
            </button> */}

            <button
              type="button"   // 👈 Add this line
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className="px-4 py-2 transition-colors bg-gray-300 rounded-lg shadow cursor-pointer hover:bg-gray-400 disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
//------------
