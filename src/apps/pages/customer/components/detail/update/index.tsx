import apiAccountService from "@/api/Account.service";
import apiCommonService from "@/api/apiCommon.service";
import apiCustomerService from "@/api/apiCustomer.service";
import ButtonCore from "@/components/button/core";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MyRadio from "@/components/input-custom-v2/radio";
import MySelect from "@/components/input-custom-v2/select";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { GENDER } from "@/constants";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import { ResponseCustomerItem } from "@/types/customer";
import { OptionSelect } from "@/types/types";
import { formatDate } from "@/utils/date-time";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import { handleGetDataCommon } from "@/utils/fetch";
export interface UpdateStepProps {}
const KEY_REQUIRED = ["full_name", "phone_number"];
const VALIDATE = {
  full_name: "",
  phone_number: "",
};
export default function UpdateStep(props: UpdateStepProps) {
  const dispatch = useDispatch();
  const { code } = useParams();
  const { pathname } = useLocation();
  const userInfo = useSelector(selectUserInfo);
  const [formData, setFormData] = useState(INIT_CUSTOMER);
  const [errors, setErrors] = useState<string[]>([]);
  const [account, setAccount] = useState<OptionSelect>([]);
  const [customerSource, setCustomerSource] = useState<OptionSelect>([]);
  const { getCustomerSource } = apiCustomerSourceService();
  const { getAccount } = apiAccountService();
  const { putCustomer } = apiCustomerService();
  const { detailCommon } = apiCommonService();
  const [isEdit, setIsEdit] = useState(false);
  // fn :
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
  const getDetail = async () => {
    if (!code) return;
    try {
      const response = await detailCommon<ResponseCustomerItem>(
        code,
        "customer",
      );
      if (response) {
        const convert_data = {
          id: response.id,
          full_name: response.full_name,
          phone_number: response.phone_number,
          email: response.email,
          gender: response.gender,
          address: response.address,
          note: response.note,
          date_of_birth: response.date_of_birth
            ? formatDate(response.date_of_birth, "YYYYMMDD")
            : null,
          total_spending: response.total_spending,
          customer_source_id: [response.customer_source?.id?.toString()],
          customer_classification_id: [
            response.customer_classification?.id?.toString(),
          ],
          account_customer: response.account_customer.map((a) =>
            a.account.id.toString(),
          ),
          contact_staff: response.account_customer
            .filter((x) => x.type === 1)
            .map((a) => a.account.id.toString()),
          person_in_charge: response.account_customer
            .filter((x) => x.type === 0)
            .map((a) => a.account.id.toString()),
        };
        setFormData(convert_data);
      }
    } catch (e) {
      throw e;
    }
  };
  const handleUpdate = async () => {
    setIsEdit(false);
    if (!code) return;
    try {
      const response = await putCustomer(
        formData,
        code,
        KEY_REQUIRED,
        userInfo.id,
      );

      dispatch(
        setGlobalNoti({
          type: response ? "success" : "error",
          message: response
            ? "Cập nhật thông tin thành công"
            : "Cập nhật thông tin thất bại",
        }),
      );
    } catch (e) {
      throw e;
    }
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
        label: item.name,
      }));
    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getCustomerSource, convert, setCustomerSource);
  };
  // effect :
  useEffect(() => {
    initData();
    getDetail();
  }, []);
  useEffect(() => {
    if (pathname.includes("edit")) setIsEdit(true);
  }, [pathname]);
  return (
    <div>
      {/* header */}
      <Box
        className="pb-4 flex justify-between items-center"
        sx={{
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        <div className="w-full sm:flex justify-between items-center gap-3 pr-2">
          <h3 className="max-sm:mb-3">Thông tin khách hàng</h3>
          {isEdit && (
            <div className="flex gap-3">
              <ButtonCore
                title="Hủy"
                type="bgWhite"
                onClick={() => setIsEdit(false)}
              />
              <ButtonCore title="Hoàn tất" onClick={handleUpdate} />
            </div>
          )}
          {!isEdit && (
            <>
              <ButtonCore
                title="Chỉnh sửa thông tin"
                type="bgWhite"
                onClick={() => setIsEdit(true)}
              />
            </>
          )}
        </div>
      </Box>
      {/* content */}
      <Box
        className="flex flex-wrap px-2 items-center mt-4"
        sx={{
          maxHeight: "calc(100vh - 380px)",
          // overflowY: "auto",
          gap: "24px",
        }}
      >
        <div className="wrapper-from">
          {/*  */}
          <MyTextField
            label="Mã khách hàng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="id"
            placeholder="Mitu-ABC"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={true}
          />
          {/* */}
          <MyTextField
            label="Họ và tên"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="full_name"
            placeholder="Nguyễn Văn A"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
          />
          {/*  */}
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
            disabled={!isEdit}
          />
          {/*  */}
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
            disabled={!isEdit}
          />
          {/*  */}
          <MyTextField
            label={"Số điện thoại"}
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="phone_number"
            placeholder="0987xxxxx"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
          />
          {/*  */}
          <MyTextField
            label="Email"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="email"
            placeholder="mituabc@gmail.com"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
          />
          {/*  */}

          {/*  */}
          <MySelect
            options={account}
            label="Nhân viên liên hệ"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="contact_staff"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
            type="select-multi"
            itemsPerPage={5}
          />
          <MySelect
            options={account}
            label="Nhân viên phụ trách"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="person_in_charge"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
            type="select-multi"
            itemsPerPage={5}
          />
          {/*  */}

          <MySelect
            options={customerSource}
            label="Nguồn khách hàng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="customer_source_id"
            handleChange={(e: any) => handleOnchange(e, true)}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
            type="select-one"
            itemsPerPage={5}
          />
          <MyTextField
            label="Ghi chú về khách hàng"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "calc(50% - 12px)",
            }}
            name="note"
            placeholder="Nhập"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={!isEdit}
          />
          {/* description */}
          {/* <MyTextareaAutosize
          label="Mô tả"
          errors={errors}
          required={KEY_REQUIRED}
          configUI={{
            width: "calc(50% - 12px)",
          }}
          name="description"
          placeholder="Mô tả"
          handleChange={handleOnchange}
          values={formData}
          validate={VALIDATE}
          disabled={!isEdit}
        // disabled={isView}
        /> */}
        </div>
      </Box>
    </div>
  );
}
