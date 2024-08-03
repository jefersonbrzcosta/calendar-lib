// src/utils/dateUtils.ts
import { format, isSameDay, isSameWeek, isSameMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

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

export const formatDate = (date: Date, formatString: string, timeZone: string): string => {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, formatString);
};
