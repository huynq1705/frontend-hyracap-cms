import { BaseItemResponse } from "./types";

export interface ResponseAccountItem extends BaseItemResponse {
    id: number;
    username: string;
    full_name: string;
    address: string;
    date_of_birth: string;
    email: string;
    phone_number: string;
    referral_code: string;
    referred_code: string;
    role_id: number;
    cccd: number;
    shift_wage: number;
    hourly_wage: number;
    note: string;
    is_book_online: number;
    position: string;
    password: string;
    image: string;
    // contact_staff: { [key: string]: any }
}

export interface ResponseAccountItemConvert extends BaseItemResponse {
    id: number;
    username: string;
    full_name: string;
    address: string;
    date_of_birth: string;
    email: string;
    phone_number: string;
    referral_code: string;
    referred_code: string;
    role_id: number;
    cccd: number;
    shift_wage: number;
    hourly_wage: number;
    note: string;
    is_book_online: number;
    password: string;
    position: string;
    password_config: string;
    image: string;
    description: string
    // contact_staff: { [key: string]: any }
}
export interface PayloadAccount {
    username: string;
    full_name: string;
    address: string;
    date_of_birth: string;
    email: string;
    phone_number: string;
    referral_code: string;
    referred_code: string;
    role_id: number;
    cccd: number;
    shift_wage: number;
    hourly_wage: number;
    note: string;
    is_book_online: number;
    position: string;
    password?: string;
    is_active: boolean;
    status: number;
    type: number;
    image: string;
    description :string
}
export interface PayloadAccountPass {
    old_password: string;
    new_password: string;
}

export interface ResponseTotal {
    position: string,
    total: number
}