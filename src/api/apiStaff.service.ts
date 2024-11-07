import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadStaff, ResponseStaffItem } from "@/types/staff.type";
import { InitStaffKeys } from "@/constants/init-state/staff";
type StaffService = {
    getStaff: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseStaffItem[]>>;
    postStaff: (payload: InitStaffKeys, requiredKeys: string[]) => any;
    putStaff: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiStaffService(): StaffService {
    const httpClient = useHttpClient();
    const getStaff = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.STAFF.GET_STAFF(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postStaff = async (
        payload: InitStaffKeys,
        requiredKeys: string[]
    ) => {
        const new_payload = {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            role_id: +payload.role_id,
            current_staff_position: +payload.current_staff_position,
        };
        const result = validateRequiredKeys(new_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        const convert_payload = {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            role_id: null,
            staff_position: {
                position_id: +payload.current_staff_position,
            },
        };
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.STAFF.END_POINT,
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
    const putStaff = async (
        payload: InitStaffKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const new_payload = {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone: payload.phone,
            password: payload.password,
            role_id: +payload.role_id,
            current_staff_position: +payload.current_staff_position,
        };

        const result = validateRequiredKeys(new_payload, requiredKeys);
        if (!result.isValid) return result;
        const convert_payload = {
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            phone: payload.phone,
            role_id: null,
            staff_position: {
                position_id: +payload.current_staff_position,
            },
        };
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.STAFF.END_POINT + "/" + code,
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
        getStaff,
        postStaff,
        putStaff,
    };
}
