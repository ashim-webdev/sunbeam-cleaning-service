import { socket } from "../socket";
import clsx from "clsx";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { FaSadTear, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { UploadCloud, User, MapPin, Calendar } from "lucide-react"
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
  MdKeyboardDoubleArrowDown
} from "react-icons/md";
import { useSelector } from "react-redux";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Tabs from "../components/Tabs";
import TaskColor from "../components/TaskComponents/TaskColor";
import CircularBar from "../components/ui/circularBar";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useDeleteTaskActivityMutation
} from "../redux/slices/api/taskApiSlice";

import { useGetTeamListsQuery } from "@/redux/slices/api/userApiSlice";


import {
  PRIORITY_STYLES,
  TASK_TYPE,
  getInitials,
  TASK_ICON
} from "../utils";






const LoadingSmall = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <>
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
    </>
  )
}


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
  normal: "text-blue-600"
};

  

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities", icon: <RxActivityLog /> },
];

const TASK_TYPE_ICON = {
  commented: (
    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white'>
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white'>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className='w-9 h-9 p-2 flex items-center justify-center rounded-full bg-gray-500 text-white'>
      <FaUser size={14} />
    </div>
  ),
  problem: (
    <div className='text-red-600'>
      <FaSadTear size={30} />
    </div>
  ),
  completed: (
    <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className='w-9 h-9 flex items-center justify-center rounded-full bg-violet-600 text-white'>
      <GrInProgress size={16} />
    </div>
  ),
  duplicated: (
    <div className='w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white'>
      <FaTasks size={18} />
    </div>
  ),

  trashed: (
    <div className='w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white'>
      <i className="fa-solid fa-trash"></i>
    </div>
  ),

  restored: (
    <div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white'>
      <i className="fa-solid fa-rotate-left"></i>
    </div>
  ),
};

const act_types = [
  "Started",
  "In Progress",
  "Commented",
  "Completed",
  "Problem",
  "Assigned",
  "Duplicated",
  "Trashed",
];

const Activities = ({ activity, id, refetch, task }) => {
  const { LightMode, user } = useSelector((state) => state.auth);

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const { data: usersData } = useGetTeamListsQuery();

  const [isSmall, setIsSmall] = useState(false)
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  // 3 Image Upload 
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  console.log(usersData)

  // Getting all users
  const users = usersData?.users || [];

  // Get admin and leader
  const isAdmin = user?.isAdmin;

  const isLeader =
    task?.team?.leader?._id?.toString() ===
    user?._id?.toString();

  const canManageTask = isAdmin || isLeader;

  const admins = users.filter(
    (u) =>
      u?.isAdmin ||
      u?.role?.toLowerCase() === "admin" ||
      u?.role?.toLowerCase() === "administrator"
  );

  const adminAndLeader = [
    ...(task?.team?.leader
      ? [task.team.leader]
      : []),

    ...admins.filter(
      (admin) =>
        admin?._id?.toString() !==
        task?.team?.leader?._id?.toString()
    ),
  ];

  // Visible 2 admin and 1 leader
  const visiblePeople = adminAndLeader.slice(0, 3);

  const remainingCount =
    adminAndLeader.length - visiblePeople.length;
  // end


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Optional: filter only images
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const previews = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImages(previews);
    setImages(imageFiles);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((img) =>
        URL.revokeObjectURL(img.preview)
      );
    };
  }, [previewImages]);
  // End


  
  // handle comments
  const handlePostActivity = async () => {
    if (!text.trim()) {
      toast.error("Please add a comment before submitting.");
      return;
    }

    console.log("Images:", images);
    console.log("Comment:", text);

  // Later:
  // upload images to backend
    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();

      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };


  // handle image submit
  const handleFinalSubmission = async () => {
    const hasCompletedComment = activity?.some(
      (item) => item?.type?.toLowerCase() === "completed"
    );

    if (!hasCompletedComment) {
      toast.error("Please post a completed activity first.");
      return;
    }

    if (images.length < 5) {
      toast.error("Please upload at least 5 after-cleanup images.");
      return;
    }


    try {
      const formData = new FormData();

      formData.append("type", "completed");
      formData.append("activity", text);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await postActivity({
        data: formData,
        id,
      }).unwrap();

      toast.success(res?.message);

      setText("");
      setImages([]);
      setPreviewImages([]);

      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // Check if completed was selected and has a comment
  const canSubmitCompletion = activity?.some(
    (item) => item?.type?.toLowerCase() === "completed"
  );



  const Card = ({ item }) => {
    const { LightMode, user } = useSelector((state) => state.auth);

    const [deleteActivity] = useDeleteTaskActivityMutation();

    const handleDeleteActivity = async (activityId) => {
      try {
        const res = await deleteActivity({
          taskId: id,
          activityId,
        }).unwrap();

        toast.success(res?.message);

        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    // User can only delete there comment 
    const isOwner =
    item?.by?._id?.toString() === user?._id?.toString();

    const canDelete =
    isOwner || user?.isAdmin;


    return (
      <div className={`flex space-x-4`}>
        <div className='flex flex-col items-center shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TASK_TYPE_ICON[item?.type?.toLowerCase()]}
          </div>
          <div className='h-full flex items-center'>
            <div className={`w-0.5 ${LightMode ? "bg-gray-600" : "bg-gray-400"} h-full transition-colors duration-300 ease-in-out`}></div>
          </div>
        </div>

        <div className='relative flex flex-col gap-y-1 mb-8 pl-6'>
          <div className="flex justify-start item-center gap-2 mt-2">
            <div className={`
                ${LightMode ? "shadow-darkSM" : "shadow-lightSM"}
                outline-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#005FFB] cursor-pointer transition-all ease-in-out duration-200 overflow-hidden
              `}>
              <span className='text-white font-semibold flex justify-center item-center '>
                {item?.by?.profileImage ? 
                  <img src={item?.by?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                  :
                  <span className="text-[8px]">
                    {getInitials(item?.by?.name)}
                  </span>
                }
              </span>
            </div>

            <p className={`${LightMode ? "text-gray-500" : "text-gray-200"} font-semibold transition-colors duration-300 ease-in-out`}>
              {item?.by?.name}
            </p>
          </div>

          <div className={`${LightMode ? "text-gray-500" : "text-gray-200"} space-x-2 transition-colors duration-300 ease-in-out`}>
            <span className='capitalize'>{item?.type}</span>
            <span className='text-sm'>
              {formatDistanceToNow(new Date(item?.date), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className={`${LightMode ? "text-gray-700" : "text-gray-400"} transition-colors duration-300 ease-in-out`}>{item?.activity}</div>

          {/* Cancel comment button */}
          {canDelete && (
            <>
              <span
                onClick={() => {
                  handleDeleteActivity(item?._id)
                }}
                className="absolute z-10 -top-3 left-0 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs hover:scale-110 hover:shadow-innerGRN active:scale-95 transition-all duration-300 ease-in-out"
              >
                ✕
              </span>

              {/* line top left (up)*/}
              <div className="absolute -top-1 left-1 w-30">
                <div className="w-full h-[1.5px] bg-linear-to-l from-gray-400/10 via-gray-500 to-gray-400" />
              </div>
              {/* line top left (right) */}
              <div className="absolute -top-1 left-2 h-15">
                <div className="w-[2px] h-full bg-linear-to-t from-gray-400/10 via-gray-500 to-gray-400" />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM"} w-full flex  flex-col md:flex-row gap-40 md:gap-10 2xl:gap-20 min-h-screen px-10 py-8 shadow rounded-md justify-between overflow-y-auto transition-colors duration-300 ease-in-out`}>
      <div className='w-full md:w-1/2'>
        <h4 className={`${LightMode ? "text-gray-600" : "text-white"} font-semibold text-lg mb-5 transition-colors duration-300 ease-in-out`}>Activities</h4>
        <div className='w-full space-y-0'>
          {activity?.map((item, index) => (
            <Card
              key={item._id || index}
              item={item}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className='w-full md:w-1/2'>
        <h4 className={`${LightMode ? "text-gray-500" : "text-white"} font-semibold text-lg mb-5 transition-colors duration-300 ease-in-out`}>
          Add Activity
        </h4>
        <div className='w-full flex flex-col justify-center items-start gap-5'>
          <div className="w-full flex flex-col sm:flex-row gap-5">
            <div className="w-full flex flex-col justify-center items-start gap-5">
              {act_types.slice(0, 4).map((item, index) => (
                <div key={item} className='flex gap-0.5 justify-center items-center'>
                  {/* Uiverse CheckBox */}
                  <label className="checkbox-container ClickAnimationNoti">
                    <input 
                      className="custom-checkbox shadow-inner hover:shadow-innerWH"
                      checked={selected === item ? true : false}
                      type="checkbox"
                      disabled={
                        item === "Completed" && !canManageTask
                      }
                      onChange={(e) => {
                        if (
                          item === "Completed" &&
                          !canManageTask
                        ) {
                          toast.error(
                            "Only admin and task leader can use completed activity."
                          );

                          return;
                        }

                        setSelected(item);
                      }}
                    />
                      <span className={`checkmark transition-colors duration-300 ease-in-out ${LightMode ? "bg-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" : "bg-gray-200 shadow-[0_2px_5px_rgba(139,138,138,0.2)]"}`}></span>
                  </label>
<div className="flex items-center gap-2">
  <p
    className={`${
      LightMode ? "text-gray-600" : "text-gray-200"
    } transition-colors duration-300 ease-in-out`}
  >
    {item}
  </p>

  {item === "Completed" && (
    <div className="flex -space-x-2">
      {visiblePeople.map((person, index) => (
        <div
          key={index}
          className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-inner"
        >
          {person?.profileImage ? (
            <img
              src={person.profileImage}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">
              {getInitials(person?.name)}
            </div>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="w-6 h-6 rounded-full bg-gray-700 text-white text-[10px] flex items-center justify-center border-2 border-white font-bold">
          +{remainingCount}
        </div>
      )}
    </div>
  )}
</div>
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col justify-center items-start gap-5">
              {act_types.slice(-4).map((item, index) => (
                <div
                  key={item}
                  className='flex gap-0.5 justify-center items-center'
                  onClick={() => {
                    if (
                      item === "Completed" &&
                      !canManageTask
                    ) {
                      toast.error(
                        "Completed activity is only for admin and task leader."
                      );
                    }
                  }}
                >
                  {/* Uiverse CheckBox */}
                  <label className="checkbox-container ClickAnimationNoti">
                    <input 
                      className="custom-checkbox shadow-inner hover:shadow-innerWH"
                      checked={selected === item ? true : false}
                      type="checkbox" 
                      onChange={(e) => setSelected(item)}
                    />

                    <span className={`checkmark transition-colors duration-300 ease-in-out ${LightMode ? "bg-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" : "bg-gray-200 shadow-[0_2px_5px_rgba(139,138,138,0.2)]"}`}></span>
                  </label>
                  <p className={`${LightMode ? "text-gray-600" : "text-gray-200"}  transition-colors duration-300 ease-in-out`}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}        
            placeholder='Type.....'
            className={`${LightMode ? "placeholder-black/40 text-black border-gray-200 shadow-darkSM" : "placeholder-white/40 text-white border-gray-100 shadow-lightSM"} w-full mt-10 border  outline-none p-4 rounded-md focus:ring-2 ring-blue-500 shadow transition-colors duration-300 ease-in-out`}
          ></textarea>

          <div className="w-full flex flex-col gap-3 mt-1">
            <div className="px-10">
              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
            </div>

            
            {isLoading ? (
              <div className="w-full flex justify-center item-center mt-1">
                <Loading />
              </div>
            ) : (
              <Button
                type='button'
                label='Post Activity'
                onClick={handlePostActivity}
                className='hover:scale-101 active:scale-95 bg-blue-600 text-white rounded shadow-inner hover:shadow-innerWH transition-all duration-300 ease-in-out'
              />
            )}
          </div>

          

          {/* After Cleanup Images Upload */}
          <div className="w-full mt-4">
            <label className={`block mb-2 text-sm font-semibold ${
              LightMode ? "text-black/60" : "text-white/60"
            }`}>
              Upload After-Cleanup Images (Minimum 5)
            </label>

          <label
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed hover:border-blue-400 rounded-xl cursor-pointer transition
            ${
              LightMode
                ? "bg-gray-50 border-gray-300 hover:bg-gray-200"
                : "bg-black/30 border-gray-600 hover:bg-black/40"
            }`}
          >
            <UploadCloud
              className={`w-10 h-10 mb-2 ${
                LightMode ? "text-gray-500" : "text-gray-300"
              }`}
            />

            <p
              className={`text-sm ${
                LightMode ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Click to upload images
            </p>

            <p
              className={`text-xs ${
                LightMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              PNG, JPG, WEBP
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

            {/* Selected count */}
            {images.length > 0 && (
              <p className="text-sm mt-3 text-gray-500">
                {`${images.length} ${images.length >= 2 ? "images selected" : "image selected"}`}
              </p>
            )}

            {/* Preview Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {previewImages.map((file, index) => (
                <div key={index} className="relative hover:scale-110 transition-all duration-300 ease-in-out hover:z-50 mb-6">
                  <img
                    src={file.preview}
                    alt="preview"
                    className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} w-full h-24 object-cover rounded shadow cursor-pointer transition-all duration-300 ease-in-out`}
                  />

                  <span
                    onClick={() => {
                      setImages((prev) => prev.filter((_, i) => i !== index));

                      setPreviewImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute -top-1.5 -right-1 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 -mt-3">
            <div className="px-10">
              <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
            </div>
            
            {isLoading ? (
              <div className="w-full flex justify-center item-center mt-1">
                <Loading />
              </div>
            ) : (
              <Button
                type='button'
                label='Submit Completion'
                onClick={handleFinalSubmission}
                disabled={!canSubmitCompletion || !canManageTask}
                className={`
                  rounded shadow-inner transition-all duration-300 ease-in-out
                  ${
                    canSubmitCompletion
                      ? "bg-emerald-600 text-white hover:scale-101 active:scale-95 hover:shadow-innerWH cursor-pointer"
                      : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  }
                `}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { LightMode, user } = useSelector((state) => state.auth);

  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [subTaskAction, { isLoading: isSubmitting }] = useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);

  const task = data?.task;

  // Only admin and leader can make changes
  const isAdmin = user?.isAdmin;

  const isLeader =
    task?.team?.leader?._id?.toString() ===
    user?._id?.toString();

  const canManageTask = isAdmin || isLeader;
  // End

  // socket.oi real time update
  useEffect(() => {
    if (!id) return;

    socket.emit("joinTask", id);

    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask?._id === id) {
        refetch();
      }
    };

    socket.on("taskUpdated", handleTaskUpdated);

    return () => {
      socket.off("taskUpdated", handleTaskUpdated);
    };
  }, [id, refetch]);


  const handleSubmitAction = async (el) => {
    try {
      const data = {
        taskId: el.id,
        subTaskId: el.subId,
        status: !el.status,
      };

      const res = await subTaskAction(data).unwrap();

      toast.success(res?.message);

      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };


  const teamMembers = Array.isArray(task?.team)
    ? task.team
    : [
        ...(task?.team?.members || []),

        ...(task?.team?.leader
          ? [{
              ...task.team.leader,
              isLeader: true,
            }]
          : []),
      ];



  
  if (isLoading) {
    return (
      <div className='py-10'>
        <Loading />
      </div>
    )
  }

  if (!task) {
    return (
      <div className={`${LightMode ? "text-black/60" : "text-white/60"} py-10 text-center text-lg transition-all duration-300 ease-in-out`}>
        Task not found :(
      </div>
    );
  }



  const getCompletedSubTasks = (subTasks) => {
    return subTasks.filter((task) => task.isCompleted).length;
  };

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  // Chart colors
  const progressColors =
  percentageCompleted < 50
    ? ["#ef4444", "#be123c"] // red
    : percentageCompleted < 80
    ? ["#f59e0b", "#d97706"] // orange
    : ["#10b981", "#059669"]; // green


  const title = task?.title;
  const titleShort = title.split(" ").length > 3 ? title.split(" ").slice(0, 3).join(" ") + "..." : title;

  return (
    <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
      {/* task detail */}
      <h1 className={`
          ${LightMode ? "text-gray-700" : "text-gray-300"} 
          text-2xl font-bold transition-colors duration-300 ease-in-out
        `}>
        {titleShort}
      </h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className={`${LightMode ? "bg-white/60 shadow-darkSM" : "bg-black/60 shadow-lightSM"} w-full flex flex-col md:flex-row gap-5 2xl:gap-8 shadow rounded-md px-8 py-8 overflow-y-auto`}>
              <div className='relative w-full md:w-1/2 space-y-8'>
                <div className='flex flex-col xl:flex-row items-start xl:items-center gap-5 mb-12'>
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full shadow-inner",
                      PRIORITY_STYLES[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className='text-lg '>{ICONS[task?.priority]}</span>
                    <span className='uppercase whitespace-nowrap'>{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className={`${LightMode ? "text-black" : "text-white"} uppercase transition-colors duration-300 ease-in-out`}>{task?.stage}</span>
                  </div>
                </div>
                
                <p className={`${LightMode ? "text-black bg-blue-50 shadow-darkSM" : "text-white shadow-lightSM"} mt-6 border-l-10 border-blue-600 pl-2 rounded-l-lg  flex gap-2 justify-start items-center transition-colors duration-300 ease-in-out `}>
                  <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-user text-xl text-blue-700 "></i></span>
                  <span className="font-bold text-lg italic pr-1">{task?.clientName}</span>
                </p>

                <p className={`${LightMode ? "text-black bg-blue-50 shadow-darkSM" : "text-white shadow-lightSM"} border-l-10 border-blue-600  pl-2 rounded-l-lg flex gap-2 justify-start items-center transition-colors duration-300 ease-in-out -mt-4`}>
                  <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-location-dot text-xl text-amber-400"></i></span>
                  <span className="font-bold text-lg italic pr-1">{task?.address}</span>
                </p>

                <p className={`${LightMode ? "text-black bg-blue-50 shadow-darkSM" : "text-white shadow-lightSM"} border-l-10 border-blue-600 pl-2 rounded-l-lg flex gap-2 justify-start items-center -mt-4 transition-colors duration-300 ease-in-out`}>
                  <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-calendar text-xl text-teal-700"></i></span>
                  <span className={`${LightMode ? "text-gray-800" : "text-gray-300"} font-semibold transition-colors duration-300 ease-in-out italic`}>{new Date(task?.date).toDateString()}</span>
                </p>

                <div className={`${LightMode ? "text-gray-500 border-gray-400" : "text-gray-400 border-gray-200"} transition-colors duration-300 ease-in-out flex justify-center items-center gap-8 p-4 border-y`}>
                  <div className='space-x-2 flex flex-col sm:flex-row items-center'>
                    <span className={`${LightMode ? "text-black" : "text-white"} whitespace-nowrap font-semibold transition-colors duration-300 ease-in-out`}>Assets <span className={`${LightMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300 ease-in-out`}>:</span></span>
                    <span className={`${LightMode ? "text-black" : "text-white"} transition-colors duration-300 ease-in-out`}>{task?.assets?.length}</span>
                  </div>
                  <span className={`${LightMode ? "border-gray-400" : "border-gray-200"} border-l h-6 transition-colors duration-300 ease-in-out`}></span>
                  <div className='space-x-2 flex flex-col sm:flex-row items-center'>
                    <span className={`${LightMode ? "text-black" : "text-white"} whitespace-nowrap font-semibold transition-colors duration-300 ease-in-out`}>Sub-Task <span className={`${LightMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300 ease-in-out`}>:</span></span>
                    <span className={`${LightMode ? "text-black" : "text-white"} transition-colors duration-300 ease-in-out`}>{task?.subTasks?.length}</span>
                  </div>
                </div>

                <div className='space-y-4 py-6'>
                  <p className={`${LightMode ? "text-black" : "text-white"} font-semibold text-sm transition-colors duration-300 ease-in-out`}>
                    TASK TEAM
                  </p>
                  <div className='space-y-3'>
                    {teamMembers.map((m, index) => (
                      <div
                        key={index + m?._id}
                        className={`${LightMode ? "border-gray-400" : "border-gray-200"} relative flex gap-4 py-2 items-center border-t transition-colors duration-300 ease-in-out`}
                      >
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm -ml-4 shadow-inner overflow-hidden",
                          
                        )}>
                          {m?.profileImage ? 
                            <img src={m?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                          :
                            <span>
                              {getInitials(m?.name)}
                            </span>
                          }
                        </div>
              
                        <div className={`absolute ${m.isLeader ? "block" : "hidden"} top-2.5 mx-auto w-2.5 h-2.5 rounded-full bg-green-500 shadow-inner animate-spin`} />
                        <div>
                          <p className={`${LightMode ? "text-black" : "text-white"} text-lg font-normal transition-colors duration-300 ease-in-out`}>{m?.name}</p>
                          <span className={`${LightMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300 ease-in-out`}>{m?.title}</span>
                        </div>

                        <span className={`
                          ${ m?.isLeader 
                            ? "text-green-600" 
                            : "text-blue-600/60"
                          }
                          text-lg absolute my-auto right-5
                        `}><i className="fa-solid fa-flag"></i></span>
                      </div>
                    ))}
                  </div>
                </div>
                {task?.subTasks?.length > 0 && (
                  <div className='space-y-4 py-6'>
                    <div className='flex items-center gap-5'>
                      <p className={`${LightMode ? "text-black" : "text-white"} font-semibold text-sm transition-colors duration-300 ease-in-out`}>
                        SUB-TASKS
                      </p>
                      <CircularBar
                        progress={percentageCompleted}
                        size={70}
                        strokeWidth={12}
                        gradientColors={progressColors}
                        trackColor="#0022ff56"
                        textSize="text-sm"
                        label={<i className="fa-regular fa-percent text-[16px] -mt-2"></i>}
                      />
                    </div>
                    <div className='space-y-8'>
                      {task?.subTasks?.map((el, index) => (
                        <div key={index + el?._id} className='flex gap-3'>
                          <div className='w-10 h-10 flex items-center justify-center rounded-full bg-violet-200 p-2 -ml-2 [@media(min-width:500px)]:ml-0'>
                            <MdTaskAlt className='text-violet-600' size={26} />
                          </div>

                          <div className='space-y-1'>
                            <div className='flex gap-2 items-center'>
                              <span className={`${LightMode ? "text-gray-800" : "text-gray-200"} text-sm [@media(min-width:500px)]:mt-0 -mt-5 mr-2 transition-colors duration-300 ease-in-out whitespace-nowrap`}>
                                {new Date(el?.date).toDateString()}
                              </span>

                              <div className="flex flex-col [@media(min-width:500px)]:flex-row justify-center items-center gap-2">
                                <span className='px-2 py-0.5 text-center text-sm rounded-full bg-violet-200 text-violet-700 font-semibold lowercase whitespace-nowrap'>
                                  {el?.tag}
                                </span>

                                <span
                                  className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold whitespace-nowrap ${
                                    el?.isCompleted
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-amber-100 text-amber-600"
                                  }`}
                                >
                                  {el?.isCompleted ? "done" : "in progress"}
                                </span>
                              </div>
                            </div>
                            <p className={`${LightMode ? "text-gray-600" : "text-gray-400"} pb-2 transition-colors duration-300 ease-in-out`}>{el?.title}</p>
                            
                            <div>
                              {isSubmitting ? (
                                <div className="ml-9 mt-1">
                                  <LoadingSmall />
                                </div>
                              ) : (
                                <>
                                  <button
                                    disabled={isSubmitting}
                                    className={`
                                      ${LightMode ? "shadow-inner text-black" : "shadow-innerWH text-white"} text-sm outline-none  text-gray-800 py-1 px-2 rounded  hover:scale-105 active:scale-105 transition-all duration-300 ease-in-out ${
                                      el?.isCompleted
                                        ? "hover:bg-rose-100 hover:text-rose-800"
                                        : "hover:bg-emerald-100 hover:text-emerald-800"
                                    } 
                                    ${!canManageTask ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                    `
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (!canManageTask) {
                                      toast.error(
                                        "Only admin and task leader can manage task completion."
                                      );

                                      return;
                                    }

                                    handleSubmitAction({
                                      status: el?.isCompleted,
                                      id: task?._id,
                                      subId: el?._id,
                                    });
                                  }}
                                  >
                                    {el?.isCompleted ? (
                                      " Mark as Undone"
                                    ) : (
                                      " Mark as Done"
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className={`absolute sm:-top-1.5 -top-1 -right-3 sm:right-6 py-2 px-4 text-2xl capitalize text-center whitespace-nowrap`}>
                  <i className={` ${TASK_ICON[task?.stage].icon} ${TASK_ICON[task?.stage].color}`}></i>
                </div>
              </div>

              <div className='w-full md:w-1/2 space-y-3'>
                {task?.description && (
                  <div className={`${LightMode ? "text-black" : "text-white"} transition-colors duration-300 ease-in-out`}>
                    <p className='text-lg font-semibold mb-4'>TASK DESCRIPTION</p>
                    <div className={`${LightMode ? "text-gray-800" : "text-gray-300"} transition-colors duration-300 ease-in-out`}>{task?.description}</div>
                  </div>
                )}

                <div className="px-4">
                  <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 my-6" />
                </div>

                {task?.assets?.length > 0 ? (
                  <div className='pb-10'>
                    <p className={`${LightMode ? "text-black" : "text-white"} text-lg font-semibold mb-5 transition-colors duration-300 ease-in-out`}>ASSETS</p>
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {task?.assets?.map((el, index) => (
                        <img
                          key={index}
                          src={el?.url}
                          alt={index}
                          className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-300 ease-in-out md:hover:scale-125 hover:z-50`}
                        />
                      ))}
                    </div>
                  </div>
                )
                :
                ( <div className="flex justify-center items-center">
                    <p className={`${LightMode ? "text-black/60" : "text-white/60"} transition-colors duration-300 ease-in-out text-lg font-semibold`}>No available assets :(</p>
                  </div>)
                }

                {task?.links?.length > 0 && (
                  <div className=''>
                    <p className='text-lg font-semibold'>SUPPORT LINKS</p>
                    <div className='w-full flex flex-col gap-4'>
                      {task?.links?.map((el, index) => (
                        <a
                          key={index}
                          href={el}
                          target='_blank'
                          className='text-blue-600 hover:underline'
                        >
                          {el}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities}  id={id} 
            refetch={refetch} task={task} />
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;
