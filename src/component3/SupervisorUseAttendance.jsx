import { useState, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function useAttendance() {
  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const checkAttendance = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.data?.marked) {
        setModalMessage('Please mark your attendance for today');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Attendance check failed:', error);
      setModalMessage(error.response?.data?.message || 'Unable to verify attendance. Please try again.');
      setShowModal(true);
    }
  }, []);

  const markAttendance = useCallback(async (employeeId) => {
    try {
      const now = dayjs();
      const startWindow = dayjs().hour(17).minute(0).second(0);
      const endWindow = dayjs().hour(23).minute(59).second(59);

      let status = 'Absent';
      if (now.isAfter(startWindow)) {
        status = now.isBefore(endWindow) ? 'Present' : 'Late';
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/attendance/mark`,
        { 
          status,
          employeeId,
          date: now.format('YYYY-MM-DD')
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      setModalMessage(response?.data?.message || 'Attendance marked successfully');
      return true;
    } catch (error) {
      console.error('Attendance marking failed:', error);
      setModalMessage(error.response?.data?.message || 'Failed to mark attendance. Please try again.');
      return false;
    }
  }, []);

  return {
    showModal,
    setShowModal,
    agree,
    setAgree,
    modalMessage,
    checkAttendance,
    markAttendance,
      setModalMessage, // Add this
  };
}