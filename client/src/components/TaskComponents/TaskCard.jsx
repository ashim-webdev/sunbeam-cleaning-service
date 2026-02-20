import clsx from "clsx";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  BGS,
  PRIORITY_STYLES,
  TASK_TYPE,
  formatDate,
  TASK_ICON
} from "../../utils/index.js";
import UserInfoTask from "../UserInfoTask.jsx";
// import { AddSubTask, TaskAssets, TaskColor, TaskDialog } from "./index";
import TaskAssets from "./TaskAssets.jsx";
import TaskColor from "./TaskColor.jsx";
import { tasks } from "../../assets/data.js";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const TaskCard = ({ task }) => {
  // const { user } = useSelector((state) => state.auth);
  const user = true
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='relative w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
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
            <div className='flex items-center gap-2'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className='text- line-clamp-1 text-black dark:text-white'>
                {task?.title}
              </h4>
            </div>
          </Link>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className='w-full border-t border-gray-200 dark:border-gray-700 my-2' />
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
          <div className='py-4 border-t border-gray-200 dark:border-gray-700'>
            <h5 className='text-base line-clamp-1 text-black dark:text-gray-400'>
              {task?.subTasks[0].title}
            </h5>

            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600 dark:text-gray-500'>
                {formatDate(new Date(task?.subTasks[0]?.date))}
              </span>
              <span className='bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium'>
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


        <div className={`absolute top-0 right-0 py-2 px-4 capitalize text-center  whitespace-nowrap`}>
          <i className={`animate-UpDown ${TASK_ICON[task?.stage].icon} ${TASK_ICON[task?.stage].color}`}></i>
        </div>
      </div>

      {/* <AddSubTask open={open} setOpen={setOpen} id={task._id} /> */}
    </>
  );
};

export default TaskCard;
