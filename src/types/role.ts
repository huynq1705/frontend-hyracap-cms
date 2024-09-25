import { number } from "yup";
import { BaseItemResponse } from "./types";

export interface ResponseRoleItem extends BaseItemResponse {
    name: string,
    role_permission: number []
}

interface Permission {
    id: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    name: string;
    description: string;
    http_method: string;
    pattern: string;
    permission_name: string;
    is_required_access_token: string;
    should_check_permission: string;
}
interface RolePermission {
    permission: Permission;
}
export interface ResponseRoleDetailItem extends BaseItemResponse {
    name: string;
    note: string;
    status: number;
    role_permission: RolePermission[];
    account: any [];
}

export interface PayloadRole {
    id?: number,
    name: string,
    description: string,
    http_method: string,
    pattern: string,
    permission_name: string,
    is_required_access_token: string,
    should_check_permission: string
}

export interface PayloadRoleGroup {
    name?: string,
    status?: number,
    note?: string,
    permission_id?: number [],
    account_id?: number []
}
