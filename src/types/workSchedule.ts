import { BaseItemResponse } from "./types";


interface ItemTime {
    start_time: string,
    end_time: string,
    content: string
}
export interface ResponseWorkScheduleItem extends BaseItemResponse {
    date: string,
    list_work_shift: ItemTime [],
    list_off_shift: ItemTime [],
    account_id: number
}

export interface PayLoadWorkSchedule  {
    id?: number,
    date: string,
    list_work_shift: ItemTime[],
    list_off_shift: ItemTime[],
    account_id: number

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
