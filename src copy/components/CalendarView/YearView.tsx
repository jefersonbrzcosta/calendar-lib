// src/components/CalendarView/YearView.tsx
import React, { useState } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  format,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  addMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { CalendarEvent } from '../../types/calendar';
import EventDetailsModal from '../EventDetailsModal';
import EventForm from '../EventForm';
import { message } from 'antd';

const YearView: React.FC = () => {
  const { state } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [newEventDate, setNewEventDate] = useState<Date | null>(null);

  const currentYear = state.currentDate;
  const { availableDays } = state.settings;

  const startYear = startOfYear(currentYear);
  const endYear = endOfYear(currentYear);

  const months = Array.from({ length: 12 }).map((_, index) =>
    addMonths(startYear, index)
  );

  const handleDayClick = (day: Date) => {
    if (!availableDays.includes(day.getDay())) {
      message.error('This day is unavailable for scheduling.');
      return;
    }
    setNewEventDate(day);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-center font-bold text-xl mb-4">
        {format(currentYear, 'yyyy')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => {
          const startMonth = startOfMonth(month);
          const endMonth = endOfMonth(month);

          const days = eachDayOfInterval({
            start: startOfWeek(startMonth),
            end: endOfMonth(endMonth),
          });

          return (
            <div
              key={month.toISOString()}
              className={`p-2 border rounded-lg ${
                isSameMonth(month, state.currentDate) ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <h3 className="text-center font-bold text-lg mb-2">
                {format(month, 'MMMM')}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-xs text-center font-bold text-gray-500">
                    {day[0]}
                  </div>
                ))}
                {days.map((day) => {
                  const eventsForDay: CalendarEvent[] = state.events.filter((event) =>
                    isSameDay(new Date(event.start), day)
                  );

                  const isDayAvailable = availableDays.includes(day.getDay());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`h-6 text-xs text-center rounded-lg ${
                        isToday(day)
                          ? 'bg-blue-500 text-white'
                          : isSameMonth(day, month)
                          ? 'text-black'
                          : 'text-gray-300'
                      } ${
                        !isDayAvailable ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      {format(day, 'd')}
                      <div className="flex justify-center mt-1 space-x-1">
                        {eventsForDay.length > 0 && (
                          <div className="flex space-x-1">
                            {eventsForDay.slice(0, 3).map((event, index) => (
                              <div
                                key={index}
                                className="rounded-full w-1.5 h-1.5 cursor-pointer"
                                style={{ backgroundColor: event.color }}
                                title={event.title}
                                onClick={() => setSelectedEvent(event)}
                              ></div>
                            ))}
                            {eventsForDay.length > 3 && (
                              <span className="text-xs text-gray-500">+</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={(event) => setEditEvent(event)}
        />
      )}
      {editEvent && (
        <EventForm
          onClose={() => setEditEvent(null)}
          existingEvent={editEvent}
        />
      )}
      {newEventDate && (
        <EventForm
          onClose={() => setNewEventDate(null)}
          existingEvent={{
            id: Date.now(),
            title: '',
            description: '',
            start: newEventDate.toISOString(),
            end: newEventDate.toISOString(),
            location: '',
            guests: '',
            color: '#0000ff',
          }}
        />
      )}
    </div>
  );
};

export default YearView;
