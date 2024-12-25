import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Box } from "@mui/material";
import StatusCardV2 from "@/components/status-card/index-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import apiDashboardService from "@/api/apiDashboard.service";
import ChartDashboardRevenue from "./chart-revenue";
import { formatCurrency } from "@/utils";
interface ChartDashboardProps {
  color?: string;
}

function getTotalPaymentMoneyArray(data: any) {
  const totalPayments = new Array(12).fill(0);

  data.forEach((item: any) => {
    const monthIndex = parseInt(item.month.split("-")[0]) - 1;
    totalPayments[monthIndex] = item.sum_capital ?? item.new_user;
  });

  return totalPayments;
}
const calculateSums = (data: any) => {
  const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (1-12)

  let totalYear = 0;
  let totalCurrentMonth = 0;

  data.forEach((item: any) => {
    const month = parseInt(item.month.split("-")[0]);
    totalYear += item.sum_capital;
    if (month === currentMonth) {
      totalCurrentMonth = item.sum_capital;
    }
  });

  return {
    totalYear,
    totalCurrentMonth,
  };
};
const ChartDashboard: React.FC<ChartDashboardProps> = (props) => {
  const { color = "#009E73" } = props;
  const chartRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  const year = today.getFullYear();

  const { getStatisticCapital } = apiDashboardService();

  const [formData, setFormData] = useState({
    currentYearRevenue: year,
  });
  const [chartYear, setChartYear] = useState<any>([]);
  const [chartUser, setChartUser] = useState<any>([]);
  const [dashboardRevenue, setDashboardRevenue] = useState<any>();
  const [dashboardResult, setDashboardResult] = useState<any>();
  const [dashboardUser, setDashboardUser] = useState<any>();

  const fetchDashboardRevenue = async () => {
    const payload = {
      year: formData.currentYearRevenue.toString(),
    };
    getStatisticCapital(payload)
      .then((res) => {
        if (res.data) {
          setDashboardRevenue(res.data);
          const totalPaymentMoneyArray = getTotalPaymentMoneyArray(
            res?.data?.data
          );
          const result = calculateSums(res?.data?.data);
          setDashboardResult(result);
          setDashboardUser(res?.data?.new_user)
          setChartYear(totalPaymentMoneyArray);
          setChartUser(getTotalPaymentMoneyArray(res?.data?.statistic_user))
        }
      })
      .catch((e) => {});
  };
  useEffect(() => {
    fetchDashboardRevenue();
  }, [formData.currentYearRevenue]);

  useEffect(() => {
    console.log("chartUser", chartUser);
  }, [chartUser]);

  const LIST_CARD_1 = [
    {
      key: "year",
      label: "Cả năm",
      value: `${
        dashboardResult ? formatCurrency(+dashboardResult.totalYear) : 0
      }`,
    },
    {
      key: "month",
      label: "Tháng này",
      value: `${
        dashboardResult ? formatCurrency(+dashboardResult.totalCurrentMonth) : 0
      }`,
    },
  ];

  const LIST_CARD_2 = [
    {
      key: "user",
      label: "Người dùng",
      value: `${dashboardUser ? dashboardUser : 0}`,
    },
  ];

  type FormDataKeys = "currentYearRevenue";
  const changeYear = (
    direction: "increase" | "decrease",
    name: FormDataKeys
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: direction === "increase" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg">Doanh thu</h3>
        {/* <MyDatePicker date={date} setDate={setDate} /> */}
        <div className="flex gap-1">
          <div
            className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] hover:bg-lime-100 cursor-pointer"
            onClick={() => {
              changeYear("decrease", "currentYearRevenue");
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] font-semibold">
            {formData.currentYearRevenue}
          </div>
          <div
            className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] hover:bg-lime-100 cursor-pointer"
            onClick={() => {
              changeYear("increase", "currentYearRevenue");
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </div>
      </div>
      {/* list card */}
      <div className="flex flex-wrap items-center gap-4 mt-[10px] w-full">
        {LIST_CARD_1.map((item) => (
          <StatusCardV2
            key={item.key}
            statusData={{
              label: item.label,
              value: item.value,
              color: "#217732",
            }}
            customCss="w-[calc(33% - 11px]"
          />
        ))}
      </div>
      <ChartDashboardRevenue data={chartYear} />
      <div className="flex justify-between items-center">
        <h3 className="text-lg">Người dùng </h3>
        {/* <MyDatePicker date={date} setDate={setDate} /> */}
        {/* <div className="flex gap-1">
          <div
            className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] hover:bg-lime-100 cursor-pointer"
            onClick={() => {
              changeYear("decrease", "currentYearRevenue");
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] font-semibold">
            {formData.currentYearRevenue}
          </div>
          <div
            className="rounded-lg bg-[#F6FAF7] text-[var(--text-color-primary)] px-2 py-[6px] hover:bg-lime-100 cursor-pointer"
            onClick={() => {
              changeYear("increase", "currentYearRevenue");
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </div> */}
      </div>
      {/* list card */}
      <div className="flex flex-wrap items-center gap-4 mt-[10px] w-full">
        {LIST_CARD_2.map((item) => (
          <StatusCardV2
            key={item.key}
            statusData={{
              label: item.label,
              value: item.value,
              color: "#217732",
            }}
            customCss="w-[calc(33% - 11px]"
          />
        ))}
      </div>
      <ChartDashboardRevenue data={chartUser} unit="" />
    </div>
  );
};

export default ChartDashboard;
