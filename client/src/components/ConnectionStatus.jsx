import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

const ConnectionStatus = () => {
  const { LightMode } = useSelector((state) => state.auth);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
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

      <span className="sm:hidden mr-5">
        {isOnline ?
          <i className="fa-solid fa-plug-circle-check"></i>
          : 
          <i className="fa-solid fa-plug-circle-exclamation"></i>
        }
      </span>
    </div>
  );
};

export default ConnectionStatus;