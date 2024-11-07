import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProductService from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { INIT_PRODUCT } from "@/constants/init-state/product";
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
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
    // max_duration: "Hãy nhập thời hạn",
    // min_duration: "Hãy nhập thời hạn",
    // max_invest: "Hãy nhập hạn mức đầu tư",
    // min_invest: "Hãy nhập hạn mức đầu tư",
};
const KEY_REQUIRED = [
    "name",
    // "interest_rate",
    // "max_duration",
    // "min_duration",
    // "max_invest",
    // "min_invest",
];
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
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postProduct, putProduct } = apiProductService();
    const { getProductCategory } = apiProductCategoryService();
    const { getHistory } = apiHistoryService();

    const [isShow, setIsShow] = useState(false);
    const [history, setHistory] = useState<History[]>([]);

    const getAllProductCategory = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getProductCategory(param);
            if (response) {
                setProductCategory(
                    response.data.map((it: any) => ({
                        value: it.id.toString(),
                        label: it.name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getInterestRateHistory = async () => {
        if (!code) return;
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getHistory(code, param);
            if (response) {
                setHistory(
                    response.data.map((it: any) => ({
                        interest_rate: it.interest_rate,
                        effective_from: it.effective_from,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseProductItem>(
                code,
                "/products"
            );
            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    min_invest: response.min_invest.toString(),
                    max_invest: response.max_invest.toString(),
                    min_duration: response.min_duration.toString(),
                    max_duration: response.max_duration.toString(),
                    interest_rate: (
                        response.current_interest_rate * 100
                    ).toString(),
                    category_id: response.category_id,
                    effective_from: dayjs().add(1, "day").format("DD-MM-YYYY"),
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
            const response = await postProduct(formData, KEY_REQUIRED);
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
        setFormData(INIT_PRODUCT);
        navigate("/admin/products");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/products/edit/${code}`);
        } else {
            dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            setFormData(INIT_PRODUCT);
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
            const response = await putProduct(formData, code, KEY_REQUIRED);
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
    const toggleShowHistory = () => {
        setIsShow(!isShow);
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
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    const title_page = T(getKeyPage(pathname, "key"));
    //--state
    const [productCategory, setProductCategory] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_PRODUCT);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
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
            getAllProductCategory();
        }
        getInterestRateHistory();
        setIsShow(false);
    }, [code, open]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                <div className="history">
                    <div
                        className="flex items-center gap-1 my-3 cursor-pointer"
                        onClick={toggleShowHistory}
                    >
                        <div className="title font-medium text-base text-[#50945D]">
                            Xem lịch sử thay đổi lãi suất
                        </div>
                        <div
                            className={`transform transition-transform ${
                                isShow ? "rotate-0" : "rotate-180"
                            }`}
                        >
                            <X2ChevronDown />
                        </div>
                    </div>
                    {isShow && (
                        <div className="list-history bg-[#F6FAF7] p-5 rounded-xl my-3 flex flex-col gap-3">
                            {history.length > 0 ? (
                                <Timeline>
                                    {history.map((item, index) => (
                                        <Timeline.Item
                                            key={index}
                                            color={"#D0D5DD"}
                                        >
                                            <div className="flex items-center font-normal text-base text-[#475467] gap-3">
                                                <div>
                                                    Lãi suất{" "}
                                                    {item.interest_rate}
                                                </div>
                                                <div className="w-[6px] h-[6px] rounded-full bg-[#475467]"></div>
                                                <div>
                                                    Hiệu lực từ ngày{" "}
                                                    {formatDate(
                                                        item.effective_from,
                                                        "DDMMYYYY"
                                                    )}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            ) : (
                                <div className="font-medium text-sm text-[#1D2939]">
                                    Chưa có lịch sử chỉnh sửa
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="wrapper-from items-end">
                    {code && (
                        <>
                            {/* id */}
                            <MyTextField
                                label="Mã sản phẩm"
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
                        label="Tên sản phẩm"
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
                    {/* product_category_id */}
                    <MySelect
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        label="Danh mục"
                        name="category_id"
                        handleChange={handleOnchange}
                        values={formData}
                        options={productCategory}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5} // Adjust items per page as needed
                        disabled={isView}
                        placeholder="Chọn"
                    />

                    {/* amount */}
                    <CurrencyInput
                        label="Hạn mức tối thiểu"
                        name="min_invest"
                        handleChange={handleOnchangeCurrency}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={isView}
                    />
                    {/* selling_price */}
                    <CurrencyInput
                        label="Hạn mức tối đa"
                        name="max_invest"
                        handleChange={handleOnchangeCurrency}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={isView}
                    />
                    {/* commission */}
                    <MyTextField
                        label="Thời hạn tối thiểu"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="min_duration"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        unit="Tháng"
                        max={100}
                        min={0}
                        type="number"
                        disabled={isView}
                    />
                    <MyTextField
                        label="Thời hạn tối đa"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="max_duration"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        unit="Tháng"
                        max={100}
                        min={0}
                        type="number"
                        disabled={isView}
                    />
                    <MyTextField
                        label="Mức lãi suất hiện tại"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="interest_rate"
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
                    {!isView && (
                        <MyDatePickerMui
                            label="Lãi suất có hiệu lực từ ngày"
                            errors={errors}
                            required={KEY_REQUIRED}
                            configUI={{
                                width: "calc(50% - 12px)",
                            }}
                            name="date"
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
