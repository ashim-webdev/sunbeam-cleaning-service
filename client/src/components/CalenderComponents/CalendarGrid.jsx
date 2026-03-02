// import { DayWithEvents } from '../types/calendar';
import DayCell from './DayCell';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CalendarGrid({ days, onDayClick }) {
  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <div className="w-full grid grid-cols-7 gap-px bg-gray-200">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-3 py-4 text-center border-b-2 border-gray-300"
          >
            <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 3)}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 pt-0.5 p-1 bg-gray-200">
        {days.map((day, index) => (
          <DayCell
            key={index}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.isToday}
            events={day.events}
            onClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
}
