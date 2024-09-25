import React from "react";
import { Box, Stack } from "@mui/material";
import { StatusScheduleArray } from "@/types/appointmentStatus";
import clsx from "clsx";

interface StatusCardV2PropsProps {
  statusData: any;
  hightLine?: "label" | "value";
  customCss?: string;
  active?: boolean;
  direction?: "row" | "column";
  onClick?: (...args: any) => void;
}

const StatusCardV2: React.FC<StatusCardV2PropsProps> = ({
  statusData,
  hightLine = "value",
  customCss,
  onClick,
  active,
  direction = "column",
}) => {
  const { label, color, value } = statusData;

  return (
    <Box
      className={`h-fit min-w-[145px] cursor-pointer rounded-lg relative ${customCss}`}
      onClick={onClick}
      sx={{
        // width,
        border: `1px solid ${active ? color : "transparent"}`,
      }}
    >
      <div
        className="absolute top-0 right-0 left-0 bottom-0 rounded-lg z-5"
        style={{
          background: color ?? "transparent",
          opacity: 0.1,
        }}
      ></div>
      <Stack
        direction={direction}
        className="w-full text-sm flex items-enter p-3 gap-2"
      >
        <p
          className="status-title text-sm font-bold m-0 pb-1 w-fit"
          style={{
            color:
              hightLine === "label" || direction == "row"
                ? color ?? "#1A1C1E"
                : "#000",
          }}
        >
          {label}
        </p>
        <Box
          className={clsx(
            "status-num 2xl:text-2xl  font-bold w-fit m-0",
            direction == "row" ? "text-sm" : "text-xl",
          )}
          sx={{
            color:
              hightLine === "value" || direction == "row"
                ? color ?? "#1A1C1E"
                : "#000",
          }}
        >
          {value}
        </Box>
      </Stack>
    </Box>
  );
};

export default StatusCardV2;
