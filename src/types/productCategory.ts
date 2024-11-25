import { BaseItemResponse } from "./types";

export interface ResponseProductCategoryItem extends BaseItemResponse {
    name: string;
    min_duration: string;
    max_duration: string;
    min_interest_rate: string;
}
export interface PayloadProductCategory {
    name: string;
    min_duration: string;
    max_duration: string;
    min_interest_rate: string;
}
