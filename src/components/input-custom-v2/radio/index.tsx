import React, { useState } from "react";
import { FormControl, Grid, RadioGroup, Stack } from "@mui/material";
import get from "lodash/get";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormHelperTextCustom from "@/components/form-helper-text";
interface MyRadioProps {
  label: string;
  required?: string[];
  name: string;
  placeholder?: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
  values: { [key: string]: any };
  errors: string[];
  validate: { [key: string]: string };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: {
    [key: string]: string;
  };
  options: {
    label: string;
    value: string;
  }[];
  [x: string]: any; // This allows any additional props
}
const MyRadio: React.FC<MyRadioProps> = (props: MyRadioProps) => {
  const {
    label,
    required,
    name,
    placeholder,
    handleChange,
    values,
    validate,
    errors,
    inputStyle = { height: 35 },
    configUI,
    direction = "column",
    options,
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";
  return (
    <Stack
      direction={direction}
      justifyContent={"space-between"}
      alignItems={direction==="row" ? "center" :"flex-start"}

      sx={{
        width: width,
        height: "fit-content",
        flexWrap:"wrap",
        gap:2
      }}
    >
      <label className="label">
        {label}{" "}
        {required && required.includes(name) && (
          <span style={{ color: "red" }}>(*)</span>
        )}
      </label>
      <FormControl
        fullWidth={direction==='column'}
        variant="outlined"
        size="small"
        
        sx={{ my: 1, height: "36px", borderWidth: 1,justifyContent:'center'}}
        error={Boolean(validate[name] && errors.includes(name))}
        {...prop}
      >
        <RadioGroup
          {...prop}
          row
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
            },
          }}
          aria-label={name}
          value={get(values, name)}
          onChange={handleChange}
          name={name}
        >
          {options.map((item) => {
            return (
              <FormControlLabel
                key={item.value}
                value={item.value}
                control={<Radio color="primary" />}
                label={item.label}
              />
            );
          })}
        </RadioGroup>
        {validate[name] && errors.includes(name) && (
          <FormHelperTextCustom text={validate[name]} />
        )}
      </FormControl>
    </Stack>
  );
};

export default MyRadio;
