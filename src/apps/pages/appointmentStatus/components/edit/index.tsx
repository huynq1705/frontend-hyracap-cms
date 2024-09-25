import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import HeaderModalEdit from "@/components/header-modal-edit";
import { INIT_APPOINTMENT_STATUS } from "@/constants/init-state/appointment_status";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import { SketchPicker } from "react-color";
import { Box, Stack } from "@mui/material";
import { ResponseAppointmentStatusItem } from "@/types/appointmentStatus";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
const VALIDATE = {
    name: "Hãy nhập trạng thái",
    color: "Hãy chọn 1 màu",
};
const KEY_REQUIRED = ["name", "color"];
interface EditPageProps {
    onClose: () => void;
    refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
    const { onClose, refetch } = props;
    const { code } = useParams();
    const { pathname } = useLocation();
    const { T, t } = useCustomTranslation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { detailCommon } = apiCommonService();
    const { postAppointmentStatus, putAppointmentStatus } =
        apiAppointmentStatusService();
    const [errors, setErrors] = useState<string[]>([]);
    const [openPicColor, setOpenPicColor] = useState(true);
    const [formData, setFormData] = useState(INIT_APPOINTMENT_STATUS);
    const title_page = T(getKeyPage(pathname, "key"));
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    // fn: function

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseAppointmentStatusItem>(
                code,
                "/status-schedule"
            );
            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    color: response.color,
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
            console.error(error);
        }
    };

    const handleCreate = async () => {
        // try {
        //   const response = await postAppointmentStatus(formData, KEY_REQUIRED);
        //   switch (response) {
        //     case true: {
        //       navigate("/admin/status-schedule");
        //       setFormData(INIT_APPOINTMENT_STATUS);
        //       dispatch(
        //         setGlobalNoti({
        //           type: "success",
        //           message: `Tạo ${title_page} thành công`,
        //         }),
        //       );
        //       onClose();
        //       break;
        //     }
        //     case false: {
        //       dispatch(
        //         setGlobalNoti({
        //           type: "error",
        //           message: `Tạo ${title_page} thất bại`,
        //         }),
        //       );
        //       break;
        //     }
        //     default: {
        //       if (typeof response === "object") {
        //         setErrors(response.missingKeys);
        //         dispatch(
        //           setGlobalNoti({
        //             type: "info",
        //             message: "Nhập đẩy đủ dữ liệu",
        //           }),
        //         );
        //       }
        //     }
        //   }
        // } catch (error) {
        //   dispatch(
        //     setGlobalNoti({
        //       type: "error",
        //       message: "createError",
        //     }),
        //   );
        //   console.error("==>", error);
        // }
    };
    const handleCancel = () => {
        setFormData(INIT_APPOINTMENT_STATUS);
        navigate("/admin/status-schedule");
        onClose();
    };

    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/status-schedule/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
            setFormData(INIT_APPOINTMENT_STATUS);
            refetch();
        }
    };

    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putAppointmentStatus(
                formData,
                code,
                KEY_REQUIRED
            );
            switch (response) {
                case true: {
                    navigate("/admin/status-schedule");
                    setFormData(INIT_APPOINTMENT_STATUS);
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `Cập nhật ${title_page} thành công`,
                        })
                    );
                    onClose();
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: `Cập nhật ${title_page} thất bại`,
                        })
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
                            })
                        );
                    }
                }
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
        const { name, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );

    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);
    useEffect(() => {
        getDetail();
    }, [code]);

    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                <div
                    className={`wrapper-from ${
                        code ? "items-start" : "items-end"
                    }`}
                >
                    {code && (
                        <>
                            {/* id */}
                            <MyTextField
                                label="Mã trạng thái"
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="id"
                                placeholder="Sản phẩm A"
                                handleChange={handleOnchange}
                                values={formData}
                                validate={VALIDATE}
                                disabled
                            />
                        </>
                    )}

                    {/* name */}
                    <MyTextField
                        label="Tên trạng thái"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="name"
                        placeholder="Trạng thái A"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <Stack
                        direction={"column"}
                        className="gap-1 "
                        width={"calc(50% - 12px)"}
                    >
                        <label className="label">
                            Mã màu <span style={{ color: "red" }}>(*)</span>
                        </label>
                        <Box
                            className="h-9 mb-2 rounded-md relative cursor-pointer"
                            sx={{
                                backgroundColor: formData.color || "black",
                            }}
                            onClick={() => {
                                setOpenPicColor(!openPicColor);
                            }}
                        ></Box>
                    </Stack>
                    {openPicColor && (
                        <SketchPicker
                            className="select-color"
                            color={formData.color}
                            onChange={(updatedColor: any) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    color: updatedColor.hex,
                                }))
                            }
                        />
                    )}

                    {/* description */}
                    {/* <MyTextareaAutosize
            label="Mô tả"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "100%",
            }}
            name="description"
            placeholder="Mô tả"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          /> */}
                </div>
                <ActionsEditPage actions={actions} isView={isView} />
            </div>
        </>
    );
}
