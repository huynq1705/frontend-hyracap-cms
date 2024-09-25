import { BaseItemResponse } from "./types";

export interface PayloadPrepaidCardFaceValue {
  name: string;
  denominations: number;
  price: number;
  use_time: number;
  note: string;
  staff_commission: number;
  staff_commission_percentage: number;
  status: number;
}
export interface ResponsePrepaidCardFaceValueItem extends BaseItemResponse {
  name: string;
  denominations: number;
  price: number;
  use_time: number;
  note: string;
  staff_commission: number;
  staff_commission_percentage: number;
  status: number;
}
