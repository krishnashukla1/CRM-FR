import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';

const SalaryDetails = () => {
  const {
    salaryInfo = null,
    salaryError = '',
    presentDays = 0,
    perDaySalary = 0,
    calculatedSalary = 0,
    absentDays = 0,
  } = useOutletContext();

  return (
    <PageWithCloseButton title="💰 Salary Details">
      <div className="space-y-6">
        {salaryError && (
          <div className="px-4 py-2 text-sm text-center text-red-700 bg-red-100 border border-red-400 rounded shadow">
            {salaryError}
          </div>
        )}

        {salaryInfo ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee Info */}
            <div className="p-6 bg-white border shadow rounded-2xl">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">👤 Employee Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Name:</span>
                  <span className="font-medium text-gray-800">{salaryInfo.name}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Month:</span>
                  <span className="font-medium text-gray-800">{salaryInfo.month}</span>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="p-6 bg-white border shadow rounded-2xl">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">📆 Attendance Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Working Days:</span>
                  <span className="font-medium text-gray-800">{salaryInfo.totalWorkingDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Present Days:</span>
                  <span className="font-semibold text-green-700">{salaryInfo.presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Paid Leaves:</span>
                  <span className="font-semibold text-yellow-700">{salaryInfo.paidLeaveDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Unpaid Leaves:</span>
                  <span className="font-semibold text-red-700">{salaryInfo.unpaidLeaveDays}</span>
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="p-6 bg-white border shadow rounded-2xl md:col-span-2">
              <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-800 border-b">💵 Salary Breakdown</h3>
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div className="flex flex-col p-4 border bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Per Day Salary</span>
                  <span className="text-lg font-bold text-gray-800">
                    ${parseFloat(salaryInfo.perDaySalary).toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col p-4 border bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Total Salary</span>
                  <span className="text-lg font-bold text-gray-800">${salaryInfo.totalSalary}</span>
                </div>
                <div className="flex flex-col p-4 bg-indigo-100 border border-indigo-300 rounded-xl">
                  <span className="font-semibold text-indigo-600">Final Salary</span>
                  <span className="text-xl font-bold text-indigo-800">${salaryInfo.calculatedSalary}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Fetching salary details...</p>
          </div>
        )}
      </div>
    </PageWithCloseButton>
  );
};

export default SalaryDetails;

