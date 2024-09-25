import React, { useEffect, useState } from "react";
import { FormControl, Stack } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import { ColorPicker } from "antd";

interface MyColorPickerProps {
  label?: string;
  required?: string[];
  type?: "text" | "password" | "number" | "color";
  name: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
const MyColorPicker: React.FC<MyColorPickerProps> = (
  props: MyColorPickerProps,
) => {
  const {
    label,
    required,
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
    ...prop
  } = props;
  const [color, setColor] = useState(values[name]);

  useEffect(() => {
    setColor(values[name]);
  }, [values[name]]);
  const width = configUI?.width || "100%";
  return (
    <Stack
      direction={direction}
      mt={1.5}
      sx={{
        width,
        height: "fit-content",
      }}
    >
      {label && (
        <label className="label">
          {label}
          {required && required.includes(name) && (
            <span style={{ color: "red" }}>(*)</span>
          )}
        </label>
      )}
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        sx={{ my: 1, height: "36px" }}
        error={Boolean(validate[name] && errors.includes(name))}
      >
        <ColorPicker
          defaultValue={color}
          value={color}
          onChange={(c) => {
            setColor(c.toHexString());
            handleChange({
              target: { name, value: c.toHexString() },
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          className="flex justify-start"
          {...prop}
        />
        {validate[name] && errors.includes(name) && (
          <FormHelperTextCustom text={validate[name]} />
        )}
      </FormControl>
    </Stack>
  );
};

export default MyColorPicker;
