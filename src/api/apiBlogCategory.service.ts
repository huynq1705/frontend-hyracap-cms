import Utils from "@/utils/utils";
import { ResponseFromServerV2, ValidationResult } from "../types/types";
import useHttpClient from "./useHttpClient";
import AppConfig from "@/common/AppConfig";
import { validateRequiredKeys } from "@/utils";
import { InitBlogCategoryKeys } from "@/constants/init-state/blog_category";

type BlogCategoryService = {
    getBlogCategory: (param?: any) => Promise<any>;
    getAllBlogCategory: (param?: any) => Promise<any>;
    postBlogCategory: (
        payload: any,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    putBlogCategory: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    deleteBlogCategory: (payload: string[]) => Promise<boolean>;
};
export default function apiBlogCategoryService(): BlogCategoryService {
    const httpClient = useHttpClient();
    const getBlogCategory = (param?: any): Promise<any> => {
        const paramRaw: any = {
            page: 1,
            take: 10,
            order_by: "id",
            order: "DESC",
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.BLOG_CATEGORY.GET_BLOG_CATEGORY(queryParams)}`
        );
    };
    const getAllBlogCategory = (param?: any): Promise<any> => {
        const paramRaw: any = {
            page: 1,
            take: 50,
            order_by: "id",
            order: "DESC",
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.BLOG_CATEGORY.GET_BLOG_CATEGORY(queryParams)}`
        );
    };
    const postBlogCategory = (
        payload: InitBlogCategoryKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload = {
            name: payload.name,
            is_public: payload.is_public ? 1 : 0,
            note: payload.note,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.BLOG_CATEGORY.END_POINT,
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
    const putBlogCategory = (
        payload: InitBlogCategoryKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload = {
            name: payload.name,
            is_public: payload.is_public ? 1 : 0,
            note: payload.note,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.BLOG_CATEGORY.END_POINT + "/" + code,
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
    const deleteBlogCategory = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.BLOG_CATEGORY.END_POINT,
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
        getBlogCategory,
        getAllBlogCategory,
        postBlogCategory,
        putBlogCategory,
        deleteBlogCategory,
    };
}
