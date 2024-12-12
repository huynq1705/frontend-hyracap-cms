export const INIT_CREATE_PRODUCT: {
    name: string;
    members: string[];
} = {
    name: "",
    members: [],
};
export type InitCreateGroupKeys = typeof INIT_CREATE_PRODUCT;
export const INIT_UPDATE_PRODUCT: {
    id: string;
    name: string;
    members: string[];
} = {
    id: "",
    name: "",
    members: [],
};

export type InitUpdateGroupKeys = typeof INIT_UPDATE_PRODUCT;
