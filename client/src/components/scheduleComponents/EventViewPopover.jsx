import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { X, MapPin, Clock, AlignLeft, Calendar1Icon, Calendar1 } from 'lucide-react';
import { useSelector } from "react-redux";

export default function EventViewPopover({ isOpen, onClose, event }) {

  if (!event) return null;

  const { LightMode } = useSelector((state) => state.auth);

  const bg = LightMode ? "bg-white" : "bg-slate-900";
  const text = LightMode ? "text-black" : "text-white";
  const border = LightMode ? "border-gray-500" : "border-gray-200";
  const blurBG = LightMode ? "bg-black/25" : "bg-white/25";


  // Slit Date and Time
  const getDateTime = (dateStr) => {
    const date = new Date(dateStr);

    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { datePart, timePart };
  };

  const start = getDateTime(event.start);
  const end = getDateTime(event.end);


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>

        <TransitionChild as={Fragment}>
          <div className={`fixed inset-0 ${blurBG} backdrop-blur-sm`} />
        </TransitionChild>

        <div className="fixed mx-2 inset-0 flex items-center justify-center">

          <TransitionChild as={Fragment}>
            <DialogPanel className={`w-full  max-w-md rounded-2xl ${bg} p-6 shadow-xl transition-colors duration-300 ease-in-out`}>

              <div className="flex justify-between mb-6">
                <DialogTitle className={`text-xl font-bold ${text} transition-colors duration-300 ease-in-out`}>
                  {event.title}
                </DialogTitle>

                <button onClick={onClose} className={`${text} p-1 rounded-full hover:bg-slate-100 transition-colors duration-300 ease-in-out text-slate-500 hover:text-slate-600`}>
                  <X size={25} />
                </button>
              </div>

              <div className={`space-y-4 ${text} transition-colors duration-300 ease-in-out`}>
                <div className="flex flex-col justify-start items-start gap-3">
                  
                  <span className='flex flex-col justify-center items-start mb-2'>
                    <span className='italic'>Start Date & Time</span>

                    <span className='flex justify-center items-center gap-4 text-green-600'>
                      <span className='flex justify-center items-center gap-3 whitespace-nowrap'>
                        <i className="fa-solid fa-calendar text-lg text-blue-600"></i>
                        {start.datePart}
                      </span>
                      <span className='flex justify-center items-center gap-3 whitespace-nowrap'>
                        <i className="fa-regular fa-clock text-lg text-blue-600"></i>
                        {start.timePart}
                      </span>
                    </span>
                    
                  </span>

                  <span className='flex flex-col justify-center items-start'>
                    <span className='italic'>End Date & Time</span>

                    <span className='flex justify-center items-center gap-4 text-red-600'>
                      <span className='flex justify-center items-center gap-3 whitespace-nowrap'>
                        <i className="fa-solid fa-calendar text-lg text-blue-600"></i>
                        {end.datePart}
                      </span>
                      <span className='flex justify-center items-center gap-3 whitespace-nowrap'>
                        <i className="fa-regular fa-clock text-lg text-blue-600"></i>
                        {end.timePart}
                      </span>
                    </span>
                    
                  </span>
                </div>

                {event.location && (
                  <div className={`flex mt-6 pt-6 justify-start items-center gap-3 border-t ${border} transition-colors duration-300 ease-in-out`}>
                    <MapPin size={20} />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.description && (
                  <div className="flex mt-8 justify-start items-start gap-3">
                    <span className='pl-px'><AlignLeft size={20} /></span>
                    <span className='-mt-0.5'>{event.description}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="ClickAnimationNoti px-4 py-2 bg-blue-600 hover:bg-blue-800 shadow-inner hover:shadow-innerWH text-white rounded-lg cursor-pointer transition-all duration-200 ease-in-out"
                >
                  Close
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>

        </div>
      </Dialog>
    </Transition>
  );
}