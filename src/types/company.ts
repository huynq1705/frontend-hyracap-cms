import { BaseItemResponse } from "./types";



export interface ResponseCompanyItem extends BaseItemResponse {
    company_avt: string,
    company_name: string,
    phone_number: string,
    email: string,
    address: string,
    city: string,
    district: string,
    ward: string,
    website: string,
    facebook: string,
    zalo: string,
    short_description: string,
    business_introduction: string,
    opening_and_closing_hour: {
        monday:string,
        tuesday: string,
        wednesday:string,
        thursday:string,
        friday:string,
        saturday:string,
        sunday: string
    }
}

export interface PayloadCompany {
    id : number,
    company_avt: string,
    company_name: string,
    phone_number: string,
    email: string,
    address: string,
    city: string,
    district: string,
    ward: string,
    website: string,
    facebook: string,
    zalo: string,
    short_description: string,
    business_introduction: string,
    opening_and_closing_hour: {
        monday: string,
        tuesday: string,
        wednesday: string,
        thursday: string,
        friday: string,
        saturday: string,
        sunday: string
    }
}

