import React, { useEffect, useState } from "react";
import { Select, FormControl, Box, Button } from "@mui/material";
import { ListItem, ListItemText, List } from "@mui/material";

interface TimeSelectProps {
    onSelect: (value: string) => void;
    label: string;
    initialValue?: string;
}
const TimeSelect: React.FC<TimeSelectProps> = ({
    onSelect,
    label,
    initialValue = "",
}) => {
    const [time, setTime] = useState({
        hour: "00",
        minute: "00",
        amPm: "AM",
    });
    const [value, setValue] = useState<string>(label);
    const [open, setOpen] = useState<boolean>(false);

    const convertTo12Hour = (
        time: string
    ): { hour: string; minute: string; amPm: string } => {
        const [hour, minute] = time.split(":").map(Number);
        const amPm = hour >= 12 ? "PM" : "AM";
        let hour12 = hour % 12;
        hour12 = hour12 === 0 ? 12 : hour12;
        return {
            hour: hour12.toString().padStart(2, "0"),
            minute: minute.toString().padStart(2, "0"),
            amPm,
        };
    };

    const formatNumber = (num: any) => num.toString().padStart(2, "0");
    const handleSelect = () => {
        const displayValue = `${formatNumber(Number(time.hour))}:${formatNumber(
            Number(time.minute)
        )} ${time.amPm}`;
        setValue(displayValue);
        onSelect(displayValue);
        setOpen(false);
    };
    useEffect(() => {
        if (initialValue) {
            const { hour, minute, amPm } = convertTo12Hour(initialValue);
            setTime({ hour, minute, amPm });
            setValue(`${hour}:${minute} ${amPm}`);
        }
    }, [initialValue]);
    return (
        <div>
            <FormControl fullWidth>
                <Select
                    open={open}
                    // onClick={() => setOpen(true)}
                    value={value}
                    displayEmpty
                    renderValue={(value) => value}
                    sx={{ width: "100%", height: "36px" }}
                    MenuProps={{
                        PaperProps: {
                            onClick: (event: any) => event.stopPropagation(),
                        },
                    }}
                    disabled={true}
                >
                    <Box
                        sx={{
                            display: "flex",
                            overflowY: "auto",
                        }}
                    >
                        <List
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flex: 1,
                                flexDirection: "column",
                                overflowY: "auto",
                                height: "300px",
                                marginRight: "4px",
                            }}
                        >
                            {[...Array(12).keys()].map((i) => (
                                <ListItem
                                    key={i}
                                    onClick={() =>
                                        setTime((prev) => ({
                                            ...prev,
                                            hour: `${i + 1}`,
                                        }))
                                    }
                                    style={{
                                        textAlign: "center",
                                        padding: "4px",
                                        cursor: "pointer",
                                        backgroundColor:
                                            time.hour === `${i + 1}`
                                                ? "#F6FAF7"
                                                : "transparent",
                                        color:
                                            time.hour === `${i + 1}`
                                                ? "#50945D"
                                                : "inherit",
                                    }}
                                >
                                    <ListItemText
                                        primary={formatNumber(i + 1)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <List
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flex: 1,
                                flexDirection: "column",
                                overflowY: "auto",
                                height: "300px",
                                marginRight: "4px",
                            }}
                        >
                            {[...Array(60).keys()].map((i) => (
                                <ListItem
                                    key={i}
                                    onClick={() =>
                                        setTime((prev) => ({
                                            ...prev,
                                            minute: `${i}`,
                                        }))
                                    }
                                    style={{
                                        padding: "4px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        backgroundColor:
                                            time.minute === `${i}`
                                                ? "#F6FAF7"
                                                : "transparent",
                                        color:
                                            time.minute === `${i}`
                                                ? "#50945D"
                                                : "inherit",
                                    }}
                                >
                                    <ListItemText primary={formatNumber(i)} />
                                </ListItem>
                            ))}
                        </List>
                        <List
                            style={{
                                display: "flex",
                                flex: 1,
                                alignItems: "center",
                                flexDirection: "column",
                                overflowY: "auto",
                                height: "300px",
                            }}
                        >
                            <ListItem
                                onClick={() =>
                                    setTime((prev) => ({ ...prev, amPm: "AM" }))
                                }
                                style={{
                                    padding: "4px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    backgroundColor:
                                        time.amPm === "AM"
                                            ? "#F6FAF7"
                                            : "transparent",
                                    color:
                                        time.amPm === "AM"
                                            ? "#50945D"
                                            : "inherit",
                                }}
                            >
                                <ListItemText primary="AM" />
                            </ListItem>
                            <ListItem
                                onClick={() =>
                                    setTime((prev) => ({ ...prev, amPm: "PM" }))
                                }
                                style={{
                                    padding: "4px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    backgroundColor:
                                        time.amPm === "PM"
                                            ? "#F6FAF7"
                                            : "transparent",
                                    color:
                                        time.amPm === "PM"
                                            ? "#50945D"
                                            : "inherit",
                                }}
                            >
                                <ListItemText primary="PM" />
                            </ListItem>
                        </List>
                    </Box>
                    <Button
                        onClick={handleSelect}
                        style={{
                            width: "100%",
                            color: "#fff",
                            backgroundColor: "#50945D",
                            borderRadius: "8px",
                        }}
                    >
                        Chọn
                    </Button>
                </Select>
            </FormControl>
        </div>
    );
};

export default TimeSelect;
