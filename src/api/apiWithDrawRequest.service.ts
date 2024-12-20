import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
type WithdrawRequestService = {
    getWithdrawRequest: (param?: any) => Promise<ResponseFromServerV1<any[]>>;
};
export default function apiWithdrawRequestService(): WithdrawRequestService {
    const httpClient = useHttpClient();
    const getWithdrawRequest = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.WITHDRAW.GET_WITHDRAW(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getWithdrawRequest,
    };
}
