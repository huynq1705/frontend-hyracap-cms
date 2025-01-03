import React, { useState, ChangeEvent, useCallback } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    TextField,
    Checkbox,
    ListItemText,
    Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import FormHelperTextCustom from "@/components/form-helper-text";

interface MySelectSearchQueryProps {
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
    widthBox?: string | number;
    className?: string;
}
const styleSearch: React.CSSProperties = {
    backgroundColor: "#fff !important",
};
const MySelectSearchQuery: React.FC<MySelectSearchQueryProps> = (
    props: MySelectSearchQueryProps
) => {
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
        itemsPerPage = 5,
        placeholder = "Chọn",
        widthBox,
        className,
        ...prop
    } = props;

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const width = configUI?.width || "100%";

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const filteredOptions = options.filter((option) =>
        (option.label || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedOptions = filteredOptions.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );
    let content = (function () {
        const value = values[name] || [];
        if (type === "select-one") {
            return (
                options.find((option: any) => option.value == value)?.label ??
                placeholder
            );
        }
        if (value.length === options.length) return "Tất cả";
        if (!value.length) return placeholder;

        const array_values = value
            .filter((x: any) => !!x)
            .map(
                (it: any) =>
                    options.find((option: any) => option.value == it)?.label ??
                    placeholder
            );
        return array_values.join(", ");
    })();

    const debounce = (func: Function, delay: number) => {
        let timer: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedSearch = useCallback(
        debounce((query: any) => {
            if (props.onSearch) {
                props.onSearch(query);
            }
        }, 500),
        []
    );

    return (
        <Stack
            className={className}
            direction={direction}
            sx={{
                width: widthBox || width,
                height: "fit-content",
                minWidth: "154px",
            }}
        >
            {label ? (
                <label className="label">
                    {label}{" "}
                    {required && required.includes(name) && (
                        <span style={{ color: "red" }}>(*)</span>
                    )}
                </label>
            ) : null}
            <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                    height: 36,
                    mb: validate[name] && errors.includes(name) ? 1 : 0,
                    my: 1,
                }}
                error={Boolean(validate[name] && errors.includes(name))}
            >
                {/* <Select
                    displayEmpty
                    name={name}
                    multiple={type === "select-multi"}
                    value={
                        type === "select-multi"
                            ? values[name] || []
                            : values[name] || ""
                    }
                    onChange={handleChange}
                    renderValue={() => (
                        <Typography
                            component={"p"}
                            sx={{
                                width: "100%", // Đặt chiều rộng cố định
                                whiteSpace: "nowrap", // Không xuống dòng
                                overflow: "hidden", // Cắt bỏ nội dung vượt quá
                                textOverflow: "ellipsis", // Thêm dấu "..." khi văn bản bị cắt
                            }}
                        >
                            {content}
                        </Typography>
                    )}
                    sx={inputStyle}
                    inputProps={{ "aria-label": "Without label" }}
                    {...prop}
                >
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
                                onChange={(e) => {
                                    const query = e.target.value;
                                    setSearchQuery(query);
                                    debouncedSearch(query);
                                }}
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
                    {displayedOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            className="!py-1"
                        >
                            {type === "select-multi" && (
                                <input
                                    type="checkbox"
                                    checked={values[name]?.includes(
                                        option.value
                                    )}
                                    className="custom-checkbox"
                                />
                            )}
                            <p className="text-sm">{option.label}</p>{" "}
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
                </Select> */}
                <Select
                    displayEmpty
                    name={name}
                    multiple={type === "select-multi"}
                    value={
                        type === "select-multi"
                            ? values[name] || []
                            : values[name] || ""
                    }
                    onChange={handleChange}
                    renderValue={() => (
                        <Typography
                            component={"p"}
                            sx={{
                                width: "100%", // Đặt chiều rộng cố định
                                whiteSpace: "nowrap", // Không xuống dòng
                                overflow: "hidden", // Cắt bỏ nội dung vượt quá
                                textOverflow: "ellipsis", // Thêm dấu "..." khi văn bản bị cắt
                            }}
                        >
                            {content}
                        </Typography>
                    )}
                    sx={inputStyle}
                    inputProps={{ "aria-label": "Without label" }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                maxHeight: 300, // Giới hạn chiều cao của dropdown
                            },
                        },
                    }}
                    {...prop}
                >
                    {/* search */}
                    {configUI?.isSearch && (
                        <MenuItem sx={styleSearch}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => {
                                    const query = e.target.value;
                                    setSearchQuery(query);
                                    debouncedSearch(query);
                                }}
                                fullWidth
                                onClick={(e) => e.stopPropagation()} // Cần ngừng sự kiện tại đây để đảm bảo sự kiện nhập liệu không bị chặn
                                sx={{
                                    ">input": {
                                        padding: "6px 8px",
                                    },
                                }}
                            />
                        </MenuItem>
                    )}
                    {displayedOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            className="!py-1"
                        >
                            {type === "select-multi" && (
                                <input
                                    type="checkbox"
                                    checked={values[name]?.includes(
                                        option.value
                                    )}
                                    className="custom-checkbox"
                                />
                            )}
                            <p className="text-sm">{option.label}</p>{" "}
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

                {validate[name] && errors?.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default MySelectSearchQuery;
