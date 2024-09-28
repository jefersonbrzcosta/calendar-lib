import React, { useState, useEffect, useRef } from "react";
import { useCalendarContext } from "../../context/CalendarContext";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  isSameDay,
  isToday,
} from "date-fns";
import EventListModal from "../EventListModal";
import { TimeColumn } from "./shared/TimeColumn";
import { NavigationHeader } from "./shared/NavigationHeader";
import { getCurrentTimePosition, getEventPosition, hours } from "../utils";
import AnimationWrapper from "./shared/AnimationWrapper";

const WeeklyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]); // Store selected events
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container

  const { mainColor, secondColor } = state.settings; // Fetch mainColor from context

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
    setTimeout(() => {
      const newDate = addWeeks(currentDate, offset);
      setCurrentDate(newDate);
      dispatch({ type: "SET_DATE", payload: newDate });
    }, 300);
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
    setSelectedEvents([event]); // Show only the clicked event in the modal
    setIsModalVisible(true);
  };

  const startWeek = startOfWeek(currentDate);
  const endWeek = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek });

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
          title={`${format(startWeek, "MMMM d")} - ${format(
            endWeek,
            "MMMM d, yyyy"
          )}`}
          onPrev={() => handleWeekChange(-1)}
          onNext={() => handleWeekChange(1)}
          onToday={handleGoToToday}
          calendarColor={mainColor}
        />
        <div className="flex row">
          <TimeColumn />
          <div className="grid grid-cols-7 gap-2 w-10/12">
            {/* Weekday Columns */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = state.events.filter((event: any) =>
                isSameDay(new Date(event.start), day)
              );

              return (
                <div
                  key={dayIndex}
                  className={`flex flex-col space-y-0 relative border-l border-gray-500 bg-white`}
                  style={{
                    borderLeft:
                      dayIndex !== 0 ? `1px solid ${secondColor}` : "",
                  }}
                >
                  <div
                    className={`text-center text-sm font-semibold h-12 pt-3 text-white`}
                    style={{
                      backgroundColor: isToday(day) ? mainColor : secondColor, // Use mainColor here
                    }}
                  >
                    {format(day, "EEE d")}
                  </div>

                  {/* Time Slots */}
                  {hours.map((hour, index) => (
                    <div
                      key={index}
                      className="border-t border-gray-200 h-12 cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleTimeSlotClick(day, parseInt(hour.split(":")[0]))
                      }
                    >
                      {format(currentDate, "yyyy-MM-dd") ===
                        format(day, "yyyy-MM-dd") &&
                        isToday(currentDate) && (
                          <div
                            className="absolute left-0 right-0 h-0.5 bg-red-500"
                            style={{ top: `${getCurrentTimePosition()}%` }}
                          />
                        )}
                    </div>
                  ))}

                  {/* Render Events */}
                  {dayEvents.map((event: any, eventIndex: any) => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const position = getEventPosition(eventStart, eventEnd);

                    return (
                      <div
                        key={eventIndex}
                        className="absolute left-0 right-0 mx-2 rounded-lg shadow text-white px-2 cursor-pointer"
                        style={{
                          backgroundColor: event.color,
                          top: position.top,
                          height: position.height,
                        }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="text-sm font-bold">
                          {format(eventStart, "h:mm a")}
                        </div>
                        <div className="text-xs">{event.title}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render the Event List Modal */}
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
