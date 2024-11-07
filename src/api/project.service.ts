import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { validateRequiredKeys } from "@/utils";
import { ResponseProjectItem } from "@/types/project.type";
import { InitProjectKeys } from "@/constants/init-state/project";
type ProjectService = {
    getProject: (
        param?: any
    ) => Promise<ResponseFromServerV1<ResponseProjectItem[]>>;
    postProject: (payload: InitProjectKeys, requiredKeys: string[]) => any;
    putProject: (payload: any, code: string, requiredKeys: string[]) => any;
};
export default function apiProjectService(): ProjectService {
    const httpClient = useHttpClient();
    const getProject = (param?: any): Promise<any> => {
        const paramRaw: any = param ?? {
            page: 1,
            take: 10,
        };
        const queryParams = Utils.parseObjectToParam(paramRaw);
        return httpClient
            .get<any>(`${AppConfig.PROJECT.GET_PROJECT(queryParams)}`)
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const postProject = async (
        payload: InitProjectKeys,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: payload.name,
            images: payload.images,
            thumbnail: payload.images[0],
            status: 1,
            capital_raising_target: +payload.valuation,
            mobilized_fund: +payload.funding_amount,
            data: {
                address: payload.address,
                company_size: payload.company_size,
                website: payload.website,
                project_information: {
                    description: payload.project_information_description,
                    valuation: payload.valuation,
                    funding_amount: payload.funding_amount,
                    total_slots: payload.total_slots,
                    price_per_slot: payload.price_per_slot,
                    investors: payload.investors,
                    funding_round: payload.funding_round,
                },
                company_information: {
                    investment_field: payload.investment_field,
                    date_of_establishment: payload.date_of_establishment,
                    head_office: payload.head_office,
                    operating_status: payload.operating_status,
                    founder: payload.founder,
                    company_name: payload.company_name,
                    email: payload.email,
                    phone: payload.phone,
                },
                growth_prospects: payload.growth_prospects,
                metrics: [payload.metrics],
                description: payload.description,
            },
            industry_ids: [+payload.industry_ids],
            pitching_deck: payload.pitching_deck[0],
            contract_template: payload.contract_template[0],
            financial_roadmap: payload.financial_roadmap[0],
            business_plan: payload.business_plan[0],
        };
        console.log("convert_payload", convert_payload);
        // const result = validateRequiredKeys(convert_payload, requiredKeys);

        // console.log(result);
        // if (!result.isValid) return result;
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.PROJECT.END_POINT,
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
    const putProject = async (
        payload: InitProjectKeys,
        code: string,
        requiredKeys: string[]
    ) => {
        const convert_payload: any = {
            name: "Project Alpha",
            images: ["image1.jpg", "image2.jpg"],
            status: 1,
            capital_raising_target: 5000000,
            mobilized_fund: 2500000,
            data: {
                address: "string",
                company_size: "string",
                website: "string",
                project_information: {
                    description: "string",
                    valuation: "string",
                    funding_amount: "string",
                    total_slots: "string",
                    price_per_slot: "string",
                    investors: "string",
                    funding_round: "string",
                },
                company_information: {
                    investment_field: "string",
                    date_of_establishment: "string",
                    head_office: "string",
                    operating_status: "string",
                    founder: "string",
                    company_name: "string",
                    email: "string",
                    phone: "string",
                },
                growth_prospects: "string",
                metrics: ["string"],
                description: "string",
            },
            industry_ids: [1, 2],
            pitching_deck: "pitching_deck.pdf",
            contract_template: "contract_template.pdf",
            financial_roadmap: "financial_roadmap.pdf",
            business_plan: "business_plan.pdf",
        };
        console.log("convert_payload", convert_payload);

        const result = validateRequiredKeys(convert_payload, requiredKeys);
        if (!result.isValid) return result;
        return httpClient
            .put<ResponseFromServerV2<any>>(
                AppConfig.PROJECT.END_POINT + "/" + code,
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
        getProject,
        postProject,
        putProject,
    };
}
