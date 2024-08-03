// src/components/EventDetailsModal.tsx
import React from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import { Modal, Button, Space } from 'antd';

interface EventDetailsModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, onEdit }) => {
  const { dispatch } = useCalendarContext();

  const handleDelete = () => {
    dispatch({ type: 'REMOVE_EVENT', payload: event.id });
    onClose();
  };

  return (
    <Modal
      visible={true}
      title={event.title}
      onCancel={onClose}
      footer={[
        <Button key="edit" onClick={() => onEdit(event)} type="primary">
          Edit
        </Button>,
        <Button key="delete" onClick={handleDelete} danger>
          Delete
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical">
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <p>
          <strong>Start:</strong> {new Date(event.start).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(event.end).toLocaleString()}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Guests:</strong> {event.guests}
        </p>
        <div>
          <strong>Color:</strong>{' '}
          <span
            style={{
              backgroundColor: event.color,
              width: '20px',
              height: '20px',
              display: 'inline-block',
              borderRadius: '50%',
            }}
          ></span>
        </div>
      </Space>
    </Modal>
  );
};

export default EventDetailsModal;
