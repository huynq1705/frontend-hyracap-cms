import React, { useState } from "react";
import { FormControl, Stack, TextField } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import { Input, Select, Space } from "antd";
import { NumericFormat } from "react-number-format";

interface MyTextFieldProps {
  label?: string;
  required?: string[];
  type?: "number";
  name: string;
  placeholder?: string;
  handleChange: (name: string, value: any) => void;
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

const MyTextFieldV2: React.FC<MyTextFieldProps> = (props: MyTextFieldProps) => {
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
    max = 100000000,
    min = 0,
    ...prop
  } = props;
  const [unit, setUnit] = useState("%");
  const width = configUI?.width ? configUI.width : "100%";
  const handleChangeSelect = (value: string) => {
    setUnit(value);
    handleChange(name, "");
  };
  const handleCurrencyChange = (values: {
    formattedValue: string;
    value: string;
  }) => {
    let convert_value = +values.value;
    if (convert_value > max) convert_value = max;
    if (convert_value < min) convert_value = min;
    handleChange(name, convert_value.toString());
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
        {label}
        {required && required.includes(name) && (
          <span style={{ color: "red" }}>(*)</span>
        )}
      </label>
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          height: 36,
          mb: validate[name] && errors.includes(name) ? 1 : 0,
          mt: 1,
        }}
        error={Boolean(validate[name] && errors.includes(name))}
      >
        <Space.Compact
          style={{
            // marginTop: "2px",
            height: "36px !important",
          }}
          className="input-v2-custom !rounded-r-md"
        >
          {unit === "%" ? (
            <Input
              name={name}
              onChange={(e) => {
                const { value, name } = e?.target;
                let convert_value = +value / 100;
                if (convert_value > 1) convert_value = 1;
                if (convert_value < 0) convert_value = 0;
                handleChange(name, convert_value);
              }}
              placeholder={placeholder}
              value={values[name] === "" ? "" : +values[name] * 100}
              className="!h-full"
              type={type}
              {...prop}
            />
          ) : (
            <NumericFormat
              id={name}
              name={name}
              value={values[name] || ""}
              thousandSeparator={true}
              decimalScale={0}
              fixedDecimalScale={true}
              placeholder={placeholder}
              suffix="₫"
              customInput={TextField}
              onValueChange={handleCurrencyChange}
              {...prop}
            />
          )}

          <Select
            style={{ width: 80 }}
            onChange={handleChangeSelect}
            options={[
              { value: "%", label: "%" },
              { value: "VND", label: "VND" },
            ]}
            value={unit}
            className="!h-full !rounded-r-md"
            {...prop}
          />
        </Space.Compact>
        {validate[name] && errors.includes(name) && (
          <FormHelperTextCustom text={validate[name]} />
        )}
      </FormControl>
    </Stack>
  );
};

export default MyTextFieldV2;
