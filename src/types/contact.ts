import { BaseItemResponse } from "./types";

export interface ResponseContactItem extends BaseItemResponse {
  name: string;
  email: string;
  phone: string;
  question: string;
  role: number;
}
