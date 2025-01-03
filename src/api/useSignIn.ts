import AppConfig from "@/common/AppConfig";
import { SignInPayload } from "@/types/payload.type";
import { SignInError } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthService from "./useAuth.service";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { setUserInfo } from "@/redux/slices/user.slice";

type ResultSignIn = {
  signIn: (formValues: SignInPayload) => Promise<void>;
  signInWithOTP: (formValues: SignInPayload) => void;
  isTwoFactorAuth: boolean | undefined;
  isLoading: boolean;
};

export default function useSigIn(
  redirectPath: string | null,
  onLoginSuccess: (response: any) => void
): ResultSignIn {
  const authService = useAuthService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTwoFactorAuth, setTwoFactorAuth] = useState<boolean | undefined>(
    undefined
  );
  const { T } = useCustomTranslation();

  const mutationSignIn = useMutation({
    mutationFn: (formValues: SignInPayload) => authService.signIn(formValues),
    onSuccess: (res: any) => {
      onLoginSuccess(res);
      if (res.status) {
        const { access_token } = res.data;
        const { refresh_token } = res.data;
        // console.log("accessToken", res.data);

        localStorage.setItem(AppConfig.ACCESS_TOKEN, access_token);
        localStorage.setItem(AppConfig.REFRESH_TOKEN, refresh_token);
        dispatch(
          setGlobalNoti({
            type: "success",
            message: "Đăng nhập thành công",
          })
        );
        window.setTimeout(() => {
          if (redirectPath) {
            navigate(redirectPath);
          } else {
            navigate("/admin");
          }
        }, 100);
      } else {
        dispatch(
          setGlobalNoti({
            type: "error",
            message: `${res.error}`,
          })
        );
      }
    },
    onError: (err: AxiosError<SignInError>) => {
      const errResponse = err.response?.data;
      const message =
        errResponse?.errorCode || errResponse?.errorMessage
          ? `${errResponse.errorCode} - ${errResponse.errorMessage}`
          : _.isString(errResponse)
          ? errResponse
          : T("thereWasError");
      setGlobalNoti({
        type: "error",
        message: `${err.response?.status}: ${message}`,
        autoHideDuration: null,
      });
    },
    mutationKey: ["signIn"],
  });

  const signIn = async (formValues: SignInPayload) => {
    const { email } = formValues;

    switch (isTwoFactorAuth) {
      case false:
      case undefined: {
        const isUserTwoFactor = false;

        setTwoFactorAuth(isUserTwoFactor);
        if (!isUserTwoFactor) {
          mutationSignIn.mutateAsync(formValues);
        }
      }
    }
  };

  const signInWithOTP = (formValues: SignInPayload) => {
    mutationSignIn.mutateAsync(formValues);
  };

  const isLoading = useMemo(() => {
    return mutationSignIn.isLoading;
  }, [mutationSignIn.isLoading]);

  return {
    signIn,
    signInWithOTP,
    isTwoFactorAuth,
    isLoading,
  };
}
