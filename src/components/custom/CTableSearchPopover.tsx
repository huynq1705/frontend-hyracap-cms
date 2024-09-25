import useCustomTranslation from "@/hooks/useCustomTranslation"
import { ClearOutlined, FilterAltOutlined, SearchOutlined } from "@mui/icons-material"
import { Button, Checkbox, FormControlLabel, IconButton, Popover, Radio, RadioGroup, TextField } from "@mui/material"
import clsx from "clsx"
import _ from "lodash"
import { memo, useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CTableSearchFilterForm, CTableSearchFilterFormData } from "./CTable"

type CTableSearchPopoverProps = CTableSearchFilterForm;

const CTableSearchPopover = ({
    icon,
    formData,
    onSubmit,
    formValue
}: CTableSearchPopoverProps): JSX.Element => {
    const {T} = useCustomTranslation();
    const { control, handleSubmit, formState: { errors }, setValue, watch} = useForm<any>();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClearTextField = (fieldName: string) => {
        setValue(fieldName, '');
    }

    useEffect(() => {
        if(!Boolean(anchorEl)) return;
        formData.forEach(fieldItem => {
            switch(fieldItem.type) {
                case 'radio':
                case 'text': {
                    const fieldName = fieldItem.key || 'all';
                    const value = formValue[fieldItem.key];
                    setValue(fieldName, value);
                    return;
                }
                case 'checkbox': {
                    fieldItem.options.forEach(opt => {
                        const fieldName = opt.value || 'all';
                        const checked =  (Boolean(_.isArray(formValue[fieldItem.key]) && Array.from(formValue[fieldItem.key]).includes(fieldName))) || !formValue[fieldItem.key];
                        setValue(fieldName, checked);
                    })
                    return; 
                }
            }
        })
    }, [formData, formValue, Boolean(anchorEl)])
    

    const renderByType = (fieldItem: CTableSearchFilterFormData) => {
        switch(fieldItem.type) {
            case 'text': {
                return (
                    <Controller
                        key={fieldItem.key}
                        name={fieldItem.key}
                        control={control}
                        rules={{  required: false }}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                size="small"
                                className="max-w-[320px] min-w-[280px]"
                                placeholder={`${T('search')} ${T(fieldItem.key)}`}
                                variant="outlined"
                                margin="none"
                                error={!!errors[fieldItem.key]}
                                spellCheck={false}
                                
                                InputProps={{
                                    startAdornment: (
                                        <SearchOutlined className="!text-gray-400 mr-2"/>
                                    ),
                                    endAdornment: (
                                        <IconButton
                                            className={clsx(!watch(field.name) && '!hidden')}
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClearTextField(field.name)}
                                            size="small"
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end">
                                            <ClearOutlined className="!text-lg"/>
                                        </IconButton>
                                    )
                                }}
                            />
                        )}
                    />
                    
                )
            }
            case 'checkbox': {
                return (
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-9 px-1 py-0.5">{T('selectAtLeastOne')}</span>
                        <Button 
                            size="small"
                            disableRipple
                            className="flex items-center !justify-start w-full !pl-0 !pr-3 !text-black">
                            <FormControlLabel
                                label={T('all')}
                                className="w-full !m-0 h-9"
                                control={
                                    <Checkbox
                                    
                                        checked={fieldItem.options.every(v => watch(v.value))}
                                        onClick={() => {
                                            const isSelectedAll = fieldItem.options.every(v => watch(v.value));
                                            fieldItem.options.forEach(v => setValue(v.value, !isSelectedAll));
                                        }}
                                        indeterminate={fieldItem.options.some(v => watch(v.value)) && !fieldItem.options.every(v => watch(v.value))}/>
                                    }/>
                        </Button>
                        {
                            fieldItem.options.map((option, i) => 
                                <Controller
                                    key={i}
                                    name={option.value || 'all'}
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field }) => {
                                        return (
                                            <Button
                                                disableRipple
                                                size="small" 
                                                className="flex items-center !justify-start w-full !pl-0 !pr-3 !text-black">
                                                <FormControlLabel
                                                    className="w-full !m-0 h-9"
                                                    label={option.label}

                                                    control={
                                                        <Checkbox {...field} checked={!!field.value}/>
                                                    }/>
                                            </Button>
                                        )
                                    }
                                }/>
                            )
                        }
                    </div>
                )
            }
            case 'radio': {
                return (
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-9 px-1 py-0.5">{T('SelectOne')}</span>
                        <div className="max-h-[320px] overflow-y-auto overflow-x-hidden pl-2">
                            <Controller
                                key={fieldItem.key}
                                name={fieldItem.key}
                                control={control}
                                rules={{  required: false }}
                                render={({ field }) => (
                                    <RadioGroup
                                        {...field}
                                        value={field.value || ""}>
                                        <FormControlLabel
                                            value={""}
                                            control={<Radio />} 
                                            label={T('all')} />
                                        {
                                            fieldItem.options.map((option,i) => 
                                                <FormControlLabel
                                                    key={i} 
                                                    value={option.value}
                                                    control={<Radio />} 
                                                    label={option.label} />
                                            )
                                        }
                                    </RadioGroup>
                                )}/>
                        </div>
                    </div>
                )
            }
            default: {
                return <></>
            }
        }
    }

    const renderIcon = () => {
        switch(formData[0].type) {
            case 'radio':
            case 'text': {
                const isBeingFiltered = formData.some(field => !!watch(field.key));
                return (
                    <SearchOutlined className={clsx(isBeingFiltered && '!text-primary')}/>
                )
            }
            case 'checkbox': {
                const isBeingFiltered = formData[0].options.some(option => !!watch(option.value || 'all'))
                return (
                    <FilterAltOutlined className={clsx(isBeingFiltered && '!text-primary')}/>
                )
            }
            default: {
                return <></>
            }
        }
    }

    return (
        <div>
            <IconButton
                onClick={handleClick}
                aria-describedby={'ctable-search-popover'} 
                size="small" 
                className="child:!text-lg !p-1 ">
                {   icon ?? renderIcon()}
            </IconButton>
            <Popover
                id={Boolean(anchorEl) ? 'ctable-search-popover' : undefined}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                >
                <form
                    className="flex flex-col space-y-2"
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="pb-1 pt-2 px-2">
                        {
                            formData.map(fieldItem => 
                                renderByType(fieldItem)
                            )
                        }
                    </div>
                    <div className="flex space-x-2 p-2 justify-end w-full border-t border-gray-4">
                        <Button
                            onClick={handleClose}
                            size="small"
                            variant="text">
                            {T('cancel')}
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleClose}
                            disabled={formData.every(fieldItem => {
                                if(fieldItem.type === 'text') return false;
                                if(fieldItem.type === 'radio') return watch(fieldItem.key) === undefined;
                                return !fieldItem.options.some(v => watch(v.value));
                            })}
                            size="small"
                            variant="contained">
                            {T('apply')}
                        </Button>
                    </div>
                </form>
            </Popover>
        </div>
    )
}

export default memo(CTableSearchPopover);