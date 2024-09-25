import { ResponseAccountItem } from "./account.type";
import { ResponseCustomerItem } from "./customer";
import { BaseItemResponse } from "./types";

export interface ResponseCustomerNoteItem extends BaseItemResponse {
  note: string;
  customer: ResponseCustomerItem;
  account: ResponseAccountItem;
  img: string | null;
}

export interface PayloadCustomerNote {
  id?: number;
  note: string;
  customer_id: number;
  account_id: number;
  img: string | null;
}
