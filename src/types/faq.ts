import { BaseItemResponse } from "./types";

export interface ResponseFaqItem extends BaseItemResponse {
  question: string;
  answer: string;
}
