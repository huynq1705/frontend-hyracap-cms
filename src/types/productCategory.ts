import { BaseItemResponse } from "./types";

export interface ResponseProductCategoryItem extends BaseItemResponse {
  name: string;
  status: number;
}
export interface PayloadProductCategory {
  name: string;
  status: number;
}
