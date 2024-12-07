import apiCommonService from "@/api/apiCommon.service";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { ResponseProductCategoryItem } from "@/types/productCategory";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyTextField from "@/components/input-custom-v2/text-field";

import HeaderModalEdit from "@/components/header-modal-edit";
import MySwitch from "@/components/input-custom-v2/switch";
import MySelect from "@/components/input-custom-v2/select";
import { array } from "yup";
import { Category, Height } from "@mui/icons-material";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { size } from "lodash";
import apiBlogCategoryService from "@/api/apiBlogCategory.service";
import { INIT_BLOG_CATEGORY } from "@/constants/init-state/blog_category";
import { ResponseBlogCategoryItem } from "@/types/blogCategory.type";
const VALIDATE = {
    name: "Hãy nhập tên danh mục sản phẩm",
};
const KEY_REQUIRED = ["name"];
interface EditPageProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
}
// add new page : 7. giao diện edit

export default function EditBlogCategoryPage(props: EditPageProps) {
    const { onClose, refetch, open } = props;
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { detailCommon } = apiCommonService();
    const { postBlogCategory, putBlogCategory } = apiBlogCategoryService();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_BLOG_CATEGORY);
    const { pathname } = useLocation();
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });

    const handleOnchange = (e: any) => {
        const { name, value, checked } = e.target;
        let convert_data = value;
        if (name === "is_public") convert_data = checked;
        setFormData((prev) => ({ ...prev, [name]: convert_data }));
    };
    const getDetail = async () => {
        if (!code) return;
        try {
            const response = await detailCommon<ResponseBlogCategoryItem>(
                code,
                "/blog_category"
            );
            if (response) {
                const convert_data = {
                    name: response.name,
                    is_public: response.is_public,
                    note: response.note,
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
        try {
            const response = await postBlogCategory(formData, KEY_REQUIRED);
            let message = "Tạo danh mục sản phẩm thất bại";
            let type = "error";
            console.log(formData);
            if (response?.isValid === false) {
                setErrors(response.missingKeys);
                return;
            }
            if (response.statusCode === 402) {
                setErrors(["name"]);
                VALIDATE.name = "Tên danh mục sản phẩm đã tồn tại";
                message = "Tên danh mục sản phẩm đã tồn tại";
                type = "info";
            }
            if (response.statusCode === 200) {
                message = "Tạo danh mục sản phẩm thành công";
                type = "success";
                handleCancel();
                console.log(response);
            }
            console.log(response.statusCode);
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
            console.error(error);
        }
    };
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);

    useEffect(() => {
        console.log("isView", isView);
    }, [pathname]);
    const handleCancel = () => {
        setFormData(INIT_BLOG_CATEGORY);
        navigate(`/${pathname.split("/")[2]}`);
        setErrors([]);
        onClose();
    };
    const handelSave = async () => {
        console.log("isView", isView);
        if (isView) {
            navigate(`/blog_category/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
            console.log("Not view");
            refetch();
        }
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putBlogCategory(
                formData,
                code,
                KEY_REQUIRED
            );
            let message = "Chỉnh sửa danh mục sản phẩm thất bại";
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
                message = "Chỉnh sửa danh mục sản phẩm thành công";
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
        code && getDetail();
        if (open) {
        }
    }, [code, open]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />
            <div className="wrapper-edit-page">
                <div className="wrapper-from">
                    {/* name */}
                    <MyTextField
                        label="Tên danh mục"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{ width: "calc(50% - 12px)" }}
                        name="name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    {/* is_active  */}
                    <MySwitch
                        label="Trạng thái"
                        title=""
                        name="is_public"
                        handleChange={handleOnchange}
                        values={formData}
                        configUI={{ width: "calc(50% - 12px)" }}
                        disabled={isView}
                        validate={VALIDATE}
                        errors={errors}
                    />
                    {/* <MySelect
              options={[
                { label: "Tất cả", value: "5;4;3" },
                { label: "Tin tức", value: "3" },
                { label: " Blog kiến thức ", value: "4" },
                { label: "Hoạt động cộng đồng  ", value: "5" },
              ]}
                label="danh mục"
                category=""
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width:  "calc(50% - 12px)" ,
                }}
                name="category"
                placeholder="Chọn"
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled={isView}
              /> */}
                    <MyTextareaAutosize
                        label="Ghi chú"
                        errors={errors}
                        required={[]}
                        configUI={{
                            width: "100%",
                        }}
                        inputStyle={{
                            fontSize: "14px",
                            // borderColor:"#D0D5DD",
                            outlineStyle: "none",
                        }}
                        name="note"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                </div>

                <div className="btton">
                    <ActionsEditPage actions={actions} isView={isView} />
                </div>
            </div>
        </>
    );
}
