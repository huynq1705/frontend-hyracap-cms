import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";

import {  PayLoadWorkSchedule, ResponseWorkScheduleItem } from "@/types/workSchedule";
type WorkScheduleService = {
    getWorkSchedule: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseWorkScheduleItem[]>>;
    postWorkSchedule: (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    putWorkSchedule: (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    deleteWorkSchedule: (payload: string[]) => Promise<boolean>;
};
export default function apiWorkScheduleService(): WorkScheduleService {
    const httpClient = useHttpClient();
    const getWorkSchedule = (params?: any): Promise<ResponseFromServerV1<ResponseWorkScheduleItem[]>> => {
        const paramRaw: any = params ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get <ResponseFromServerV1<ResponseWorkScheduleItem[]>>(
            `${AppConfig.WORK_SCHEDULE.GET_WORK_SCHEDULE(queryParams)}`,
        );
    };
    const postWorkSchedule = (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => {
      
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.WORK_SCHEDULE.END_POINT,
                payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.status;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putWorkSchedule = (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => {
       
        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.WORK_SCHEDULE.END_POINT + "/" + payload.id,
                payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteWorkSchedule = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(AppConfig.WORK_SCHEDULE.END_POINT, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getWorkSchedule,
        deleteWorkSchedule,
        postWorkSchedule,
        putWorkSchedule
    };
}
