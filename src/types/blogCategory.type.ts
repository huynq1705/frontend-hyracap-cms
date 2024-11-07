import { BaseItemResponse } from "./types";

export interface ResponseBlogCategoryItem extends BaseItemResponse {
    name: string;
    is_public: number;
    note: string;
}
export interface PayloadBlogCategory {
    name: string;
    is_public: number;
    note: string;
}
