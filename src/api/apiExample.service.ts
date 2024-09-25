import AppConfig from "@/common/AppConfig";
import { RegisterPayload, SignInPayload } from "@/types/payload.type";
import { SignInResponse, SignUpResponse } from "@/types/response.type";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
type ExampleService = {
  getExample: (payload?: SignInPayload) => Promise<SignInResponse>;
};
export default function apiExampleService(): ExampleService {
  const httpClient = useHttpClient();
  const getExample = (): Promise<any> => {
    const paramRaw: any = {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.CUSTOMER.GET_CUSTOMER(queryParams)}`,
    );
  };

  return {
    getExample,
  };
}

// import AppConfig from "@/common/AppConfig";
// import { PaginationQuery, ReportTimeseriesPayload } from "@/types/payload.type";
// import { ReportFilterOption, ApiStatusType } from "@/types/types";
// import { RequestDataItem, ReportTotalResponse, TimeseriesStatistic, RequestDataResponse, RequestOverviewResponse } from "@/types/response.type";
// import Utils from "@/utils/Utils";
// import dayjs from "dayjs";
// import _ from "lodash";
// import useHttpClient from "./useHttpClient";

// type ResultApiReportService = {
//     getReportTotal: (filterOptions: ReportFilterOption) => Promise<ReportTotalResponse>,
//     getReportTimeseries: (filterOptions: ReportFilterOption) => Promise<TimeseriesStatistic<ApiStatusType>[]>,
//     getAllRequest: (paginQuery: PaginationQuery<RequestDataItem>) => Promise<RequestDataResponse>,
//     getAllRequestOverview: (filterOptions: ReportFilterOption) => Promise<RequestOverviewResponse>,
// }

// export default function useApiReportService(): ResultApiReportService {
//     const httpClient = useHttpClient();

//     const getReportTotal = (filterOptions: ReportFilterOption): Promise<ReportTotalResponse> => {
//         const paramRaw: ReportTimeseriesPayload = {
//             start_time: dayjs(filterOptions.dayRange.start_time).format('YYYY-MM-DD'),
//             end_time: dayjs(filterOptions.dayRange.end_time).format('YYYY-MM-DD'),
//             email: filterOptions.email as string,
//         };
//         const queryParams = Utils.parseObjectToParam(paramRaw);
//         return httpClient.get<ReportTotalResponse>(`${AppConfig.REPORT.GET_TOTAL(queryParams)}`);
//     }

//     const getReportTimeseries = (filterOptions: ReportFilterOption): Promise<TimeseriesStatistic<ApiStatusType>[]> => {
//         const paramRaw: ReportTimeseriesPayload = {
//             start_time: dayjs(filterOptions.dayRange.start_time).format('YYYY-MM-DD'),
//             end_time: dayjs(filterOptions.dayRange.end_time).format('YYYY-MM-DD'),
//             email: filterOptions.email as string,
//         };
//         const queryParams = Utils.parseObjectToParam(paramRaw);
//         return httpClient.get<TimeseriesStatistic<ApiStatusType>[]>(`${AppConfig.REPORT.GET_TIMESERIES(queryParams)}`);
//     }

//     const getAllRequest = (paginQuery: PaginationQuery<RequestDataItem>): Promise<RequestDataResponse> => {
//         const queryParams = Utils.parseObjectToParam(paginQuery);
//         return httpClient.get<RequestDataResponse>(`${AppConfig.REPORT.GET_ALL_REQUEST(queryParams)}`);
//     }

//     const getAllRequestOverview = (filterOptions: ReportFilterOption): Promise<RequestOverviewResponse> => {
//         const paramRaw: ReportTimeseriesPayload = {
//             start_time: dayjs(filterOptions.dayRange.start_time).format('YYYY-MM-DD'),
//             end_time: dayjs(filterOptions.dayRange.end_time).format('YYYY-MM-DD'),
//             email: filterOptions.email as string,
//         };
//         const queryParams = Utils.parseObjectToParam(paramRaw);
//         return httpClient.get<RequestOverviewResponse>(`${AppConfig.REPORT.GET_ALL_REQUEST_OVERVIEW(queryParams)}`);
//     }

//     return {
//         getReportTotal,
//         getReportTimeseries,
//         getAllRequest,
//         getAllRequestOverview
//     }
// }
