import { BaseItemResponse } from "./types";

export interface ResponseBankItem extends BaseItemResponse {
    is_active: boolean,
    name: string,
    full_name: string,
    icon: string
}

export interface PayloadBank {
    id: number,
    is_active: boolean,
    name: string,
    full_name: string,
    icon: string
}
