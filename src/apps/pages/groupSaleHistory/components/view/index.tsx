import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsViewPage from "@/components/actions-edit-page";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import { OptionSelect } from "@/types/types";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Box, Grid, Stack } from "@mui/material";
import ButtonCore from "@/components/button/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { INIT_GROUP_SALE_HISTORY } from "@/constants/init-state/group_sale_history";
import CurrencyInput from "@/components/input-custom-v2/currency";
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

    const [isShow, setIsShow] = useState(false);

    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(
                code,
                "/group_sale_history"
            );
            console.log("response", response);

            if (response) {
                const convert_data = {
                    kpi: response.kpi,
                    sales_revenue: response.sales_revenue,
                    month: response.month,
                    leader_name:
                        response.leader.last_name +
                        " " +
                        response.leader.first_name,
                    leader_email: response.leader.email,
                    leader_phone: response.leader.phone,
                    group_name: response.group.name,
                    member_sale_histories: response.member_sale_histories.map(
                        (member: any) => ({
                            kpi: member.kpi,
                            kpi_bonus: member.kpi_bonus,
                            direct_bonus: member.direct_bonus,
                            sales_revenue: member.sales_revenue,
                            members_staff_id: member.staff_id,
                            members_first_name: member.staff.first_name,
                            members_last_name: member.staff.last_name,
                            members_email: member.staff.email,
                            members_phone: member.staff.phone,
                            effective_from:
                                member.staff_position?.effective_from || null,
                            staff_position:
                                member.staff_position?.position?.name || "N/A",
                        })
                    ),
                };
                console.log("convert_data", convert_data);
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
    const handleView = async () => {};
    const handleCancel = () => {
        setFormData(INIT_GROUP_SALE_HISTORY);
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
        // const { name, value } = e.target;
        // setFormData((prev: any) => ({ ...prev, [name]: value }));
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
    const [formData, setFormData] = useState(INIT_GROUP_SALE_HISTORY);
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
                <h3>Chi hoa hồng nhóm</h3>
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
                        label="Tên nhóm"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="group_name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <MyTextField
                        label="Thời gian"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="month"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <MyTextField
                        label="Quản lý"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="leader_name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <MyTextField
                        label="Email"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="leader_email"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <MyTextField
                        label="Số điện thoai"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="leader_phone"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <CurrencyInput
                        name="kpi"
                        label="KPI"
                        handleChange={handleOnchange}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={true}
                    />
                    <CurrencyInput
                        name="sales_revenue"
                        label="Tổng doanh thu"
                        handleChange={handleOnchange}
                        values={formData}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={true}
                    />

                    <Stack direction={"column"} width={"100%"}>
                        <div className="pb-6"> Thông tin thành viên: </div>
                        <Grid container spacing={2} alignItems="stretch">
                            {formData.member_sale_histories.map(
                                (member: any, index: number) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={index}
                                        style={{ display: "flex" }}
                                    >
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
