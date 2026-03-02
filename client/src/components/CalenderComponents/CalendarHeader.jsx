import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
// import { UserRole } from '../types/calendar';



export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPreviousMonth,
  onNextMonth,
  role,
  onRoleToggle,
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Calendar Events
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your team schedule and events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={onRoleToggle}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                role === 'admin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Admin View
          </button>
          <button
            onClick={onRoleToggle}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                role === 'employee'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Employee View
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-6 py-4">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </button>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {currentMonth} {currentYear}
        </h2>

        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
        </button>
      </div>
    </div>
  );
}
