import {
  Box,
  Dialog,
  DialogActions,
  Slide,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiEvaluationCriteriaService from "@/api/apiEvaluationCriteria.service";
import CSwitch from "@/components/custom/CSwitch";
import { INIT_EVALUATION } from "@/constants/init-state/evaluation";

const VALIDATE = {
  name: "Vui lòng nhập tên điền đầy đủ.",
};

const KEY_REQUIRED = [
  "name"
];

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
  data: typeof INIT_EVALUATION;
  status: string | "create";

}

function PopupEdit(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, status } = props;
  const { putEvaluationCriteria, postEvaluationCriteria } = apiEvaluationCriteriaService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
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
      const response = await postEvaluationCriteria(formData, KEY_REQUIRED)
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch()
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("create") + " " + t("evaluation") + " " + t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("create") + " " + t("evaluation") + " " + t("fail"),
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            setErrors(response.missingKeys);
            if (response.isValid) {
              setErrors(response.missingKeys)
              VALIDATE.name = "Tên tiêu chí đánh giá đã tồn tại."
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Tên tiêu chí đánh giá đã tồn tại.",
                }),
              );
            } else {
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Nhập đẩy đủ dữ liệu",
                }),
              );
            }

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
    } finally {
      setIsApi(false)
    }
  };
  const handleSubmitUpdate = async () => {
    // const payload = {};
    setIsApi(true)
    try {
      const response = await putEvaluationCriteria(formData, KEY_REQUIRED)
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch()
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("update") + " " + t("evaluation") + " " + t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("update") + " " + t("evaluation") + " " + t("fail"),
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            setErrors(response.missingKeys);
            if (response.isValid) {
              setErrors(response.missingKeys)
              VALIDATE.name = "Tên tiêu chí đánh giá đã tồn tại."
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Tên tiêu chí đánh giá đã tồn tại.",
                }),
              );
            } else {
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: "Nhập đẩy đủ dữ liệu",
                }),
              );
            }

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
    } finally {
      setIsApi(false)
    }
  };

  const handleSubmit = () => {
    statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"xs"}
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
              Tiêu chí
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
            <div className="wrapper-from">
              <MyTextField
                label="Tên tiêu chí"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(100%)",
                }}
                name="name"
                placeholder="Nhập tên tiêu chí đánh giá"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={statusPage === "detail"}
              />
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
              >
                <label className="label">{T("status")} </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "detail"}
                    checked={!!formData.status}
                    name="status"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        formData.status ? 0 : 1
                      );
                    }}
                  />
                </Box>
              </Stack>
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
                styles={{ flex: 1 }}
                onClick={handleClose}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title={T("edit")}
                onClick={() => setStatusPage("edit")}
                styles={{ flex: 1 }}
              />
            )}
            {statusPage === "detail" ? (
              <ButtonCore title={T("close")} onClick={handleClose} styles={{ flex: 1 }} />
            ) : (
              <ButtonCore title={T("save")} onClick={handleSubmit} loading={isApi} styles={{ flex: 1 }} />
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEdit);
