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
import EventListModal from '../EventListModal';
import { NavigationHeader } from './shared/NavigationHeader';
import AnimationWrapper from './shared/AnimationWrapper';

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
    <AnimationWrapper>
      <div className={`w-1/4 bg-${state.calendarColor}-100 p-6`}>
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleMonthChange(-12)}
            className={`text-lg text-gray-600 hover:text-${state.calendarColor}-700`}
          >
            &lt;
          </button>
          <div className={`text-xl font-bold text-${state.calendarColor}-700`}>{format(currentDate, 'yyyy')}</div>
          <button
            onClick={() => handleMonthChange(12)}
            className={`text-lg text-gray-600 hover:text-${state.calendarColor}-700`}
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
                    ? `bg-${state.calendarColor}-200 rounded-md text-${state.calendarColor}-700`
                    : `text-gray-600 hover:text-${state.calendarColor}-700`
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
        <NavigationHeader
          title={format(currentDate, 'MMMM yyyy')}
          onPrev={() => handleMonthChange(-1)}
          onNext={() => handleMonthChange(1)}
          onToday={handleGoToToday}
          calendarColor={state.calendarColor}
        />

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

            `text-white bg-${state.calendarColor}`

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center h-24 cursor-pointer rounded-lg ${
                  isSelected ? `text-white bg-${state.calendarColor}` : isToday ? `bg-${state.calendarColor}-100` : ''
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
    </AnimationWrapper>
  );
};

export default MontlyView;
