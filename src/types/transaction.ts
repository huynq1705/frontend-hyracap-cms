import { ResponseProductItem } from "./product";
import { ResponseProductCategoryItem } from "./productCategory";
import { BaseItemResponse } from "./types";

export interface ResponseContractItem extends BaseItemResponse {
    capital: number;
    duration: number;
    current_profit: number;
    status: number;
    product_id: number;
    product: PayloadProductConTract;
}

export interface PayloadProductConTract {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    name: string;
    min_invest: number;
    max_invest: number;
    min_duration: number;
    max_duration: number;
    current_interest_rate: number;
    category_id: number;
    category: ResponseProductCategoryItem;
}
export interface PayloadContract {
    capital: number;
    duration: number;
    product_id: number;
    user_sub: number;
}
