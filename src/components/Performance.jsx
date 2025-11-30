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
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
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
