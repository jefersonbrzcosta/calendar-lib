// src/components/CalendarView/WeekView.tsx
import React, { useState } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import {
  startOfWeek,
  addDays,
  format,
  isToday,
  isSameDay,
  isBefore,
  isAfter,
  setHours,
} from 'date-fns';
import { CalendarEvent } from '../../types/calendar';
import EventDetailsModal from '../EventDetailsModal';
import EventForm from '../EventForm';
import { message } from 'antd';
import moment from 'moment';

const hours = Array.from({ length: 24 }, (_, i) => i);

const WeekView: React.FC = () => {
  const { state } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [newEventTime, setNewEventTime] = useState<Date | null>(null);

  const startOfCurrentWeek = startOfWeek(state.currentDate);
  const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
    addDays(startOfCurrentWeek, index)
  );

  const { availableDays, startHour, endHour } = state.settings;
  const startHourTime = moment(startHour, 'HH:mm');
  const endHourTime = moment(endHour, 'HH:mm');

  const isTimeAvailable = (day: Date, hour: number) => {
    const currentTime = moment().hour(hour).minute(0);
    return (
      availableDays.includes(day.getDay()) &&
      currentTime.isSameOrAfter(startHourTime) &&
      currentTime.isBefore(endHourTime)
    );
  };

  const handleTimeSlotClick = (day: Date, hour: number) => {
    if (!isTimeAvailable(day, hour)) {
      message.error('This time is unavailable for scheduling.');
      return;
    }
    setNewEventTime(setHours(day, hour));
  };

  const eventsThisWeek: CalendarEvent[] = state.events.filter((event) => {
    return daysOfWeek.some((day) =>
      isSameDay(new Date(event.start), day) ||
      isSameDay(new Date(event.end), day) ||
      (isBefore(new Date(event.start), day) && isAfter(new Date(event.end), day))
    );
  });

  return (
    <div className="grid grid-cols-7 gap-1">
      {daysOfWeek.map((day) => (
        <div key={day.toISOString()} className="flex flex-col border-l">
          <div
            className={`p-2 text-center border-b ${
              isToday(day) ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <div className="font-bold">{format(day, 'EEEE')}</div>
            <div className={`text-sm ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
              {format(day, 'MMM d')}
            </div>
          </div>
          <div className="flex-1 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className={`h-16 border-b border-gray-200 ${
                  isSameDay(day, state.currentDate) && new Date().getHours() === hour ? 'bg-blue-50' : ''
                } ${
                  !isTimeAvailable(day, hour) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => handleTimeSlotClick(day, hour)}
              >
                <span className="block text-xs text-gray-500 px-2">{hour}:00</span>
              </div>
            ))}
            {eventsThisWeek.map(
              (event) =>
                isSameDay(new Date(event.start), day) && (
                  <div
                    key={event.id}
                    className="absolute rounded-lg p-1 m-1 text-sm overflow-hidden whitespace-nowrap cursor-pointer"
                    style={{
                      top: `${new Date(event.start).getHours() * 4}rem`,
                      height: `${
                        (new Date(event.end).getHours() - new Date(event.start).getHours()) * 4
                      }rem`,
                      left: '12px',
                      right: '0',
                      width: 'calc(100% - 24px)',
                      backgroundColor: event.color,
                      color: 'white',
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="font-bold">{event.title}</div>
                    <div className="text-xs">{event.location}</div>
                  </div>
                )
            )}
          </div>
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
      {newEventTime && (
        <EventForm
          onClose={() => setNewEventTime(null)}
          existingEvent={{
            id: Date.now(),
            title: '',
            description: '',
            start: newEventTime.toISOString(),
            end: newEventTime.toISOString(),
            location: '',
            guests: '',
            color: '#0000ff',
          }}
        />
      )}
    </div>
  );
};

export default WeekView;
