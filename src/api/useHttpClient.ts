import AppConfig from "@/common/AppConfig";
import { selectSelectedConsoleItem } from "@/redux/selectors/app.selector";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const createBaseInstance = (): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: AppConfig.API_URL,
    });
    return axiosInstance;
};

const getAccessToken = () => localStorage.getItem(AppConfig.ACCESS_TOKEN);
const getRefreshToken = () => localStorage.getItem(AppConfig.REFRESH_TOKEN);

const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(AppConfig.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AppConfig.REFRESH_TOKEN, refreshToken);
};

const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    try {
        const response = await axios.post(`${AppConfig.API_URL}/auth/refresh`, {
            refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(accessToken, newRefreshToken);
        return accessToken;
    } catch (error) {
        throw new Error("Failed to refresh token");
    }
};

export type ResultHttpClient = {
    get: <T>(
        url: string,
        options?: Record<string, string>,
        requestOptions?: AxiosRequestConfig<any>
    ) => Promise<T>;
    post: <T>(
        url: string,
        data: any,
        options?: Record<string, string>
    ) => Promise<T>;
    put: <T>(
        url: string,
        data: any,
        options?: Record<string, string>
    ) => Promise<T>;
    patch: <T>(
        url: string,
        data: any,
        options?: Record<string, string>
    ) => Promise<T>;
    delete: <T>(
        url: string,
        data: any,
        options?: Record<string, string>
    ) => Promise<T>;
    axiosBase: AxiosInstance;
};

export default function useHttpClient(): ResultHttpClient {
    const navigate = useNavigate();
    const selectedConsoleItem = useSelector(selectSelectedConsoleItem);
    const location = useLocation();
    const dispatch = useDispatch();
    const axiosBase = createBaseInstance();
    const axiosAuth = createBaseInstance();

    // interceptor
    useEffect(() => {
        const { pathname, search } = location;
        //check token
        axiosAuth.interceptors.request.use(
            async (config: InternalAxiosRequestConfig<any>) => {
                config.headers.Authorization = `Bearer ${getAccessToken()}`;
                config.headers["project_name"] =
                    selectedConsoleItem?.project_name;
                config.headers["project_id"] = selectedConsoleItem?.project_id;
                if (selectedConsoleItem?.project_name_raw) {
                    config.headers["project_name_raw"] = encodeURI(
                        selectedConsoleItem.project_name_raw
                    );
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        axiosAuth.interceptors.response.use(
            (response) => response.data,
            async (error: AxiosError) => {
                const originalRequest =
                    error.config as InternalAxiosRequestConfig<any> & {
                        _retry?: boolean;
                    };
                if (
                    error?.response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    try {
                        const newAccessToken = await refreshAuthToken();
                        axios.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${newAccessToken}`;
                        originalRequest.headers[
                            "Authorization"
                        ] = `Bearer ${newAccessToken}`;
                        return axiosAuth(originalRequest);
                    } catch (err) {
                        if (pathname.includes("/admin")) {
                            dispatch(
                                setGlobalNoti({
                                    type: "warning",
                                    message: "sessionExpired",
                                })
                            );
                            navigate(
                                `/admin/login?redirect=${pathname}${search}`
                            );
                        }
                    }
                } else {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "thereWasError",
                        })
                    );
                }

                return Promise.reject(error);
            }
        );

        // auth
        // axiosAuth.interceptors.response.use(
        //     (response) => {
        //         return response.data;
        //     },
        //     (error) => {
        //         if (error?.response?.status === 401) {
        //             dispatch(
        //                 setGlobalNoti({
        //                     type: "warning",
        //                     message: "sessionExpired",
        //                 })
        //             );
        //             navigate(`/login?redirect=${pathname}${search}`);
        //         } else {
        //             setGlobalNoti({
        //                 type: "error",
        //                 message: "thereWasError",
        //             });
        //         }

        //         return Promise.reject(error);
        //     }
        // );
        // axiosAuth.interceptors.request.use(
        //     (config) => {
        //         config.headers.Authorization = `Bearer ${
        //             localStorage.getItem(AppConfig.ACCESS_TOKEN) ?? ""
        //         }`;
        //         config.headers["project_name"] =
        //             selectedConsoleItem?.project_name;
        //         config.headers["project_id"] = selectedConsoleItem?.project_id;
        //         if (selectedConsoleItem?.project_name_raw) {
        //             config.headers["project_name_raw"] = encodeURI(
        //                 selectedConsoleItem.project_name_raw
        //             );
        //         }
        //         return config;
        //     },
        //     (error) => {
        //         return Promise.reject(error);
        //     }
        // );
    }, [axiosAuth, location, selectedConsoleItem]);

    //methods

    const getAuth = <T>(
        url: string,
        headers: Record<string, string> = {},
        requestOptions?: AxiosRequestConfig<any>
    ) => {
        return axiosAuth.request({
            url,
            method: "GET",
            headers: {
                ...headers,
            },
            ...(requestOptions ?? {}),
        }) as Promise<T>;
    };

    const postAuth = <T>(
        url: string,
        data: any,
        headers: Record<string, string> = {}
    ) => {
        return axiosAuth.request({
            url,
            method: "POST",
            data,
            headers: {
                ...headers,
            },
        }) as Promise<T>;
    };

    const putAuth = <T>(
        url: string,
        data: any,
        headers: Record<string, string> = {}
    ) => {
        return axiosAuth.request({
            url,
            method: "PUT",
            data,
            headers: {
                ...headers,
            },
        }) as Promise<T>;
    };

    const patchAuth = <T>(
        url: string,
        data: any,
        headers: Record<string, string> = {}
    ) => {
        return axiosAuth.request({
            url,
            method: "PATCH",
            data,
            headers: {
                ...headers,
            },
        }) as Promise<T>;
    };

    const deleteAuth = <T>(
        url: string,
        data: any,
        options: Record<string, string> = {}
    ) => {
        return axiosAuth.request({
            url,
            method: "DELETE",
            data,
            headers: {
                ...options,
            },
        }) as Promise<T>;
    };

    return {
        get: getAuth,
        post: postAuth,
        put: putAuth,
        patch: patchAuth,
        delete: deleteAuth,
        axiosBase,
    };
}
