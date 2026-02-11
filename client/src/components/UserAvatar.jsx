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

const UserAvatar = () => {
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
        <Menu as='div' className='relative inline-block text-left'>
          <div className="ClickAnimationNoti">
            <Menu.Button className=' border-2 border-white w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-transform hover:scale-105 ease-in-out duration-200 shadow-inner'>
              <span className='text-white font-semibold'>
                {getInitials('Ashimonye Gabriel')}
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
                  ? "bg-white"
                  : "bg-black/90 border border-white text-white"
                }
                absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md dark:bg-[#1f1f1f] shadow-2xl ring-1 ring-black/5 focus:outline-none transition-colors ease-in-out duration-300
              `}>
              <div className='p-4'>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)}
                      className={` dark:text-gray-300  group flex w-full items-center rounded-md px-2 py-2 text-base transition-transform hover:scale-105 ease-in-out duration-200 cursor-pointer`}
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={` dark:text-gray-300  group flex w-full items-center rounded-md px-2 py-2 text-base transition-transform hover:scale-105 ease-in-out duration-200 cursor-pointer`}
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className={`text-red-500 group flex w-full items-center rounded-md px-2 py-2 text-base transition-transform hover:scale-105 ease-in-out duration-200 cursor-pointer`}
                    >
                      <IoLogOutOutline className='mr-2 text-lg' aria-hidden='true' />
                      Logout
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
