import React, { useState } from "react";
import { FormControl, Stack, Box, SxProps, Theme } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import FormHelperTextCustom from "@/components/form-helper-text";
import type { DatePickerProps } from "antd";
import { DatePicker as DatePickerAntd } from "antd";
import "dayjs/locale/vi";
import viVN from "antd/es/date-picker/locale/vi_VN";
import moment from "moment";
interface MyDatePickerProps {
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
    [x: string]: any; // This allows any additional props
    widthBox?: string | number;
    className?: string;
}
const stylesDatePickerCustom: SxProps<Theme> = {
    ".date-picker-custom": {
        input: {
            height: "36px",
            padding: "0px 5px !important",
        },
    },
};
const MyDatePicker: React.FC<MyDatePickerProps> = (
    props: MyDatePickerProps
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
        view = ["year", "month", "day"],
        inputStyle = { height: 35 },
        formatCalendar = "DD/MM/YYYY",
        formatInput = "YYYY-MM-DD",
        widthBox,
        className,
        ...prop
    } = props;

    // const [selectedDate, setSelectedDate] = useState(values[name] || null);
    const width = configUI?.width ? configUI.width : "100%";

    const handleDateChange = (date: any) => {
        const dateString = new Date(date.toString()).toLocaleDateString(
            "en-US"
        );

        // setSelectedDate(dateString);
        handleChange(name, dateString);
    };
    const onChange: DatePickerProps<Dayjs>["onChange"] = (date, dateString) => {
        const dateS = date ? date.format(formatInput) : "";
        handleChange(name, dateS);
    };
    return (
        <Stack
            className={className}
            direction={direction}
            sx={{
                width: widthBox || width,
                height: "fit-content",
                // minWidth: '162px'
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
                sx={{
                    height: "36px",
                    my: 1,
                }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <Box sx={stylesDatePickerCustom}>
                    <DatePickerAntd
                        style={{
                            width: "100%",
                            height: "36px",
                        }}
                        value={
                            values[name]
                                ? dayjs(values[name], formatInput)
                                : null
                        }
                        className="date-picker-custom"
                        onChange={onChange}
                        format={formatCalendar}
                        needConfirm
                        locale={viVN}
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

export default MyDatePicker;
