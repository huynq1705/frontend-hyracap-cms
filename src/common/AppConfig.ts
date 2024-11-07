export default class AppConfig {
    static ACCESS_TOKEN = "access_token";
    static REFRESH_TOKEN = "refresh_token";
    static LANG_TOKEN = "lang";
    static DEVICE_TYPE = "web-sdk";
    static PROJECT_NAME_TOKEN = "project_name";
    static API_URL = import.meta.env.VITE_APP_BASE_API_URL;

    static HISTORY = {
        GET_HISTORY: (params: string) => `/interestRateHistory${params}&`,
        END_POINT: "/interestRateHistory",
    };
    static CONTRACT = {
        GET_CONTRACT: (params: string) => `/contract${params}&`,
        END_POINT: "/contract",
    };
    static TRANSACTION = {
        GET_TRANSACTION: (params: string) => `/transaction${params}&`,
        END_POINT: "/transaction",
    };
    static PRODUCT = {
        GET_PRODUCT: (params: string) => `/products${params}&`,
        END_POINT: "/products",
    };
    static PRODUCT_CATEGORY = {
        GET_PRODUCT_CATEGORY: (params: string) => `/product-category${params}`,
        END_POINT: "/product-category",
    };
    static ACCOUNT = {
        GET_ACCOUNT: (params: string) => `/users${params}`,
        END_POINT: "/users",
    };
    static SETTING = {
        GET_SETTING: (params: string) => `/setting${params}`,
        END_POINT: "/setting",
    };
    static AUTH = {
        SIGN_IN: `/auth/login`,
        SIGN_UP: `/account`,
    };
    static USER = {
        GET_PROFILE: `users/me`,
        GET_ALL: `all-user`,
    };
    static POSITION = {
        GET_POSITION: (params: string) => `/position${params}`,
        END_POINT: `/position`,
    };
    static STAFF = {
        GET_STAFF: (params: string) => `/staff${params}&`,
        END_POINT: `/staff`,
    };
    static BLOG_CATEGORY = {
        GET_BLOG_CATEGORY: (params: string) => `/blog_category${params}&`,
        END_POINT: `/blog_category`,
    };
    static BLOG = {
        GET_BLOG: (params: string) => `/blog${params}&`,
        END_POINT: `/blog`,
    };
    static INDUSTRY = {
        GET_INDUSTRY: (params: string) => `/industry${params}&`,
        END_POINT: `/industry`,
    };
    static PROJECT = {
        GET_PROJECT: (params: string) => `/project${params}&`,
        END_POINT: `/project`,
    };
    static SALE_HISTORY = {
        GET_SALE_HISTORY: (params: string) => `/sale_history${params}`,
        END_POINT: `/sale_history`,
    };
    static ROLE = {
        GET_ROLE: (params: string) => `/role${params}`,
        END_POINT: `/role`,
    };
    static ROLE_ACCOUNT = {
        GET_ROLE_ACCOUNT: (params: string) => `/role-account${params}`,
        END_POINT: `/role-account`,
    };
    static GENERAL_SETTING = {
        GET_GENERAL_SETTING: (params: string) => `/general-setting${params}`,
        END_POINT: `/general-setting`,
    };
}
