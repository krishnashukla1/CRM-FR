// import { useEffect, useState } from 'react';

// import API from '../api';

// const SuperEmployees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingId, setEditingId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const perPage = 10;

//   // Supervisor-specific roles (limited compared to admin)
//   const roles = [
//     'Quality Analyst',
//     'Developer',
//     'Graphic Designer',
//     'Sales Executive',
//     'HR','TKT'
//   ];

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     role: '',
//     salary: '',
//     dateOfJoining: new Date().toISOString().split('T')[0],
//     photo: null,
//   });

//   // Fetch only employees under this supervisor
//   const fetchEmployees = async () => {
//     try {
//       const supervisorId = JSON.parse(localStorage.getItem('user'))._id;
//       const res = await API.get(`/employees?supervisorId=${supervisorId}&page=1&perPage=100`);
//       let teamEmployees = Array.isArray(res.data.data) ? res.data.data : [];

//       // Sort by createdAt (newest first)
//       teamEmployees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       setEmployees(teamEmployees);
//     } catch (error) {
//       console.error('Error fetching team employees:', error);
//       setEmployees([]);
//     }
//   };

//   // Supervisor can only add team members (not all employees)
//   const addEmployee = async () => {
//     if (!form.name || !form.email || !form.role || !form.dateOfJoining) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);
//       formData.append('supervisor', JSON.parse(localStorage.getItem('user'))._id);
      
//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       await API.post('/employees', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       resetForm();
//       setCurrentPage(1);
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Error adding team member:', error);
//       alert('Failed to add team member: ' + error.message);
//     }
//   };

//   // Supervisor can only update their team members
//   const updateEmployee = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);

//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       };

//       let response;
//       try {
//         response = await API.put(`/employees/${editingId}`, formData, config);
//       } catch (putError) {
//         console.log('PUT failed, trying PATCH...');
//         response = await API.patch(`/employees/${editingId}`, formData, config);
//       }

//       console.log('Update successful:', response.data);
//       resetForm();
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Update failed:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       alert(`Update failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingId(emp._id);
//     setIsEditing(true);
//     setForm({
//       name: emp.name,
//       email: emp.email,
//       role: emp.role,
//       salary: emp.salary || '',
//       dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//   };

//   // Supervisor can only delete their team members
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to remove this team member?')) {
//       try {
//         await API.delete(`/employees/${id}`);
//         await fetchEmployees();
//       } catch (error) {
//         console.error('Error removing team member:', error);
//         alert('Failed to remove team member');
//       }
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       name: '',
//       email: '',
//       role: '',
//       salary: '',
//       dateOfJoining: new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//     setEditingId(null);
//     setIsEditing(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       updateEmployee();
//     } else {
//       addEmployee();
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Pagination Logic
//   const totalPages = Math.ceil(employees.length / perPage);
//   const paginatedEmployees = employees.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//       {/* Changed title to reflect team management */}
//       <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">👥 My Team Management</h1>

//       {/* Add/Edit Team Member Form */}
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           {isEditing ? '✏️ Edit Team Member' : '➕ Add New Team Member'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Email"
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Salary"
//                 type="number"
//                 value={form.salary}
//                 onChange={(e) => setForm({ ...form, salary: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.dateOfJoining}
//                 onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//             <input
//               type="file"
//               accept="image/*"
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
//             />
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="bg-red-800 hover:bg-red-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//             >
//               {isEditing ? 'Update Team Member' : 'Add Team Member'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Team Member List with Pagination */}
//       {/* <div className="max-w-7xl mx-auto space-y-4">
//         <h2 className="text-xl font-semibold text-gray-700 mb-3">👨‍💼 My Team Members</h2>
//         {employees.length === 0 ? (
//           <p className="text-center text-gray-500">No team members added yet.</p>
//         ) : (
//           <>
//             {paginatedEmployees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row md:justify-between items-start md:items-center"
//               >
//                 <div className="flex items-center gap-3">
//                   <img
//                     src={
//                       emp.photo
//                         ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${emp.photo}?ts=${Date.now()}`
//                         : 'https://via.placeholder.com/150'
//                     }
//                     alt={emp.name}
//                     className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = 'https://via.placeholder.com/150';
//                     }}
//                   />
//                   <div>
//                     <p className="text-lg font-semibold text-indigo-700">{emp.name}</p>
//                     <p className="text-sm text-gray-600">{emp.role}</p>
//                     {emp.salary && (
//                       <p className="text-sm text-gray-600">${emp.salary}</p>
//                     )}
//                     {emp.dateOfJoining && (
//                       <p className="text-xs text-gray-500">
//                         📅 Joined on: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 mt-2 md:mt-0">
//                   <p className="text-sm text-gray-500">{emp.email}</p>
//                   <button
//                     onClick={() => handleEdit(emp)}
//                     className="ml-2 text-indigo-600 hover:text-indigo-800"
//                   >
//                     ✏️
//                   </button>
//                   <button
//                     onClick={() => handleDelete(emp._id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <div className="flex justify-between items-center mt-6">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//               >
//                 ⬅️ Previous
//               </button>
//               <span className="text-gray-600 font-medium">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//               >
//                 Next ➡️
//               </button>
//             </div>
//           </>
//         )}
//       </div> */}

//       <div className="max-w-7xl mx-auto space-y-4">
//   <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//     <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mr-3">
//       👨‍💼
//     </span>
//     My Team Members
//   </h2>
  
//   {employees.length === 0 ? (
//     <div className="text-center py-10">
//       <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
//         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       </div>
//       <p className="text-gray-500 text-lg">No team members added yet.</p>
//     </div>
//   ) : (
//     <>
//       {paginatedEmployees.map((emp) => (
//         <div
//           key={emp._id}
//           className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-start md:items-center border-l-4 border-indigo-500"
//         >
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <img
//                 src={
//                   emp.photo
//                     ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${emp.photo}?ts=${Date.now()}`
//                     : 'https://via.placeholder.com/150'
//                 }
//                 alt={emp.name}
//                 className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/150';
//                 }}
//               />
//               {emp.isActive && (
//                 <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//               )}
//             </div>
//             <div>
//               <p className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                 {emp.name}
//               </p>
//               <p className="text-sm text-gray-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block">
//                 {emp.role}
//               </p>
//               <div className="flex items-center gap-3 mt-1">
//                 {emp.salary && (
//                   <span className="text-sm font-medium text-gray-700 flex items-center">
//                     <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     ${emp.salary}
//                   </span>
//                 )}
//                 {emp.dateOfJoining && (
//                   <span className="text-xs text-gray-500 flex items-center">
//                     <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Joined: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3 mt-3 md:mt-0">
//             <a href={`mailto:${emp.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center">
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//               {emp.email}
//             </a>
            
//             <div className="flex gap-2 ml-4">
//               {/* Edit Button - Blue */}
//               <button
//                 onClick={() => handleEdit(emp)}
//                 className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//                 title="Edit"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 <span className="sr-only">Edit</span>
//               </button>
              
//               {/* Delete Button - Red */}
//               <button
//                 onClick={() => handleDelete(emp._id)}
//                 className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                 title="Delete"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 <span className="sr-only">Delete</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-8">
//         <button
//           onClick={prevPage}
//           disabled={currentPage === 1}
//           className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//           </svg>
//           Previous
//         </button>
        
//         <div className="flex items-center space-x-1">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
        
//         <button
//           onClick={nextPage}
//           disabled={currentPage === totalPages}
//           className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           Next
//           <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
//     </>
//   )}
// </div>
//     </div>
//   );
// };

// export default SuperEmployees;

//=========================
// import { useEffect, useState } from 'react';

// import API from '../api';

// const SuperEmployees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingId, setEditingId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const perPage = 10;

//   // Supervisor-specific roles (limited compared to admin)
//   const roles = [
//     'Quality Analyst',
//     'Developer',
//     'Graphic Designer',
//     'Sales Executive',
//     'HR','TKT'
//   ];

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     role: '',
//     salary: '',
//     dateOfJoining: new Date().toISOString().split('T')[0],
//     photo: null,
//   });


//   // Fetch only employees under this supervisor
// const fetchEmployees = async () => {
//   try {
//     const supervisorId = JSON.parse(localStorage.getItem('user'))._id;
//     const res = await API.get(`/employees?userId=${supervisorId}&page=1&perPage=100`);
//     let teamEmployees = Array.isArray(res.data.data) ? res.data.data : [];

//     // Sort by createdAt (newest first)
//     teamEmployees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     setEmployees(teamEmployees);
//   } catch (error) {
//     console.error('Error fetching team employees:', error);
//     setEmployees([]);
//   }
// };

// // Add new employee
// const addEmployee = async () => {
//   if (!form.name || !form.email || !form.role || !form.dateOfJoining) {
//     alert('Please fill in all required fields');
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('email', form.email);
//     formData.append('role', form.role);
//     formData.append('salary', form.salary);
//     formData.append('dateOfJoining', form.dateOfJoining);
//     formData.append('status', form.status || 'Active'); // default Active
//     formData.append('userId', JSON.parse(localStorage.getItem('user'))._id);

//     if (form.photo) {
//       formData.append('photo', form.photo);
//     }

//     await API.post('/employees', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     resetForm();
//     setCurrentPage(1);
//     await fetchEmployees();
//   } catch (error) {
//     console.error('Error adding team member:', error);
//     alert('Failed to add team member: ' + error.message);
//   }
// };

//   // Supervisor can only update their team members
//   const updateEmployee = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);

//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       };

//       let response;
//       try {
//         response = await API.put(`/employees/${editingId}`, formData, config);
//       } catch (putError) {
//         console.log('PUT failed, trying PATCH...');
//         response = await API.patch(`/employees/${editingId}`, formData, config);
//       }

//       console.log('Update successful:', response.data);
//       resetForm();
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Update failed:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       alert(`Update failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingId(emp._id);
//     setIsEditing(true);
//     setForm({
//       name: emp.name,
//       email: emp.email,
//       role: emp.role,
//       salary: emp.salary || '',
//       dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//   };

//   // Supervisor can only delete their team members
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to remove this team member?')) {
//       try {
//         await API.delete(`/employees/${id}`);
//         await fetchEmployees();
//       } catch (error) {
//         console.error('Error removing team member:', error);
//         alert('Failed to remove team member');
//       }
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       name: '',
//       email: '',
//       role: '',
//       salary: '',
//       dateOfJoining: new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//     setEditingId(null);
//     setIsEditing(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       updateEmployee();
//     } else {
//       addEmployee();
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Pagination Logic
//   const totalPages = Math.ceil(employees.length / perPage);
//   const paginatedEmployees = employees.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//       {/* Changed title to reflect team management */}
//       <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">👥 My Team Management</h1>

//       {/* Add/Edit Team Member Form */}
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           {isEditing ? '✏️ Edit Team Member' : '➕ Add New Team Member'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Email"
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Salary"
//                 type="number"
//                 value={form.salary}
//                 onChange={(e) => setForm({ ...form, salary: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.dateOfJoining}
//                 onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="mt-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//             <input
//               type="file"
//               accept="image/*"
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//               onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
//             />
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="bg-red-800 hover:bg-red-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//             >
//               {isEditing ? 'Update Team Member' : 'Add Team Member'}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="max-w-7xl mx-auto space-y-4">
//   <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//     <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mr-3">
//       👨‍💼
//     </span>
//     My Team Members
//   </h2>
  
//   {employees.length === 0 ? (
//     <div className="text-center py-10">
//       <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
//         <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//       </div>
//       <p className="text-gray-500 text-lg">No team members added yet.</p>
//     </div>
//   ) : (
//     <>
//       {paginatedEmployees.map((emp) => (
//         <div
//           key={emp._id}
//           className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-start md:items-center border-l-4 border-indigo-500"
//         >
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <img
//                 src={
//                   emp.photo
//                     ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${emp.photo}?ts=${Date.now()}`
//                     : 'https://via.placeholder.com/150'
//                 }
//                 alt={emp.name}
//                 className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/150';
//                 }}
//               />
//               {emp.isActive && (
//                 <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//               )}
//             </div>
//             <div>
//               <p className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                 {emp.name}
//               </p>
//               <p className="text-sm text-gray-600 font-medium bg-indigo-50 px-2 py-0.5 rounded inline-block">
//                 {emp.role}
//               </p>
//               <div className="flex items-center gap-3 mt-1">
//                 {emp.salary && (
//                   <span className="text-sm font-medium text-gray-700 flex items-center">
//                     <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     ${emp.salary}
//                   </span>
//                 )}
//                 {emp.dateOfJoining && (
//                   <span className="text-xs text-gray-500 flex items-center">
//                     <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                     Joined: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3 mt-3 md:mt-0">
//             <a href={`mailto:${emp.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center">
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//               </svg>
//               {emp.email}
//             </a>
            
//             <div className="flex gap-2 ml-4">
//               {/* Edit Button - Blue */}
//               <button
//                 onClick={() => handleEdit(emp)}
//                 className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//                 title="Edit"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 <span className="sr-only">Edit</span>
//               </button>
              
//               {/* Delete Button - Red */}
//               <button
//                 onClick={() => handleDelete(emp._id)}
//                 className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                 title="Delete"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 <span className="sr-only">Delete</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-8">
//         <button
//           onClick={prevPage}
//           disabled={currentPage === 1}
//           className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//           </svg>
//           Previous
//         </button>
        
//         <div className="flex items-center space-x-1">
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
        
//         <button
//           onClick={nextPage}
//           disabled={currentPage === totalPages}
//           className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           Next
//           <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
//     </>
//   )}
// </div>
//     </div>
//   );
// };

// export default SuperEmployees;

//===========================FULL CORRECT CODE ===============================
// FIRST OFF ALL USER REGISTRATION WIYH 'role' tehn automatic will be show user detail in employee
// list now we can edit employee details like add photo,sallary etc

// import { useEffect, useState } from 'react'; 
// import API from '../api';

// const SuperEmployees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingId, setEditingId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const perPage = 10;

//   // Roles from your system
//   const roles = [
//     'Quality Analyst',
//     'Accountant',
//     'Developer',
//     'Graphic Designer',
//     'Sales Executive',
//     'HR',
//     'Manager',
//     'TKT'
//   ];

//   // Status options
//   const statusOptions = ['Active', 'Inactive', 'On Leave'];

//   const [form, setForm] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     role: '',
//     status: 'Active',
//     salary: '',
//     dateOfJoining: new Date().toISOString().split('T')[0],
//     photo: null,
//   });

//   // Fetch all employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await API.get('/employees?page=1&perPage=100');
//       let allEmployees = Array.isArray(res.data.data) ? res.data.data : [];

//       // Sort by createdAt (newest first)
//       allEmployees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       setEmployees(allEmployees);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       setEmployees([]);
//     }
//   };

//   // Add new employee
//   const addEmployee = async () => {
//     if (!form.name || !form.email || !form.role || !form.dateOfJoining) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('userId', form.userId);
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('status', form.status);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);
      
//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       await API.post('/employees', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       resetForm();
//       setCurrentPage(1);
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Failed to add employee: ' + error.message);
//     }
//   };

//   // Update employee
//   const updateEmployee = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('userId', form.userId);
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('status', form.status);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);

//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       };

//       await API.put(`/employees/${editingId}`, formData, config);

//       resetForm();
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Update failed:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       alert(`Update failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingId(emp._id);
//     setIsEditing(true);
//     setForm({
//       userId: emp.userId || '',
//       name: emp.name,
//       email: emp.email,
//       role: emp.role,
//       status: emp.status || 'Active',
//       salary: emp.salary || '',
//       dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         await API.delete(`/employees/${id}`);
//         await fetchEmployees();
//       } catch (error) {
//         console.error('Error deleting employee:', error);
//         alert('Failed to delete employee');
//       }
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       userId: '',
//       name: '',
//       email: '',
//       role: '',
//       status: 'Active',
//       salary: '',
//       dateOfJoining: new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//     setEditingId(null);
//     setIsEditing(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       updateEmployee();
//     } else {
//       addEmployee();
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Pagination Logic
//   const totalPages = Math.ceil(employees.length / perPage);
//   const paginatedEmployees = employees.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//       <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">👥 Employee Management</h1>

//       {/* Add/Edit Employee Form */}
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           {isEditing ? '✏️ Edit Employee' : '➕ Add New Employee'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="User ID"
//                 value={form.userId}
//                 onChange={(e) => setForm({ ...form, userId: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Email"
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.status}
//                 onChange={(e) => setForm({ ...form, status: e.target.value })}
//               >
//                 {statusOptions.map((status) => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Salary"
//                 type="number"
//                 value={form.salary}
//                 onChange={(e) => setForm({ ...form, salary: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date*</label>
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.dateOfJoining}
//                 onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="bg-red-800 hover:bg-red-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//             >
//               {isEditing ? 'Update Employee' : 'Add Employee'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Employee List with Pagination */}
//       <div className="max-w-7xl mx-auto space-y-4">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//           <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mr-3">
//             👨‍💼
//           </span>
//           Employee List
//         </h2>
        
//         {employees.length === 0 ? (
//           <div className="text-center py-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <p className="text-gray-500 text-lg">No employees added yet.</p>
//           </div>
//         ) : (
//           <>
//             {paginatedEmployees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-start md:items-center border-l-4 border-indigo-500"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <img
//                       src={
//                         emp.photo
//                           ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${emp.photo}?ts=${Date.now()}`
//                           : 'https://via.placeholder.com/150'
//                       }
//                       alt={emp.name}
//                       className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = 'https://via.placeholder.com/150';
//                       }}
//                     />
//                     {emp.status === 'Active' && (
//                       <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                       {emp.name} {emp.userId && `(${emp.userId})`}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       <span className="text-sm font-medium text-gray-600 bg-indigo-50 px-2 py-0.5 rounded">
//                         {emp.role}
//                       </span>
//                       <span className={`text-sm font-medium px-2 py-0.5 rounded ${
//                         emp.status === 'Active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : emp.status === 'On Leave' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {emp.status}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3 mt-2">
//                       {emp.salary && (
//                         <span className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           ${emp.salary}
//                         </span>
//                       )}
//                       {emp.dateOfJoining && (
//                         <span className="text-xs text-gray-500 flex items-center">
//                           <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           Joined: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3 mt-3 md:mt-0">
//                   <a href={`mailto:${emp.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center">
//                     <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {emp.email}
//                   </a>
                  
//                   <div className="flex gap-2 ml-4">
//                     <button
//                       onClick={() => handleEdit(emp)}
//                       className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//                       title="Edit"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                       <span className="sr-only">Edit</span>
//                     </button>
                    
//                     <button
//                       onClick={() => handleDelete(emp._id)}
//                       className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                       title="Delete"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                       <span className="sr-only">Delete</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-8">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Previous
//               </button>
              
//               <div className="flex items-center space-x-1">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       currentPage === i + 1 ? 'bg-indigo-400 !text-white' : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
              
//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Next
//                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuperEmployees;


//================================
// import { useEffect, useState } from 'react'; 
// import API from '../api';

// const SuperEmployees = () => {
//   const [employees, setEmployees] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [editingId, setEditingId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [photoVersion, setPhotoVersion] = useState(0); // Add this for cache busting
//   const perPage = 10;

//   // Roles from your system
//   const roles = [
//     'Quality Analyst',
//     'Accountant',
//     'Developer',
//     'Graphic Designer',
//     'Sales Executive',
//     'HR',
//     'Manager',
//     'TKT'
//   ];

//   // Status options
//   const statusOptions = ['Active', 'Inactive', 'On Leave'];

//   const [form, setForm] = useState({
//     userId: '',
//     name: '',
//     email: '',
//     role: '',
//     status: 'Active',
//     salary: '',
//     dateOfJoining: new Date().toISOString().split('T')[0],
//     photo: null,
//   });

//   // Function to get photo URL with cache busting
//   const getPhotoUrl = (photo) => {
//     if (!photo) {
//       return 'https://via.placeholder.com/150';
//     }
    
//     // Get base URL correctly
//     const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
    
//     // Add cache busting parameter
//     return `${baseUrl}/uploads/${photo}?v=${photoVersion}`;
//   };

//   // Fetch all employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await API.get('/employees?page=1&perPage=100');
//       let allEmployees = Array.isArray(res.data.data) ? res.data.data : [];

//       // Sort by createdAt (newest first)
//       allEmployees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       setEmployees(allEmployees);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//       setEmployees([]);
//     }
//   };

//   // Add new employee
//   const addEmployee = async () => {
//     if (!form.name || !form.email || !form.role || !form.dateOfJoining) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('userId', form.userId);
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('status', form.status);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);

//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       await API.post('/employees', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       resetForm();
//       setCurrentPage(1);
//       // Increment photo version to refresh all images
//       setPhotoVersion(prev => prev + 1);
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Failed to add employee: ' + error.message);
//     }
//   };

//   // Update employee
//   const updateEmployee = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('userId', form.userId);
//       formData.append('name', form.name);
//       formData.append('email', form.email);
//       formData.append('role', form.role);
//       formData.append('status', form.status);
//       formData.append('salary', form.salary);
//       formData.append('dateOfJoining', form.dateOfJoining);

//       if (form.photo) {
//         formData.append('photo', form.photo);
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       };

//       await API.put(`/employees/${editingId}`, formData, config);

//       resetForm();
//       // Increment photo version to refresh all images
//       setPhotoVersion(prev => prev + 1);
//       await fetchEmployees();
//     } catch (error) {
//       console.error('Update failed:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
//       alert(`Update failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleEdit = (emp) => {
//     setEditingId(emp._id);
//     setIsEditing(true);
//     setForm({
//       userId: emp.userId || '',
//       name: emp.name,
//       email: emp.email,
//       role: emp.role,
//       status: emp.status || 'Active',
//       salary: emp.salary || '',
//       dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this employee?')) {
//       try {
//         await API.delete(`/employees/${id}`);
//         await fetchEmployees();
//       } catch (error) {
//         console.error('Error deleting employee:', error);
//         alert('Failed to delete employee');
//       }
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       userId: '',
//       name: '',
//       email: '',
//       role: '',
//       status: 'Active',
//       salary: '',
//       dateOfJoining: new Date().toISOString().split('T')[0],
//       photo: null,
//     });
//     setEditingId(null);
//     setIsEditing(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       updateEmployee();
//     } else {
//       addEmployee();
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // Pagination Logic
//   const totalPages = Math.ceil(employees.length / perPage);
//   const paginatedEmployees = employees.slice((currentPage - 1) * perPage, currentPage * perPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
//       <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">👥 Employee Management</h1>

//       {/* Add/Edit Employee Form */}
//       <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           {isEditing ? '✏️ Edit Employee' : '➕ Add New Employee'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="User ID"
//                 value={form.userId}
//                 onChange={(e) => setForm({ ...form, userId: e.target.value })}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Full Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Email"
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.role}
//                 onChange={(e) => setForm({ ...form, role: e.target.value })}
//                 required
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.status}
//                 onChange={(e) => setForm({ ...form, status: e.target.value })}
//               >
//                 {statusOptions.map((status) => (
//                   <option key={status} value={status}>{status}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
//               <input
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 placeholder="Salary"
//                 type="number"
//                 value={form.salary}
//                 onChange={(e) => setForm({ ...form, salary: e.target.value })}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date*</label>
//               <input
//                 type="date"
//                 className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
//                 value={form.dateOfJoining}
//                 onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//                 onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end space-x-3">
//             {isEditing && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="bg-red-800 hover:bg-red-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-indigo-600 hover:bg-indigo-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
//             >
//               {isEditing ? 'Update Employee' : 'Add Employee'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Employee List with Pagination */}
//       <div className="max-w-7xl mx-auto space-y-4">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
//           <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mr-3">
//             👨‍💼
//           </span>
//           Employee List
//         </h2>
        
//         {employees.length === 0 ? (
//           <div className="text-center py-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             </div>
//             <p className="text-gray-500 text-lg">No employees added yet.</p>
//           </div>
//         ) : (
//           <>
//             {paginatedEmployees.map((emp) => (
//               <div
//                 key={emp._id}
//                 className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-start md:items-center border-l-4 border-indigo-500"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="relative">
//                     <img
//                       src={getPhotoUrl(emp.photo)}
//                       alt={emp.name}
//                       className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = 'https://via.placeholder.com/150';
//                       }}
//                     />
//                     {emp.status === 'Active' && (
//                       <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
//                       {emp.name} {emp.userId && `(${emp.userId})`}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mt-1">
//                       <span className="text-sm font-medium text-gray-600 bg-indigo-50 px-2 py-0.5 rounded">
//                         {emp.role}
//                       </span>
//                       <span className={`text-sm font-medium px-2 py-0.5 rounded ${
//                         emp.status === 'Active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : emp.status === 'On Leave' 
//                             ? 'bg-yellow-100 text-yellow-800' 
//                             : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {emp.status}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3 mt-2">
//                       {emp.salary && (
//                         <span className="text-sm font-medium text-gray-700 flex items-center">
//                           <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           ${emp.salary}
//                         </span>
//                       )}
//                       {emp.dateOfJoining && (
//                         <span className="text-xs text-gray-500 flex items-center">
//                           <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           Joined: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3 mt-3 md:mt-0">
//                   <a href={`mailto:${emp.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center">
//                     <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin='round' strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     {emp.email}
//                   </a>
                  
//                   <div className="flex gap-2 ml-4">
//                     <button
//                       onClick={() => handleEdit(emp)}
//                       className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
//                       title="Edit"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                       <span className="sr-only">Edit</span>
//                     </button>
                    
//                     <button
//                       onClick={() => handleDelete(emp._id)}
//                       className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors duration-200 group"
//                       title="Delete"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                       <span className="sr-only">Delete</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Pagination */}
//             <div className="flex justify-between items-center mt-8">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 1}
//                 className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Previous
//               </button>
              
//               <div className="flex items-center space-x-1">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                       currentPage === i + 1 ? 'bg-indigo-400 !text-white' : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
              
//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 Next
//                 <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SuperEmployees;


//========new without photo================
import { useEffect, useState } from 'react';
import API from '../api';
import Layout from '../components/Layout';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const perPage = 10;

  // Roles from your system
  const roles = [
    'Quality Analyst',
    'Accountant',
    'Developer',
    'Graphic Designer',
    'Sales Executive',
    'HR',
    'Manager',
    'TKT'
  ];

  // Status options
  const statusOptions = ['Active', 'Inactive', 'On Leave'];

  const [form, setForm] = useState({
    userId: '',
    name: '',
    email: '',
    role: '',
    status: 'Active',
    salary: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
  });

  // Function to get employee photo (always returns default)
  const getEmployeePhoto = () => {
    return 'https://via.placeholder.com/150?text=Employee';
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await API.get('/employees?page=1&perPage=100');
      let allEmployees = Array.isArray(res.data.data) ? res.data.data : [];

      // Sort by createdAt (newest first)
      allEmployees.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setEmployees(allEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  // Add new employee
  const addEmployee = async () => {
    if (!form.name || !form.email || !form.role || !form.dateOfJoining) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await API.post('/employees', {
        userId: form.userId,
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        salary: form.salary,
        dateOfJoining: form.dateOfJoining,
        // Photo field is omitted - backend will use default empty string
      });

      resetForm();
      setCurrentPage(1);
      await fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee: ' + error.message);
    }
  };

  // Update employee
  const updateEmployee = async () => {
    try {
      await API.put(`/employees/${editingId}`, {
        userId: form.userId,
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        salary: form.salary,
        dateOfJoining: form.dateOfJoining,
        // Photo field is omitted - backend will keep existing value
      });

      resetForm();
      await fetchEmployees();
    } catch (error) {
      console.error('Update failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setIsEditing(true);
    setForm({
      userId: emp.userId || '',
      name: emp.name,
      email: emp.email,
      role: emp.role,
      status: emp.status || 'Active',
      salary: emp.salary || '',
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await API.delete(`/employees/${id}`);
        await fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const resetForm = () => {
    setForm({
      userId: '',
      name: '',
      email: '',
      role: '',
      status: 'Active',
      salary: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(employees.length / perPage);
  const paginatedEmployees = employees.slice((currentPage - 1) * perPage, currentPage * perPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">👥 Employee Management</h1>

        {/* Add/Edit Employee Form */}
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {isEditing ? '✏️ Edit Employee' : '➕ Add New Employee'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  placeholder="User ID"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
                  placeholder="Salary"
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date*</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-1/2"
                value={form.dateOfJoining}
                onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
                required
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-red-800 hover:bg-red-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 !text-white px-6 py-2 rounded-lg shadow-md transition-all"
              >
                {isEditing ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>

        {/* Employee List with Pagination */}
        <div className="max-w-7xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mr-3">
              👨‍💼
            </span>
            Employee List
          </h2>

          {employees.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No employees added yet.</p>
            </div>
          ) : (
            <>
              {paginatedEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row md:justify-between items-start md:items-center border-l-4 border-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    {/* <div className="relative">
                      <img
                        src={getEmployeePhoto()}
                        alt={emp.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                      />
                      {emp.status === 'Active' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div> */}

                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-indigo-400 flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor" aria-hidden="true">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z" />
                        </svg>
                      </div>

                      {emp.status === 'Active' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>


                    {/* <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor" aria-hidden="true">
                          <path d="M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Zm1 3h4V5h-4v1Zm2 7a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm-5 4h10v-.5c0-2.209-2.686-3.5-5-3.5s-5 1.291-5 3.5V17Z" />
                        </svg>
                      </div>

                      {emp.status === 'Active' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div> */}



                    <div>
                      <p className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                        {emp.name} {emp.userId && `(${emp.userId})`}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {emp.role}
                        </span>
                        <span className={`text-sm font-medium px-2 py-0.5 rounded ${emp.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : emp.status === 'On Leave'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {emp.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {emp.salary && (
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ${emp.salary}
                          </span>
                        )}
                        {emp.dateOfJoining && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg className="w-4 h-4 text-indigo-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Joined: {new Date(emp.dateOfJoining).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    <a href={`mailto:${emp.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {emp.email}
                    </a>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="sr-only">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition-colors duration-200 group"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === i + 1 ? 'bg-indigo-400 !text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
  </>
  );
};

export default Employees;
