import React, { useEffect, useState } from 'react';
import PageWithCloseButton from './PageWithCloseButton';
import API from '../api';

const TopPerformance = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1️⃣ Fetch performance targets first
        const { data: perfData } = await API.get('/performance/top');
        const performers = perfData.data.map(emp => ({
          _id: emp._id,
          name: emp.name,
          photo: emp.photo,
          role: emp.role,
          target: emp.target || 10000,
          sales: 0,
          bestPerformance: 0
        }));

        setTopPerformers(performers);
        setLoading(false); // UI renders immediately

        // 2️⃣ Fetch sales data in background
        fetchSalesData(performers);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setLoading(false);
      }
    };

    const fetchSalesData = async (targetData) => {
      try {
        let allLogs = [];
        let page = 1;
        let hasNext = true;

        // Fetch all call logs (pagination)
        while (hasNext) {
          const { data } = await API.get(`/call-logs?page=${page}&limit=500`);
          if (data?.data?.length) {
            allLogs = [...allLogs, ...data.data];
          }
          hasNext = data?.pagination?.hasNextPage;
          page++;
        }

        // Group sales by employee
        const salesMap = {};
        for (const log of allLogs) {
          if (!log.employeeId) continue;
          const empId = log.employeeId._id || log.employeeId;
          salesMap[empId] = (salesMap[empId] || 0) + (log.profitAmount || 0);
        }

        // Merge sales data into performers
        setTopPerformers(prev =>
          prev
            .map(emp => {
              const sales = salesMap[emp._id] || 0;
              return {
                ...emp,
                sales,
                bestPerformance: emp.target > 0 ? (sales / emp.target) * 100 : 0
              };
            })
            .sort((a, b) => b.bestPerformance - a.bestPerformance)
            .slice(0, 3)
        );
      } catch (err) {
        console.error('Error fetching sales data:', err);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <PageWithCloseButton title="🏆 Top Performers">
      <div className="space-y-6">
        {loading && topPerformers.length === 0 ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : topPerformers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topPerformers.map((emp, index) => (
              <div
                key={emp._id}
                className={`bg-gradient-to-br rounded-xl p-6 shadow-lg text-center transition-transform hover:scale-105 ${index === 0
                    ? 'from-yellow-100 to-yellow-50 border-2 border-yellow-200'
                    : 'from-purple-50 to-white border border-purple-100'
                  }`}
              >
                <div className="relative inline-block">
                  <img
                    src={
                      emp.photo
                        ? `https://crm-ba.onrender.com/uploads/${emp.photo}`
                        : 'https://cdn-icons-png.flaticon.com/512/219/219983.png'
                    }
                    alt={emp.name}
                    className="object-cover w-24 h-24 mx-auto mb-4 border-4 border-white rounded-full shadow-md"
                  />
                  {index === 0 && (
                    <div className="absolute flex items-center justify-center w-8 h-8 text-white bg-yellow-400 rounded-full -top-2 -right-2">
                      <span className="text-sm font-bold">1</span>
                    </div>
                  )}
                </div>

                <h3 className="mb-1 text-xl font-bold text-gray-800">{emp.name}</h3>
                <p className="mb-3 font-medium text-purple-600">{emp.role}</p>

                <div className="p-3 space-y-2 bg-white rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales:</span>
                    <span className="font-medium">
                      ${emp.sales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">
                      ${emp.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance:</span>
                    <span
                      className={`font-bold ${emp.bestPerformance >= 100
                          ? 'text-green-600'
                          : emp.bestPerformance >= 80
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                    >
                      {emp.bestPerformance.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-xl">
            <div className="mb-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">
              No Performance Data Available
            </h3>
            <p className="mt-1 text-gray-500">
              Check back later for updated performance metrics
            </p>
          </div>
        )}
      </div>
    </PageWithCloseButton>
  );
};

export default TopPerformance;
