import { Button, Card, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { Formik, useFormik } from "formik";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Typography } from "antd";
import * as Yup from "yup";
import { Box, styled, useTheme } from "@mui/system";
import "/src/assets/styles/forgotPassword.scss";
import { showError, showSuccess } from "@/components/notification";
import useCustomTranslation from "@/hooks/useCustomTranslation";
const FlexBox = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
    justifyContent: "center",
}));

const ContentBox = styled(Box)(({ theme }) => ({
    padding: 32,
    background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
    background: "#1A2038",
    minHeight: "100vh !important",
    "& .card": {
        maxWidth: 800,
        margin: "1rem",
        borderRadius: 12,
    },
}));
const initialValues = {
    username: "",
    password: "",
    remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string().required("Tên đăng nhập không trống!"),
});

const ForgotPassword = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const { T, t } = useCustomTranslation();
   
    const handleFormSubmit = () => {};
    return (
        <div className="page-forgot">
            <NavLink to="/admin/login">
                <div className="btn-back">
                    <img
                        className="btn-back-image"
                        src="/assets/icons/chevron-left.svg"
                        alt=""
                    />
                </div>
            </NavLink>
            <Grid className="container-forgot">
                <Grid item lg={6} md={6} xs={6} className="content-right">
                    {!isSuccess ? (
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
                                    className="form-forgot"
                                >
                                    <div className="title-login">
                                        {T("forgotPassword")}
                                    </div>
                                    <div className="description-login">
                                        {T(
                                            "enterTheEmailAddressYouUsedWhenRegisteringYourAccountWeWillSendANewPasswordToYourEmailAddress"
                                        )}
                                    </div>
                                    <label className="label">
                                        {T("email")}{" "}
                                        <span style={{ color: "red" }}>
                                            (*)
                                        </span>
                                    </label>
                                    <TextField
                                        fullWidth
                                        hiddenLabel
                                        size="small"
                                        className="mt-2"
                                        type="text"
                                        name="username"
                                        variant="outlined"
                                        placeholder={T("enterEmail")}
                                        onBlur={handleBlur}
                                        value={values.username}
                                        onChange={handleChange}
                                        helperText={
                                            touched.username && errors.username
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
                                    />
                                    <LoadingButton
                                        type="submit"
                                        style={{ height: 52 }}
                                        color="primary"
                                        loading={loading}
                                        fullWidth
                                        disabled={!isValid || !values.username}
                                        variant="contained"
                                        sx={{
                                            my: "24px",
                                            bgcolor: "#50945D",
                                            fontFamily: "Inter",
                                            fontSize: "18px",
                                            fontWeight: 500,
                                            lineHeight: "24px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Đặt lại mật khẩu
                                    </LoadingButton>
                                    {/* <Grid
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        sx={{ mt: 1 }}
                                    >
                                        <Typography>
                                            {T("didYouRememberYourPassword")}
                                        </Typography>
                                        <NavLink
                                            to="/login"
                                            style={{
                                                color: theme.palette.primary
                                                    .main,
                                                marginLeft: 5,
                                            }}
                                        >
                                            {T("signin")}
                                        </NavLink>
                                    </Grid> */}
                                </form>
                            )}
                        </Formik>
                    ) : (
                        <Grid>
                            <img
                                src="/assets/images/auth/forgot_success.png"
                                alt="forgot_success"
                            />
                            <div
                                className="title-login"
                                style={{ marginTop: 10 }}
                            >
                                {T("passwordResetSuccessful!")}
                            </div>
                            <div className="description-login">
                                {T(
                                    "weHaveSentYourNewPasswordToYourEmailAddress"
                                )}{" "}
                                <span style={{ fontWeight: 500 }}>
                                    {username}
                                </span>
                                . {T("pleaseCheckYourEmailAddress")}
                            </div>
                            <LoadingButton
                                style={{ height: 52 }}
                                color="primary"
                                fullWidth
                                loading={loading}
                                variant="contained"
                                onClick={() => {
                                    navigate("/admin/login");
                                }}
                                sx={{
                                    my: "24px",
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
                            <Grid
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mt: 1 }}
                            >
                                <Typography>
                                    {T("haventReceivedTheEmailYet?")}
                                </Typography>
                                <NavLink
                                    to={"/"}
                                    style={{
                                        color: theme.palette.primary.main,
                                        marginLeft: 5,
                                    }}
                                >
                                    {T("resend")}
                                </NavLink>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
                <Grid item lg={6} md={6} xs={6} className="content-left">
                    <div className="content">
                        <img
                            className="img-preview-login"
                            src="/assets/images/forgot_bg.png"
                            alt="preview_forgot_password"
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ForgotPassword;
