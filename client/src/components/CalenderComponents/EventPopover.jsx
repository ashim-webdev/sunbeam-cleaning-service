import { useState, useEffect, useRef } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
// import { CalendarEvent, UserRole } from '../types/calendar';


export default function EventPopover({
  date,
  events,
  role,
  position,
  onClose,
  onSaveEvent,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    if (popoverRef.current) {
      const rect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      if (position.x + rect.width > viewportWidth - 20) {
        adjustedX = viewportWidth - rect.width - 20;
      }

      if (position.y + rect.height > viewportHeight - 20) {
        adjustedY = position.y - rect.height - 20;
      }

      popoverRef.current.style.left = `${adjustedX}px`;
      popoverRef.current.style.center = `${adjustedY}px`;
    }
  }, [position]);

  const handleSave = () => {
    if (!title.trim()) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      date: `${year}-${month}-${day}`,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    };

    onSaveEvent(newEvent);
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
    setIsCreating(false);
  };

  const formatDateString = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-100 w-96 max-w-[calc(100vw-2rem)] animate-scale-in"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDateString(date)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {role === 'admin' && !isCreating && events.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">No events scheduled</p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Create Event
            </button>
          </div>
        )}

        {role === 'admin' && !isCreating && events.length > 0 && (
          <div>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  )}
                  {(event.startTime || event.endTime) && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {event.startTime || ''}
                        {event.startTime && event.endTime && ' - '}
                        {event.endTime || ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Add Another Event
            </button>
          </div>
        )}

        {role === 'admin' && isCreating && (
          <div className="space-y-4">
            {events.length > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2.5 tracking-wide">
                  Events on this day
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-2.5 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">{event.description}</p>
                      )}
                      {(event.startTime || event.endTime) && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {event.startTime || ''}
                            {event.startTime && event.endTime && ' - '}
                            {event.endTime || ''}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Team Meeting"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add event details..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Save Event
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setTitle('');
                  setDescription('');
                  setStartTime('');
                  setEndTime('');
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {role === 'employee' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No events scheduled</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  {(event.startTime || event.endTime) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-md px-3 py-1.5 w-fit">
                      <Clock className="w-4 h-4" />
                      <span>
                        {event.startTime || ''}
                        {event.startTime && event.endTime && ' - '}
                        {event.endTime || ''}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
