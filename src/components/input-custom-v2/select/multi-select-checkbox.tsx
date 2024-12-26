import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface MultipleSelectCheckmarksProps {
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  handleChange: (value: string[]) => void;
  values: { [key: string]: any };
  inputStyle?: React.CSSProperties;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  configUI?: { [key: string]: string };

  [x: string]: any; // This allows any additional props
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelectCheckmarks: React.FC<MultipleSelectCheckmarksProps> = (
  props: MultipleSelectCheckmarksProps
) => {
  const {
    options,
    label,
    placeholder,
    handleChange,
    values,
    inputStyle = { height: 36 },
    configUI,
    direction = "column",
    ...prop
  } = props;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const width = configUI?.width ? configUI.width : "100%";

  const handleSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    if (value.includes("select_all")) {
      if (selectedOptions.length === options.length) {
        setSelectedOptions([]);
        handleChange([]);
      } else {
        setSelectedOptions(options.map((option) => option.value));
        handleChange(selectedOptions);
      }
    } else {
      const newSelectedOptions = Array.isArray(value) ? value : [];
      setSelectedOptions(newSelectedOptions);
      handleChange(selectedOptions);
    }
  };

  const renderSelectedOptions = () => {
    if (selectedOptions.length === 0) return "";

    if (selectedOptions.length === options.length) {
      return "Tất cả đã được chọn";
    }

    if (selectedOptions.length > 3) {
      return `Đã chọn ${selectedOptions.length} ${label}`;
    }

    return selectedOptions
      .map((value) => {
        const option = options.find((option) => option.value === value);
        return option ? option.label : "";
      })
      .join(", ");
  };
  useEffect(() => {
    handleChange(selectedOptions);
  }, [selectedOptions]);

  return (
    <Stack
      direction={direction}
      sx={{
        width: width,
      }}
    >
      <FormControl
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          width: "100%",
        }}
      >
        <label className="label">{label}</label>
        <Select
          labelId="multiple-checkbox-label"
          id="multiple-checkbox"
          multiple
          value={selectedOptions}
          onChange={handleSelect}
          input={<OutlinedInput />}
          renderValue={() => renderSelectedOptions()}
          MenuProps={MenuProps}
          sx={{
            height: "36px",
            width: "100%",
            mt: 1,
          }}
        >
          <MenuItem value="select_all">
            <Checkbox
              checked={selectedOptions.length === options.length}
              sx={{
                color: "#50945D",
                "&.Mui-checked": { color: "#50945D" },
              }}
            />
            <ListItemText primary="Chọn tất cả" />
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                checked={selectedOptions.includes(option.value)}
                sx={{
                  color: "#50945D",
                  "&.Mui-checked": { color: "#50945D" },
                }}
              />
              <ListItemText
                primary={
                  <Tooltip title={option.label}>
                    <span
                      style={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        maxWidth: "calc(100% - 40px)",
                      }}
                    >
                      {option.label}
                    </span>
                  </Tooltip>
                }
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default MultipleSelectCheckmarks;
