import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadService, ResponseServiceItem } from "@/types/service.type";
import {
  InitServiceKeys,
} from "@/constants/init-state/service";
import { PayloadPosition, ResponsePositionItem } from "@/types/position";
type PositionService = {
  getPosition: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponsePositionItem[]>>;
  postPosition: (
    payload: PayloadPosition,
    requiredKeys: string[],
  ) => ValidationResult | Promise<boolean>;
  putPosition: (
    payload: PayloadPosition,
    requiredKeys: string[],
  ) => ValidationResult | Promise<boolean>;
  deletePosition: (payload: string[]) => Promise<boolean>;
};
export default function apiPositionService(): PositionService {
  const httpClient = useHttpClient();
  const getPosition = (): Promise<any> => {
    const paramRaw: any = {
      page: 1,
      take: 999,
      // order: "DESC",
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(`${AppConfig.POSITION.GET_POSITION(queryParams)}`);
  };
  const postPosition = (payload: PayloadPosition, requiredKeys: string[]) => {
    const convert_payload: PayloadPosition = {
      name: payload.name,
      description: payload.description,
      http_method: payload.http_method,
      is_required_access_token : payload.is_required_access_token,
      pattern : payload.pattern,
      permission_name: payload.permission_name,
      should_check_permission: payload.should_check_permission
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.POSITION.END_POINT,
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
  const putPosition = (payload: PayloadPosition, requiredKeys: string[]) => {
    const convert_payload: PayloadPosition = {
      name: payload.name,
      description: payload.description,
      http_method: payload.http_method,
      is_required_access_token: payload.is_required_access_token,
      pattern: payload.pattern,
      permission_name: payload.permission_name,
      should_check_permission: payload.should_check_permission
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.POSITION.END_POINT + "/" + payload.id,
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
  const deletePosition = (payload: string[]) => {
    return httpClient
      .delete<ResponseFromServerV2<any>>(AppConfig.POSITION.END_POINT, payload)
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getPosition,
    postPosition,
    putPosition,
    deletePosition,
  };
}
