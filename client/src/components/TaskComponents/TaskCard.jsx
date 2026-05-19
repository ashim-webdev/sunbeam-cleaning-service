import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdContentCopy,
  MdCheck
} from "react-icons/md";
import { HiDuplicate } from "react-icons/hi";
import { toast } from 'sonner'
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
import AddSubTask from "./AddSubTask.jsx";
import TaskAssets from "./TaskAssets.jsx";
import TaskColor from "./TaskColor.jsx";
import TaskDialog from "./TaskDialog.jsx"

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const TaskCard = ({ task }) => {
  const { LightMode, user } = useSelector((state) => state.auth);
  
  const [open, setOpen] = useState(false);
  

  // Copy Address Feature Function
  const [copiedAddress, setCopiedAddress] = useState(null);

  const copyAddress = async (address, e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast.success("copied successfully")

      setTimeout(() => {
        setCopiedAddress(null);
      }, 2000);

    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("copy failed")
    }
  };

  return (
    <div className='relative transition-transform duration-200 ease-in-out'>
      <div className={`
          ${LightMode 
            ? "bg-white"
            : "bg-black/90"
          }
          relative w-full h-fit shadow-md p-4 mt-15 rounded transition-colors duration-300 ease-in-out
        `}>
        <div className={`
          ${LightMode 
            ? "border-gray-300"
            : "border-gray-500"
          }
          mt-1 py-0.5 px-1 border-b transition-transform duration-200 ease-in-out
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
              <div className={`px-4 capitalize text-center text-lg  whitespace-nowrap`}>
                <i className={`animate-UpDown ${TASK_ICON[task?.stage].icon} ${TASK_ICON[task?.stage].color}`}></i>
              </div>
            </div>
          </div>
          <>
              <div className='CardTextColor mt-1 mb-1 pl-1.5 flex items-center gap-2'>
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
                <div className="flex flex-row justify-center items-center">
                  <UserInfoTask task={task} />
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* subtasks */}
        {task?.subTasks?.length > 0 ? (
          <div className="py-4">
            <h5 className={`
                ${LightMode 
                  ? "text-black"
                  : "text-white/80"
                }
                text-base line-clamp-1 transition-colors duration-300 ease-in-out
              `}>
              {task?.subTasks[0].title}
            </h5>

            <div className='pt-4 px-4 pb-2 space-x-8'>
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
                    ? "bg-blue-600/10 shadow-inner text-blue-700"
                    : "bg-white/20 shadow-innerWH text-blue-200"
                  }
                  px-3 py-1 rounded-full font-medium transition-colors duration-300 ease-in-out
                `}>
                {task?.subTasks[0]?.tag}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className='py-4 border-t border-gray-200'>
              <span className='text-gray-500'>No Sub-Task</span>
            </div>
          </div>
        )}

        <div className='w-full '>
          <button
            disabled={user.isAdmin ? false : true}
            onClick={(e) => {
              setOpen(true);
              e.stopPropagation()

            }}
            className={`
              ${user.isAdmin ? "hover:scale-103 hover:text-blue-600 active:scale-95" : "disabled:cursor-not-allowed disabled:text-gray-600"}
              py-2 cursor-pointer w-full flex gap-4 items-center text-sm text-gray-500 font-semibold transition-all duration-300 ease-in-out 
            `}
          >
            <IoMdAdd className='text-lg' />
            <span>ADD SUBTASK</span>
          </button>
        </div>

        {/* Dialog Component */}
        <div className="absolute top-7.5 right-6">
          <TaskDialog task={task} />
        </div>
      </div>
      
      <div className={`FileDesign absolute top-0 left-0 w-full h-auto p-2 }`}>
          <div className={`
              ${LightMode 
                ? "border-gray-400"
                : "border-gray-500"
              }
              shadow-2xl border-b-2 px-2 transition-colors duration-300 ease-in-out
            `}>
            <div className={`relative ${TASK_HEADER[task.stage]} shadow-inner rounded-tr-[50px] pt-1 pb-2 px-2`}>
              <div className={`
                  ${LightMode 
                    ? "text-gray-50"
                    : "text-white"
                  }
                  border-white/50 pl-2 pb-0.5 font-mono text-md font-semibold border-b capitalize transition-colors duration-300 ease-in-out
                `}>
                {task?.clientName}
              </div>
              <div
                className={`
                  ${LightMode ? "text-gray-50" : "text-white"}
                  pr-2 pt-0.5 text-sm text-end font-cursive italic flex items-center justify-end gap-2 transition-colors duration-300 ease-in-out
                `}
              >
                {task?.address}

                {copiedAddress === task?.address ? (
                  <i className="fa-solid fa-check-double bg-white p-0.5 rounded-full text-green-600 text-lg cursor-pointer hover:scale-110 transition-transform"></i>
                ) : (
                  <HiDuplicate
                    title="Copy address"
                    onClick={(e) => copyAddress(task?.address, e)}
                    className="rounded-full text-xl cursor-pointer hover:scale-110 transition-transform"
                  />
                )}
              </div>

              <div className={`
                  ${LightMode 
                    ? "bg-[#E8E8E8]"
                    : "bg-[#3C3C3C]"
                  }
                  absolute -top-2 -left-2 w-4 h-4.5 rotate-45 transition-colors duration-300 ease-in-out
                `} />
              <div className={`
                  ${LightMode 
                    ? "bg-[#E8E8E8]"
                    : "bg-[#3C3C3C]"
                  }
                  absolute border-white/80 -top-[0.5px] -left-[0.5px] w-3.5 h-3.5 border ${TASK_HEADER[task.stage]}
                `} />
              <div className={`
                  ${LightMode 
                    ? "bg-[#E8E8E8]"
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
