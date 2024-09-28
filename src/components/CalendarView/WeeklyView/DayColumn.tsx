// components/DayColumn.tsx
import { format, isToday } from "date-fns";
import { getEventPosition } from "../../utils";

interface DayColumnProps {
  day: Date;
  events: any[];
  handleTimeSlotClick: (day: Date, hour: number) => void;
  handleEventClick: (event: any) => void;
  hours: string[];
  mainColor: string;
  secondColor: string;
}

const DayColumn: React.FC<DayColumnProps> = ({
  day,
  events,
  handleTimeSlotClick,
  handleEventClick,
  hours,
  mainColor,
  secondColor,
}) => {
  return (
    <div className={`flex flex-col space-y-0 relative border-l`}>
      {/* Day Header */}
      <div
        className={`text-center text-xs sm:text-base h-12 text-white`}
        style={{ backgroundColor: isToday(day) ? mainColor : secondColor }}
      >
        {format(day, "EEE d")}
      </div>

      {/* Time Slots */}
      {hours.map((hour, index) => (
        <div
          key={index}
          className="border-t border-gray-200 h-12 cursor-pointer hover:bg-gray-100"
          onClick={() => handleTimeSlotClick(day, parseInt(hour.split(":")[0]))}
        />
      ))}

      {/* Events */}
      {events.map((event: any, eventIndex: any) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const position = getEventPosition(eventStart, eventEnd);

        return (
          <div
            key={eventIndex}
            className="absolute w-full text-white sm:rounded-lg sm:pl-1"
            style={{
              backgroundColor: event.color,
              top: position.top,
              height: position.height,
            }}
            onClick={() => handleEventClick(event)}
          >
            <div className="text-xs sm:text-sm font-bold">
              {format(eventStart, "h:mm a")}
            </div>
            <div className="sm:text-sm pl-1 sm:pl-0 text-left text-[9px] text-wrap">
              {event.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayColumn;
