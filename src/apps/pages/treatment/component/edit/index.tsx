import apiCommonService from "@/api/apiCommon.service";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { ResponseProductCategoryItem } from "@/types/productCategory";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Box, InputAdornment, Stack } from "@mui/material";
import CSwitch from "@/components/custom/CSwitch";
import { INIT_TREATMENT } from "@/constants/init-state/treatment";
import { ResponseTreatmentCardItem } from "@/types/treatmentCard";
import SelectGroup from "@/components/select-group";
import MySelect from "@/components/input-custom-v2/select";
import TextFieldsWithEndText from "@/components/input-custom-v2/text-fields-end-text";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import { OptionSelect2 } from "@/types/types";
import apiProductService from "@/api/apiProduct.service";
import apiTreatmentCardService from "@/api/apiTreamentCard.service";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
import CurrencyInput from "@/components/input-custom-v2/currency";
const optionUsetime = [
    { label: "Không giới hạn", value: "Không giới hạn" },
    { label: "Ngày", value: "Ngày" },
];
const VALIDATE = {
    name: "Hãy nhập tên danh mục sản phẩm",
    price: "Hãy nhập giá bán thẻ",
    serviceCatalog: "Hãy chọn dịch vụ",
    total_treatment: "Hãy nhập tổng buổi",
    use_time_select: "Hãy nhập thời gian sử dụng",
    denominations: "Hãy nhập mệnh giá thẻ",
    staff_commission: "Hãy nhập hoa hồng cho nhân viên",
};
const KEY_REQUIRED = [
    "name",
    "price",
    "total_treatment",
    "denominations",
    "staff_commission",
];
interface EditPageProps {
    onClose: () => void;
    refetch: () => void;
}
interface Option {
    key: string;
    value: string;
}

export default function EditTreatmentPage(props: EditPageProps) {
    const { onClose, refetch } = props;
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();

    const { detailCommon } = apiCommonService();
    const { getService } = apiServiceSpaServicerService();
    const { getProduct } = apiProductService();
    const { postTreatmentCard, putTreatmentCard } = apiTreatmentCardService();
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_TREATMENT);
    const { pathname } = useLocation();
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    const [serviceCatalog, setServiceCatalog] = useState<OptionSelect2>([]);
    const [product, setProduct] = useState<OptionSelect2>([]);
    const [caculator, setCaculator] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Option[]>([]);
    const [selectedService, setSelectedService] = useState<Option[]>([]);
    const [selectedUseTime, setSelectedUseTime] = useState({
        use_time_select: [optionUsetime[0].value],
    });
    const title_page = T(getKeyPage(pathname, "key"));

    const handleOnchange = (e: any) => {
        const { name, value, checked } = e.target;

        setFormData((prev) => {
            const convert_value = +value > 100 ? 100 : value < 0 ? 0 : +value;
            const new_data: any = {
                ...prev,
                [name]:
                    name === "status"
                        ? checked
                        : name === "staff_commission_percentage"
                        ? convert_value
                        : value,
            };
            if (name === "staff_commission_percentage") {
                new_data.staff_commission =
                    (+prev.price * +convert_value) / 100;
            }

            return new_data;
        });
    };
    const handleOnchangeCurrency = (name: string, value: any) => {
        setFormData((prev) => {
            const new_data = {
                ...prev,
                [name]: value,
            };
            if (name === "staff_commission")
                new_data.staff_commission_percentage = +(
                    (+value * 100) /
                    +prev.price
                ).toFixed(2);

            return new_data;
        });
    };

    const toggleEdit = () => {
        setIsEdit(!isEdit);
    };
    const getAllServiceCatalog = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getService(param);
            if (response) {
                setServiceCatalog(
                    response.data
                        .filter((it) => it.is_active === true)
                        .map((it) => ({
                            key: it.id.toString(),
                            value: it.name,
                        }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllProduct = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getProduct(param);
            if (response) {
                setProduct(
                    response.data.map((it) => ({
                        key: it.id.toString(),
                        value: it.name,
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
            const response = await detailCommon<ResponseTreatmentCardItem>(
                code,
                "/treatment"
            );
            if (response) {
                const convert_data: any = {
                    name: response.name,
                    denominations: response.denominations?.toString() ?? "",
                    price: response.price?.toString() ?? "",
                    use_time: response.use_time?.toString() ?? "",
                    total_treatment: response.total_treatment?.toString() ?? "",
                    note: response.note,
                    staff_commission: response.staff_commission,
                    staff_commission_percentage:
                        response.staff_commission_percentage * 100,
                    status: response.status,
                    treatment_service: [],
                    treatment_product: [],
                };
                const productOptions: Option[] =
                    response.treatment_products?.map((productItem: any) => ({
                        key: productItem.products?.id.toString(),
                        value: productItem.products?.name,
                    })) || [];
                const serviceOptions: Option[] =
                    response.treatment_service?.map((serviceItem: any) => ({
                        key: serviceItem.service.id?.toString(),
                        value: serviceItem.service?.name,
                    })) || [];
                setSelectedProduct(productOptions);
                setSelectedService(serviceOptions);
                setFormData(convert_data);
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Failed to fetch product category details",
                })
            );
            console.error(error);
        }
    };

    const handleCreate = async () => {
        console.log("formData", formData);
        try {
            const response = await postTreatmentCard(formData, KEY_REQUIRED);
            switch (response) {
                case true: {
                    navigate("/admin/treatment");
                    setFormData(INIT_TREATMENT);
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `Tạo ${title_page} thành công`,
                        })
                    );
                    onClose();
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: `Tạo ${title_page} thất bại`,
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
                    message: "createError",
                })
            );
            console.error(error);
        }
    };

    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const handleCancel = () => {
        setSelectedProduct([]);
        setSelectedService([]);
        setFormData(INIT_TREATMENT);
        navigate("/admin/treatment");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/treatment/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
            // setFormData(INIT_PRODUCT_CATEGORY);
            refetch();
        }
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putTreatmentCard(
                formData,
                code,
                KEY_REQUIRED
            );
            switch (response) {
                case true: {
                    navigate("/admin/treatment");
                    setFormData(INIT_TREATMENT);
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
    const handleOnchangeStatus = (name: string, value: any) => {
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

    const handleSelectedProductChange = (options: Option[]) => {
        setFormData((prev) => ({
            ...prev,
            treatment_product: options.map((option) => ({
                key: option.key,
                value: option.value,
            })),
        }));
    };
    const handleSelectedServiceChange = (options: Option[]) => {
        setFormData((prev) => ({
            ...prev,
            treatment_service: options.map((option) => ({
                key: option.key,
                value: option.value,
            })),
        }));
    };
    useEffect(() => {
        console.log("formData===>>>", formData);
        if (formData.use_time === "") {
            setSelectedUseTime({ use_time_select: ["Không giới hạn"] });
        } else {
            setSelectedUseTime({ use_time_select: ["Ngày"] });
        }
        console.log("selectedUseTime===>>>", selectedUseTime);
    }, [formData]);

    const handleOnchangeUseTime = (event: any) => {
        const value = event.target.value;
        setSelectedUseTime({ use_time_select: [value] });
    };
    useEffect(() => {
        const caculator = (
            (Number(formData.price) * Number(formData.staff_commission)) /
            100
        ).toFixed(2);
        setCaculator(caculator);
    }, [formData.price, formData.staff_commission]);

    useEffect(() => {
        getDetail();
        getAllServiceCatalog();
        getAllProduct();
    }, [code]);

    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />

            <div className="wrapper-edit-page">
                <div className="wrapper-from">
                    {/* name */}
                    <MyTextField
                        label="Tên loại thẻ"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="name"
                        placeholder="Liệu trình ..."
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <Stack
                        direction={"column"}
                        spacing={1.5}
                        alignItems={"flex-start"}
                        sx={{
                            width: "calc(20% - 12px)",
                            height: "fit-content",
                        }}
                    >
                        <label className="label">{"Trạng thái"} </label>
                        <Box height={32}>
                            <CSwitch
                                disabled={isView}
                                checked={formData.status === 1}
                                value={formData.status}
                                name="status"
                                onChange={(e) => {
                                    handleOnchangeStatus(
                                        e.target.name,
                                        formData.status === 1 ? 0 : 1
                                    );
                                }}
                            />
                        </Box>
                    </Stack>
                    <Stack
                        direction={"column"}
                        spacing={1.5}
                        alignItems={"flex-start"}
                        sx={{
                            width: "100%",
                            height: "fit-content",
                        }}
                    >
                        <SelectGroup
                            label="Nhóm liệu trình"
                            title="Tên dịch vụ"
                            initTitle="Chọn dịch vụ"
                            name="serviceCatalog"
                            availableOptions={serviceCatalog}
                            initialSelectedOptions={selectedService}
                            onSelectedOptionsChange={
                                handleSelectedServiceChange
                            }
                            validate={VALIDATE}
                            errors={errors}
                            required={KEY_REQUIRED}
                            disabled={isView}
                            configUI={{
                                width: "100%",
                            }}
                        />
                    </Stack>
                    {/* <Stack
            direction={"column"}
            spacing={1.5}
            alignItems={"flex-start"}
            sx={{
              width: "100%",
              height: "fit-content",
            }}
          >
            <SelectGroup
              label="Nhóm sản phẩm"
              title="Tên sản phẩm"
              initTitle="Chọn sản phẩm"
              name="product"
              availableOptions={product}
              initialSelectedOptions={selectedProduct}
              onSelectedOptionsChange={handleSelectedProductChange}
              validate={VALIDATE}
              errors={errors}
              required={KEY_REQUIRED}
              disabled={isView}
              configUI={{
                width: "100%",
              }}
            />
          </Stack> */}
                    <MyTextField
                        label="Tổng buổi"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="total_treatment"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MySelect
                        configUI={{
                            width:
                                selectedUseTime.use_time_select[0] === "Ngày"
                                    ? "calc(25% - 18px)"
                                    : selectedUseTime.use_time_select[0] ===
                                      "Không giới hạn"
                                    ? "calc(50% - 12px)"
                                    : "100%",
                        }}
                        label="Thời gian sử dụng"
                        name="use_time_select"
                        handleChange={handleOnchangeUseTime}
                        values={selectedUseTime}
                        options={optionUsetime}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        disabled={isView}
                    />
                    {selectedUseTime.use_time_select[0] === "Ngày" && (
                        <TextFieldsWithEndText
                            label=" "
                            type="Ngày"
                            name="use_time"
                            placeholder=""
                            handleChange={handleOnchangeCurrency}
                            value={formData.use_time}
                            errors={errors}
                            validate={VALIDATE}
                            required={KEY_REQUIRED}
                            configUI={{ width: "calc(25% - 18px)" }}
                            disabled={isView}
                        />
                    )}
                    {/* amount */}
                    <CurrencyInput
                        label="Mệnh giá"
                        name="denominations"
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
                        label="Giá bán"
                        name="price"
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
                        label="Phần trăm hoa hồng"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="staff_commission_percentage"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        unit="%"
                        max={100}
                        min={0}
                        type="number"
                        disabled={!formData.price || isView}
                    />
                    {/* commission */}
                    <CustomCurrencyInput
                        label="Hoa hồng"
                        name="staff_commission"
                        handleChange={handleOnchangeCurrency}
                        values={formData}
                        validate={VALIDATE}
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        max={+formData.price / 2 ?? 100000000}
                        min={0}
                        disabled={!formData.price}
                    />
                    {/* <Stack
            direction={"column"}
            spacing={1}
            alignItems={"flex-start"}
            sx={{
              width: "calc(50% - 12px)",
              height: "fit-content",
            }}
          >
            <label className="label">{"Thực nhận"} </label>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingRight: "8px",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "6px",
              }}
            >
              <input
                id=""
                name=""
                value={caculator}
                disabled={true}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  textAlign: "left",
                  padding: "8px",
                  height: "100%",
                }}
                type="number"
              />
              <InputAdornment position="end">VND</InputAdornment>
            </Box>
          </Stack> */}
                    <MyTextField
                        label="Ghi chú"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(100%)",
                        }}
                        name="note"
                        placeholder="Liệu trình ..."
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                </div>
                <ActionsEditPage actions={actions} isView={isView} />
            </div>
        </>
    );
}
