import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import EditCustomerClassificationPage from "./edit";

export interface ModalEditProps {
  open: boolean;
  toggle: VoidFunction;
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
      maxWidth={"xs"}
      onClose={toggle}
      aria-describedby="alert-dialog-slide-description"
      sx={{zIndex :50}}
    >
      <Box height={"fit-content"} sx={{overflowX:"hidden"}}>
        <EditCustomerClassificationPage onClose={toggle} refetch={refetch} />
      </Box>
    </Dialog>
  );
}
