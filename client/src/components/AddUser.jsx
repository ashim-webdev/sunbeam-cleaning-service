import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
// import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
// import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
// import { setCredentials } from "../redux/slices/authSlice";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

const AddUser = ({ open, setOpen, userData }) => {
  let defaultValues = userData ?? {};
  // const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // const dispatch = useDispatch();

  // const [addNewUser, { isLoading }] = useRegisterMutation();
  // const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleFormError = () => {    
    if (errors.name && errors.title && errors.email && errors.role) {
      toast.error("Please fill in all required fields");
      triggerShake()
    } else if (errors.name) {
      toast.error("Full Name is required");
      triggerShake()
    } else if (errors.title) {
      toast.error("Title is required");
      triggerShake()
    } else if (errors.email) {
      toast.error("Email is required");
      triggerShake()
    } else if (errors.role) {
      toast.error("User role is required");
      triggerShake()
    }
  };

  const handleOnSubmit = async () => {
    // try {
    //   if (userData) {
    //     const res = await updateUser(data).unwrap();
    //     toast.success(res?.message);
    //     if (userData?._id === user?._id) {
    //       dispatch(setCredentials({ ...res?.user }));
    //     }
    //   } else {
    //     const res = await addNewUser({
    //       ...data,
    //       password: data?.email,
    //     }).unwrap();
    //     toast.success("New User added successfully");
    //   }

    //   setTimeout(() => {
    //     setOpen(false);
    //   }, 1500);
    // } catch (err) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }


    toast.success("User Created Successfully!");

    setTimeout(() => {
      setOpen(false);
    }, 800);

    reset();
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit, handleFormError)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
                className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                errors.name
                  ? `border-2 border-red-500 focus:border-red-500 ${
                      shake ? "animate-shake" : ""
                    }`
                  : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              }`}
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />

            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
                className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                errors.title
                  ? `border-2 border-red-500 focus:border-red-500 ${
                      shake ? "animate-shake" : ""
                    }`
                  : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              }`}
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
                className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                errors.email
                  ? `border-2 border-red-500 focus:border-red-500 ${
                      shake ? "animate-shake" : ""
                    }`
                  : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              }`}
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />


            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
                className={`w-full border rounded-md outline-0 transition-all duration-200 ${
                errors.role
                  ? `border-2 border-red-500 focus:border-red-500 ${
                      shake ? "animate-shake" : ""
                    }`
                  : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              }`}
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 flex sm:flex-row-reverse gap-2'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto shadow-inner hover:shadow-innerWH hover:scale-105 transition-all duration-150 ease-in-out'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto shadow-inner hover:shadow-innerWH hover:scale-105 transition-all duration-150 ease-in-out'
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

export default AddUser;
