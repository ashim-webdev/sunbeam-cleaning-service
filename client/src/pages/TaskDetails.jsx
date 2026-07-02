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
import { FaLock } from "react-icons/fa";
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
import ConfirmationDialog from "../components/ConfirmationDialog";
import {
  useChangeSubTaskStatusMutation,
  useChangeTaskStageMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useDeleteTaskActivityMutation
} from "../redux/slices/api/taskApiSlice";

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
  task_completed: (
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
  { label: "Started", value: "started" },
  { label: "In Progress", value: "in progress" },
  { label: "Commented", value: "commented" },
  { label: "Completed", value: "task_completed" },
  { label: "Problem", value: "problem" },
  { label: "Assigned", value: "assigned" },
  { label: "Duplicated", value: "duplicated" },
  { label: "Trashed", value: "trashed" },
];

const ACTIVITY_LABELS = {
  started: "Started",
  "in progress": "In Progress",
  commented: "Commented",
  completed: "Completed",
  problem: "Problem",
  assigned: "Assigned",
  duplicated: "Duplicated",
  trashed: "Trashed",
};


const Activities = ({ activity, id, refetch, task, isLocked }) => {
  const { LightMode, user } = useSelector((state) => state.auth);

  // console.log(task)

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const [deleteActivity, { isLoading: deleteLoading }] = useDeleteTaskActivityMutation();

  const [changeTaskStage, { isLoading: stageLoading }] =
  useChangeTaskStageMutation();

  const [isSmall, setIsSmall] = useState(false)
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompletionDialog, setOpenCompletionDialog] = useState(false);
  const [openStageDialog, setOpenStageDialog] = useState(false);
  const [isFinalizingTask, setIsFinalizingTask] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);

  // 3 Image Upload 
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);



    // GET ADMIN AND LEADER 

    const isAdmin = user?.isAdmin;

    const isLeader =
      task?.team?.leader?._id?.toString() ===
      user?._id?.toString();

    const canManageTask = isAdmin || isLeader;

    // GET ADMINS FROM TEAM
    const admins = task?.team?.admins || [];

    // GET LEADER
    const leader = task?.team?.leader;

    // MERGE LEADER + ADMINS
    const adminAndLeader = [
      ...(leader
        ? [
            {
              ...leader,
              isLeader: true,
            },
          ]
        : []),

      ...admins.filter(
        (admin) =>
          admin?._id?.toString() !==
          leader?._id?.toString()
      ),
    ];

    // MAX VISIBLE
    const visiblePeople = adminAndLeader.slice(0, 3);

    const remainingCount =
      adminAndLeader.length - visiblePeople.length;
    // End




  // Delete Activity handler
  const handleDeleteActivity = async () => {
    try {
      const res = await deleteActivity({
        taskId: id,
        activityId: selectedActivityId,
      }).unwrap();

      toast.success(res?.message);

      setOpenDeleteDialog(false);
      setSelectedActivityId(null);

      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  
  // Toast disable message function
  const disableMessage = () => {
    if (isLocked) {
      toast.error("Task is locked. Further changes are disabled.");
      return;
    }
  }


  // Disable submit completion button immediately images are submitted
  const hasSubmittedCompletionImages = activity?.some(
    (item) => Array.isArray(item?.images) && item.images.length > 0
  );


  const handleImageChange = (e) => {
    // cleanup old previews first
    previewImages.forEach((img) =>
      URL.revokeObjectURL(img.preview)
    );

    const files = Array.from(e.target.files);

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const validImages = imageFiles.filter(
      (file) => file.size <= 2 * 1024 * 1024
    );

    if (validImages.length !== imageFiles.length) {
      toast.error("Each image must be under 2MB.");
    }

    const previews = validImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImages(previews);
    setImages(validImages);
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
    if (isLoading || isLocked) return;

    if (!text.trim()) {
      toast.error("Please add a comment before submitting.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("type", selected.toLowerCase());
      formData.append("activity", text);

      const res = await postActivity({
        data: formData,
        id,
      }).unwrap();

      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  

  // handle completion model pop up
  const handleOpenCompletionDialog = () => {

    if (!allSubTasksCompleted) {
      toast.error("Please complete all sub-tasks before submitting completion images.");
      return;
    }

    if (isLocked) {
      toast.error("Task is locked. Further changes are disabled.");
      return;
    }

    const hasCompletedComment = activity?.some(
      (item) => item?.type?.toLowerCase() === "task_completed"
    );

    if (!hasCompletedComment) {
      toast.error("Please post a final completion activity first.");
      return;
    }

    if (images.length < 5) {
      toast.error("Please upload at least 5 after-cleanup images.");
      return;
    }

    setOpenCompletionDialog(true);
  };


  // handle image submit
  const handleFinalSubmission = async () => {
    if (!allSubTasksCompleted) {
      toast.error("Please complete all sub-tasks before submitting completion images.");
      return;
    }

    const hasCompletedComment = activity?.some(
      (item) => item?.type?.toLowerCase() === "task_completed"
    );

    if (isLocked) {
      toast.error("Task is locked. Further changes are disabled.");
      return;
    }

    if (!hasCompletedComment) {
      toast.error("Please post a completed activity comment first.");
      return;
    }

    if (images.length < 5) {
      toast.error("Please upload at least 5 after-cleanup images.");
      return;
    }


    try {
      const formData = new FormData();

      formData.append("type", "task_completed");
      formData.append("activity", "Task completed with cleanup images");

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


      // CLOSE FIRST DIALOG
      setOpenCompletionDialog(false);

      // OPEN FINAL STAGE DIALOG AFTER 2 SECONDS
      setTimeout(() => {
        setOpenStageDialog(true);
      }, 2000);

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };


  const handlePermanentCompletion = async () => {
    try {
      setIsFinalizingTask(true);

      const res = await changeTaskStage({
        id,
        stage: "completed",
      }).unwrap();

      toast.success("Task permanently completed and locked.");

      setOpenStageDialog(false);

      refetch();
    } catch (err) {
      console.log(err);

      toast.error(err?.data?.message || err.error);
    } finally {
      setIsFinalizingTask(false);
    }
  };



  // Check if completed was selected and has a comment
  const canSubmitCompletion = activity?.some(
    (item) => item?.type?.toLowerCase() === "task_completed"
  );


  // Check if sub-task has all be marked as completed
  const allSubTasksCompleted =
    task?.subTasks?.length === 0 ||
    task?.subTasks?.every((t) => t.isCompleted);


  const Card = ({ item }) => {
    const { LightMode, user } = useSelector((state) => state.auth);


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
            <span className='capitalize'>
              {ACTIVITY_LABELS[item?.type?.toLowerCase()] || item?.type}
            </span>
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
                  disableMessage();

                  if (isLocked) return;

                  setSelectedActivityId(item?._id);
                  setOpenDeleteDialog(true);
                }}
                className={`
                    ${isLocked ? "cursor-not-allowed opacity-50" : ""}
                    absolute z-10 -top-3 left-0 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs hover:scale-110 hover:shadow-innerGRN active:scale-95 transition-all duration-300 ease-in-out
                  `}
              >
                ✕
              </span>

              {/* line top left (up)*/}
              {isLocked ? null : (
                <div className="absolute -top-1 left-1 w-30">
                  <div className="w-full h-[1.5px] bg-linear-to-l from-gray-400/10 via-gray-500 to-gray-400" />
                </div>
              )}
              {/* line top left (right) */}
              {isLocked ? null : (
                <div className="absolute -top-1 left-2 h-15">
                  <div className="w-0.5 h-full bg-linear-to-t from-gray-400/10 via-gray-500 to-gray-400" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative mt-4">
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
                        className={`
                            ${!canManageTask ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            custom-checkbox shadow-inner hover:shadow-innerWH
                          `}
                        checked={selected === item.value ? true : false}
                        // disabled={isLocked}
                        type="checkbox"
                        onClick={(e) => {
                          e.stopPropagation()

                          disableMessage();

                          if (isLocked) return

                          if (
                            item === "Completed" &&
                            !canManageTask
                          ) {
                            toast.error(
                              "Only admin and task leader can use completed activity."
                            );

                            return;
                          }

                          setSelected(item.value.toLowerCase());
                        }}
                      />
                      <span className={`
                        checkmark  transition-colors duration-300 ease-in-out 
                        ${LightMode ? "bg-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" : "bg-gray-200 shadow-[0_2px_5px_rgba(139,138,138,0.2)]"}
                        ${isLocked ? "opacity-50" : ""}
                      `}></span>
                    </label>

                    {/* Radio input */}
                    <div className="flex items-center gap-2">
                      <p
                        className={`${
                          LightMode ? "text-gray-600" : "text-gray-200"
                        } transition-colors duration-300 ease-in-out`}
                      >
                        {item.label}
                      </p>

                      {item.value === "task_completed" && (
                        <div className="flex -space-x-2">
                          {visiblePeople.map((person, index) => (
                            <div
                              key={person._id}
                              className="w-6 h-6 border border-amber-400 rounded-full overflow-hidden shadow-inner"
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
                        item.value === "task_completed" &&
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
                        className={`
                          ${
                            item.value === "task_completed" && !canManageTask
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                          }
                          custom-checkbox shadow-inner hover:shadow-innerWH
                        `}
                        checked={selected === item.value}
                        type="checkbox"
                        onClick={(e) => {
                          e.stopPropagation();

                          disableMessage();

                          if (isLocked) return

                          if (
                            item.value === "task_completed" &&
                            !canManageTask
                          ) {
                            toast.error(
                              "Completed activity is only for admin and task leader."
                            );

                            return;
                          }

                          setSelected(item.value.toLowerCase());
                        }}
                      />

                      <span className={`
                        checkmark transition-colors duration-300 ease-in-out 
                        ${LightMode ? "bg-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.2)]" : "bg-gray-200 shadow-[0_2px_5px_rgba(139,138,138,0.2)]"}
                        ${isLocked ? "opacity-50" : ""}
                      `}></span>
                    </label>
                    <p className={`${LightMode ? "text-gray-600" : "text-gray-200"}  transition-colors duration-300 ease-in-out`}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <textarea
              rows={10}
              value={text}
              disabled={isLocked}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type.....'
              className={`
                  ${LightMode ? "placeholder-black/40 text-black border-gray-200 shadow-darkSM" : "placeholder-white/40 text-white border-gray-100 shadow-lightSM"}
                  ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
                  w-full mt-10 border  outline-none p-4 rounded-md focus:ring-2 ring-blue-500 shadow transition-colors duration-300 ease-in-out
                `}
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

                  label={isLoading ? "Posting..." : "Post Activity"}
                  disabled={isLoading || isLocked}
                  onClick={(e) => {
                    e.preventDefault();
                    disableMessage();
                    handlePostActivity();
                  }}
                  className={`
                      ${isLocked ? "cursor-not-allowed opacity-50" : ""}
                      hover:scale-101 active:scale-95 bg-blue-600 text-white rounded shadow-inner hover:shadow-innerWH transition-all duration-300 ease-in-out
                    `}
                />
              )}
            </div>

            

            {/* After Cleanup Images Upload */}
            <div className="w-full mt-4">
              <label className={`
                block mb-2 text-sm font-semibold 
                ${LightMode ? "text-black/60" : "text-white/60"}
                ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
              `}>
                Upload After-Cleanup Images (Minimum 5)
              </label>

            <label
              onClick={disableMessage}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed hover:border-blue-400 rounded-xl cursor-pointer transition
              ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
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
                disabled={isLocked || !canManageTask}
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
                  onClick={handleOpenCompletionDialog}
                  label={isLoading ? "Submitting..." : "Submit Completion"}
                  disabled={
                    !canSubmitCompletion ||
                    !canManageTask ||
                    isLoading ||
                    isLocked ||
                    hasSubmittedCompletionImages ||
                    !allSubTasksCompleted
                  }
                  className={`
                    rounded shadow-inner transition-all duration-300 ease-in-out
                    ${isLocked ? "cursor-not-allowed opacity-50" : ""}
                    ${
                      canSubmitCompletion
                        ? "bg-emerald-600 text-white hover:scale-101 active:scale-95 hover:shadow-innerWH cursor-pointer"
                        : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                    }
                  `}
                />
              )}

              {/* Submitted After-Cleanup Images */}
              {activity?.some(
                (item) =>
                  item?.type?.toLowerCase() === "task_completed" &&
                  item?.images?.length > 0
              ) && (
                <div className="w-full">
                  <div className="sm:px-4 relative">
                    <div className="w-full h-0.5 bg-linear-to-l from-gray-400/10 via-gray-500 to-gray-400/10 mb-20 mt-13" />

                    <h3
                      className={`text-lg font-semibold ${
                        LightMode ? "text-black" : "text-white"
                      } transition-colors duration-300 ease-in-out pl-2 sm:pl-0`}
                    >
                      After Cleanup Images
                    </h3>

                    <p
                      className={`text-sm ${
                        LightMode ? "text-gray-600" : "text-gray-400"
                      } transition-colors duration-300 ease-in-out mt-0.5 pl-2 sm:pl-0`}
                    >
                      Uploaded completion photos by
                    </p>

                    {/* Submitted by */}
                    {task?.completedBy === null ? (
                      <span className="p-2 flex justify-start items-center">
                        <LoadingSmall />
                      </span>
                    ) : (
                      <>
                        <div className="flex justify-start item-center gap-2 mt-2 pl-2 sm:pl-0">
                          <div
                            className={`
                              ${LightMode ? "shadow-darkSM" : "shadow-lightSM"}
                              w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors ease-in-out duration-300 overflow-hidden `
                            }
                          >
                            {task?.completedBy?.profileImage ? 
                              <img src={task?.completedBy?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                            :
                              <span className='text-center text-[10px]'>
                                {getInitials(task?.completedBy?.name || "Unknown User")}
                              </span>
                            }
                          </div>
    
                          <span className={`text-sm ${LightMode ? "text-black" : "text-white"} transition-all duration-300 ease-in-out`}>{task?.completedBy?.name} </span>
                          <span className={`${LightMode ? "text-gray-600" : "text-gray-400"} text-sm transition-all duration-300 ease-in-out`}>
                            {formatDistanceToNow(new Date(task?.completedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </>
                    )}

                    {/* line top left (up)*/}
                    <div className="absolute top-18 -left-1.5 Md:w-90 w-50">
                      <div className="w-full h-[1.5px] bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400" />
                    </div>
                    {/* line top left (right) */}
                    <div className="absolute top-18 -left-2 h-28">
                      <div className="w-0.5 h-full bg-linear-to-t from-blue-400/10 via-blue-500 to-blue-400" />
                    </div>
                  </div>

                  <div className="px-10 mt-3 mb-5">
                    <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {activity
                      ?.filter(
                        (item) =>
                          item?.type?.toLowerCase() === "task_completed" &&
                          item?.images?.length > 0
                      )
                      ?.flatMap((item) => item.images)
                      ?.map((img, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-xl"
                        >
                          <img
                            src={img?.url}
                            alt={`cleanup-${index}`}
                            className={`
                              w-full h-32 object-cover rounded-xl cursor-pointer
                              transition-all duration-300 ease-in-out
                              group-hover:scale-110
                              ${
                                LightMode
                                  ? "shadow-darkSM"
                                  : "shadow-lightSM"
                              }
                            `}
                          />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      
      {isLocked && (
        <div className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} flex justify-center gap-2 item-center absolute -top-2 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold`}>
          <span className="pt-0.5"><FaLock /></span>
          <span>LOCKED</span>
        </div>
      )}

      <ConfirmationDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        msg="Are you sure you want to delete this comment?"
        onClick={handleDeleteActivity}
        isLoading={deleteLoading}
      />

      <ConfirmationDialog
        open={openCompletionDialog}
        setOpen={setOpenCompletionDialog}
        msg="Are you sure you want to complete this task? Once completed, this task may become locked and further changes could be restricted."
        type="Submit"
        setType="Submit"
        onClick={async () => {
          await handleFinalSubmission();
          setOpenCompletionDialog(false);
        }}
        isLoading={isLoading}
      />

      <ConfirmationDialog
        open={openStageDialog}
        setOpen={() => {}}
        msg="Final Step: Please change task stage to completed :)"
        type="Change Stage"
        setType="Change Stage"
        onClick={handlePermanentCompletion}
        isLoading={isFinalizingTask || stageLoading}
      />
    </div>
  );
};

const TaskDetail = () => {
  const { LightMode, user } = useSelector((state) => state.auth);

  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [subTaskAction, { isLoading: isSubmitting }] = useChangeSubTaskStatusMutation();

  const [selected, setSelected] = useState(0);

  // Get task
  const task = data?.task;

  const isLocked = task?.isLocked




  // console.log(task.equipments)
  // console.log(task)

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
      if (updatedTask?._id?.toString() === id?.toString()) {
        refetch();
      }
    };

    socket.on("taskUpdated", handleTaskUpdated);

    return () => {
      socket.off("taskUpdated", handleTaskUpdated);
    };
  }, [id, refetch]);


  const handleSubmitAction = async (el) => {

    if (isLocked) {
      toast.error("Task is locked. Further changes are disabled.");
      return;
    }

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


  const rawMembers = Array.isArray(task?.team)
    ? task.team
    : [
        ...(task?.team?.members || []),

        ...(task?.team?.leader
          ? [
              {
                ...task.team.leader,
                isLeader: true,
              },
            ]
          : []),
      ];

  const teamMembers = rawMembers.filter(
    (member, index, self) =>
      index ===
      self.findIndex(
        (m) => m?._id?.toString() === member?._id?.toString()
      )
  );



  
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


  // const title = task?.title || "";

  // const titleShort =
  //   title.split(" ").length > 3
  //     ? title.split(" ").slice(0, 3).join(" ") + "..."
  //     : title;


  // console.log(task.activity)

  return (
    <>
      <div className='w-full flex flex-col gap-3 mb-4 overflow-y-hidden'>
        {/* task detail */}
        <h1 className={`
            ${LightMode ? "text-gray-700" : "text-gray-300"} 
            text-2xl font-bold transition-colors duration-300 ease-in-out
          `}>
          {task?.title}
        </h1>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {selected === 0 ? (
            <>
              <div className="relative mt-4">
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
                    
                    <p className={`${LightMode ? "text-black bg-gray-200" : "text-white bg-white/40"} mt-6 border-l-10 border-blue-600 pl-2 rounded-l-lg  flex gap-2 justify-start items-center transition-colors duration-300 ease-in-out `}>
                      <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-user text-xl text-blue-700 "></i></span>
                      <span className="font-bold text-lg italic pr-1">{task?.clientName}</span>
                    </p>

                    <p className={`${LightMode ? "text-black bg-gray-200" : "text-white bg-white/40"} border-l-10 border-blue-600  pl-2 rounded-l-lg flex gap-2 justify-start items-center transition-colors duration-300 ease-in-out -mt-4`}>
                      <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-location-dot text-xl text-amber-400"></i></span>
                      <span className="font-bold text-lg italic pr-1">{task?.address}</span>
                    </p>

                    <p className={`${LightMode ? "text-black bg-gray-200" : "text-white bg-white/40"} border-l-10 border-blue-600 pl-2 rounded-l-lg flex gap-2 justify-start items-center -mt-4 transition-colors duration-300 ease-in-out`}>
                      <span className="flex justify-center items-center gap-1 font-semibold"><i className="fa-solid fa-calendar text-xl text-teal-700"></i></span>
                      <span className={`${LightMode ? "text-gray-800" : "text-white/80"} font-semibold transition-colors duration-300 ease-in-out italic`}>{new Date(task?.date).toDateString()}</span>
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
                              "w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm -ml-4 shadow-inner overflow-hidden",
                              
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
                                        disabled={isSubmitting || !canManageTask}
                                        className={`
                                          ${LightMode ? "shadow-inner text-black" : "shadow-innerWH text-white"} text-sm outline-none  text-gray-800 py-1 px-2 rounded  hover:scale-105 active:scale-105 transition-all duration-300 ease-in-out ${
                                          el?.isCompleted
                                            ? "hover:bg-rose-100 hover:text-rose-800"
                                            : "hover:bg-emerald-100 hover:text-emerald-800"
                                        } 
                                        ${!canManageTask ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                                        ${isLocked ? "cursor-not-allowed opacity-50" : ""}
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
                      <div className="w-full h-0.5 bg-linear-to-l from-gray-400/10 via-gray-500 to-gray-400/10 my-2" />
                    </div>

                    {task?.equipments?.length > 0 && (
                      <div className={`${LightMode ? "text-black" : "text-white"} transition-colors duration-300 ease-in-out`}>
                        <p className='text-lg font-semibold mb-4'>EQUIPMENT</p>
                        <div className={`${LightMode ? "text-gray-800" : "text-gray-300"} flex flex-col item-center transition-colors duration-300 ease-in-out`}>
                          {task?.equipments?.map((equipment, index) => (
                            <span key={index}>• {equipment}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="px-4">
                      <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-12 mb-6" />
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
                  </div>
                </div>


                {isLocked && (
                  <div className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} flex justify-center gap-2 item-center absolute -top-2 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold`}>
                    <span className="pt-0.5"><FaLock /></span>
                    <span>LOCKED</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Activities
                id={id}
                isLocked={isLocked}
                activity={task?.activities} 
                refetch={refetch}
                task={task}
              />
            </>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default TaskDetail;
