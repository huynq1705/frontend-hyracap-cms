import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadOrder, ResponseOrderItem } from "@/types/order";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { transformDataOrder } from "@/utils/order";
type OrderService = {
  getOrder: (param?: any) => Promise<ResponseFromServerV1<ResponseOrderItem[]>>;
  saveOrder: (
    payload: any,
    code: number | null,
  ) => ValidationResult | Promise<number | null>;
  getHistoryService: (url: string) => Promise<any>;
  getDebt: (id: number) => Promise<ResponseFromServerV2<any[]>>;
  getServiceCard: (
    customer_id: number,
    type: string,
  ) => Promise<ResponseFromServerV2<any[]>>;
  postEvaluate: (
    rate_account: any[],
    rate_criteria: any[],
    note: string,
    id: number,
  ) => any;
};
export default function apiOrderService(): OrderService {
  const httpClient = useHttpClient();
  const postEvaluate = async (
    rate_account: any[],
    rate_criteria: any[],
    note: string,
    id: number,
  ) => {
    try {
      const rate_employee = httpClient.put<any>(
        `/account/account-order`,
        rate_account,
      );
      const rate_service = httpClient.post<any>(`/rate-service`, {
        rate_service: rate_criteria,
      });
      const update_note = httpClient.put<any>(`/order/note/${id}`, note);
      const response = await Promise.all([
        rate_employee,
        rate_service,
        update_note,
      ]);
      return response.every((x) => x.statusCode == 200);
    } catch (err) {}
  };
  const getOrder = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.ORDER.GET_ORDER(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getHistoryService = (url: string): Promise<any> => {
    return httpClient.get<any>(url);
  };
  const getDebt = (id: number): Promise<any> => {
    return httpClient.get<any>(`${AppConfig.ORDER.GET_ORDER("/debt/" + id)}`);
  };
  const getServiceCard = (customer_id: number, type: string): Promise<any> => {
    const url = `order-detail-information/${type}?page=1&take=999&customer_id=${customer_id}`;
    return httpClient.get<any>(url);
  };
  const saveOrder = (payload: any, code: number | null) => {
    const convert_payload = transformDataOrder(payload, code);
    if (code)
      return httpClient
        .put<ResponseFromServerV2<any>>(
          AppConfig.ORDER.END_POINT + "/" + code,
          convert_payload,
          {},
        )
        .then((res: ResponseFromServerV2<any>) => {
          return res && res.statusCode === 200 ? res.data?.id ?? 0 : null;
        })
        .catch((err) => {
          throw err;
        });
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.ORDER.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res && res.statusCode === 200 ? res.data?.id ?? 0 : null;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getOrder,
    saveOrder,
    getHistoryService,
    getDebt,
    getServiceCard,
    postEvaluate,
  };
}
