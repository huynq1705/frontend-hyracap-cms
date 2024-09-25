import AppConfig from "@/common/AppConfig";
import { RegisterPayload, SignInPayload } from "@/types/payload.type";
import { SignInResponse, SignUpResponse } from "@/types/response.type";
import useHttpClient from "./useHttpClient";
import { useDispatch } from "react-redux";
import { selectUserInfo } from "@/redux/selectors/user.selector";

type ResultAuth = {
    signIn: (payload: SignInPayload) => Promise<SignInResponse>;
    signUp: (payload: RegisterPayload) => Promise<SignUpResponse>;
};

export default function useAuthService(): ResultAuth {
    const httpClient = useHttpClient();
    const { axiosBase } = httpClient;
    const dispatch = useDispatch();

    // const signIn = (payload: SignInPayload): Promise<SignInResponse> => {
    const signIn = (payload: any): Promise<any> => {
        const { email, password, otp } = payload;
        return (
            httpClient.axiosBase
                .post<SignInResponse>(AppConfig.AUTH.SIGN_IN, {
                    email: email,
                    password,
                })
                // .then((res) => res.data);
                .then((res) => res)
        );
    };

    const signUp = (payload: RegisterPayload): Promise<SignUpResponse> => {
        return axiosBase
            .post<SignUpResponse>(AppConfig.AUTH.SIGN_UP, payload)
            .then((res) => res.data);
    };

    return {
        signIn,
        signUp,
    };
}
