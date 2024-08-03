// src/context/CalendarContext.tsx
import React, { useReducer, createContext, useContext, ReactNode } from 'react';
import { CalendarState, CalendarAction } from '../types/calendar';
import moment from 'moment';

interface CalendarContextType {
  state: CalendarState;
  dispatch: React.Dispatch<CalendarAction>;
}

const initialState: CalendarState = {
  events: [],
  view: 'month',
  currentDate: new Date(),
  settings: {
    availableDays: [1, 2, 3, 4, 5],
    startHour: '09:00',
    endHour: '17:00',
  },
};

const calendarReducer = (state: CalendarState, action: CalendarAction): CalendarState => {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'REMOVE_EVENT':
      return { ...state, events: state.events.filter(event => event.id !== action.payload) };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_DATE':
      return { ...state, currentDate: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

const CalendarContext = createContext<CalendarContextType>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using context
export const useCalendarContext = () => {
  return useContext(CalendarContext);
};
