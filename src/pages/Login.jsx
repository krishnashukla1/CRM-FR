//======================correct================


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     // if (token && role) {
//     //   if (role === 'admin') navigate('/dashboard');
//     //   else if (role === 'user') navigate('/user-dashboard');
//     // }

//     if (token && role) {
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else if (role === "supervisor") {
//         navigate("/supervisor-dashboard");
//       } else if (role === "user") {
//         navigate("/user-dashboard");
//       }
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email) newErrors.email = "Email is required";
//     else if (!emailRegex.test(form.email))
//       newErrors.email = "Invalid email format";
//     if (!form.password) newErrors.password = "Password is required";

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${
//           import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
//         }/auth/login`,
//         form
//       );
//       const { token, user } = res.data;

//       // if (token && user?._id && user?.role) {
//       //   // Save login info
//       //   localStorage.setItem('token', token);
//       //   localStorage.setItem('userId', user._id);
//       //   localStorage.setItem('role', user.role);
//       //   localStorage.setItem('name', user.name);
//       //   localStorage.setItem('photo', user.photo || '');

//       //   // Save full user info
//       //   const fullUser = {
//       //     ...user,
//       //     employeeId: user.employeeId || user._id
//       //   };
//       //   localStorage.setItem('user', JSON.stringify(fullUser));
//       //   localStorage.setItem('employee', JSON.stringify(fullUser));
//       //   localStorage.setItem('user', JSON.stringify({ email: 'fbadmin@gmail.com' }));

//       //   // localStorage.setItem('loginTime', new Date().toISOString());

//       //   // Only set loginTime if not already set for today
//       //   const storedLoginTime = localStorage.getItem('loginTime');
//       //   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
//       //   const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);

//       //   if (!isSameDay) {
//       //     localStorage.setItem('loginTime', new Date().toISOString());
//       //   }

//       //   sessionStorage.setItem('sessionStart', new Date().toISOString());

//       //   // localStorage.setItem('photo', user.photo || '/default-avatar.png');

//       //   setSuccessMessage('✅ Login successful! Redirecting...');
//       //   setServerError('');

//       //   // setTimeout(() => {
//       //   //   if (user.role === 'admin') navigate('/dashboard');
//       //   //   else navigate('/user-dashboard');
//       //   // }, 1800);

//       //   setTimeout(() => {
//       //     if (user.role === 'admin') {
//       //       navigate('/dashboard');
//       //     } else if (user.role === 'supervisor') {
//       //       navigate('/supervisor-dashboard');
//       //     } else {
//       //       navigate('/user-dashboard');
//       //     }
//       //   }, 1800);

//       // }

//       if (token && user?._id && user?.role) {
//         // Save login info
//         localStorage.setItem("token", token);
//         localStorage.setItem("userId", user._id);
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("name", user.name);
//         localStorage.setItem("photo", user.photo || "");

//         // Save full user info (REAL data from backend)
//         const fullUser = {
//           ...user,
//           employeeId: user.employeeId || user._id,
//         };
//         localStorage.setItem("user", JSON.stringify(fullUser));
//         localStorage.setItem("employee", JSON.stringify(fullUser));

//         // Only set loginTime if not already set for today
//         const storedLoginTime = localStorage.getItem("loginTime");
//         const today = new Date().toISOString().split("T")[0];
//         const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);

//         if (!isSameDay) {
//           localStorage.setItem("loginTime", new Date().toISOString());
//         }

//         sessionStorage.setItem("sessionStart", new Date().toISOString());

//         setSuccessMessage("✅ Login successful! Redirecting...");
//         setServerError("");

//         setTimeout(() => {
//           if (user.role === "admin") {
//             navigate("/dashboard");
//           } else if (user.role === "supervisor") {
//             navigate("/supervisor-dashboard");
//           } else {
//             navigate("/user-dashboard");
//           }
//         }, 1800);
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed";
//       setServerError(msg);
//       setSuccessMessage("");
//     }
//   };

//   return (
//     // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#7e57c2] to-[#1a237e] px-4">
//     //   <div className="w-full max-w-xl p-10 text-white border shadow-2xl bg-white/20 backdrop-blur-lg rounded-2xl border-white/30">
//     //     <div className="mb-6 text-center">
//     //       <div className="flex flex-col items-center mb-4">

//     //         <img
//     //           src="/d1.png"

//     //           alt="Fare Buzzer Logo"
//     //           className="object-contain h-24 mx-auto mb-2 w-74"
//     //         />
//     //         <h1 className="text-3xl font-bold text-center text-white drop-shadow-md">
//     //           FareBuzzer Travel Pvt Ltd
//     //         </h1>
//     //       </div>

//     //       <p className="mt-2 text-sm text-gray-200">
//     //         Don&apos;t have an account?{' '}
//     //         <Link
//     //           to="/signup"
//     //           className="inline-flex items-center font-semibold text-yellow-300 hover:underline"
//     //         >
//     //           Sign up here <span className="ml-1">→</span>
//     //         </Link>
//     //       </p>
//     //     </div>

//     //     <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

//     //     {serverError && (
//     //       <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md">
//     //         {serverError}
//     //       </div>
//     //     )}
//     //     {successMessage && (
//     //       <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 transition-opacity duration-300 ease-in bg-green-100 rounded-md">
//     //         {successMessage}
//     //       </div>
//     //     )}

//     //     <form onSubmit={handleSubmit} noValidate autoComplete="off">
//     //       <div className="mb-4">
//     //         <input
//     //           name="email"
//     //           type="email"
//     //           value={form.email}
//     //           onChange={handleChange}
//     //           placeholder="Email*"
//     //           className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//     //         />
//     //         {errors.email && (
//     //           <p className="mt-1 text-sm text-red-300">{errors.email}</p>
//     //         )}
//     //       </div>

//     //       <div className="mb-6">
//     //         <input
//     //           name="password"
//     //           type="password"
//     //           value={form.password}
//     //           onChange={handleChange}
//     //           placeholder="Password*"
//     //           className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//     //         />
//     //         {errors.password && (
//     //           <p className="mt-1 text-sm text-red-300">{errors.password}</p>
//     //         )}
//     //       </div>

//     //       <button
//     //         type="submit"
//     //         className="w-full py-3 font-bold text-black transition duration-200 bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500"
//     //       >
//     //         🚀 Login to Dashboard
//     //       </button>
//     //     </form>
//     //   </div>
//     // </div>

//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">
//       {/* Animated background circles */}
//       <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
//       <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>

//       <div className="relative z-10 w-full max-w-md p-8 text-white border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30">
//         {/* Logo & Title */}
//         <div className="mb-6 text-center">
//           <img
//             src="/d1.png"
//             alt="Fare Buzzer Logo"
//             className="object-contain h-20 mx-auto mb-2 drop-shadow-lg"
//           />
//           <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
//             FareBuzzer Travel Pvt Ltd
//           </h1>
//           <p className="mt-2 text-sm text-gray-200">
//             Don&apos;t have an account?{" "}
//             <Link
//               to="/signup"
//               className="font-semibold text-yellow-300 transition hover:underline hover:text-yellow-400"
//             >
//               Sign up here →
//             </Link>
//           </p>
//         </div>

//         {/* Heading */}
//         <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

//         {/* Alerts */}
//         {serverError && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow">
//             {serverError}
//           </div>
//         )}
//         {successMessage && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-md shadow">
//             {successMessage}
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           noValidate
//           autoComplete="off"
//           className="space-y-5"
//         >
//           {/* Email */}
//           <div className="relative">
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Email *
//             </label>
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-300">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           {/* <div className="relative">
//             <input
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Password *
//             </label>
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-300">{errors.password}</p>
//             )}
//           </div> */}

//            <div className="relative">
//       <input
//         name="password"
//         type={showPassword ? "text" : "password"}
//         value={form.password}
//         onChange={handleChange}
//         placeholder=" "
//         className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//       />
//       <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//         Password *
//       </label>

//       {/* 👁️ Eye Icon */}
//       <div
//         className="absolute text-gray-600 cursor-pointer right-4 top-3 hover:text-yellow-500"
//         onClick={() => setShowPassword(!showPassword)}
//       >
//         {showPassword ? <FaEyeSlash /> : <FaEye />}
//       </div>

//       {errors.password && (
//         <p className="mt-1 text-sm text-red-300">{errors.password}</p>
//       )}
//     </div>
  

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-400 rounded-lg shadow-md cursor-pointer hover:bg-yellow-500 hover:scale-105"
//           >
//             🚀 Login to Dashboard
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

//========================spinning showing when login===============

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (token && role) {
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else if (role === "supervisor") {
//         navigate("/supervisor-dashboard");
//       } else if (role === "user") {
//         navigate("/user-dashboard");
//       }
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email) newErrors.email = "Email is required";
//     else if (!emailRegex.test(form.email))
//       newErrors.email = "Invalid email format";
//     if (!form.password) newErrors.password = "Password is required";

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };
//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const validationErrors = validate();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   setIsLoading(true);  // start loader

//   try {
//     const res = await axios.post(
//       `${
//         import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
//       }/auth/login`,
//       form
//     );

//     const { token, user } = res.data;

//     if (token && user?._id && user?.role) {
//       localStorage.setItem("token", token);
//       localStorage.setItem("userId", user._id);
//       localStorage.setItem("role", user.role);
//       localStorage.setItem("name", user.name);
//       localStorage.setItem("photo", user.photo || "");

//       const fullUser = { ...user, employeeId: user.employeeId || user._id };
//       localStorage.setItem("user", JSON.stringify(fullUser));
//       localStorage.setItem("employee", JSON.stringify(fullUser));

//       const storedLoginTime = localStorage.getItem("loginTime");
//       const today = new Date().toISOString().split("T")[0];
//       const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);
//       if (!isSameDay) {
//         localStorage.setItem("loginTime", new Date().toISOString());
//       }

//       sessionStorage.setItem("sessionStart", new Date().toISOString());

//       setSuccessMessage("✅ Login successful! Redirecting...");
//       setServerError("");

//       setTimeout(() => {
//         if (user.role === "admin") navigate("/dashboard");
//         else if (user.role === "supervisor") navigate("/supervisor-dashboard");
//         else navigate("/user-dashboard");
//       }, 1800);
//     }
//   } catch (err) {
//     const msg = err.response?.data?.message || "Login failed";
//     setServerError(msg);
//     setSuccessMessage("");
//   }

//   setIsLoading(false); // stop loader
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">
//       {/* Animated background circles */}
//       <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
//       <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>

//       <div className="relative z-10 w-full max-w-md p-8 text-white border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30">
//         {/* Logo & Title */}
//         <div className="mb-6 text-center">
//           <img
//             src="/d1.png"
//             alt="Fare Buzzer Logo"
//             className="object-contain h-20 mx-auto mb-2 drop-shadow-lg"
//           />
//           <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
//             FareBuzzer Travel Pvt Ltd
//           </h1>
//           <p className="mt-2 text-sm text-gray-200">
//             Don&apos;t have an account?{" "}
//             <Link
//               to="/signup"
//               className="font-semibold text-yellow-300 transition hover:underline hover:text-yellow-400"
//             >
//               Sign up here →
//             </Link>
//           </p>
//         </div>

//         {/* Heading */}
//         <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

//         {/* Alerts */}
//         {serverError && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow">
//             {serverError}
//           </div>
//         )}
//         {successMessage && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-md shadow">
//             {successMessage}
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           noValidate
//           autoComplete="off"
//           className="space-y-5"
//         >
//           {/* Email */}
//           <div className="relative">
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Email *
//             </label>
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-300">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//            <div className="relative">
//       <input
//         name="password"
//         type={showPassword ? "text" : "password"}
//         value={form.password}
//         onChange={handleChange}
//         placeholder=" "
//         className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//       />
//       <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//         Password *
//       </label>

//       {/* 👁️ Eye Icon */}
//       <div
//         className="absolute text-gray-600 cursor-pointer right-4 top-3 hover:text-yellow-500"
//         onClick={() => setShowPassword(!showPassword)}
//       >
//         {showPassword ? <FaEyeSlash /> : <FaEye />}
//       </div>

//       {errors.password && (
//         <p className="mt-1 text-sm text-red-300">{errors.password}</p>
//       )}
//     </div>
  

//           {/* Submit */}
//           <button
//   type="submit"
//   disabled={isLoading}
//   className={`w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-400 rounded-lg shadow-md cursor-pointer 
//   hover:bg-yellow-500 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
// >
//   {isLoading ? (
//     <div className="flex items-center justify-center gap-2">
//       <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//       Processing...
//     </div>
//   ) : (
//     "🚀 Login to Dashboard"
//   )}
// </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

//=========stylish deepseek===============

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (token && role) {
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else if (role === "supervisor") {
//         navigate("/supervisor-dashboard");
//       } else if (role === "user") {
//         navigate("/user-dashboard");
//       }
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email) newErrors.email = "Email is required";
//     else if (!emailRegex.test(form.email))
//       newErrors.email = "Invalid email format";
//     if (!form.password) newErrors.password = "Password is required";

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);  // start loader

//     try {
//       const res = await axios.post(
//         `${
//           import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
//         }/auth/login`,
//         form
//       );

//       const { token, user } = res.data;

//       if (token && user?._id && user?.role) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("userId", user._id);
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("name", user.name);
//         localStorage.setItem("photo", user.photo || "");

//         const fullUser = { ...user, employeeId: user.employeeId || user._id };
//         localStorage.setItem("user", JSON.stringify(fullUser));
//         localStorage.setItem("employee", JSON.stringify(fullUser));

//         const storedLoginTime = localStorage.getItem("loginTime");
//         const today = new Date().toISOString().split("T")[0];
//         const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);
//         if (!isSameDay) {
//           localStorage.setItem("loginTime", new Date().toISOString());
//         }

//         sessionStorage.setItem("sessionStart", new Date().toISOString());

//         setSuccessMessage("✅ Login successful! Redirecting...");
//         setServerError("");

//         setTimeout(() => {
//           if (user.role === "admin") navigate("/dashboard");
//           else if (user.role === "supervisor") navigate("/supervisor-dashboard");
//           else navigate("/user-dashboard");
//         }, 1800);
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed";
//       setServerError(msg);
//       setSuccessMessage("");
//     }

//     setIsLoading(false); // stop loader
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
//       <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>
      
//       {/* Floating particles */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-white/10 animate-float"
//             style={{
//               width: `${Math.random() * 20 + 5}px`,
//               height: `${Math.random() * 20 + 5}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${Math.random() * 10 + 10}s`
//             }}
//           ></div>
//         ))}
//       </div>

//       <div className="relative z-10 w-full max-w-md p-8 text-white transition-all duration-500 transform border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30 hover:shadow-3xl">
//         {/* Logo & Title */}
//         <div className="mb-6 text-center">
//           <div className="relative inline-block mb-2">
//             <img
//               src="/d1.png"
//               alt="Fare Buzzer Logo"
//               className="object-contain h-20 mx-auto transition-transform duration-500 drop-shadow-lg hover:scale-105"
//             />
//           </div>
//           <h1 className="text-3xl font-extrabold text-transparent text-white drop-shadow-md bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
//             FareBuzzer Travel Pvt Ltd
//           </h1>
//           <p className="mt-2 text-sm text-gray-200">
//             Don&apos;t have an account?{" "}
//             <Link
//               to="/signup"
//               className="font-semibold text-yellow-300 transition-all duration-300 hover:underline hover:text-yellow-400 hover:tracking-wider"
//             >
//               Sign up here →
//             </Link>
//           </p>
//         </div>

//         {/* Heading */}
//         <h2 className="flex items-center justify-center gap-2 mb-6 text-2xl font-semibold text-center">
//           <span className="p-2 rounded-full shadow-lg bg-gradient-to-r from-yellow-300 to-yellow-500">
//             🔐
//           </span>
//           Login
//         </h2>

//         {/* Alerts */}
//         {serverError && (
//           <div className="px-4 py-3 mb-4 text-sm font-medium text-red-800 bg-red-100 border border-red-200 rounded-lg shadow-lg animate-shake">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               {serverError}
//             </div>
//           </div>
//         )}
//         {successMessage && (
//           <div className="px-4 py-3 mb-4 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-lg shadow-lg animate-pulse">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               {successMessage}
//             </div>
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           noValidate
//           autoComplete="off"
//           className="space-y-5"
//         >
//           {/* Email */}
//           <div className="relative group">
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400 transition-all duration-300 group-hover:bg-white"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Email *
//             </label>
//             {errors.email && (
//               <p className="flex items-center mt-1 text-sm text-red-300">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="relative group">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={form.password}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400 transition-all duration-300 group-hover:bg-white pr-12"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Password *
//             </label>

//             {/* 👁️ Eye Icon */}
//             <div
//               className="absolute text-gray-600 transition-colors duration-300 cursor-pointer right-4 top-3 hover:text-yellow-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>

//             {errors.password && (
//               <p className="flex items-center mt-1 text-sm text-red-300">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-3 font-bold text-black transition-all duration-500 rounded-lg shadow-md cursor-pointer 
//             ${isLoading 
//               ? 'bg-yellow-600 scale-95' 
//               : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 hover:shadow-xl'} 
//             disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden group`}
//           >
//             {/* Animated background effect */}
//             <div className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full"></div>
            
//             {/* Button content */}
//             <div className="relative flex items-center justify-center gap-2">
//               {isLoading ? (
//                 <>
//                   {/* Beautiful Spinner */}
//                   <div className="relative w-6 h-6">
//                     <div className="absolute w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//                     <div className="absolute w-6 h-6 border-2 border-transparent rounded-full border-t-white animate-ping"></div>
//                   </div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <span className="text-lg">🚀</span>
//                   Login to Dashboard
//                 </>
//               )}
//             </div>
//           </button>
//         </form>

//         {/* Forgot Password Link */}
//         <div className="mt-6 text-center">
//           <Link
//             to="/forgot-password"
//             className="text-sm text-gray-200 transition-all duration-300 hover:text-yellow-300 hover:underline"
//           >
//             Forgot your password?
//           </Link>
//         </div>
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(180deg); }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
//         .animate-float {
//           animation: float linear infinite;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .shadow-3xl {
//           box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;








//================without supervisor==============

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   // 🔥 Remove supervisor from redirect logic
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (token && role) {
//       if (role === "admin") {
//         navigate("/dashboard");
//       } else if (role === "user") {
//         navigate("/user-dashboard");
//       }
//     }
//   }, [navigate]);

//   const validate = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!form.email) newErrors.email = "Email is required";
//     else if (!emailRegex.test(form.email))
//       newErrors.email = "Invalid email format";

//     if (!form.password) newErrors.password = "Password is required";

//     return newErrors;
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//     setServerError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await axios.post(
//         `${
//           import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
//         }/auth/login`,
//         form
//       );

//       const { token, user } = res.data;

//       if (token && user?._id && user?.role) {
//         // Save only admin & user
//         localStorage.setItem("token", token);
//         localStorage.setItem("userId", user._id);
//         localStorage.setItem("role", user.role);
//         localStorage.setItem("name", user.name);
//         localStorage.setItem("photo", user.photo || "");

//         const fullUser = { ...user, employeeId: user.employeeId || user._id };
//         localStorage.setItem("user", JSON.stringify(fullUser));
//         localStorage.setItem("employee", JSON.stringify(fullUser));

//         const storedLoginTime = localStorage.getItem("loginTime");
//         const today = new Date().toISOString().split("T")[0];
//         const isSameDay =
//           storedLoginTime && storedLoginTime.startsWith(today);

//         if (!isSameDay) {
//           localStorage.setItem("loginTime", new Date().toISOString());
//         }

//         sessionStorage.setItem("sessionStart", new Date().toISOString());

//         setSuccessMessage("✅ Login successful! Redirecting...");
//         setServerError("");

//         // 🔥 Supervisor removed
//         setTimeout(() => {
//           if (user.role === "admin") {
//             navigate("/dashboard");
//           } else {
//             navigate("/user-dashboard");
//           }
//         }, 1800);
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || "Login failed";
//       setServerError(msg);
//       setSuccessMessage("");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">

//       <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
//       <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>

//       <div className="relative z-10 w-full max-w-md p-8 text-white border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30">

//         <div className="mb-6 text-center">
//           <img
//             src="/d1.png"
//             alt="Fare Buzzer Logo"
//             className="object-contain h-20 mx-auto mb-2 drop-shadow-lg"
//           />
//           <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
//             FareBuzzer Travel Pvt Ltd
//           </h1>
//           <p className="mt-2 text-sm text-gray-200">
//             Don&apos;t have an account?{" "}
//             <Link
//               to="/signup"
//               className="font-semibold text-yellow-300 transition hover:underline hover:text-yellow-400"
//             >
//               Sign up here →
//             </Link>
//           </p>
//         </div>

//         <h2 className="mb-6 text-2xl font-semibold text-center">🔐 Login</h2>

//         {serverError && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-md shadow">
//             {serverError}
//           </div>
//         )}

//         {successMessage && (
//           <div className="px-4 py-2 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-md shadow">
//             {successMessage}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">

//           <div className="relative">
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Email *
//             </label>

//             {errors.email && (
//               <p className="mt-1 text-sm text-red-300">{errors.email}</p>
//             )}
//           </div>

//           <div className="relative">
//             <input
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={form.password}
//               onChange={handleChange}
//               placeholder=" "
//               className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />

//             <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/80 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
//               Password *
//             </label>

//             <div
//               className="absolute text-gray-600 cursor-pointer right-4 top-3 hover:text-yellow-500"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>

//             {errors.password && (
//               <p className="mt-1 text-sm text-red-300">{errors.password}</p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-3 font-bold text-black transition-all duration-300 bg-yellow-400 rounded-lg shadow-md cursor-pointer 
//             hover:bg-yellow-500 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed`}
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
//                 Processing...
//               </div>
//             ) : (
//               "🚀 Login to Dashboard"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
//======================without supervisor with stylish==============

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 Remove supervisor from redirect logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "admin") {
        navigate("/dashboard");
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

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }/auth/login`,
        form
      );

      const { token, user } = res.data;

      if (token && user?._id && user?.role) {
        // Save only admin & user
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("photo", user.photo || "");

        const fullUser = { ...user, employeeId: user.employeeId || user._id };
        localStorage.setItem("user", JSON.stringify(fullUser));
        localStorage.setItem("employee", JSON.stringify(fullUser));

        const storedLoginTime = localStorage.getItem("loginTime");
        const today = new Date().toISOString().split("T")[0];
        const isSameDay =
          storedLoginTime && storedLoginTime.startsWith(today);

        if (!isSameDay) {
          localStorage.setItem("loginTime", new Date().toISOString());
        }

        sessionStorage.setItem("sessionStart", new Date().toISOString());

        setSuccessMessage("✅ Login successful! Redirecting...");
        setServerError("");

        // 🔥 Supervisor removed
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/dashboard");
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

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#1a237e] px-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute rounded-full w-72 h-72 bg-purple-500/30 blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute rounded-full w-80 h-80 bg-blue-500/20 blur-3xl bottom-10 right-10 animate-ping"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 8 + 8}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 text-white transition-all duration-500 transform border shadow-2xl bg-white/20 backdrop-blur-2xl rounded-2xl border-white/30 hover:shadow-3xl">

        {/* Logo & Title */}
        <div className="mb-6 text-center">
          <div className="relative inline-block mb-2">
            <img
              src="/d1.png"
              alt="Fare Buzzer Logo"
              className="object-contain h-20 mx-auto transition-transform duration-500 drop-shadow-lg hover:scale-105"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent text-white drop-shadow-md bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
            FareBuzzer Travel Pvt Ltd
          </h1>
          <p className="mt-2 text-sm text-gray-200">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-yellow-300 transition-all duration-300 hover:underline hover:text-yellow-400 hover:tracking-wider"
            >
              Sign up here →
            </Link>
          </p>
        </div>

        {/* Heading */}
        <h2 className="flex items-center justify-center gap-2 mb-6 text-2xl font-semibold text-center">
          <span className="p-2 rounded-full shadow-lg bg-gradient-to-r from-yellow-300 to-yellow-500">
            🔐
          </span>
          Login
        </h2>

        {/* Enhanced Alerts */}
        {serverError && (
          <div className="px-4 py-3 mb-4 text-sm font-medium text-red-800 bg-red-100 border border-red-200 rounded-lg shadow-lg animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="px-4 py-3 mb-4 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-5">

          {/* Email Field */}
          <div className="relative group">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400 transition-all duration-300 group-hover:bg-white shadow-md"
            />
            <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Email *
            </label>

            {errors.email && (
              <p className="flex items-center mt-1 text-sm text-red-300">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative group">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              className="w-full px-4 py-3 !text-black placeholder-transparent rounded-lg peer bg-white/90 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent focus:border-yellow-400 transition-all duration-300 group-hover:bg-white shadow-md pr-12"
            />

            <label className="absolute left-4 -top-2.5 text-gray-600 text-sm bg-white/90 px-1 rounded transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-yellow-500">
              Password *
            </label>

            {/* Enhanced Eye Icon */}
            <div
              className="absolute text-gray-600 transition-all duration-300 cursor-pointer right-4 top-3 hover:text-yellow-500 hover:scale-110"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>

            {errors.password && (
              <p className="flex items-center mt-1 text-sm text-red-300">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 font-bold text-black transition-all duration-500 rounded-lg shadow-md cursor-pointer 
            ${isLoading 
              ? 'bg-yellow-600 scale-95' 
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 hover:scale-105 hover:shadow-xl'} 
            disabled:opacity-80 disabled:cursor-not-allowed relative overflow-hidden group`}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-1000 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  {/* Beautiful Dual Spinner */}
                  <div className="relative w-6 h-6">
                    <div className="absolute w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute w-6 h-6 border-2 border-transparent rounded-full border-t-white animate-ping"></div>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="text-lg transition-transform duration-300 group-hover:scale-110">🚀</span>
                  Login to Dashboard
                </>
              )}
            </div>
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-200 transition-all duration-300 hover:text-yellow-300 hover:underline hover:tracking-wider"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Login;