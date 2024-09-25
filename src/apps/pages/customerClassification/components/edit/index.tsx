import apiCommonService from "@/api/apiCommon.service";
import apiCustomerClassificationService from "@/api/apiCustomerClassification.service";
import ActionsEditPage from "@/components/actions-edit-page";
import HeaderModalEdit from "@/components/header-modal-edit";
import MyTextField from "@/components/input-custom-v2/text-field";
import { INIT_CUSTOMER_CLASSIFICATION } from "@/constants/init-state/customer_classification";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { ResponseCustomerClassificationItem } from "@/types/customerClassification";
import { useCallback, useEffect, useMemo, useState } from "react";
import CurrencyInput from "@/components/input-custom-v2/currency";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import CSwitch from "@/components/custom/CSwitch";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import MyColorPicker from "@/components/input-custom-v2/color-picker";

const VALIDATE = {
  rank: "Phân hạng khách hàng",
  required_amount: "Hãy nhập mức đạt",
  color_code:"Chọn màu cho phân hạng khách hàng"
};
const KEY_REQUIRED = ["rank", "required_amount","color_code"];
interface EditCustomerClassificationPageProps {
  onClose: () => void;
  refetch: () => void;
}
export default function EditCustomerClassificationPage(
  props: EditCustomerClassificationPageProps,
) {
  const { onClose, refetch } = props;
  const { code } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();

  const { detailCommon } = apiCommonService();
  const { postCustomerClassification, putCustomerClassification } =
    apiCustomerClassificationService();

  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState(INIT_CUSTOMER_CLASSIFICATION);
  const [popup, setPopup] = useState({
    remove: false,
    loading: true,
  });

  const isView = useMemo(() => {
    return pathname.includes("view");
  }, [pathname]);

  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseCustomerClassificationItem>(
        code,
        "/customer-classification",
      );

      if (response) {
        const convert_data = {
          id: response.id,
          rank: response.rank,
          required_amount: response.required_amount,
          discount: response.discount,
          bonus: response.bonus,
          status: response.status,
          color_code: response.color_code,
        };
        setFormData(convert_data);
      }
    } catch (error) {
      dispatch(
        setGlobalNoti({
          type: "error",
          message: "Failed to fetch customer classification details",
        }),
      );
    }
  };

  const handleCreate = async () => {
    try {
      const response = await postCustomerClassification(formData, KEY_REQUIRED);
      let message = "Tạo phân hạng khách hàng thất bại";
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["rank"]);
        VALIDATE.rank = "Tên phân hạng khách hàng đã tồn tại";
        message = "Tên phân hạng khách hàng đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Tạo phân hạng khách hàng thành công";
        type = "success";
        // handleCancel();
        refetch();

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
          message: T("thereWasError"),
        }),
      );
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handelSave = async () => {
    if (isView) {
      navigate(`/admin/customer-classification/edit/${code}`);
    } else {
      await (code ? handleUpdate() : handleCreate());
    }
  };

  const handleUpdate = async () => {
    if (!code) return;
    try {
      const response = await putCustomerClassification(
        formData,
        code,
        KEY_REQUIRED,
      );
      let message = "Cập nhật phân hạng khách hàng thất bại";
      let type = "error";
      if (response?.isValid === false) {
        setErrors(response.missingKeys);
        return;
      }
      if (response.statusCode === 409) {
        setErrors(["rank"]);
        VALIDATE.rank = "Tên phân hạng khách hàng đã tồn tại";
        message = "Tên phân hạng khách hàng đã tồn tại";
        type = "info";
      }
      if (response.statusCode === 200) {
        message = "Cập nhật phân hạng khách hàng thành công";
        type = "success";
        refetch();

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

  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? checked : value,
    }));
  };
  const handleOnchangeStatus = (name: string, value: any) => {
    setFormData((prev) => ({
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

  const actions = useMemo(
    () => ({ handelSave, handleRemove, handleCancel }),
    [formData],
  );

  const togglePopup = useCallback((params: keyof typeof popup) => {
    setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
  }, []);

  useEffect(() => {
    if (code) {
      getDetail();
    } 
  }, [code]);
  return (
    <>
      <HeaderModalEdit onClose={handleCancel} />
      <div className="wrapper-edit-page">
        <div className="wrapper-from">
          {/* rank */}
          <MyTextField
            label="Hạng khách hàng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{}}
            name="rank"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={isView}
          />
          <CurrencyInput
            label="Mức đạt"
            name="required_amount"
            handleChange={handleOnchangeCurrency}
            values={formData}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            configUI={{}}
            disabled={isView}
          />
          <MyColorPicker
            label="Màu sắc"
            name="color_code"
            handleChange={handleOnchange}
            values={formData}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            // disabled={isView}
          />

          {/* is_active  */}
          <Stack
            direction={"column"}
            spacing={1.5}
            alignItems={"flex-start"}
            sx={{
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
                    formData.status === 1 ? 0 : 1,
                  );
                }}
              />
            </Box>
          </Stack>
        </div>
        <ActionsEditPage actions={actions} isView={isView} isBigBtn />
      </div>
    </>
  );
}
