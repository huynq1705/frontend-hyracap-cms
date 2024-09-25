import React, { useState } from "react";
import { Space, TimePicker, TimePickerProps } from 'antd';
import { Box, FormControl, Stack, SxProps, Theme } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import moment from "moment";
import dayjs from 'dayjs';
interface MyTextFieldProps {
    label?: string;
    required?: string[];
    name: string;
    placeholder?: string;
    handleChange: (name : string, value : string) => void;
    values: { [key: string]: any };
    errors: string[];
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    [x: string]: any; // This allows any additional props
}
const stylesDatePickerCustom: SxProps<Theme> = {
    ".date-picker-custom": {
        input: {
            height: "36px",
            padding: "0px 5px !important",
        },
    },
};

const MyTextSelectTime: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
    const {
        label,
        required,
        name,
        placeholder,
        handleChange,
        values,
        validate,
        errors,
        inputStyle = {
            height: 19,
        },
        configUI,
        direction = "column",
        ...prop
    } = props;
    const width = configUI?.width ? configUI.width : "100%";
    const onChange: TimePickerProps['onChange'] = (time, timeString) => {
        if (time) {
            const formattedTime = time.format('HH:mm:ss');
            handleChange(name, formattedTime)
            console.log("tiem",formattedTime);  // Output: "09:00:00"
            // Bạn có thể sử dụng `formattedTime` theo nhu cầu của bạn
        }
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
                {label}
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
                <Box sx={stylesDatePickerCustom}>
                    <TimePicker 
                        use12Hours
                        format="h:mm a"
                        style={{
                            width: "100%",
                            height: "36px",
                        }}
                        value={values[name] ? dayjs(values[name], 'HH:mm:ss') : null}
                        placeholder={placeholder}
                        onChange={onChange}
                        needConfirm
                        className="date-picker-custom" />
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
     
        </Stack>
    );
};

export default MyTextSelectTime;
