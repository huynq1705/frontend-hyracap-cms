import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import { formatDate } from "@/utils/date-time";
import { validateRequiredKeys } from "@/utils";
import {
  PayloadAccount,
  PayloadAccountPass,
  ResponseAccountItem,
  ResponseTotal,
} from "@/types/account.type";
import { InitCustomerKeys } from "@/constants/init-state/employee";
import apiCommonService from "./apiCommon.service";
const exist = ["phone", "email", "username"]
type AccountService = {
  getAccount: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseAccountItem[]>>;
  getAccountTotal: (
    param?: {
      text: string,
      status: number
    }
  ) => Promise<ResponseFromServerV1<ResponseTotal[]>>;
  getAccountDetail: (
    param?: any,
  ) => Promise<ResponseFromServerV1<InitCustomerKeys>>;
  postAccount: (
    payload: InitCustomerKeys,
    requiredKeys: string[],
    images: any[]
  ) => ValidationResult | Promise<
    {
      isValid: boolean;
      missingKeys: string;
    } | any>;
  putAccount: (
    payload: any,
    code: string | number,
    requiredKeys: string[],
    images: any[]
  ) => ValidationResult | Promise<
  {
      isValid: boolean;
      missingKeys: string;
  } | any>;
  postAccountResetPass: (code: number) => ValidationResult | Promise<boolean>;
  putAccountChangPass: (
    payload: PayloadAccountPass,
    code: number,
    requiredKeys: string[],
  ) => ValidationResult | Promise<{
    isValid: boolean;
    missingKeys: string[];
  } | boolean>;
  deleteCustomer: (payload: string[]) => Promise<boolean>;
};
export default function apiAccountService(): AccountService {
  const httpClient = useHttpClient();
  const { uploads } = apiCommonService();
  const getAccount = (param?: any): Promise<any> => {
    const paramRaw: any = {
      take: 10,
      page: 1,
      order_by: "id",
      ...param

    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient.get<any>(`${AppConfig.ACCOUNT.GET_ACCOUNT(queryParams)}`);
  };
  const getAccountTotal = (param ?: {
    text: string,
    status: number
  }): Promise<any> => {

    const queryParams = Utils.parseObjectToParam(param || {});
    return httpClient.get<any>(`${AppConfig.ACCOUNT.TOTAL(queryParams)}`);
  };
  const getAccountDetail = (param: string): Promise<any> => {

    return httpClient.get<InitCustomerKeys>(`${AppConfig.ACCOUNT.END_POINT}/${param}`);
  };
  const postAccount = async (payload: InitCustomerKeys, requiredKeys: string[], images: any[]) => {

 
    const convert_payload: PayloadAccount = {
      address: payload.address,
      cccd: +payload.cccd,
      date_of_birth: formatDate(payload.date_of_birth, "YYYYMMDD"),
      email: payload.email,
      full_name: payload.full_name,
      hourly_wage: Number(payload.hourly_wage),
      is_book_online: payload.is_book_online,
      note: payload.note,
      phone_number: payload.phone_number,
      position: payload.position,
      referral_code: payload.referral_code,
      referred_code: payload.referred_code,
      role_id: Number(payload.role_id),
      shift_wage: Number(payload.shift_wage),
      username: payload.username,
      password: payload.password,
      is_active: payload.is_active,
      status: payload.status,
      type: payload.type,
      image: payload.image,
      description: payload.description

    };


    const result = validateRequiredKeys(convert_payload, requiredKeys);

    if (!result.isValid) return result


    if (
      convert_payload.password && 
      convert_payload.password.length >= 8 && 
      convert_payload.password.length <= 20 && 
      /\d/.test(convert_payload.password) && 
      /[A-Z]/.test(convert_payload.password) && 
      /[a-z]/.test(convert_payload.password) && 
      /[!@#$%^&*(),.?":{}|<>]/.test(convert_payload.password)
    ) {
      console.log("Password hợp lệ");
      
    } else {
      console.log("Password không hợp lệ");

      return {
        isValid: true,
        missingKeys: "password"
      }
    }
    if (convert_payload.password !== payload.password_config)
      return {
        isValid: false,
        missingKeys: ["password_config"]
      }
    if (images.length > 0) {
      try {
        const files = images.map((file: any) => file.originFileObj);
        try {
          const response = await uploads(files);
          console.log('Upload thành công:', response);
          payload.image = response.data[0]
        } catch {

        }
      } catch (error) {
        // message.error('Lỗi khi upload ảnh!');
      }
    }
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.ACCOUNT.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        if (res.statusCode === 409 && res.error) {
          return {
            isValid: true,
            missingKeys: exist.find(item => res.error[0].includes(item))
          };
        }
        return res.statusCode === 200;

      })
      .catch((err) => {
        throw err;
      });
  };
  const putAccount = async (payload: any, code: string | number, requiredKeys: string[], images: any[]) => {
    // const convert_payload: PayloadAccount = {
    //   address: payload.address,
    //   cccd: payload.cccd,
    //   date_of_birth: formatDate(payload.date_of_birth, "YYYYMMDD"),
    //   email: payload.email,
    //   full_name: payload.full_name,
    //   hourly_wage: Number(payload.hourly_wage),
    //   is_book_online: payload.is_book_online,
    //   note: payload.note,
    //   phone_number: payload.phone_number,
    //   position: payload.position,
    //   referral_code: payload.referral_code,
    //   referred_code: payload.referred_code,
    //   role_id: Number(payload.role_id),
    //   shift_wage: Number(payload.shift_wage),
    //   username: payload.username,
    //   is_active: payload.is_active,
    //   status: payload.status,
    //   type: payload.type
    //   // password: payload.password
    // };


    const result = validateRequiredKeys(payload, requiredKeys);

    if (!result.isValid) return result;
    if (images.length > 0) {
      try {
        const files = images.map((file: any) => file.originFileObj);
        try {
          const response = await uploads(files);
          console.log('Upload thành công:', response);
          payload.image = response.data[0]
        } catch {

        }
      } catch (error) {
        // message.error('Lỗi khi upload ảnh!');
      }
    }
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.ACCOUNT.END_POINT + "/" + code,
        payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        if (res.statusCode === 409 && res.error) {
          return {
            isValid: true,
            missingKeys: exist.find(item => res.error[0].includes(item))
          };
        }
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postAccountResetPass = (code: number) => {
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.ACCOUNT.END_POINT + AppConfig.ACCOUNT.RESET_PASS + "/" + code,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putAccountChangPass = (payload: PayloadAccountPass, code: number, requiredKeys: string[]) => {
    const result = validateRequiredKeys(payload, requiredKeys);
    if (!result.isValid) return result;

    if (
      payload.old_password &&
      payload.old_password.length >= 8 &&
      payload.old_password.length <= 20 &&
      /\d/.test(payload.old_password) &&
      /[A-Z]/.test(payload.old_password) &&
      /[a-z]/.test(payload.old_password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(payload.old_password)
    ) {
      console.log("Password hợp lệ");

    } else {
      console.log("Password không hợp lệ");

      return {
        isValid: true,
        missingKeys: ["password"]
      }
    }
     if (payload.old_password !== payload.new_password)
      return {
        isValid: false,
        missingKeys: ["password_config"]
      }
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.ACCOUNT.END_POINT +
        AppConfig.ACCOUNT.CHANGE_PASS +
        "/" +
        code,
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
      .delete<ResponseFromServerV2<any>>(AppConfig.CUSTOMER.END_POINT, payload)
      .then((res: ResponseFromServerV2<any>) => {
        return res.statusCode === 200;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    getAccount,
    postAccount,
    putAccount,
    putAccountChangPass,
    postAccountResetPass,
    deleteCustomer,
    getAccountDetail,
    getAccountTotal
  };
}
