import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import apiCommonService from "@/api/apiCommon.service";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import iconSucsess from "@/assets/images/success.png";
import SuccessIcon from "@/components/icons/success";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupToastOrderProps {
  open: boolean;
  onClose: () => void;
  onPreviewInvoice: () => void;
  order_id: number;
}
function PopupToastOrder(props: PopupToastOrderProps) {
  const { onClose, onPreviewInvoice, order_id, open } = props;
  const navigate = useNavigate();

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box className="popup-remove-wrapper min-w-[30vw]">
          <Stack
            direction={"row"}
            sx={{
              width: "100%",
              justifyContent: "flex-end",
              padding: "16px 22px 16px 16px",
            }}
          >
            <ButtonCore
              title=""
              type="secondary"
              onClick={onClose}
              icon={<FontAwesomeIcon icon={faXmark} />}
            />
          </Stack>
          <SuccessIcon />

          <h2 className="capitalize text-center max-w-sm text-base px-6">
            Thanh toán thành công
          </h2>
          <p className="px-6">Đơn hàng {order_id || ""} đã hoàn tất!</p>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={"12px"}
            width={"100%"}
            sx={{
              padding: "12px 24px 24px",
            }}
          >
            <ButtonCore
              title={"In hóa đơn"}
              type="bgWhite"
              onClick={onPreviewInvoice}
              icon={<FontAwesomeIcon icon={faPrint} />}
              styles={{
                width: "calc(50% - 6px)",
              }}
            />

            <ButtonCore
              title={"Danh sách đơn hàng"}
              onClick={() => {
                navigate("/admin/order");
              }}
              styles={{
                width: "calc(50% - 6px)",
              }}
            />
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupToastOrder);
