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
  setMonth,
  isToday,
} from 'date-fns';
import { Button } from 'antd';
import EventListModal from '../EventListModal';

const MonthlyView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(state.currentDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { mainColor, secondColor } = state.settings; // Fetch mainColor from context

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
      <div className="w-1/4 p-6 bg-gray-200" >
        <div className="flex justify-between items-center " style={{ color: mainColor }}>
          <button
            onClick={() => handleMonthChange(-12)}
            style={{ color: mainColor }}
          >
            &lt;
          </button>
          <div className="text-xl font-bold" >
            {format(currentDate, 'yyyy')}
          </div>
          <button
            onClick={() => handleMonthChange(12)}
            style={{ color: mainColor }}
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
                className={`py-2 text-lg p-2 font-semibold cursor-pointer addOpacity`}
                style={
                    monthDate.getMonth() === currentDate.getMonth()
                      ? { color: mainColor, opacity: 1, }
                      : { color: secondColor }
                  }
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
          <div className="text-2xl font-bold" style={{ color: mainColor }}>
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleMonthChange(-1)}
              className="text-lg"
              style={{ color: mainColor }}
            >
              &lt;
            </Button>
            <Button
              onClick={() => handleMonthChange(1)}
              className="text-lg"
              style={{ color: mainColor }}
            >
              &gt;
            </Button>
            <Button
              onClick={handleGoToToday}
              className="text-lg"
              style={{ color: mainColor }}
            >
              Today
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-lg font-semibold mb-2" style={{ color: "white", backgroundColor: secondColor}}>
          {days.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isAvailableDay = state.settings.availableDays.includes(day.getDay());
            const dayString = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay[dayString] || [];

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center h-24 cursor-pointer rounded-lg ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'} ${
                  isAvailableDay ? '' : 'opacity-50 pointer-events-none'
                }`}
                style={isToday(day) ? { color: "white", backgroundColor: mainColor} : { color: mainColor}}
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

export default MonthlyView;
