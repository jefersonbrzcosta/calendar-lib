import { useState } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarView from './components/CalendarView/MontlyView';
import WeeklyView from './components/CalendarView/WeeklyView';
import DayView from './components/CalendarView/DayView';
import { Tabs } from 'antd';
import { CalendarOutlined, BarsOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

function App() {
  const [activeView, setActiveView] = useState<string>('day');

  const handleTabChange = (key: string) => {
    setActiveView(key);
  };

  return (
    <CalendarProvider>
      <div className="w-full flex flex-col">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          {/* View Selector */}
          <Tabs
            defaultActiveKey="day"
            activeKey={activeView}
            onChange={handleTabChange}
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
          {activeView === 'month' && <CalendarView />}
          {activeView === 'week' && <WeeklyView />}
          {activeView === 'day' && <DayView />}
        </div>
      </div>
    </CalendarProvider>
  );
}

export default App;
