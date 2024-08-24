import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday as checkIfToday,
  setMonth,
} from 'date-fns';
import { Button, Popover } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import EventListModal from '../EventListModal';
import Configuration from '../Configuration';
import './views.css';

const MontlyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (state.currentDate.toDateString() !== currentDate.toDateString()) {
      setCurrentDate(state.currentDate);
    }
  }, [state.currentDate, currentDate]);

  const handleMonthChange = (offset: number) => {
    const newDate = addMonths(currentDate, offset);
    setCurrentDate(newDate);
    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch({ type: 'SET_DATE', payload: today });
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalVisible(true);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonth(currentDate, monthIndex);
    setCurrentDate(newDate);
    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);


  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  const calendarDays = eachDayOfInterval({
    start: startWeek,
    end: endWeek,
  });


  const eventsByDay: { [key: string]: { color: string }[] } = {};
  state.events.forEach((event: any) => {
    const eventDate = format(new Date(event.start), 'yyyy-MM-dd');
    if (!eventsByDay[eventDate]) {
      eventsByDay[eventDate] = [];
    }
    eventsByDay[eventDate].push({ color: event.color });
  });

  const eventsForSelectedDate = state.events.filter((event: any) =>
    isSameDay(new Date(event.start), selectedDate || new Date())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 bg-indigo-100 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleMonthChange(-12)}
            className="text-lg text-gray-600 hover:text-indigo-700"
          >
            &lt;
          </button>
          <div className="text-xl font-bold text-indigo-700">{format(currentDate, 'yyyy')}</div>
          <button
            onClick={() => handleMonthChange(12)}
            className="text-lg text-gray-600 hover:text-indigo-700"
          >
            &gt;
          </button>
        </div>
        <ul className="mt-10">
          {Array.from({ length: 12 }).map((_, index) => {
            const monthDate = setMonth(startOfMonth(currentDate), index);
            return (
              <li
                key={index}
                className={`py-2 text-lg p-2 font-semibold cursor-pointer ${
                  monthDate.getMonth() === currentDate.getMonth()
                    ? 'text-indigo-700 bg-indigo-200 rounded-md'
                    : 'text-gray-600 hover:text-indigo-700'
                }`}
                onClick={() => handleMonthClick(index)}
              >
                {format(monthDate, 'MMMM')}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex-1 p-10 relative">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-gray-800">{format(currentDate, 'MMMM yyyy')}</div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleMonthChange(-1)}
              className="text-lg text-gray-600 hover:text-indigo-700"
            >
              &lt;
            </Button>
            <Button
              onClick={() => handleMonthChange(1)}
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
            {/* Configuration Icon with Popover */}
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

        <div className="grid grid-cols-7 gap-2 text-center text-lg font-semibold text-gray-500 mb-2">
          {days.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isToday = checkIfToday(day);
            const isSelected = isSameDay(day, currentDate);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isAvailableDay = state.settings.availableDays.includes(day.getDay());
            const dayString = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay[dayString] || [];

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center h-24 cursor-pointer rounded-lg ${
                  isSelected ? 'bg-indigo-700 text-white' : isToday ? 'bg-indigo-100' : ''
                } ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} ${
                  isAvailableDay ? '' : 'opacity-50 pointer-events-none'
                }`}
                onClick={() => isAvailableDay && handleDayClick(day)} 
              >
                <div className="text-xl font-semibold">{format(day, 'd')}</div>

                <div className="flex flex-wrap justify-center mt-1">
                  {dayEvents.slice(0, 6).map((event, idx) => (
                    <span
                      key={idx}
                      className="w-2 h-2 rounded-full m-0.5"
                      style={{ backgroundColor: event.color }}
                    ></span>
                  ))}
                </div>
                {dayEvents.length > 6 && (
                  <div className="flex flex-wrap justify-center mt-1">
                    {dayEvents.slice(6).map((event, idx) => (
                      <span
                        key={idx}
                        className="w-2 h-2 rounded-full m-0.5"
                        style={{ backgroundColor: event.color }}
                      ></span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-gray-600">
          <p>This month you have {state.events.length} tasks to do</p>
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

export default MontlyView;
