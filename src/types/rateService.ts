import { BaseItemResponse } from "./types";

export interface PayLoadGetRateService {
  // order: "ASC" | "DESC"
  // order_by: any
  page: number
  take: number
  // q: string
  // text: string
  startDate: string
  endDate: string
  // staff_in_charge_id: string
  star:string
  evaluation_criteria_id:number
  filter?:string
}

export interface ReportRateService {
  data: DataRateService[]
}

export interface DataRateService {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  star: number
  evaluation_criteria_id: number
  order_id: number
  evaluation_criteria: EvaluationCriteria
  order: Order
}

export interface EvaluationCriteria {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  name: string
  status: number
}

export interface Order {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  provisional: number
  VAT: number
  total: number
  paid: number
  note: string
  status: number
  average_score: number
  creator_id: number
  customer_id: number
  customer: Customer
  creator: Creator
}

export interface Customer {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  full_name: string
  phone_number: string
  email: string
  gender?: number
  address?: string
  note?: string
  customer_source_id: any
  customer_classification_id?: number
  date_of_birth?: string
  total_spending: number
}

export interface Creator {
  id: number
  created_at: string
  updated_at: string
  is_active: boolean
  mitu_code: any
  image: any
  username: string
  password: string
  full_name: string
  address: string
  date_of_birth: string
  email: string
  phone_number: string
  cccd: number
  shift_wage: any
  hourly_wage: any
  note: string
  is_book_online: number
  position: string
  type: number
  referral_code: string
  referred_code: string
  status: number
  note_detail: any
  description: any
  average_star: any
  role_id: number
}

