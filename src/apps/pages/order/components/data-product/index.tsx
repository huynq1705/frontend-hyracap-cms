import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import clsx from "clsx";
import _ from "lodash";
import { ElementCard } from "../item-card";
import { DataTypeOrder, ItemPicked, TypeDataItemOrder } from "@/types/order";
import { OrderContext } from "../../edit";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir: string;
  [x: string]: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...prop } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      dir={dir}
      {...prop}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
interface DataProductProps {
  toggleDataProductMobile?: any;
}
export default function DataProduct(props: DataProductProps) {
  const { toggleDataProductMobile } = props;
  const context = React.useContext(OrderContext);
  const orderCurrent = context?.values?.orderCurrent;
  const actions = context?.actions;
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [typeTagService, setTypeTagService] = useState<"course" | "prepay">(
    "course",
  );

  // fn: function
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  const FAKE_DATE = [
    {
      title: "Dịch vụ",
      key: "service",
    },
    {
      title: "Sản phẩm",
      key: "product",
    },
    {
      title: "Thẻ dịch vụ",
      key: typeTagService,
      isFn: true,
    },
  ];
  return (
    <Box className="w-full">
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="full width tabs example"
          className="bg-white w-full"
        >
          {FAKE_DATE.map((order, index) => (
            <Tab
              key={`order-${index + 1}`}
              label={order.title}
              className="!font-semibold h-[46px]"
              {...a11yProps(0)}
            />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        className="h-full custom-swipeable-views"
      >
        {FAKE_DATE.map((order, index) => (
          <TabPanel
            key={`order-${index + 1}`}
            value={index}
            index={index}
            dir={theme.direction}
            className={clsx("py-3")}
          >
            <ElementCard
              type={order.key as keyof DataTypeOrder}
              setTypeTagService={order?.isFn ? setTypeTagService : null}
              toggleDataProductMobile={toggleDataProductMobile}
            />
          </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
  );
}
