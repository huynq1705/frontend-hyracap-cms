import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponsePrepaidCardFaceItem } from "@/types/prepaidCardFace";
import { ResponseFromServerV1 } from "@/types/types";
type PrepaidCardFaceService = {
  getPrepaidCardFace: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponsePrepaidCardFaceItem[]>>;
};
export default function apiPrepaidCardFaceService(): PrepaidCardFaceService {
  const httpClient = useHttpClient();
  const getPrepaidCardFace = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      page_size: 20,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(
        `${AppConfig.PREPAID_CARD_FACE.GET_PREPAID_CARD_FACE(queryParams)}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getPrepaidCardFace,
  };
}
