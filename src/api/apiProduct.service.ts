import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadProduct, ResponseProductItem } from "@/types/product";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { InitProductKeys } from "@/constants/init-state/product";
import { validateRequiredKeys } from "@/utils";
import apiCommonService from "./apiCommon.service";
type ProductService = {
  getProduct: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseProductItem[]>>;
  postProduct: (
    payload: InitProductKeys,
    requiredKeys: string[],
    files: any[],
  ) => any;
  putProduct: (
    payload: any,
    code: string,
    requiredKeys: string[],
    files: any[],
  ) => any;
};
export default function apiProductService(): ProductService {
  const httpClient = useHttpClient();
  const { uploads } = apiCommonService();
  const getProduct = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.PRODUCT.GET_PRODUCT(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postProduct = async (
    payload: InitProductKeys,
    requiredKeys: string[],
    files: any[],
  ) => {
    const convert_payload: PayloadProduct = {
      name: payload.name,
      brand: payload.brand,
      stock: payload.stock,
      original_price: +payload.original_price,
      selling_price: +payload.selling_price,
      product_category_id: +payload.product_category_id || null,
      product_type_id: +payload.product_type_id || null,
      status: payload.status ? 1 : 0,
      description: payload.description,
      commission: payload.commission,
      commission_percentage: +(payload.commission_percentage / 100).toFixed(4),
    };
    if (files.length > 0) {
      try {
        const response = await uploads(
          files.map((file: any) => file?.originFileObj),
        );
        if (response.statusCode === 200) {
          convert_payload.image = response.data;
        }
      } catch (err) {
        throw err;
      }
    }
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.PRODUCT.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putProduct = async (
    payload: InitProductKeys,
    code: string,
    requiredKeys: string[],
    files: any[],
  ) => {
    const fileImg: any[] = [];
    const imageRes: any[] = [];
    files.forEach((it) => {
      it?.isRes ? imageRes.push(it) : fileImg.push(it);
    });
    const convert_payload: PayloadProduct = {
      name: payload.name,
      brand: payload.brand,
      stock: payload.stock,
      original_price: +payload.original_price,
      selling_price: +payload.selling_price,
      product_category_id: +payload.product_category_id,
      product_type_id: +payload.product_type_id,
      status: payload.status ? 1 : 0,
      description: payload.description,
      commission: payload.commission,
      commission_percentage: +(payload.commission_percentage / 100).toFixed(4),
      image: imageRes.map((it) => it.name),
    };
    if (fileImg.length > 0) {
      try {
        const response = await uploads(
          fileImg.map((file: any) => file?.originFileObj),
        );
        if (
          response.statusCode === 200 &&
          Array.isArray(convert_payload.image)
        ) {
          convert_payload.image = [...convert_payload.image, ...response.data];
        }
      } catch (err) {
        throw err;
      }
    }
    const result = validateRequiredKeys(convert_payload, requiredKeys);
    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.PRODUCT.END_POINT + "/" + code,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };

  return {
    getProduct,
    postProduct,
    putProduct,
  };
}
