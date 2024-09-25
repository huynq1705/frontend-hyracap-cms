import { BaseItemResponse } from "./types";



export interface ResponseStaffSalaryItem extends BaseItemResponse {
    month: string,
    type: number,
    quanity: number,
    money_per_quantity: number,
    total_commission: number,
    allowance: number,
    total_salary: number,
    staff_id: number
}

export interface PayLoadStaffSalary {
    month: string,
    type: number,
    quanity: number,
    money_per_quantity: number,
    total_commission: number,
    allowance: number,
    total_salary: number,
    staff_id: number,
    id?: number,
    fine : number

}
export interface PayloadWorkSchedule {
    name: string,
    is_active: boolean
}
// export interface PayloadPaymentMethodPass {
//     id: number,
//     name: string,
//     is_active: boolean
// }
