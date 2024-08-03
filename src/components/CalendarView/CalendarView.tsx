// src/components/CalendarView/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../../context/CalendarContext';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
} from 'date-fns';
import EventForm from '../EventForm';
import ConfigScreen from '../ConfigScreen';
import { Button, Select, Space } from 'antd';

const { Option } = Select;

const CalendarView: React.FC = () => {
  const { state, dispatch } = useCalendarContext();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showConfigScreen, setShowConfigScreen] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const settings = localStorage.getItem('calendarSettings');
    if (settings) {
      dispatch({ type: 'SET_SETTINGS', payload: JSON.parse(settings) });
    }
  }, [dispatch]);

  const handlePrevious = () => {
    dispatch({
      type: 'SET_DATE',
      payload: (() => {
        switch (state.view) {
          case 'day':
            return subDays(state.currentDate, 1);
          case 'week':
            return subWeeks(state.currentDate, 1);
          case 'month':
            return subMonths(state.currentDate, 1);
          case 'year':
            return subYears(state.currentDate, 1);
          default:
            return state.currentDate;
        }
      })(),
    });
  };

  const handleNext = () => {
    dispatch({
      type: 'SET_DATE',
      payload: (() => {
        switch (state.view) {
          case 'day':
            return addDays(state.currentDate, 1);
          case 'week':
            return addWeeks(state.currentDate, 1);
          case 'month':
            return addMonths(state.currentDate, 1);
          case 'year':
            return addYears(state.currentDate, 1);
          default:
            return state.currentDate;
        }
      })(),
    });
  };

  const handleViewChange = (view: string) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const handleGoToToday = () => {
    dispatch({ type: 'SET_DATE', payload: new Date() });
  };

  return (
    <div>
      <Space className="flex justify-between items-center mb-4">
        <Button onClick={handlePrevious}>Previous</Button>
        <div className="flex items-center">
          <span className="mr-4 font-bold text-lg">{format(state.currentDate, 'MMMM yyyy')}</span>
          <Select value={state.view} onChange={handleViewChange}>
            <Option value="day">Day</Option>
            <Option value="week">Week</Option>
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>
        </div>
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={handleGoToToday} type="primary">
          Today
        </Button>
        <Button onClick={() => setShowEventForm(true)} type="primary">
          Register New Event
        </Button>
        <Button onClick={() => setShowConfigScreen(true)}>Configuration</Button>
      </Space>

      {showEventForm && <EventForm onClose={() => setShowEventForm(false)} />}
      {showConfigScreen && <ConfigScreen onClose={() => setShowConfigScreen(false)} />}

      {state.view === 'day' && <DayView />}
      {state.view === 'week' && <WeekView />}
      {state.view === 'month' && <MonthView />}
      {state.view === 'year' && <YearView />}
    </div>
  );
};

export default CalendarView;
