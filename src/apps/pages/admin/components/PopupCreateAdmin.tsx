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
import MySelect from "@/components/input-custom-v2/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import MyTextFieldPassword from "@/components/input-custom-v2/password";
import AvatarImage from "@/components/avatar";
import { UploadFile } from "antd";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";

const KEY_REQUIRED = ["full_name", "phone_number", "email", "username"];
const KEY_REQUIRED_V2 = ["old_password", "new_password"];
const VALIDATE = {
    phone_number: "Số điện thoại không đúng định dạng.",
    email: "Email không đúng định dạng.",
    full_name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    username: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    password: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    password_config: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
const VALIDATE_V2 = {
    old_password: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    new_password: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
    refetch: () => void;
    handleClose: () => void;
    // open: boolean;
    data: typeof INIT_EMPLOYEE;
    status: string | "create";
}

function PopupCreateAdmin(props: PopupConfirmRemoveProps) {
    const { handleClose, refetch, data, status } = props;

    const { postAccount, putAccount } = apiAccountService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [statusPage, setStatusPage] = React.useState(status);
    const [formData, setFormData] = React.useState(data);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [listRole] = React.useState<OptionSelect>([
        { label: "Admin", value: "Admin" },
        { label: "Quản lý", value: "Quản lý" },
    ]);
    const [editPassword, setEditPassword] = React.useState(true);
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
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
        try {
            const response = await postAccount(
                formData,
                KEY_REQUIRED,
                fileList
            );
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch && refetch();
                    handleClose();
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message:
                                T("create") +
                                " " +
                                t("manage") +
                                " " +
                                t("success"),
                        })
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message:
                                T("create") +
                                " " +
                                t("manage") +
                                " " +
                                t("fail"),
                        })
                    );

                    break;
                }
                default: {
                    if (typeof response === "object") {
                        if (response.isValid) {
                            let re:
                                | "email"
                                | "phone_number"
                                | "username"
                                | "password";

                            if (response.missingKeys === "phone") {
                                re = "phone_number";
                            } else {
                                re = response.missingKeys as
                                    | "email"
                                    | "username"
                                    | "password";
                            }
                            console.log("TTTT", response);

                            VALIDATE[re] =
                                re === "password"
                                    ? "Mật khẩu không đạt chuẩn."
                                    : `${t(re)} đã tồn tại.`;
                            setErrors([re]);
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message:
                                        re === "password"
                                            ? "Mật khẩu không đạt chuẩn."
                                            : `${t(re)} đã tồn tại.`,
                                })
                            );
                        } else {
                            setErrors(response.missingKeys);
                            (VALIDATE.phone_number =
                                "Số điện thoại không đúng định dạng."),
                                (VALIDATE.username =
                                    "Tên đăng nhập không được để trống."),
                                (VALIDATE.email =
                                    "Email không đúng định dạng.");
                            VALIDATE.password = "Mật khẩu không được để trống.";
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message: "Nhập đẩy đủ dữ liệu",
                                })
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
                })
            );
            console.error("==>", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSubmitUpdate = async () => {
        // const payload = {};
        setIsLoading(true);
        try {
            const response = await putAccount(
                formData,
                formData.id,
                KEY_REQUIRED,
                fileList
            );
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch();

                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message:
                                T("update") +
                                " " +
                                t("manage") +
                                " " +
                                t("success"),
                        })
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message:
                                T("update") +
                                " " +
                                t("manage") +
                                " " +
                                t("fail"),
                        })
                    );
                    break;
                }
                default: {
                    if (typeof response === "object") {
                        if (response.isValid) {
                            let re:
                                | "email"
                                | "phone_number"
                                | "username"
                                | "password";

                            if (response.missingKeys === "phone") {
                                re = "phone_number";
                            } else {
                                re = response.missingKeys as
                                    | "email"
                                    | "username"
                                    | "password";
                            }

                            VALIDATE[re] =
                                re === "password"
                                    ? "Mật khẩu không đạt chuẩn."
                                    : `${t(re)} đã tồn tại.`;
                            setErrors([re]);
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message:
                                        re === "password"
                                            ? "Mật khẩu không đạt chuẩn."
                                            : `${t(re)} đã tồn tại.`,
                                })
                            );
                        } else {
                            setErrors(response.missingKeys);
                            (VALIDATE.phone_number =
                                "Số điện thoại không đúng định dạng."),
                                (VALIDATE.username =
                                    "Tên đăng nhập không được để trống."),
                                (VALIDATE.email =
                                    "Email không đúng định dạng.");
                            VALIDATE.password = "Mật khẩu không được để trống.";
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message: "Nhập đẩy đủ dữ liệu",
                                })
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
                })
            );
            console.error("==>", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = () => {
        if (editPassword) {
            statusPage === "create"
                ? handleSubmitCreate()
                : handleSubmitUpdate();
        } else {
        }
    };
    return (
        <>
            <Dialog
                open={true}
                TransitionComponent={Transition}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={editPassword ? "md" : "sm"}
                // hidden
                // scroll="paper"
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{ sx: { borderRadius: 2.5 } }}
                sx={{ zIndex: 1000 }}
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
                        <h2
                            style={{
                                fontSize: 20,
                                color: palette.textQuaternary,
                            }}
                        >
                            {T(statusPage) + " admin"}
                        </h2>
                        <button
                            onClick={handleClose}
                            style={{
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                            }}
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
                                maxHeight: "64vh",
                                p: 3,
                                width: "100%",
                            }}
                        >
                            <h3 style={{ color: palette.textQuaternary }}>
                                Thông tin chung
                            </h3>
                            <div className="wrapper-from">
                                <AvatarImage
                                    disabled={statusPage === "detail"}
                                    data={formData.image}
                                    fileList={fileList}
                                    setFileList={setFileList}
                                    clear={() => {
                                        handleOnchangeDate("image", "");
                                    }}
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
                                        width: "calc(50% - 12px)",
                                        height: "fit-content",
                                    }}
                                >
                                    <label className="label">
                                        {T("status")}{" "}
                                    </label>
                                    <Box height={32}>
                                        <CSwitch
                                            disabled={statusPage === "detail"}
                                            checked={!!formData.status}
                                            value={formData.status}
                                            name="status"
                                            onChange={(e) => {
                                                handleOnchangeDate(
                                                    e.target.name,
                                                    !formData.status ? 1 : 0
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
                                    type="select-one"
                                    itemsPerPage={5}
                                    disabled={statusPage === "detail"}
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
                                            onClick={() =>
                                                setEditPassword(false)
                                            }
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
                        </Stack>
                    ) : (
                        <Stack p={3} spacing={2}>
                            <MyTextFieldPassword
                                label={T("password")}
                                errors={errors}
                                required={KEY_REQUIRED_V2}
                                configUI={{
                                    width: "100%",
                                }}
                                name="password"
                                placeholder={T("password")}
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE_V2}
                                type="password"
                            />
                            <MyTextField
                                label={T("confirmPassword")}
                                errors={errors}
                                required={KEY_REQUIRED_V2}
                                configUI={{
                                    width: "100%",
                                }}
                                name="password_config"
                                placeholder={T("confirmPassword")}
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE_V2}
                                type="password"
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
                            <ButtonCore
                                title={"Hoàn tất"}
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
export default React.memo(PopupCreateAdmin);
