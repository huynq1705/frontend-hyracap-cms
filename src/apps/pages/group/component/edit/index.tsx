import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apigroupervice from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsViewPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
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
import { Box, Grid, Stack } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MultipleSelect from "@/components/input-custom-v2/select/multi-select-mui";
import { INIT_UPDATE_PRODUCT } from "@/constants/init-state/group";
import apiGroupService from "@/api/Group.service";
import apiStaffService from "@/api/apiStaff.service";
import MemberCard from "../MemberCard";
const VALIDATE = {
    name: "Hãy nhập tên sản phẩm",
};
const KEY_REQUIRED = ["name"];
interface ViewPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
export default function ViewPage(props: ViewPageProps) {
    //--init
    const { onClose, refetch, open } = props;
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { detailCommon } = apiCommonService();

    const { T, t } = useCustomTranslation();
    const { postGroup, putGroup } = apiGroupService();
    const { getStaff } = apiStaffService();

    const [isShow, setIsShow] = useState(false);

    const getAllStaff = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getStaff(param);
            if (response) {
                setStaff(
                    response.data.map((it: any) => ({
                        value: it.id.toString(),
                        label: it.first_name + " " + it.last_name,
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
            const response = await detailCommon<any>(code, "/group");
            console.log("response", response);

            if (response) {
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    members: response.members.map((member: any) => ({
                        members_id: member.id.toString(),
                        members_staff_id: member.staff_id.toString(),
                        members_first_name: member.staff.first_name,
                        members_last_name: member.staff.last_name,
                        members_email: member.staff.email,
                        members_phone: member.staff.phone,
                        members_role_id: member.staff.role_id
                            ? member.staff.role_id.toString()
                            : null,
                        effective_from: member.effective_from,
                        leave_from: member.leave_from,
                        role: member.role.toString(),
                    })),
                };
                setFormData(convert_data);
                console.log("convert_data", convert_data);
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
    const handleView = async () => {};
    const handleCancel = () => {
        setFormData(INIT_UPDATE_PRODUCT);
        navigate("/admin/group");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/group/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleView());
            refetch();
        }
        setTimeout(() => {
            dispatch(setIsLoading(false));
        }, 200);
    };
    const handleUpdate = async () => {};
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };
    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);
    //--const
    const { code } = useParams();
    const { pathname } = useLocation();
    const title_page = T(getKeyPage(pathname, "key"));
    //--state
    const [staff, setStaff] = useState<OptionSelect>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_UPDATE_PRODUCT);
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
        getDetail();
        if (open) {
            getAllStaff();
        }
        setIsShow(false);
    }, [code, open]);
    return (
        <>
            <Box
                className="flex px-4 py-3 justify-between items-center sticky top-0 left-0 w-[101%] !bg-white z-[4]"
                sx={{
                    border: "1px solid var(--border-color-primary)",
                }}
            >
                <h3>Chỉnh sửa đội nhóm</h3>
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
                    <MyTextField
                        label="Mã nhóm"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="id"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MyTextField
                        label="Tên nhóm"
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
                            width:
                                window.innerWidth < 601
                                    ? "100%"
                                    : "calc(50% - 12px)",
                        }}
                        label="Thêm thành viên"
                        name="members"
                        placeholder="Chọn thành viên nhóm"
                        handleChange={handleOnchange}
                        values={formData}
                        options={staff}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        disabled={isView} // Adjust items per page as needed
                    />
                    <Stack direction={"column"} width={"100%"}>
                        <div className="pb-6"> Thông tin thành viên: </div>
                        <Grid container spacing={2}>
                            {formData.members.map(
                                (member: any, index: number) => (
                                    <Grid item xs={4} key={index}>
                                        {" "}
                                        {/* xs=4 tương ứng với 1/3 chiều rộng của container */}
                                        <MemberCard data={member} />
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Stack>
                </div>
            </div>
            <ActionsViewPage actions={actions} isView={isView} />
        </>
    );
}
