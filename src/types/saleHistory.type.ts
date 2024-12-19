import { ResponseAccountItemConvert } from "./account.type";
import { ResponseStaffItem } from "./staff.type";
import { BaseItemResponse } from "./types";
import { PositionCurrent } from "./position.type";

export interface ResponseSaleHistoryItem extends BaseItemResponse {
  kpi: string;
  kpi_bonus: string;
  sales_revenue: string;
  month: string;
  user_sub: number;
  user: ResponseAccountItemConvert;
  user_position: ResponseUserPosition;
}
export interface ResponseUserPosition extends BaseItemResponse {
  position_id: number;
  user_sub: number;
  effective_from: number;
  position: ResponsePosition;
}
export interface ResponsePosition extends BaseItemResponse {
  name: string;
}

export interface SaleHistoryDetail extends BaseItemResponse {
  kpi: string;
  kpi_bonus: string;
  direct_bonus: string;
  sales_revenue: string;
  month: string;
  staff: ResponseStaffItem;
  staff_id: number;
  staff_position: any;
  position_setting: PositionCurrent;
  position_setting_id: number;
}
