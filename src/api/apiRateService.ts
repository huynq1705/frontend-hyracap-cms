import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
} from "@/types/types";

import { DataRateService, PayLoadGetRateService, ReportRateService } from "@/types/rateService";
type RateService = {
    getRateService: (
        param: PayLoadGetRateService,
    ) => Promise<ResponseFromServerV1<DataRateService[]>>;
   
};
export default function apiRateService(): RateService {
    const httpClient = useHttpClient();
    const getRateService = (params: PayLoadGetRateService): Promise<ResponseFromServerV1<DataRateService[]>> => {
        const paramRaw: any = {
            page:params.page,
            take:params.take,
            startDate:params.startDate,
            endDate:params.endDate,
            evaluation_criteria_id:params.evaluation_criteria_id,
            star:params.star,
            filter:params.filter
        }
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<ResponseFromServerV1<DataRateService[]>>(
            `${AppConfig.RATE_SERVICE.GET_RATE_SERVICE(queryParams)}`,
        );
    };
   
    return {
        getRateService,
    }
       
}
