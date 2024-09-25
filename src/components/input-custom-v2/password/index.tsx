import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Checkbox, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchorCircleCheck, faCircleCheck, faCircleExclamation, faClipboardCheck, faEuro, faFlagCheckered, faLessThanEqual, faRoadCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/system";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import FormHelperTextCustom from "@/components/form-helper-text";

interface MyTextFieldProps {
    label: string;

    required?: string[];
    type?: "text" | "password" | "number";
    name: string;
    placeholder?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    values: { [key: string]: any };
    errors: string[];
    isError?: boolean;
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    [x: string]: any; // This allows any additional props
}

const MyTextFieldPassword: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
    const {
        label,
        required,
        type = "text",
        name = "password",
        placeholder,
        handleChange,
        values,
        validate,
        errors,
        inputStyle = { height: 19 },
        configUI,
        isError,
        direction = "column",
        ...prop
    } = props;
    const [showPassword, setShowPassword] = useState(false);
    const { T, t } = useCustomTranslation();
    const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));
    const width = configUI?.width ? configUI.width : "100%";
    const getType = () => {
        let typeInput = type;
        if (type === "password" && !showPassword) typeInput = "password";
        if (type === "password" && showPassword) typeInput = "text";
        return typeInput;
    };
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
    });

    const handlePasswordChange = (e: any, handleChange: any) => {
        const { value } = e.target;
        const checks = {
            length: value.length >= 8 && value.length <= 20,
            number: /\d/.test(value),
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        };
        setPasswordChecks(checks);
        handleChange(e);
    };
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const validatePassword = [
        "Độ dài 8 - 20 ký tự",
        "Chữ số",
        "Chữ hoa",
        "Chữ thường",
        "Ký tự đặc biệt",
    ];
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
            spacing={1}
        >
            <label className="label">
                {label}{" "}
                {required && required.includes(name) && (
                    <span style={{ color: "red" }}>(*)</span>
                )}
            </label>
            <TextField
                fullWidth
                hiddenLabel
                size="small"
                name={name}
                type={getType()}
                // type={showPassword ? "text" : "password"}
                variant="outlined"
                placeholder={T("enterPassword")}
                onBlur={(e) => {
                    setIsPasswordFocused(false);
                    // handlePasswordChange(e, handleChange);
                }}
                sx={{ mt: 1 }}
                onFocus={() => setIsPasswordFocused(true)}
                value={values[name]}
                onChange={(e) => {
                    handlePasswordChange(e, handleChange);
                }}
                helperText={
                    isPasswordFocused && (
                        <>
                            {validatePassword.map(
                                (item, index) => (
                                    <FlexBox
                                        key={index}
                                        justifyContent="space-between"
                                        sx={{
                                            mt: 1,
                                            mb: 1,
                                        }}
                                    >
                                        <FlexBox gap={1}>
                                            <Checkbox
                                                size="small"
                                                name={`accept_${index}`}
                                                checked={
                                                    index ===
                                                        0
                                                        ? passwordChecks.length
                                                        : index ===
                                                            1
                                                            ? passwordChecks.number
                                                            : index ===
                                                                2
                                                                ? passwordChecks.uppercase
                                                                : index ===
                                                                    3
                                                                    ? passwordChecks.lowercase
                                                                    : passwordChecks.specialChar
                                                }
                                                sx={{
                                                    padding: 0,
                                                    "&.Mui-disabled":
                                                    {
                                                        color: "#50945D", // Color when disabled
                                                    },
                                                }}
                                                disabled
                                            />
                                            <p className="validate_pw">
                                                {item}
                                            </p>
                                        </FlexBox>
                                    </FlexBox>
                                )
                            )}
                        </>
                    )
                }
                // error={Boolean(
                //     // errors.password && touched.password
                // )}
                inputProps={{ style: inputStyle }}
                InputProps={{
                    ...(type === "password" && {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword((show) => !show)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }),
                }}
            />
            {isError && validate[name] && errors.includes(name) &&  (
                <FormHelperTextCustom text={validate[name]} />
            )}
        </Stack>
    );
};

export default MyTextFieldPassword;
