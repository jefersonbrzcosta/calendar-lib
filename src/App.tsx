import {
  CalendarProvider,
  useCalendarContext,
} from "./context/CalendarContext";
import MonthlyView from "./components/CalendarView/MonthlyView";
import WeeklyView from "./components/CalendarView/WeeklyView";
import DayView from "./components/CalendarView/DayView";
import { Tabs, ConfigProvider } from "antd";
import {
  CalendarOutlined,
  BarsOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { CalendarState } from "./types/calendar";
import { mockEvents } from "./components/utils";

function App() {
  const Body = () => {
    const { state, dispatch } = useCalendarContext();
    const { mainColor } = state.settings;

    const handleViewChange = (view: string) => {
      dispatch({ type: "SET_VIEW", payload: view });
    };

    return (
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              inkBarColor: mainColor,
              itemActiveColor: mainColor,
              itemHoverColor: mainColor,
              itemSelectedColor: mainColor,
              itemColor: "gray",
            },
          },
        }}
      >
        <div className="w-full flex flex-col">
          <div className="px-2 sm:px-4 bg-white shadow-lg rounded-lg">
            <Tabs
              defaultActiveKey="month"
              activeKey={state.view}
              onChange={handleViewChange}
              size="small"
              tabBarGutter={16}
              tabBarStyle={{
                marginBottom: "1rem",
                color: mainColor,
              }}
              items={[
                {
                  key: "month",
                  label: "Monthly View",
                  icon: <CalendarOutlined />,
                },
                {
                  key: "week",
                  label: "Weekly View",
                  icon: <BarsOutlined />,
                },
                {
                  key: "day",
                  label: "Daily View",
                  icon: <ClockCircleOutlined />,
                },
              ]}
            />

            {/* Render the selected view */}
            {state.view === "month" && <MonthlyView />}
            {state.view === "week" && <WeeklyView />}
            {state.view === "day" && <DayView />}
          </div>
        </div>
      </ConfigProvider>
    );
  };

  const initialState: CalendarState = {
    events: mockEvents,
    view: "month",
    currentDate: new Date(),
    settings: {
      mainColor: "blue",
      secondColor: "gray",
      availableDays: [1, 2, 3, 4, 5, 6, 7],
      startHour: "08:00",
      endHour: "18:00",
    },
  };

  return (
    <CalendarProvider initialState={initialState}>
      <Body />
    </CalendarProvider>
  );
}

export default App;
