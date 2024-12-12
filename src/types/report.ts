import { BaseItemResponse } from "./types";

export interface ResponseReportItem extends BaseItemResponse {
    name: string;
    type: number;
    file: string[];
}

export interface PayloadReport {
    name: string;
    type: number;
    file: string;
}
