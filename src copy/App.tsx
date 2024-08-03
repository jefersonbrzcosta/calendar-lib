// src/App.tsx
import React, { useState } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import CalendarView from './components/CalendarView/CalendarView';
import EventForm from './components/EventForm';


function App() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  return (
    <CalendarProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">Calendar App</h1>
        <div className="w-full max-w-5xl flex flex-col md:flex-row">
          {showForm && (
            <div className="md:w-1/4 mb-4 md:mb-0 p-4 bg-white shadow-lg rounded-lg">
              <EventForm selectedDate={selectedDate} onClose={() => setShowForm(false)} />
            </div>
          )}
          <div className="md:w-3/4 p-4 bg-white shadow-lg rounded-lg">
            <CalendarView />
          </div>
        </div>
      </div>
    </CalendarProvider>
  );
}

export default App;
