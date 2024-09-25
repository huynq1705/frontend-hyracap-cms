import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import { INIT_SCHEDULE } from "@/constants/init-state/schedule";
import CreateSchedulePage from "./create";
import { useLocation } from "react-router-dom";
import EditSchedulePage from "./edit";

export interface ModalEditProps {
    open: boolean;
    toggle: (key: any) => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEdit(props: ModalEditProps) {
    const { open, toggle, refetch } = props;
    const { pathname } = useLocation();
    const [formData, setFormData] = useState(INIT_SCHEDULE);
    console.log("pathname", pathname);
    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            fullWidth
            maxWidth={"md"}
            onClose={() => {
                toggle("edit");
            }}
            aria-describedby="alert-dialog-slide-description"
            style={{ overflow: "hidden" }}
        >
            {/* <Box height={"fit-content"}> */}
            {pathname.includes("/admin/schedule/create") ? (
                <CreateSchedulePage
                    onClose={() => {
                        toggle("edit");
                    }}
                    refetch={refetch}
                />
            ) : (
                <EditSchedulePage
                    onClose={() => {
                        toggle("edit");
                    }}
                    refetch={refetch}
                />
            )}
            {/* </Box> */}
        </Dialog>
    );
}
