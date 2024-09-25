import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { ResponseTreatmentCardItem } from "@/types/treatmentCard";
import { InitTreatmentKeys } from "@/constants/init-state/treatment";
type TreatmentCardService = {
    getTreatmentCard: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseTreatmentCardItem[]>>;
    postTreatmentCard: (
        payload: InitTreatmentKeys,
        requiredKeys: string[]
    ) => ValidationResult | Promise<boolean>;
    putTreatmentCard: (
        payload: InitTreatmentKeys,
        code: string,
        requiredKeys: string[]
    ) => ValidationResult | Promise<boolean>;
    deleteTreatmentCard: (payload: string[]) => Promise<boolean>;
};
export default function apiTreatmentCardService(): TreatmentCardService {
    const httpClient = useHttpClient();
    const getTreatmentCard = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(
                `${AppConfig.TREATMENT_CARD.GET_TREATMENT_CARD(queryParams)}`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postTreatmentCard = (payload: any, requiredKeys: string[]) => {
        const convert_payload: any = {
            name: payload.name,
            denominations: Number(payload.denominations),
            price: Number(payload.price),
            total_treatment: Number(payload.total_treatment),
            use_time:
                Number(payload.use_time) === 0
                    ? null
                    : Number(payload.use_time),
            note: payload.note,
            staff_commission: +payload.staff_commission,
            staff_commission_percentage: +(
                payload.staff_commission_percentage / 100
            ).toFixed(4),
            status: payload.status,
            treatment_service: payload.treatment_service
                .filter((option: any) => option.key.trim() !== "")
                .map((option: any) => ({
                    service_id: option.key,
                })),
            treatment_product: [],
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.TREATMENT_CARD.END_POINT,
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
    const putTreatmentCard = (
        payload: any,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: payload.name,
            denominations: Number(payload.denominations),
            price: Number(payload.price),
            total_treatment: Number(payload.total_treatment),
            use_time: Number(payload.use_time)
                ? null
                : Number(payload.use_time),
            note: payload.note,
            staff_commission: +payload.staff_commission,
            staff_commission_percentage: +(
                payload.staff_commission_percentage / 100
            ).toFixed(4),
            status: payload.status,
            treatment_service: payload.treatment_service
                .filter((option: any) => option.key.trim() !== "")
                .map((option: any) => ({
                    service_id: option.key,
                })),
            treatment_product: [],
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.TREATMENT_CARD.END_POINT + "/" + code,
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
    const deleteTreatmentCard = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.TREATMENT_CARD.END_POINT,
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
        getTreatmentCard,
        postTreatmentCard,
        putTreatmentCard,
        deleteTreatmentCard,
    };
}
