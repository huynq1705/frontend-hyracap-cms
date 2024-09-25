import {
    Slide,
    Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useDispatch } from "react-redux";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";

import palette from "@/theme/palette-common";
import {  Typography } from "antd";
import MyRadio from "@/components/input-custom-v2/radio";
import MySwitchV2 from "@/components/input-custom-v2/switch/MySwitchV2";
import PopupEditContentFootBill from "../components/PopupEdit"
import { useQuery } from "@tanstack/react-query";
import apiGeneralSettingService from "@/api/apiGeneralSetting";
import { setGlobalNoti } from "@/redux/slices/app.slice";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export interface PopupConfirmRemoveProps {
    refetch?: () => void;
    handleClose: () => void;
    // open: boolean;
    data: typeof INIT_EMPLOYEE;
    status: string | "create";
}


const SettingSystemsPage = () => {
    const { getGeneralSetting,putGeneralSetting} = apiGeneralSettingService();

    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const [formData, setFormData] = React.useState({
        id: 0,
        bill_size: 0,
        bill_content: 0,
        display_employee_name_on_invoice: 0,
        content_display_end_invoice: 0,
        display_qrcode_evalute_appointment: 0,
        content_end_invoice: ""
    });
    const [popup, setPopup] = React.useState({
        status : false,
        data: { id: 0, name: "", priority: 0 }
    })

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_GENERAL_SETTING"],
        queryFn: () => getGeneralSetting(),
        keepPreviousData: true,
    });

 
    React.useEffect(() => {
        let newData = data?.data[0]
        newData && setFormData({
            id: newData.id,
            bill_size: newData.bill_size,
            bill_content: newData.bill_content,
            display_employee_name_on_invoice: newData.display_employee_name_on_invoice,
            content_display_end_invoice: newData.content_display_end_invoice,
            display_qrcode_evalute_appointment: newData.display_qrcode_evalute_appointment,
            content_end_invoice: newData.content_end_invoice
        })
    }, [data]);


    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        console.log("hhh", name, value);

        setFormData((prev) => ({ ...prev, [name]: value }));
        handleSubmitUpdate({ [name]: value })
    };
    const handleOnchangeDate = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        handleSubmitUpdate({ [name]: value ? 1 : 0 })
    };
    const handleSubmitUpdate = async (data: {[key: string]: string|number}) => {
        try {
            const response = await putGeneralSetting(data,formData.id,[]);
            console.log(response); 
            
            switch (response) {
                case true: {
                    // navigate("/customer");
                    // refetch && refetch();
                    // handleClose();
                    setFormData((prev) => ({ ...prev, data }));
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: T("update") + " " + t("success"),
                        }),
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: T("update") + " " + t("fail"),
                        }),
                    );
                    break;
                }
                
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: T("thereWasError"),
                }),
            );
            console.error("==>", error);
        }

    };

    // const onClosePopup = editPassword ? handleClose : onChangePass
 


    return (
        <>
            <Stack
                sx={{
                    display: 'flex',
                    width: "100%",
                    pt: 3,
                    pb: "20px",
                }}
            >
                <Typography.Text style={{ fontSize: 24, color: palette.textQuaternary, fontWeight: "600", paddingLeft: 16 }}>
                    {T("setting")}
                </Typography.Text>
                <div
                className="m-4 bg-white rounded-2xl flex flex-col gap-2 px-4 py-4 w-[calc(100%-32px)] md:w-2/4">
                    <Typography.Text style={{ fontSize: 16, color: palette.textQuaternary, fontWeight: "600" }}>
                        Hóa đơn
                    </Typography.Text>
                    <MyRadio
                        handleChange={handleOnchange}
                        name="bill_size"
                        options={[{ label: "In theo chiều dọc", value: "0" }, { value: "1", label: "In theo chiều ngang" }]}
                        values={formData}
                        label="Khổ bill"
                        direction="row"
                        errors={[]}
                        validate={{}}
                    />
                    <MyRadio
                        handleChange={handleOnchange}
                        name="bill_content"
                        options={[{ label: "In theo chiều dọc", value: "0" }, { value: "1", label: "In theo chiều ngang" }]}
                        values={formData}
                        label="Nội dung bill"
                        direction="row"
                        errors={[]}
                        validate={{}}
                    />


                    <MySwitchV2
                        handleChange={handleOnchangeDate}
                        name="display_employee_name_on_invoice"
                        values={formData}
                        label="Hiển thị tên nhân viên thực hiện trên hóa đơn"
                        direction="row"
                        errors={[]}
                        validate={{}}

                        
                    />

                    <MySwitchV2
                        handleChange={handleOnchangeDate}
                        name="content_display_end_invoice"
                        values={formData}
                        label="Nội dung hiển thị cuối hóa đơn"
                        direction="row"
                        errors={[]}
                        validate={{}}
                        
                    />
                    {

                        !!formData.content_display_end_invoice &&
                        <Stack sx={{
                            border: "1px solid #D0D5DD",
                            borderRadius: "6px",
                            gap: 3,
                            backgroundColor: "#F2F4F7",
                            p: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 36,
                        }}>
                            {/* <Typography style={{ color:"#667085" }}>
                                {formData.content_end_invoice}
                            </Typography> */}
                                <div dangerouslySetInnerHTML={{ __html: formData.content_end_invoice }}
                                    className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 "  />
                            <Typography 
                            onClick={()=> setPopup({...popup,status: true,data: 
                                {  
                                    id: formData.id,
                                    name: formData.content_end_invoice,
                                    priority: 0
                                }})}
                            style={{
                                color: "#50945D",
                                fontWeight: 500,
                                cursor: "pointer"
                            }}>
                                Thay đổi
                            </Typography>
                        </Stack>
                    }
                    <MySwitchV2
                        handleChange={handleOnchangeDate}
                        name="display_qrcode_evalute_appointment"
                        values={formData}
                        label="Hiển thị mã QRCode đánh giá chất lượng, đặt hẹn trên hóa đơn"
                        direction="row"
                        errors={[]}
                        validate={{}}
                        
                    />
                </div>
            </Stack>
           {
                popup.status && <PopupEditContentFootBill
                    data={popup.data}
                    refetch={refetch}
                    handleClose={() => { setPopup({...popup,status: false})}}
                />
           }
        </>
    );
}
export default SettingSystemsPage;
