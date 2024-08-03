import { useReducer, createContext, useContext, ReactNode } from 'react';
import { CalendarState, CalendarAction } from '../types/calendar';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    description: 'Discuss project milestones and deadlines.',
    start: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(), // 9:00 AM
    end: new Date(tomorrow.setHours(10, 0, 0, 0)).toISOString(), // 10:00 AM
    location: 'Conference Room A',
    guests: 'Alice, Bob, Charlie',
    color: '#FF5733',
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Review code for the new feature implementation.',
    start: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(), // 11:00 AM
    end: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(), // 12:00 PM
    location: 'Online - Zoom',
    guests: 'Dev Team',
    color: '#33A1FF',
  },
  {
    id: 3,
    title: 'Lunch with Client',
    description: 'Discuss ongoing partnership and future opportunities.',
    start: new Date(tomorrow.setHours(13, 0, 0, 0)).toISOString(),
    end: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
    location: 'Downtown Cafe',
    guests: 'Client X',
    color: '#FFC300',
  },
  {
    id: 4,
    title: 'Weekly Sync',
    description: 'Sync up with the team on progress and blockers.',
    start: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    end: new Date(tomorrow.setHours(16, 0, 0, 0)).toISOString(),
    location: 'Conference Room B',
    guests: 'All Hands',
    color: '#DAF7A6',
  },
];

const initialState: CalendarState = {
  events: mockEvents,
  view: 'month',
  currentDate: new Date(),
  settings: {
    availableDays: [1, 2, 3, 4, 5],
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
