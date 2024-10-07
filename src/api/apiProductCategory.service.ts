import Utils from "@/utils/utils";
import { ResponseFromServerV2, ValidationResult } from "../types/types";
import useHttpClient from "./useHttpClient";
import AppConfig from "@/common/AppConfig";
import { InitProductCategoryKeys } from "@/constants/init-state/product_category";
import { validateRequiredKeys } from "@/utils";

type ProductCategoryService = {
    getProductCategory: (param?: any) => Promise<any>;
    postProductCategory: (
        payload: any,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    putProductCategory: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    deleteProductCategory: (payload: string[]) => Promise<boolean>;
};
export default function apiProductCategoryService(): ProductCategoryService {
    const httpClient = useHttpClient();
    const getProductCategory = (param?: any): Promise<any> => {
        const paramRaw: any = {
            page: 1,
            take: 10,
            order_by: "id",
            order: "DESC",
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.PRODUCT_CATEGORY.GET_PRODUCT_CATEGORY(queryParams)}`
        );
    };
    const postProductCategory = (
        payload: InitProductCategoryKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload = {
            name: payload.name,
            min_duration: +payload.min_duration,
            max_duration: +payload.max_duration,
            min_interest_rate: +(payload.min_interest_rate / 100).toFixed(4),
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.PRODUCT_CATEGORY.END_POINT,
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
    const putProductCategory = (
        payload: InitProductCategoryKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload = {
            name: payload.name,
            min_duration: +payload.min_duration,
            max_duration: +payload.max_duration,
            min_interest_rate: +(payload.min_interest_rate / 100).toFixed(4),
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.PRODUCT_CATEGORY.END_POINT + "/" + code,
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
    const deleteProductCategory = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.PRODUCT_CATEGORY.END_POINT,
                payload
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getProductCategory,
        postProductCategory,
        putProductCategory,
        deleteProductCategory,
    };
}
