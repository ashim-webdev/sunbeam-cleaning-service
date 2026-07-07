import { ClipboardCheck } from "lucide-react";
import { FaBroom } from "react-icons/fa";
import { useSelector } from "react-redux";

const DashboardLoader = () => {
  const { LightMode } = useSelector((state) => state.auth);
  return (
    <div className={`
      ${LightMode ? "bg-white" : "bg-black"}
      fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-colors ease-in-out duration-300
    `}>
      {/* Logo */}
      <div className='flex gap-2 items-center'>
        <div className={`${LightMode ? "shadow-darkSM border-blue-900 bg-blue-900/30" : "shadow-lightSM border-white bg-blue-600"} p-2 rounded-full border transition-all duration-300 ease-in-out`}>
          <ClipboardCheck className={`w-6 h-6 transition-colors ease-in-out duration-300 ${LightMode ? " text-blue-900" : "text-white"}`} />
        </div>
        <span className={`relative flex justify-center items-center gap-1 text-2xl font-bold transition-colors ease-in-out duration-300 ${LightMode ? " text-blue-900" : "text-white"} `}>
          <span>TaskMe</span>
          <span><FaBroom className='w-6 h-6' /></span>
          <svg
            className="absolute top-7.5 left-0 w-30 -rotate-6"
            viewBox="0 0 300 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 10C60 4 160 1 298 6"
              stroke={`${LightMode ? "#009c05" : "#2B62F5"}`}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      {/* Loader */}
      <div className="mt-4">
        <div className={`
          ${LightMode ? "border-t-blue-700" : "border-t-[#005FFB]"}
          w-10 h-10 border-[5px] border-blue-200 rounded-full animate-spin
        `}></div>
      </div>

      <p className={`
        ${LightMode ? "text-black/70" : "text-white/70"}
        flex items-center text-lg font-medium mt-2 transition-all duration-300 ease-in-out
      `}>
        Preparing your workspace
        <span className="ml-1 flex">
          <span
            className="animate-dot inline-block"
            style={{ animationDelay: "0s" }}
          >
            .
          </span>
          <span
            className="animate-dot inline-block"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="animate-dot inline-block"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </span>
      </p>
    </div>
  );
};

export default DashboardLoader;