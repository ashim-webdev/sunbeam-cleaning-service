import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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


import ConfirmationDialog from "./ConfirmationDialog.jsx";
import UserInfoDash from "./UserInfoDash.jsx";
import Button from "./Button.jsx";
import TaskColor from "./TaskComponents/TaskColor.jsx";
import TaskAssets from "./TaskComponents/TaskAssets.jsx";
import DeleteBtn from "./DeleteBtn.jsx";
import EditBtn from "./EditBtn.jsx"; 
import AddTask from "../components/TaskComponents/AddTask.jsx";
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

  const navigate = useNavigate();
  

  // const [deleteTask] = useTrashTastMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    // try {
    //   const res = await deleteTask({
    //     id: selected,
    //     isTrashed: "trash",
    //   }).unwrap();

    //   toast.success(res?.message);

    //   setTimeout(() => {
    //     setOpenDialog(false);
    //     window.location.reload();
    //   }, 500);
    // } catch (err) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300'>
      <tr className={`
          ${LightMode 
            ? "text-black"
            : "text-white"
          }
          w-full  text-left
        `}>
        <th className='py-2 pl-3'>Task Title</th>
        <th className='py-2 px-6 whitespace-nowrap'>Client Names</th>
        <th className='py-2 px-4'>Address</th>
        <th className='py-2 px-6.5'>Priority</th>
        <th className='py-2 text-center line-clamp-1 whitespace-nowrap'>Created At</th>
        <th className='py-2 text-center'>Assets</th>
        <th className='py-2 text-center'>Team</th>
        <th className='py-2 text-center'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => {
    // const shortText = task?.title.split(" ").slice(0, 2).join(" ") + "...";
  const titleShort = task.title.split(" ").length > 4 ? task.title.split(" ").slice(0, 5).join(" ") + "..." : task.title;
  const nameShort = task.clientName.split(" ").length > 2 ? task.clientName.split(" ").slice(0, 2).join(" ") + "..." : task.clientName;
  const addressShort = task.address.split(" ").length > 2 ? task.address.split(" ").slice(0, 2).join(" ") + "..." : task.address;


    return(
      <tr 
        onClick={() => navigate(`/task/${task._id}`)}
        className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50 cursor-pointer transition-colors ease-in-out duration-300
        `}>
        <td className='py-2 pl-4'>
          <div className='flex items-center gap-2'>
            <TaskColor className={TASK_TYPE[task.stage]} />
            <p className={`
                ${LightMode 
                  ? "text-black"
                  : "text-white"
                }
                w-full hidden xl:block line-clamp-2 whitespace-nowrap transition-colors ease-in-out duration-300
              `}>
              {task.title}
            </p>
            <p className={`
                ${LightMode 
                  ? "text-black"
                  : "text-white"
                }
                w-full xl:hidden line-clamp-2 text-base text-black whitespace-nowrap transition-colors ease-in-out duration-300 
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

        <td className='py-2 px-4'>
          <div className={"flex gap-1 items-center"}>
            <span className={clsx("text-lg animate-UpDown", PRIORITY_STYLES[task?.priority])}>
              {ICONS[task?.priority]}
            </span>
            <span className='capitalize line-clamp-1'>
              {task?.priority} Priority
            </span>
          </div>
        </td>

        <td className='py-2 px-6 text-center'>
          <span className={`
              ${LightMode 
                ? "text-gray-600"
                : "text-gray-300"
              }
              text-sm whitespace-nowrap transition-colors ease-in-out duration-300
            `}>
            {formatDate(new Date(task?.date))}
          </span>
        </td>

        <td className='py-2 px-6 flex justify-center items-center'>
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
          />
        </td>

        <td className='py-2 pr-4 pl-0'>
          <div className=' px-8 w-fit flex flex-row justify-center items-center'>
            <div
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
              )}
            >
              <UserInfoDash task={task} />
            </div>
          </div>
        </td>

        <td className='py-2 pr-6 pl-8 flex justify-center items-center gap-2 md:gap-3'>
          {/* <Button
            className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
            label='Edit'
            type='button'
            onClick={() => editClickHandler(task)}
          /> */}
          <EditBtn 
            onClick={() => editClickHandler(task)}
          />

          {/* <Button
            className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
            label='Delete'
            type='button'
            onClick={() => deleteClicks(task._id)}
          /> */}

          <DeleteBtn
            onClick={() => deleteClicks(task._id)}
          />
        </td>
      </tr>
    );
  }

  return (
    <>
      <div className={`
          ${LightMode 
            ? "bg-white"
            : "bg-black/90"
          }
          px-2 h-fit xl:px-4 pt-4 pb-9 my-2 shadow-md rounded transition-colors ease-in-out duration-300
        `}>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {tasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  );
};

export default Table;
