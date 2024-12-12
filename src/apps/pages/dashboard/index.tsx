import React, { useState } from "react";
import { getCurrentMonthStartAndEnd } from "@/utils";
import StatusCardV2 from "@/components/status-card/index-v2";
import ChartDashboard from "./chart-col";
import { Box } from "@mui/material";
import ChartDashboardV2 from "./chart-col/index-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DashboardGroupStatistic from "./groupStatistic";
import DashboardStaffStatistic from "./staffStatistic";
export interface HomePageProps {}
const LIST_CARD_1 = [
    {
        key: "year",
        label: "Cả năm",
        value: "77.000.000 vnđ",
    },
    {
        key: "month",
        label: "Tháng này",
        value: "3.500.000 vnđ",
    },
    {
        key: "day",
        label: "Hôm nay",
        value: "200.000 vnđ",
    },
];

const LIST_CARD_2 = [
    {
        key: "month",
        label: "Tháng này",
        value: "21",
    },
    {
        key: "three-day",
        label: "Ba ngày gần nhất",
        value: "12",
    },
    {
        key: "day",
        label: "Hôm nay",
        value: "2",
    },
];
const LIST_CARD_3 = [
    {
        key: "year",
        label: "Tổng lịch hẹn",
        value: "21",
        color: "#BF3DD9",
    },
    {
        key: "month",
        label: "Đặt hẹn",
        value: "12",
        color: "#BF3DD9",
    },
    {
        key: "day",
        label: "Đặt online",
        value: "2",
        color: "#BF3DD9",
    },
    {
        key: "day",
        label: "Đã đến",
        value: "2",
        color: "#0D63F3",
    },
    {
        key: "day",
        label: "Đang dịch vụ",
        value: "2",
        color: "#DE8208",
    },
];
export default function HomePage(props: HomePageProps) {
    const { end, start } = getCurrentMonthStartAndEnd();
    const [date, setDate] = useState({
        from: start,
        to: end,
    });
    return (
        <Box
            className="px-5 py-6 overflow-y-auto w-full"
            sx={{
                maxHeight: "calc(100vh - 100px)",
            }}
        >
            <h2 className="text-2xl">Tổng quan</h2>
            <div className="w-full flex gap-5 mt-6">
                <div className="flex flex-col gap-4 rounded-xl flex-grow">
                    <div className="rounded-xl bg-white flex-grow p-4 shadow">
                        <ChartDashboard />
                    </div>
                </div>
                <div className="w-1/4 flex flex-col gap-4 !min-w-[320px]">
                    {/*  */}
                    <DashboardGroupStatistic />
                    {/*  */}
                    <div className="rounded-xl bg-white  p-4  shadow">
                        <DashboardStaffStatistic />
                    </div>
                </div>
            </div>
        </Box>
    );
}
