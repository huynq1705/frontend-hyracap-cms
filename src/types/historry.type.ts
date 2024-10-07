import { BaseItemResponse } from "./types";

export interface ResponseHistoryItem extends BaseItemResponse {
    interest_rate: string;
    effective_from: string;
    product_id: number;
}
