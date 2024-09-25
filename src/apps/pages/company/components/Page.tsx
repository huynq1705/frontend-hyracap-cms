import apiAccountService from '@/api/Account.service';
import "/src/assets/styles/styles-company.scss";
import ButtonCore from '@/components/button/core';
import MyTextField from '@/components/input-custom-v2/text-field'
import useCustomTranslation from '@/hooks/useCustomTranslation';
import { OptionSelect } from '@/types/types';
import { Box, Stack } from '@mui/material'
import { Typography, UploadFile } from 'antd';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { setGlobalNoti } from '@/redux/slices/app.slice';
import { useDispatch } from 'react-redux';
import AvatarImage from '@/components/avatar';
import MyEditor from '@/components/input-custom-v2/editor';
import MyTextareaAutosize from '@/components/input-custom-v2/textarea-autosize';
import TableSchedule from './TableSchedule';
import { INIT_COMPANY } from '@/constants/init-state/company';
import apiCompanyService from '@/api/apiCompany';

const VALIDATE = {
    company_name: "Tên công ty không được để trống",
    // email: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    // full_name: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    // username: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};

const KEY_REQUIRED = [
    // "full_name",
    "company_name",
    // "phone_number",
    // "email",
    // "username",
];
export const CompanyPage = () => {
    const [formData, setFormData] = React.useState(INIT_COMPANY);
    const { getCompanyDetail ,putCompany } = apiCompanyService();
    const [errors, setErrors] = React.useState<string[]>([]);
    const { T, t } = useCustomTranslation();
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
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
        try {
            const response = await putCompany(formData, KEY_REQUIRED,fileList);
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
                    console.log(response);

                    if (typeof response === "object") {
                        setErrors(response.missingKeys);
                        dispatch(
                            setGlobalNoti({
                                type: "info",
                                message: "Nhập đẩy đủ dữ liệu",
                            }),
                        );
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
        }

    };
    const getData = async () => {

        await getCompanyDetail(1).then((e) => {
            e.data && setFormData(e.data)
        }).catch((e) => {
            console.log(e);

        })
    }
    useEffect(() => {
        getData()
    }, [])
    const [statusPage, setStatusPage] = React.useState("detail");


    return (
        <Stack
            spacing={2}
            sx={{
                overflowY: 'hidden',
                // scrollbarWidth: "thin",
                // maxHeight: "calc(100vh - 286px)",
                p: 2,
                width: "100%",
                
            }}>
            <Stack
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection={'row'}>
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "24px",
                        lineHeight: "40px",
                        margin: "0",
                    }}
                >
                    Thông tin công ty
                </Typography.Title>
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
                            <ButtonCore title={"Hoàn tất"} onClick={handleSubmitUpdate} />
                        </Stack>
                }

            </Stack>
            <Box
                sx={{
                    borderRadius: 3,
                    bgcolor: '#ffff',
                    py: 2,
                }}>

                <div className="wrapper-company overflow-y-auto  max-h-[calc(100vh-180px)] " 
                >
                        <AvatarImage
                            fileList={fileList}
                        data={formData.company_avt}
                            disabled={statusPage === "detail"}
                            setFileList={setFileList}
                            clear={() => { handleOnchangeDate("image", "") }}
                        />
                    <Typography.Text style={{ fontSize: 16, fontWeight: "600", width: '100%' }}>
                        Thông tin công ty
                    </Typography.Text>
                    <MyTextField
                        label="Tên công ty"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="company_name"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={false}
                    />
                    {/* <Box sx={{
                    width: "calc(50% - 12px)",
                }} /> */}

                    {/* <MyTextField
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
                /> */}

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
                        label="Địa chỉ"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="address"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Tỉnh/thành"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="city"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Quận/huyện"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="district"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Phường/xã"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="ward"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Website"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="website"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Facebook"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="facebook"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextField
                        label="Zalo"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="zalo"
                        placeholder="mituabc@gmail.com"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyTextareaAutosize
                        label="Mô tả ngắn"
                        errors={errors}
                        required={KEY_REQUIRED}
                        name="short_description"
                        placeholder="Nhập "
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={statusPage === "detail"}
                    />
                    <MyEditor
                        label="Giới thiệu doanh nghiệp"
                        errors={errors}
                        required={KEY_REQUIRED}
                        name="business_introduction"
                        placeholder="Nhập"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                    // inputStyle={{ height: 44 }}
                    />
                    <TableSchedule
                        label='Giờ đóng, mở cửa'
                        errors={[]}
                        initTitle=''
                        onSelectedOptionsChange={(name : string , value : any) => { 
                            setFormData({
                                ...formData,
                                opening_and_closing_hour:{
                                    ...formData.opening_and_closing_hour,
                                    [name] : value
                                 }
                            })
                        }}
                        title=''
                        validate={{}}
                        data={formData.opening_and_closing_hour}
                        disabled={statusPage === "detail"}
                    />
               
                </div>
               
            </Box>
        </Stack>
    )
}
