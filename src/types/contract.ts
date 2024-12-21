import { ResponseProductCategoryItem } from "./productCategory";
import { BaseItemResponse } from "./types";

export interface ResponseContractItem extends BaseItemResponse {
  capital: number;
  duration: number;
  current_profit: number;
  status: number;
  effective_from: string;
  effective_to: string;
  product_id: number;
  product: PayloadProductConTract;
  profit_before_tax: string;
  contract_id: string;
  user: PayloadUserConTract;
}

export interface PayloadProductConTract {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  min_invest: number;
  max_invest: number;
  min_duration: number;
  max_duration: number;
  current_interest_rate: number;
  effective_from: string;
  category_id: number;
  category: ResponseProductCategoryItem;
}
export interface PayloadUserConTract {
  id: number;
  created_at: string;
  updated_at: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verified: boolean;
  avatar: string;
  presenterId: number;
  verifyCode: string;
  kycStatus: string;
  referralCode: string;
  sub: number;
  referrer_sub: null;
}

export interface PayloadContract {
  capital: string;
  duration: number;
  product_id: number;
  user_sub: number;
  staff_id: number;
}

export interface PayloadUpdateContract {
  capital: string;
  duration: number;
  status: number;
}
