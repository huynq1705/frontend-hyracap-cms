import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, FormControl, FormHelperText, Stack } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import CSwitch from "@/components/custom/CSwitch";

interface MyTextFieldProps {
  label: string;
  required?: string[];
  type?: "text" | "password" | "number";
  name: string;
  placeholder?: string;
  // handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (name: string, value: boolean) => void;
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

const MySwitchV2: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
  const {
    label,
    required,
    name,
    placeholder,
    handleChange,
    values,
    validate,
    errors,
    configUI,
    direction = "column",
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";

  return (
    <Stack
      direction={direction}
      spacing={1.5}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        width: width,
        height: "fit-content",
        py: 2,
      }}
    >
      <label className="label">
        {label}{" "}
        {required && required.includes(name) && (
          <span style={{ color: "red" }}>(*)</span>
        )}
      </label>
      <CSwitch
        checked={values[name]}
        value={values[name]}
        name={name}
        onChange={() => handleChange(name, !values[name])}
        {...prop}
      />
    </Stack>
  );
};

export default MySwitchV2;
