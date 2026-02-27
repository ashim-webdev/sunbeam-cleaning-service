import React, { useEffect, useState, useRef } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar  } from "../redux/slices/authSlice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import { updateURL } from "../utils";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import Dark_Light_Btn from "./Dark_Light_Btn";

const Navbar = ({ isScrolled }) => {
  const { LightMode } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  // useEffect(() => {
  //   updateURL({ searchTerm, navigate, location });
  // }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.reload();
  };


  return (
    <>
      <div className={`
          ${LightMode 
            ? `${isScrolled ? 'bg-white/90 backdrop-blur-xs ' : 'bg-white'}`
            : `${isScrolled ? 'bg-black/90 backdrop-blur-[2px]' : 'bg-black/90'}`
          }
          flex justify-between items-center px-6 py-3 2xl:py-4 sticky z-60 top-0 transition-colors ease-in-out duration-300
        `}>
      <div className='flex gap-4'>
        <div className='flex justify-center items-center'>
          <button
            onClick={() => dispatch(setOpenSidebar(true))}
            className={`
                ${LightMode 
                  ? "text-gray-500 hover:text-gray-600"
                  : "text-white"
                }
                text-3xl cursor-pointer transition-transform ease-in-out duration-300 hover:scale-105 flex justify-center items-center lg:hidden font-bold
              `}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* {location?.pathname !== "/dashboard" && ( */}
          <form
            onSubmit={handleSubmit}
            className='w-auto 2xl:w-100 flex items-center py-2 px-3 gap-2 rounded-full  dark:bg-[#1c1c1c]'
          >
            <div className="input-container">
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text" 
                name="text" 
                className={`
                    ${LightMode 
                      ? "border border-gray-300 bg-white"
                      : "bg-black/90 border border-white placeholder-white/40 text-white"
                    }
                    input_nav w-full md:w-60 lg:w-70 transition-colors ease-in-out duration-300
                  `} 
                placeholder="search..." 
              />
              <span className={`
                  ${LightMode 
                    ? "fill-gray-300"
                    : "fill-white/50"
                  }
                  icon_search
                `}> 
                <svg className="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
              </span>
            </div>
          </form>
        {/* )} */}
      </div>

      <div className='sm:mr-8 mr-2'>
        <div className="flex justify-evenly items-center">
          <div className="sm:block hidden mr-5 ">
            <span className={`
                ${LightMode 
                  ? "border-2 border-amber-300 shadow-black/80"
                  : "border-2 border-white shadow-white/60"
                }
                ClickAnimationNoti flex justify-center items-center rounded-full transition-colors ease-in-out duration-300 shadow-md 
              `}><Dark_Light_Btn /></span>
          </div>
        <NotificationPanel />

        <UserAvatar />
        </div>

      </div>
    </div>
    </>
  );
};

export default Navbar;
