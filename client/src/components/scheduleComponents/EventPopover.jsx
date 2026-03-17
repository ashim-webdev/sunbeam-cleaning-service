import clsx from "clsx";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


export default function EventPopover({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialEvent,
  defaultStart,
  defaultEnd,
}) {
    const { LightMode } = useSelector((state) => state.auth);

  const bg = LightMode ? "bg-white" : "bg-black";
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM";
  const text = LightMode ? "text-black" : "text-white";
  const placeholder = LightMode ? "placeholder:text-gray-500" : "placeholder:text-gray-400";

  

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [location, setLocation] = useState('');

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || '');
      setStart(new Date(initialEvent.start));
      setEnd(new Date(initialEvent.end));
      setLocation(initialEvent.location || '');
    } else {
      setTitle('');
      setDescription('');
      setStart(null);
      setEnd(null);
      setLocation('');
    }

    setErrors({});
  }, [initialEvent, defaultStart, defaultEnd, isOpen]);

  // Calender "withPortal" Screen Sizing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // End

  const validateFields = () => {
    const newErrors = {};

    const triggerShake = () => {
      setShake(true);

      if (navigator.vibrate) {
        navigator.vibrate(300);
      }

      setTimeout(() => {
        setShake(false);
      }, 1000);
    };

    const allEmpty =
      !title.trim() &&
      !start &&
      !end &&
      !location.trim() &&
      !description.trim();

    // If all fields are empty
    if (allEmpty) {
      toast.error("All input fields are required");
      newErrors.title = "Event title is required";
      newErrors.start = "Start date is required";
      newErrors.end = "End date is required";
      newErrors.location = "Location is required";
      newErrors.description = "Description is required";

      setErrors(newErrors);
      triggerShake()
      return false;
    }

    // Validate fields one by one (only first error)
    if (!title.trim()) {
      newErrors.title = "Event title is required";
      toast.error("Event title is required");
      triggerShake()
    } 
    else if (!start) {
      newErrors.start = "Start date is required";
      toast.error("Start date is required");
      triggerShake()
    } 
    else if (!end) {
      newErrors.end = "End date is required";
      toast.error("End date is required");
      triggerShake()
    } 
    else if (!location.trim()) {
      newErrors.location = "Location is required";
      toast.error("Location is required");
      triggerShake()
    } 
    else if (!description.trim()) {
      newErrors.description = "Description is required";
      toast.error("Description is required");
      triggerShake()
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    onSave({
      id: initialEvent?.id,
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      location,
    });

    toast.success(
      initialEvent ? "Event edited successfully" : "New event created successfully"
    );

    onClose();
  };


  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-2000" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className={`z-100 w-full max-w-md transform overflow-hidden rounded-2xl ${bg} ${shadow} p-6 text-left align-middle border border-slate-100 transition-colors duration-300 ease-in-out`}>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className={`text-lg font-semibold leading-6 ${text} transition-colors duration-300 ease-in-out`}>
                    {initialEvent ? 'Edit Event' : 'Create New Event'}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-300 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <div>
                    <label className={`block text-sm font-medium ${text} mb-1`}>
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors(prev => ({ ...prev, title: null }));
                      }}
                      placeholder="e.g. Board Meeting"
                      className={`${text} ${placeholder}  w-full px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                        errors.title
                          ? `border-2 border-red-500 focus:border-red-500 ${
                              shake ? "animate-shake" : ""
                            }`
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                    />
                    {errors.title && (
                      <p className='text-[#f64949fe] italic text-sm mt-1'>{errors.title}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className={`block text-sm font-medium ${text} mb-1`}>
                        Start Date / Time
                      </label>

                      <DatePicker
                        selected={start}
                        onChange={(date) => {
                          setStart(date);
                          setErrors(prev => ({ ...prev, start: null }));
                        }}
                        showTimeSelect
                        timeFormat="hh:mm aa"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        placeholderText="Select start date & time"
                        withPortal={isMobile}
                        minDate={new Date}
                        calendarClassName={clsx(
                          LightMode
                            ? "light-calendar"
                            : "dark-calendar"
                        )}
                        className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                        errors.start
                          ? `border-2 border-red-500 focus:border-red-500 ${
                              shake ? "animate-shake" : ""
                            }`
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                      />

                      {errors.start && (
                        <p className="text-red-500 text-xs mt-1 italic">{errors.start}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium ${text} mb-1`}>
                        End Date / Time
                      </label>

                      <DatePicker
                        selected={end}
                        onChange={(date) => {
                          setEnd(date);
                          setErrors(prev => ({ ...prev, end: null }));
                        }}
                        showTimeSelect
                        timeFormat="hh:mm aa"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        placeholderText="Select end date & time"
                        withPortal={isMobile}
                        minDate={start || new Date()}
                        minTime={
                          start && end && start.toDateString() === end.toDateString()
                            ? start
                            : new Date(0, 0, 0, 0, 0)
                        }
                        maxTime={new Date(0, 0, 0, 23, 45)}
                        calendarClassName={clsx(
                          LightMode
                            ? "light-calendar"
                            : "dark-calendar"
                        )}
                        className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                          errors.end
                            ? `border-2 border-red-500 focus:border-red-500 ${
                                shake ? "animate-shake" : ""
                              }`
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        }`}
                      />

                      {errors.end && (
                        <p className="text-red-500 text-xs mt-1 italic">{errors.end}</p>
                      )}
                    </div>

                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${text} mb-1`}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setErrors(prev => ({ ...prev, location: null }));
                      }}
                      placeholder="e.g. Conference Room"
                      className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                        errors.location
                          ? `border-2 border-red-500 focus:border-red-500 ${
                              shake ? "animate-shake" : ""
                            }`
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                    />
                    {errors.location && (
                      <p className='text-[#f64949fe] italic text-sm mt-1'>{errors.location}</p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${text} mb-1`}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors(prev => ({ ...prev, description: null }));
                      }}
                      placeholder="Add details about the event..."
                      className={`w-full ${text} ${placeholder} px-3 py-2 border rounded-md outline-0 transition-all duration-50 ease-in-out ${
                        errors.description
                          ? `border-2 border-red-500 focus:border-red-500 ${
                              shake ? "animate-shake" : ""
                            }`
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      }`}
                    />
                    {errors.description && (
                      <p className='text-[#f64949fe] italic text-sm mt-0'>{errors.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <div>
                      {initialEvent && onDelete && (
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(initialEvent.id);
                            onClose();
                          }}
                          className="ClickAnimationNoti px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className={`ClickAnimationNoti px-4 py-2 text-sm font-medium ${text} hover:bg-slate-100 hover:text-black shadow-inner rounded-lg cursor-pointer transition-all duration-200 ease-in-out`}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className={`ClickAnimationNoti shadow-inner hover:shadow-innerWH px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 rounded-lg cursor-pointer transition-all duration-200 ease-in-out`}
                      >
                        Save
                      </button>

                    </div>
                  </div>

                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}