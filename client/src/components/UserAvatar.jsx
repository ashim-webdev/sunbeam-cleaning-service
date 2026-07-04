import { Fragment, useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogoutMutation } from "../redux/slices/api/authApiSlice";
import {useGetUserProfileQuery} from "../redux/slices/api/userApiSlice"
import { apiSlice } from "@/redux/slices/apiSlice";
import { logout } from "../redux/slices/authSlice";
import ConfirmationDialog from "./ConfirmationDialog";
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
  const { data: freshUser, isLoading } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("logout");
  const [openDialog, setOpenDialog] = useState(false);
  
  const user = freshUser ?? storedUser;

  // console.log(user)

  const [logoutUser, {isLoading: logoutIsLoading}] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <LoadingCircle />;
  if (!user) return null;

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


  return (
    <>
      <div className='flex justify-center item-center'>
        <div className='relative inline-block text-left outline-0'>
          <div className="ClickAnimationNoti relative outline-0">
            <button
              onClick={deleteAllClick}
              className={`outline-0 border-2 ${user?.isActive ? "border-green-600" : "border-red-600"} w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-200 shadow-inner overflow-hidden`}>
              <span className='text-white font-semibold '>
                {user?.profileImage ? 
                  <img
                    src={user?.profileImage}
                    loading="lazy"
                    decoding="async"
                    alt="Avatar"
                    className="w-full h-full object-cover "
                  />
                :
                  <span>
                    {getInitials(user?.name)}
                  </span>
                }
              </span>
            </button>

            {user?.isAdmin && (
              <span className="absolute -top-3 rotate-25 right-0">
                <FaCrown className="text-yellow-500 text-lg"/>
              </span>
            )}
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
};

export default UserAvatar;
