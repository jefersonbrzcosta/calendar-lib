import React, { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "../../../context/CalendarContext";
import { format, isToday } from "date-fns";
import EventListModal from "../../EventListModal";
import { TimeColumn } from "../shared/TimeColumn";
import { NavigationHeader } from "../shared/NavigationHeader";
import { changeDay, filterEventsForDate } from "../../../utils/dateUtils";
import DayGrid from "./DayGrid";
import AnimationWrapper from "../shared/AnimationWrapper";

const DayView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mainColor } = state.settings;

  useEffect(() => {
    if (state.currentDate.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(state.currentDate);
    }
  }, [state.currentDate, currentDate]);

  useEffect(() => {
    if (isToday(currentDate)) {
      scrollToCurrentHour();
    }
  }, [currentDate]);

  const handleDayChange = (offset: number) => {
    const newDate = changeDay(currentDate, offset);
    setCurrentDate(newDate);
    dispatch({ type: "SET_DATE", payload: newDate });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: "SET_DATE", payload: today });
    scrollToCurrentHour();
  };

  const handleTimeSlotClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalVisible(true);
  };

  const scrollToCurrentHour = () => {
    if (containerRef.current) {
      const now = new Date();
      const scrollPosition =
        ((now.getHours() * 60 + now.getMinutes()) / 1440) *
        containerRef.current.scrollHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  };

  const eventsForSelectedDate = filterEventsForDate(state.events, currentDate);

  return (
    <AnimationWrapper>
      <div className="flex-1 relative text-sm sm:text-lg" ref={containerRef}>
        <NavigationHeader
          title={format(currentDate, "d, MMMM, yyyy")}
          onPrev={() => handleDayChange(-1)}
          onNext={() => handleDayChange(1)}
          onToday={handleGoToToday}
          calendarColor={mainColor}
        />

        <div className="flex row">
          <TimeColumn />
          <DayGrid
            currentDate={currentDate}
            events={eventsForSelectedDate}
            handleTimeSlotClick={handleTimeSlotClick}
            mainColor={mainColor}
          />
        </div>
      </div>

      {selectedDate && (
        <EventListModal
          visible={isModalVisible}
          events={eventsForSelectedDate}
          date={selectedDate}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </AnimationWrapper>
  );
};

export default DayView;
