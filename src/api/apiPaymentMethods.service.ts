import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";

type PaymentMethodsService = {
  getPaymentMethods: (param?: any) => Promise<ResponseFromServerV1<any[]>>;
};
export default function apiPaymentMethodsService(): PaymentMethodsService {
  const httpClient = useHttpClient();
  const getPaymentMethods = (param?: any): Promise<any> => {
    const paramRaw: any = {
      order_by: "updated_at",
      ...param
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.PAYMENT_METHODS.GET_PAYMENT_METHODS(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getPaymentMethods,
  };
}
