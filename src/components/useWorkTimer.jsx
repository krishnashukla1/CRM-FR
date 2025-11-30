import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const useWorkTimer = () => {
  const [loginTime, setLoginTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [totalBreakSeconds, setTotalBreakSeconds] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('shiftLoginTime');
    const now = dayjs();

    if (saved) {
      setLoginTime(dayjs(saved));
    } else {
      localStorage.setItem('shiftLoginTime', now.toISOString());
      setLoginTime(now);
    }

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedBreaks = parseInt(localStorage.getItem('totalBreakSeconds') || '0');
    setTotalBreakSeconds(storedBreaks);
  }, []);

  const totalWorkedSeconds = currentTime.diff(loginTime, 'second');
  const netWorkedSeconds = totalWorkedSeconds - totalBreakSeconds;

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return {
    loginTime,
    currentTime,
    workedDuration: formatDuration(totalWorkedSeconds),
    netDuration: formatDuration(netWorkedSeconds),
    remainingSeconds: Math.max(0, 9 * 3600 - netWorkedSeconds),
  };
};

export default useWorkTimer;
