// src/components/EventForm.tsx
import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import { Form, Input, Button, DatePicker, Modal, message } from 'antd';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

interface EventFormProps {
  onClose: () => void;
  existingEvent?: CalendarEvent;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, existingEvent }) => {
  const { dispatch, state } = useCalendarContext();
  const [form] = Form.useForm();

  // Initialize the date range based on existing or new event
  const [range, setRange] = useState<Moment[]>([
    existingEvent ? moment(existingEvent.start) : moment().startOf('day').add(9, 'hours'),
    existingEvent ? moment(existingEvent.end) : moment().startOf('day').add(10, 'hours'),
  ]);

  const [eventData, setEventData] = useState<CalendarEvent>({
    id: existingEvent?.id || Date.now(),
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    start: existingEvent ? existingEvent.start : range[0].toISOString(),
    end: existingEvent ? existingEvent.end : range[1].toISOString(),
    location: existingEvent?.location || '',
    guests: existingEvent?.guests || '',
    color: existingEvent?.color || '#0000ff',
  });

  useEffect(() => {
    // Initialize form with event data or defaults
    if (existingEvent) {
      setEventData(existingEvent);
      setRange([moment(existingEvent.start), moment(existingEvent.end)]);
    }
    form.setFieldsValue({
      title: eventData.title,
      description: eventData.description,
      range: range,
      location: eventData.location,
      guests: eventData.guests,
      color: eventData.color,
    });
  }, [existingEvent, form, eventData, range]);

  const handleFormChange = (changedValues: any) => {
    setEventData({ ...eventData, ...changedValues });
  };

  const handleSubmit = () => {
    const { availableDays, startHour, endHour } = state.settings;
    const [start, end] = range; // Use range state for validation

    // Validate available days
    if (!availableDays.includes(start.day()) || !availableDays.includes(end.day())) {
      message.error('Event must be scheduled on available days');
      return;
    }

    // Validate available hours
    const startHourTime = moment(startHour, 'HH:mm');
    const endHourTime = moment(endHour, 'HH:mm');

    if (start.isBefore(startHourTime, 'minute') || end.isAfter(endHourTime, 'minute')) {
      message.error('Event must be scheduled within available hours');
      return;
    }

    // Ensure the end date/time is after the start date/time
    if (end.isSameOrBefore(start)) {
      message.error('End time must be after start time');
      return;
    }

    // Update event data with the correct times from range
    const updatedEventData = {
      ...eventData,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    if (existingEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: updatedEventData });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: updatedEventData });
    }
    onClose();
  };

  const disabledDate = (current: Moment) => {
    return current && current < moment().startOf('day');
  };

  const roundToNearest30Minutes = (time: Moment): Moment => {
    const minutes = time.minutes();
    const remainder = minutes % 30;
    if (remainder !== 0) {
      return time.clone().add(30 - remainder, 'minutes').startOf('minute');
    }
    return time;
  };

  return (
    <Modal
      visible={true}
      title={existingEvent ? 'Edit Event' : 'Create Event'}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          {existingEvent ? 'Update Event' : 'Save Event'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: eventData.title,
          description: eventData.description,
          range: range,
          location: eventData.location,
          guests: eventData.guests,
          color: eventData.color,
        }}
        onValuesChange={handleFormChange}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Event Title"
          rules={[{ required: true, message: 'Please enter the event title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Event Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="range"
          label="Event Date & Time"
          rules={[{ required: true, message: 'Please select a date range' }]}
        >
          <RangePicker
            disabledDate={disabledDate}
            showTime={{
              format: 'HH:mm',
              minuteStep: 30,
            }}
            format="YYYY-MM-DD HH:mm"
            value={range} // Controlled component
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const roundedStart = roundToNearest30Minutes(dates[0]!);
                const roundedEnd = roundToNearest30Minutes(dates[1]!);
                setRange([roundedStart, roundedEnd]);
                setEventData({
                  ...eventData,
                  start: roundedStart.toISOString(),
                  end: roundedEnd.toISOString(),
                });
              }
            }}
          />
        </Form.Item>
        <Form.Item name="location" label="Location">
          <Input />
        </Form.Item>
        <Form.Item name="guests" label="Guests (comma separated)">
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Event Color">
          <Input type="color" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventForm;
