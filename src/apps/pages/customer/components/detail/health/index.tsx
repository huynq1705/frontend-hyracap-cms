import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as echarts from "echarts";
export interface HealthCustomerPageProps {}

export default function HealthCustomerPage(props: HealthCustomerPageProps) {
  const { code } = useParams();
  return (
    <div>
      {/* header */}
      <Box
        className="pb-4 flex justify-between items-center"
        sx={{
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        <h3 className="">
          Tình trạng cải thiện sức khỏe khách hàng theo các vùng
        </h3>
      </Box>
      {/* content */}
      <Box
        className="flex flex-wrap px-2 items-center mt-4"
        sx={{
          maxHeight: "calc(100vh - 380px)",
          overflowY: "auto",
          gap: "24px",
        }}
      >
        <ChartColLine />
      </Box>
    </div>
  );
}
const ChartColLine: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current);

     const option = {
       tooltip: {
         trigger: "axis",
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
       toolbox: {
         feature: {
           saveAsImage: {},
         },
       },
       xAxis: {
         type: "category",
         boundaryGap: false,
         data: ["5", "10", "15", "20", "25", "30", "35", "40"],
       },
       yAxis: {
         type: "value",
       },
       series: [
         {
           name: "Đau đầu",
           type: "line",
           data: [15, 12, 17, 10, 12, 13, 9, 10],
           color: "#E69F00",
         },
         {
           name: "Đau lưng",
           type: "line",
           data: [10, 12, 20, 15, 25, 18, 19, 16],
           color: "#56B4E9",
         },
         {
           name: "Đau chân",
           type: "line",
           data: [15, 22, 30, 25, 30, 28, 26, 25],
           color: "#009E73",
         },
         {
           name: "Đau eo",
           type: "line",
           data: [30, 28, 35, 38, 40, 45, 50, 48],
           color: "#CC79A7",
         },
         {
           name: "Đau tay",
           type: "line",
           data: [5, 8, 10, 9, 12, 10, 11, 9],
           color: "#F0E442",
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

  return <Box ref={chartRef} className=" w-full lg:w-4/5 min-h-[320px] h-fit"></Box>;
};
