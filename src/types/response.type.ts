import { PaginationQuery } from "./payload.type";
import {
    Checkchip_Response,
    DRL_Response,
    IDR_Response,
    Liveness_Response,
    Passport_Response,
    RequestType,
    SessionFileType,
    UserInfo,
} from "./types";
export type ProfileResponse = {
    email: string;
    id: string;
    name: string;
    roles: string[];
    super_user: boolean;
};

export type SignInResponse = {
    metadata: any;
    data: {
        access_token: string;
    };
};

export type SignInError = {
    errorCode: string;
    errorMessage: string;
};

export type SignUpError = {
    errorMessage: Record<string, string>;
};

export type SessionDataItem = {
    request_time: Date | string;
    status: SesssionStatusEnum;
    uuid: string;
    request_type: DocumentRequestType;
    country: DocumentCountryType;
    email: string;
    client_uuid: string | null;
    modified_time: Date | string;
};

export type CollectionDataResponse = {
    enable_collection: boolean;
    collection_check_list: CollectionItemData[];
    face_search: {
        selfie: Record<string, string>;
        document: Record<string, string>;
    };
    document_search: Record<string, string>;
    condition_to_create_new_profile: [
        {
            type: string;
        }
    ];
    time_to_keep_data: {
        selfie: string;
        document_face: string;
        ocr_data: string;
    };
};

export type CollectionItemData = {
    enable: boolean;
    collection_name: string;
    uuid_field_name: string;
    action: number; // enum
};

export type CollectionError = {
    code: string;
    message: string;
};

export type RequestDataItem = {
    request_time: Date | string;
    type: RequestType;
    status: number;
    latency: string;
    uuid: string;
    email: string;
    cloud_paths: any;
    response: DocumentAPIResponse;
};

export enum CollectionEnum {
    REJECT = 0,
    RETURN_IN_RESPONSE = 1,
}

export type DocumentRequestType = "idr" | "dlr" | "passport";
export type DocumentCountryType = "vi" | "fil" | "idn";

export enum SesssionStatusEnum {
    NOT_COMPLETE = 0, // notCompleted
    SUCCESS = 1, //success
    OCR_FAILED = 2,
    CHECK_CHIP_FAILED = 3,
    TIME_OUT = 4, // timeout
    UNKNOWN_FACE_CHECK_FAIL = 30,
    LIVENESS_CHECK_FAIL = 31,
    DEEP_FAKE_CHECK_FAIL = 32,
    NOT_MATCH = 33,
    FACE_QUALITY_CHECK_FAIL = 34,
    // > 10000 => custom status
    FAILED = 10001,
}
export type PaginationResponse<T> = PaginationQuery<T> & {
    total: number;
    data: T[];
};

export type SessionResponse = PaginationResponse<SessionDataItem>;

export type ReportTotalResponse = {
    total_requests: number;
    total_request_success: number;
    total_request_client_error: number;
    total_request_system_error: number;
};

export type SessionTotalResponse = {
    total_session_check_chip_failed: number;
    total_session_deep_fake_check_fail: number;
    total_session_face_quality_check_fail: number;
    total_session_liveness_check_fail: number;
    total_session_not_complete: number;
    total_session_not_match: number;
    total_session_ocr_failed: number;
    total_session_success: number;
    total_session_unknown_face_check_fail: number;
    total_session: number;
};

export type RequestStatusStatistic = {
    success: number;
    client_error: number;
    system_error: number;
    total_requests: number;
};
export type TimeseriesStatistic<T extends string> = {
    [key in T]: number;
} & {
    date: string;
};
export type SessionItemResponse = {
    // data: SessionData[],
    status: SesssionStatusEnum;
    errorMessage: string;
    deleted: boolean;
    files: SessionItemData;
    requests_history: RequestHistoryData[];
    response: ItemResponseData;
};
export type RequestHistoryResponse = {
    // idr
    response: Record<string, string>;
    deleted: boolean;
    files: RequestHistoryFile[];
    document_type: RequestType;
    request_type: RequestType;
};
type RequestHistoryFile = {
    type: "image" | "video";
    url: string;
};

export type SessionItemData = {
    [key in SessionFileType]?: string;
};

export type ItemResponseData = {
    liveness?: Record<string, string>;
    ocr?: Array<{
        key: string;
        name: string;
        value: string;
        score: string;
        locale: string;
    }>;
    nfc?: Array<{
        key: string;
        value: string;
    }>;
    collection?: Record<string, string>;
};

export type RequestHistoryData = {
    api_time: number;
    request_time: string;
    detail: string;
    request_id: string;
    result: string;
    request_type: string;
};
export type SessionData = {
    name: SessionFileType;
    cloud_path: string;
    response: DocumentResponse;
    request_id: string;
};

export type CommonDocReponse = {
    name: string;
    dob: string;
    nationality: string;
    doe: string;
    doi: string;
    poi: string;
    type: string;
};

export type IdResponse = CommonDocReponse & {
    sex: string;
    home: string;
    address: string;
    features: string;
    mrz_1: string;
    mrz_2: string;
    mrz_3: string;
    qrcode: string;
};

export type DLReponse = CommonDocReponse & {
    address: string;
    class: string;
};

export type PPResponse = CommonDocReponse & {
    sex: string;
    mrz_1: string;
    mrz_2: string;
    passportno: string;
    class: string;
    pob: string;
};

export type DocumentResponse = Partial<IdResponse | DLReponse | PPResponse>;

export type DocumentAPIResponse = Partial<
    | IDR_Response
    | Passport_Response
    | DRL_Response
    | Liveness_Response
    | Checkchip_Response
>;

export type RequestDataResponse = PaginationResponse<RequestDataItem>;

export type RequestOverviewResponse = {
    details_file_type: RequestStats[];
};

export type RequestStats = RequestStatusStatistic & {
    // type: RequestType,
    type: string;
};

export type SignUpResponse = {
    statusCode: number;
    status: boolean;
    error: string;
};

export type InternalUserResponse = {
    id: string;
    totp: boolean;
};

export type DemoResponse = {
    errorCode: string;
    errorMessage: string;
};

export type DemoOcrResponse = DemoResponse & {
    data: DemoOcrData[];
    conclusion: {
        code: string;
        message: string;
        result: "Failed" | "Passed";
    };
};

export type LivematchResponse = {
    code: string;
    message: string;
    data: {
        [key: string]: string;
    };
};

export type DemoOcrData = Record<string, string>;

export type LivenessDemoData = {
    code: string;
    face_match: {
        [key: string]: string;
    };
    liveness: {
        [key: string]: string;
    };
    message: string;
};

export type SdkResponse = {
    data: SdkItem[];
};

export type SdkItem = {
    request_id: string;
    link: string;
    version: string;
    platform: SdkPlatformType;
    request_time: Date;
    country: string;
};

export type SdkPlatformType = "ios" | "android" | "web";

export type ConsoleProjectResponse = {
    project_name: string;
    project_id: string;
    project_name_raw: string;
};

export type QuotasApiType = "liveness" | "facematch";
export type QuotasPaymentType = "free" | "paid";
export type QuotasRemainInfo = {
    [key in QuotasPaymentType]: {
        period: string;
        remaining: number;
    };
};

export type QuotasResponseValue = {
    success: boolean;
    message: string;
    remain: Partial<QuotasRemainInfo>;
    unit: string;
    train_remain: Partial<QuotasRemainInfo>;
};
export type QuotasResponse = {
    [key in QuotasApiType]: Partial<QuotasResponseValue>;
};

export type UserResponse = Array<{
    email: UserInfo["email"];
}>;

export type SessionReportResponse = {
    data: Record<string, Object | string>[];
};
