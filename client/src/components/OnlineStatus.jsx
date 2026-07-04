import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { Server, ServerCrash } from "lucide-react";

const OnlineStatus = ({ isOnline, type }) => {
  const { LightMode } = useSelector((state) => state.auth);

  return (
    <div className={`${LightMode ? "bg-white" : "bg-black"} flex items-center justify-center rounded-full mr-5 transition-all duration-300 ease-in-out`}>
      <div
        className={clsx(
          "flex items-center justify-center gap-2 px-2.5 py-0.5 rounded-full w-fit transition-all duration-300 ease-in-out",
          LightMode ? 
            isOnline
              ? "bg-green-100 text-green-700"
              : `${type === "Overview" ? "bg-red-200" : "bg-red-200/50"} text-red-600`
            :
            isOnline
              ? "bg-green-500/30 text-green-400"
              : `${type === "Overview" ? "bg-red-200" : "bg-red-200/30"} text-red-600`,
          LightMode ? "shadow-darkSM" : "border border-white"
        )}
      >
        {/* Status Dot */}
        <span
          className={clsx(
            "w-1 h-1 mr-1 sm:mr-0 rounded-full animate-pulseOnline",
            isOnline ? "bg-green-500" : "bg-red-500"
          )}
        />

        {/* Status Text */}
        <span className="text-[8px] font-semibold pt-0.5">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default OnlineStatus;