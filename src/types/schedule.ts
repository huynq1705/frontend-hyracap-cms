import {
    ResponseAccountItem,
    ResponseAccountItemConvert,
} from "./account.type";
import { StatusScheduleArray } from "./appointmentStatus";
import { ResponseCustomerItem } from "./customer";
import { ResponseServiceItem } from "./service.type";
import { BaseItemResponse } from "./types";

export interface ResponseScheduleItem extends BaseItemResponse {
    content: string;
    date: string;
    type: number;
    from: string;
    to: string;
    full_name?: string;
    phone_number: string;
    email: string;
    customer_source_id: number | null;
    platform: number | null;
    customer: ResponseCustomerItem;
    creator: ResponseAccountItem;
    status_schedule: StatusScheduleArray;
    staff: ResponseAccountItem;
    service_id: number;
    range_time: string;
}

export interface ResponseScheduleItemConvert extends BaseItemResponse {
    content: string;
    date: string;
    type: number;
    from: string;
    to: string;
    full_name?: string;
    phone_number: string;
    email: string;
    customer_source_id: number | null;
    platform: number | null;
    customer: ResponseCustomerItem;
    creator: ResponseAccountItem;
    status_schedule: StatusScheduleArray;
    staff: ResponseAccountItem;
    schedule_service: ScheduleServiceConvert[];
    range_time: string;
}
export interface ScheduleServiceConvert extends BaseItemResponse {
    schedule_id: number;
    service_id: number;
    service: ResponseServiceItem;
}
export interface PayloadSchedule {
    id: number | null;
    full_name?: string;
    phone_number?: string;
    email?: string;
    customer_source_id?: number | null;
    content?: string;
    date?: string;
    from?: string;
    to?: string;
    type?: number | null;
    platform?: number | null;
    customer_id?: number | null;
    creator_id?: number;
    status_schedule_id?: number | null;
    staff_id?: number;
    service_id?: number[];
}

export interface ConfigSchedule {
    id: number;
    created_at: string;
    updated_at: string;
    time_open: string;
    time_close: string;
    time_slot: number;
    time_booking_min: number;
    unit_time_booking_min: number;
    time_booking_max: number;
    unit_time_booking_max: number;
    list_account_id: string;
    status: number;
}
