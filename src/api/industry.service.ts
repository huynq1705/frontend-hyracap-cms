import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadIndustry, ResponseIndustryItem } from "@/types/industry.type";
import { InitIndustryKeys } from "@/constants/init-state/industry";
type IndustryService = {
    getIndustry: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseIndustryItem[]>>;
    postIndustry: (payload: InitIndustryKeys, requiredKeys: string[]) => any;
    putIndustry: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiIndustryService(): IndustryService {
    const httpClient = useHttpClient();
    const getIndustry = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.INDUSTRY.GET_INDUSTRY(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postIndustry = async (
        payload: InitIndustryKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadIndustry = {
            name: payload.name,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.INDUSTRY.END_POINT,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putIndustry = async (
        payload: InitIndustryKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadIndustry = {
            name: payload.name,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.INDUSTRY.END_POINT + "/" + code,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getIndustry,
        postIndustry,
        putIndustry,
    };
}
