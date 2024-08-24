import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  isSameDay,
  isToday as checkIfToday,
} from 'date-fns';
import { Button, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import EventListModal from '../EventListModal';
import Configuration from '../Configuration';

// Mock Events for testing
const mockEvents = [
  {
    id: 1,
    title: 'Morning Meeting',
    description: 'Team sync-up',
    start: new Date().setHours(9, 0, 0, 0), // Today at 9:00 AM
    end: new Date().setHours(10, 0, 0, 0), // Today at 10:00 AM
    color: '#FF5733',
  },
  {
    id: 2,
    title: 'Lunch with Client',
    description: 'Discuss partnership',
    start: new Date().setHours(12, 0, 0, 0), // Today at 12:00 PM
    end: new Date().setHours(13, 0, 0, 0), // Today at 1:00 PM
    color: '#33A1FF',
  },
  {
    id: 3,
    title: 'Project Work',
    description: 'Development time',
    start: new Date().setHours(14, 0, 0, 0), // Today at 2:00 PM
    end: new Date().setHours(16, 0, 0, 0), // Today at 4:00 PM
    color: '#FFC300',
  },
  {
    id: 4,
    title: 'Weekly Sync',
    description: 'All-hands meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0), // Tomorrow at 3:00 PM
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0, 0, 0), // Tomorrow at 4:00 PM
    color: '#DAF7A6',
  },
];

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const WeeklyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container
  const [weekTransition, setWeekTransition] = useState(true); // Track the week change

  useEffect(() => {
    if (state.currentDate.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(state.currentDate);
    }
  }, [state.currentDate, currentDate]);

  useEffect(() => {
    if (checkIfToday(currentDate)) {
      scrollToCurrentHour();
    }
  }, [currentDate]);

  const handleWeekChange = (offset: number) => {
    setWeekTransition(false); // Trigger exit animation
    setTimeout(() => {
      const newDate = addWeeks(currentDate, offset);
      setCurrentDate(newDate);
      dispatch({ type: 'SET_DATE', payload: newDate });
      setWeekTransition(true); // Trigger enter animation
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
  mockEvents.forEach((event) => {
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
    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

    const top = (startMinutes / totalMinutesInDay) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutesInDay) * 100;

    return {
      top: `${top + 1.3}%`,
      height: `${height}%`,
    };
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    return (hour * 60 + minutes) / (24 * 60) * 100 + 1;
  };

  const scrollToCurrentHour = () => {
    if (containerRef.current) {
      const now = new Date();
      const scrollPosition = ((now.getHours() * 60 + now.getMinutes()) / 1440) * containerRef.current.scrollHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  };

  const eventsForSelectedDate: any = mockEvents.filter((event) =>
    isSameDay(new Date(event.start), selectedDate || new Date())
  );

  return (
    <div className="flex bg-gray-50">
      <div className="flex-1 p-10 relative" ref={containerRef}>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-gray-800">
            {format(startWeek, 'MMMM d')} - {format(endWeek, 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleWeekChange(-1)}
              className="text-lg text-gray-600 hover:text-indigo-700"
            >
              &lt;
            </Button>
            <Button
              onClick={() => handleWeekChange(1)}
              className="text-lg text-gray-600 hover:text-indigo-700"
            >
              &gt;
            </Button>
            <Button
              onClick={handleGoToToday}
              className="text-lg text-indigo-600 hover:text-indigo-700"
            >
              Today
            </Button>
            <Popover content={<Configuration />} trigger="click" placement="bottomRight">
              <Button
                icon={<SettingOutlined />}
                shape="circle"
                size="large"
                className="text-gray-500 hover:text-indigo-700"
                style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              />
            </Popover>
          </div>
        </div>

        {/* Weekly View Grid with Animation */}
        <TransitionGroup className="relative">
          {weekTransition && (
            <CSSTransition
              key={currentDate.toISOString()}
              timeout={300}
              classNames="fade"
            >
              <div className="grid grid-cols-8 gap-2">
                {/* Hour Column */}
                <div className="flex flex-col space-y-0">
                  <div className="h-12"></div> {/* Placeholder for aligning hours with days */}
                  {hours.map((hour, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-500 h-24 flex items-center justify-center border-b border-gray-200"
                    >
                      {hour}
                    </div>
                  ))}
                </div>

                {/* Weekday Columns */}
                {weekDays.map((day, dayIndex) => {
                  const isToday = checkIfToday(day);
                  const isSelected = isSameDay(day, currentDate);
                  const dayEvents = eventsByDay[format(day, 'yyyy-MM-dd')] || [];

                  return (
                    <div
                      key={dayIndex}
                      className={`flex flex-col space-y-0 relative border-l border-gray-200 bg-white`}
                    >
                      <div
                        className={`text-center text-sm font-semibold h-12 pt-3 ${
                          isSelected ? 'text-indigo-700' : isToday ? 'text-indigo-500' : 'text-gray-500'
                        }`}
                      >
                        {format(day, 'EEE d')}
                      </div>
                      {/* Time Slots */}
                      {hours.map((hour, index) => (
                        <div
                          key={index}
                          className="border-t border-gray-200 h-24 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleDayClick(day)}
                        ></div>
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

                      {/* Render Current Time Line */}
                      {isToday && (
                        <div
                          className="absolute left-0 right-0 h-0.5 bg-red-500"
                          style={{ top: `${getCurrentTimePosition()}%` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>

      {selectedDate && (
        <EventListModal
          visible={isModalVisible}
          events={eventsForSelectedDate}
          date={selectedDate}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default WeeklyView;
