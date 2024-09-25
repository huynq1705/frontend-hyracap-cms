import { Box, Dialog, Slide, Stack } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "@/utils/date-time";
import SuccessIcon from "@/components/icons/success";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupToastProps {
  handleClose: () => void;
  open: boolean;
  data: any;
  code: number;
}
function PopupToast(props: PopupToastProps) {
  const { handleClose, open, data, code } = props;
  const navigate = useNavigate();
  const handle = async () => {
    navigate(`/schedule/${code}`);
    handleClose();
  };
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box className="popup-remove-wrapper w-[25vw]">
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
              onClick={handleClose}
              icon={<FontAwesomeIcon icon={faXmark} />}
            />
          </Stack>
          <SuccessIcon />

          <h2 className="capitalize text-center max-w-sm text-base px-6">
            Tạo lịch hẹn thành công
          </h2>
          <p className="px-6 text-center">
            {`Cảm ơn Quý khách! Lịch hẹn đã được tạo cho ngày ${formatDate(
              data?.date_time || "2024/08/01",
              "DDMMYYYY",
            )}, ${data?.range_time}. Rất hân hạnh được phục vụ Quý khách!`}
          </p>
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
              title={"Tạo lịch mới"}
              type="bgWhite"
              onClick={handleClose}
              styles={{
                width: "calc(50% - 6px)",
              }}
            />

            <ButtonCore
              title={"Chi tiết lịch hẹn"}
              onClick={handle}
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
export default React.memo(PopupToast);
