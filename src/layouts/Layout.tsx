import TopProgressBar from "@/components/TopProgressBar";
import useCheckFullNav from "@/hooks/useCheckFullNav";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import GradientBackground from "./GradientBackground";
import Header from "./Header";
import Navigation from "./Navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsNavHover,
  selectIsNavOpen,
} from "@/redux/selectors/navigation.slice";
import { setNavHover, setNavOpen } from "@/redux/slices/navigation.slice";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonCore from "@/components/button/core";

const OPEN_COMPACT_WIDTH = 258;
const OPEN_WIDTH = 258;
const CLOSE_WIDTH = 72;
type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps): JSX.Element => {
  const dispatch = useDispatch();
  const isNavOpen = useSelector(selectIsNavOpen);
  const isNavHover = useSelector(selectIsNavHover);
  const [drawerWidth, setDrawerWidth] = useState<number>(OPEN_WIDTH);
  const { isBreakpoint } = useCheckFullNav();
  useEffect(() => {
    let new_width = OPEN_WIDTH;
    if (!isNavOpen) new_width = CLOSE_WIDTH;
    if (isNavHover) new_width = OPEN_WIDTH;
    setDrawerWidth(new_width);
  }, [isNavOpen, isNavHover]);

  const handleDrawerToggle = () => {
    dispatch(setNavOpen(!isNavOpen));
  };
  const container = window !== undefined ? () => document.body : undefined;
  return (
    <Box sx={{ display: "flex" }} className="relative ">
      <CssBaseline />
      {/* <GradientBackground /> */}
      <TopProgressBar />
      {/* navbar */}
      <Box
        component="nav"
        className="[&_.MuiDrawer-paper]:transition-all [&_.MuiDrawer-paper]:bg-transparent [&_.MuiDrawer-paper]:border-r-0"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile */}
        <Drawer
          container={container}
          variant="temporary"
          open={isNavOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: {
              xs: "block",
              sm: "none",
              md: "none",
              lg: "none"
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: OPEN_COMPACT_WIDTH,
            },
          }}
        >
          {/* <GradientBackground /> */}
          <Navigation isOpen={isNavOpen} isHover={isNavHover} />
        </Drawer>
        {/* Tablet */}
        <Drawer
          container={container}
          onMouseEnter={() => dispatch(setNavHover(true))}
          onMouseLeave={() => dispatch(setNavHover(false))}
          variant="permanent"
          sx={{
            display: {
              xs: "none",
              sm: "block",
              md: "block",
              lg: "none",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width:
                !isNavOpen && isNavHover
                  ? isBreakpoint
                    ? OPEN_WIDTH
                    : OPEN_COMPACT_WIDTH
                  : drawerWidth,
              position: !isNavOpen && isNavHover ? "absolute" : "static",
              backgroundColor:
                !isNavOpen && isNavHover ? "#fff" : "transparent",
              transition: "all 0.2s linear",
            },
          }}
          className={clsx(
            !isNavOpen &&
            isNavHover &&
            "danhnc [&_.MuiDrawer-paper]:drop-shadow-[0px_4px_30px_rgba(0,0,0,.15)] ",
          )}
        >
          <Navigation
            handleDrawerToggle={handleDrawerToggle}
            isOpen={isNavOpen}
          />
        </Drawer>
        {/* Web  */}
        <Drawer
          variant="permanent"
          onMouseEnter={() => dispatch(setNavHover(true))}
          onMouseLeave={() => dispatch(setNavHover(false))}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "block",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width:
                !isNavOpen && isNavHover
                  ? isBreakpoint
                    ? OPEN_WIDTH
                    : OPEN_COMPACT_WIDTH
                  : drawerWidth,
              position: !isNavOpen && isNavHover ? "absolute" : "static",
              backgroundColor:
                !isNavOpen && isNavHover ? "#fff" : "transparent",
              transition: "all 0.2s linear",
            },
          }}
          className={clsx(
            !isNavOpen &&
            isNavHover &&
            "[&_.MuiDrawer-paper]:drop-shadow-[0px_4px_30px_rgba(0,0,0,.15)]"
          )}
        >
          <Navigation
            handleDrawerToggle={handleDrawerToggle}
            isOpen={isNavOpen}
            isHover={isNavHover}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          transition: "all 0.2s linear",
        }}
        className="h-full flex flex-col transition-all z-10 overflow-hidden grow"
      >
        {/* header */}
        <AppBar
          position="fixed"
          elevation={0}
          color="transparent"
          sx={{
            ml: { sm: `${drawerWidth}px` },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            borderBottom: "1px solid var(--border-color-primary)",
            height: "64px",
            paddingY: "8px",
            px: "24px",
          }}
        >
          <Header handleDrawerToggle={handleDrawerToggle} />
        </AppBar>
        {/* end header */}
        <Box className="grow overflow-y-auto overflow-x-hidden rounded-lg mt-16 relative layout-content-custom">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default memo(Layout);
