import useChangeLang from "@/hooks/useChangeLang";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { selectGlobalNoti } from "@/redux/selectors/app.selector";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { Alert, Slide, Snackbar } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import clsx from "clsx";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { string } from "yup";
import { styled } from "@mui/system"; // Thêm styled từ MUI

const AUTO_HIDE_DURATION_DEFAULT = 3000;

// Tạo styled component tùy chỉnh cho Alert
const CustomAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "customType", // Đảm bảo customType không được forward xuống DOM
})<{ customType?: string }>(({ theme, customType }) => ({
  width: "100%",
  ...(customType === "custom" && {
    backgroundColor: "#202224",
    border: "1px solid var(--text-color-primary)",
  }),
  "&.MuiAlert-filledSuccess": {
    backgroundColor: "#4caf50", // Ví dụ: tùy chỉnh màu sắc cho thông báo thành công
  },
}));

const GlobalNoti = (): JSX.Element => {
  const globalNoti = useSelector(selectGlobalNoti);

  const dispatch = useDispatch();
  const { T } = useCustomTranslation();
  useChangeLang();
  const handleClose = () => {
    dispatch(setGlobalNoti(null));
  };

  const vertical_pos = globalNoti?.pos?.vertical ?? "top";
  const horizontal_pos = globalNoti?.pos?.horizontal ?? "right";
  let element = globalNoti?.message ?? "";
  const type = globalNoti?.type;

  if (globalNoti?.message === string) element = T(globalNoti.message);
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (globalNoti) handleClose();
      },
      typeof globalNoti?.autoHideDuration !== "number"
        ? AUTO_HIDE_DURATION_DEFAULT
        : globalNoti.autoHideDuration,
    );
    return () => clearTimeout(timeout);
  }, [globalNoti]);
  return (
    <Snackbar
      open={!!globalNoti}
      anchorOrigin={{
        vertical: vertical_pos,
        horizontal: horizontal_pos,
      }}
      autoHideDuration={
        typeof globalNoti?.autoHideDuration !== "number"
          ? AUTO_HIDE_DURATION_DEFAULT
          : globalNoti.autoHideDuration
      }
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
      //   onClose={handleClose}
    >
      {globalNoti ? (
        <CustomAlert
          variant="filled"
          //   onClose={handleClose}
          severity={type ?? "info"}
          customType={type} // Thay vì 'type', dùng 'customType'
          className={clsx(type === "default" && "")}
        >
          {element}
        </CustomAlert>
      ) : (
        <div></div>
      )}
    </Snackbar>
  );
};

export default memo(GlobalNoti);
