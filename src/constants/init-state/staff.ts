export const INIT_STAFF: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    role_id: number;
    current_staff_position: number;
} = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_id: 0,
    current_staff_position: 0,
};
export type InitStaffKeys = typeof INIT_STAFF;
