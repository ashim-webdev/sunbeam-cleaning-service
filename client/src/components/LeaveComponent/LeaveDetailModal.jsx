import { useState } from 'react';
// import { LeaveRequest } from '../lib/supabase';
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { X, CheckCircle, XCircle, Calendar, Clock, User, FileText, Send } from 'lucide-react';
// import { data } from 'react-router-dom';


export function LeaveDetailModal({ request, isAdmin, onClose, onUpdate }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const [shake, setShake] = useState(false);
  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Shake animation trigger
  const handleErrorAnimation = () => {
    setShake(true);

    if (navigator.vibrate) {
      navigator.vibrate(300);
    }
    
    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  // Form Error Handler
  const onError = (errors) => {
    handleErrorAnimation();

    if (errors.message) {
      toast.error("Message to employee is required");
    }
  };



  const handleUpdateStatus = (data, newStatus) => {
    // console.log(data)

    setIsUpdating(true);

    setTimeout(() => {
      const updatedRequest = {
        ...request,
        status: newStatus,
        message: data.message,
        updated_at: new Date().toISOString(),
      };

      onUpdate(updatedRequest);
      setIsUpdating(false);
      onClose();
    }, 300);
    reset()

  };



  const getStatusBadge = () => {
    switch (request.status) {
      case 'approved':
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap shadow-inner">
            <CheckCircle size={16} />
            Approved :)
          </span>
        );
      case 'denied':
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap shadow-inner">
            <XCircle size={16} />
            Denied :(
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap shadow-inner">
            Pending...
          </span>
        );
    }
  };

  return (
    <div className={`
      ${LightMode 
        ? "bg-black/80" 
        : "bg-white/80"
      }
      fixed inset-0 w-full flex items-center justify-center overflow-y-auto bg-opacity-50 z-80 transition-colors duration-300 ease-in-out
    `}>
      <div className=' absolute py-4 top-0 bottom-0 w-full h-fit px-2.5 flex items-center justify-center'>
        <div className={`
          ${LightMode 
            ? "bg-white/90" 
            : "bg-black/90"
          }
          relative rounded-lg shadow-xl max-w-2xl w-full max-h-auto  transition-colors duration-300 ease-in-out
        `}>
        <div className={`absolute left-0 right-0 top-0 ${LightMode ? "bg-white " : "bg-black/90"} border-b border-gray-300 px-6 py-4 flex items-center justify-between transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-bold ${LightMode ? "text-black" : "text-white"}`}>Leave Details</h2>
          <button
            onClick={onClose}
            className={`${LightMode ? "text-gray-700 hover:text-black " : "text-gray-200 hover:text-white"} transition-colors duration-300 ease-in-out cursor-pointer active:scale-95`}
          >
            <X size={30} />
          </button>
        </div>

        <div className="px-6 pt-28 pb-6 space-y-6">
          <div className="relative flex items-center justify-between">
            <h3 className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${LightMode ? "text-black" : "text-white"}`}>{request.reason}</h3>
            <span className='absolute -top-8 right-0 '>
              {getStatusBadge()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg transition-colors duration-300 ease-in-out`}>
              <User className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`} size={20} />
              <div>
                <p className={`${LightMode ? "text-black" : "text-white"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Employee</p>
                <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>{request.user_email}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg transition-colors duration-300 ease-in-out`}>
              <Clock className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`}size={20} />
              <div>
                <p className={`${LightMode ? "text-black" : "text-white"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Duration</p>
                <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>
                  {request.duration} {request.duration === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg `}>
              <Calendar className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`} size={20} />
              <div>
                <p className={`${LightMode ? "text-black" : "text-white"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Submitted On</p>
                <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>
                  {new Date(request.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {request.status !== 'pending' && (
              <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg `}>
                <Calendar className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`}size={20} />
                <div>
                  <p className={`${LightMode ? "text-gray-500" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>
                    {request.status === 'approved' ? 'Approved On' : 'Denied On'}
                  </p>
                  <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>
                    {new Date(request.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`}size={20} />
              <h4 className={`${LightMode ? "text-black" : "text-white"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out font-semibold`}>
                Description
              </h4>
            </div>
            <p className={`${LightMode ? "text-gray-700 bg-gray-50 border-gray-500" : "text-gray-200 bg-black/70 border-gray-400"} border leading-relaxed  p-4 rounded-lg`}>
              {request.description}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Send className="text-blue-700" size={20} />
              <h4 className={`${LightMode ? "text-gray-600" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out font-semibold`}>
                Management Commentary
              </h4>
            </div>
            <p className={`${LightMode ? "text-black bg-blue-100" : "text-white bg-blue-500/50"} border border-blue-700 leading-relaxed  p-4 rounded-lg`}>
              {request.message ? request.message : 'No commentary from management yet.'}
            </p>
          </div>

          {/* Wrap textarea + buttons inside form */}
          {isAdmin && request.status === 'pending' && (
            <form>
              <div className={`mt-10 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg transition-colors duration-300 ease-in-out`}>
                <label className={`block text-lg font-medium ${LightMode ? "text-black/80" : "text-white/80"} mb-2 flex items-center justify-start gap-2 transition-colors duration-300 ease-in-out`}>
                  <div className=''>Commentary</div>
                  <div className={`${LightMode ? "dot-spinner" : "dot-spinnerDark"} animate-UpDown transition-colors duration-300 ease-in-out`}>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                  </div>
                  
                </label>

                <textarea
                  placeholder="Type message to employee here..."
                  {...register("message", {
                    required: "Message is required",
                  })}
                  className={`${LightMode ? "placeholder-black/40 text-gray-700 bg-gray-50" : "placeholder-white/40 text-gray-200 bg-black/70"} 
                  ${errors.message
                    ? `border-2 border-red-500 ${shake ? "animate-shake" : ""}`
                    : "border-2 border-chocolate-700 hover:border-blue-800 focus:border-blue-800"}
                  w-full px-4 py-2 rounded-md outline-0`}
                />

                {errors.message && (
                  <p className="text-red-500 text-sm mt-1 italic">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={handleSubmit(
                    (data) => handleUpdateStatus(data, "approved"),
                    onError
                  )}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 shadow-inner hover:shadow-innerWH cursor-pointer active:scale-95 transition-all duration-200 ease-in-out"
                >
                  <CheckCircle size={20} />
                  Approve
                </button>

                <button
                  type="button"
                  onClick={handleSubmit(
                    (data) => handleUpdateStatus(data, "denied"),
                    onError
                  )}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 shadow-inner hover:shadow-innerWH cursor-pointer active:scale-95 transition-all duration-200 ease-in-out"
                >
                  <XCircle size={20} />
                  Deny
                </button>
              </div>
            </form>
          )}

          {!isAdmin && (
            <div className={`${LightMode ? "text-gray-700 bg-gray-50 border-blue-300" : " bg-black/70 border-blue-500"} ${request.status === 'approved' ? "border-green-600 bg-green-100" : ""} ${request.status === 'denied' ? "border-red-600 bg-red-100" : ""} border  rounded-lg p-4`}>
              <p className={`text-sm ${request.status === 'approved' ? "text-green-600" : request.status === 'denied' ? "text-red-600" : ""}  ${LightMode ? "text-blue-800" : "text-blue-500"}`}>
                {request.status === 'pending'
                  ? 'Your request is being reviewed by an administrator.'
                  : request.status === 'approved'
                  ? 'Your leave request has been approved!'
                  : 'Your leave request has been denied. Please contact your administrator for more information.'}
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
