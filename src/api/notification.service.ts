import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1, ResponseFromServerV2 } from "@/types/types";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import { INIT_NOTIFICATION } from "@/constants/init-state/notification";
import { validateRequiredKeys } from "@/utils";
type NotificationService = {
  getNotification: (param?: any) => Promise<ResponseFromServerV1<any>>;
  sendNotification: (
    payload: typeof INIT_NOTIFICATION,
    keyRequired: string[]
  ) => any;
};
export default function apiNotificationService(): NotificationService {
  const httpClient = useHttpClient();
  const userInfo = useSelector(selectUserInfo);

  const getNotification = (param?: any): Promise<any> => {
    const paramRaw: any = param ?? {
      page: 1,
      take: 10,
    };
    const queryParams = Utils.parseObjectToParam(paramRaw);
    return httpClient
      .get<any>(`${AppConfig.NOTIFICATION.GET_NOTIFICATION(queryParams)}`)
      .then((res: ResponseFromServerV1<any>) => {
        if (res) return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const sendNotification = (
    payload: typeof INIT_NOTIFICATION,
    keyRequired: string[]
  ): any => {
    const missingKeys = validateRequiredKeys(payload, keyRequired);
    if (!missingKeys.isValid) return missingKeys;
    return httpClient
      .post<any>(AppConfig.API_URL + "notification/send", payload)
      .then((res: ResponseFromServerV2<any>) => {
        return res;
      });
  };

  return {
    getNotification,
    sendNotification,
  };
}
