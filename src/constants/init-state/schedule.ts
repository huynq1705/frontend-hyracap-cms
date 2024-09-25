const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0, nên cộng thêm 1
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const INIT_SCHEDULE: {
    id?: number | null;
    full_name: string;
    phone_number: string;
    email: string;
    customer_source_id: number | null;
    content: string;
    date: string;
    time: string;
    type: number | null;
    platform?: number | null;
    customer_id: number | null;
    creator_id: string;
    status_schedule_id?: string;
    staff_id?: string;
    schedule_service?: string;
    [key: string]: any;
} = {
    id: null,
    full_name: "",
    phone_number: "",
    email: "",
    customer_source_id: null,
    content: "",
    date: getCurrentDate(),
    time: "",
    type: 0,
    platform: null,
    customer_id: null,
    creator_id: "",
    status_schedule_id: "",
    staff_id: "",
    schedule_service: "",
    list_service_id: [],
};
export type InitScheduleKeys = typeof INIT_SCHEDULE;
