import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    PayloadAppointmentStatus,
    ResponseAppointmentStatusItem,
} from "@/types/appointmentStatus";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { InitAppointmentStatusKeys } from "@/constants/init-state/appointment_status";
import { validateRequiredKeys } from "@/utils";
type AppointmentStatusService = {
    getAppointmentStatus: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseAppointmentStatusItem[]>>;
    postAppointmentStatus: (payload: any) => Promise<any>;
    putAppointmentStatus: (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<boolean>;
    deleteAppointmentStatus: (payload: string[]) => Promise<boolean>;
};
export default function apiAppointmentStatusService(): AppointmentStatusService {
    const httpClient = useHttpClient();
    const getAppointmentStatus = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 20,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${
                    AppConfig.APPOINTMENT_STATUS.END_POINT +
                    `?order=ASC&` +
                    `page=` +
                    `${paramRaw.page}` +
                    `&take=` +
                    `${paramRaw.take}`
                }`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postAppointmentStatus = (payload: any) => {
        const convert_payload = { list_status_schedule: payload };

        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.APPOINTMENT_STATUS.END_POINT,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putAppointmentStatus = (
        payload: InitAppointmentStatusKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadAppointmentStatus = {
            name: payload.name,
            color: payload.color,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        console.log("convert_payload", convert_payload);
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.APPOINTMENT_STATUS.END_POINT + "/" + code,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteAppointmentStatus = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.APPOINTMENT_STATUS.END_POINT,
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
        getAppointmentStatus,
        postAppointmentStatus,
        putAppointmentStatus,
        deleteAppointmentStatus,
    };
}
