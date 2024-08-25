import { useReducer, createContext, useContext, ReactNode } from 'react';
import { CalendarState, CalendarAction } from '../types/calendar';
import { mockEvents } from '../components/utils';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const initialState: CalendarState = {
  events: mockEvents,
  view: 'month',
  currentDate: new Date(),
  calendarColor: "indigo",
  settings: {
    availableDays: [1, 2, 3, 4, 5, 6, 7],
    startHour: '08:00',
    endHour: '18:00',
    allowOverlapping: true,
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

const CalendarContext = createContext<any>({
  state: initialState,
  dispatch: () => null,
});

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  return useContext(CalendarContext);
};
