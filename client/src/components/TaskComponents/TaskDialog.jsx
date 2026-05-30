import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
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






const LoadingCircle = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <div className='w-full py-3 flex items-center justify-center'>
      <div className={`${smallLoader} transition-colors duration-300 ease-in-out animate-UpDown`}>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </div>
  )
}




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




const ChangeTaskActions = ({ _id, stage, isLocked }) => {
  const { LightMode, user } = useSelector((state) => state.auth);

  const [changeStage, { isLoading }] = useChangeTaskStageMutation();

  const [openStageMenu, setOpenStageMenu] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");



  const changeHandler = async (val) => {
    try {
      setLoadingStage(val);

      const data = {
        id: _id,
        stage: val,
      };

      const res = await changeStage(data).unwrap();

      toast.success(res?.message);

      // Wait 1 second after success
      setTimeout(() => {
        setOpenStageMenu(false);
        setLoadingStage("");
      }, 1000);

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);

      setLoadingStage("");
    }
  };



  const items = [
    {
      label: "To-Do",
      stage: "todo",
      disabled: isLocked,
      icon: <TaskColor className='bg-blue-600' />,
      onClick: () => changeHandler("todo"),
    },
    {
      label: "In Progress",
      stage: "in progress",
      disabled: isLocked,
      icon: <TaskColor className='bg-yellow-600' />,
      onClick: () => changeHandler("in progress"),
    },
    {
      label: "Completed",
      stage: "completed",
      completed: "fa-solid fa-check-double text-green-600 text-lg",
      disabled: true,
      icon: <TaskColor className='bg-green-600' />,
    },
  ];

  // if (!user?.isAdmin) return null;

  return (
    <div className='relative'>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenStageMenu((prev) => !prev);
        }}
        className={clsx(
          LightMode ? "text-gray-600 hover:text-black focus:text-black" : "text-gray-300 hover:text-black focus:text-black",
          !user.isAdmin ? "mb-3" : "",
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
            {items.map((el, index) => (
              <div key={index}>
                <button
                    key={el.label}
                    disabled={
                      stage === el.stage ||
                      isLoading ||
                      el.disabled
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      el?.onClick?.();
                    }}
                    className={clsx(
                      "flex items-center gap-2 w-full rounded-md px-3 py-2 text-sm transition-all duration-300 ease-in-out",
                      stage === el.stage ?
                      `text-black bg-blue-200 focus:bg-blue-200`
                      :
                      el.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 hover:text-black cursor-pointer hover:scale-105 active:scale-95",
                      isLoading ? "cursor-not-allowed" : ""
                    )}
                  >
                    {loadingStage === el.stage && isLoading ? (
                      <span className="w-full h-5 flex justify-center items-center">
                        <LoadingCircle />
                      </span>
                    ) : (
                      <>
                        {el.icon}
                        {el.label}
                        {isLocked && (
                          <i className={el?.completed}></i>
                        )}
                      </>
                    )}
                  </button>
                </div>
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
  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [type, setType] = useState("");
  const [msg, setMsg] = useState(null);
  
  

  const navigate = useNavigate();

  const [trashTask, { isLoading: deleteLoading }] = useTrashTaskMutation();
  const [duplicateTask, { isLoading: duplicateLoading }] = useDuplicateTaskMutation();


  const deleteClicks = () => {
    setType("delete");
    setMsg("Are you sure you want to delete the selected record?");
    setOpenDialog1(true);
  };

  const duplicationClicks = () => {
    setType("duplicate");
    setMsg("Are you sure you want to duplicate this task?");
    setOpenDialog2(true);
  };



  const deleteHandler = async () => {
    try {
      const res = await trashTask({
        id: task._id,
      }).unwrap();

      toast.success(res?.message);

      setOpenDialog1(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };



  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();

      toast.success(res?.message);

      setOpenDialog2(false);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };



const items = [
  {
    label: "Open Task",
    stillActiveIcon: <span className='DuplicateDot bg-blue-600 w-2 h-2 px-1 rounded-full whitespace-nowrap shadow-inner' />,
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
            onClick: () => {
              if (task?.isLocked) {
                toast.error("Task is locked. Further changes are disabled.");
                return;
              }
              setOpenEdit(true)
            },
          },
          {
            label: "Add Sub-Task",
            icon: (
              <MdAdd
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ),
            onClick: () => {
              if (task?.isLocked) {
                toast.error("Task is locked. Further changes are disabled.");
                return;
              }
              setOpen(true)
            },
          },
          {
            label: "Duplicate",
            icon: (
              <HiDuplicate
                className='mr-2 h-5 w-5'
                aria-hidden='true'
              />
            ),
            stillActiveIcon: <span className='DuplicateDot bg-blue-600 w-2 h-2 px-1 rounded-full whitespace-nowrap shadow-inner' />,
            onClick: () => duplicationClicks(),
          },
        ]
      : []),
];



  const activeHover = LightMode ? "bg-blue-600/90 text-white  hover:shadow-dark" : " text-white bg-blue-600/90 hover:shadow-light "
  const text = LightMode ? "text-black" : "text-white"
  
  const threeDotStyles = "transition-all duration-300 ease-in-out outline-none cursor-pointer hover:scale-110 hover:text-blue-600 inline-flex w-full justify-center sm:text-2xl text-xl rounded-md  px-1 py-0.5 font-medium"
  const menuPanelStyle = "z-50 cursor-default border border-white absolute px-4 pt-2 -top-6 w-56  rounded-md ring-1 ring-black/5 focus:outline-none transition-all duration-300 ease-in-out"
  const menuLinksStyle = "Duplicate hover:scale-110 active:scale-95 cursor-pointer flex w-full items-center rounded-md my-2 px-2 py-2 text-sm transition-all duration-50 ease-in-out"

  return (
    <>
      <div className=''>
        <Menu as='div' className='relative inline-block text-left'>
          <Menu.Button onClick={(e) => e.stopPropagation()} className={`${LightMode ? "text-gray-600 shadow-inner" : "text-gray-100 shadow-innerWH"} ${threeDotStyles}`}>
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
                ${user?.isAdmin ? "divide-y divide-gray-100 pb-2 right-10 origin-top-right" : "pb-0 -right-2 top-9"} ${menuPanelStyle}
              `}>
              <div className='px-1 py-1 space-y-2'>
                {items.map((el, index) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          el?.onClick()
                          e.stopPropagation()
                        }}
                        className={`${
                            active ? 
                              `${activeHover}` 
                            :
                              `${text}`
                          }
                          ${menuLinksStyle}
                        `}
                      >
                        {el.icon}
                        {el.label}
                        {
                          task?.isLocked && el.label === "Duplicate" ? 
                            (
                              <span className='ml-auto p-2 flex justify-center items-center'>{el.stillActiveIcon}</span>
                            )
                          :
                          task?.isLocked && el.label === "Open Task" ? 
                            (
                              <span className='ml-auto p-2 flex justify-center items-center'>{el.stillActiveIcon}</span>
                            )
                          :
                          null
                        }
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              <div className='px-1 py-1'>
                <div>
                  <ChangeTaskActions _id={task._id} stage={task.stage} isLocked={task?.isLocked} />
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
        msg={msg}
        setMsg={setMsg}
        type={type}
        isLoading={deleteLoading}
        open={openDialog1}
        setOpen={setOpenDialog1}
        onClick={deleteHandler}
      />

      <ConfirmationDialog
        msg={msg}
        setMsg={setMsg}
        type={type}
        isLoading={duplicateLoading}
        open={openDialog2}
        setOpen={setOpenDialog2}
        onClick={duplicateHandler}
      />
    </>
  );
}
