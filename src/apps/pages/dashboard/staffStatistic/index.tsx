import React, { useEffect, useMemo, useState } from "react";
import StatusCardV2 from "@/components/status-card/index-v2";
import moment from "moment";
import { formatDate } from "@/utils/date-time";
import DateSchedule from "../component/custom-datetime-picker";
import apiDashboardService from "@/api/apiDashboard.service";
import { formatCurrencyToNumber } from "@/utils";
export interface HomePageProps {}

export default function DashboardStaffStatistic(props: HomePageProps) {
    const { getStatisticStaff } = apiDashboardService();
    const [dashboardStatistic, setDashboardStatistic] = useState<any>();
    const [selectedDateStatistic, setSelectedDateStatistic] = useState(
        moment()
    );

    const fetchDashboardStatistic = async () => {
        const payload = {
            monthYear: selectedDateStatistic.format("MM-YYYY").toString(),
        };
        getStatisticStaff(payload)
            .then((res) => {
                if (res) {
                    console.log("res.data", res);
                    setDashboardStatistic(res.data);
                }
            })
            .catch((e) => {});
    };

    useEffect(() => {
        fetchDashboardStatistic();
    }, [selectedDateStatistic]);
    const LIST_CARD_3 = useMemo(() => {
        return [
            {
                key: "year",
                label: `Top 1: ${
                    dashboardStatistic?.[0]
                        ? dashboardStatistic[0]?.staff?.first_name +
                          dashboardStatistic[0]?.staff?.last_name
                        : "Chưa xác định"
                }`,
                value: `${
                    dashboardStatistic?.[0]
                        ? formatCurrencyToNumber(
                              dashboardStatistic[0]?.sales_revenue
                          )
                        : 0
                } vnđ`,
                color: "#DE8208",
            },
            {
                key: "month",
                label: `Top 2: ${
                    dashboardStatistic?.[1]
                        ? dashboardStatistic[1]?.staff?.first_name +
                          dashboardStatistic[1]?.staff?.last_name
                        : "Chưa xác định"
                }`,
                value: `${
                    dashboardStatistic?.[1]
                        ? formatCurrencyToNumber(
                              dashboardStatistic[1]?.sales_revenue
                          )
                        : 0
                } vnđ`,
                color: "rgb(71, 84, 103)",
            },
            {
                key: "daonliney",
                label: `Top 3: ${
                    dashboardStatistic?.[2]
                        ? dashboardStatistic[2]?.staff?.first_name +
                          dashboardStatistic[2]?.staff?.last_name
                        : "Chưa xác định"
                }`,
                value: `${
                    dashboardStatistic?.[2]
                        ? formatCurrencyToNumber(
                              dashboardStatistic[2]?.sales_revenue
                          )
                        : 0
                } vnđ`,
                color: "#D83D32",
            },
            {
                key: "chuaden",
                label: `Top 4: ${
                    dashboardStatistic?.[3]
                        ? dashboardStatistic[3]?.staff?.first_name +
                          dashboardStatistic[3]?.staff?.last_name
                        : "Chưa xác định"
                }`,
                value: `${
                    dashboardStatistic?.[3]
                        ? formatCurrencyToNumber(
                              dashboardStatistic[3]?.sales_revenue
                          )
                        : 0
                } vnđ`,
                color: "#0D63F3",
            },
            {
                key: "daden",
                label: `Top 5: ${
                    dashboardStatistic?.[4]
                        ? dashboardStatistic[4]?.staff?.first_name +
                          dashboardStatistic[4]?.staff?.last_name
                        : "Chưa xác định"
                }`,
                value: `${
                    dashboardStatistic?.[4]
                        ? formatCurrencyToNumber(
                              dashboardStatistic[4]?.sales_revenue
                          )
                        : 0
                } vnđ`,
                color: "#0D63F3",
            },
        ];
    }, [dashboardStatistic]);

    return (
        <>
            {/* Lịch hẹn */}
            <div className="rounded-xl bg-white p-4 shadow">
                <div className="flex flex-col">
                    <h3 className="text-lg">Top doanh thu nhân viên</h3>
                    <DateSchedule
                        selectedDate={selectedDateStatistic}
                        setSelectedDate={setSelectedDateStatistic}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-[10px] w-full">
                    {LIST_CARD_3.map((item) => (
                        <StatusCardV2
                            key={item.key}
                            statusData={item}
                            hightLine="label"
                            customCss="w-full"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
