import Transition from "@/components/transition-dialog";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@mui/material";
import React from "react";
import DataProduct from "../../../components/data-product";

export interface PopupPickProductProps {
  toggleDataProductMobile?: any;
}
const transition = (props: any) => <Transition direction="up" {...props} />;
export default function PopupPickProduct(props: PopupPickProductProps) {
  return (
    <Dialog
      fullScreen
      open={true}
      onClose={() => {}}
      TransitionComponent={transition}
    >
      <div
        className="flex p-4 items-center justify-between"
        onClick={props.toggleDataProductMobile}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
        <h3>Thêm sản phẩm/dịch vụ</h3>
        <div className="opacity-0">
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>
      </div>
      <div className="flex px-4">
        <DataProduct toggleDataProductMobile={props.toggleDataProductMobile} />
      </div>
    </Dialog>
  );
}
