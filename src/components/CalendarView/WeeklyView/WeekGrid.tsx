// components/WeekGrid.tsx
import DayColumn from "./DayColumn";
import { isSameDay } from "date-fns";

interface WeekGridProps {
  weekDays: Date[];
  events: any[];
  hours: string[];
  mainColor: string;
  secondColor: string;
  handleTimeSlotClick: (day: Date, hour: number) => void;
  handleEventClick: (event: any) => void;
}

const WeekGrid: React.FC<WeekGridProps> = ({
  weekDays,
  events,
  hours,
  mainColor,
  secondColor,
  handleTimeSlotClick,
  handleEventClick,
}) => {
  return (
    <div className="grid grid-cols-7 gap-0.5 w-full sm:w-10/12">
      {weekDays.map((day, index) => {
        const dayEvents = events.filter((event: any) =>
          isSameDay(new Date(event.start), day)
        );

        return (
          <DayColumn
            key={index}
            day={day}
            events={dayEvents}
            handleTimeSlotClick={handleTimeSlotClick}
            handleEventClick={handleEventClick}
            hours={hours}
            mainColor={mainColor}
            secondColor={secondColor}
          />
        );
      })}
    </div>
  );
};

export default WeekGrid;
