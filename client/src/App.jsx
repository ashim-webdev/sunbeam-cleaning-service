import { socket } from "./socket";
import { Transition } from "@headlessui/react";
import { Fragment, useRef, useEffect } from "react";
import { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar, setOpenProfile, setOnlineUsers } from "./redux/slices/authSlice";
import {
  incrementTaskNotifications,
  incrementLeaveNotifications,
} from "./redux/slices/authSlice";
import { Toaster } from 'sonner' // Notification library
import Login from './pages/Login'
import TaskDetails from './pages/TaskDetails'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Users from './pages/Users'
import Trash from './pages/Trash'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import LeaveRequest from './pages/LeaveRequest'
import SchedulerPage from "./pages/SchedulerPage";
import Bookings from "./pages/Bookings";
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import Status from "./pages/Status";


function Layout() {
  const { LightMode } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  
  // Socket.io user connection
  useEffect(() => {
    if (user?._id) {
      socket.emit("userConnected", user._id);
    }
  }, [user]);

  
  const dispatch = useDispatch();
  const location = useLocation()

  // Navbar Scroll Color Change
  const containerRef = useRef(null);


  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 50);
    };
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      dispatch(setOpenSidebar(false));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return user ? (
    <div 
    onClick={() => {
      dispatch(setOpenProfile(false))
      setIsSearchPanelOpen(false)
    }}
    className={`
      ${LightMode 
        ? "bg-white/10"
        : "bg-[#3D3D3D]"
      }
      w-full h-full flex flex-col md:flex-row transition-colors ease-in-out duration-300
    `}>
      <div className='z-70 w-1/5 lg:w-3.5/4 h-screen sticky top-0 hidden xl:block'>
        <Sidebar />
      </div>

      <div className="z-200">
        <MobileSidebar />
      </div>

      <div ref={containerRef} className='relative w-full overflow-y-auto flex-1'>     
        <div className="fixed top-0 left-0 right-0 z-60">
          <Navbar isScrolled={isScrolled} isSearchPanelOpen={isSearchPanelOpen} setIsSearchPanelOpen={setIsSearchPanelOpen} />
        </div>
        

        <div className='pt-25 px-2 sm:px-5 pb-4 2xl:px-10 overflow-x-hidden'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  )
}


const MobileSidebar = () => {
  const { isSidebarOpen, LightMode } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
    dispatch(setOpenProfile(false))
  };

  // Make slide bar disappear when mMobileMenu is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-[3px] z-40 xl:hidden"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            initial={{ x: "-100%", scale: 0.98 }}
            animate={{ x: 0, scale: 1 }}
            exit={{ x: "-100%", scale: 0.98 }}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <motion.div
            onClick={() => dispatch(setOpenProfile(false))}
            className={`
              fixed top-0 left-0 h-full w-3/4 sm:w-1/2 z-50 xl:hidden
              ${LightMode ? "bg-white shadow-lg" : "bg-[#2a2a2a] shadow-xl"}
            `}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <Sidebar />

            {/* Close button */}
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4"
            >
              <i
                className={`
                  ${LightMode ? "text-gray-600" : "text-white"}
                  fa-solid fa-x text-2xl hover:scale-105 cursor-pointer
                `}
              />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function App() {
  const { LightMode } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // Socket.io Online/Offline connection
  useEffect(() => {

    // Request current online users
    socket.emit("getOnlineUsers");

    // Listen for updates
    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.off("onlineUsers");
    };

  }, [dispatch]);


  // Socket.io real time notification update
  useEffect(() => {

    // TASK
    socket.on("taskCreated", () => {
      dispatch(incrementTaskNotifications());
    });

    // LEAVE
    socket.on("leaveCreated", () => {
      dispatch(incrementLeaveNotifications());
    });

    return () => {
      socket.off("taskCreated");
      socket.off("leaveCreated");
    };

  }, [dispatch]);

  
  return (
    <>
      <main 
        className={`
          ${LightMode
            ? "bg-black/10"
            : "bg-[#3D3D3D]"
          }
          w-full min-h-screen transition-colors duration-300 ease-in-out
        `}>
          <Routes>
            <Route element={<Layout />}>
              <Route index path="/" element={<Navigate to='/dashboard' />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookings" element={<Bookings />} />

              <Route path="/tasks" element={<Tasks />} />
              <Route path="/completed/:status" element={<Tasks />} />
              <Route path="/in-progress/:status" element={<Tasks />} />
              <Route path="/todos/:status" element={<Tasks />} />

              <Route path="/team" element={<Users />} />
              <Route path="/trashed" element={<Trash />} />
              <Route path="/leaves" element={<LeaveRequest />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/scheduler" element={<SchedulerPage />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/status" element={<Status />} />

            </Route>

            <Route path="/log-in" element={<Login />} />
          </Routes>

          <Toaster richColors position='top-right'/>
      </main>
    </>
  )
}

export default App
