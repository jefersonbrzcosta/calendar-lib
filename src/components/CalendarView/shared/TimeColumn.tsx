import React from "react";
import { useCalendarContext } from "../../../context/CalendarContext";

interface TimeColumnProps {
  startHour?: number;
  endHour?: number;
}

export const TimeColumn: React.FC<TimeColumnProps> = ({
  startHour = 0,
  endHour = 23,
}) => {
  const { state } = useCalendarContext();
  const { mainColor, secondColor } = state.settings;

  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => `${i + startHour}:00`
  );

  const currentHour = new Date().getHours(); // Get the current hour

  return (
    <div className="flex flex-col space-y-0 w-2/12">
      <div className="h-12"></div>
      {hours.map((hour, index) => {
        const hourInt = parseInt(hour.split(":")[0], 10);
        const isCurrentHour = currentHour === hourInt;

        return (
          <div
            key={index}
            className={`text-xs sm:text-base text-white h-12 flex items-center justify-center border-b border-gray-200`}
            style={{ backgroundColor: isCurrentHour ? mainColor : secondColor }}
          >
            {hour}
          </div>
        );
      })}
    </div>
  );
};
