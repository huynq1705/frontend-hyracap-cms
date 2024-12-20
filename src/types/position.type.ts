import { BaseItemResponse } from "./types";

export interface ResponsePositionItem extends BaseItemResponse {
  name: string;
  current_position_setting: PositionCurrent;
}

export interface PositionCurrent {
  id: number;
  created_at: string;
  updated_at: string;
  effective_from: string;
  direct_bonus_rate: string;
  kpi_bonus_base: string;
  monthly_average_target: string;
  management_bonus_rate: string;
  position_id: number;
}
export interface PayloadPosition {
  name: string;
  setting: {
    effective_from: string;
    direct_bonus_rate: string;
    kpi_bonus_base: string;
    monthly_average_target: string;
    management_bonus_rate: string;
  };
}
