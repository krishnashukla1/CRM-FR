
import { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const badgeColor = {
  InProgress: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  'Not Scored': 'bg-red-100 text-red-800',
  Planned: 'bg-yellow-100 text-yellow-800',
};

const TaskOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;


  const fetchTasks = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/api/tasks?page=${page}`);

      const res = await axios.get(`${API_URL}/tasks?page=${page}&perPage=${perPage}&sort=-from`);

      setTasks(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  // Group productivity % per employee
  const getProductivityMap = () => {
    const map = {};
    tasks.forEach(task => {
      const name = task.assignedTo?.name || 'Unassigned';
      if (!map[name]) map[name] = { total: 0, completed: 0 };
      map[name].total += 1;
      if (task.status === 'Completed') map[name].completed += 1;
    });

    const productivity = {};
    for (const name in map) {
      const { total, completed } = map[name];
      productivity[name] = total ? Math.round((completed / total) * 100) : 0;
    }

    return productivity;
  };

  const productivityMap = getProductivityMap();


  return (
    <div className="p-5 text-gray-800 bg-white border shadow rounded-xl">
      <p className="mb-4 text-lg font-semibold">🗂️ Task Overview</p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-700 bg-gray-100">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Assigned To</th>
              <th className="px-4 py-2">Productivity</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.assignedTo?.name || 'N/A'}</td>
                  {/* ✅ Productivity column */}
                  <td className="px-4 py-2 font-semibold text-green-700">
                    {productivityMap[task.assignedTo?.name] !== undefined
                      ? `${productivityMap[task.assignedTo?.name]}%`
                      : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor[task.status] || 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm bg-gray-100 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50"
        >
          ⬅ Previous
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm bg-gray-100 rounded cursor-pointer hover:bg-gray-200 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default TaskOverview;
