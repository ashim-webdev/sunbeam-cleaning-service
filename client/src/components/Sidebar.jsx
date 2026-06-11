import clsx from "clsx";
import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { FaTasks, FaRegTrashAlt, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { Briefcase, AlarmClock, ChevronsUp, ChevronsDown, ChevronDown, ChevronUp , Send, BarChart3, PieChart } from 'lucide-react';
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdHourglassEmpty
} from "react-icons/md";
import { FaBroom } from "react-icons/fa";
import { ClipboardCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar, setMiniMenu, setOpenProfile } from "../redux/slices/authSlice";
import {
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import "./components.css";
import ProfileDropdown from "./ProfileDropdown";
import ConnectionStatus from "./ConnectionStatus";







const Sidebar = () => {
  const {
    user, 
    onlineUsers,
  } = useSelector((state) => state.auth);
  // DarkMode Change

  const { LightMode, MiniMenu, isProfileOpen }  = useSelector((state) => state.auth);

  const { data: notifications = [] } = useGetNotificationsQuery();

  const [markAsRead] = useMarkNotiAsReadMutation();

  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];


  // Sidebar Smooth Slide
  const navigate = useNavigate()

  // console.log(notifications);

  // Calculate unread notifications count
  const taskNotifications = notifications.filter(
    (item) =>
      item.refModel === "Task" &&
      !item.isRead?.includes(user._id)
  ).length;

  const completedNotifications = notifications.filter(
    (item) =>
      item.notificationType === "completed" &&
      !item.isRead?.includes(user._id)
  ).length;

  const inProgressNotifications = notifications.filter(
    (item) =>
      item.notificationType === "in-progress" &&
      !item.isRead?.includes(user._id)
  ).length;

  const leaveNotifications = notifications.filter(
    (item) =>
      item.refModel === "Leave" &&
      !item.isRead?.includes(user._id)
  ).length;

  const eventNotifications = notifications.filter(
    (item) =>
      item.refModel === "Event" &&
      !item.isRead?.includes(user._id)
  ).length;

  // console.log(taskNotifications, leaveNotifications, eventNotifications);


  // Handle navigation with sidebar animation
  const SIDEBAR_ANIMATION_MS = 200;

  const handleNavClick = async (path) => {
    try {

      // TASK ROUTES
      const isTaskRoute =
        path.includes("tasks") ||
        path.includes("completed") ||
        path.includes("in-progress") ||
        path.includes("todos");

      // TASK NOTIFICATIONS
      if (path.includes("completed")) {
        await markAsRead({
          isReadType: "completed",
        }).unwrap();
      }

      else if (path.includes("in-progress")) {
        await markAsRead({
          isReadType: "in-progress",
        }).unwrap();
      }

      else if (path.includes("todos")) {
        await markAsRead({
          isReadType: "todo",
        }).unwrap();
      }

      else if (path.includes("tasks")) {
        await markAsRead({
          isReadType: "task",
        }).unwrap();
      }

      // MARK LEAVE NOTIFICATIONS AS READ
      if (path.includes("leaves")) {
        await markAsRead({
          isReadType: "leave",
        }).unwrap();
      }

      // MARK EVENT NOTIFICATIONS AS READ
      if (path.includes("scheduler")) {
        await markAsRead({
          isReadType: "event",
        }).unwrap();
      }

      dispatch(setOpenSidebar(false));

      setTimeout(() => {
        navigate(`/${path}`);
      }, SIDEBAR_ANIMATION_MS);

    } catch (error) {
      console.log(error);
    }
  };
  // End


  // SideBar Links
  const linkData = [
    {
      label: "Dashboard",
      link: "dashboard",
      icon: <MdDashboard />,
      role: ["admin", "employee"]
    },
    {
      label: "Bookings",
      link: "bookings",
      icon: <i className="fa-solid fa-newspaper"></i>,
      role: ["admin"]
    },
    {
      label: "Tasks",
      link: "tasks",
      icon: <FaTasks />,
      role: ["admin", "employee"]
    },
    {
      label: "Completed",
      link: "completed/completed",
      icon: <MdTaskAlt />,
      role: ["admin", "employee"]
    },
    {
      label: "In Progress",
      link: "in-progress/in progress",
      icon: <MdHourglassEmpty />,
      role: ["admin", "employee"]
    },
    {
      label: "To Do",
      link: "todos/todo",
      icon: <MdOutlinePendingActions />,
      role: ["admin", "employee"]
    },
    {
      label: "Team",
      link: "team",
      icon: <FaUsers />,
      role: ["admin"]
    },
    {
      label: "Status",
      link: "status",
      icon: <IoCheckmarkDoneOutline />,
      role: ["admin"]
    },
  ];


  const ActivityLinkData = [
      {
      label: "Overview",
      link: "overview",
      icon: <BarChart3 size={18} />,
      role: ["admin"]
    },
    {
      label: "Trash",
      link: "trashed",
      icon: <FaRegTrashAlt />,
      role: ["admin"]
    },
    {
      label: "Scheduler",
      link: "scheduler",
      icon: <AlarmClock size={18} />,
      role: ["admin", "employee"]
    },
    {
      label: `${user.isAdmin ? "Leave Requests" : "My Leaves"}`,
      link: "leaves",
      icon: <Send size={18} />,
      role: ["admin", "employee"]
    },
  ];


  const role = user?.isAdmin ? "admin" : "employee";

  const sidebarLinks = linkData.filter(link => link.role.includes(role)); // Filter links based on user role

  const activityLinks =  ActivityLinkData.filter(link => link.role.includes(role)); // Filter activity links based on user role


  const NavLink = ({ el }) => {
    return (
      <div
        key={el.label}
        onClick={(e) => {
          e.stopPropagation()
          handleNavClick(el.link)
          dispatch(setOpenProfile(false))
        }}
        className={clsx(
          "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-xl justify-between items-center text-base cursor-pointer transition-colors ease-in-out duration-300 ",
          LightMode 
            ? "text-black"
            : "text-white "
          ,
          path === el.link.split("/")[0] ? ` ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75  ${LightMode ? "shadow-darkSM" : "shadow-blueSM"}` : `transition-colors ease-in-out duration-75 ${LightMode ? "hover:shadow-darkSM hover:bg-[#0004fc4e]" : "hover:shadow-blueSM hover:bg-white hover:text-black"}`
        )}
      >
        <div className="flex gap-2 items-center">
          {el.icon}
          <span className='whitespace-nowrap'>{el.label}</span>
        </div>

        {(
          (el.label === "Tasks" && taskNotifications > 0) ||
          (el.label === "Completed" && completedNotifications > 0) ||
          (el.label === "In Progress" && inProgressNotifications > 0)
        ) && (
          <div className="flex items-center justify-center">

            <span className={`
                ${LightMode 
                  ? "text-white shadow-darkSM"
                  : "text-white shadow-lightSM"
                }
                flex justify-center items-center text-center text-[9px] text-white font-semibold w-5 h-5 rounded-full bg-red-600 pt-0.5 transition-all duration-300 ease-in-out
              `}
            >
              <span>
                {
                  el.label === "Tasks"
                    ? taskNotifications > 99
                      ? "99+"
                      : taskNotifications

                    : el.label === "Completed"
                    ? completedNotifications > 99
                      ? "99+"
                      : completedNotifications

                    : el.label === "In Progress"
                    ? inProgressNotifications > 99
                      ? "99+"
                      : inProgressNotifications

                    : 0
                }
              </span>
            </span>
          </div>
        )}
      </div>
    );
  };

  const ActivityNavLink = ({ el }) => {
    return (
      <div
        key={el.label}
        onClick={() => handleNavClick(el.link)}
        className={clsx(
          "ClickAnimationNoti relative w-full flex gap-2 px-5 py-1.25 rounded-xl items-center text-base cursor-pointer transition-colors ease-in-out duration-300 ",
          LightMode 
            ? "text-black"
            : "text-white "
          ,
          path === el.link.split("/")[0] ? `ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75 ${LightMode ? "shadow-darkSM" : "shadow-blueSM"}` : `transition-colors ease-in-out duration-75 ${LightMode ? "hover:shadow-darkSM hover:bg-[#0004fc4e]" : "hover:shadow-blueSM hover:bg-white hover:text-black"}`
        )}
      >
        {el.icon}
        <span className='whitespace-nowrap'>{el.label}</span>

        {((el.link === "leaves" && leaveNotifications > 0) ||
          (el.link === "scheduler" && eventNotifications > 0)) && (
          <div className="absolute -top-2.5 right-1 flex items-center justify-center">
            <span
              className={`
                ${LightMode 
                  ? "text-white shadow-darkSM"
                  : "text-white shadow-lightSM"
                }
                flex justify-center items-center text-center text-[9px]
                font-semibold w-5 h-5 rounded-full bg-red-600 pt-0.5
              `}
            >
              <span>
                {el.link === "leaves"
                  ? leaveNotifications > 99
                    ? "99+"
                    : leaveNotifications
                  : eventNotifications > 99
                    ? "99+"
                    : eventNotifications}
              </span>
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      onClick={() => {
        dispatch(setOpenProfile(false))
        dispatch(setOpenSidebar(false))
      }}
      className=
      {`
        ${LightMode 
          ? "bg-white "
          : "bg-black/90"
        }
          w-full h-full flex flex-col gap-6 p-5 transition-colors ease-in-out duration-300
      `}>
      <div className="flex justify-between item-center gap-2">
        <div className='flex gap-2 items-center'>
          <div className={`${LightMode ? "shadow-darkSM border-blue-900 bg-blue-900/30" : "shadow-lightSM border-white bg-blue-600"} p-2 rounded-full border`}>
            <ClipboardCheck className={`w-6 h-6 transition-colors ease-in-out duration-300 ${LightMode ? " text-blue-900" : "text-white"}`} />
          </div>
          <span className={`relative flex justify-center items-center gap-1 text-2xl font-bold transition-colors ease-in-out duration-300 ${LightMode ? " text-blue-900" : "text-white"} `}>
            <span>TaskMe</span>
            <span><FaBroom className='w-6 h-6' /></span>
            <svg
              className="absolute top-7.5 left-0 w-30 -rotate-6"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C60 4 160 1 298 6"
                stroke={`${LightMode ? "#009c05" : "#2B62F5"}`}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
        
        <div className="xl:hidden flex sm:flex-col sm:mr-6 md:mr-10 lg:mr-20 justify-center item-center">
          <ConnectionStatus isOnline={onlineUsers.includes(user._id.toString())}/>
        </div>
      </div>

      <div className='pl-4 pr-4 flex-1 flex flex-col gap-y-3 overflow-y-auto overflow-x-hidden'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}

        <div onClick={(e) => e.stopPropagation()} className="relative">
          <div className={clsx("relative ml-0 flex-1 flex flex-col gap-y-3", !MiniMenu && "z-50")}>
            <div 
              onClick={() => dispatch(setMiniMenu(!MiniMenu))}
              className="relative"
            >
              <div
                tabIndex={0}
                className={clsx(
                  `ClickAnimationNoti line-clamp-1 w-full flex gap-2 px-5 py-1.25 rounded-xl items-center text-base cursor-pointer transition-all ease-in-out duration-300 ${LightMode ? "focus:shadow-darkSM hover:shadow-darkSM hover:bg-[#0004fc4e] focus:bg-[#0004fc4e]" : "focus:shadow-blueSM hover:shadow-blueSM  hover:bg-white hover:text-black focus:bg-white focus:text-black"}`,
                  LightMode 
                    ? "text-black"
                    : "text-white"
                  ,
                )}
              >
                <span className='whitespace-nowrap flex gap-2 justify-center items-center '>
                  <Briefcase size={18} />
                  Actions
                </span>

                {user?.isAdmin ? (
                  <span className="w-full flex justify-end items-center transition-colors duration-300 ease-in-out">
                    {!MiniMenu ? <ChevronsUp size={25} className="font-bold animate-UpDown" /> : <ChevronDown size={25} className="font-bold" />}
                  </span>
                ) : (
                  <span className="w-full flex justify-end items-center transition-colors duration-300 ease-in-out">
                    {!MiniMenu ? <ChevronsDown size={25} className="font-bold" /> : <ChevronUp size={25} className="font-bold animate-UpDown" /> }
                  </span>
                )}
              </div>

                {user?.isAdmin ? (
                  <AnimatePresence>
                    {!MiniMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseOver={(e) => e.stopPropagation()} 
                        className={`
                          ${LightMode 
                            ? "bg-white shadow-darkSM"
                            : "bg-black/95 shadow-lightSM"
                          }
                          absolute -top-54 right-0 xl:-right-1 w-fit z-90 mt-3 flex flex-col justify-center items-center gap-2 rounded p-4 cursor-pointer
                        `}
                        >
                        {activityLinks.map((link) => (
                          <ActivityNavLink el={link} key={link.label} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <AnimatePresence>
                    {!MiniMenu && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.5 }}
                        onMouseOver={(e) => e.stopPropagation()} 
                        className={`
                          ${LightMode 
                            ? "bg-white shadow-darkSM"
                            : "bg-black/95 shadow-lightSM border border-white"
                          }
                          absolute top-8 right-0 xl:-right-1 w-fit z-90 mt-3 flex flex-col justify-center items-center gap-2 rounded p-4 cursor-pointer
                        `}
                        >
                        {activityLinks.map((link) => (
                          <ActivityNavLink el={link} key={link.label} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
                
            </div>
          </div>
        </div>
      </div>

      <div 
      className={`
          relative flex flex-row justify-between items-center sm:mt-0 cursor-pointer transition-all duration-300 ease-in-out
        `}>
        <div onClick={(e) => e.stopPropagation()} className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} parentDiv rounded-2xl w-full transition-all duration-300 ease-in-out`}>
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;