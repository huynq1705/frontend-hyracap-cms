import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { color } from "framer-motion";

const ChartDashboardV2: React.FC = () => {
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
          right: "25%",
          bottom: "3%",
          containLabel: true,
        },
        legend: {
          orient: "vertical",
          right: "0%", // Position the legend on the right side
          top: "center",
          show: true,
          itemWidth: 16, // Adjust the size of the legend symbols
          itemHeight: 16,
          textStyle: {
            fontSize: 14, // Adjust the font size of the legend text
          },
        },
        xAxis: [
          {
            type: "category",
            data: [],
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
            name: "Massage trị liệu cổ vai gáy",
            type: "bar",
            barWidth: "10%",
            data: [60],
            color: "#E69F00",
          },
          {
            name: "Chăm sóc da chuyên sâu",
            type: "bar",
            barWidth: "10%",
            data: [15],
            color: " #56B4E9",
          },
          {
            name: "Meso cá hồi",
            type: "bar",
            barWidth: "10%",
            data: [40],
            color: "#009E73",
          },
          {
            name: "Điều trị thoái hóa đốt sống cổ",
            type: "bar",
            barWidth: "10%",
            data: [50],
            color: "#0072B2",
          },
          {
            name: "Triệt lông chân",
            type: "bar",
            barWidth: "10%",
            data: [35],
            color: "#CC79A7",
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

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default ChartDashboardV2;
