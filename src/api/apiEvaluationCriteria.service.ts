import Utils from "@/utils/utils";
import {
    PayloadProductCategory,
    ResponseProductCategoryItem,
} from "../types/productCategory";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "../types/types";
import useHttpClient from "./useHttpClient";
import AppConfig from "@/common/AppConfig";
import { InitProductCategoryKeys } from "@/constants/init-state/product_category";
import { validateRequiredKeys } from "@/utils";
import { PayloadEvaluationCriteria, ResponseEvaluationCriteriaItem } from "@/types/evaluationCriteria";

type EvaluationCriteriaService = {
    getEvaluationCriteria: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseEvaluationCriteriaItem[]>>;
    postEvaluationCriteria: (
        payload: PayloadEvaluationCriteria,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    putEvaluationCriteria: (
        payload: PayloadEvaluationCriteria,
        requiredKeys: string[],
    ) => ValidationResult | Promise<boolean>;
    deleteEvaluationCriteria: (payload: string[]) => Promise<boolean>;
};
export default function apiEvaluationCriteriaService(): EvaluationCriteriaService {
    const httpClient = useHttpClient();
    const getEvaluationCriteria = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.EVALUATION_CRITERIA.GET_EVALUATION_CRITERIA(queryParams)}`,
        );
    };
    const postEvaluationCriteria = (
        payload: PayloadEvaluationCriteria,
        requiredKeys: string[],
    ) => {
        const convert_payload = {
            name: payload.name?.toString().trim(),
            status : payload.status
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.EVALUATION_CRITERIA.END_POINT,
                convert_payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putEvaluationCriteria = (
        payload: PayloadEvaluationCriteria,
        requiredKeys: string[],
    ) => {
        const convert_payload = {
            name: payload.name?.toString().trim(),
            status: payload.status
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.EVALUATION_CRITERIA.END_POINT + "/" + payload.id,
                convert_payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteEvaluationCriteria = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(
                AppConfig.EVALUATION_CRITERIA.END_POINT,
                payload,
            )
            .then((res: ResponseFromServerV2<any>) => {
                return !!res;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getEvaluationCriteria,
        postEvaluationCriteria,
        putEvaluationCriteria,
        deleteEvaluationCriteria
    };
}
