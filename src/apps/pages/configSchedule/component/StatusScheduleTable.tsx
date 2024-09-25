import React, { useState, useEffect } from "react";
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Stack,
    TextField,
} from "@mui/material";
import TrashIcon from "@/components/icons/trash-icon";
import FormHelperTextCustom from "@/components/form-helper-text";
import { ColorPicker } from "antd";

interface Option {
    key: string;
    value: string;
    color: string;
}

interface StatusScheduleSelectProps {
    name: string;
    initialSelectedOptions?: Option[];
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
    onSelectedOptionsChange: (
        selectedOptions: Option[],
        deleteStatus: string[]
    ) => void;
    [x: string]: any;
}

const StatusScheduleSelect: React.FC<StatusScheduleSelectProps> = ({
    initialSelectedOptions = [],
    label,
    name,
    title,
    initTitle,
    direction = "column",
    configUI,
    validate,
    errors,
    required,
    disabled = false,
    onSelectedOptionsChange,
    ...props
}) => {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    const [selectedNewOptions, setSelectedNewOptions] = useState<Option[]>([]);
    const [deleteStatus, setDeleteStatus] = useState<string[]>([]);

    const handleColorChange = (color: string, index: number) => {
        setSelectedNewOptions((prevOptions) =>
            prevOptions.map((option, i) =>
                i === index ? { ...option, color } : option
            )
        );
    };

    const handleValueChange = (value: string, index: number) => {
        setSelectedNewOptions((prevOptions) =>
            prevOptions.map((option, i) =>
                i === index ? { ...option, value } : option
            )
        );
    };

    const handleDelete = (index: number) => {
        const deletedOption = selectedNewOptions[index];
        if (deletedOption.key !== "") {
            setDeleteStatus((prev) => {
                if (!prev.includes(deletedOption.key)) {
                    return [...prev, deletedOption.key];
                }
                return prev;
            });
        }
        const updatedSelectedOptions = selectedNewOptions.filter(
            (_, i) => i !== index
        );
        setSelectedNewOptions(updatedSelectedOptions);
    };

    const addRow = () => {
        setSelectedNewOptions((prevOptions) => [
            ...prevOptions,
            { key: "", value: "", color: "#217732" },
        ]);
    };

    const width = configUI?.width ? configUI.width : "100%";
    useEffect(() => {
        const validValues = [
            "Chưa đến",
            "Đã đến",
            "Đang dịch vụ",
            "Đã hoàn thành",
            "Đã hủy",
            "Lịch khác",
        ];

        if (initialSelectedOptions.length > 0) {
            const validOptions = initialSelectedOptions.filter((option) =>
                validValues.includes(option.value)
            );
            const otherOptions = initialSelectedOptions.filter(
                (option) => !validValues.includes(option.value)
            );

            setSelectedOptions(validOptions);
            setSelectedNewOptions(otherOptions);
        } else {
            setSelectedOptions([{ key: "", value: "", color: "" }]); // Nếu không có initialSelectedOptions, thiết lập giá trị mặc định
        }
    }, [initialSelectedOptions]);
    useEffect(() => {
        onSelectedOptionsChange(selectedNewOptions, deleteStatus);
    }, [selectedNewOptions]);

    const isFormControlDisabled = !(
        selectedNewOptions.length === 1 &&
        selectedNewOptions[0].key === "" &&
        selectedNewOptions[0].value === ""
    );
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
                sx={{ my: 1, height: "fit-content" }}
                error={Boolean(validate[name] && errors.includes(name))}
                disabled={isFormControlDisabled || disabled}
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
                            width: "calc((100% - 81px) / 2)",
                        }}
                    >
                        Tên trạng thái
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            width: "calc((100% - 81px) / 2)",
                        }}
                    >
                        Màu sắc
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            textAlign: "center",
                            width: "81px",
                        }}
                    >
                        Thao tác
                    </div>
                </Box>
                <Box
                    sx={{
                        border: "1px solid var(--border-color-primary)",
                    }}
                >
                    {selectedOptions.map((option, index) => (
                        <Stack
                            width={"100%"}
                            key={index}
                            direction={"row"}
                            className="flex justify-between items-start"
                            sx={{
                                borderBottom:
                                    "1px solid var(--border-color-primary)",
                            }}
                        >
                            <Stack
                                sx={{
                                    width: "calc((100% - 80px) / 2)",
                                    height: "fit-content",
                                    padding: "8px",
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "400",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        paddingLeft: "8px",
                                        width: "calc((100% - 81px) / 2)",
                                    }}
                                >
                                    {option.value}
                                </div>
                            </Stack>
                            <Stack
                                direction={"row"}
                                gap={1}
                                sx={{
                                    width: "calc((100% - 80px) / 2)",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    height: "fit-content",
                                    padding: "8px",
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <ColorPicker
                                    defaultValue={""}
                                    value={option.color}
                                    onChange={(c) =>
                                        handleColorChange(
                                            c.toHexString(),
                                            index
                                        )
                                    }
                                    className="flex justify-start"
                                    disabled={true}
                                />
                                <div>{option.color}</div>
                            </Stack>
                            <Stack className=" cursor-pointer w-[80px] p-2 opacity-40">
                                <TrashIcon />
                            </Stack>
                            {validate[option.key] &&
                                errors.includes(option.key) && (
                                    <FormHelperText>
                                        {validate[option.key]}
                                    </FormHelperText>
                                )}
                        </Stack>
                    ))}
                    {selectedNewOptions.map((option, index) => (
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
                                sx={{
                                    width: "calc((100% - 80px) / 2)",
                                    height: "56px",
                                    padding: "8px",
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    type="text"
                                    name={name}
                                    variant="outlined"
                                    placeholder="Nhập tên trạng thái"
                                    value={option.value}
                                    onChange={(e) =>
                                        handleValueChange(e.target.value, index)
                                    }
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: "100%",
                                        },
                                    }}
                                />
                            </Stack>
                            <Stack
                                direction={"row"}
                                gap={1}
                                sx={{
                                    width: "calc((100% - 80px) / 2)",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    height: "56px",
                                    padding: "8px",
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <ColorPicker
                                    defaultValue={"#217732"}
                                    value={option.color}
                                    onChange={(c) =>
                                        handleColorChange(
                                            c.toHexString(),
                                            index
                                        )
                                    }
                                    className="flex justify-start"
                                />
                                <div>{option.color}</div>
                            </Stack>
                            <Stack
                                className=" cursor-pointer w-[80px] p-2"
                                onClick={() => handleDelete(index)}
                            >
                                <TrashIcon />
                            </Stack>
                            {validate[option.key] &&
                                errors.includes(option.key) && (
                                    <FormHelperText>
                                        {validate[option.key]}
                                    </FormHelperText>
                                )}
                        </Stack>
                    ))}
                    <div
                        onClick={addRow}
                        color="primary"
                        style={{
                            cursor: "pointer",
                            padding: "8px",
                            color: "#217732",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.00016 0.333496C7.37779 0.333496 7.68392 0.639626 7.68392 1.01726V6.3164H12.9831C13.3607 6.3164 13.6668 6.62253 13.6668 7.00016C13.6668 7.37779 13.3607 7.68392 12.9831 7.68392H7.68392V12.9831C7.68392 13.3607 7.37779 13.6668 7.00016 13.6668C6.62253 13.6668 6.3164 13.3607 6.3164 12.9831V7.68392H1.01726C0.639626 7.68392 0.333496 7.37779 0.333496 7.00016C0.333496 6.62253 0.639626 6.3164 1.01726 6.3164H6.3164V1.01726C6.3164 0.639626 6.62253 0.333496 7.00016 0.333496Z"
                                fill="#217732"
                            />
                        </svg>
                        <div
                            style={{
                                color: "#217732",
                                fontSize: "14px",
                                fontWeight: "400",
                            }}
                        >
                            Thêm dòng
                        </div>
                    </div>
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default StatusScheduleSelect;
