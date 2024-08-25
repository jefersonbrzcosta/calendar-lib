import { CalendarProvider, useCalendarContext } from './context/CalendarContext';
import CalendarView from './components/CalendarView/MontlyView';
import WeeklyView from './components/CalendarView/WeeklyView';
import DayView from './components/CalendarView/DayView';
import { Tabs } from 'antd';
import { CalendarOutlined, BarsOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

function App() {

  const Body = () => {
    const { state, dispatch } = useCalendarContext();

    const handleViewChange = (view: string) => {
      dispatch({ type: 'SET_VIEW', payload: view });
    };

    return (
      <div className="w-full flex flex-col">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          {/* View Selector */}
          <Tabs
            defaultActiveKey="day"
            activeKey={state.view}
            onChange={handleViewChange}
            size="large"
            tabBarGutter={16}
            tabBarStyle={{ marginBottom: '1rem' }}
          >
            <TabPane
              tab={
                <span>
                  <CalendarOutlined />
                  {`  Monthly View`}
                </span>
              }
              key="month"
            />
            <TabPane
              tab={
                <span>
                  <BarsOutlined />
                  {`  Weekly View`}
                </span>
              }
              key="week"
            />
            <TabPane
              tab={
                <span>
                  <ClockCircleOutlined />
                  {`  Daily View`}
                </span>
              }
              key="day"
            />
          </Tabs>

          {/* Render the selected view */}
          {state.view === 'month' && <CalendarView />}
          {state.view === 'week' && <WeeklyView />}
          {state.view === 'day' && <DayView />}
        </div>
      </div>
    )

  }

  return (
    <CalendarProvider>
      <Body />
    </CalendarProvider>
  );
}

export default App;
