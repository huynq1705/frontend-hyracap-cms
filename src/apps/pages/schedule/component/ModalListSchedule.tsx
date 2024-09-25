import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog, Stack } from "@mui/material";
import React, { useState } from "react";
import EditProductCategoryPage from "./create";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import ButtonCore from "@/components/button/core";
import useCustomTranslation from "@/hooks/useCustomTranslation";
type Event = {
    employee: string;
    startTime: string;
    endTime: string;
    description: string;
};
export interface ModalEditProps {
    open: boolean;
    toggle: (key: any) => void;
    refetch: () => void;
    events: any;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalListSchedule(props: ModalEditProps) {
    const { open, toggle, refetch, events } = props;
    const { T, t } = useCustomTranslation();
    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            fullWidth
            maxWidth={"xs"}
            onClose={() => {
                toggle("listSchedule");
            }}
            aria-describedby="alert-dialog-slide-description"
        >
            <Box height={"fit-content"}>
                {" "}
                <>
                    <HeaderModalEdit
                        onClose={() => {
                            toggle("listSchedule");
                        }}
                    />

                    <div className="wrapper-edit-page">
                        <div className="wrapper-from">
                            {events.map((event: any, index: number) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        backgroundColor: `${event.eventColor}10`,
                                        borderLeft: `2px solid ${event.eventColor}`,
                                        padding: "8px",
                                    }}
                                >
                                    <p className="desc-event">{event.id}</p>
                                    <p className="desc-employee">
                                        {event.employee}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1.27773 4.8499C0.86296 4.12667 0.662688 3.53611 0.54193 2.93747C0.363331 2.05211 0.772049 1.18725 1.44913 0.635399C1.73529 0.402165 2.06333 0.481851 2.23255 0.785432L2.61458 1.4708C2.91738 2.01404 3.06878 2.28566 3.03875 2.57363C3.00872 2.8616 2.80454 3.09614 2.39617 3.56521L1.27773 4.8499ZM1.27773 4.8499C2.11727 6.31378 3.43476 7.632 4.90034 8.47251M4.90034 8.47251C5.62357 8.88728 6.21414 9.08756 6.81277 9.20831C7.69813 9.38691 8.563 8.97819 9.11485 8.30111C9.34808 8.01495 9.26839 7.68691 8.96481 7.51769L8.27945 7.13567C7.73621 6.83286 7.46458 6.68146 7.17661 6.71149C6.88865 6.74152 6.65411 6.94571 6.18503 7.35408L4.90034 8.47251Z"
                                                stroke={event.eventColor}
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M5.75012 2.61399C6.37281 2.87842 6.87181 3.37742 7.13624 4.0001M6.03627 0.5C7.58383 0.946595 8.80357 2.16627 9.25022 3.7138"
                                                stroke={event.eventColor}
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                        <p className="desc-event">
                                            {event.phone_number}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            width="10"
                                            height="12"
                                            viewBox="0 0 10 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0.75 4.68421C0.75 2.94746 0.75 2.07908 1.26256 1.53954C1.77513 1 2.60008 1 4.25 1L5.75 1C7.39992 1 8.22487 1 8.73744 1.53954C9.25 2.07908 9.25 2.94746 9.25 4.68421V7.31579C9.25 9.05254 9.25 9.92092 8.73744 10.4605C8.22487 11 7.39992 11 5.75 11L4.25 11C2.60008 11 1.77513 11 1.26256 10.4605C0.75 9.92092 0.75 9.05254 0.75 7.31579L0.75 4.68421Z"
                                                stroke={event.eventColor}
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M3 1L3.0411 1.2466C3.14087 1.84522 3.19075 2.14453 3.40056 2.32227C3.61037 2.5 3.91381 2.5 4.52069 2.5L5.47931 2.5C6.08619 2.5 6.38963 2.5 6.59944 2.32227C6.80925 2.14453 6.85913 1.84522 6.9589 1.2466L7 1"
                                                stroke={event.eventColor}
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M3 8H5M3 5.5L7 5.5"
                                                stroke={event.eventColor}
                                                stroke-linecap="round"
                                            />
                                        </svg>
                                        <p className="desc-event">
                                            {event.content}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 10 10"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M4.99994 1.99512C5.21409 1.99512 5.38769 2.16872 5.38769 2.38287V4.76057L6.91824 5.52585C7.10979 5.62162 7.18743 5.85453 7.09165 6.04608C6.99588 6.23762 6.76297 6.31526 6.57143 6.21949L4.82653 5.34704C4.69516 5.28135 4.61218 5.14709 4.61218 5.00022V2.38287C4.61218 2.16872 4.78579 1.99512 4.99994 1.99512Z"
                                                fill={event.eventColor}
                                            />
                                            <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.02551 5C1.02551 2.80495 2.80495 1.02551 5 1.02551C7.19505 1.02551 8.97449 2.80495 8.97449 5C8.97449 5.34395 8.93079 5.67771 8.84866 5.996C8.8014 6.17916 8.87276 6.37635 9.03658 6.47093C9.24633 6.59203 9.51584 6.49701 9.58011 6.2635C9.69085 5.86119 9.75 5.4375 9.75 5C9.75 2.37665 7.62335 0.25 5 0.25C2.37665 0.25 0.25 2.37665 0.25 5C0.25 7.62335 2.37665 9.75 5 9.75C6.53084 9.75 7.89254 9.02582 8.76122 7.90136C8.89727 7.72524 8.83565 7.47428 8.64291 7.363C8.46411 7.25977 8.23734 7.31539 8.10858 7.47678C7.38035 8.38958 6.25848 8.97449 5 8.97449C2.80495 8.97449 1.02551 7.19505 1.02551 5Z"
                                                fill={event.eventColor}
                                            />
                                        </svg>
                                        <p className="desc-event">
                                            {event.startTime} - {event.endTime}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "end",
                                paddingTop: "12px",
                                paddingBottom: "24px",
                                width: "100%",
                            }}
                        >
                            <ButtonCore
                                title={T("close")}
                                onClick={() => {
                                    toggle("listSchedule");
                                }}
                            />
                        </div>
                    </div>
                </>
            </Box>
        </Dialog>
    );
}
