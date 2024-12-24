import { AlertProps } from "@mui/material";
import React from "react";
import { RouteObject } from "react-router-dom";
import { ItemResponseData } from "./response.type";

export type NavList = {
  subheader?: React.ReactNode;
  items: NavItem[];
  key: string;
};

export type NavItem = {
  label: React.ReactNode;
  icon?: React.ReactNode;
  key: string;
  children?: NavItem[];
  onClick?: () => void;
  type?: "link";
  hidden?: boolean;
  betaItem?: boolean;
  role?: UserRole[];
  title?: boolean;
};

export type RouteExtends = Omit<RouteObject, "children"> & {
  canGuard?: boolean;
  children?: RouteExtends[];
  roles?: UserRole[];
  isPagePublic?: boolean;
};

export type Lang = "en" | "vi";

export type GlobalNotiProp = {
  message: any;
  autoHideDuration?: number | null;
  type?: any;
  [x: string]: any;
};

export type UserRole = "user" | "admin";
export type UserInfo = {
  email: string;
  family_name: string;
  given_name: string;
  name: string;
  role: { name: UserRole; role_permission: PermissionType[] };
};

export type SessionFileType =
  | "front"
  | "back"
  | "chip_portrait"
  | "video"
  | "selfies";

export type RequestType =
  | "idr"
  | "passport"
  | "dlr"
  | "liveness"
  | "check_chip";

export type ReportAPIFileType = "front" | "back" | "video";

export type IdrResponse = {
  data: Record<string, string>;
};

export type PassPortResponse = {
  data: Record<string, string>;
};

export type CheckChipResponse = {
  data: Record<string, string>;
};

export type DrlResponse = {
  data: Record<string, string>;
};

export type LivenessResponse = {
  data: Record<string, string>;
};

export type IDR_Response = {
  data: Record<string, string>[];
};

export type Checkchip_Response = {
  data: Record<string, string>[];
};

export type Passport_Response = {
  data: Record<string, string>[];
};

export type DRL_Response = {
  data: Record<string, string>[];
};

export type Liveness_Response = {
  liveness: Record<string, string>[];
  face_match: Record<string, string>[];
};

export type DateRangeDateType = "start_time" | "end_time";
export type DateRangeValue = {
  [key in DateRangeDateType]: string;
};

export type DataViewType = "list" | "grid";

export type DemoDocumentType = "idr" | "passport" | "dlr";

export type OcrDemoFormType = {
  country: CountryCode;
  documentType: DemoDocumentType;
  front: File;
  back: File;
};

export type LivenessDemoFormType = {
  key: string;
  front: File;
  video: File;
};

export type LivematchDemoFormType = {
  image1: File | undefined;
  image2: File | undefined;
};

export type CountryCode = "vn" | "fil" | "idn";

export type PermissionType =
  | "account.getList"
  | "account.getDetail"
  | "account.create"
  | "account.update"
  | "account.delete"
  | "customer.getList"
  | "customer.getDetail"
  | "customer.create"
  | "customer.update"
  | "customer.delete"
  | "role.getList"
  | "role.getDetail"
  | "role.update"
  | "role.delete"
  | "role.create"
  | "permission.getList"
  | "permission.getDetail"
  | "permission.create"
  | "permission.update"
  | "permission.delete"
  | "costs_incurred.getList"
  | "costs_incurred.getDetail"
  | "costs_incurred.create"
  | "costs_incurred.update"
  | "costs_incurred.delete"
  | "index_electricity.getList"
  | "index_electricity.getDetail"
  | "index_electricity.create"
  | "index_electricity.update"
  | "index_electricity.delete"
  | "index_water.getList"
  | "index_water.getDetail"
  | "index_water.create"
  | "index_water.update"
  | "index_water.delete"
  | "invoice.getList"
  | "invoice.getDetail"
  | "invoice.create"
  | "invoice.update"
  | "invoice.delete"
  | "contract_service.getList"
  | "contract_service.getDetail"
  | "contract_service.create"
  | "contract_service.update"
  | "contract_service.delete"
  | "contract.getList"
  | "contract.getDetail"
  | "contract.create"
  | "contract.update"
  | "contract.delete"
  | "upload_img.createFiles"
  | "upload_img.createFile"
  | "statistic.getDetailByMonth"
  | "statistic.getDetailByYear"
  | "statistic.getCountRoom"
  | "management_expense.getList"
  | "management_expense.getDetail"
  | "management_expense.create"
  | "management_expense.update"
  | "management_expense.delete"
  | "customer_contract.getList"
  | "customer_contract.getDetail"
  | "customer_contract.create"
  | "customer_contract.update"
  | "customer_contract.delete";

export type RouteLoaderType = {
  userInfo: Promise<UserInfo>;
};

export type FilterDayRange = number;

export type ReportFilterOption = {
  dayRange: {
    [key in DateRangeDateType]: Date;
  };
  email: string[] | string;
};

export type TabContainerOption = {
  label: React.ReactNode;
  key: string;
  component: React.ReactNode;
};

export type ApiStatusType =
  | "success"
  | "client_error"
  | "system_error"
  | "total_requests";

export type SessionResponseData = {
  type: keyof ItemResponseData;
  response: Record<string, string>;
};

export type TourElementPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface BaseItemResponse {
  id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
interface MetaRes {
  page: string;
  take: string;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
export interface ResponseFromServerV1<T> {
  data: T;
  meta?: MetaRes;
}

export interface ResponseFromServerV2<T> {
  statusCode: number;
  status: boolean;
  error: string[];
  data: T;
}

export interface ResponseFromServerV3<T> {
  error: boolean;
  errorReason: string;
  toastMessage: string;
  object: {
    reftransactionid: string;
  };
  data: T;
}

export interface GroupOption {
  title: string;
  options: {
    value: string;
    name: string;
  }[];
}
[];
export interface ValidationResult {
  isValid: boolean;
  missingKeys: string[];
}
export type OptionSelect = {
  value: string;
  label: string;
}[];
export type OptionSelect2 = {
  key: string;
  value: string;
}[];
export interface KeySearchType {
  [x: string]: string | number | boolean | any;
}
