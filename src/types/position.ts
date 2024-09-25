import { number } from "yup";
import { BaseItemResponse } from "./types";

export interface ResponsePositionItem extends BaseItemResponse {
    name: string,
    description: string,
    http_method: string,
    pattern: string,
    permission_name: string,
    is_required_access_token: string,
    should_check_permission: string
}

export interface PayloadPosition {
    id ?: number,
    name: string,
    description: string,
    http_method: string,
    pattern: string,
    permission_name: string,
    is_required_access_token: string,
    should_check_permission: string
}

