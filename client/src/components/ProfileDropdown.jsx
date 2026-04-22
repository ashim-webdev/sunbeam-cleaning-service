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
import { FaUsers, FaCalendarCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"
import { setLightMode } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar, setOpenProfile } from "../redux/slices/authSlice";


import { cn } from "@/lib/utils";
import { getInitials } from "../utils";
import Dark_Light_Btn from "./Dark_Light_Btn";
import img2 from "../img/m2.jpg"

// ✅ Sample data (you can replace later with real user)
const SAMPLE_PROFILE_DATA = {
  name: "Ashimonye Gabriel",
  email: "ashimgab@gmail.com",
  avatar: img2,
  isActive: true,
  mode: <Dark_Light_Btn />,
};

export default function ProfileDropdown({ data = SAMPLE_PROFILE_DATA, className }) {
  const { LightMode, isProfileOpen }  = useSelector((state) => state.auth);
  const [chevronIcon, setChevronIcon] = useState(false);


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
      href: "#",
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
      href: "#",
      onClick: settingsIconToggle,
      icon: <Settings className="h-4 w-4" />,
      value: chevronIcon ? <ChevronDown className="h-5 w-5 " /> : <ChevronUp className="h-5 w-5 " />,
    },
    {
      _id: 4,
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="h-4 w-4" />,
    },
  ];


  const settingsMenu = [
      {
      label: "Change Password",
      link: "trashed",
      icon: <Lock className="h-4 w-4" />,
    },
    {
      label: "Edit Profile",
      link: "tasks",
      icon: <UserPen className="h-4 w-4" />,
    },
  ];


    // Settings Menu 
    const navigate = useNavigate()
  
    const SIDEBAR_ANIMATION_MS = 200;
  
    const handleNavClick = (path) => {
      dispatch(setOpenSidebar(false)); // start slide-out
      setTimeout(() => {
        navigate(`/${path}`);
      }, SIDEBAR_ANIMATION_MS);
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
                  flex justify-between items-center gap-6 rounded-2xl border  outline-0  w-full p-3 transition-all duration-300 ease-in-out cursor-pointer 
                `}
            >
              <div className="text-left">
                <div className="font-medium text-sm">
                  {data.name}
                </div>
                <div className="text-xs">
                  {data.email}
                </div>
              </div>
              
              <div className={`outline-0 border-2 ${data.isActive ? "border-green-600" : "border-red-600"} w-11 h-11 2xl:w-13 2xl:h-13 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-300 shadow-inner overflow-hidden`}>
                <span className='text-white font-semibold '>
                  {data.avatar ? 
                    <img
                      src={data.avatar}
                      alt={data.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  :
                    <span>
                      {getInitials(data.name)}
                    </span>
                  }
                </span>
              </div>              
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
          
          <div className="flex justify-center absolute bottom-20 right-0 left-0">
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                  onMouseOver={(e) => e.stopPropagation()}
                  className={`${LightMode ? "bg-white" : "bg-black/90"} w-64 z-200 rounded-2xl border p-2 shadow-xl overflow-visible`}
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
                            dispatch(setOpenProfile(false));
                          }
                        }}
                        className={`
                          ${LightMode ? "text-black focus:bg-[#0004fc4e] hover:bg-[#0004fc4e]" : "text-white focus:text-black focus:bg-white hover:text-black hover:bg-white"} rounded-xl transition-all duration-300 ease-in-out`
                        }>
                        <div
                          onClick={item?.onClick}
                          className={`${LightMode ? "hover:shadow-darkSM" : "hover:shadow-blueSM"} flex items-center justify-between py-2 px-4 rounded-xl cursor-pointer transition-all duration-300 ease-in-out `}
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
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.3 }}
                                onMouseOver={(e) => e.stopPropagation()} 
                                className={`
                                  ${LightMode 
                                    ? "bg-white/90 text-black shadow-darkSM"
                                    : "bg-black/95 text-white shadow-lightSM"
                                  }
                                  absolute bottom-3.5 -right-20 w-fit z-90 mt-3 flex flex-col justify-center items-center gap-2 rounded p-2 cursor-pointer
                                `}
                                >
                                {settingsMenu.map((el) => (
                                  <div
                                    key={el.label}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNavClick(el.link);
                                      dispatch(setOpenProfile(false));
                                    }}
                                    className={clsx(
                                      "ClickAnimationNoti w-full flex gap-2 px-5 py-1.25 rounded-xl items-center text-base cursor-pointer transition-colors ease-in-out duration-300 ",
                                      
                                      path === el.link.split("/")[0] ? `ClickAnimationNoti transition-colors ease-in-out bg-[#005FFB] text-white duration-75 
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
                      <button className={`${LightMode ? "hover:shadow-darkSM" : "hover:shadow-light"} flex items-center gap-2 w-full py-2 pl-6 pr-4 rounded-xl bg-red-100 text-red-600 hover:bg-red-300 hover:text-red-600 focus:bg-red-300 focus:text-red-600 cursor-pointer`}>
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
  );
}




















