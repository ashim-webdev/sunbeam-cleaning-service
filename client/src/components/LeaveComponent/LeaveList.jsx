// import { LeaveRequest } from '../lib/supabase';
import { Calendar, Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { useSelector } from "react-redux";



export function LeaveList({ requests, isAdmin, userEmail, onRequestClick }) {
  const { LightMode } = useSelector((state) => state.auth);
  
  const filteredRequests = isAdmin
    ? requests
    : requests.filter((req) => req.user_email === userEmail);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'denied':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Hourglass className="text-yellow-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved :)';
      case 'denied':
        return 'Denied :(';
      default:
        return 'Pending...';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'denied':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  if (filteredRequests.length === 0) {
    return (
      <div className={`${LightMode ? "bg-white shadow-darkSM" : "shadow-lightSM bg-black/90"} rounded-lg p-8 text-center transition-colors duration-300 ease-in-out`}>
        <div className={` ${LightMode ? "text-gray-400" : "text-gray-300"} mb-4 transition-colors duration-300 ease-in-out`}>
          <Calendar size={64} className="mx-auto" />
        </div>
        <p className={` ${LightMode ? "text-gray-600" : "text-gray-400"} text-lg font-sans transition-colors duration-300 ease-in-out`}>
          {isAdmin ? 'No leave requests yet' : 'You haven\'t submitted any leave requests yet'}
        </p>
      </div>
    );
  }


  return (
    <div className={`${LightMode ? "bg-white shadow-darkSM" : "shadow-lightSM bg-black/90"} rounded-lg p-6 transition-colors duration-300 ease-in-out`}>
      <h2 className={`${LightMode ? "text-black" : "text-white"} text-[22px] font-semibold font-sans text-gray-800 mb-6 transition-colors duration-300 ease-in-out`}>
        {isAdmin ? 'All Leave Requests' : 'My Leave Requests'}
      </h2>

      <div className="space-y-3">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            onClick={() => onRequestClick(request)}
            className="ListHB border border-gray-200 rounded-lg my-6 p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                  <div>
                    <h3 className={`${LightMode ? "text-black/90" : "text-white/90"} line-clamp-1 pt-2 font-cursive text-lg font-semibold text-gray-800 transition-colors duration-300 ease-in-out`}>{request.reason}</h3>
                  </div>
                  {isAdmin && (
                    <>
                      <span className={`${LightMode ? "text-gray-700 bg-gray-100 shadow-darkSM" : "text-gray-200 bg-black/70 shadow-lightSM"} w-fit px-2 flex justify-center items-center text-sm  py-1 rounded transition-colors duration-300 ease-in-out`}>
                        {request.user_email}
                      </span>
                    </>
                  )}
                </div>

                <div className={`flex items-center gap-4 text-sm ${LightMode ? "text-gray-800" : "text-gray-300"} mb-3 transition-colors duration-300 ease-in-out`}>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Clock size={16} />
                    <span>{request.duration} {request.duration === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Calendar size={16} />
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className={`${LightMode ? "text-gray-800" : "text-gray-300"} text-sm line-clamp-2 transition-colors duration-300 ease-in-out`}>{request.description}</p>

                {request.message && (
                  
                <div className="mt-6 pt-2.5 border-t border-blue-600">
                  <div className="flex items-center gap-2 ">
                    <CheckCircle className="text-blue-700 animate-UpDown" size={20} />
                    <h4 className={`${LightMode ? "text-gray-600" : "text-gray-200"} text-xs uppercase tracking-wide transition-colors duration-300 ease-in-out font-semibold`}>
                      Management Commented
                    </h4>
                  </div>
                </div>
                )}

              </div>

              <div className={`ListStats ${LightMode ? "bg-white border-gray-200" : "bg-black/90 border-gray-200"} absolute -top-9.5 right-0  border-b-2  p-1 rounded-full transition-colors duration-300 ease-in-out`}>
                <div className={`px-2 py-1 rounded-full border-2 font-medium text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-inner ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {getStatusText(request.status)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
