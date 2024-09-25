import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { memo, useState } from "react";

type CredentialTextFieldProps = TextFieldProps;

const CredentialTextField = ({
    ...props
}: CredentialTextFieldProps): JSX.Element => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword((pre) => !pre);
    };

    return (
        <TextField
            {...props}
            type={
                props?.type === "password" && !showPassword
                    ? "password"
                    : undefined
            }
            className="mt-2 "
            sx={{ mb: 2, mt: 1 }}
            inputProps={{
                style: {
                    height: 35,
                },
            }}
            variant="outlined"
            InputProps={{
                endAdornment: props?.type === "password" && (
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        size="small"
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                    >
                        {showPassword ? (
                            <VisibilityOff fontSize="small" />
                        ) : (
                            <Visibility fontSize="small" />
                        )}
                    </IconButton>
                ),
            }}
        />
    );
};

export default memo(CredentialTextField);
