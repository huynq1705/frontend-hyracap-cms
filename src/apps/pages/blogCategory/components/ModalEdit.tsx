import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import EditBlogCategoryPage from "./edit";
export interface ModalEditProps {
    open: boolean;
    toggle: (key: any) => void;
    refetch: () => void;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEdit(props: ModalEditProps) {
    const { open, toggle, refetch } = props;

    return (
        <Dialog
            open={open}
            TransitionComponent={transition}
            keepMounted
            fullWidth
            maxWidth={"sm"}
            onClose={() => {
                toggle("edit");
            }}
            aria-describedby="alert-dialog-slide-description"
            sx={{
                zIndex: "998 !important",
            }}
        >
            <Box height={"fit-content"} className="relative overflow-x-hidden">
                <EditBlogCategoryPage
                    onClose={() => {
                        toggle("edit");
                    }}
                    refetch={refetch}
                    open={open}
                />
            </Box>
        </Dialog>
    );
}
