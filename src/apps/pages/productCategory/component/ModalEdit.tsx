import Transition from "@/components/transition-dialog";
import { Box, Dialog } from "@mui/material";
import EditProductCategoryPage from "./edit";
export interface ModalEditProps {
  open: boolean;
  toggle: () => void;
  refetch: () => void;
  keyOther?: string;
}
const transition = (props: any) => <Transition direction="up" {...props} />;

export default function ModalEdit(props: ModalEditProps) {
  const { keyOther, open, toggle, refetch } = props;

  return (
    <Dialog
      open={open}
      TransitionComponent={transition}
      keepMounted
      fullWidth
      maxWidth={"xs"}
      onClose={toggle}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box height={"fit-content"} className="relative overflow-x-hidden">
        <EditProductCategoryPage onClose={toggle} refetch={refetch} />
      </Box>
    </Dialog>
  );
}
