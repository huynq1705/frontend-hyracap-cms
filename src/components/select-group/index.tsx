import React, { useState, useEffect } from "react";
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    Stack,
} from "@mui/material";
import TrashIcon from "../icons/trash-icon";
import FormHelperTextCustom from "../form-helper-text";

interface Option {
    key: string;
    value: string;
}

interface SelectGroupProps {
    name: string;
    availableOptions: Option[];
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
    onSelectedOptionsChange: (selectedOptions: Option[]) => void;
    [x: string]: any;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
    availableOptions,
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
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([
        { key: "", value: "" },
    ]);

    const handleSelectChange = (key: string, index: number) => {
        const selected = availableOptions.find((option) => option.key === key);
        if (selected) {
            const updatedSelectedOptions = [...selectedOptions];
            updatedSelectedOptions[index] = selected;
            setSelectedOptions(updatedSelectedOptions);
            if (
                index === selectedOptions.length - 1 &&
                key !== "" &&
                selectedOptions[selectedOptions.length - 1].key !== ""
            ) {
                addRow();
            }
        }
    };

    const handleDelete = (index: number) => {
        const updatedSelectedOptions = selectedOptions.filter(
            (_, i) => i !== index
        );
        setSelectedOptions(updatedSelectedOptions);
    };

    const addRow = () => {
        console.log("initialSelectedOptions", initialSelectedOptions);
        console.log("availableOptions", availableOptions);
        setSelectedOptions((prevOptions) => [
            ...prevOptions,
            { key: "", value: "" },
        ]);
    };

    const isOptionDisabled = (key: string) => {
        return selectedOptions.some((option) => option.key === key);
    };

    const width = configUI?.width ? configUI.width : "100%";
    useEffect(() => {
        const newSelect =
            initialSelectedOptions.length > 0
                ? initialSelectedOptions
                : [{ key: "", value: "" }];
        setSelectedOptions(newSelect);
    }, [initialSelectedOptions]);
    useEffect(() => {
        onSelectedOptionsChange(selectedOptions);
    }, [selectedOptions]);

    const isFormControlDisabled = !(
        selectedOptions.length === 1 &&
        selectedOptions[0].key === "" &&
        selectedOptions[0].value === ""
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
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            paddingRight: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
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
                            className="flex justify-between items-center"
                            sx={{
                                borderBottom:
                                    "1px solid var(--border-color-primary)",
                            }}
                        >
                            <Stack
                                width={"90.8%"}
                                className="px-2 py-[9px]"
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <Select
                                    fullWidth
                                    value={option.key || ""}
                                    onChange={(e) =>
                                        handleSelectChange(
                                            e.target.value as string,
                                            index
                                        )
                                    }
                                    displayEmpty
                                    disabled={disabled}
                                    sx={{
                                        height: "28px",
                                        ".MuiSelect-select": {
                                            fontSize: "14px",
                                            fontWeight: "400",
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <div>{initTitle}</div>
                                    </MenuItem>
                                    {availableOptions.map((opt) => (
                                        <MenuItem
                                            key={opt.key}
                                            value={opt.key}
                                            disabled={isOptionDisabled(opt.key)}
                                        >
                                            {opt.value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Stack>
                            <Stack
                                width={"9.2%"}
                                className=" cursor-pointer items-center"
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

export default SelectGroup;
