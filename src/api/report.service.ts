import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadReport, ResponseReportItem } from "@/types/report";
import { InitReportKeys } from "@/constants/init-state/report";
type ReportService = {
    getReport: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseReportItem[]>>;
    postReport: (payload: InitReportKeys, requiredKeys: string[]) => any;
    putReport: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiReportService(): ReportService {
    const httpClient = useHttpClient();
    const getReport = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.REPORT.GET_REPORT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postReport = async (
        payload: InitReportKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadReport = {
            name: payload.name,
            type: +payload.type,
            file: payload.file[0],
        };
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.REPORT.END_POINT,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putReport = async (
        payload: InitReportKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadReport = {
            name: payload.name,
            type: +payload.type,
            file: payload.file.length === 1 ? payload.file[0] : payload.file,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.REPORT.END_POINT + "/" + code,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getReport,
        postReport,
        putReport,
    };
}
