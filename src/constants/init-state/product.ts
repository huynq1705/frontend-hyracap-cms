export const INIT_PRODUCT: {
  id: number;
  name: string;
  brand: string;
  stock: any;
  original_price: number;
  selling_price: number;
  product_category_id: string[];
  product_type_id: string[];
  description: string;
  status: boolean;
  commission: any;
  commission_percentage: any;
} = {
  id: 0,
  name: "",
  brand: "",
  stock: "",
  original_price: 0,
  selling_price: 0,
  product_category_id: [],
  product_type_id: [],
  description: "",
  status: true,
  commission: "",
  commission_percentage: "",
};
export type InitProductKeys = typeof INIT_PRODUCT;
