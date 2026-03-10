import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import EventPopover from "./EventPopover";
import EventViewPopover from "./EventViewPopover";
import { Plus } from "lucide-react";

export default function ScheduleCalendar({ role }) {
  const FullCalendarAny = FullCalendar;

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Board Meeting",
      start: "2026-03-10T08:00:00",
      end: "2026-03-10T09:00:00",
      location: "Conference Room",
      description: "Very important meeting for management staff",
    },
    {
      id: "2",
      title: "Staff Training",
      start: "2026-03-12T10:00:00",
      end: "2026-03-12T12:00:00",
      location: "Training Hall B",
      description: "Quarterly compliance training",
    },
  ]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newSelection, setNewSelection] = useState(null);

  const isAdmin = role === "admin";

  const handleDateClick = (arg) => {
    if (!isAdmin) return;

    setNewSelection({
      start: arg.dateStr,
      end: arg.dateStr,
    });

    setSelectedEvent(null);
    setIsEditOpen(true);
  };

  const handleSelect = (arg) => {
    if (!isAdmin) return;

    setNewSelection({
      start: arg.startStr,
      end: arg.endStr,
    });

    setSelectedEvent(null);
    setIsEditOpen(true);
  };

  const handleEventClick = (arg) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (!event) return;

    setSelectedEvent(event);

    if (isAdmin) {
      setIsEditOpen(true);
    } else {
      setIsViewOpen(true);
    }
  };

  const handleEventDrop = (arg) => {
    if (!isAdmin) return;

    const { event } = arg;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: event.startStr,
              end: event.endStr || event.startStr,
            }
          : e
      )
    );
  };

  const handleEventResize = (arg) => {
    if (!isAdmin) return;

    const { event } = arg;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              start: event.startStr,
              end: event.endStr || event.startStr,
            }
          : e
      )
    );
  };

  const handleSaveEvent = (eventData) => {
    if (eventData.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventData.id ? eventData : e))
      );
    } else {
      const newEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
      };

      setEvents((prev) => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-200">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Company Schedule
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view internal company events
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedEvent(null);
              setNewSelection(null);
              setIsEditOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto p-4">
        <div className="min-w-250 h-full">
          <FullCalendarAny
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={events}
            editable={isAdmin}
            selectable={isAdmin}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="100%"
            themeSystem="standard"
          />
        </div>
      </div>

      <EventPopover
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialEvent={selectedEvent}
        defaultStart={newSelection?.start}
        defaultEnd={newSelection?.end}
      />

      <EventViewPopover
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        event={selectedEvent}
      />

      <style>{`
        .fc {
          --fc-border-color: #f1f5f9;
          --fc-event-bg-color: #4f46e5;
          --fc-event-border-color: #4f46e5;
          --fc-today-bg-color: #f8fafc;
          font-family: inherit;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
        }

        .fc-event {
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          transition: transform 0.1s ease;
        }

        .fc-event:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}