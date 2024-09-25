import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV1,
    ResponseFromServerV2,
    ValidationResult,
} from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { ResponseCompanyItem } from "@/types/company";
import { InitCompanyKeys } from "@/constants/init-state/company";
import apiCommonService from "./apiCommon.service";
type CustomerService = {
    getCompanyDetail: (
        param?: any,
    ) => Promise<ResponseFromServerV1<ResponseCompanyItem>>;
    postCompany: (
        payload: InitCompanyKeys,
        requiredKeys: string[],
    ) => ValidationResult | Promise<ValidationResult | boolean>;
    putCompany: (
        payload: InitCompanyKeys,
        requiredKeys: string[],
        images: any[]
    ) => Promise<ValidationResult |boolean>;
    deleteCustomer: (payload: string[]) => Promise<boolean>;
};
export default function apiCompanyService(): CustomerService {
    const httpClient = useHttpClient();
    const { uploads } = apiCommonService();
    const getCompanyDetail = (param: string): Promise<any> => {

        return httpClient.get<ResponseCompanyItem>(`${AppConfig.COMPANY.END_POINT}/${param}`);
    };
    const postCompany = (
        payload: InitCompanyKeys,
        requiredKeys: string[],
    ) => {
      
        const result = validateRequiredKeys(payload, requiredKeys);

        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.PAYMENT_METHOD.END_POINT,
                payload,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                if (res.statusCode === 409) {
                    return {
                        isValid: true,
                        missingKeys: ["name"]
                    };
                }
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putCompany = async (
        payload: InitCompanyKeys,
        requiredKeys: string[],
        images: any[]
    ): Promise<ValidationResult | boolean> => {
        // const convert_payload: PayloadCompany = {
        //     name: payload.name?.toString().trim(),
        //     status: payload.status,
        //     bank_id: payload.bank_id,
        //     name_account: payload?.name_account?.toString().trim(),
        //     number_account: payload?.number_account
        // };
        const result = validateRequiredKeys(payload, requiredKeys);
        if (!result.isValid) return result;

        if (images.length > 0) {
            try {
                const files = images.map((file: any) => file.originFileObj);
                try {
                    const response = await uploads(files);
                    console.log('Upload thành công:', response);
                    payload.company_avt = response.data[0]
                } catch {

                }
            } catch (error) {
                // message.error('Lỗi khi upload ảnh!');
            }
        }
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.COMPANY.END_POINT + "/" + payload.id,
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
            .delete<ResponseFromServerV2<any>>(AppConfig.COMPANY.END_POINT, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res.statusCode === 200;
            })
            .catch((err) => {
                throw err;
            });
    };
    return {
        getCompanyDetail,
        postCompany,
        putCompany,
        deleteCustomer,
    };
}
