import { BaseItemResponse } from "./types";
// import {}
export interface ResponseManualItem extends BaseItemResponse {
    name: string;
    content: string;
    description: string;
}
export interface PayloadManualItem {
    name: string;
    content: string;
    description: string;
}
