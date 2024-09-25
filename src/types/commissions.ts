import { BaseItemResponse } from "./types";

interface Item {
    account_id : number;
    full_name : string;
    name_customer : string;
    name_service : string;
    order_id : number;
    phone_number_customer : string;
    position : string;
    total_commission : number
}

export interface ResponseCommissionsItem extends BaseItemResponse {
    list_commissions : Item []
}

export interface PayLoadCommissions {
    month: string,
    type: number,
    quanity: number,
    money_per_quantity: number,
    total_commission: number,
    allowance: number,
    total_salary: number,
    staff_id: number,
    id?: number

}
export interface PayLoadGetCommissions {
    from ?: string,
    to ?: string,
    page ?: number,
    limit ?: number,
    sortBy ?: string,
    sortOrder ?: string,
    staff_id ?: number | string
}
// export interface PayloadPaymentMethodPass {
//     id: number,
//     name: string,
//     is_active: boolean
// }
