import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadProduct, ResponseProductItem } from "@/types/product";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { InitProductKeys } from "@/constants/init-state/product";
import { validateRequiredKeys } from "@/utils";
import { formatDate, formatDateCustom } from "@/utils/date-time";
type ProductService = {
    getProduct: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseProductItem[]>>;
    postProduct: (payload: InitProductKeys, requiredKeys: string[]) => any;
    putProduct: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiProductService(): ProductService {
    const httpClient = useHttpClient();
    const getProduct = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.PRODUCT.GET_PRODUCT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postProduct = async (
        payload: InitProductKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: payload.name,
            min_invest: payload.min_invest,
            max_invest: payload.max_invest,
            total_capacity: (+payload.total_capacity).toFixed(4).toString(),
            min_duration: +payload.min_duration,
            max_duration: +payload.max_duration,
            category_id: +payload.category_id,
            interest_rate: (+payload.interest_rate).toFixed(4).toString(),
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.PRODUCT.END_POINT,
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
    const putProduct = async (
        payload: InitProductKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        console.log(
            "formatDate(payload.effective_from",
            formatDateCustom(payload.effective_from),
            payload.effective_from
        );
        const validate_payload: any = {
            name: payload.name,
            min_invest: payload.min_invest,
            max_invest: payload.max_invest,
            total_capacity: (+payload.total_capacity).toFixed(4).toString(),
            min_duration: +payload.min_duration,
            max_duration: +payload.max_duration,
            category_id: +payload.category_id,
            interest_rate: payload.interest_rate.toString(),
            effective_from: formatDateCustom(payload.effective_from),
        };

        const result = validateRequiredKeys(validate_payload, requiredKeys);
        if (!result.isValid) return result;
        const convert_payload: any = {
            name: payload.name,
            min_invest: payload.min_invest,
            max_invest: payload.max_invest,
            total_capacity: (+payload.total_capacity).toFixed(4).toString(),
            min_duration: +payload.min_duration,
            max_duration: +payload.max_duration,
            category_id: +payload.category_id,
            new_interest_rate: (+payload.interest_rate).toFixed(4).toString(),
            effective_from: formatDateCustom(payload.effective_from),
        };
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.PRODUCT.END_POINT + "/" + code,
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
        getProduct,
        postProduct,
        putProduct,
    };
}
