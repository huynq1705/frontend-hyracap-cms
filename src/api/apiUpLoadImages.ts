import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import Utils from "@/utils/utils";
import {
    ResponseFromServerV2,
} from "@/types/types";

type upLoadImagesService = {
    updateImages: (param?: any) => Promise<any>; // hoặc ResponseFromServerV2<any>
};

export default function apiUpLoadImagesService(): upLoadImagesService {
    const httpClient = useHttpClient();

    const updateImages = (param?: any): Promise<any> => {
        return httpClient
            .post<ResponseFromServerV2<any>>(
                AppConfig.GENERAL_SETTING.END_POINT,
                param,
                {},
            )
            .then((res: ResponseFromServerV2<any>) => {
                return res; // trả về toàn bộ response
            })
            .catch((err) => {
                throw err;
            });
    };

    return {
        updateImages,
    };
}