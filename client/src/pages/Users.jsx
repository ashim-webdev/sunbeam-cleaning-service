import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";
import ConfirmationDialog from "../components/ConfirmationDialog";
import AddUser from "../components/AddUser";
import Loading from "../components/Loading";
import Button from "../components/Button";
import Title from "../components/Title";
import DeleteBtn from "../components/DeleteBtn";
import EditBtn from "../components/EditBtn";
import SocialMedia from "../components/SocialMedia";
import LinearSocial from "../components/linearSocial";
// import {
//   useDeleteUserMutation,
//   useGetTeamListsQuery,
//   useUserActionMutation,
// } from "../redux/slices/api/userApiSlice";
import { useSelector } from "react-redux";
import { getInitials } from "../utils/index";
import { summary } from "../assets/data";
// import { useSearchParams } from "react-router-dom";

const Users = () => {
  const { LightMode } = useSelector((state) => state.auth);

  // const [searchParams] = useSearchParams();
  // const [searchTerm] = useState(searchParams.get("search") || "");

  // const { data, isLoading, refetch } = useGetTeamListsQuery({
  //   search: searchTerm,
  // });
  // const [deleteUser] = useDeleteUserMutation();
  // const [userAction] = useUserActionMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setIsUser] = useState(true);
  const [showSocial, setShowSocial] = useState(null)



  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  // const userStatusClick = (el) => {
  //   setSelected(el);
  //   setOpenAction(true);
  // };

  const deleteHandler = async () => {
    // try {
    //   const res = await deleteUser(selected);

    //   refetch();
    //   toast.success(res?.data?.message);
    //   setSelected(null);
    //   setTimeout(() => {
    //     setOpenDialog(false);
    //   }, 500);
    // } catch (error) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  const userActionHandler = async () => {
    // try {
    //   const res = await userAction({
    //     isActive: !selected?.isActive,
    //     id: selected?._id,
    //   });

    //   refetch();
    //   toast.success(res?.data?.message);
    //   setSelected(null);
    //   setTimeout(() => {
    //     setOpenAction(false);
    //   }, 500);
    // } catch (error) {
    //   console.log(err);
    //   toast.error(err?.data?.message || err.error);
    // }
  };

  // useEffect(() => {
  //   refetch();
  // }, [open]);

  const toggleSocial = (id) => {
    setShowSocial(prev => (prev === id ? null : id))
  }

  console.log(user)

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
    <tr className={`
          ${LightMode 
            ? "border-gray-300 text-gray-600 hover:bg-gray-300/50 hover:shadow-dark"
            : "border-gray-600 text-white/70 hover:bg-white/30 hover:shadow-light"
          }
          tableRow border hover:bg-gray-300/50  transition-colors ease-in-out duration-300 cursor-pointer
        `}>
      <td className='p-2'>
        <div className='relative flex items-center gap-3 whitespace-nowrap'>
          <div 
            onClick={() => toggleSocial(user._id)}
            className={clsx(
            "w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-sm ml-2 shadow-inner overflow-hidden bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out",
            user.isActive ? "border-green-500" : "border-red-600"
          )}>
            {user?.img ? 
              <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span className='text-xs md:text-sm text-center'>
                {getInitials(user?.name)}
              </span>
            }
            
          </div>
          <span className={`${user.isActive ? "" : "blur-[2px]"}`}>{user.name}</span>

          {showSocial === user._id && (
            <div className="absolute -top-1.5 left-15">
              <LinearSocial tiktok={user?.tiktok} x={user?.x} whatsApp={user?.whatsApp} telegram={user?.telegram}/>

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
      <td className={`p-2 text-center ${user.isActive ? "" : "blur-[2px]"}`}>{user.role}</td>
      <td className="px-4">
        <div className="flex justify-center items-center">
          <button
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner hover:shadow-innerWH  cursor-pointer active:scale-95",
              user.isActive ? "bg-green-500 text-white hover:bg-green-700 hover:scale-105" : "bg-red-500 text-white hover:bg-red-700 hover:scale-105"
            )}
          >
            {user.isActive ? "Active" : "Disabled"}
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
          onClick={() => editClick(user)}
        />

        {/* <Button
          className='text-red-700 hover:text-red-500 font-semibold sm:px-0'
          label='Delete'
          type='button'
          onClick={() => deleteClick(user?._id)}
        /> */}
        <DeleteBtn
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  const UserCard = ({ user }) => (
    <div className={`
      ${LightMode
        ? "bg-white shadow-darkSM"
        : "bg-black/90 shadow-lightSM"
      }
      relative w-full rounded-2xl h-35 flex flex-col justify-center items-center transition-all duration-300 ease-in-out
    `}>
        <div className={`${user.isActive ? "border-green-500" : "border-red-600"} absolute -top-7 -left-5 border-2 rounded-full flex flex-col justify-center items-center gap-3 whitespace-nowrap`}>
          <div className={clsx(
            LightMode
              ? "shadow-darkSM border-white"
              : "shadow-lightSM border-black",
            "w-30 h-30 rounded-full border-8 flex items-center justify-center text-white text-sm overflow-hidden bg-blue-600 transition-all duration-300 ease-in-out",
          )}>
            {user?.img ? 
              <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
            :
              <span className='text-2xl md:text-sm text-center'>
                {getInitials(user?.name)}
              </span>
            }
          </div>
        </div>

        <div className={`
          ${LightMode
            ? "border-[#E8E8E8] bg-[#E8E8E8]"
            : "border-[#3D3D3D] bg-[#3D3D3D]"
          }
          absolute border-2 p-2 rounded-full -top-11 right-25 flex justify-center transition-all duration-300 ease-in-out
        `}>
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
          <div className="text-sm font-semibold">{user.title}</div>

          <div className="w-0.5 h-8 bg-linear-to-b from-green-400/10 via-green-500 to-green-400/10" />

          <div className="text-sm font-semibold">{user.role}</div>
        </div>

        <div className="w-2/3 flex justify-between items-center">
          <div className={`
              ${LightMode
                ? "border-[#E8E8E8] bg-[#E8E8E8]"
                : "border-[#3D3D3D] bg-[#3D3D3D]"
              }
              absolute -bottom-6 -right-4 flex justify-center items-center rounded-3xl border-8 transition-all duration-300 ease-in-out
            `}>
            <button
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "w-fit px-3.5 py-1.5 rounded-full transition-transform ease-in-out duration-300 text-[15px] shadow-inner hover:shadow-innerWH  cursor-pointer  active:scale-95",
                user.isActive ? "bg-green-500 text-white hover:bg-green-700 hover:scale-105" : "bg-red-500 text-white hover:bg-red-700 hover:scale-105"
              )}
            >
              {user.isActive ? "Active" : "Disabled"}
            </button>
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
            className='ClickAnimationNoti flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5 shadow-inner hover:shadow-innerWH transition-colors duration-300 ease-in-out'
            onClick={() => setOpen(true)}
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
          <div className='overflow-x-auto'>
            <table className='w-full mb-5'>
              <TableHeader />
              <tbody>
                {summary.users?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`
            flex flex-col justify-center gap-17 px-4 sm:hidden mt-10 mb-6 py-4 rounded transition-colors duration-300 ease-in-out
          `}>
          {summary.users?.map((user, index) => (
            <UserCard key={index} user={user} />
          ))}
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      {/* <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      /> */}
    </>
  );
};

export default Users;
