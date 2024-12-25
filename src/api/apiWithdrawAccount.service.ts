import Utils from "@/utils/utils";
import { ResponseFromServerV2, ValidationResult } from "../types/types";
import useHttpClient from "./useHttpClient";
import AppConfig from "@/common/AppConfig";
import { InitProductCategoryKeys } from "@/constants/init-state/product_category";
import { validateRequiredKeys } from "@/utils";

type WithdrawAccountService = {
  getWithdrawAccount: (param?: any) => Promise<any>;
  getHyraBank: () => Promise<any>;
  putWithdrawAccount: (
    id: number,
    payload: any,
    requiredKey: string[]
  ) => any;
};
export default function apiWithdrawAccountService(): WithdrawAccountService {
  const httpClient = useHttpClient();
  const getWithdrawAccount = (param?: any): Promise<any> => {
    const paramRaw: any = {
      page: 1,
      take: 10,
      sort_by: "id",
      ...param,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.API_URL}withdrawAccount?${queryParams}`
    );
  };

  const getHyraBank = (): Promise<any> => {
    return httpClient.get<any>(`${AppConfig.API_URL}withdrawAccount/hyra-bank`);
  };

  const putWithdrawAccount = (
    id: number,
    payload: any,
    requiredKey: string[]
  ) => {
    const convert_payload: any = {
      bank: payload.bank,
      account_number: payload.account_number,
      name_on_card: payload.name_on_card,
      bank_bin: payload.bank_bin,
      bank_code: payload.bank_code,
    };
    const data = validateRequiredKeys(convert_payload, requiredKey);
    if (!data.isValid) return data;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        `${AppConfig.API_URL}withdrawAccount/${id}`,
        convert_payload
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getWithdrawAccount,
    getHyraBank,
    putWithdrawAccount,
  };
}
