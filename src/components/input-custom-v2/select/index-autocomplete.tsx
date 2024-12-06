import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, Stack, FormControl } from "@mui/material";
import FormHelperTextCustom from "@/components/form-helper-text";

interface CustomAutocompleteProps {
    options: { value: string; label: string }[];
    label?: string;
    required?: string[];
    type?: "number";
    name: string;
    placeholder?: string;
    handleChange: (value: string, label: string) => void;
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

const CustomAutocomplete: React.FC<CustomAutocompleteProps> = (
    props: CustomAutocompleteProps
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
        value: string;
        label: string;
    } | null>(null);
    const width = configUI?.width ? configUI.width : "100%";

    const handleSelect = (
        event: React.SyntheticEvent,
        value: string | { value: string; label: string } | null
    ) => {
        if (typeof value === "string") {
            setSelectedValue({
                value,
                label: "",
            });
        } else if (value && value.value) {
            setSelectedValue(value);
        } else {
            setSelectedValue({
                value: "",
                label: "",
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
            handleChange(selectedValue.value, selectedValue.label);
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
            {/* <label className="label">
                {label}
                {required && required.includes(name) && (
                    <span style={{ color: "red" }}>(*)</span>
                )}
            </label> */}
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
                        typeof option === "string" ? option : option.label
                    }
                    onInputChange={(event, newInputValue) => {
                        setSelectedValue({
                            value: newInputValue,
                            label: "",
                        });
                    }}
                    onChange={handleSelect}
                    renderOption={(props, option) => (
                        <li {...props} className="p-2 hover:bg-[#F6FAF7]">
                            <Stack direction={"column"}>
                                <span className="text-[#50945D] text-sm">
                                    {option.label}
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

export default CustomAutocomplete;
