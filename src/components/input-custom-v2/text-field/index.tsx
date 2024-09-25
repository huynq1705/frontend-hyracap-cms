import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, FormHelperText, Stack } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";

interface MyTextFieldProps {
    label?: string;
    required?: string[];
    type?: "text" | "password" | "number";
    name: string;
    placeholder?: string;
    handleChange: (e: any) => void;
    values: { [key: string]: any };
    errors: string[];
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    [x: string]: any; // This allows any additional props
    widthBox ?: string
}

const MyTextField: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
    const {
        label,
        required,
        type = "text",
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
        widthBox ,
        ...prop
    } = props;
    const [showPassword, setShowPassword] = useState(false);
    const width = configUI?.width ? configUI.width : "100%";
    const getType = () => {
        let typeInput = type;
        if (type === "password" && !showPassword) typeInput = "password";
        if (type === "password" && showPassword) typeInput = "text";
        return typeInput;
    };
    let endAdornment = <></>;
    if (type === "password")
        endAdornment = (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        );
    if (type !== "password" && prop?.unit)
        endAdornment = (
            <InputAdornment position="end">
                <span className="text-sm text-gray-6">{prop.unit}</span>
            </InputAdornment>
        );
    return (
        <Stack
            direction={direction}
            sx={{
                width: widthBox || width,
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
                <TextField
                    fullWidth
                    hiddenLabel
                    size="small"
                    type={getType()}
                    name={name}
                    variant="outlined"
                    placeholder={placeholder}
                    value={values[name]}
                    onChange={handleChange}
                    inputProps={{ style: inputStyle }}
                    InputProps={{
                        ...{
                            endAdornment,
                        },
                    }}
                    {...prop}
                />
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MyTextField;
