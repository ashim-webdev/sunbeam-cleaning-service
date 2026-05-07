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
import CircularBar from "../ui/circularBar";


const Loading = () => (
    <>
      <div className="dot-spinner transition-colors duration-300 ease-in-out animate-UpDown">
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




const ProfileInfo = ({ userProfileData }) => {
  const [swap, setSwap] = useState(false);
  const { LightMode }  = useSelector((state) => state.auth);

  // console.log(userProfileData)

  useEffect(() => {
    setSwap(true)
    setTimeout(() => {
      setSwap(false)
    }, 1000);
  }, [userProfileData])


  const chartConfig = {
    todo: {
      label: !userProfileData ? <Loading /> : "Todo",
      color: "#0004ff",
    },
    completed: {
      label: !userProfileData ? <Loading /> : "Completed",
      color: "#4CAF50",
    },
    InProgress: {
      label: !userProfileData ? <Loading /> : "In Progress",
      color: "#FFA500",
    },
  };



  const chartData = userProfileData?.chartData || [];
  // console.log(chartData)

  const lastItem = chartData[chartData.length - 1];

  const todoValue = lastItem?.todo || 0;
  const inProgressValue = lastItem?.InProgress || 0;
  const inCompletedValue = lastItem?.completed || 0;


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
  const changeAnimation = "transition-all duration-300 ease-in-out"
  const chartXYAxis = LightMode ? "#000000ca" : "#ffffffeb"


  return (
    <div className="overflow-x-hidden flex justify-center items-center">
      <div className="p-1.5">
        <div className="h-70 w-full p-2.5 rounded-xl lex justify-between items-center">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`${text} ${changeAnimation} text-lg font-medium`}>{userProfileData?.name}</h1>

            {userProfileData && (
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
                      className={`${userProfileData?.isActive ? "bg-green-600" : "bg-red-600"} text-white text-md shadow-darkSM`}
                    >
                      {userProfileData?.isActive ? "Active" : "Disabled"}
                    </Badge>            
                  </motion.span>
                </AnimatePresence>
              )
            )}
          </div>

          {userProfileData ? 
            <div className={`${text} ${changeAnimation} h-full w-full pt-6  `}>
              <ChartContainer config={chartConfig}>
                <AreaChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} className="bg-orange-200"/>
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
          {userProfileData ? (
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
          {userProfileData ? (
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
          {userProfileData ? (
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
      </div>
    </div>
  );
};

export default ProfileInfo;