import { ResponseFromServerV2 } from "@/types/types";
import useHttpClient from "./useHttpClient";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import axios from "axios";
import AppConfig from "@/common/AppConfig";

type CommonService = {
    deleteCommon: (payload: string[], url: string) => Promise<any>;
    detailCommon: <T>(payload: string, url: string) => Promise<T | null>;
    getStatistics: (url: string) => Promise<any>;
    uploads: (files: File[]) => Promise<any>;
    uploadsImageBlog: (files: File[]) => Promise<any>;
    importData: (files: File, url: string) => Promise<boolean>;
    exportData: (payload: string, url: string) => Promise<any>;
};

export const downloadExcelFile = async (
    url: string,
    body: { [key: string]: string | number }
) => {
    const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
    const API_URL = import.meta.env.VITE_APP_BASE_API_URL;
    const UPLOAD_ENDPOINT = url;
    try {
        const response = await axios.get(API_URL + UPLOAD_ENDPOINT, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: body,
        });

        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = blobUrl;

        // Lấy tên file từ Content-Disposition header nếu có
        const contentDisposition = response.headers["content-disposition"];
        console.log("contentDisposition", contentDisposition);

        const fileName = contentDisposition
            ? contentDisposition.split("filename=")[1].replace(/"/g, "")
            : `${url.replace(/\//g, "-")}.xlsx`;

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Failed to download the file:", error);
    }
};

export default function apiCommonService(): CommonService {
    const httpClient = useHttpClient();
    const dispatch = useDispatch();

    const deleteCommon = (payload: string[], url: string): Promise<any> => {
        return httpClient
            .delete<ResponseFromServerV2<any>>(url, payload)
            .then((res: ResponseFromServerV2<any>) => {
                return res;
            })
            .catch((err) => {
                dispatch(
                    setGlobalNoti({
                        type: "error",
                        message: "errorDeleting",
                    })
                );
                throw err;
            });
    };

    const detailCommon = <T>(
        payload: string,
        url: string
    ): Promise<T | null> => {
        return httpClient
            .get<any>(`${url}/${payload}`)
            .then((res: ResponseFromServerV2<T>) => {
                if (res) {
                    return res.statusCode === 200 ? res.data : null;
                } else {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "errorDetail",
                        })
                    );
                    throw new Error("Error fetching details");
                }
            })
            .catch((err) => {
                dispatch(
                    setGlobalNoti({
                        type: "error",
                        message: "errorDetail",
                    })
                );
                throw err;
            });
    };
    const getStatistics = (url: string) => {
        return httpClient
            .get<any>(url)
            .then((res: any) => {
                if (res) return res;
            })
            .catch((err) => {
                throw err;
            });
    };
    const uploads = (files: File[]) => {
        const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
        const API_URL = import.meta.env.VITE_APP_BASE_API_URL;
        const UPLOAD_ENDPOINT = "upload-image/uploads";
        const uploadData = new FormData();
        // Append each selected file to the FormData object
        for (let i = 0; i < files.length; i++) {
            uploadData.append("files", files[i]);
        }
        // Make a POST request to the server using Axios
        return axios
            .post(API_URL + UPLOAD_ENDPOINT, uploadData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                console.error(error); // Handle any errors that occur during the upload process
            });
    };
    const uploadsImageBlog = (files: File[]) => {
        const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
        const API_URL = import.meta.env.VITE_APP_BASE_API_URL;
        const UPLOAD_ENDPOINT = "files/upload_blog";
        const uploadData = new FormData();
        // Append each selected file to the FormData object
        for (let i = 0; i < files.length; i++) {
            uploadData.append("files", files[i]);
        }
        // Make a POST request to the server using Axios
        return axios
            .post(API_URL + UPLOAD_ENDPOINT, uploadData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                console.error(error); // Handle any errors that occur during the upload process
            });
    };
    const importData = (files: File, url: string): Promise<boolean> => {
        const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
        const API_URL = import.meta.env.VITE_APP_BASE_API_URL;
        const UPLOAD_ENDPOINT = `${url}/import`;
        const uploadData = new FormData();
        uploadData.append("file", files);
        return axios
            .post(API_URL + UPLOAD_ENDPOINT, uploadData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => response.data.status)
            .catch((error) => {
                console.error(error); // Handle any errors that occur during the upload process
            });
    };

    const exportData = (payload: string, url: string): Promise<any> => {
        const accessToken = localStorage.getItem(AppConfig.ACCESS_TOKEN);
        const API_URL = import.meta.env.VITE_APP_BASE_API_URL;
        const UPLOAD_ENDPOINT = `service/export`;

        return axios
            .get(API_URL + UPLOAD_ENDPOINT, {
                params: {
                    text: payload,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                console.error(error); // Handle any errors that occur during the upload process
            });
    };
    return {
        deleteCommon,
        detailCommon,
        getStatistics,
        uploads,
        uploadsImageBlog,
        importData,
        exportData,
    };
}
