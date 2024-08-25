export const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export const getCurrentTimePosition = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  return (hour * 60 + minutes) / (24 * 60) * 100 + 1.4;
};



export const getEventPosition = (eventStart: Date, eventEnd: Date) => {
  const HOUR_HEIGHT = 48; // Height of each hour slot in pixels
  const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
  const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

  const top = (startMinutes * HOUR_HEIGHT) / 60; // Convert start time to pixels
  const height = ((endMinutes - startMinutes) * HOUR_HEIGHT) / 60; // Convert duration to pixels

  return {
    top: `${top + 49}px`,
    height: `${height}px`,
  };
};



export const mockEvents = [
  {
    id: 1,
    title: 'Morning Meeting',
    description: 'Team sync-up',
    start: new Date().setHours(9, 0, 0, 0), // Today at 9:00 AM
    end: new Date().setHours(10, 0, 0, 0), // Today at 10:00 AM
    color: '#FF5733',
    location: 'Conference Room A',
    guests: 'Alice, Bob, Charlie',
  },
  {
    id: 2,
    title: 'Lunch with Client',
    description: 'Discuss partnership',
    start: new Date().setHours(12, 0, 0, 0), // Today at 12:00 PM
    end: new Date().setHours(13, 0, 0, 0), // Today at 1:00 PM
    color: '#33A1FF',
    location: 'Online - Zoom',
    guests: 'Dev Team',
  },
  {
    id: 3,
    title: 'Project Work',
    description: 'Development time',
    start: new Date().setHours(14, 0, 0, 0), // Today at 2:00 PM
    end: new Date().setHours(16, 0, 0, 0), // Today at 4:00 PM
    color: '#FFC300',
    location: 'Downtown Cafe',
    guests: 'Client X',
  },
  {
    id: 4,
    title: 'Weekly Sync',
    description: 'All-hands meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0), // Tomorrow at 3:00 PM
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0, 0, 0), // Tomorrow at 4:00 PM
    color: '#DAF7A6',
    location: 'Online - Zoom',
    guests: 'Dev Team',
  },
];