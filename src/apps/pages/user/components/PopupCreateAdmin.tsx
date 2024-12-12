import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { INIT_USER } from "@/constants/init-state/user";
import { Box } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const VALIDATE = {
    password: "Hãy Chưa update mật khẩu",
};
const KEY_REQUIRED = ["password"];
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
    const [position, setPosition] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_USER);
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        loading: true,
    });
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/users");
            if (response) {
                const convert_data = {
                    id: response[0].id,
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    email: response[0].email,
                    phone: response[0].phone,
                    sub: response[0].sub,
                };
                setFormData(convert_data);
                console.log("formData: ", response);
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
        // console.log("formData", formData);
        // try {
        //     const response = await postStaff(formData, KEY_REQUIRED);
        //     let message = `Tạo ${title_page} thất bại`;
        //     let type = "error";
        //     if (typeof response === "object" && response?.missingKeys) {
        //         setErrors(response.missingKeys);
        //         return;
        //     }
        //     if (response === true) {
        //         message = `Tạo ${title_page} thành công`;
        //         type = "success";
        //         handleCancel();
        //     }
        //     dispatch(
        //         setGlobalNoti({
        //             type,
        //             message,
        //         })
        //     );
        // } catch (error) {
        //     dispatch(
        //         setGlobalNoti({
        //             type: "error",
        //             message: "createError",
        //         })
        //     );
        // }
    };
    const handleCancel = () => {
        setFormData(INIT_USER);
        navigate("/admin/staff");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/staff/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            // setFormData(INIT_STAFF);
            refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        // console.log("formData", formData);
        // if (!code) return;
        // try {
        //     const response = await putStaff(formData, code, KEY_REQUIRED);
        //     let message = `Cập nhật ${title_page} thất bại`;
        //     let type = "error";
        //     if (typeof response === "object" && response?.missingKeys) {
        //         setErrors(response.missingKeys);
        //         return;
        //     }
        //     if (response === true) {
        //         message = `Cập nhật ${title_page} thành công`;
        //         type = "success";
        //     }
        //     dispatch(
        //         setGlobalNoti({
        //             type,
        //             message,
        //         })
        //     );
        //     if (response === true) {
        //         handleCancel();
        //     }
        // } catch (error) {
        //     dispatch(
        //         setGlobalNoti({
        //             type: "error",
        //             message: "updateError",
        //         })
        //     );
        //     console.error(error);
        // }
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
            <Box
                className="flex px-4 py-3 justify-between items-center sticky top-0 left-0 w-[101%] !bg-white z-[4]"
                sx={{
                    border: "1px solid var(--border-color-primary)",
                }}
            >
                <h3>Thông tin người dùng</h3>
                <ButtonCore
                    type="secondary"
                    title=""
                    icon={
                        <FontAwesomeIcon
                            icon={faXmark}
                            width={"16px"}
                            height={16}
                            color="#000"
                        />
                    }
                    onClick={handleCancel}
                />
            </Box>
            <div className="wrapper-edit-page">
                <div className="wrapper-from items-end">
                    {/* name */}
                    <MyTextField
                        label="Mã nhân viên"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="sub"
                        placeholder="Chưa update"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    {/* name */}
                    <MyTextField
                        label="Họ"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="firstName"
                        placeholder="Chưa update"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    {/* name */}
                    <MyTextField
                        label="Tên"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="lastName"
                        placeholder="Chưa update"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    {/* email */}
                    <MyTextField
                        label="Email"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="email"
                        placeholder="Chưa update"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    {/* sđt */}
                    <MyTextField
                        label="Số điện thoại"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="phone"
                        placeholder="Chưa update"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                </div>
            </div>
            <ActionsEditPage actions={actions} isView={isView} />
        </>
    );
}
