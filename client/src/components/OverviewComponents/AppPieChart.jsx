import { useState, useEffect } from "react";
import { Label, Pie, PieChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux";
import { useGetDashboardStatsQuery } from "../../redux/slices/api/taskApiSlice";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";
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
  Total: {
    label: "Total",
  },
  todo: {
    label: "Todo",
    color: "#0004ff",
  },
  inProgress: {
    label: "inProgress",
    color: "#FFA500",
  },
  completed: {
    label: "Completed",
    color: "#4CAF50",
  },
};


const AppPieChart = () => {
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


  const chartData = [
    { title: "Todo", Total: summary?.tasks?.todo, fill: "var(--color-todo)" },
    { title: "In Progress", Total: summary?.tasks["in progress"], fill: "var(--color-inProgress)" },
    { title: "Completed", Total: summary?.tasks?.completed, fill: "var(--color-completed)" }
  ];


  // If you don't use React compiler use useMemo hook to improve performance
  const totalTotal = chartData.reduce(
    (acc, curr) => acc + (curr.Total || 0),
    0
  );


  // Circular Chart
  const priorityOrder = {
    high: 1,
    medium: 2,
    normal: 3,
    low: 4,
  };

  const priorityData =
    [...(summary?.graphData || [])].sort(
      (a, b) => priorityOrder[a.name] - priorityOrder[b.name]
    );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;



  // Styles
  const chartXYAxis = LightMode ? "#000000" : "#ffffff"
  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"
  
  if (!isLoading && totalTotal === 0) {
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
      <div>
        <div className={`${text} ${changeAnimation}`}>
          <h1 className="text-lg font-medium mb-2">Total Task Analytics</h1>
            
        {isLoading ? (
          <div className="h-90 flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 60,
                  damping: 14,
                  mass: 1.2,
                }}
                className="mx-auto w-full h-full "
                >
                <ChartContainer
                  config={chartConfig}
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="Total"
                      nameKey="title"
                      innerRadius={60}
                      strokeWidth={5}
                      tick={{
                        fill: `${chartXYAxis}`
                      }}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={`${chartXYAxis}`}
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="text-3xl font-bold"
                                >
                                  {totalTotal.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Total
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex flex-col gap-2 items-center mb-6">
              <div className="flex items-center gap-2 font-medium leading-none">
                Current Month Task Overview <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className={`${LightMode ? "text-gray-600" : "text-gray-400"} leading-none text-center transition-all duration-300 ease-in-out`}>
                Progression of task this month & priority stages
              </div>
            </div>
          </>
        )}
        </div>
      </div>


      <div className="px-12 mt-4 mb-10 w-full flex justify-center items-center">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10" />
      </div>

      <div className="w-full p-2 flex flex-wrap justify-center items-center gap-8 mb-2">
        {isLoading ? (
          <>
            <Loading />
            <Loading />
            <Loading />
            <Loading />
          </>
        ) : (
          <AnimatePresence>
            {priorityData.map((item, index) => {
              const directions = [
                { x: -80, y: 0 }, // High -> from left
                { x: 0, y: 80 }, // Medium -> from bottom
                { x: 0, y: 80 },  // Normal -> from bottom
                { x: 80, y: 0 },  // Low -> from right
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
                    size={80}
                    strokeWidth={10}
                    textSize="text-xl"
                    gradientColors={["#00f2ff", "#8a2be2"]}
                    trackColor="#00f2ff"
                    label="Tasks"
                    subLabel={item.name}
                    icon={ICONS[item.name]}
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

export default AppPieChart;
