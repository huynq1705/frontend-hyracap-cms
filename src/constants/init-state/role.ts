export const INIT_ROLE = {
    id: 0,
    is_active: true,
    name: "",
    status: true,

};

export type InitPaymentMethodKeys = typeof INIT_ROLE;

export const INIT_ROLE_DETAIL = {
    id: 2,
    is_active: true,
    name: "",
    note: "",
    status: 0,
    account: [{ key: "", value: "", content: "" }]
};
export type Init_Role_Detail = typeof INIT_ROLE_DETAIL;