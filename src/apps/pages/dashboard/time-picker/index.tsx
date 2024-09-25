import React, { useCallback, useState } from "react";
import { DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getCurrentMonthStartAndEnd } from "@/utils";
import SwitchTabs from "../switch-tab";
import { Stack } from "@mui/material";

const { RangePicker } = DatePicker;

interface DateState {
  from: string;
  to: string;
}

export interface MyDatePickerProps {
  date: DateState;
  setDate: (date: DateState) => void;
}

const inputStyle = {
  height: "40px",
  fontSize: "16px",
};

const DATA_TABS = [
  { key: "0", value: "Hiện tại" },
  { key: "1", value: "1 tháng" },
  { key: "2", value: "2 tháng" },
  { key: "3", value: "1 quý" },
];

export default function MyDatePicker({ date, setDate }: MyDatePickerProps) {
  const [typeDate, setTypeDate] = useState("0");

  const startDate = dayjs(date.from, "YYYY-MM");
  const endDate = dayjs(date.to, "YYYY-MM");

  const getDateRangeByType = (key: string) => {
    switch (key) {
      case "1":
        return {
          from: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM"),
          to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM"),
        };
      case "2":
        return {
          from: dayjs().subtract(2, "month").startOf("month").format("YYYY-MM"),
          to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM"),
        };
      case "3":
        return {
          from: dayjs().subtract(3, "month").startOf("month").format("YYYY-MM"),
          to: dayjs().endOf("month").format("YYYY-MM"),
        };
      default:
        const { start, end } = getCurrentMonthStartAndEnd();
        return { from: start, to: end };
    }
  };

  const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      const [start, end] = dates;
      setDate({ from: start.format("YYYY-MM"), to: end.format("YYYY-MM") });
    }
  };

  const onSwitch = useCallback(
    (key: string) => {
      setTypeDate(key);
      setDate(getDateRangeByType(key));
    },
    [setDate],
  );

  return (
    <Stack direction="row" className="items-start" spacing={4}>
      <Space direction="vertical" size={12}>
        <RangePicker
          picker="month"
          value={[startDate, endDate]}
          // onChange={handleDateChange}
          style={inputStyle}
        />
      </Space>
      <SwitchTabs value={typeDate} data={DATA_TABS} onSwitch={onSwitch} />
    </Stack>
  );
}
