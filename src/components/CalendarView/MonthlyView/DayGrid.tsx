import { format, isToday } from "date-fns";

interface DayGridProps {
  calendarDays: Date[];
  currentDate: Date;
  eventsByDay: { [key: string]: { color: string }[] };
  handleDayClick: (day: Date) => void;
  mainColor: string;
  secondColor: string;
}

const DayGrid: React.FC<DayGridProps> = ({
  calendarDays,
  currentDate,
  eventsByDay,
  handleDayClick,
  mainColor,
  secondColor,
}) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {calendarDays.map((day, index) => {
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const dayString = format(day, "yyyy-MM-dd");
        const dayEvents = eventsByDay[dayString] || [];

        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center h-24 cursor-pointer rounded-lg ${
              isCurrentMonth ? "text-gray-800" : "text-gray-400"
            }`}
            style={
              isToday(day)
                ? { color: "white", backgroundColor: secondColor }
                : { color: mainColor }
            }
            onClick={() => handleDayClick(day)}
          >
            <div className="text-xl font-semibold">{format(day, "d")}</div>
            <div className="flex flex-wrap justify-center mt-1">
              {dayEvents.slice(0, 6).map((event, idx) => (
                <span
                  key={idx}
                  className="w-2 h-2 rounded-full m-0.5"
                  style={{ backgroundColor: event.color }}
                ></span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayGrid;
