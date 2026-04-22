import { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../../utils/index";
import img2 from "../../img/m2.jpg"


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






const AppAreaChart = () => {
  const [swap, setSwap] = useState(false);
  const { LightMode, SelectUserDashInfo }  = useSelector((state) => state.auth);

  const selectedUser = useSelector((state) => state.auth.SelectUserDashInfo)

  console.log(SelectUserDashInfo)

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
    InProgress: {
      label: !selectedUser ? <Loading /> : "In Progress",
      color: "#FFA500",
    },
    completed: {
      label: !selectedUser ? <Loading /> : "Completed",
      color: "#4CAF50",
    },
  };

  const chartData = [
    { month: "January", todo: 1, InProgress: 80, completed: 266 },
    { month: "February", todo: 305, InProgress: 200, completed: 205 },
    { month: "March", todo: 237, InProgress: 120, completed: 357 },
    { month: "April", todo: 73, InProgress: 190, completed: 263 },
    { month: "May", todo: 209, InProgress: 130, completed: 339 },
    { month: "June", todo: 214, InProgress: 140, completed: 354 },
  ];

  return (
    <div className="h-full w-full ">
      <h1 className="text-lg font-medium mb-6">Employee Task Analytics</h1>

        {selectedUser ? (
          swap ? (
            <span className="flex justify-center items-center">
              <Loading />
            </span>
            
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center gap-2"
                >
                <div 
                  key={selectedUser._id} 
                  className={`outline-0 border-2 ${selectedUser.isActive ? "border-green-600" : "border-red-600"} w-9 h-9 2xl:w-13 2xl:h-13 flex items-center justify-center rounded-full bg-[#005FFB] hover:bg-blue-800 hover:shadow-innerWH cursor-pointer transition-all hover:scale-105 ease-in-out duration-300 shadow-inner overflow-hidden`}
                >
                <span  className='text-white font-semibold '>
                  {selectedUser?.img ? 
                    <img
                      src={selectedUser?.img}
                      className="h-full w-full rounded-full object-cover"
                    />
                    :
                    <span>
                      {getInitials(selectedUser?.name)}
                    </span>
                  }
                  </span>
                </div> 
                <span className="font-semibold italic">
                  {selectedUser?.name}
                </span>
              </motion.div>
            </AnimatePresence>
          )

        ) 
          :
          <div className="flex justify-center items-center gap-2">
            <span>Loading</span>
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
          </div>
        }

      <div className="h-full w-full pt-6">
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
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
              dataKey="InProgress"
              type="natural"
              fill="url(#fillInProgress)"
              fillOpacity={0.4}
              stroke="var(--color-InProgress)"
              stackId="a"
              margin={{ top: 20 }}
            />
            <Area
              dataKey="todo"
              type="natural"
              fill="url(#fillTodo)"
              fillOpacity={0.4}
              stroke="var(--color-todo)"
              stackId="a"
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
    </div>
  );
};

export default AppAreaChart;
