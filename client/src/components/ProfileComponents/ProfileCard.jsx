import clsx from "clsx";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { getInitials } from "../../utils/index";
import { useDispatch, useSelector } from "react-redux";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice";
import { Badge } from "../../components/ui/badge";
import { 
  UserPen,
  User,
  MailCheck,
  X,
  Trash2
} from 'lucide-react';
import { FaCrown } from "react-icons/fa";
import Button from '../Button';
import LinearSocial from "../LinearSocial";
import OnlineStatus from "../OnlineStatus";


const Loading = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <>
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
    </>
  )
}


const ProfileCard = ({ 
  onClick, 
  profileSelected,
  editClick, 
  deleteClick, 
  setOpen,
  componentType,
  header
}) => {
  const [swap, setSwap] = useState(false);
  const {
    LightMode,
    selectedUserInfo,
    onlineUsers
  }  = useSelector((state) => state.auth);

  const selectedUser = selectedUserInfo || null;

  // console.log("profile:",profileSelected)
  // console.log("selectedUser:",selectedUser)

  const compare =
    componentType === "Profile Overview"
      ? selectedUser
      : profileSelected;

  const { data } = useGetTeamListsQuery(
    {
      page: 1,
      limit: 100,
      type: "",
    },
    {
      skip: componentType === "Profile",
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const users = data?.users || [];

  const freshUser =
    componentType === "Profile"
      ? profileSelected
      : users.find((user) => user._id === compare?._id);



  useEffect(() => {
    setSwap(true);

    const timer = setTimeout(() => {
      setSwap(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [freshUser]);


  const cardBg = LightMode ? "bg-white text-gray-700 shadow-darkSM" :  "bg-black/90 text-gray-200 shadow-lightSM border border-white"
  const cancel = LightMode ? "bg-white hover:bg-stone-100 border-stone-600" : "bg-gray-600 hover:bg-gray-700"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const badge = LightMode ? "text-black bg-white/50 border border-black/30 shadow-darkSM" : "text-white border border-white/50 bg-blue-800/40 shadow-lightSM"
  
  return (
    <div className="relative my-2">
      <h1 className="absolute -top-10 left-0 right-0 text-lg font-medium text-center">
        {header}
      </h1>
      <div onClick={onClick} className={`${componentType === "Profile Overview" ? "mt-0" : "mt-10"} ${cardBg} ${changeAnimation} relative flex justify-center w-80 h-116  flex-col rounded-xl bg-clip-border`}>

        {freshUser ? (
            swap ? (
              <span className="flex justify-center items-center pr-5">
                <Loading />
              </span>
              
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  className='w-full h-full flex justify-center items-center'
                  >
                  <div className='relative flex justify-center items-center rounded-xl w-full h-50 mx-4 -mt-10 shadow-darkSM'>
                    <div 
                      key={freshUser?._id} 
                      className={`outline-0 border-2 ${freshUser?.isActive ? "border-green-600" : "border-red-600"} relative flex justify-center overflow-hidden items-center w-full h-50  rounded-xl bg-blue-gray-500 bg-clip-border text-white bg-blue-600 shadow-inner`}
                    >
                    <span  className={`${freshUser?.profileImage ? "mt-20" : ""} text-white font-semibold`}>
                      {freshUser?.profileImage ? 
                        <img
                          src={freshUser?.profileImage}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        :
                        <span className="h-full w-full text-4xl">
                          {getInitials(freshUser?.name || "Unknown User")}
                        </span>
                      }
                      </span>

                    </div>
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 120 }}
                        transition={{
                          delay: 2,
                          type: "spring",
                          stiffness: 60,
                          damping: 14,
                          mass: 1.2,
                        }}
                        className="absolute -top-2 -left-4 flex justify-center items-center"
                      >
                        <OnlineStatus
                          isOnline={onlineUsers.includes(freshUser._id.toString())}
                          type="Overview"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {freshUser ? (
                        swap ? (
                          <span className="flex justify-center items-center pr-5">
                            <Loading />
                          </span>
                          
                        ) : (
                          <AnimatePresence>
                            <motion.span
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div>
                                { componentType === "ViewUserProfile" ?
                                  <span 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setOpen(false)
                                    }}
                                    className={`${cancel} ${changeAnimation} absolute -top-5 -right-4 p-2  text-red-500 rounded-full border shadow-darkSM cursor-pointer  hover:scale-103 active:scale-95 transition-all duration-300 ease-in-out`}
                                  >
                                    <X size={24} />
                                  </span>
                                  :
                                  null
                                }
                              </div>
                            </motion.span>
                          </AnimatePresence>
                        )
                      )
                        :
                      <span className="flex justify-center items-center pr-5">
                        <Loading />
                      </span>
                    }
                  </div>
                </motion.div>
              </AnimatePresence>
            )
          )
            :
          <span className="flex justify-center items-center pr-5">
            <Loading />
          </span>
        }




        <div className="px-6 pt-6 pb-2">
          <h5 className="flex items-center gap-2 mb-2 font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased ">
            <span className="relative">
              <User size={23} /> 
              {freshUser?.isAdmin && (
                <span className="absolute -top-3 rotate-28 -right-0.5">
                  <FaCrown className="text-yellow-500 text-lg"/>
                </span>
              )}
            </span>
            {freshUser ? (
                swap ? (
                  <span className="flex flex-1 justify-end items-center pr-5">
                    <Loading />
                  </span>
                  
                ) : (
                  <span className="line-clamp-1">{freshUser?.name}</span>
                )
              )
                :
              <span className="flex flex-1 justify-end items-center pr-5">
                <Loading />
              </span>
            }
          </h5>
          <h5 className="flex items-center gap-2 mb-2 font-sans text-md font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            <MailCheck size={23} />
            {freshUser ? (
                swap ? (
                  <span className="flex flex-1 justify-end items-center pr-5">
                    <Loading />
                  </span>
                  
                ) : (
                  <span className="line-clamp-1">{freshUser?.email}</span>
                )
              )
              :
              <span className="flex flex-1 justify-end items-center pr-5">
                <Loading />
              </span>
            }
          </h5>
        </div>


        {freshUser ? (
            swap ? (
              <span className="flex justify-center items-center pr-5">
                <Loading />
              </span>
              
            ) : (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge 
                    variant="secondary"
                    className={`${badge} ${changeAnimation} flex justify-center items-center text-md pt-1.5 pb-2 pl-8 pr-4 -ml-2 mb-6 rounded-br-3xl rounded-tl-sm rounded-tr-none`}
                  >



                    {freshUser?.title.length <= 15 && freshUser?.role.length <= 15 ? (
                      <div className={`
                          w-full flex justify-start items-center gap-2 transition-all duration-300 ease-in-out
                        `}>
                        <div className="text-sm font-semibold flex flex-wrap">{freshUser?.title}</div>
  
                        <div className={`w-0.5 h-8 ${freshUser?.isActive ? "bg-linear-to-b from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-b from-red-400/10 via-red-500 to-red-400/10" } `} />
  
                        <div className="text-sm font-semibold">{freshUser?.role}</div>
                      </div>
                    ) : (
                      <div 
                      className={`
                        w-full flex flex-col justify-start items-center gap-1 transition-all duration-300 ease-in-out`
                      }>
                        <div className="text-sm font-semibold flex flex-wrap">{freshUser?.title}</div>

                        <div className={`w-full h-0.5 ${freshUser?.isActive ? "bg-linear-to-l from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-b from-red-400/10 via-red-500 to-red-400/10" } `} />

                        <div className="text-sm font-semibold">{freshUser?.role}</div>
                      </div>
                    )}

                  </Badge>            
                </motion.span>
              </AnimatePresence>
            )
          )
            :
          <span className="flex justify-center items-center pr-5">
            <Loading />
          </span>
        }

        <div className='mb-0.5'>
            <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10  " />
        </div>

        <div className="">
          <LinearSocial tiktok={freshUser?.tiktok} x={freshUser?.x} whatsApp={freshUser?.whatsApp} telegram={freshUser?.telegram} noBG={false}/>
        </div>

        <div className='px-10 mb-2'>
          <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 my-1" />
        </div>
        

        <div className="px-6 mt-2 mb-4 pt-0 flex justify-between items-center sm:flex-row-reverse gap-4">

          {freshUser ? (
              swap ? (
                <span className="flex justify-center items-center pr-5">
                  <Loading />
                </span>
                
              ) : (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      label='Edit'
                      icon={<UserPen size={18} />}
                      className='ClickAnimation flex flex-row-reverse gap-2 items-center bg-blue-600 text-white rounded-md py-2 px-5 shadow-darkSM hover:shadow-inner transition-all duration-300 ease-in-out'
                      onClick={(e) => {
                        e.stopPropagation()
                        editClick(freshUser)
                      }}
                    />           
                  </motion.span>
                </AnimatePresence>
              )
            )
              :
            <span className="flex justify-center items-center pr-5">
              <Loading />
            </span>
          }

          {freshUser ? (
              swap ? (
                <span className="flex justify-center items-center pr-5">
                  <Loading />
                </span>
                
              ) : (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div>
                      { componentType === "ViewUserProfile" || componentType === "Profile Overview" ?
                        <Button
                          label='Delete'
                          icon={<Trash2 size={18} />}
                          className='ClickAnimation flex flex-row-reverse gap-1 items-center bg-red-600 text-white rounded-md py-2 px-4 shadow-darkSM hover:shadow-inner transition-all duration-300 ease-in-out'
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteClick(freshUser?._id)
                          }}
                        />
                        :
                        null
                      }
                    </div>
                  </motion.span>
                </AnimatePresence>
              )
            )
              :
            <span className="flex justify-center items-center pr-5">
              <Loading />
            </span>
          }
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;