export const INIT_SERVICE = {
    id: 1,
    name: "",
    time: 0,
    price: 0,
    status: 1,
    is_book_online: 1,
    service_catalog_id: 0,
    description: "",
    commission: 0,
    commission_percentage: 0,
    link_img: [],
    link_video: ""
};
export type InitServiceKeys = typeof INIT_SERVICE;
export const INIT_CATALOG = {
    id: 1,
    name: "",
    priority: 1
};
export type InitServiceCatalogKeys = typeof INIT_CATALOG;