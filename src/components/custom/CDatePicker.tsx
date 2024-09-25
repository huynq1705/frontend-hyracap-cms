import useCustomTranslation from "@/hooks/useCustomTranslation";
import { CloseRounded } from "@mui/icons-material";
import { ClickAwayListener, IconButton, TextField } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import { memo, useRef, useState } from "react";
import { ControllerRenderProps, useFormContext } from "react-hook-form";

const DATE_FORMAT = "DD-MM-YYYY";
type CDatePickerProps<T extends object = Record<string, any>> = ControllerRenderProps<T> & DatePickerProps<Dayjs | string> & {
    onClearText?: () => void,
}

const CDatePicker = ({
    ...field
}: CDatePickerProps): JSX.Element => {
    const {T} = useCustomTranslation();
    const {getValues, setValue} = useFormContext<Record<string, any>>();
    const refDatePicker = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClearField = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setValue(field.name, '');
    }

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div>
                <div ref={refDatePicker} className="w-fit inline-block">
                    <DatePicker
                        {...field}
                        className="[&_.MuiInputAdornment-root]:!ml-0 [&_.MuiInputBase-root]:!pr-0"
                        format={DATE_FORMAT}
                        slotProps={{
                            popper: {
                                open: open,
                                anchorEl: refDatePicker.current,
                                placement: 'top-start',
                                className: '[&_.MuiPickersCalendarHeader-label]:!capitalize'
                            },
                        }}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        slots={{
                            textField: (props) => (
                                <TextField 
                                    {...props}
                                    size="small"
                                    label={T(field.name)}
                                    focused={open}
                                    error={false}
                                    value={dayjs(field.value).isValid() ? dayjs(field.value).format(DATE_FORMAT) : ''}
                                    InputProps={{
                                        ...props.InputProps,
                                        readOnly: true,
                                        onClick: handleOpen,
                                        endAdornment: (
                                            <div className="flex items-center" ref={props.inputRef}>
                                                <IconButton
                                                    className={clsx("!p-2 transition-all ease-in-out",
                                                        !getValues(field.name) ? '!invisible' : 'visible'
                                                    )}
                                                    size="small"
                                                    onClick={handleClearField}
                                                    >
                                                    <CloseRounded fontSize="small"/>
                                                </IconButton>
                                            </div>
                                        ),
                                    }}
                                    />
                            ),
                        }}
                        />
                </div>
            </div>
        </ClickAwayListener>
    )
}

export default memo(CDatePicker)