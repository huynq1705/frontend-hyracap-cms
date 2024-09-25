import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import RowCard from "../row-card";
import { OptionSelect } from "@/types/types";
import apiAccountService from "@/api/Account.service";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import MySelect from "@/components/input-custom-v2/select";
import { INIT_CUSTOMER } from "@/constants/init-state/customer";
import { REPORT_REVENUE } from "@/constants/init-state/report_revenue";
import { handleGetDataCommon } from "@/utils/fetch";
import apiPaymentMethodsService from "@/api/apiPaymentMethods.service";
import _ from "lodash";
import { useSearchParams } from "react-router-dom";
import { convertStringToArray, getFormattedMonthFromNumber } from "@/utils";
import { handleGetParam } from "@/utils/filter";
export interface BoxCardProps {
  title: string;
  existDetail: boolean;
  data: {
    title: string;
    title_detail?: string;
    dataRowCard: {
      label: string;
      value: string | undefined;
      color: string;
    }[];
    fn?: (...args: any) => void;
  }[];
  my_select?: boolean

}
const VALIDATE = {
  // full_name: "Vui lòng nhập họ tên",
  // email: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  // phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  // contact_staff_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  // staff_in_charge_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
  // customer_source_id: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
export default function BoxCard(props: BoxCardProps) {
  const { title, existDetail, data, my_select } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAccount } = apiAccountService();
  const { getCustomerSource } = apiCustomerSourceService();
  const { getPaymentMethods } = apiPaymentMethodsService();
  const [formData, setFormData] = React.useState(REPORT_REVENUE);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [account, setAccount] = React.useState<OptionSelect>([]);
  const [customerSource, setCustomerSource] = React.useState<OptionSelect>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<any[]>([]);
  const [customerClassification, setCustomerClassification] = React.useState<OptionSelect>([]);

  const handleGetParam = () => {
    const params: any = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;

    if (!params["month"]) params["month"] = month;
    // if (!params["page"]) params["page"] = 1;
    // if (!params["limit"]) params["limit"] = 10;
    return params;
  };
  const param_payload = React.useMemo(() => {
    return handleGetParam();
  }, [searchParams]);
  const initData = () => {
    const convert_account = (data: any) => {
      if (!Array.isArray(data)) return [];
      const accounts = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.full_name,
      }));
      const all_account = [{ value: "0", label: "Tất cả" }, ...accounts];
      // setFormData((prev) => ({ ...prev, ["person_in_charge"]: all_account.map((item) => item.value), }));
      // setFormData((prev) => ({ ...prev, ["contact_staff"]: all_account.map((item) => item.value), }));
      return all_account
    };
    const convert_customer_source = (data: any) => {
      if (!Array.isArray(data)) return [];
      const data_convert = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      const all_data_convert = [{ value: "0", label: "Tất cả" }, ...data_convert];
      // setFormData((prev) => ({ ...prev, ["customer_source"]: all_data_convert.map((item) => item.value), }));
      return all_data_convert

    };
    const convert_payment_method = (data: any) => {
      if (!Array.isArray(data)) return [];
      const data_convert = data.map((item: any) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      const all_data_convert = [{ value: "0", label: "Tất cả" }, ...data_convert];
      // setFormData((prev) => ({ ...prev, ["payment_method"]: all_data_convert.map((item) => item.value) }));
      return all_data_convert

    };
    handleGetDataCommon(getAccount, convert_account, setAccount);
    handleGetDataCommon(getCustomerSource, convert_customer_source, setCustomerSource);
    handleGetDataCommon(getPaymentMethods, convert_payment_method, setPaymentMethods,);
  };

  React.useEffect(() => {
    initData();

  }, [title]);
  React.useEffect(() => {
    let executor_staff_id: any = []
    let contact_staff_id: any = []
    let customer_source_id: any = []
    let payment_method_id: any = []
    const date = new Date(formData.month);
    const month = date.getMonth() + 1;

    // const formattedMonth = param_payload?.month ? getFormattedMonthFromNumber(param_payload.month) : month;

    if (account.length > 0) {
      executor_staff_id = param_payload?.executor_staff_id ?
        convertStringToArray(param_payload.executor_staff_id) :
        account?.map(item => item.value);
    }
    if (account.length > 0) {
      contact_staff_id = param_payload?.contact_staff_id ?
        convertStringToArray(param_payload.contact_staff_id) :
        account?.map(item => item.value);
    }
    if (customerSource.length > 0) {
      customer_source_id = param_payload?.customer_source_id ?
        convertStringToArray(param_payload.customer_source_id) :
        customerSource?.map(item => item.value);
    }
    if (paymentMethods.length > 0) {
      payment_method_id = param_payload?.payment_method_id ?
        convertStringToArray(param_payload.payment_method_id) :
        paymentMethods?.map(item => item.value);
    }
    setFormData(prev => ({
      ...prev,
      // month: formattedMonth,
      person_in_charge: executor_staff_id,
      contact_staff: contact_staff_id,
      customer_source: customer_source_id,
      payment_method: payment_method_id
    }))
  }, [param_payload, account, customerSource, paymentMethods])

  const handleOnchange = (e: any, isSelectOne?: boolean) => {
    if (!e.target) return;
    const { name, value } = e.target;

    if (name === "person_in_charge") {
      const option = account;
      const old_value = formData["person_in_charge"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("executor_staff_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "contact_staff") {
      const option = account;
      const old_value = formData["contact_staff"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("contact_staff_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "customer_source") {
      const option = customerSource;
      const old_value = formData["customer_source"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("customer_source_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    if (name === "payment_method") {
      const option = paymentMethods;
      const old_value = formData["payment_method"];
      const item_click = _.xor(old_value, value)[0];
      let new_value = value;
      let new_value_params = value
      if (item_click == "0" && old_value.length === option.length) {
        new_value = [];
        new_value_params = ["-1"];
      }
      if (item_click == "0" && old_value.length !== option.length) {
        new_value = option.map((x) => x.value);
        new_value_params = [];
      }
      if (item_click != "0") {
        new_value = value.filter((x: any) => x != "0" && x != "-1");
        new_value_params = value.filter((x: any) => x != "0" && x != "-1");
      }

      searchParams.set("payment_method_id", new_value_params);
      setSearchParams(searchParams);
      setFormData((prev) => ({ ...prev, [name]: new_value }));
      return
    }
    let convert_value = value;
    setFormData((prev) => ({ ...prev, [name]: convert_value }));
  };
  return (
    <div
      className="px-4 py-5 rounded-xl"
      style={{
        border: "1px solid #D0D5DD",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-2 w-full">
        <b className="text-[18px]">{title}</b>
        {existDetail && (
          <>
            <div className="!w-[2px] h-5 bg-[#D0D5DD]"></div>
            <span className="text-[var(--text-color-primary)] text-sm cursor-pointer">
              Lịch sử sử dụng thẻ
              <FontAwesomeIcon
                icon={faAngleRight}
                className="ml-2 inline-block h-[14px]"
              />
            </span>
          </>
        )}
      </div>
      {my_select &&
        <div className="wrapper-from flex items-start gap-4 self-stretch my-4">
          <MySelect
            configUI={{
              width: "calc(25% - 12px)",
            }}
            label="Nhân viên phụ trách"
            name="person_in_charge"
            handleChange={handleOnchange}
            values={formData}
            options={account}
            errors={errors}
            validate={VALIDATE}
            itemsPerPage={5}
            type="select-multi"
          />
          <MySelect
            configUI={{
              width: "calc(25% - 12px)",
            }}
            label="Nhân viên liên hệ"
            name="contact_staff"
            handleChange={handleOnchange}
            values={formData}
            options={account}
            errors={errors}
            validate={VALIDATE}
            itemsPerPage={5}
            type="select-multi"
          />
          <MySelect
            configUI={{
              width: "calc(25% - 12px)",
            }}
            label="Nguồn khách hàng"
            name="customer_source"
            handleChange={handleOnchange}
            values={formData}
            options={customerSource}
            errors={errors}
            validate={VALIDATE}
            itemsPerPage={5}
            type="select-multi"
          />
          <MySelect
            configUI={{
              width: "calc(25% - 12px)",
            }}
            label="Phương thức thanh toán"
            name="payment_method"
            handleChange={handleOnchange}
            values={formData}
            options={paymentMethods}
            errors={errors}
            validate={VALIDATE}
            itemsPerPage={5}
            type="select-multi"
          />
        </div>
      }
      {/* content */}
      <div className="flex gap-4 items-start flex-wrap mt-3">
        {data.map((it,index) => (
          <RowCard
            key={index}
            data={it.dataRowCard}
            title={it.title}
            title_detail={it.title_detail}
            fn={it.fn}
          />
        ))}
      </div>
    </div>
  );
}
