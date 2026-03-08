import { Transition } from "@headlessui/react";
import { Fragment, useRef, useEffect } from "react";
import { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar,  } from "./redux/slices/authSlice";
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



function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { LightMode } = useSelector((state) => state.auth);

  // const { user } = useSelector((state) => state.auth);

  const user = true;

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

  return user ? (
    <div className={`
      ${LightMode 
        ? "bg-white/10"
        : "bg-[#3D3D3D]"
      }
      w-full h-screen flex flex-col md:flex-row transition-colors ease-in-out duration-300
    `}>
      <div className='w-1/5 lg:w-3.5/4 h-screen sticky top-0 hidden lg:block'>
        <Sidebar />
      </div>

      <div className="z-200">
      <MobileSidebar />
      </div>

      <div ref={containerRef} className='flex-1 overflow-y-auto'>
        <Navbar isScrolled={isScrolled}/>

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  )
}


const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const { LightMode } = useSelector((state) => state.auth);
  
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();


  // Sidebar Smooth Delay Timeout
  const closeSidebar = () => {
    setTimeout(() => {
      dispatch(setOpenSidebar(false));
    }, 50);
  };
  // End

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-all duration-500 ease-out"
        enterFrom="opacity-0 -translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-500 ease-in"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 -translate-x-full"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            onClick={() => closeSidebar()}
            
          >
            <div className={`
                
                fixed top-0 left-0 lg:hidden w-full h-screen transition-colors ease-in-out duration-300 overflow-auto
              `}>
              <div className=' md:w-full h-full'>
                <div className={`
                    ${LightMode 
                      ? "shadow-dark"
                      : "shadow-light"
                    }
                    absolute top-0 sm:w-1/2 w-3/4
                  `}>
                  <Sidebar />

                  <div className='absolute top-2.5 right-3 w-full flex justify-end px-5 pt-4'>
                    <button
                      onClick={() => closeSidebar()}
                      className='flex justify-end items-end'
                    >
                      <i className={`
                          ${LightMode 
                            ? "text-gray-500 hover:text-gray-600"
                            : "text-white"
                          }
                          fa-solid fa-x text-2xl cursor-pointer transition-transform ease-in-out duration-200 hover:scale-105 z-10`
                        }></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};


function App() {

  return (
    <>
      <main className="w-full min-h-screen bg-[#f3f4f6]">
        <Routes>
          <Route element={<Layout />}>
            <Route index path="/" element={<Navigate to='/dashboard' />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tasks" element={<Tasks />} />
            <Route path="/completed/:status" element={<Tasks />} />
            <Route path="/in-progress/:status" element={<Tasks />} />
            <Route path="/todos/:status" element={<Tasks />} />

            <Route path="/team" element={<Users />} />
            <Route path="/trashed" element={<Trash />} />
            <Route path="/leave-request" element={<LeaveRequest />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/scheduler" element={<SchedulerPage />} />

          </Route>

          <Route path="/log-in" element={<Login />} />
        </Routes>

        <Toaster richColors position='top-right'/>
      </main>
    </>
  )
}

export default App
