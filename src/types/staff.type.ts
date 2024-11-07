import { BaseItemResponse } from "./types";

export interface ResponseStaffItem extends BaseItemResponse {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    referral_code: string;
    role_id: number | null;
    current_staff_position: any;
}

export interface PayloadStaff {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role_id: number;
}
