import { format, isToday } from "date-fns";
import { getCurrentTimePosition, getEventPosition, hours } from "../../utils";

interface DayColumnProps {
  currentDate: Date;
  events: any[];
  handleTimeSlotClick: (day: Date) => void;
  mainColor: string;
}

const DayColumn: React.FC<DayColumnProps> = ({
  currentDate,
  events,
  handleTimeSlotClick,
  mainColor,
}) => {
  return (
    <div className="flex flex-col space-y-0 relative border-l border-gray-200 bg-white">
      {/* Day Header */}
      <div
        className="text-center text-md font-semibold h-12 pt-3"
        style={{
          backgroundColor: isToday(currentDate) ? mainColor : "#a0aec0",
          color: "white",
        }}
      >
        {format(currentDate, "eeee")}
      </div>

      {/* Time Slots */}
      {hours.map((_, index) => (
        <div
          key={index}
          className="border-t border-gray-200 h-12 cursor-pointer hover:bg-gray-100"
          onClick={() => handleTimeSlotClick(currentDate)}
        ></div>
      ))}

      {/* Render Events */}
      {events.map((event: any, eventIndex: any) => {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const position = getEventPosition(eventStart, eventEnd);

        return (
          <div
            key={eventIndex}
            className="absolute left-0 right-0 mx-2 rounded-lg shadow text-white px-2"
            style={{
              backgroundColor: event.color,
              top: position.top,
              height: position.height,
            }}
          >
            <div className="text-xs font-bold sm:text-sm flex justify-center align-middle">
              {format(eventStart, "h:mm a")}
            </div>
            <div className="text-xs">{event.title}</div>
          </div>
        );
      })}

      {/* Render Current Time Line */}
      {isToday(currentDate) && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-red-500"
          style={{ top: `${getCurrentTimePosition()}%` }}
        />
      )}
    </div>
  );
};

export default DayColumn;
