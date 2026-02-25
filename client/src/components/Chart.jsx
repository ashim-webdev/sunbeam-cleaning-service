import React from "react";
import { Chart as ChartJS, defaults, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";
import { Bar, Pie } from "react-chartjs-2";
import { chartData } from "../assets/data";
import { pieData } from "../assets/data";



ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, ChartDataLabels)
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Chart = () => {
  const { LightMode } = useSelector((state) => state.auth);
  


  return (
    <div className={`
      App flex flex-col justify-center item-center gap-8 md:gap-4 md:flex-row transition-colors ease-in-out duration-300
    `}>
      <div className={`
          ${LightMode 
            ? "bg-transparent shadow-lg shadow-black/30"
            : "bg-transparent shadow-lg shadow-white/30 border border-white"
          }
          dataCard relative customerCard w-full md:w-[50%] transition-colors ease-in-out duration-300 h-90
        `}>
        <h3 className={`
            ${LightMode 
              ? "bg-[#E5E5E5]"
              : "bg-white"
            }
            absolute -top-5 left-5 text-md inline-block px-2 py-1 rounded-full text-gray-700 font-bold transition-colors ease-in-out duration-300
          `}>
          Chart by priority
        </h3>
        <Bar
          data={{
            labels: chartData.map((data) => data.name),
            datasets: [
              {
                label: "Count",
                data: chartData.map((data) => data.total),
                backgroundColor: [
                  "#FF4C4C",
                  "#FFA500",
                  "#0004ff",
                  "#4CAF50",
                ],
                borderRadius: 5,
                borderColor: LightMode ? "#fff" : "#ffffff",
                borderWidth: 2,
                scales: {
                  x: {
                    ticks:{color: "#0f172a"}
                  }
                }
              },
            ],
            animation: {
              duration: 300,
              easing: "easeInOutQuad",
              animateColor: true, 
            },
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Chart by Priority"
              },
              legend: {
                  display: false,
                },
              datalabels: {
                color: "#fff",
                font: {
                  weight: "bold",
                  size: 12,
                },
                align: "center",
                anchor: "center",
              },
            },
            scales: {
              x: {
                ticks: {
                  color: LightMode ? "#1f2937" : "#e5e7eb", // X-axis values color
                  font: {
                    size: 14,
                    weight: "500",
                  },
                },
                grid: {
                  color: LightMode ? "#d1d5db" : "#4b5563", // optional grid color
                },
              },
              y: {
                ticks: {
                  color: LightMode ? "#1f2937" : "#e5e7eb", // Y-axis values color
                  font: {
                    size: 14,
                    weight: "500",
                  },
                },
                grid: {
                  color: LightMode ? "#d1d5db" : "#4b5563", // optional grid color
                },
              },
            },
          }}
        />
      </div>
      
      <div className="flex justify-center items-center">
        <div
          className={`
            ${LightMode 
              ? "bg-transparent shadow-lg shadow-black/30"
              : "bg-transparent shadow-lg shadow-white/30 border border-white"
            }
            dataCard relative categoryCard w-full md:w-85 h-80 transition-colors ease-in-out duration-300
          `}
        >
          <h3 className={`
            ${LightMode 
              ? " bg-[#E5E5E5]"
              : "bg-white "
            }
            absolute -top-4 left-5 text-md inline-block px-2 py-1 rounded-full text-gray-700 font-bold transition-colors ease-in-out duration-300
          `}>Task Overview</h3>
          <Pie
            data={{
              labels: pieData.map((data) => data.name),
              datasets: [
                {
                  label: "Count",
                  data: pieData.map((data) => data.total),

                  backgroundColor: [
                    "#0050D7",
                    "#FF9900",
                    "#D30055",
                    "#007870",
                  ],
                  offset: (ctx) =>
                    ctx.dataIndex === 0 || ctx.dataIndex === 3 ? 20 : 0,

                  borderColor: LightMode ? "#D9D9D0" : "#ffffff",
                  borderWidth: 2,
                },
              ],
              animation: {
                duration: 300,
                easing: "easeInOutQuad",
                animateColor: true, 
              },
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
                datalabels: {
                  color: "#fff",
                  font: {
                    weight: "bold",
                    size: 8,
                  },
                  formatter: (value, context) => {
                    return `${context.chart.data.labels[context.dataIndex]}\n${value}`;
                  },
                  align: "center",
                  textAlign: "center",
                  anchor: "center",
                },

                // Optional title (you can remove if you want)
                title: {
                  display: true,
                  text: "Task Overview",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};


export default Chart
