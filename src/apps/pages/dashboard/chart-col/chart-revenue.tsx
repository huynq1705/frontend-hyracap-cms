import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import {
    selectIsNavHover,
    selectIsNavOpen,
} from "@/redux/selectors/navigation.slice";
import { formatCurrency } from "@/utils";
interface ChartDashboardProps {
    color?: string;
    data?: any;
}
const ChartDashboardRevenue: React.FC<ChartDashboardProps> = (props) => {
    const isNavOpen = useSelector(selectIsNavOpen);
    const isNavHover = useSelector(selectIsNavHover);

    const { color = "#009E73", data } = props;
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
                    // formatter: function (params: { name: string; value: number }[]) {
                    //   // Tùy chỉnh nội dung tooltip ở đây
                    //   return (
                    //     <div>
                    //       ${params[0].name}: ${formatCurrency(params[0].value)}
                    //     </div>
                    //   )
                    // },
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
                        axisLabel: {
                            formatter: "{value} vnđ", // Thay "Đơn vị" bằng đơn vị mà bạn muốn
                        },
                    },
                ],
                series: [
                    {
                        name: "Tổng :",
                        type: "line",
                        barWidth: "60%",
                        data: data,
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
            handleResize();
            setTimeout(() => {
                chartInstance.resize();
            }, 30);

            return () => {
                window.removeEventListener("resize", handleResize);
                chartInstance.dispose();
            };
        }
    }, [data, isNavOpen]);

    return <div ref={chartRef} className="w-auto min-h-[400px] h-fit"></div>;
};

export default ChartDashboardRevenue;
