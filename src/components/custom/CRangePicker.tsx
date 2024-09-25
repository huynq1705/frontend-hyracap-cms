import { selectLang } from "@/redux/selectors/app.selector";
import { DateRangeDateType, DateRangeValue } from "@/types/types";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker, DateRangePickerProps } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from "dayjs";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const DATE_FORMAT = 'YYYY-MM-DD';
type CRangePickerProps = Partial<Omit<DateRangePickerProps<Dayjs>, "value" | "onChange">> & {
    onChange?: (ranges: DateRangeValue) => void,
    value: { [key in DateRangeDateType]: Date },
    isError?: boolean,
}
const CRangePicker = ({
    onChange,
    value,
    isError,
    ...props
}: CRangePickerProps): JSX.Element => {
    const lang = useSelector(selectLang)
    const methods = useForm<DateRangeValue>();
    // const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);

    // const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    // const handleClear = () => {
    //     onChange && onChange({
    //         start_time: '',
    //         end_time: ''
    //     })
    // }

    return (
        <FormProvider {...methods}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
                <DemoItem component="DateRangePicker">
                    <DateRangePicker
                        {...props}
                        onChange={(e) => {
                            onChange && onChange({
                                start_time: (e[0] || '') as string,
                                end_time: (e[1] || '') as string,
                            })
                        }}
                        value={[
                            dayjs(value.start_time).isValid() ? dayjs(value.start_time) : null,
                            dayjs(value.end_time).isValid() ? dayjs(value.end_time) : null
                        ]}
                        className=" border-gray-5 hover:border-gray-7 transition-all rounded-md box-border space-x-1 w-[280px]"
                        slotProps={{
                            popper: {
                                sx: {
                                    'div:has(+ .MuiDateRangeCalendar-monthContainer):not(.MuiDateRangeCalendar-monthContainer)': {
                                        display: 'none !important',
                                    },
                                }
                            },
                            textField: {
                                label: undefined,
                                error: isError,
                                placeholder: 'DD/MM/YYYY',
                                size: 'small',
                                InputProps: {
                                    className: "flex pl-2 !text-gray-8 !text-sm !h-8 !pl-0 !pr-1 !w-50 ",
                                }
                            }
                        }}
                        calendars={2}
                         />
                </DemoItem>
                {/* <TextField
                    size="small"
                    onClick={handleClick}
                    className="p-2 flex items-center !text-xs"
                    InputProps={{
                        readOnly: true,
                        className: "flex pl-2 !text-gray-8 !text-sm !h-8 !pl-0 !pr-1 !w-50",
                        endAdornment: (
                            value.end_time || value.start_time ?
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClear()
                                    }}>
                                    <CloseOutlinedIcon fontSize="small" />
                                </IconButton>
                                :
                                <CalendarMonthOutlinedIcon className="!text-gray-8" />
                        )
                    }}
                    value={`${value.start_time && dayjs(value.start_time).isValid() ? dayjs(value.start_time).format(DATE_FORMAT)
                        : DATE_FORMAT} ~ ${value.end_time && dayjs(value.end_time).isValid() ?
                            dayjs(value.end_time).format(DATE_FORMAT) : DATE_FORMAT}`} /> */}
                {/* <Popover
                    open={!!anchorEl}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted={false}
                >
                    <DemoContainer components={['DateRangeCalendar ']}>
                        <DateRangeCalendar
                            onChange={(value, selectionState) => {
                                const values: DateRangeValue = {
                                    start_time: dayjs(value[0]).isValid() ? dayjs(value[0]).format(DATE_FORMAT) : '',
                                    end_time: dayjs(value[1]).isValid() ? dayjs(value[1]).format(DATE_FORMAT) : '',
                                };
                                onChange && onChange(values);
                                if (selectionState !== 'finish') return;
                                handleClose();
                            }}
                            value={[
                                value.start_time && dayjs(value.start_time).isValid() ? dayjs(value.start_time) : null,
                                value.end_time && dayjs(value.end_time).isValid() ? dayjs(value.end_time) : null,
                            ]}
                            maxDate={dayjs(new Date())}
                            // minDate={dayjs(value.start_time).subtract(15, 'days')}
                            reduceAnimations
                            // currentMonthCalendarPosition={2}
                            disableAutoMonthSwitching
                            defaultCalendarMonth={dayjs(new Date()).subtract(dayjs(new Date()).daysInMonth(), 'days')}
                            sx={{
                                'div:has(+ .MuiDateRangeCalendar-monthContainer):not(.MuiDateRangeCalendar-monthContainer)': {
                                    display: 'none !important',
                                },
                            }}
                        />
                    </DemoContainer>
                </Popover> */}
            </LocalizationProvider>
        </FormProvider>
    )
}

export default memo(CRangePicker)