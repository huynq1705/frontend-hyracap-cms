import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProductService from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { INIT_PRODUCT } from "@/constants/init-state/product";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import { formatCurrency, getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import dayjs from "dayjs";
import apiAccountService from "@/api/Account.service";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_CONTRACT } from "@/constants/init-state/contract";
import apiContractService from "@/api/apiContract.service";
import CustomAutocomplete from "@/components/input-custom-v2/select/index-autocomplete";
import ContractForm from "../contractForm";
import { Box, Stack } from "@mui/material";
import { Typography } from "antd";
import ButtonCore from "@/components/button/core";
const VALIDATE = {
    capital: "Hãy nhập số vốn đầu tư",
    user_sub: "Hãy chọn tên khách hàng",
    product_id: "Hãy chọn sản phẩm đầu tư",
    duration: "Hãy nhập thời hạn đầu tư",
};
const KEY_REQUIRED = ["capital", "duration", "user_sub", "product_id"];

export default function EditPageV2() {
    //--fn
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const { detailCommon } = apiCommonService();
    const { postProduct, putProduct } = apiProductService();
    const { postContract, putContract } = apiContractService();
    const { getProduct } = apiProductService();
    const { getAccount } = apiAccountService();

    const getAllProduct = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
                total_invested__lt: "column_total_capacity",
            };
            const response = await getProduct(param);
            if (response) {
                setProduct(
                    response.data.map((it: any) => ({
                        value: it.id.toString(),
                        label: `${it.name} - ${it.category.name}`,
                    }))
                );
                setProductInfo(response.data);
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllAccount = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getAccount(param);
            if (response) {
                setAccount(
                    response.data
                        .filter((it: any) => it.kycStatus === "VERIFIED")
                        .map((it: any) => ({
                            value: it.sub.toString(),
                            label: `${it?.firstName}` + " " + `${it?.lastName}`,
                        }))
                );
                console.log(
                    "response.data",
                    response.data
                        .filter((it: any) => it.kycStatus === "VERIFIED")
                        .map((it: any) => ({
                            value: it.sub.toString(),
                            label: `${it?.firstName}` + " " + `${it?.lastName}`,
                        }))
                );
                setAccountInfo(response.data);
            }
        } catch (e) {
            throw e;
        }
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<any>(code, "/contract");
            if (response) {
                const convert_data = {
                    id: response.id,
                    capital: response.capital,
                    duration: response.duration,
                    product_id: response.product.id,
                    user_sub: response.user_sub.toString(),
                    staff_id: response.staff_id,
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
        try {
            console.log("first");
            const response = await postContract(formData, KEY_REQUIRED);
            let message = `Tạo ${title_page} thất bại`;
            let type = "error";
            if (typeof response === "object" && response?.missingKeys) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.statusCode === 422) {
                message = `${response.error.message}`;
                type = "error";
            }
            if (response.statusCode === 200) {
                message = `Tạo ${title_page} thành công`;
                type = "success";
                setFormData(INIT_CONTRACT);
                navigate(`/admin/contract`);
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
                    message: "Thông tin nhập không phù hợp",
                })
            );
        }
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putContract(formData, code, KEY_REQUIRED);
            let message = `Cập nhật ${title_page} thất bại`;
            let type = "error";
            // if (typeof response === "object" && response?.missingKeys) {
            //     setErrors(response.missingKeys);
            //     return;
            // }
            if (response.statusCode === 422) {
                message = `${response.error.message}`;
                type = "error";
            }
            if (response.statusCode === 200) {
                message = `Cập nhật ${title_page} thành công`;
                type = "success";
                setFormData(INIT_CONTRACT);
            }
            dispatch(
                setGlobalNoti({
                    type,
                    message,
                })
            );
            if (response === true) {
                // handleCancel();
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
    const handleFindName = (value: string, label: string) => {
        const accountMatch = account.find((c) => c.value === value);

        if (accountMatch) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                user_sub: accountMatch.value,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                user_sub: value,
            }));
        }
    };
    const handleOnchangeCurrency = (name: string, value: any) => {
        setFormData((prev) => ({
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
    const [product, setProduct] = useState<OptionSelect>([]);
    const [productInfo, setProductInfo] = useState<any>([]);
    const [account, setAccount] = useState<OptionSelect>([]);
    const [accountInfo, setAccountInfo] = useState<any>();
    const [contractInfo, setContractInfo] = useState<any>();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_CONTRACT);
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    // const actions = useMemo(
    //     () => ({ handelSave, handleRemove, handleCancel }),
    //     [formData]
    // );

    //--effect
    useEffect(() => {
        const updateContractInfo = () => {
            let updatedContractInfo = { ...contractInfo };
            if (formData.capital) {
                updatedContractInfo.capital = formData.capital;
            }
            if (formData.duration) {
                updatedContractInfo.duration = formData.duration;
            }
            if (formData.user_sub) {
                const user = accountInfo?.find(
                    (acc: any) => acc.sub === +formData.user_sub
                );
                if (user) {
                    updatedContractInfo.user = { ...user };
                } else {
                    updatedContractInfo.user = formData.user_sub;
                }
            }
            if (formData.product_id) {
                const productItem = productInfo?.find(
                    (prod: any) => prod.value === productInfo.id
                );
                if (productItem) {
                    updatedContractInfo.product_id = {
                        ...productItem,
                    };
                } else {
                    updatedContractInfo.product_id = formData.product_id;
                }
            }

            setContractInfo(updatedContractInfo);
        };
        updateContractInfo();
        console.log("productInfo", productInfo);
    }, [formData, accountInfo, product]);
    useEffect(() => {
        getDetail();
        getAllProduct();
        getAllAccount();
    }, [code, open]);

    const isView = React.useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const isEdit = React.useMemo(() => {
        return pathname.includes("edit");
    }, [pathname]);
    const isCreate = React.useMemo(() => {
        return pathname.includes("create");
    }, [pathname]);
    return (
        <Stack className="h-auto">
            <Stack direction={"row"} gap={2} className="p-4 bg-white">
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/admin/contract");
                    }}
                >
                    Danh sách hợp đồng
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
                        margin: "0",
                        color: "#50945D",
                    }}
                >
                    {" "}
                    {isView ? "Chi tiết hợp đồng" : "Tạo hợp đồng"}
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
                        Thông tin hợp đồng
                    </Typography.Title>

                    <Stack
                        alignItems={"center"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        sx={{ gap: "12px" }}
                    >
                        {/* <ButtonCore
                            title={"In"}
                            type="bgWhite"
                            onClick={handlePrint}
                        /> */}
                        {isCreate && (
                            <ButtonCore
                                title={T("cancel")}
                                type="bgWhite"
                                onClick={() => {
                                    navigate("/admin/contract");
                                }}
                            />
                        )}
                        {isCreate && (
                            <ButtonCore
                                onClick={handleCreate}
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
                        gap={5}
                        sx={{
                            width: "100%",
                            px: 2,
                        }}
                    >
                        <div className="wrapper-from ">
                            <CustomAutocomplete
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                label="Tên khách hàng"
                                name="user_sub"
                                handleChange={handleFindName}
                                values={formData}
                                options={account}
                                errors={errors}
                                validate={VALIDATE}
                                required={KEY_REQUIRED}
                                itemsPerPage={5}
                                disabled={isView}
                                placeholder="Chọn khách hàng"
                            />

                            <MySelect
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                label="Tên sản phẩm"
                                name="product_id"
                                handleChange={handleOnchange}
                                values={formData}
                                options={product}
                                errors={errors}
                                validate={VALIDATE}
                                required={KEY_REQUIRED}
                                itemsPerPage={5} // Adjust items per page as needed
                                disabled={isView}
                                placeholder="Chọn"
                            />

                            <CurrencyInput
                                name="capital"
                                label="Tổng tiền đầu tư"
                                handleChange={handleOnchangeCurrency}
                                values={formData}
                                errors={errors}
                                validate={VALIDATE}
                                required={KEY_REQUIRED}
                                configUI={{ width: "calc(50% - 12px)" }}
                                disabled={isView}
                            />

                            <MyTextField
                                errors={errors}
                                required={KEY_REQUIRED}
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                name="duration"
                                label="Thời hạn"
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
                        </div>
                        <Stack direction={"column"} width={"100%"}>
                            <div> Thông tin sản phẩm: </div>
                            <ul className="pl-8">
                                <li>
                                    Hạn mức đầu tư tối thiểu:{" "}
                                    <strong>
                                        {formatCurrency(
                                            +contractInfo?.product_id
                                                ?.min_invest
                                        )}
                                    </strong>
                                </li>
                                <li>
                                    Hạn mức đầu tư tối đa:{" "}
                                    <strong>
                                        {formatCurrency(
                                            +contractInfo?.product_id
                                                ?.max_invest
                                        )}
                                    </strong>
                                </li>
                                <li>
                                    Thời hạn tối thiểu:{" "}
                                    <strong>
                                        {contractInfo?.product_id?.min_duration}{" "}
                                        tháng
                                    </strong>
                                </li>
                                <li>
                                    Thời hạn tối đa:{" "}
                                    <strong>
                                        {contractInfo?.product_id?.max_duration}{" "}
                                        tháng
                                    </strong>
                                </li>
                                <li>
                                    Lãi suất:{" "}
                                    <strong>
                                        {(+contractInfo?.product_id
                                            ?.current_interest_rate).toFixed(2)}
                                        %
                                    </strong>
                                </li>
                            </ul>
                        </Stack>
                        <ContractForm data={contractInfo} />
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
}
