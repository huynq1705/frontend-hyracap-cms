import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { ResponseProjectItem } from "@/types/project.type";
import { InitProjectKeys } from "@/constants/init-state/project";
type ProjectService = {
    getProject: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseProjectItem[]>>;
    postProject: (payload: InitProjectKeys, requiredKeys: string[]) => any;
    putProject: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiProjectService(): ProjectService {
    const httpClient = useHttpClient();
    const getProject = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.PROJECT.GET_PROJECT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postProject = async (
        payload: InitProjectKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: payload.name,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.PROJECT.END_POINT,
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
    const putProject = async (
        payload: InitProjectKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: payload.name,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.PROJECT.END_POINT + "/" + code,
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
        getProject,
        postProject,
        putProject,
    };
}
