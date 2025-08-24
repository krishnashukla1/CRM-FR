
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











import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    // if (token && role) {
    //   if (role === 'admin') navigate('/dashboard');
    //   else if (role === 'user') navigate('/user-dashboard');
    // }

    if (token && role) {
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'supervisor') {
        navigate('/supervisor-dashboard');
      } else if (role === 'user') {
        navigate('/user-dashboard');
      }
    }


  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Password is required';

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/login`, form);
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
  localStorage.setItem('token', token);
  localStorage.setItem('userId', user._id);
  localStorage.setItem('role', user.role);
  localStorage.setItem('name', user.name);
  localStorage.setItem('photo', user.photo || '');

  // Save full user info (REAL data from backend)
  const fullUser = {
    ...user,
    employeeId: user.employeeId || user._id
  };
  localStorage.setItem('user', JSON.stringify(fullUser));
  localStorage.setItem('employee', JSON.stringify(fullUser));

  // Only set loginTime if not already set for today
  const storedLoginTime = localStorage.getItem('loginTime');
  const today = new Date().toISOString().split('T')[0];
  const isSameDay = storedLoginTime && storedLoginTime.startsWith(today);

  if (!isSameDay) {
    localStorage.setItem('loginTime', new Date().toISOString());
  }

  sessionStorage.setItem('sessionStart', new Date().toISOString());

  setSuccessMessage('✅ Login successful! Redirecting...');
  setServerError('');

  setTimeout(() => {
    if (user.role === 'admin') {
      navigate('/dashboard');
    } else if (user.role === 'supervisor') {
      navigate('/supervisor-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  }, 1800);
}



    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setServerError(msg);
      setSuccessMessage('');
    }
  };











  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#7e57c2] to-[#1a237e] px-4">
      <div className="w-full max-w-xl bg-white/20 backdrop-blur-lg text-white rounded-2xl shadow-2xl p-10 border border-white/30">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center mb-4">
            {/* <img
              // src="/farebuzzer-logo.jpg"
              src="/favicon2.png"
              // src="/farebuzzerIcon-r.png"
              alt="Fare Buzzer Logo"
              className="w-34 h-34 object-contain mb-2"
              //  className="w-62 h-42 object-contain mb-2"
            /> */}
            <img
              src="/d1.png"
              // src="/farebuzzerIcon-r.png"
              alt="Fare Buzzer Logo"
              className="mx-auto w-74 h-24 object-contain mb-2"
            />
            <h1 className="text-3xl font-bold text-white drop-shadow-md text-center">
              FareBuzzer Travel Pvt Ltd
            </h1>
          </div>

          <p className="mt-2 text-gray-200 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="text-yellow-300 font-semibold hover:underline inline-flex items-center"
            >
              Sign up here <span className="ml-1">→</span>
            </Link>
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">🔐 Login</h2>

        {serverError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm font-medium">
            {serverError}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md mb-4 text-sm font-medium transition-opacity duration-300 ease-in">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="mb-4">
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email*"
              className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.email && (
              <p className="text-red-300 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password*"
              className="w-full px-4 py-3 rounded-lg bg-white/70 !text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {errors.password && (
              <p className="text-red-300 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition duration-200 shadow-md"
          >
            🚀 Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;




