export const INIT_WORK_SCHEDULE = {
    id:0,
    date: "",
    list_work_shift: [
        {
            start_time: "",
            end_time: "",
            content: ""
        }
    ],
    list_off_shift: [
        {
            start_time: "",
            end_time: "",
            content: ""
        }
    ],
    account_id: 1
};
export type InitPaymentMethodKeys = typeof INIT_WORK_SCHEDULE;
