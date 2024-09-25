import useCheckFullNav from "@/hooks/useCheckFullNav";
import { NavList } from "@/types/types";
import { List, ListSubheader } from "@mui/material";
import clsx from "clsx";
import { memo } from "react";
import NavigationItem from "./NavigationItem";

type NavigationListProps = {
  items: NavList[];
  position: "top" | "bottom";
};

const NavigationList = ({
  items,
  position,
}: NavigationListProps): JSX.Element => {
  const { isFullNav } = useCheckFullNav();
  const { isBreakpoint } = useCheckFullNav("sm");

  return (
    <div>
      {items.map((item) => (
        <List
          key={item.key}
          sx={{
            width: "100%",
            maxWidth: "100%",
            padding: "0px 12px 0px",
          }}
          component="nav"
          subheader={
            <ListSubheader
              disableSticky
              component="div"
              className="!bg-transparent !text-gray-400 !select-none"
            >
              {item.subheader}
            </ListSubheader>
          }
        >
          {item.items.map((navItem) => (
            <NavigationItem
              key={navItem.key}
              item={navItem}
              depth={navItem?.title ? 0 : 1}
            />
          ))}
        </List>
      ))}
    </div>
  );
};

export default memo(NavigationList);
