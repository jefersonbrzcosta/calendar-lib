import { CalendarProvider } from './context/CalendarContext';
import CalendarView from './components/CalendarView/CalendarView';


function App() {
  return (
    <CalendarProvider>
        <div className="w-full flex flex-col">
          <div className=" p-4 bg-white shadow-lg rounded-lg">
            <CalendarView />
          </div>
        </div>
    </CalendarProvider>
  );
}

export default App;
