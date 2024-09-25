import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import clsx from "clsx";
import _ from "lodash";
import { PageInfo } from "./PageInfo";
import PageCommission from "./PageCommission";
import { Typography } from "antd";
import PageEvaluate from "./PageEvaluate";
import PageSalary from "./PageSalary";
import { PageNote } from "./PageNote";
import PageCalendar from "./PageCalendar";
import { useNavigate } from "react-router-dom";
import HeaderEditPage from "@/apps/pages/customer/components/detail/header";
// import { ElementCard } from "./item-card";
function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}


export default function TabPanelView() {
    const theme = useTheme();
    const navigate = useNavigate()
    const [value, setValue] = useState(0);
    const [note, setNote] = useState<any>();
    const listTab = [
        {
            path: "/management-employee-detail",
            title: "Thông tin nhân viên",
            // element: <PageInfo />
        },
        {
            path: "/management-employee-salary",
            title: "Quản lý hoa hồng",
            // element: <PageCommission />
        },
        {
            path: "/management-employee-salary",
            title: "Quản lý đánh giá",
            // element: <PageEvaluate />
        },
        {
            path: "/management-employee-salary",
            title: "Tiền lương",
            // element: <PageSalary />
        },
        {
            path: "/management-employee-salary",
            title: "Lịch làm việc",
            // element: <PageCalendar />

        },
        {
            path: "/management-employee-salary",
            title: "Ghi chú",
            // element: <PageNote/>
        },

    ]
    // fn: function
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        // navigate(listTab[newValue].path)
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };
  


    return (
        <Box borderRadius={2} bgcolor={"white"} 
        // height={"calc(100vh - 216px)"} 
        sx={{ boxShadow:" 0px 4px 30px rgba(0, 0, 0, 0.15)"}}>
            <AppBar
                position="static"
                sx={{
                    boxShadow: "none",
                    borderRadius:16,
                    // overflow:"auto"
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="full width tabs example"
                    className="bg-white w-full border-b-2 px-4"
                    variant="scrollable" 
                    scrollButtons={false}
                    sx={{
                        borderBottom: 0.5, borderColor: '#D0D5DD', borderRadius: "12px 12px 0px 0px", 
                        "& > div > div": {
                            gap: "16px",
                        },
                        "button ": {
                            padding: "0px !important",
                            fontWeight: "600",
                        },
                    }}
                >
                    {listTab.map((order, index) => (
                            <Tab
                                key={`order-${index + 1}`}
                                label={order.title}
                                aria-label="plus"
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
                style={{ position: 'relative' }}
            >
                {/* {listTab.map((item) => (item.element))} */}
                <PageInfo  setNote={setNote}/>
                <PageCommission />
                <PageEvaluate />
                <PageSalary />
                <PageCalendar />
                <PageNote note={note}/>
            </SwipeableViews>
        </Box>
    );
}
