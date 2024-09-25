import { useIsFetching } from "@tanstack/react-query";
import clsx from "clsx";
import { memo } from "react";
import LinearLoading from "./LinearLoading";


const TopProgressBar = (): JSX.Element => {
    const isFetching = useIsFetching();
    
    return (
        <div className={clsx("absolute w-full !z-[9999] top-0")}>
            {isFetching ? <LinearLoading/> : null}
        </div>
    )
}

export default memo(TopProgressBar);