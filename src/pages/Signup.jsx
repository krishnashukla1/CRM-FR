// import { useState,useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// const API_URL = import.meta.env.VITE_API_BASE_URL
// const Signup = () => {
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     company: '',
//     role: 'user',
//     agreed: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const navigate = useNavigate();
//   const [adminDisabled, setAdminDisabled] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

//     if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
//     if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
//     if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
//     if (!passwordRegex.test(form.password))
//       newErrors.password = 'Password must be at least 6 characters and include letters & numbers';
//     if (!form.agreed) newErrors.agreed = 'You must agree to the terms';

//     return newErrors;
//   };

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
//     setErrors({ ...errors, [name]: '' });
//     setServerError('');
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
// // ✅ Check if role is admin, then validate admin count first
//   if (form.role === 'admin') {
//     try {
//       const res = await axios.get(`${API_URL}/auth/admin-count`);
//       const count = res.data.count;

//       if (count >= 2) {
//         setServerError('❌ Maximum of 2 admins are allowed');
//         return;
//       }
//     } catch (error) {
//       setServerError('❌ Could not verify admin limit. Try again later.');
//       return;
//     }
//   }
//     const payload = {
//       name: `${form.firstName} ${form.lastName}`,
//       email: form.email,
//       password: form.password,
//       role: form.role,
//     };

//     try {
//       await axios.post(`${API_URL}/auth/signup`, payload);
//       alert('✅ Signup successful');
//       navigate('/login');
//     } catch (err) {
//       const message = err.response?.data?.message || 'Signup failed';
//       setServerError(message);
//     }
//   };
// useEffect(() => {
//   const checkAdminLimit = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/auth/admin-count`);
//       if (res.data.count >= 2) {
//         setAdminDisabled(true);
//       }
//     } catch (error) {
//       console.log('Failed to fetch admin count');
//     }
//   };

//   checkAdminLimit();
// }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#fff1eb] via-[#ace0f9] to-[#6366f1] px-4">
//       {/* <div className="w-full max-w-2xl p-10 text-black bg-white shadow-2xl rounded-3xl"> */}

//       <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-black rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-10 border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">

//         <div className="mb-6 text-center">

//           <img
//             src="/d1.png"
//             // src="/farebuzzerIcon-r.png"
//             alt="Fare Buzzer Logo"
//             className="object-contain h-24 mx-auto mb-2 w-74"
//           />

//           <h1 className="text-3xl font-bold text-green-700">FareBuzzer Travel Pvt Ltd</h1>
//           <p className="mt-2 text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="font-medium text-blue-600 hover:underline">
//               Login here →
//             </Link>
//           </p>
//         </div>

//         <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
//           Create Your Account
//         </h2>

//         {serverError && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md">
//             {serverError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-4">
//             <div className="flex-1">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name*"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.firstName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
//               )}
//             </div>

//             <div className="flex-1">
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name*"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {errors.lastName && (
//                 <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
//               )}
//             </div>
//           </div>

//           <input
//             type="text"
//             name="company"
//             placeholder="Company (optional)"
//             value={form.company}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email*"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//           )}

//           <input
//             type="password"
//             name="password"
//             placeholder="Password*"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//           )}

//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="user">User</option>
//             {/* <option value="admin">Admin</option> */}
//              <option value="admin" disabled={adminDisabled}>Admin</option>
//           </select>

//           <label className="flex items-center text-sm text-gray-600">
//             <input
//               type="checkbox"
//               name="agreed"
//               checked={form.agreed}
//               onChange={handleChange}
//               className="mr-2"
//             />
//             I agree to the <span className="ml-1 mr-1 underline">Terms</span> and{' '}
//             <span className="underline">Privacy Policy</span>
//           </label>
//           {errors.agreed && (
//             <p className="mb-2 -mt-2 text-sm text-red-600">{errors.agreed}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full px-4 py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;
//=======================[1]===========

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_BASE_URL
const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: '',
    role: 'user',
    agreed: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [adminDisabled, setAdminDisabled] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
    if (!passwordRegex.test(form.password))
      newErrors.password = 'Password must be at least 6 characters and include letters & numbers';
    if (!form.agreed) newErrors.agreed = 'You must agree to the terms';

    return newErrors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
    setServerError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // ✅ Check if role is admin, then validate admin count first
    if (form.role === 'admin') {
      try {
        const res = await axios.get(`${API_URL}/auth/admin-count`);
        const count = res.data.count;

        if (count >= 2) {
          setServerError('❌ Maximum of 2 admins are allowed');
          return;
        }
      } catch (error) {
        setServerError('❌ Could not verify admin limit. Try again later.');
        return;
      }
    }
    const payload = {
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    try {
      await axios.post(`${API_URL}/auth/signup`, payload);
      alert('✅ Signup successful');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setServerError(message);
    }
  };
  useEffect(() => {
    const checkAdminLimit = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/admin-count`);
        if (res.data.count >= 2) {
          setAdminDisabled(true);
        }
      } catch (error) {
        console.log('Failed to fetch admin count');
      }
    };

    checkAdminLimit();
  }, []);

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#fff1eb] via-[#ace0f9] to-[#6366f1] px-4">

    //   <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-black rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-10 border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">

    //     <div className="mb-6 text-center">

    //       <img
    //         src="/d1.png"
    //         // src="/farebuzzerIcon-r.png"
    //         alt="Fare Buzzer Logo"
    //         className="object-contain h-24 mx-auto mb-2 w-74"
    //       />

    //       <h1 className="text-3xl font-bold text-green-700">FareBuzzer Travel Pvt Ltd</h1>
    //       <p className="mt-2 text-sm text-gray-600">
    //         Already have an account?{' '}
    //         <Link to="/login" className="font-medium text-blue-600 hover:underline">
    //           Login here →
    //         </Link>
    //       </p>
    //     </div>

    //     <h2 className="mb-4 text-xl font-semibold text-center text-gray-800">
    //       Create Your Account
    //     </h2>

    //     {serverError && (
    //       <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md">
    //         {serverError}
    //       </div>
    //     )}

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <div className="flex gap-4">
    //         <div className="flex-1">
    //           <input
    //             type="text"
    //             name="firstName"
    //             placeholder="First Name*"
    //             value={form.firstName}
    //             onChange={handleChange}
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //           {errors.firstName && (
    //             <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
    //           )}
    //         </div>

    //         <div className="flex-1">
    //           <input
    //             type="text"
    //             name="lastName"
    //             placeholder="Last Name*"
    //             value={form.lastName}
    //             onChange={handleChange}
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //           {errors.lastName && (
    //             <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
    //           )}
    //         </div>
    //       </div>

    //       <input
    //         type="text"
    //         name="company"
    //         placeholder="Company (optional)"
    //         value={form.company}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />

    //       <input
    //         type="email"
    //         name="email"
    //         placeholder="Email*"
    //         value={form.email}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       {errors.email && (
    //         <p className="mt-1 text-sm text-red-600">{errors.email}</p>
    //       )}

    //       <input
    //         type="password"
    //         name="password"
    //         placeholder="Password*"
    //         value={form.password}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />
    //       {errors.password && (
    //         <p className="mt-1 text-sm text-red-600">{errors.password}</p>
    //       )}

    //       <select
    //         name="role"
    //         value={form.role}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       >
    //         <option value="user">User</option>
    //         <option value="supervisor">Supervisor</option>
    //         <option value="admin" disabled={adminDisabled}>Admin</option>
    //       </select>
    //       {/* <label className="flex items-center text-sm text-gray-600">
    //         <input
    //           type="checkbox"
    //           name="agreed"
    //           checked={form.agreed}
    //           onChange={handleChange}
    //           className="mr-2"
    //         />
    //         I agree to the <span className="ml-1 mr-1 underline">Terms</span> and{' '}
    //         <span className="underline">Privacy Policy</span>
    //       </label> */}

    //       <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer">
    //         <div className="flex items-center h-5">
    //           <input
    //             type="checkbox"
    //             name="agreed"
    //             checked={form.agreed}
    //             onChange={handleChange}
    //             className="w-4 h-4 text-blue-600 transition-all duration-200 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
    //           />
    //         </div>
    //         <div className="text-sm text-gray-700">
    //           <span className={`${form.agreed ? 'font-medium' : ''}`}>
    //             I agree to the{' '}
    //             <a href="/terms" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline">
    //               Terms of Service
    //             </a>{' '}
    //             and{' '}
    //             <a href="/privacy" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline">
    //               Privacy Policy
    //             </a>
    //           </span>
    //           {errors.agreed && (
    //             <p className="mt-1 text-xs text-red-500 animate-fadeIn">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
    //                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    //               </svg>
    //               {errors.agreed}
    //             </p>
    //           )}
    //         </div>
    //       </label>

    //       {errors.agreed && (
    //         <p className="mb-2 -mt-2 text-sm text-red-600">{errors.agreed}</p>
    //       )}

    //       <button
    //         type="submit"
    //         className="w-full !mt-2 bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2 px-4 rounded-md transition duration-200"
    //       >
    //         Sign Up
    //       </button>
    //     </form>
    //   </div>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#667eea] via-[#764ba2] to-[#6b21a8] px-4 relative overflow-hidden">

  {/* Background animations */}
  <div className="absolute rounded-full w-96 h-96 bg-pink-400/20 blur-3xl top-10 left-20 animate-pulse"></div>
  <div className="absolute rounded-full w-80 h-80 bg-blue-500/30 blur-3xl bottom-10 right-20 animate-ping"></div>

  <div className="w-full max-w-2xl relative z-10 bg-white/20 backdrop-blur-2xl text-black rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-10 border border-white/30 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">

    {/* Logo & Title */}
    <div className="mb-6 text-center">
      <img
        src="/d1.png"
        alt="Fare Buzzer Logo"
        className="object-contain h-20 mx-auto mb-2 drop-shadow-lg"
      />
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md">FareBuzzer Travel Pvt Ltd</h1>
      <p className="mt-2 text-sm text-gray-200">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-yellow-300 transition hover:underline hover:text-yellow-400">
          Login here →
        </Link>
      </p>
    </div>

    <h2 className="mb-6 text-2xl font-semibold text-center text-white">✨ Create Your Account</h2>

    {/* Error Alert */}
    {serverError && (
      <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow">
        {serverError}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* First & Last Name */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder=" "
            className="w-full px-4 py-3 text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
            First Name *
          </label>
          {errors.firstName && <p className="mt-1 text-sm text-red-300">{errors.firstName}</p>}
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder=" "
            className="w-full px-4 py-3 text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
            Last Name *
          </label>
          {errors.lastName && <p className="mt-1 text-sm text-red-300">{errors.lastName}</p>}
        </div>
      </div>

      {/* Company */}
      <div className="relative">
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder=" "
          className="w-full px-4 py-3 text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
          Company (optional)
        </label>
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder=" "
          className="w-full px-4 py-3 text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
          Email *
        </label>
        {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
      </div>

      {/* Password */}
    {/*  <div className="relative">
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder=" "
          className="w-full px-4 py-3 text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
          Password *
        </label>
        {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
      </div>
*/}

{/* Password */}
 <div className="relative">
      <input
        name="password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange}
        placeholder=" "
        className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
        Password *
      </label>

      {/* 👁️ Eye Icon */}
      <div
        className="absolute text-gray-600 cursor-pointer right-4 top-3 hover:text-yellow-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </div>

      {errors.password && (
        <p className="mt-1 text-sm text-red-300">{errors.password}</p>
      )}
    </div>
  


      {/* Role */}
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full px-4 py-3 text-black rounded-lg cursor-pointer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="user">User</option>
        {/* <option value="supervisor">Supervisor</option> */}
        <option value="admin" disabled={adminDisabled}>Admin</option>
      </select>

      {/* Terms & Privacy */}
      <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer">
        <input
          type="checkbox"
          name="agreed"
          checked={form.agreed}
          onChange={handleChange}
          className="w-4 h-4 mt-1 text-blue-600 border-2 border-gray-300 rounded cursor-pointer focus:ring-yellow-400"
        />
        <span className="text-sm text-white ">
          I agree to the{" "}
          <a href="/terms" className="font-medium text-yellow-300 transition hover:text-yellow-400 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="font-medium text-yellow-300 transition hover:text-yellow-400 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.agreed && <p className="text-sm text-red-300">{errors.agreed}</p>}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-400 rounded-lg shadow-md cursor-pointer hover:bg-yellow-500 hover:scale-105"
      >
        🚀 Sign Up
      </button>
    </form>
  </div>
</div>

  );
};

export default Signup;

//=======================[2]===========

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_BASE_URL;
// const Signup = () => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     company: "",
//     role: "user",
//     agreed: false,
//   });

//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const navigate = useNavigate();
//   const [adminDisabled, setAdminDisabled] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

//     if (!form.firstName.trim()) newErrors.firstName = "First name is required";
//     if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
//     if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";
//     if (!passwordRegex.test(form.password))
//       newErrors.password =
//         "Password must be at least 6 characters and include letters & numbers";
//     if (!form.agreed) newErrors.agreed = "You must agree to the terms";

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//     setErrors({ ...errors, [name]: "" });
//     setServerError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     // ✅ Check if role is admin, then validate admin count first
//     if (form.role === "admin") {
//       try {
//         const res = await axios.get(`${API_URL}/auth/admin-count`);
//         const count = res.data.count;

//         if (count >= 2) {
//           setServerError("❌ Maximum of 2 admins are allowed");
//           return;
//         }
//       } catch (error) {
//         setServerError("❌ Could not verify admin limit. Try again later.");
//         return;
//       }
//     }
//     const payload = {
//       name: `${form.firstName} ${form.lastName}`,
//       email: form.email,
//       password: form.password,
//       role: form.role,
//     };

//     try {
//       await axios.post(`${API_URL}/auth/signup`, payload);
//       alert("✅ Signup successful");
//       navigate("/login");
//     } catch (err) {
//       const message = err.response?.data?.message || "Signup failed";
//       setServerError(message);
//     }
//   };
//   useEffect(() => {
//     const checkAdminLimit = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/auth/admin-count`);
//         if (res.data.count >= 2) {
//           setAdminDisabled(true);
//         }
//       } catch (error) {
//         console.log("Failed to fetch admin count");
//       }
//     };

//     checkAdminLimit();
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ff6ec4] via-[#7873f5] to-[#1fd1f9] px-4 relative overflow-hidden">
//       {/* Background animations */}
//       <div className="absolute top-0 rounded-full w-96 h-96 bg-pink-500/20 blur-3xl -left-20 animate-pulse opacity-80"></div>
//       <div className="absolute bottom-0 delay-1000 rounded-full w-80 h-80 bg-cyan-400/25 blur-3xl -right-20 animate-pulse opacity-80"></div>
//       <div className="absolute rounded-full w-72 h-72 bg-yellow-400/20 blur-2xl top-1/2 left-1/2 animate-spin-slow opacity-60"></div>

//       <div className="w-full max-w-2xl relative z-10 bg-white/10 backdrop-blur-xl text-white rounded-3xl shadow-[0_10px_40px_rgba(255,255,255,0.3)] p-10 border border-white/20 transition-all duration-300 hover:shadow-[0_14px_50px_rgba(255,255,255,0.25)]">
//         {/* Logo & Title */}
//         <div className="mb-8 text-center">
//           <img
//             src="/d1.png"
//             alt="Fare Buzzer Logo"
//             className="object-contain h-24 mx-auto mb-3 drop-shadow-xl animate-fade-in"
//           />
//           <h1 className="text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)] tracking-tight animate-text-glow">
//             Fare Buzzer
//           </h1>
//           <p className="mt-3 text-sm font-medium text-gray-100">
//             Already have an account?{" "}
//             <Link
//               to="/login"
//               className="font-semibold text-green-400 underline transition-colors duration-200 hover:text-pink-300 underline-offset-4"
//             >
//               Login here →
//             </Link>
//           </p>
//         </div>

//         <h2 className="mb-6 text-2xl font-bold tracking-wide text-center text-white animate-text-glow">
//           ✨ Create Your Account
//         </h2>

//         {/* Error Alert */}
//         {serverError && (
//           <div className="px-4 py-3 mb-6 text-sm font-medium text-red-800 rounded-lg shadow-md bg-red-100/90 animate-slide-in">
//             {serverError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* First & Last Name */}
//           <div className="flex gap-4">
//             <div className="relative flex-1 group">
//               <input
//                 type="text"
//                 name="firstName"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 group-hover:shadow-lg"
//               />
//               <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-500">
//                 First Name *
//               </label>
//               {errors.firstName && (
//                 <p className="mt-1 text-sm font-medium text-red-400">
//                   {errors.firstName}
//                 </p>
//               )}
//             </div>

//             <div className="relative flex-1 group">
//               <input
//                 type="text"
//                 name="lastName"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 placeholder=" "
//                 className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 group-hover:shadow-lg"
//               />
//               <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-pink-500">
//                 Last Name *
//               </label>
//               {errors.lastName && (
//                 <p className="mt-1 text-sm font-medium text-red-400">
//                   {errors.lastName}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Company */}
//           <div className="relative group">
//             <input
//               type="text"
//               name="company"
//               value={form.company}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 group-hover:shadow-lg"
//             />
//             <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">
//               Company (optional)
//             </label>
//           </div>

//           {/* Email */}
//           <div className="relative group">
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 group-hover:shadow-lg"
//             />
//             <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cyan-400">
//               Email *
//             </label>
//           </div>

//           {/* Password */}
//           <div className="relative group">
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg peer focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200 group-hover:shadow-lg"
//             />
//             <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-400">
//               Password *
//             </label>
//           </div>

//           {/* Role Dropdown */}
//           <div className="relative group">
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               className="w-full px-4 py-3 !text-gray-900 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 group-hover:shadow-lg"
//             >
//               <option value="user">User</option>
//               <option value="supervisor">Supervisor</option>
//               <option value="admin" disabled={adminDisabled}>
//                 Admin
//               </option>
//             </select>
//             <label className="absolute left-3 -top-2.5 text-gray-600 text-sm bg-white/90 px-2 rounded-md transition-all">
//               Role *
//             </label>
//           </div>

//           {/* Terms & Privacy */}
//           <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer">
//             <input
//               type="checkbox"
//               name="agreed"
//               checked={form.agreed}
//               onChange={handleChange}
//               className="w-4 h-4 mt-1 text-pink-500 border-2 border-gray-300 rounded focus:ring-cyan-400"
//             />
//             <span className="text-sm text-white">
//               I agree to the{" "}
//               <a
//                 href="/terms"
//                 className="font-medium text-yellow-300 hover:text-yellow-400 hover:underline underline-offset-4"
//               >
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a
//                 href="/privacy"
//                 className="font-medium text-yellow-300 hover:text-yellow-400 hover:underline underline-offset-4"
//               >
//                 Privacy Policy
//               </a>
//             </span>
//           </label>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-transform duration-300 rounded-lg shadow-xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:scale-105"
//           >
//             <span>🚀 Sign Up</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;
