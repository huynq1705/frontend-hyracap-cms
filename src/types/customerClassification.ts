import { BaseItemResponse } from "./types";

export interface ResponseCustomerClassificationItem extends BaseItemResponse {
    rank: string;
    required_amount: number;
    discount: number;
    bonus: number;
    status: number;
    color_code: string;
}
export interface PayloadCustomerClassification {
    rank: string;
    required_amount: number;
    discount: number;
    bonus: number;
    status: number;
    color_code: string;
}
