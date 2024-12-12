export const INIT_CREATE_PRODUCT: {
    name: string;
    members: string[];
} = {
    name: "",
    members: [],
};
export type InitCreateGroupKeys = typeof INIT_CREATE_PRODUCT;
export const INIT_UPDATE_PRODUCT: {
    name: string;
    members: {
        members_id: string;
        members_staff_id: string;
        members_first_name: string;
        members_last_name: string;
        members_email: string;
        members_phone: string;
        members_role_id: string | null;
        effective_from: string;
        leave_from: string | null;
        role: string;
    }[];
} = {
    name: "",
    members: [
        {
            members_id: "",
            members_staff_id: "",
            members_first_name: "",
            members_last_name: "",
            members_email: "",
            members_phone: "",
            members_role_id: null,
            effective_from: "",
            leave_from: null,
            role: "",
        },
    ],
};

export type InitUpdateGroupKeys = typeof INIT_UPDATE_PRODUCT;
