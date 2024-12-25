import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import apiCommonService from "./apiCommon.service";
import { InitBlogKeys } from "@/constants/init-state/blog";
import { ResponseManualItem } from "@/types/manual.type copy";
import { InitManualKeys } from "@/constants/init-state/manual";
const exist = ["phone", "email", "username"];
type ManualService = {
    getManual: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseManualItem[]>>;
    getManualDetail: (
        param?: any
    ) => Promise<ResponseFromServerV1<InitManualKeys>>;
    postManual: (
        payload: any,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    putManual: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
};
export default function apiManualService(): ManualService {
    const httpClient = useHttpClient();
    const { uploads } = apiCommonService();
    const getManual = (param?: any): Promise<any> => {
        const paramRaw: any = {
            take: 10,
            page: 1,
            order_by: "id",
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.MANUAL.GET_MANUAL(queryParams)}`
        );
    };
    const getManualDetail = (param: string): Promise<any> => {
        return httpClient.get<InitManualKeys>(
            `${AppConfig.MANUAL.END_POINT}/${param}`
        );
    };
    const putManual = (
        payload: InitManualKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            ...payload,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.MANUAL.END_POINT + "/" + code,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postManual = (payload: InitManualKeys, requiredKeys: string[]) => {
        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.MANUAL.END_POINT,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getManual,
        postManual,
        putManual,
        getManualDetail,
    };
}
