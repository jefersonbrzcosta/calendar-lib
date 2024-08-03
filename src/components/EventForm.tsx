import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { CalendarEvent } from '../types/calendar';
import { Form, Input, Button, TimePicker, message } from 'antd';
import moment, { Moment } from 'moment';
import { format } from 'date-fns';

const { RangePicker } = TimePicker;

interface EventFormProps {
  onClose: () => void;
  existingEvent?: CalendarEvent;
  onBackToList: () => void;
  selectedDate: Date; 
}

const EventForm: React.FC<EventFormProps> = ({
  existingEvent,
  onBackToList,
  selectedDate,
}) => {
  const { dispatch, state } = useCalendarContext();
  const [form] = Form.useForm();

  const initialStart = moment(selectedDate).startOf('day').add(9, 'hours');
  const initialEnd = moment(selectedDate).startOf('day').add(10, 'hours');

  const [range, setRange] = useState<Moment[]>([
    existingEvent ? moment(existingEvent.start) : initialStart,
    existingEvent ? moment(existingEvent.end) : initialEnd,
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
    if (existingEvent) {
      form.setFieldsValue({
        title: existingEvent.title,
        description: existingEvent.description,
        range: [moment(existingEvent.start), moment(existingEvent.end)],
        location: existingEvent.location,
        guests: existingEvent.guests,
        color: existingEvent.color,
      });
    } else {

      form.setFieldsValue({
        title: eventData.title,
        description: eventData.description,
        range: [range[0], range[1]],
        location: eventData.location,
        guests: eventData.guests,
        color: eventData.color,
      });
    }
  }, [existingEvent, form, range, eventData]);

  const handleFormChange = (changedValues: any) => {
    setEventData({ ...eventData, ...changedValues });
  };

  const handleSubmit = () => {
    const { availableDays, startHour, endHour, allowOverlapping } = state.settings;
    const [start, end] = range; 


    if (!availableDays.includes(start.day()) || !availableDays.includes(end.day())) {
      message.error('Event must be scheduled on available days');
      return;
    }

    const startHourTime = moment(startHour, 'HH:mm');
    const endHourTime = moment(endHour, 'HH:mm');

    if (start.isBefore(startHourTime, 'minute') || end.isAfter(endHourTime, 'minute')) {
      message.error('Event must be scheduled within available hours');
      return;
    }

    if (!allowOverlapping) {
      const overlappingEvent = state.events.find((event: any) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        return (
          eventStart.isSame(selectedDate, 'day') &&
          ((start.isBetween(eventStart, eventEnd, undefined, '[)') || end.isBetween(eventStart, eventEnd, undefined, '(]')) ||
          start.isSame(eventStart) || end.isSame(eventEnd))
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
      start: moment(selectedDate)
        .hour(start.hour())
        .minute(start.minute())
        .second(0)
        .toISOString(), 
      end: moment(selectedDate)
        .hour(end.hour())
        .minute(end.minute())
        .second(0)
        .toISOString(),
    };

    if (existingEvent) {
      dispatch({ type: 'UPDATE_EVENT', payload: updatedEventData });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: updatedEventData });
    }

    form.resetFields();
    setRange([initialStart, initialEnd]);
    setEventData({
      id: Date.now(),
      title: '',
      description: '',
      start: initialStart.toISOString(),
      end: initialEnd.toISOString(),
      location: '',
      guests: '',
      color: '#0000ff',
    });

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
          label={`Event Time for ${format(selectedDate, 'MMMM d, yyyy')}`}
          rules={[{ required: true, message: 'Please select a time range' }]}
        >
          <RangePicker
            disabledTime={() => ({
              disabledHours: () => {
                const hours = [];
                const startHour = parseInt(state.settings.startHour.split(':')[0], 10);
                const endHour = parseInt(state.settings.endHour.split(':')[0], 10);
                for (let i = 0; i < 24; i++) {
                  if (i < startHour || i >= endHour) {
                    hours.push(i);
                  }
                }
                return hours;
              },
            })}
            format="HH:mm"
            minuteStep={30}
            value={range}
            onChange={(times) => {
              if (times && times.length === 2) {
                setRange([times[0]!, times[1]!]);
                setEventData({
                  ...eventData,
                  start: times[0]!.toISOString(),
                  end: times[1]!.toISOString(),
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
