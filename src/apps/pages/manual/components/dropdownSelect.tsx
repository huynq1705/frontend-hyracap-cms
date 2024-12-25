import { ClickAwayListener } from "@mui/material";
import clsx from "clsx";
import * as React from "react";

export interface DropdownSelectProps {
    options: string[]; // Update type as needed
    value: string; // Update type as needed
    onChange: (value: string) => void; // Update type as needed
    className?: string;
    style?: React.CSSProperties;
    isOpenDropdown: boolean;
    setIsOpenDropdown: (value: boolean) => void;
}

export default function DropdownSelect(props: DropdownSelectProps) {
    const {
        options,
        value,
        onChange,
        className,
        setIsOpenDropdown,
        isOpenDropdown,
    } = props;

    const handleClickAway = () => setIsOpenDropdown(false);

    return (
        <div className={clsx(className, "relative")} style={props.style}>
            <div
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                className=""
            >
                {value}
            </div>
            {isOpenDropdown && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <ul className="absolute top-4 left-0 right-0">
                        {options.map((option, index) => (
                            <li
                                onClick={() => onChange(option)}
                                key={index}
                                className="decoration-none"
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </ClickAwayListener>
            )}
        </div>
    );
}
