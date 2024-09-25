import {
  faCirclePlus,
  faCircleXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppBar, Tabs, Tab } from "@mui/material";
import clsx from "clsx";
import * as React from "react";

export interface HeaderEditOrderPageProps {
  isUpdate: boolean;
  listTabs: any[];
  index: number;
  removeItem: (index: number) => void;
  changeIndex: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function HeaderEditOrderPage(props: HeaderEditOrderPageProps) {
  const { isUpdate, listTabs, index, removeItem, changeIndex } = props;
  return (
    <div className="flex justify-between items-center">
      <AppBar
        position="static"
        className={clsx("shadow-sm flex-grow !bg-white", isUpdate && "!hidden")}
      >
        <Tabs
          value={index}
          onChange={changeIndex}
          aria-label="full width tabs example"
          className="bg-white px-5"
        >
          {listTabs.map((order, index) =>
            order === null ? (
              <Tab
                key={`order-${index + 1}`}
                icon={
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    color="var(--text-color-primary)"
                    fontSize={18}
                  />
                }
                aria-label="plus"
              />
            ) : (
              <Tab
                key={`order-${index + 1}`}
                icon={
                  <div className="flex gap-3 items-center">
                    <b>{`Đơn hàng ${index + 1}`}</b>
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(index);
                      }}
                    />
                  </div>
                }
                aria-label="plus"
              />
            ),
          )}
        </Tabs>
      </AppBar>
    </div>
  );
}
