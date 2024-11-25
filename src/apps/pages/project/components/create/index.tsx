import * as React from "react";
import styles from "@/apps/pages/blog/createPage.module.scss";
import { Breadcrumb, Switch, Typography } from "antd";
import { INIT_PROJECT } from "@/constants/init-state/project";
import apiCommonService from "@/api/apiCommon.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProjectService from "@/api/project.service";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import apiIndustryService from "@/api/industry.service";
import { OptionSelect } from "@/types/types";
import CurrencyInput from "@/components/input-custom-v2/currency";
import { Box, Stack } from "@mui/material";
import ButtonCore from "@/components/button/core";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import UploadImage from "@/apps/pages/blog/components/UploadImg";
import MySelect from "@/components/input-custom-v2/select";
import { ResponseProjectItem } from "@/types/project.type";
const VALIDATE = {};

const KEY_REQUIRED = [""];
interface Option {
    key: string;
    value: string;
}

const statusList = [
    {
        value: "0",
        label: "Đã hoàn thành",
    },
    {
        value: "1",
        label: "Đang gọi vốn",
    },
    {
        value: "2",
        label: "Đã đầu tư",
    },
];
const fundingRound = [
    {
        value: "Seed",
        label: "Seed",
    },
    {
        value: "Series A",
        label: "Series A",
    },
    {
        value: "Series B",
        label: "Series B",
    },
    {
        value: "Series C",
        label: "Series C",
    },
    {
        value: "PE",
        label: "PE",
    },
    {
        value: "IPO",
        label: "IPO",
    },
];
export default function ProjectCreatePage() {
    const { code } = useParams();
    const { pathname } = useLocation();
    const { postProject, putProject } = apiProjectService();
    const { getIndustry } = apiIndustryService();
    const { detailCommon } = apiCommonService();

    const { T, t } = useCustomTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errors, setErrors] = React.useState<string[]>([]);
    const [formData, setFormData] = React.useState(INIT_PROJECT);
    const [industry, setIndustry] = React.useState<OptionSelect>([]);
    const [isFirstRemoved, setIsfirstRemoved] = React.useState(false);
    const title_page = T(getKeyPage(pathname, "key"));

    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
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
    const handleOnchangeCurrency = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeImage = (field: string) => (value: any) => {
        console.log("field", field);
        console.log("value", value);

        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const getAllIndustry = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getIndustry(param);
            if (response) {
                setIndustry(
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
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/project");
            if (response) {
                console.log("response", response);
                const convert_data = {
                    id: response.id,
                    name: response.name,
                    thumbnail: response.thumbnail,
                    images: response.images,
                    status: response.status,
                    capital_raising_target: response.capital_raising_target,
                    mobilized_fund: response.mobilized_fund,
                    address: response.data.address,
                    company_size: response.data.company_size,
                    website: response.data.website,
                    project_information_description:
                        response.data.project_information.description,
                    valuation: response.data.project_information.valuation,
                    funding_amount:
                        response.data.project_information.funding_amount,
                    total_slots: response.data.project_information.total_slots,
                    price_per_slot:
                        response.data.project_information.price_per_slot,
                    investors: response.data.project_information.investors,
                    funding_round:
                        response.data.project_information.funding_round,
                    investment_field:
                        response.data.company_information.investment_field,
                    date_of_establishment:
                        response.data.company_information.date_of_establishment,
                    head_office: response.data.company_information.head_office,
                    operating_status:
                        response.data.company_information.operating_status,
                    founder: response.data.company_information.founder,
                    company_name:
                        response.data.company_information.company_name,
                    email: response.data.company_information.email,
                    phone: response.data.company_information.phone,
                    growth_prospects: response.data.growth_prospects,
                    metrics: response.data.metric,
                    description: response.data.description,
                    industry_ids: response.industry_ids,
                    pitching_deck:
                        response.pitching_deck === null
                            ? [""]
                            : [response.pitching_deck],
                    contract_template:
                        response.contract_template === null
                            ? [""]
                            : [response.contract_template],
                    financial_roadmap:
                        response.financial_roadmap === null
                            ? [""]
                            : [response.financial_roadmap],
                    business_plan:
                        response.business_plan === null
                            ? [""]
                            : [response.business_plan],
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
    const handleCreate = async () => {
        console.log("formData", formData);
        try {
            const response = await postProject(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                navigate(`/admin/project`);
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
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putProject(formData, code, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (response.status === false && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.status === true) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                navigate(`/admin/project/view/${response.data.id}`);
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
    const isView = React.useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const isEdit = React.useMemo(() => {
        return pathname.includes("edit");
    }, [pathname]);
    const isCreate = React.useMemo(() => {
        return pathname.includes("create");
    }, [pathname]);

    React.useEffect(() => {
        code && getDetail();
        getAllIndustry();
    }, []);
    return (
        <Stack className="h-fit">
            <Stack direction={"row"} gap={2} className="p-4 bg-white">
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                        color: "#50945D",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/admin/project");
                    }}
                >
                    Quản lý dự án
                </Typography.Title>
                <img src="/src/assets/icons/chevron-right-icon.svg" alt="" />
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                    }}
                >
                    Cấu hình dự án
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
                        Thông tin dự án
                    </Typography.Title>

                    <Stack
                        alignItems={"center"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        sx={{ gap: "12px" }}
                    >
                        {isCreate && (
                            <ButtonCore
                                title={T("cancel")}
                                type="bgWhite"
                                onClick={() => {
                                    navigate("/admin/schedule");
                                }}
                            />
                        )}
                        {isCreate && (
                            <ButtonCore
                                onClick={handleCreate}
                                title={"Hoàn tất"}
                            />
                        )}
                        {isView && (
                            <ButtonCore
                                onClick={() => {
                                    navigate(`/admin/project/edit/${code}`);
                                }}
                                title={"Chỉnh sửa"}
                            />
                        )}
                        {isEdit && (
                            <ButtonCore
                                title={T("cancel")}
                                type="bgWhite"
                                onClick={() => {
                                    navigate(`/admin/project/view/${code}`);
                                }}
                            />
                        )}
                        {isEdit && (
                            <ButtonCore
                                onClick={handleUpdate}
                                title={"Hoàn tất"}
                            />
                        )}
                    </Stack>
                </Stack>
                <Box
                    sx={{
                        borderRadius: 3,
                        bgcolor: "#ffff",
                        py: 2,
                    }}
                >
                    <Stack
                        direction={"column"}
                        gap={6}
                        sx={{
                            width: "100%",
                            px: 2,
                        }}
                    >
                        <Stack direction={"row"} gap={6} className="w-full">
                            <Stack
                                direction={"column"}
                                gap={2}
                                className="w-full"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: "22px",
                                        margin: "0",
                                    }}
                                >
                                    Thông tin công ty
                                </Typography.Title>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyTextField
                                        label="Tên công ty"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="company_name"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Người sáng lập"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="founder"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyDatePickerMui
                                        label="Ngày thành lập"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="date_of_establishment"
                                        placeholder="Chọn ngày "
                                        handleChange={handleOnchangeDate}
                                        disablePastDates={false}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Tình trạng hoạt động"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="operating_status"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyTextField
                                        label="Lĩnh vực đầu tư"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="investment_field"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Trụ sở chính"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="head_office"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyTextField
                                        label="Email"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="email"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Số điện thoại"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="phone"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyTextField
                                        label="Tổng nhân viên"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="company_size"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Website"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="website"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                </Stack>
                                <MyTextField
                                    label="Địa chỉ"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "100%",
                                    }}
                                    name="address"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                            </Stack>
                            <Stack
                                direction={"column"}
                                gap={2}
                                className="w-full"
                            >
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: "22px",
                                        margin: "0",
                                    }}
                                >
                                    Chi tiết dự án
                                </Typography.Title>
                                <MyTextField
                                    label="Tên dự án"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "100%",
                                    }}
                                    name="name"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MySelect
                                        configUI={{
                                            width: "100%",
                                        }}
                                        label="Lĩnh vực đầu tư"
                                        name="industry_ids"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        options={industry}
                                        errors={errors}
                                        validate={VALIDATE}
                                        required={KEY_REQUIRED}
                                        itemsPerPage={5} // Adjust items per page as needed
                                        disabled={isView}
                                        placeholder="Chọn"
                                    />
                                    <MySelect
                                        configUI={{
                                            width: "100%",
                                        }}
                                        label="Trạng thái"
                                        name="status"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        options={statusList}
                                        errors={errors}
                                        validate={VALIDATE}
                                        required={KEY_REQUIRED}
                                        itemsPerPage={5} // Adjust items per page as needed
                                        disabled={isView}
                                        placeholder="Chọn"
                                    />
                                </Stack>
                                <MyTextareaAutosize
                                    label="Giới thiệu"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "100%",
                                    }}
                                    name="project_information_description"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <CurrencyInput
                                        label="Vốn huy động"
                                        name="valuation"
                                        handleChange={handleOnchangeCurrency}
                                        values={formData}
                                        errors={errors}
                                        validate={VALIDATE}
                                        required={KEY_REQUIRED}
                                        configUI={{ width: "100%" }}
                                        disabled={isView}
                                    />
                                    <CurrencyInput
                                        label="Vốn đầu tư"
                                        name="funding_amount"
                                        handleChange={handleOnchangeCurrency}
                                        values={formData}
                                        errors={errors}
                                        validate={VALIDATE}
                                        required={KEY_REQUIRED}
                                        configUI={{ width: "100%" }}
                                        disabled={isView}
                                    />
                                </Stack>
                                <Stack
                                    direction={"row"}
                                    gap={3}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    <MyTextField
                                        label="Tổng slot"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="total_slots"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MyTextField
                                        label="Số nhà đầu tư"
                                        errors={errors}
                                        required={KEY_REQUIRED}
                                        configUI={{
                                            width: "100%",
                                        }}
                                        name="investors"
                                        placeholder="Nhập"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        validate={VALIDATE}
                                        disabled={isView}
                                    />
                                    <MySelect
                                        configUI={{
                                            width: "100%",
                                        }}
                                        label="Vòng đầu tư"
                                        name="funding_round"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        options={fundingRound}
                                        errors={errors}
                                        validate={VALIDATE}
                                        required={KEY_REQUIRED}
                                        itemsPerPage={5} // Adjust items per page as needed
                                        disabled={isView}
                                        placeholder="Chọn"
                                    />
                                </Stack>
                                <MyTextareaAutosize
                                    label="Mô tả dự án"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "100%",
                                    }}
                                    name="description"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                                <MyTextareaAutosize
                                    label="Hướng phát triển"
                                    errors={errors}
                                    required={KEY_REQUIRED}
                                    configUI={{
                                        width: "100%",
                                    }}
                                    name="growth_prospects"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={VALIDATE}
                                    disabled={isView}
                                />
                            </Stack>
                        </Stack>
                        <Stack
                            direction={"row"}
                            className="w-full justify-between"
                        >
                            <div className="flex flex-col w-[calc(20%-12px)]   ">
                                <p className={styles.thirdTitle}>
                                    Ảnh bìa bài viết <span>*</span>
                                </p>
                                {(formData.images.length > 0 ||
                                    isFirstRemoved) && (
                                    <UploadImage
                                        key="upload_image_images"
                                        setImgUrl={handleChangeImage("images")}
                                        imageUrl={formData.images}
                                        isEditable={!isView}
                                        hasError={""}
                                        isFirstRemoved={isFirstRemoved}
                                        setIsFirstRemoved={setIsfirstRemoved}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col w-[calc(20%-12px)]">
                                <p className={styles.thirdTitle}>
                                    Pitchingdeck <span>*</span>
                                </p>
                                {(formData.pitching_deck.length > 0 ||
                                    isFirstRemoved) && (
                                    <UploadImage
                                        key="upload_image_pitching_deck"
                                        setImgUrl={handleChangeImage(
                                            "pitching_deck"
                                        )}
                                        imageUrl={formData.pitching_deck}
                                        isEditable={!isView}
                                        hasError={""}
                                        setIsFirstRemoved={(e) => {}}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col w-[calc(20%-12px)]">
                                <p className={styles.thirdTitle}>
                                    Hợp đồng mẫu <span>*</span>
                                </p>
                                {(formData.contract_template.length > 0 ||
                                    isFirstRemoved) && (
                                    <UploadImage
                                        key="upload_image_contract_template"
                                        setImgUrl={handleChangeImage(
                                            "contract_template"
                                        )}
                                        imageUrl={formData.contract_template}
                                        isEditable={!isView}
                                        hasError={""}
                                        setIsFirstRemoved={(e) => {}}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col w-[calc(20%-12px)]">
                                <p className={styles.thirdTitle}>
                                    Lộ trình tài chính <span>*</span>
                                </p>
                                {(formData.financial_roadmap.length > 0 ||
                                    isFirstRemoved) && (
                                    <UploadImage
                                        key="upload_image_financial_roadmap"
                                        setImgUrl={handleChangeImage(
                                            "financial_roadmap"
                                        )}
                                        imageUrl={formData.financial_roadmap}
                                        isEditable={!isView}
                                        hasError={""}
                                        setIsFirstRemoved={(e) => {}}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col w-[calc(20%-12px)]">
                                <p className={styles.thirdTitle}>
                                    Kế hoạch kinh doanh <span>*</span>
                                </p>
                                {(formData.business_plan.length > 0 ||
                                    isFirstRemoved) && (
                                    <UploadImage
                                        key="upload_image_business_plan"
                                        setImgUrl={handleChangeImage(
                                            "business_plan"
                                        )}
                                        imageUrl={formData.business_plan}
                                        isEditable={!isView}
                                        hasError={""}
                                        setIsFirstRemoved={(e) => {}}
                                    />
                                )}
                            </div>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}
