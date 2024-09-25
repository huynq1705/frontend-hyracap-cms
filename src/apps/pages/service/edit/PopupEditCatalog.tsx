import {
  Box,
  Dialog,
  DialogActions,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import { INIT_CATALOG } from "@/constants/init-state/service";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";

const VALIDATE = {
  name: "Vui lòng nhập tên danh mục dịch vụ.",
};
const KEY_REQUIRED = ["name"];
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
  refetch: () => void;
  handleClose: () => void;
  data: typeof INIT_CATALOG;
  status: string | "create";
}
function PopupEditServerCatalog(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, status } = props;
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { postServiceCatalog, putServiceCatalog } =
    apiServiceSpaServicerService();
  const [statusPage, setStatusPage] = React.useState(status);
  const [formData, setFormData] = React.useState(data);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isApi, setIsApi] = React.useState(false)
  const handleOnchange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitCreate = async () => {
    setIsApi(true)
    try {
      const response = await postServiceCatalog(formData, KEY_REQUIRED);
      let message = "Tạo danh mục thất bại";
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên danh mục đã tồn tại";
        message = "Tên danh mục đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Tạo danh mục thành công";
        type = "success";
        refetch();
        // handleClose();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          // message: T("create") + t("service") + t("fail"),
          message: T("thereWasError"),
        }),
      );
      console.error("==>", error);
    } finally {
      setIsApi(false)
    }
  };
  const handleSubmitUpdate = async () => {
    setIsApi(true)
    try {
      const response = await putServiceCatalog(formData, KEY_REQUIRED);
      let message = "Cập nhật danh mục thất bại";
      let type = "error";
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên danh mục đã tồn tại";
        message = "Tên danh mục đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Cập nhật danh mục thành công";
        type = "success";
        refetch();
        // handleClose();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
    } finally {
      setIsApi(false)
    }
  };
  const handleSubmit = () => {
    statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
  };
  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ sx: { borderRadius: 2.5 } }}
      >
        <Box>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              p: 2,
              borderBottom: "0.5px solid #D0D5DD",
            }}
          >
            <h2 style={{ fontSize: 20, color: palette.textQuaternary }}>
              {T(statusPage) + " " + t("service-catalog")}
            </h2>
            <button
              onClick={handleClose}
              style={{ border: "none", backgroundColor: "white" }}
              className="cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faClose}
                style={{ width: 28, height: 28 }}
              />
            </button>
          </DialogActions>
          <Stack
            spacing={3}
            sx={{
              overflowY: "auto",
              scrollbarWidth: "thin",
              maxHeight: "70vh",
              p: 3,
              width: "100%",
            }}
          >
            {/* <h3 style={{ color: palette.textQuaternary }}>Thông tin bổ sung</h3> */}
            <div className="wrapper-from">
              <MyTextField
                label="Tên danh mục dịch vụ"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "100%",
                }}
                name="name"
                placeholder="Nhập"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
              />
            </div>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            width={"100%"}
            p={3}
            pt={1.5}
            spacing={2}
            style={{ borderTop: "0.5px solid #D0D5DD" }}
          >
            {statusPage !== "detail" ? (
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                onClick={handleClose}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title="Chỉnh sửa"
                onClick={() => setStatusPage("edit")}
              />
            )}
            {statusPage === "detail" ? (
              <ButtonCore title={"Đóng"} onClick={handleClose} />
            ) : (
              <ButtonCore title={"Hoàn tất"} onClick={handleSubmit}  loading ={isApi}/>
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEditServerCatalog);
