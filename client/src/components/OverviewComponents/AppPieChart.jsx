import { Label, Pie, PieChart } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { TrendingUp } from "lucide-react";

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

const chartData = [
  { title: "Todo", Total: 275, fill: "var(--color-todo)" },
  { title: "In Progress", Total: 200, fill: "var(--color-inProgress)" },
  { title: "Completed", Total: 287, fill: "var(--color-completed)" }
];

const AppPieChart = () => {
  const { LightMode }  = useSelector((state) => state.auth);


  // If you don't use React compiler use useMemo hook to improve performance
  const totalTotal = chartData.reduce((acc, curr) => acc + curr.Total, 0);
  

  const chartXYAxis = LightMode ? "#000000" : "#ffffff"
  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"

  return (
    <div className={`${text} ${changeAnimation}`}>
      <h1 className="text-lg font-medium mb-2 md:mb-16">Total Task Analytics</h1>
      
      <div className="mx-auto w-full h-full ">
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
      </div>
      <div className="mt-4 flex flex-col gap-2 items-center mb-10">
        <div className="flex items-center gap-2 font-medium leading-none">
          Monthly Task Overview <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Progression of task this month
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;
