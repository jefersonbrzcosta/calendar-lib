export const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);


export const mockEvents = [
  {
    id: 1,
    title: 'Morning Meeting',
    description: 'Team sync-up',
    start: new Date().setHours(9, 0, 0, 0), // Today at 9:00 AM
    end: new Date().setHours(10, 0, 0, 0), // Today at 10:00 AM
    color: '#FF5733',
  },
  {
    id: 2,
    title: 'Lunch with Client',
    description: 'Discuss partnership',
    start: new Date().setHours(12, 0, 0, 0), // Today at 12:00 PM
    end: new Date().setHours(13, 0, 0, 0), // Today at 1:00 PM
    color: '#33A1FF',
  },
  {
    id: 3,
    title: 'Project Work',
    description: 'Development time',
    start: new Date().setHours(14, 0, 0, 0), // Today at 2:00 PM
    end: new Date().setHours(16, 0, 0, 0), // Today at 4:00 PM
    color: '#FFC300',
  },
  {
    id: 4,
    title: 'Weekly Sync',
    description: 'All-hands meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 0, 0, 0), // Tomorrow at 3:00 PM
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0, 0, 0), // Tomorrow at 4:00 PM
    color: '#DAF7A6',
  },
];