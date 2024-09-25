export const INIT_TREATMENT: {
    [x: string]: any;
} = {
    name: "",
    denominations: "",
    price: "",
    total_treatment: "0",
    use_time: null,
    note: "",
    staff_commission: "",
    staff_commission_percentage: "",
    status: 1,
};

export type InitTreatmentKeys = typeof INIT_TREATMENT;
