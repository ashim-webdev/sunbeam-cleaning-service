import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { X, MapPin, Clock, AlignLeft } from 'lucide-react';


export default function EventViewPopover({
  isOpen,
  onClose,
  event,
}) {
  if (!event) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={onClose}>
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      Event Details
                    </div>
                    <DialogTitle
                      className="text-xl font-bold leading-6 text-slate-900"
                    >
                      {event.title}
                    </DialogTitle>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-slate-400">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">Time</div>
                      <div className="text-sm text-slate-500">
                        {formatDate(event.start)}
                      </div>
                      <div className="text-sm text-slate-500">
                        to {formatDate(event.end)}
                      </div>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-slate-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Location</div>
                        <div className="text-sm text-slate-500">{event.location}</div>
                      </div>
                    </div>
                  )}

                  {event.description && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-slate-400">
                        <AlignLeft size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Description</div>
                        <div className="text-sm text-slate-500 whitespace-pre-wrap">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
