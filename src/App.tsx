import { CalendarProvider, useCalendarContext } from './context/CalendarContext';
import MonthlyView from './components/CalendarView/MonthlyView';
import WeeklyView from './components/CalendarView/WeeklyView';
import DayView from './components/CalendarView/DayView';
import { Tabs, ConfigProvider } from 'antd';
import { CalendarOutlined, BarsOutlined, ClockCircleOutlined } from '@ant-design/icons';

function App() {
  const Body = () => {
    const { state, dispatch } = useCalendarContext();
    const { mainColor } = state.settings;

    const handleViewChange = (view: string) => {
      dispatch({ type: 'SET_VIEW', payload: view });
    };

    return (
      <ConfigProvider theme={{
        components: {
          Tabs: {
            inkBarColor: mainColor,
            itemActiveColor: mainColor,
            itemHoverColor: mainColor,
            itemSelectedColor: mainColor,
            itemColor: "gray"
          },
        },
      }}>
        <div className="w-full flex flex-col">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            {/* View Selector */}
            <Tabs
              defaultActiveKey="month"
              activeKey={state.view}
              onChange={handleViewChange}
              size="large"
              tabBarGutter={16}
              tabBarStyle={{
                marginBottom: '1rem',
                color: mainColor, 
                borderBottom: `1px solid ${mainColor}`,

              }}
              items={[
                {
                  key: 'month',
                  label: 'Monthly View',
                  icon: <CalendarOutlined />
                },
                {
                  key: 'week',
                  label: 'Weekly View',
                  icon: <BarsOutlined />
                },
                {
                  key: 'day',
                  label: 'Daily View',
                  icon: <ClockCircleOutlined />
                },
              ]}
            />

            {/* Render the selected view */}
            {state.view === 'month' && <MonthlyView />}
            {state.view === 'week' && <WeeklyView />}
            {state.view === 'day' && <DayView />}
          </div>
        </div>
      </ConfigProvider>
    );
  };

  return (

      <CalendarProvider>
        <Body />
      </CalendarProvider>
  );
}

export default App;
