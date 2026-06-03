import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { useSelector } from "react-redux";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";




const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];



const AddTask = ({ open, setOpen, task }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();


  // image field
  const [assets, setAssets] = useState([]);

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState({
    members: task?.team?.members || [],
    leader: task?.team?.leader || null,
  });
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );

  const [uploading, setUploading] = useState(false);
  const [shake, setShake] = useState(false);
  

  // const task = ""
  const defaultValues = {
    title: task?.title || "",
    clientName: task?.clientName || "",
    address: task?.address || "",
    date: dateFormatter(task?.date || new Date()),
    stage: "",
    priority: "",
    assets: [],
    description: task?.description || "",
    equipments: task?.equipments?.join(", ") || "",
  };
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // Make members & leader show up when editing task
  useEffect(() => {
    if (task) {
      setTeam({
        members: task?.team?.members || [],
        leader: task?.team?.leader || null,
      });

      setStage(task?.stage?.toUpperCase() || LISTS[0]);

      setPriority(
        task?.priority?.toUpperCase() || PRIORITY[2]
      );

      reset({
        title: task?.title || "",
        clientName: task?.clientName || "",
        address: task?.address || "",
        date: dateFormatter(task?.date || new Date()),
        description: task?.description || "",
        equipments: task?.equipments?.join(", ") || "",
      });
    }
  }, [task, reset]);


  const triggerShake = () => {
    setShake(true);

    if (navigator.vibrate) {
      navigator.vibrate(300);
    }

    setTimeout(() => {
      setShake(false);
    }, 1000);
  };

  const handleFormError = (formErrors) => {    
    if (formErrors.title && formErrors.description && formErrors.equipments && formErrors.clientName && formErrors.address) {
      toast.error("Please fill in all required fields");
      triggerShake()
    } else if (formErrors.title) {
      toast.error("Title field is required");
      triggerShake()
    } else if (formErrors.clientName) {
      toast.error("Client Name field is required");
      triggerShake()
    } else if (formErrors.address) {
      toast.error("Address field is required");
      triggerShake()
    } else if (formErrors.description) {
      toast.error("Description field is required");
      triggerShake()
    } else if (formErrors.equipments) {
      toast.error("Equipment field is required");
      triggerShake()
    }
  };

  const handleOnSubmit = async (data) => {
    try {
      const formData = new FormData();

      // ✅ Basic fields
      formData.append("title", data.title);
      formData.append("clientName", data.clientName);
      formData.append("address", data.address);
      formData.append("date", data.date);
      formData.append("stage", stage.toLowerCase());
      formData.append("priority", priority.toLowerCase());
      formData.append("description", data.description);

      // ✅ equipments
      const equipmentsArray = data.equipments
        .split(",")
        .map(item => item.trim());

      formData.append(
        "equipments",
        JSON.stringify(equipmentsArray)
      );

      // ✅ Remove leader form members
      const filteredMembers = (team.members || []).filter(
        (id) => id !== team.leader
      );

      // ✅ team
      formData.append(
        "team",
        JSON.stringify({
          members: filteredMembers,
          leader: team.leader || null,
        })
      );

      // // ✅ team
      // formData.append(
      //   "team",
      //   JSON.stringify({
      //     members: team.members || [],
      //     leader: team.leader || null,
      //   })
      // );

      // NEW FILES ONLY
      assets.forEach((item) => {
        if (!item.isExisting && item.file) {
          formData.append("assets", item.file);
        }
      });

      // EXISTING CLOUDINARY FILES ONLY
      const existingAssets = assets
        .filter((item) => item.isExisting)
        .map((item) => ({
          url: item.preview,
          public_id: item.public_id,
        }));

      formData.append(
        "existingAssets",
        JSON.stringify(existingAssets)
      );

      // Sending data to RTK redux endpoint
      if (task?._id) {
        await updateTask({
          id: task._id,
          formData,
        }).unwrap();

      } else {
        await createTask(formData).unwrap();
      }

      toast.success(
        task ? "Task Updated Successfully!" : "Task Added Successfully!"
      );

      setOpen(false)

      reset();

      setTeam({
        members: [],
        leader: null,
      });

      setAssets([]);

      setStage(LISTS[0]);
      setPriority(PRIORITY[2]);

    } catch (err) {
      console.log(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  // Cleanup Effect
  useEffect(() => {
    return () => {
      assets.forEach((item) => {
        if (!item.isExisting && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [assets]);

  const MAX_FILES = 10;
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);

    const remainingSlots = MAX_FILES - assets.length;

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more images`);
      return;
    }

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed");
      return;
    }

    const validFiles = imageFiles.filter(
      (file) => file.size <= MAX_SIZE
    );

    if (validFiles.length !== imageFiles.length) {
      toast.error("Each image must be less than 2MB");
      return;
    }

    const newAssets = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));

    setAssets((prev) => [...prev, ...newAssets]);
  };

  // ✅ Load existing images on edit from task.assets URLs in Cloudinary (no file objects, just URLs)
  useEffect(() => {
    if (open) {
      if (task?.assets?.length) {
        const existingAssets = task.assets.map((item) => ({
          preview: item.url,
          public_id: item.public_id,
          isExisting: true,
        }));

        setAssets(existingAssets);
      } else {
        setAssets([]);
      }
    }
  }, [open, task]);


  const handleRemoveImage = (e, index) => {
    e.stopPropagation();

    setAssets((prev) => {
      const updated = [...prev];

      const removed = updated[index];

      if (!removed.isExisting) {
        URL.revokeObjectURL(removed.preview);
      }

      updated.splice(index, 1);

      return updated;
    });
  };

  const today = new Date();
  const safeToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <AnimatePresence>
          <motion.form 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit(handleOnSubmit, handleFormError)}
          >
            <Dialog.Title
              as='h2'
              className={`text-base font-bold leading-6 ${LightMode ? "text-black" : "text-white"} mb-4 transition-colors duration-300 ease-in-out`}
            >
              {task ? "UPDATE TASK" : "ADD TASK"}
            </Dialog.Title>

            <div className='mt-2 flex flex-col gap-6'>
              <Textbox
                placeholder='Task title'
                type='text'
                name='title'
                label='Task Title'
                  className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                  errors.title
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <Textbox
                placeholder='Client Name'
                type='text'
                name='clientName'
                label='Client Name'
                  className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                  errors.clientName
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                register={register("clientName", {
                  required: "client name is required!",
                })}
                error={errors.clientName ? errors.clientName.message : ""}
              />

              <Textbox
                placeholder='Location'
                type='text'
                name='address'
                label='Location'
                  className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                  errors.address
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
                register={register("address", {
                  required: "Address is required!",
                })}
                error={errors.address ? errors.address.message : ""}
              />

              <UserList setTeam={setTeam} team={team} />

              <div className='flex gap-4'>
                <SelectList
                  label='Task Stage'
                  lists={LISTS}
                  selected={stage}
                  setSelected={setStage}
                />
                <SelectList
                  label='Priority Level'
                  lists={PRIORITY}
                  selected={priority}
                  setSelected={setPriority}
                />
              </div>
              <div className='flex gap-4'>
                <div className='w-full'>
                  <Textbox
                    placeholder="Select Date"
                    type="date"
                    name="date"
                    label="Task Date"
                    minDate={safeToday}
                    showTime={false}
                    control={control}
                    rules={{ required: "Date is required!" }}
                    error={errors.date ? errors.date.message : ""}
                  />
                </div>
                <div className={`
                    ${LightMode
                      ? "text-black"
                      : "text-white"
                    }
                    w-full flex items-center justify-center -mt-2
                  `}>
                  <label
                    className='flex flex-col items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                    htmlFor='imgUpload'
                  >
                    {assets.length === 0 
                      ?
                      <div className="flex flex-col items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 hover:text-blue-600 transition-all duration-200 ease-in-out cursor-pointer">
                      <input
                        type='file'
                        className='hidden'
                        id='imgUpload'
                        onChange={(e) => handleSelect(e)}
                        accept='.jpg, .png, .jpeg'
                        multiple={true}
                      />
                      <span className="text-center">
                        <span className="flex items-center justify-center">
                          <BiImages className="text-lg"/>
                        </span>
                        <span>Add Assets</span>
                        <p className="text-xs text-gray-400 text-center">
                          Max 5 images • Max 2MB each • JPG, PNG
                        </p>
                      </span>
                      </div>
                      :
                      <div onClick={(e) => e.stopPropagation()}>
                        {/* Preview Grid */}
                        <div className="flex flex-wrap justify-center items-center mt-2">
                          {assets.map((file, index) => (
                            <div 
                              key={index}
                              className="relative transition-all duration-300 ease-in-out hover:scale-125 hover:z-50 mb-2 -ml-2"
                            >
                              <img
                                src={file.preview}
                                alt="preview"
                                className={`${LightMode ? "shadow-darkSM border-amber-400" : "shadow-lightSM border-white"} w-10 h-10 border rounded-full object-cover shadow transition-all duration-300 ease-in-out `}
                              />

                              <span
                                onClick={(e) => handleRemoveImage(e, index)}
                                className="absolute -bottom-2 right-2.5 font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs"
                              >
                                ✕
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Selected count */}
                        {assets.length > 0 && (
                          <p className={`${LightMode ? "text-gray-500" : "text-gray-300"} mb-1 text-sm mt-0.5 text-center`}>
                            {`${assets.length} ${assets.length >= 2 ? "images selected" : "image selected"}`}
                          </p>
                        )}
                      </div>
                    }
                  </label>
                </div>
              </div>

              <div className='w-full -mt-4'>
                <p className={`
                  ${LightMode 
                    ? "text-black" 
                    : "text-white"
                  }
                  transition-colors duration-300 ease-in-out
                `}>Task Description</p>
                <textarea
                  name='description'
                  {...register("description", {
                    required: "Description is required!",
                  })}
                  className={`
                    ${LightMode 
                      ? "text-black border-gray-300 placeholder-gray-300"
                      : "text-white border-gray-400 placeholder-gray-400"
                    }
                    ${
                      errors.description
                        ? `border-2 border-red-500 focus:border-red-500 ${
                            shake ? "animate-shake" : ""
                          }`
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }
                    w-full bg-transparent px-3 py-1.5 2xl:py-3 border  rounded-md outline-0
                    outline-none focus:ring-2
                    ring-blue-300 transition-colors duration-300 ease-in-out
                  `}
                  
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-[12px] italic">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className='w-full'>
                <p className={`
                    ${LightMode 
                      ? "text-black"
                      : "text-white"
                    } 
                    transition-colors duration-300 ease-in-out
                  `}>
                  
                  <span className=''>
                    Important Equipments
                  </span>
                </p>
                <textarea
                  name='equipments'
                  {...register("equipments", {
                    required: "Important Equipments is required!",
                  })}
                  className={`
                    ${LightMode 
                      ? "text-black border-gray-300 placeholder-gray-300"
                      : "text-white border-gray-400 placeholder-gray-400"
                    }
                    ${
                      errors.equipments
                        ? `border-2 border-red-500 focus:border-red-500 ${
                            shake ? "animate-shake" : ""
                          }`
                        : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }
                    w-full bg-transparent px-3 py-1.5 2xl:py-3 border  rounded-md outline-0
                    outline-none focus:ring-2
                    ring-blue-300 transition-colors duration-300 ease-in-out
                  `}
                ></textarea>
                {errors.equipments && (
                  <p className="text-red-500 text-[12px] italic">
                    {errors.equipments.message}
                  </p>
                )}
              </div>
            </div>

            {isLoading || isUpdating || uploading ? (
              <div className='py-4'>
                <Loading />
              </div>
            ) : (
              <div className=' mt-6 mb-4 flex sm:flex-row-reverse gap-4'>
                <Button
                  label='Submit'
                  type='submit'
                  disable={isLoading || isUpdating}
                  className='ClickAnimationNoti bg-blue-600 px-5 shadow-inner hover:shadow-innerWH transition-colors duration-200 ease-in-out text-sm rounded-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                />

                <Button
                  type='button'
                  className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto shadow-inner hover:scale-105 transition-all duration-150 ease-in-out'
                  onClick={() => setOpen(false)}
                  label='Cancel'
                />
              </div>
            )}
          </motion.form>
        </AnimatePresence>
      </ModalWrapper>
    </>
  );
};

export default AddTask;








