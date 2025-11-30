import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageWithCloseButton from './PageWithCloseButton';
import API from '../api';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const BreakTime = () => {
  const { breakTimer } = useOutletContext();
  const {
    workedHours,
    inBreak,
    breakDuration,
    loading,
    breakCount,
    startBreak,
    endBreak,
    totalBreakTimeToday,
    employeeId,
    fetchTodayStats,
    totalWorkedWithBreak,
    lastUpdated,
    attendanceStatus,
  } = breakTimer;

  const [currentTime, setCurrentTime] = useState(dayjs());
  const [loggedInTime, setLoggedInTime] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [statusMessage, setStatusMessage] = useState('');
  const [sessionDuration, setSessionDuration] = useState('00:00:00');
  const [loginDuration, setLoginDuration] = useState('00:00:00');

  const formatBreakDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalWorkedWithBreaks = workedHours + (totalBreakTimeToday / 3600);
  const totalMinutesWithBreaks = Math.floor(totalWorkedWithBreaks * 60);
  const displayHoursWithBreaks = Math.floor(totalMinutesWithBreaks / 60);
  const displayMinutesWithBreaks = totalMinutesWithBreaks % 60;

  const remaining = Math.max(0, 9 - totalWorkedWithBreaks);
  const remainingHours = Math.floor(remaining);
  const remainingMinutes = Math.round((remaining % 1) * 60);

  const workProgress = Math.min((totalWorkedWithBreaks / 9) * 100, 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedLogin = localStorage.getItem('loginTime');
    if (storedLogin) {
      setLoggedInTime(dayjs(storedLogin));
    }

    const sessionStart = sessionStorage.getItem('sessionStart');
    if (sessionStart) {
      setSessionStartTime(dayjs(sessionStart));
    } else {
      const now = new Date().toISOString();
      sessionStorage.setItem('sessionStart', now);
      setSessionStartTime(dayjs(now));
    }

    const lastRefresh = localStorage.getItem('lastRefreshTime');
    if (lastRefresh) {
      setLastRefreshTime(dayjs(lastRefresh));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (sessionStartTime) {
        const duration = dayjs.duration(dayjs().diff(sessionStartTime));
        setSessionDuration(
          `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
        );
      }

      if (loggedInTime) {
        const duration = dayjs.duration(dayjs().diff(loggedInTime));
        setLoginDuration(
          `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime, loggedInTime]);

  useEffect(() => {
    let refreshIntervalId;

    if (autoRefreshEnabled) {
      refreshIntervalId = setInterval(() => {
        handleAutoRefresh();
      }, refreshInterval * 60 * 1000);
    }

    return () => {
      if (refreshIntervalId) clearInterval(refreshIntervalId);
    };
  }, [autoRefreshEnabled, refreshInterval]);

  const handleAutoRefresh = async () => {
    try {
      const { success, error } = await fetchTodayStats();
      if (success) {
        setLastRefreshTime(dayjs());
        localStorage.setItem('lastRefreshTime', new Date().toISOString());
        setStatusMessage(`Data auto-refreshed at ${dayjs().format('hh:mm:ss A')}`);
        setTimeout(() => setStatusMessage(''), 5000);
      } else {
        setStatusMessage(`Auto-refresh failed: ${error}`);
      }
    } catch (error) {
      console.error('Auto-refresh error:', error);
    }
  };

  const handleManualRefresh = async () => {
    try {
      setStatusMessage('Refreshing data...');
      const { success, error } = await fetchTodayStats();
      if (success) {
        setLastRefreshTime(dayjs());
        localStorage.setItem('lastRefreshTime', new Date().toISOString());
        setStatusMessage(`Data refreshed at ${dayjs().format('hh:mm:ss A')}`);
        setTimeout(() => setStatusMessage(''), 5000);
      } else {
        setStatusMessage(`Refresh failed: ${error}`);
      }
    } catch (error) {
      setStatusMessage('Refresh error: ' + error.message);
    }
  };

  useEffect(() => {
    if (workedHours >= 10) {
      if (employeeId) {
        updateAttendanceStatus('completed');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      window.location.href = '/login';
    }
  }, [workedHours, employeeId]);

  const updateAttendanceStatus = async (status) => {
    try {
      await API.patch(
        '/attendance/update-status',
        {
          employeeId,
          status,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  const handleStartBreak = async () => {
    const result = await startBreak();
    if (result.success) {
      setStatusMessage('Break started successfully');
      setTimeout(() => setStatusMessage(''), 5000);
    } else {
      setStatusMessage(result.error || 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    const result = await endBreak();
    if (result.success) {
      setStatusMessage('Break ended successfully');
      setTimeout(() => setStatusMessage(''), 5000);
    } else {
      setStatusMessage(result.error || 'Failed to end break');
    }
  };

  return (
    <PageWithCloseButton
      title={
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Break Time
          </span>
        </div>
      }
    >
      <div className="flex flex-col items-start justify-between gap-3 mb-4 md:flex-row md:items-center">
        <div className="flex flex-col">
          {statusMessage && (
            <div
              className={`p-2 text-sm rounded-lg mb-2 ${
                statusMessage.includes('failed') || statusMessage.includes('error')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {statusMessage}
            </div>
          )}
          {lastRefreshTime && (
            <div className="text-xs text-gray-500">
              Last refreshed: {lastRefreshTime.format('hh:mm:ss A')}
            </div>
          )}
          {attendanceStatus && attendanceStatus !== 'present' && (
            <div className={`p-2 text-sm rounded-lg mt-2 ${
              attendanceStatus === 'half-day' ? 'bg-yellow-100 text-yellow-800'
              : attendanceStatus === 'absent' ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
              Attendance Status: {attendanceStatus.charAt(0).toUpperCase() + attendanceStatus.slice(1)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <label className="mr-2">
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                className="mr-1 cursor-pointer"
              />
              Auto-refresh
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="p-1 text-sm border rounded cursor-pointer"
            >
              <option value={5}>Every 5 min</option>
              <option value={10}>Every 10 min</option>
              <option value={15}>Every 15 min</option>
              <option value={30}>Every 30 min</option>
            </select>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 !text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all flex items-center justify-center ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Refreshing...
              </>
            ) : (
              '🔄 Refresh Data'
            )}
          </button>
        </div>
      </div>

      <div className="p-5 mb-6 transition-all border border-blue-100 shadow-md bg-gradient-to-br from-white to-blue-50 rounded-xl hover:shadow-lg">
        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
          <span className="text-blue-600">🕒</span>
          Time Tracking Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          {[
            { label: 'Current Time', value: currentTime.format('hh:mm:ss A'), icon: '⏲️' },
            { label: 'Logged In At', value: loggedInTime ? loggedInTime.format('hh:mm A') : '—', icon: '🔑' },
            { label: 'Login Duration', value: loginDuration, icon: '⏱️' },
            { label: 'Session Duration', value: sessionDuration, icon: '🖥️' },
          ].map((item, index) => (
            <div key={index} className="p-3 border border-gray-100 rounded-lg shadow-sm bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <span>{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 mb-6 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800">
            <span className={`${totalWorkedWithBreaks >= 9 ? 'text-green-500' : 'text-blue-500'}`}>
              {totalWorkedWithBreaks >= 9 ? '🎉' : '📊'}
            </span>
            Today's Work Progress
            <span className="ml-2 text-xs text-gray-500">
              (Auto-refresh: {autoRefreshEnabled ? 'ON' : 'OFF'})
            </span>
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              totalWorkedWithBreaks >= 9
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {`${displayHoursWithBreaks}h ${displayMinutesWithBreaks}m`} / 9h
          </span>
        </div>

        <div className="w-full h-3 mb-2 overflow-hidden bg-gray-100 rounded-full">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-in-out ${
              totalWorkedWithBreaks >= 9
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-blue-400 to-blue-500'
            }`}
            style={{ width: `${workProgress}%` }}
          />
        </div>

        <div className="p-4 mb-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm font-medium text-green-600">
                <span>📈</span>
                Total Worked (with break)
              </div>
              <div className="text-2xl font-bold text-green-700">
                {displayHoursWithBreaks}h {displayMinutesWithBreaks}m
              </div>
            </div>
            <div className="text-xs text-right text-green-600">
              Including all break time
              <br />
              in your work duration
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-1 mb-1 text-sm text-gray-500">
              <span>⏱️</span> Worked (raw)
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {Math.floor(workedHours)}h {Math.round((workedHours % 1) * 60)}m
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-1 mb-1 text-sm text-gray-500">
              <span>⏸️</span> Break Time
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {formatBreakDuration(totalBreakTimeToday)}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-1 mb-1 text-sm text-gray-500">
              <span>⏳</span> Remaining
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {remainingHours}h {remainingMinutes}m
            </div>
          </div>
        </div>

        {totalWorkedWithBreaks < 9 ? (
          <p className="flex items-center gap-1 p-3 mt-4 text-sm text-gray-600 rounded-lg bg-blue-50">
            <span className="text-blue-500">⏳</span>
            <span className="font-medium">{`${remainingHours}h ${remainingMinutes}m`}</span>
            remaining to complete your daily goal
          </p>
        ) : (
          <p className="flex items-center gap-2 p-3 mt-4 text-sm font-medium text-green-600 rounded-lg animate-pulse bg-green-50">
            <span>🎉</span>
            You've completed your daily work goal!
          </p>
        )}
      </div>

      <div className="p-5 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
        <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
          <span className="text-orange-500">⏸️</span>
          Break Management
        </h3>

        {inBreak ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg shadow-inner bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center">
                <div className="p-3 mr-3 bg-orange-100 rounded-full shadow-inner">
                  <span className="text-xl text-orange-600">⏱️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-800">On Break</p>
                  <p className="text-xs text-orange-600">
                    Current break duration: <span className="font-bold">{formatBreakDuration(breakDuration)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleEndBreak}
                className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-300 rounded-lg shadow-md cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg active:scale-95"
              >
                <span className="mr-2">🛑</span> End Break
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <p className="flex items-center gap-2 mb-3 text-sm text-blue-700">
                <span>⏸️</span>
                Start a break (up to 90 minutes total allowed)
              </p>
              <button
                onClick={handleStartBreak}
                disabled={loading}
                className={`cursor-pointer w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ${
                  loading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-inner'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 -ml-1 text-gray-900 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-lg">💤</span>
                    Start Break
                  </>
                )}
              </button>
            </div>
            {breakCount > 0 && (
              <div className="p-2 text-xs text-center text-gray-500 border border-gray-200 rounded bg-gray-50">
                Breaks taken today: <strong className="text-blue-600">{breakCount}</strong> | Total break time:{' '}
                <strong className="text-purple-600">{formatBreakDuration(totalBreakTimeToday)}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 text-sm text-purple-800 border-l-4 border-purple-400 rounded-lg shadow-sm bg-gradient-to-br from-purple-50 to-violet-50">
        <p className="flex items-center gap-2 mb-2 font-semibold text-purple-900">
          <span>📜</span>
          Break Policy Reminder
        </p>
        <ul className="pl-2 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">•</span>
            <span>You can take multiple breaks, up to a total of 90 minutes per day.</span>
          </li>
          <li className="flex items-start gap-2 font-medium text-red-600">
            <span className="mt-0.5">⚠️</span>
            <span>Exceeding 70 minutes total will mark as half-day.</span>
          </li>
          <li className="flex items-start gap-2 font-medium text-red-600">
            <span className="mt-0.5">⛔</span>
            <span>Exceeding 90 minutes total will mark as absent.</span>
          </li>
        </ul>
    
      </div>
    </PageWithCloseButton>
  );
};

export default BreakTime;





/*----------------------NOTES-----------------------

1] Break Types and Limits:

= Supports 2 Short Breaks (5 mins, 300s), 2 Tea Breaks (15 mins, 900s), 1 Lunch Break (30 mins, 1800s).
= Enforced by getNextBreak checking maxAllowed against breaks taken.

2] Starting a Break:

= Select break type from dropdown, click "Start [break label]".
= Sets currentBreakType, calls startBreak, shows "Started [break label]" popup.
= Disabled during loading or active break.

3] Manual Break End Before Duration:

= Scenario: 5-min break, manually stop before 5 mins.
= Behavior: Stops break via handleEndBreak(false). Shows "Break ended successfully" popup and alert "🕐 Break ended. Get back to work!". Records actual duration, no auto-progression.

4] Manual Break End After Duration:

= Scenario: 5-min break, manually stop after 5 mins.
= Behavior: If auto-ended (after 5 mins), no effect (inBreak = false). If stopped just before, ends break, shows "Break ended successfully" popup and alert, records ~5 mins.

5] Automatic Break Progression:

= Scenario: 5-min break, not stopped after 5 mins.
= Behavior: Auto-ends after 5 mins, starts next break of same type if available (<2 short breaks) and <70 mins total. Shows "Automatically started another Short Break (5 mins)" popup. Continues until max breaks or 70 mins reached.

6] Half-Day Marking:

= Scenario: Breaks total >1h10m (70 mins, 4200s).
= Behavior: Marks as half-day via updateAttendanceStatus('half-day'), shows "Marked as half-day (break exceeded 1 hour 10 minutes)" popup, ends break.

7] Absent Marking:

= Scenario: Breaks total >1h30m (90 mins, 5400s).
= Behavior: Marks as absent via updateAttendanceStatus('absent'), shows "Marked as absent (break exceeded 1 hour 30 minutes)" popup, ends break.

8] Break Time Tracking:

= Tracks total break time via totalBreakSeconds (from breaks) or totalBreakTimeToday (server).
= Displays as hours, minutes, seconds in UI.

9] Work Time Tracking:

= Tracks workedHours, displays as hours/minutes.
= Shows progress bar toward 9h goal, remaining time, or "You've completed your daily work goal!" if ≥9h.

10] Automatic Logout After 10 Hours:

= If workedHours ≥10h, marks "completed", clears localStorage, redirects to /login.

11] Real-Time Clock and Session Tracking:

= Displays current time (updated every second), login time, session start time from localStorage/sessionStorage.

12] Break Policy Display:

= Shows policy: 2 Short Breaks (5 mins), 2 Tea Breaks (15 mins), 1 Lunch Break (30 mins), 1h10m limit, half-day (>1h10m), absent (>1h30m).

13] Status Popups:

= Shows popups for: start ("Started [break label]"), auto-start ("Automatically started another [break label]"), manual end ("Break ended successfully"), no breaks left ("No more breaks of this type available"), half-day/absent, or errors.

14] Error Handling:

=Handles missing employeeId, API errors (logs or shows popup for manual actions), skips invalid break records.
-----------------------------
Break functionality:

1] Break Types & Limits – 2× Short (5m), 2× Tea (15m), 1× Lunch (30m), enforced by getNextBreak.
2] Start Break – Select type → click Start → sets current type, calls startBreak, shows popup.
3] Manual End Before Duration – Stops break immediately, records actual time, shows alert.
4] Manual End After Duration – If already auto-ended, no effect; else ends, records ~full duration.
5] Auto Progression – If not ended, auto-starts next same-type break until max or 70m total.
6] Half-Day Marking – If total breaks >70m → status = half-day, popup shown, ends break.
7] Absent Marking – If total breaks >90m → status = absent, popup shown, ends break.
8] Break Time Tracking – Tracks total break seconds; shows HH:MM:SS in UI.
9] Work Time Tracking – Tracks worked hours; progress toward 9h goal with remaining time.
10] Auto Logout After 10h – Marks complete, clears storage, redirects to login.
11] Real-Time Clock – Shows current time, login time, session start time live.
12] Break Policy Display – Shows allowed counts/durations & half-day/absent rules.
13] Status Popups – Start, auto-start, manual end, no breaks left, half-day, absent, errors.
------------------------------new-----------------------

1] Earlier Break System

Employees could choose a 5, 15, or 30-minute break.
Once the selected time ended, the break would automatically stop.
Problem: Employees often selected a 5-minute break, but actually returned after 15 minutes or more.

2] Updated Break System (New Logic)

Now, only one break is allowed.
When an employee starts a break, it will continue until they manually stop it.

If they forget to stop:

More than 70 minutes → Half Day is marked.
More than 90 minutes → Absent is marked and the break auto-stops.

3] Work Tracking Improvements

Added two new metrics:

Worked (Actual Work): Time excluding break.
Total Worked: Time including break.
*/