export const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export const getCurrentTimePosition = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  return ((hour * 60 + minutes) / (24 * 60)) * 100 + 1.4;
};

export const getEventPosition = (eventStart: Date, eventEnd: Date) => {
  const HOUR_HEIGHT = 48;
  const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
  const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();

  const top = (startMinutes * HOUR_HEIGHT) / 60;
  const height = ((endMinutes - startMinutes) * HOUR_HEIGHT) / 60;

  return {
    top: `${top + 49}px`,
    height: `${height}px`,
  };
};

export const isScreenMobile = () => {
  return window.innerWidth < 450;
};

export const mockEvents = [
  {
    id: 1,
    title: "Morning Meeting",
    description: "Team sync-up",
    start: new Date().setHours(9, 0, 0, 0),
    end: new Date().setHours(10, 0, 0, 0),
    color: "#FF5733",
    location: "Conference Room A",
    guests: "Alice, Bob, Charlie",
  },
  {
    id: 2,
    title: "Lunch with Client",
    description: "Discuss partnership",
    start: new Date().setHours(12, 0, 0, 0),
    end: new Date().setHours(13, 0, 0, 0),
    color: "#33A1FF",
    location: "Online - Zoom",
    guests: "Dev Team",
  },
  {
    id: 3,
    title: "Project Work",
    description: "Development time",
    start: new Date().setHours(14, 0, 0, 0),
    end: new Date().setHours(16, 0, 0, 0),
    color: "#FFC300",
    location: "Downtown Cafe",
    guests: "Client X",
  },
  {
    id: 4,
    title: "Weekly Sync",
    description: "All-hands meeting",
    start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
      15,
      0,
      0,
      0
    ),
    end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
      16,
      0,
      0,
      0
    ),
    color: "#DAF7A6",
    location: "Online - Zoom",
    guests: "Dev Team",
  },
];
