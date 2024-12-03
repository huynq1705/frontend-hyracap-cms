import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
type TransactionService = {
    getTransaction: (param?: any) => Promise<ResponseFromServerV1<any[]>>;
    postTransaction: (payload: any, requiredKeys: string[]) => any;
    putTransaction: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiTransactionService(): TransactionService {
    const httpClient = useHttpClient();
    const getTransaction = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.TRANSACTION.GET_TRANSACTION(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postTransaction = async (payload: any, requiredKeys: string[]) => {
        const convert_payload: any = {
            type: +payload.type,
            amount: +payload.amount,
            code: payload.code,
            time: new Date().toISOString().split(".")[0] + "Z",
            contract_id: +payload.contract_id,
        };

        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.TRANSACTION.END_POINT,
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
    const putTransaction = async (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
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
                AppConfig.TRANSACTION.END_POINT + "/" + code,
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
        getTransaction,
        postTransaction,
        putTransaction,
    };
}
