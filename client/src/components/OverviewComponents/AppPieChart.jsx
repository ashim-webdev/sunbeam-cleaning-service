import { Label, Pie, PieChart } from "recharts";
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

  // If you don't use React compiler use useMemo hook to improve performance
  const totalTotal = chartData.reduce((acc, curr) => acc + curr.Total, 0);
  
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Total Task Analytics</h1>
      
      <div className="mx-auto w-full h-full">
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
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
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
      <div className="mt-4 flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total Total for the last 6 months
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;
