import apiCommonService from "@/api/apiCommon.service";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { ResponseProductCategoryItem } from "@/types/productCategory";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_PRODUCT_CATEGORY } from "@/constants/init-state/product_category";
import HeaderModalEdit from "@/components/header-modal-edit";

const VALIDATE = {
    name: "Hãy nhập tên danh mục sản phẩm",
    min_duration: "Hãy nhập thời hạn",
    max_duration: "Hãy nhập thời hạn",
    min_interest_rate: "Hãy nhập lãi suất",
};
const KEY_REQUIRED = [
    "name",
    "min_duration",
    "max_duration",
    "min_interest_rate",
];
interface EditPageProps {
    onClose: () => void;
    refetch: () => void;
}
export default function EditProductCategoryPage(props: EditPageProps) {
    const { onClose, refetch } = props;
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { detailCommon } = apiCommonService();
    const { postProductCategory, putProductCategory } =
        apiProductCategoryService();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_PRODUCT_CATEGORY);
    const { pathname } = useLocation();
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });

    const handleOnchange = (e: any) => {
        const { name, value, checked } = e.target;
        let convert_data = value;
        setFormData((prev) => ({ ...prev, [name]: convert_data }));
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseProductCategoryItem>(
                code,
                "/product-category"
            );
            console.log("response", response);
            if (response) {
                const convert_data = {
                    name: response.name,
                    min_duration: response.min_duration ?? "",
                    max_duration: response.max_duration ?? "",
                    min_interest_rate: response.min_interest_rate
                        ? (+response.min_interest_rate * 100)
                              .toFixed(2)
                              .toString()
                        : "",
                };
                setFormData(convert_data);
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "Failed to fetch product category details",
                })
            );
        }
    };
    const handleCreate = async () => {
        console.log("formData", formData);
        if (+formData.min_duration >= +formData.max_duration) {
            setErrors(["min_duration", "max_duration"]);
            VALIDATE.min_duration = "Thời hạn tối thiểu < Thời hạn tối đa";
            VALIDATE.max_duration = "Thời hạn tối đa > Thời hạn tối thiểu";
        }
        try {
            const response = await postProductCategory(formData, KEY_REQUIRED);
            let message = "Tạo danh mục sản phẩm thất bại";
            let type = "error";
            if (response?.isValid === false) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.statusCode === 409) {
                setErrors(["name"]);
                VALIDATE.name = "Tên danh mục sản phẩm đã tồn tại";
                message = "Tên danh mục sản phẩm đã tồn tại";
                type = "info";
            }
            if (response.statusCode === 200) {
                message = "Tạo danh mục sản phẩm thành công";
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
                    message: "Tạo thất bại",
                })
            );
            console.error(error);
        }
    };
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const handleCancel = () => {
        setFormData(INIT_PRODUCT_CATEGORY);
        navigate(`/admin/${pathname.split("/")[2]}`);
        setErrors([]);
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/product-category/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
            refetch();
        }
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putProductCategory(
                formData,
                code,
                KEY_REQUIRED
            );
            let message = "Tạo danh mục sản phẩm thất bại";
            let type = "error";
            if (response?.isValid === false) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.statusCode === 409) {
                setErrors(["name"]);
                VALIDATE.name = "Tên danh mục sản phẩm đã tồn tại";
                message = "Tên danh mục sản phẩm đã tồn tại";
                type = "info";
            }
            if (response.statusCode === 200) {
                message = "Chỉnh sửa thành công";
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
                    message: "updateError",
                })
            );
            console.error(error);
        }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );

    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);

    useEffect(() => {
        getDetail();
        console.log("formData", formData);
    }, [code]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                {/* name */}
                <div className="wrapper-from items-end">
                    <MyTextField
                        label="Tên danh mục"
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
                    <MyTextField
                        label="Thời hạn tối thiểu"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "100%",
                        }}
                        name="min_duration"
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
                    <MyTextField
                        label="Thời hạn tối đa"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "100%",
                        }}
                        name="max_duration"
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
                    <MyTextField
                        label="Mức lãi suất hiện tại"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "100%",
                        }}
                        name="min_interest_rate"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        unit="%"
                        max={100}
                        min={0}
                        type="number"
                        disabled={isView}
                    />
                </div>
            </div>
            <ActionsEditPage
                actions={actions}
                isView={isView}
                isBigBtn={true}
            />
        </>
    );
}
