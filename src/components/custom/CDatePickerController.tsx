import { DateRangeDateType, DateRangeValue } from "@/types/types";
import dayjs from "dayjs";
import { memo, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CDatePicker from "./CDatePicker";

type CDatePickerControllerProps = {
    name: DateRangeDateType,
    value: string,
}

const CDatePickerController = ({
    name,
    value
}: CDatePickerControllerProps): JSX.Element => {
    const {control, getValues, setValue} = useFormContext<DateRangeValue>();

    useEffect(() => {
        if(!value) return;
        setValue(name, dayjs(value) as any)
    }, [value])

    return (
        <Controller
            defaultValue={""}
            key={name}
            name={name}
            control={control}
            render={({field}) =>
                <CDatePicker
                    {...field}
                    maxDate={field.name === 'start_time' ? (getValues('end_time') || dayjs(new Date())) : dayjs(new Date())}
                    minDate={field.name === 'end_time' ? getValues('start_time') || undefined : undefined}/>
            }/>
    )
}

export default memo(CDatePickerController);