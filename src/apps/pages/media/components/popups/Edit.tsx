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
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { Image, Typography } from "antd";
import icon from "@/assets/icons/close.svg"
import MySelectGroupV3 from "@/components/select-group/MySelectGroupItemV3";
const VALIDATE = {
    name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

// const VALIDATE_TEXT = {
//     email: "Họ và tên không được chứa kí tự đặc biệt.",
//     phone_number: "Sai định dạng",
// };
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
    refetch?: () => void;
    handleClose: () => void;
    // open: boolean;
    data: typeof INIT_PAYMENT_METHOD;
    status: string | "create";
    // content: React.ReactNode
    // listItem: React.Key[];
}

function PopupEditMedia(props: PopupConfirmRemoveProps) {
    const { handleClose, refetch, data, status } = props;
    const { postPaymentMethod, putPaymentMethod } = apiPaymentMethodService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [statusPage, setStatusPage] = React.useState(status);
    const [formData, setFormData] = React.useState(INIT_PAYMENT_METHOD);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isChoose, setIsChoose] = React.useState<number>(0);
    React.useEffect(() => {
        setStatusPage(status);
        setFormData(data);
        setErrors([]);
    }, []);

    React.useEffect(() => {
        if (data) {
        }
    }, [data]);
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
        setIsLoading(true)
        try {
            const response = await postPaymentMethod(formData, KEY_REQUIRED)
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch && refetch()
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
                        dispatch(
                            setGlobalNoti({
                                type: "info",
                                message: "Nhập đẩy đủ dữ liệu",
                            }),
                        );
                    }
                }
            }
            setIsLoading(false)
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "createError",
                }),
            );
            setIsLoading(false)
            console.error("==>", error);
        }
    };
    const handleSubmitUpdate = async () => {
        // const payload = {};
        setIsLoading(true)
        try {
            const response = await putPaymentMethod(formData, KEY_REQUIRED)
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch && refetch()
                    handleClose()
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: "updateSuccess",
                        }),
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "updateError",
                        }),
                    );
                    break;
                }
                default: {
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
                    setIsLoading(false)
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "updateError",
                }),
            );
            setIsLoading(false)
            console.error("==>", error);
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
                maxWidth={"md"}
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
                            Đăng ký truyền thông
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
                            <MySelectGroupV3

                                handleChange={() => { }}
                                name=""
                                values={{}}
                                label="Đăng ký sử dụng sản phẩm ngân hàng"
                                list={[{ id: 1, name: "content" }, { id: 2, name: "content" }, { id: 13, name: "content" }]}
                                render={(item) => (
                                <div onClick={()=> setIsChoose(item?.id)} style={{cursor:'pointer'}}>
                                        <Stack
                                            sx={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: "12px",
                                                border: `1.6px solid ${item?.id === isChoose ? "#50945D" : "#D0D5DD"}`,
                                                p: "8px 12px 8px 8px",
                                                borderRadius: "12px"
                                            }}>
                                            <Image
                                                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                                // alt={d?.name}
                                                style={{ borderRadius: 8, height: 32, width: 32 }}
                                                preview={false}
                                            />
                                            <Typography.Text>
                                                Momo
                                            </Typography.Text>
                                        </Stack>
                                </div>    
                                )}
                            />
                            {
                                isChoose !== 0 &&
                                <Box className="wrapper-from">
                                        <MyTextField
                                            label="Tiêu đề truyền thông"
                                            errors={errors}
                                            required={KEY_REQUIRED}

                                            name="name"
                                            placeholder="Nhập"
                                            handleChange={handleOnchange}
                                            values={formData}
                                            validate={VALIDATE}
                                            disabled={statusPage === "detail"}
                                        />
                                        <MyTextareaAutosize
                                            label="Nội dung truyền thông"
                                            errors={errors}
                                            required={KEY_REQUIRED}
                                            name="description"
                                            placeholder="Nhập"
                                            handleChange={handleOnchange}
                                            values={formData}
                                            validate={VALIDATE}
                                            disabled={statusPage === "detail"}
                                        />
                                        <Stack
                                            direction={"column"}
                                            spacing={1}
                                            alignItems={"flex-start"}
                                            width={"100%"}
                                        >
                                            <label className="label"> Ảnh đính kèm </label>
                                            <Stack sx={{ position: "relative" }}>
                                                <Image
                                                    src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                                    // alt={d?.name}
                                                    style={{ borderRadius: 12, height: 220, width: 220 }}
                                                />
                                                <img src={icon} style={{ width: 40, height: 40, position: 'absolute', top: 0, right: 0 }} />

                                            </Stack>

                                        </Stack>
                                        <MyDatePickerMui
                                            label="Ngày hẹn"
                                            errors={errors}
                                            required={KEY_REQUIRED}
                                            configUI={{
                                                width: "calc(50% - 12px)",
                                            }}
                                            name="date"
                                            placeholder="Chọn ngày hẹn"
                                            handleChange={handleOnchangeDate}
                                            values={formData}
                                            validate={VALIDATE}
                                            disabled={statusPage === "detail"}
                                        />
                                        <MyDatePickerMui
                                            label="Ngày hẹn"
                                            errors={errors}
                                            required={KEY_REQUIRED}
                                            configUI={{
                                                width: "calc(50% - 12px)",
                                            }}
                                            name="date"
                                            placeholder="Chọn ngày hẹn"
                                            handleChange={handleOnchangeDate}
                                            values={formData}
                                            validate={VALIDATE}
                                            disabled={statusPage === "detail"}
                                        />
                                </Box>
                            }
                        
                      
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
                                title={T("edit")}
                                onClick={() => setStatusPage("edit")}

                            />
                        )}
                        {statusPage === "detail" ? (
                            <ButtonCore title={T("close")} onClick={handleClose} />
                        ) : (
                            <ButtonCore title={T("save")} onClick={handleSubmit} loading={isLoading} />
                        )}
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
}
export default React.memo(PopupEditMedia);
