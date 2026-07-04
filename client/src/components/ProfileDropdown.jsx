import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  FileText,
  LogOut,
  Settings,
  User,
  Sun,
  Moon,
  ChevronUp,
  ChevronDown,
  Lock,
  UserPen
} from "lucide-react";
import { FaCrown } from "react-icons/fa";
import { FaUsers, FaCalendarCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"
import { setLightMode } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {useGetUserProfileQuery} from "../redux/slices/api/userApiSlice"
import { setOpenSidebar, setOpenProfile, setCPEditPopUp, setCPChangePasswordPopUp } from "../redux/slices/authSlice";
import { apiSlice } from "@/redux/slices/apiSlice";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";



import { cn } from "@/lib/utils";
import { getInitials } from "../utils";
import Dark_Light_Btn from "./Dark_Light_Btn";
import ChangePassword from "./ChangePassword";
import ConfirmationDialog from "./ConfirmationDialog";



const LoadingCircle = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <div className='w-full py-3 flex items-center justify-center'>
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
    </div>
  )
}


export default function ProfileDropdown({ className }) {
  const { LightMode, isProfileOpen }  = useSelector((state) => state.auth);
  const [chevronIcon, setChevronIcon] = useState(false);
  const [activeSetting, setActiveSetting] = useState(null);

  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("logout");
  const [openDialog, setOpenDialog] = useState(false);

  // console.log(CPEditPopUp)
  const { user: storedUser } = useSelector((state) => state.auth);
  const { data: freshUser, isLoading } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const user = freshUser ?? storedUser;


  // LogOut
  const [logoutUser, {isLoading: logoutIsLoading}] = useLogoutMutation();


  const deleteAllClick = () => {
    setType("logout");
    setMsg("Are you sure you want to logout ???");
    setOpenDialog(true);
  };


  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());

      // Reset the API state to clear any cached data
      dispatch(apiSlice.util.resetApiState());

      navigate("/log-in");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };



  const USER_DETAILS = {
  name: user?.name,
  email: user?.email,
  avatar: user?.profileImage,
  isActive: user?.isActive,
  isAdmin: user?.isAdmin,
  mode: <Dark_Light_Btn />,
};

  const data = USER_DETAILS


  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];


  const modeChange = () => {
    dispatch(setLightMode());
  };

  const settingsIconToggle = () => {
    setChevronIcon(prev => !prev)
  }


  const menuItems = [
    { 
      _id: 1,
      label: "Profile",
      link: "profile",
      icon: <User className="h-4 w-4" />,
    },
    {
      _id: 2,
      label: LightMode ? "LightMode" : "DarkMode",
      value: data.mode,
      onClick: modeChange,
      icon: LightMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-[#2936e7]" />,
    },
    {
      _id: 3,
      label: "Settings",
      onClick: settingsIconToggle,
      icon: <Settings className="h-4 w-4" />,
      value: chevronIcon ? <ChevronUp className="h-5 w-5 " /> : <ChevronDown className="h-5 w-5 " />,
    },
    {
      _id: 4,
      label: "Terms & Policies",
      link: "terms&policies",
      icon: <FileText className="h-4 w-4" />,
    },
  ];


  const settingsMenu = [
    {
      id: "change-password",
      label: "Change Password",
      link: "Profile",
      icon: <Lock className="h-4 w-4" />,
    },
    {
      id: "edit-profile",
      label: "Edit Profile",
      link: "Profile",
      icon: <UserPen className="h-4 w-4" />,
    },
  ];


    // Settings Menu 
    const navigate = useNavigate()
    
    const handleNavClick = (path) => {
      dispatch(setOpenSidebar(false)); // start slide-out
      navigate(`/${path}`);
    };
    // End


  useEffect(() => {
    if (isProfileOpen === false) {
      setChevronIcon(false)
    }

    const handleResize = () => {
      dispatch(setOpenProfile(false));
      setChevronIcon(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close ChevronIcon Menu
  useEffect(() => {
    if (isProfileOpen === false) {
      setChevronIcon(false)
    }
  }, [isProfileOpen]);



  return (
    <>
      <div className={cn("relative w-full", className)}>
        <div>
          <div className="group relative">
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setOpenProfile(!isProfileOpen))
                }}
                className={`
                    ${LightMode 
                      ? "bg-white text-black hover:bg-zinc-50 border-zinc-200"
                      : "bg-black/90 text-white hover:bg-black/95 border-zinc-500"
                    }
                    ScaleChange flex justify-between items-center gap-6 rounded-2xl border outline-0 w-full p-3 transition-all duration-300 ease-in-out cursor-pointer 
                  `}
              >
                <div className="text-left">
                  <div className="font-medium text-sm whitespace-nowrap">
                    {data.name}
                  </div>
                  <div className="text-xs whitespace-nowrap">
                    {data.email.length > 15
                      ? `${data.email.slice(0, 15)}...`
                      : data.email}
                  </div>
                </div>
                
                {isLoading ? (
                  <LoadingCircle />
                ) : (
                  <div className="relative">
                    <div className={`outline-0 border-2 ${data.isActive ? "border-green-600" : "border-red-600"} w-11 h-11 2xl:w-13 2xl:h-13 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-300 shadow-inner overflow-hidden`}>
                      <span className='text-white font-semibold '>
                        {data.avatar ? 
                          <img
                            src={data.avatar}
                            alt={data.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full rounded-full object-cover"
                          />
                        :
                          <span>
                            {getInitials(data?.name || "Unknown User")}
                          </span>
                        }
                      </span>
                    </div> 

                    {data?.isAdmin && (
                      <span className="absolute -top-3 rotate-25 right-0">
                        <FaCrown className="text-yellow-500 text-lg"/>
                      </span>
                    )}
                  </div>             
                )}
              </button>
            </div>

            {/* Indicator */}
            <div
              className={cn(
                "absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200 ease-in-out",
                isProfileOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
              )}
            >
              <div className="text-blue-400 text-2xl font-bold">{")"}</div>
            </div>
            
            <div className="flex justify-center absolute bottom-20 right-0 left-0 ">
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.3 }}
                    onMouseOver={(e) => e.stopPropagation()}
                    className={`${LightMode ? "bg-white" : "bg-black/90"} w-64 z-100 rounded-2xl border p-2 shadow-xl overflow-visible`}
                  >
                    <div className="space-y-1">
                      {menuItems.map((item) => (
                        <div 
                          asChild 
                          key={item._id} 
                          onClick={(e) => {
                            if (item._id === 2 || item._id === 3) {
                              e.preventDefault();
                            } else {
                              handleNavClick(item?.link)
                              dispatch(setOpenProfile(false));
                            }
                          }}
                          className={`
                            ${LightMode ? "text-black focus:bg-[#0004fc4e] hover:bg-[#0004fc4e]" : "text-white focus:text-black focus:bg-white hover:text-black hover:bg-white"} rounded-xl active:scale-95 transition-all duration-300 ease-in-out`
                          }>
                          <div
                            onClick={item?.onClick}
                            className={`${LightMode ? "hover:shadow-darkSM" : "hover:shadow-blueSM"} relative flex items-center justify-between py-2 px-4 rounded-xl cursor-pointer transition-all duration-300 ease-in-out `}
                          >
                            <div className="flex items-center gap-2 cursor-pointer">
                              {item.icon}
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>

                            {item.value && (
                              <span className="cursor-pointer">
                                {item.value}
                              </span>
                            )}


                            <AnimatePresence>
                              {chevronIcon && item._id === 3 &&  (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  transition={{ duration: 0.3 }}
                                  onMouseOver={(e) => e.stopPropagation()} 
                                  className={`
                                    ${LightMode 
                                      ? "bg-white/90 text-black shadow-darkSM"
                                      : "bg-black/95 text-white shadow-lightSM"
                                    }
                                    absolute -top-28.5 -right-20 w-fit z-90 mt-3 flex flex-col justify-center items-center gap-2 rounded p-2 cursor-pointer
                                  `}
                                  >
                                  {settingsMenu.map((el) => (
                                    <div
                                      key={el.label}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation()

                                        setActiveSetting(el.id);
                                        
                                        dispatch(setOpenProfile(false));
                                        
                                        if (el?.label === "Edit Profile") {
                                          handleNavClick(el?.link);
                                          setTimeout(() => {
                                            dispatch(setCPEditPopUp(true));
                                          }, 100);
                                        } else if (el?.label === "Change Password") {
                                          handleNavClick(el?.link);
                                          setTimeout(() => {
                                            dispatch(setCPChangePasswordPopUp(true));
                                          }, 100);
                                        }
                                      }}
                                      className={clsx(
                                        "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-xl items-center text-base cursor-pointer transition-colors ease-in-out duration-300 ",
                                        
                                        activeSetting === el.id ? `ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75 
                                        ${LightMode ? "shadow-darkSM" : "shadow-blueSM"}`
                                        :
                                        `transition-colors ease-in-out duration-75 
                                        ${LightMode ? "hover:shadow-darkSM hover:bg-[#0004fc4e] hover:text-black" : "hover:shadow-blueSM hover:bg-white hover:text-black"}`
                                      )}
                                    >
                                      {el.icon}
                                      <span className='whitespace-nowrap'>{el.label}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 my-3" />

                    <div asChild className="relative text-red-600">
                      <>
                        <button 
                        onClick={deleteAllClick}
                        className={`
                          ${LightMode ? "hover:shadow-darkSM" : "hover:shadow-light"} flex items-center gap-2 w-full py-2 pl-6 pr-4 rounded-xl active:scale-95 transition-all duration-300 ease-in-out bg-red-100 text-red-600 hover:bg-red-300 hover:text-red-600 focus:bg-red-300 focus:text-red-600 cursor-pointer`
                        }>
                          <LogOut className="h-4 w-4 " />
                          Log Out
                        </button>
                      </>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isLoading={logoutIsLoading}
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={logoutHandler}
      />
    </>
  );
}