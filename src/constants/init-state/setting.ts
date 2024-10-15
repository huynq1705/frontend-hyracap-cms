export const INIT_SETTING: {
    direct_bonus_min_percent: string;
    kpi_bonus_min_percent: string;
    kpi_bonus_max_percent: string;
    jan_rate: string;
    feb_rate: string;
    mar_rate: string;
    apr_rate: string;
    may_rate: string;
    jun_rate: string;
    jul_rate: string;
    aug_rate: string;
    sep_rate: string;
    oct_rate: string;
    nov_rate: string;
    dec_rate: string;
    effective_from: string;
} = {
    direct_bonus_min_percent: "",
    kpi_bonus_min_percent: "",
    kpi_bonus_max_percent: "",
    jan_rate: "",
    feb_rate: "",
    mar_rate: "",
    apr_rate: "",
    may_rate: "",
    jun_rate: "",
    jul_rate: "",
    aug_rate: "",
    sep_rate: "",
    oct_rate: "",
    nov_rate: "",
    dec_rate: "",
    effective_from: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
};
export type InitSettingKeys = typeof INIT_SETTING;
