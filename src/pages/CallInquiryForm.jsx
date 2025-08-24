
// import React, { useState } from 'react';
// import API from '../api';
// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const CallInquiryForm = ({ employeeId }) => {
//   const [form, setForm] = useState({
//     reasonForCall: '',
//     typeOfCall: '',
//     callCategory: '',
//     callDescription: '',
//     wasSaleConverted: '',
//     profitAmount: '',
//     reasonForNoSale: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     language: '',
//   });

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       // Clear irrelevant fields
//       ...(name === 'wasSaleConverted' && value === 'Yes' ? { reasonForNoSale: '' } : {}),
//       ...(name === 'wasSaleConverted' && value === 'No' ? { profitAmount: '' } : {}),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) {
//       setError('Call Category is required for Sales Inquiry');
//       return;
//     }

//     const payload = {
//       ...form,
//       employeeId,
//       profitAmount: form.wasSaleConverted === 'Yes' ? Number(form.profitAmount || 0) : 0,
//       reasonForNoSale: form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//     };

//     try {
//       await API.post('/call-logs', payload);
//       setMessage('✅ Call log submitted successfully!');
//       setForm({
//         reasonForCall: '',
//         typeOfCall: '',
//         callCategory: '',
//         callDescription: '',
//         wasSaleConverted: '',
//         profitAmount: '',
//         reasonForNoSale: '',
//         customerName: '',
//         customerEmail: '',
//         customerPhone: '',
//         language: '',
//       });
//     } catch (err) {
//       console.error('Call Log Submit Error:', err);
//       setError(err.response?.data?.message || '❌ Failed to save call log');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//       {/* <h2 className="text-xl font-bold mb-4 text-green-700">📞 Log Customer Call Inquiry</h2> */}

//       {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-3">{message}</div>}
//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Reason for Call</label>
//           <select name="reasonForCall" value={form.reasonForCall} onChange={handleChange} required
//             className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Flight Inquiry</option>
//             <option>Hotel Inquiry</option>
//             <option>Seat Selection</option>
//             <option>Refund/Cancel</option>
//             <option>Price too high</option>
//             <option>Language preference</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Type of Call</label>
//           <select name="typeOfCall" value={form.typeOfCall} onChange={handleChange} required
//             className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Sales Inquiry</option>
//             <option>Post-Sale Inquiry</option>
//             <option>Non-Sales Inquiry</option>  
//             <option>Customer Service</option>
//             <option>Blank Call</option> 
//           </select>
//         </div>

//         {form.typeOfCall === 'Sales Inquiry' && (
//           <div>
//             <label className="block font-medium">Call Category</label>
//             <select
//               name="callCategory"
//               value={form.callCategory}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">-- Select --</option>
//               <option value="Flight">Flight</option>
//               <option value="Hotel">Hotel</option>
//               <option value="Rental">Rental</option>
//               <option value="Package">Package</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//         )}

//         <div className="col-span-1 md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={form.callDescription}
//             onChange={handleChange}
//             required
//             rows="3"
//             className="w-full border px-3 py-2 rounded"
//             placeholder="What was discussed during the call?"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block font-medium">Was Sale Converted?</label>
//           <select name="wasSaleConverted" value={form.wasSaleConverted} onChange={handleChange} required
//             className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Yes</option>
//             <option>No</option>
//             <option>N/A</option>
//           </select>
//         </div>

//         {form.wasSaleConverted === 'Yes' && (
//           <div>
//             <label className="block font-medium">Profit Amount ($)</label>
//             <input
//               type="number"
//               name="profitAmount"
//               value={form.profitAmount}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter amount"
//               required
//             />
//           </div>
//         )}

//         {form.wasSaleConverted === 'No' && (
//           <div>
//             <label className="block font-medium">Reason for No Sale</label>
//             <select
//               name="reasonForNoSale"
//               value={form.reasonForNoSale}
//               onChange={handleChange}
//               className="w-full border px-3 py-2 rounded"
//               required
//             >
//               <option value="">-- Select --</option>
//               <option>Customer didn’t like price</option>
//               <option>No seats</option>
//               <option>Not interested</option>
//               <option>Language barrier</option>
//             </select>
//           </div>
//         )}

//         <div>
//           <label className="block font-medium">Customer Name</label>
//           <input
//             type="text"
//             name="customerName"
//             value={form.customerName}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Full Name"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Email</label>
//           <input
//             type="email"
//             name="customerEmail"
//             value={form.customerEmail}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Email"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Phone</label>
//           <input
//             type="tel"
//             name="customerPhone"
//             value={form.customerPhone}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Phone Number"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Language Preference</label>
//           <select name="language" value={form.language} onChange={handleChange} required
//             className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>English</option>
//             <option>Spanish</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-4">
//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded"
//           >
//             Submit Call Log
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CallInquiryForm;



//===============================================================

// import React, { useState } from 'react';
// import axios from 'axios'; // Ensure axios is imported if not using your custom API wrapper

// const API_URL = import.meta.env.VITE_API_BASE_URL;
// // const employeeId = localStorage.getItem("employeeId");
// const CallInquiryForm = ({ employeeId }) => {
//   const [form, setForm] = useState({
//     reasonForCall: '',
//     typeOfCall: '',
//     callCategory: '',
//     callDescription: '',
//     wasSaleConverted: '',
//     profitAmount: '',
//     reasonForNoSale: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     language: '',
//   });

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//     const resolvedEmployeeId = employeeId || localStorage.getItem("employeeId");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'wasSaleConverted' && value === 'Yes' ? { reasonForNoSale: '' } : {}),
//       ...(name === 'wasSaleConverted' && value === 'No' ? { profitAmount: '' } : {}),
//     }));
//   };

//   const validateFields = () => {
//     const requiredFields = [
//       // 'reasonForCall',
//       // 'typeOfCall',
//       // 'callDescription',
//       'wasSaleConverted',
//       'customerName',
//       'customerEmail',
//       // 'customerPhone',
//       // 'language',
//     ];

//     for (const field of requiredFields) {
//       if (!form[field]) return false;
//     }

//     // if (!employeeId) {
//     //   setError('❌ Employee ID is missing. Please login again.');
//     //   return false;
//     // }

// if (!resolvedEmployeeId) {
//   setError('❌ Employee ID is missing. Please login again.');
//   return false;
// }


//     if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) return false;

//     if (form.wasSaleConverted === 'Yes' && (!form.profitAmount || isNaN(form.profitAmount))) return false;

//     if (form.wasSaleConverted === 'No' && !form.reasonForNoSale) return false;

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (!validateFields()) {
//       setError('❌ Please fill all required fields correctly.');
//       return;
//     }

//     const payload = {
//       ...form,
//       // employeeId,
//       employeeId: resolvedEmployeeId,

//       profitAmount: form.wasSaleConverted === 'Yes' ? Number(form.profitAmount || 0) : 0,
//       reasonForNoSale: form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//       callCategory: form.typeOfCall === 'Sales Inquiry' ? form.callCategory : undefined,
//     };

//     try {
//       const response = await axios.post(`${API_URL}/call-logs`, payload);

//       if (response.status === 201) {
//         setMessage('✅ Call log submitted successfully!');
//         setForm({
//           reasonForCall: '',
//           typeOfCall: '',
//           callCategory: '',
//           callDescription: '',
//           wasSaleConverted: '',
//           profitAmount: '',
//           reasonForNoSale: '',
//           customerName: '',
//           customerEmail: '',
//           customerPhone: '',
//           language: '',
//         });
//       } else {
//         setError('❌ Failed to save call log.');
//       }
//     } catch (err) {
//       console.error('Call Log Submit Error:', err);
//       setError(err.response?.data?.message || '❌ Server error. Try again later.');
//     }
//   };


//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//       {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-3">{message}</div>}
//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Reason for Call</label>
//           <select name="reasonForCall" value={form.reasonForCall} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Flight Inquiry</option>
//             <option>Hotel Inquiry</option>
//             <option>Seat Selection</option>
//             <option>Refund/Cancel</option>
//             <option>Price too high</option>
//             <option>Language preference</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Type of Call</label>
//           <select name="typeOfCall" value={form.typeOfCall} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Sales Inquiry</option>
//             <option>Post-Sale Inquiry</option>
//             <option>Non-Sales Inquiry</option>
//             <option>Customer Service</option>
//             <option>Blank Call</option>
//           </select>
//         </div>

//         {form.typeOfCall === 'Sales Inquiry' && (
//           <div>
//             <label className="block font-medium">Call Category</label>
//             <select name="callCategory" value={form.callCategory} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//               <option value="">-- Select --</option>
//               <option value="Flight">Flight</option>
//               <option value="Hotel">Hotel</option>
//               <option value="Rental">Rental</option>
//               <option value="Package">Package</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//         )}

//         <div className="col-span-1 md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={form.callDescription}
//             onChange={handleChange}
//             required
//             rows="3"
//             className="w-full border px-3 py-2 rounded"
//             placeholder="What was discussed during the call?"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block font-medium">Was Sale Converted?</label>
//           <select name="wasSaleConverted" value={form.wasSaleConverted} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//         </div>

//         {form.wasSaleConverted === 'Yes' && (
//           <div>
//             <label className="block font-medium">Profit Amount ($)</label>
//             <input
//               type="number"
//               name="profitAmount"
//               value={form.profitAmount}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter amount"
//             />
//           </div>
//         )}

//         {form.wasSaleConverted === 'No' && (
//           <div>
//             <label className="block font-medium">Reason for No Sale</label>
//             <select name="reasonForNoSale" value={form.reasonForNoSale} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//               <option value="">-- Select --</option>
//               <option>Customer didn’t like price</option>
//               <option>No seats</option>
//               <option>Not interested</option>
//               <option>Language barrier</option>
//             </select>
//           </div>
//         )}

//         <div>
//           <label className="block font-medium">Customer Name</label>
//           <input
//             type="text"
//             name="customerName"
//             value={form.customerName}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Full Name"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Email</label>
//           <input
//             type="email"
//             name="customerEmail"
//             value={form.customerEmail}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Email"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Phone</label>
//           <input
//             type="tel"
//             name="customerPhone"
//             value={form.customerPhone}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Phone Number"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Language Preference</label>
//           <select name="language" value={form.language} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
//             <option value="">-- Select --</option>
//             <option>English</option>
//             <option>Spanish</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-4">
//           <button type="submit" className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded">
//             Submit Call Log
//           </button>
//         </div>
//       </form>
//       {/* <p className="text-xs text-gray-400">Employee ID: {employeeId || 'Not found'}</p> */}
// <p className="text-xs text-gray-400">Employee ID: {resolvedEmployeeId || 'Not found'}</p>

//     </div>
//   );
// };

// export default CallInquiryForm;
//======================
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const CallInquiryForm = ({ employeeId: propEmployeeId }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     reasonForCall: '',
//     typeOfCall: '',
//     callCategory: '',
//     callDescription: '',
//     wasSaleConverted: '',
//     profitAmount: '',
//     reasonForNoSale: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     language: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [employeeId, setEmployeeId] = useState(propEmployeeId || localStorage.getItem('employeeId'));

//   // Fetch employeeId if not provided
//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       if (employeeId) return; // Skip if employeeId is already set
//       try {
//         const userId = localStorage.getItem('userId');
//         const token = localStorage.getItem('token');
//         if (!userId || !token) {
//           setError('❌ User not authenticated. Please login again.');
//           setTimeout(() => navigate('/login'), 2000);
//           return;
//         }
//         const response = await axios.get(`${API_URL}/employees/by-user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (response.data?.employee?._id) {
//           setEmployeeId(response.data.employee._id);
//           localStorage.setItem('employeeId', response.data.employee._id);
//         } else {
//           setError('❌ Employee record not found. Contact HR.');
//         }
//       } catch (err) {
//         console.error('Error fetching employee ID:', err);
//         setError('❌ Failed to fetch employee data. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     };
//     fetchEmployeeId();
//   }, [employeeId, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'wasSaleConverted' && value === 'Yes' ? { reasonForNoSale: '' } : {}),
//       ...(name === 'wasSaleConverted' && value === 'No' ? { profitAmount: '' } : {}),
//     }));
//   };

//   const validateFields = () => {
//     const requiredFields = [
//       'reasonForCall',
//       'typeOfCall',
//       'callDescription',
//       'wasSaleConverted',
//       'customerName',
//       'customerEmail',
//       'customerPhone',
//       'language',
//     ];

//     for (const field of requiredFields) {
//       if (!form[field]) {
//         setError('❌ Please fill all required fields.');
//         return false;
//       }
//     }

//     if (!employeeId) {
//       setError('❌ Employee ID is missing. Please login again.');
//       return false;
//     }

//     if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) {
//       setError('❌ Call category is required for Sales Inquiry.');
//       return false;
//     }

//     if (form.wasSaleConverted === 'Yes' && (!form.profitAmount || isNaN(form.profitAmount))) {
//       setError('❌ Valid profit amount is required for successful sales.');
//       return false;
//     }

//     if (form.wasSaleConverted === 'No' && !form.reasonForNoSale) {
//       setError('❌ Reason for no sale is required.');
//       return false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.customerEmail)) {
//       setError('❌ Invalid email format.');
//       return false;
//     }

//     // Phone validation (basic international format)
//     const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//     if (!phoneRegex.test(form.customerPhone)) {
//       setError('❌ Invalid phone number format.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (!validateFields()) return;

//     const payload = {
//       ...form,
//       employeeId,
//       profitAmount: form.wasSaleConverted === 'Yes' ? Number(form.profitAmount || 0) : 0,
//       reasonForNoSale: form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//       callCategory: form.typeOfCall === 'Sales Inquiry' ? form.callCategory : undefined,
//     };

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('❌ Not authenticated. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//         return;
//       }

//       const response = await axios.post(`${API_URL}/call-logs`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 201) {
//         setMessage('✅ Call log submitted successfully!');
//         setForm({
//           reasonForCall: '',
//           typeOfCall: '',
//           callCategory: '',
//           callDescription: '',
//           wasSaleConverted: '',
//           profitAmount: '',
//           reasonForNoSale: '',
//           customerName: '',
//           customerEmail: '',
//           customerPhone: '',
//           language: '',
//         });
//       } else {
//         setError('❌ Failed to save call log.');
//       }
//     } catch (err) {
//       console.error('Call Log Submit Error:', err);
//       setError(err.response?.data?.message || '❌ Server error. Try again later.');
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//       {message && <div className="bg-green-100 text-green-800 p-2 rounded mb-3">{message}</div>}
//       {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block font-medium">Reason for Call</label>
//           <select
//             name="reasonForCall"
//             value={form.reasonForCall}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Flight Inquiry</option>
//             <option>Hotel Inquiry</option>
//             <option>Seat Selection</option>
//             <option>Refund/Cancel</option>
//             <option>Price too high</option>
//             <option>Language preference</option>
//           </select>
//         </div>

//         <div>
//           <label className="block font-medium">Type of Call</label>
//           <select
//             name="typeOfCall"
//             value={form.typeOfCall}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Sales Inquiry</option>
//             <option>Post-Sale Inquiry</option>
//             <option>Non-Sales Inquiry</option>
//             <option>Customer Service</option>
//             <option>Blank Call</option>
//           </select>
//         </div>

//         {form.typeOfCall === 'Sales Inquiry' && (
//           <div>
//             <label className="block font-medium">Call Category</label>
//             <select
//               name="callCategory"
//               value={form.callCategory}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">-- Select --</option>
//               <option>Flight</option>
//               <option>Hotel</option>
//               <option>Rental</option>
//               <option>Package</option>
//               <option>Other</option>
//             </select>
//           </div>
//         )}

//         <div className="col-span-1 md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={form.callDescription}
//             onChange={handleChange}
//             required
//             rows="3"
//             className="w-full border px-3 py-2 rounded"
//             placeholder="What was discussed during the call?"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block font-medium">Was Sale Converted?</label>
//           <select
//             name="wasSaleConverted"
//             value={form.wasSaleConverted}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//         </div>

//         {form.wasSaleConverted === 'Yes' && (
//           <div>
//             <label className="block font-medium">Profit Amount ($)</label>
//             <input
//               type="number"
//               name="profitAmount"
//               value={form.profitAmount}
//               onChange={handleChange}
//               required
//               min="0"
//               className="w-full border px-3 py-2 rounded"
//               placeholder="Enter amount"
//             />
//           </div>
//         )}

//         {form.wasSaleConverted === 'No' && (
//           <div>
//             <label className="block font-medium">Reason for No Sale</label>
//             <select
//               name="reasonForNoSale"
//               value={form.reasonForNoSale}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">-- Select --</option>
//               <option>Customer didn’t like price</option>
//               <option>No seats</option>
//               <option>Not interested</option>
//               <option>Language barrier</option>
//             </select>
//           </div>
//         )}

//         <div>
//           <label className="block font-medium">Customer Name</label>
//           <input
//             type="text"
//             name="customerName"
//             value={form.customerName}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Full Name"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Email</label>
//           <input
//             type="email"
//             name="customerEmail"
//             value={form.customerEmail}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Email"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Customer Phone</label>
//           <input
//             type="tel"
//             name="customerPhone"
//             value={form.customerPhone}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Phone Number"
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Language Preference</label>
//           <select
//             name="language"
//             value={form.language}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>English</option>
//             <option>Spanish</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-4">
//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded"
//             disabled={!employeeId}
//           >
//             Submit Call Log
//           </button>
//         </div>
//       </form>
//       <p className="text-xs text-gray-400 mt-2">Employee ID: {employeeId || 'Not found'}</p>
//     </div>
//   );
// };

// export default CallInquiryForm;

//===================================
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const CallInquiryForm = ({ employeeId: propEmployeeId }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     callDirection: '',
//     reasonForCall: '',
//     typeOfCall: '',
//     callCategory: '',
//     callDescription: '',
//     wasSaleConverted: '',
//     saleConvertedThrough: '',
//     profitAmount: '',
//     reasonForNoSale: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     language: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [employeeId, setEmployeeId] = useState(
//     propEmployeeId || localStorage.getItem('employeeId')
//   );

//   // Fetch employeeId if not provided
//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       if (employeeId) return;
//       try {
//         const userId = localStorage.getItem('userId');
//         const token = localStorage.getItem('token');
//         if (!userId || !token) {
//           setError('❌ User not authenticated. Please login again.');
//           setTimeout(() => navigate('/login'), 2000);
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/employees/by-user/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data?.employee?._id) {
//           setEmployeeId(response.data.employee._id);
//           localStorage.setItem('employeeId', response.data.employee._id);
//         } else {
//           setError('❌ Employee record not found. Contact HR.');
//         }
//       } catch (err) {
//         console.error('Error fetching employee ID:', err);
//         setError('❌ Failed to fetch employee data. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     };
//     fetchEmployeeId();
//   }, [employeeId, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'wasSaleConverted' && value === 'Yes'
//         ? { reasonForNoSale: '' }
//         : {}),
//       ...(name === 'wasSaleConverted' && value === 'No'
//         ? { profitAmount: '', saleConvertedThrough: '' }
//         : {}),
//     }));
//   };

//   const validateFields = () => {
//     const requiredFields = [
//       'reasonForCall',
//       'typeOfCall',
//       'callDescription',
//       'wasSaleConverted',
//       'customerName',
//       'customerEmail',
//       'customerPhone',
//       'language',
//       'callDirection',
//     ];

//     for (const field of requiredFields) {
//       if (!form[field]) {
//         setError('❌ Please fill all required fields.');
//         return false;
//       }
//     }

//     if (!employeeId) {
//       setError('❌ Employee ID is missing. Please login again.');
//       return false;
//     }

//     if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) {
//       setError('❌ Call category is required for Sales Inquiry.');
//       return false;
//     }

//     if (form.wasSaleConverted === 'Yes') {
//       if (!form.profitAmount || isNaN(form.profitAmount)) {
//         setError('❌ Valid profit amount is required for successful sales.');
//         return false;
//       }
//       if (!form.saleConvertedThrough) {
//         setError(
//           '❌ Sale Converted Through is required for successful sales.'
//         );
//         return false;
//       }
//     }

//     if (form.wasSaleConverted === 'No' && !form.reasonForNoSale) {
//       setError('❌ Reason for no sale is required.');
//       return false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.customerEmail)) {
//       setError('❌ Invalid email format.');
//       return false;
//     }

//     // Phone validation (basic international format)
//     const phoneRegex = /^\+?[1-9]\d{1,14}$/;
//     if (!phoneRegex.test(form.customerPhone)) {
//       setError('❌ Invalid phone number format.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (!validateFields()) return;

//     const payload = {
//       ...form,
//       employeeId,
//       profitAmount:
//         form.wasSaleConverted === 'Yes'
//           ? Number(form.profitAmount || 0)
//           : 0,
//       reasonForNoSale:
//         form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//       callCategory:
//         form.typeOfCall === 'Sales Inquiry'
//           ? form.callCategory
//           : undefined,
//     };

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('❌ Not authenticated. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//         return;
//       }

//       const response = await axios.post(`${API_URL}/call-logs`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 201) {
//         setMessage('✅ Call log submitted successfully!');
//         setForm({
//           callDirection: '',
//           reasonForCall: '',
//           typeOfCall: '',
//           callCategory: '',
//           callDescription: '',
//           wasSaleConverted: '',
//           saleConvertedThrough: '',
//           profitAmount: '',
//           reasonForNoSale: '',
//           customerName: '',
//           customerEmail: '',
//           customerPhone: '',
//           language: '',
//         });
//       } else {
//         setError('❌ Failed to save call log.');
//       }
//     } catch (err) {
//       console.error('Call Log Submit Error:', err);
//       setError(
//         err.response?.data?.message ||
//           '❌ Server error. Try again later.'
//       );
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//       {message && (
//         <div className="bg-green-100 text-green-800 p-2 rounded mb-3">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         {/* Reason for Call */}
//         <div>
//           <label className="block font-medium">Reason for Call</label>
//           <select
//             name="reasonForCall"
//             value={form.reasonForCall}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Flight Inquiry</option>
//             <option>Hotel Inquiry</option>
//             <option>Seat Selection</option>
//             <option>Refund/Cancel</option>
//             <option>Price too high</option>
//             <option>Language preference</option>
//           </select>
//         </div>

//         {/* Call Direction */}
//         <div>
//           <label className="block font-medium">Call Direction</label>
//           <select
//             name="callDirection"
//             value={form.callDirection}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>INBOUND</option>
//             <option>OUTBOUND</option>
//           </select>
//         </div>

//         {/* Type of Call */}
//         <div>
//           <label className="block font-medium">Type of Call</label>
//           <select
//             name="typeOfCall"
//             value={form.typeOfCall}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Sales Inquiry</option>
//             <option>Post-Sale Inquiry</option>
//             <option>Non-Sales Inquiry</option>
//             <option>Customer Service</option>
//             <option>Blank Call</option>
//           </select>
//         </div>

//         {/* Call Category */}
//         {form.typeOfCall === 'Sales Inquiry' && (
//           <div>
//             <label className="block font-medium">Call Category</label>
//             <select
//               name="callCategory"
//               value={form.callCategory}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">-- Select --</option>
//               <option>Flight</option>
//               <option>Hotel</option>
//               <option>car Rental</option>
//               <option>Packages</option>
//               <option>Other</option>
//             </select>
//           </div>
//         )}

//         {/* Call Description */}
//         <div className="col-span-1 md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={form.callDescription}
//             onChange={handleChange}
//             required
//             rows="3"
//             className="w-full border px-3 py-2 rounded"
//             placeholder="What was discussed during the call?"
//           ></textarea>
//         </div>

//         {/* Was Sale Converted */}
//         <div>
//           <label className="block font-medium">Was Sale Converted?</label>
//           <select
//             name="wasSaleConverted"
//             value={form.wasSaleConverted}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//         </div>

//         {/* Profit Amount + Sale Converted Through */}
//         {form.wasSaleConverted === 'Yes' && (
//           <>
//             <div>
//               <label className="block font-medium">Profit Amount ($)</label>
//               <input
//                 type="number"
//                 name="profitAmount"
//                 value={form.profitAmount}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 className="w-full border px-3 py-2 rounded"
//                 placeholder="Enter amount"
//               />
//             </div>
//             <div>
//               <label className="block font-medium">Sale Converted Through</label>
//               <select
//                 name="saleConvertedThrough"
//                 value={form.saleConvertedThrough}
//                 onChange={handleChange}
//                 required
//                 className="w-full border px-3 py-2 rounded"
//               >
//                 <option value="">-- Select --</option>
//                 <option>Phone</option>
//                 <option>WhatsApp</option>
//                 <option>Email</option>
//               </select>
//             </div>
//           </>
//         )}

//         {/* Reason for No Sale */}
//         {form.wasSaleConverted === 'No' && (
//           <div>
//             <label className="block font-medium">Reason for No Sale</label>
//             <select
//               name="reasonForNoSale"
//               value={form.reasonForNoSale}
//               onChange={handleChange}
//               required
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="">-- Select --</option>
//               <option>Customer didn’t like price</option>
//               <option>No seats</option>
//               <option>Not interested</option>
//               <option>Language barrier</option>
//             </select>
//           </div>
//         )}

//         {/* Customer Name */}
//         <div>
//           <label className="block font-medium">Customer Name</label>
//           <input
//             type="text"
//             name="customerName"
//             value={form.customerName}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Full Name"
//           />
//         </div>

//         {/* Customer Email */}
//         <div>
//           <label className="block font-medium">Customer Email</label>
//           <input
//             type="email"
//             name="customerEmail"
//             value={form.customerEmail}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Email"
//           />
//         </div>

//         {/* Customer Phone */}
//         <div>
//           <label className="block font-medium">Customer Phone</label>
//           <input
//             type="tel"
//             name="customerPhone"
//             value={form.customerPhone}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Phone Number"
//           />
//         </div>

//         {/* Language Preference */}
//         <div>
//           <label className="block font-medium">Language Preference</label>
//           <select
//             name="language"
//             value={form.language}
//             onChange={handleChange}
//             required
//             className="w-full border px-3 py-2 rounded"
//           >
//             <option value="">-- Select --</option>
//             <option>English</option>
//             <option>Spanish</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-4">
//           <button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-4 rounded"
//             disabled={!employeeId}
//           >
//             Submit Call Log
//           </button>
//         </div>
//       </form>
//       <p className="text-xs text-gray-400 mt-2">
//         Employee ID: {employeeId || 'Not found'}
//       </p>
//     </div>
//   );
// };

// export default CallInquiryForm;

//==================================


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { getShiftWindow } from '../components2/shiftDate';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const CallInquiryForm = ({ employeeId: propEmployeeId }) => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     callDirection: '',
//     reasonForCall: '',
//     typeOfCall: '',
//     callCategory: '',
//     callDescription: '',
//     wasSaleConverted: '',
//     saleConvertedThrough: '',
//     profitAmount: '',
//     reasonForNoSale: '',
//     customerName: '',
//     customerEmail: '',
//     customerPhone: '',
//     language: '',
//   });
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [employeeId, setEmployeeId] = useState(
//     propEmployeeId || localStorage.getItem('employeeId')
//   );

//   // Clear success message after 5 seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Fetch employeeId if not provided
//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       if (employeeId) return;
//       try {
//         const userId = localStorage.getItem('userId');
//         const token = localStorage.getItem('token');
//         if (!userId || !token) {
//           setError('❌ User not authenticated. Please login again.');
//           setTimeout(() => navigate('/login'), 2000);
//           return;
//         }
//         const response = await axios.get(
//           `${API_URL}/employees/by-user/${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data?.employee?._id) {
//           setEmployeeId(response.data.employee._id);
//           localStorage.setItem('employeeId', response.data.employee._id);
//         } else {
//           setError('❌ Employee record not found. Contact HR.');
//         }
//       } catch (err) {
//         console.error('Error fetching employee ID:', err);
//         setError('❌ Failed to fetch employee data. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     };
//     fetchEmployeeId();
//   }, [employeeId, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'wasSaleConverted' && value === 'Yes'
//         ? { reasonForNoSale: '' }
//         : {}),
//       ...(name === 'wasSaleConverted' && value === 'No'
//         ? { profitAmount: '', saleConvertedThrough: '' }
//         : {}),
//     }));
    
//     // Clear field error when user starts typing
//     if (fieldErrors[name]) {
//       setFieldErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateFields = () => {
//     const errors = {};
//     let isValid = true;

//     // Required fields validation
//     const requiredFields = [
//       'reasonForCall',
//       'typeOfCall',
//       'callDescription',
//       'wasSaleConverted',
//       'customerName',
//       'customerEmail',
//       'customerPhone',
//       'language',
//       'callDirection',
//     ];

//     requiredFields.forEach(field => {
//       if (!form[field]) {
//         errors[field] = 'This field is required';
//         isValid = false;
//       }
//     });

//     if (!employeeId) {
//       setError('❌ Employee ID is missing. Please login again.');
//       isValid = false;
//     }

//     if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) {
//       errors.callCategory = 'Call category is required for Sales Inquiry';
//       isValid = false;
//     }

//     if (form.wasSaleConverted === 'Yes') {
//       if (!form.profitAmount || isNaN(form.profitAmount)) {
//         errors.profitAmount = 'Valid profit amount is required';
//         isValid = false;
//       }
//       if (!form.saleConvertedThrough) {
//         errors.saleConvertedThrough = 'Required for successful sales';
//         isValid = false;
//       }
//     }

//     if (form.wasSaleConverted === 'No' && !form.reasonForNoSale) {
//       errors.reasonForNoSale = 'Reason for no sale is required';
//       isValid = false;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (form.customerEmail && !emailRegex.test(form.customerEmail)) {
//       errors.customerEmail = 'Invalid email format';
//       isValid = false;
//     }

//     // Improved phone validation (allows + and numbers, 7-15 digits)
//     // const phoneRegex = /^\+?\d{7,15}$/;
//     // if (form.customerPhone && !phoneRegex.test(form.customerPhone)) {
//     //   errors.customerPhone = 'Invalid phone number (7-15 digits, + allowed)';
//     //   isValid = false;
//     // }

//     // setFieldErrors(errors);
//     // return isValid;

//     const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

// if (form.customerPhone && !phoneRegex.test(form.customerPhone)) {
//   errors.customerPhone = 'Invalid phone number';
//   isValid = false;
// }

// setFieldErrors(errors);
// return isValid;

//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (!validateFields()) return;

 
//   const { shiftDateString } = getShiftWindow();

//   const payload = {
//     ...form,
//     employeeId,
//     shiftDate: shiftDateString, // NEW
//     profitAmount:
//       form.wasSaleConverted === 'Yes'
//         ? Number(form.profitAmount || 0)
//         : 0,
//     reasonForNoSale:
//       form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//     callCategory:
//       form.typeOfCall === 'Sales Inquiry'
//         ? form.callCategory
//         : undefined,
//   };

//     // const payload = {
//     //   ...form,
//     //   employeeId,
//     //   profitAmount:
//     //     form.wasSaleConverted === 'Yes'
//     //       ? Number(form.profitAmount || 0)
//     //       : 0,
//     //   reasonForNoSale:
//     //     form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
//     //   callCategory:
//     //     form.typeOfCall === 'Sales Inquiry'
//     //       ? form.callCategory
//     //       : undefined,
//     // };

//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('❌ Not authenticated. Please login again.');
//         setTimeout(() => navigate('/login'), 2000);
//         return;
//       }

//       const response = await axios.post(`${API_URL}/call-logs`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.status === 201) {
//         setMessage('✅ Call log submitted successfully!');
//         setForm({
//           callDirection: '',
//           reasonForCall: '',
//           typeOfCall: '',
//           callCategory: '',
//           callDescription: '',
//           wasSaleConverted: '',
//           saleConvertedThrough: '',
//           profitAmount: '',
//           reasonForNoSale: '',
//           customerName: '',
//           customerEmail: '',
//           customerPhone: '',
//           language: '',
//         });
//       } else {
//         setError('❌ Failed to save call log.');
//       }
//     } catch (err) {
//       console.error('Call Log Submit Error:', err);
//       setError(
//         err.response?.data?.message ||
//           '❌ Server error. Try again later.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to render error message for a field
//   const renderFieldError = (fieldName) => {
//     return fieldErrors[fieldName] ? (
//       <span className="text-red-500 text-xs">{fieldErrors[fieldName]}</span>
//     ) : null;
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
//       {message && (
//         <div className="bg-green-100 text-green-800 p-2 rounded mb-3">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
//           {error}
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         {/* Reason for Call */}
//         <div>
//           <label className="block font-medium">Reason for Call</label>
//           <select
//             name="reasonForCall"
//             value={form.reasonForCall}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.reasonForCall ? 'border-red-500' : ''
//             }`}
//           >
//             <option value="">-- Select --</option>
//             <option>Flight Inquiry</option>
//             <option>Hotel Inquiry</option>
//             <option>Seat Selection</option>
//             <option>Refund/Cancel</option>
//             <option>Price too high</option>
//             <option>Language preference</option>
//           </select>
//           {renderFieldError('reasonForCall')}
//         </div>

//         {/* Call Direction */}
//         <div>
//           <label className="block font-medium">Call Direction</label>
//           <select
//             name="callDirection"
//             value={form.callDirection}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.callDirection ? 'border-red-500' : ''
//             }`}
//           >
//             <option value="">-- Select --</option>
//             <option>INBOUND</option>
//             <option>OUTBOUND</option>
//           </select>
//           {renderFieldError('callDirection')}
//         </div>

//         {/* Type of Call */}
//         <div>
//           <label className="block font-medium">Type of Call</label>
//           <select
//             name="typeOfCall"
//             value={form.typeOfCall}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.typeOfCall ? 'border-red-500' : ''
//             }`}
//           >
//             <option value="">-- Select --</option>
//             <option>Sales Inquiry</option>
//             <option>Post-Sale Inquiry</option>
//             <option>Non-Sales Inquiry</option>
//             <option>Customer Service</option>
//             <option>Blank Call</option>
//           </select>
//           {renderFieldError('typeOfCall')}
//         </div>

//         {/* Call Category */}
//         {form.typeOfCall === 'Sales Inquiry' && (
//           <div>
//             <label className="block font-medium">Call Category</label>
//             <select
//               name="callCategory"
//               value={form.callCategory}
//               onChange={handleChange}
//               required
//               className={`w-full border px-3 py-2 rounded ${
//                 fieldErrors.callCategory ? 'border-red-500' : ''
//               }`}
//             >
//               <option value="">-- Select --</option>
//               <option>Flight</option>
//               <option>Hotel</option>
//               <option>car Rental</option>
//               <option>Packages</option>
//               <option>Other</option>
//             </select>
//             {renderFieldError('callCategory')}
//           </div>
//         )}

//         {/* Call Description */}
//         <div className="col-span-1 md:col-span-2">
//           <label className="block font-medium">Call Description</label>
//           <textarea
//             name="callDescription"
//             value={form.callDescription}
//             onChange={handleChange}
//             required
//             rows="3"
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.callDescription ? 'border-red-500' : ''
//             }`}
//             placeholder="What was discussed during the call?"
//           ></textarea>
//           {renderFieldError('callDescription')}
//         </div>

//         {/* Was Sale Converted */}
//         <div>
//           <label className="block font-medium">Was Sale Converted?</label>
//           <select
//             name="wasSaleConverted"
//             value={form.wasSaleConverted}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.wasSaleConverted ? 'border-red-500' : ''
//             }`}
//           >
//             <option value="">-- Select --</option>
//             <option>Yes</option>
//             <option>No</option>
//           </select>
//           {renderFieldError('wasSaleConverted')}
//         </div>

//         {/* Profit Amount + Sale Converted Through */}
//         {form.wasSaleConverted === 'Yes' && (
//           <>
//             <div>
//               <label className="block font-medium">Profit Amount ($)</label>
//               <input
//                 type="number"
//                 name="profitAmount"
//                 value={form.profitAmount}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 step="0.01"
//                 className={`w-full border px-3 py-2 rounded ${
//                   fieldErrors.profitAmount ? 'border-red-500' : ''
//                 }`}
//                 placeholder="Enter amount"
//               />
//               {renderFieldError('profitAmount')}
//             </div>
//             <div>
//               <label className="block font-medium">Sale Converted Through</label>
//               <select
//                 name="saleConvertedThrough"
//                 value={form.saleConvertedThrough}
//                 onChange={handleChange}
//                 required
//                 className={`w-full border px-3 py-2 rounded ${
//                   fieldErrors.saleConvertedThrough ? 'border-red-500' : ''
//                 }`}
//               >
//                 <option value="">-- Select --</option>
//                 <option>Phone</option>
//                 <option>WhatsApp</option>
//                 <option>Email</option>
//                 <option>Offline</option>

//               </select>
//               {renderFieldError('saleConvertedThrough')}
//             </div>
//           </>
//         )}

//         {/* Reason for No Sale */}
//         {form.wasSaleConverted === 'No' && (
//           <div>
//             <label className="block font-medium">Reason for No Sale</label>
//             <select
//               name="reasonForNoSale"
//               value={form.reasonForNoSale}
//               onChange={handleChange}
//               required
//               className={`w-full border px-3 py-2 rounded ${
//                 fieldErrors.reasonForNoSale ? 'border-red-500' : ''
//               }`}
//             >
//               <option value="">-- Select --</option>
//               <option>Customer didn't like price</option>
//               <option>No seats</option>
//               <option>Not interested</option>
//               <option>Language barrier</option>
//             </select>
//             {renderFieldError('reasonForNoSale')}
//           </div>
//         )}

//         {/* Customer Name */}
//         <div>
//           <label className="block font-medium">Customer Name</label>
//           <input
//             type="text"
//             name="customerName"
//             value={form.customerName}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.customerName ? 'border-red-500' : ''
//             }`}
//             placeholder="Full Name"
//           />
//           {renderFieldError('customerName')}
//         </div>

//         {/* Customer Email */}
//         <div>
//           <label className="block font-medium">Customer Email</label>
//           <input
//             type="email"
//             name="customerEmail"
//             value={form.customerEmail}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.customerEmail ? 'border-red-500' : ''
//             }`}
//             placeholder="Email"
//           />
//           {renderFieldError('customerEmail')}
//         </div>

//         {/* Customer Phone */}
//         <div>
//           <label className="block font-medium">Customer Phone</label>
//           <input
//             type="tel"
//             name="customerPhone"
//             value={form.customerPhone}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.customerPhone ? 'border-red-500' : ''
//             }`}
//             placeholder="Phone Number (e.g., +1234567890)"
//           />
//           {renderFieldError('customerPhone')}
//         </div>

//         {/* Language Preference */}
//         <div>
//           <label className="block font-medium">Language Preference</label>
//           <select
//             name="language"
//             value={form.language}
//             onChange={handleChange}
//             required
//             className={`w-full border px-3 py-2 rounded ${
//               fieldErrors.language ? 'border-red-500' : ''
//             }`}
//           >
//             <option value="">-- Select --</option>
//             <option>English</option>
//             <option>Spanish</option>
//             <option>Other</option>
//           </select>
//           {renderFieldError('language')}
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-4">
//           <button
//             type="submit"
//             className={`w-full bg-green-600 hover:bg-green-700 transition !text-white font-semibold py-2 px-4 rounded ${
//               loading ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//             disabled={!employeeId || loading}
//           >
//             {loading ? 'Submitting...' : 'Submit Call Log'}
//           </button>
//         </div>
//       </form>
//       <p className="text-xs text-gray-400 mt-2">
//         Employee ID: {employeeId || 'Not found'}
//       </p>
//     </div>
//   );
// };

// export default CallInquiryForm;

//====================chat gpt=========

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getShiftWindow } from '../components2/shiftDate';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CallInquiryForm = ({ employeeId: propEmployeeId }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    callDirection: '',
    reasonForCall: '',
    typeOfCall: '',
    callCategory: '',
    callDescription: '',
    wasSaleConverted: '',
    saleConvertedThrough: '',
    profitAmount: '',
    chargebackRefund: '',   // ✅ new field
    netProfit: '',          // ✅ calculated
    reasonForNoSale: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    language: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [employeeId, setEmployeeId] = useState(
    propEmployeeId || localStorage.getItem('employeeId')
  );

  // Clear success message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch employeeId if not provided
  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (employeeId) return;
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
          setError('❌ User not authenticated. Please login again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        const response = await axios.get(
          `${API_URL}/employees/by-user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data?.employee?._id) {
          setEmployeeId(response.data.employee._id);
          localStorage.setItem('employeeId', response.data.employee._id);
        } else {
          setError('❌ Employee record not found. Contact HR.');
        }
      } catch (err) {
        console.error('Error fetching employee ID:', err);
        setError('❌ Failed to fetch employee data. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchEmployeeId();
  }, [employeeId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = {
      ...form,
      [name]: value,
      ...(name === 'wasSaleConverted' && value === 'Yes'
        ? { reasonForNoSale: '' }
        : {}),
      ...(name === 'wasSaleConverted' && value === 'No'
        ? { profitAmount: '', chargebackRefund: '', netProfit: '', saleConvertedThrough: '' }
        : {}),
    };

    // Auto-calc Net Profit whenever profit or refund changes
    if (name === 'profitAmount' || name === 'chargebackRefund') {
      const profit = Number(updatedForm.profitAmount || 0);
      const refund = Number(updatedForm.chargebackRefund || 0);
      updatedForm.netProfit = profit - refund;
    }

    setForm(updatedForm);

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    const requiredFields = [
      'reasonForCall',
      'typeOfCall',
      'callDescription',
      'wasSaleConverted',
      'customerName',
      'customerEmail',
      'customerPhone',
      'language',
      'callDirection',
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });

    if (!employeeId) {
      setError('❌ Employee ID is missing. Please login again.');
      isValid = false;
    }

    if (form.typeOfCall === 'Sales Inquiry' && !form.callCategory) {
      errors.callCategory = 'Call category is required for Sales Inquiry';
      isValid = false;
    }

    if (form.wasSaleConverted === 'Yes') {
      if (!form.profitAmount || isNaN(form.profitAmount)) {
        errors.profitAmount = 'Valid profit amount is required';
        isValid = false;
      }
      if (!form.saleConvertedThrough) {
        errors.saleConvertedThrough = 'Required for successful sales';
        isValid = false;
      }
    }

    if (form.wasSaleConverted === 'No' && !form.reasonForNoSale) {
      errors.reasonForNoSale = 'Reason for no sale is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.customerEmail && !emailRegex.test(form.customerEmail)) {
      errors.customerEmail = 'Invalid email format';
      isValid = false;
    }

    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
    if (form.customerPhone && !phoneRegex.test(form.customerPhone)) {
      errors.customerPhone = 'Invalid phone number';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!validateFields()) return;

    const { shiftDateString } = getShiftWindow();

    const payload = {
      ...form,
      employeeId,
      shiftDate: shiftDateString,
      profitAmount:
        form.wasSaleConverted === 'Yes'
          ? Number(form.profitAmount || 0)
          : 0,
      chargebackRefund:
        form.wasSaleConverted === 'Yes'
          ? Number(form.chargebackRefund || 0)
          : 0,
      netProfit:
        form.wasSaleConverted === 'Yes'
          ? Number(form.netProfit || 0)
          : 0,
      reasonForNoSale:
        form.wasSaleConverted === 'No' ? form.reasonForNoSale : '',
      callCategory:
        form.typeOfCall === 'Sales Inquiry'
          ? form.callCategory
          : undefined,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('❌ Not authenticated. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await axios.post(`${API_URL}/call-logs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setMessage('✅ Call log submitted successfully!');
        setForm({
          callDirection: '',
          reasonForCall: '',
          typeOfCall: '',
          callCategory: '',
          callDescription: '',
          wasSaleConverted: '',
          saleConvertedThrough: '',
          profitAmount: '',
          chargebackRefund: '',
          netProfit: '',
          reasonForNoSale: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          language: '',
        });
      } else {
        setError('❌ Failed to save call log.');
      }
    } catch (err) {
      console.error('Call Log Submit Error:', err);
      setError(err.response?.data?.message || '❌ Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) => {
    return fieldErrors[fieldName] ? (
      <span className="text-red-500 text-xs">{fieldErrors[fieldName]}</span>
    ) : null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      {message && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-3">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
           {/* Reason for Call */}
        <div>
          <label className="block font-medium">Reason for Call</label>
          <select
            name="reasonForCall"
            value={form.reasonForCall}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.reasonForCall ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select --</option>
            <option>Flight Inquiry</option>
            <option>Hotel Inquiry</option>
            <option>Seat Selection</option>
            <option>Refund/Cancel</option>
            <option>Price too high</option>
            <option>Language preference</option>
          </select>
          {renderFieldError('reasonForCall')}
        </div>

        {/* Call Direction */}
        <div>
          <label className="block font-medium">Call Direction</label>
          <select
            name="callDirection"
            value={form.callDirection}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.callDirection ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select --</option>
            <option>INBOUND</option>
            <option>OUTBOUND</option>
          </select>
          {renderFieldError('callDirection')}
        </div>

        {/* Type of Call */}
        <div>
          <label className="block font-medium">Type of Call</label>
          <select
            name="typeOfCall"
            value={form.typeOfCall}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.typeOfCall ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select --</option>
            <option>Sales Inquiry</option>
            <option>Post-Sale Inquiry</option>
            <option>Non-Sales Inquiry</option>
            <option>Customer Service</option>
            <option>Blank Call</option>
          </select>
          {renderFieldError('typeOfCall')}
        </div>

        {/* Call Category */}
        {form.typeOfCall === 'Sales Inquiry' && (
          <div>
            <label className="block font-medium">Call Category</label>
            <select
              name="callCategory"
              value={form.callCategory}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded ${
                fieldErrors.callCategory ? 'border-red-500' : ''
              }`}
            >
              <option value="">-- Select --</option>
              <option>Flight</option>
              <option>Hotel</option>
              <option>car Rental</option>
              <option>Packages</option>
              <option>Other</option>
            </select>
            {renderFieldError('callCategory')}
          </div>
        )}

        {/* Call Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block font-medium">Call Description</label>
          <textarea
            name="callDescription"
            value={form.callDescription}
            onChange={handleChange}
            required
            rows="3"
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.callDescription ? 'border-red-500' : ''
            }`}
            placeholder="What was discussed during the call?"
          ></textarea>
          {renderFieldError('callDescription')}
        </div>

        {/* Was Sale Converted */}
        <div>
          <label className="block font-medium">Was Sale Converted?</label>
          <select
            name="wasSaleConverted"
            value={form.wasSaleConverted}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.wasSaleConverted ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select --</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          {renderFieldError('wasSaleConverted')}
        </div>

        {/* Profit, Refund, NetProfit when sale converted */}
        {form.wasSaleConverted === 'Yes' && (
          <>
            <div>
              <label className="block font-medium">Profit Amount ($)</label>
              <input
                type="number"
                name="profitAmount"
                value={form.profitAmount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={`w-full border px-3 py-2 rounded ${
                  fieldErrors.profitAmount ? 'border-red-500' : ''
                }`}
                placeholder="Enter profit"
              />
              {renderFieldError('profitAmount')}
            </div>

            <div>
              <label className="block font-medium">Chargeback/Refund ($)</label>
              <input
                type="number"
                name="chargebackRefund"
                value={form.chargebackRefund}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter refund/chargeback"
              />
            </div>

            <div>
              <label className="block font-medium">Net Profit ($)</label>
              <input
                type="number"
                name="netProfit"
                value={form.netProfit}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium">Sale Converted Through</label>
              <select
                name="saleConvertedThrough"
                value={form.saleConvertedThrough}
                onChange={handleChange}
                required
                className={`w-full border px-3 py-2 rounded ${
                  fieldErrors.saleConvertedThrough ? 'border-red-500' : ''
                }`}
              >
                <option value="">-- Select --</option>
                <option>Phone</option>
                <option>WhatsApp</option>
                <option>Email</option>
                <option>Offline</option>
              </select>
              {renderFieldError('saleConvertedThrough')}
            </div>
          </>
        )}

        {/* Reason for No Sale */}
        {form.wasSaleConverted === 'No' && (
          <div>
            <label className="block font-medium">Reason for No Sale</label>
            <select
              name="reasonForNoSale"
              value={form.reasonForNoSale}
              onChange={handleChange}
              required
              className={`w-full border px-3 py-2 rounded ${
                fieldErrors.reasonForNoSale ? 'border-red-500' : ''
              }`}
            >
              <option value="">-- Select --</option>
              <option>Customer didn't like price</option>
              <option>No seats</option>
              <option>Not interested</option>
              <option>Language barrier</option>
            </select>
            {renderFieldError('reasonForNoSale')}
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.customerName ? 'border-red-500' : ''
            }`}
            placeholder="Full Name"
          />
          {renderFieldError('customerName')}
        </div>

        {/* Customer Email */}
        <div>
          <label className="block font-medium">Customer Email</label>
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.customerEmail ? 'border-red-500' : ''
            }`}
            placeholder="Email"
          />
          {renderFieldError('customerEmail')}
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block font-medium">Customer Phone</label>
          <input
            type="tel"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.customerPhone ? 'border-red-500' : ''
            }`}
            placeholder="Phone Number (e.g., +1234567890)"
          />
          {renderFieldError('customerPhone')}
        </div>

        {/* Language Preference */}
        <div>
          <label className="block font-medium">Language Preference</label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            required
            className={`w-full border px-3 py-2 rounded ${
              fieldErrors.language ? 'border-red-500' : ''
            }`}
          >
            <option value="">-- Select --</option>
            <option>English</option>
            <option>Spanish</option>
            <option>Other</option>
          </select>
          {renderFieldError('language')}
        </div>


        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            className={`w-full bg-green-600 hover:bg-green-700 transition !text-white font-semibold py-2 px-4 rounded ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={!employeeId || loading}
          >
            {loading ? 'Submitting...' : 'Submit Call Log'}
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-400 mt-2">
        Employee ID: {employeeId || 'Not found'}
      </p>
    </div>
  );
};

export default CallInquiryForm;

