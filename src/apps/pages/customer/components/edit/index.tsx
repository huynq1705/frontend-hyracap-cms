import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import MySelect from "@/components/input-custom-v2/select";
import { OptionSelect } from "@/types/types";
import HeaderModalEdit from "@/components/header-modal-edit";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MyRadio from "@/components/input-custom-v2/radio";
import { GENDER } from "@/constants";
import { handleGetDataCommon } from "@/utils/fetch";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import apiAccountService from "@/api/Account.service";
import apiCustomerService from "@/api/apiCustomer.service";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import apiCustomerClassificationService from "@/api/apiCustomerClassification.service";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const VALIDATE = {
  full_name: "Hãy nhập tên khách hàng",
  phone_number: "Hãy nhập số điện thoại",
  contact_staff: "Hãy chọn nhân viên liên hệ",
  person_in_charge: "Hãy chọn nhân viên phụ trách",
  customer_source_id: "Hãy chọn nguồn khách hàng",
  email: "Nhập email theo đúng định dạng",
};
const KEY_REQUIRED = [
  "full_name",
  "phone_number",
  "contact_staff",
  "person_in_charge",
  "customer_source_id",
  "email",
];
interface EditPageProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}
export default function EditPage(props: EditPageProps) {
  //--fn :
  const disableFutureDates = (current: moment.Moment | null) => {
    return current && current > moment().endOf("day");
  };
  const handleCancel = () => {
    setFormData(INIT_CUSTOMER);
    navigate("/admin/customer");
    onClose();
  };
  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;
    let convert_value = value;
    setFormData((prev) => ({ ...prev, [name]: convert_value }));
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
    };
    const convert = (data: any) => {
      if (!Array.isArray(data)) return [];
      return data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name ?? item.rank,
      }));
    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getCustomerSource, convert, setCustomerSource);
    handleGetDataCommon(
      getCustomerClassification,
      convert,
      setCustomerClassification,
    );
  };
  const handelSave = async () => {
    try {
      const response: any = await postCustomer(
        formData,
        KEY_REQUIRED,
        userInfo.id,
      );
      if (!response?.isValid && response?.missingKeys) {
        setErrors(response.missingKeys);
        dispatch(
          setGlobalNoti({
            type: "info",
            message: "Nhập đẩy đủ dữ liệu",
          }),
        );
        return;
      }
      const IS_SUCCESS = !response?.missingKeys && response.statusCode === 200;
      let message =
        `Tạo khách hàng ` + (IS_SUCCESS ? "thành công" : "thất bại");
      let type = IS_SUCCESS ? "success" : "error";
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("email")
      ) {
        message = "Email này đã được đăng kí";
        type = "info";
      }
      if (
        response.statusCode === 409 &&
        response?.error[0]?.includes("phone_number")
      ) {
        message = "Số điện thoại này đã được đăng kí";
        type = "info";
      }
      if (IS_SUCCESS) {
        setFormData(INIT_CUSTOMER);
        setErrors([]);
        refetch();
        navigate("/admin/customer");
        handleCancel();
      }
      dispatch(
        setGlobalNoti({
          type,
          message,
        }),
      );
    } catch (err) {
      throw err;
    }
  };
  //--const :
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const { getCustomerSource } = apiCustomerSourceService();
  const { getAccount } = apiAccountService();
  const { getCustomerClassification } = apiCustomerClassificationService();
  const { postCustomer } = apiCustomerService();
  const { onClose, refetch, open } = props;
  const dispatch = useDispatch();
  const actions = {
    handelSave,
    handleCancel,
  };
  //--state :
  const [formData, setFormData] = useState(INIT_CUSTOMER);
  const [errors, setErrors] = useState<string[]>([]);
  const [account, setAccount] = useState<OptionSelect>([]);
  const [customerSource, setCustomerSource] = useState<OptionSelect>([]);
  const [customerClassification, setCustomerClassification] =
    useState<OptionSelect>([]);
  // effect :
  useEffect(() => {
    open ? initData() : setFormData(INIT_CUSTOMER);
  }, [open]);
  return (
    <>
      <HeaderModalEdit onClose={handleCancel} />
      <div className="wrapper-edit-page">
        <div className="wrapper-from">
          <MyTextField
            label="Họ và tên"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="full_name"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
          />
          <MyRadio
            options={GENDER}
            label="Giới tính"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="gender"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
          />
          <MyDatePicker
            label={"Ngày sinh"}
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="date_of_birth"
            placeholder="Chọn"
            handleChange={handleOnchangeDate}
            values={formData}
            validate={VALIDATE}
            disabled={false}
            disabledDate={disableFutureDates}
          />
          <MyTextField
            label="Số điện thoại"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="phone_number"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
          />
          <MyTextField
            label="Email"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="email"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
          />
          {/* contact_staff */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Nhân viên liên hệ"
            name="contact_staff"
            handleChange={handleOnchange}
            values={formData}
            options={account}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            type="select-multi"
          />
          {/* person_in_charge */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Nhân viên phụ trách"
            name="person_in_charge"
            handleChange={handleOnchange}
            values={formData}
            options={account}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            type="select-multi"
          />
          {/* customer_source_id */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Nguồn khách hàng"
            name="customer_source_id"
            handleChange={handleOnchange}
            values={formData}
            options={customerSource}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
          />
          {/* customer_classification_id */}
          <MySelect
            configUI={{
              width: "calc(50% - 12px)",
            }}
            label="Hạng khách hàng"
            name="customer_classification_id"
            handleChange={handleOnchange}
            values={formData}
            options={customerClassification}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
          />
          {/* address */}
          <MyTextareaAutosize
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
          />
          {/* description */}
          <MyTextareaAutosize
            label="Ghi chú về khách hàng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "100%",
            }}
            name="note"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
          />
        </div>
        <ActionsEditPage actions={actions} />
      </div>
    </>
  );
}
