import { ResponseProductTypeItem } from "@/types/productType";
import Utils from "@/utils/utils";

import useHttpClient from "./useHttpClient";
import AppConfig from "@/common/AppConfig";
import { ResponseFromServerV1 } from "@/types/types";

type ProductTypeService = {
  getProductType: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseProductTypeItem[]>>;
};
export default function apiProductTypeService(): ProductTypeService {
  const httpClient = useHttpClient();
  //  thêm param
  const getProductType = (param?: any): Promise<any> => {
    //  thêm param
    const paramRaw: any = param ?? {
      page: 1,
       take: 10,
      filter_str: "",
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    // end point
    return httpClient.get<any>(
      `${AppConfig.PRODUCT_TYPE.GET_PRODUCT_TYPE(queryParams)}`,
    );
  };

  return {
    getProductType,
  };
}
