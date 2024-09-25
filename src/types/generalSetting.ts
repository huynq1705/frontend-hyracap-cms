import { BaseItemResponse } from "./types";

export interface ResponseGeneralSettingItem extends BaseItemResponse {
    bill_size: number,
    bill_content: number,
    display_employee_name_on_invoice: number,
    content_display_end_invoice: number,
    display_qrcode_evalute_appointment: number,
    content_end_invoice: string
}

export interface PayloadGeneralSetting {
    bill_size?: number,
    bill_content?: number,
    display_employee_name_on_invoice?: number,
    content_display_end_invoice?: number,
    display_qrcode_evalute_appointment?: number,
    content_end_invoice?: string,
    id ?: number
}
export interface PayloadPaymentMethodPass {
    id: number,
    name: string,
    is_active: boolean
}
