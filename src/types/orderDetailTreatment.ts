import { BaseItemResponse } from "./types";
export interface ResponseOrderDetailTreatmentItem extends BaseItemResponse {
    quantity: number;
    price: number;
    amount: number;
    type: number;
    remaining_amount_of_prepaid_card: any;
    amount_used: any;
    use_time: any;
    expiration_date: any;
    number_of_treatment_used: any;
    number_of_remaining_treatments: any;
    order_id: number;
    prepaid_card_face_value_id: number;
    treatment_id: any;
    product_id: any;
    service_id: any;
    order: Order;
    treatment: Treatment;
    order_detail_treatment: any[];
}
export interface Order {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    provisional: number;
    VAT: number;
    total: number;
    paid: number;
    note: string;
    status: number;
    creator_id: number;
    customer_id: number;
    customer: Customer;
}
export interface Customer {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    full_name: string;
    phone_number: string;
    email: any;
    gender: number;
    address: string;
    note: string;
    customer_source_id: any;
    customer_classification_id: any;
    date_of_birth: string;
    total_spending: number;
}
export interface Treatment {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    name: string;
    denominations: number;
    price: number;
    total_treatment: number;
    use_time: number;
    note: string;
    staff_commission: number;
    status: number;
}
