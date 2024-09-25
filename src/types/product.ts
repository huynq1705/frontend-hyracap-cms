import { BaseItemResponse } from "./types";

export interface ResponseProductItem extends BaseItemResponse {
  name: string;
  brand: string;
  stock: number;
  status: number;
  original_price: number;
  selling_price: number;
  product_category_id: number;
  product_type_id: number;
  product_category: ProductPortfolio;
  product_type: ProductPortfolio;
  description: string;
  commission: number;
  commission_percentage: number;
  image: string[];
}

interface ProductPortfolio {
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  name: string;
  is_publish: boolean;
}
export interface PayloadProduct {
  name: string;
  brand: string;
  stock: number;
  original_price: number;
  selling_price: number;
  product_category_id: number | null;
  product_type_id: number | null;
  status: number;
  description: string;
  commission: number;
  commission_percentage: number;
  image?: string[];
}
