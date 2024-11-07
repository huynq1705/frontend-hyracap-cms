import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { ResponseGroupSaleHistoryItem } from "@/types/groupSaleHistory";
type GroupSaleHistoryService = {
    getGroupSaleHistory: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseGroupSaleHistoryItem[]>>;
};
export default function apiGroupSaleHistoryService(): GroupSaleHistoryService {
    const httpClient = useHttpClient();
    const getGroupSaleHistory = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${AppConfig.GROUP_SALE_HISTORY.GET_GROUP_SALE_HISTORY(
                    queryParams
                )}`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getGroupSaleHistory,
    };
}
