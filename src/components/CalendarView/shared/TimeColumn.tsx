import React from "react";
import { useCalendarContext } from "../../../context/CalendarContext";
import { isScreenMobile } from "../../utils";

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

  const renderRightBackgroundColor = (isCurrentHour: boolean) => {
    if (isScreenMobile()) return "white";

    return isCurrentHour ? mainColor : secondColor;
  };

  return (
    <div className="flex flex-col space-y-0 sm:w-2/12">
      <div className="h-12"></div>
      {hours.map((hour, index) => {
        const hourInt = parseInt(hour.split(":")[0], 10);
        const isCurrentHour = currentHour === hourInt;

        return (
          <div
            key={index}
            className={`flex pr-1 text-xs sm:text-base h-12 items-center sm:justify-center sm:text-white sm:border-b sm:border-gray-200 ${
              isCurrentHour && isScreenMobile() && `font-extrabold`
            }`}
            style={{
              backgroundColor: renderRightBackgroundColor(isCurrentHour),
            }}
          >
            {hour}
          </div>
        );
      })}
    </div>
  );
};
