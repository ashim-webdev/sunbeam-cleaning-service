import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { FaExchangeAlt } from "react-icons/fa";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmationDialog from "../ConfirmationDialog";
import { useSelector } from "react-redux";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import TaskColor from "./TaskColor";

const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter='transition ease-out duration-100'
    enterFrom='transform opacity-0 scale-95'
    enterTo='transform opacity-100 scale-100'
    leave='transition ease-in duration-75'
    leaveFrom='transform opacity-100 scale-100'
    leaveTo='transform opacity-0 scale-95'
  >
    {children}
  </Transition>
);




const ChangeTaskActions = ({ _id, stage }) => {
  const { LightMode, user } = useSelector((state) => state.auth);

  const [changeStage] = useChangeTaskStageMutation();

  const [openStageMenu, setOpenStageMenu] = useState(false);



  const changeHandler = async (val) => {
    try {
      const data = {
        id: _id,
        stage: val,
      };

      const res = await changeStage(data).unwrap();

      toast.success(res?.message);

      setOpenStageMenu(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };



  const items = [
    {
      label: "To-Do",
      stage: "todo",
      icon: <TaskColor className='bg-blue-600' />,
      onClick: () => changeHandler("todo"),
    },
    {
      label: "In Progress",
      stage: "in progress",
      icon: <TaskColor className='bg-yellow-600' />,
      onClick: () => changeHandler("in progress"),
    },
    {
      label: "Completed",
      stage: "completed",
      icon: <TaskColor className='bg-green-600' />,
      onClick: () => changeHandler("completed"),
    },
  ];

  if (!user?.isAdmin) return null;


  const closeMiniMenu = () => {
    setTimeout(() => {
      setOpenStageMenu(false)
    }, 500);
  }

  return (
    <div className='relative'>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenStageMenu((prev) => !prev);
        }}
        className={clsx(
          LightMode ? "text-gray-600 hover:text-black focus:text-black" : "text-gray-300 hover:text-black focus:text-black",
          "inline-flex cursor-pointer w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:bg-blue-200 focus:bg-blue-200"
        )}
      >
        <FaExchangeAlt />
        <span>Change Task</span>
      </button>

      {openStageMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            ${LightMode 
              ? "bg-white shadow-darkSM text-black"
              : "bg-black/80 shadow-lightSM text-white"
            }
            absolute right-18 -top-36 border border-white ml-2 w-44 rounded-md z-[999] transition-all duration-300 ease-in-out
          `}
        >
          <div className='p-2 space-y-1'>
            {items.map((el) => (
              <button
                key={el.label}
                disabled={stage === el.stage}
                onClick={ (e) => {
                  e.stopPropagation()
                  el?.onClick?.()
                  closeMiniMenu()
                }}
                className={clsx(
                  "flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-all duration-300 ease-in-out",
                  stage === el.stage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 hover:text-black cursor-pointer hover:scale-105 active:scale-95"
                )}
              >
                {el.icon}
                {el.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};




export default function TaskDialog({ task }) {
  const { LightMode, user } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const [trashTask] = useTrashTaskMutation();
  const [duplicateTask] = useDuplicateTaskMutation();


  const deleteClicks = () => {
    setOpenDialog(true);
  };



  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: task._id,
      }).unwrap();

      toast.success(res?.message);

      setOpenDialog(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };



  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();

      toast.success(res?.message);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };



const items = [
  {
    label: "Open Task",
    icon: (
      <AiTwotoneFolderOpen
        className='mr-2 h-5 w-5'
        aria-hidden='true'
      />
    ),
    onClick: () => navigate(`/task/${task._id}`),
  },

  ...(user?.isAdmin
      ? [
          {
            label: "Edit",
            icon: (
              <MdOutlineEdit
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ),
            onClick: () => setOpenEdit(true),
          },
          {
            label: "Add Sub-Task",
            icon: (
              <MdAdd
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ),
            onClick: () => setOpen(true),
          },
          {
            label: "Duplicate",
            icon: (
              <HiDuplicate
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ),
            onClick: () => duplicateHandler(),
          },
        ]
      : []),
];



  const activeHover = LightMode ? "bg-blue-600/90 text-white  hover:shadow-dark" : " text-white bg-blue-600/90 hover:shadow-light "
  const text = LightMode ? "text-black" : "text-white"

  return (
    <>
      <div className=''>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button onClick={(e) => e.stopPropagation()} className={`${LightMode ? "text-gray-600 shadow-inner" : "text-gray-100 shadow-innerWH"} transition-all duration-300 ease-in-out outline-none cursor-pointer hover:scale-110 hover:text-blue-600 inline-flex w-full justify-center sm:text-2xl text-xl rounded-md  px-1 py-0.5 font-medium `}>
            <BsThreeDots />
          </Menu.Button>

          <CustomTransition>
            <Menu.Items 
              onMouseOver={(e) => e.stopPropagation()}
              className={`
                ${LightMode 
                  ? "bg-white shadow-darkSM"
                  : "bg-black/80 shadow-lightSM"
                }
                ${user?.isAdmin ? "divide-y divide-gray-100 pb-2 right-10 origin-top-right" : "pb-0 -right-2 top-9"}
                z-50 cursor-default border border-white absolute px-4 pt-2 -top-6 w-56  rounded-md ring-1 ring-black/5 focus:outline-none transition-all duration-300 ease-in-out
              `}>
              <div className='px-1 py-1 space-y-2'>
                {items.map((el, index) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        // disabled={index === 0 ? false : !user.isAdmin}
                        onClick={el?.onClick}
                        className={`${
                            active ? 
                              `${activeHover}` 
                            :
                              `${text}`
                          }
                          hover:scale-110 active:scale-95 group cursor-pointer flex w-full items-center rounded-md px-2 py-2 text-sm transition-all duration-50 ease-in-out
                        `}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className='px-1 py-1'>
                <div>
                  <ChangeTaskActions _id={task._id} stage={task.stage} />
                </div>
              </div>

                {user?.isAdmin && (
                  <div className='px-1 py-1'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          // disabled={!user.isAdmin}
                          onClick={() => deleteClicks()}
                          className={`${
                            active ? LightMode ? "bg-red-300 text-red-900  hover:shadow-dark" : " text-red-900 bg-red-300 hover:shadow-light"  : "text-red-600"
                          } group hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400 active:scale-95`
                        }
                        >
                          <RiDeleteBin6Line
                            className='mr-2 h-5 w-5 text-red-600'
                            aria-hidden='true'
                          />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                )}
            </Menu.Items>
          </CustomTransition>
        </Menu>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={task}
        key={new Date().getTime()}
      />
      <AddSubTask 
        open={open}
        setOpen={setOpen}
        id={task._id}
      />
      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
}
