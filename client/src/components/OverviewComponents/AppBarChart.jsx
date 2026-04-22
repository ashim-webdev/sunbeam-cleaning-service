import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  thisMonth: {
    label: "Last Month",
    color: "#FF4C4C",
  },
  lastMonth: {
    label: "This Month",
    color: "#4CAF50",
  },
};

const chartData = [
  { month: "January", thisMonth: 186, lastMonth: 80 },
  { month: "February", thisMonth: 305, lastMonth: 200 },
  { month: "March", thisMonth: 237, lastMonth: 120 },
  { month: "April", thisMonth: 73, lastMonth: 190 },
  { month: "May", thisMonth: 209, lastMonth: 130 },
  { month: "June", thisMonth: 214, lastMonth: 140 },
];

const AppBarChart = () => {
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Total Revenue</h1>
      <div className="h-full w-full">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
            <Bar dataKey="thisMonth" fill="var(--color-thisMonth)" radius={4} />
            <Bar dataKey="lastMonth" fill="var(--color-lastMonth)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AppBarChart;
