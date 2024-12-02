export const INIT_PRODUCT: {
    name: string;
    min_invest: string;
    max_invest: string;
    min_duration: string;
    max_duration: string;
    total_capacity: string;
    total_invested: string;
    interest_rate: string;
    category_id: number;
    effective_from: string;
} = {
    name: "",
    min_invest: "",
    max_invest: "",
    min_duration: "",
    max_duration: "",
    total_capacity: "",
    total_invested: "",
    interest_rate: "",
    effective_from: "",
    category_id: 0,
};
export type InitProductKeys = typeof INIT_PRODUCT;
