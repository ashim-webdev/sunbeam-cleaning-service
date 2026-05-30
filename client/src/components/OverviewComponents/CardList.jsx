import clsx from "clsx";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, CheckCircle } from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { setSelectUserDashInfo, setUserViewInfo } from "../../redux/slices/authSlice";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice";
import { useGetLeavesByUserQuery } from "../../redux/slices/api/leaveApiSlice";
import { getInitials } from "../../utils/index";
import Pagination from "../Pagination";



const EmployeeList = ({ user, title, popUpUserInfo, useInfo, index }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const hover = LightMode ? "hover:shadow-darkSM hover:bg-gray-50" : "hover:shadow-lightSM hover:bg-white/20"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const bg = LightMode ? "bg-white" : "bg-black/80"
  const text = LightMode ? "text-black" : "text-white"


  return (
    <>
      <motion.div
        key={user._id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1, // stagger effect
        }}>
      <Card 
        onClick={(e) => {
          if (title === "Employee's List") {
            e.stopPropagation()
            useInfo(user)
          }
        }}
        className={`${hover} ${changeAnimation} ${bg} ${text} flex-row justify-between gap-4 p-4 cursor-pointer  active:scale-95`}
        >
          <div className="relative">
            <div 
              className={clsx(
                "w-11 h-11 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
                user.isActive ? "border-green-500" : "border-red-600"
            )}>
              {user?.profileImage ? 
                <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
              :
                <span className='text-xs md:text-sm text-center'>
                  {getInitials(user?.name || "Unknown User")}
                </span>
              }
            </div>
            {user?.isAdmin && (
              <span className="absolute -top-3 rotate-25 right-0">
                <FaCrown className="text-yellow-500 text-lg"/>
              </span>
            )}
          </div>
          <CardContent className="flex-1 p-0">
            <CardTitle className="text-sm font-medium line-clamp-1">
              {user.name}
            </CardTitle>
            <Badge variant="secondary" className="hidden sm:block">{user.title}</Badge>
            <Badge variant="secondary" className="sm:hidden">{user.title.slice(0,10) + "..."}</Badge>
          </CardContent>
          <CardFooter className="pr-4 text-xl text-blue-600">
            {title === "Employee's List" ?
              <i className="fa-solid fa-chart-simple drop-shadow-[-2px_0.5px_1px_w]"></i>
              :
              <div className="flex justify-center items-center">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={clsx(
                    "w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner hover:shadow-innerWH  cursor-pointer active:scale-95",
                    user.isActive ? "bg-green-500 text-white hover:bg-green-700 hover:scale-105" : "bg-red-500 text-white hover:bg-red-700 hover:scale-105"
                  )}
                >
                  {user.isActive ? "Active" : ""}
                </button>
              </div>
            }
          </CardFooter>
      </Card>
      </motion.div>
    </>
  )
}


const LeaveRequests = ({ user, title, popUpUserInfo, useInfo }) => {
  const { LightMode, selectedUserId } = useSelector((state) => state.auth);

  const { data: leaveData = [] } = useGetLeavesByUserQuery(selectedUserId, {
    skip: !selectedUserId || typeof selectedUserId !== "string",
  });

  // console.log(leaveData)

  // helper functions (keep yours if already defined)
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-500";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-500";
      case "denied":
        return "bg-red-100 text-red-700 border-red-500";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      case "denied":
        return "Denied";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "denied":
        return <CheckCircle size={14} />;
      default:
        return null;
    }
  };


  const bg = LightMode ? "bg-white" : "bg-black/95";
  const text = LightMode ? "text-black" : "text-white";
  const shadow = LightMode ? "shadow-darkSM" : "shadow-lightSM";
  const changeAnimation = "transition-all duration-300 ease-in-out"

  // sort newest first
  const sortedLeaves = [...leaveData].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );


  // Framer Motion
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1, // entrance (top → bottom)
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1, // 🔥 THIS reverses order on exit
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };


  return (
    <>
      <div className={`w-full mb-6 space-y-4 rounded-lg`}>
        
        {sortedLeaves.length === 0 && (
          <div className="text-center text-sm opacity-60 mt-55">
            No leave requests found
          </div>
        )}

        <AnimatePresence>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.9, ease: "easeInOut" }}
            exit="exit"
            className={`w-full h-full flex flex-col gap-3`}
          >
            {sortedLeaves.map((sortedLeaves) => (
              <motion.div
                key={sortedLeaves._id}
                variants={item}
                layout
                className={`${bg} ${text} ${changeAnimation} border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer`}
              >
                <div className="relative flex flex-col gap-3">

                  {/* TOP ROW */}
                  <div className="flex justify-end items-end gap-3 ">
                    {/* STATUS */}
                    <div
                      className={`px-2 py-1 rounded-full border text-xs flex items-center gap-1 ${shadow} ${changeAnimation} ${getStatusColor(
                        sortedLeaves.status
                      )}`
                    }
                    >
                      {getStatusIcon(sortedLeaves.status)}
                      {getStatusText(sortedLeaves.status)}
                    </div>
                  </div>

                  {/* REASON */}
                  <h4 className="font-semibold text-base -mt-6">
                    {sortedLeaves.reason}
                  </h4>

                  {/* META */}
                  <div className="flex gap-4 text-sm opacity-80">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        {sortedLeaves.duration}{" "}
                        {sortedLeaves.duration === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(sortedLeaves.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm opacity-90 line-clamp-2">
                    {sortedLeaves.description}
                  </p>

                  {/* MESSAGE */}
                  {sortedLeaves.message && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-blue-600" />
                        <span className="text-xs uppercase font-semibold opacity-70">
                          Management Comment
                        </span>
                      </div>
                      <p className="text-sm mt-2 pl-4">{sortedLeaves.message}</p>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

const ActiveEmployees = ({ user, title, popUpUserInfo, useInfo, index }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const hover = LightMode ? "hover:shadow-darkSM hover:bg-gray-50" : "hover:shadow-lightSM hover:bg-white/20"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const bg = LightMode ? "bg-white" : "bg-black/80"
  const text = LightMode ? "text-black" : "text-white"

  return (
    <>
      {user.isActive && (
        <motion.div
        key={user._id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1, // stagger effect
        }}>
          <Card 
              onClick={(e) => {
                e.stopPropagation()
                popUpUserInfo(user)
              }}
              className={`${hover} ${changeAnimation} ${bg} ${text} flex-row users-center justify-between gap-4 p-4  active:scale-95 cursor-pointer`}
            >
              <div className="relative">
                <div 
                  className={clsx(
                    "w-11 h-11 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
                    user.isActive ? "border-green-500" : "border-red-600"
                )}>
                  {user?.profileImage ? 
                    <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                  :
                    <span className='text-xs md:text-sm text-center'>
                      {getInitials(user?.name || "Unknown User")}
                    </span>
                  }
                </div>
                {user?.isAdmin && (
                  <span className="absolute -top-3 rotate-25 right-0">
                    <FaCrown className="text-yellow-500 text-lg"/>
                  </span>
                )}
              </div>
              <CardContent className="flex-1 p-0">
                <CardTitle className="text-sm font-medium line-clamp-1">
                  {user.name}
                </CardTitle>
                <Badge variant="secondary" className="hidden sm:block">{user.title}</Badge>
                <Badge variant="secondary" className="sm:hidden">{user.title.slice(0,10) + "..."}</Badge>
              </CardContent>
              <CardFooter className="pr-4 -mr-9 sm:mr-0 text-xl text-blue-600">
                {title === "Employee's List" ?
                  <i className="fa-solid fa-chart-simple drop-shadow-[-2px_0.5px_1px_w]"></i>
                  :
                  <AnimatePresence>
                    <motion.span
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Badge 
                        className={`${user.isActive ? "bg-green-600" : "bg-red-600"} text-white text-[16px] shadow-darkSM`}
                      >
                        {user.isActive ? "Active" : "Disabled"}
                      </Badge>            
                    </motion.span>
                  </AnimatePresence>
                }
              </CardFooter>
          </Card>
        </motion.div>
      )}
    </>
  )
}

const DisabledEmployees = ({ user, title, popUpUserInfo, useInfo, index }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const hover = LightMode ? "hover:shadow-darkSM hover:bg-gray-50" : "hover:shadow-lightSM hover:bg-white/20"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const bg = LightMode ? "bg-white" : "bg-black/80"
  const text = LightMode ? "text-black" : "text-white"

  return (
    <>
      {!user.isActive && (
        <motion.div
        key={user._id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1, // stagger effect
        }}>
          <Card 
              onClick={(e) => {
                e.stopPropagation()
                popUpUserInfo(user)
              }}
              className={`${hover} ${changeAnimation} ${bg} ${text} flex-row users-center justify-between gap-4 p-4  active:scale-95 cursor-pointer`}
            >
              <div className="relative">
                <div 
                  className={clsx(
                    "w-11 h-11 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
                    user.isActive ? "border-green-500" : "border-red-600"
                )}>
                  {user?.profileImage ? 
                    <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                  :
                    <span className='text-xs md:text-sm text-center'>
                      {getInitials(user?.name || "Unknown User")}
                    </span>
                  }
                </div>
                {user?.isAdmin && (
                  <span className="absolute -top-3 rotate-25 right-0">
                    <FaCrown className="text-yellow-500 text-lg"/>
                  </span>
                )}
              </div>
              <CardContent className="flex-1 p-0">
                <CardTitle className="text-sm font-medium line-clamp-1">
                  {user.name}
                </CardTitle>
                <Badge variant="secondary" className="hidden sm:block">{user.title}</Badge>
                <Badge variant="secondary" className="sm:hidden">{user.title.slice(0,10) + "..."}</Badge>
              </CardContent>
              <CardFooter className="pr-4 -mr-9 sm:mr-0 text-xl text-blue-600">
                {title === "Employee's List" ?
                  <i className="fa-solid fa-chart-simple drop-shadow-[-2px_0.5px_1px_w]"></i>
                  :
                  <AnimatePresence>
                    <motion.span
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Badge 
                        
                        className={`${user.isActive ? "bg-green-600" : "bg-red-600"} text-white text-[16px] shadow-darkSM`}
                      >
                        {user.isActive ? "Active" : "Disabled"}
                      </Badge>            
                    </motion.span>
                  </AnimatePresence>
                }
              </CardFooter>
          </Card>
        </motion.div>
      )}
    </>
  )
}



const Components = ({
  user,
  title,
  popUpUserInfo,
  useInfo,
  index
}) => {

  if (title === "Employee's List") {
    return (
      <AnimatePresence mode="wait">
        <EmployeeList
          index={index}
          user={user}
          title={title}
          popUpUserInfo={popUpUserInfo}
          useInfo={useInfo}
        />
      </AnimatePresence>
    );
  }

  if (title === "Active Employee's") {
    return (
      <ActiveEmployees
        index={index}
        user={user}
        title={title}
        popUpUserInfo={popUpUserInfo}
        useInfo={useInfo}
      />
    );
  }

  if (title === "Disabled Employee's") {
    return (
      <DisabledEmployees
        index={index}
        user={user}
        title={title}
        popUpUserInfo={popUpUserInfo}
        useInfo={useInfo}
      />
    );
  }

  return null;
};




const CardList = ({ 
  title, 
  subtitle, 
  openInfoClick, 
  open, 
  setOpen
}) => {
  const { LightMode } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);

  const type =
  title === "Active Employee's"
    ? "active"
    : title === "Disabled Employee's"
    ? "disabled"
    : "";

  const { data, isLoading, refetch } = useGetTeamListsQuery(
    {
      page,
      limit: 6,
      type,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    }
  );

  // console.log(data)
  

  const users = data?.users || []

  const pagination = data?.pagination;

  const dispatch = useDispatch()

  const useInfo = (user) => {
    dispatch(setSelectUserDashInfo(user))
    // console.log(user)
  }

  const popUpUserInfo = (user) => {
    // console.log(user)
    openInfoClick(user)
    dispatch(setUserViewInfo(user))
  }



  const isEmpty = users.length === 0;


  const bg = LightMode ? "bg-gray-100" : "bg-blue-600/20"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const text = LightMode ? "text-black" : "text-white"

  return (
    <>
    <div className={`${text}`}>
      <h1
        className={`${title === "Employee's List" ? "text-center mt-0 mb-2" : "mb-6"} text-lg font-medium`}>
        {title}
      </h1>

      {subtitle && title === "Employee's List" ? (
        <p className=" text-center text-sm opacity-70">
          {subtitle}
        </p>
      ) : null}

      <div className="px-3">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-6" />
      </div>
      
      <div 
        className={`
          ${users.length >= 6 || title === "Employee Leave Requests" 
            ?
            "h-131 overflow-x-hidden"
            :
            `${title !== "Employee's Profile" ? "h-131" : "h-full" }`
          } 
          ${bg} ${changeAnimation} 
          w-full pb-1.5 pt-2 px-2 flex flex-col gap-2`
        }>
        {title === "Employee Leave Requests" ? (
          <LeaveRequests />
        ) : isEmpty ? (
          <div className="text-center text-sm opacity-60 my-auto">
            {title === "Disabled Employee's"
              ? "No disabled users"
              : title === "Active Employee's"
              ? "No active users"
              : "No users found"}
          </div>
        ) : (
          users.map((user, index) => (
            <div key={user._id}>
              <Components
                user={user}
                title={title}
                popUpUserInfo={popUpUserInfo}
                useInfo={useInfo}
                index={index}
              />
            </div>
          ))
        )}
        
      </div>
    </div>

    {pagination?.totalPages > 1 && title !== "Employee Leave Requests" && (
      <div className={`
        ${title !== "Employee Leave Requests" ? "-mt-2" : "mt-4"}
        w-full flex justify-center items-center
      `}>
        <span>
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={pagination?.totalPages || 1}
          />
        </span>
      </div>
    )}
    </>
  );
};

export default CardList;