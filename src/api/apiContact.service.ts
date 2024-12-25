import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import useHttpClient from "./useHttpClient";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import axios from "axios";
import AppConfig from "@/common/AppConfig";
import { ResponseContactItem } from "@/types/contact";
import Utils from "@/utils/utils";

type ContactService = {
  getContact: (
    param?: any
  ) => Promise<ResponseFromServerV1<ResponseContactItem[]>>;
};
export default function apiContactService(): ContactService {
  const httpClient = useHttpClient();
  const getContact = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
      sortBy: "id",
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get(`${AppConfig.API_URL}contact${queryParams}`);
  };
  return {
    getContact,
  };
}
