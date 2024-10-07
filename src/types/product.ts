import { BaseItemResponse } from "./types";

export interface ResponseProductItem extends BaseItemResponse {
    name: string;
    min_invest: number;
    max_invest: number;
    min_duration: number;
    max_duration: number;
    current_interest_rate: number;
    category_id: number;
}

interface ProductPortfolio {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    name: string;
    is_publish: boolean;
}
export interface PayloadProduct {
    name: string;
    min_invest: string;
    max_invest: string;
    min_duration: string;
    max_duration: string;
    interest_rate?: string;
    new_interest_rate?: string;
    current_interest_rate?: string;
    category_id: number;
    effective_from?: string;
}
