import apiCommonService from "@/api/apiCommon.service";
import ActionsEditPage from "@/components/actions-edit-page";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyTextField from "@/components/input-custom-v2/text-field";
import HeaderModalEdit from "@/components/header-modal-edit";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import MySelect from "@/components/input-custom-v2/select";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { INIT_SCHEDULE } from "@/constants/init-state/schedule";
import apiScheduleService from "@/api/apiSchedule.service";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import MySelectTwoItem from "@/components/input-custom-v2/select/index-v2";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import CustomSelect from "@/components/input-custom-v2/text-field/input-search-value";
import apiCustomerService from "@/api/apiCustomer.service";
import {
    createRangeTime,
    isCurrentTimeInRange,
} from "@/utils/create-list-range-time";
import { formatDate } from "@/utils/date-time";
import apiCompanyService from "@/api/apiCompany";

const VALIDATE = {
    full_name: "Hãy nhập tên khách hàng",
    phone_number: "Hãy nhập số điện thoại theo đúng định dạng ",
    list_service_id: "Hãy chọn dịch vụ",
    staff_id: "Hãy chọn nhân viên phục vụ",
    time: "Hãy chọn thời gian",
};
const KEY_REQUIRED = [
    "full_name",
    "phone_number",
    "list_service_id",
    "time",
    "staff_id",
];
interface CreatePageProps {
    onClose: () => void;
    refetch: () => void;
}
type CustomerType = {
    id: string;
    full_name: string;
    phone_number: string;
    email: string;
};
interface OptionTime {
    value: string;
    label: string;
}
export default function CreateSchedulePage(props: CreatePageProps) {
    const date = new Date();

    const { onClose, refetch } = props;
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const location = useLocation();
    const { detailCommon } = apiCommonService();
    const { getCustomer } = apiCustomerService();
    const { getConfig, postSchedule, putSchedule } = apiScheduleService();
    const { getAccount } = apiAccountService();
    const { getServiceCatalog } = apiServiceSpaServicerService();
    const { getService } = apiServiceSpaServicerService();
    const { getAppointmentStatus } = apiAppointmentStatusService();
    const { getCompanyDetail } = apiCompanyService();

    const [info, setInfo] = useState<any>(null);

    const [staffAccount, setStaffAccount] = useState<OptionSelect>([]);
    const [serviceCatalog, setServiceCatalog] = useState<OptionSelect>([]);
    const [service, setService] = useState<OptionSelect>([]);
    const [customer, setCustomer] = useState<CustomerType[]>([]);
    const [appointmentStatus, setAppointmentStatus] = useState<OptionSelect>(
        []
    );
    const [rangeTime, setRangeTime] = useState<OptionTime[]>([]);
    const [configData, setConfigData] = useState({
        time_open: "",
        time_close: "",
        time_slot: 30,
        time_booking_min: 1,
        unit_time_booking_min: 0,
        time_booking_max: 10,
        unit_time_booking_max: 0,
        list_account_id: "",
        status: 0,
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState(INIT_SCHEDULE);
    const { pathname } = useLocation();
    const [popup, setPopup] = useState({
        remove: false,
        loading: true,
    });
    const title_page = T(getKeyPage(pathname, "key"));

    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleOnchangeDate = (name: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
        const daysOfWeek: any = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        const currentDayIndex: any = new Date(value).getDay();
        const key: keyof typeof info.opening_and_closing_hour =
            daysOfWeek[currentDayIndex];
        const time = info.opening_and_closing_hour[key];
        const [open, close, is_active] = time.split("-");
        setConfigData((prev) => {
            if (is_active === "ACTIVE")
                return { ...prev, time_close: close, time_open: open };
            return { ...prev, time_close: "00:00:00", time_open: "00:00:00" };
        });
    };
    const handleFindPhone = (
        id: string,
        phone_number: string,
        full_name: string
    ) => {
        const customerMatch = customer.find(
            (c) => c.phone_number === phone_number
        );

        if (customerMatch) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                id: Number(customerMatch.id),
                phone_number: customerMatch.phone_number,
                full_name: customerMatch.full_name,
                email: customerMatch.email,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                id: null,
                phone_number: phone_number,
                full_name: "",
                email: "",
            }));
        }
        console.log("Selected Value:", phone_number);
    };

    const getConfigSchedule = async () => {
        try {
            const response = await getConfig();
            if (response) {
                setConfigData(response);
                const range_time = createRangeTime(
                    response.time_slot,
                    response.time_open,
                    response.time_close
                );
                setRangeTime(range_time);
            }
        } catch (err) {}
    };
    const getDetailCompany = async () => {
        try {
            const response = await getCompanyDetail(1);

            if (response.data) {
                setInfo(response.data);
                const daysOfWeek: any = [
                    "sunday",
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                ];
                const currentDayIndex: any = new Date(date).getDay();
                const key: keyof typeof response.data.opening_and_closing_hour =
                    daysOfWeek[currentDayIndex];
                const time = response.data.opening_and_closing_hour[key];
                const [open, close, is_active] = time.split("-");
                setConfigData((prev) => {
                    if (is_active === "ACTIVE")
                        return { ...prev, time_close: close, time_open: open };
                    return {
                        ...prev,
                        time_close: "00:00:00",
                        time_open: "00:00:00",
                    };
                });
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllServiceCatalog = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getServiceCatalog(param);
            if (response) {
                setServiceCatalog(
                    response.data.map((it) => ({
                        value: it.id.toString(),
                        label: it.name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllService = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getService(param);
            if (response) {
                setService(
                    response.data
                        .filter((it) => it.is_active === true)
                        .map((it) => ({
                            value: it.id.toString(),
                            label: it.name,
                        }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllCustomer = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getCustomer(param);
            if (response) {
                setCustomer(
                    response.data.map((it) => ({
                        id: it.id.toString(),
                        full_name: it.full_name,
                        phone_number: it.phone_number,
                        email: it.email,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const getAllAppointmentStatus = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getAppointmentStatus(param);
            if (response) {
                setAppointmentStatus(
                    response.data.map((it) => ({
                        value: it.id.toString(),
                        label: it.name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
    };

    // const getDetail = async () => {
    //     if (!code) return;

    //     try {
    //         const response = await detailCommon<any>(code, "/schedule");

    //         if (response) {
    //             const convert_data = {
    //                 id: response.id,
    //                 full_name: response.customer?.full_name,
    //                 phone_number: response.customer?.phone_number,
    //                 email: response.customer?.email,
    //                 customer_source_id: response.customer?.customer_source_id,
    //                 content: response.content,
    //                 date: response.date,
    //                 time: response.time,
    //                 type: response.type,
    //                 platform: response.platform,
    //                 customer_id: response.customer?.id,
    //                 creator_id: response.creator?.id.toString(),
    //                 status_schedule_id:
    //                     response.status_schedule?.id.toString() ?? "",
    //                 staff_id: response.staff?.id.toString() ?? "",
    //                 schedule_service:
    //                     response.schedule_service[0]?.service.id.toString() ??
    //                     "",
    //             };

    //             console.log(
    //                 "convert_data",
    //                 response.schedule_service[0]?.service.id
    //             );
    //             setFormData(convert_data);
    //         }
    //     } catch (error) {
    //         dispatch(
    //             setGlobalNoti({
    //                 type: "error",
    //                 message: "Failed to fetch schedule details",
    //             })
    //         );
    //         console.error(error);
    //     }
    // };
    const getAllStaffAccount = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const excludedIds = configData.list_account_id.split(",");
            const response = await getAccount(param);
            if (response) {
                setStaffAccount(
                    response.data
                        .filter((it) => !excludedIds.includes(it.id.toString()))
                        .map((it) => ({
                            value: it.id.toString(),
                            label: it.full_name,
                        }))
                );
            }
        } catch (e) {
            throw e;
        }
    };
    const handleCreate = async () => {
        console.log("formData", formData);
        try {
            const response = await postSchedule(formData, KEY_REQUIRED);

            switch (response) {
                case true: {
                    navigate("/admin/schedule");
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `Tạo ${title_page} thành công`,
                        })
                    );
                    setFormData(INIT_SCHEDULE);
                    refetch();
                    onClose();
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: `Tạo ${title_page} thất bại`,
                        })
                    );
                    break;
                }
                default: {
                    if (typeof response === "object") {
                        setErrors(response.missingKeys);
                        dispatch(
                            setGlobalNoti({
                                type: "info",
                                message: "Nhập đẩy đủ dữ liệu",
                            })
                        );
                    }
                }
            }
        } catch (error) {
            dispatch(
                setGlobalNoti({
                    type: "error",
                    message: "createError",
                })
            );
            console.error(error);
        }
    };
    const isView = useMemo(() => {
        return pathname.includes("view");
    }, [pathname]);
    const handleCancel = () => {
        setFormData(INIT_SCHEDULE);
        navigate("/admin/schedule");
        onClose();
    };
    const handelSave = async () => {
        if (isView) {
            navigate(`/admin/schedule/edit/${code}`);
        } else {
            await (code ? handleUpdate() : handleCreate());
        }
    };
    const handleUpdate = async () => {
        console.log("formData", formData);

        // if (!code) return;
        // try {
        //     const response = await putSchedule(formData, code, KEY_REQUIRED);
        //     switch (response) {
        //         case true: {
        //             navigate("/admin/schedule");
        //             setFormData(INIT_SCHEDULE);
        //             dispatch(
        //                 setGlobalNoti({
        //                     type: "success",
        //                     message: `Cập nhật ${title_page} thành công`,
        //                 })
        //             );
        //             onClose();
        //             break;
        //         }
        //         case false: {
        //             dispatch(
        //                 setGlobalNoti({
        //                     type: "error",
        //                     message: `Cập nhật ${title_page} thất bại`,
        //                 })
        //             );
        //             break;
        //         }
        //         default: {
        //             if (typeof response === "object") {
        //                 setErrors(response.missingKeys);
        //                 dispatch(
        //                     setGlobalNoti({
        //                         type: "info",
        //                         message: "Nhập đẩy đủ dữ liệu",
        //                     })
        //                 );
        //             }
        //         }
        //     }
        // } catch (error) {
        //     dispatch(
        //         setGlobalNoti({
        //             type: "error",
        //             message: "updateError",
        //         })
        //     );
        //     onClose();
        //     console.error(error);
        // }
    };
    const handleRemove = useCallback(() => {
        togglePopup("remove");
    }, []);
    const actions = useMemo(
        () => ({ handelSave, handleRemove, handleCancel }),
        [formData]
    );

    const togglePopup = useCallback((params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    }, []);
    const RANGE_TIME = useMemo(() => {
        const isCheck =
            formData.date &&
            formatDate(formData.date, "YYYYMMDD") ===
                formatDate(date, "YYYYMMDD");
        const range_time = createRangeTime(
            configData.time_slot,
            configData.time_open,
            configData.time_close
        );
        if (isCheck)
            return range_time.map((it) => ({
                ...it,
                isDisable: isCurrentTimeInRange(it.value),
            }));
        return range_time;
    }, [configData, info, formData.date]);
    useEffect(() => {
        getConfigSchedule();
        getDetailCompany();
        getAllCustomer();
        getAllServiceCatalog();
        getAllService();
        getAllAppointmentStatus();
    }, []);
    useEffect(() => {
        getAllStaffAccount();
    }, [configData]);
    useEffect(() => {
        RANGE_TIME;
    }, [configData, formData.date]);

    useEffect(() => {
        if (location.state?.time) {
            setFormData((prev) => ({
                ...prev,
                staff_id: location.state.id,
                time: location.state.time,
                date: location.state.date,
            }));
        }
    }, [location.state?.time]);
    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />

            <div className="wrapper-edit-page">
                <div className="wrapper-from">
                    <CustomSelect
                        label="Số điện thoại"
                        name="phone_number"
                        handleChange={handleFindPhone}
                        placeholder="Nhập số điện thoại"
                        values={formData}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        errors={errors}
                        options={customer}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                    />
                    <MyTextField
                        label="Tên khách hàng"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="full_name"
                        placeholder="Nhập tên khách hàng"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MyTextField
                        label="Email"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="email"
                        placeholder="Nhập email"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MyDatePickerMui
                        label="Ngày hẹn"
                        errors={errors}
                        required={KEY_REQUIRED}
                        disablePastDates={true}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="date"
                        placeholder="Chọn ngày hẹn"
                        handleChange={handleOnchangeDate}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                    <MySelectTwoItem
                        configUI={{
                            width: "calc(50% - 12px)",
                            numberItemPerRow: 2,
                        }}
                        label="Khung giờ"
                        name="time"
                        handleChange={handleOnchangeDate}
                        values={formData}
                        options={RANGE_TIME}
                        errors={errors}
                        validate={VALIDATE}
                        required={code ? [] : KEY_REQUIRED}
                        itemsPerPage={5}
                        disabled={isView}
                    />
                    <MySelect
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        label="Nhân viên thực hiện"
                        name="staff_id"
                        handleChange={handleOnchange}
                        values={formData}
                        options={staffAccount}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        disabled={isView}
                    />
                    <MySelect
                        configUI={{
                            width:
                                window.innerWidth < 601
                                    ? "100%"
                                    : "calc(50% - 12px)",
                        }}
                        label="Dịch vụ"
                        name="list_service_id"
                        placeholder="Chọn dịch vụ"
                        handleChange={handleOnchange}
                        values={formData}
                        options={service}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        type="select-multi"
                        disabled={code} // Adjust items per page as needed
                    />
                    <MySelect
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        label="Trạng thái lịch hẹn"
                        name="status_schedule_id"
                        handleChange={handleOnchange}
                        values={formData}
                        options={appointmentStatus}
                        errors={errors}
                        validate={VALIDATE}
                        required={KEY_REQUIRED}
                        itemsPerPage={5}
                        disabled={isView}
                    />
                    <MyTextareaAutosize
                        label="Yêu cầu"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "100%",
                        }}
                        name="content"
                        placeholder="Yêu cầu"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={isView}
                    />
                </div>
                <ActionsEditPage actions={actions} isView={isView} />
            </div>
        </>
    );
}
