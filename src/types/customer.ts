import { ResponseCustomerClassificationItem } from "./customerClassification";
import { ResponseCustomerSourceItem } from "./customerSource";
import { BaseItemResponse } from "./types";

export interface ResponseCustomerItem extends BaseItemResponse {
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  total_spending: number;
  account_customer: any[];
  customer_classification: ResponseCustomerClassificationItem;
  customer_source_id: number;
  customer_source: ResponseCustomerSourceItem;
  email: string;
  gender: number;
  address: string;
  note: string;
}

export interface PayloadCustomer {
  id?: number;
  full_name: string;
  phone_number: string;
  email: string;
  gender: number;
  address: string;
  note: string;
  date_of_birth: string;
  total_spending: number;
  customer_source_id: number | string[];
  customer_classification_id: number | string[];
  account_customer: {
    name: string;
    type: number;
    account_id: number;
    customer_id: number;
  }[];
  contact_staff?: {
    name: string;
    type: number;
    account_id: number;
    customer_id: number;
  }[];
  person_in_charge?: {
    name: string;
    type: number;
    account_id: number;
    customer_id: number;
  }[];
}

export interface ServiceHistory {
  day: string;
  id: number;
  VAT: number;
  note: string;
  name_service: string;
  price: number;
  quantity: number;
}
