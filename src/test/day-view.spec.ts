// import { render, screen, fireEvent } from "@testing-library/react";
// import DayView from "../components/CalendarView/DayView";
// import { CalendarProvider } from "../context/CalendarContext";
// import { mockEvents } from "../components/utils"; // Mock events imported from utils

// describe("DayView Component", () => {
//   const renderWithContext = (initialState: any) => {
//     return render(
//       <CalendarProvider initialState={initialState}>
//         <DayView />
//       </CalendarProvider>
//     );
//   };

//   it("should display the current day", () => {
//     const initialState = {
//       currentDate: new Date(),
//       events: mockEvents,
//       settings: { mainColor: "#000", secondColor: "#ccc" },
//     };
//     renderWithContext(initialState);

//     const dayHeader = screen.getByText(
//       new RegExp(new Date().toLocaleDateString("en-US", { weekday: "long" }))
//     );
//     expect(dayHeader).toBeInTheDocument();
//   });

//   it("should render all time slots", () => {
//     const initialState = {
//       currentDate: new Date(),
//       events: mockEvents,
//       settings: { mainColor: "#000", secondColor: "#ccc" },
//     };
//     renderWithContext(initialState);

//     const timeSlots = screen.getAllByRole("button");
//     expect(timeSlots.length).toBe(24); // Assuming 24-hour format and each hour is rendered
//   });

//   it("should open the event modal when a time slot with an event is clicked", () => {
//     const initialState = {
//       currentDate: new Date(),
//       events: mockEvents,
//       settings: { mainColor: "#000", secondColor: "#ccc" },
//     };
//     renderWithContext(initialState);

//     const eventElement = screen.getByText(mockEvents[0].title);
//     fireEvent.click(eventElement);

//     expect(screen.getByRole("dialog")).toBeInTheDocument(); // Verifying the modal is opened
//   });
// });
