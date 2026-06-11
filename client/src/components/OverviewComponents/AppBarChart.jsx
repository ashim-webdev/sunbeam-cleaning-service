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

// Label icons
const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardDoubleArrowDown />,
  normal: <MdKeyboardArrowDown />
};


  const chartConfig = {
    todo: { label: "Todo", color: "#0004ff" },
    inProgress: { label: "In Progress", color: "#FFA500" },
    completed: { label: "Completed", color: "#4CAF50" },
  }



const CustomTooltip = ({ active, payload, label }) => {
  const { LightMode } = useSelector((state) => state.auth);

  if (!active || !payload?.length) return null;

  const bg = LightMode ? "bg-white shadow-darkSM" : "bg-black/80 shadow-lightSM";
  const text = LightMode ? "text-black" : "text-white";

  return (
    <div className={`${bg} ${text} relative p-3 rounded-md text-sm px-4 transition-all duration-300 ease-in-out`}>
      <p className="text-center mb-2 font-extrabold">{label}</p>
      
      <div className="absolute top-0 right-0 left-0 px-1 w-full flex justify-center items-center">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/30 via-blue-600 to-blue-300/30" />
      </div>

      <p className="flex justify-start items-center gap-2">
        <span className="flex justify-center items-center">
          <span className='DuplicateDot bg-[#0004ff] w-3 h-3 px-1 rounded-full whitespace-nowrap shadow-inner' />
        </span>
        <span>
          Todo: {payload[0]?.payload?.todo}
        </span>
      </p>

      <p className="flex justify-start items-center gap-2">
        <span className="flex justify-center items-center">
          <span className='DuplicateDot bg-[#FFA500] w-3 h-3 px-1 rounded-full whitespace-nowrap shadow-inner' />
        </span>
        <span>
          In Progress: {payload[0]?.payload?.inProgress}
        </span>
      </p>

      <p className="flex justify-start items-center gap-2">
        <span className="flex justify-center items-center">
          <span className='DuplicateDot bg-[#4CAF50] w-3 h-3 px-1 rounded-full whitespace-nowrap shadow-inner' />
        </span>
        <span>
          Completed: {payload[0]?.payload?.completed}
        </span>
      </p>

    </div>
  );
};






const AppBarChart = () => {
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


  // console.log(summary)
  
  const monthlyData = summary?.generalChartData || [];

  const lastMonth = monthlyData[monthlyData.length - 2];
  const thisMonth = monthlyData[monthlyData.length - 1];

  const completionData = [
    {
      name: lastMonth?.month || "Last Month",
      total: lastMonth?.completed || 0,
    },
    {
      name: thisMonth?.month || "This Month",
      total: thisMonth?.completed || 0,
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


  if (!isLoading && monthlyData.length === 0) {
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
    <>
      <div className={`${text} ${changeAnimation}`}>
        <h1 className="text-lg font-medium mb-2">Task Comparison</h1>

        {isLoading ? (
          <div className="h-90 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 60,
                damping: 14,
                mass: 1.2,
              }}
              className="h-full w-full my-11">
              <ChartContainer config={chartConfig}>
                {/* ✅ use coloredData here */}
                <BarChart data={monthlyData}>
                  <CartesianGrid vertical={false} />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    tick={{
                      fill: `${chartXYAxis}`
                    }}
                  />

                  <YAxis 
                    tickLine={false}
                    tickMargin={10} 
                    axisLine={false}
                    tick={{
                      fill: `${chartXYAxis}`
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: LightMode ? "rgba(0,0,0,0.1)" : "#3B82F620"
                    }}
                    content={<CustomTooltip />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />

                  <Bar dataKey="todo" fill="#0004ff" radius={4} />
                  <Bar dataKey="inProgress" fill="#FFA500" radius={4} />
                  <Bar dataKey="completed" fill="#4CAF50" radius={4} />

                </BarChart>
              </ChartContainer>
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      <div className="px-12 mt-4 mb-10 w-full flex justify-center items-center">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
      </div>

      <div className="w-full p-2 flex flex-wrap justify-center items-center gap-8 mb-2">
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
                  strokeWidth={10}
                  textSize="text-xl"
                  gradientColors={
                    index === 0
                      ? ["#6b7280", "#111827"]
                      : ["#10b981", "#4CAF50"]
                  }
                  trackColor={
                    index === 0
                      ? "#9ca3af"
                      : "#bbf7d0"
                  }
                  label="Completed"
                  subLabel={item.name}
                  
                />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </>
  );
};

export default AppBarChart;