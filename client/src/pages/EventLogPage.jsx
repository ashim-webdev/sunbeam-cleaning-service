import { useState } from 'react';
// import { CalendarEvent, UserRole } from '../types/calendar';
import { initialMockEvents } from '../assets/data';
import {
  getCalendarDays,
  getMonthName,
  attachEventsToCalendarDays,
} from '../utils/calendarHelpers';
import CalendarHeader from '../components/CalenderComponents/CalendarHeader';
import CalendarGrid from '../components/CalenderComponents/CalendarGrid';
import EventPopover from '../components/CalenderComponents/EventPopover';

export default function EventLogPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState(initialMockEvents);
  const [role, setRole] = useState('admin');
  const [selectedDate, setSelectedDate] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const calendarDays = getCalendarDays(currentYear, currentMonth);
  const daysWithEvents = attachEventsToCalendarDays(calendarDays, events);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleRoleToggle = () => {
    setRole(role === 'admin' ? 'employee' : 'admin');
  };

  const handleDayClick = (date, position) => {
    setSelectedDate(date);
    setPopoverPosition(position);
  };

  const handleClosePopover = () => {
    setSelectedDate(null);
  };

  const handleSaveEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents([...events, newEvent]);
  };

  const getEventsForDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    const dateString = `${year}-${month}-${day}`;
  
    return events.filter((event) => event.date === dateString);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl  mx-auto">
        <CalendarHeader
          currentMonth={getMonthName(currentMonth)}
          currentYear={currentYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          role={role}
          onRoleToggle={handleRoleToggle}
        />

        <CalendarGrid days={daysWithEvents} onDayClick={handleDayClick} />

        {selectedDate && (
          <EventPopover
            date={selectedDate}
            events={getEventsForDate(selectedDate)}
            role={role}
            position={popoverPosition}
            onClose={handleClosePopover}
            onSaveEvent={handleSaveEvent}
          />
        )}
      </div>
    </div>
  );
}
