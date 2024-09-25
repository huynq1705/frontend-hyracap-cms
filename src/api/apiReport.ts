import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
} from "@/types/types";

import { PayLoadGetCommissions, ResponseCommissionsItem } from "@/types/commissions";
import { ListPrepaidCard, PayLoadGetReportAccount, PayLoadGetReportCommissions, PayLoadGetReportPaymentMethod, PayLoadGetReportProduct, PayLoadGetReportRevenue, PayLoadGetReportRevenuePaymentMethod, PayLoadGetReportService, ReportAccount, ReportCommission, ReportEvaluationCriteria, ReportPaymentMethod, ReportPrepaidCard, ReportProduct, ReportRevenue, ReportRevenuePaymentMethod, ReportService, ReportTreatment } from "@/types/report";
type CommissionsService = {
    getReportCommissions: (
        param: PayLoadGetReportCommissions,
    ) => Promise<ResponseFromServerV1<ReportCommission>>;
    getReportProduct: (
        param: PayLoadGetReportProduct,
    ) => Promise<ResponseFromServerV1<ReportProduct>>;
    getReportService: (
        param: PayLoadGetReportService,
    ) => Promise<ResponseFromServerV1<ReportService>>;
    getReportAccount: (
        param: PayLoadGetReportAccount,
    ) => Promise<ResponseFromServerV1<ReportAccount>>;
    getReportEvaluationCriteria: (
    ) => Promise<ResponseFromServerV1<ReportEvaluationCriteria>>;
    getReportRevenue: (
        param: PayLoadGetReportRevenue,
    ) => Promise<ReportRevenue>;
    getReportPaymentMethod: (
        param: PayLoadGetReportPaymentMethod,
    ) => Promise<ReportPaymentMethod>;
    getReportRevenuePaymentMethod: (
        param: PayLoadGetReportRevenuePaymentMethod,
    ) => Promise<ReportRevenuePaymentMethod>;
    getReportPrepaidCard: (
        param: PayLoadGetReportRevenue,
    ) => Promise<ReportPrepaidCard>;
    getReportTreatment: (
        param: PayLoadGetReportRevenue,
    ) => Promise<ReportTreatment>;
    exportReportService: (
        param: PayLoadGetReportService,
    ) => Promise<ResponseFromServerV1<ReportService>>;
    // getTotalCommissions: (
    //     id: number,
    //     month ?: string
    // ) => Promise<ResponseFromServerV1<number>>;
};
export default function apiReportService(): CommissionsService {
    const httpClient = useHttpClient();
    const getReportCommissions = (params: PayLoadGetReportCommissions): Promise<ResponseFromServerV1<ReportCommission>> => {
        const paramRaw: any = {
            month: params.month,
            account_id: params.account_id,
            page: params.page || 1,
            limit: params.limit || 10,
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ReportCommission>>(
            `${AppConfig.REPORT.GET_REPORT_COMMISSION(queryParams)}`,
        );
    };
    const getReportProduct = (params: PayLoadGetReportProduct): Promise<ResponseFromServerV1<ReportProduct>> => {
        const paramRaw: any = {
            month: params.month,
            page: params.page,
            limit: params.limit
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ReportProduct>>(
            `${AppConfig.REPORT.GET_REPORT_PRODUCT(queryParams)}`,
        );
    };
    const getReportService = (params: PayLoadGetReportService): Promise<ResponseFromServerV1<ReportService>> => {
        const paramRaw: any = {
            month: params.month,
            service_catalog_id: params.service_catalog_id,
            page: params.page,
            limit: params.limit
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ReportService>>(
            `${AppConfig.REPORT.GET_REPORT_SERVICE(queryParams)}`,
        );
    };
    const getReportAccount = (params: PayLoadGetReportAccount): Promise<ResponseFromServerV1<ReportAccount>> => {
        const paramRaw: any = {
            startDate: params.startDate,
            endDate: params.endDate,
            type: params.type,
            page: params.page,
            limit: params.limit
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ReportAccount>>(
            `${AppConfig.REPORT.GET_REPORT_ACCOUNT(queryParams)}`,
        );
    };
    const getReportEvaluationCriteria = (): Promise<ResponseFromServerV1<ReportEvaluationCriteria>> => {

        return httpClient.get<ResponseFromServerV1<ReportEvaluationCriteria>>(
            `${AppConfig.REPORT.GET_REPORT_EVALUATION_CRITERIA}`,
        );
    };
    const getReportRevenue = (params: PayLoadGetReportRevenue): Promise<ReportRevenue> => {
        const paramRaw: any = {
            month: params.month,
            executor_staff_id: params.executor_staff_id,
            contact_staff_id: params.contact_staff_id,
            customer_source_id: params.customer_source_id,
            payment_method_id: params.payment_method_id,
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ReportRevenue>(
            `${AppConfig.REPORT.GET_REPORT_REVENUE(queryParams)}`,
        );
    };
    const getReportPaymentMethod = (params: PayLoadGetReportPaymentMethod): Promise<ReportPaymentMethod> => {
        const paramRaw: any = {
            month: params.month,
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ReportPaymentMethod>(
            `${AppConfig.REPORT.GET_REPORT_PAYMENT_METHOD(queryParams)}`,
        );
    };
    const getReportRevenuePaymentMethod = (params: PayLoadGetReportRevenuePaymentMethod): Promise<ReportRevenuePaymentMethod> => {
        const paramRaw: any = {
            month: params.month,
            payment_method_id: params.payment_method_id,
            page: params.page,
            limit: params.limit,
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ReportRevenuePaymentMethod>(
            `${AppConfig.REPORT.GET_REPORT_REVENUE_PAYMENT_METHOD(queryParams)}`,
        );
    };
    const getReportPrepaidCard = (params: PayLoadGetReportRevenue): Promise<ReportPrepaidCard> => {
        const paramRaw: any = {
            month: params.month,
            executor_staff_id: params.executor_staff_id,
            contact_staff_id: params.contact_staff_id,
            customer_source_id: params.customer_source_id,
            payment_method_id: params.payment_method_id,
            page: params.page || 1,
            limit: params.limit || 10
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ReportPrepaidCard>(
            `${AppConfig.REPORT.GET_REPORT_PREPAID_CARD(queryParams)}`,
        );
    };
    const getReportTreatment = (params: PayLoadGetReportRevenue): Promise<ReportTreatment> => {
        const paramRaw: any = {
            month: params.month,
            executor_staff_id: params.executor_staff_id,
            contact_staff_id: params.contact_staff_id,
            customer_source_id: params.customer_source_id,
            payment_method_id: params.payment_method_id,
            page: params.page || 1,
            limit: params.limit || 10
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ReportTreatment>(
            `${AppConfig.REPORT.GET_REPORT_TREATMENT(queryParams)}`,
        );
    };
    const exportReportService = (params: PayLoadGetReportService): Promise<ResponseFromServerV1<ReportService>> => {
        const paramRaw: any = {
            month: params.month,
            service_catalog_id: params.service_catalog_id,
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<ReportService>>(
            `${AppConfig.REPORT.GET_REPORT_SERVICE(queryParams)}`,
        );
    };
    // const getTotalCommissions = (id : number , month ?: string): Promise<ResponseFromServerV1<number>> => {
    //     const paramRaw: any = {
    //         month: month || "",
    //     }
    //     const queryParams = Utils.parseObjectToParam(paramRaw);
    //     return httpClient.get<ResponseFromServerV1<number>>(
    //         `${AppConfig.COMMISSION.GET_TOTAL_COMMISSION(`/${id}` + queryParams)}`,
    //     );
    // };
    return {
        getReportCommissions,
        getReportProduct,
        getReportService,
        getReportAccount,
        getReportEvaluationCriteria,
        getReportRevenue,
        getReportPaymentMethod,
        getReportRevenuePaymentMethod,
        getReportPrepaidCard,
        getReportTreatment,
        exportReportService
        // getTotalCommissions
    };
}
