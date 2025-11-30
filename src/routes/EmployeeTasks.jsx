import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const EmployeeTasks = () => {
  const { employee } = useOutletContext();

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const fetchTasks = async () => {
    if (!employee || !employee._id) {
      setError('Employee ID not found.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks?assignedTo=${employee._id}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data?.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task status');

      setTasks(prev =>
        prev.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update task status');
    }
  };

  React.useEffect(() => {
    fetchTasks();
  }, [employee]);

  const statusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 font-semibold';
      case 'InProgress':
        return 'text-blue-600 font-semibold';
      case 'Pending':
        return 'text-yellow-600 font-semibold';
      case 'Not Started':
        return 'text-gray-600';
      default:
        return 'text-red-500';
    }
  };

  return (
    <PageWithCloseButton title="📋 My Tasks">
      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks assigned yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm bg-white border rounded shadow-sm">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Attachment</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.description || '-'}</td>
                  <td className="px-4 py-2 text-center border">
                    {task.attachment ? (
                      <a
                        href={`${API_URL}${task.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`border rounded px-2 py-1 bg-white ${statusColor(task.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">InProgress</option>
                      <option value="Completed">Completed</option>
                      <option value="Not Started">Not Started</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-600 border">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWithCloseButton>
  );
};

export default EmployeeTasks;

