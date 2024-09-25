import CustomLink from "@/routers/CustomLink";
import { NavItem } from "@/types/types";
import { KeyboardArrowRightRounded } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
} from "@mui/material";
import clsx from "clsx";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectActiveKey,
  selectIsNavHover,
  selectIsNavOpen,
} from "@/redux/selectors/navigation.slice";

type NavigationItemProps = {
  item: NavItem;
  depth?: number;
};

function loopCheckActive(item: NavItem, activeKey: string): boolean {
  if (item.key === activeKey) return true;
  if (!item.children) return false;
  return item.children.some((child) => loopCheckActive(child, activeKey));
}

const NavigationItem = ({
  item,
  depth = 1,
}: NavigationItemProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const isNavOpen = useSelector(selectIsNavOpen);
  const activeKey = useSelector(selectActiveKey);
  const isNavHover = useSelector(selectIsNavHover);
  const isActive = useMemo(
    () => activeKey.split("/")[1] === item.key.split("/")[1],
    [activeKey, item],
  );

  useEffect(() => {
    const isContainActiveChild = loopCheckActive(item, activeKey);
    setOpen(isContainActiveChild);
  }, [activeKey]);

  const handleClick = () => {
    setOpen((pre) => !pre);
  };

  const isCollapse = useMemo(() => {
    return isNavOpen ? open : isNavHover;
  }, [isNavHover, isNavOpen, open]);
  if (depth === 0) return <div className="p-3 uppercase">{item.label}</div>;
  return (
    <Box
      sx={{
        animation: "all 0.3s linear",
      }}
    >
      <CustomLink
        to={`/${item.key}`}
        style={{ textDecoration: "none !important" }}
        className="!text-inherit decoration-none  mx-1/2 overflow-hidden w-full"
        disabled={item.type !== "link"}
      >
        <Tooltip
          placement="right"
          enterDelay={500}
          title={!isNavOpen && item.label}
          TransitionComponent={Zoom}
          disableInteractive
          disableFocusListener
          disableHoverListener={isNavOpen}
        >
          <ListItemButton
            disableRipple
            LinkComponent={CustomLink}
            onClick={() => {
              item.onClick && item.onClick();
              item.children && handleClick();
            }}
            // sx={{ pl: 1.5 * depth }}
            sx={{
              pr: 0,
              ml: 2.5 * (depth - 1),
              color: isActive ? "var(--text-color-primary) !important" : "",
              background: isActive ? "var(--bg-color-primary) !important" : "",
              borderRadius: depth - 1 ? "0px 8px 8px 0px" : "8px",
              borderLeft:
                depth !== 1
                  ? "2px solid var(--border-color-primary) !important"
                  : "",
              position: "relative",
              "& > span": {
                position: "absolute",
                display: depth - 1 && isActive ? "inline-block" : "none",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                top: "50%",
                left: "-4px",
                transform: "translateY(-3px)",
                background: isActive
                  ? "var(--text-color-primary) !important"
                  : "",
              },
            }}
            className={clsx("!py-2 !px-5")}
          >
            <span></span>
            {item.icon && (
              <ListItemIcon
                sx={{
                  color: isActive
                    ? "var(--text-color-primary)"
                    : "var(--text-color-secondary)",
                  svg: {
                    color: isActive
                      ? "var(--text-color-primary)"
                      : "var(--text-color-secondary)",
                  },
                  transform: `translateX(${!isNavOpen ? "-6px" : "0px"})`,
                  minWidth: "20px !important",
                }}
                className={clsx("!mr-5 text-left")}
              >
                {item.icon}
              </ListItemIcon>
            )}

            <ListItemText
              sx={{
                color: isActive
                  ? "var(--text-color-primary) !important"
                  : "var(--text-color-secondary)",
                fontWeight: isActive ? "bold" : "400",
              }}
              primary={
                <div className="flex items-center space-x-2">
                  <div
                    className={clsx(
                      "!text-sm truncate",
                      depth !== 1 && "ml-2",
                      isActive ? "font-bold" : "font-normal",
                    )}
                  >
                    {item.label}
                  </div>
                  {/* {item.betaItem && <BetaLabel/>} */}
                </div>
              }
            />
            {(isNavOpen || (!isNavOpen && isNavHover)) &&
              item.children?.length && (
                <KeyboardArrowRightRounded
                  className={clsx(
                    open && "rotate-90",
                    "!transition-all",
                    "top-1/2 right-0 absolute -translate-y-1/2",
                  )}
                />
              )}
          </ListItemButton>
        </Tooltip>
      </CustomLink>
      {/* child item */}
      {item.children?.length && (
        <Collapse
          // className={isClosedNavHover && open ? "block" : "hidden"}
          in={isNavHover ? open : isCollapse}
          timeout="auto"
        >
          <List component="div" disablePadding>
            {item.children
              .filter((child) => !child.hidden)
              .map((child) => (
                <NavigationItem
                  key={child.key}
                  item={child}
                  depth={depth + 1}
                />
              ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default memo(NavigationItem);
