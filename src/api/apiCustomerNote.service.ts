import AppConfig from "@/common/AppConfig";
import useHttpClient, { ResultHttpClient } from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  PayloadCustomerNote,
  ResponseCustomerNoteItem,
} from "@/types/customerNote";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { InitCustomerNoteKeys } from "@/constants/init-state/customer_note";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import apiCommonService from "./apiCommon.service";

type CustomerNoteService = {
  getCustomerNote: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseCustomerNoteItem[]>>;
  submitCustomerNote: (
    payload: InitCustomerNoteKeys,
    requiredKeys: string[],
    account_id: number,
    customer_id: number,
    code: number | null,
    files: any[],
  ) => any;
};
export default function apiCustomerNoteService(): CustomerNoteService {
  const httpClient = useHttpClient();
  const { uploads } = apiCommonService();
  const getCustomerNote = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.CUSTOMER_NOTE.GET_CUSTOMER_NOTE(queryParams)}`,
    );
  };
  const submitCustomerNote = async (
    payload: InitCustomerNoteKeys,
    requiredKeys: string[],
    account_id: number,
    customer_id: number,
    code: number | null,
    files: any[],
  ) => {
    const convert_payload: PayloadCustomerNote = {
      account_id,
      customer_id,
      note: payload.note,
      img: payload.img,
    };
    if (files.length > 0) {
      try {
        const response = await uploads(
          files.map((file: any) => file?.originFileObj),
        );
        if ((response.statusCode === 200, Array.isArray(response.data))) {
          if (code && convert_payload.img)
            convert_payload.img =
              convert_payload.img + "," + response.data.join(",");
          else convert_payload.img = response.data.join(",");
        }
      } catch (err) {
        throw err;
      }
    }
    const result = validateRequiredKeys(convert_payload, requiredKeys);
    if (!result.isValid) return result;
    const url = AppConfig.CUSTOMER_NOTE.END_POINT + (code ? "/" + code : "");
    const method: keyof ResultHttpClient = code ? "put" : "post";
    return httpClient[method]<ResponseFromServerV2<any>>(
      url,
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

  return {
    getCustomerNote,
    submitCustomerNote,
  };
}
