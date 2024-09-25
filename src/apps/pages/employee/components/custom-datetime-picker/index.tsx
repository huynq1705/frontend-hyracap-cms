import React from "react";
import { Stack, TextField } from "@mui/material";
import moment, { Moment } from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getWeekDates } from "@/utils/date-time";

interface DayOfWeek {
    date: string;      // Ngày (định dạng YYYY-MM-DD)
    nameDate: string;  // Tên ngày (Thứ Hai, Thứ Ba,...)
}

interface DateScheduleProps {
    selectedWeek: DayOfWeek[];
    setSelectedWeek: (date: DayOfWeek[]) => void;
}

const DateSchedule = (props: DateScheduleProps) => {
    const { selectedWeek, setSelectedWeek } = props;

    const handlePrev = () => {

        setSelectedWeek(getWeekDates(moment(selectedWeek[0].date).clone().subtract(7, "days").format("YYYY-MM-DD")));
    };

    const handleNext = () => {
        setSelectedWeek(getWeekDates(moment(selectedWeek[0].date).clone().add(7, "days").format("YYYY-MM-DD")));
    };

    const handleDateChange = (newValue: Moment | null) => {
        if (newValue) {
            setSelectedWeek(getWeekDates(moment(newValue).format("YYYY-MM-DD")));
        }
    };

    // const isToday = selectedDate.isSame(moment(), "day");
    const displayDate = moment(selectedWeek[0].date).format("DD/MM/YYYY") + " - " + moment(selectedWeek[6].date).format("DD/MM/YYYY")


    return (
        <div>
            <Stack direction={"row"} gap={2} alignItems={"center"}>
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
                            filter: "invert(38%) sepia(45%) saturate(387%) hue-rotate(80deg) brightness(94%) contrast(88%)",
                        }}
                    />
                </div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        value={moment(selectedWeek[3].date)}
                        onChange={handleDateChange}
                        slots={{
                            textField: (params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    value={displayDate}
                                    sx={{
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
                                            minWidth: 208
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "#50945D",
                                        },
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                    }}
                                />
                            ),
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
                            filter: "invert(38%) sepia(45%) saturate(387%) hue-rotate(80deg) brightness(94%) contrast(88%)",
                        }}
                    />
                </div>
            </Stack>
        </div>
    );
};

export default DateSchedule;