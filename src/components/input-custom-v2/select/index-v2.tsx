import React, { useState, useEffect } from "react";
import { FormControl, Box } from "@mui/material";
import { Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import FormHelperTextCustom from "@/components/form-helper-text";
import ButtonCore from "@/components/button/core";
import clsx from "clsx";
interface MySelectProps {
    label: string;
    required?: string[];
    type?: "select-one" | "select-multi";
    name: string;
    handleChange: (name: string, value: any) => void;
    values: { [key: string]: any };
    options: { value: string; label: string; isDisable?: boolean }[];
    errors: string[];
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string | number;
    };
    itemsPerPage?: number;
    disabled?: boolean;
    [x: string]: any; // This allows any additional props
}
const MySelectTwoItem: React.FC<MySelectProps> = (props: MySelectProps) => {
    const {
        label,
        required,
        type = "select-one",
        name,
        handleChange,
        values,
        validate,
        errors,
        options,
        inputStyle = {
            height: 36,
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
        configUI,
        direction = "column",
        itemsPerPage = 10,
        placeholder = "Chọn khung giờ đặt lịch",
        disabled = false,
        ...prop
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [cache, setCache] = useState({
        value: values[name],
        label: values[name],
    });
    useEffect(() => {
        setCache({
            label: values[name],
            value: values[name],
        });
    }, [values[name]]);

    const width = configUI?.width ? configUI.width : "100%";
    const numberItemPerRow = configUI?.numberItemPerRow || 1;
    console.log("disabled :", disabled);
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
                opacity: disabled ? "0.5" : "1",
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
                    my: 1,
                }}
                error={Boolean(validate[name] && errors.includes(name))}
                onClick={() => {
                    !disabled && setIsOpen(!isOpen);
                }}
                disabled={disabled}
            >
                <Stack
                    direction={"row"}
                    className="h-9 cursor-pointer rounded-md px-[14px] py-[6px] relative justify-between items-center text-slate-400"
                    sx={{
                        border: "1px solid var(--border-color-primary)",
                        "&:active": {
                            borderColor: "var(--text-color-primary)",
                        },
                        "&:hover": {
                            borderColor: "var(--text-color-secondary)",
                        },
                    }}
                >
                    {cache.label || placeholder}
                    <Box
                        sx={{
                            transition: "all .3s linear",
                            transform: `rotate(${isOpen ? "180" : "0"}deg)`,
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSortDown}
                            color={
                                isOpen
                                    ? "var(--text-color-primary)"
                                    : "var(--border-color-primary)"
                            }
                        />
                    </Box>
                    {isOpen && !options.length && (
                        <Box
                            className="h-[80px] absolute top-0 left-0 right-0 translate-y-9 bg-white rounded-md"
                            sx={{
                                boxShadow: "0px 1px 4px #ccc",
                                zIndex: "2",
                                padding: "16px 16px 16px 44px",
                            }}
                        >
                            Cửa hàng đóng cửa
                        </Box>
                    )}
                    {isOpen && !!options.length && (
                        <Box
                            className="h-[280px] absolute top-0 left-0 right-0 translate-y-9 bg-white rounded-md"
                            sx={{
                                boxShadow: "0px 1px 4px #ccc",
                                zIndex: "2",
                                padding: "16px 16px 16px 44px",
                            }}
                        >
                            <Stack
                                direction={"row"}
                                className=" flex-wrap justify-between gap-3 max-h-[200px] mix-h-[200px]  overflow-y-auto px-2"
                            >
                                {!!options.length &&
                                    options.map((option) => {
                                        const is_active = values[
                                            name
                                        ]?.includes(option.value);
                                        return (
                                            <Stack
                                                direction={"row"}
                                                key={option.value}
                                                className={clsx(
                                                    "items-center rounded-xl px-2 h-10 justify-center",
                                                    option?.isDisable
                                                        ? "disabled-custom"
                                                        : ""
                                                )}
                                                sx={{
                                                    color: is_active
                                                        ? "var(--text-color-primary)"
                                                        : "#000",
                                                    width: `calc(${
                                                        100 / +numberItemPerRow
                                                    }% - 12px)`,
                                                    border: `1px solid ${
                                                        is_active
                                                            ? "var(--text-color-primary)"
                                                            : "var(--border-color-primary)"
                                                    } `,
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "var(--bg-color-primary)",
                                                    },
                                                }}
                                                onClick={(e) => {
                                                    e?.stopPropagation();
                                                    if (option?.isDisable)
                                                        return;
                                                    setCache({
                                                        label: option.label,
                                                        value: option.value,
                                                    });
                                                }}
                                            >
                                                {option.label}
                                            </Stack>
                                        );
                                    })}
                            </Stack>
                            <div className="w-full fixed bottom-0 left-0 right-0 h-15 pb-4 px-4">
                                <ButtonCore
                                    title="xong"
                                    styles={{
                                        width: "100%",
                                        height: "44px",
                                        textTransform: "capitalize",
                                    }}
                                    onClick={(e) => {
                                        e?.stopPropagation();
                                        handleChange(name, cache.value);
                                        setIsOpen(false);
                                    }}
                                />
                            </div>
                        </Box>
                    )}
                </Stack>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MySelectTwoItem;
