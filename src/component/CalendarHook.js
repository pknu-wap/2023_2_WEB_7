import { useState } from "react";
import { getDaysInMonth } from "date-fns";

const CALENDER_LENGTH = 35;
const DEFAULT_TRASH_VALUE = 0;
const DAY_OF_WEEK = 7;

const CalendarHook = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const totalMonthDays = getDaysInMonth(currentDate);
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDayOfWeek = firstDayOfMonth.getDay();

  const prevDayList = Array.from({
    length: startDayOfWeek,
  }).map(() => DEFAULT_TRASH_VALUE);

  const currentDayList = Array.from({length: totalMonthDays}).map(
    (_, i) => i + 1,
  );

  const nextDayList = Array.from({
    length: CALENDER_LENGTH - currentDayList.length - prevDayList.length,
  }).map(() => DEFAULT_TRASH_VALUE);

  const currentCalendarList = prevDayList.concat(currentDayList, nextDayList);
  const weekCalendarList = currentCalendarList.reduce(
    (acc, cur, idx) => {
      const chunkIndex = Math.floor(idx / DAY_OF_WEEK);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(cur);
      return acc;
    },
    [],
  );

  return {
    weekCalendarList,
    currentDate,
    setCurrentDate,
  };
};

export default CalendarHook;