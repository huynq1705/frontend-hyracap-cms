import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import CurrencyInput from "@/components/input-custom-v2/currency";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { INIT_REPORT } from "@/constants/init-state/report";
import apiReportService from "@/api/report.service";
import { ResponseReportItem } from "@/types/report";
import MySelect from "@/components/input-custom-v2/select";
import UploadImage from "@/apps/pages/blog/components/UploadImg";
import { Stack } from "@mui/material";
import { Typography } from "antd";
import UploadFile from "@/apps/pages/project/components/UploadFile";
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
};
const KEY_REQUIRED = ["name"];
interface EditPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
const type = [
    { value: "0", label: "Báo cáo tài chính" },
    { value: "1", label: "Báo cáo dự án" },
    { value: "2", label: "Báo cáo xã hội" },
    { value: "3", label: "Báo cáo khác" },
];
export default function EditPage(props: EditPageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    //--state
    const [typeOption, setTypeOption] = useState<OptionSelect>(type);
    const [errors, setErrors] = useState<string[]>([]);
    const [checkFile, setCheckFile] = useState(false);
    const [formData, setFormData] = useState(INIT_REPORT);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postReport, putReport } = apiReportService();
    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseReportItem>(
                code,
                "/report"
            );
            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    type: response.type,
                    file: response.file,
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
            const response = await postReport(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                setCheckFile(false);

                handleCancel();
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
        } catch (error) {
            setCheckFile(true);

            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Tạo thất bại",
                })
            );
        }
    };
    const handleCancel = () => {
        setFormData(INIT_REPORT);
        navigate("/admin/report");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/report/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            // setFormData(INIT_REPORT);
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
            const response = await putReport(formData, code, KEY_REQUIRED);
            let message = `Cập nhật ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Cập nhật ${title_page} thành công`;
                type = "success";
                setCheckFile(false);
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
            setCheckFile(true);
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
    const handleChangeImage = (field: string) => (value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                    {/* name */}
                    <MyTextField
                        label="Tên Báo cáo"
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
                    <MySelect
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        label="Loại báo cáo"
                        name="type"
                        handleChange={handleOnchange}
                        values={formData}
                        options={typeOption}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5} // Adjust items per page as needed
                        disabled={isView}
                        placeholder="Chọn"
                    />
                </div>
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        margin: "0",
                        paddingTop: "24px",
                    }}
                >
                    File báo cáo <span className="text-[#ff0000]">(*)</span>
                </Typography.Title>
                <Stack className="w-full">
                    <UploadFile
                        setImgUrl={handleChangeImage("file")}
                        imageUrl={formData.file}
                        isEditable={true}
                        hasError={""}
                        setIsFirstRemoved={(e) => {}}
                    />
                </Stack>
                {checkFile && (
                    <Typography.Title
                        level={4}
                        style={{
                            fontSize: "10px",
                            margin: "0",
                            paddingTop: "6px",
                            color: "#ff0000",
                        }}
                    >
                        Vui lòng upload file.
                    </Typography.Title>
                )}
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
