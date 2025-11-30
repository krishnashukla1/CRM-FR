import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateChargebackRefundForm from './UpdateChargebackRefundForm';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CallLogList = ({ employeeId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      // First, get employee info to display name
      const employeeResponse = await axios.get(`${API_URL}/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (employeeResponse.data) {
        setEmployeeInfo(employeeResponse.data.data || employeeResponse.data);
      }

      // Get call logs for this employee
      const response = await axios.get(`${API_URL}/call-logs/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Call logs API Response:', response.data); // Debug log

      // Handle the response - it should be a direct array
      let logsData = Array.isArray(response.data) ? response.data : [];

      // If response has data property that's an array
      if (response.data && Array.isArray(response.data.data)) {
        logsData = response.data.data;
      }

      setLogs(logsData);
    } catch (err) {
      console.error('Fetch error details:', err);
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch call logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      console.log('Fetching logs for employee:', employeeId);
      fetchLogs();
    }
  }, [employeeId]);

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '$0.00';
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleUpdateSuccess = () => {
    setSelectedLogId(null);
    fetchLogs();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <span className="ml-3">Loading call logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Call Logs</h2>
          {employeeInfo && (
            <p className="mt-1 text-gray-600">
              for {employeeInfo.name} ({employeeInfo.email})
            </p>
          )}
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <strong>Error: </strong> {error}
          </div>
        </div>
      )}

      {logs.length === 0 && !loading ? (
        <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No call logs found</h3>
          <p className="text-gray-500">This employee doesn't have any call logs yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {logs.map((log) => {
            const profit = log.profitAmount || 0;
            const chargeback = log.chargebackAmount || 0;
            const refund = log.refundAmount || 0;
            const deduction = Math.max(chargeback, refund);
            const netProfit = profit - deduction;

            return (
              <div key={log._id} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Customer Information</h3>
                    <p><strong>Name:</strong> {log.customerName}</p>
                    <p><strong>Email:</strong> {log.customerEmail}</p>
                    <p><strong>Phone:</strong> {log.customerPhone}</p>
                    <p><strong>Language:</strong> {log.language}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">Call Details</h3>
                    <p><strong>Direction:</strong> <span className="capitalize">{log.callDirection?.toLowerCase()}</span></p>
                    <p><strong>Type:</strong> {log.typeOfCall}</p>
                    <p><strong>Reason:</strong> {log.reasonForCall}</p>
                    <p><strong>Date:</strong> {formatDate(log.shiftDate)}</p>
                    <p><strong>Logged:</strong> {formatDate(log.createdAt)}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t">
                  <p className={`text-lg font-semibold ${log.wasSaleConverted === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                    <strong>Sale Status:</strong> {log.wasSaleConverted}
                  </p>

                  {log.wasSaleConverted === 'Yes' && (
                    <div className="p-4 mt-3 rounded-lg bg-gray-50">
                      <h4 className="mb-2 font-medium text-gray-800">Sales Details</h4>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <p className="text-sm text-gray-600">Profit</p>
                          <p className="font-medium">{formatCurrency(profit)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Chargeback</p>
                          <p className="font-medium text-red-600">{formatCurrency(chargeback)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Refund</p>
                          <p className="font-medium text-red-600">{formatCurrency(refund)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Profit</p>
                          <p className={`font-medium ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(netProfit)}
                          </p>
                        </div>
                      </div>

                      {log.saleConvertedThrough && (
                        <p className="mt-2">
                          <strong>Converted through:</strong> {log.saleConvertedThrough}
                        </p>
                      )}

                      <button
                        onClick={() => setSelectedLogId(selectedLogId === log._id ? null : log._id)}
                        className="px-4 py-2 mt-4 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        {selectedLogId === log._id ? 'Cancel Update' : 'Update Chargeback/Refund'}
                      </button>

                      {selectedLogId === log._id && (
                        <div className="mt-4">
                          <UpdateChargebackRefundForm
                            callLogId={log._id}
                            onSuccess={handleUpdateSuccess}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {log.wasSaleConverted === 'No' && log.reasonForNoSale && (
                    <div className="mt-3">
                      <p><strong>Reason for no sale:</strong> {log.reasonForNoSale}</p>
                    </div>
                  )}
                </div>

                {log.callDescription && (
                  <div className="pt-4 mt-4 border-t">
                    <p><strong>Description:</strong> {log.callDescription}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CallLogList;