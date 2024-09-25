import { BaseItemResponse } from "./types";

export interface ResponseCustomerSourceItem extends BaseItemResponse {
  
  name: string
}

export interface ResponseCustomerSourceItemConvert extends BaseItemResponse {
  
  name: string
}
export interface PayloadCustomerSource {
  
  name: string,
  status : number
}
