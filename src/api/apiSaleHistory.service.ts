import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { ResponseSaleHistoryItem } from "@/types/saleHistory.type";
type SaleHistoryService = {
    getSaleHistory: (
        param?: any,
        date?: any
    ) => Promise<ResponseFromServerV1<ResponseSaleHistoryItem[]>>;
};
export default function apiSaleHistoryService(): SaleHistoryService {
    const httpClient = useHttpClient();
    const getSaleHistory = (param?: any, date?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${AppConfig.SALE_HISTORY.GET_SALE_HISTORY(
                    queryParams
                )}&month__eq=${date}`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getSaleHistory,
    };
}
