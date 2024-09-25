import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, FormHelperText, Stack } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import { Image, Typography } from "antd";

interface MyTextFieldProps {
  label?: string;
  required?: string[];
  type?: "text" | "password" | "number";
  name: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: { [key: string]: any };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: {
    [key: string]: string;
  };
  [x: string]: any; // This allows any additional props
  render: (item: any, index : number) => JSX.Element;
  list : any [],
  p ?:number
}

const MySelectGroupV3: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
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
    render,
    configUI,
    direction = "column",
    list,
    p = 0,
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";

  return (

    <Stack
      direction={direction}
      spacing={1}
      sx={{
        width: width,
        height: "fit-content",
        backgroundColor:'white',
        p:p,
        borderRadius:"12px"
      }}
    >
      <label className="label">
      {label}  
      </label>
      <Stack sx={{ flexWrap: "wrap", flexDirection: 'row', gap: 2 }} >
          { list.map((item, index) => render(item, index)) }
      </Stack>
    </Stack>
  );
};

export default MySelectGroupV3;
