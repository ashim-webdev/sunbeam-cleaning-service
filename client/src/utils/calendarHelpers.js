// import { DayWithEvents, CalendarEvent } from '../types/calendar';

export const getDaysInMonth = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
};

export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);

  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = prevMonthLastDay.getDate();

  const calendarDays = [];

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      events: [],
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    date.setHours(0, 0, 0, 0);
    calendarDays.push({
      date,
      events: [],
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    });
  }

  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      events: [],
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return calendarDays;
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getMonthName = (month) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month];
};

export const attachEventsToCalendarDays = (
  calendarDays,
  events
) => {
  return calendarDays.map(day => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const calendarDate = new Date(day.date);
      calendarDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === calendarDate.getTime();
    });

    return {
      ...day,
      events: dayEvents,
    };
  });
};
