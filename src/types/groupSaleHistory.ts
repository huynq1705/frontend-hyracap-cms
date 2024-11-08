import { ResponseAccountItemConvert } from "./account.type";
import { BaseItemResponse } from "./types";

export interface ResponseGroupSaleHistoryItem extends BaseItemResponse {
    kpi: string;
    sales_revenue: string;
    month: string;
    leader: ResponseAccountItemConvert;
    group: ResponseGroup;
    user: ResponseAccountItemConvert;
}
export interface ResponseGroup extends BaseItemResponse {
    name: string;
}
