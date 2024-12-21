import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { PayloadContract, PayloadUpdateContract, ResponseContractItem } from "@/types/contract";
import { InitContractKeys } from "@/constants/init-state/contract";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
type ContractService = {
    getContract: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseContractItem[]>>;
    postContract: (payload: InitContractKeys, requiredKeys: string[]) => any;
    putContract: (payload: any, code: string, requiredKeys: string[]) => any;
    updateContract: (payload:any, id:number, requiredKeys: string[]) => Promise<ResponseFromServerV2<any>> | any;
};
export default function apiContractService(): ContractService {
    const userInfo = useSelector(selectUserInfo);
    const httpClient = useHttpClient();
    const getContract = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.CONTRACT.GET_CONTRACT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postContract = async (
        payload: InitContractKeys,
        requiredKeys: string[]
    ) => {
        console.log("payload", payload);
        const convert_payload: PayloadContract = {
            capital: payload.capital,
            duration: +payload.duration,
            product_id: +payload.product_id,
            user_sub: +payload.user_sub,
            staff_id: userInfo.id,
        };

        console.log("convert_payload", convert_payload);
        const result = validateRequiredKeys(convert_payload, requiredKeys);

        console.log(result);
        if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.CONTRACT.END_POINT,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const putContract = async (
        payload: InitContractKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: PayloadContract = {
            capital: payload.capital,
            duration: +payload.duration,
            product_id: +payload.product_id,
            user_sub: +payload.user_sub,
            staff_id: userInfo.id,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.CONTRACT.END_POINT + "/" + code,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    const updateContract = async (
        payload: any,
        id: number,
        requiredKeys: string[]
    )  => {
        const convert_payload: PayloadUpdateContract = {
            capital: payload.capital,
            duration: +payload.duration,
            status: +payload.status,
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<any>(
                AppConfig.CONTRACT.END_POINT + "/" + id,
                convert_payload,
                {}
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getContract,
        postContract,
        putContract,
        updateContract,
    };
}
