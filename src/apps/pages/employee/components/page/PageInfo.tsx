import apiAccountService from '@/api/Account.service';
import ButtonCore from '@/components/button/core';
import CSwitch from '@/components/custom/CSwitch';
import MyDatePicker from '@/components/input-custom-v2/calendar';
import MyTextFieldCurrency from '@/components/input-custom-v2/currency/TextCurrency';
import MyTextFieldPassword from '@/components/input-custom-v2/password';
import MySelect from '@/components/input-custom-v2/select';
import MyTextField from '@/components/input-custom-v2/text-field'
import { INIT_EMPLOYEE } from '@/constants/init-state/employee';
import useCustomTranslation from '@/hooks/useCustomTranslation';
import { OptionSelect } from '@/types/types';
import { Box, Stack } from '@mui/material'
import { Typography, UploadFile } from 'antd';
import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import PopupChangePass from '../PopupChangePass';
import { setGlobalNoti } from '@/redux/slices/app.slice';
import { useDispatch } from 'react-redux';
import AvatarImage from '@/components/avatar';
import MyEditor from '@/components/input-custom-v2/editor';

const VALIDATE = {
    phone_number: "Số điện thoại không đúng định dạng.",
    email: "Email không đúng định dạng.",
    full_name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    username: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = [
    "full_name",
    "phone_number",
    "email",
    "username",
];
export const PageInfo = ({ setNote }: any) => {
    const [formData, setFormData] = React.useState(INIT_EMPLOYEE);
    const { code = 0, } = useParams();
    const { pathname } = useLocation();
    const { putAccount, getAccountDetail } = apiAccountService();
    const [errors, setErrors] = React.useState<string[]>([]);
    const { T, t } = useCustomTranslation();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const [listRole] = React.useState<OptionSelect>([{ label: "Quản lý", value: "Quản lý" }, { label: "Marketing", value: "Marketing" }, { label: "Thu ngân/ Lễ tân", value: "Thu ngân/ Lễ tân" }, { label: "Trị liệu viên", value: "Trị liệu viên" }, { label: "CSKH", value: "CSKH" }]);
    const [statusPage, setStatusPage] = React.useState(pathname.includes("detail") ? "detail" : "");
    const [editPassword, setEditPassword] = React.useState(false)
    const [isApi, setIsApi] = React.useState(false)
    const dispatch = useDispatch();
    const handleOnchangeDate = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmitUpdate = async () => {
        // const payload = {};
        // setErrors([])
        setIsApi(true)
        try {
            const response = await putAccount(formData, code, KEY_REQUIRED, []);
            switch (response) {
                case true: {
                    // navigate("/customer");
                    // refetch && refetch();
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: "updateSuccess",
                        }),
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "updateError",
                        }),
                    );
                    break;
                }
                default: {
                    if (typeof response === "object") {
                        if (response.isValid) {
                            let re: "email" | "phone_number" | "username";

                            if (response.missingKeys === "phone") {
                                re = "phone_number";
                            } else {
                                re = response.missingKeys as "email" | "username";
                            }

                            VALIDATE[re] = `${t(re)} đã tồn tại.`;
                            setErrors([re]);
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message: `${t(re)} đã tồn tại.`
                                }),
                            );
                        } else {
                            setErrors(response.missingKeys)
                            VALIDATE.phone_number = "Số điện thoại không đúng định dạng.",
                                VALIDATE.username = "Tên đăng nhập không được để trống.",
                                VALIDATE.email = "Email không đúng định dạng."
                            dispatch(
                                setGlobalNoti({
                                    type: "info",
                                    message: "Nhập đẩy đủ dữ liệu",
                                }),
                            );
                        }

                    }
                }
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "updateError",
                }),
            );
            console.error("==>", error);
        } finally {
            setIsApi(false)
        }

    };
    const getData = async () => {

        await getAccountDetail(code).then((e) => {
            console.log(e.data);
            let dataFetch = e.data
           if(dataFetch){
               setFormData(dataFetch)
               setNote(dataFetch.note_detail)
           }
        }).catch((e) => {
            console.log(e);

        })
    }
    useEffect(() => {
        getData()
    }, [code])
    


    return (
        <Stack
            spacing={2}
            className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'
            // sx={{
            //     overflowY: 'auto',
            //     scrollbarWidth: "thin",
            //     maxHeight: "calc(100vh - 250px)",
            //     p: 2,
            //     width: "100%",
            // }}
            >

            <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
                Thông tin nhân viên
            </Typography.Text>
            <Box sx={{ width: '100%', height: 1, borderBottom: 1, borderColor: '#D0D5DD' }} />
            <Stack
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection={'row'}>
                <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
                    Thông tin chung
                </Typography.Text>


                {
                    statusPage === "detail" ?
                        <ButtonCore
                            title='Chỉnh sửa thông tin'
                            type="bgWhite"
                            onClick={() => setStatusPage("")}
                        />
                        :
                        <Stack alignItems={"center"} flexDirection={'row'} justifyContent={"center"} sx={{ gap: "12px" }}>
                            <ButtonCore
                                title={T("cancel")}
                                type="bgWhite"
                                onClick={() => setStatusPage("detail")}
                            />
                            <ButtonCore title={"Hoàn tất"} onClick={handleSubmitUpdate}  loading ={isApi}/>
                        </Stack>
                }

            </Stack>
            <div className="wrapper-from">
                <AvatarImage
                    fileList={fileList}
                    data={formData.image}
                    disabled={statusPage === "detail"}
                    setFileList={setFileList}
                    clear={() => { handleOnchangeDate("image", "") }}
                />
                <MyTextField
                    label="Mã nhân viên"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="id"
                    placeholder="Mitu-ABC"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={true}
                />
                <Box sx={{
                    width: "calc(50% - 12px)",
                }} />

                <MyTextField
                    label="Họ và tên"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="full_name"
                    placeholder="Nguyễn Văn A"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />
                <Stack
                    direction={"column"}
                    spacing={1.5}
                    alignItems={"flex-start"}
                    sx={{
                        width: "calc(20% - 12px)",
                        height: "fit-content",
                    }}
                >
                    <label className="label">
                        {T("status")}{" "}
                    </label>
                    <Box height={32}>
                        <CSwitch
                            disabled={statusPage === "detail"}
                            checked={!!formData.status}
                            value={formData.status}
                            name="status"
                            onChange={(e) => {
                                handleOnchangeDate(e.target.name, !formData.status ? 1 : 0)
                            }} />
                    </Box>
                </Stack>
                <Stack
                    direction={"column"}
                    spacing={1.5}
                    alignItems={"flex-start"}
                    sx={{
                        width: "calc(20% - 12px)",
                        height: "fit-content",
                    }}
                >
                    <label className="label">
                        {"Nhận lịch online"}{" "}
                    </label>
                    <Box height={32}>
                        <CSwitch
                            disabled={statusPage === "detail"}
                            checked={!!formData.is_book_online}
                            value={formData.is_book_online}
                            name="is_book_online"
                            onChange={(e) => {
                                handleOnchangeDate(e.target.name, formData.is_book_online === 1 ? 0 : 1)
                            }} />
                    </Box>
                </Stack>


                <MyTextField
                    label="Email"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="email"
                    placeholder="mituabc@gmail.com"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />
                <MyTextField
                    label={T("phone_number")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="phone_number"
                    placeholder="0987xxxxx"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />
                <MySelect
                    options={listRole}
                    label="Chức vụ"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="position"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    // type="select-one"
                    itemsPerPage={6}
                    disabled={statusPage === "detail"}
                />

                <MyTextField
                    label="Ghi chú"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="note"
                    placeholder="Nhập "
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled
                />
                <MyEditor
                    label="Mô tả nhân viên"
                    errors={errors}
                    required={KEY_REQUIRED}
                    name="description"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                // inputStyle={{ height: 44 }}
                />
            </div>
            <Typography.Text style={{ fontSize: 18, fontWeight: 500 }}>
                Thông tin tài khoản
            </Typography.Text>

            <div className="wrapper-from">
                <MyTextField
                    label={T("userName")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="username"
                    placeholder="mitu@gmail.com"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage !== "create"}
                />
                <Box
                    alignItems={"flex-end"}
                    height={62}
                    display={"flex"}
                    pt={"66px"}
                    width={"calc(50% - 12px)"}>
                    <ButtonCore type="bgWhite" title="Đổi mật khẩu" onClick={() => setEditPassword(true)} />
                </Box>
            </div>
            <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
                Thông tin bổ sung
            </Typography.Text>
            <div className="wrapper-from">
                <MyDatePicker
                    label={T("date_of_birth")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="date_of_birth"
                    placeholder="Chọn"
                    handleChange={handleOnchangeDate}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />

                <MyTextField
                    label={T("address")}
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="address"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />
                <MyTextField
                    label="CCCD"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="cccd"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    disabled={statusPage === "detail"}
                />
                <MyTextFieldCurrency
                    label="Lương theo giờ"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="hourly_wage"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    type="current"
                    disabled={statusPage === "detail"}
                    unit="VND"
                />
                <MyTextFieldCurrency
                    label="Lương theo ca"
                    errors={errors}
                    required={KEY_REQUIRED}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="shift_wage"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    type="current"
                    disabled={statusPage === "detail"}
                    unit="VND"
                />

            </div>
            {
                editPassword && <PopupChangePass
                    code={code}
                    handleClose={() => { setEditPassword(false) }}
                />
            }
        </Stack>
    )
}
