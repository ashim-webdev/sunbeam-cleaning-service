// import { CalendarEvent } from '../types/calendar';


export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  events,
  onClick,
}) {
  const hasEvents = events.length > 0;
  const eventCount = events.length;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.right + 10;
    const y = rect.top;
    onClick(date, { x, y });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative min-h-25 sm:min-h-30 p-2 sm:p-3 cursor-pointer border border-gray-200
        transition-all duration-200 ease-out group hover:shadow-md hover:scale-[1.02]
        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
        ${isToday ? 'border-2 border-blue-500' : ''}
        ${hasEvents ? 'bg-linear-to-br from-blue-50 to-cyan-50 border-blue-200' : ''}
        hover:border-blue-300 rounded-lg
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`
              text-sm sm:text-base font-semibold transition-colors
              ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
              ${isToday ? 'text-blue-600' : ''}
              group-hover:text-blue-600
            `}
          >
            {date.getDate()}
          </span>
          {isToday && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
              Today
            </span>
          )}
        </div>

        {hasEvents && (
          <div className="flex-1 flex flex-col gap-1">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="px-2 py-1 bg-white border border-blue-200 rounded-md text-xs font-medium text-gray-700 truncate shadow-sm hover:shadow transition-shadow"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {eventCount > 2 && (
              <div className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-medium text-center">
                +{eventCount - 2} more
              </div>
            )}
          </div>
        )}

        {!hasEvents && isCurrentMonth && (
          <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-400 font-medium">Click to add</span>
          </div>
        )}
      </div>
    </button>
  );
}
