export const INIT_EMPLOYEE = {
    id: 0,
    username: "",
    full_name: "",
    address: "",
    date_of_birth: new Date(),
    email: "",
    phone_number: "",
    referral_code: "",
    referred_code: "",
    role_id: 1,
    cccd: 0,
    shift_wage: 0,
    hourly_wage: 0,
    note: "",
    is_book_online: 1,
    position: "",
    password: "",
    password_config: "",
    is_active: true,
    status: 1,
    type: 0,
    note_detail: {},
    image: "",
    star: 0,
    description: "",
};
export type InitCustomerKeys = typeof INIT_EMPLOYEE;
export const GENDER_LIST = [
    {
        title: "",
        options: [
            {
                value: "0",
                name: "Nam",
            },
            {
                value: "1",
                name: "Nữ",
            },
        ],
    },
];
