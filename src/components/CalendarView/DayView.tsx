import React, { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "../../context/CalendarContext";
import { format, isSameDay, addDays, isToday } from "date-fns";
import EventListModal from "../EventListModal";
import { TimeColumn } from "./shared/TimeColumn";
import { NavigationHeader } from "./shared/NavigationHeader";
import { getCurrentTimePosition, getEventPosition, hours } from "../utils";
import AnimationWrapper from "./shared/AnimationWrapper";

const DayView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mainColor } = state.settings; // Fetch mainColor from context

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
    const newDate = addDays(currentDate, offset);
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

  const eventsForSelectedDate: any = state.events.filter((event: any) =>
    isSameDay(new Date(event.start), currentDate)
  );

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

        {/* Day View Grid */}
        <div className="flex row">
          <TimeColumn />
          <div className="grid grid-cols-1 gap-2 w-10/12">
            {/* Day Column */}
            <div className="flex flex-col space-y-0 relative border-l border-gray-200 bg-white">
              <div
                className="text-center text-md font-semibold h-12 pt-3"
                style={{
                  backgroundColor: isToday(currentDate) ? mainColor : "#a0aec0", // Use mainColor
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
              {eventsForSelectedDate.map((event: any, eventIndex: any) => {
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
          </div>
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
