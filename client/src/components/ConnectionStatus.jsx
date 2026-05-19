import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Server, ServerCrash } from "lucide-react";

const ConnectionStatus = ({ isOnline }) => {
  const { LightMode, onlineUsers } = useSelector((state) => state.auth);

  const [onMount, setOnMount] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setOnMount(true)
    }, 1000);
  }, [onlineUsers])

  return (
    <>
      {onMount && (
        <div
          className={clsx(
            "flex items-center gap-2 px-2.5 py-1 mr-5 lg:mr-0 rounded-full w-fit transition-all duration-300 ease-in-out",
            LightMode ? 
              isOnline
                ? "sm:bg-green-100 sm:text-green-700"
                : "sm:bg-red-200/50 sm:text-red-600"
              :
              isOnline
                ? "sm:bg-green-500/30 sm:text-green-400"
                : "sm:bg-red-300/20 sm:text-red-600"
          )}
        >
          {/* Status Dot */}
          <span
            className={clsx(
              "w-2.5 h-2.5 mr-1 sm:mr-0 rounded-full animate-pulseOnline",
              isOnline ? "bg-green-500" : "bg-red-500"
            )}
          />

          {/* Status Text */}
          <span className="sm:block hidden text-[10px] font-semibold">
            {isOnline ? "Connected" : "Disconnected"}
          </span>

          <span className={`${LightMode ? "text-black" : "text-white"} sm:hidden mr-5`}>
            {isOnline ?
              <Server size={20} />
              : 
              <ServerCrash size={20} />
            }
          </span>
        </div>
      )}
    </>
  );
};

export default ConnectionStatus;