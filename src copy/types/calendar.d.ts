// src/types/calendar.d.ts
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start: string; // Start date and time
  end: string;   // End date and time
  location: string;
  guests: string; // Comma-separated guest list
  color: string; // Event color
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface CalendarState {
  events: CalendarEvent[];
  view: ViewType;
  currentDate: Date;
}

export interface CalendarAction {
  type: 'ADD_EVENT' | 'REMOVE_EVENT' | 'UPDATE_EVENT' | 'SET_VIEW' | 'SET_DATE';
  payload?: any;
}
