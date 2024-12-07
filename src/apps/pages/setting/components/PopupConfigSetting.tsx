import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
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
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { INIT_SETTING } from "@/constants/init-state/setting";
import { getKeyPage } from "@/utils";
import apiSettingService from "@/api/Setting.service";

const KEY_REQUIRED = [
    "direct_bonus_min_percent",
    "kpi_bonus_min_percent",
    "kpi_bonus_max_percent",
];
const VALIDATE = {
    direct_bonus_min_percent: "Vui lòng điền đủ thông tin",
    kpi_bonus_min_percent: "Vui lòng điền đủ thông tin",
    kpi_bonus_max_percent: "Vui lòng điền đủ thông tin",
    effective_from: "2024-09-10",
};
const months = [
    { name: "Tháng 1", key: "jan_rate" },
    { name: "Tháng 2", key: "feb_rate" },
    { name: "Tháng 3", key: "mar_rate" },
    { name: "Tháng 4", key: "apr_rate" },
    { name: "Tháng 5", key: "may_rate" },
    { name: "Tháng 6", key: "jun_rate" },
    { name: "Tháng 7", key: "jul_rate" },
    { name: "Tháng 8", key: "aug_rate" },
    { name: "Tháng 9", key: "sep_rate" },
    { name: "Tháng 10", key: "oct_rate" },
    { name: "Tháng 11", key: "nov_rate" },
    { name: "Tháng 12", key: "dec_rate" },
];
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

function PopupConfigSetting(props: PopupConfirmRemoveProps) {
    const { handleClose, refetch, data, status } = props;
    const { pathname } = useLocation();
    const { T, t } = useCustomTranslation();
    const { postSetting } = apiSettingService();

    const title_page = T(getKeyPage(pathname, "key"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [statusPage, setStatusPage] = React.useState(status);
    const [formData, setFormData] = React.useState(INIT_SETTING);
    const [errors, setErrors] = React.useState<string[]>([]);
    const [listRole] = React.useState<OptionSelect>([
        { label: "Admin", value: "Admin" },
        { label: "Quản lý", value: "Quản lý" },
    ]);
    const [editPassword, setEditPassword] = React.useState(true);
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { signUp, isLoading } = useSignUp();
    //sign up
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleOnchangeDate = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmitCreate = async () => {
        console.log("formdata", formData);
        setLoading(true);
        try {
            const response = await postSetting(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                handleCancel();
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "createError",
                })
            );
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
    const handleCancel = () => {
        setFormData(INIT_SETTING);
        navigate("/admin/setting");
        handleClose();
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
                // scroll=""
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{ sx: { borderRadius: 2.5, overflow: "hidden" } }}
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
                            {`Tạo cấu hình`}
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
                            overflowY: "scroll",
                            scrollbarWidth: "thin",
                            maxHeight: "64vh",
                            p: 3,
                            width: "100%",
                        }}
                    >
                        <div className="wrapper-from">
                            <MyDatePickerMui
                                label="Cấu hình có hiệu lực từ ngày"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="effective_from"
                                placeholder="Chọn ngày hẹn"
                                handleChange={handleOnchangeDate}
                                disablePastDates={true}
                                values={formData}
                                validate={VALIDATE}
                            />
                            <MyTextField
                                label="% thưởng trực tiếp"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="direct_bonus_min_percent"
                                placeholder="Nhập"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                unit="%"
                                max={100}
                                min={0}
                                type="number"
                            />
                            <MyTextField
                                label="KPI đạt thưởng tối thiểu"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="kpi_bonus_min_percent"
                                placeholder="Nhập"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                unit="%"
                                max={100}
                                min={0}
                                type="number"
                            />
                            <MyTextField
                                label="KPI đạt thưởng tối đa"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="kpi_bonus_max_percent"
                                placeholder="Nhập"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                unit="%"
                                max={100}
                                min={0}
                                type="number"
                            />
                            <label className="label">KPI theo tháng:</label>
                            <Grid
                                container
                                rowSpacing={1}
                                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            >
                                {months.map((month) => (
                                    <Grid item xs={3} key={month.key}>
                                        <MyTextField
                                            label={month.name}
                                            errors={errors}
                                            required={KEY_REQUIRED}
                                            configUI={{
                                                width: "100%",
                                            }}
                                            name={month.key}
                                            placeholder="Nhập"
                                            handleChange={handleOnchange}
                                            values={formData}
                                            validate={VALIDATE}
                                            unit="%"
                                            max={100}
                                            min={0}
                                            type="number"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
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
        </>
    );
}
export default React.memo(PopupConfigSetting);
