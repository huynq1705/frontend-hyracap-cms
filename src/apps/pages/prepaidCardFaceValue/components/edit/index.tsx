import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import CurrencyInput from "@/components/input-custom-v2/currency";
import MySwitch from "@/components/input-custom-v2/switch";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { INIT_PREPAID_CARD_FACE_VALUE } from "@/constants/init-state/prepaid_card_face_value";
import apiPrepaidCardFaceValueService from "@/api/apiPrepaidCardFaceValue.service";
import { ResponsePrepaidCardFaceValueItem } from "@/types/prepaidCardFaceValue";
import MyTextFieldV2 from "@/components/input-custom-v2/text-field/index-v2";
import CustomCurrencyInput from "@/components/input-custom-v2/currency";
const VALIDATE = {
  name: "Vui lòng nhập tên loại thẻ",
  denominations: "Vui lòng nhập mệnh giá",
  price: "Vui lòng nhập giá bán",
  use_time: "Vui lòng nhập thời gian sử dụng",
};
const KEY_REQUIRED: string[] = ["name", "denominations", "price", "use_time"];
interface EditPageProps {
  onClose: () => void;
  refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
  const { onClose, refetch } = props;
  const { code } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { detailCommon } = apiCommonService();
  const { postPrepaidCardFaceValue, putPrepaidCardFaceValue } =
    apiPrepaidCardFaceValueService();
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState(INIT_PREPAID_CARD_FACE_VALUE);
  const title_page = T(getKeyPage(pathname, "key"));
  const [popup, setPopup] = useState({
    remove: false,
    loading: true,
  });
  const isView = useMemo(() => {
    return pathname.includes("view");
  }, [pathname]);

  // fn: function

  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponsePrepaidCardFaceValueItem>(
        code,
        "/prepaid-card-face-value",
      );
      if (response) {
        const convert_data = {
          id: response.id,
          name: response.name,
          denominations: response.denominations,
          price: response.price,
          use_time: response.use_time,
          note: response.note,
          staff_commission: response.staff_commission,
          staff_commission_percentage:
            response.staff_commission_percentage * 100,
          status: !!response.status,
        };
        setFormData(convert_data);
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Failed to fetch product details",
        }),
      );
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const response: any = await postPrepaidCardFaceValue(
        formData,
        KEY_REQUIRED,
      );
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
      }
      let message = `Tạo ${title_page} thất bại`;
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên loại thẻ đã tồn tại";
        message = "Tên loại thẻ đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
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
      console.error("==>", error);
    }
  };
  const handleCancel = () => {
    setFormData(INIT_PREPAID_CARD_FACE_VALUE);
    navigate("/admin/prepaid-card-face-value");
    setErrors([]);
    onClose();
  };

  const handelSave = async () => {
    if (isView) {
      navigate(`/admin/prepaid-card-face-value/edit/${code}`);
    } else {
      await (code ? handleUpdate() : handleCreate());
    }
  };

  const handleUpdate = async () => {
    if (!code) return;
    try {
      const response: any = await putPrepaidCardFaceValue(
        formData,
        code,
        KEY_REQUIRED,
      );
      if (typeof response === "object" && response?.missingKeys) {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
      }
      let message = `Cập nhật ${title_page} thất bại`;
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["name"]);
        VALIDATE.name = "Tên loại thẻ đã tồn tại";
        message = "Tên loại thẻ đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = `Cập nhật ${title_page} thành công`;
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
    }
  };

  const handleRemove = useCallback(() => {
    togglePopup("remove");
  }, []);
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
        new_data.staff_commission = (+prev.price * +convert_value) / 100;
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
        <div className="wrapper-from">
          {code && (
            <>
              {/* id */}
              <MyTextField
                label="Mã"
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
            </>
          )}

          {/* name */}
          <MyTextField
            label="Tên loại thẻ"
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
              configUI={{ width: "calc(50% - 12px)" }}
              disabled={isView}
              errors={errors}
              validate={VALIDATE}
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
          {/* label */}
          <MyTextField
            label="Thời gian sử dụng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            type="number"
            name="use_time"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
            unit="Ngày"
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
            max={formData.price / 2 ?? 100000000}
            min={0}
            disabled={!formData.price}
          />

          {/* note */}
          <MyTextareaAutosize
            label="Mô tả"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "100%",
            }}
            name="note"
            placeholder="Mô tả"
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
