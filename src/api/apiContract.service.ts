import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadContract, ResponseContractItem } from "@/types/contract";
import { InitContractKeys } from "@/constants/init-state/contract";
type ContractService = {
    getContract: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseContractItem[]>>;
    postContract: (payload: InitContractKeys, requiredKeys: string[]) => any;
    putContract: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiContractService(): ContractService {
    const httpClient = useHttpClient();
    const getContract = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.CONTRACT.GET_CONTRACT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postContract = async (
        payload: InitContractKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadContract = {
            capital: payload.capital,
            duration: payload.duration,
            product_id: payload.product_id,
            user_sub: payload.user_sub,
        };
        console.log("convert_payload", convert_payload);
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.CONTRACT.END_POINT,
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
    const putContract = async (
        payload: InitContractKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadContract = {
            capital: payload.capital,
            duration: payload.duration,
            product_id: payload.product_id,
            user_sub: payload.user_sub,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.CONTRACT.END_POINT + "/" + code,
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
        getContract,
        postContract,
        putContract,
    };
}
