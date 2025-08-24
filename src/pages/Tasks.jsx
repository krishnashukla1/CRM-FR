
// import { useEffect, useState } from 'react';
// import API from '../api';
// import Layout from '../components/Layout';
// const API_URL = import.meta.env.VITE_API_BASE_URL;
// const Tasks = () => {
//   const [employees, setEmployees] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 5;

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     assignedTo: '',
//     status: 'InProgress',
//      attachment: null,
//   });

//   const fetchData = async () => {
//     try {
//       const [empRes, taskRes] = await Promise.all([
//         // API.get('/employees'),
//         API.get('/employees?page=1&perPage=100'),
//         API.get('/tasks'),
//       ]);

//       setEmployees(empRes.data.data || []);
//       setTasks(taskRes.data.data || []);
//     } catch (err) {
//       console.error('Error fetching tasks/employees:', err);
//     }
//   };

//   // const addTask = async () => {
//   //   try {
//   //     await API.post('/tasks', form);
//   //     setForm({ title: '', description: '', assignedTo: '', status: 'InProgress' });
//   //     fetchData();
//   //   } catch (err) {
//   //     console.error('Failed to add task:', err);
//   //   }
//   // };
// const addTask = async () => {
//   try {
//     const formData = new FormData();
//     formData.append('title', form.title);
//     formData.append('description', form.description);
//     formData.append('assignedTo', form.assignedTo);
//     formData.append('status', form.status);
//     if (form.attachment) {
//       formData.append('attachment', form.attachment);
//     }

//     await API.post('/tasks', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     setForm({
//       title: '',
//       description: '',
//       assignedTo: '',
//       status: 'InProgress',
//       attachment: null,
//     });

//     fetchData();
//   } catch (err) {
//     console.error('Failed to add task:', err);
//   }
// };

//   const updateTaskStatus = async (id, status) => {
//     try {
//       await API.patch(`/tasks/${id}/status`, { status });
//       fetchData();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Layout>
//       <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//         <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">📝 Task Assignments</h1>

//         {/* Add Task Form */}
//         <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mb-10">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Assign New Task</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <input
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Task Title"
//               value={form.title}
//               onChange={e => setForm({ ...form, title: e.target.value })}
//             />

//             <textarea
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-1"
//               rows="1"
//               placeholder="Task Description"
//               value={form.description}
//               onChange={e => setForm({ ...form, description: e.target.value })}
//             ></textarea>

//             <select
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={form.assignedTo}
//               onChange={e => setForm({ ...form, assignedTo: e.target.value })}
//             >
//               <option value="">Select Employee</option>
//               {employees.map(emp => (
//                 <option key={emp._id} value={emp._id}>{emp.name}</option>
//               ))}
//             </select>
//             <input
//   type="file"
//   onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
//   className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
// />

//             <button
//               onClick={addTask}
//               className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow md:col-span-4"
//             >
//               Assign Task
//             </button>
//           </div>
//         </div>

//         {/* Task List */}
//         <div className="space-y-4 max-w-5xl mx-auto">
//           {/* {Array.isArray(tasks) && tasks.map(task => ( */}

//           {Array.isArray(tasks) && tasks
//             .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
//             .map(task => (


//               <div
//                 key={task._id}
//                 className="bg-white text-gray-900 p-5 rounded-xl shadow border border-gray-200"
//               >
//                 <p className="mb-1 text-lg font-semibold text-indigo-700">
//                   📝 {task.title}
//                 </p>

//                 <p className="mb-1 text-sm">
//                   <span className="font-medium text-gray-700">Assigned To:</span>{' '}
//                   {task.assignedTo?.name || 'Unassigned'}
//                 </p>

//                 <p className="mb-1 text-sm text-gray-700">
//                   <span className="font-medium">Description:</span>{' '}
//                   {task.description || 'No description'}
//                 </p>

//                 <p className="mb-3 text-sm">
//                   <span className="font-medium">Status:</span>{' '}
//                   <span className={`font-semibold ${task.status === 'Completed'
//                     ? 'text-green-600'
//                     : task.status === 'InProgress'
//                       ? 'text-blue-600'
//                       : 'text-red-600'
//                     }`}>
//                     {task.status}
//                   </span>
//                 </p>

//                 <select
//                   value={task.status}
//                   onChange={e => updateTaskStatus(task._id, e.target.value)}
//                   className="p-2 border border-indigo-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 >
//                   <option value="InProgress">InProgress</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//             ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center gap-4 mt-8">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
//           >
//             ⬅ Previous
//           </button>

//           <span className="font-semibold text-gray-700">Page {currentPage}</span>

//           <button
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             disabled={currentPage * tasksPerPage >= tasks.length}
//             className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
//           >
//             Next ➡
//           </button>
//         </div>

//       </div>
//     </Layout>
//   );
// };

// export default Tasks;



//===================================================

// import { useEffect, useState } from 'react';
// import API from '../api';
// import Layout from '../components/Layout';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Tasks = () => {
//   const [employees, setEmployees] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingTask, setEditingTask] = useState(null);
//   const tasksPerPage = 5;

//   const [form, setForm] = useState({
//     title: '',
//     description: '',
//     assignedTo: '',
//     status: 'InProgress',
//     attachment: null,
//   });

//   const fetchData = async () => {
//     try {
//       const [empRes, taskRes] = await Promise.all([
//         API.get('/employees?page=1&perPage=100'),
//         API.get('/tasks'),
//       ]);

//       setEmployees(empRes.data.data || []);
//       setTasks(taskRes.data.data || []);
//     } catch (err) {
//       console.error('Error fetching tasks/employees:', err);
//     }
//   };

//   const addTask = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', form.title);
//       formData.append('description', form.description);
//       formData.append('assignedTo', form.assignedTo);
//       formData.append('status', form.status);
//       if (form.attachment) {
//         formData.append('attachment', form.attachment);
//       }

//       await API.post('/tasks', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setForm({
//         title: '',
//         description: '',
//         assignedTo: '',
//         status: 'InProgress',
//         attachment: null,
//       });

//       fetchData();
//     } catch (err) {
//       console.error('Failed to add task:', err);
//     }
//   };

//   const updateTaskStatus = async (id, status) => {
//     try {
//       await API.patch(`/tasks/${id}/status`, { status });
//       fetchData();
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const handleEditTask = (task) => {
//     setEditingTask(task);
//     setForm({
//       title: task.title,
//       description: task.description,
//       assignedTo: task.assignedTo?._id || '',
//       status: task.status,
//       attachment: null, // Don't pre-fill attachment for edit
//     });
//   };

//   const updateTask = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', form.title);
//       formData.append('description', form.description);
//       formData.append('assignedTo', form.assignedTo);
//       formData.append('status', form.status);
//       if (form.attachment) {
//         formData.append('attachment', form.attachment);
//       }

//       await API.put(`/tasks/${editingTask._id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setEditingTask(null);
//       setForm({
//         title: '',
//         description: '',
//         assignedTo: '',
//         status: 'InProgress',
//         attachment: null,
//       });
//       fetchData();
//     } catch (err) {
//       console.error('Failed to update task:', err);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       if (window.confirm('Are you sure you want to delete this task?')) {
//         await API.delete(`/tasks/${id}`);
//         fetchData();
//       }
//     } catch (err) {
//       console.error('Failed to delete task:', err);
//     }
//   };

//   const cancelEdit = () => {
//     setEditingTask(null);
//     setForm({
//       title: '',
//       description: '',
//       assignedTo: '',
//       status: 'InProgress',
//       attachment: null,
//     });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Layout>
//       <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//         <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">📝 Task Assignments</h1>

//         {/* Add/Edit Task Form */}
//         <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mb-10">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">
//             {editingTask ? '✏️ Edit Task' : '➕ Assign New Task'}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <input
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Task Title"
//               value={form.title}
//               onChange={e => setForm({ ...form, title: e.target.value })}
//             />

//             <textarea
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-1"
//               rows="1"
//               placeholder="Task Description"
//               value={form.description}
//               onChange={e => setForm({ ...form, description: e.target.value })}
//             ></textarea>

//             <select
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               value={form.assignedTo}
//               onChange={e => setForm({ ...form, assignedTo: e.target.value })}
//             >
//               <option value="">Select Employee</option>
//               {employees.map(emp => (
//                 <option key={emp._id} value={emp._id}>{emp.name}</option>
//               ))}
//             </select>

//             <input
//               type="file"
//               onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />

//             {editingTask ? (
//               <div className="flex gap-2 md:col-span-4">
//                 <button
//                   onClick={updateTask}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow flex-1"
//                 >
//                   Update Task
//                 </button>
//                 <button
//                   onClick={cancelEdit}
//                   className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow flex-1"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={addTask}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow md:col-span-4"
//               >
//                 Assign Task
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Task List */}
//         <div className="space-y-4 max-w-5xl mx-auto">
//           {Array.isArray(tasks) && tasks
//             .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
//             .map(task => (
//               <div
//                 key={task._id}
//                 className="bg-white text-gray-900 p-5 rounded-xl shadow border border-gray-200"
//               >
//                 <div className="flex justify-between items-start">
//                   <p className="mb-1 text-lg font-semibold text-indigo-700">
//                     📝 {task.title}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEditTask(task)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteTask(task._id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>

//                 <p className="mb-1 text-sm">
//                   <span className="font-medium text-gray-700">Assigned To:</span>{' '}
//                   {task.assignedTo?.name || 'Unassigned'}
//                 </p>

//                 <p className="mb-1 text-sm text-gray-700">
//                   <span className="font-medium">Description:</span>{' '}
//                   {task.description || 'No description'}
//                 </p>

//                 {task.attachment && (
//                   <div className="mb-2">
//                     <span className="font-medium text-sm">Attachment:</span>{' '}
//                     <a
//                       href={`${API_URL}${task.attachment}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline text-sm"
//                     >
//                       View Attachment
//                     </a>
//                   </div>
//                 )}

//                 <div className="flex justify-between items-center">
//                   <p className="text-sm">
//                     <span className="font-medium">Status:</span>{' '}
//                     <span className={`font-semibold ${task.status === 'Completed'
//                       ? 'text-green-600'
//                       : task.status === 'InProgress'
//                         ? 'text-blue-600'
//                         : 'text-red-600'
//                       }`}>
//                       {task.status}
//                     </span>
//                   </p>

//                   <select
//                     value={task.status}
//                     onChange={e => updateTaskStatus(task._id, e.target.value)}
//                     className="p-2 border border-indigo-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
//                   >
//                     <option value="InProgress">InProgress</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               </div>
//             ))}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center gap-4 mt-8">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
//           >
//             ⬅ Previous
//           </button>

//           <span className="font-semibold text-gray-700">Page {currentPage}</span>

//           <button
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             disabled={currentPage * tasksPerPage >= tasks.length}
//             className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
//           >
//             Next ➡
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Tasks;

//---------------------------------------------

import { useEffect, useState } from 'react';
import API from '../api';
import Layout from '../components/Layout';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Tasks = () => {
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

  const fetchData = async () => {
    try {
      const [empRes, taskRes] = await Promise.all([
        API.get('/employees?page=1&perPage=100'),
        API.get('/tasks'),
      ]);

      setEmployees(empRes.data.data || []);
      setTasks(taskRes.data.data || []);
    } catch (err) {
      console.error('Error fetching tasks/employees:', err);
    }
  };

  const addTask = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('assignedTo', form.assignedTo);
      formData.append('status', form.status);
      if (form.attachment) {
        formData.append('attachment', form.attachment);
      }

      await API.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({
        title: '',
        description: '',
        assignedTo: '',
        status: 'InProgress',
        attachment: null,
      });

      fetchData();
    } catch (err) {
      console.error('Failed to add task:', err);
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
      attachment: null, // Don't pre-fill attachment for edit
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

    setEditingTask(null);
    setForm({
      title: '',
      description: '',
      assignedTo: '',
      status: 'InProgress',
      attachment: null,
    });
    fetchData();
  } catch (err) {
    console.error('Failed to update task:', err);
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
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
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
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">📝 Task Assignments</h1>

        {/* Add/Edit Task Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingTask ? '✏️ Edit Task' : '➕ Assign New Task'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Task Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 md:col-span-1"
              rows="1"
              placeholder="Task Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            ></textarea>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.assignedTo}
              onChange={e => setForm({ ...form, assignedTo: e.target.value })}
            >
              <option value="">Select Employee</option>
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
                className="bg-indigo-600 !text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow md:col-span-4 "
             >
                Assign Task
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {Array.isArray(tasks) && tasks
            .slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)
            .map(task => (
              <div
                key={task._id}
                className="bg-white text-gray-900 p-5 rounded-xl shadow border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <p className="mb-1 text-lg font-semibold text-indigo-700">
                    📝 {task.title}
                  </p>
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

                <p className="mb-1 text-sm">
                  <span className="font-medium text-gray-700">Assigned To:</span>{' '}
                  {task.assignedTo?.name || 'Unassigned'}
                </p>

                <p className="mb-1 text-sm text-gray-700">
                  <span className="font-medium">Description:</span>{' '}
                  {task.description || 'No description'}
                </p>

                {task.attachment && (
                  <div className="mb-2">
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
                    <span className={`font-semibold ${task.status === 'Completed'
                      ? 'text-green-600'
                      : task.status === 'InProgress'
                        ? 'text-blue-600'
                        : 'text-red-600'
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
<option value="InProgress">InProgress</option>
<option value="Completed">Completed</option>

                  </select>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
          >
            ⬅ Previous
          </button>

          <span className="font-semibold text-gray-700">Page {currentPage}</span>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage * tasksPerPage >= tasks.length}
            className="px-4 py-2 bg-gray-300 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Tasks;