import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, Stack, FormControl } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";

interface CustomSelectProps {
    options: { id: string; full_name: string; phone_number: string }[];
    label?: string;
    required?: string[];
    type?: "number";
    name: string;
    placeholder?: string;
    handleChange: (id: string, phone_number: string, full_name: string) => void;
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

const CustomSelect: React.FC<CustomSelectProps> = (
    props: CustomSelectProps
) => {
    const {
        options,
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
        ...prop
    } = props;
    const [searchValue, setSearchValue] = useState("");
    const [selectedValue, setSelectedValue] = useState<{
        id: string;
        phone_number: string;
        full_name: string;
    } | null>(null);
    const width = configUI?.width ? configUI.width : "100%";

    const handleSelect = (
        event: React.SyntheticEvent,
        value:
            | string
            | { id: string; full_name: string; phone_number: string }
            | null
    ) => {
        if (typeof value === "string") {
            setSelectedValue({
                id: "",
                phone_number: value,
                full_name: "",
            });
        } else if (value && value.id) {
            setSelectedValue({
                id: value.id,
                phone_number: value.phone_number,
                full_name: value.full_name,
            });
        } else {
            setSelectedValue({
                id: "",
                phone_number: "",
                full_name: "",
            });
        }
    };

    // const getDisplayLabel = () => {
    //     const selectedOption = options.find(
    //         (option) => option.id === selectedValue
    //     );
    //     return selectedOption ? selectedOption.full_name : searchValue;
    // };
    useEffect(() => {
        if (selectedValue) {
            handleChange(
                selectedValue.id,
                selectedValue.phone_number,
                selectedValue.full_name
            );
        }
    }, [selectedValue]);
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
                <Autocomplete
                    freeSolo
                    options={options}
                    getOptionLabel={(option) =>
                        typeof option === "string"
                            ? option
                            : option.phone_number
                    }
                    onInputChange={(event, newInputValue) => {
                        setSelectedValue({
                            id: "",
                            phone_number: newInputValue,
                            full_name: "",
                        });
                    }}
                    onChange={handleSelect}
                    renderOption={(props, option) => (
                        <li {...props} className="p-2 hover:bg-[#F6FAF7]">
                            <Stack direction={"column"}>
                                <span className="text-[#50945D] text-sm">
                                    {option.full_name}
                                </span>
                                <span className="text-xs">
                                    {option.phone_number}
                                </span>
                            </Stack>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={placeholder}
                            InputProps={{
                                ...params.InputProps,
                                sx: {
                                    height: "36px",
                                    display: "flex",
                                    alignItems: "center",
                                },
                            }}
                        />
                    )}
                />
                {validate[name] && errors.includes(name) && (
                    <FormHelperTextCustom text={validate[name]} />
                )}
            </FormControl>
        </Stack>
    );
};

export default CustomSelect;
