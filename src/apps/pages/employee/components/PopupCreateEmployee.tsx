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
import MyDatePicker from "@/components/input-custom-v2/calendar";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import MyTextFieldPassword from "@/components/input-custom-v2/password";
import MyTextFieldCurrency from "@/components/input-custom-v2/currency/TextCurrency";
import MySelect from "@/components/input-custom-v2/select";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import ListImage from "@/components/list-image";
import { UploadFile } from "antd";
import AvatarImage from "@/components/avatar";
import MyEditor from "@/components/input-custom-v2/editor";

const VALIDATE = {
  phone_number: "Số điện thoại không đúng định dạng.",
  email: "Email không đúng định dạng.",
  full_name: "Họ và tên không được để trống",
  username: "Tên đăng nhập được để trống",
  password_config: "Mật khẩu xác nhận không trùng khớp",
  password: "Mật khẩu không được để trống",
};

const KEY_REQUIRED = [
  "full_name",
  "phone_number",
  "email",
  "username",
  "password"
  // "phone_exists",
  // "email_exists"
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
  refetch?: () => void;
  handleClose: () => void;
  // open: boolean;
  data: typeof INIT_EMPLOYEE;
  status: string | "create";
}

function PopupCreateEmployee(props: PopupConfirmRemoveProps) {
  const { handleClose, refetch, data, status } = props;
  const { postAccount, putAccount, putAccountChangPass } = apiAccountService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const [statusPage, setStatusPage] = React.useState(status);
  const [formData, setFormData] = React.useState({ ...data, newImage: "" });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [listRole] = React.useState<OptionSelect>([
    { label: "Quản lý", value: "Quản lý" },
    { label: "Marketing", value: "Marketing" },
    { label: "Thu ngân/ Lễ tân", value: "Thu ngân/ Lễ tân" },
    { label: "Trị liệu viên", value: "Trị liệu viên" },
    { label: "CSKH", value: "CSKH" },
  ]);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [editPassword, setEditPassword] = React.useState(true);
  const [isApi, setIsApi] = React.useState(false)

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
    // const payload = {};
    setIsApi(true)
    try {
      const response = await postAccount(formData, KEY_REQUIRED, fileList);
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch && refetch();
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("create") + " "+ t("label-employee") + " "+ t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("create") + " "+ t("label-employee") + " "+ t("fail"),
            }),
          );

          break;
        }
        default: {
          if (typeof response === "object") {
            if (response.isValid) {
              let re: "email" | "phone_number" | "username" | "password";

              if (response.missingKeys === "phone") {
                re = "phone_number";
              } else {
                re = response.missingKeys as "email" | "username" | "password";
              }
              console.log("TTTT",response);
              
              VALIDATE[re] = (re === "password") ? "Mật khẩu không đạt chuẩn." : `${t(re)} đã tồn tại.`;
              setErrors([re]);
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: (re === "password") ? "Mật khẩu không đạt chuẩn." : `${t(re)} đã tồn tại.`
                }),
              );
            } else {

              setErrors(response.missingKeys)
              VALIDATE.phone_number = "Số điện thoại không đúng định dạng.",
                VALIDATE.username = "Tên đăng nhập không được để trống.",
                VALIDATE.email = "Email không đúng định dạng."
              VALIDATE.password = "Mật khẩu không được để trống."
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
    // VALIDATE["password_config"] = "Mật khẩu xác nhận không trùng khớp"
    // setErrors(["password_config"])

  };
  const handleSubmitUpdate = async () => {
    // const payload = {};
    setIsApi(true)
    try {
      const response = await putAccount(
        formData, formData.id,
        ["full_name", "phone_number", "email", "username"],
        fileList);
      switch (response) {
        case true: {
          // navigate("/customer");
          refetch && refetch();
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("update") + " "+ t("label-employee") + " "+ t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("update") + " "+ t("label-employee") + " "+ t("fail"),
            }),
          );
          break;
        }
        default: {
          if (typeof response === "object") {
            if (response.isValid) {
              let re: "email" | "phone_number" | "username" | "password";

              if (response.missingKeys === "phone") {
                re = "phone_number";
              } else {
                re = response.missingKeys as "email" | "username" | "password";
              }

              VALIDATE[re] = (re === "password") ? "Mật khẩu không đạt chuẩn." : `${t(re)} đã tồn tại.`;
              setErrors([re]);
              dispatch(
                setGlobalNoti({
                  type: "info",
                  message: (re === "password") ? "Mật khẩu không đạt chuẩn." : `${t(re)} đã tồn tại.`
                }),
              );
            } else {
              setErrors(response.missingKeys)
              VALIDATE.phone_number = "Số điện thoại không đúng định dạng.",
                VALIDATE.username = "Tên đăng nhập không được để trống.",
                VALIDATE.email = "Email không đúng định dạng."
              VALIDATE.password = "Mật khẩu không được để trống."
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

  const onChangePass = () => {
    setEditPassword(true);
  };
  const onClosePopup = editPassword ? handleClose : onChangePass;
  const handleSubmitPass = async () => {
    setIsApi(true)
    try {
      const response = await putAccountChangPass({ new_password: formData.password_config, old_password: formData.password }, formData.id, ["password"])
      switch (response) {
        case true: {
          // navigate("/customer");
          handleClose();
          dispatch(
            setGlobalNoti({
              type: "success",
              message: T("update") + " "+ t("password") + " "+ t("success"),
            }),
          );
          break;
        }
        case false: {
          dispatch(
            setGlobalNoti({
              type: "error",
              message: T("create") + " "+ t("password") + " "+ t("fail"),
            }),
          );
          break;
        }
        default: {

          if (typeof response === "object") {
            setErrors(response.missingKeys);
           if(response.isValid) {
              VALIDATE.password = "Mật khẩu không đúng định dạng."
           } else {
            //  VALIDATE.password_config = "Mật khẩu không trùng khớp"
           }
            dispatch(
              setGlobalNoti({
                type: "info",
                message: "Nhập đẩy đủ và đúng dữ liệu",
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
    } finally {
      setIsApi(false)
    }


  }
  const handleSubmit = () => {
    if (editPassword) {
      statusPage === "create" ? handleSubmitCreate() : handleSubmitUpdate();
    } else {
      handleSubmitPass();
    }
  };

  return (
    <>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        onClose={onClosePopup}
        fullWidth={true}
        maxWidth={editPassword ? "md" : "sm"}
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
              {editPassword
                ? T(statusPage) + " " + t("label-employee")
                : "Đổi mật khẩu"}
            </h2>
            <button
              onClick={onClosePopup}
              style={{ border: "none", backgroundColor: "white", cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={faClose}
                style={{ width: 28, height: 28 }}
              />
            </button>
          </DialogActions>
          {editPassword ? (
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
              <h3 style={{ color: palette.textQuaternary }}>Thông tin chung</h3>
              <div className="wrapper-from">
                {/* <MyTextField
                  label="Mã nhân viên"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="id"
                  placeholder="Mitu-ABC"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={true}
                /> */}
                <AvatarImage
                  disabled={statusPage === "detail"}
                  data={formData.image}
                  fileList={fileList} setFileList={setFileList}
                  clear={() => { handleOnchangeDate("image", "") }}
                />

                <MyTextField
                  label="Họ và tên"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="full_name"
                  placeholder="Nguyễn Văn A"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <Stack
                  direction={"column"}
                  spacing={1.5}
                  alignItems={"flex-start"}
                  sx={{
                    width: "calc(20% - 12px)",
                    height: "fit-content"
                  }}
                >
                  <label className="label">{T("status")} </label>
                  <Box height={32}>
                    <CSwitch
                      disabled={statusPage === "detail"}
                      checked={!!formData.status}
                      value={formData.status}
                      name="status"
                      onChange={(e) => {
                        handleOnchangeDate(e.target.name, !formData.status ? 1 : 0)
                      }} />
                  </Box>
                </Stack>
                <Stack
                  direction={"column"}
                  spacing={1.5}
                  alignItems={"flex-start"}
                  sx={{
                    width: "calc(20% - 12px)",
                    height: "fit-content",
                  }}
                >
                  <label className="label">{"Nhận lịch online"} </label>
                  <Box height={32}>
                    <CSwitch
                      disabled={statusPage === "detail"}
                      checked={!!formData.is_book_online}
                      value={formData.is_book_online}
                      name="is_book_online"
                      onChange={(e) => {
                        handleOnchangeDate(
                          e.target.name,
                          formData.is_book_online === 1 ? 0 : 1,
                        );
                      }}
                    />
                  </Box>
                </Stack>
                <MyTextField
                  label="Email"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="email"
                  placeholder="mituabc@gmail.com"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                  label={T("phone_number")}
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="phone_number"
                  placeholder="0987xxxxx"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MySelect
                  options={listRole}
                  label="Chức vụ"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="position"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  // type="select-one"
                  itemsPerPage={6}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                  label="Ghi chú"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="note"
                  placeholder="Nhập ghi chú"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MyEditor
                  label="Mô tả nhân viên"
                  errors={errors}
                  required={KEY_REQUIRED}
                  name="description"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                // inputStyle={{ height: 44 }}
                />
              </div>
              <h3 style={{ color: palette.textQuaternary }}>
                Thông tin tài khoản
              </h3>
              <div className="wrapper-from">
                <MyTextField
                  label={T("userName")}
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="username"
                  placeholder="mitu@gmail.com"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage !== "create"}
                />
                {statusPage !== "create" ? (
                  <Box
                    alignItems={"flex-end"}
                    height={62}
                    display={"flex"}
                    pt={"66px"}
                    width={"calc(50% - 12px)"}
                  >
                    <ButtonCore
                      type="bgWhite"
                      title="Đổi mật khẩu"
                      onClick={() => setEditPassword(false)}
                    />
                  </Box>
                ) : (
                  <Box width={"40%"} />
                )}
                {statusPage === "create" && (
                  <MyTextFieldPassword
                    label={T("password")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                      width: "calc(50% - 12px)",
                    }}
                    name="password"
                    placeholder={T("password")}
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    type="password"
                    isError={!errors.includes("password_config")}
                  />
                )}
                {statusPage === "create" && (
                  <MyTextField
                    label={T("confirmPassword")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                      width: "calc(50% - 12px)",
                    }}
                    name="password_config"
                    placeholder={T("confirmPassword")}
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    type="password"
                  />
                )}
              </div>
              <h3 style={{ color: palette.textQuaternary }}>
                Thông tin bổ sung
              </h3>

              <div className="wrapper-from" style={{ paddingBottom: 64 }}>
                <MyDatePickerMui
                  label={T("date_of_birth")}
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="date_of_birth"
                  placeholder="Chọn"
                  handleChange={handleOnchangeDate}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                  label={T("address")}
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="address"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                  label="CCCD"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="cccd"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  disabled={statusPage === "detail"}
                />
                <MyTextFieldCurrency
                  label="Lương theo giờ"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="hourly_wage"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  type="current"
                  disabled={statusPage === "detail"}
                  unit="VND"
                />
                <MyTextFieldCurrency
                  label="Lương theo ca"
                  errors={errors}
                  required={KEY_REQUIRED}
                  configUI={{
                    width: "calc(50% - 12px)",
                  }}
                  name="shift_wage"
                  placeholder="Nhập"
                  handleChange={handleOnchange}
                  values={formData}
                  validate={VALIDATE}
                  type="current"
                  disabled={statusPage === "detail"}
                  unit="VND"
                />
              </div>
            </Stack>
          ) : (
            <Stack p={3} sx={{ gap: 2 }}>
              <MyTextField
                label={"Mật khẩu cũ"}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "100%",
                }}
                name="password"
                placeholder={T("password")}
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="password"
                disabled={statusPage === "detail"}
                isError
              />
              <MyTextFieldPassword
                label={T("confirmPassword")}
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "100%",
                }}
                name="password_config"
                placeholder={T("confirmPassword")}
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                type="password"
                disabled={statusPage === "detail"}
              />
            </Stack>
          )}

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
            {statusPage === "edit" || !editPassword || statusPage === "create" ? (
              <ButtonCore
                title={T("cancel")}
                type="bgWhite"
                onClick={onClosePopup}
              />
            ) : (
              <ButtonCore
                type="bgWhite"
                title="Chỉnh sửa"
                onClick={() => setStatusPage("edit")}
              />
            )}
            {statusPage === "detail" && editPassword ? (
              <ButtonCore title={"Đóng"} onClick={onClosePopup} />
            ) : (
              <ButtonCore title={"Hoàn tất"} onClick={handleSubmit} loading={isApi} />
            )}
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(PopupCreateEmployee);
