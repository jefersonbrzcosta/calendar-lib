// src/components/Configuration.tsx
import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { Checkbox, TimePicker, Button, Switch, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment, { Moment } from 'moment';

const Configuration: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [availableDays, setAvailableDays] = useState<number[]>(state.settings.availableDays);
  const [startHour, setStartHour] = useState<Moment>(moment(state.settings.startHour, 'HH:mm'));
  const [endHour, setEndHour] = useState<Moment>(moment(state.settings.endHour, 'HH:mm'));
  const [allowOverlapping, setAllowOverlapping] = useState<boolean>(state.settings.allowOverlapping);

  useEffect(() => {
    // Synchronize local state with context state
    setAvailableDays(state.settings.availableDays);
    setStartHour(moment(state.settings.startHour, 'HH:mm'));
    setEndHour(moment(state.settings.endHour, 'HH:mm'));
    setAllowOverlapping(state.settings.allowOverlapping);
  }, [state.settings]);

  const handleDayChange = (checkedValues: number[]) => {
    setAvailableDays(checkedValues);
  };

  const handleSaveSettings = () => {
    if (startHour.isSameOrAfter(endHour)) {
      message.error('End time must be after start time');
      return;
    }

    dispatch({
      type: 'SET_SETTINGS',
      payload: {
        availableDays,
        startHour: startHour.format('HH:mm'),
        endHour: endHour.format('HH:mm'),
        allowOverlapping,
      },
    });

    message.success('Settings updated successfully');
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Configuration</h3>
      <div className="mb-4">
        <span className="font-semibold">Available Days:</span>
        <div className="flex space-x-2 mt-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Checkbox
              key={index}
              value={index}
              checked={availableDays.includes(index)}
              onChange={(e) => {
                const dayValue = e.target.value;
                if (e.target.checked) {
                  setAvailableDays([...availableDays, dayValue]);
                } else {
                  setAvailableDays(availableDays.filter((day) => day !== dayValue));
                }
              }}
            >
              {day}
            </Checkbox>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Start Hour:</span>
        <TimePicker
          value={startHour}
          onChange={(time) => setStartHour(time!)}
          format="HH:mm"
          minuteStep={30}
        />
      </div>
      <div className="mb-4">
        <span className="font-semibold">End Hour:</span>
        <TimePicker
          value={endHour}
          onChange={(time) => setEndHour(time!)}
          format="HH:mm"
          minuteStep={30}
        />
      </div>
      <div className="mb-4">
        <span className="font-semibold">Allow Overlapping Events:</span>
        <Switch
          checked={allowOverlapping}
          onChange={setAllowOverlapping}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      </div>
      <Button type="primary" onClick={handleSaveSettings}>
        Save Settings
      </Button>
    </div>
  );
};

export default Configuration;
