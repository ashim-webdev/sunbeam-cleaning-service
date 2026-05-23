import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import {useGetUserProfileQuery} from "../redux/slices/api/userApiSlice"
import { logout } from "../redux/slices/authSlice";
import { getInitials } from "../utils";



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




const UserAvatar = () => {
  const { LightMode } = useSelector((state) => state.auth);

  const { user: storedUser } = useSelector((state) => state.auth);
  const { data: freshUser, isLoading } = useGetUserProfileQuery();

  
  const user = freshUser ?? storedUser;

  // console.log(user)

  const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <LoadingCircle />;
  if (!user) return null;

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());

      navigate("/log-in");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <>
      <div className='flex justify-center item-center'>
        <Menu as='div' className='relative inline-block text-left outline-0'>
          <div className="ClickAnimationNoti relative outline-0">
            <Menu.Button className={`outline-0 border-2 ${user?.isActive ? "border-green-600" : "border-red-600"} w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-200 shadow-inner overflow-hidden`}>
              <span className='text-white font-semibold '>
                {user?.profileImage ? 
                  <img src={user?.profileImage} alt="Avatar" className="w-full h-full object-cover "/>
                :
                  <span>
                    {getInitials(user?.name)}
                  </span>
                }
              </span>
            </Menu.Button>

            {user?.isAdmin && (
              <span className="absolute -top-3 rotate-25 right-0">
                <FaCrown className="text-yellow-500 text-lg"/>
              </span>
            )}
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className={`
                ${LightMode 
                  ? "bg-red-200"
                  : "bg-red-200 border border-white text-white"
                }
                absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-2xl ring-1 ring-black/5 focus:outline-none transition-colors ease-in-out duration-300
              `}>
              <div className=''>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`${
                            active ? LightMode ? "bg-red-100 text-red-600  hover:shadow-darkSM hover:bg-red-300" : " text-red-600 bg-red-100 hover:shadow-lightSM hover:bg-red-300"  : LightMode ? "text-black" : " text-red-600"
                          } text-red-600 group flex w-full items-center rounded-md px-4 py-2 text-base transition-transform hover:scale-102 ease-in-out duration-200 cursor-pointer`}
                    >
                      <IoLogOutOutline className='mr-2 text-lg' aria-hidden='true' />
                      Log Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* <ChangePassword open={openPassword} setOpen={setOpenPassword} /> */}
    </>
  );
};

export default UserAvatar;
