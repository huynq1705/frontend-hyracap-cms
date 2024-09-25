import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  PayloadCustomer,
  ResponseCustomerItem,
  ServiceHistory,
} from "@/types/customer";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { InitCustomerKeys } from "@/constants/init-state/customer";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";

type CustomerService = {
  getCustomer: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseCustomerItem[]>>;
  postCustomer: (
    payload: InitCustomerKeys,
    requiredKeys: string[],
    account_id: number,
  ) => ValidationResult | Promise<any>;
  postCustomerOrder: (
    payload: { full_name: string; phone_number: string; date_of_birth: string },
    requiredKeys: string[],
    account_id?: number,
  ) => any;
  putCustomer: (
    payload: any,
    code: string,
    requiredKeys: string[],
    account_id: number,
  ) => ValidationResult | Promise<any>;
};
export default function apiCustomerService(): CustomerService {
  const httpClient = useHttpClient();
  const getCustomer = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 20,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.CUSTOMER.GET_CUSTOMER(queryParams)}`,
    );
  };
  const postCustomerOrder = (
    payload: {
      full_name: string;
      phone_number: string;
      date_of_birth: string;
    },
    requiredKeys: string[],
    account_id?: number,
  ) => {
    const convert_payload: any = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: null,
      gender: 1,
      address: "",
      note: "",
      date_of_birth: payload.date_of_birth
        ? formatDate(payload.date_of_birth, "YYYYMMDD")
        : null,
      total_spending: 0,
      customer_source_id: null,
      customer_classification_id: [],
      account_customer: account_id
        ? [
            {
              name: "Nhân viên phụ trách",
              type: 0,
              account_id,
              customer_id: 1,
            },
          ]
        : [],
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postCustomer = (payload: InitCustomerKeys, requiredKeys: string[]) => {
    const customer_id = 1;
    console.log("payload:", payload);
    const contact_staff_convert = payload.contact_staff.map((it: any) => ({
      name: "nhân viên liên hệ",
      type: 1,
      account_id: +it,
      customer_id,
    }));
    const person_in_charge_convert = payload.person_in_charge.map(
      (it: any) => ({
        name: "Nhân viên phụ trách",
        type: 0,
        account_id: +it,
        customer_id,
      }),
    );
    const convert_payload: any = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      gender: 1,
      address: payload.address,
      note: payload.note,
      date_of_birth: formatDate(payload.date_of_birth, "YYYYMMDD"),
      total_spending: payload.total_spending,
      customer_source_id: +payload.customer_source_id,
      customer_classification_id:
        +payload.customer_classification_id != 0
          ? +payload.customer_classification_id
          : null,
      account_customer: contact_staff_convert?.concat(person_in_charge_convert),
    };

    const result = validateRequiredKeys(payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putCustomer = (
    payload: InitCustomerKeys,
    code: string,
    requiredKeys: string[],
  ) => {
    const customer_id = code;
    const contact_staff_convert = payload.contact_staff.map((it: any) => ({
      name: "nhân viên liên hệ",
      type: 1,
      account_id: +it,
      customer_id,
    }));
    const person_in_charge_convert = payload.person_in_charge.map(
      (it: any) => ({
        name: "Nhân viên phụ trách",
        type: 0,
        account_id: +it,
        customer_id,
      }),
    );
    const convert_payload: any = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      gender: payload.gender,
      address: payload.address,
      note: payload.note,
      date_of_birth: formatDate(payload.date_of_birth, "YYYYMMDD"),
      total_spending: payload.total_spending,
      customer_source_id: +payload.customer_source_id,
      customer_classification_id: +payload.customer_classification_id,
      account_customer: contact_staff_convert?.concat(person_in_charge_convert),
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER.END_POINT + "/" + code,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getCustomer,
    postCustomer,
    putCustomer,
    postCustomerOrder,
  };
}
