import HeaderModalEdit from "@/components/header-modal-edit";
import Transition from "@/components/transition-dialog";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import { Box, Dialog } from "@mui/material";
import React, { useState } from "react";
import EditPage from "./edit";

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
      maxWidth={"md"}
      onClose={() => {
        toggle("edit");
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box height={"fit-content"}>
        <EditPage
          onClose={() => {
            toggle("edit");
          }}
          refetch={refetch}
        />
      </Box>
    </Dialog>
  );
}
