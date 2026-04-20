import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import { logout } from "../redux/slices/authSlice";
import { getInitials } from "../utils";
// import AddUser from "./AddUser";
// import ChangePassword from "./ChangePassword";

import img2 from "../img/m2.jpg"

const UserAvatar = () => {
  const [isActive, setIsActive] = useState(true)


  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { LightMode } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  // const [logoutUser] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // try {
    //   await logoutUser().unwrap();
    //   dispatch(logout());

    //   navigate("/log-in");
    // } catch (error) {
    //   toast.error("Something went wrong. Please try again.");
    // }
  };

  return (
    <>
      <div className=''>
        <Menu as='div' className='relative inline-block text-left outline-0'>
          <div className="ClickAnimationNoti outline-0">
            <Menu.Button className={`outline-0 border-2 ${isActive ? "border-green-600" : "border-red-600"} w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-200 shadow-inner overflow-hidden`}>
              <span className='text-white font-semibold '>
                {/* {user?.img ? 
                  <img src={user?.img} alt="Avatar" className="w-full h-full object-cover "/>
                :
                  <span>
                    {getInitials(user?.name)}
                  </span>
                } */}
                {img2 ? 
                  <img src={img2} alt="Avatar" className="w-full h-full object-cover "/>
                :
                  <span>
                    {getInitials('Ashimonye Gabriel')}
                  </span>
                }
              </span>
            </Menu.Button>
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
                {/* <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={`${
                            active ? LightMode ? "bg-blue-600 text-white  hover:shadow-dark" : " text-white bg-blue-600 hover:shadow-light "  : LightMode ? "text-black" : " text-white"
                          } group flex w-full items-center rounded-md px-2 hover:px-4 py-2 text-base transition-transform hover:scale-105 ease-in-out duration-200 cursor-pointer`}
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                  )}
                </Menu.Item> */}

                {/* <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`${
                            active ? LightMode ? "bg-blue-600 text-white  hover:shadow-dark" : " text-white bg-blue-600 hover:shadow-light "  : LightMode ? "text-black" : " text-white"
                          } group flex w-full items-center rounded-md px-2 hover:px-4 py-2 text-base transition-transform hover:scale-105 ease-in-out duration-200 cursor-pointer`}
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item> */}

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

      {/* <AddUser open={open} setOpen={setOpen} userData={user} />
      <ChangePassword open={openPassword} setOpen={setOpenPassword} /> */}
    </>
  );
};

export default UserAvatar;
