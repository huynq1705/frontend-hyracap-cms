import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";


import apiCommonService from "./apiCommon.service";
import { InitBankKeys } from "@/constants/init-state/bank";
import { ResponseBankItem } from "@/types/bank";
type CustomerService = {
    getBank: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseBankItem[]>>;
    putBank: (
        payload: InitBankKeys,
        requiredKeys: string[],
        images: any[]
    ) => Promise<ValidationResult | boolean>;
    deleteCustomer: (payload: string[]) => Promise<boolean>;
};
export default function apiBankService(): CustomerService {
    const httpClient = useHttpClient();
    const { uploads } = apiCommonService();
    const getBank = (params?: any): Promise<any> => {
        const paramRaw: any = {
            page: 1,
            take: 20,
            ...params
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient.get<any>(
            `${AppConfig.BANK.GET_BANK(queryParams)}`,
        );
    };
    const putBank = async (
        payload: InitBankKeys,
        requiredKeys: string[],
        images: any[]
    ): Promise<ValidationResult | boolean> => {
        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;

        if (images.length > 0) {
            try {
                const files = images.map((file: any) => file.originFileObj);
                try {
                    const response = await uploads(files);
                    console.log('Upload thành công:', response);
                    payload.icon = response.data[0]
                } catch {

                }
            } catch (error) {
                // message.error('Lỗi khi upload ảnh!');
            }
        }
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.BANK.END_POINT + "/" + payload.id,
                payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const deleteCustomer = (payload: string[]) => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(AppConfig.BANK.END_POINT, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getBank,
        putBank,
        deleteCustomer,
    };
}
