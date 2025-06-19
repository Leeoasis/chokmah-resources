import React from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarSection = ({ date, setDate, events, openModal }) => (
  <div>
    <h2 className="text-2xl font-semibold text-primary-light mb-4">Calendar</h2>
    <p className="text-secondary-light mb-4">Manage your schedule and appointments.</p>
    <ReactCalendar
      onChange={setDate}
      value={date}
      tileContent={({ date }) =>
        events.filter((event) => event.date === date.toDateString()).map((event, index) => (
          <p key={index} className="text-xs text-primary font-semibold">{event.title}</p>
        ))
      }
      className="bg-secondary text-primary rounded-lg shadow-lg"
    />
    <button onClick={openModal} className="mt-4 bg-primary text-secondary px-4 py-2 rounded hover:bg-primary-light">Add Event</button>
  </div>
);

export default CalendarSection;