import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import { ResponseFromServerV1 } from "@/types/types";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";
type NotificationService = {
    getNotification: (param?: any) => Promise<ResponseFromServerV1<any>>;
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
            .get<any>(
                `${
                    AppConfig.NOTIFICATION.GET_NOTIFICATION(queryParams) +
                    "staffId__eq=" +
                    `${userInfo?.id}`
                }`
            )
            .then((res: ResponseFromServerV1<any>) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        getNotification,
    };
}
