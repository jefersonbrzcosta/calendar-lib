import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../../../context/CalendarContext';
import { CalendarEvent } from '../../../types/calendar';
import { Form, Input, Button, Select, message } from 'antd';
import moment from 'moment';
import { format } from 'date-fns';

const { Option } = Select;

interface EventFormProps {
  onClose: () => void;
  existingEvent?: any ;
  onBackToList: () => void;
  selectedDate: Date;
  handleCloseModal: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  existingEvent,
  onBackToList,
  selectedDate,
  handleCloseModal
}) => {
  const { dispatch, state } = useCalendarContext();
  const [form] = Form.useForm();

  const [eventData, setEventData] = useState<CalendarEvent>({
    id: existingEvent?.id || Date.now(),
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    start: existingEvent ? existingEvent.start : '',
    end: existingEvent ? existingEvent.end : '',
    location: existingEvent?.location || '',
    guests: existingEvent?.guests || '',
    color: existingEvent?.color || '#0000ff',
  });

  const { startHour, endHour } = state.settings;

  const startHourInt = parseInt(startHour.split(':')[0], 10);
  const endHourInt = parseInt(endHour.split(':')[0], 10);

  const hourOptions = Array.from({ length: endHourInt - startHourInt + 1 }, (_, i) => startHourInt + i);
  const minuteOptions = [0, 30];

  const [startHourSelected, setStartHourSelected] = useState<number>(startHourInt);
  const [startMinuteSelected, setStartMinuteSelected] = useState<number>(0);
  const [endHourSelected, setEndHourSelected] = useState<number>(startHourInt + 1);
  const [endMinuteSelected, setEndMinuteSelected] = useState<number>(0);

  useEffect(() => {
    if (existingEvent) {
      const eventStart = moment(existingEvent.start);
      const eventEnd = moment(existingEvent.end);
      setStartHourSelected(eventStart.hour());
      setStartMinuteSelected(eventStart.minute());
      setEndHourSelected(eventEnd.hour());
      setEndMinuteSelected(eventEnd.minute());
      form.setFieldsValue({
        title: existingEvent.title,
        description: existingEvent.description,
        location: existingEvent.location,
        guests: existingEvent.guests,
        color: existingEvent.color,
      });
    }
  }, [existingEvent, form]);

  const handleFormChange = (changedValues: any) => {
    setEventData({ ...eventData, ...changedValues });
  };

  const handleSubmit = () => {
    const start = moment(selectedDate).hour(startHourSelected).minute(startMinuteSelected).second(0);
    const end = moment(selectedDate).hour(endHourSelected).minute(endMinuteSelected).second(0);

    const { availableDays, allowOverlapping } = state.settings;

    if (!availableDays.includes(start.day()) || !availableDays.includes(end.day())) {
      message.error('Event must be scheduled on available days');
      return;
    }

    if (!allowOverlapping) {
      const overlappingEvent = state.events.find((event: any) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        return (
          eventStart.isSame(selectedDate, 'day') &&
          ((start.isBetween(eventStart, eventEnd, undefined, '[)') ||
            end.isBetween(eventStart, eventEnd, undefined, '(]')) ||
            start.isSame(eventStart) ||
            end.isSame(eventEnd))
        );
      });

      if (overlappingEvent) {
        message.error('This time slot is already booked. Please choose another time.');
        return;
      }
    }

    if (!end.isAfter(start)) {
      message.error('End time must be after start time');
      return;
    }

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
    setStartHourSelected(startHourInt);
    setStartMinuteSelected(0);
    setEndHourSelected(startHourInt + 1);
    setEndMinuteSelected(0);
    handleCloseModal();
    form.resetFields();
    message.success('Event scheduled successfully.');
  };

  return (
    <div className="px-4 py-6">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: eventData.title,
          description: eventData.description,
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

        <Form.Item label={`Event Time for ${format(selectedDate, 'MMMM d, yyyy')}`}>
          <div className="grid grid-cols-4 gap-2">
            <Select
              value={startHourSelected}
              onChange={(value) => setStartHourSelected(value)}
              placeholder="Start Hour"
            >
              {hourOptions.map((hour) => (
                <Option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </Option>
              ))}
            </Select>
            <Select
              value={startMinuteSelected}
              onChange={(value) => setStartMinuteSelected(value)}
              placeholder="Start Minute"
            >
              {minuteOptions.map((minute) => (
                <Option key={minute} value={minute}>
                  {minute.toString().padStart(2, '0')}
                </Option>
              ))}
            </Select>
            <Select
              value={endHourSelected}
              onChange={(value) => setEndHourSelected(value)}
              placeholder="End Hour"
            >
              {hourOptions.map((hour) => (
                <Option key={hour} value={hour}>
                  {hour.toString().padStart(2, '0')}
                </Option>
              ))}
            </Select>
            <Select
              value={endMinuteSelected}
              onChange={(value) => setEndMinuteSelected(value)}
              placeholder="End Minute"
            >
              {minuteOptions.map((minute) => (
                <Option key={minute} value={minute}>
                  {minute.toString().padStart(2, '0')}
                </Option>
              ))}
            </Select>
          </div>
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-2">
          <Form.Item name="guests" label="Guests (comma separated)">
            <Input />
          </Form.Item>
          <Form.Item name="color" label="Event Color">
            <Input type="color" />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-3">
          <Button key="cancel" onClick={onBackToList}>
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={form.submit}>
            {existingEvent ? 'Update Event' : 'Save Event'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EventForm;
