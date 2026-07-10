import { Dialog } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setCPEditPopUp } from "../redux/slices/authSlice";

import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";
import { BiImageAdd } from "react-icons/bi";
import { RefreshCw } from "lucide-react"
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import Button from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

const AddUser = ({ open, setOpen, userData }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  
  let defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });


  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [shake, setShake] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false)


  const generateSpinner = () => {
    setSpinner(true);
    setTimeout(() => {
      setSpinner(false);
    }, 1000);
  }
  // Image Function
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  // Generate random password for new user
  useEffect(() => {
    if (open && !userData) {
      const generated = Math.random().toString(36).slice(-8);
      setTempPassword(generated);
    }
  }, [open, userData]);

  // Copy generated password to clipboard
  const handleCopyPassword = () => {
    if (!tempPassword) return;

    navigator.clipboard.writeText(tempPassword);
    toast.success("Password copied!");
  };

  // Reset form when opening/closing or when userData changes
  useEffect(() => {
    if (!open) return;

    if (userData && Object.keys(userData).length > 0) {
      // Editing
      reset(userData);

      setIsAdmin(userData.isAdmin || false);

      // ✅ Set preview from existing image
      if (userData.profileImage || userData.img) {
        setPreview(userData.profileImage || userData.img);
      } else {
        setPreview(null);
      }

      setImage(null); // prevent conflict with old file
    } else {
      // Creating new user
      reset({
        name: "",
        title: "",
        email: "",
        role: "",
        tiktok: "",
        whatsApp: "",
        x: "",
        telegram: "",
      });

      setIsAdmin(false)

      setImage(null);
      setPreview(null);
    }
  }, [userData, open, reset]);

  
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
    const hasAtLeastOneSocial =
      data.tiktok || data.whatsApp || data.x || data.telegram;

    if (!hasAtLeastOneSocial) {
      toast.error("Please provide at least one social link");
      triggerShake();
      return;
    }

    try {
      const formData = new FormData();

      // ✅ Append fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("title", data.title);
      formData.append("role", data.role);
      formData.append("isAdmin", isAdmin);

      if (data.tiktok) formData.append("tiktok", data.tiktok);
      if (data.whatsApp) formData.append("whatsApp", data.whatsApp);
      if (data.x) formData.append("x", data.x);
      if (data.telegram) formData.append("telegram", data.telegram);

      // ✅ Password only when creating
      if (!userData) {
        formData.append("password", tempPassword);
      }

      // ✅ Image
      if (image) {
        formData.append("profileImage", image);
      }

      let res;

      if (userData) {
        // ✅ UPDATE USER
        formData.append("_id", userData._id); // Append user ID for update

        res = await updateUser(formData).unwrap();
        if (userData) {
          if (isAdmin) {
            toast.success(`${data.name} is now an admin`);
          } else {
            toast.success(`${data.name} profile updated successfully`);
          }
        } else {
          if (isAdmin) {
            toast.success("New admin user created successfully");
          } else {
            toast.success("New User added successfully");
          }
        }

        // 🔥 If updating self, refresh redux user
        if (userData?._id === user?._id) {
          dispatch(setCredentials({ ...res?.user }));
        }
      } else {
        // ✅ CREATE USER
        res = await addNewUser(formData).unwrap();

        if (userData) {
          if (isAdmin) {
            toast.success(`${data.name} is now an admin`);
          } else {
            toast.success(`${data.name} profile updated successfully`);
          }
        } else {
          if (isAdmin) {
            toast.success("New admin user created successfully");
          } else {
            toast.success("New User added successfully");
          }
        }
      }

      setTimeout(() => {
        setOpen(false);
      }, 500);

      reset();
      setImage(null);
      setPreview(null);

    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };



  // What Admin & Employees can edit
  const isEditing = !!userData;

  const isOwnProfile = userData?._id === user?._id;

  const isEmployee = !user?.isAdmin;

  const employeeRestrictedEdit =
    isEditing && isEmployee && isOwnProfile;



  // Toggle Admin - Employee OR Employee - Admin
  const adminEmployeeToggle = () => {
    setIsAdmin(prev => !prev)
  }

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
                        loading="lazy"
                        decoding="async"
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
                disabled={employeeRestrictedEdit}
                  className={`w-full border rounded-md outline-0 ${
                  errors.title
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                }`}
                register={register("title", {
                  required: employeeRestrictedEdit
                    ? false
                    : "Title is required!",
                })}
                error={errors.title ? errors.title.message : ""}
              />

              <Textbox
                placeholder='Email Address'
                type='email'
                name='email'
                label='Email Address'
                disabled={isEditing} // Disable email field when editing
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

              {userData ? null : 
                <div>
                  <label className={`${LightMode ? "text-black" : "text-white"} text-sm`}>
                    Temporary Password
                  </label>

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempPassword}
                      readOnly
                      className="w-full border rounded-md px-3 py-2 bg-gray-200 text-gray-700 cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer`}
                    >
                      Copy
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newPass = Math.random().toString(36).slice(-8);
                        setTempPassword(newPass);
                        toast.success("New password generated");
                      }}
                      className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} hidden sm:block px-3 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 cursor-pointer`}
                    >
                      Regenerate
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        generateSpinner();
                        const newPass = Math.random().toString(36).slice(-8);
                        setTempPassword(newPass);
                        toast.success("New password generated");
                      }}
                      className={`${LightMode ? "shadow-darkSM" : "shadow-lightSM"} sm:hidden px-3 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600 cursor-pointer`}
                    >
                      <div className={`${spinner ? "animate-spin" : ""}`}>
                        <RefreshCw className="text-sm" />
                      </div>
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Share this password with the user. They will be required to change it after login.
                  </p>
                </div>
              }



              <Textbox
                placeholder='Role'
                type='text'
                name='role'
                label='Role'
                disabled={employeeRestrictedEdit}
                  className={`w-full border rounded-md outline-0 ${
                  errors.role
                    ? `border-2 border-red-500 focus:border-red-500 ${
                        shake ? "animate-shake" : ""
                      }`
                    : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                }`}
                register={register("role", {
                  required: employeeRestrictedEdit
                    ? false
                    : "User role is required!",
                })}
                error={errors.role ? errors.role.message : ""}
              />

              {user?.isAdmin && (
                <div className={`
                  ${
                    LightMode ? "text-black" : "text-white"
                  }
                  w-full
                `}>
                  <span className="">Make Admin</span>
                  <div className="w-full flex justify-start items-center gap-2">

                    <div class="checkbox-con">
                      <input 
                        id="checkbox"
                        type="checkbox"
                        className="cursor-pointer"
                        checked={isAdmin}
                        onChange={adminEmployeeToggle}
                      />
                    </div>

                    <div className="w-full flex  justify-center items-start text-[13px]">
                      
                      <motion.div
                        animate={{
                          flex: isAdmin === true ? 2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 15,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden h-10 w-full flex justify-start items-center gap-2"
                      >
                        {isAdmin === true ? (
                          <div className="flex justify-center item-center pl-2">
                            <span 
                              className="w-2.5 h-2.5 bg-green-500 mr-1 rounded-full animate-pulseOnline"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center item-center">
                            <span 
                              className="w-1.5 h-1.5 bg-red-500 ml-2 mr-3  rounded-full animate-pulseOnline"
                            />
                          </div>
                        )}
                        <span className="-ml-1">Admin</span>
                        <div className={`${isAdmin === true ? "" : "pr-8"} py-2 w-full flex justify-center items-center`}>
                          <span className={`${isAdmin === true ? "bg-linear-to-l from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-l from-red-400/10 via-red-500 to-red-400/10"} w-full h-0.5`} />
                        </div>
                      </motion.div>

                      <motion.div 
                        animate={{
                          flex: isAdmin === false ? 2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 15,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden h-10 w-full flex justify-start items-center gap-2"
                      >
                        {isAdmin  === false ? (
                          <div className="flex justify-center item-center pl-2">
                            <span 
                              className="w-2.5 h-2.5 bg-green-500 mr-1 rounded-full animate-pulseOnline"
                            />
                          </div>
                        ) : (
                          <div className="flex justify-center item-center">
                            <span 
                              className="w-1.5 h-1.5 bg-red-500 ml-2 mr-3 rounded-full animate-pulseOnline"
                            />
                          </div>
                        )}
                        <span className="-ml-1">Employee</span>
                        <div className={`${isAdmin === false ? "" : "pr-6"} py-2 w-full flex justify-center items-center pr-2`}>
                          <span className={`${isAdmin === false ? "bg-linear-to-l from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-l from-red-400/10 via-red-500 to-red-400/10"} w-full h-0.5`} />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

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
                  placeholder='Twitter / X'
                  type='text'
                  name='x'
                  label='Twitter / X'
                  className="w-full border rounded-md outline-0 border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  register={register("x")}
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
              <span className="mt-6 mb-4 flex justify-center items-center">
                <Loading />
              </span>
            ) : (
              <div className='py-3 mt-4 flex sm:flex-row-reverse gap-2'>
                <Button
                  type='submit'
                  className='gradient-bg px-8 text-sm font-semibold text-white hover:bg-blue-800  sm:w-auto shadow-inner hover:shadow-innerWH hover:scale-105 transition-all duration-150 ease-in-out'
                  label='Submit'
                />

                <Button
                  type='button'
                  className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto shadow-inner hover:scale-105 transition-all duration-150 ease-in-out'
                  onClick={(e) => { 
                    e.preventDefault();
                    setOpen(false);
                    dispatch(setCPEditPopUp(false));
                    
                    // 🔥 ADD THIS
                    reset();
                    setImage(null);
                    setPreview(null);
                  }}
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

export default AddUser;
