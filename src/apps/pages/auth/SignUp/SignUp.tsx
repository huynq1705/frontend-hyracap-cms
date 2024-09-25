import React from "react";
import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    Checkbox,
    Grid,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    MenuItem,
    InputAdornment,
    IconButton,
    Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { Formik, useFormik } from "formik";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "/src/assets/styles/signUp.scss";

// import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
    CheckCircleOutline,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import useSignUp from "@/api/useSignUp";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjsscroll; "@mui/x-date-pickers/AdapterDayjs";
import { RegisterPayload } from "@/types/payload.type";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const FlexBox = styled(Box)(() => ({ display: "flex", alignItems: "center" }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: "center" }));

// form field validation schema
const validationSchema = Yup.object().shape({
    username: Yup.string()
        .min(6, "Tên đăng nhập tối thiểu 6 ký tự")
        .required("Tên đăng nhập là bắt buộc"),
    email: Yup.string()
        .required("Email là bắt buộc")
        .email("Email không đúng định dạng"),
    password: Yup.string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .max(20, "Mật khẩu tối đa 20 ký tự")
        .required("Mật khẩu là bắt buộc")
        .test(
            "password-checks",
            "Mật khẩu phải bao gồm ít nhất một chữ số, một chữ hoa, một chữ thường và một ký tự đặc biệt",
            (value) => {
                return (
                    /\d/.test(value) &&
                    /[A-Z]/.test(value) &&
                    /[a-z]/.test(value) &&
                    /[!@#$%^&*(),.?":{}|<>]/.test(value)
                );
            }
        ),
    confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp nhau")
        .required("Xác nhận mật khẩu là bắt buộc"),
    phone_number: Yup.string()
        .required("Điện thoại là bắt buộc")
        .min(10, "Số điện thoại có 10 ký tự")
        .max(10, "Số điện thoại có 10 ký tự"),
});
const validatePassword = [
    "Độ dài 8 - 20 ký tự",
    "Chữ số",
    "Chữ hoa",
    "Chữ thường",
    "Ký tự đặc biệt",
];
const initialValues = {
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: dayjs(),
    phone_number: "",
    gender: "Nam",
    username: "",
    remember: true,
    accpet: true,
};
const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { signUp, isLoading } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCf, setShowPasswordCf] = useState(false);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        number: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const { T, t } = useCustomTranslation();

    const handlePasswordChange = (e: any, handleChange: any) => {
        const { value } = e.target;
        const checks = {
            length: value.length >= 8 && value.length <= 20,
            number: /\d/.test(value),
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        };
        setPasswordChecks(checks);
        handleChange(e);
    };
    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            const registerPayload = {
                full_name: values.full_name,
                email: values.email,
                user_name: values.username,
                password: values.password,
                phone_number: values.phone_number,
                date_of_birth: values.date_of_birth,
                address: values.address,
                role_id: values.role_id,
            };

            await signUp(registerPayload);
            setLoading(false);
            formik.resetForm();
        } catch (e) {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirm_password: "",
            phone_number: "",
            gender: "Nam",
            username: "",
            remember: true,
            date_of_birth: dayjs(),
            full_name: "",
            nick_name: "",
            address: "",
            avt_url: "",
            role_id: undefined,
        },
        validationSchema: validationSchema,
        onSubmit: handleFormSubmit,
    });
    return (
        <div className="page-register">
            <NavLink to="/admin/login">
                <div className="btn-back">
                    <img
                        className="btn-back-image"
                        src="/assets/icons/chevron-left.svg"
                        alt=""
                    />
                </div>
            </NavLink>
            <Grid className="container-register">
                <Grid item lg={6} md={6} xs={6} className="content-right max-sm:!w-full max-sm:!m-0">
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
                                className="form-signUp max-sm:!w-full"
                            >
                                <div className="title-login">{T("signup")}</div>
                                <div className="description-login">
                                    {T(
                                        "enterEmailAddressToReceiveConfirmationOTP"
                                    )}
                                </div>
                                <label className="label">
                                    {T("userName")}{" "}
                                    <span style={{ color: "red" }}>(*)</span>
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    className="mt-2"
                                    type="text"
                                    name="username"
                                    variant="outlined"
                                    placeholder={T("enterUserName")}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    onChange={handleChange}
                                    helperText={
                                        touched.username && errors.username
                                    }
                                    error={Boolean(
                                        errors.username && touched.username
                                    )}
                                    sx={{ mb: "12px", mt: "4px" }}
                                    inputProps={{
                                        style: {
                                            height: 35,
                                        },
                                    }}
                                />
                                <label className="label">
                                    {T("email")}{" "}
                                    <span style={{ color: "red" }}>(*)</span>
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    className="mt-2"
                                    type="text"
                                    name="email"
                                    variant="outlined"
                                    placeholder={T("enterEmail")}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    onChange={handleChange}
                                    helperText={
                                        touched.email && errors.email ? (
                                            <div className="flex gap-1">
                                                <img
                                                    src="/assets/images/warnning-icon.svg"
                                                    alt="warning"
                                                />
                                                {errors.email}
                                            </div>
                                        ) : null
                                    }
                                    error={Boolean(
                                        errors.email && touched.email
                                    )}
                                    sx={{ mb: "12px", mt: "4px" }}
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
                                <label className="label">
                                    {T("phone_number")}{" "}
                                    <span style={{ color: "red" }}>(*)</span>
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    className="mt-2"
                                    type="text"
                                    name="phone_number"
                                    variant="outlined"
                                    placeholder={T("enter_phone_number")}
                                    onBlur={handleBlur}
                                    value={values.phone_number}
                                    onChange={handleChange}
                                    helperText={
                                        touched.phone_number &&
                                        errors.phone_number ? (
                                            <div className="flex gap-1">
                                                <img
                                                    src="/assets/images/warnning-icon.svg"
                                                    alt="warning"
                                                />
                                                {errors.phone_number}
                                            </div>
                                        ) : null
                                    }
                                    error={Boolean(
                                        errors.phone_number &&
                                            touched.phone_number
                                    )}
                                    sx={{ mb: "12px", mt: "4px" }}
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
                                <label className="label">
                                    {T("date_of_birth")}
                                </label>
                                <DatePicker
                                    value={formik.values.date_of_birth}
                                    onChange={(val) => {
                                        formik.setFieldValue(
                                            "date_of_birth",
                                            val,
                                            false
                                        );
                                    }}
                                    sx={{
                                        mb: 2,
                                        mt: 1,
                                        height: "100%",
                                        width: "100%",
                                        border: "none",
                                        "& input": {
                                            border: "none",
                                            fontSize: "14px",
                                            outline: "none",
                                        },
                                    }}
                                />
                                {/* <label className="label">{T("gender")}</label>
                                <RadioGroupField
                                    name="gender"
                                    options={GENDER}
                                    value={formik.values.gender}
                                    formik={formik}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.gender &&
                                        Boolean(formik.errors.gender)
                                    }
                                    helperText={
                                        formik.touched.gender &&
                                        formik.errors.gender
                                    }
                                    row="true"
                                    col={12}
                                /> */}
                                <label className="label">
                                    {T("password")}{" "}
                                    <span style={{ color: "red" }}>(*)</span>
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    placeholder={T("enterPassword")}
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        setIsPasswordFocused(false);
                                        handlePasswordChange(e, handleChange);
                                    }}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    value={values.password}
                                    onChange={(e) => {
                                        handlePasswordChange(e, handleChange);
                                        handleChange(e);
                                    }}
                                    helperText={
                                        isPasswordFocused && (
                                            <>
                                                {validatePassword.map(
                                                    (item, index) => (
                                                        <FlexBox
                                                            key={index}
                                                            justifyContent="space-between"
                                                            sx={{
                                                                mt: 1,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <FlexBox gap={1}>
                                                                <Checkbox
                                                                    size="small"
                                                                    name={`accept_${index}`}
                                                                    checked={
                                                                        index ===
                                                                        0
                                                                            ? passwordChecks.length
                                                                            : index ===
                                                                              1
                                                                            ? passwordChecks.number
                                                                            : index ===
                                                                              2
                                                                            ? passwordChecks.uppercase
                                                                            : index ===
                                                                              3
                                                                            ? passwordChecks.lowercase
                                                                            : passwordChecks.specialChar
                                                                    }
                                                                    sx={{
                                                                        padding: 0,
                                                                        "&.Mui-disabled":
                                                                            {
                                                                                color: "#50945D", // Color when disabled
                                                                            },
                                                                    }}
                                                                    disabled
                                                                />
                                                                <p className="validate_pw">
                                                                    {item}
                                                                </p>
                                                            </FlexBox>
                                                        </FlexBox>
                                                    )
                                                )}
                                            </>
                                        )
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
                                />
                                <label className="label">
                                    {T("confirmPassword")}{" "}
                                    <span style={{ color: "red" }}>(*)</span>
                                </label>
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    size="small"
                                    name="confirm_password"
                                    type={showPasswordCf ? "text" : "password"}
                                    variant="outlined"
                                    placeholder={T("confirmPassword")}
                                    onBlur={handleBlur}
                                    value={values.confirm_password}
                                    onChange={handleChange}
                                    helperText={
                                        touched.confirm_password &&
                                        errors.confirm_password
                                    }
                                    error={Boolean(
                                        errors.confirm_password &&
                                            touched.confirm_password
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
                                                        setShowPasswordCf(
                                                            (show) => !show
                                                        )
                                                    }
                                                    edge="end"
                                                >
                                                    {showPasswordCf ? (
                                                        <VisibilityOff />
                                                    ) : (
                                                        <Visibility />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FlexBox
                                    justifyContent="space-between"
                                    sx={{ mt: 1, mb: 1 }}
                                >
                                    <FlexBox gap={1}>
                                        <Checkbox
                                            size="small"
                                            name="accpet"
                                            onChange={handleChange}
                                            checked={values.accpet}
                                            sx={{
                                                padding: 0,
                                            }}
                                        />
                                        <p className="text-[14px]">
                                            {T(
                                                "haveReadAndAgreeToTheTermsOfService"
                                            )}
                                        </p>
                                    </FlexBox>
                                </FlexBox>
                                <LoadingButton
                                    type="submit"
                                    style={{ height: 52 }}
                                    color="primary"
                                    loading={loading}
                                    fullWidth
                                    disabled={
                                        !isValid ||
                                        !values.username ||
                                        !values.email
                                    }
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
                                    {T("signup")}
                                </LoadingButton>
                            </form>
                        )}
                    </Formik>
                </Grid>
                <Grid item lg={6} md={6} xs={6} className="content-left max-sm:!hidden">
                    <div className="content">
                        <img
                            className="img-preview-login"
                            src="/assets/images/preview_sign_up.png"
                            alt="preview_login"
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignUp;
