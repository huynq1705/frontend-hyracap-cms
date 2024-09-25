import { BaseItemResponse } from "./types";

export interface ResponseEvaluationCriteriaItem extends BaseItemResponse {
    name: string
}
export interface PayloadEvaluationCriteria {
    id: number,
    name: string,
    status ?: number
}
