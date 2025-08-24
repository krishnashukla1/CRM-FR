import { useEffect, useState } from 'react';
import API from '../api';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SuperTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTask, setEditingTask] = useState(null);
  const tasksPerPage = 10;

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'InProgress',
    attachment: null,
  });

  // Fetch only team members and their tasks
  const fetchData = async () => {
    try {
      const supervisorId = JSON.parse(localStorage.getItem('user'))._id;

      const [empRes, taskRes] = await Promise.all([
        API.get(`/employees?supervisorId=${supervisorId}&page=1&perPage=100`),
        API.get(`/tasks?supervisorId=${supervisorId}`),
      ]);

      setEmployees(empRes.data.data || []);
      setTasks(taskRes.data.data || []);
    } catch (err) {
      console.error('Error fetching team tasks:', err);
    }
  };

  const addTask = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('assignedTo', form.assignedTo);
      formData.append('status', form.status);
      formData.append('supervisor', JSON.parse(localStorage.getItem('user'))._id);

      if (form.attachment) {
        formData.append('attachment', form.attachment);
      }

      await API.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      resetForm();
      fetchData();
    } catch (err) {
      console.error('Failed to add task:', err);
      alert('Failed to add task: ' + err.message);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo?._id || '',
      status: task.status,
      attachment: null,
    });
  };

  const updateTask = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('assignedTo', form.assignedTo);
      formData.append('status', form.status);

      if (form.attachment) {
        formData.append('attachment', form.attachment);
      }

      await API.patch(`/tasks/${editingTask._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      cancelEdit();
      fetchData();
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task: ' + err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await API.delete(`/tasks/${id}`);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task: ' + err.message);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      assignedTo: '',
      status: 'InProgress',
      attachment: null,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">📝 Team Task Management</h1>

      {/* Task Assignment Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-7xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingTask ? '✏️ Edit Team Task' : '➕ Assign New Team Task'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Task Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-1"
            rows="1"
            placeholder="Task Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          ></textarea>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.assignedTo}
            onChange={e => setForm({ ...form, assignedTo: e.target.value })}
            required
          >
            <option value="">Select Team Member</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {editingTask ? (
            <div className="flex gap-2 md:col-span-4">
              <button
                onClick={updateTask}
                className="bg-green-600 !text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow flex-1"
              >
                Update Task
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-600 !text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow flex-1"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addTask}
              className="bg-indigo-600 !text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow md:col-span-4"
            >
              Assign Task
            </button>
          )}
        </div>
      </div>

      {/* Team Task List */}
      {/* <div className="space-y-4 max-w-7xl mx-auto">
        {tasks.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">No tasks assigned to your team yet.</p>
          </div>
        ) : (
          tasks
            .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
            .map(task => (
              <div
                key={task._id}
                className="bg-white text-gray-900 p-5 rounded-xl shadow border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="mb-1 text-lg font-semibold text-indigo-700">
                      📝 {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned by: {task.supervisor?.name || 'You'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="!text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="!text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="my-2 text-sm">
                  <span className="font-medium">Assigned To:</span>{' '}
                  {task.assignedTo?.name || 'Unassigned'}
                </p>

                <p className="mb-2 text-sm">
                  <span className="font-medium">Description:</span>{' '}
                  {task.description || 'No description'}
                </p>

                {task.attachment && (
                  <div className="mb-3">
                    <span className="font-medium text-sm">Attachment:</span>{' '}
                    <a
                      href={`${API_URL}${task.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Attachment
                    </a>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={`font-semibold ${
                      task.status === 'Completed' ? 'text-green-600' :
                      task.status === 'InProgress' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {task.status}
                    </span>
                  </p>

                  <select
                    value={task.status}
                    onChange={e => updateTaskStatus(task._id, e.target.value)}
                    className="p-2 border border-indigo-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))
        )}
      </div> */}

      {/* Pagination */}
      {/* {tasks.length > tasksPerPage && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅ Previous
          </button>

          <span className="font-semibold text-gray-700">
            Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
          </span>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * tasksPerPage >= tasks.length}
            className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )} */}





      {/* Team Task List - Compact Cards */}
      <div className="max-w-7xl mx-auto">
        {tasks.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">No tasks assigned to your team yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {tasks
              .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
              .map(task => (
                <div
                  key={task._id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-indigo-700 text-sm line-clamp-1 flex-1 mr-2">
                      📝 {task.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-200 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-200 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Assigned Info */}
                  <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                    <span>
                      <span className="font-medium">By:</span> {task.supervisor?.name || 'You'}
                    </span>
                    <span>
                      <span className="font-medium">To:</span> {task.assignedTo?.name || 'Unassigned'}
                    </span>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Attachment */}
                  {task.attachment && (
                    <div className="mb-2">
                      <a
                        href={`${API_URL}${task.attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        View Attachment
                      </a>
                    </div>
                  )}

                  {/* Status Row */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className={`text-xs font-semibold ${task.status === 'Completed' ? 'text-green-600' :
                        task.status === 'InProgress' ? 'text-blue-600' :
                          task.status === 'Pending' ? 'text-yellow-600' :
                            'text-red-600'
                      }`}>
                      {task.status}
                    </span>

                    <select
                      value={task.status}
                      onChange={e => updateTaskStatus(task._id, e.target.value)}
                      className="text-xs p-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Compact Pagination */}
      {tasks.length > tasksPerPage && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, Math.ceil(tasks.length / tasksPerPage)) }, (_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-sm ${isCurrent
                      ? 'bg-indigo-600 !text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {Math.ceil(tasks.length / tasksPerPage) > 5 && (
              <span className="text-gray-500 text-sm">...</span>
            )}
          </div>

          <span className="text-xs text-gray-500 mx-1">
            {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
          </span>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * tasksPerPage >= tasks.length}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
};

export default SuperTasks;