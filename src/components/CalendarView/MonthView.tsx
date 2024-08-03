// src/components/CalendarView/MonthView.tsx
import React, { useState } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { CalendarEvent } from '../../types/calendar';
import EventDetailsModal from '../EventDetailsModal';
import EventForm from '../EventForm';
import { message } from 'antd';

const MonthView: React.FC = () => {
  const { state } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [newEventDate, setNewEventDate] = useState<Date | null>(null);

  const currentMonth = state.currentDate;

  const { availableDays } = state.settings;

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);

  const days = eachDayOfInterval({
    start: startWeek,
    end: endWeek,
  });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handleDayClick = (day: Date) => {
    if (!availableDays.includes(day.getDay())) {
      message.error('This day is unavailable for scheduling.');
      return;
    }
    setNewEventDate(day);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-lg text-gray-600">
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className="grid grid-cols-7 gap-2">
          {week.map((day) => {
            const eventsForDay: CalendarEvent[] = state.events.filter((event) =>
              isSameDay(new Date(event.start), day)
            );

            const isDayAvailable = availableDays.includes(day.getDay());

            return (
              <div
                key={day.toISOString()}
                className={`p-2 border rounded-lg text-center transition ${
                  isToday(day) ? 'bg-blue-100' : 'hover:bg-gray-200'
                } ${
                  !isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-black'
                } ${
                  !isDayAvailable ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="text-sm font-semibold">{format(day, 'd')}</div>
                <div className="mt-1 flex justify-center space-x-1">
                  {eventsForDay.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-full w-2 h-2 mx-auto cursor-pointer"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                      onClick={() => setSelectedEvent(event)}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
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

export default MonthView;
