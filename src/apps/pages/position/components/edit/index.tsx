import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import { OptionSelect } from "@/types/types";
import MySwitch from "@/components/input-custom-v2/switch";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ListImage from "@/components/list-image";
import { Timeline, UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
import X2ChevronDown from "@/components/icons/x2-chevron-down";
import apiHistoryService from "@/api/apiHistory.service";
import { formatDate } from "@/utils/date-time";
import dayjs from "dayjs";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { INIT_SETTING } from "@/constants/init-state/setting";
import { INIT_POSITION } from "@/constants/init-state/position";
import { ResponsePositionItem } from "@/types/position.type";
import apiPositionService from "@/api/Position.service";
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
};
const KEY_REQUIRED = ["name"];
interface EditPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
type History = {
    interest_rate: string;
    effective_from: string;
};
export default function EditPage(props: EditPageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    //--state
    const [productCategory, setProductCategory] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_POSITION);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postPosition, putPosition } = apiPositionService();
    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponsePositionItem>(
                code,
                "/position"
            );
            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    effective_from:
                        response.current_position_setting?.effective_from,
                    direct_bonus_rate:
                        response.current_position_setting?.direct_bonus_rate,
                    kpi_bonus_base:
                        response.current_position_setting?.kpi_bonus_base,
                    monthly_average_target:
                        response.current_position_setting
                            ?.monthly_average_target,
                };
                setFormData(convert_data);
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Failed to fetch product details",
                })
            );
        }
    };

    const handleCreate = async () => {
        try {
            const response = await postPosition(formData, KEY_REQUIRED);
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
    const handleCancel = () => {
        setFormData(INIT_POSITION);
        navigate("/admin/position");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/position/edit/${code}`);
        } else {
            dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            setFormData(INIT_POSITION);
            refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        console.log("formData", formData);

        if (!code) return;
        try {
            const response = await putPosition(formData, code, KEY_REQUIRED);
            let message = `Cập nhật ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Cập nhật ${title_page} thành công`;
                type = "success";
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
            if (response === true) {
                handleCancel();
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "updateError",
                })
            );
            console.error(error);
        }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleOnchangeCurrency = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOnchangeDate = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);

    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );
    //--effect
    useEffect(() => {
        code && getDetail();
        if (open) {
        }
    }, [code, open]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                <div className="wrapper-from items-end">
                    {code && (
                        <>
                            {/* id */}
                            <MyTextField
                                label="Mã chức vụ"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="id"
                                placeholder=""
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                disabled
                            />
                        </>
                    )}
                    {/* name */}
                    <MyTextField
                        label="Tên chức vụ"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    {/* direct_bonus_rate */}
                    <MyTextField
                        label="% thưởng trực tiếp"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="direct_bonus_rate"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        unit="%"
                        max={100}
                        min={0}
                        type="number"
                        disabled={isView}
                    />
                    {/* kpi_bonus_base */}
                    <CurrencyInput
                        label="Thưởng đạt kpi cơ bản"
                        name="kpi_bonus_base"
                        handleChange={handleOnchangeCurrency}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={isView}
                    />
                    {/* monthly_average_target */}
                    <CurrencyInput
                        label="KPI tối thiểu hàng tháng"
                        name="monthly_average_target"
                        handleChange={handleOnchangeCurrency}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={isView}
                    />
                    {code && (
                        <MyDatePickerMui
                            label="Có hiệu lực từ ngày"
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
                            disabled={isView}
                        />
                    )}
                </div>
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
