import React, { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "../../../context/CalendarContext";
import { format, isSameDay, isToday } from "date-fns";
import EventListModal from "../../EventListModal";
import { TimeColumn } from "../shared/TimeColumn";
import { NavigationHeader } from "../shared/NavigationHeader";
import { getWeekDays, changeWeek } from "../../../utils/dateUtils";
import WeekGrid from "./WeekGrid";
import AnimationWrapper from "../shared/AnimationWrapper";
import { hours } from "../../utils";

const WeeklyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
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

  const handleWeekChange = (offset: number) => {
    const newDate = changeWeek(currentDate, offset);
    setCurrentDate(newDate);
    dispatch({ type: "SET_DATE", payload: newDate });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: "SET_DATE", payload: today });
    scrollToCurrentHour();
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const eventsAtHour = state.events.filter((event: any) => {
      const eventStart = new Date(event.start);
      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
    });
    setSelectedEvents(eventsAtHour);
    setIsModalVisible(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvents([event]);
    setIsModalVisible(true);
  };

  const weekDays = getWeekDays(currentDate);

  const scrollToCurrentHour = () => {
    if (containerRef.current) {
      const now = new Date();
      const scrollPosition =
        ((now.getHours() * 60 + now.getMinutes()) / 1440) *
        containerRef.current.scrollHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  };

  return (
    <AnimationWrapper>
      <div className="flex-1 relative" ref={containerRef}>
        <NavigationHeader
          title={`${format(weekDays[0], "MMMM d")} - ${format(
            weekDays[6],
            "MMMM d, yyyy"
          )}`}
          onPrev={() => handleWeekChange(-1)}
          onNext={() => handleWeekChange(1)}
          onToday={handleGoToToday}
          calendarColor={mainColor}
        />
        <div className="flex row">
          <TimeColumn />
          <WeekGrid
            weekDays={weekDays}
            events={state.events}
            hours={hours}
            mainColor={mainColor}
            secondColor={state.settings.secondColor}
            handleTimeSlotClick={handleTimeSlotClick}
            handleEventClick={handleEventClick}
          />
        </div>
      </div>

      {/* Render Event List Modal */}
      {selectedEvents.length > 0 && (
        <EventListModal
          visible={isModalVisible}
          events={selectedEvents ?? []}
          date={selectedEvents[0]?.start}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </AnimationWrapper>
  );
};

export default WeeklyView;
