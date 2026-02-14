import clsx from "clsx";
import { useState } from "react";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
// import { useTrashTastMutation } from "../redux/slices/api/taskApiSlice.js";
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate } from "../utils/index.js";
import { useDispatch, useSelector } from "react-redux";


// import { Button, ConfirmatioDialog, UserInfo } from "./index";
import UserInfoDash from "./UserInfoDash.jsx";
import Button from "./button.jsx";
import TaskColor from "./TaskComponents/TaskColor.jsx";
import TaskAssets from "./TaskComponents/TaskAssets.jsx";
// import { AddTask, TaskAssets, TaskColor } from "./tasks";
import { Link } from "react-router-dom";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const { LightMode } = useSelector((state) => state.auth);
  

  // const [deleteTask] = useTrashTastMutation();

  // const deleteClicks = (id) => {
  //   setSelected(id);
  //   setOpenDialog(true);
  // };

  // const editClickHandler = (el) => {
  //   setSelected(el);
  //   setOpenEdit(true);
  // };

  // const deleteHandler = async () => {
  //   try {
  //     const res = await deleteTask({
  //       id: selected,
  //       isTrashed: "trash",
  //     }).unwrap();

  //     toast.success(res?.message);

  //     setTimeout(() => {
  //       setOpenDialog(false);
  //       window.location.reload();
  //     }, 500);
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err?.data?.message || err.error);
  //   }
  // };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
      <tr className='w-full text-black dark:text-white  text-left'>
        <th className='py-2 pl-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2 -ml-1 line-clamp-1 whitespace-nowrap'>Created At</th>
        <th className='py-2 xl:pl-2 pl-5'>Assets</th>
        <th className='py-2'>Team</th>
        <th className='text-center'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => {
    const shortText = task?.title.split(" ").slice(0, 2).join(" ") + "...";

    return(
      <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 cursor-pointer transition-colors ease-in-out duration-300
        `}>
        <td className='py-2 pl-2'>
          <Link to={`/task/${task._id}`}>
            <div className='flex items-center gap-2'>
              <TaskColor className={TASK_TYPE[task.stage]} />
              <p className='w-full hidden xl:block line-clamp-2 text-base text-black whitespace-nowrap'>
                {task.title}
              </p>
              <p className='w-full xl:hidden line-clamp-2 text-base text-black whitespace-nowrap'>
                {shortText}
              </p>
            </div>
          </Link>
        </td>

        <td className='py-2 pr-2'>
          <div className={"flex gap-1 items-center"}>
            <span className={clsx("text-lg ", PRIORITY_STYLES[task?.priority])}>
              {ICONS[task?.priority]}
            </span>
            <span className='capitalize line-clamp-1'>
              {task?.priority} Priority
            </span>
          </div>
        </td>

        <td className='py-2'>
          <span className='text-sm text-gray-600 whitespace-nowrap'>
            {formatDate(new Date(task?.date))}
          </span>
        </td>

        <td className='py-2 xl:px-2 px-5'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />
        </td>

        <td className='py-2 xl:pl-6 pr-2 px-5'>
          <div className='flex flex-row justify-start items-center mr-6'>
            <div
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
              )}
            >
              <UserInfoDash task={task} />
            </div>
          </div>
        </td>

        {/* <td className='py-2'>
          <div className=' flex flex-row justify-start items-center mr-6'>
            <div className="relative flex flex-row justify-center items-center">
              <UserInfoDash task={task} />
            </div>
          </div>
        </td> */}

        <td className='py-2 px-6 flex gap-2 md:gap-4 justify-end'>
          <Button
            className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
            label='Edit'
            type='button'
            // onClick={() => editClickHandler(task)}
          />

          <Button
            className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
            label='Delete'
            type='button'
            // onClick={() => deleteClicks(task._id)}
          />
        </td>
      </tr>
    );
  }

  return (
    <>
      <div className='bg-white  px-2 xl:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full '>
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      /> */}

      {/* <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      /> */}
    </>
  );
};

export default Table;
