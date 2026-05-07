import { motion } from "framer-motion";
import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";




export default function CircularProgressBar({
  progress,
  size = 180,
  strokeWidth = 14,
  gradientColors = ["#00f2ff", "#8a2be2"],
  trackColor,
  label,
  subLabel,
  textSize,
  className = "",
  animationDuration = 1.5,
}) {
  const { LightMode }  = useSelector((state) => state.auth);
  

  const gradientId = useId();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;


  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`} id={`progress-container-${gradientId}`}>
      <div 
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        {/* Background Glow */}
        <div 
          className="absolute inset-0 w-60  blur-[80px] rounded-full pointer-events-none"
        />

        <div className="rounded-full shadow-darkSM">
        <svg
          width={size}
          height={size}
          className="relative z-10 -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={gradientColors[0] || "#00f2ff"} />
              <stop offset="100%" stopColor={gradientColors[1] || gradientColors[0] || "#8a2be2"} />
            </linearGradient>
            
            {/* HUD Shadow/Glow Filter */}
            <filter id={`glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="rgba(0, 0, 0, 0)" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feOffset in="shadow" dx="0" dy="0" result="offset" />
              <feMerge>
                <feMergeNode in="offset" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            className="transition-colors duration-500"
          />

          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: animationDuration,
              ease: [0.22, 1, 0.36, 1], // Quintic transition
            }}
            strokeLinecap="round"
            filter={`url(#glow-${gradientId})`}
          />
        </svg>
        </div>

        {/* Center Text */}
        <div className={`${text} ${changeAnimation} absolute inset-0 flex flex-col items-center justify-center z-20`}>
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${textSize} font-bold tracking-tighter pr-0.5`}
          >
            {Math.round(progress)}
          </motion.span>
          <span className="text-[8px] font-mono tracking-[0.2em] uppercase mt-0.5">
            {label || "Processing"}
          </span>
          <span className="absolute -top-5 text-[10px] font-mono tracking-[0.3em]  uppercase opacity-80 mb-2 whitespace-nowrap">
            {subLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
