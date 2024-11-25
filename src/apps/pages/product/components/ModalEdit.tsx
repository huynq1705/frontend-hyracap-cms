import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import EditPage from "./edit";
import { Modal } from "antd";

export interface ModalEditProps {
    open: boolean;
    toggle: () => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEditProduct(props: ModalEditProps) {
    const { open, toggle, refetch } = props;

    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            fullWidth
            maxWidth={"md"}
            onClose={toggle}
            aria-describedby="alert-dialog-slide-description"
            sx={{
                zIndex: "998 !important",
            }}
        >
            <Box height={"fit-content"} className="relative overflow-x-hidden">
                <EditPage onClose={toggle} refetch={refetch} open={open} />
            </Box>
        </Dialog>
    );
}
