import { Dialog } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { BiImageAdd } from "react-icons/bi";
// import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
// import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
// import { setCredentials } from "../redux/slices/authSlice";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

const AddUser = ({ open, setOpen, userData }) => {
  const { LightMode } = useSelector((state) => state.auth);
  
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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Image Function
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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
    if (formErrors.name && formErrors.title && formErrors.email && formErrors.role) {
      toast.error("Please fill in all required fields");
      triggerShake()
    } else if (formErrors.name) {
      toast.error("Full Name is required");
      triggerShake()
    } else if (formErrors.title) {
      toast.error("Title is required");
      triggerShake()
    } else if (formErrors.email) {
      toast.error("Email is required");
      triggerShake()
    } else if (formErrors.role) {
      toast.error("User role is required");
      triggerShake()
    }
  };

  const handleOnSubmit = async (data) => {
    const fullData = {
      ...data,
      profileImage: image,
    };

    console.log(fullData)
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
    setImage(null);
    setPreview(null)
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit, handleFormError)} className=''>
          <Dialog.Title
            as='h2'
            className={`
                ${
                  LightMode ? "text-black" : "text-white"
                }
                text-base font-bold leading-6 mb-4
              `}
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>

            <div className="flex justify-center items-center">
              <label htmlFor="profileUpload" className="cursor-pointer">
                <div className={`
                    ${
                      LightMode ? "shadow-darkSM" : "shadow-lightSM"
                    }
                    w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-300 ease-in-out
                  `}>
                  
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 text-center px-2">
                      <BiImageAdd className="text-2xl text-gray-400" />
                    </span>
                  )}

                </div>

                <input
                  type="file"
                  id="profileUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
                className={`w-full border rounded-md outline-0 ${
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
                className={`w-full border rounded-md outline-0 ${
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
                className={`w-full border rounded-md outline-0 ${
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
                className={`w-full border rounded-md outline-0 ${
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

            <div className="flex justify-center items-center gap-2">
              <Textbox
                placeholder='Tiktok'
                type='text'
                name='tiktok'
                label='Tiktok'
                className="w-full border rounded-md outline-0 border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                register={register("tiktok")}
              />

              <Textbox
                placeholder='WhatsApp'
                type='text'
                name='whatsApp'
                label='whatsApp'
                className="w-full border rounded-md outline-0 border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                register={register("whatsApp")}
              />
            </div>

            <div className="flex justify-center items-center gap-2">
              <Textbox
                placeholder='YouTube'
                type='text'
                name='youtube'
                label='YouTube'
                className="w-full border rounded-md outline-0 border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                register={register("youtube")}
              />

              <Textbox
                placeholder='Telegram'
                type='text'
                name='telegram'
                label='Telegram'
                className="w-full border rounded-md outline-0 border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                register={register("telegram")}
              />
            </div>

          </div>

          {isLoading || isUpdating ? (
            <Loading />
          ) : (
            <div className='py-3 mt-4 flex sm:flex-row-reverse gap-2'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto shadow-inner hover:shadow-innerWH hover:scale-105 transition-all duration-150 ease-in-out'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto shadow-inner hover:scale-105 transition-all duration-150 ease-in-out'
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
