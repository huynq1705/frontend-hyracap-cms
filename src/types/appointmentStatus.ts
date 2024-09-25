import { BaseItemResponse } from "./types";

export interface ResponseAppointmentStatusItem extends BaseItemResponse {
  name: string;
  color: string;
}

export interface ResponseAppointmentStatusItemConvert extends BaseItemResponse {
  name: string;
  color: string;
}
export interface PayloadAppointmentStatus {
  name: string;
  color: string;
}
export interface StatusScheduleArray {
  id?: number;
  name: string;
  color: string;
  total: number | string;
}
