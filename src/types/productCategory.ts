import { BaseItemResponse } from "./types";

export interface ResponseProductCategoryItem extends BaseItemResponse {
    name: string;
    min_duration: number;
    max_duration: number;
    min_interest_rate: number;
}
export interface PayloadProductCategory {
    name: string;
    min_duration: number;
    max_duration: number;
    min_interest_rate: number;
}
