import React from "react";
import { Box, Icon, Stack } from "@mui/material";
import { StatusScheduleArray } from "@/types/appointmentStatus";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from "react-router-dom";

interface StatusCardV3PropsProps {
  statusData: any;
  // width?: string;
  hightLine?: "label" | "value";
  customCss?: string
}

const StatusCardV3: React.FC<StatusCardV3PropsProps> = ({
  statusData,
  // width,
  hightLine = "value",
  customCss
}) => {
  const navigate = useNavigate();
  const { code, label, color, value, reviews } = statusData;

  return (
    <Box
      className={`h-fit min-w-[150px]  rounded-lg relative ${customCss}`}
      sx={{
        // width: width ?? "100%",
      }}
    
      onClick={() => {
        navigate(
          `/admin/report-customer/criterion/${code}`,
        );
      }}
    >
      <div
        className="absolute top-0 right-0 left-0 bottom-0 rounded-lg z-5"
        style={{
          background: value > 4 ? "#217732" : value < 3 ? "#F04438" : "#DE8208",
          opacity: 0.1,
        }}
      ></div>
      <Stack
        direction={"column"}
        className="w-full text-sm flex items-start p-3"
      >
        <Stack
          className="w-full flex justify-between"
          direction={"row"}
        >
          <p
            className="status-title text-sm font-medium m-0 pb-1"
            style={{
              color: "#1A1C1E",
            }}
          >
            {label}
          </p>
          <NavigateNextIcon />
        </Stack>
        <Box
          className="flex-row flex items-center gap-2 status-num text-2xl font-bold w-fit m-0"
          sx={{
            color: value > 4 ? "#217732" : value < 3 ? "#F04438" : "#DE8208",
          }}
        >
          {value}
          <Box
            sx={{
              fontSize: "14px",
              lineHeight: '22px',
              fontWeight: "400",
              color: "#1D2939"
            }}>
            {`(${reviews} lượt đánh giá)`}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default StatusCardV3;
