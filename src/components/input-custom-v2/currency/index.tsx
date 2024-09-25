import React from "react";
import {
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import FormHelperTextCustom from "@/components/form-helper-text";

interface CurrencyInputProps {
  label: string;
  required?: string[];
  name: string;
  handleChange: (name: string, value: any) => void;
  values: { [key: string]: any };
  errors: string[];
  validate: { [key: string]: string };
  configUI?: {
    [key: string]: string;
  };
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  inputStyle?: React.CSSProperties;
  max?: number;
  min?: number;
  placeholder?: string;
  [x: string]: any; // This allows any additional props
}

const CustomCurrencyInput: React.FC<CurrencyInputProps> = (
  props: CurrencyInputProps,
) => {
  const {
    label,
    required,
    name,
    handleChange,
    values,
    validate,
    errors,
    configUI,
    direction = "column",
    inputStyle = { height: 36 },
    max = 100000000,
    min = 0,
    placeholder = "Nhập",
    ...prop
  } = props;

  const width = configUI?.width ? configUI.width : "100%";

  // Handle the change event to update the parent component's state
  const handleCurrencyChange = (values: {
    formattedValue: string;
    value: string;
  }) => {
    if (+values.value >= min && max >= +values.value)
      handleChange(name, values.value);
  };
  return (
    <Stack
      direction={direction}
      sx={{
        width: width,
        height: "fit-content",
        mb: 1,
      }}
      spacing={0.5}
      className="items-center"
    >
      <Typography
        component={"label"}
        sx={{
          width: configUI?.labelWidth ?? "100%",
        }}
        className="label"
      >
        {label}
        {required && required.includes(name) && (
          <span style={{ color: "red" }}>(*)</span>
        )}
      </Typography>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        sx={{ height: "36px" }}
        error={Boolean(validate[name] && errors.includes(name))}
      >
        <Box
          sx={{
            input: {
              height: inputStyle.height,
              padding: "0px 14px",
            },
            div: {
              width: "100%",
            },
          }}
        >
          <NumericFormat
            id={name}
            name={name}
            value={values[name] || ""}
            thousandSeparator={true}
            decimalScale={0}
            fixedDecimalScale={true}
            suffix="₫"
            customInput={TextField}
            onValueChange={handleCurrencyChange}
            max={max}
            min={min}
            placeholder={placeholder}
            isAllowed={(values) => {
              const { floatValue = 0 } = values;
              return floatValue >= min && floatValue <= max;
            }}
            {...prop}
          />
        </Box>
        {validate[name] && errors.includes(name) && (
          <FormHelperTextCustom text={validate[name]} />
        )}
      </FormControl>
    </Stack>
  );
};

export default CustomCurrencyInput;
