import React, { useEffect, useMemo, useState } from "react";
import StatusCardV2 from "@/components/status-card/index-v2";
import moment from "moment";
import { formatDate } from "@/utils/date-time";
import DateSchedule from "../component/custom-datetime-picker";
import apiDashboardService from "@/api/apiDashboard.service";
import { formatCurrency, formatCurrencyToNumber } from "@/utils";
export interface HomePageProps {}

export default function DashboardGroupStatistic(props: HomePageProps) {
    const { getStatisticGroup } = apiDashboardService();
    const [dashboardStatistic, setDashboardStatistic] = useState<any>();
    const [selectedDateStatistic, setSelectedDateStatistic] = useState(
        moment()
    );

    const fetchDashboardStatistic = async () => {
        const payload = {
            monthYear: selectedDateStatistic.format("MM-YYYY").toString(),
        };
        getStatisticGroup(payload)
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
        const colors = [
            "#DE8208",
            "rgb(71, 84, 103)",
            "#D83D32",
            "#0D63F3",
            "#0D63F3",
        ];
        const validDashboardStatistic = Array.isArray(dashboardStatistic)
            ? dashboardStatistic
            : [];
        return validDashboardStatistic
            .slice(0, 5)
            .map((item: any, index: any) => ({
                key: `key-${index}`,
                label: `Top ${index + 1}: ${
                    item?.group?.name || "Chưa xác định"
                }`,
                value: `${
                    item?.sales_revenue
                        ? formatCurrency(+item.sales_revenue)
                        : 0
                }`,
                color: colors[index],
            }));
    }, [dashboardStatistic]);

    return (
        <>
            {/* Lịch hẹn */}
            <div className="rounded-xl bg-white p-4 shadow">
                <div className="flex flex-col">
                    <h3 className="text-lg">Top doanh thu nhóm</h3>
                    <DateSchedule
                        selectedDate={selectedDateStatistic}
                        setSelectedDate={setSelectedDateStatistic}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-[10px] w-full">
                    {LIST_CARD_3.map((item: any) => (
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
