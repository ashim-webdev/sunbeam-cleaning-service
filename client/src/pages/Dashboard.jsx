import clsx from "clsx";
import moment from "moment";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt"
import { useDispatch, useSelector } from "react-redux";
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
import { PRIORITY_STYLES, TASK_TYPE, getInitials } from "../utils";

import { summary, tasks } from "../assets/data";
import Chart from "../components/Chart"
import UserInfoDash from "../components/UserInfoDash"
import SocialMedia from "../components/SocialMedia";




import { Link } from "react-router-dom";




const Dashboard = () => {
  const { LightMode } = useSelector((state) => state.auth);

  const totals = summary.tasks
  const lastMonth = summary.lastMonth

  const stats = [
    {
      _id: "1",
      label: "TOTAL",
      total: summary?.totalTasks || 0,
      lastMonth: lastMonth.totalTasks,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
      tx: "text-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED",
      total: totals["completed"] || 0,
      lastMonth: lastMonth.tasks.completed,
      icon: <LuClipboardCheck />,
      bg: "bg-[#0f766e]",
      tx: "text-[#0f766e]",
    },
    {
      _id: "3",
      label: "IN PROGRESS ",
      total: totals["in progress"] || 0,
      lastMonth: lastMonth.tasks['in progress'],
      icon: <MdOutlineTimer />,
      bg: "bg-[#f59e0b]",
      tx: "text-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"],
      lastMonth: lastMonth.tasks.todo,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
      tx: "text-[#be185d]" || 0,
    },
  ];



  const bgMenu = LightMode ? "bg-white shadow-darkSM border-black/90" : "bg-black/90 shadow-lightSM border-white/90";
  const arrow = LightMode ? "bg-white" : "bg-black/90"
  const text = LightMode ? "text-black !important" : "text-white !important";
  const cautionBG = LightMode ? "bg-blue-600" : "bg-blue-600/40";


  const Card = ({ label, lastMonth, count, bg, tx, icon }) => {
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
              text-base md:text-sm lg:text-base font-semibold transition-colors ease-in-out duration-300 whitespace-nowrap
            `}>{label}</p>
          <span className={clsx("text-2xl font-semibold" , tx)}>{count}</span>
          <span className='text-sm text-[#0061FA] -mb-1'>
            <i className="fa-solid fa-chart-simple"></i> {lastMonth} <span className="text-gray-500 ">last month</span>
          </span>
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
            absolute -bottom-6 -right-4 flex justify-center items-center rounded-3xl border-8 transition-all duration-300 ease-in-out
          `}>
          <div class="relative inline-block group">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTooltipShow(e => !e)
              }}
              className={clsx(
                "relative w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner  cursor-pointer",
                user ? "bg-green-500 text-white" : "bg-red-500 text-white active:scale-95"
              )}
              >
              {user ? "Active" : "Disabled"}
            </button>

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
                    class={`z-10 absolute bottom-full -left-14 -translate-x-1/2 mb-5 w-72 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2`}
                  >
                    <div
                      class={`relative ${bgMenu} p-4 rounded-2xl border transition-all duration-300 ease-in-out`}
                    >
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class={`${cautionBG} flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out`}
                        >
                          <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="w-4 h-4 text-red-600"
                        >
                          <path
                            clip-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                        </div>
                        <h3 class={`${text} text-sm font-semibold transition-all duration-300 ease-in-out`}>Important Information</h3>
                      </div>

                      <div class="space-y-2">
                        <p class={`${text} text-sm transition-all duration-300 ease-in-out`}>
                          This user account is currently disabled. Please contact an administrator for more information.
                        </p>
                        <div class="flex items-center gap-2 text-xs text-red-600">
                          <i class="fa-solid fa-ban"></i>
                          <span className="">User Disabled</span>
                        </div>
                      </div>

                      <div
                        class={`${arrow} absolute inset-0 rounded-2xl  blur-xl opacity-50 transition-all duration-300 ease-in-out`}
                      ></div>

                      <div
                        class={`${arrow} absolute -bottom-1.5 right-7 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-red-600 transition-all duration-300 ease-in-out`}
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
      <div class="relative inline-block group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTooltipShow(e => !e)
          }}
          className={clsx(
            "relative w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner  cursor-pointer",
            user ? "bg-green-500 text-white" : "bg-red-500 text-white active:scale-95 -ml-2"
          )}
          >
          {user ? "Active" : "Disabled"}
        </button>

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
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2"
              >
                <div
                  class={`relative ${bgMenu} p-4 rounded-2xl border transition-all duration-300 ease-in-out`}
                >
                  <div class="flex items-center gap-3 mb-2">
                    <div
                      class={`${cautionBG} flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out`}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="w-4 h-4 text-red-600"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h3 class={`${text} text-sm font-semibold transition-all duration-300 ease-in-out`}>Important Information</h3>
                  </div>

                  <div class="space-y-2">
                    <p class={`${text} text-sm transition-all duration-300 ease-in-out`}>
                      This user account is currently disabled. Please contact an administrator for more information.
                    </p>
                    <div class="flex items-center gap-2 text-xs text-red-600">
                      <svg 
                        fill="currentColor"
                        class="w-4 h-4 text-red-600"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 640 640"
                      ><path d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z"/></svg>
                      <span className="text-red-600">User Disabled</span>
                    </div>
                  </div>

                  <div
                    class={`${arrow} absolute inset-0 rounded-2xl  blur-xl opacity-50 transition-all duration-300 ease-in-out`}
                  ></div>

                  <div
                    class={`${arrow} absolute -bottom-1.5 right-33.5 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-red-600 transition-all duration-300 ease-in-out`}
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
    const TableHeader = () => (
      <thead className={`
        ${LightMode 
          ? "border-gray-400"
          : "border-gray-600"
        }
        border-b transition-colors ease-in-out duration-300
      `}>
        <tr className={`
            ${LightMode 
                ? "text-black"
                : "text-white"
            } text-left transition-colors ease-in-out duration-300
          `}>
          <th className='py-2 pl-4'>Full Name</th>
          <th className='py-2 pl-2 text-start'>Status</th>
          <th className='py-2 pl-3 hidden sm:block'>Created At</th>
        </tr>
      </thead>
    );

    const TableRow = ({ user }) => (
      <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50  transition-colors ease-in-out duration-300
        `}>
        <td className='py-2 px-6'>
          <div className='flex items-center gap-3'>
            <div className={clsx(
              "w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-sm shadow-inner overflow-hidden bg-blue-600",
              user.isActive ? "border-green-500" : "border-red-600"
            )}>
              {user?.img ? 
                <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
              :
                <span className='text-xs md:text-sm text-center'>
                  {getInitials(user?.name)}
                </span>
              }
            </div>
            <div className={`${user.isActive ? "" : "blur-[2px]"}`}>
              <p className="whitespace-nowrap"> {user.name}</p>
              <span className={`
                ${LightMode 
                    ? "text-black"
                    : "text-white"
                }
                text-xs transition-colors ease-in-out duration-300
              `}>{user?.role}</span>
            </div>
          </div>
        </td>

        <td>
          <DisabledComponentTable user={user.isActive} />
        </td>

        <td className={`w-32 px-3 whitespace-nowrap ${user.isActive ? "" : "blur-[2px]"}`}>{moment(user?.createdAt).fromNow()}</td>

        <td className="">
          <td className="flex justify-center px-2">
            <SocialMedia tiktok={user?.tiktok} youtube={user?.youtube} whatsApp={user?.whatsApp} telegram={user?.telegram} />
          </td>
        </td>
      </tr>
    );



  const UserCard = ({ user }) => (
    <div className={`
      ${LightMode
        ? "bg-white shadow-darkSM"
        : "bg-black/90 shadow-lightSM"
      }
      relative w-full rounded-2xl h-35 flex flex-col justify-center items-center transition-all duration-300 ease-in-out
    `}>
        <div className={`${user.isActive ? "border-green-500" : "border-red-600"} border-2 rounded-full absolute -top-10 -left-2 flex flex-col justify-center items-center gap-3 whitespace-nowrap`}>
          <div className={clsx(
            LightMode
              ? "shadow-darkSM border-white"
              : "shadow-lightSM border-black",
            "w-30 h-30 rounded-full border-8 flex items-center justify-center text-white text-sm overflow-hidden bg-blue-600 transition-all duration-300 ease-in-out",
          )}>
            {user?.img ? 
              <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span className='text-2xl md:text-sm text-center'>
                {getInitials(user?.name)}
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
          <SocialMedia tiktok={user?.tiktok} youtube={user?.youtube} whatsApp={user?.whatsApp} telegram={user?.telegram} />
        </div>

        <div className={`
          ${LightMode
            ? "text-black"
            : "text-white"
          }
            w-full mt-4 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="ml-30 w-40 flex flex-col justify-center items-start gap-0">
            <div className="text-xl font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:hidden">{user.name.slice(0, 12) + "..."}</div>
            <div className="text-xl font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:block hidden">{user.name}</div>
            
            <div className="text-lg [@media(min-width:400px)_and_(min-width:500px)]:hidden">{user.email.slice(0, 1) + "......@gmail.com"}</div>
            <div className="text-lg [@media(min-width:400px)_and_(min-width:500px)]:block hidden">{user.email.slice(0, 1) + "......@gmail.com"}</div>
          </div>
        </div>

        <div className={`
            ${LightMode
              ? "text-black"
              : "text-white"
            }
            w-full mt-4 ml-5 flex justify-start items-center gap-2 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="text-sm font-semibold">{user.title}</div>

          <div className="w-0.5 h-8 bg-linear-to-b from-green-400/10 via-green-500 to-green-400/10" />

          <div className="text-sm font-semibold">{user.role}</div>
        </div>

        <DisabledComponent user={user.isActive}/>

    </div>
  )

    return (
      <div className="md:px-30 py-5 pt-26 overflow-hidden">
        <div className={`
            ${LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30"
            }
            hidden sm:block w-full h-fit px-2 md:px-6 py-4 shadow-md rounded transition-colors ease-in-out duration-300
          `}>
          <table className='w-full mb-5'>
            <TableHeader />
            <tbody>
              {users?.map((user, index) => (
                <TableRow key={index + user?._id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        <div className={`
          ${LightMode
            ? "shadow-darkSM "
            : "shadow-lightSM"
          }
          relative flex flex-col justify-center gap-15 px-4 pt-20 pb-15 mx-1 sm:hidden rounded-2xl transition-colors duration-300 ease-in-out
        `}>
          {users?.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}

          <span className="absolute z-0 text-center -top-6 left-0 right-0">
            <span className={`
              ${LightMode
                ? "text-black bg-[#E8E8E8]"
                : "text-white bg-[#3D3D3D]"
              }
              py-2 px-4 text-3xl font-semibold font-sans transition-colors duration-300 ease-in-out
            `}>Users</span>
          </span>
        </div>
      </div>
    );
  };







  const TaskTable = ({ tasks }) => {
    // const { user } = useSelector((state) => state.auth);


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
        border-b transition-colors ease-in-out duration-300
      `}>
        <tr className={`
            ${LightMode 
                ? "text-black"
                : "text-white"
            } text-left transition-colors ease-in-out duration-300
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

    const TableRow = ({ task }) => {
      // console.log(taskInfo)
      const textPriority = task?.priority;
      const TextPriShort = textPriority.slice(0, 4) + "...";
      const titleShort = task.title.split(" ").length > 4 ? task.title.split(" ").slice(0, 5).join(" ") + "..." : task.title;
      const nameShort = task.clientName.split(" ").length > 2 ? task.clientName.split(" ").slice(0, 2).join(" ") + "..." : task.clientName;
      const addressShort = task.address.split(" ").length > 2 ? task.address.split(" ").slice(0, 2).join(" ") + "..." : task.address;

      return (
        <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 cursor-pointer transition-colors ease-in-out duration-300
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
                    hidden xl:block whitespace-nowrap transition-colors ease-in-out duration-300 
                  `}>
                  {task.title}
                </p>
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    }
                    xl:hidden whitespace-nowrap transition-colors ease-in-out duration-300 
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
                  whitespace-nowrap transition-colors ease-in-out duration-300 capitalize 
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
                  whitespace-nowrap transition-colors ease-in-out duration-300 capitalize
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
                  whitespace-nowrap text-base transition-colors ease-in-out duration-300
                `}>
                {moment(task?.date).fromNow()}
              </span>
            </td>
        </tr>
      )
    };

    return (
      <>
        <div
          className={clsx(
            "w-full px-2 md:px-4 pt-4 pb-4 shadow-md rounded transition-colors ease-in-out duration-300",
            LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30",
            // user?.isAdmin ? "md:w-2/3" : ""
          )}
        >
          <div className='overflow-x-auto overflow-y-visible'>
            <table className='w-full '>
              <TableHeader />
              <tbody className=''>
                {tasks.map((task, id) => (
                  <TableRow key={task?._id + id} task={task} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };








  return (
    <div className='h-full py-4'>
      <>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
          {stats?.map(({ icon, lastMonth, bg, tx, label, total }, index) => (
            <Card key={index} icon={icon} lastMonth={lastMonth} bg={bg} tx={tx} label={label} count={total} />
          ))}
        </div>

        <div className={`
            ${LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30"
            }
            w-full my-16 p-4 transition-colors ease-in-out duration-300 rounded-lg
          `}>
          <h4 className={`
              ${LightMode 
                ? "text-gray-700"
                : "text-gray-200"
              }
              text-xl font-bold mb-4 transition-colors ease-in-out duration-300
            `}>
            Task Analytics
          </h4>
          <Chart />
        </div>
        <div className='w-full flex flex-col gap-4 2xl:gap-10 py-8'>
          {/* RECENT AUTHORS */}
          <TaskTable tasks={summary.last10Task} />

          {/* RECENT USERS */}
          <UserTable users={summary.users} />
        </div>
      </>
    </div>
  )
}

export default Dashboard