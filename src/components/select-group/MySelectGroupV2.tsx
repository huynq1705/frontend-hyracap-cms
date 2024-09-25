import React, { useState, useEffect } from "react";
import {
    Box,
    Select,
    MenuItem,
    IconButton,
    Button,
    Grid,
    Typography,
    FormControl,
    FormHelperText,
    Stack,
    TextField,
    Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TrashIcon from "../icons/trash-icon";
import CStatus from "../status";
import { Input } from "antd";

interface Option {
    key: string;
    value: string;
    content: string
}

interface SelectGroupProps {
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

const MySelectGroupV2: React.FC<SelectGroupProps> = ({
    availableOptions,
    initialSelectedOptions = [],
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
    ...props
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        if (initialSelectedOptions.length > 0) {
            onSelectedOptionsChange(initialSelectedOptions);
        } else {
            onSelectedOptionsChange([{ key: "", value: "" ,content : ""}]);
        }
        
    }, [initialSelectedOptions]);

    const handleSelectChange = (key: string, index: number) => {
        const selected = availableOptions.find((option) => option.key === key);
        if (selected) {
            const updatedSelectedOptions = [...initialSelectedOptions];
            updatedSelectedOptions[index] = selected;
            onSelectedOptionsChange(updatedSelectedOptions);
            setSearchQuery("")
        }
    };

    const handleDelete = (index: number) => {
        const updatedSelectedOptions = initialSelectedOptions.filter(
            (_, i) => i !== index
        );
        onSelectedOptionsChange(updatedSelectedOptions);
    };

    const addRow = () => {
        onSelectedOptionsChange([...initialSelectedOptions, { key: "", value: "" ,content:""}]);

        // console.log("selectedOptions==>>>", selectedOptions);
    };

    const isOptionDisabled = (key: string) => {
        return initialSelectedOptions.some((option) => option.key === key);
    };

    const width = configUI?.width ? configUI.width : "100%";

    const isFormControlDisabled = !(
        initialSelectedOptions.length === 1 &&
        initialSelectedOptions[0].key === "" &&
        initialSelectedOptions[0].value === ""
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
                {required && required.includes(label) && (
                    <span style={{ color: "red" }}>(*)</span>
                )}
            </label>
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ my: 1, height: "fit-content",overflowX:"auto" }}
                error={Boolean(validate[label] && errors.includes(label))}
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
                        minWidth: "500px"
                    }}
                >
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            width:"45%"
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
                            width: "45%"
                        }}
                    >
                        Chức vụ
                    </div>
                    <div
                        style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            paddingLeft: "8px",
                            paddingRight: "10px",
                            borderLeft: "1px solid var(--border-color-primary)",
                            width: "10%"

                        }}
                    >
                        Thao tác
                    </div>
                </Box>
                <Box
                    sx={{
                        border: "1px solid var(--border-color-primary)",
                        borderRadius: "0 0 10px 10px",
                        minWidth: "500px"
                    }}
                >
                    {initialSelectedOptions.map((option, index) => (
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
                                width={"45.1%"}
                                className="px-2 py-[9px]"
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <Autocomplete
                                    disabled={disabled}
                                    options={availableOptions.filter(itemOption => itemOption.value.includes(searchQuery))}
                                    getOptionLabel={(option) => option.value}
                                    value={option}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            size="small"
                                            sx={{
                                                height: "28px",  // Set chiều cao cho toàn bộ Inputx`
                                                '.MuiOutlinedInput-root': {
                                                    height: "28px", // Set chiều cao cho phần Input chứa nội dung
                                                    padding: 0,  // Điều chỉnh padding để phù hợp với chiều cao
                                                },
                                                '.MuiInputBase-input': {
                                                    height: "100%",  // Set chiều cao bên trong của input
                                                    padding: '4px 8px',  // Điều chỉnh padding bên trong input để vừa vặn hơn
                                                },
                                            }}
                                        />
                                    )}
                                    onChange={(e, newValue) => handleSelectChange(newValue?.key,index)}
                                    disableClearable
                                    fullWidth
                                    renderOption={(props, option) => (
                                        <MenuItem 
                                        {...props} 
                                        disabled={isOptionDisabled(option.key)}
                                        key={option.key} value={option.key}>
                                            {option.value}
                                        </MenuItem>
                                    )}
                                    sx={{
                                        height: "28px",
                                        ".MuiOutlinedInput-root": {
                                            height: "28px",
                                            padding: 0,
                                        },
                                        ".MuiAutocomplete-inputRoot": {
                                            height: "28px",
                                            ".MuiInputBase-input": {
                                                height: "100%",
                                                padding: '4px 8px',
                                            },
                                        },
                                    }}
                                />

                            </Stack>
                            <Stack
                                width={"44.9%"}
                                className="px-2 py-[9px]"
                                // alignItems={"center"}
                                justifyContent={"center"}
                                sx={{
                                    borderRight:
                                        "1px solid var(--border-color-primary)",
                                }}
                            >
                                <Box
                                    sx={{
                                        border: "1px solid #D0D5DD",
                                        px: 1,
                                        borderRadius: 1,
                                        height: "28px",
                                        alignContent:'center',
                                        backgroundColor: "#F2F4F7"

                                    }}
                                >
                                    <Typography sx={{

                                    }}>
                                        {option?.content || "- -"}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Stack
                                width={"9.9%"}
                                className=" cursor-pointer items-center"
                                onClick={() => handleDelete(index)}
                                style={{ 
                                    pointerEvents: disabled ? "none" : "visible",
                                    opacity: disabled ? 0.5 : 1
                                 }}
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
                            pointerEvents: disabled ? "none" : "visible" 
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
                                fill={disabled ? "#D0D5DD" : "#217732"}
                            />
                        </svg>
                        <div
                            style={{
                                color: disabled ? "#D0D5DD":"#217732",
                                fontSize: "14px",
                                fontWeight: "400",
                            }}
                        >
                            Thêm dòng
                        </div>
                    </div>
                </Box>
            </FormControl>
        </Stack>
    );
};

export default MySelectGroupV2;
