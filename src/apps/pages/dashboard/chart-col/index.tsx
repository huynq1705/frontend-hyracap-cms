import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
interface ChartDashboardProps {
  color?: string;
}
const ChartDashboard: React.FC<ChartDashboardProps> = (props) => {
  const { color = "#009E73" } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "T1",
              "T2",
              "T3",
              "T4",
              "T5",
              "T6",
              "T7",
              "T8",
              "T9",
              "T10",
              "T11",
              "T12",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "line",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220, 100, 2, 20, 29, 18, 800],
            itemStyle: {
              color, // Change this to the desired color
            },
          },
        ],
      };

      chartInstance.setOption(option);

      const handleResize = () => {
        chartInstance.resize();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chartInstance.dispose();
      };
    }
  }, []);

  return <Box ref={chartRef} className="w-full min-h-[400px] h-fit"></Box>;
};

export default ChartDashboard;
