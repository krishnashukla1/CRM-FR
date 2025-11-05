// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState('');
//   const navigate = useNavigate();
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('role');
//     if (token && role) {
//       if (role === 'admin') navigate('/dashboard');
//       else if (role === 'user') navigate('/user-dashboard');
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email) newErrors.email = 'Email is required';
//     else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
//     if (!form.password) newErrors.password = 'Password is required';

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' });
//     setServerError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, form);
//       const { token, user } = res.data;

//       if (token && user?._id && user?.role) {
//         // Store all user data including employeeId
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', user._id);
//         localStorage.setItem('role', user.role);
//         localStorage.setItem('name', user.name);
//         localStorage.setItem('photo', user.photo || '');

//         // Store complete user object with employeeId
//         localStorage.setItem('user', JSON.stringify({
//           ...user,
//           employeeId: user.employeeId || user._id // Ensure employeeId exists
//         }));
//         localStorage.setItem('employee', JSON.stringify(user));

// // ✅ Add this line to store login time
// localStorage.setItem('loginTime', new Date().toISOString());
// localStorage.setItem("employee", JSON.stringify(updatedUser));

//         setSuccessMessage('✅ Login successful! Redirecting...');
//         setServerError('');

//         setTimeout(() => {
//           if (user.role === 'admin') navigate('/dashboard');
//           else navigate('/user-dashboard');
//         }, 1800);
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Login failed';
//       setServerError(msg);
//       setSuccessMessage('');
//     }
//   };

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    // if (token && role) {
    //   if (role === 'admin') navigate('/dashboard');
    //   else if (role === 'user') navigate('/user-dashboard');
    // }

    if (token && role) {
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "supervisor") {
        navigate("/supervisor-dashboard");
      } else if (role === "user") {
        navigate("/user-dashboard");
      }
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }/auth/login`,
        form
      );
      const { token, user } = res.data;

      // if (token && user?._id && user?.role) {
      //   // Save login info
      //   localStorage.setItem('token', token);
      //   localStorage.setItem('userId', user._id);
      //   localStorage.setItem('role', user.role);
      //   localStorage.setItem('name', user.name);
      //   localStorage.setItem('photo', user.photo || '');

      //   // Save full user info
      //   const fullUser = {
      //     ...user,
      //     employeeId: user.employeeId || user._id
      //   };
      //   localStorage.setItem('user', JSON.stringify(fullUser));
      //   localStorage.setItem('employee', JSON.stringify(fullUser));
      //   localStorage.setItem('user', JSON.stringify({ email: 'fbadmin@gmail.com' }));

      //   // localStorage.setItem('loginTime', new Date().toISOString());

      //   // Only set loginTime if not already set for today
      //   const storedLoginTime = localStorage.getItem('loginTime');
      //   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      //   const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);

      //   if (!isSameDay) {
      //     localStorage.setItem('loginTime', new Date().toISOString());
      //   }

      //   sessionStorage.setItem('sessionStart', new Date().toISOString());

      //   // localStorage.setItem('photo', user.photo || '/default-avatar.png');

      //   setSuccessMessage('✅ Login successful! Redirecting...');
      //   setServerError('');

      //   // setTimeout(() => {
      //   //   if (user.role === 'admin') navigate('/dashboard');
      //   //   else navigate('/user-dashboard');
      //   // }, 1800);

      //   setTimeout(() => {
      //     if (user.role === 'admin') {
      //       navigate('/dashboard');
      //     } else if (user.role === 'supervisor') {
      //       navigate('/supervisor-dashboard');
      //     } else {
      //       navigate('/user-dashboard');
      //     }
      //   }, 1800);

      // }

      if (token && user?._id && user?.role) {
        // Save login info
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("photo", user.photo || "");

        // Save full user info (REAL data from backend)
        const fullUser = {
          ...user,
          employeeId: user.employeeId || user._id,
        };
        localStorage.setItem("user", JSON.stringify(fullUser));
        localStorage.setItem("employee", JSON.stringify(fullUser));

        // Only set loginTime if not already set for today
        const storedLoginTime = localStorage.getItem("loginTime");
        const today = new Date().toISOString().split("T")[0];
        const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);

        if (!isSameDay) {
          localStorage.setItem("loginTime", new Date().toISOString());
        }

        sessionStorage.setItem("sessionStart", new Date().toISOString());

        setSuccessMessage("✅ Login successful! Redirecting...");
        setServerError("");

        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/dashboard");
          } else if (user.role === "supervisor") {
            navigate("/supervisor-dashboard");
          } else {
            navigate("/user-dashboard");
          }
        }, 1800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setServerError(msg);
      setSuccessMessage("");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#7e57c2] to-[#1a237e] px-4">
    //   <div className="w-full max-w-xl p-10 text-white border shadow-2xl bg-white/20 backdrop-blur-lg rounded-2xl border-white/30">
    //     <div className="mb-6 text-center">
    //       <div className="flex flex-col items-center mb-4">

    //         <img
    //           src="/d1.png"

    //           alt="Fare Buzzer Logo"
    //           className="object-contain h-24 mx-auto mb-2 w-74"
    //         />
    //         <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">
    //           FareBuzzer Travel Pvt Ltd
    //         </h1>
    //       </div>

    //       <p className="mt-2 text-sm text-gray-200">
    //         Don&apos;t have an account?{' '}
    //         <Link
    //           to="/signup"
    //           className="inline-flex items-center font-semibold text-yellow-300 hover:underline"
    //         >
    //           Sign up here <span className="ml-1">→</span>
    //         </Link>
    //       </p>
    //     </div>

    //     <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

    //     {serverError && (
    //       <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md">
    //         {serverError}
    //       </div>
    //     )}
    //     {successMessage && (
    //       <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 transition-opacity duration-300 ease-in bg-green-100 rounded-md">
    //         {successMessage}
    //       </div>
    //     )}

    //     <form onSubmit={handleSubmit} noValidate autoComplete="off">
    //       <div className="mb-4">
    //         <input
    //           name="email"
    //           type="email"
    //           value={form.email}
    //           onChange={handleChange}
    //           placeholder="Email*"
    //           className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    //         />
    //         {errors.email && (
    //           <p className="mt-1 text-sm text-red-300">{errors.email}</p>
    //         )}
    //       </div>

    //       <div className="mb-6">
    //         <input
    //           name="password"
    //           type="password"
    //           value={form.password}
    //           onChange={handleChange}
    //           placeholder="Password*"
    //           className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    //         />
    //         {errors.password && (
    //           <p className="mt-1 text-sm text-red-300">{errors.password}</p>
    //         )}
    //       </div>

    //       <button
    //         type="submit"
    //         className="w-full py-3 font-bold text-black transition duration-200 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500"
    //       >
    //         🚀 Login to Dashboard
    //       </button>
    //     </form>
    //   </div>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>

      <div className="relative z-10 w-full max-w-md p-8 text-white border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30">
        {/* Logo & Title */}
        <div className="mb-6 text-center">
          <img
            src="/d1.png"
            alt="Fare Buzzer Logo"
            className="object-contain h-20 mx-auto mb-2 drop-shadow-lg"
          />
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
            FareBuzzer Travel Pvt Ltd
          </h1>
          <p className="mt-2 text-sm text-gray-200">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-yellow-300 transition hover:underline hover:text-yellow-400"
            >
              Sign up here →
            </Link>
          </p>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

        {/* Alerts */}
        {serverError && (
          <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow">
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-md shadow">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          className="space-y-5"
        >
          {/* Email */}
          <div className="relative">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Email *
            </label>
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          {/* <div className="relative">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Password *
            </label>
            {errors.password && (
              <p className="mt-1 text-sm text-red-300">{errors.password}</p>
            )}
          </div> */}

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
  

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-400 rounded-lg shadow-md cursor-pointer hover:bg-yellow-500 hover:scale-105"
          >
            🚀 Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
