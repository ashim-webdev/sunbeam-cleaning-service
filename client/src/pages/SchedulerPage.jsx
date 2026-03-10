import { useState } from 'react';
import ScheduleCalendar from '../components/scheduleComponents/ScheduleCalendarProps';
import { Shield, User, Calendar as CalendarIcon } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('admin');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Workspace Events</h2>
              <p className="text-slate-500 mt-1">
                {role === 'admin' 
                  ? 'You have full administrative access to manage the company schedule.' 
                  : 'You are viewing the company schedule as an employee.'}
              </p>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-slate-600 font-medium">Company Events</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-slate-600 font-medium">Past Events</span>
              </div>
            </div>
          </div>
        </div>

        <ScheduleCalendar role={role} />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; 2026 ProSchedule Enterprise. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
