import { useState } from 'react';
import ScheduleCalendar from '../components/scheduleComponents/ScheduleCalendarProps';
import { Shield, User, Calendar as CalendarIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery } from '../redux/slices/api/userApiSlice';

export default function SchedulerPage() {
  const { LightMode, User } = useSelector((state) => state.auth);
  const { data: freshUser, isLoading } = useGetUserProfileQuery();

  const { user: storedUser } = useSelector((state) => state.auth);

  const user = freshUser ?? storedUser;
  

  // console.log(freshUser)

  const role = user.isAdmin ? "admin" : "employee"

  const bg = LightMode ? "bg-white/60" : "bg-black/60";
  const shadow = LightMode ? "" : "shadow-lightSM";
  const shadowInner = LightMode ? "shadow-inner" : "shadow-innerWH"
  const text = LightMode ? "text-black" : "text-white";
  const subText = LightMode ? "text-black/80" : "text-white/80";

  return (
    <div className={`min-h-screen ${bg} ${text} rounded-2xl font-sans transition-colors duration-300 ease-in-out`}>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 mx-2 ">
          <div className='flex justify-center items-center gap-2 mb-10'>
            <div className={`${shadow} rounded-xl transition-all duration-300 ease-in-out`}>
              <div className={`shadow-inner sm:w-12 sm:h-12 w-10 h-10 bg-[#005FFB] rounded-xl flex items-center justify-center text-white`}>
                <CalendarIcon size={26} />
              </div>
            </div>
            <h2 className={`sm:text-3xl text-xl font-bold ${text} transition-all duration-300 ease-in-out`}>Workspace Events</h2>
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
