// src/components/ConfigScreen.tsx
import React, { useState, useEffect } from 'react';
import { Checkbox, TimePicker, Button, Card } from 'antd';
import { useCalendarContext } from '../context/CalendarContext';
import moment, { Moment } from 'moment';

interface ConfigScreenProps {
  onClose: () => void;
}

const defaultAvailableDays = [1, 2, 3, 4, 5]; // Default: Monday to Friday

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onClose }) => {
  const { state, dispatch } = useCalendarContext();
  const [availableDays, setAvailableDays] = useState<number[]>(defaultAvailableDays);
  const [startHour, setStartHour] = useState<Moment>(moment('09:00', 'HH:mm'));
  const [endHour, setEndHour] = useState<Moment>(moment('17:00', 'HH:mm'));

  useEffect(() => {
    // Load existing settings if available
    const settings = localStorage.getItem('calendarSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setAvailableDays(parsedSettings.availableDays || defaultAvailableDays);
      setStartHour(moment(parsedSettings.startHour || '09:00', 'HH:mm'));
      setEndHour(moment(parsedSettings.endHour || '17:00', 'HH:mm'));
    }
  }, []);

  const handleSave = () => {
    const settings = {
      availableDays,
      startHour: startHour.format('HH:mm'),
      endHour: endHour.format('HH:mm'),
    };
    localStorage.setItem('calendarSettings', JSON.stringify(settings));
    onClose();
  };

  const daysOfWeek = [
    { label: 'Sunday', value: 0 },
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
  ];

  return (
    <Card title="Configuration" style={{ maxWidth: 600, margin: 'auto' }}>
      <div>
        <h3>Available Days</h3>
        <Checkbox.Group
          options={daysOfWeek}
          value={availableDays}
          onChange={(checkedValues) => setAvailableDays(checkedValues as number[])}
        />
      </div>
      <div className="mt-4">
        <h3>Available Hours</h3>
        <div>
          <TimePicker
            value={startHour}
            onChange={(time) => time && setStartHour(time)}
            format="HH:mm"
            minuteStep={30}
          />
          <span className="mx-2">to</span>
          <TimePicker
            value={endHour}
            onChange={(time) => time && setEndHour(time)}
            format="HH:mm"
            minuteStep={30}
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={onClose} style={{ marginRight: '8px' }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </Card>
  );
};

export default ConfigScreen;
