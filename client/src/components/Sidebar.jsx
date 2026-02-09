import clsx from "clsx";
import React from "react";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdHourglassEmpty
} from "react-icons/md";
import { setLightMode } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
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
    link: "in-progress/in progress",
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

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  // DarkMode Change
  const { LightMode } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const sidebarLinks = user?.isAdmin ? linkData.slice(0, 5) : linkData; // Links that will not be available to employees






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


  const NavLink = ({ el }) => {
    return (
      <div
        onClick={() => handleNavClick(el.link)}
        className={clsx(
          "w-full lg:w-3.5/4 flex gap-2 px-5 py-1.25 rounded-full items-center text-base cursor-pointer transition-colors ease-in-out duration-300",
          LightMode 
            ? "text-gray-800  dark:text-gray-400"
            : "text-white "
          ,
          path === el.link.split("/")[0] ? "transition-colors ease-in-out bg-[#005FFB] text-white duration-75" : "transition-colors ease-in-out duration-75 hover:bg-[#0004fc4e]"
        )}
      >
        {el.icon}
        <span className=''>{el.label}</span>
      </div>
    );
  };

  return (
    <div className=
    {`
      ${LightMode 
        ? "bg-white "
        : "bg-black/90"
      }
        w-full  h-screen flex flex-col gap-6 p-5 transition-colors ease-in-out duration-300
    `}>
      <h1 className='flex gap-1 items-center'>
        <p className='p-2 bg-blue-600 rounded-full'>
          <MdOutlineAddTask className='text-white text-2xl font-black' />
        </p>
        <span className={`text-2xl font-bold transition-colors ease-in-out duration-300 ${LightMode ? " text-black dark:text-white" : "text-white"} `}>
          TaskMe
        </span>
      </h1>

      <div className='pl-4 flex-1 flex flex-col gap-y-3'>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
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
              ? "text-gray-800 dark:text-white"
              : "text-white/60"
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
            flex justify-center items-center rounded-full transition-colors ease-in-out duration-300 shadow-md 
          `}>
            <Dark_Light_Btn />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
