import DayColumn from "./DayColumn";

interface DayGridProps {
  currentDate: Date;
  events: any[];
  handleTimeSlotClick: (day: Date) => void;
  mainColor: string;
}

const DayGrid: React.FC<DayGridProps> = ({
  currentDate,
  events,
  handleTimeSlotClick,
  mainColor,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 w-10/12">
      <DayColumn
        currentDate={currentDate}
        events={events}
        handleTimeSlotClick={handleTimeSlotClick}
        mainColor={mainColor}
      />
    </div>
  );
};

export default DayGrid;
