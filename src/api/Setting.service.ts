import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { formatDate } from "@/utils/date-time";
import { PayloadSetting, ResponseSettingItem } from "@/types/setting.type";
import { InitSettingKeys } from "@/constants/init-state/setting";
type SettingService = {
    getSetting: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseSettingItem[]>>;
    postSetting: (payload: InitSettingKeys, requiredKeys: string[]) => any;
};
export default function apiSettingService(): SettingService {
    const httpClient = useHttpClient();
    const getSetting = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.SETTING.GET_SETTING(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postSetting = async (
        payload: InitSettingKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadSetting = {
            direct_bonus_min_percent: (
                +payload.direct_bonus_min_percent / 100
            ).toString(),
            kpi_bonus_min_percent: (
                +payload.kpi_bonus_min_percent / 100
            ).toString(),
            kpi_bonus_max_percent: (
                +payload.kpi_bonus_max_percent / 100
            ).toString(),
            monthly_rates: [
                (+payload.jan_rate / 100).toFixed(4).toString(),
                (+payload.mar_rate / 100).toFixed(4).toString(),
                (+payload.feb_rate / 100).toFixed(4).toString(),
                (+payload.apr_rate / 100).toFixed(4).toString(),
                (+payload.may_rate / 100).toFixed(4).toString(),
                (+payload.jun_rate / 100).toFixed(4).toString(),
                (+payload.jul_rate / 100).toFixed(4).toString(),
                (+payload.aug_rate / 100).toFixed(4).toString(),
                (+payload.sep_rate / 100).toFixed(4).toString(),
                (+payload.oct_rate / 100).toFixed(4).toString(),
                (+payload.nov_rate / 100).toFixed(4).toString(),
                (+payload.dec_rate / 100).toFixed(4).toString(),
            ],
            effective_from: payload.effective_from,
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.SETTING.END_POINT,
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
        getSetting,
        postSetting,
    };
}
