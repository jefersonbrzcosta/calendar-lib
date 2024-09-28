import {
  useReducer,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
} from "react";
import { CalendarState, CalendarAction } from "../types/calendar";

const CalendarContext = createContext<
  | {
      state: CalendarState;
      dispatch: Dispatch<CalendarAction>;
    }
  | undefined
>(undefined);

const calendarReducer = (
  state: CalendarState,
  action: CalendarAction
): CalendarState => {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "REMOVE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case "SET_VIEW":
      return { ...state, view: action.payload };
    case "SET_DATE":
      return { ...state, currentDate: action.payload };
    case "SET_SETTINGS":
      return { ...state, settings: action.payload };
    default:
      return state;
  }
};

export const CalendarProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: CalendarState;
}) => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  return (
    <CalendarContext.Provider value={{ state, dispatch }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }

  return context;
};
