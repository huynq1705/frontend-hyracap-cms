import { AppBar, Tabs, Tab } from "@mui/material";
import clsx from "clsx";
import * as React from "react";

export interface HeaderEditPageProps {
  listTabs: any[];
  index: number;
  changeIndex: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function HeaderEditPage(props: HeaderEditPageProps) {
  const { listTabs, index, changeIndex } = props;
  return (
    <div className="flex justify-between items-center rounded-xl overflow-hidden">
      <AppBar position="static" className="!shadow-none">
        <Tabs
          value={index}
          onChange={changeIndex}
          aria-label="full width tabs example"
          className="bg-white px-5"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& > div > div": {
              gap: "16px",
            },
            "button ": {
              padding: "0px !important",
              fontWeight: "600",
            },
          }}
        >
          {listTabs.map((tab, id) => (
            <Tab key={`tab-${id + 1}`} label={tab.label} aria-label="plus" />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
}
