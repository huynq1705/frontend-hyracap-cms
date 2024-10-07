import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1 } from "@/types/types";
import { ResponseHistoryItem } from "@/types/historry.type";
type HistoryService = {
    getHistory: (
        code: string,
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseHistoryItem[]>>;
};
export default function apiHistoryService(): HistoryService {
    const httpClient = useHttpClient();
    const getHistory = (code: string, param?: any): Promise<any> => {
        const paramRaw: any = {
            page: 1,
            take: 10,
            order_by: "id",
            order: "DESC",
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${
                    AppConfig.HISTORY.GET_HISTORY(queryParams) +
                    "&product_id__eq=" +
                    code
                }`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getHistory,
    };
}
