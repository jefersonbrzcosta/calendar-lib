export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start: string | number;
  end: string | number; 
  location: string;
  guests: string; 
  color: string;
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface CalendarState {
  events: CalendarEvent[];
  view: ViewType;
  currentDate: Date;
  calendarColor: string;
  settings: any;
}

export interface CalendarAction {
  type: 'ADD_EVENT' | 'REMOVE_EVENT' | 'UPDATE_EVENT' | 'SET_VIEW' | 'SET_DATE' | 'SET_SETTINGS';
  payload?: any;
}
