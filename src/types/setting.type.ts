import { BaseItemResponse } from "./types";

export interface ResponseSettingItem extends BaseItemResponse {
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
}
export interface PayloadSetting {
    direct_bonus_min_percent: string;
    kpi_bonus_min_percent: string;
    kpi_bonus_max_percent: string;
    monthly_rates: string[];
    effective_from: string;
}
