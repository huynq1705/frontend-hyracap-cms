import {
  ResponseFromServerV1,
  ResponseFromServerV2,
  ValidationResult,
} from "@/types/types";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import AppConfig from "@/common/AppConfig";
import { validateRequiredKeys } from "@/utils";
import {
  PayloadSchedule,
  ResponseScheduleItem,
  ResponseScheduleItemConvert,
} from "@/types/schedule";
import { InitScheduleKeys } from "@/constants/init-state/schedule";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { formatDate, formatTime } from "@/utils/date-time";
import { InitMakeAnAppointmentKeys } from "@/constants/init-state/make-an-appointment";

type ScheduleService = {
  getSchedule: (
    param?: any,
  ) => Promise<ResponseFromServerV1<ResponseScheduleItem[]>>;
  getScheduleDay: (
    param?: any,
    date?: string,
    staff?: string,
    status?: string,
  ) => Promise<ResponseFromServerV1<ResponseScheduleItem[]>>;

  getOneSchedule: (param?: any, code?: string) => Promise<any>;
  getHistorySchedule: (param?: any, code?: string) => Promise<any>;

  postSchedule: (
    payload: InitScheduleKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<boolean>;
  postScheduleUser: (
    payload: InitMakeAnAppointmentKeys,
    requiredKeys: string[],
  ) => ValidationResult | Promise<any | null>;
  putSchedule: (
    payload: any,
    requiredKeys: string[],
  ) => ValidationResult | Promise<boolean>;
  putScheduleCalender: (
    payload: any,
    requiredKeys: string[],
  ) => ValidationResult | Promise<boolean>;
  putConfig: (
    payload: any,
    requiredKeys: string[],
    code: string,
  ) => ValidationResult | Promise<boolean>;
  deleteSchedule: (payload: string[]) => Promise<boolean>;
  getConfig: (param?: any) => Promise<any>;
};
export default function apiScheduleService(): ScheduleService {
  const httpClient = useHttpClient();
  const userInfo = useSelector(selectUserInfo);

  const getSchedule = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.SCHEDULE.GET_SCHEDULE(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getScheduleDay = (
    param?: any,
    date?: string,
    staff?: string,
    status?: string,
  ): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 999,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    let filter = `date__eq__${encodeURIComponent(date ?? "")}`;

    if (staff) {
      filter += `,staff_id__in__${encodeURIComponent(staff)}`;
    }
    if (status) {
      filter += `,status_schedule_id__in__${encodeURIComponent(status)}`;
    }
    return httpClient
      .get<any>(
        `${AppConfig.SCHEDULE.GET_SCHEDULE(queryParams)}&filter=${filter}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getHistorySchedule = (param?: any, code?: string): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 999,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    console.log("queryParams", queryParams);
    return httpClient
      .get<any>(
        `${AppConfig.SCHEDULE_HISTORY.GET_SCHEDULE_HISTORY(
          queryParams,
        )}&filter=schedule_id__eq__${code}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getOneSchedule = (param?: any, code?: string): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 999,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    console.log("queryParams", queryParams);
    return httpClient
      .get<any>(
        `${AppConfig.SCHEDULE.GET_SCHEDULE(
          queryParams,
        )}&filter=id__eq__${code}`,
      )
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postSchedule = (payload: any, requiredKeys: string[]) => {
    const convert_payload = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      customer_source_id: null,
      content: payload.content,
      date: formatDate(payload.date, "YYYYMMDD"),
      time: `${payload.time}:00`,
      type: payload.type,
      platform: 0,
      customer_id: null,
      creator_id: userInfo?.id,
      status_schedule_id: Number(payload.status_schedule_id),
      staff_id: Number(payload.staff_id),
      list_service_id: payload.list_service_id.map((x: any) => +x),
    };
    const result = validateRequiredKeys(payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.SCHEDULE.END_POINT,
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return !!res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putSchedule = (payload: any, requiredKeys: string[]) => {
    const validate_result = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      customer_source_id: payload.customer_source_id,
      content: payload.content,
      date: payload.date,
      from: payload.time,
      type: payload.type,
      platform: payload.platform,
      customer_id: payload.customer_id,
      creator_id: userInfo?.id,
      status_schedule_id: Number(payload.status_schedule_id),
      staff_id: Number(payload.staff_id),
      list_service_id: payload.list_service_id,
    };
    const convert_payload = {
      id_schedule: payload.id ?? null,
      id_editor: userInfo?.id,
      schedule: {
        content: payload.content,
        date: formatDate(payload.date, "YYYYMMDD"),
        time: `${payload.time}:00`,
        type: payload.type,
        platform: payload.platform,
        customer_id: payload.customer_id,
        creator_id: userInfo?.id,
        status_schedule_id: Number(payload.status_schedule_id),
        staff_id: Number(payload.staff_id),
        list_service_id: payload.list_service_id
          .filter((option: any) => option.key.trim() !== "")
          .map((option: any) => option.key),
      },
    };

    const result = validateRequiredKeys(validate_result, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.SCHEDULE.END_POINT,
        [convert_payload],
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return !!res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const putScheduleCalender = (payload: any, requiredKeys: string[]) => {
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.SCHEDULE.END_POINT,
        [payload],
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return !!res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const postScheduleUser = (
    payload: InitMakeAnAppointmentKeys,
    requiredKeys: string[],
  ) => {
    const splitText = payload.range_time;
    const convert_payload = {
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      email: payload.email,
      customer_source_id: +payload.customer_source_id[0] || null,
      content: payload.note,
      date: formatDate(payload.date_time, "YYYYMMDD"),
      time: splitText,
      type: 0,
      customer_id: null,
      creator_id: +payload.employee_id[0],
      status_schedule_id: null,
      staff_id: +payload.staff_id[0],
      platform: payload.platform,
      list_service_id: payload.service_id.map((x) => +x),
    };

    const result = validateRequiredKeys(payload, requiredKeys);

    if (!result.isValid) return result;
    return httpClient
      .post<ResponseFromServerV2<any>>(
        AppConfig.SCHEDULE.GET_SCHEDULE("/customer-booking-schedule"),
        convert_payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        if (res) return res;
        return null;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getConfig = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.CONFIG_SCHEDULE.GET_CONFIG_SCHEDULE(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res?.data && Array.isArray(res.data)) return res.data[0];
      })
      .catch((err) => {
        throw err;
      });
  };
  const putConfig = (payload: any, requiredKeys: string[], code: string) => {
    return httpClient
      .put<ResponseFromServerV2<any>>(
        AppConfig.CONFIG_SCHEDULE.END_POINT + "/" + code,
        payload,
        {},
      )
      .then((res: ResponseFromServerV2<any>) => {
        return !!res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deleteSchedule = (payload: string[]) => {
    return httpClient
      .delete<ResponseFromServerV2<any>>(AppConfig.CUSTOMER.END_POINT, payload)
      .then((res: ResponseFromServerV2<any>) => {
        return !!res;
      })
      .catch((err) => {
        throw err;
      });
  };
  return {
    putConfig,
    getHistorySchedule,
    getScheduleDay,
    getOneSchedule,
    getSchedule,
    postSchedule,
    postScheduleUser,
    putSchedule,
    putScheduleCalender,
    deleteSchedule,
    getConfig,
  };
}
