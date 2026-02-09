import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { Tilt } from "react-tilt"
import { useDispatch, useSelector } from "react-redux";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { MdOutlineTimer, MdTimer } from "react-icons/md";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { summary } from "../assets/data";
import Chart from "../components/Chart"




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
        cursor-pointer w-full h-32 p-5 rounded-md flex items-center justify-between hover:scale-105 transition-transform-color ease-in-out duration-300
      `}>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className={`
              ${LightMode 
                ? "text-gray-600"
                : "text-white"
              }
              text-base font-semibold transition-colors ease-in-out duration-300 whitespace-nowrap
            `}>{label}</p>
          <span className={clsx("text-2xl font-semibold" , tx)}>{count}</span>
          <span className='text-sm text-blue-800 -mb-1'>
            <i className="fa-solid fa-chart-simple"></i> {lastMonth} <span className="text-gray-500">last month</span>
          </span>
        </div>
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
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
      </>
    </div>
  )
}

export default Dashboard