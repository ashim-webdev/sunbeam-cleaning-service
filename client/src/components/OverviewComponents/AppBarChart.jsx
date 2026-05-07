import clsx from "clsx";
import { useState, useEffect } from "react";
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
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell, // ✅ added
} from "recharts";
import { useDispatch, useSelector } from "react-redux";

import CircularBar from "../ui/circularBar";


const chartData = [
  { month: "November", thisYear: 90, lastYear: 80 },
  { month: "December", thisYear: 32, lastYear: 200 },
  { month: "January", thisYear: 92, lastYear: 100 },
  { month: "February", thisYear: 73, lastYear: 87 },
  { month: "March", thisYear: 97, lastYear: 99 },
  { month: "April", thisYear: 22, lastYear: 45 },
];

// ✅ this stays (you already did it correctly)
const coloredData = chartData.map((item) => {
  const thisVal = item.thisYear;
  const lastVal = item.lastYear;

  const thisYearColor =
    thisVal > lastVal ? "#22c55e" : thisVal < lastVal ? "#ef4444" : "gray";

  const lastYearColor =
    thisVal > lastVal ? "#ef4444" : thisVal < lastVal ? "#22c55e" : "gray";

  return {
    ...item,
    thisYearColor,
    lastYearColor,
  };
});

// ❌ removed color from here (important)
const chartConfig = {
  thisYear: {
    label: "This Year",
    color: "#60A5FA",
  },
  lastYear: {
    label: "Last Year",
    color: "#3B82F6",
  },
};

const lastYearValue = chartData.length
  ? chartData[chartData.length - 1].lastYear
  : null;

const thisYearValue = chartData.length
  ? chartData[chartData.length - 1].thisYear
  : null;

const lastYear = {
  progress: lastYearValue,
  size: 100,
  strokeWidth: 15,
  textSize: "text-xl",
  colorOne: "#00f2ff",
  colorTwo: "#8a2be2",
  trackColor: "#00f2ff",
  subLabel: "Last Year",
};

const thisYear = {
  progress: thisYearValue,
  size: 100,
  strokeWidth: 15,
  textSize: "text-xl",
  colorOne: "#00f2ff",
  colorTwo: "#8a2be2",
  trackColor: "#00f2ff",
  subLabel: "This Year",
};


const CustomTooltip = ({ active, payload, label }) => {
  const { LightMode }  = useSelector((state) => state.auth);
  
  if (!active || !payload || !payload.length) return null;

  const thisYear = payload.find((p) => p.dataKey === "thisYear")?.value;
  const lastYear = payload.find((p) => p.dataKey === "lastYear")?.value;

  const isThisHigher = thisYear > lastYear;

  const bg = LightMode ? "bg-white shadow-darkSM" : "bg-black/80 shadow-lightSM"
  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"


  return (
    <div className={`${bg} ${text} ${changeAnimation} border rounded-md p-3 text-sm`}>
      <p className="font-medium mb-2">{label}</p>

      <div className="flex justify-between gap-4">
        <span className="flex justify-between gap-2 items-center">
          <span
            className={clsx(
              "w-4 h-4 rounded-full flex items-center justify-center shadow-inner",
              isThisHigher ? "bg-green-500" : "bg-red-500"
            )}
          /> 
          <span><span className="mr-4">This Year:</span> {thisYear}</span>
          <span>{isThisHigher ? <TrendingUp className={isThisHigher ? "text-green-500" : "text-red-500"} /> : <TrendingDown className={isThisHigher ? "text-green-500" : "text-red-500"} />}</span>
        </span>
      </div>

      <div className="flex justify-between gap-4 mt-1">
        <span className="flex justify-between items-center gap-2">
          <span
            className={clsx(
              "w-4 h-4 rounded-full flex items-center justify-center shadow-inner",
              !isThisHigher ? "bg-green-500" : "bg-red-500"
            )}
          /> 
          <span><span className="mr-4">Last Year:</span> {lastYear}</span>
          <span>{!isThisHigher ? <TrendingUp className={!isThisHigher ? "text-green-500" : "text-red-500"} /> : <TrendingDown className={!isThisHigher ? "text-green-500" : "text-red-500"} />}</span>
        </span>
      </div>
    </div>
  );
};

const AppBarChart = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const chartXYAxis = LightMode ? "#000000ca" : "#ffffffeb"
  const text = LightMode ? "text-black" : "text-white"
  const changeAnimation = "transition-all duration-300 ease-in-out"

  return (
    <>
      <div className={`${text} ${changeAnimation}`}>
        <h1 className="text-lg font-medium mb-6">Task Comparison</h1>

        <div className="h-full w-full">
          <ChartContainer config={chartConfig}>
            {/* ✅ use coloredData here */}
            <BarChart data={coloredData}>
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

              {/* <ChartTooltip 
                cursor={{ fill: LightMode ? "#00000010" : "#eac80a" }}
                content={<CustomTooltip />}
              /> */}
              <Tooltip
                cursor={{
                  fill: LightMode ? "rgba(0,0,0,0.1)" : "#3B82F620"
                }}
                content={<CustomTooltip />}
              />
              <ChartLegend content={<ChartLegendContent />} />

              {/* ✅ THIS MONTH BAR */}
              <Bar dataKey="thisYear" radius={4} fill="#4CAF50">
                {coloredData.map((entry, index) => (
                  <Cell
                    key={`this-${index}`}
                    fill={entry.thisYearColor}
                  />
                ))}
              </Bar>

              {/* ✅ LAST MONTH BAR */}
              <Bar dataKey="lastYear" radius={4} fill="#D30055">
                {coloredData.map((entry, index) => (
                  <Cell
                    key={`last-${index}`}
                    fill={entry.lastYearColor}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      <div className="px-6 mb-2 w-full flex justify-center items-center">
        <div className="w-full h-0.5 bg-linear-to-l from-blue-400/10 via-blue-500 to-blue-400/10 mt-6" />
      </div>

      <div className="w-full h-40 p-2 flex justify-center items-center gap-12">
        <CircularBar {...lastYear} label="Total" />
        <CircularBar {...thisYear} label="Total" />
      </div>
    </>
  );
};

export default AppBarChart;