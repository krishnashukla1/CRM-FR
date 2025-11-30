import { useState, useEffect, useRef, useCallback } from 'react';
import API from '../api';

export default function useBreakTimer(employee) {
  const [workedHours, setWorkedHours] = useState(0);
  const [breakCount, setBreakCount] = useState(0);
  const [inBreak, setInBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0); // Real-time duration of current break
  const [loading, setLoading] = useState(false);
  const [totalBreakTimeToday, setTotalBreakTimeToday] = useState(0);
  const [totalWorkedWithBreak, setTotalWorkedWithBreak] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('present');
  const breakTimerRef = useRef(null);

  const parseTimeToSeconds = useCallback((timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  }, []);

  const fetchTodayStats = useCallback(async () => {
    const empId = employee?._id || localStorage.getItem("employeeId");
    if (!empId) {
      console.error('No employee ID found');
      return { error: 'No employee ID found' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const res = await API.get(`/hours/today/${empId}`, headers);

      const totalBreakTimeSeconds = res.data.totalBreakTimeToday
        ? parseTimeToSeconds(res.data.totalBreakTimeToday)
        : 0;

      setWorkedHours(res.data.workedHoursToday || 0);
      setBreakCount(res.data.totalBreaksToday || 0);
      setInBreak(res.data.isOnBreak || false);
      setTotalBreakTimeToday(totalBreakTimeSeconds);
      setTotalWorkedWithBreak(res.data.totalWorkedWithBreak || 0);
      setAttendanceStatus(res.data.attendanceStatus || 'present');
      setLastUpdated(new Date());

      if (res.data.isOnBreak && res.data.breaks?.length > 0) {
        const activeBreak = res.data.breaks.find(b => !b.end);
        if (activeBreak && activeBreak.start) {
          const startTime = new Date(activeBreak.start);
          const currentTime = new Date();
          setBreakDuration(Math.floor((currentTime - startTime) / 1000));
        }
      } else {
        setBreakDuration(0);
      }

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Failed to fetch today's stats:", err);
      setBreakCount(0);
      setTotalBreakTimeToday(0);
      setBreakDuration(0);
      return { error: err.message || 'Failed to fetch data' };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, parseTimeToSeconds]);

  const startBreak = useCallback(async () => {
    if (!employee?._id) {
      return { error: 'Invalid break request' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const payload = {
        employeeId: employee._id,
      };

      const response = await API.post('/hours/break/start', payload, headers);

      setInBreak(true);
      setBreakCount((prev) => prev + 1);
      setBreakDuration(0);

      await fetchTodayStats();

      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to start break:', err);
      return { error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, fetchTodayStats]);

  const endBreak = useCallback(async () => {
    if (!employee?._id || !inBreak) {
      return { error: 'Invalid break end request' };
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Missing token');

      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.post(
        '/hours/break/end',
        { employeeId: employee._id },
        headers
      );

      setInBreak(false);
      setBreakDuration(0);

      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }

      await fetchTodayStats();

      return {
        success: true,
        message: 'Break ended successfully',
        data: response.data
      };
    } catch (err) {
      console.error('Failed to end break:', err);
      return { error: err?.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  }, [employee?._id, inBreak, fetchTodayStats]);

  // Auto-end break if total exceeds limits
  useEffect(() => {
    if (inBreak && totalBreakTimeToday + breakDuration > 90 * 60) {
      endBreak(); // Auto-end if total exceeds 90 minutes
      setAttendanceStatus('absent');
    } else if (inBreak && totalBreakTimeToday + breakDuration > 70 * 60) {
      endBreak(); // Auto-end if total exceeds 70 minutes
      setAttendanceStatus('half-day');
    }
  }, [inBreak, breakDuration, totalBreakTimeToday, endBreak]);

  // Real-time break duration update
  useEffect(() => {
    if (inBreak) {
      breakTimerRef.current = setInterval(() => {
        setBreakDuration((prev) => prev + 1);
      }, 1000);
    } else if (breakTimerRef.current) {
      clearInterval(breakTimerRef.current);
      breakTimerRef.current = null;
    }

    return () => {
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
    };
  }, [inBreak]);

  // Periodic stats refresh
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchTodayStats();
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (breakTimerRef.current) {
        clearInterval(breakTimerRef.current);
        breakTimerRef.current = null;
      }
    };
  }, [fetchTodayStats]);

  return {
    workedHours,
    totalWorkedWithBreak,
    breakCount,
    inBreak,
    breakDuration,
    loading,
    startBreak,
    endBreak,
    fetchTodayStats,
    totalBreakTimeToday,
    attendanceStatus,
    employeeId: employee?._id,
    lastUpdated,
  };
}



