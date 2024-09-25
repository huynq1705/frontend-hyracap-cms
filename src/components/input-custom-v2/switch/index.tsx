import React from "react";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { Stack, FormControlLabel, FormControl } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";
import { styled } from "@mui/material/styles";
interface MySwitchProps {
  label: string;
  title: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  values: { [key: string]: any };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: {
    [key: string]: string;
  };
  errors: string[];
  validate: { [key: string]: string };
  [x: string]: any; // This allows any additional props
  required?: string[];
}

const MySwitch: React.FC<MySwitchProps> = (props: MySwitchProps) => {
  const {
    title,
    required,
    label,
    name,
    handleChange,
    values,
    validate,
    errors,
    inputStyle = {},
    configUI,
    direction = "column",
    ...prop
  } = props;
  const width = configUI?.width ? configUI.width : "100%";
  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    margin: "0px 12px",
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "var(--text-color-primary)",

          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "var(--text-color-primary)",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  return (
    <Stack
      direction={direction}
      sx={{
        width: width,
        height: "fit-content",
      }}
    >
      {" "}
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
        sx={{ my: 1, height: "36px" }}
        error={Boolean(validate[name] && errors.includes(name))}
      >
        <FormControlLabel
          sx={{ height: "36px" }}
          control={
            <IOSSwitch
              checked={values[name]}
              onChange={handleChange}
              name={name}
              sx={inputStyle}
              {...prop}
            />
          }
          label={title}
        />
        {validate[name] && errors.includes(name) && (
          <FormHelperTextCustom text={validate[name]} />
        )}
      </FormControl>
    </Stack>
  );
};

export default MySwitch;
