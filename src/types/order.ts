import { ValidationResult } from "@/types/types";
export type TypeDataItemOrder =
  | "product"
  | "course"
  | "prepay"
  | "service"
  | "employee";
export type ItemPicked = {
  id: string;
  type: TypeDataItemOrder;
  quantity: number;
  [x: string]: any;
};
export type ItemOrder = {
  itemPicked: ItemPicked[];
  employee?: any[];
  customer?: {
    [x: string]: any;
  };
  payment_methods?: {
    [x: string]: any;
  }[];
  payment?: {
    total: number;
    vat: number;
    VAT: number;
    sum_order: number;
    paid?: number;
    [x: string]: any;
  };
  [x: string]: any;
} | null;

interface ProductType {
  source: any[];
  show: any[];
}

export type DataTypeOrder = {
  product: ProductType;
  course: ProductType;
  prepay: ProductType;
  service: ProductType;
  employee: ProductType;
};

export interface PayloadOrder {}
export interface Root {
  new_customer: null;
  provisional: number;
  VAT: number;
  total: number;
  paid: number;
  note: string;
  payment_methods_id: number;
  account_id: number;
  customer_id: number | null;
  order_service_product: OrderServiceProduct[];
  account_order: AccountOrder[];
}

interface OrderServiceProduct {
  quantity: number;
  amount: number;
  number_of_treatment_used: number;
  number_of_remaining_treatments: number;
  type: number;
  order_id: number;
  prepaid_card_face_value_id: number | null;
  treatment_id: number | null;
  product_id: number | null;
  service_id: number | null;
}

interface AccountOrder {
  name: string;
  type: number;
  commission_percentage: number;
  commission: number;
  account_id: number;
  order_id: number;
}
export interface ResponseOrderItem {
  [x: string]: any;
}
