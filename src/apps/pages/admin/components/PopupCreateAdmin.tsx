import {
    Box,
    Button,
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
import { CREATE_ACCOUNT, INIT_EMPLOYEE } from "@/constants/init-state/employee";
import useSignUp from "@/api/useSignUp";
import OTPPopup from "./PopupConfirmOtp";

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
    const [formData, setFormData] = React.useState(CREATE_ACCOUNT);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [listRole] = React.useState<OptionSelect>([
        { label: "Admin", value: "Admin" },
        { label: "Quản lý", value: "Quản lý" },
    ]);
    const [editPassword, setEditPassword] = React.useState(true);
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { signUp, isLoading } = useSignUp();

    const [isOTPOpen, setIsOTPOpen] = React.useState(false);

    const handleCloseOTP = () => {
        setIsOTPOpen(false);
    };
    //sign up
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmitCreate = async () => {
        setLoading(true);
        try {
            const registerPayload = {
                account: formData.account,
                password: formData.password,
            };

            await signUp(registerPayload);
            setLoading(false);
            setIsOTPOpen(true);
        } catch (e) {
            setLoading(false);
        }
    };
    const handleSubmitUpdate = async () => {};

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
                maxWidth={"sm"}
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
                                label="Email hoặc Số điện thoại"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "100%",
                                }}
                                name="account"
                                placeholder="mituabc@gmail.com"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                disabled={statusPage === "detail"}
                            />
                            <MyTextFieldPassword
                                label={T("password")}
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
                            />
                            <MyTextField
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
                        />
                        <ButtonCore
                            title={"Hoàn tất"}
                            onClick={handleSubmit}
                            loading={isLoading}
                        />
                    </Stack>
                </Box>
            </Dialog>
            <OTPPopup open={isOTPOpen} handleClose={handleCloseOTP} />
        </>
    );
}
export default React.memo(PopupCreateAdmin);
