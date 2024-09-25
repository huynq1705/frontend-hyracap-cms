import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";

import { PayLoadWorkSchedule, ResponseWorkScheduleItem } from "@/types/workSchedule";
import { PayLoadStaffSalary, ResponseStaffSalaryItem } from "@/types/StaffSalary";
type StaffSalaryService = {
    getStaffSalary: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseStaffSalaryItem[]>>;
  
    postStaffSalary: (
        payload: PayLoadStaffSalary,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    putStaffSalary: (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    deleteStaffSalary: (payload: string[]) => Promise<boolean>;
};
export default function apiStaffSalaryService(): StaffSalaryService {
    const httpClient = useHttpClient();
    const getStaffSalary = (params?: any): Promise<ResponseFromServerV1<ResponseStaffSalaryItem[]>> => {
        const paramRaw: any = {
            take: 12,
            page: 1,
            order_by:"month",
            ...params,
            // order_by: "date"
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ResponseStaffSalaryItem[]>>(
            `${AppConfig.STAFF_SALARY.GET_STAFF_SALARY(queryParams)}`,
        );
    };

    const postStaffSalary = (
        payload: PayLoadStaffSalary,
        requiredKeys: string[],
    ) => {

        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.STAFF_SALARY.END_POINT,
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
    const putStaffSalary = (
        payload: PayLoadWorkSchedule,
        requiredKeys: string[],
    ) => {

        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.STAFF_SALARY.END_POINT + "/" + payload.id,
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
    const deleteStaffSalary = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(AppConfig.STAFF_SALARY.END_POINT, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getStaffSalary,
        putStaffSalary,
        postStaffSalary,
        deleteStaffSalary
    };
}
