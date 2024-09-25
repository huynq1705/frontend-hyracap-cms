import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";

type AccountOrderService = {
  getAccountOrder: (param?: any) => Promise<ResponseFromServerV1<any[]>>;
  getEvaluation: (order_id: number) => Promise<any>;
  postEvaluation: (payload: any) => Promise<any>;
};
export default function apiAccountOrderService(): AccountOrderService {
  const httpClient = useHttpClient();
  const getAccountOrder = (param?: any): Promise<any> => {
    const paramRaw: any = {
      order_by: "updated_at",
      page: 1,
      take: 10,
      ...param,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.ACCOUNT_ORDER.GET_ACCOUNT_ORDER(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getEvaluation = (order_id: number) => {
    return httpClient
      .get<any>(
        `${AppConfig.ACCOUNT_ORDER.GET_ACCOUNT_ORDER(
          "/evaluation?order_id=",
        )}${order_id}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postEvaluation = (payload: any) => {
    return httpClient
      .post<any>(`${"/account/account-order"}`, payload)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getAccountOrder,
    getEvaluation,
    postEvaluation,
  };
}
