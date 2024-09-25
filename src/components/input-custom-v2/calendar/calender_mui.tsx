import React from "react";
import {
    FormControl,
    Stack,
    Box,
    SxProps,
    TextField,
    Theme,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import FormHelperTextCustom from "@/components/form-helper-text";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import "dayjs/locale/vi";
dayjs.locale("vi");
interface MyDatePickerMuiProps {
    label: string;
    required?: string[];
    name: string;
    handleChange: (name: string, date: string) => void;
    values: { [key: string]: any };
    errors: string[];
    validate: { [key: string]: string };
    configUI?: {
        [key: string]: string;
    };
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    disablePastDates?: boolean;
    inputStyle?: React.CSSProperties;
    [x: string]: any; // This allows any additional props
}

const MyDatePickerMui: React.FC<MyDatePickerMuiProps> = ({
    label,
    required,
    name,
    handleChange,
    values,
    validate,
    errors,
    configUI,
    direction = "column",
    inputStyle = { height: 35 },
    disablePastDates = false,
    ...prop
}) => {
    const width = configUI?.width ? configUI.width : "100%";

    const handleDateChange = (date: Dayjs | null) => {
        const dateString = date ? date.format("YYYY-MM-DD") : "";
        handleChange(name, dateString);
    };

    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
        >
            <label className="label">
                {label}{" "}
                {required && required.includes(name) && (
                    <span style={{ color: "red" }}>(*)</span>
                )}
            </label>
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ my: 1, height: "36px" }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <Box>
                    <DatePicker
                        className="date-picker-custom"
                        // locale={viVN}
                        value={
                            values[name]
                                ? dayjs(values[name])
                                : dayjs().startOf("day")
                        }
                        onChange={handleDateChange}
                        {...prop}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: "outlined",
                                size: "small",
                                sx: {
                                    height: "36px",
                                    ".MuiInputBase-input": {
                                        height: "36px",
                                        padding: "0 14px",
                                        boxSizing: "border-box",
                                    },
                                },
                                error: Boolean(
                                    validate[name] && errors.includes(name)
                                ),
                            },
                        }}
                        disablePast={disablePastDates}
                    />
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MyDatePickerMui;
