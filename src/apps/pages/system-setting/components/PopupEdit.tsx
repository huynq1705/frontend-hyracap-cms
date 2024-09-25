import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import { INIT_CATALOG } from "@/constants/init-state/service";
import apiGeneralSettingService from "@/api/apiGeneralSetting";
import MyEditor from "@/components/input-custom-v2/editor";

const VALIDATE = {
  name: "Vui lòng nhập nội dung.",
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
  refetch?: () => void;
  handleClose: () => void;
  // open: boolean;
  data: typeof INIT_CATALOG;
  // content: React.ReactNode
  // listItem: React.Key[];
}

function PopupEditContentFootBill(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { putGeneralSetting } = apiGeneralSettingService();
  const [formData, setFormData] = React.useState(data);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isApi, setIsApi] = React.useState(false)

  const handleOnchange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitUpdate = async () => {
    // const payload = {};
    try {
      const response = await putGeneralSetting(
        { content_end_invoice: formData.name?.toString().trim() }
        , formData.id, ["content_end_invoice"]);
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch && refetch();
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("update") + " " + t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("update") + " " + t("fail"),
            }),
          );
          break;
        }
        default: {
          setErrors(["name"]);
          if (typeof response === "object") {
            setErrors(["name"]);
            dispatch(
              setGlobalNoti({
                type: "info",
                message: "Nhập đẩy đủ dữ liệu",
              }),
            );
          }
        }
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: T("thereWasError"),
        }),
      );
      console.error("==>", error);
    }
  };

  const handleSubmit = () => {
    setIsApi(true)
    handleSubmitUpdate();
    setIsApi(false)
  };
  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"sm"}
        // hidden
        // scroll="paper"
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
              Nội dung hiển thị
            </h2>
            <button
              onClick={handleClose}
              style={{ border: "none", backgroundColor: "white" }}
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
              {/* <MyTextareaAutosize
                label="Nội dung"
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
                inputStyle={{ height: 44 }}
              /> */}
              <MyEditor
                label="Nội dung"
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
                // inputStyle={{ height: 44 }}
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
            <ButtonCore
              title={T("cancel")}
              type="bgWhite"
              onClick={handleClose}
              styles={{ flex: 1 }}
            />

            <ButtonCore
              title={"Xác nhận"}
              onClick={handleSubmit}
              loading ={isApi}
              styles={{ flex: 1 }} />
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEditContentFootBill);
