import React from 'react';
import { useCalendarContext } from '../../../context/CalendarContext';

interface TimeColumnProps {
  startHour?: number;
  endHour?: number;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({ startHour = 0, endHour = 23 }) => {
  const { state } = useCalendarContext();
  const { mainColor } = state.settings;

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => `${i + startHour}:00`);

  return (
    <div className="flex flex-col space-y-0 w-2/12">
      <div className="h-12"></div> {/* Placeholder for aligning hours with days */}
      {hours.map((hour, index) => (
        <div
          key={index}
          className={`text-sm text-white h-12 flex items-center justify-center border-b border-gray-200`}
          style={{ backgroundColor: mainColor }}
        >
          {hour}
        </div>
      ))}
    </div>
  );
};
