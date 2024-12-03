import { LoadingButton } from "@mui/lab";
import {
    Card,
    Checkbox,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/system";
import { Formik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "/src/assets/styles/login.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useSignIn from "@/api/useSignIn";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useDispatch } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { v4 as uuidv4 } from "uuid";
const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

// inital login credentials
const initialValues = {
    username: "mailyhai814@gmail.com",
    password: "992003Hai",
    remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Mật khẩu phải lớn hơn 6 ký tự")
        .required("Mật khẩu không được bỏ trống"),
    username: Yup.string().required("Tên tài khoản không được bỏ trống"),
});

const Login = () => {
    const [loginResponse, setLoginResponse] = useState<any>(null);
    const { signIn } = useSignIn(null, (response) =>
        setLoginResponse(response)
    );
    const theme = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const onLogin = (username: string, password: string) => {
        signIn({
            email: username,
            password: password,
        });
    };
    const { T, t } = useCustomTranslation();

    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            await onLogin(values.username, values.password);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <div className="page-login max-sm:!p-0">
            <Grid
                className="container-login sm:!bg-none max-sm:bg-cover max-sm:bg-center max-sm:!w-full max-sm:!h-full"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/assets/images/backgroup_mitu.png")`,
                }}
            >
                <Grid
                    item
                    lg={6}
                    md={6}
                    xs={6}
                    className="content-left max-sm:!hidden"
                >
                    <div className="content">
                        <img
                            className="img-preview-login"
                            src="/assets/images/bg_login.jpg"
                            alt="preview_login"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    lg={6}
                    md={6}
                    xs={6}
                    className="content-right max-sm:!w-full max-sm:!flex-col max-sm:!p-4"
                >
                    <div className="mb-2 hidden max-sm:block">
                        <img
                            className="img-logo-hyracap"
                            src="/src/assets/images/logo/logo-hyracap-2.svg"
                            alt="logo_hyracap"
                        />
                    </div>
                    <Formik
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                    >
                        {({
                            values,
                            errors,
                            isValid,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form
                                onSubmit={handleSubmit}
                                className="login-form max-sm:!w-full max-sm:bg-[#FFFFFF1A] max-sm:border-spacing-2 max-sm:!p-4 max-sm:rounded-2xl "
                            >
                                <div className="max-sm:!hidden">
                                    <div className="logo-hyracap">
                                        <img
                                            className="img-logo-hyracap"
                                            src="/src/assets/images/logo/logo-hyracap-2.svg"
                                            alt="logo_hyracap"
                                        />
                                    </div>
                                    <div className="title-login">
                                        Chào mừng bạn quay trở lại
                                    </div>
                                    <div className="description-login">
                                        {T("welcomePleaseSignInToYourAccount")}
                                    </div>
                                </div>

                                <label className="label max-sm:!text-[#FCFCFD]">
                                    {T("username")}
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    type="text"
                                    name="username"
                                    variant="outlined"
                                    placeholder={"Nhập tên đăng nhập"}
                                    className="mt-2 rounded-md bg-white md:bg-none"
                                    onBlur={handleBlur}
                                    value={values.username}
                                    onChange={handleChange}
                                    helperText={
                                        touched.username && errors.username ? (
                                            <div className="flex gap-1">
                                                <img
                                                    src="/assets/images/warnning-icon.svg"
                                                    alt="warning"
                                                />
                                                {errors.username}
                                            </div>
                                        ) : null
                                    }
                                    error={Boolean(
                                        errors.username && touched.username
                                    )}
                                    sx={{ mb: 2, mt: 1 }}
                                    inputProps={{
                                        style: {
                                            height: 35,
                                        },
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            marginLeft: 0,
                                            marginRight: 0,
                                        },
                                    }}
                                />
                                <label className="label max-sm:!text-[#FCFCFD]">
                                    {T("password")}
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    placeholder={T("enterPassword")}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    onChange={handleChange}
                                    className="rounded-md bg-white md:bg-none"
                                    helperText={
                                        touched.password && errors.password ? (
                                            <div className="flex gap-1">
                                                <img
                                                    src="/assets/images/warnning-icon.svg"
                                                    alt="warning"
                                                />
                                                {errors.password}
                                            </div>
                                        ) : null
                                    }
                                    error={Boolean(
                                        errors.password && touched.password
                                    )}
                                    sx={{ mb: 1.5, mt: 1 }}
                                    inputProps={{
                                        style: {
                                            height: 35,
                                        },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (show) => !show
                                                        )
                                                    }
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    FormHelperTextProps={{
                                        style: {
                                            marginLeft: 0,
                                            marginRight: 0,
                                        },
                                    }}
                                />
                                {loginResponse?.data &&
                                    loginResponse?.data.statusCode === 422 && (
                                        <div className="flex gap-1 p-[10px] bg-[#FDE3E1] round-[4px]">
                                            <img
                                                className=""
                                                src="/assets/images/warnning-icon.svg"
                                                alt=""
                                            />
                                            <p className="warning-desc">
                                                Tên đăng nhập hoặc mật khẩu
                                                không đúng. Vui lòng nhập lại.
                                            </p>
                                        </div>
                                    )}
                                <LoadingButton
                                    type="submit"
                                    style={{ height: 52 }}
                                    loading={loading}
                                    fullWidth
                                    disabled={
                                        !isValid ||
                                        !values.username ||
                                        !values.password
                                    }
                                    variant="contained"
                                    sx={{
                                        mt: "12px",
                                        mb: "24px",
                                        bgcolor: "#50945D",
                                        fontFamily: "Inter",
                                        fontSize: "18px",
                                        fontWeight: 500,
                                        lineHeight: "24px",
                                        textAlign: "center",
                                    }}
                                >
                                    {T("signin")}
                                </LoadingButton>
                                {/*    <FlexBox justifyContent="center">
                  <NavLink
                    to="/admin/account/forgot-password"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "24px",
                      textAlign: "center",
                      color: "#50945D",
                      textDecoration: "none",
                    }}
                  >
                    {T("forgotPassword")}
                  </NavLink>
                </FlexBox> */}
                                {/* <Grid
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{
                                        fontFamily: "Inter",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "22px",
                                        color: "#1D2939",
                                        mt: "24px",
                                    }}
                                    className="max-sm:!text-white max-sm:!hidden"
                                >
                                    <Typography>
                                        {T("dontHaveAccount")}
                                    </Typography>
                                    <NavLink
                                        to="/admin/account"
                                        style={{
                                            fontFamily: "Inter",
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            lineHeight: "24px",
                                            textAlign: "center",
                                            color: "#50945D",
                                            marginLeft: 5,
                                        }}
                                    >
                                        {T("signup")}
                                    </NavLink>
                                </Grid> */}
                            </form>
                        )}
                    </Formik>
                    <Grid
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "22px",
                            color: "#1D2939",
                            mt: "24px",
                        }}
                        className="max-sm:!text-[#FCFCFD] hidden max-sm:flex "
                    >
                        <Typography>{T("dontHaveAccount")}</Typography>
                        <NavLink
                            to="/admin/account"
                            style={{
                                fontFamily: "Inter",
                                fontSize: "16px",
                                fontWeight: 500,
                                lineHeight: "24px",
                                textAlign: "center",
                                color: "#50945D",
                                marginLeft: 5,
                            }}
                        >
                            {T("signup")}
                        </NavLink>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default Login;
