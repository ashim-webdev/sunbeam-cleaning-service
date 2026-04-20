import React, { useState, useEffect } from "react";
import {
  CreditCard,
  FileText,
  LogOut,
  Settings,
  User,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLightMode } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";


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
  const { LightMode }  = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const modeChange = () => {
    dispatch(setLightMode());
  };
  
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: "Profile",
      href: "#",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: LightMode ? "LightMode" : "DarkMode",
      value: data.mode,
      onClick: modeChange,
      icon: LightMode ? <Sun className="h-4 w-4 text-yellow-400!" /> : <Moon className="h-4 w-4 text-[#2936e7]!" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Terms & Policies",
      href: "#",
      icon: <FileText className="h-4 w-4" />,
    },
  ];



  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <div className={cn("relative w-full", className)}>
      <DropdownMenu 
        open={isOpen} 
        onOpenChange={setIsOpen}
      >
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
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
              
              <div className={`outline-0 border-2 ${data.isActive ? "border-green-600" : "border-red-600"} w-11 h-11 2xl:w-13 2xl:h-13 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-200 shadow-inner overflow-hidden`}>
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
          </DropdownMenuTrigger>

          {/* Indicator */}
          <div
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 transition",
              isOpen ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <div className="text-zinc-400">{">"}</div>
          </div>
          
          <AnimatePresence>
            {isOpen && (
              <DropdownMenuContent
                forceMount
                asChild
                align="top"
                side="top"
                sideOffset={8}
                avoidCollision
                className={`${LightMode ? "bg-white" : "bg-black/90"} w-64 z-200 rounded-2xl border p-2 shadow-xl`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                  onMouseOver={(e) => e.stopPropagation()} 
                >
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <DropdownMenuItem 
                      asChild 
                      key={item.label} 
                      onSelect={(e) => {
                        if (item.label === "LightMode" || "DarkMode" && e === item.label) {
                          e.preventDefault();

                          setTimeout(() => {
                            setIsOpen(false);
                          }, 5000);
                        }
                        
                      }}
                      className={`
                        ${LightMode ? "text-black focus:bg-[#0004fc4e] hover:bg-[#0004fc4e]" : "text-white focus:bg-white hover:bg-white hover:text-black"} rounded-xl transition-all duration-300 ease-in-out`
                      }>
                      <a
                        onClick={item?.onClick}
                        href={item.href}
                        className={`${LightMode ? "hover:shadow-darkSM" : "hover:shadow-blueSM"} flex items-center justify-between py-2 px-4 rounded-xl     cursor-pointer transition-all duration-300 ease-in-out`}
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
                      </a>
                    </DropdownMenuItem>
                  ))}
                </div>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem asChild className="relative text-red-600">
                    <>
                      <button className={`${LightMode ? "hover:shadow-darkSM" : "hover:shadow-light"} flex items-center gap-2 w-full py-2 pl-10.5 pr-4 rounded-xl bg-red-100 text-red-600 hover:bg-red-300 hover:text-red-600 focus:bg-red-300 focus:text-red-600 cursor-pointer`}>
                        Log Out
                        
                      </button>
                      <span className="absolute bottom-5.25 left-7 text-red-600">
                        <LogOut className="h-4 w-4 " />
                      </span>
                    </>
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            )}
          </AnimatePresence>
        </div>
      </DropdownMenu>
    </div>
  );
}