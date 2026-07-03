import { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Badge } from "../ui/badge";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../redux/slices/api/taskApiSlice";
import { getInitials } from "../../utils/index";
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



const AppAreaChart = () => {
  const [swap, setSwap] = useState(false);
  const { LightMode, selectedUserInfo}  = useSelector((state) => state.auth);
  
  const {
    data: summary,
  } = useGetDashboardStatsQuery(
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // console.log("selectedUserInfo", selectedUserInfo)

  const selectedUser = selectedUserInfo || null;

  const selectedUserStats =
    summary?.users?.find(
      (user) => user._id === selectedUser?._id
    ) || null;


  useEffect(() => {
    setSwap(true)
    setTimeout(() => {
      setSwap(false)
    }, 1000);
  }, [selectedUser])


  const chartConfig = {
    todo: {
      label: !selectedUser ? <Loading /> : "Todo",
      color: "#0004ff",
    },
    completed: {
      label: !selectedUser ? <Loading /> : "Completed",
      color: "#4CAF50",
    },
    InProgress: {
      label: !selectedUser ? <Loading /> : "In Progress",
      color: "#FFA500",
    },
  };


  const chartData = selectedUserStats?.chartData || [];

  const todoValue =
    selectedUserStats?.summary?.todo || 0;

  const inProgressValue =
    selectedUserStats?.summary?.inProgress || 0;

  const inCompletedValue =
    selectedUserStats?.summary?.completed || 0;


  const todo = {
  progress: todoValue,
  size: 90,
  strokeWidth: 12,
  textSize: "text-xl",
  trackColor: "#00f2ff",
  subLabel: "Todo",
  gradientColors: ["#0004ff", "#0004ff"],
};

  const inProgress = {
  progress: inProgressValue,
  size: 90,
  strokeWidth: 12,
  textSize: "text-xl",
  gradientColors: ["#FBBF24", "#FFA500"],
  trackColor: "#00f2ff",
  subLabel: "In Progress",
};

  const completed = {
  progress: inCompletedValue,
  size: 90,
  strokeWidth: 12,
  textSize: "text-xl",
  gradientColors: ["#4CAF50", "#06af0c"],
  trackColor: "#00f2ff",
  subLabel: "Complete",
};


  const text = LightMode ? "text-black" : "text-white"
  const loadText = LightMode ? "text-black/60" : "text-white/60"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const chartXYAxis = LightMode ? "#000000ca" : "#ffffffeb"

  return (
    <>
      <div className="h-fit w-full">
        <div className="flex justify-between items-center">
          <h1 className={`${text} ${changeAnimation} text-lg font-medium`}>Employee Task Analytics</h1>

          {selectedUser && (
            swap ? (
              <span className="flex justify-center items-center pr-5">
                <Loading />
              </span>
              
            ) : (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge 
                    className={`${selectedUser?.isActive ? "bg-green-600" : "bg-red-600"} text-white text-md shadow-darkSM`}
                  >
                    {selectedUser?.isActive ? "Active" : "Disabled"}
                  </Badge>            
                </motion.span>
              </AnimatePresence>
            )
          )}
        </div>

          {selectedUser ? (
            swap ? (
              <span className="flex justify-center items-center my-7">
                <Loading />
              </span>
              
            ) : (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center items-center gap-2 my-5"
                  >
                  <div 
                    key={selectedUser._id} 
                    className={`outline-0 border-2 ${selectedUser.isActive ? "border-green-600" : "border-red-600"} w-9 h-9 2xl:w-13 2xl:h-13 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-300 shadow-inner overflow-hidden`}
                  >
                  <span  className='text-white font-semibold '>
                    {selectedUser?.profileImage ? 
                      <img
                        src={selectedUser?.profileImage}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full rounded-full object-cover"
                      />
                      :
                      <span>
                        {getInitials(selectedUser?.name || "Unknown User")}
                      </span>
                    }
                    </span>
                  </div> 
                  <span className={`${text} font-semibold italic`}>
                    {selectedUser?.name}
                  </span>
                </motion.div>
              </AnimatePresence>
            )
          ) 
            :
            <div className={`${loadText} flex justify-center items-center gap-2 my-7`}>
              <span>Loading</span>
              <Loading />
            </div>
          }

        {selectedUser ? 
          <div className={`${text} ${changeAnimation} h-full w-full pt-6`}>
            <ChartContainer config={chartConfig}>
              <AreaChart accessibilityLayer data={chartData}>
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                  <linearGradient id="fillTodo" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-todo)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-todo)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-InProgress)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-InProgress)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-completed)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-completed)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="todo"
                  type="natural"
                  fill="url(#fillTodo)"
                  fillOpacity={0.4}
                  stroke="var(--color-todo)"
                  stackId="a"
                />
                <Area
                  dataKey="InProgress"
                  type="natural"
                  fill="url(#fillInProgress)"
                  fillOpacity={0.4}
                  stroke="var(--color-InProgress)"
                  stackId="a"
                  margin={{ top: 20 }}
                />
                <Area
                  dataKey="completed"
                  type="natural"
                  fill="url(#fillCompleted)"
                  fillOpacity={0.4}
                  stroke="var(--color-completed)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
          :
          <div className="relative h-full w-full pt-6">
            <ChartContainer config={chartConfig}>
              <AreaChart accessibilityLayer data={chartData}>
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
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                  <linearGradient id="fillTodo" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-todo)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-todo)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-InProgress)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-InProgress)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-completed)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-completed)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="todo"
                  type="natural"
                  fill="url(#fillTodo)"
                  fillOpacity={0.4}
                  stroke="var(--color-todo)"
                  stackId="a"
                />
                <Area
                  dataKey="InProgress"
                  type="natural"
                  fill="url(#fillInProgress)"
                  fillOpacity={0.4}
                  stroke="var(--color-InProgress)"
                  stackId="a"
                  margin={{ top: 20 }}
                />
                <Area
                  dataKey="completed"
                  type="natural"
                  fill="url(#fillCompleted)"
                  fillOpacity={0.4}
                  stroke="var(--color-completed)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>

            <span className="absolute top-0 w-full h-full flex justify-center items-center gap-2 pb-15 text-stone-100">
              Click on an employee to see task Info <TrendingUp className="h-4 w-4 text-green-500" />
            </span>
          </div>
        }


      </div>
      
      <div className="px-6 mb-2 w-full flex justify-center items-center">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-6" />
      </div>

      <div className="w-full h-40 p-2 flex justify-center items-center gap-6 sm:gap-12">
        {selectedUser ? (
          swap ? (
            <span className="flex justify-center items-center my-7">
              <Loading />
            </span>
            
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center gap-2 my-7"
                >
                <CircularBar {...todo} label="Total" />
              </motion.div>
            </AnimatePresence>
          )

        ) 
          :
          <div className="flex ww-full justify-center items-center gap-2 my-7 mx-6">
            <Loading />
          </div>
        }
        {selectedUser ? (
          swap ? (
            <span className="flex justify-center items-center my-7">
              <Loading />
            </span>
            
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center gap-2 my-7"
                >
                <CircularBar {...inProgress} label="Total" />
              </motion.div>
            </AnimatePresence>
          )

        ) 
          :
          <div className="flex ww-full justify-center items-center gap-2 my-7 mx-6">
            <Loading />
          </div>
        }
        {selectedUser ? (
          swap ? (
            <span className="flex justify-center items-center my-7">
              <Loading />
            </span>
            
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center gap-2 my-7"
                >
                <CircularBar {...completed} label="Total" />
              </motion.div>
            </AnimatePresence>
          )

        ) 
          :
          <div className="flex ww-full justify-center items-center gap-2 my-7 mx-6">
            <Loading />
          </div>
        }
      </div>
    </>
  );
};

export default AppAreaChart;