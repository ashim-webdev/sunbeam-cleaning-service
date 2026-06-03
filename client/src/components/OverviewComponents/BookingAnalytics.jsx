import clsx from "clsx";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tooltip } from "recharts";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell, // ✅ added
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../redux/slices/api/taskApiSlice";
import CircularBar from "../ui/circularBar";




const Loading = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <>
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
    </>
  )
}



const BookingAnalytics = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const {
    data: summary,
    isLoading,
    refetch,
  } = useGetDashboardStatsQuery(
    {
      refetchOnMountOrArgChange: true,
    }
  );

  
  const bookingAnalytics = summary?.bookingAnalytics;

  console.log(bookingAnalytics)


  const completionData = [
    {
      name: "Last Month",
      total: bookingAnalytics?.lastMonth || 0,
    },
    {
      name: "This Month",
      total: bookingAnalytics?.thisMonth || 0,
    },
  ];



  // Refetch Data immediately after mid night every ending of a month
  useEffect(() => {
    const now = new Date();

    const nextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      1
    );

    const timeout = nextMonth.getTime() - now.getTime();

    const timer = setTimeout(() => {
      refetch();
    }, timeout);

    return () => clearTimeout(timer);
  }, [refetch]);



  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const chartXYAxis = LightMode ? "#000000ca" : "#ffffffeb"
  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"


  if (
    !isLoading &&
    !bookingAnalytics?.lastMonth &&
    !bookingAnalytics?.thisMonth
  ) {
    return (
      <div
        className={`h-full flex flex-col justify-center items-center ${text} ${changeAnimation}`}
      >
        <h2 className="text-lg font-semibold">
          No data yet!
        </h2>

        <p className="text-sm opacity-70 mt-1">
          Create some tasks to see analytics.
        </p>
      </div>
    );
  }
  

  return (
    <div className={`w-full flex flex-col justify-center items-center gap-6 ${text} ${changeAnimation}`}>
      <div className={`w-full flex justify-center items-center`}>
        <h1 className="text-lg font-medium">Booking Comparison Analytics</h1>
      </div>

      <div className="w-40 -mt-4 flex justify-center items-center">
        <div className="bg-linear-to-l from-blue-400/10 via-blue-600 to-blue-400/10 w-full h-0.5" />
      </div>

      <div className="w-15 -mt-4 mb-3 flex justify-center items-center">
        <div className="bg-linear-to-l from-blue-400/10 via-blue-600 to-blue-400/10 w-full h-0.5" />
      </div>

      <div className="relative w-full p-2 flex flex-wrap justify-center items-center gap-18 mb-2">
        {isLoading ? (
          <>
            <Loading />
            <Loading />
          </>
        ) : (
          <AnimatePresence>
            {completionData.map((item, index) => {
              const directions = [
                { x: -80, y: 0 }, // left
                { x: 80, y: 0 },  // right
              ];

              return (
                <motion.div
                  key={item.name}
                  initial={{
                    opacity: 0,
                    ...directions[index],
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 14,
                    mass: 1.2,
                    delay: index * 0.12,
                  }}
                >
                <CircularBar
                  progress={item.total || 0}
                  size={100}
                  strokeWidth={12}
                  textSize="text-xl"
                  gradientColors={
                    index === 0
                      ? ["#6b7280", "#111827"]
                      : ["#292df5", "#0004ff"]
                  }
                  trackColor={
                    index === 0
                      ? "#9ea1a7"
                      : "#292cf563"
                  }
                  label="Total"
                  subLabel={item.name}
                  
                />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        <div className="absolute top-0 bottom-0 w-full flex justify-center items-center">
          <div className="bg-linear-to-t from-blue-400/10 via-blue-600 to-blue-400/10 h-16 w-0.5" />
        </div>
        <div className="absolute top-0 bottom-0 right-2 w-full flex justify-center items-center">
          <div className="bg-linear-to-t from-blue-400/10 via-blue-600 to-blue-400/10 h-12 w-0.5" />
        </div>
        <div className="absolute top-0 bottom-0 left-2 w-full flex justify-center items-center">
          <div className="bg-linear-to-t from-blue-400/10 via-blue-600 to-blue-400/10 h-12 w-0.5" />
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;