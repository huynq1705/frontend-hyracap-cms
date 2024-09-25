import React, { useState, useEffect } from "react";
import { FormControl, Stack, Box, InputAdornment } from "@mui/material";
import CurrencyInput from "react-currency-input-field";
import FormHelperTextCustom from "@/components/form-helper-text";

interface CurrencyInputProps {
    label: string;
    required?: string[];
    name: string;
    placeholder: string;
    type: "VND" | "%" | "Ngày";
    handleChange: (name: string, value: string) => void;
    value: any;
    errors: string[];
    validate: { [key: string]: string };
    configUI?: {
        [key: string]: string;
    };
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    inputStyle?: React.CSSProperties;
    [x: string]: any;
}

const TextFieldsWithEndText: React.FC<CurrencyInputProps> = (props) => {
    const {
        label,
        required,
        name,
        type,
        handleChange,
        placeholder,
        value,
        validate,
        errors,
        configUI,
        direction = "column",
        inputStyle = { height: 36 },
        ...prop
    } = props;

    const [inputValue, setInputValue] = useState<string | number>(value || "");

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const width = configUI?.width ? configUI.width : "100%";

    const handleCurrencyChange = (value: string | undefined) => {
        const stringValue = value || "";
        setInputValue(stringValue);
        handleChange(name, stringValue);
    };

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const stringValue = e.target.value;
        if (Number(stringValue) >= 0) {
            setInputValue(stringValue);
            handleChange(name, stringValue);
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
            <label className="label" style={{ whiteSpace: "pre-wrap" }}>
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
                    height: "36px",
                }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <Box
                    sx={{
                        mt: 1 / 2,
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        input: {
                            height: inputStyle.height,
                            padding: "8px 14px",
                        },
                    }}
                >
                    {type === "VND" ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                paddingRight: "8px",
                            }}
                        >
                            <CurrencyInput
                                id={name}
                                name={name}
                                value={inputValue as string}
                                placeholder={placeholder}
                                decimalsLimit={0}
                                groupSeparator=","
                                onValueChange={(value) =>
                                    handleCurrencyChange(value)
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    outline: "none",
                                    textAlign: "left",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                }}
                                suffix=""
                                {...prop}
                            />
                            <InputAdornment position="end">VND</InputAdornment>
                        </Box>
                    ) : type == "%" ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                paddingRight: "8px",
                            }}
                        >
                            <input
                                id={name}
                                name={name}
                                value={inputValue as string}
                                onChange={handlePercentageChange}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "14px",
                                    textAlign: "left",
                                    padding: "8px",
                                    height: "100%",
                                }}
                                step={0.1}
                                min={0}
                                type="number"
                                {...prop}
                            />
                            <InputAdornment position="end">%</InputAdornment>
                        </Box>
                    ) : type === "Ngày" ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                paddingRight: "8px",
                            }}
                        >
                            <input
                                id={name}
                                name={name}
                                value={inputValue as string}
                                onChange={handlePercentageChange}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontSize: "14px",
                                    textAlign: "left",
                                    padding: "8px",
                                    height: "100%",
                                }}
                                type="number"
                                {...prop}
                            />
                            <InputAdornment position="end">Ngày</InputAdornment>
                        </Box>
                    ) : null}
                </Box>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default TextFieldsWithEndText;
