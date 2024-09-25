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
import { PayLoadGetCommissions, ResponseCommissionsItem } from "@/types/commissions";
type CommissionsService = {
    getCommissions: (
        param: PayLoadGetCommissions,
    ) => Promise<ResponseFromServerV1<ResponseCommissionsItem>>;
    getTotalCommissions: (
        id: number,
        month ?: string
    ) => Promise<ResponseFromServerV1<number>>;
};
export default function apiCommissionsService(): CommissionsService {
    const httpClient = useHttpClient();
    const getCommissions = (params: PayLoadGetCommissions): Promise<ResponseFromServerV1<ResponseCommissionsItem>> => {
        const paramRaw : any = {
            limit: params.limit || 10,
            page: params.page || 1,
            sortBy: params.sortBy || "created_at",
            sortOrder: params.sortBy || "ASC",
            from: params.from ||"",
            to: params.to || "",
            staff_id : params.staff_id
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ResponseCommissionsItem>>(
            `${AppConfig.COMMISSION.GET_COMMISSION(queryParams)}`,
        );
    };
    const getTotalCommissions = (id : number , month ?: string): Promise<ResponseFromServerV1<number>> => {
        const paramRaw: any = {
            month: month || "",
            staff_id : id
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<number>>(
            `${AppConfig.COMMISSION.GET_TOTAL_COMMISSION(queryParams)}`,
        );
    };
    return {
        getCommissions,
        getTotalCommissions
    };
}
