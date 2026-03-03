import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Agenda,
  Inject,
  ViewsDirective,
  ViewDirective,
  Resize,
  DragAndDrop
} from '@syncfusion/ej2-react-schedule';

import { dummyEvents } from '../assets/data';
import RoleToggle from '../components/scheduleComponents/RoleToggle';
import EventDetailsModal from '../components/scheduleComponents/EventDetailsModal';
import { CalendarDays } from 'lucide-react';

export default function SchedulerPage() {
  const { LightMode } = useSelector((state) => state.auth); // 👈 Redux theme

  const [isAdmin, setIsAdmin] = useState(true);
  const [events, setEvents] = useState(dummyEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔥 Dynamically switch Syncfusion theme
  useEffect(() => {
    const themeLink = document.getElementById('syncfusion-theme');

    if (themeLink) {
      themeLink.href = LightMode
        ? 'https://cdn.syncfusion.com/ej2/material.css'
        : 'https://cdn.syncfusion.com/ej2/material-dark.css';
    }
  }, [LightMode]);

  return (
    <div className={`scheduler-wrapper ${LightMode ? 'light' : 'dark'}`}>
      <div
        className={`min-h-screen rounded-xl p-6 transition-colors duration-300 ease-in-out ${
          LightMode
            ? 'bg-white/80 shadow-dark'
            : 'bg-black/80 shadow-light'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-linear-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                <CalendarDays className={`${LightMode ? 'text-gray-900' : 'text-white'} w-8 h-8 transition-colors duration-300 ease-in-out`} />
              </div>
              <div>
                <h1
                  className={`md:text-3xl text-2xl whitespace-nowrap font-bold   transition-colors duration-300 ease-in-out ${
                    LightMode ? 'text-gray-900' : 'text-white' 
                  }`}
                >
                  Company Scheduler
                </h1>
                <p
                  className={`text-sm text-center transition-colors duration-300 ease-in-out ${
                    LightMode ? 'text-gray-600' : 'text-gray-300'
                  }`}
                >
                  {isAdmin ? "Manage team events and schedules" : "See assigned events and company schedules"}
                </p>
              </div>
            </div>

            <RoleToggle isAdmin={isAdmin} onToggle={setIsAdmin} />
          </div>

          <div
            className={`${LightMode ? 'bg-gray-300/90 shadow-darkSM' : 'bg-gray-600/90 shadow-lightSM'} overflow-x-auto py-2 px-2 transition-colors duration-300 ease-in-out`}
          >
            <div className={`h-[calc(100vh-160px)] lg:w-full min-w-275  shadow-xl border overflow-x-auto transition-colors duration-300 ease-in-out ${
              LightMode
                ? 'bg-white border-gray-100 shadow-darkSM'
                : 'bg-gray-800 border-gray-700 shadow-lightSM'
            }`}>
              <ScheduleComponent
              height="100%"
              enableAdaptiveUI={true}
              selectedDate={new Date(2026, 2, 2)}
              eventSettings={{
                dataSource: events,
                fields: {
                  id: 'Id',
                  subject: { name: 'Subject' },
                  description: { name: 'Description' },
                  startTime: { name: 'StartTime' },
                  endTime: { name: 'EndTime' },
                  location: { name: 'Location' }
                }
              }}
              readonly={!isAdmin}
              allowDragAndDrop={isAdmin}
              allowResizing={isAdmin}
            >
              <ViewsDirective>
                <ViewDirective option="Day" />
                <ViewDirective option="Week" />
                <ViewDirective option="Month" />
                <ViewDirective option="Agenda" />
              </ViewsDirective>
              <Inject services={[Day, Week, Month, Agenda, Resize, DragAndDrop]} />
              </ScheduleComponent>
            </div>
          </div>
        </div>

        {showModal && (
          <EventDetailsModal
            event={selectedEvent}
            onClose={() => {
              setShowModal(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}