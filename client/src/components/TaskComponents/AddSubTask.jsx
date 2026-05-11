import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

// import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";

const AddSubTask = ({ open, setOpen, id }) => {
  const { LightMode } = useSelector((state) => state.auth);
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const [addSbTask, { isLoading }] = useCreateSubTaskMutation();
  const [isLoading, setIsLoading] = useState(false)
  const [shake, setShake] = useState(false);

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
    if (formErrors.title && formErrors.date && formErrors.tag) {
      toast.error("Please fill in all required fields");
      triggerShake()
    } else if (formErrors.title) {
      toast.error("Title field is required");
      triggerShake()
    } else if (formErrors.date) {
      toast.error("Date field is required");
      triggerShake()
    } else if (formErrors.tag) {
      toast.error("Tag field is required");
      triggerShake()
    }
  };

  const handleOnSubmit = async (data) => {
    // try {
    //   const res = await addSbTask({ data, id }).unwrap();

    //   toast.success(res.message);

    //   setTimeout(() => {
    //     setOpen(false);
    //   }, 500);
    // } catch (err) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }

    toast.success(task ? "Task Updated Successfully!" : "Task Added Successfully!");

    setTimeout(() => {
      setOpen(false);
    }, 800);

    reset();
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
            className=''
            >
            <Dialog.Title
              as='h2'
              className={`${LightMode ? "text-black" : "text-white"} text-base font-bold leading-6 mb-4`}
            >
              ADD SUB-TASK
            </Dialog.Title>
            <div className='mt-2 flex flex-col gap-6'>
              <Textbox
                placeholder='Sub-Task title'
                type='text'
                name='title'
                label='Title'
                className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                    errors.title
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  rules={{ required: "title is required!" }}
                  register={register("title", {
                    required: "Title is required!",
                  })}
                  error={errors.title ? errors.title.message : ""}
              />

              <div className='flex items-center gap-4'>
                <Textbox
                  placeholder="Select Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  minDate={safeToday}
                  control={control}
                  showTime={false}
                  className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                    errors.date
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  rules={{ required: "Date is required!" }}
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
                <Textbox
                  placeholder='Tag'
                  type='text'
                  name='tag'
                  label='Tag'
                  className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                    errors.tag
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  rules={{ required: "Tag is required!" }}
                  register={register("tag", {
                    required: "Tag is required!",
                  })}
                  error={errors.tag ? errors.tag.message : ""}
                />
              </div>
            </div>
            {isLoading ? (
              <div className='mt-8'>
                <Loading />
              </div>
            ) : (
              <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
                <Button
                  type='submit'
                  className='ClickAnimationNoti shadow-inner hover:shadow-innerWH transition-colors duration-200 ease-in-out bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto'
                  label='Add Task'
                />

                <Button
                  type='button'
                  className='shadow-innerWH hover:shadow-inner transition-transform active:scale-90 duration-200 ease-in-out bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
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

export default AddSubTask;
