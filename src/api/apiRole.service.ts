import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import {
    PayloadRole,
    PayloadRoleGroup,
    ResponseRoleDetailItem,
    ResponseRoleItem,
} from "@/types/role";
type RoleService = {
    getRole: (param?: any) => Promise<ResponseFromServerV1<ResponseRoleItem[]>>;
    getRoleDetail: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseRoleDetailItem>>;
    postRole: (
        payload: PayloadRoleGroup,
        requiredKeys: string[]
    ) => ValidationResult | Promise<ValidationResult | boolean>;
    putRole: (
        payload: PayloadRoleGroup,
        code: number | string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<ValidationResult | boolean>;
    deleteRole: (payload: string[]) => Promise<boolean>;
};
export default function apiRoleService(): RoleService {
    const httpClient = useHttpClient();
    const getRole = (params: any): Promise<any> => {
        const paramRaw: any = {
            take: 10,
            page: 1,
            ...params,
        };

        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(`${AppConfig.ROLE.GET_ROLE(queryParams)}`);
    };
    const getRoleDetail = (param: string): Promise<any> => {
        return httpClient.get<any>(`${AppConfig.ROLE.END_POINT}/${param}`);
    };
    const postRole = (payload: PayloadRoleGroup, requiredKeys: string[]) => {
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.ROLE_ACCOUNT.END_POINT,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                if (res.statusCode === 409) {
                    return {
                        isValid: true,
                        missingKeys: ["name"],
                    };
                }
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putRole = (
        payload: PayloadRoleGroup,
        code: number | string,
        requiredKeys: string[]
    ) => {
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.ROLE_ACCOUNT.END_POINT + "/" + code,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                if (res.statusCode === 409) {
                    return {
                        isValid: true,
                        missingKeys: ["name"],
                    };
                }
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteRole = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.ROLE.END_POINT,
                payload
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getRole,
        postRole,
        putRole,
        deleteRole,
        getRoleDetail,
    };
}
