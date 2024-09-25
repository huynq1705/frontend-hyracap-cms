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
import MySwitch from "@/components/input-custom-v2/switch";

const VALIDATE = {
  name: "Hãy nhập tên danh mục sản phẩm",
};
const KEY_REQUIRED = ["name"];
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
    if (name === "status") convert_data = checked;
    setFormData((prev) => ({ ...prev, [name]: convert_data }));
  };
  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseProductCategoryItem>(
        code,
        "/product-category",
      );
      if (response) {
        const convert_data = {
          name: response.name,
          status: !!response.status,
        };
        setFormData(convert_data);
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Failed to fetch product category details",
        }),
      );
    }
  };
  const handleCreate = async () => {
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
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        }),
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
      const response = await putProductCategory(formData, code, KEY_REQUIRED);
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
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "updateError",
        }),
      );
      console.error(error);
    }
  };
  const handleRemove = useCallback(() => {
    togglePopup("remove");
  }, []);
  const actions = useMemo(
    () => ({ handelSave, handleRemove, handleCancel }),
    [formData],
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
        <div className="">
          {/* name */}
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
          {/* is_active  */}
          <MySwitch
            label="Trạng thái"
            title="Active"
            name="status"
            handleChange={handleOnchange}
            values={formData}
            configUI={{ width: "calc(50% - 12px)" }}
            disabled={isView}
            validate={VALIDATE}
            errors={errors}
          />
        </div>
        <ActionsEditPage actions={actions} isView={isView} isBigBtn={true} />
      </div>
    </>
  );
}
