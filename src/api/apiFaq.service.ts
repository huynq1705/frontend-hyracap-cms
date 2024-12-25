import { setGlobalNoti } from "@/redux/slices/app.slice";
import axios from "axios";
import AppConfig from "@/common/AppConfig";
import { ResponseFaqItem } from "@/types/faq";
import Utils from "@/utils/utils";
import { ResponseFromServerV1 } from "@/types/types";
import useHttpClient from "./useHttpClient";
import { validateRequiredKeys } from "@/utils";

type FaqService = {
  getFaq: (param?: any) => Promise<ResponseFromServerV1<ResponseFaqItem[]>>;
  postFaq: (payload: any, keyRequired: string[]) => any;
  getFaqById: (id: string) => Promise<ResponseFromServerV1<ResponseFaqItem>>;
  putFaq: (payload: any, id: number, keyRequired: string[]) => any;
};
export default function apiFaqService(): FaqService {
  const httpClient = useHttpClient();
  const getFaq = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
      sortBy: "id",
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get(`${AppConfig.API_URL}faq${queryParams}`);
  };

  const getFaqById = (id: string): Promise<any> => {
    return httpClient
      .get(`${AppConfig.API_URL}faq/${id}`)
      .then((res: any) => res)
      .catch((err: any) => {
        console.log(err);
        return null;
      });
  };

  const postFaq = (payload: any, keyRequired: string[]): any => {
    const convertPayload = {
      question: payload.question,
      answer: payload.answer,
    };
    const missingKeys = validateRequiredKeys(convertPayload, keyRequired);
    if (!missingKeys.isValid) return missingKeys;
    return httpClient
      .post<any>(`${AppConfig.API_URL}faq`, convertPayload)
      .then((res: any) => true)
      .catch((err: any) => {
        console.log(err);
        return null;
      });
  };

  const putFaq = (payload: any, id: number, keyRequired: string[]): any => {
    const convertPayload = {
      question: payload.question,
      answer: payload.answer,
    };
    const missingKeys = validateRequiredKeys(convertPayload, keyRequired);
    if (!missingKeys.isValid) return missingKeys;
    return httpClient
      .put<any>(`${AppConfig.API_URL}faq/${id}`, convertPayload)
      .then((res: any) => true)
      .catch((err: any) => {
        console.log(err);
        return null;
      });
  };

  return {
    getFaq,
    postFaq,
    getFaqById,
    putFaq,
  };
}
