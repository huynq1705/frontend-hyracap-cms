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
import { setGlobalNoti } from '@/redux/slices/app.slice';
import { OptionSelect } from '@/types/types';
import { Box, Stack } from '@mui/material'
import { Typography } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


export const PageNote = ({ note }: any) => {
    const { code } = useParams();
    const [formData, setFormData] = React.useState({
        position: "",
        work_unit: "",
        biography: "",
        experience: "",
        degree: "",
        note: "",
    });
    const { pathname } = useLocation();
    const [statusPage, setStatusPage] = React.useState(pathname.includes("detail") ? "detail" : "");
    const [errors, setErrors] = React.useState<string[]>([]);
    const { T, t } = useCustomTranslation();
    const navigate = useNavigate();
    const { putAccount } = apiAccountService();
    const dispatch = useDispatch();
    const [isApi, setIsApi] = React.useState(false)
    const handleOnchange = (e: any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmitUpdate = async () => {
        // const payload = {};
        setIsApi(true)
        if(code)
        try {
            const response = await putAccount({note_detail:formData},code, [],[]);
            switch (response) {
                case true: {
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
        setIsApi(false)
    };
    useEffect(() => {
        note && setFormData(note)

    }, [note])
    return (
        <Stack
            spacing={3}
            className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'>

            <Stack
                justifyContent={"space-between"}
                alignItems={"center"}
                flexDirection={'row'}>
                <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
                    Ghi chú
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
                            <ButtonCore title={"Hoàn tất"} onClick={handleSubmitUpdate} loading={isApi} />
                        </Stack>
                }

            </Stack>
            <Box sx={{ width: '100%', height: 1, borderBottom: 1, borderColor: '#D0D5DD' }} />

            <div className="wrapper-from">

                <MyTextField
                    label="Chức danh"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="position"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={{}}
                    disabled={statusPage === "detail"}
                />

                <MyTextField
                    label="Đơn vị công tác"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="work_unit"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    disabled={statusPage === "detail"}
                    
                    validate={{}}
                />



                <MyTextField
                    label="Tiểu sử"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="biography"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={{}}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                    label={"Kinh nghiệm"}
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="experience"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={{}}
                  disabled={statusPage === "detail"}
                />
                {/* <MySelect
                    options={listRole}
                    label="Chức vụ"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="position"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={VALIDATE}
                    // type="select-one"
                    itemsPerPage={5}
                /> */}

                <MyTextField
                    label="Bằng cấp"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="degree"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={{}}
                  disabled={statusPage === "detail"}
                />
                <MyTextField
                    label="Ghi chú"
                    errors={errors}
                    configUI={{
                        width: "calc(50% - 12px)",
                    }}
                    name="note"
                    placeholder="Nhập"
                    handleChange={handleOnchange}
                    values={formData}
                    validate={{}}
                  disabled={statusPage === "detail"}
                />

            </div>

        </Stack>
    )
}
