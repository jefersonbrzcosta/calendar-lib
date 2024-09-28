import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Button } from "antd";
import { useCalendarContext } from "../../../context/CalendarContext";
import { getCalendarDays, changeMonth } from "../../../utils/dateUtils";
import EventListModal from "../../EventListModal";
import MonthList from "./MonthList";
import DayGrid from "./DayGrid";

const MonthlyView = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mainColor, secondColor } = state.settings;

  useEffect(() => {
    if (state.currentDate.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(state.currentDate);
    }
  }, [state.currentDate, currentDate]);

  const handleMonthChange = (offset: number) => {
    const newDate = changeMonth(currentDate, offset);
    setCurrentDate(newDate);
    dispatch({ type: "SET_DATE", payload: newDate });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: "SET_DATE", payload: today });
  };

  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    dispatch({ type: "SET_DATE", payload: date });
  };

  const calendarDays = getCalendarDays(currentDate);

  const eventsByDay: { [key: string]: { color: string }[] } = {};
  state.events.forEach((event: any) => {
    const eventDate = format(new Date(event.start), "yyyy-MM-dd");
    if (!eventsByDay[eventDate]) {
      eventsByDay[eventDate] = [];
    }
    eventsByDay[eventDate].push({ color: event.color });
  });

  const eventsForSelectedDate = state.events.filter((event: any) =>
    isSameDay(new Date(event.start), new Date())
  );

  return (
    <div className="flex h-screen bg-gray-50 flex-col sm:flex-row">
      <div className="w-full sm:w-1/4 p-6 bg-gray-200">
        <div
          className="flex justify-between items-center"
          style={{ color: mainColor }}
        >
          <button onClick={() => handleMonthChange(-12)}>&lt;</button>
          <div className="text-xl font-bold">{format(currentDate, "yyyy")}</div>
          <button onClick={() => handleMonthChange(12)}>&gt;</button>
        </div>
        <MonthList
          currentDate={currentDate}
          handleMonthClick={handleMonthClick}
          mainColor={mainColor}
          secondColor={secondColor}
        />
      </div>

      <div className="flex-1 p-1 sm:p-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold" style={{ color: mainColor }}>
            {format(currentDate, "MMMM yyyy")}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleMonthChange(-1)}
              style={{ color: mainColor }}
            >
              &lt;
            </Button>
            <Button
              onClick={() => handleMonthChange(1)}
              style={{ color: mainColor }}
            >
              &gt;
            </Button>
            <Button onClick={handleGoToToday} style={{ color: mainColor }}>
              Today
            </Button>
          </div>
        </div>
        <DayGrid
          calendarDays={calendarDays}
          currentDate={currentDate}
          eventsByDay={eventsByDay}
          handleDayClick={() => {}}
          mainColor={mainColor}
          secondColor={secondColor}
        />
      </div>

      {isModalVisible && (
        <EventListModal
          visible={isModalVisible}
          events={eventsForSelectedDate}
          date={new Date()}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default MonthlyView;
