import React from "react";
import { Stack } from "@mui/material";
import SingleCalendarDateRangePicker from "./Calender";

interface CalendarContainerProps {
    label?: string;
    required?: string[];
    inputStyle?: React.CSSProperties;
    className?: string;
}
const styleSearch: React.CSSProperties = {
    backgroundColor: "#fff !important",
};
const CalendarContainer: React.FC<CalendarContainerProps> = (
    props: CalendarContainerProps
) => {
    const {
        label,
        required,
        inputStyle = { height: 36 },
        className,
        ...prop
    } = props;
    return (
        <Stack
            className={className}
            sx={{
                height: "fit-content",
            }}
        >
            <label className="label">{label} </label>
            <SingleCalendarDateRangePicker />
        </Stack>
    );
};

export default CalendarContainer;
