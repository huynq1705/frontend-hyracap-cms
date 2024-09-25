import {
    Box,
    Dialog,
    DialogActions,
    Slide,
    Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ButtonCore from "@/components/button/core";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import MyTextField from "@/components/input-custom-v2/text-field";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import MyTextFieldPassword from "@/components/input-custom-v2/password";

const VALIDATE = {
    old_password: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    new_password:"Thông tin bắt buộc, vui lòng điền đầy đủ."
};

const KEY_REQUIRED = [
    "old_password",
    "new_password"
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
    handleClose: () => void;
    // open: boolean;
    code?: string | number;
}

function PopupChangePass(props: PopupConfirmRemoveProps) {
    const { handleClose, code } = props;
    const { putAccountChangPass } = apiAccountService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [formData, setFormData] = React.useState({
        new_password: "",
        old_password: ""
    });
    const [errors, setErrors] = React.useState<string[]>([]);
    const [isApi, setIsApi] = React.useState(false)
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };




    const handleSubmitPass = async () => {
        setIsApi(true)
        try {
            const response = await putAccountChangPass(formData, Number(code), KEY_REQUIRED)
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
                            message: T("update") + " "+ t("password") + " "+ t("fail"),
                        }),
                    );
                    break;
                }
                default: {
                    console.log(response);

                    if (typeof response === "object") {
                        setErrors(response.missingKeys);
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
        } finally {
            setIsApi(false)
        }


    }

    

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
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: "100%",
                            alignItems: 'center',
                            p: 2,
                            borderBottom: "0.5px solid #D0D5DD",

                        }}
                    >
                        <h2 style={{ fontSize: 20, color: palette.textQuaternary }}>
                            {"Đổi mật khẩu"}
                        </h2>
                        <button
                            onClick={handleClose}
                            style={{ border: "none", backgroundColor: 'white' }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ width: 28, height: 28 }} />
                        </button>
                    </DialogActions>


                    <Stack spacing={2} p={3} >
                        <MyTextFieldPassword

                            label={T("password")}
                            errors={errors}
                            required={KEY_REQUIRED}
                            configUI={{
                                width: "100%",
                            }}
                            name="old_password"
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
                            name="new_password"
                            placeholder={T("confirmPassword")}
                            handleChange={handleOnchange}
                            values={formData}
                            validate={VALIDATE}
                            type="password"
                        />
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


                        <ButtonCore title={"Hoàn tất"} onClick={handleSubmitPass} loading={isApi}/>
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
}
export default React.memo(PopupChangePass);
