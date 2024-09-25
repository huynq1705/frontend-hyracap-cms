import { selectIsNavOpen } from "@/redux/selectors/navigation.slice";
import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";

type ResultCheckFullNav = {
    isFullNav: boolean,
    isBreakpoint: boolean,
}

export default function useCheckFullNav(breakpoint: Breakpoint = 'xl'): ResultCheckFullNav {
    const isNavOpen = useSelector(selectIsNavOpen);
    const theme = useTheme();
    const isBreakpoint = useMediaQuery(theme.breakpoints.up(breakpoint));

    const isFullNav = useMemo(() => isNavOpen && isBreakpoint, [isNavOpen, isBreakpoint]);

    return {
        isFullNav,
        isBreakpoint
    }
}