import AppConfig from "@/common/AppConfig";
import { RegisterPayload, SignInPayload } from "@/types/payload.type";
import { SignInResponse, SignUpResponse } from "@/types/response.type";
import useHttpClient from "./useHttpClient";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type ResultAuth = {
    signIn: (payload: SignInPayload) => Promise<SignInResponse>;
    signUp: (payload: RegisterPayload) => Promise<SignUpResponse>;
};

export default function useAuthService(): ResultAuth {
    const httpClient = useHttpClient();
    const { axiosBase } = httpClient;
    const dispatch = useDispatch();

    const generateSignal = async (requestBody: any, secretKey: any) => {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const bodyData = encoder.encode(requestBody);

        const key = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );

        const signature = await crypto.subtle.sign("HMAC", key, bodyData);
        const base64Signature = btoa(
            String.fromCharCode(...new Uint8Array(signature))
        );

        return base64Signature;
    };
    const signIn = async (payload: any): Promise<any> => {
        const { email, password, otp } = payload;
        const serviceName = "HYRA-CAPITAL-BETA-PuBndmfTVF7wbxHUoZQ8iJ";
        const secretKey =
            "HYRA-CAPITAL-BETA-Secret-kFVnZnRXccHuJWmoeI2ayAnPDGxNEbAO7RfVKw1ty2LHqo1B0C";
        const timeRequest = new Date().toISOString();
        const requestId = uuidv4().slice(0, 50);

        const Body = {
            request_id: requestId,
            timeRequest: timeRequest,
            email: email,
            password: password,
        };

        const requestBody = JSON.stringify(Body);
        const signalT = await generateSignal(requestBody, secretKey);
        try {
            const response = await axios.post(
                "https://hyra-account-api-beta.metawaytech.net/v2/api/account/login",
                Body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        signal: signalT,
                        servicename: serviceName,
                    },
                }
            );
            return response.data;
        } catch (err) {
            console.error("Error:", err);
            throw err;
        }
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
