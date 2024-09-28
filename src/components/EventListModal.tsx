// src/components/EventListModal.tsx
import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "antd"; // Import Popconfirm for confirmation
import { CalendarEvent } from "../types/calendar";
import { format } from "date-fns";
import EventForm from "./CalendarView/shared/EventForm";
import "./EventListModal.css"; // Import the CSS for custom styles
import EventItem from "./CalendarView/shared/EventItem";

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
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };

  const handleClose = () => {
    setShowForm(false);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      title={format(date, "EEEE, MMMM d, yyyy")}
      className="custom-modal"
      bodyProps={{
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
        height: "80vh",
      }}
    >
      <div
        className="modal-container flex overflow-hidden relative flex-col justify-between"
        ref={formRef}
      >
        <div
          className={`event-list transition-all duration-500 flex-col ${
            showForm
              ? "translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
        >
          {events.length === 0 ? (
            <div className="text-center text-gray-500 mb-4">
              No events for this day
            </div>
          ) : (
            <ul className="space-y-3 mb-4">
              {events.map((event) => (
                <EventItem
                  props={{
                    event,
                    setSelectedEvent,
                    setShowForm,
                    handleCloseModal: handleClose,
                  }}
                />
              ))}
            </ul>
          )}
        </div>
        <Button type="primary" className="w-full" onClick={handleAddEvent}>
          Add Event
        </Button>

        <div
          className={`event-form absolute top-0 right-0 w-full transition-all duration-500 ${
            showForm
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <EventForm
            onClose={handleClose}
            existingEvent={selectedEvent}
            onBackToList={handleBackToList}
            selectedDate={date}
            handleCloseModal={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EventListModal;
