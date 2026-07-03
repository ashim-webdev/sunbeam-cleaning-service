import { socket } from "../socket";
import clsx from "clsx";
import moment from "moment";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt"
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../components/ui/badge"
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { MdOutlineTimer, MdTimer } from "react-icons/md";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { 
  ChevronsRight,
  History,
  CalendarCheck 
} from 'lucide-react';
import { PRIORITY_STYLES, TASK_TYPE, getInitials } from "../utils";
import { formatDistanceToNow } from "date-fns";

import { useGetDashboardStatsQuery } from "../redux/slices/api/taskApiSlice";

import Chart from "../components/Chart"
import UserInfoDash from "../components/UserInfoDash"
import SocialMedia from "../components/SocialMedia";
import Loading from "../components/Loading";
import OnlineStatus from "../components/OnlineStatus";
import Pagination from "../components/Pagination"; 





const Dashboard = () => {
  const { 
    LightMode,
    user,
    onlineUsers,
  } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);

  const admin = user.isAdmin
  

  const {
    data: summary,
    isLoading,
    refetch,
  } = useGetDashboardStatsQuery(
    {
      page,
      limit: 12,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // console.log(summary)

  // Update everything in real time
  useEffect(() => {
  socket.on("dashboardUpdated", () => {
    refetch();
  });

  return () => {
    socket.off("dashboardUpdated");
  };
}, [refetch]);

  console.log(summary)

  const totals = summary?.tasks || {};

  const chartData = summary?.generalChartData || [];

  const currentMonthData =
    chartData[chartData.length - 1] || {
      todo: 0,
      inProgress: 0,
      completed: 0,
    };

  const lastMonthData =
    chartData[chartData.length - 2] || {
      todo: 0,
      inProgress: 0,
      completed: 0,
    };

  const currentMonthTotal =
    currentMonthData.todo +
    currentMonthData.inProgress +
    currentMonthData.completed;

  const lastMonthTotal =
    lastMonthData.todo +
    lastMonthData.inProgress +
    lastMonthData.completed;

  // console.log(lastMonth)


  const stats = [
    {
      _id: "1",
      label: "TOTAL",
      total: summary?.totalTasks || 0,
      thisMonth: currentMonthTotal,
      lastMonth: lastMonthTotal,
      icon: <FaNewspaper />,
      bg: "bg-[#be185d]",
      tx: "text-[#be185d]",
    },
    {
      _id: "2",
      label: "COMPLETED",
      total: totals["completed"] || 0,
      thisMonth: currentMonthData.completed,
      lastMonth: lastMonthData.completed,
      icon: <LuClipboardCheck />,
      bg: "bg-[#0f766e]",
      tx: "text-[#0f766e]",
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: totals["in progress"] || 0,
      thisMonth: currentMonthData.inProgress,
      lastMonth: lastMonthData.inProgress,
      icon: <MdOutlineTimer />,
      bg: "bg-[#f59e0b]",
      tx: "text-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODO",
      total: totals["todo"] || 0,
      thisMonth: currentMonthData.todo,
      lastMonth: lastMonthData.todo,
      icon: <FaArrowsToDot />,
      bg: "bg-[#1d4ed8]",
      tx: "text-[#1d4ed8]",
    },
  ];



  const bgMenu = LightMode ? "bg-white shadow-darkSM border-black/90" : "bg-black/90 shadow-lightSM border-white/90";
  const arrow = LightMode ? "bg-white" : "bg-black/90"
  const text = LightMode ? "text-black !important" : "text-white !important";
  const cautionBG = LightMode ? "bg-blue-600" : "bg-blue-600/40";


  const Card = ({ label, lastMonth, thisMonth, count, bg, tx, icon }) => {
    return (
      <div className={`
        ${LightMode 
          ? "bg-white shadow-md shadow-black/30"
          : "bg-black/90 shadow-md shadow-white/30"
        }
        transition-all ease-in-out duration-300 cursor-pointer w-full h-32 p-5 rounded-md flex items-center justify-between hover:scale-105 sm:hover:scale-102 lg:hover:scale-105  
      `}>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className={`
              ${LightMode 
                ? "text-gray-600"
                : "text-white"
              }
              text-base md:text-sm lg:text-base font-semibold transition-all ease-in-out duration-300 whitespace-nowrap
            `}>{label}</p>
          <span className={clsx("text-2xl font-semibold" , tx)}>{count}</span>

          <div className="flex justify-start item-center gap-1.5 mt-2">
            <span className={`${LightMode ? "text-gray-600" : "text-gray-400"} text-sm -mb-1 flex justify-center item-center gap-1 transition-all duration-300 ease-in-out`}>
              <History size={20} /> {lastMonth}
            </span>

            <div className="flex pt-1.5 justify-center item-center">
              <i className={`fa-solid fa-diamond text-[8px] ${LightMode ? "text-blue-900/60" : "text-white/60"} transition-all duration-300 ease-in-out`}></i>
            </div>

            <span className='text-sm text-[#0061FA] -mb-1 flex justify-center item-center gap-1'>
              <CalendarCheck size={20} /> {thisMonth}
            </span>
          </div>
        </div>
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-inner text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };


  const DisabledComponent = ({ user }) => {
    const [tooltipShow, setTooltipShow] = useState(false);

    useEffect(() => {
      if (user) return;

      const interval = setInterval(() => {
        setTooltipShow(prev => !prev);
      }, 5000);

      return () => clearInterval(interval);
    }, [user]);

    return (
      <div className="w-2/3 flex justify-between items-center">
          <div className={`
            ${LightMode
              ? "border-[#E8E8E8] bg-[#E8E8E8]"
              : "border-[#3D3D3D] bg-[#3D3D3D]"
            }
            absolute -bottom-6 -right-4 flex justify-center items-center rounded-lg border-8 transition-all duration-300 ease-in-out
          `}>
          <div className={`relative inline-block group`}>
            <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                    }} 
                    className=""
                    >
                    <Badge 
                      className={`${user ? "bg-green-700" : "bg-red-700"} text-white text-[16px] shadow-darkSM transition-all duration-100 ease-in-out`}
                    >
                      {user ? "Active" : "Disabled"}
                    </Badge>     
                  </button>       
                </motion.span>
              </AnimatePresence>

            {user
              ?
              null
              :
              <AnimatePresence mode="wait">
                {tooltipShow && (
                  <motion.div
                    key="box"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={`z-10 absolute bottom-full -left-14 -translate-x-1/2 mb-5 w-72 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2`}
                  >
                    <div
                      className={`relative ${bgMenu} p-4 rounded-2xl border transition-all duration-300 ease-in-out`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`${cautionBG} flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out`}
                        >
                          <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-red-600"
                        >
                          <path
                            clipRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                        </div>
                        <h3 className={`${text} text-sm font-semibold transition-all duration-300 ease-in-out`}>Important Information</h3>
                      </div>

                      <div className="space-y-2">
                        <p className={`${text} text-sm transition-all duration-300 ease-in-out`}>
                          This user account is currently disabled. Please contact an administrator for more information.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-red-600">
                          <i className="fa-solid fa-ban"></i>
                          <span className="">User Disabled</span>
                        </div>
                      </div>

                      <div
                        className={`${arrow} absolute inset-0 rounded-2xl  blur-xl opacity-50 transition-all duration-300 ease-in-out`}
                      ></div>

                      <div
                        className={`${arrow} absolute -bottom-1.5 right-7 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-red-600 transition-all duration-300 ease-in-out`}
                      ></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            }

          </div>
        </div>
      </div>
    )
  }


  const DisabledComponentTable = ({ user }) => {
    const [tooltipShow, setTooltipShow] = useState(false);

    useEffect(() => {
      if (user) return;

      const interval = setInterval(() => {
        setTooltipShow(prev => !prev);
      }, 5000);

      return () => clearInterval(interval);
    }, [user]);

    return (
      <div className={`${user ? "ml-2.5" : ""} relative inline-block group`}>
        <AnimatePresence>
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                }} 
                className=""
                >
                <Badge 
                  className={`${user ? "bg-green-700" : "bg-red-700"} text-white text-[16px] shadow-darkSM transition-all duration-100 ease-in-out`}
                >
                  {user ? "Active" : "Disabled"}
                </Badge>     
              </button>       
            </motion.span>
          </AnimatePresence>

        {user
          ?
          null
          :
          <AnimatePresence mode="wait">
            {tooltipShow && (
              <motion.div
                key="box"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-72 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2"
              >
                <div
                  className={`relative ${bgMenu} p-4 rounded-2xl border transition-all duration-300 ease-in-out`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`${cautionBG} flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out`}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 text-red-600"
                      >
                        <path
                          clipRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h3 className={`${text} text-sm font-semibold transition-all duration-300 ease-in-out`}>Important Information</h3>
                  </div>

                  <div className="space-y-2">
                    <p className={`${text} text-sm transition-all duration-300 ease-in-out`}>
                      This user account is currently disabled. Please contact an administrator for more information.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-red-600">
                      <svg 
                        fill="currentColor"
                        className="w-4 h-4 text-red-600"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 640 640"
                      ><path d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/></svg>
                      <span className="text-red-600">User Disabled</span>
                    </div>
                  </div>

                  <div
                    className={`${arrow} absolute inset-0 rounded-2xl  blur-xl opacity-50 transition-all duration-300 ease-in-out`}
                  ></div>

                  <div
                    className={`${arrow} absolute -bottom-1.5 right-33.5 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-red-600 transition-all duration-300 ease-in-out`}
                  ></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        }

      </div>
    )
  }






  const UserTable = ({ users }) => {
    const employees = users?.filter((user) => !user?.isAdmin);
    const Administrators = users?.filter((user) => user?.isAdmin);

    const [employeePage, setEmployeePage] = useState(1);
    const [adminPage, setAdminPage] = useState(1);

    const USERS_PER_PAGE = 6;


    // Employee pagination
    const employeeStart = (employeePage - 1) * USERS_PER_PAGE;
    const employeeEnd = employeeStart + USERS_PER_PAGE;

    const paginatedEmployees = employees?.slice(
      employeeStart,
      employeeEnd
    );

    const employeeTotalPages = Math.ceil(
      employees.length / USERS_PER_PAGE
    );

    // Admin pagination
    const adminStart = (adminPage - 1) * USERS_PER_PAGE;
    const adminEnd = adminStart + USERS_PER_PAGE;

    const paginatedAdmins = Administrators?.slice(
      adminStart,
      adminEnd
    );

    const adminTotalPages = Math.ceil(
      Administrators.length / USERS_PER_PAGE
    );


    const TableHeader = () => (
      <thead className={`
        ${LightMode 
          ? "border-gray-400"
          : "border-gray-600"
        }
        border-b transition-all ease-in-out duration-300
      `}>
        <tr className={`
            ${LightMode 
                ? "text-black"
                : "text-white"
            } text-left transition-all ease-in-out duration-300
          `}>
          <th className='py-2 pl-4'>Full Name</th>
          <th className='py-2 pl-4.5 text-start'>Status</th>
          <th className='py-2 pl-3 hidden sm:block'>Created At</th>
        </tr>
      </thead>
    );

    const TableRow = ({ user, index }) => (
      <motion.tr 
        layout
        key={index}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1, // stagger effect
        }}
        className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 transition-all ease-in-out duration-300
        `}>
        <td className='py-2 px-6'>
          <div className='flex items-center gap-3'>
            <div className={clsx(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
              user?.isActive ? "border-green-500" : "border-red-600"
            )}>
              {user?.profileImage ? 
                <img 
                  src={user?.profileImage}
                  loading="lazy"
                  decoding="async"
                  alt="Avatar" 
                  className="w-full h-full object-cover "
                />
              :
                <span className='text-xs md:text-sm text-center'>
                  {getInitials(user?.name || "Unknown User")}
                </span>
              }
            </div>
            <div className={`${user?.isActive ? "" : "blur-[2px]"} flex flex-col justify-center items-start gap-1`}>
              <p className="whitespace-nowrap"> {user?.name}</p>
              <span className={`
                ${LightMode 
                    ? "text-black"
                    : "text-white"
                }
                text-xs h-fit transition-all ease-in-out duration-300
              `}>{user?.role}</span>
              <span className="py-0.5 ml-1">
                <OnlineStatus
                  isOnline={onlineUsers.includes(user?._id.toString())}
                  type="Dashboard"
                />
              </span>
            </div> 
          </div>
        </td>

        <td className="">
          <DisabledComponentTable user={user?.isActive} />
        </td>

        <td className={`w-32 px-3 whitespace-nowrap ${user.isActive ? "" : "blur-[2px]"}`}>
          {formatDistanceToNow(new Date(user?.createdAt), {
            addSuffix: true,
          })}
        </td>

        <td className="">
          <div className="flex justify-center px-2">
            <SocialMedia tiktok={user?.tiktok} x={user?.x} whatsApp={user?.whatsApp} telegram={user?.telegram} />
          </div>
        </td>
      </motion.tr>
    );



  const UserCard = ({ user, admin, index }) => (    
    <motion.div 
      layout
      key={index}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{
        duration: 0.4,
        delay: index * 0.2, // stagger effect
      }}
      className={`
      ${LightMode
        ? "bg-white shadow-darkSM"
        : "bg-black/90 shadow-lightSM"
      }
      relative w-full rounded-2xl h-40 flex flex-col justify-center items-center transition-all duration-300 ease-in-out
    `}>
        <div className={`${user.isActive ? "border-green-500" : "border-red-600"} border-2 rounded-full absolute -top-10 -left-2 flex flex-col justify-center items-center gap-3 whitespace-nowrap`}>
          <div className={clsx(
            LightMode
              ? "shadow-darkSM border-white"
              : "shadow-lightSM border-black",
            "w-30 h-30 rounded-full border-8 flex items-center justify-center text-white text-sm overflow-hidden bg-blue-600 transition-all duration-300 ease-in-out",
          )}>
            {user?.profileImage ? 
              <img 
                src={user?.profileImage} 
                alt="Avatar" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            :
              <span className='text-2xl md:text-sm text-center'>
                {getInitials(user?.name || "Unknown User")}
              </span>
            }
          </div>
        </div>

        <div className={`
          ${LightMode
            ? "border-[#E8E8E8] bg-[#E8E8E8]"
            : "border-[#3D3D3D] bg-[#3D3D3D]"
          }
          absolute border-2 p-2 rounded-full -top-8 -right-4 flex justify-center transition-all duration-300 ease-in-out
        `}>
          <SocialMedia tiktok={user?.tiktok} x={user?.x} whatsApp={user?.whatsApp} telegram={user?.telegram} />
        </div>

        <div className={`
          ${LightMode
            ? "text-black"
            : "text-white"
          }
            w-full ml-2 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="ml-30 w-40 flex flex-col justify-center items-start gap-0">
          <div className="text-md font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:hidden">
            {user.name.length > 15
              ? `${user.name.slice(0, 15)}...`
              : user.name}
          </div>
            <div className="text-xl font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:block hidden">{user.name}</div>
            
            <div className="text-sm [@media(min-width:400px)_and_(min-width:500px)]:text-lg line-clamp-1">
              {admin ?
                user?.email
                  ? user?.email
                  :
                  "No Email"
                :
                user?.email
                  ? user.email.slice(0, 1) + "......@gmail.com"
                  :
                  "No Email"
              }
            </div>
            <div className="pt-3 ml-1">
              <OnlineStatus
                isOnline={onlineUsers.includes(user._id.toString())}
              />
            </div>
          </div>
        </div>

        <div className={`
            ${LightMode
              ? "text-black"
              : "text-white"
            }
            w-full mt-2 ml-8 flex justify-start items-center gap-2 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="text-sm font-semibold">{user.title}</div>

          <div className={`w-0.5 h-8 ${user.isActive ? "bg-linear-to-b from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-b from-red-400/10 via-red-500 to-red-400/10" } `} />

          <div className="text-sm font-semibold">{user.role}</div>
        </div>

        <DisabledComponent user={user.isActive}/>

    </motion.div>
  )

    return (
      <div className="md:px-15 lg:px-30 py-5 pt-26 overflow-hidden">
        {/* Employee table */}
        <div className={`
            ${LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30"
            }
            ${employeeTotalPages > 1 ? "h-154" : "h-fit"}
            relative hidden sm:block w-full px-2 md:px-6 py-4 shadow-md rounded transition-all ease-in-out duration-300
          `}>
          <table className='w-full mb-5'>
            <TableHeader />

            <AnimatePresence mode="wait">
              <tbody>
                {paginatedEmployees?.map((user, index) => (
                  <TableRow key={user?._id}  user={user} index={index} />
                ))}
              </tbody>
            </AnimatePresence>
          </table>

          {employeeTotalPages > 1 && (
            <div className="absolute -bottom-24 left-0 right-0 w-full justify-center items-center mt-4">
              <span>
                <Pagination
                  page={employeePage}
                  setPage={setEmployeePage}
                  totalPages={employeeTotalPages}
                />
              </span>
            </div>
          )}

          <div className={`
              ${LightMode 
                ? "bg-white shadow-darkSM text-black"
                : "bg-black/90 border border-white text-white"
              }
              absolute -top-4 -right-3 text-md inline-block px-2 py-1 rounded-full font-bold transition-colors ease-in-out duration-300
            `}>
            Employee's Table
          </div>
        </div>

        {user?.isAdmin && (
          <>
            <div className={`${employeeTotalPages > 1 ? "mt-26" : "mt-15"} mb-15 px-15 hidden sm:block`}>
              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
            </div>

            {/* Administrator table */}
            <div className={`
                ${LightMode 
                  ? "bg-white shadow-md shadow-black/30"
                  : "bg-black/90 shadow-md shadow-white/30"
                }
                ${adminTotalPages > 1 ? "h-154" : "h-fit"}
                relative hidden sm:block w-full px-2 md:px-6 py-4 shadow-md rounded transition-all ease-in-out duration-300
              `}>
              <table className='w-full mb-5'>
                <TableHeader />
                <tbody>
                  {paginatedAdmins?.map((user, index) => (
                    <TableRow key={user?._id} user={user} index={index} />
                  ))}
                </tbody>
              </table>

              <div className={`
                  ${LightMode 
                    ? "bg-white shadow-darkSM text-black"
                    : "bg-black/90 border border-white text-white"
                  }
                  absolute -top-4 -right-3 text-md inline-block px-2 py-1 rounded-full font-bold transition-colors ease-in-out duration-300
                `}>
                Admin's Table
              </div>
            </div>

            {adminTotalPages > 1 && (
              <div className="sm:flex w-full hidden justify-center items-center mt-4">
                <span>
                  <Pagination
                    page={adminPage}
                    setPage={setAdminPage}
                    totalPages={adminTotalPages}
                  />
                </span>
              </div>
            )}
          </>
        )}


        
        {/* Employee user card */}
        <div className={`
          ${LightMode
            ? "shadow-darkSM "
            : "shadow-lightSM"
          }
          relative flex flex-col justify-center gap-15 px-4 pt-20 pb-15 mx-1 sm:hidden rounded-2xl transition-all duration-300 ease-in-out
        `}>
          <AnimatePresence mode="wait">
            {paginatedEmployees?.map((user, index) => (
              <UserCard key={user?._id} user={user} admin={admin} index={index} />
            ))}
          </AnimatePresence>

          {employeeTotalPages > 1 && (
            <div className="absolute sm:hidden -bottom-30 left-0 right-0 w-full flex justify-center items-center mt-4">
              <span>
                <Pagination
                  page={employeePage}
                  setPage={setEmployeePage}
                  totalPages={employeeTotalPages}
                />
              </span>
            </div>
          )}

          <span className="absolute z-0 text-center -top-5 left-0 right-0">
            <span className={`
              ${LightMode
                ? "text-black bg-[#E8E8E8]"
                : "text-white bg-[#3D3D3D]"
              }
              py-2 px-4 w-fit text-3xl font-semibold font-sans transition-all duration-300 ease-in-out
            `}>
              {admin ? "Employees" : "Colleagues"}
            </span>
          </span>
        </div>

        {user.isAdmin && (
          <>
            <div className={`${employeeTotalPages > 1 ? "mt-38" : "mt-15"} mb-20 px-5 sm:hidden`}>
              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
            </div>

            {/* Admin user card */}
            <div className={`
              ${LightMode
                ? "shadow-darkSM "
                : "shadow-lightSM"
              }
              relative flex flex-col justify-center gap-15 px-4 pt-20 pb-15 mx-1 sm:hidden rounded-2xl transition-all duration-300 ease-in-out
            `}>
              {paginatedAdmins?.map((user, index) => (
                <UserCard key={user?._id} user={user} admin={admin} index={index} />
              ))}



              <span className="absolute z-0 text-center -top-5 left-0 right-0">
                <span className={`
                  ${LightMode
                    ? "text-black bg-[#E8E8E8]"
                    : "text-white bg-[#3D3D3D]"
                  }
                  py-2 px-4 w-fit text-3xl font-semibold font-sans transition-all duration-300 ease-in-out
                `}>
                  Administrators
                </span>
              </span>
            </div>

            {adminTotalPages > 1 && (
              <div className="sm:hidden  flex w-full justify-center items-center mt-4">
                <span>
                  <Pagination
                    page={adminPage}
                    setPage={setAdminPage}
                    totalPages={adminTotalPages}
                  />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };







  const TaskTable = ({ tasks, pagination, page, setPage }) => {

    const ICONS = {
      high: <MdKeyboardDoubleArrowUp />,
      medium: <MdKeyboardArrowUp />,
      low: <MdKeyboardDoubleArrowDown />,
      normal: <MdKeyboardArrowDown />
    };

    const TableHeader = () => (
      <thead className={`
        ${LightMode 
          ? "border-gray-400"
          : "border-gray-600"
        }
        border-b transition-all ease-in-out duration-300
      `}>
        <tr className={`
            ${LightMode 
                ? "text-black"
                : "text-white"
            } text-left transition-all ease-in-out duration-300
          `}>
          <th className='py-2 whitespace-nowrap pl-4'>Task Title</th>
          <th className='py-2 px-6 whitespace-nowrap'>Client Names</th>
          <th className='py-2 px-4'>Address</th>
          <th className='py-2 px-6.5'>Priority</th>
          <th className='py-2 text-center'>Team</th>
          <th className='py-2 whitespace-nowrap text-center'>Created At</th>
        </tr>
      </thead>
    );

    const TableRow = ({ task, index }) => {
      // console.log(taskInfo)
      const textPriority = task?.priority || "";
      const TextPriShort = textPriority.slice(0, 4) + "...";
      const titleShort = task.title.split(" ").length > 4 ? task.title.split(" ").slice(0, 5).join(" ") + "..." : task.title || "";

      const nameShort = task.clientName.split(" ").length > 2 ? task.clientName.split(" ").slice(0, 2).join(" ") + "..." : task.clientName || "";

      const addressShort = task.address.split(" ").length > 2 ? task.address.split(" ").slice(0, 2).join(" ") + "..." : task.address || "";

      return (
        <motion.tr 
          key={task._id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1, // stagger effect
          }}
          className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 cursor-pointer transition-all ease-in-out duration-300
        `}>
            <td className='py-2 pl-4'>
              <div className='flex items-center gap-2'>
                <div
                  className={clsx("w-4 h-4 rounded-full shadow-inner", TASK_TYPE[task.stage])}
                />
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    }
                    hidden xl:block whitespace-nowrap transition-all ease-in-out duration-300 
                  `}>
                  {task.title}
                </p>
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    }
                    xl:hidden whitespace-nowrap transition-all ease-in-out duration-300 
                  `}>
                  {titleShort}
                </p>
              </div>
            </td>
            
            <td className="py-2 px-6">
              <p className={`
                  ${LightMode 
                    ? "text-black/70"
                    : "text-white/70"
                  }
                  whitespace-nowrap transition-all ease-in-out duration-300 capitalize 
                `}>
                {nameShort || "N/A"}
              </p>
            </td>

            <td className="py-2 px-4">
              <p className={`
                  ${LightMode 
                    ? "text-black/70"
                    : "text-white/70"
                  }
                  whitespace-nowrap transition-all ease-in-out duration-300 capitalize
                `}>
                {addressShort || "N/A"}
              </p>
            </td>

            <td className='py-2 px-6'>
              <div className={"flex sm:hidden gap-1 items-center"}>
                <span className={clsx("text-lg animate-UpDown", PRIORITY_STYLES[task?.priority])}>
                  {ICONS[task?.priority]}
                </span>
                <span className='capitalize'>{TextPriShort}</span>
              </div>
              <div className={"hidden sm:flex gap-1 items-center"}>
                <span className={clsx("text-lg animate-UpDown", PRIORITY_STYLES[task?.priority])}>
                  {ICONS[task?.priority]}
                </span>
                <span className='capitalize'>{task?.priority}</span>
              </div>
            </td>

            <td className='py-2 px-6  flex justify-center items-center'>
              <div className=' flex flex-row justify-start items-center mr-4'>
                <div className="relative flex flex-row justify-center items-center">
                  <UserInfoDash task={task} />
                </div>
              </div>
            </td>

            <td className='py-2 px-4 text-center'>
              <span className={`
                  ${LightMode 
                      ? "text-black/50"
                      : "text-white/60"
                  }
                  whitespace-nowrap text-base transition-all ease-in-out duration-300
                `}>
                {formatDistanceToNow(new Date(task?.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </td>
        </motion.tr>
      )
    };

    return (
      <>
        <div
          className={clsx(
            "w-full px-2 md:px-4 pt-4 pb-4 rounded transition-all ease-in-out duration-300",
            pagination?.totalPages > 1 ? "h-178" : "h-auto",
            LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30",
            tasks.length === 0 ? 
              LightMode 
              ? "shadow-md shadow-black/30"
              : "shadow-md shadow-white/30"
            :
              ""
          )}
        >
          <div className='overflow-x-auto overflow-y-hidden'>
            {tasks.length === 0 ?
              (
                <span className={`${LightMode ? "text-black/60" : "text-white/60"} h-100 flex flex-col justify-center item-center`}>
                  <span className="flex justify-center items-center gap-3">
                    <span className="text-center animate-bounce">
                      {admin ? "Create task :)" : "No assigned task yet :("}
                    </span>
                    {admin && (
                      <Link to={"/tasks"}>
                        <button className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} bg-teal-300 rounded-full p-2 hover:scale-102 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer`}>
                          <ChevronsRight size={25} />
                        </button>
                      </Link>
                    )}
                  </span>
                </span>
              )
                :
              (
                <table className='w-full relative'>
                  <TableHeader />

                  <AnimatePresence mode="wait">
                    <tbody className=''>
                      {tasks?.map((task, index) => (
                        <TableRow key={task?._id} task={task} index={index} />
                      ))}
                    </tbody>
                  </AnimatePresence>
                </table>
              )
            }
            
          </div>
        </div>

        {pagination?.totalPages > 1 && (
          <div className="w-full flex flex-col justify-center items-center -mt-2">
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



  const employees = summary?.users?.filter((user) => !user?.isAdmin);


  return (
    <div className='h-full py-4'>
      <>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
          {stats?.map(({ icon, lastMonth, thisMonth, bg, tx, label, total }, index) => (
            <Card key={index} icon={icon} lastMonth={lastMonth} thisMonth={thisMonth} bg={bg} tx={tx} label={label} count={total} />
          ))}
        </div>

        <div className={`
            ${LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30"
            }
            w-full my-16 p-4 transition-all ease-in-out duration-300 rounded-lg
          `}>
          <h4 className={`
              ${LightMode 
                ? "text-gray-700"
                : "text-gray-200"
              }
              text-xl font-bold mb-4 transition-all ease-in-out duration-300
            `}>
            Task Analytics
          </h4>
          <Chart  summary={summary} />
        </div>
        <div className='w-full flex flex-col gap-4 2xl:gap-10 py-8'>
          {/* RECENT AUTHORS */}
          {isLoading ? (
            <div className="h-100">
              <Loading />
            </div>
          )
            :
          (
            <TaskTable 
              tasks={summary?.recentTasks || []}
              pagination={summary?.pagination}
              page={page}
              setPage={setPage}
            />
          )}

          {/* RECENT USERS */}
          {isLoading ? (
            <div className="h-100">
              <Loading />
            </div>
          )
            :
          (
            <>
              {employees?.length === 0 ?
              (
                <span className={`${LightMode ? "text-black/60" : "text-white/60"} h-100 flex flex-col justify-center item-center`}>
                  <span className="flex justify-center items-center gap-3">
                    <span className="text-center animate-bounce">
                      {admin ? "Create an employee :)" : "No Employees created yet :("}
                    </span>
                    {admin && (
                      <Link to={"/team"}>
                        <button className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} bg-teal-300 rounded-full p-2 hover:scale-102 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer`}>
                          <ChevronsRight size={25} />
                        </button>
                      </Link>
                    )}
                  </span>
                </span>
              )
                :
              (
                <UserTable 
                  users={summary?.users || []}
                />
              )}
            </>
          )}
        </div>
      </>
    </div>
  )
}

export default Dashboard