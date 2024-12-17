export const INIT_GROUP_SALE_HISTORY: {
    kpi: string;
    sales_revenue: string;
    month: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    group_name: string;
    member_sale_histories: [];
} = {
    kpi: "",
    sales_revenue: "",
    month: "",
    leader_name: "",
    leader_email: "",
    leader_phone: "",
    group_name: "",
    member_sale_histories: [],
};

export type InitGroupSaleHistoryKeys = typeof INIT_GROUP_SALE_HISTORY;
