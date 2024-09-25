export const INIT_CUSTOMER_CLASSIFICATION: {
    id: number;
    rank: string;
    required_amount: number;
    discount: number;
    bonus: number;
    status: number;
    color_code: string;
} = {
    id: 0,
    rank: "",
    required_amount: 0,
    discount: 0,
    bonus: 0,
    status: 1,
    color_code: "",
};
export type InitCustomerClassificationKeys =
    typeof INIT_CUSTOMER_CLASSIFICATION;
