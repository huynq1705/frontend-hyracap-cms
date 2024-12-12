import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";
import CreatePage from "./create";
import ViewPage from "./view";
import EditPage from "./edit";

export interface ModalEditProps {
    open: boolean;
    toggle: () => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEditgroup(props: ModalEditProps) {
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
                {pathname.includes("create") ? (
                    <CreatePage
                        onClose={toggle}
                        refetch={refetch}
                        open={open}
                    />
                ) : pathname.includes("view") ? (
                    <ViewPage onClose={toggle} refetch={refetch} open={open} />
                ) : (
                    <EditPage onClose={toggle} refetch={refetch} open={open} />
                )}
            </Box>
        </Dialog>
    );
}
