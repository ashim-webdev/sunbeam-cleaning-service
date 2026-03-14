import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import EventPopover from "./EventPopover";
import EventViewPopover from "./EventViewPopover";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";

export default function ScheduleCalendar({ role }) {
  const { LightMode } = useSelector((state) => state.auth);

  const bg = LightMode ? "bg-white" : "bg-black";
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM";
  const text = LightMode ? "text-black" : "text-white";
  const gray = LightMode ? "text-black/80" : "text-white/80";





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

    const start = new Date(arg.start);
    const end = new Date(arg.end);

    // FullCalendar end date is exclusive → subtract 1 minute
    end.setMinutes(end.getMinutes() - 1);

    const formatForInput = (date) => {
      const pad = (n) => String(n).padStart(2, "0");

      return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes())
      );
    };

    setNewSelection({
      start: formatForInput(start),
      end: formatForInput(end),
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
    <div className={`${bg} ${shadow} ${text} rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-200 transition-all duration-300 ease-in-out`}>
      <div className={`${isAdmin ? "justify-between" : "justify-center"} p-4 border-b border-slate-200 flex  items-center`}>
        <div>
          <h2 className={`${isAdmin ? "" : "text-center"} text-lg font-semibold ${text} transition-colors duration-300 ease-in-out`}>
            Company Schedule
          </h2>
          <p className={`text-sm ${gray} ${isAdmin ? "" : "text-center"} transition-colors duration-300 ease-in-out`}>
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
            className="ClickAnimationNoti flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-800 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={18} />
            <span className="-mr-1 hidden md:block">Add</span>
            Event
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto p-4 ">
        <div className={`${LightMode ? "light-calendar" : "dark-calendar"} ${bg} ${shadow} ${text} min-w-250 h-full transition-colors duration-300 ease-in-out`}>
          <FullCalendarAny
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            dateClick={handleDateClick}
            selectLongPressDelay={300}
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
          --fc-border-color: #bac3cb;
          --fc-event-bg-color: #005FFB;
          --fc-event-border-color: #0039f6;
          --fc-today-bg-color: #253F50;
          font-family: inherit;
        }

        .fc-day-today .fc-daygrid-day-number {
          color: white !important;
        }

        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
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
          transform: scale(1.01);
        }

        /* ================= LIGHT MODE ================= */

        .light-calendar .fc .fc-header-toolbar {
          padding: 10px 16px !important;
          border: 1.5px solid white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .light-calendar .fc-list-day-cushion {
          background-color: #253F50 !important;
          color: white !important;
        }

        .light-calendar .fc-list-event:hover td {
          background-color: #dedede !important;
        }

        .light-calendar .fc .fc-toolbar-title {
          color: #0f172a;
        }

        .light-calendar .fc-theme-standard td,
        .light-calendar .fc-theme-standard th {
          border-color: #e5e7eb;
        }

        /* ================= DARK MODE ================= */

        .dark-calendar .fc .fc-toolbar-title {
          color: white;
        }

        .dark-calendar .fc-theme-standard td,
        .dark-calendar .fc-theme-standard th {
          border-color: #334155;
        }

        /* Fix list view colors */

        .dark-calendar .fc-list-day {
          background-color: red;
          color: white;
        }

        .dark-calendar .fc-list-event:hover {
          background-color: #1e293b;
        }




        /* ================= DARK MODE LIST VIEW ================= */

        .dark-calendar .fc .fc-header-toolbar {
          padding: 10px 16px !important;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .dark-calendar .fc-list-table {
          background-color: #020617 !important;
          color: white !important;
        }

        .dark-calendar .fc-list-day-cushion {
          background-color: #253F50 !important;
          color: white !important;
        }

        .dark-calendar .fc-list-event td {
          background-color: transparent !important;
          color: white !important;
        }

        .dark-calendar .fc-list-event:hover td {
          background-color: #0206175a !important;
          color: white !important;
        }

      `}</style>
    </div>
  );
}