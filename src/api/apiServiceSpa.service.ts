import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { PayloadCustomer, ResponseCustomerItem } from "@/types/customer";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { InitCustomerKeys } from "@/constants/init-state/customer";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import {
  PayloadService,
  PayloadServiceCatalog,
  ResponseServiceCatalogItem,
  ResponseServiceItem,
  ResponseTotal,
} from "@/types/service.type";
import {
  InitServiceCatalogKeys,
  InitServiceKeys,
} from "@/constants/init-state/service";
import apiCommonService from "./apiCommon.service";
type ServiceSpaService = {
  getServiceTotal: () => Promise<ResponseFromServerV1<ResponseTotal>>;
  getService: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseServiceItem[]>>;
  getServiceCatalog: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseServiceCatalogItem[]>>;
  postServiceCatalog: (
    payload: InitServiceCatalogKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
  postService: (
    payload: InitServiceKeys,
    requiredKeys: string[],
    images: any[]
  ) => ValidationResult | Promise<any>;
  putServiceStatus: (payload: {
    id: number;
    is_book_online: number;
  }) => Promise<any>;
  putService: (
    payload: InitServiceKeys,
    requiredKeys: string[],
    images: any[]
  ) => ValidationResult | Promise<any>;
  putServiceCatalog: (
    payload: any,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any>;
  deleteCustomer: (payload: string[]) => Promise<boolean>;
};
export default function apiServiceSpaServicerService(): ServiceSpaService {
  const httpClient = useHttpClient();
  const { uploads } = apiCommonService();
  const getServiceTotal = (): Promise<any> => {

    return httpClient.get<any>(`${AppConfig.SERVICE.TOTAL}`);
  };
  const getService = (param?: any): Promise<any> => {
    const paramRaw: any = {
      order_by: "id",
      page: 1,
      take :10,
      ...param,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(`${AppConfig.SERVICE.GET_SERVICE(queryParams)}`);
  };
  const getServiceCatalog = (param?: any): Promise<any> => {
    const paramRaw: any = {
      order_by: "id",
      ...param,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(
      `${AppConfig.SERVICE_CATALOG.GET_SERVICE_CATALOG(queryParams)}`,
    );
  };
  const postServiceCatalog = (
    payload: InitServiceCatalogKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadServiceCatalog = {
      name: payload.name?.toString().trim(),
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.SERVICE_CATALOG.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postService = async (payload: InitServiceKeys, requiredKeys: string[], images: any[]) => {
    let image = []

    if (images && images.length > 0) {
      try {
        const files = images.map((file: any) => file.originFileObj);
        try {
          const response = await uploads(files);
          console.log('Upload thành công:', response);
          image = response?.data || []
        } catch {

        }
      } catch (error) {
        // message.error('Lỗi khi upload ảnh!');
      }
    }
    const convert_payload: PayloadService = {
      name: payload.name?.toString().trim(),
      price: Number(payload.price),
      service_catalog_id: Number(payload.service_catalog_id),
      status: Number(payload.status),
      time: Number(payload.time),
      description: payload.description?.toString().trim(),
      is_book_online: Number(payload.is_book_online),
      commission: payload.commission,
      commission_percentage: payload.commission_percentage / 100,
      link_img: Array.from(new Set([...payload.link_img, ...image])),
      link_video : payload.link_video.trim() || ""

    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.SERVICE.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putService = async (payload: InitServiceKeys, requiredKeys: string[], images: any[]) => {
    var imageConfig = []

    const files = images
      .filter((file) => isNaN(Number(file.uid)))
      .map((file: any) => file.originFileObj);
      if (files.length > 0) {
      try {
        const response = await uploads(files);
        console.log('Upload thành công:', response);
        imageConfig = response?.data || []
      } catch {

      }
      
    }

    const convert_payload: PayloadService = {
      name: payload.name?.toString().trim(),
      description: payload.description?.toString().trim(),
      is_book_online: Number(payload.is_book_online),
      price: Number(payload.price),
      service_catalog_id: Number(payload.service_catalog_id),
      status: Number(payload.status),
      time: Number(payload.time),
      commission: payload.commission,
      commission_percentage: payload.commission_percentage / 100,
      link_img: Array.from(new Set([...payload.link_img, ...imageConfig])),
      link_video: payload.link_video.trim()
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);
    console.log(12345);
    
    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.SERVICE.END_POINT + "/" + payload.id,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putServiceStatus = (payload: {
    id: number;
    is_book_online: number;
  }) => {
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.SERVICE.END_POINT + "/" + payload.id,
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
  const putServiceCatalog = (
    payload: InitServiceCatalogKeys,
    requiredKeys: string[],
  ) => {
    const convert_payload: PayloadServiceCatalog = {
      name: payload.name?.toString().trim(),
    };
    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.SERVICE_CATALOG.END_POINT + "/" + payload.id,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const deleteCustomer = (payload: string[]) => {
    return httpClient
      .delete<ResponseFromServerV2<any>>(AppConfig.CUSTOMER.END_POINT, payload)
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getService,
    getServiceCatalog,
    postService,
    postServiceCatalog,
    putService,
    putServiceCatalog,
    deleteCustomer,
    putServiceStatus,
    getServiceTotal
  };
}
