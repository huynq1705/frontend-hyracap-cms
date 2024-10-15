import { ResponseAccountItemConvert } from "./account.type";
import { BaseItemResponse } from "./types";

export interface ResponseSaleHistoryItem extends BaseItemResponse {
    kpi: string;
    kpi_bonus: string;
    sales_revenue: string;
    month: string;
    user_sub: number;
    user: ResponseAccountItemConvert;
    user_position: ResponseUserPosition;
}
export interface ResponseUserPosition extends BaseItemResponse {
    position_id: number;
    user_sub: number;
    effective_from: number;
    position: ResponsePosition;
}
export interface ResponsePosition extends BaseItemResponse {
    name: string;
}
