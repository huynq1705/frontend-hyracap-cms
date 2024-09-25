import React, { useState, useEffect } from "react";
import {
    Box,
    FormControl,
    FormHelperText,
    Stack,
} from "@mui/material";
import { TimePicker, TimePickerProps, Typography } from "antd";
import CSwitch from "@/components/custom/CSwitch";
import dayjs, { Dayjs } from "dayjs";
import useCustomTranslation from "@/hooks/useCustomTranslation";

type DisabledTimes = {
    disabledHours?: () => number[];
    disabledMinutes?: (selectedHour: number) => number[];
    disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};

interface TableScheduleProps {
    label: string;
    title: string;
    initTitle: string;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    validate: { [key: string]: string };
    errors: string[];
    required?: string[];
    disabled?: boolean;
    onSelectedOptionsChange: (name: string, value: any) => void;
    [x: string]: any;
    data : any
}

const TableSchedule: React.FC<TableScheduleProps> = ({
    label,
    title,
    initTitle,
    direction = "column",
    configUI,
    validate,
    errors,
    required,
    disabled = false,
    onSelectedOptionsChange,
    data,
    ...props
}) => {
    // useEffect(() => {
    //     if (initialSelectedOptions.length > 0) {
    //         onSelectedOptionsChange(initialSelectedOptions);
    //     } else {
    //         onSelectedOptionsChange([{ key: "", value: "", content: "" }]);
    //     }
    //     console.log("0000000000", initialSelectedOptions);
    // }, [initialSelectedOptions]);

    const { T, t } = useCustomTranslation();
    const width = configUI?.width ? configUI.width : "100%";

  

    const openingAndClosingArray = Object.keys(data).map(day => {
        const [openingTime, closingTime, status] = data[day].split('-');
        return {
            day,
            openingTime,
            closingTime,
            status
        };
    });
    const rangeDisabledTime = (targetTime: Dayjs): DisabledTimes => {
        const targetHour = targetTime.hour();
        const targetMinute = targetTime.minute();
        const targetSecond = targetTime.second();

        return {
            disabledHours: () => {
                return Array.from({ length: targetHour }, (_, i) => i); // Disable hours before targetHour
            },
            disabledMinutes: (selectedHour: number) => {
                if (selectedHour === targetHour) {
                    return Array.from({ length: targetMinute }, (_, i) => i); // Disable minutes before targetMinute
                }
                return [];
            },
            disabledSeconds: (selectedHour: number, selectedMinute: number) => {
                if (selectedHour === targetHour && selectedMinute === targetMinute) {
                    return Array.from({ length: targetSecond }, (_, i) => i); // Disable seconds before targetSecond
                }
                return [];
            }
        };
    };
    const onChangeTime = (time: dayjs.Dayjs, name : string, start : boolean , index : number) => {
        if (time) {
            const formattedTime = time.format('HH:mm:ss');
            var valueForm = openingAndClosingArray[index]
            if (start){
                onSelectedOptionsChange(name, `${formattedTime}-${valueForm.closingTime}-${valueForm.status}`)
            } else {
                onSelectedOptionsChange(name, `${valueForm.openingTime}-${formattedTime}-${valueForm.status}`)
            }
          
        }
    };  
    const onChangeStatus = (name: string , value : string , index : number) => {
        var valueForm = openingAndClosingArray[index]
        onSelectedOptionsChange(name, `${valueForm.openingTime}-${valueForm.closingTime}-${value}`)
    };  
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
        >
            <Typography.Text
                style={{ fontSize: 16, fontWeight: "600", width: "100%" }}
            >
                Thông tin công ty
            </Typography.Text>
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ my: 1, height: "fit-content" }}
                error={Boolean(validate[label] && errors.includes(label))}
                disabled={disabled}
                {...props}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "14px",
                        fontWeight: "700",
                        backgroundColor: "#F2F4F7",
                        borderRadius: "10px 10px 0 0 ",
                        border: "1px solid var(--border-color-primary)",
                    }}
                >
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            width: "16%",
                            textAlign: "center",
                        }}
                    >
                        Ngày
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            paddingRight: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            width: "33.9%",
                            textAlign: "center",
                        }}
                    >
                        Giờ mở cửa
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            paddingRight: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            width: "34.1%",
                            textAlign: "center",
                        }}
                    >
                        Giờ đóng cửa
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            paddingRight: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            width: "16%",
                            textAlign: "center",
                        }}
                    >
                        Cho phép đặt lịch
                    </div>
                </Box>
                <Box
                    sx={{
                        border: "1px solid var(--border-color-primary)",
                        borderRadius: "0 0 10px 10px",
                    }}
                >
                    {openingAndClosingArray.map((option, index) => (
                        <Stack
                            width={"100%"}
                            key={index}
                            direction={"row"}
                            className="flex justify-between items-center"
                            sx={{
                                borderBottom:
                                    "1px solid var(--border-color-primary)",
                            }}
                        >
                            <Stack
                                width={"16.1%"}
                                className="py-[11px] items-center"
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                    // bgcolor:'red'
                                }}
                            >
                                <Typography>{T(option?.day)}</Typography>
                            </Stack>
                            <Stack
                                width={"33.7%"}
                                className="px-2 py-[9px]"
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                    // bgcolor:'red'
                                }}
                            >
                                <TimePicker
                                    use12Hours
                                    format="h:mm:ss"
                                    style={{
                                        width: "100%",
                                        height: "28px",
                                    }}
                                    value={option?.openingTime ? dayjs(option?.openingTime, 'HH:mm:ss') : null}
                                    placeholder={"Chọn"}
                                    onChange={(day) => onChangeTime(day ,option.day, true , index)}
                                    needConfirm
                                    className="date-picker-custom"
                                    disabled={disabled}
                                />
                            </Stack>

                            <Stack
                                width={"34%"}
                                className="px-2 py-[9px]"
                                // alignItems={"center"}
                                justifyContent={"center"}
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <TimePicker
                                    use12Hours
                                    format="h:mm:ss"
                                    style={{
                                        width: "100%",
                                        height: "28px",
                                    }}
                                    value={option?.closingTime ? dayjs(option?.closingTime, 'HH:mm:ss') : null}
                                    placeholder={"Chọn"}
                                    onChange={(day) => onChangeTime(day, option.day, false, index)}
                                    needConfirm
                                    className="date-picker-custom"
                                    disabled={disabled}
                                    disabledTime={option?.openingTime ? () => rangeDisabledTime(dayjs(option?.openingTime, 'HH:mm:ss')) : undefined}
                                />
                            </Stack>
                            <Stack
                                width={"15.8%"}
                                className=" cursor-pointer items-center"
                                // onClick={() => handleDelete(index)}
                                style={{
                                    pointerEvents: disabled
                                        ? "none"
                                        : "visible",
                                    opacity: disabled ? 0.5 : 1,
                                }}
                            >
                                <CSwitch
                                    defaultChecked
                                    checked={option.status === "ACTIVE"}
                                    onClick={() =>
                                        onChangeStatus(option.day, option.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",index)
                                    }
                                />
                            </Stack>

                        </Stack>
                    ))}
                </Box>
            </FormControl>
        </Stack>
    );
};

export default TableSchedule;
