import React, { useState, ChangeEvent } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    OutlinedInput,
    Box,
    TextField,
    Checkbox,
    ListItemText,
    FormHelperText,
    ListItemIcon,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Flex } from "antd";
import FormHelperTextCustom from "@/components/form-helper-text";

interface MySelectProps {
    label?: string;
    required?: string[];
    type?: "select-one" | "select-multi";
    name: string;
    handleChange: (event: SelectChangeEvent<any>) => void;
    values: { [key: string]: any };
    options: { value: string; label: string }[];
    errors: string[];
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    itemsPerPage?: number;
    placeholder?: string;
    [x: string]: any; // This allows any additional props
}
const styleSearch: React.CSSProperties = {
    backgroundColor: "#fff !important",
};
const MySelect: React.FC<MySelectProps> = (props: MySelectProps) => {
    const {
        label,
        required,
        type = "select-one",
        name,
        handleChange,
        values,
        validate,
        errors,
        options,
        inputStyle = { height: 36 },
        configUI,
        direction = "column",
        itemsPerPage = 10,
        placeholder = "Chọn",
        ...prop
    } = props;

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const width = configUI?.width || "100%";

    const [selected, setSelected] = useState([]);
    const isAllSelected =
        options.length > 0 && selected.length === options.length;

    // const handleChange = (event) => {
    //     const value = event.target.value;
    //     if (value[value.length - 1] === "all") {
    //         setSelected(selected.length === options.length ? [] : options);
    //         return;
    //     }
    //     setSelected(value);
    // };

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedOptions = filteredOptions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    let content =
        type === "select-multi"
            ? values[name]
                .filter((x: any) => !!x)
                .map(
                    (it: any) =>
                        options.find((option: any) => option.value == it)
                            ?.label ?? placeholder
                )
                .join(", ")
            : options.find((option: any) => option.value == values[name])
                ?.label ?? placeholder;
    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
                // minWidth:'162px'
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
                sx={{
                    height: 36,
                    mb: validate[name] && errors.includes(name) ? 1 : 0,
                    mt: 1,
                }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <Select
                    displayEmpty
                    name={name}
                    multiple={type === "select-multi"}
                    // value={
                    //     type === "select-multi"
                    //         ? values[name] || ""
                    //         : values[name]
                    //         ? values[name][0]
                    //         : "" || ""
                    // }
                    value={selected}
                    onChange={handleChange}
                    renderValue={() => <p>{content}</p>}
                    sx={inputStyle}
                    inputProps={{ "aria-label": "Without label" }}
                    {...prop}
                >
                    {/* search */}
                    {configUI?.isSearch && (
                        <MenuItem
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            sx={styleSearch}
                        >
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                fullWidth
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                sx={{
                                    ">input": {
                                        padding: "6px 8px",
                                    },
                                }}
                            />
                        </MenuItem>
                    )}
                    <MenuItem
                        value="all"
                        // classes={{
                        //     root: isAllSelected ? classes.selectedAll : ""
                        // }}
                    >
                        <ListItemIcon>
                            <Checkbox
                                // classes={{ indeterminate: classes.indeterminateColor }}
                                checked={isAllSelected}
                                indeterminate={
                                    selected.length > 0 && selected.length < options.length
                                }
                            />
                        </ListItemIcon>
                        <ListItemText
                            // classes={{ primary: classes.selectAllText }}
                            primary="Select All"
                        />
                    </MenuItem>
                    {displayedOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {type === "select-multi" && (
                                <Checkbox
                                    checked={values[name]?.includes(
                                        option.value
                                    )}
                                />
                            )}
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                    {filteredOptions.length > itemsPerPage && (
                        <MenuItem
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <Pagination
                                className="custom-pagination"
                                count={Math.ceil(
                                    filteredOptions.length / itemsPerPage
                                )}
                                page={page}
                                onChange={handlePageChange}
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                        </MenuItem>
                    )}
                </Select>
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MySelect;
