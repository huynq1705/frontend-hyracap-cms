import React, { useState } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    Checkbox,
    ListItemText,
    TextField,
    Pagination,
    FormHelperText,
    Stack,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Option {
    value: string;
    label: string;
}

interface MultipleSelectProps {
    label: string;
    name: string;
    handleChange: (event: SelectChangeEvent<any>) => void;
    values: Option[];
    options: Option[];
    errors: string[];
    validate: { [key: string]: string };
    inputStyle?: React.CSSProperties;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    configUI?: {
        [key: string]: string;
    };
    itemsPerPage?: number;
}

const styleSearch: React.CSSProperties = {
    backgroundColor: "#fff !important",
};

const MultipleSelect: React.FC<MultipleSelectProps> = (
    props: MultipleSelectProps
) => {
    const {
        label,
        name,
        handleChange,
        values,
        options,
        validate,
        errors,
        inputStyle = { height: 36 },
        direction = "column",
        configUI,
        itemsPerPage = 10,
    } = props;

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const width = configUI?.width ? configUI.width : "100%";

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedOptions = filteredOptions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Stack
            direction={direction}
            sx={{
                width: width,
                height: "fit-content",
            }}
        >
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ height: 36, my: 1 }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                <InputLabel id={`multiple-select-${name}`}>{label}</InputLabel>
                <Select
                    labelId={`multiple-select-${name}`}
                    multiple
                    value={values.map((v) => v.value)}
                    onChange={handleChange}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => {
                        const selectedLabels = options
                            .filter((option) =>
                                (selected as string[]).includes(option.value)
                            )
                            .map((option) => option.label);
                        return selectedLabels.join(", ");
                    }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                            },
                        },
                    }}
                    sx={inputStyle}
                >
                    {/* Search */}
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
                    {displayedOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox
                                checked={values.some(
                                    (v) => v.value === option.value
                                )}
                            />
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
                    <FormHelperText>{validate[name]}</FormHelperText>
                )}
            </FormControl>
        </Stack>
    );
};

export default MultipleSelect;
