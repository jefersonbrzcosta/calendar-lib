import React, { useState, useEffect, useRef } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  isSameDay,
  isToday,
} from 'date-fns';
import EventListModal from '../EventListModal';
import { TimeColumn } from './shared/TimeColumn';
import { NavigationHeader } from './shared/NavigationHeader';
import { getCurrentTimePosition, hours } from '../utils';
import AnimationWrapper from './shared/AnimationWrapper';

const WeeklyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container

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
      dispatch({ type: 'SET_DATE', payload: newDate });
      setCurrentDate(state.currentDate);
    }, 300); // Duration of the exit animation
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: 'SET_DATE', payload: today });
    scrollToCurrentHour();
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalVisible(true);
  };

  const startWeek = startOfWeek(currentDate);
  const endWeek = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek });

  const eventsByDay: { [key: string]: { title: string; color: string; start: string; end: string }[] } = {};
  state.events.forEach((event: any) => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
    if (!eventsByDay[eventDate]) {
      eventsByDay[eventDate] = [];
    }
    eventsByDay[eventDate].push({
      title: event.title,
      color: event.color,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
    });
  });

  const getEventPosition = (eventStart: Date, eventEnd: Date) => {
    const totalMinutesInDay = 24 * 60;
    const startMinutes = eventStart.getHours() * 59 + eventStart.getMinutes() + 27;
    const endMinutes = eventEnd.getHours() * 59 + eventEnd.getMinutes() + 27;

    const top = (startMinutes / totalMinutesInDay) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutesInDay) * 100;

    return {
      top: `${top}%`,
      height: `${height}%`,
    };
  };


  const scrollToCurrentHour = () => {
    if (containerRef.current) {
      const now = new Date();
      const scrollPosition = ((now.getHours() * 60 + now.getMinutes()) / 1440) * containerRef.current.scrollHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  };

  const eventsForSelectedDate: any = state.events.filter((event: any) =>
    isSameDay(new Date(event.start), selectedDate || new Date())
  );

  return (
    <AnimationWrapper>
      <div className="flex-1 relative" ref={containerRef}>
        <NavigationHeader
          title={`${format(startWeek, 'MMMM d')} - ${format(endWeek, 'MMMM d, yyyy')}`}
          onPrev={() => handleWeekChange(-1)}
          onNext={() => handleWeekChange(1)}
          onToday={handleGoToToday}
        />
        <div className='flex row'>
              <TimeColumn />
              <div className="grid grid-cols-7 gap-2 w-10/12">
                {/* Weekday Columns */}
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = eventsByDay[format(day, 'yyyy-MM-dd')] || [];
                  return (
                    <div
                      key={dayIndex}
                      className={`flex flex-col space-y-0 relative border-l border-gray-200 bg-white`}
                    >
                      <div
                        className={`text-center text-sm font-semibold h-12 pt-3 text-white ${
                          isToday(day) ? ' bg-indigo-600' : 'bg-gray-400'
                        }`}
                      >
                        {format(day, 'EEE d')}
                      </div>

                      {/* Time Slots */}
                      {hours.map((_, index) => (
                        <div
                          key={index}
                          className="border-t border-gray-200 h-24 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleDayClick(day)}
                        >
                          {format(currentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && isToday(currentDate) && <div
                          className="absolute left-0 right-0 h-0.5 bg-red-500"
                          style={{ top: `${getCurrentTimePosition()}%` }}
                        />}
                        </div>
                      ))}

                      {/* Render Events */}
                      {dayEvents.map((event, eventIndex) => {
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
                            <div className="text-sm font-bold">{format(eventStart, 'h:mm a')}</div>
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

export default WeeklyView;
