import { useState } from 'react';
// import { LeaveRequest } from '../lib/supabase';
import { useSelector } from "react-redux";
import { X, CheckCircle, XCircle, Calendar, Clock, User, FileText } from 'lucide-react';


export function LeaveDetailModal({ request, isAdmin, onClose, onUpdate }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = (newStatus) => {
    setIsUpdating(true);

    setTimeout(() => {
      const updatedRequest = {
        ...request,
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      onUpdate(updatedRequest);
      setIsUpdating(false);
      onClose();
    }, 300);
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
      fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-80 transition-colors duration-300 ease-in-out
    `}>
      <div className={`
          ${LightMode 
            ? "bg-white/90" 
            : "bg-black/90"
          }
          rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ease-in-out
        `}>
        <div className={`sticky top-0 ${LightMode ? "bg-white " : "bg-black/90"} border-b border-gray-300 px-6 py-4 flex items-center justify-between transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-bold ${LightMode ? "text-black" : "text-white"}`}>Leave Details</h2>
          <button
            onClick={onClose}
            className={`${LightMode ? "text-gray-700 hover:text-black " : "text-gray-200 hover:text-white"} transition-colors duration-300 ease-in-out cursor-pointer active:scale-95`}
          >
            <X size={30} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${LightMode ? "text-black/90" : "text-white/90"}`}>{request.reason}</h3>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg transition-colors duration-300 ease-in-out`}>
              <User className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`} size={20} />
              <div>
                <p className={`${LightMode ? "text-gray-500" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Employee</p>
                <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>{request.user_email}</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg transition-colors duration-300 ease-in-out`}>
              <Clock className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`}size={20} />
              <div>
                <p className={`${LightMode ? "text-gray-500" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Duration</p>
                <p className={` font-medium ${LightMode ? "text-gray-800" : "text-gray-400"}`}>
                  {request.duration} {request.duration === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 p-3 ${LightMode ? "bg-gray-50 shadow-dark" : "bg-black/70 shadow-light"} rounded-lg `}>
              <Calendar className={` ${LightMode ? "text-gray-700" : "text-gray-200"} transition-colors duration-300 ease-in-out`} size={20} />
              <div>
                <p className={`${LightMode ? "text-gray-500" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>Submitted On</p>
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
              <h4 className={`${LightMode ? "text-gray-500" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out`}>
                Description
              </h4>
            </div>
            <p className={`${LightMode ? "text-gray-700 bg-gray-50 border-gray-200" : "text-gray-200 bg-black/70 border-gray-400"} border leading-relaxed  p-4 rounded-lg`}>
              {request.description}
            </p>
          </div>

          {isAdmin && request.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleUpdateStatus('approved')}
                disabled={isUpdating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus('denied')}
                disabled={isUpdating}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Deny
              </button>
            </div>
          )}

          {!isAdmin && (
            <div className={`${LightMode ? "text-gray-700 bg-gray-50 border-blue-300" : " bg-black/70 border-blue-500"} border  rounded-lg p-4`}>
              <p className={`text-sm  ${LightMode ? "text-blue-800" : "text-blue-500"}`}>
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
  );
}
