import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { INIT_INDUSTRY } from "@/constants/init-state/industry";
import apiIndustryService from "@/api/industry.service";
import { ResponseIndustryItem } from "@/types/industry.type";
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
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_INDUSTRY);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postIndustry, putIndustry } = apiIndustryService();
    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseIndustryItem>(
                code,
                "/industry"
            );
            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
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
            const response = await postIndustry(formData, KEY_REQUIRED);
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
        setFormData(INIT_INDUSTRY);
        navigate("/admin/industry");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/industry/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            setFormData(INIT_INDUSTRY);
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
            const response = await putIndustry(formData, code, KEY_REQUIRED);
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
                        label="Tên lĩnh vực"
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
                </div>
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
