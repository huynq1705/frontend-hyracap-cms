import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiProductService from "@/api/apiProduct.service";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { INIT_PRODUCT } from "@/constants/init-state/product";
import { setGlobalNoti, setIsLoading } from "@/redux/slices/app.slice";
import { ResponseProductItem } from "@/types/product";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import CurrencyInput from "@/components/input-custom-v2/currency";
import apiProductCategoryService from "@/api/apiProductCategory.service";
import apiProductTypeService from "@/api/apiProductType.service";
import { OptionSelect } from "@/types/types";
import MySwitch from "@/components/input-custom-v2/switch";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import ListImage from "@/components/list-image";
import { UploadFile } from "antd";
import { v4 as uuidv4 } from "uuid";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
const VALIDATE = {
  name: "Hãy nhập tên sản phẩm",
  original_price: "Hãy nhập giá",
  selling_price: "Hãy nhập giá",
  stock: "Hãy nhập số lượng",
};
const KEY_REQUIRED = ["name", "original_price", "selling_price", "stock"];
interface EditPageProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
  //--init
  const { onClose, refetch, open } = props;
  //--fn
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { detailCommon } = apiCommonService();
  const { postProduct, putProduct } = apiProductService();
  const { getProductCategory } = apiProductCategoryService();
  const { getProductType } = apiProductTypeService();
  const getAllProductCategory = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
        filter: "status__eq__1",
      };
      const response = await getProductCategory(param);
      if (response) {
        setProductCategory(
          response.data.map((it: any) => ({
            value: it.id.toString(),
            label: it.name,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const getAllProductType = async () => {
    try {
      const param = {
        page: 1,
        take: 999,
      };
      const response = await getProductType(param);

      if (response.data) {
        setProductType(
          response.data.map((it) => ({
            value: it.id.toString(),
            label: it.name,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseProductItem>(
        code,
        "/products",
      );
      if (response) {
        const convert_data = {
          id: response.id,
          name: response.name,
          brand: response.brand,
          stock: response.stock,
          original_price: response.original_price,
          selling_price: response.selling_price,
          product_category_id: response.product_category_id
            ? [response.product_category_id.toString()]
            : [],
          product_type_id: response.product_type_id
            ? [response.product_type_id.toString()]
            : [],
          description: response.description,
          status: !!response.status,
          commission: response.commission,
          commission_percentage: response.commission_percentage * 100,
        };
        setFormData(convert_data);
        response.image &&
          setFileList(
            response.image.map((img) => ({
              uid: uuidv4(),
              name: img,
              status: "done",
              url: `${import.meta.env.VITE_APP_URL_IMG}${img}`,
              isRes: true,
            })),
          );
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Failed to fetch product details",
        }),
      );
    }
  };
  const handleCreate = async () => {
    try {
      const response = await postProduct(formData, KEY_REQUIRED, fileList);
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
        }),
      );
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "createError",
        }),
      );
    }
  };
  const handleCancel = () => {
    setFormData(INIT_PRODUCT);
    navigate("/admin/products");
    onClose();
  };
  const handelSave = async () => {
    if (isView) {
      navigate(`/admin/products/edit/${code}`);
    } else {
      dispatch(setIsLoading(true));
      await (code ? handleUpdate() : handleCreate());
      setFormData(INIT_PRODUCT);
      refetch();
    }
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 200);
  };
  const handleUpdate = async () => {
    if (!code) return;
    try {
      const response = await putProduct(formData, code, KEY_REQUIRED, fileList);
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
        }),
      );
      if (response === true) {
        handleCancel();
      }
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
  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const convert_value = +value > 100 ? 100 : value < 0 ? 0 : +value;
      const new_data = {
        ...prev,
        [name]:
          name === "status"
            ? checked
            : name === "commission_percentage"
            ? convert_value
            : value,
      };
      if (name === "commission_percentage") {
        new_data.commission = (+prev.selling_price * +convert_value) / 100;
      }
      if (name === "commission")
        new_data.commission_percentage = (+prev.selling_price / +value) * 100;
      console.log("new_data :", new_data, value);
      return new_data;
    });
  };
  const handleOnchangeCurrency = (name: string, value: any) => {
    setFormData((prev) => {
      const new_data = {
        ...prev,
        [name]: value,
      };
      if (name === "commission")
        new_data.commission_percentage = +(
          (+value * 100) /
          +prev.selling_price
        ).toFixed(2);
      console.log("new_data :", new_data, value);
      return new_data;
    });
  };
  const togglePopup = useCallback((params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  }, []);
  //--const
  const { code } = useParams();
  const { pathname } = useLocation();
  const title_page = T(getKeyPage(pathname, "key"));
  //--state
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [productCategory, setProductCategory] = useState<OptionSelect>([]);
  const [productType, setProductType] = useState<OptionSelect>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState(INIT_PRODUCT);
  const [popup, setPopup] = useState({
    remove: false,
    loading: true,
  });
  const isView = useMemo(() => {
    return pathname.includes("view");
  }, [pathname]);
  const actions = useMemo(
    () => ({ handelSave, handleRemove, handleCancel }),
    [formData, fileList],
  );
  //--effect
  useEffect(() => {
    code && getDetail();
    if (open) {
      getAllProductCategory();
      getAllProductType();
    }
  }, [code, open]);
  console.log({ formData, productCategory });
  return (
    <>
      <HeaderModalEdit onClose={handleCancel} />
      <div className="wrapper-edit-page">
        <div className="wrapper-from items-end">
          {code && (
            <>
              {/* id */}
              <MyTextField
                label="Mã sản phẩm"
                errors={errors}
                required={KEY_REQUIRED}
                configUI={{
                  width: "calc(50% - 12px)",
                }}
                name="id"
                placeholder=""
                handleChange={handleOnchange}
                values={formData}
                validate={VALIDATE}
                disabled
              />
              {/* status  */}
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
            </>
          )}
          {/* name */}
          <MyTextField
            label="Tên sản phẩm"
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
          {/* status  */}
          {!code && (
            <MySwitch
              label="Trạng thái"
              title="Active"
              name="status"
              handleChange={handleOnchange}
              values={formData}
              configUI={{ width: "calc(25% - 18px)" }}
              disabled={isView}
              errors={errors}
              validate={VALIDATE}
            />
          )}
          {/* product_category_id */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Danh mục"
            name="product_category_id"
            handleChange={handleOnchange}
            values={formData}
            options={productCategory}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            disabled={isView}
            placeholder="Chọn"
          />
          {/* product_type_id */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Loại sản phẩm"
            name="product_type_id"
            handleChange={handleOnchange}
            values={formData}
            options={productType}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            disabled={isView}
          />
          {/* label */}
          <MyTextField
            label="Nhãn hiệu"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="brand"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
          {/* label */}
          <MyTextField
            label="Số lượng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="stock"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
          {/* amount */}
          <CurrencyInput
            label="Giá nhập"
            name="original_price"
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
            name="selling_price"
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
            name="commission_percentage"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            unit="%"
            max={100}
            min={0}
            type="number"
            disabled={!formData.selling_price || isView}
          />
          {/* commission */}
          <CustomCurrencyInput
            label="Hoa hồng"
            name="commission"
            handleChange={handleOnchangeCurrency}
            values={formData}
            validate={VALIDATE}
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            max={formData.selling_price / 2 ?? 100000000}
            min={0}
            disabled={!formData.selling_price}
          />

          <ListImage
            fileList={fileList}
            length={5}
            setFileList={setFileList}
            disabled={isView}
          />

          {/* description */}
          <MyTextareaAutosize
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
          />
        </div>
      </div>
      <ActionsEditPage actions={actions} isView={isView} />
    </>
  );
}
