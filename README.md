# SUPER Callender App

This is a highly customizable calendar library built for React applications. It provides a complete calendar solution with monthly, weekly, and daily views, enabling users to create, edit, and manage events seamlessly. The library uses **Tailwind CSS** for styling, ensuring that it is easy to integrate into any modern React project.

## Features

- **Multiple Views**: The calendar offers three different views: 
  - **Monthly View**: Displays the entire month with events indicated on specific dates.
  - **Weekly View**: Shows the days of the week with hour slots to plan events.
  - **Daily View**: Provides a detailed view of a single day with hourly breakdowns.
  
- **Event Management**: Users can create, edit, and delete events across all views. Events are visually represented in their respective time slots and dates.
  
- **Custom Styling**: This library uses **Tailwind CSS** for styling, allowing for easy customization and consistency across all components.

- **Navigation**: Users can easily navigate between days, weeks, and months using the intuitive UI navigation controls.

- **Event Object Structure**: The event object follows the structure below:
  ```javascript
  {
    id: number,
    title: string,
    description: string,
    start: Date, // Event start time
    end: Date,   // Event end time
    color: string // Color of the event (used for display)
  }
  ```

- **Configuration**: Built-in configuration options are available for setting available days and time slots, ensuring that events are created within the specified time range.

## Installation

To use this library in your React application, follow the steps below:

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Install Dependencies

Navigate to the project directory and install all the necessary dependencies.

```bash
cd <project-directory>
npm install
```

### 3. Running the App

Once the dependencies are installed, you can run the app locally to see the calendar in action.

```bash
npm start
```

This will start the development server and launch the app in your default browser.

## Usage

To use the calendar in your React application, import the desired views (`DayView`, `WeeklyView`, `MontlyView`) and include them in your component:

```jsx
import { DayView, WeeklyView, MontlyView } from 'react-calendar-library';

function App() {
  return (
    <div>
      <DayView />
      <WeeklyView />
      <MontlyView />
    </div>
  );
}

export default App;
```

## Customization

You can customize the look and feel of the calendar by overriding the Tailwind CSS classes used in the components. Additionally, you can modify the calendar's behavior by working with the event object and configuration options.

## License

This project is licensed under the MIT License.


todo:
- Fix UI constancy; - DONE
- Check for reusable components;
- Fix Current hours line;
- Add motions when changing views;
- Remove config from view, have a config file;
- Include main color;
- Add a place for logo, title;
- Configure mobile friendly;
