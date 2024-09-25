import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import {
  PayloadCustomerSource,
  ResponseCustomerSourceItem,
} from "@/types/customerSource";
import { InitCustomerSourceKeys } from "@/constants/init-state/customer_source";
import { validateRequiredKeys } from "@/utils";
type CustomerSourceService = {
  getCustomerSource: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseCustomerSourceItem[]>>;
  postCustomerSource: (
    payload: InitCustomerSourceKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<ValidationResult | boolean>;
  putCustomerSource: (
    payload: any,
    requiredKeys: string[],
  ) => ValidationResult | Promise<ValidationResult | boolean> ;
  deleteCustomerSource: (payload: string[]) => Promise<boolean>;
};
export default function apiCustomerSourceService(): CustomerSourceService {
  const httpClient = useHttpClient();
  const getCustomerSource = (params?: any): Promise<any> => {
    const paramRaw: any =  {
      page: 1,
      take: 10,
      order_by:"updated_at",
      ...params
      // filter_str: "",
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.CUSTOMER_SOURCE.GET_CUSTOMER_SOURCE(queryParams)}`,
    );
  };
  const postCustomerSource = (
    payload: InitCustomerSourceKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadCustomerSource = {
      name: payload.name?.toString().trim(),
      status:payload.status
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER_SOURCE.END_POINT,
        convert_payload,
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
  const putCustomerSource = (payload: InitCustomerSourceKeys, requiredKeys: string[] ) => {
    const convert_payload: PayloadCustomerSource = {
      name: payload.name?.toString().trim(),
      status: payload.status
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);
    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER_SOURCE.END_POINT + "/" + payload.id,
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
  const deleteCustomerSource = (payload: string[]) => {
    return httpClient
      .delete<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER_SOURCE.END_POINT,
        payload,
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getCustomerSource,
    postCustomerSource,
    putCustomerSource,
    deleteCustomerSource,
  };
}
