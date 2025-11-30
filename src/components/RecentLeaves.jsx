import { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL; // or defined elsewhere

const statusColor = {
  Approved: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
};

const RecentLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [page, setPage] = useState(1);
  // const perPage = 5;
  const perPage = 5;


  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        // `http://localhost:5000/api/leaves?page=${page}&perPage=${perPage}&sort=-from`

        `${API_URL}/leaves?page=${page}&perPage=${perPage}&sort=-from`
      );
      setLeaves(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page]);

  const formatDate = (dateStr) => {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      const date = new Date(parsed);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return 'Invalid Date';
  };

  return (
    // <div className="bg-white p-5 rounded-xl w-[1300px] shadow border text-gray-800">
    <div className="w-full p-5 text-gray-800 bg-white border shadow rounded-xl">

      {/* <div className="p-5 text-gray-800 bg-white border shadow rounded-xl max-w-7xl"> */}
      {/* <div className="p-5 text-gray-800 bg-white border shadow rounded-xl w-7xl">  */}
      {/* <div className="w-full p-5 text-gray-800 bg-white border shadow rounded-xl"> */}



      <p className="mb-4 text-xl font-semibold">📝 Recent Leave Requests</p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className="text-xs text-gray-600 uppercase bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center">Employee</th>
              <th className="px-4 py-2 text-center">From</th>
              <th className="px-4 py-2 text-center">To</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave, i) => (
                <tr
                  key={i}
                  className="transition-all border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {leave.employeeId?.name || 'N/A'}
                  </td>
                  <td className="px-2 py-2 text-gray-700">{formatDate(leave.from)}</td>
                  <td className="px-4 py-2 text-gray-700">{formatDate(leave.to)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[leave.status] || 'bg-gray-200 text-gray-700'}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-xs bg-gray-200 rounded cursor-pointer hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 text-xs bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default RecentLeaves;

