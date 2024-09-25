import React from "react";
import { Stack } from "@mui/material";
import { StatusScheduleArray } from "@/types/appointmentStatus";
import { useLocation } from "react-router-dom";

interface StatusCardPropsProps {
    statusData: StatusScheduleArray;
    width?: string;
    customCss?: string;
}

const StatusCard: React.FC<StatusCardPropsProps> = ({
    statusData,
    width,
    customCss,
}) => {
    const { name, color, total } = statusData;
    const { pathname } = useLocation();

    return (
        <div
            className={`${customCss ? "h-fit" : "h-fit  "} ${customCss} ${
                pathname.includes("schedule")
                    ? "min-w-[120px]"
                    : "min-w-[147px]"
            } rounded-lg relative`}
        >
            <div
                className="absolute top-0 right-0 left-0 bottom-0 rounded-lg z-5"
                style={{
                    background: color ?? "transparent",
                    opacity: 0.1,
                }}
            ></div>
            <Stack
                direction={"column"}
                className="z-10 w-full text-sm flex items-start px-4 py-2 "
                sx={{
                    color: color ?? "transparent",
                }}
            >
                <p
                    className="status-title text-xs font-medium m-0 pb-1"
                    style={{
                        color: color ?? "transparent",
                    }}
                >
                    {name}
                </p>
                <p className="status-num text-lg font-bold text-[#1A1C1E] m-0">
                    {total}
                </p>
            </Stack>
        </div>
    );
};

export default StatusCard;
