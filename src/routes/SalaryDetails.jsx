// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const SalaryDetails = ({ 
//   salaryInfo, 
//   salaryError, 
//   presentDays,
//   perDaySalary,
//   calculatedSalary,
//   absentDays
// }) => {
//   return (
//     <PageWithCloseButton title="💰 Salary Details">
//       <div className="space-y-4">
//         {salaryError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
//             {salaryError}
//           </div>
//         )}

//         {salaryInfo ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-medium text-gray-700 mb-3">Employee Information</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Name:</span>
//                   <span className="font-medium">{salaryInfo.name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Month:</span>
//                   <span className="font-medium">{salaryInfo.month}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-medium text-gray-700 mb-3">Attendance Summary</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Working Days:</span>
//                   <span className="font-medium">{salaryInfo.totalWorkingDays}</span>
//                 </div>
//                 <div className="flex justify-between text-green-600">
//                   <span>Present Days:</span>
//                   <span className="font-medium">{salaryInfo.presentDays}</span>
//                 </div>
//                 <div className="flex justify-between text-yellow-600">
//                   <span>Paid Leave Days:</span>
//                   <span className="font-medium">{salaryInfo.paidLeaveDays}</span>
//                 </div>
//                 <div className="flex justify-between text-red-600">
//                   <span>Unpaid Leave Days:</span>
//                   <span className="font-medium">{salaryInfo.unpaidLeaveDays}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
//               <h3 className="font-medium text-gray-700 mb-3">Salary Breakdown</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="flex justify-between items-center border-b pb-2">
//                   <span className="text-gray-600">Per Day Salary:</span>
//                   <span className="font-medium">${parseFloat(salaryInfo.perDaySalary).toFixed(1)}</span>
//                 </div>
//                 <div className="flex justify-between items-center border-b pb-2">
//                   <span className="text-gray-600">Total Salary:</span>
//                   <span className="font-medium">${salaryInfo.totalSalary}</span>
//                 </div>
//                 <div className="flex justify-between items-center bg-indigo-50 p-2 rounded">
//                   <span className="text-indigo-700 font-medium">Final Salary:</span>
//                   <span className="text-indigo-700 font-bold">${salaryInfo.calculatedSalary}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
//             <p className="text-gray-500 mt-4">Loading salary details...</p>
//           </div>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default SalaryDetails;
//=========================================

// import React from 'react';
// import PageWithCloseButton from './PageWithCloseButton';

// const SalaryDetails = ({
//   salaryInfo = null,
//   salaryError = '',
//   presentDays = 0,
//   perDaySalary = 0,
//   calculatedSalary = 0,
//   absentDays = 0
// }) => {
//   return (
//     <PageWithCloseButton title="💰 Salary Details">
//       <div className="space-y-6">
//         {salaryError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center shadow">
//             {salaryError}
//           </div>
//         )}

//         {salaryInfo ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Employee Info */}
//             <div className="bg-white border rounded-2xl shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">👤 Employee Info</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Name:</span>
//                   <span className="font-medium text-gray-800">{salaryInfo.name}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Month:</span>
//                   <span className="font-medium text-gray-800">{salaryInfo.month}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Attendance Summary */}
//             <div className="bg-white border rounded-2xl shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">📆 Attendance Summary</h3>
//               <div className="space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Working Days:</span>
//                   <span className="font-medium text-gray-800">{salaryInfo.totalWorkingDays}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-green-600">Present Days:</span>
//                   <span className="font-semibold text-green-700">{salaryInfo.presentDays}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-yellow-600">Paid Leaves:</span>
//                   <span className="font-semibold text-yellow-700">{salaryInfo.paidLeaveDays}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-red-600">Unpaid Leaves:</span>
//                   <span className="font-semibold text-red-700">{salaryInfo.unpaidLeaveDays}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Salary Breakdown */}
//             <div className="bg-white border rounded-2xl shadow p-6 md:col-span-2">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">💵 Salary Breakdown</h3>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
//                 <div className="flex flex-col bg-gray-50 rounded-xl p-4 border">
//                   <span className="text-gray-500">Per Day Salary</span>
//                   <span className="text-lg font-bold text-gray-800">${parseFloat(salaryInfo.perDaySalary).toFixed(1)}</span>
//                 </div>
//                 <div className="flex flex-col bg-gray-50 rounded-xl p-4 border">
//                   <span className="text-gray-500">Total Salary</span>
//                   <span className="text-lg font-bold text-gray-800">${salaryInfo.totalSalary}</span>
//                 </div>
//                 <div className="flex flex-col bg-indigo-100 rounded-xl p-4 border border-indigo-300">
//                   <span className="text-indigo-600 font-semibold">Final Salary</span>
//                   <span className="text-xl font-bold text-indigo-800">${salaryInfo.calculatedSalary}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
//             <p className="text-gray-500 mt-4">Fetching salary details...</p>
//           </div>
//         )}
//       </div>
//     </PageWithCloseButton>
//   );
// };

// export default SalaryDetails;

//======================
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center shadow">
            {salaryError}
          </div>
        )}

        {salaryInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Info */}
            <div className="bg-white border rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">👤 Employee Info</h3>
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
            <div className="bg-white border rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">📆 Attendance Summary</h3>
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
            <div className="bg-white border rounded-2xl shadow p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">💵 Salary Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col bg-gray-50 rounded-xl p-4 border">
                  <span className="text-gray-500">Per Day Salary</span>
                  <span className="text-lg font-bold text-gray-800">
                    ${parseFloat(salaryInfo.perDaySalary).toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-col bg-gray-50 rounded-xl p-4 border">
                  <span className="text-gray-500">Total Salary</span>
                  <span className="text-lg font-bold text-gray-800">${salaryInfo.totalSalary}</span>
                </div>
                <div className="flex flex-col bg-indigo-100 rounded-xl p-4 border border-indigo-300">
                  <span className="text-indigo-600 font-semibold">Final Salary</span>
                  <span className="text-xl font-bold text-indigo-800">${salaryInfo.calculatedSalary}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Fetching salary details...</p>
          </div>
        )}
      </div>
    </PageWithCloseButton>
  );
};

export default SalaryDetails;

