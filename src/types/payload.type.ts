import { SdkPlatformType } from "./response.type";
import { DateRangeValue } from "./types";

export type SignInPayload = {
    email: string;
    password: string;
    otp?: string;
};

export type PaginationQuery<T> = {
    page: number;
    page_size: number;
    order_by: keyof T;
    direction: "desc" | "asc";
} & Partial<{
    [key in keyof T]: any;
}> &
    Partial<DateRangeValue>;

export type ReportTimeseriesPayload = Partial<{
    start_time: string;
    end_time: string;
    email: string;
}>;

export type CredentialItem = {
    type: "password";
    value: string;
    temporary: boolean;
};
export type RegisterPayload = {
    account: string;
    password: string;
};

export type UploadSdkPayload = {
    version: string;
    zip_file: File;
    platform: SdkPlatformType;
    country: string;
};
