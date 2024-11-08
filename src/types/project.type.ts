import { BaseItemResponse } from "./types";

export interface ResponseProjectItem extends BaseItemResponse {
    name: string;
    thumbnail: string;
    images: string[];
    status: number;
    capital_raising_target: number;
    mobilized_fund: number;
    industries: ResIndustry[];
}

export interface ResIndustry {
    id: number;
    name: string;
}
