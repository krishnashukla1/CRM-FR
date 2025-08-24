import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const UpdateChargebackRefundForm = ({ callLogId, onSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    chargebackAmount: '',
    refundAmount: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      // auto-reset opposite field so only one is active
      ...(name === 'chargebackAmount' && value ? { refundAmount: '' } : {}),
      ...(name === 'refundAmount' && value ? { chargebackAmount: '' } : {}),
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    if (!form.chargebackAmount && !form.refundAmount) {
      errors.general = 'At least one of chargeback or refund amount must be provided';
      isValid = false;
    }

    if (form.chargebackAmount && (isNaN(form.chargebackAmount) || form.chargebackAmount < 0)) {
      errors.chargebackAmount = 'Invalid chargeback amount';
      isValid = false;
    }

    if (form.refundAmount && (isNaN(form.refundAmount) || form.refundAmount < 0)) {
      errors.refundAmount = 'Invalid refund amount';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setFieldErrors({});

    if (!validateFields()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('❌ Not authenticated. Please login again.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // build payload dynamically
      const payload = {};
      if (form.chargebackAmount) payload.chargebackAmount = Number(form.chargebackAmount);
      if (form.refundAmount) payload.refundAmount = Number(form.refundAmount);

      const response = await axios.patch(
        `${API_URL}/call-logs/${callLogId}/chargeback-refund`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMessage('✅ Chargeback/Refund updated successfully!');
        setForm({ chargebackAmount: '', refundAmount: '' });
        if (onSuccess) onSuccess();
      } else {
        setError('❌ Failed to update chargeback/refund.');
      }
    } catch (err) {
      console.error('Update Chargeback/Refund Error:', err);
      setError(err.response?.data?.message || '❌ Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) =>
    fieldErrors[fieldName] ? (
      <span className="text-red-500 text-xs">{fieldErrors[fieldName]}</span>
    ) : null;

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
      {fieldErrors.general && (
        <div className="bg-yellow-100 text-yellow-700 p-2 rounded mb-3">
          {fieldErrors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Chargeback Amount ($)</label>
          <input
            type="number"
            name="chargebackAmount"
            value={form.chargebackAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full border px-3 py-2 rounded ${fieldErrors.chargebackAmount ? 'border-red-500' : ''}`}
            placeholder="Enter chargeback amount"
          />
          {renderFieldError('chargebackAmount')}
        </div>

        <div>
          <label className="block font-medium">Refund Amount ($)</label>
          <input
            type="number"
            name="refundAmount"
            value={form.refundAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full border px-3 py-2 rounded ${fieldErrors.refundAmount ? 'border-red-500' : ''}`}
            placeholder="Enter refund amount"
          />
          {renderFieldError('refundAmount')}
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 transition !text-white font-semibold py-2 px-4 rounded ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Chargeback/Refund'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateChargebackRefundForm;
