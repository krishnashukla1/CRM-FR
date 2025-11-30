import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageWithCloseButton from "./PageWithCloseButton";
import API from "../api";
import dayjs from "dayjs";
import { DatePicker } from "antd";

const WeeklyOff = () => {
  const { user } = useOutletContext() || {};
  const [weeklyOffs, setWeeklyOffs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));

  // Fetch weekly off data and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offsRes, employeesRes] = await Promise.all([
          API.get("/weekly-offs"),
          API.get("/employees"),
        ]);

        // Process weekly offs
        const enhancedOffs = (offsRes.data || []).map((off) => ({
          ...off,
          employeeId: off.employeeId?._id || off.employeeId,
          dayOfWeek: off.dayOfWeek || (off.date ? dayjs(off.date).format("dddd") : ""),
        }));

        setWeeklyOffs(enhancedOffs);
        setEmployees(employeesRes.data?.data || employeesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load weekly off schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get employee details by ID
  const getEmployeeDetails = (employeeId) => {
    if (!employeeId) return { _id: "", name: "Unknown", email: "", role: "" };

    const employee = employees.find((emp) => emp._id === employeeId);
    return employee || { _id: employeeId, name: "Unknown", email: "", role: "" };
  };

  // Group weekly offs by employee with their dates
  const groupByEmployee = () => {
    const grouped = {};

    weeklyOffs.forEach((off) => {
      const employeeId = off.employeeId;
      if (!employeeId) return;

      const employee = getEmployeeDetails(employeeId);

      if (!grouped[employeeId]) {
        grouped[employeeId] = {
          employee,
          dates: [],
        };
      }

      if (off.date) {
        grouped[employeeId].dates.push({
          date: dayjs(off.date),
          id: off._id,
          dayOfWeek: off.dayOfWeek || dayjs(off.date).format("dddd"),
        });
      }
    });

    return Object.values(grouped).map((item) => ({
      ...item,
      dates: item.dates
        .filter((d) => (selectedMonth ? d.date.format("YYYY-MM") === selectedMonth : true))
        .sort((a, b) => a.date - b.date),
    }));
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date ? date.format("YYYY-MM") : null);
  };

  const processedWeeklyOffs = groupByEmployee();

  if (loading) {
    return (
      <PageWithCloseButton title="📅 Weekly Off Schedule">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>
      </PageWithCloseButton>
    );
  }

  if (error) {
    return (
      <PageWithCloseButton title="📅 Weekly Off Schedule">
        <div className="p-6 text-red-600 border-l-4 border-red-500 shadow-sm bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
          {error}
        </div>
      </PageWithCloseButton>
    );
  }

  // Find logged-in employee's weekly offs
  const myWeeklyOff = processedWeeklyOffs.find(
    (off) => off.employee._id === user?._id
  );

  return (
    <PageWithCloseButton title="📅 Weekly Off Schedule">
      <div className="p-4 mx-auto space-y-6 max-w-7xl">
        {/* ==== Logged-in Employee's Weekly Off Card ==== */}
        {myWeeklyOff && (
          <div className="p-6 transition-all transform border border-indigo-100 shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="flex items-center gap-2 mb-2 text-xl font-bold text-indigo-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Your Weekly Off Days
                </h2>
                <p className="mb-4 text-sm text-indigo-600">
                  {selectedMonth
                    ? dayjs(selectedMonth).format("MMMM YYYY")
                    : "All scheduled off days"}
                </p>
              </div>
              <div className="px-3 py-1 text-sm font-medium text-indigo-700 bg-white border border-indigo-200 rounded-full shadow-xs">
                {myWeeklyOff.dates.length} {myWeeklyOff.dates.length === 1 ? "day" : "days"}
              </div>
            </div>

            {myWeeklyOff.dates.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {myWeeklyOff.dates.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-800 transition-colors bg-white border border-indigo-100 shadow-sm rounded-xl hover:bg-indigo-50"
                  >
                    <span className="text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="font-medium">{d.date.format("DD MMM")}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm text-gray-600">{d.dayOfWeek}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border border-indigo-100 rounded-lg bg-indigo-50/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 font-medium text-indigo-600">No off days scheduled</p>
                <p className="text-xs text-indigo-400">Contact HR if you need time off</p>
              </div>
            )}
          </div>
        )}

        {/* Month Selector */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Filter Schedule
              </h3>
              <p className="mt-1 text-sm text-gray-500">View weekly offs by month</p>
            </div>
            <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
              <DatePicker
                picker="month"
                format="MMM YYYY"
                value={selectedMonth ? dayjs(selectedMonth) : null}
                onChange={handleMonthChange}
                allowClear
                className="w-full px-4 py-2 transition-colors border-gray-300 shadow-sm cursor-pointer sm:w-56 rounded-xl hover:border-indigo-400 focus:border-indigo-500"
              />
              <button
                onClick={() => setSelectedMonth(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors bg-white border border-gray-200 shadow-sm cursor-pointer rounded-xl hover:bg-gray-50 hover:text-gray-800"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>

        {/* Team Schedule */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="flex items-center gap-3 text-xl font-bold text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Team Weekly Off Schedule
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedMonth
                    ? `Showing ${processedWeeklyOffs.length} employees with off days in ${dayjs(selectedMonth).format("MMMM YYYY")}`
                    : `Showing all scheduled off days for ${processedWeeklyOffs.length} employees`}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl">
                <span className="text-sm text-gray-500">Total:</span>
                <span className="font-bold text-indigo-700">{processedWeeklyOffs.length}</span>
                <span className="text-gray-400">employees</span>
              </div>
            </div>
          </div>

          {processedWeeklyOffs.length === 0 ? (
            <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-600">
                {selectedMonth
                  ? `No weekly offs scheduled for ${dayjs(selectedMonth).format("MMMM YYYY")}`
                  : "No weekly offs scheduled"}
              </h4>
              <p className="max-w-md mx-auto mt-2 text-gray-400">
                The schedule appears empty. This might be because no off days have been assigned yet or the filter is too restrictive.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Off Days
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {processedWeeklyOffs.map((off, index) => (
                    <tr
                      key={off.employee._id || index}
                      className={off.employee._id === user?._id ? "bg-indigo-50/50" : "hover:bg-gray-50 transition-colors"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${off.employee._id === user?._id
                              ? "bg-indigo-100 ring-2 ring-indigo-300"
                              : "bg-gray-100"
                              }`}
                          >
                            <span
                              className={`font-medium ${off.employee._id === user?._id ? "text-indigo-700" : "text-gray-600"
                                }`}
                            >
                              {off.employee.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center text-sm font-semibold text-gray-900">
                              {off.employee.name}
                              {off.employee._id === user?._id && (
                                <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{off.employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-xs px-3 py-1.5 rounded-full font-medium inline-block ${off.employee.role === "Developer"
                            ? "bg-blue-100 text-blue-800"
                            : off.employee.role === "Manager"
                              ? "bg-purple-100 text-purple-800"
                              : off.employee.role === "HR"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {off.employee.role || "Employee"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {off.dates.length > 0 ? (
                            off.dates.map((d) => (
                              <div
                                key={d.id}
                                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${off.employee._id === user?._id
                                  ? "bg-white text-indigo-800 border border-indigo-200 shadow-xs"
                                  : "bg-gray-50 text-gray-700 border border-gray-100"
                                  }`}
                              >
                                <span className="text-indigo-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </span>
                                <span className="font-medium">{d.date.format("DD")}</span>
                                <span className="text-xs text-gray-400">{d.date.format("MMM")}</span>
                                <span className="mx-1 text-gray-300">•</span>
                                <span className="text-gray-500">{d.dayOfWeek.substring(0, 3)}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm italic text-gray-400">None scheduled</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-bold ${off.dates.length > 0
                            ? off.employee._id === user?._id
                              ? "text-indigo-700"
                              : "text-gray-700"
                            : "text-gray-400"
                            }`}
                        >
                          {off.dates.length}
                        </div>
                      </td>
                    </tr>
                  ))}


                  
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Information Note */}
        <div className="p-6 border border-indigo-100 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 mt-1 bg-indigo-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>


            <div>
              <h3 className="mb-2 text-lg font-medium text-gray-800">Weekly Off Policy</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Weekly off days are fixed and cannot be changed without prior approval from HR. Contact
                your manager for any scheduling conflicts at least 7 days in advance. Unauthorized
                changes may result in attendance policy violations.
              </p>
              <div className="mt-3 text-xs font-medium text-indigo-600">
                Last updated: {dayjs().format("DD MMM YYYY")}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </PageWithCloseButton >
  );
};

export default WeeklyOff;
