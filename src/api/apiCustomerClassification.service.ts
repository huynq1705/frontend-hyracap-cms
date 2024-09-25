import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import AppConfig from "@/common/AppConfig";
import { validateRequiredKeys } from "@/utils";
import { ResponseCustomerClassificationItem } from "@/types/customerClassification";
import { InitCustomerClassificationKeys } from "@/constants/init-state/customer_classification";

type CustomerClassificationService = {
  getCustomerClassification: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseCustomerClassificationItem[]>>;
  postCustomerClassification: (
    payload: InitCustomerClassificationKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
  putCustomerClassification: (
    payload: any,
    code: string,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
};
export default function apiCustomerClassificationService(): CustomerClassificationService {
  const httpClient = useHttpClient();
  const getCustomerClassification = (param?: any): Promise<any> => {
    const paramRaw: any = {
      page: 1,
      take: 10,
      order_by: "id",
      ...param,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(
        `${AppConfig.CUSTOMER_CLASSIFICATION.GET_CUSTOMER_CLASSIFICATION(
          queryParams,
        )}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postCustomerClassification = (
    payload: InitCustomerClassificationKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload = {
      rank: payload.rank?.toString().trim(),
      required_amount: payload.required_amount,
      discount: 0,
      bonus: 0,
      status: payload.status,
      color_code: payload.color_code,
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER_CLASSIFICATION.END_POINT,
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
  const putCustomerClassification = (
    payload: InitCustomerClassificationKeys,
    code: string,
    requiredKeys: string[],
  ) => {
    const convert_payload = {
      rank: payload.rank?.toString().trim(),
      required_amount: payload.required_amount,
      discount: 0,
      bonus: 0,
      status: payload.status,
      color_code: payload.color_code,
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.CUSTOMER_CLASSIFICATION.END_POINT + "/" + code,
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
    getCustomerClassification,
    postCustomerClassification,
    putCustomerClassification,
  };
}
