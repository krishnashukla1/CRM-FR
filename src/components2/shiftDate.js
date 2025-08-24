// utils/shiftDate.js
export function getShiftWindow() {
  const now = new Date();
  const istOffsetMinutes = 330; // IST is UTC+5:30
  const currentIST = new Date(now.getTime() + istOffsetMinutes * 60 * 1000);

  const shiftCutoffHour = 17; // 5 PM IST
  let shiftDate = new Date(currentIST);

  // If before 5 PM IST, shift date is yesterday
  if (currentIST.getHours() < shiftCutoffHour) {
    shiftDate.setDate(shiftDate.getDate() - 1);
  }

  // Shift start at 5 PM IST
  const shiftStart = new Date(
    shiftDate.getFullYear(),
    shiftDate.getMonth(),
    shiftDate.getDate(),
    shiftCutoffHour,
    0,
    0,
    0
  );

  // Shift end is 24 hours later
  const shiftEnd = new Date(shiftStart);
  shiftEnd.setDate(shiftEnd.getDate() + 1);

  // Return in ISO and date-only formats
  return {
    shiftDateString: shiftDate.toISOString().split("T")[0],
    shiftStartUTC: new Date(shiftStart.getTime() - istOffsetMinutes * 60 * 1000).toISOString(),
    shiftEndUTC: new Date(shiftEnd.getTime() - istOffsetMinutes * 60 * 1000).toISOString(),
    currentIST,
  };
}
