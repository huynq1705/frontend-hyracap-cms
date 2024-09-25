import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  PayloadPrepaidCardFaceValue,
  ResponsePrepaidCardFaceValueItem,
} from "@/types/prepaidCardFaceValue";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { InitPrepaidCardFaceValueKeys } from "@/constants/init-state/prepaid_card_face_value";
type PrepaidCardFaceValueService = {
  getPrepaidCardFaceValue: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponsePrepaidCardFaceValueItem[]>>;
  postPrepaidCardFaceValue: (
    payload: InitPrepaidCardFaceValueKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
  putPrepaidCardFaceValue: (
    payload: any,
    code: string,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
};
export default function apiPrepaidCardFaceValueService(): PrepaidCardFaceValueService {
  const httpClient = useHttpClient();
  const getPrepaidCardFaceValue = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(
        `${AppConfig.PREPAID_CARD_FACE_VALUE.GET_PREPAID_CARD_FACE_VALUE(
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
  const postPrepaidCardFaceValue = (
    payload: InitPrepaidCardFaceValueKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadPrepaidCardFaceValue = {
      name: payload.name,
      denominations: payload.denominations,
      price: +payload.price,
      use_time: +payload.use_time,
      note: payload.note,
      staff_commission: +payload.staff_commission,
      staff_commission_percentage: +(
        payload.staff_commission_percentage / 100
      ).toFixed(4),
      status: payload.status ? 1 : 0,
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.PREPAID_CARD_FACE_VALUE.END_POINT,
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
  const putPrepaidCardFaceValue = (
    payload: InitPrepaidCardFaceValueKeys,
    code: string,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadPrepaidCardFaceValue = {
      name: payload.name,
      denominations: payload.denominations,
      price: +payload.price,
      use_time: +payload.use_time,
      note: payload.note,
      staff_commission: +payload.staff_commission,

      staff_commission_percentage: +(
        payload.staff_commission_percentage / 100
      ).toFixed(4),
      status: payload.status ? 1 : 0,
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.PREPAID_CARD_FACE_VALUE.END_POINT + "/" + code,
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
    getPrepaidCardFaceValue,
    postPrepaidCardFaceValue,
    putPrepaidCardFaceValue,
  };
}
