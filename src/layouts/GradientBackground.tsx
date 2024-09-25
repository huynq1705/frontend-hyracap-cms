import Path from "@/utils/path";
import { memo } from "react";

const GradientBackground = (): JSX.Element => {
    return (
        <img
            className="absolute w-full h-full inset-0 pointer-events-none z-0 select-none"
            src={Path.get(`../../assets/images/background.png`)}
        />
    );
};

export default memo(GradientBackground);
