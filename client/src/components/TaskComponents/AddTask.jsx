import { Dialog } from "@headlessui/react";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";

// import {
//   useCreateTaskMutation,
//   useUpdateTaskMutation,
// } from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { useSelector } from "react-redux";
// import { app } from "../../utils/firebase";
import Button from "../button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import SelectList from "../SelectList";
import Textbox from "../Textbox";
import UserList from "./UserList";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const uploadedFileURLs = [];

// const uploadFile = async (file) => {
//   const storage = getStorage(app);

//   const name = new Date().getTime() + file.name;
//   const storageRef = ref(storage, name);

//   const uploadTask = uploadBytesResumable(storageRef, file);

//   return new Promise((resolve, reject) => {
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         console.log("Uploading");
//       },
//       (error) => {
//         reject(error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref)
//           .then((downloadURL) => {
//             uploadedFileURLs.push(downloadURL);
//             resolve();
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       }
//     );
//   });
// };

const AddTask = ({ open, setOpen, task }) => {
  const { LightMode } = useSelector((state) => state.auth);
  // const task = ""
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
    description: "",
    links: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [team, setTeam] = useState(task?.team || []);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );
  const [assets, setAssets] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // const [createTask, { isLoading }] = useCreateTaskMutation();
  // const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  // const URLS = task?.assets ? [...task.assets] : [];

  const handleOnSubmit = async (data) => {
    // for (const file of assets) {
    //   setUploading(true);
    //   try {
    //     await uploadFile(file);
    //   } catch (error) {
    //     console.error("Error uploading file:", error.message);
    //     return;
    //   } finally {
    //     setUploading(false);
    //   }
    // }

    // try {
    //   const newData = {
    //     ...data,
    //     assets: [...URLS, ...uploadedFileURLs],
    //     team,
    //     stage,
    //     priority,
    //   };
    //   console.log(data, newData);
    //   const res = task?._id
    //     ? await updateTask({ ...newData, _id: task._id }).unwrap()
    //     : await createTask(newData).unwrap();

    //   toast.success(res.message);

    //   setTimeout(() => {
    //     setOpen(false);
    //   }, 500);
    // } catch (err) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
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
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
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
                  placeholder='Date'
                  type='date'
                  name='date'
                  label='Task Date'
                  className='w-full rounded cursor-pointer'
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
              <div className={`
                  ${LightMode
                    ? "text-black"
                    : "text-white"
                  }
                  w-full flex items-center justify-center mt-4
                `}>
                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                  htmlFor='imgUpload'
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgUpload'
                    onChange={(e) => handleSelect(e)}
                    accept='.jpg, .png, .jpeg'
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className='w-full'>
              <p className={`
                ${LightMode 
                  ? "text-black" 
                  : "text-white"
                }
                transition-colors duration-300 ease-in-out
              `}>Task Description</p>
              <textarea
                name='description'
                {...register("description")}
                className={`
                  ${LightMode 
                    ? "text-black border-gray-300 placeholder-gray-300"
                    : "text-white border-gray-400 placeholder-gray-400"
                  }
                  w-full bg-transparent px-3 py-1.5 2xl:py-3 border 
                  outline-none focus:ring-2
                  ring-blue-300 transition-colors duration-300 ease-in-out
                `}
              ></textarea>
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
                {/* <span className='text-xs pl-5 text-center'>
                  separated by comma (,)
                </span> */}
              </p>
              <textarea
                name='links'
                {...register("links")}
                className={`
                  ${LightMode 
                    ? "text-black border-gray-300 placeholder-gray-300"
                    : "text-white border-gray-400 placeholder-gray-400"
                  }
                  w-full bg-transparent px-3 py-1.5 2xl:py-3 border 
                  outline-none focus:ring-2
                  ring-blue-300 transition-colors duration-300 ease-in-out
                `}
              ></textarea>
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
                className='ClickAnimationNoti bg-blue-600 px-5 shadow-inner hover:shadow-innerWH transition-colors duration-200 ease-in-out text-sm rounded-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
              />

              <Button
                type='button'
                className={`
                    ${LightMode 
                    ? "bg-black/80 text-white shadow-innerWH hover:shadow-inner" 
                    : "bg-white text-black shadow-inner hover:shadow-innerWH"
                  } px-5 text-sm font-semibold sm:w-auto  transition-all active:scale-90 duration-300 ease-in-out
                `}
                onClick={() => setOpen(false)}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
