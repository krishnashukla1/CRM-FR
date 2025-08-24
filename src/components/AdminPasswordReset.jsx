import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_BASE_URL;

const AdminPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user?.email === 'fbadmin@gmail.com') {
      setLoggedInEmail(user.email);
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return setMessage('❌ Not logged in');

    try {
      const response = await fetch(`${API_URL}/auth/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setStatus('success');
      setMessage(data.message);
      setEmail('');
      setNewPassword('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-100 via-white to-blue-50 shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        🔐 Admin Password Reset
      </h2>

      {!allowed ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md font-medium">
          ❌ Access Denied: Only <strong>fbadmin@gmail.com</strong> can reset passwords.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              User Email to Change
            </label>
            <input
              type="email"
              className="w-full border border-blue-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
              placeholder="Enter user/admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-blue-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 !text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            🔁 Change Password
          </button>

          {message && (
            <div
              className={`mt-4 p-3 rounded text-sm font-medium ${
                status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AdminPasswordReset;
