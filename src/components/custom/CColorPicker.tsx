import { IconButton, Popover } from "@mui/material";
import { forwardRef, memo, useState } from "react";
import { SketchPicker } from "react-color";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type CColorPickerProps = ControllerRenderProps<FieldValues, string>

const CColorPicker = (
    props: CColorPickerProps,
    ref: any
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                className="!border !border-gray-4 !border-solid !p-0 !shadow"
                onClick={handleClick}>
                <div
                    className="w-6 h-6 rounded-full"
                    style={{backgroundColor: props.value}}></div>
            </IconButton>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}>
                <input 
                    {...props}
                    className="cursor-pointer hidden"
                    type="color" />
                <SketchPicker
                    color={props.value}
                    onChange={e => props.onChange(e.hex)}/>
            </Popover>
        </>
    )
}

export default forwardRef(CColorPicker);