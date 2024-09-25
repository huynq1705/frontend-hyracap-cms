import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, FormControl, FormHelperText, Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import FormHelperTextCustom from "@/components/form-helper-text";
import { formatCurrencyNoUnit, formatCurrencyToNumber } from "@/utils";
import { ArrowDropDown } from "@mui/icons-material";

interface MyTextFieldProps {
  label: string;
  required?: string[];
  type?: "text" | "number" | "current";
  name: string;
  placeholder?: string;
  handleChange: (e: {
    target: { value: string | number; name: string };
  }) => void;
  values: { [key: string]: any };
  errors: string[];
  validate: { [key: string]: string };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: {
    [key: string]: string;
  };
  unit?: string;
  [x: string]: any; // This allows any additional props
}

const MyTextFieldCurrency: React.FC<MyTextFieldProps> = (
  props: MyTextFieldProps,
) => {
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
    inputStyle = { height: 19 },
    configUI,
    direction = "column",
    unit,
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";
  const [open, setOpen] = React.useState(false);
  const onChangeText = (value: string) => {
    const data = {
      target: {
        value: type == "current" ? formatCurrencyToNumber(value) : value,
        name: name,
      },
    };
    handleChange(data);
  };
  return (
    <Stack
      direction={direction}
      sx={{
        width: width,
        height: "fit-content",
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
        sx={{ my: 1, height: "36px" ,backgroundColor:'white'}}
        error={Boolean(validate[name] && errors.includes(name))}
      >
        <TextField
          fullWidth
          hiddenLabel
          size="small"
          type={type}
          name={name}
          variant="outlined"
          placeholder={placeholder}
          value={
            type === "current"
              ? formatCurrencyNoUnit(Number(values[name]))
              : values[name]
          }
          onChange={(e) => {
            if (unit == '%') {
              let valueInput = Number(e.target.value) 
              onChangeText(valueInput > 100 ? "100" : (e.target.value));
            }else{
              onChangeText(e.target.value);
            }
          }}
          inputProps={{ style: { backgroundColor: 'white', ...inputStyle } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" >
                <span style={{ color: "#98A2B3", fontSize: 14 }}>{unit}</span>
                {/* <ArrowDropDown /> */}

              </InputAdornment>
            ),
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

export default MyTextFieldCurrency;
