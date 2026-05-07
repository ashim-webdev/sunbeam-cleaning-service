// import { LeaveRequest } from '../lib/supabase';
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { getInitials } from "../../utils/index";



export function LeaveList({ requests, isAdmin, onRequestClick }) {
  const { LightMode } = useSelector((state) => state.auth);

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

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

  if (sortedRequests.length === 0) {
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


  const hover = LightMode ? "hover:shadow-darkSM hover:bg-gray-50" : "hover:shadow-lightSM hover:bg-white/20"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const bg = LightMode ? "bg-white" : "bg-black/95"
  const text = LightMode ? "text-black" : "text-white"
  const navColor = LightMode ? "bg-gray-100" : "bg-blue-600/20"


  return (
    <div className={`${LightMode ? "bg-white" : "bg-black/95"} px-4 rounded-lg pt-6 pb-1 transition-colors duration-300 ease-in-out`}>
      <h2 className={`${LightMode ? "text-black" : "text-white"} text-[22px] font-semibold font-sans text-gray-800 mb-6  transition-colors duration-300 ease-in-out`}>
        {isAdmin ? 'All Leave Requests' : 'My Leave Requests'}
      </h2>
      
      <div className="px-3">
      <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-6" />
      </div>

      <div className={`${navColor} ${isAdmin ? "" : "overflow-y-auto lg:max-h-120 h-full"} mb-6 space-y-3 py-4 px-2 md:px-4 rounded-lg`}>
        {sortedRequests.map((request) => (
          <div
            key={request._id}
            onClick={() => onRequestClick(request)}
            className={`${isAdmin ? "mt-12 mb-6" : "my-9"} ${bg} ListHB border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer`}
          >
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="relative flex flex-col md:flex-row gap-2 mb-2">
                  <div>
                    <h3 className={`${LightMode ? "text-black/90" : "text-white/90"} ${isAdmin ? "pt-7" : "pt-0"} line-clamp-1 font-cursive text-lg font-semibold text-gray-800 transition-colors duration-300 ease-in-out`}>{request.reason}</h3>
                  </div>
                  {isAdmin && (
                    <>
                      <span className={`${LightMode ? "text-gray-700" : "text-gray-200"} absolute -top-12  w-fit flex justify-center bg-transparent rounded-xl items-center text-sm transition-colors duration-300 ease-in-out`}>
                        <Card 
                          className={`${changeAnimation} ${bg} ${text} userInfo border-b flex-row users-center justify-between gap-4 py-2 pl-3 pr-3 md:pr-0  active:scale-95 cursor-pointer`}
                          >
                            <div 
                              className={clsx(
                                "w-11 h-11 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
                                request.user?.isActive ? "border-green-500" : "border-red-600"
                            )}>
                              {request.user?.profileImage ? 
                                <img src={request.user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                              :
                                <span className='text-xs md:text-sm text-center'>
                                  {getInitials(request.user?.name || "Unknown request")}
                                </span>
                              }
                            </div>
                            <CardContent className="flex-1 p-0 [@media(min-width:50px)_and_(max-width:501px)]:hidden [@media(min-width:502px)]:block ">
                              <CardTitle className="text-sm font-medium pt-0.5">
                                {request.user?.name}
                              </CardTitle>
                              <span className="flex flex-col justify-center items-start">
                                <span className="hidden md:block">
                                  {request.user?.email}
                                </span>
                                
                                <Badge 
                                  variant="secondary"
                                  className="mt-1 md:hidden"
                                >{request.user?.title}</Badge>
                              </span>
                            </CardContent>
                            <CardFooter className="mt-1.5 pr-4 -mr-9 sm:mr-0 text-xl text-blue-600 hidden md:block">
                              <AnimatePresence>
                                <motion.span
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -30 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Badge variant="secondary">{request.user?.title}</Badge>            
                                </motion.span>
                              </AnimatePresence>
                            </CardFooter>
                        </Card>
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
