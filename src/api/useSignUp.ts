import { RegisterPayload } from "@/types/payload.type";
import { SignUpError } from "@/types/response.type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthService from "./useAuth.service";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { formatDate } from "@/utils/date-time";

type ResultSignUp = {
    signUp: (registerPayload: RegisterPayload) => Promise<void>;
    isLoading: boolean;
};
export default function useSignUp(): ResultSignUp {
    const authService = useAuthService();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const mutationSignUp = useMutation({
        mutationFn: ({
            registerPayload,
        }: {
            registerPayload: RegisterPayload;
        }) => authService.signUp(registerPayload),
        onSuccess: (res) => {
            if (res.status) {
                dispatch(
                    setGlobalNoti({
                        type: "success",
                        message: "registerSuccessfully",
                    })
                );
                navigate("/admin/login");
            } else {
                dispatch(
                    setGlobalNoti({
                        type: "error",
                        message: `${res.error}`,
                    })
                );
            }
        },
        onError: (err: AxiosError<SignUpError>) => {
            const errResponse = err.response?.data;
            // handleOnError();
            setGlobalNoti({
                type: "error",
                message:
                    (errResponse && errResponse?.errorMessage?.errorMessage) ||
                    "",
                autoHideDuration: null,
            });
        },
        mutationKey: ["signUp"],
    });
    const isLoading = useMemo(() => {
        return mutationSignUp.isLoading;
    }, [mutationSignUp.isLoading]);

    const signUp = async (registerPayload: RegisterPayload) => {
        const registerUpload = {
            full_name: "string",
            email: registerPayload.email,
            user_name: registerPayload.user_name,
            password: registerPayload.password,
            phone_number: registerPayload.phone_number,
            date_of_birth: formatDate(
                registerPayload.date_of_birth,
                "YYYYMMDD"
            ),
            address: "string",
            referral_code: "rocklee",
            referred_code: "rocklee",
            role_id: 3,
            cccd: 1,
            shift_wage: 1,
            hourly_wage: 1,
            note: "Mô Tả",
            is_book_online: 1,
            position_id: 1,
        };
        mutationSignUp.mutate({ registerPayload: registerUpload }); // admin token => api sign up
    };

    return {
        signUp,
        isLoading,
    };
}
