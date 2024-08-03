// src/components/EventListModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Popconfirm, message } from 'antd'; // Import Popconfirm for confirmation
import { CalendarEvent } from '../types/calendar';
import { format } from 'date-fns';
import { useCalendarContext } from '../context/CalendarContext'; // Import context to update state
import EventForm from './EventForm';
import './EventListModal.css'; // Import the CSS for custom styles

interface EventListModalProps {
  visible: boolean;
  events: CalendarEvent[];
  date: Date;
  onClose: () => void;
}

const EventListModal: React.FC<EventListModalProps> = ({
  visible,
  events,
  date,
  onClose,
}) => {
  const { dispatch } = useCalendarContext(); // Use dispatch to update state
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const handleAddEvent = () => {
    setSelectedEvent(null); // Clear selected event when adding a new one
    setShowForm(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event); // Set selected event for editing
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  const handleClose = () => {
    setShowForm(false);
    onClose();
  };

  const handleDeleteEvent = (eventId: number) => {
    // Dispatch the action to remove the event
    dispatch({ type: 'REMOVE_EVENT', payload: eventId });
    message.success('Event deleted successfully.');
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleClose}
      footer={null}
      title={format(date, 'EEEE, MMMM d, yyyy')}
      className="custom-modal"
      bodyStyle={{
        padding: 0, // Remove padding for cleaner layout
        display: 'flex', // Ensure flex layout
        justifyContent: 'center', // Center content
        alignItems: 'center', // Center content vertically
        overflowY: 'auto', // Allow scrolling if content overflows
        height: '80vh', // Set a maximum height for the modal
      }}
    >
      <div className="modal-container relative" ref={formRef}>
        <div
          className={`event-list transition-all duration-500 ${
            showForm
              ? 'translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          }`}
        >
          {events.length === 0 ? (
            <div className="text-center text-gray-500 mb-4">No events for this day</div>
          ) : (
            <ul className="space-y-3 mb-4">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="bg-white shadow rounded-lg p-4 border-l-4"
                  style={{ borderColor: event.color }}
                >
                  <div className="font-bold text-lg">{event.title}</div>
                  <div className="text-gray-600">{event.description}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(event.start), 'hh:mm a')} -{' '}
                    {format(new Date(event.end), 'hh:mm a')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Location: {event.location ? event.location : 'Not specified'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Guests: {event.guests ? event.guests : 'No guests'}
                  </div>
                  <div className="flex justify-end mt-2 space-x-2">
                    <Button type="link" onClick={() => handleEditEvent(event)}>
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this event?"
                      onConfirm={() => handleDeleteEvent(event.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link">Delete</Button>
                    </Popconfirm>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Button type="primary" className="w-full" onClick={handleAddEvent}>
            Add Event
          </Button>
        </div>

        <div
          className={`event-form absolute top-0 right-0 w-full transition-all duration-500 ${
            showForm ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          <EventForm
            onClose={handleClose}
            existingEvent={selectedEvent}
            onBackToList={handleBackToList}
            selectedDate={date} 
          />
        </div>
      </div>
    </Modal>
  );
};

export default EventListModal;
