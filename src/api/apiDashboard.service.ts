import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadStaff, ResponseStaffItem } from "@/types/staff.type";
import { InitStaffKeys } from "@/constants/init-state/staff";
type StaffService = {
    getStatisticCapital: (param?: any) => Promise<any>;
    getStatisticGroup: (param?: any) => Promise<any>;
    getStatisticStaff: (param?: any) => Promise<any>;
};
export default function apiDashboardService(): StaffService {
    const httpClient = useHttpClient();
    const getStatisticCapital = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${AppConfig.DASHBOARD.GET_DASHBOARD_CAPITAL(queryParams)}`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const getStatisticGroup = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.DASHBOARD.GET_DASHBOARD_GROUP(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const getStatisticStaff = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.DASHBOARD.GET_DASHBOARD_STAFF(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getStatisticCapital,
        getStatisticGroup,
        getStatisticStaff,
    };
}
