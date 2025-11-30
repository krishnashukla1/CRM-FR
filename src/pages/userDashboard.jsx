
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import API from "../api";
import Modal from "react-modal";
import CallInquiryForm from "./CallInquiryForm";
import Clock from "../components/Timer";
import TopPerformance from "../routes/TopPerformance";
import Attendance from "../routes/Attendance";
import BreakTime from "../routes/BreakTime";
import Leaves from "../routes/Leaves";
import RequestLeaves from "../routes/RequestLeave";
import SalaryDetails from "../routes/SalaryDetails";
import WeeklyOff from "../routes/WeeklyOff";
import Sidebar from "../components2/Sidebar";
import useBreakTimer from "../routes/useBreakTimer";
import EmployeeTasks from "../routes/EmployeeTasks";

Modal.setAppElement("#root");

const UserDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [topPerformers, setTopPerformers] = useState([]);
  const breakTimer = useBreakTimer(employee);
  const TOTAL_ANNUAL_LEAVES = 20;
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [salaryError, setSalaryError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [leaveForm, setLeaveForm] = useState({
    from: "",
    to: "",
    reason: "",
    document: null,
    leaveType: "Paid Leave",
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const TOTAL_WORKING_DAYS = 30;
  const presentDays = salaryInfo?.presentDays || 0;
  const perDaySalary = Number(salaryInfo?.perDaySalary || 0);
  const calculatedSalary = (presentDays * perDaySalary).toFixed(1);
  const absentDays = TOTAL_WORKING_DAYS - presentDays;

  const fetchEmployeeIdByUserId = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        throw new Error("User not authenticated");
      }
      const res = await API.get(`/employees/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.employee?._id) {
        localStorage.setItem("employeeId", res.data.employee._id);
        setEmployee(res.data.employee);
        return res.data.employee._id;
      } else {
        throw new Error("Employee not found");
      }
    } catch (err) {
      console.error("Error fetching employee ID:", err);
      setError("❌ Failed to fetch employee data. Please login again.");
      setShowModal(true);
      setTimeout(() => navigate("/login"), 2000);
      return null;
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleSessionExpired();
      return;
    }

    const fetchInitialData = async () => {
      try {
        await fetchUserData();
        await fetchTopPerformers();
      } catch (error) {
        console.error("Initial data fetch failed:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          handleSessionExpired();
        } else {
          setError("❌ Failed to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchEmployeeIdByUserId]);

  useEffect(() => {
    if (employee?._id && !localStorage.getItem("attendanceChecked")) {
      checkAttendance();
      markLogin();
      fetchTodayStats();
      fetchLeaves();
      localStorage.setItem("attendanceChecked", "true");
    }
  }, [employee]);

  const handleSessionExpired = () => {
    setTimeout(() => {
      setError("❌ Session expired. Please login again.");
      localStorage.clear();
      navigate("/login");
    }, 300);
  };

  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      handleSessionExpired();
      return false;
    }
    return true;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (token) {
        await API.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout API error:", err);
      setError("❌ Failed to logout cleanly. Proceeding anyway.");
    } finally {
      [
        "token",
        "user",
        "employee",
        "attendanceChecked",
        "employeeId",
        "userId",
      ].forEach((key) => localStorage.removeItem(key));
      setEmployee(null);
      setUser(null);
      setAttendance([]);
      setLeaves([]);
      setPerformance(null);
      setRemainingLeaves(0);
      setTopPerformers([]);
      setSalaryInfo(null);
      setSalaryError("");
      setIsLoggingOut(false);
      navigate("/login");
    }
  };

  const checkAttendance = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/attendance/today", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.marked) {
        setModalMessage("Please mark your attendance for today");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Attendance check failed:", err);
      setModalMessage(
        err.response?.status === 401
          ? "Session expired or unauthorized. Please log in again."
          : "Unable to verify attendance. Please try again."
      );
      setShowModal(true);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  useEffect(() => {
    if (!employee?._id) return;

    const fetchSalary = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated");
        }
        const month = new Date().toISOString().slice(0, 7);
        const res = await API.get(
          `/employees/salary/${employee._id}/${month}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSalaryInfo(res.data);
      } catch (err) {
        console.error("Error fetching salary:", err);
        setSalaryError("❌ Failed to load salary details.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleSessionExpired();
        }
      }
    };

    fetchSalary();
  }, [employee]);

  const fetchUserData = async () => {
    if (!verifyToken()) return;

    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const profileRes = await API.get("/user/profile", headers);
      const userData = profileRes.data;
      setUser(userData);

      const empId = await fetchEmployeeIdByUserId();
      if (!empId) return;

      const [attRes, leaveRes, perfRes] = await Promise.all([
        API.get(`/attendance?employeeId=${empId}&perPage=50`, headers),
        API.get(`/leaves?employeeId=${empId}`, headers),
        API.get(`/performance/employee/${empId}`, headers),
      ]);

      setAttendance(attRes.data.data || []);
      setLeaves(leaveRes.data.data || []);
      setPerformance(perfRes.data.summary);

      const approvedLeaves = leaveRes.data.data.filter(
        (l) => l.status === "Approved" || l.status === "Paid Leave"
      );

      const usedLeaveDays = approvedLeaves.reduce((total, leave) => {
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        if (from.getDay() === 0 || to.getDay() === 0) return total;
        return total + Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
      }, 0);

      setRemainingLeaves(TOTAL_ANNUAL_LEAVES - usedLeaveDays);
    } catch (err) {
      console.error("User data fetch failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      } else {
        setError("❌ Failed to load your data. Please refresh.");
      }
    }
  };

  const fetchTopPerformers = async () => {
    if (!verifyToken()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/performance/top", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopPerformers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch top performers:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  const fetchLeaves = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/leaves?employeeId=${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
      setLeaves([]);
    }
  };

  const fetchTodayStats = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem("token");
      await API.get(`/hours/today/${employee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Stats fetch failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  const markLogin = async () => {
    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/hours/login",
        { employeeId: employee._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Login time tracking failed:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
      }
    }
  };

  const submitLeave = async () => {
    if (
      !leaveForm.from ||
      !leaveForm.to ||
      !leaveForm.reason ||
      !leaveForm.leaveType
    ) {
      setError(
        "❗ Please select all required fields: From date, To date, Leave Type, and Reason."
      );
      return;
    }

    if (!verifyToken() || !employee?._id) return;

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("employeeId", employee._id);
      formData.append("from", leaveForm.from);
      formData.append("to", leaveForm.to);
      formData.append("reason", leaveForm.reason);
      formData.append("leaveType", leaveForm.leaveType || "Paid Leave");

      if (leaveForm.document) {
        formData.append("document", leaveForm.document);
      }

      const res = await API.post("/leaves", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ success case
      setError("");
      alert("✅ Leave request submitted successfully.");
      setLeaveForm({
        from: "",
        to: "",
        reason: "",
        document: null,
        leaveType: "Paid Leave",
      });
      fetchUserData();

      return res.data; // important: return backend JSON
    } catch (err) {
      console.error("Leave submission failed:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        handleSessionExpired();
        return;
      }

      // ✅ show backend's own message
      const backendMsg = err.response?.data?.message;
      if (backendMsg) {
        setError(backendMsg); // "More than 5 days please contact HR." or "Maximum 4 leave requests per year. Please contact HR."
      } else {
        setError("❌ Failed to submit leave. Try again.");
      }

      return err.response?.data; // return so caller can also check
    }
  };

  const markAttendance = async () => {
    if (!verifyToken() || !employee?._id) return false;

    try {
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istNow = new Date(now.getTime() + istOffset);
      const istDate = istNow.toISOString().slice(0, 10);

      const token = localStorage.getItem("token");
      const response = await API.post(
        "/attendance/mark",
        { employeeId: employee._id, date: istDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setModalMessage(response?.data?.message || "Attendance marked");
      setShowModal(true);
      return true;
    } catch (err) {
      console.error("Attendance marking failed:", err);
      setModalMessage("Failed to mark attendance. Please try again.");
      setShowModal(true);
      return false;
    }
  };

  const handleProceed = async () => {
    if (!agree) {
      setModalMessage("You must agree to mark attendance");
      setShowModal(true);
      return;
    }

    const success = await markAttendance();
    if (success) {
      setTimeout(() => {
        setShowModal(false);
        fetchUserData();
      }, 1500);
    }
  };

  const { approvedCount, rejectedCount, paidCount, sundayCount } =
    useMemo(() => {
      const result = {
        approvedCount: 0,
        rejectedCount: 0,
        paidCount: 0,
        sundayCount: 0,
      };
      if (!Array.isArray(leaves)) return result;

      leaves.forEach((l) => {
        if (!l || !l.from || !l.to) return;
        const fromDay = new Date(l.from).getDay();
        const toDay = new Date(l.to).getDay();
        const isSunday = fromDay === 0 && toDay === 0;
        if (isSunday) result.sundayCount++;
        else if (l.status === "Approved") result.approvedCount++;
        else if (l.status === "Rejected") result.rejectedCount++;
        else if (l.status === "Paid Leave") result.paidCount++;
      });

      return result;
    }, [leaves]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${
        showModal ? "blur-lg pointer-events-none select-none" : ""
      }`}
    >
      <div className="fixed z-50 md:hidden top-4 left-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#72819a] text-white p-2 rounded-lg shadow-lg"
        >
          {sidebarOpen ? "❌" : "☰"}
        </button>
      </div>

      <div className="flex h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-blue-100">
        {/* Sidebar with only vertical scroll */}
        <div className="overflow-x-hidden overflow-y-auto border-r border-gray-200 w-74">
          <Sidebar
            user={user}
            employee={employee}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogout={handleLogout}
          />
        </div>

        {/* Main content with only vertical scroll */}
        <div className="flex-1 p-4 space-y-6 overflow-x-hidden overflow-y-auto md:p-6">
          {error && (
            <div className="p-3 mb-4 text-center text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          <h1 className="inline-block px-4 py-2 text-2xl text-center rounded md:text-3xl bg-gradient-to-r from-green-200 via-white to-green-200">
            Welcome {user?.name || "User"}
          </h1>

          <div className="flex justify-end">{/* logout button */}</div>

          <h1 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            👤 Your Dashboard
          </h1>

          <Outlet
            context={{
              employee,
              breakTimer,
              topPerformers,
              attendance,
              leaves,
              remainingLeaves,
              TOTAL_ANNUAL_LEAVES,
              salaryInfo,
              salaryError,
              presentDays,
              perDaySalary,
              calculatedSalary,
              absentDays,
              leaveForm,
              setLeaveForm,
              submitLeave,
              user,
            }}
          />

          <div className="p-4 mx-auto mb-6 bg-white shadow-md md:p-6 rounded-xl md:mb-10">
            <h1 className="mb-3 text-lg font-bold text-green-700 md:text-xl md:mb-4">
              📞 Log Customer Call Inquiry
            </h1>
            <CallInquiryForm employeeId={employee?._id} />
          </div>
        </div>
      </div>

 
<Modal
  isOpen={showModal}
  shouldCloseOnOverlayClick={false}  // Prevent outside click
  shouldCloseOnEsc={false}           // Optional: disable ESC key
  onRequestClose={() => {}}           // Do nothing
  contentLabel="Attendance Confirmation"
  className="w-[90%] max-w-md mx-auto bg-white rounded-lg p-4 md:p-6 shadow-lg focus:outline-none"
  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
>
  <div>
    <h2 className="mb-3 text-base font-bold text-center text-indigo-700 md:text-xl md:mb-4">
      🕒 Mark Your Attendance
    </h2>
    <p className="mb-3 text-xs leading-relaxed text-gray-700 md:text-sm md:mb-4">
      By continuing, you confirm that you are starting work and will aim to complete at least{' '}
      <strong>8 hours</strong> today.
      <br />
      <span className="block mt-1 font-medium text-red-500">
        Less than 8 hrs = Half Day, less than 5 hrs = Absent.
      </span>
    </p>
 
    <label className="flex items-start gap-2 mb-3 cursor-pointer md:mb-4">
      <input
        type="checkbox"
        checked={agree}
        onChange={() => setAgree(!agree)}
        className="w-4 h-4 mt-1 text-indigo-600 form-checkbox"
      />
      <span className="text-xs font-medium text-gray-800 md:text-sm">
        I agree to mark my attendance
      </span>
    </label>
 
    <div className="flex justify-between mt-4">
      {/* Close button */}
      <button
        onClick={() => {
          setShowModal(false);
          localStorage.clear(); // Clear session
          navigate('/login');   // Redirect to login
        }}
        className="px-5 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 hover:text-gray-900"
      >
        ✖ Close
      </button>
 
      {/* Proceed button */}
      <button
        onClick={handleProceed}
        disabled={!agree}
        className={`px-4 py-2 text-sm !text-white rounded transition-all duration-300 ${
          agree
            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            : 'bg-indigo-300 cursor-not-allowed'
        }`}
      >
        ✅ Proceed to Dashboard
      </button>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default UserDashboard;
