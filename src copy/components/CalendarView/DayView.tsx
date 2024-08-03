// src/components/CalendarView/DayView.tsx
import React, { useState } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import { format, isToday, isSameDay, setHours } from 'date-fns';
import { CalendarEvent } from '../../types/calendar';
import EventDetailsModal from '../EventDetailsModal';
import EventForm from '../EventForm';
import { message } from 'antd';
import moment from 'moment';

const hours = Array.from({ length: 24 }, (_, i) => i);

const DayView: React.FC = () => {
  const { state } = useCalendarContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [newEventTime, setNewEventTime] = useState<Date | null>(null);

  const day = state.currentDate;

  const { availableDays, startHour, endHour } = state.settings;
  const startHourTime = moment(startHour, 'HH:mm');
  const endHourTime = moment(endHour, 'HH:mm');

  const isTimeAvailable = (hour: number) => {
    const currentTime = moment().hour(hour).minute(0);
    return (
      availableDays.includes(day.getDay()) &&
      currentTime.isSameOrAfter(startHourTime) &&
      currentTime.isBefore(endHourTime)
    );
  };

  const handleHourClick = (hour: number) => {
    if (!isTimeAvailable(hour)) {
      message.error('This time is unavailable for scheduling.');
      return;
    }
    setNewEventTime(setHours(day, hour));
  };

  const eventsToday: CalendarEvent[] = state.events.filter(
    (event) => isSameDay(new Date(event.start), day) || isSameDay(new Date(event.end), day)
  );

  return (
    <div className="border rounded-lg shadow-md bg-white">
      <div className={`p-2 text-center border-b ${isToday(day) ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <div className="font-bold text-lg">{format(day, 'EEEE, MMMM d, yyyy')}</div>
      </div>
      <div className="flex flex-col">
        {hours.map((hour) => (
          <div
            key={hour}
            className={`h-16 border-b border-gray-200 relative ${
              isToday(day) && new Date().getHours() === hour ? 'bg-blue-50' : ''
            } ${!isTimeAvailable(hour) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleHourClick(hour)}
          >
            <span className="block text-xs text-gray-500 px-2">{hour}:00</span>
            {eventsToday.map(
              (event) =>
                new Date(event.start).getHours() <= hour &&
                new Date(event.end).getHours() >= hour && (
                  <div
                    key={event.id}
                    className="absolute left-12 right-0 rounded-lg p-1 m-1 text-sm overflow-hidden whitespace-nowrap cursor-pointer"
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 'calc(100% - 48px)',
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
        ))}
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

export default DayView;
