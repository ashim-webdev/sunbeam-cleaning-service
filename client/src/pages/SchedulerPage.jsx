import { useState } from 'react';
import ScheduleCalendar from '../components/scheduleComponents/ScheduleCalendarProps';
import { Shield, User, Calendar as CalendarIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function SchedulerPage() {
  const { LightMode } = useSelector((state) => state.auth);
  const bg = LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM"
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM"
  const shadowInner = LightMode ? "shadow-inner" : "shadow-innerWH"
  const text = LightMode ? "text-black" : "text-white";
  const subText = LightMode ? "text-black/80" : "text-white/80";


  const [role, setRole] = useState('admin');

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans transition-colors duration-300 ease-in-out`}>
      {/* Header */}
      <header className={`${bg} border-b border-slate-200 sticky top-0 z-30 transition-all duration-300 ease-in-out`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">ProSchedule</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Enterprise Calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {role === 'admin' ? 'Admin Mode' : 'Employee Mode'}
              </span>
            </div>

            <button
              onClick={() => setRole(role === 'admin' ? 'employee' : 'admin')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all shadow-sm group"
            >
              {role === 'admin' ? (
                <>
                  <User size={18} className="text-slate-500 group-hover:text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Switch to Employee</span>
                </>
              ) : (
                <>
                  <Shield size={18} className="text-slate-500 group-hover:text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">Switch to Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className='flex justify-center items-center gap-2 mb-6'>
            <div className={`${shadow} rounded-xl transition-all duration-300 ease-in-out`}>
              <div className={`shadow-inner w-12 h-12 bg-[#005FFB] rounded-xl flex items-center justify-center text-white`}>
                <CalendarIcon size={26} />
              </div>
            </div>
            <h2 className={`text-3xl font-bold ${text} transition-all duration-300 ease-in-out line-clamp-1`}>Workspace Events</h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className={`${subText} mt-1 transition-all duration-300 ease-in-out`}>
                {role === 'admin' 
                  ? 'You have full administrative access to manage the company schedule.' 
                  : 'You are viewing the company schedule as an employee.'}
              </p>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className={`${text} font-medium transition-all duration-300 ease-in-out`}>Company Events</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className={`${text} font-medium transition-all duration-300 ease-in-out`}>Past Events</span>
              </div>
            </div>
          </div>
        </div>

        <ScheduleCalendar role={role} />
      </main>

      {/* Footer */}
      <footer className='flex justify-center items-center'>
        <div className="px-4 pt-2 pb-8">
          <p className={`text-sm ${subText}`}>
            {role === 'admin'
              ?
              "Click a date to create a new event, Drag & Drop to change even date." 
              : 
              "Click on an even to view even details and stay updated on company schedules."
            }
          </p>
        </div>
      </footer>
    </div>
  );
}
