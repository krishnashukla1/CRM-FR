// import React from 'react';

// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const EmployeeTasks = () => {
//   const { employee } = useOutletContext();

//   const [tasks, setTasks] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState('');

//   React.useEffect(() => {
//     const fetchTasks = async () => {
//       if (!employee || !employee._id) {
//         setError('Employee ID not found.');
//         setLoading(false);
//         return;
//       }

//       try {
//         // const res = await fetch(`/tasks?assignedTo=${employee._id}`);

//         const res = await fetch(`https://crm-backend-f4lj.onrender.com/api/tasks?assignedTo=${employee._id}`);

        
//         if (!res.ok) throw new Error('Failed to fetch tasks');
//         const data = await res.json();
//         setTasks(data?.data || []);
//       } catch (err) {
//         setError(err.message || 'Error fetching tasks');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, [employee]);

//   return (
//     <PageWithCloseButton title="📋 My Tasks">
//       {loading ? (
//         <p className="text-gray-500 text-center">Loading tasks...</p>
//       ) : error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : tasks.length === 0 ? (
//         <p className="text-gray-500 text-center">No tasks assigned yet.</p>
//       ) : (
//         <div className="overflow-x-auto mt-4">
//           <table className="min-w-full text-sm border rounded">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-4 py-2 border">#</th>
//                 <th className="px-4 py-2 border">Title</th>
//                 <th className="px-4 py-2 border">Description</th>
//                 <th className="px-4 py-2 border">Status</th>
//                 <th className="px-4 py-2 border">Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task, idx) => (
//                 <tr key={task._id || idx}>
//                   <td className="px-4 py-2 border">{idx + 1}</td>
//                   <td className="px-4 py-2 border">{task.title}</td>
//                   <td className="px-4 py-2 border">{task.description || '-'}</td>
//                   <td className={`px-4 py-2 border font-medium ${
//                     task.status === 'Completed' ? 'text-green-600' :
//                     task.status === 'InProgress' ? 'text-blue-600' :
//                     task.status === 'Pending' ? 'text-yellow-600' :
//                     task.status === 'Not Started' ? 'text-gray-600' :
//                     'text-red-500'
//                   }`}>
//                     {task.status}
//                   </td>
//                   <td className="px-4 py-2 border">{new Date(task.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </PageWithCloseButton>
//   );
// };

// export default EmployeeTasks;
//=========================================




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useOutletContext } from 'react-router-dom';

// const EmployeeTasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const { employee } = useOutletContext();

//   const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/tasks?assignedTo=${employee._id}`);
//       setTasks(res.data?.data || []);
//     } catch (err) {
//       console.error('Error fetching tasks:', err);
//       setError(err.message || 'Error fetching tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (employee?._id) {
//       fetchTasks();
//     } else {
//       setError('Employee ID not found');
//       setLoading(false);
//     }
//   }, [employee]);

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       await axios.patch(`${BASE_URL}/tasks/${taskId}/status`, {
//         status: newStatus,
//       });
//       setTasks(prev =>
//         prev.map(task =>
//           task._id === taskId ? { ...task, status: newStatus } : task
//         )
//       );
//     } catch (err) {
//       console.error('Error updating status:', err);
//       alert('Failed to update task status');
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 My Tasks</h2>

//       {loading ? (
//         <p className="text-gray-500">Loading tasks...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : tasks.length === 0 ? (
//         <p className="text-gray-500">No tasks assigned yet.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
//             <thead className="bg-gray-100 text-gray-700 text-left">
//               <tr>
//                 <th className="py-2 px-4 border-b">#</th>
//                 <th className="py-2 px-4 border-b">Title</th>
//                 <th className="py-2 px-4 border-b">Description</th>
//                 <th className="py-2 px-4 border-b">Status</th>
//                 <th className="py-2 px-4 border-b">Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task, index) => (
//                 <tr key={task._id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border-b">{index + 1}</td>
//                   <td className="py-2 px-4 border-b font-medium text-gray-800">{task.title}</td>
//                   <td className="py-2 px-4 border-b text-gray-700">{task.description}</td>
//                   <td className="py-2 px-4 border-b">
//                     <select
//                       value={task.status}
//                       onChange={e => handleStatusChange(task._id, e.target.value)}
//                       className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Completed">Completed</option>
//                     </select>
//                   </td>
//                   <td className="py-2 px-4 border-b text-gray-600">
//                     {new Date(task.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeTasks;

//==================================

// import React from 'react';
// import { useOutletContext } from 'react-router-dom';
// import PageWithCloseButton from './PageWithCloseButton';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const EmployeeTasks = () => {
//   const { employee } = useOutletContext();

//   const [tasks, setTasks] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState('');

//   const fetchTasks = async () => {
//     if (!employee || !employee._id) {
//       setError('Employee ID not found.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_URL}/tasks?assignedTo=${employee._id}`);
//       if (!res.ok) throw new Error('Failed to fetch tasks');
//       const data = await res.json();
//       setTasks(data?.data || []);
//     } catch (err) {
//       setError(err.message || 'Error fetching tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       const res = await fetch(`${API_URL}/tasks/${taskId}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!res.ok) throw new Error('Failed to update task status');

//       setTasks(prev =>
//         prev.map(task =>
//           task._id === taskId ? { ...task, status: newStatus } : task
//         )
//       );
//     } catch (err) {
//       console.error('Status update failed:', err);
//       alert('Failed to update task status');
//     }
//   };

//   React.useEffect(() => {
//     fetchTasks();
//   }, [employee]);

//   const statusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return 'text-green-600 font-semibold';
//       case 'In Progress':
//         return 'text-blue-600 font-semibold';
//       case 'Pending':
//         return 'text-yellow-600 font-semibold';
//       case 'Not Started':
//         return 'text-gray-600';
//       default:
//         return 'text-red-500';
//     }
//   };

//   return (
//     <PageWithCloseButton title="📋 My Tasks">
//       {loading ? (
//         <p className="text-gray-500 text-center">Loading tasks...</p>
//       ) : error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : tasks.length === 0 ? (
//         <p className="text-gray-500 text-center">No tasks assigned yet.</p>
//       ) : (
//         <div className="overflow-x-auto mt-4">
//           <table className="min-w-full text-sm border rounded shadow-sm bg-white">
//             <thead className="bg-gray-100 text-gray-700">
//               <tr>
//                 <th className="px-4 py-2 border">#</th>
//                 <th className="px-4 py-2 border">Title</th>
//                 <th className="px-4 py-2 border">Description</th>
//                 <th className="px-4 py-2 border">Status</th>
//                 <th className="px-4 py-2 border">Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task, idx) => (
//                 <tr key={task._id || idx} className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border text-center">{idx + 1}</td>
//                   <td className="px-4 py-2 border">{task.title}</td>
//                   <td className="px-4 py-2 border">{task.description || '-'}</td>
//                   <td className="px-4 py-2 border">
//                     <select
//                       value={task.status}
//                       onChange={(e) => handleStatusChange(task._id, e.target.value)}
//                       className={`border rounded px-2 py-1 bg-white ${statusColor(task.status)}`}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Completed">Completed</option>
//                       <option value="Not Started">Not Started</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-2 border text-gray-600">
//                     {new Date(task.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </PageWithCloseButton>
//   );
// };

// export default EmployeeTasks;

//================================

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
        <p className="text-gray-500 text-center">Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks assigned yet.</p>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border rounded shadow-sm bg-white">
            <thead className="bg-gray-100 text-gray-700">
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
                  <td className="px-4 py-2 border text-center">{idx + 1}</td>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.description || '-'}</td>
                  <td className="px-4 py-2 border text-center">
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
                  <td className="px-4 py-2 border text-gray-600">
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

