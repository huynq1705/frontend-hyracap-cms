import { number } from "yup";
import { BaseItemResponse } from "./types";

export interface ResponseServiceItem extends BaseItemResponse {
    id: number,
    name: string,
    time: number,
    price: number,
    price_discount: number,
    price_discount_on_ecom: number,
    status: number,
    service_catalog_id: number,
    is_book_online: number,
    description: string,
    service_catalog: {
        id: number,
        is_active: true,
        name: string
    },
    commission: number,
    commission_percentage : number,
    link_img: string [],
    link_video: string
}

export interface ResponseServiceCatalogItem extends BaseItemResponse {
    id: number,
    name: string,
}


export interface PayloadServiceCatalog {
    name: string,
}

export interface PayloadService {
    name: string,
    time: number,
    price: number,
    status: number,
    service_catalog_id: number,
    is_book_online: number,
    description: string,
    commission: number,
    commission_percentage : number,
    link_img: string [],
    link_video : string
}

export interface ResponseTotal {
    total_active: number,
    total_inactive: number,
    total_online: number
}