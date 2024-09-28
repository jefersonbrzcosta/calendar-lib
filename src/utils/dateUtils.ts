import {
  format,
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  setMonth,
  addWeeks,
  addDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const isToday = (date: Date, timeZone: string): boolean => {
  const zonedDate = toZonedTime(new Date(), timeZone);
  return isSameDay(date, zonedDate);
};

export const isCurrentWeek = (date: Date, timeZone: string): boolean => {
  const zonedDate = toZonedTime(new Date(), timeZone);
  return isSameWeek(date, zonedDate);
};

export const isCurrentMonth = (date: Date, timeZone: string): boolean => {
  const zonedDate = toZonedTime(new Date(), timeZone);
  return isSameMonth(date, zonedDate);
};

export const formatDate = (
  date: Date,
  formatString: string,
  timeZone: string
): string => {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, formatString);
};

export const getCalendarDays = (currentDate: Date) => {
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);

  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  return eachDayOfInterval({
    start: startWeek,
    end: endWeek,
  });
};

export const changeMonth = (currentDate: Date, offset: number): Date => {
  return addMonths(currentDate, offset);
};

export const setNewMonth = (currentDate: Date, monthIndex: number): Date => {
  return setMonth(currentDate, monthIndex);
};

export const getWeekDays = (currentDate: Date) => {
  const startWeek = startOfWeek(currentDate);
  const endWeek = endOfWeek(currentDate);
  return eachDayOfInterval({ start: startWeek, end: endWeek });
};

export const changeWeek = (currentDate: Date, offset: number): Date => {
  return addWeeks(currentDate, offset);
};

export const changeDay = (currentDate: Date, offset: number): Date => {
  return addDays(currentDate, offset);
};

export const filterEventsForDate = (events: any[], selectedDate: Date) => {
  return events.filter((event: any) =>
    isSameDay(new Date(event.start), selectedDate)
  );
};
