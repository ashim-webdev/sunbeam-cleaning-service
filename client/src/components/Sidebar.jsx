import clsx from "clsx";
import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Briefcase, AlarmClock, ChevronsUp, ChevronDown, Send } from 'lucide-react';
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdHourglassEmpty
} from "react-icons/md";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate
} from '@floating-ui/react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar, setMiniMenu } from "../redux/slices/authSlice";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import "./components.css";
import Dark_Light_Btn from "./Dark_Light_Btn";





const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    link: "in-progress/in-progress",
    icon: <MdHourglassEmpty />,
  },
  {
    label: "To Do",
    link: "todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    link: "team",
    icon: <FaUsers />,
  },
  {
    label: "Status",
    link: "status",
    icon: <IoCheckmarkDoneOutline />,
  },
  {
    label: "Trash",
    link: "trashed",
    icon: <FaTrashAlt />,
  },
];


const ActivityLinkData = [
  {
    label: "Scheduler",
    link: "scheduler",
    icon: <AlarmClock size={18} />,
  },
  {
    label: "Leave Request",
    link: "leave-request",
    icon: <Send size={18} />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  // DarkMode Change
  const { LightMode, MiniMenu } = useSelector((state) => state.auth);


  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const sidebarLinks = user?.isAdmin ? linkData.slice(0, 5) : linkData; // Links that will not be available to employees

  const activityLinks = ActivityLinkData; // Links that will not be available to employees


  // Sidebar Smooth Slide
  const navigate = useNavigate()

  const SIDEBAR_ANIMATION_MS = 200;

  const handleNavClick = (path) => {
    dispatch(setOpenSidebar(false)); // start slide-out
    setTimeout(() => {
      navigate(`/${path}`);
    }, SIDEBAR_ANIMATION_MS);
  };
  // End


  // MiniMenu
  const modeChange = () => {
    dispatch(setMiniMenu());
  };


  const [open, setOpen] = useState(false)

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "top-end",
    strategy: "fixed",
    middleware: [
      offset(20),   // spacing from button
      flip(),      // 👈 this makes it open top if bottom has no space
      shift(),     // keeps it inside screen
    ],
    whileElementsMounted: autoUpdate,
  })


  const NavLink = ({ el }) => {
    return (
      <div
        onClick={() => handleNavClick(el.link)}
        className={clsx(
          "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-full items-center text-base cursor-pointer transition-colors ease-in-out duration-300 hover:shadow-inner",
          LightMode 
            ? "text-black"
            : "text-white "
          ,
          path === el.link.split("/")[0] ? " ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75" : "transition-colors ease-in-out duration-75 hover:bg-[#0004fc4e] hover:shadow-inner"
        )}
      >
        {el.icon}
        <span className='whitespace-nowrap'>{el.label}</span>
      </div>
    );
  };

  const ActivityNavLink = ({ el }) => {
    return (
      <div
        onClick={() => handleNavClick(el.link)}
        className={clsx(
          "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-full items-center text-base cursor-pointer transition-colors ease-in-out duration-300 hover:shadow-inner",
          LightMode 
            ? "text-black"
            : "text-white "
          ,
          path === el.link.split("/")[0] ? " ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75" : "transition-colors ease-in-out duration-75 hover:bg-[#0004fc4e] hover:shadow-inner"
        )}
      >
        {el.icon}
        <span className='whitespace-nowrap'>{el.label}</span>
      </div>
    );
  };

  return (
    <div 
      className=
      {`
        ${LightMode 
          ? "bg-white "
          : "bg-black/90"
        }
          w-full portrait:h-dvh landscape:h-full flex flex-col gap-6 p-5 transition-colors ease-in-out duration-300
      `}>
      <h1 className='flex gap-1 items-center'>
        <p className='p-2 bg-blue-600 shadow-inner rounded-full'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </p>
        <span className={`text-2xl font-bold transition-colors ease-in-out duration-300 ${LightMode ? " text-black" : "text-white"} `}>
          TaskMe
        </span>
      </h1>

      <div className='pl-4 flex-1 flex flex-col gap-y-3'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}

        <div onClick={(e) => e.stopPropagation()} className="relative">
          <div className={clsx("relative ml-0 flex-1 flex flex-col gap-y-3", open && "z-50")}>
              <div 
                ref={refs.setReference}
                onClick={() => setOpen(!open)}
                className=""
              >
                <div
                  tabIndex={0}
                  onClick={modeChange}
                  className={clsx(
                    "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-full items-center text-base cursor-pointer transition-all ease-in-out duration-300 hover:shadow-inner hover:bg-[#0004fc4e] focus:bg-[#0004fc4e]",
                    LightMode 
                      ? "text-black"
                      : "text-white"
                    ,
                  )}
                >
                  <span className='whitespace-nowrap flex gap-2 justify-center items-center'>
                    <Briefcase size={18} />
                    Work Actions
                  </span>

                  <span className="w-full flex justify-end items-center transition-colors duration-300 ease-in-out">
                    {MiniMenu ? <ChevronsUp size={25} className="font-bold animate-UpDown" /> : <ChevronDown size={25} className="font-bold" />}
                  </span>
                </div>
              </div>

              {MiniMenu && (
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  onMouseOver={(e) => e.stopPropagation()} 
                  className={`
                    ${LightMode 
                      ? "bg-white shadow-darkSM"
                      : "bg-black/90 shadow-lightSM"
                    }
                    absolute w-fit z-90 -right-6 mt-3 flex flex-col justify-center items-center gap-2 rounded p-2 cursor-pointer transition-colors ease-in-out duration-300
                  `}
                  >
                  {activityLinks.map((link) => (
                    <ActivityNavLink el={link} key={link.label} />
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>








      <div className={
        `
          ${LightMode 
            ? "bg-black/10"
            : "bg-white/10"
          }
          flex flex-row justify-between items-center border-t-2 border-blue-600 sm:mt-0
        `}>
        <button className={`
            ${LightMode 
              ? "text-black"
              : "text-white"
            }
            w-full flex gap-2 p-3 items-center text-xl sm:text-lg transition-colors ease-in-out duration-300 
          `}>
          <MdSettings />
          <span>Settings</span>
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center items-center pb-3 pt-5 pl-6 pr-2 bg-blue-600 rounded-tl-full sm:hidden"
        >
          <span className={`
            ${LightMode 
              ? "border-2 border-amber-300 shadow-black/80"
              : "border-2 border-white shadow-white/60"
            }
            ClickAnimationNoti flex justify-center items-center rounded-full transition-colors ease-in-out duration-300 shadow-md 
          `}>
            <Dark_Light_Btn />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
