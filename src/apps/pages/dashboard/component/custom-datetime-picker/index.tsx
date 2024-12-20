import React from "react";
import { Stack, TextField } from "@mui/material";
import moment, { Moment } from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface DateScheduleProps {
  configUI?: {
    [key: string]: string;
  };
  widthBox?: string | number;

  selectedDate: Moment;
  setSelectedDate: (date: Moment) => void;
  label?: string;
}

const DateSchedule = (props: DateScheduleProps) => {
  const { selectedDate, setSelectedDate, label, configUI, widthBox } = props;

  const handlePrev = () => {
    setSelectedDate(selectedDate.clone().subtract(1, "months"));
  };

  const width = configUI?.width ? configUI.width : "100%";

  const handleNext = () => {
    setSelectedDate(selectedDate.clone().add(1, "months"));
  };

  const handleDateChange = (newValue: Moment | null) => {
    if (newValue) {
      setSelectedDate(newValue);
    }
  };

  const isCurrentMonth = selectedDate.isSame(moment(), "month");
  const displayDate = isCurrentMonth
    ? `Tháng này, ${selectedDate.format("MM/YYYY")}`
    : selectedDate.format("MM/YYYY");

  return (
    <Stack
      sx={{
        width: widthBox || width,
        height: "fit-content",
        minWidth: "200px",
      }}
    >
      <label className="label">{label}</label>
      <Stack direction={"row"} gap={2} alignItems={"center"} className="mt-1">
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "#F6FAF7",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={handlePrev}
        >
          <img
            src="/assets/icons/chevron-right.svg"
            alt="Previous"
            style={{
              transform: "rotate(180deg)",
              filter:
                "invert(38%) sepia(45%) saturate(387%) hue-rotate(80deg) brightness(94%) contrast(88%)",
            }}
          />
        </div>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            views={["year", "month"]}
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: "standard",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#50945D",
                    backgroundColor: "#F6FAF7",
                    padding: "8px",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: "1rem",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#50945D",
                  },
                },
                InputProps: {
                  disableUnderline: true,
                  value: selectedDate.format("MM-YYYY"), // Gán giá trị định dạng đúng
                },
              },
            }}
          />
        </LocalizationProvider>
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "#F6FAF7",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={handleNext}
        >
          <img
            src="/assets/icons/chevron-right.svg"
            alt="Next"
            style={{
              filter:
                "invert(38%) sepia(45%) saturate(387%) hue-rotate(80deg) brightness(94%) contrast(88%)",
            }}
          />
        </div>
      </Stack>
    </Stack>
  );
};

export default DateSchedule;
