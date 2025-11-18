// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Performance = () => {
//   const [employeeId, setEmployeeId] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [month, setMonth] = useState("Aug");
//   const [target, setTarget] = useState("");
//   const [sales, setSales] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch employees on component mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_URL}/employees`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // Updated this line to match the working Tasks component
//         const employeeData = res.data.data || res.data; // Try both structures
//         if (Array.isArray(employeeData)) {
//           setEmployees(employeeData);
//         } else {
//           throw new Error("Invalid employee data received.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch employees:", error);
//         setMessage("❌ Failed to load employee list.");
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       await axios.post(
//         `${API_URL}/performance`,
//         {
//           employeeId,
//           month,
//           target: Number(target),
//           sales: Number(sales),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage("✅ Performance data saved successfully!");
//       setTarget("");
//       setSales("");
//     } catch (error) {
//       console.error("Error saving performance:", error.response?.data || error.message);
//       setMessage("❌ Failed to save performance data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//   <div className="max-w-xl p-6 mx-auto mt-10 bg-white border border-gray-200 shadow-2xl rounded-2xl">
//       <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">
//         📈 Add / Update Performance
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Employee Dropdown - Fixed with proper styling */}
//         <div className="relative">
//           <select
//             value={employeeId}
//             onChange={(e) => setEmployeeId(e.target.value)}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             <option value="">👤 Select Employee</option>
//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>
//           <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
//             <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//               <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
//             </svg>
//           </div>
//         </div>

//         {/* Month Selector */}
//         <select
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>

//         {/* Target Input */}
//         <input
//           type="number"
//           value={target}
//           onChange={(e) => setTarget(e.target.value)}
//           placeholder="🎯 Target ($)"
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         {/* Sales Input */}
//         <input
//           type="number"
//           value={sales}
//           onChange={(e) => setSales(e.target.value)}
//           placeholder="💰 Sales ($)"
//           required
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-2 font-semibold text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
//         >
//           {loading ? "Saving..." : "🚀 Submit"}
//         </button>
//       </form>

//       {message && (
//         <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Performance;



//===============================================================

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Performance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);
  const [month, setMonth] = useState("Aug");
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Updated this line to match the working Tasks component
        const employeeData = res.data.data || res.data; // Try both structures
        if (Array.isArray(employeeData)) {
          setEmployees(employeeData);
        } else {
          throw new Error("Invalid employee data received.");
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setMessage("❌ Failed to load employee list.");
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/performance`,
        {
          employeeId,
          month,
          target: Number(target),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Target set successfully!");
      setTarget("");
    } catch (error) {
      console.error("Error saving target:", error.response?.data || error.message);
      setMessage("❌ Failed to set target.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-10 bg-white border border-gray-200 shadow-2xl rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">
        🎯 Set Employee Target
      </h2>

      {/* <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="relative">
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">👤 Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        


        <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
    <option key={m} value={m}>{m}</option>
  ))}
</select>

<input
  type="number"
  value={target}
  onChange={(e) => setTarget(e.target.value)}
  placeholder="🎯 Target ($)"
  required
  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

<button
  type="submit"
  disabled={loading}
  className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 !text-white py-2 rounded-lg font-semibold transition duration-200"
>
  {loading ? "Saving..." : "🚀 Set Target"}
</button>

      </form> */}


      <form onSubmit={handleSubmit} className="space-y-5">

  <div>
    <select
      value={employeeId}
      onChange={(e) => setEmployeeId(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer"
    >
      <option value="">👤 Select Employee</option>
      {employees.map((emp) => (
        <option key={emp._id} value={emp._id}>
          {emp.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    <select
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer"
    >
      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>
  </div>

  <div>
    <input
      type="number"
      value={target}
      onChange={(e) => setTarget(e.target.value)}
      placeholder="🎯 Target ($)"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
    />
  </div>

  <button
    type="submit"
    className="w-full py-3 !text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
  >
    🚀 Set Target
  </button>

</form>


      {message && (
        <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Performance;

//=======================


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// const Performance = () => {
//   const [employeeId, setEmployeeId] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const [month, setMonth] = useState("Aug");
//   const [target, setTarget] = useState("");
//   const [chargeback, setChargeback] = useState(1000); // default ₹1000
//   const [refund, setRefund] = useState(""); // manual
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(`${API_URL}/employees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const employeeData = res.data.data || res.data;
//         if (Array.isArray(employeeData)) {
//           setEmployees(employeeData);
//         } else {
//           throw new Error("Invalid employee data received.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch employees:", error);
//         setMessage("❌ Failed to load employee list.");
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       // Calculate adjusted sales and target changes
//       const totalAdjustment = Number(chargeback || 0) + Number(refund || 0);

//       await axios.post(
//         `${API_URL}/performance`,
//         {
//           employeeId,
//           month,
//           target: Number(target) + totalAdjustment, // add adjustment to target
//           chargeback: Number(chargeback || 0),
//           refund: Number(refund || 0),
//           adjustSales: -totalAdjustment, // subtract from sales
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setMessage("✅ Target & adjustments saved successfully!");
//       setTarget("");
//       setRefund("");
//     } catch (error) {
//       console.error("Error saving target:", error.response?.data || error.message);
//       setMessage("❌ Failed to save data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl p-6 mx-auto mt-10 bg-white border border-gray-200 shadow-2xl rounded-2xl">
//       <h2 className="mb-6 text-2xl font-bold text-center text-blue-800">
//         🎯 Set Employee Target & Adjustments
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Select Employee */}
//         <select
//           value={employeeId}
//           onChange={(e) => setEmployeeId(e.target.value)}
//           required
//           className="w-full px-4 py-2 !mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">👤 Select Employee</option>
//           {employees.map((emp) => (
//             <option key={emp._id} value={emp._id}>
//               {emp.name}
//             </option>
//           ))}
//         </select>

//         {/* Month */}
//         <select
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="w-full px-4 py-2 !mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//         >
//           {[
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//           ].map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>

//         {/* Target */}
//         <input
//           type="number"
//           value={target}
//           onChange={(e) => setTarget(e.target.value)}
//           placeholder="🎯 Target ($)"
//           required
//           className="w-full px-4 py-2 !mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
//         />

//         {/* Chargeback ₹1000 */}
//         <input
//           type="number"
//           value={chargeback}
//           onChange={(e) => setChargeback(e.target.value)}
//           placeholder="💸 Chargeback ($)"
//           className="w-full px-4 py-2 !mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
//         />

//         {/* Refund */}
//         <input
//           type="number"
//           value={refund}
//           onChange={(e) => setRefund(e.target.value)}
//           placeholder="↩ Refund ($)"
//           className="w-full px-4 py-2 !mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 !text-white py-2 rounded-lg font-semibold transition duration-200"
//         >
//           {loading ? "Saving..." : "🚀 Save Changes"}
//         </button>
//       </form>

//       {message && (
//         <p
//           className={`mt-4 text-center font-medium ${
//             message.includes("✅") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Performance;
