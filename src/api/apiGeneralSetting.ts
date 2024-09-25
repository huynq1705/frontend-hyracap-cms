import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadCustomer } from "@/types/customer";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { InitCustomerKeys } from "@/constants/init-state/customer";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import {
    PayloadPaymentMethod,
} from "@/types/payment.type";
import { InitPaymentMethodKeys } from "@/constants/init-state/payment_menthod";
import { PayloadGeneralSetting, ResponseGeneralSettingItem } from "@/types/generalSetting";
type generalSettingService = {
    getGeneralSetting: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseGeneralSettingItem[]>>;
    postGeneralSetting: (
        payload: PayloadGeneralSetting,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    putGeneralSetting: (
        payload: PayloadGeneralSetting,
        code : number,
        requiredKeys: string[]
    ) => ValidationResult | Promise<boolean>;
    deleteGeneralSetting: (payload: string[]) => Promise<boolean>;
};
export default function apiGeneralSettingService(): generalSettingService {
    const httpClient = useHttpClient();
    const getGeneralSetting = (params?: any): Promise<any> => {
        const paramRaw: any = params ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.GENERAL_SETTING.GET_GENERAL_SETTING(queryParams)}`,
        );
    };
    const postGeneralSetting = (
        payload: PayloadGeneralSetting,
        requiredKeys: string[],
    ) => {
     
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.GENERAL_SETTING.END_POINT,
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
    const putGeneralSetting = (
        payload: PayloadGeneralSetting,
        code :number,
        requiredKeys: string[]
    ) => {
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.GENERAL_SETTING.END_POINT + "/" + code,
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
    const deleteGeneralSetting = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(AppConfig.CUSTOMER.END_POINT, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getGeneralSetting,
        postGeneralSetting,
        putGeneralSetting,
        deleteGeneralSetting
    };
}
