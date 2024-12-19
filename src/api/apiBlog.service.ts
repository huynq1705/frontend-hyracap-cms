import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import {
    PayloadAccount,
    PayloadAccountPass,
    ResponseAccountItem,
    ResponseTotal,
} from "@/types/account.type";
import { InitCustomerKeys } from "@/constants/init-state/employee";
import apiCommonService from "./apiCommon.service";
import { ResponseBlogItem } from "@/types/blog.type";
import { InitBlogKeys } from "@/constants/init-state/blog";
const exist = ["phone", "email", "username"];
type BlogService = {
    getBlog: (param?: any) => Promise<ResponseFromServerV1<ResponseBlogItem[]>>;
    getBlogDetail: (param?: any) => Promise<ResponseFromServerV1<InitBlogKeys>>;
    postBlog: (
        payload: any,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
    putBlog: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<any>;
};
export default function apiBlogService(): BlogService {
    const httpClient = useHttpClient();
    const { uploads } = apiCommonService();
    const getBlog = (param?: any): Promise<any> => {
        const paramRaw: any = {
            take: 10,
            page: 1,
            order_by: "id",
            ...param,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(`${AppConfig.BLOG.GET_BLOG(queryParams)}`);
    };
    const getBlogDetail = (param: string): Promise<any> => {
        return httpClient.get<InitBlogKeys>(
            `${AppConfig.BLOG.END_POINT}/${param}`
        );
    };
    const putBlog = (
        payload: InitBlogKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            ...payload,
            is_public: payload.is_public ? 1 : 0,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.BLOG.END_POINT + "/" + code,
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
    const postBlog = (payload: InitBlogKeys, requiredKeys: string[]) => {
        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.BLOG.END_POINT,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    // const postBlogResetPass = (code: number) => {
    //     return httpClient
    //         .post<ResponseFromServerV2<any>>(
    //             AppConfig.ACCOUNT.END_POINT +
    //                 AppConfig.ACCOUNT.RESET_PASS +
    //                 "/" +
    //                 code,
    //             {}
    //         )
    //         .then((res: ResponseFromServerV2<any>) => {
    //             return res.statusCode === 200;
    //         })
    //         .catch((err) => {
    //             throw err;
    //         });
    // };
    // const putAccountChangPass = (
    //     payload: PayloadAccountPass,
    //     code: number,
    //     requiredKeys: string[]
    // ) => {
    //     const result = validateRequiredKeys(payload, requiredKeys);
    //     if (!result.isValid) return result;

    //     if (
    //         payload.old_password &&
    //         payload.old_password.length >= 8 &&
    //         payload.old_password.length <= 20 &&
    //         /\d/.test(payload.old_password) &&
    //         /[A-Z]/.test(payload.old_password) &&
    //         /[a-z]/.test(payload.old_password) &&
    //         /[!@#$%^&*(),.?":{}|<>]/.test(payload.old_password)
    //     ) {
    //         console.log("Password hợp lệ");
    //     } else {
    //         console.log("Password không hợp lệ");

    //         return {
    //             isValid: true,
    //             missingKeys: ["password"],
    //         };
    //     }
    //     if (payload.old_password !== payload.new_password)
    //         return {
    //             isValid: false,
    //             missingKeys: ["password_config"],
    //         };
    //     return httpClient
    //         .put<ResponseFromServerV2<any>>(
    //             AppConfig.ACCOUNT.END_POINT +
    //                 AppConfig.ACCOUNT.CHANGE_PASS +
    //                 "/" +
    //                 code,
    //             payload,
    //             {}
    //         )
    //         .then((res: ResponseFromServerV2<any>) => {
    //             return res.statusCode === 200;
    //         })
    //         .catch((err) => {
    //             throw err;
    //         });
    // };
    // const deleteCustomer = (payload: string[]) => {
    //     return httpClient
    //         .delete<ResponseFromServerV2<any>>(
    //             AppConfig.CUSTOMER.END_POINT,
    //             payload
    //         )
    //         .then((res: ResponseFromServerV2<any>) => {
    //             return res.statusCode === 200;
    //         })
    //         .catch((err) => {
    //             throw err;
    //         });
    // };
    return {
        getBlog,
        postBlog,
        putBlog,
        // putAccountChangPass,
        // postBlogResetPass,
        // deleteCustomer,
        getBlogDetail,
        // getAccountTotal,
    };
}
