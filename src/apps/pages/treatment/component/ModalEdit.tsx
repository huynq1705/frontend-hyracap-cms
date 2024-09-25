import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import EditTreatmentPage from "./edit";
import { INIT_TREATMENT } from "@/constants/init-state/treatment";

export interface ModalEditProps {
    open: boolean;
    toggle: (key: any) => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEdit(props: ModalEditProps) {
    const { open, toggle, refetch } = props;
    const [formData, setFormData] = useState(INIT_TREATMENT);
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
        >
            {/* <Box height={"fit-content"}> */}
            <EditTreatmentPage
                onClose={() => {
                    toggle("edit");
                }}
                refetch={refetch}
            />
            {/* </Box> */}
        </Dialog>
    );
}
