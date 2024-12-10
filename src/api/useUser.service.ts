import AppConfig from "@/common/AppConfig";
import useHttpClient from "./useHttpClient";
import { UserResponse } from "@/types/response.type";

type ResultUserService = {
    getAllUsers: () => Promise<UserResponse>;
};
export default function useUserService(): ResultUserService {
    const httpClient = useHttpClient();

    const getAllUsers = (): Promise<UserResponse> => {
        return httpClient.get<UserResponse>(`${AppConfig.USER.GET_ALL}`);
    };

    return {
        getAllUsers,
    };
}
