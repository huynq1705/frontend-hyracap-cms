import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MySelect from "@/components/input-custom-v2/select";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { INIT_STAFF } from "@/constants/init-state/staff";
import apiStaffService from "@/api/apiStaff.service";
import apiPositionService from "@/api/Position.service";
import { Box, Stack, Tab, useMediaQuery } from "@mui/material";
import { Typography } from "antd";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ButtonCore from "@/components/button/core";
const VALIDATE = {
    first_name: "Hãy nhập họ",
    last_name: "Hãy nhập tên ",
    email: "Email chưa đúng định dạng",
    phone: "Số điện thoại chưa đúng định dạng",
    current_staff_position: "Hãy chọn chức vụ",
    password: "Hãy nhập mật khẩu",
};
const KEY_REQUIRED = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "current_staff_position",
    "password",
];
type History = {
    interest_rate: string;
    effective_from: string;
};
export default function EditPage() {
    //--init
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    //--state
    const [position, setPosition] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_STAFF);
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        loading: true,
    });
    const [subTabStaff, setSubTabStaff] = useState("1");
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { getPosition } = apiPositionService();
    const { postStaff, putStaff } = apiStaffService();
    const title_page = T(getKeyPage(pathname, "key"));

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/staff");
            if (response) {
                const convert_data = {
                    id: response.id,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email: response.email,
                    role_id: response.role_id,
                    phone: response.phone,
                    password: response.password,
                    current_staff_position:
                        response.current_staff_position.position.id,
                };
                setFormData(convert_data);
                console.log("formData: ", convert_data);
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

    const getAllPosition = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getPosition(param);
            if (response) {
                setPosition(
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

    const handleCreate = async () => {
        console.log("formData", formData);
        try {
            const response = await postStaff(formData, KEY_REQUIRED);
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
        setFormData(INIT_STAFF);
        navigate("/admin/staff");
        // onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/staff/edit/${code}`);
        } else {
            // dispatch(setIsLoading(true));
            await (code ? handleUpdate() : handleCreate());
            // setFormData(INIT_STAFF);
            // refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {
        console.log("formData", formData);

        if (!code) return;
        try {
            const response = await putStaff(formData, code, KEY_REQUIRED);
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
    const isSmallScreen = useMediaQuery("(max-width: 640px)");

    const handleChangeSubTab = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setSubTabStaff(newValue);
    };
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
        getAllPosition();
        // if (open) {
        // }
    }, [code, open]);
    return (
        <Stack className="h-auto">
            <Stack direction={"row"} gap={2} className="p-4 bg-white border-b">
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/admin/staff");
                    }}
                >
                    Danh sách nhân viên
                </Typography.Title>
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                    }}
                >
                    /
                </Typography.Title>
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "#50945D",

                        margin: "0",
                    }}
                >
                    {pathname.includes("create")
                        ? "Tạo mới nhân viên"
                        : "Chi tiết nhân viên"}
                </Typography.Title>
            </Stack>
            <Stack
                spacing={2}
                sx={{
                    p: 2,
                    width: "100%",
                }}
            >
                <Stack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={"row"}
                >
                    <Typography.Title
                        level={4}
                        style={{
                            fontSize: "24px",
                            lineHeight: "40px",
                            margin: "0",
                        }}
                    >
                        Thông tin nhân viên
                    </Typography.Title>

                    <Stack
                        alignItems={"center"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        sx={{ gap: "12px" }}
                    >
                        {(pathname.includes("create") ||
                            pathname.includes("edit")) && (
                            <ButtonCore
                                title={T("cancel")}
                                type="bgWhite"
                                onClick={() => {
                                    navigate("/admin/staff");
                                }}
                            />
                        )}
                        {pathname.includes("create") && (
                            <ButtonCore
                                onClick={handleCreate}
                                title={"Hoàn tất"}
                            />
                        )}
                        {pathname.includes("edit") && (
                            <ButtonCore
                                onClick={handleUpdate}
                                title={"Hoàn tất"}
                            />
                        )}
                        {pathname.includes("view") && (
                            <ButtonCore
                                onClick={() => {
                                    navigate(`/admin/staff/edit/${code}`);
                                }}
                                title={"Chỉnh sửa"}
                            />
                        )}
                    </Stack>
                </Stack>
            </Stack>
            <Stack className="m-4 bg-white rounded-3xl">
                <TabContext value={subTabStaff}>
                    {!isSmallScreen && (
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                backgroundColor: "#fff",
                            }}
                        >
                            <TabList
                                onChange={handleChangeSubTab}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="Thông tin nhân viên" value="1" />
                            </TabList>
                        </Box>
                    )}
                    <TabPanel
                        sx={{
                            padding: 0,
                            display:
                                isSmallScreen && subTabStaff === "1"
                                    ? "none"
                                    : "block",
                        }}
                        value="1"
                    >
                        <div className="wrapper-edit-page">
                            <div className="wrapper-from items-end">
                                {/* name */}
                                <MyTextField
                                    label="Họ"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="first_name"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                                {/* name */}
                                <MyTextField
                                    label="Tên"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="last_name"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
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
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
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
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                                {/* pw */}
                                {!isView && (
                                    <MyTextField
                                        label="Mật khẩu"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "calc(50% - 12px)",
                                        }}
                                        name="password"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                )}
                                <MySelect
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    label="Chức vụ"
                                    name="current_staff_position"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    options={position}
                                    errors={errors}
                                    validate={VALIDATE}
                                    required={KEY_REQUIRED}
                                    itemsPerPage={5} // Adjust items per page as needed
                                    disabled={isView}
                                    placeholder="Chọn"
                                />
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
            </Stack>
        </Stack>
    );
}
