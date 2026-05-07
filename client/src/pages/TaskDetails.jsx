import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
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
import Button from "../components/Button";
import Loading from "../components/Loading";
import Tabs from "../components/Tabs";
import TaskColor from "../components/TaskComponents/TaskColor";
// import {
//   useChangeSubTaskStatusMutation,
//   useGetSingleTaskQuery,
//   usePostTaskActivityMutation,
// } from "../redux/slices/api/taskApiSlice";

import { tasks } from "../assets/data";

import {
  PRIORITY_STYLES,
  TASK_TYPE,
  getInitials,
  TASK_ICON
} from "../utils";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

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

const TASKTYPEICON = {
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
  bug: (
    <div className='text-red-600'>
      <FaBug size={30} />
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
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  // 3 Image Upload 
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Optional: filter only images
    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    setImages(imageFiles);
  };
  // End


  // const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    if (images.length < 3) {
      toast.error("Please upload at least 3 after-cleanup images.");
      return;
    }

    if (!text.trim()) {
      toast.error("Please add a comment before submitting.");
      return;
    }

    console.log("Images:", images);
    console.log("Comment:", text);

  // Later:
  // upload images to backend
    // try {
    //   const data = {
    //     type: selected?.toLowerCase(),
    //     activity: text,
    //   };
    //   const res = await postActivity({
    //     data,
    //     id,
    //   }).unwrap();
    //   setText("");
    //   toast.success(res?.message);
    //   refetch();
    // } catch (err) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  const Card = ({ item }) => {
    return (
      <div className={`flex space-x-4`}>
        <div className='flex flex-col items-center shrink-0'>
          <div className='w-10 h-10 flex items-center justify-center'>
            {TASKTYPEICON[item?.type]}
          </div>
          <div className='h-full flex items-center'>
            <div className={`w-0.5 ${LightMode ? "bg-gray-600" : "bg-gray-400"} h-full transition-colors duration-300 ease-in-out`}></div>
          </div>
        </div>

        <div className='flex flex-col gap-y-1 mb-8'>
          <p className={`${LightMode ? "text-gray-500" : "text-gray-300"} font-semibold transition-colors duration-300 ease-in-out`}>{item?.by?.name}</p>
          <div className={`${LightMode ? "text-gray-500" : "text-gray-400"} space-x-2 transition-colors duration-300 ease-in-out`}>
            <span className='capitalize'>{item?.type}</span>
            <span className='text-sm'>{moment(item?.date).fromNow()}</span>
          </div>
          <div className={`${LightMode ? "text-gray-700" : "text-gray-500"} transition-colors duration-300 ease-in-out`}>{item?.activity}</div>
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
              key={item.id}
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
          {act_types.map((item, index) => (
            <div key={item} className='flex gap-0.5 justify-center items-center'>
              {/* <input
                type='checkbox'
                className='w-4 h-4'
                checked={selected === item ? true : false}
                onChange={(e) => setSelected(item)}
              /> */}


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

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}        
            placeholder='Type.....'
            className={`${LightMode ? "placeholder-black/40 text-black border-gray-200 shadow-darkSM" : "placeholder-white/40 text-white border-gray-100 shadow-lightSM"} w-full mt-10 border  outline-none p-4 rounded-md focus:ring-2 ring-blue-500 shadow transition-colors duration-300 ease-in-out`}
          ></textarea>

          <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-2" />

          {/* After Cleanup Images Upload */}
          <div className="w-full mt-2">
            {/* <label className={`block mb-2 font-semibold ${
              LightMode ? "text-gray-600" : "text-gray-200"
            }`}>
              Upload After-Cleanup Images (Minimum 3)
            </label> */}

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
              <p className="text-sm mt-2 text-gray-500">
                {`${images.length} ${images.length >= 2 ? "images selected" : "image selected"}`}
              </p>
            )}

            {/* Preview Grid */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative hover:scale-110 transition-all duration-300 ease-in-out hover:z-50">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} w-full h-24 object-cover rounded shadow cursor-pointer transition-all duration-300 ease-in-out`}
                  />

                  <span
                    onClick={() => {
                      setImages(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute -top-1.5 -right-1 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type='button'
              label='Submit'
              onClick={handleSubmit}
              className='ClickAnimationNoti bg-blue-600 text-white rounded shadow-inner hover:shadow-innerWH transition-colors duration-200 ease-in-out'
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { LightMode } = useSelector((state) => state.auth);

  const { id } = useParams();
  // const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  // const [subTaskAction, { isLoading: isSubmitting }] =
  //   useChangeSubTaskStatusMutation();

  const [isSubmitting, setIsSubmitting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected] = useState(0);
  const task = tasks[3];

  // const handleSubmitAction = async (el) => {
  //   try {
  //     const data = {
  //       id: el.id,
  //       subId: el.subId,
  //       status: !el.status,
  //     };
  //     const res = await subTaskAction({
  //       ...data,
  //     }).unwrap();

  //     toast.success(res?.message);
  //     refetch();
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err?.data?.message || err.error);
  //   }
  // };

  if (isLoading)
    <div className='py-10'>
      <Loading />
    </div>;

  // const percentageCompleted =
  //   task?.subTasks?.length === 0
  //     ? 0
  //     : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

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
                    {task?.team?.map((m, index) => (
                      <div
                        key={index + m?._id}
                        className={`${LightMode ? "border-gray-400" : "border-gray-200"} relative flex gap-4 py-2 items-center border-t transition-colors duration-300 ease-in-out`}
                      >
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm -ml-4 shadow-inner overflow-hidden",
                          
                        )}>
                          {m?.img ? 
                            <img src={m?.img} alt="Avatar" className="w-full h-full object-cover "/>
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
                      {/* <div
                        className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
                          percentageCompleted < 50
                            ? "bg-rose-600"
                            : percentageCompleted < 80
                            ? "bg-amber-600"
                            : "bg-emerald-600"
                        }`}
                      >
                        <p>{percentageCompleted.toFixed(2)}%</p>
                      </div> */}
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

                            <>
                              <button
                                // disabled={isSubmitting}
                                className={`${LightMode ? " " : ""} text-sm outline-none  text-gray-800 p-1 rounded transition-colors duration-300 ease-in-out ${
                                  el?.isCompleted
                                    ? "hover:bg-rose-100 hover:text-rose-800"
                                    : "hover:bg-emerald-100 hover:text-emerald-800"
                                } disabled:cursor-not-allowed`}
                                // onClick={() =>
                                //   handleSubmitAction({
                                //     status: el?.isCompleted,
                                //     id: task?._id,
                                //     subId: el?._id,
                                //   })
                                // }
                              >
                                {isSubmitting ? (
                                  <div className={`${LightMode ? "dot-spinner" : "dot-spinnerDark"} transition-colors duration-300 ease-in-out animate-UpDown`}>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                    <div className="dot-spinner__dot"></div>
                                  </div>
                                ) : el?.isCompleted ? (
                                  " Mark as Undone"
                                ) : (
                                  " Mark as Done"
                                )}
                              </button>
                            </>
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
                    <p className='text-lg font-semibold'>TASK DESCRIPTION</p>
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
                          src={el}
                          alt={index}
                          className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-300 ease-in-out md:hover:scale-125 hover:z-50`}
                        />
                      ))}
                    </div>
                  </div>
                )
                :
                ( <div className="flex justify-center items-center">
                    <p className={`${LightMode ? "text-black" : "text-white"} transition-colors duration-300 ease-in-out text-lg font-semibold`}>NO AVAILABLE ASSETS</p>
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
            <Activities activity={task?.activities}  id={id} />
            {/* refetch={refetch} */}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;
