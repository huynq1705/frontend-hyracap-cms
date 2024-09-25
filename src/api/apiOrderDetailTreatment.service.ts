import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1 } from "@/types/types";
import { ResponseOrderDetailTreatmentItem } from "@/types/orderDetailTreatment";
type OrderDetailTreatmentService = {
    getOrderDetailTreatment: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseOrderDetailTreatmentItem[]>>;
};
export default function apiOrderDetailTreatment(): OrderDetailTreatmentService {
    const httpClient = useHttpClient();
    const getOrderDetailTreatment = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            page_size: 20,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${AppConfig.ORDER_DETAIL_TREATMENT.GET_ORDER_DETAIL_TREATMENT(
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
        getOrderDetailTreatment,
    };
}
