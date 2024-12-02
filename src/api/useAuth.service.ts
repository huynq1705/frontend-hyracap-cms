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
  confirmOtp: (payload: any) => Promise<SignUpResponse>;
};

export default function useAuthService(): ResultAuth {
  const httpClient = useHttpClient();
  const { axiosBase } = httpClient;
  const dispatch = useDispatch();
  const isEmail = (account: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(account);
  };

  const isPhoneNumber = (value: string) => {
    const phonePattern = /^(0[1-9]{1}[0-9]{8}|[1-9]{1}[0-9]{9,10})$/;
    return phonePattern.test(value);
  };

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

    const Body = {
      // path: "/v2/api/account/login",
      // method: "POST",
      // body: {
      ...(isEmail(email) ? { email: email } : { phone: email }),
      password,
      // },
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_API_URL}staff/login`,
        // "https://hyracap.lyhai.id.vn/api/account",
        Body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };

  const signUp = async (payload: RegisterPayload): Promise<SignUpResponse> => {
    const { account, password } = payload;

    const Body = {
      path: "/v2/api/account/register",
      method: "POST",
      body: {
        ...(isEmail(account) ? { email: account } : { phone: account }),
        password,
      },
    };
    console.log("payload", payload);
    try {
      const response = await axios.post(
        "https://hyracap.lyhai.id.vn/api/account",
        Body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };

  const confirmOtp = async (payload: any): Promise<any> => {
    const { email, otp } = payload;
    const Body = {
      ...(isEmail(email) ? { email: email } : { phone: email }),
      verifyCode: otp,
    };
    try {
      const response = await axios.post(
        "https://hyracap.lyhai.id.vn/api/account",
        Body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error:", err);
      throw err;
    }
  };

  return {
    signIn,
    signUp,
    confirmOtp,
  };
}
