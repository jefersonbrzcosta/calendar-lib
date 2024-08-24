import React, { useState, useEffect, useRef } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import { format, isSameDay, addDays, isToday as checkIfToday } from 'date-fns';
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

const DayView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleDayChange = (offset: number) => {
    const newDate = addDays(currentDate, offset);
    setCurrentDate(newDate);
    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: 'SET_DATE', payload: today });
    scrollToCurrentHour();
  };

  const handleTimeSlotClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalVisible(true);
  };

  const HOUR_HEIGHT = 96; // Height of each hour slot in pixels

  const getEventPosition = (eventStart: Date, eventEnd: Date) => {
    const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
    const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
  
    const top = (startMinutes * HOUR_HEIGHT) / 60; // Convert start time to pixels
    const height = ((endMinutes - startMinutes) * HOUR_HEIGHT) / 60; // Convert duration to pixels
  
    return {
      top: `${top + 49}px`,
      height: `${height}px`,
    };
  };
  
  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
    return `${(currentMinutes * HOUR_HEIGHT) / 60}px`; // Convert current time to pixels
  };

  const scrollToCurrentHour = () => {
    if (containerRef.current) {
      const now = new Date();
      const scrollPosition = ((now.getHours() * 60 + now.getMinutes()) / 1440) * containerRef.current.scrollHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  };

  const eventsForSelectedDate: any = mockEvents.filter((event) =>
    isSameDay(new Date(event.start), currentDate)
  );

  const isToday = checkIfToday(currentDate);

  return (
    <div className="flex bg-gray-50">
      <div className="flex-1 p-10 relative" ref={containerRef}>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-indigo-600">
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleDayChange(-1)}
              className="text-lg text-indigo-600 hover:text-indigo-700"
            >
              &lt;
            </Button>
            <Button
              onClick={() => handleDayChange(1)}
              className="text-lg text-indigo-600 hover:text-indigo-700"
            >
              &gt;
            </Button>
            <Button
              onClick={handleGoToToday}
              className="text-lg text-indigo-600 hover:text-indigo-700 "
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

        {/* Day View Grid */}
        <div className="grid grid-cols-[120px_1fr] gap-2">
          {/* Hour Column */}
          <div className="flex flex-col space-y-0">
            <div className="h-12"></div> {/* Placeholder for aligning hours with days */}
            {hours.map((hour, index) => (
              <div key={index} className="text-sm text-white bg-indigo-600 h-24 flex items-center justify-center border-b border-gray-200">
                {hour}
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div className="flex flex-col space-y-0 relative border-l border-gray-200 bg-white">
            <div
              className={`text-center text-md font-semibold h-12 pt-3 ${
                isToday ? 'text-white bg-indigo-600' : 'text-gray-500'
              }`}
            >
              {format(currentDate, 'EEEE')}
            </div>
            {/* Time Slots */}
            {hours.map((hour, index) => (
              <div
                key={index}
                className="border-t border-gray-200 h-24 cursor-pointer hover:bg-gray-100"
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
    </div>
  );
};

export default DayView;
