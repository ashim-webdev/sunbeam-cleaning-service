import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";
import { useSelector } from "react-redux";
import { useChangePasswordMutation } from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";

const ChangePassword = ({ open, setOpen }) => {
  const { LightMode } = useSelector((state) => state.auth);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [changeUserPassword, { isLoading }] = useChangePasswordMutation();
  
  const [shake, setShake] = useState(false);
  const [passwordShowOld, setPasswordShowOld] = useState(false)
  const [passwordShowNew, setPasswordShowNew] = useState(false)
  const [passwordShowChange, setPasswordShowChange] = useState(false)
  

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
    triggerShake();

    if (
      formErrors.oldPassword &&
      formErrors.newPassword &&
      formErrors.cPass
    ) {
      toast.error("Please fill in all required fields");
    } else if (formErrors.oldPassword) {
      toast.error("Old password field is required");
    } else if (formErrors.newPassword) {
      toast.error("New password field is required");
    } else if (formErrors.cPass) {
      toast.error("Confirm password field is required");
    }
  };



  const handleOnSubmit = async (data) => {
    if (data.newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters");
      triggerShake();
      return;
    }

    if (data.newPassword !== data.cPass) {
      toast.warning("Passwords do not match");
      triggerShake();
      return;
    }

    try {
      const res = await changeUserPassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success(res?.message || "Password changed successfully");

      reset();

      setTimeout(() => {
        setOpen(false);
      }, 1200);

    } catch (err) {
      console.log(err);

      toast.error(err?.data?.message || err.error);
      triggerShake();
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit, handleFormError)} className=''>
          <Dialog.Title
            as='h2'
            className={`${LightMode ? "text-black" : "text-white"} text-base font-bold leading-6 mb-4`}
          >
            Change Password
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <div className="relative">
              <Textbox
                placeholder='Old Password'
                type={`${passwordShowOld ? "text" : "password"}`}
                name='oldPassword'
                label='Old Password'
                className={`
                  w-full rounded
                  ${
                    errors.oldPassword
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                `}
                register={register("oldPassword", {
                  required: "Old password is required!",
                })}
                error={errors.oldPassword ? errors.oldPassword.message : ""}
              />

              <span onClick={(e) => {
                  e.stopPropagation()
                  setPasswordShowOld(prev => !prev);
                }} 
                className={`${shake ? "animate-shake" : ""} ClickAnimationNoti absolute top-9 right-5 cursor-pointer transition-transform ease-in-out duration-200`}
              >
                { passwordShowOld
                  ?
                  <i className="fa-solid fa-eye text-[#0049E5] hover:text-[#0547d5]"></i>
                  :
                  <i className="fa-solid fa-eye-slash text-gray-400 hover:text-gray-500"></i>
                }
              </span>
            </div>

            <div className="relative">
              <Textbox
                placeholder='New Password'
                type={`${passwordShowNew ? "text" : "password"}`}
                name='newPassword'
                label='New Password'
                className={`
                  w-full rounded
                  ${
                    errors.newPassword
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                `}
                register={register("newPassword", {
                  required: "New password is required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.newPassword ? errors.newPassword.message : ""}
              />

              <span onClick={(e) => {
                  e.stopPropagation()
                  setPasswordShowNew(prev => !prev);
                }} 
                className={`${shake ? "animate-shake" : ""} ClickAnimationNoti absolute top-9 right-5 cursor-pointer transition-transform ease-in-out duration-200`}
              >
                { passwordShowNew
                  ?
                  <i className="fa-solid fa-eye text-[#0049E5] hover:text-[#0547d5]"></i>
                  :
                  <i className="fa-solid fa-eye-slash text-gray-400 hover:text-gray-500"></i>
                }
              </span>
            </div>

            <div className="relative">
              <Textbox
                placeholder='Confirm New Password'
                type={`${passwordShowChange ? "text" : "password"}`}
                name='cPass'
                label='Confirm New Password'
                className={`
                  w-full rounded
                  ${
                    errors.cPass
                      ? `border-2 border-red-500 focus:border-red-500 ${
                          shake ? "animate-shake" : ""
                        }`
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                `}
                register={register("cPass", {
                  required: "Confirm new password is required!",
                })}
                error={errors.cPass ? errors.cPass.message : ""}
              />

              <span onClick={(e) => {
                  e.stopPropagation()
                  setPasswordShowChange(prev => !prev);
                }} 
                className={`${shake ? "animate-shake" : ""} ClickAnimationNoti absolute top-9 right-5 cursor-pointer transition-transform ease-in-out duration-200`}
              >
                { passwordShowChange
                  ?
                  <i className="fa-solid fa-eye text-[#0049E5] hover:text-[#0547d5]"></i>
                  :
                  <i className="fa-solid fa-eye-slash text-gray-400 hover:text-gray-500"></i>
                }
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 flex flex-row-reverse gap-4'>
              <Button
                type='submit'
                className='ClickAnimationNoti shadow-inner hover:shadow-innerWH transition-colors duration-200 ease-in-out bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 px-5 sm:w-auto'
                label='Save'
              />

              <Button
                type='button'
                className='shadow-innerWH hover:shadow-inner transition-transform active:scale-90 duration-200 ease-in-out bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
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

export default ChangePassword;
