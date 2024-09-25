import React, { useState } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { Stack } from "@mui/material";

interface MyTextareaAutosizeProps {
  label: string;
  required?: string[];
  type?: "text" | "password";
  name: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  values: { [key: string]: any };
  errors: string[];
  validate: { [key: string]: string };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: {
    [key: string]: string | number;
  };
  [x: string]: any; // This allows any additional props
}

const MyTextareaAutosize: React.FC<MyTextareaAutosizeProps> = (
  props: MyTextareaAutosizeProps,
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
    inputStyle = { height: 35 },
    configUI,
    direction = "column",
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";
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
      <TextareaAutosize
        name={name}
        className="mt-2"
        minRows={configUI?.minRows ?? 2}
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange}
        // helperText={errors.includes(name) && validate[name]}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          resize: "none",
          ...inputStyle
        }}
        {...prop}
      />
    </Stack>
  );
};

export default MyTextareaAutosize;
