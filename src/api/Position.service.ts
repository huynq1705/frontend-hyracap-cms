import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { InitPositionKeys } from "@/constants/init-state/position";
import { PayloadPosition, ResponsePositionItem } from "@/types/position.type";
type PositionService = {
    getPosition: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponsePositionItem[]>>;
    postPosition: (payload: InitPositionKeys, requiredKeys: string[]) => any;
    putPosition: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiPositionService(): PositionService {
    const httpClient = useHttpClient();
    const getPosition = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.POSITION.GET_POSITION(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postPosition = async (
        payload: InitPositionKeys,
        requiredKeys: string[]
    ) => {
        const validate_payload = {
            name: payload.name,
            effective_from: new Date().toISOString().split("T")[0],
            direct_bonus_rate: payload.direct_bonus_rate,
            management_bonus_rate: payload.management_bonus_rate,
            kpi_bonus_base: payload.kpi_bonus_base,
            monthly_average_target: payload.monthly_average_target,
        };
        const result = validateRequiredKeys(validate_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        const convert_payload: PayloadPosition = {
            name: payload.name,
            setting: {
                effective_from: new Date().toISOString().split("T")[0],
                direct_bonus_rate: (+payload.direct_bonus_rate)
                    .toFixed(4)
                    .toString(),
                management_bonus_rate: (+payload.management_bonus_rate)
                    .toFixed(4)
                    .toString(),
                kpi_bonus_base: (+payload.kpi_bonus_base).toFixed(4).toString(),
                monthly_average_target: (+payload.monthly_average_target)
                    .toFixed(4)
                    .toString(),
            },
        };
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.POSITION.END_POINT,
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
    const putPosition = async (
        payload: InitPositionKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const validate_payload = {
            name: payload.name,
            effective_from: new Date().toISOString().split("T")[0],
            direct_bonus_rate: payload.direct_bonus_rate,
            management_bonus_rate: payload.management_bonus_rate,
            kpi_bonus_base: payload.kpi_bonus_base,
            monthly_average_target: payload.monthly_average_target,
        };
        const result = validateRequiredKeys(validate_payload, requiredKeys);
        if (!result.isValid) return result;
        const convert_payload: PayloadPosition = {
            name: payload.name,
            setting: {
                effective_from: new Date().toISOString().split("T")[0],
                direct_bonus_rate: (+payload.direct_bonus_rate)
                    .toFixed(4)
                    .toString(),
                management_bonus_rate: (+payload.management_bonus_rate)
                    .toFixed(4)
                    .toString(),
                kpi_bonus_base: (+payload.kpi_bonus_base).toFixed(4).toString(),
                monthly_average_target: (+payload.monthly_average_target)
                    .toFixed(4)
                    .toString(),
            },
        };
        console.log("convert_payload", convert_payload);

        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.POSITION.END_POINT + "/" + code,
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
        getPosition,
        postPosition,
        putPosition,
    };
}
