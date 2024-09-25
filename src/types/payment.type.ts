import { BaseItemResponse } from "./types";

export interface ResponsePaymentMethodItem extends BaseItemResponse {
    id: number,
    name: string,
    is_active: boolean,
    name_account: string,
    number_account: number,
    bank_id: number,
    default_payment: number
}

export interface ResponsePaymentMethodItemConvert extends BaseItemResponse {
    id: number,
    name: string,
    is_active: boolean,
    name_account: string,
    number_account: number,
    bank_id: number,
    default_payment: number
}
export interface PayloadPaymentMethod {
    name: string,
    status: number,
    name_account: string,
    number_account: number,
    bank_id: number,
    default_payment : number
}
export interface PayloadPaymentMethodPass {
    id: number,
    name: string,
    is_active: boolean,
    name_account: string,
    number_account: number,
    bank_id: number,
    default_payment: number
}
