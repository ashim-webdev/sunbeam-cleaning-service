import clsx from "clsx";
import moment from "moment";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import React, { useEffect } from "react";
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
import { BGS, PRIORITY_STYLES, TASK_TYPE, getInitials } from "../utils";

import { summary } from "../assets/data";
import Chart from "../components/Chart"
import UserInfo from "../components/UserInfo"




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

  const Card = ({ label, lastMonth, count, bg, tx, icon }) => {
    return (
      <div className={`
        ${LightMode 
          ? "bg-white shadow-md shadow-black/30"
          : "bg-black/90 shadow-md shadow-white/30"
        }
        cursor-pointer w-full h-32 p-5 rounded-md flex items-center justify-between hover:scale-105 sm:hover:scale-102 lg:hover:scale-105  transition-transform-color ease-in-out duration-300
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
          <th className='py-2'>Status</th>
          <th className='py-2 hidden sm:block'>Created At</th>
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
            <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm shadow-inner bg-violet-700'>
              <span className='text-center'>{getInitials(user?.name)}</span>
            </div>
            <div>
              <p> {user.name}</p>
              <span className={`
                ${LightMode 
                    ? "text-black"
                    : "text-white"
                }
                text-xs text-black
              `}>{user?.role}</span>
            </div>
          </div>
        </td>

        <td>
          <button
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "ClickAnimation w-fit px-3 py-1 rounded-full transition-transform ease-in-out duration-300 text-sm shadow-inner hover:shadow-innerWH  cursor-pointer",
              user?.isActive ? "bg-green-500 text-white hover:bg-green-700 hover:scale-105" : "bg-red-500 text-whits hover:bg-red-700 hover:scale-110"
            )}
          >
            {user?.isActive ? "Active" : "Disabled"}
          </button>
        </td>
        <td className='pt-5 pl-1 text-sm hidden sm:block'>{moment(user?.createdAt).fromNow()}</td>
      </tr>
    );

    return (
      <div className="md:px-30 py-5">
        <div className={`
            ${LightMode 
              ? "bg-white shadow-md shadow-black/30"
              : "bg-black/90 shadow-md shadow-white/30"
            }
            w-full h-fit px-2 md:px-6 py-4 shadow-md rounded transition-colors ease-in-out duration-300
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
          <th className='py-2'>Task Title</th>
          <th className='py-2'>Priority</th>
          <th className='py-2'>Team</th>
          <th className='py-2 hidden md:block'>Created At</th>
        </tr>
      </thead>
    );

    const TableRow = ({ task }) => {
      // console.log(task)
      const text = task?.title;
      const textPriority = task?.priority;

      const shortText = text.split(" ").slice(0, 2).join(" ") + "...";
      const veryShortText = text.split(" ").slice(0, 1).join(" ") + "...";
      const TextPriShort = textPriority.slice(0, 4) + "...";
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
                    sm:hidden text-base transition-colors ease-in-out duration-300 
                  `}>
                  {veryShortText}
                </p>
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    }
                    hidden sm:block md:hidden text-base transition-colors ease-in-out duration-300 
                  `}>
                  {shortText}
                </p>
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    }
                    hidden md:block text-base transition-colors ease-in-out duration-300 
                  `}>
                  {task?.title}
                </p>
              </div>
            </td>
            <td className='py-2'>
              <div className={"flex sm:hidden gap-1 items-center"}>
                <span className={clsx("text-lg", PRIORITY_STYLES[task?.priority])}>
                  {ICONS[task?.priority]}
                </span>
                <span className='capitalize'>{TextPriShort}</span>
              </div>
              <div className={"hidden sm:flex gap-1 items-center"}>
                <span className={clsx("text-lg", PRIORITY_STYLES[task?.priority])}>
                  {ICONS[task?.priority]}
                </span>
                <span className='capitalize'>{task?.priority}</span>
              </div>
            </td>

            <td className='py-2'>
              <div className=' flex flex-row justify-start items-center mr-6'>
                <div className="relative flex flex-row justify-center items-center">
                  <UserInfo task={task} />
                </div>
              </div>
            </td>

            <td className='py-2 hidden md:block'>
              <span className={`
                  ${LightMode 
                      ? "text-black/50"
                      : "text-white/60"
                  }
                  text-base transition-colors ease-in-out duration-300
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
          <table className='w-full '>
            <TableHeader />
            <tbody className=''>
              {tasks.map((task, id) => (
                <TableRow key={task?._id + id} task={task} />
              ))}
            </tbody>
          </table>
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