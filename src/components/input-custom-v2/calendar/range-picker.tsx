import React, { useState } from "react";
import { FormControl, FormHelperText, Stack, Box } from "@mui/material";
import { DatePicker } from "antd";
import FormHelperTextCustom from "@/components/form-helper-text";

interface MyDateTimeRangePickerProps {
    label: string;
    required?: string[];
    name: string;
    handleChange: (name: string, date: any) => void;
    values: { [key: string]: any };
    errors?: string[];
    validate?: { [key: string]: string };
    configUI?: {
        [key: string]: string;
    };
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    inputStyle?: React.CSSProperties;
    disabled?: boolean;
    [x: string]: any; // This allows any additional props
}

const MyDateTimeRangePicker: React.FC<MyDateTimeRangePickerProps> = (
    props: MyDateTimeRangePickerProps
) => {
    const {
        label,
        required,
        name,
        handleChange,
        values,
        validate = {},
        errors = [],
        configUI,
        direction = "column",
        inputStyle = {
            height: 36,
            mb: validate[name] && errors.includes(name) ? 1 : 0,
            mt: 1,
        },
        disabled = false,
        ...prop
    } = props;

    const initialDateRange = [null, null];
    const [dateRange, setDateRange] = useState(initialDateRange);
    const width = configUI?.width ? configUI.width : "100%";
    const handleDateRangeChange = (
        dates: any,
        dateStrings: [string, string]
    ) => {
        setDateRange(dates);
        handleChange(name, dates);
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
                sx={inputStyle}
                error={Boolean(validate[name] && errors.includes(name))}
                disabled={disabled}
            >
                <Box
                    sx={{
                        height: 36,
                    }}
                >
                    <DatePicker.RangePicker
                        className="date-time-range-picker-custom"
                        value={dateRange as [any, any]} // Ensure dateRange has exactly two elements
                        onChange={handleDateRangeChange}
                        {...prop}
                    />
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MyDateTimeRangePicker;
