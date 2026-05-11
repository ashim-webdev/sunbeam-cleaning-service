import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge"
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationDialog, {UserAction} from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Title from "../components/Title";
import DeleteBtn from "../components/DeleteBtn";
import EditBtn from "../components/EditBtn";
import SocialMedia from "../components/SocialMedia";
import LinearSocial from "../components/linearSocial";
import ViewUserProfile from "../components/ProfileComponents/ViewUserProfile";
import {
  useDeleteUserMutation,
  useGetTeamListsQuery,
  useUserActionMutation,
} from "../redux/slices/api/userApiSlice";
import { useSelector } from "react-redux";
import { getInitials } from "../utils/index";
import { Link } from 'react-router-dom'

// import { useSearchParams } from "react-router-dom";

const Users = () => {
  const { LightMode } = useSelector((state) => state.auth);

  // const [searchParams] = useSearchParams();
  // const [searchTerm] = useState(searchParams.get("search") || "");

  const { data, isLoading, refetch } = useGetTeamListsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const [showSocial, setShowSocial] = useState(null)
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);
  const [profileSelected, setProfileSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const viewProfileInfo = (el) => {
    setProfileSelected(el);
    setOpenProfile(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteUser(selected);

      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const userActionHandler = async () => {
    try {
      const res = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(res?.data?.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
      }, 500);
    } catch (error) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // useEffect(() => {
  //   refetch();
  // }, [open]);

  const toggleSocial = (id) => {
    setShowSocial(prev => (prev === id ? null : id))
  }

  // console.log(user)

  const TableHeader = () => (
    <thead className='border-b border-gray-300 dark:border-gray-600'>
      <tr className={`
            ${LightMode
                ? "text-black"
                : "text-white"
            }
          dark:text-white text-left transition-colors     duration-300 ease-in-out
          `}>
        <th className='py-2 pl-2'>Full Name</th>
        <th className='py-2 text-start pl-5.5'>Title</th>
        <th className='py-2 text-start pl-3.5'>Email</th>
        <th className='py-2 text-center'>Role</th>
        <th className='py-2 text-center'>Active</th>
        <th className='py-2 text-center'>Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr 
        onClick={(e) => {
          e.stopPropagation()
          viewProfileInfo(user)
        }} 
        className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white/70 hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50  transition-colors ease-in-out duration-300 cursor-pointer
        `}>
      <td   
        className='p-2'
      >
        <div className='relative flex items-center gap-3 whitespace-nowrap'>
          <div 
            onClick={(e) => {
              e.stopPropagation()
              toggleSocial(user._id)
            }}
            className={clsx(
            "relative w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-sm ml-2 shadow-inner overflow-hidden bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out",
            user.isActive ? "border-green-500" : "border-red-600"
          )}>
            {user?.profileImage ? 
              <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span className='text-xs md:text-sm text-center'>
                {getInitials(user?.name)}
              </span>
            }
          </div>
            
          {showSocial !== user._id && (
            <span className="absolute top-2 left-11  text-blue-600">
              <ChevronRight size={18} className="animate-LeftRight"/>
            </span>
          )}
            
          <span className={`${user.isActive ? "" : "blur-[2px]"} ml-3`}>{user.name}</span>

          {showSocial === user._id && (
            <div onClick={(e) => e.stopPropagation()} className="absolute -top-1.5 left-15">
              <LinearSocial tiktok={user?.tiktok} x={user?.x} whatsApp={user?.whatsApp} telegram={user?.telegram} noBG={true}/>

              <div
                className={`absolute inset-0 rounded-2xl  blur-xl opacity-50 transition-all duration-300 ease-in-out`}
              ></div>

              <div
                className={`
                  ${LightMode 
                    ? "shadow-darkSM bg-[#E8E8E8]" 
                    : "shadow-lightSM bg-[#3D3D3D]"
                  }
                  absolute bottom-4 lift-0 -translate-x-1/2 w-3 h-3 rotate-135 border-r border-b border-[#0061FA] transition-all duration-300 ease-in-out
                `}
              ></div>
            </div>
          )}
        </div>
      </td>
      <td className={`p-2 px-6 whitespace-nowrap text-start ${user.isActive ? "" : "blur-[2px]"}`}>{user.title}</td>
      <td className={`p-2 px-4 text-start ${user.isActive ? "" : "blur-[2px]"}`}>{user.email}</td>
      <td className={`p-2 line-clamp-2 whitespace-nowrap text-center ${user.isActive ? "" : "blur-[2px]"}`}>{user.role}</td>
      <td className="px-8">
        <div className="flex justify-center items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              userStatusClick(user)
            }} 
            className="cursor-pointer active:scale-103"
            >
            <Badge 
              className={`${user.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white text-[16px] hover:scale-103 shadow-darkSM transition-all duration-100 ease-in-out`}
            >
              {user.isActive ? "Active" : "Disabled"}
            </Badge>     
          </button>       
        </div>
        
      </td>
      <td className='p-2 flex gap-3 justify-center'>
        {/* <Button
          className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
          label='Edit'
          type='button'
          onClick={() => editClick(user)}
        /> */}
        <EditBtn 
          onClick={(e) => {
            e.stopPropagation()
            editClick(user)
          }}
        />

        {/* <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        /> */}
        <DeleteBtn
          onClick={(e) => {
            e.stopPropagation()
            deleteClick(user?._id)
          }}
        />
      </td>
    </tr>
  );

  const UserCard = ({ user }) => (
    <div 
      onClick={(e) => {
        e.stopPropagation()
        viewProfileInfo(user)
      }} 
      className={`
      ${LightMode
        ? "bg-white shadow-darkSM"
        : "bg-black/90 shadow-lightSM"
      }
      relative w-full rounded-2xl h-35 flex flex-col justify-center items-center transition-all duration-300 ease-in-out cursor-pointer hover:scale-102
    `}>
        <div className={`${user.isActive ? "border-green-500" : "border-red-600"} absolute -top-7 -left-5 border-2 rounded-full flex flex-col justify-center items-center gap-3 whitespace-nowrap`}>
          <div className={clsx(
            LightMode
              ? "shadow-darkSM border-white"
              : "shadow-lightSM border-black",
            "w-30 h-30 rounded-full border-8 flex items-center justify-center text-white text-sm overflow-hidden bg-blue-600 transition-all duration-300 ease-in-out",
          )}>
            {user?.profileImage ? 
              <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span className='text-2xl md:text-sm text-center'>
                {getInitials(user?.name)}
              </span>
            }
          </div>
        </div>

        <div 
          onClick={(e) => e.stopPropagation()} 
          className={`
            ${LightMode
              ? "border-[#E8E8E8] bg-[#E8E8E8]"
              : "border-[#3D3D3D] bg-[#3D3D3D]"
            }
            absolute border-2 p-2 rounded-full -top-11 right-25 flex justify-center transition-all duration-300 ease-in-out`
          }>
          <SocialMedia tiktok={user.tiktok} x={user.x} whatsApp={user.whatsApp} telegram={user.telegram} />
        </div>

        <div className='absolute -top-6 -right-6 p-2 flex flex-col gap-1.5 justify-center'>
          {/* <Button
            className='text-blue-600 hover:text-blue-500 font-semibold sm:px-0'
            label='Edit'
            type='button'
            onClick={() => editClick(user)}
          /> */}
          <span className={`
              ${LightMode
                ? "border-[#E8E8E8]"
                : "border-[#3D3D3D]"
              }
              border-7 z-10 rounded-full transition-all duration-300 ease-in-out 
            `}>
          <EditBtn 
            onClick={(e) => {
              e.stopPropagation()
              editClick(user)
            }}
          />
          </span>

          {/* <Button
            className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
            label='Delete'
            type='button'
            onClick={() => deleteClick(user?._id)}
          /> */}
          <span className={`
              ${LightMode
                ? "border-[#E8E8E8]"
                : "border-[#3D3D3D]"
              }
              border-7 z-10 rounded-full transition-all duration-300 ease-in-out
            `}>
          <DeleteBtn
            onClick={(e) => {
              e.stopPropagation()
              deleteClick(user?._id)
            }}
          />
          </span>
        </div>

        <div className={`
          ${LightMode
            ? "text-black"
            : "text-white"
          }
            w-full mt-4 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="ml-27 w-40 flex flex-col justify-center items-start gap-0">
            <div className="text-xl font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:hidden">{user.name.slice(0, 12) + "..."}</div>
            <div className="text-xl font-semibold font-serif whitespace-nowrap [@media(min-width:400px)_and_(min-width:500px)]:block hidden">{user.name}</div>
            
            <div className="text-lg [@media(min-width:400px)_and_(min-width:500px)]:hidden">{user.email.slice(0, 13) + "..."}</div>
            <div className="text-lg [@media(min-width:400px)_and_(min-width:500px)]:block hidden">{user.email}</div>
          </div>
        </div>

        <div className={`
            ${LightMode
              ? "text-black"
              : "text-white"
            }
            w-full mt-4 ml-5 flex justify-start items-center gap-2 transition-all duration-300 ease-in-out
            ${user.isActive ? "" : "blur-[2px]"}
          `}>
          <div className="text-sm font-semibold whitespace-nowrap">{user.title}</div>

          <div className={`w-0.5 h-8 ${user.isActive ? "bg-linear-to-b from-green-400/10 via-green-500 to-green-400/10" : "bg-linear-to-b from-red-400/10 via-red-500 to-red-400/10" } `} />

          <div className="mr-8 text-sm font-semibold line-clamp-1">{user.role}</div>
        </div>

        <div className="w-2/3 flex justify-between items-center">
          <div className={`
              ${LightMode
                ? "border-[#E8E8E8] bg-[#E8E8E8]"
                : "border-[#3D3D3D] bg-[#3D3D3D]"
              }
              absolute -bottom-6 -right-4 flex justify-center items-center rounded-md border-6 transition-all duration-300 ease-in-out
            `}>
            <AnimatePresence>
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    userStatusClick(user)
                  }} 
                  className="cursor-pointer active:scale-103"
                  >
                  <Badge 
                    className={`${user.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white text-[16px] hover:scale-103 shadow-darkSM transition-all duration-100 ease-in-out`}
                  >
                    {user.isActive ? "Active" : "Disabled"}
                  </Badge>     
                </button>       
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
    </div>
  )

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <div className='w-full h-full md:px-1 px-0 mb-0'>
        <div className='flex items-center justify-end mb-5'>
          <Button
            label='Add New User'
            icon={<IoMdAdd className='text-lg' />}
            className='ClickAnimationNoti flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 shadow-darkSM hover:shadow-inner transition-colors duration-300 ease-in-out'
            onClick={() =>{
              setOpen(true)
              setSelected(null)
            }}
          />
        </div>

        <Title title='  Team Members' />

        <div className={`
            ${LightMode
              ? "bg-white"
              : "bg-black/90"
            }
            sm:block hidden mt-3 px-2 md:px-4 py-4 shadow rounded transition-colors duration-300 ease-in-out
          `}>
          
          {data?.length === 0 ? (
              <div className={`${LightMode ? "text-black" : "text-white"} text-center text-xl transition-colors duration-300 ease-in-out`}>
                No users found.
              </div>
            ) : 
              <div className='overflow-x-auto'>
                <table className='w-full mb-5'>
                  <TableHeader />
                  <tbody>
                    {data?.map((user, index) => (
                      <TableRow key={index} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            }
        </div>

        <div className={`
            flex flex-col justify-center gap-17 px-4 sm:hidden mt-10 mb-6 py-4 rounded transition-colors duration-300 ease-in-out
          `}>
          {data?.length === 0 ? (
            <div className={`${LightMode ? "text-black" : "text-white"} text-center text-xl transition-colors duration-300 ease-in-out`}>
              No users found.
            </div>
          ) : 
            data?.map((user, index) => (
              <UserCard key={index} user={user} />
            ))
          }
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />

      <ViewUserProfile 
        open={openProfile} 
        setOpen={setOpenProfile} 
        profileSelected={profileSelected} 
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        deleteHandler={deleteHandler}
      />
    </>
  );
};

export default Users;
