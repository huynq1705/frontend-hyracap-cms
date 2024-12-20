import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const filter = createFilterOptions();
const arr = [
    { label: "The Godfather", id: 1 },
    { label: "Pulp Fiction", id: 2 },
];
export default function SelectSearchInput() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<any>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateNew = () => {
        setOpen(false);
        console.log("Tạo mới:", value);
    };

    return (
        <>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        // Nếu người dùng nhập vào "Tạo mới"
                        setOpen(true);
                        setValue(newValue);
                    } else if (newValue && newValue.inputValue) {
                        // Người dùng chọn "Tạo mới" từ danh sách
                        setOpen(true);
                        setValue(newValue.inputValue);
                    } else {
                        setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;

                    const isExisting = options.some(
                        (option) => inputValue === option.title
                    );
                    if (inputValue !== "" && !isExisting) {
                        filtered.push({
                            inputValue,
                            title: `Tạo mới "${inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={arr}
                getOptionLabel={(option) => {
                    if (typeof option === "string") {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.title;
                }}
                renderOption={(props, option) => (
                    <li {...props}>{option.title}</li>
                )}
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Movie" />
                )}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Tạo mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên phim"
                        type="text"
                        fullWidth
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleCreateNew}>Tạo</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
