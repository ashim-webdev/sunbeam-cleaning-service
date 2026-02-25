import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

import {
  BGS,
  PRIORITY_STYLES,
  TASK_TYPE,
  formatDate,
  TASK_ICON,
  TASK_HEADER
} from "../../utils/index.js";
import UserInfoTask from "../UserInfoTask.jsx";
// import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";
import AddSubTask from "./AddSubTask.jsx";
import TaskAssets from "./TaskAssets.jsx";
import TaskColor from "./TaskColor.jsx";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const TaskCard = ({ task }) => {
  // const { user } = useSelector((state) => state.auth);
  const { LightMode } = useSelector((state) => state.auth);
  
  const user = true
  const [open, setOpen] = useState(false);

  return (
    <div className='relative'>
      <div className={`
          ${LightMode 
            ? "bg-white"
            : "bg-black/90"
          }
          relative z-10 w-full h-fit shadow-md p-4 mt-15 rounded transition-colors duration-300 ease-in-out
        `}>
        <div className='w-full z-1 flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 mt-2 items-center text-sm font-medium",
              PRIORITY_STYLES[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span className='uppercase'>{task?.priority} Priority</span>
          </div>
          {/* <TaskDialog task={task} /> */}
        </div>
        <>
          <Link to={`/task/${task._id}`}>
            <div className='CardTextColor mt-1 mb-1 pl-1.5 flex items-center gap-2 hover:scale-105 transition-transform duration-300 ease-in-out'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className={`
                  ${LightMode 
                    ? "text-black"
                    : "text-white"
                  }
                  line-clamp-1 transition-colors duration-300 ease-in-out
                `}>
                {task?.title}
              </h4>
            </div>
          </Link>
          <span className={`
              ${LightMode 
                ? "text-gray-600"
                : "text-gray-400"
              }
              text-sm pl-2 transition-colors duration-300 ease-in-out
            `}>
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className={`
            ${LightMode 
              ? "border-gray-300"
              : "border-gray-500"
            }
            w-full border-t my-2 transition-colors duration-300 ease-in-out`
          } />
        <div className='flex items-center justify-between mb-2'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />

          <div className='flex flex-row-reverse'>
            <div className=' flex flex-row justify-start items-center mr-6'>
              <div className=" z-20 relative flex flex-row justify-center items-center">
                <UserInfoTask task={task} />
              </div>
            </div>
          </div>
        </div>

        {/* subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className={`
            ${LightMode 
              ? "border-gray-300"
              : "border-gray-500"
            }
            py-4 border-t transition-colors duration-300 ease-in-out
          `}>
            <h5 className={`
                ${LightMode 
                  ? "text-black"
                  : "text-white/80"
                }
                text-base line-clamp-1 transition-colors duration-300 ease-in-out
              `}>
              {task?.subTasks[0].title}
            </h5>

            <div className='p-4 space-x-8'>
              <span className={`
                ${LightMode 
                  ? "text-gray-600"
                  : "text-gray-400"
                }
                text-sm transition-colors duration-300 ease-in-out
              `}>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className={`
                  ${LightMode 
                    ? "bg-blue-600/10 shadow-inner"
                    : "bg-white/20 shadow-innerWH"
                  }
                  px-3 py-1 rounded-full text-blue-600 font-medium transition-colors duration-300 ease-in-out
                `}>
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
              <span className='text-gray-500'>No Sub-Task</span>
            </div>
          </div>
        )}

        <div className='w-full pb-2'>
          <button
            disabled={user ? false : true}
            onClick={() => setOpen(true)}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300'
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>
        </div>


        <div className={`absolute top-4 right-0 py-2 px-4 capitalize text-center  whitespace-nowrap`}>
          <i className={`animate-UpDown ${TASK_ICON[task?.stage].icon} ${TASK_ICON[task?.stage].color}`}></i>
        </div>
      </div>
      
      <div className={`FileDesign absolute inset-0 -top-1 left-0 w-full h-auto p-2 pointer-events-none }`}>
          <div className={`shadow-2xl`}>
            <div className={`relative ${TASK_HEADER[task.stage]} shadow-inner rounded-tr-[50px] pt-1 pb-2 px-2`}>
              <div className={`
                  text-white border-white/50 pl-2 pb-0.5 font-mono text-md font-semibold border-b capitalize 
                `}>
                {task?.clientName}
              </div>
              <div className={`
                    ${LightMode 
                      ? "text-gray-200"
                      : "text-gray-200"
                    }
                    pr-2 pt-0.5 text-sm text-end font-cursive italic transition-colors duration-300 ease-in-out
                  `}>
                {task?.address}
              </div>

              <div className={`
                  ${LightMode 
                    ? "bg-[#F3F4F6]"
                    : "bg-[#3C3C3C]"
                  }
                  absolute -top-2 -left-2 w-4 h-4.5 rotate-45 transition-colors duration-300 ease-in-out
                `} />
              <div className={`
                  ${LightMode 
                    ? "bg-[#F3F4F6]"
                    : "bg-[#3C3C3C]"
                  }
                  absolute border-white/80 -top-[0.5px] -left-[0.5px] w-3.5 h-3.5 border ${TASK_HEADER[task.stage]}
                `} />
              <div className={`
                  ${LightMode 
                    ? "bg-[#F3F4F6]"
                    : "bg-[#3C3C3C]"
                  }
                  absolute -top-2 -left-2 w-4 h-4.5 rotate-45 transition-colors duration-300 ease-in-out
                `} />
            </div>
          </div>
        </div>

      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </div>
  );
};

export default TaskCard;
