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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import palette from "@/theme/palette-common";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import MyTextFieldPassword from "@/components/input-custom-v2/password";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MyRadio from "@/components/input-custom-v2/radio";
import MyTextFieldCurrency from "@/components/input-custom-v2/currency/TextCurrency";
import { Typography } from "antd";
import apiWorkScheduleService from "@/api/apiWorkSchedule";
import { INIT_WORK_SCHEDULE } from "@/constants/init-state/work_schedule";
import MyTextSelectTime from "../../../../../components/input-custom-v2/time/MySelectTime";
import { Shift } from "./Shift";
import dayjs from "dayjs";

const VALIDATE = {
    date: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = [
    "date"
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
    data: typeof INIT_WORK_SCHEDULE;
    refetch : VoidFunction
}

function PopupEditCalendar(props: PopupConfirmRemoveProps) {
    const { handleClose, data, refetch } = props;
    const { postWorkSchedule ,putWorkSchedule} = apiWorkScheduleService();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [formData, setFormData] = React.useState(data);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmitPass = async () => {
        setIsLoading(true)
        try {
            const response = await postWorkSchedule(formData,KEY_REQUIRED)
            switch (response) {
                case true: {
                    // navigate("/customer");
                    refetch()
                    handleClose();
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
                    message: "updateError",
                }),
            );
            console.error("==>", error);
        } finally {
            setIsLoading(false)
        }


    }
    const handleSubmitUpdate = async () => {
        setIsLoading(true)
        try {
            const response = await putWorkSchedule(formData, KEY_REQUIRED)
            switch (response) {
                case true: {
                    // navigate("/customer");
                    handleClose();
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
                    message: "updateError",
                }),
            );
            console.error("==>", error);
        } finally {
            setIsLoading(false)
        }


    }

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
                maxWidth={"md"}
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
                            Tạo lịch làm việc
                        </h2>
                        <button
                            onClick={handleClose}
                            style={{ border: "none", backgroundColor: 'white' }}
                        >
                            <FontAwesomeIcon icon={faClose} style={{ width: 28, height: 28 }} />
                        </button>
                    </DialogActions>


                    <Stack spacing={2}
                        sx={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            maxHeight: "70vh",
                            p: 3,
                            width: "100%",
                        }}  >

                        <div className="wrapper-from" >
                            <MyDatePicker
                                label={"Ngày tạo lịch"}
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="date"
                                placeholder="Chọn"
                                handleChange={handleOnchangeDate}
                                values={formData}
                                validate={VALIDATE}
                                formatCalendar="DD/MM/YYYY"
                                formatInput="YYYY-MM-DD"
                                minDate={dayjs()}
                            />
                            {/* <MyRadio
                                handleChange={handleOnchange}
                                name="type"
                                options={[{ label: "Ngày làm", value: "1" }, { value: "2", label: "Ngày nghỉ" }]}
                                values={formData}
                                label="Loại lịch"
                                errors={[]}
                                validate={{}}
                                direction="column"
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                            /> */}
                        
                            {/* <Typography.Text style={{ width: "100%" }}>
                                    Lịch nghỉ
                                </Typography.Text>
                                {
                                    formData.list_off_shift.map((item, index) => (
                                        <>
                                            <MyTextSelectTime
                                                label="Thời gian bắt đầu"
                                                errors={errors}
                                                required={KEY_REQUIRED}
                                                configUI={{
                                                    width: "calc(50% - 12px)",
                                                }}
                                                name="start_time"
                                                placeholder="Nhập"
                                                handleChange={(name, value) => handleOnchangeTime("start_time", value, index)}
                                                values={item}
                                                validate={VALIDATE}
                                            />
                                            <MyTextSelectTime
                                                label="Thời gian kết thúc"
                                                errors={errors}
                                                required={KEY_REQUIRED}
                                                configUI={{
                                                    width: "calc(50% - 12px)",
                                                }}
                                                name="end_time"
                                                placeholder="Nhập"
                                                handleChange={(name, value) => handleOnchangeTime("end_time", value, index)}
                                                values={item}
                                                validate={VALIDATE}
                                            />

                                        </>
                                    ))
                                }
                         */}
                         <Shift 
                         title="Lịch làm việc"
                                name="list_work_shift"
                                onChange={handleOnchangeDate}
                                values={formData.list_work_shift}

                         />
                            <Shift
                                title="Lịch nghỉ"
                                name="list_off_shift"
                                onChange={handleOnchangeDate}
                                values={formData.list_off_shift}

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


                        <ButtonCore title={"Hoàn tất"} loading={isLoading} onClick={formData.id ? handleSubmitUpdate : handleSubmitPass} />
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
}
export default React.memo(PopupEditCalendar);
