
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
//       {/* <div className="w-full max-w-2xl bg-white text-black rounded-3xl shadow-2xl p-10"> */}

//       <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-black rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-10 border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">

//         <div className="text-center mb-6">


//           <img
//             src="/d1.png"
//             // src="/farebuzzerIcon-r.png"
//             alt="Fare Buzzer Logo"
//             className="mx-auto w-74 h-24 object-contain mb-2"
//           />

//           <h1 className="text-3xl font-bold text-green-700">FareBuzzer Travel Pvt Ltd</h1>
//           <p className="text-sm mt-2 text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-600 font-medium hover:underline">
//               Login here →
//             </Link>
//           </p>
//         </div>

//         <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
//           Create Your Account
//         </h2>

//         {serverError && (
//           <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm font-medium">
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
//                 <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
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
//                 <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
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
//             <p className="text-red-600 text-sm mt-1">{errors.email}</p>
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
//             <p className="text-red-600 text-sm mt-1">{errors.password}</p>
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
//             I agree to the <span className="underline ml-1 mr-1">Terms</span> and{' '}
//             <span className="underline">Privacy Policy</span>
//           </label>
//           {errors.agreed && (
//             <p className="text-red-600 text-sm -mt-2 mb-2">{errors.agreed}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
//           >
//             Sign Up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;
//==================================


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#fff1eb] via-[#ace0f9] to-[#6366f1] px-4">
      {/* <div className="w-full max-w-2xl bg-white text-black rounded-3xl shadow-2xl p-10"> */}

      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-lg text-black rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-10 border border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">

        <div className="text-center mb-6">


          <img
            src="/d1.png"
            // src="/farebuzzerIcon-r.png"
            alt="Fare Buzzer Logo"
            className="mx-auto w-74 h-24 object-contain mb-2"
          />

          <h1 className="text-3xl font-bold text-green-700">FareBuzzer Travel Pvt Ltd</h1>
          <p className="text-sm mt-2 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here →
            </Link>
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
          Create Your Account
        </h2>

        {serverError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                placeholder="First Name*"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name*"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <input
            type="text"
            name="company"
            placeholder="Company (optional)"
            value={form.company}
            onChange={handleChange}
            className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password*"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 !mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}


          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin" disabled={adminDisabled}>Admin</option>
          </select>
          {/* <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              name="agreed"
              checked={form.agreed}
              onChange={handleChange}
              className="mr-2"
            />
            I agree to the <span className="underline ml-1 mr-1">Terms</span> and{' '}
            <span className="underline">Privacy Policy</span>
          </label> */}


          <label className="flex items-start gap-3 mt-4 mb-2 cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
              />
            </div>
            <div className="text-sm text-gray-700">
              <span className={`${form.agreed ? 'font-medium' : ''}`}>
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200">
                  Privacy Policy
                </a>
              </span>
              {errors.agreed && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.agreed}
                </p>
              )}
            </div>
          </label>

          {errors.agreed && (
            <p className="text-red-600 text-sm -mt-2 mb-2">{errors.agreed}</p>
          )}

          <button
            type="submit"
            className="w-full !mt-2 bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
