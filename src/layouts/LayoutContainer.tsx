import AnimatedContainer from "@/routers/AnimatedContainer";
import { memo } from "react";
import { useOutlet } from "react-router-dom";

const LayoutContainer = (): JSX.Element => {
    const outlet = useOutlet();

    return (
        <AnimatedContainer>
            {outlet} 
        </AnimatedContainer>
    )
}

export default memo(LayoutContainer)