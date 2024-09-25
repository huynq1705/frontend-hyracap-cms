import { ResponseProductItem } from "./product";
import { ResponseServiceItem } from "./service.type";
import { BaseItemResponse } from "./types";

export interface ResponseTreatmentCardItem extends BaseItemResponse {
  name: string;
  denominations: string;
  total_treatment: string;
  price: string;
  use_time: number;
  note: string;
  staff_commission: number;
  staff_commission_percentage: number;
  status: number;
  treatment_service: {
    service: ResponseServiceItem;
  }[];
  treatment_products: {
    products: ResponseProductItem;
  }[];
}
export interface PayloadTreatment {
  name: string;
  denominations: number;
  price: number;
  total_treatment: number;
  use_time: number;
  note: string;
  staff_commission: number;
  staff_commission_percentage: number;
  status: number;
  treatment_service: {
    service: ResponseServiceItem;
  }[];
  treatment_ResponseProductItems: {
    products: ResponseProductItem;
  }[];
}
