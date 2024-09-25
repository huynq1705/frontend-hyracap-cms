export default class AppConfig {
    static ACCESS_TOKEN = "access_token";
    static REFRESH_TOKEN = "refresh_token";
    static LANG_TOKEN = "lang";
    static DEVICE_TYPE = "web-sdk";
    static PROJECT_NAME_TOKEN = "project_name";
    static API_URL = import.meta.env.VITE_APP_BASE_API_URL;

    static REPORT = {
        GET_TOTAL: (params: string) => `/report1${params}`,
        GET_TIMESERIES: (params: string) => `/report-timeseries1${params}`,
        GET_ALL_REQUEST: (params: string) => `/all-request1${params}`,
        GET_ALL_REQUEST_OVERVIEW: (params: string) =>
            `/all-request-overview1${params}`,
        GET_REPORT_COMMISSION: (params: string) =>
            `/report/commissions${params}`,
        GET_REPORT_PRODUCT: (params: string) =>
            `/report/product${params}`,
        GET_REPORT_SERVICE: (params: string) =>
            `/report/service${params}`,
        GET_REPORT_ACCOUNT: (params: string) =>
            `/report/account${params}`,
        GET_REPORT_EVALUATION_CRITERIA:
            `/report/evaluation-criteria?order=DESC`,
        GET_REPORT_REVENUE: (params: string) =>
            `/report/revenue${params}`,
        GET_REPORT_PAYMENT_METHOD: (params: string) =>
            `/report/payment-method${params}`,
        GET_REPORT_REVENUE_PAYMENT_METHOD: (params: string) =>
            `/report/revenue/payment-method${params}`,
        GET_REPORT_PREPAID_CARD: (params: string) =>
            `/report/revenue/prepaid-card${params}`,
        GET_REPORT_TREATMENT: (params: string) =>
            `/report/revenue/treatment${params}`,
    };
    static RATE_SERVICE = {
        GET_RATE_SERVICE: (params: string) => `/rate-service${params}`,
    };
    static PREPAID_CARD_FACE_VALUE = {
        GET_PREPAID_CARD_FACE_VALUE: (params: string) =>
            `/prepaid-card-face-value${params}`,
        END_POINT: "/prepaid-card-face-value",
    };
    static PREPAID_CARD_FACE = {
        GET_PREPAID_CARD_FACE: (params: string) =>
            `/order-detail-information/prepaid${params}`,
        END_POINT: "/order-detail/prepaid",
    };
    static ORDER_DETAIL_TREATMENT = {
        GET_ORDER_DETAIL_TREATMENT: (params: string) =>
            `/order-detail-information/treatment${params}`,
        END_POINT: "/order-detail-information/treatment",
    };
    static TREATMENT_CARD = {
        GET_TREATMENT_CARD: (params: string) => `/treatment${params}`,
        END_POINT: "/treatment",
    };
    static PAYMENT_METHODS = {
        GET_PAYMENT_METHODS: (params: string) => `/payment-methods${params}`,
        END_POINT: "/payment-methods",
    };
    static SCHEDULE = {
        GET_SCHEDULE: (params: string) => `/schedule${params}`,
        END_POINT: "/schedule",
    };
    static SCHEDULE_HISTORY = {
        GET_SCHEDULE_HISTORY: (params: string) =>
            `/schedule-edit-history${params}`,
        END_POINT: "/schedule-edit-history",
    };
    static CONFIG_SCHEDULE = {
        GET_CONFIG_SCHEDULE: (params: string) => `/config-schedule${params}`,
        END_POINT: "/config-schedule",
    };
    static CUSTOMER_NOTE = {
        GET_CUSTOMER_NOTE: (params: string) => `/customer-note${params}`,
        END_POINT: "/customer-note",
    };
    static CUSTOMER = {
        GET_CUSTOMER: (params: string) => `/customer${params}`,
        END_POINT: "/customer",
    };
    static CUSTOMER_SOURCE = {
        GET_CUSTOMER_SOURCE: (params: string) => `/customer-source${params}`,
        END_POINT: "/customer-source",
    };
    static ORDER = {
        GET_ORDER: (params: string) => `/order${params}`,
        END_POINT: "/order",
    };
    static PRODUCT = {
        GET_PRODUCT: (params: string) => `/products${params}&`,
        END_POINT: "/products",
    };
    static PRODUCT_CATEGORY = {
        GET_PRODUCT_CATEGORY: (params: string) => `/product-category${params}`,
        END_POINT: "/product-category",
    };
    static PRODUCT_TYPE = {
        GET_PRODUCT_TYPE: (params: string) => `/product-type${params}`,
        END_POINT: "/product-type",
    };
    static SERVICE = {
        GET_SERVICE: (params: string) => `/service${params}`,
        END_POINT: "/service",
        TOTAL: "/service/header-service",
    };
    static SERVICE_CATALOG = {
        GET_SERVICE_CATALOG: (params: string) => `/service-catalog${params}`,
        END_POINT: "/service-catalog",
    };
    static PAYMENT_METHOD = {
        GET_PAYMENT_METHOD: (params: string) => `/payment-methods${params}`,
        END_POINT: "/payment-methods",
    };
    static ACCOUNT = {
        GET_ACCOUNT: (params: string) => `/account${params}`,
        CHANGE_PASS: "/change-password",
        RESET_PASS: "/reset-password",
        END_POINT: "/account",
        TOTAL: (params: string) => `/account/position/statistical${params}`,
    };
    static APPOINTMENT_STATUS = {
        GET_APPOINTMENT_STATUS: (params: string) =>
            `/status-schedule?order=ASC${params}`,
        END_POINT: "/status-schedule",
    };
    static AUTH = {
        SIGN_IN: `/auth/login`,
        SIGN_UP: `/account`,
    };
    static USER = {
        GET_PROFILE: `account/me`,
        GET_ALL: `all-user`,
    };

    static CUSTOMER_CLASSIFICATION = {
        GET_CUSTOMER_CLASSIFICATION: (params: string) =>
            `/customer-classification${params}`,
        END_POINT: "/customer-classification",
    };
    static EVALUATION_CRITERIA = {
        GET_EVALUATION_CRITERIA: (params: string) =>
            `/evaluation-criteria${params}`,
        END_POINT: `/evaluation-criteria`,
    };
    static POSITION = {
        GET_POSITION: (params: string) => `/permission${params}`,
        END_POINT: `/permission`,
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
    static WORK_SCHEDULE = {
        GET_WORK_SCHEDULE: (params: string) => `/work-schedule${params}`,
        END_POINT: `/work-schedule`,
    };
    static STAFF_SALARY = {
        GET_STAFF_SALARY: (params: string) => `/staff-salary${params}`,
        END_POINT: `/staff-salary`,
    };
    static COMMISSION = {
        GET_COMMISSION: (params: string) => `/order/list-commissions${params}`,
        GET_TOTAL_COMMISSION: (params: string) =>
            `/order/total-commssions${params}`,
        END_POINT: `/order/list-commissions`,
        EXPORT_COMMISSION: "order/list-commissions/export",
    };
    static ACCOUNT_ORDER = {
        GET_ACCOUNT_ORDER: (params: string) => `/account-order${params}`,
        END_POINT: `/account-order`,
    };
    static COMPANY = {
        GET_COMPANY: (params: string) => `/company-information${params}`,
        END_POINT: `/company-information`,
    };
    static BANK = {
        GET_BANK: (params: string) => `/bank${params}`,
        END_POINT: `/bank`,
    };
}
