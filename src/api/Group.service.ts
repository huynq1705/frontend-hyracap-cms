import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
type GroupService = {
    getGroup: (param?: any) => Promise<ResponseFromServerV1<any>>;
    postGroup: (payload: any, requiredKeys: string[]) => any;
    putGroup: (payload: any, code: string, requiredKeys: string[]) => any;
    deleteGroupMember: (payload: any) => any;
    postGroupMember: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => any;
};
export default function apiGroupService(): GroupService {
    const httpClient = useHttpClient();
    const getGroup = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.GROUP.GET_GROUP(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postGroup = async (payload: any, requiredKeys: string[]) => {
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.GROUP.END_POINT,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putGroup = async (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => {
        const validate_payload = {
            name: payload.name,
        };
        const convert_payload = {
            name: payload.name,
        };
        console.log("convert_payload", convert_payload);

        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.GROUP.END_POINT + "/" + code,
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
    const postGroupMember = async (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => {
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.GROUP_MEMBER.END_POINT,
                payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteGroupMember = async (payload: any) => {
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.GROUP.END_POINT + "/members",
                payload,
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
        getGroup,
        postGroup,
        putGroup,
        postGroupMember,
        deleteGroupMember,
    };
}
