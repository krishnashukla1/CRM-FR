// src/utils/timeUtils.js
import dayjs from 'dayjs';

export const isSameShift = (savedTime, now) => {
  let shiftStart = dayjs().hour(9).minute(0).second(0);
  let shiftEnd = dayjs().hour(21).minute(0).second(0);

  if (now.isBefore(shiftStart)) {
    shiftStart = shiftStart.subtract(1, 'day');
    shiftEnd = shiftEnd.subtract(1, 'day');
  }

  return dayjs(savedTime).isBetween(shiftStart, shiftEnd, null, '[]');
};
