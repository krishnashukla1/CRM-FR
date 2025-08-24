// import axios from "axios";
// import { Outlet } from "react-router-dom";
// import { useState } from "react";

// const SuperLeavesLayout = () => {
//   const [leaveForm, setLeaveForm] = useState({
//     from: null,
//     to: null,
//     leaveType: "Paid Leave",
//     reason: "",
//     document: null
//   });

//   const submitLeave = async () => {
//     try {
//       const employeeId = localStorage.getItem("employeeId"); // adjust if stored differently
//       if (!employeeId) {
//         alert("Employee ID is missing. Please log in again.");
//         return;
//       }

//       const formatDate = (date) =>
//         date ? date.toISOString().split("T")[0] : "";

//    const formData = new FormData();
// formData.append('employeeId', employeeId);
// formData.append('from', fromDate);
// formData.append('to', toDate);
// formData.append('leaveType', leaveType);
// formData.append('reason', reason);
// if (documentFile) {
//   formData.append('document', documentFile);
// }

// await axios.post(
//   `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/leaves`,
//   formData,
//   {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//       'Content-Type': 'multipart/form-data',
//     },
//   }
// );


//       console.log("Leave submitted:", res.data);
//       alert("Leave request submitted successfully!");
//     } catch (err) {
//       console.error("Error submitting leave:", err);
//       alert("Failed to submit leave.");
//     }
//   };

//   return <Outlet context={{ leaveForm, setLeaveForm, submitLeave }} />;
// };

// export default SuperLeavesLayout;

//========

import axios from "axios";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const SuperLeavesLayout = () => {
  const [leaveForm, setLeaveForm] = useState({
    from: null,
    to: null,
    leaveType: "Paid Leave",
    reason: "",
    document: null
  });

  const submitLeave = async () => {
    try {
      // Try to get employee ID from both possible locations
      const employee = JSON.parse(localStorage.getItem('employee')) || {};
      const employeeId = employee._id || localStorage.getItem("employeeId");
      
      if (!employeeId) {
        alert("Employee ID is missing. Please log in again.");
        return;
      }

      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';

      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('from', formatDate(leaveForm.from));
      formData.append('to', formatDate(leaveForm.to));
      formData.append('leaveType', leaveForm.leaveType);
      formData.append('reason', leaveForm.reason);
      
      if (leaveForm.document) {
        formData.append('document', leaveForm.document);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/leaves`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Leave submitted:", res.data);
      alert("Leave request submitted successfully!");
      // Optionally reset the form after successful submission
      setLeaveForm({
        from: null,
        to: null,
        leaveType: "Paid Leave",
        reason: "",
        document: null
      });
    } catch (err) {
      console.error("Error submitting leave:", err);
      alert(err.response?.data?.message || "Failed to submit leave.");
    }
  };

  return <Outlet context={{ leaveForm, setLeaveForm, submitLeave }} />;
};

export default SuperLeavesLayout;
