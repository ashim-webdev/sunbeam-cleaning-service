import React, { useEffect, useState, useRef } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar  } from "../redux/slices/authSlice";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import { updateURL } from "../utils";
import NotificationPanel from "./NotificationPanel";
import UserAvatar from "./UserAvatar";
import Dark_Light_Btn from "./Dark_Light_Btn";
import ConnectionStatus from "./ConnectionStatus";

const Navbar = ({ isScrolled, isSearchPanelOpen, setIsSearchPanelOpen }) => {
  const { LightMode, user, onlineUsers } = useSelector((state) => state.auth);


  const [focus, setFocus] = useState(false);
  const [showRecent, setShowRecent] = useState(false);




  const isSubmittingRef = useRef(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );


  const storageKey = location.pathname.includes("team")
    ? "recentSearches_users"
    : location.pathname.includes("booking")
    ? "recentSearches_bookings"
    : "recentSearches_tasks";

  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  });


  // Determine if we're on the this page to conditionally show the search bar
  const taskRoutes = [
    "tasks",
    "todos",
    "in-progress",
    "completed",
    "team",
    "bookings",
    "trashed"
  ];

  const isSearchablePage = taskRoutes.some((route) =>
    location.pathname.includes(route)
  );

  // console.log(location.pathname)

  
  // reload the correct Recent search
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(storageKey)) || [];
    setRecentSearches(stored);
  }, [storageKey]);

  //clean search bar when routing to a new page
  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, [location.pathname]);


  const handleSubmit = (e) => {
    e.preventDefault();

    // console.log("submitting", searchInput)

    isSubmittingRef.current = true;

    if (!searchInput.trim()) return;

    const params = new URLSearchParams(searchParams);

    if (!searchInput.trim()) {
      params.delete("search");
      setSearchParams(params);
      return;
    }

    params.set("search", searchInput);
    setSearchParams(params);

    const updatedSearches = [
      searchInput,
      ...recentSearches.filter(
        (item) =>
          item.toLowerCase() !== searchInput.toLowerCase()
      ),
    ].slice(0, 6);

    setRecentSearches(updatedSearches);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedSearches)
    );

    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 300);
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsSearchPanelOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="relative">
      <div className={`
          ${LightMode 
            ? `${isScrolled ? 'bg-white/90 backdrop-blur-xs ' : 'bg-white'}`
            : `${isScrolled ? 'bg-black/90 backdrop-blur-[2px]' : 'bg-black/90'}`
          }
          ${isSearchPanelOpen ? 
            LightMode ? "border-gray-300" : "border-gray-300/50"
            : "border-transparent"
          }
          sticky flex justify-between items-center px-6 pt-4 pb-3 sm:py-4 2xl:py-6  z-50 top-0 transition-colors ease-in-out duration-300 border-b
        `}>
        <div className='relative sm:ml-8 ml-2 flex gap-4'>
          <div className='flex justify-center items-center'>
            <button
              onClick={() => dispatch(setOpenSidebar(true))}
              className={`
                  ${LightMode 
                    ? "text-gray-500 hover:text-gray-600"
                    : "text-white"
                  }
                  text-3xl cursor-pointer transition-transform ease-in-out duration-300 hover:scale-105 flex justify-center items-center xl:hidden font-bold
                `}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          <AnimatePresence>
            <motion.form
              key={location.pathname}
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 2,
                type: "spring",
                stiffness: 60,
                damping: 14,
                mass: 1.2,
              }}
              onSubmit={handleSubmit}
              className={`
                ${isSearchablePage ? "hidden sm:flex" : "hidden"}
                w-auto 2xl:w-100 items-center px-3 gap-2 rounded-full
              `}
            >
              <div className="lg:pl-55 input-container relative">
                <span className="relative">
                  <input
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setShowRecent(false);
                    }}
                    type="text" 
                    name="text" 
                    autoComplete="off"
                    onFocus={() => {
                      setFocus(true);
                      setShowRecent(true);
                    }}
                    onBlur={(e) => {
                      if (e.relatedTarget) return; // if clicking inside dropdown
                      setFocus(false);
                    }}
                    className={`
                        ${LightMode 
                          ? "border border-gray-300 bg-white"
                          : "bg-black/90 border border-white placeholder-white/40 text-white"
                        }
                        input_nav lowercase w-full md:w-60 lg:w-70 transition-colors ease-in-out duration-300
                      `} 
                    placeholder="search..." 
                  />
                  
                  {/* Search icon button */}
                  <button type="submit" className="bg-[#E8E8E8] justify-center items-center p-3 absolute -top-2.25 -right-9 hidden sm:flex ml-2">
                    <i 
                      onClick={(e) => {
                        if (!searchInput.trim()) return;

                        handleSubmit(e);
                      }}
                      className={`
                        ${searchInput 
                          ? "text-blue-600 scale-105 hover:scale-107 active:scale-95 cursor-pointer" 
                          : `text-gray-500 cursor-not-allowed`
                        }
                        transition-all duration-300 ease-in-out fa-solid fa-magnifying-glass
                      `}
                    ></i>
                  </button>

                  {/* Cancel search button */}
                  {searchInput && (
                    <AnimatePresence>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                        type="button"
                        onClick={() => {
                          setSearchInput("");

                          const params = new URLSearchParams(searchParams);
                          params.delete("search");

                          setSearchParams(params);

                          setFocus(false);
                        }}
                        className={`
                          ${LightMode 
                            ? "text-gray-500"
                            : "text-gray-300"
                          } 
                          absolute -right-20 top-1/2 -translate-y-1/2 hover:text-red-500 scale-105 hover:scale-110 active:scale-95 text-lg
                          transition-all duration-200 cursor-pointer
                        `}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </motion.button>
                    </AnimatePresence>
                  )}

                </span>
                <AnimatePresence>
                  {focus && showRecent && recentSearches.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className={`
                        absolute hidden sm:block top-14 -right-6 w-60 rounded-2xl overflow-hidden z-50
                        ${LightMode
                          ? "bg-white border border-gray-200 shadow-xl"
                          : "bg-[#111] border border-gray-700 shadow-2xl"
                        }
                      `}
                    >
                      <div className="p-2">
                        <p className="text-xs px-3 py-2 text-gray-400">
                          Recent Searches
                        </p>

                        {recentSearches.map((item, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => {
                              if (isSubmittingRef.current) return;

                              setSearchInput(item);
                              setFocus(false)

                              const params = new URLSearchParams(searchParams);
                              params.set("search", item);

                              setSearchParams(params);
                            }}
                            className={`
                              w-full flex justify-between items-center gap-3 px-3 py-2 rounded-xl
                              transition-all duration-200 cursor-pointer
                              ${LightMode
                                ? "hover:bg-gray-100 text-gray-700"
                                : "hover:bg-white/5 text-gray-200"
                              }
                            `}
                          >
                            <span className="w-full flex items-center gap-2 rounded-xl text-left">
                              <i className="fa-solid fa-clock-rotate-left text-sm opacity-60"></i>

                              <span className="truncate text-sm">
                                {item}
                              </span>
                            </span>

                            <span
                              onClick={(e) => {
                                e.stopPropagation();

                                const filtered = recentSearches.filter(
                                  (_, i) => i !== index
                                );

                                setRecentSearches(filtered);

                                localStorage.setItem(
                                  storageKey,
                                  JSON.stringify(filtered)
                                );
                              }}
                              className={`
                                  font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs hover:scale-110 hover:shadow-innerGRN active:scale-95 transition-all duration-300 ease-in-out
                                `}
                            >
                              ✕
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>

        <div className='sm:mr-8 mr-2'>
          <div className="flex justify-evenly items-center">

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 120 }}
                transition={{
                  delay: 2,
                  type: "spring",
                  stiffness: 60,
                  damping: 14,
                  mass: 1.2,
                }}
                className="hidden xl:flex flex-col justify-center items-center mr-10"
              >
                <ConnectionStatus
                  isOnline={onlineUsers.includes(user._id.toString())}
                />
              </motion.div>
            </AnimatePresence>

            <div className="sm:block hidden mr-5 ">
              <span className={`
                  ClickAnimationNoti flex justify-center items-center rounded-full transition-colors ease-in-out duration-300 shadow-md 
                `}>
                  <Dark_Light_Btn />
              </span>
            </div>



                {searchInput ? (
                  <AnimatePresence>
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      type="button"
                      onClick={() => {
                        setSearchInput("");

                        const params = new URLSearchParams(searchParams);
                        params.delete("search");

                        setIsSearchPanelOpen(false)
                        setSearchParams(params);

                        setFocus(false);
                      }}
                      className={`
                        sm:hidden mr-4 flex justify-center items-center text-red-500 scale-105 hover:scale-110 active:scale-95 text-lg
                        transition-all duration-200 cursor-pointer
                      `}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </motion.button>
                  </AnimatePresence>
                ) : (
                  <AnimatePresence>
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSearchPanelOpen((prev) => !prev);
                      }}
                      className={`
                        ${LightMode 
                          ? "text-gray-500"
                          : "text-gray-300"
                        } 
                        sm:hidden mr-3 mt-2 hover:text-blue-600 hover:scale-105 active:scale-95 cursor-pointer transition-all duration-300 ease-in-out
                      `}> 
                      <i className="fa-solid fa-magnifying-glass text-xl"></i>
                    </motion.span>
                  </AnimatePresence>
                )}

            
            <div className="mt-1 flex justify-center item-center gap-3">
              <span className="flex justify-center item-center">
                <NotificationPanel />
              </span>

              <span className="">
                <UserAvatar />
              </span>
            </div>
          </div>

        </div>
      </div>


      <AnimatePresence>
        {isSearchPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9 }}
            className=" px-2 absolute top-18 w-full flex justify-start items-center"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={false}
              animate={{
                width: focus ? 310 : 260,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
                duration: 0.5,
              }}
              className={`
                ${LightMode 
                  ? 'bg-white border-gray-300 shadow-darkSM' 
                  : 'bg-black/50 border-gray-300/30 shadow-lightSM'
                }
                border flex justify-center items-center p-1.5 pt-4 mx-auto rounded-b-xl overflow-hidden
              `}
            >
              <form
                onSubmit={handleSubmit}
                className={`
                  ${isSearchablePage ? "sm:hidden flex" : "hidden"}
                  w-50 flex items-center pt-3 pb-2 px-3 gap-2 rounded-full -ml-9
                `}
              >
                <div className="input-container relative">
                  <span className="relative">
                    <input
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowRecent(false);
                      }}
                      type="text" 
                      name="text" 
                      autoComplete="off"
                      onFocus={() => {
                        setFocus(true);
                        setShowRecent(true);
                      }}
                      onBlur={(e) => {
                        if (e.relatedTarget) return; // if clicking inside dropdown
                        setFocus(false);
                      }}
                      className={`
                          ${LightMode 
                            ? "border border-gray-300 bg-white"
                            : "bg-black/90 border border-white placeholder-white/40 text-white"
                          }
                          input_nav lowercase w-full transition-colors ease-in-out duration-300
                        `} 
                      placeholder="search..."
                    />
                    
                    {/* Search icon button */}
                    <button type="submit" className="bg-[#E8E8E8] flex justify-center items-center p-3 absolute -top-2.25 -right-9 sm:hidden ml-2">
                      <i 
                        onClick={(e) => {
                          if (!searchInput.trim()) return;

                          setIsSearchPanelOpen(false)
                          handleSubmit(e);
                        }}
                        className={`
                          ${searchInput 
                            ? "text-blue-600 scale-105 hover:scale-107 active:scale-95 cursor-pointer" 
                            : "text-gray-600/40 cursor-not-allowed"
                          }
                          transition-all duration-300 ease-in-out fa-solid fa-magnifying-glass
                        `}
                      ></i>
                    </button>
                  </span>

                </div>
              </form>
            </motion.div>

            <AnimatePresence>
              {focus && showRecent && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className={`
                    absolute top-20 sm:hidden right-8 w-60 rounded-2xl overflow-hidden z-50
                    ${LightMode
                      ? "bg-white border border-gray-200 shadow-xl"
                      : "bg-[#111] border border-gray-700 shadow-2xl"
                    }
                  `}
                >
                  <div className="p-2">
                    <p className="text-xs px-3 py-2 text-gray-400">
                      Recent Searches
                    </p>

                    {recentSearches.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          if (isSubmittingRef.current) return;

                          setSearchInput(item);
                          setFocus(false)

                          const params = new URLSearchParams(searchParams);
                          params.set("search", item);

                          setSearchParams(params);
                        }}
                        className={`
                          w-full flex justify-between items-center gap-3 px-3 py-2 rounded-xl
                          transition-all duration-200 cursor-pointer
                          ${LightMode
                            ? "hover:bg-gray-100 text-gray-700"
                            : "hover:bg-white/10 text-gray-200"
                          }
                        `}
                      >
                        <span className="w-full flex items-center gap-2 rounded-xl text-left">
                          <i className="fa-solid fa-clock-rotate-left text-sm opacity-60"></i>

                          <span className="truncate text-sm">
                            {item}
                          </span>
                        </span>

                        <span
                          onClick={(e) => {
                            e.stopPropagation();

                            const filtered = recentSearches.filter(
                              (_, i) => i !== index
                            );

                            setRecentSearches(filtered);

                            localStorage.setItem(
                              storageKey,
                              JSON.stringify(filtered)
                            );
                          }}
                          className={`
                              font-bold bg-white shadow-inner text-red-600 rounded-full py-px cursor-pointer px-1 text-xs hover:scale-110 hover:shadow-innerGRN active:scale-95 transition-all duration-300 ease-in-out
                            `}
                        >
                          ✕
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
