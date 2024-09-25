import { BaseItemResponse } from "./types";

export interface ReportCommission {
  total_staff: string
  total_commission: number
  list_staff_commission: ListStaffCommission
}

export interface ListStaffCommission {
  list_commissions: ListCommission[]
  meta: Meta
}

export interface ListCommission {
  account_id: number
  full_name: string
  position: string
  total_commission: number
}
// PRODUCT
export interface ReportProduct {
  header: HeaderProduct
  table: TableProduct
}

export interface HeaderProduct {
  total_product: number
  total_stock: number
  total_paid: number
  total_revenue: number
}

export interface TableProduct {
  list_product: ListProduct[]
  meta: Meta
}

export interface ListProduct {
  product_name: string
  product_code: number
  product_category?: string
  total_sold: string
  total_stock: number
  total_revenue: number
}

// SERVICE
export interface ReportService {
  header: HeaderService
  table: TableService
}

export interface HeaderService {
  total_service: number
  total_paid: number
  total_revenue: number
}
//

export interface ReportEvaluationCriteria {
  evaluation_criteria_id: number
  evaluation_criteria_name: string
  total_usage: string
  average_rating: number
  related_order_id: number[]
}

export interface TableService {
  list_service: ListService[]
  // meta: Meta
}

export interface ListService {
  service_name: string
  service_code: number
  service_catalog: string
  total_sold: string
  total_revenue: number
}
// ACCOUNT
export interface ReportAccount {
  table: Table[]
}

export interface Table {
  id: number
  full_name: string
  position: string
  total_reviews: string
  average_rating: number
  one_star: string
  two_star: string
  three_star: string
  four_star: string
  five_star: string
}
export interface Meta {
  page: string
  take: string
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
//payment
export interface ReportPaymentMethod {
  statusCode: number
  status: boolean
  error: any[]
  data: DataReportPaymentMethod
}

export interface DataReportPaymentMethod {
  prepaid_card: number
  treatment: number
  bank_transfer: number
  atm_card: number
  moto: number
  cash: number
}

// REVENUE
export interface ReportRevenue {
  statusCode: number
  status: boolean
  error: any[]
  data: DataRevenue
}
export interface DataRevenue {
  service: Service
  product: Product
  prepaid_card: PrepaidCard
  treatment_card: TreatmentCard
}

export interface Service {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}

export interface Product {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}

export interface PrepaidCard {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}

export interface TreatmentCard {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}
//PAYMENT METHOD
export interface ReportRevenuePaymentMethod {
  statusCode: number
  status: boolean
  error: any[]
  data: DataPaymentMethod
}

export interface DataPaymentMethod {
  prepaid_card: PrepaidCard
  treatment_card: TreatmentCard
  list_payment_method_detail: ListPaymentMethodDetail[]
  meta: Meta
}

export interface PrepaidCard {
  total_payment: number
  total_payment_amount: number
}

export interface TreatmentCard {
  total_payment: number
  total_payment_amount: number
}

export interface ListPaymentMethodDetail {
  order_id: number
  customer_name: string
  customer_phone_number: string
  time_payment: string
  cashier: string
  method_payment: string
}

export interface Meta {
  page: string
  take: string
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// PREPAID CARD
export interface ReportPrepaidCard {
  statusCode: number
  status: boolean
  error: any[]
  data: DataPrepaidCard
}

export interface DataPrepaidCard {
  prepaid_card: PrepaidCard
  list_prepaid_card: ListPrepaidCard[]
  meta: Meta
}

export interface PrepaidCard {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}

export interface ListPrepaidCard {
  order_id: number
  customer_name: string
  customer_phone_number: string
  time_payment: string
  cashier: string
  method_payment: string
  money_payment: number
}
//TREATMENT
export interface ReportTreatment {
  statusCode: number
  status: boolean
  error: any[]
  data: DataTreatment
}

export interface DataTreatment {
  treatment_card: TreatmentCard
  list_treatment: ListTreatment[]
  meta: Meta
}

export interface TreatmentCard {
  total_payment: number
  total_payment_amount: number
  total_amount_paid: number
}

export interface ListTreatment {
  order_id: number
  customer_name: string
  customer_phone_number: string
  time_payment: string
  cashier: string
  method_payment: string
  money_payment: number
}






export interface PayLoadGetReportCommissions {
  month?: number,
  account_id?: number,
  page?: number,
  limit?: number,
  // sortBy?: string,
  // sortOrder?: string,
}
export interface PayLoadGetReportProduct {
  month: number
  page: string,
  limit: string
}
export interface PayLoadGetReportService {
  month: number,
  service_catalog_id: string,
  page: string,
  limit: string
}
export interface PayLoadGetReportAccount {
  startDate: number,
  endDate: string,
  type: string,
  page: number,
  limit: number
}
export interface PayLoadGetReportRevenue {
  month: number,
  executor_staff_id: string,
  contact_staff_id: string,
  customer_source_id: string,
  payment_method_id: string,
  page?: number,
  limit?: number
}
export interface PayLoadGetReportPaymentMethod {
  month: number,
}
export interface PayLoadGetReportRevenuePaymentMethod {
  month: number,
  payment_method_id: string,
  page?: number,
  limit?: number
}
