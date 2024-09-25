import useCustomTranslation from "@/hooks/useCustomTranslation";
import clsx from "clsx";
import { HTMLAttributes, memo } from "react";

type CStatusColorType = 'success' | 'warning' | 'danger' | 'info'|'timeout';
type CStatusProps = HTMLAttributes<HTMLSpanElement> & {
    label: string | number,
    color?: CStatusColorType,
}

const CStatus = ({
    label,
    color = 'success',
    ...props
}: CStatusProps): JSX.Element => {
    const {T} = useCustomTranslation();

    return (
        <span
            {...props}
            className={clsx(
                "py-0.5 px-2.5 font-bold text-white text-xs rounded select-none flex flex-wrap w-fit text-center whitespace-nowrap",
                color === 'success' && "bg-success-5",
                color === 'warning' && "bg-warning-5 text-gray-9",
                color === 'danger' && "bg-danger-5",
                color === 'info' && "bg-info-5",
                color ==='timeout' && "bg-timeout-5",
                props.className,
            )}
        >
            {T(`${label}`)}
        </span>
    )
}

export default memo(CStatus)