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
import MyTextField from "@/components/input-custom-v2/text-field";
import CSwitch from "@/components/custom/CSwitch";
// import  { bgPrimary, palette.textQuaternary  } from "@/theme/palette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import { INIT_PAYMENT_METHOD } from "@/constants/init-state/payment_menthod";
import apiPaymentMethodService from "@/api/apiPayment.service";
import MySelect from "./SelectInput";
import apiBankService from "@/api/apiBank";

const VALIDATE = {
  name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

// const VALIDATE_TEXT = {
//     email: "Họ và tên không được chứa kí tự đặc biệt.",
//     phone_number: "Sai định dạng",
// };
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
  data: typeof INIT_PAYMENT_METHOD;
}

function PopupEditPaymentMethod(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data } = props;
  const { pathname } = useLocation();
  const { postPaymentMethod, putPaymentMethod } = apiPaymentMethodService();
  const { getBank } = apiBankService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [statusPage, setStatusPage] = React.useState(pathname.split("/")[3]);
  const [formData, setFormData] = React.useState(
    statusPage === "create" ? INIT_PAYMENT_METHOD : data,
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [listBank, setListBank] = React.useState<any[]>([]);

  const handleOnchange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmitCreate = async () => {
    setIsLoading(true);
    setErrors([]);
    try {
      const response = await postPaymentMethod(formData, KEY_REQUIRED);
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: "createSuccess",
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: "createError",
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            setErrors(response.missingKeys);
            console.log("res", response);
            VALIDATE.name = response.isValid
              ? "Tên phương thức thanh toán đã tồn tại."
              : "Tên phương thức thanh toán không được bỏ trống.";
            dispatch(
              setGlobalNoti({
                type: "info",
                message: VALIDATE.name,
              }),
            );
          }
          break;
        }
      }
      setIsLoading(false);
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        }),
      );
      setIsLoading(false);
      console.error("==>", error);
    }
  };
  const handleSubmitUpdate = async () => {
    // const payload = {};
    setIsLoading(true);
    setErrors([]);
    try {
      const response = await putPaymentMethod(formData, KEY_REQUIRED);
      let message = "Cập nhật phương thức thanh toán thất bại";
      let type = "error";
      if (response === true) {
        refetch();
        type = "success";
        message = "createSuccess";
      } else if (response === false) {
      } else {
        VALIDATE.name = response.isValid
          ? "Tên phương thức thanh toán đã tồn tại."
          : "Tên phương thức thanh toán không được bỏ trống.";
        setErrors(response.missingKeys);
        type = "info";
        message = response.isValid
          ? "Tên phương thức thanh toán đã tồn tại."
          : "Tên phương thức thanh toán không được bỏ trống.";
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
      setIsLoading(false);
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Cập nhật phương thức thanh toán thất bại",
        }),
      );
      setIsLoading(false);
      console.error("==>", error);
    }
  };

  const handleSubmit = () => {
    statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
  };
  React.useEffect(() => {
    getBank()
      .then((e) => {
        setListBank(
          e.data.map((item) => ({
            label: item.name + " - " + item.full_name,
            value: item.id,
          })),
        );
      })
      .catch(() => {});
  }, []);
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
              {T(statusPage) + " " + t("label-payment")}
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
              maxHeight: "64vh",
              p: 3,
              width: "100%",
            }}
          >
            <div className="wrapper-from">
              <MyTextField
                label="Tên phương thức thanh toán"
                errors={errors}
                required={KEY_REQUIRED}
                name="name"
                placeholder="Nhập tên phương thức"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                // disabled
              />
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
              >
                <label className="label">
                  {"Đặt làm phương thức mặc định"}{" "}
                </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "view"}
                    checked={!!formData.default_payment}
                    name="default_payment"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        formData.default_payment ? 0 : 1,
                      );
                    }}
                  />
                </Box>
              </Stack>
              <Stack
                direction={"column"}
                spacing={1.5}
                alignItems={"flex-start"}
              >
                <label className="label">{T("status")} </label>
                <Box height={32}>
                  <CSwitch
                    disabled={statusPage === "view"}
                    checked={!!formData.status}
                    name="status"
                    onChange={(e) => {
                      handleOnchangeDate(
                        e.target.name,
                        formData.status ? 0 : 1,
                      );
                    }}
                  />
                </Box>
              </Stack>
              {!formData.name.includes("Tiền mặt") && (
                <>
                  <MySelect
                    options={listBank}
                    label={"Ngân hàng"}
                    errors={errors}
                    required={KEY_REQUIRED}
                    name="bank_id"
                    placeholder="- -"
                    // handleChange={(e) => {
                    //   handleOnChangeSearchStatus(e.target.name, e.target.value);
                    // }}
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    type="select-one"
                    itemsPerPage={5}
                    // inputStyle={{height:36}}
                  />
                  <MyTextField
                    label="Chủ tài khoản"
                    errors={errors}
                    required={KEY_REQUIRED}
                    name="name_account"
                    placeholder="Nhập tên phương thức"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "view"}
                  />
                  <MyTextField
                    label="Số tài khoản"
                    errors={errors}
                    required={KEY_REQUIRED}
                    name="number_account"
                    placeholder="Nhập tên phương thức"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "view"}
                  />
                </>
              )}
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
            {statusPage !== "view" ? (
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                // styles={{ flex: 1 }}
                onClick={handleClose}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title={T("edit")}
                onClick={() => setStatusPage("edit")}
                // styles={{ flex: 1 }}
              />
            )}
            {statusPage === "view" ? (
              <ButtonCore title={T("close")} onClick={handleClose} />
            ) : (
              <ButtonCore
                title={T("save")}
                onClick={handleSubmit}
                loading={isLoading}
              />
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupEditPaymentMethod);
