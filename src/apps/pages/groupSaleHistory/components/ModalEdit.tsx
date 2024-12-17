import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";
import ViewPage from "./view";

export interface ModalEditProps {
    open: boolean;
    toggle: () => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEditGroupSaleHistory(props: ModalEditProps) {
    const { open, toggle, refetch } = props;
    const { pathname } = useLocation();

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
                <ViewPage onClose={toggle} refetch={refetch} open={open} />
            </Box>
        </Dialog>
    );
}
