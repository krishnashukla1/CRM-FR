import React, { useEffect, useState } from 'react';
import { useWorkTimer } from '../hooks/useWorkTimer';
import dayjs from 'dayjs';

const WorkTimer = ({ employeeId, token }) => {
  const {
    loginTime,
    logoutTime,
    breaks,
    isOnBreak,
    startBreak,
    endBreak,
    getTotalBreakTime
  } = useWorkTimer(employeeId, token);

  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  useEffect(() => {
    let interval;
    if (loginTime && !logoutTime) {
      interval = setInterval(() => {
        const duration = dayjs.duration(dayjs().diff(dayjs(loginTime)));
        setElapsedTime(formatDuration(duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginTime, logoutTime]);

  const formatDuration = (dur) => {
    const hrs = String(dur.hours()).padStart(2, '0');
    const mins = String(dur.minutes()).padStart(2, '0');
    const secs = String(dur.seconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">🕒 Work Session</h2>

      {loginTime ? (
        <>
          <p className="mb-2">✅ Logged in at: <strong>{dayjs(loginTime).format('hh:mm A')}</strong></p>
          <p className="mb-2">⏱️ Current Duration: <strong>{elapsedTime}</strong></p>

          <p className="mb-2">🍵 Breaks Taken: <strong>{breaks.length}</strong></p>
          <p className="mb-4">🧮 Total Break Time: <strong>{formatDuration(getTotalBreakTime())}</strong></p>

          {isOnBreak ? (
            <button onClick={endBreak} className="bg-green-600 text-white px-4 py-2 rounded">
              End Break
            </button>
          ) : (
            <button onClick={startBreak} className="bg-blue-600 text-white px-4 py-2 rounded">
              Start Break
            </button>
          )}
        </>
      ) : (
        <p className="text-red-500">Not logged in yet.</p>
      )}
    </div>
  );
};

export default WorkTimer;
