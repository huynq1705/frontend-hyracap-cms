import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadCustomer } from "@/types/customer";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { InitCustomerKeys } from "@/constants/init-state/customer";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import {
  PayloadPaymentMethod,
  ResponsePaymentMethodItem,
} from "@/types/payment.type";
import { InitPaymentMethodKeys } from "@/constants/init-state/payment_menthod";
type CustomerService = {
  getPaymentMethod: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponsePaymentMethodItem[]>>;
  postPaymentMethod: (
    payload: InitPaymentMethodKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<ValidationResult |boolean>;
  putPaymentMethod: (
    payload: InitPaymentMethodKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<ValidationResult |boolean>;
  setPaymentMethod: (
    payload: { id: number, default_payment : number},
  ) => Promise<boolean>;
  deleteCustomer: (payload: string[]) => Promise<boolean>;
};
export default function apiPaymentMethodService(): CustomerService {
  const httpClient = useHttpClient();
  const getPaymentMethod = (params?: any): Promise<any> => {
    const paramRaw: any = {
      page: 1,
      take: 10,
      ...params
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.PAYMENT_METHOD.GET_PAYMENT_METHOD(queryParams)}`,
    );
  };
  const postPaymentMethod = (
    payload: InitPaymentMethodKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadPaymentMethod = {
      name: payload.name?.toString().trim(),
      status : +payload.status,
      bank_id : payload.bank_id,
      name_account : payload?.name_account?.toString().trim(),
      number_account : payload?.number_account,
      default_payment : payload.default_payment

    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.PAYMENT_METHOD.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        if (res.statusCode === 409) {
          return {
            isValid: true,
            missingKeys: ["name"]
          };
        }
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putPaymentMethod = (
    payload: InitPaymentMethodKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadPaymentMethod = {
      name: payload.name?.toString().trim(),
      status : payload.status,
      bank_id: payload.bank_id,
      name_account: payload?.name_account?.toString().trim(),
      number_account: payload?.number_account,
      default_payment : payload.default_payment
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);
    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.PAYMENT_METHOD.END_POINT + "/" + payload.id,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        if (res.statusCode === 409) {
          return {
            isValid: true,
            missingKeys: ["name"]
          };
        }
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const setPaymentMethod = (
    payload: { id: number, default_payment : number},
  ) => {
   const convert_payload = {
     default_payment : payload.default_payment
   }
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.PAYMENT_METHOD.END_POINT + "/" + payload.id,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deleteCustomer = (payload: string[]) => {
    return httpClient
      .delete<ResponseFromServerV2<any>>(AppConfig.CUSTOMER.END_POINT, payload)
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getPaymentMethod,
    postPaymentMethod,
    putPaymentMethod,
    setPaymentMethod,
    deleteCustomer,
  };
}
