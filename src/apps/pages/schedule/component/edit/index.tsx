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
import { OptionSelect, OptionSelect2 } from "@/types/types";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import MySelectTwoItem from "@/components/input-custom-v2/select/index-v2";
import MyDatePickerMui from "@/components/input-custom-v2/calendar/calender_mui";
import { Stack } from "@mui/material";
import SelectGroup from "@/components/select-group";
import { formatDate } from "@/utils/date-time";
import X2ChevronDown from "@/components/icons/x2-chevron-down";
import { Timeline } from "antd";
import {
    createRangeTime,
    isCurrentTimeInRange,
} from "@/utils/create-list-range-time";
import ButtonCore from "@/components/button/core";
import ActionsEditPage from "@/components/actions-edit-page";
import {
    setCustomerId,
    setListServiceId,
} from "@/redux/slices/dataOrderSchedule.slice";
import apiCompanyService from "@/api/apiCompany";

const VALIDATE = {
    full_name: "Hãy nhập tên khách hàng",
    phone_number: "Hãy nhập số điện thoại theo đúng định dạng ",
    list_service_id: "Hãy chọn dịch vụ",
};
const KEY_REQUIRED = ["full_name", "phone_number", "list_service_id"];
interface EditPageProps {
    onClose: () => void;
    refetch: () => void;
}
interface History {
    infor_edit: string;
    created_at: string;
    full_name: string;
}
interface Option {
    key: string;
    value: string;
}
interface OptionTime {
    value: string;
    label: string;
}
export default function EditSchedulePage(props: EditPageProps) {
    const date = new Date();
    const dateFormat = "DD-MM-YYYY";
    const { onClose, refetch } = props;
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { T, t } = useCustomTranslation();
    const {
        getConfig,
        postSchedule,
        putSchedule,
        getOneSchedule,
        getHistorySchedule,
    } = apiScheduleService();
    const { getAccount } = apiAccountService();
    const { getServiceCatalog } = apiServiceSpaServicerService();
    const { getService } = apiServiceSpaServicerService();
    const { getAppointmentStatus } = apiAppointmentStatusService();
    const { getCompanyDetail } = apiCompanyService();

    const [staffAccount, setStaffAccount] = useState<OptionSelect>([]);
    const [serviceCatalog, setServiceCatalog] = useState<OptionSelect>([]);
    const [service, setService] = useState<OptionSelect2>([]);
    const [selectedService, setSelectedService] = useState<Option[]>([]);

    const [appointmentStatus, setAppointmentStatus] = useState<OptionSelect>(
        []
    );
    const [info, setInfo] = useState<any>(null);

    const [isShow, setIsShow] = useState(false);
    const [history, setHistory] = useState<History[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const { pathname } = useLocation();
    const [formData, setFormData] = useState(INIT_SCHEDULE);
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
                            key: it.id.toString(),
                            value: it.name,
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
    const getDetailSchedule = async () => {
        if (!code) return;
        try {
            const param = {
                page: 1,
                take: 20,
            };
            const response = await getOneSchedule(param, code);
            if (response) {
                const convert_data = {
                    id: response.data[0].id,
                    full_name: response.data[0].customer?.full_name,
                    phone_number: response.data[0].customer?.phone_number,
                    email: response.data[0].customer?.email,
                    customer_source_id:
                        response.data[0].customer?.customer_source_id,
                    content: response.data[0].content,
                    date: response.data[0].date,
                    time: response.data[0].time.substring(0, 5),
                    type: response.data[0].type,
                    platform: response.data[0].platform,
                    customer_id: response.data[0].customer?.id,
                    creator_id: response.data[0].creator?.id.toString(),
                    status_schedule_id:
                        response.data[0].status_schedule?.id?.toString() ?? "",
                    staff_id: response.data[0].staff?.id.toString() ?? "",
                    schedule_service: "",
                };

                const serviceOptions: Option[] =
                    response.data[0].schedule_service?.map(
                        (serviceItem: any) => ({
                            key: serviceItem.service?.id.toString(),
                            value: serviceItem.service?.name,
                        })
                    ) || [];
                setSelectedService(serviceOptions);
                setFormData(convert_data);
            }
        } catch (e) {
            throw e;
        }
    };
    const getListHistorySchedule = async () => {
        if (!code) return;
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getHistorySchedule(param, code);
            if (response) {
                setHistory(
                    response.data.map((it: any) => ({
                        infor_edit: it.infor_edit,
                        created_at: formatDate(it.created_at, "DDMMYYYYvsHHMM"),
                        full_name: it.creator.full_name,
                    }))
                );
            }
        } catch (e) {
            throw e;
        }
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
                console.log("rangeTime===>", rangeTime);
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
    const handleCreate = async () => {
        console.log("formData", formData);
        try {
            const response = await postSchedule(formData, KEY_REQUIRED);

            switch (response) {
                case true: {
                    navigate("/admin/schedule");
                    setFormData(INIT_SCHEDULE);
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `Tạo ${title_page} thành công`,
                        })
                    );
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
            setFormData(INIT_SCHEDULE);
            refetch();
        }
    };
    const handleUpdate = async () => {
        if (!code) return;
        try {
            const response = await putSchedule(formData, KEY_REQUIRED);
            switch (response) {
                case true: {
                    navigate("/admin/schedule");
                    setFormData(INIT_SCHEDULE);
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `Cập nhật ${title_page} thành công`,
                        })
                    );
                    onClose();
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: `Cập nhật ${title_page} thất bại`,
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
                    message: "updateError",
                })
            );
            onClose();
            console.error(error);
        }
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
    const toggleShowHistory = () => {
        setIsShow(!isShow);
    };
    const handleServiceChange = (options: Option[]) => {
        setFormData((prev) => ({
            ...prev,
            list_service_id: options.map((option) => ({
                key: option.key,
                value: option.value,
            })),
        }));
    };
    const handleNavigate = () => {
        dispatch(
            setCustomerId({
                id: formData.customer_id ?? 0,
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                email: formData.email,
                schedule_id: code ? +code : null,
            })
        );
        dispatch(
            setListServiceId(formData.list_service_id.map((x: any) => x.key))
        );
        navigate("/admin/order/create");
    };

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
    }, [configData, formData.date]);
    useEffect(() => {
        getConfigSchedule();
        getDetailCompany();
        getDetailSchedule();
        getAllStaffAccount();
        getAllServiceCatalog();
        getAllService();
        getAllAppointmentStatus();
        getListHistorySchedule();
        setIsShow(false);
    }, [code]);
    useEffect(() => {
        RANGE_TIME;
    }, [configData, formData.date]);

    return (
        <>
            <HeaderModalEdit onClose={handleCancel} />

            <div className="wrapper-edit-page">
                {isView && (
                    <div className="history">
                        <div
                            className="flex items-center gap-1 my-3 cursor-pointer"
                            onClick={toggleShowHistory}
                        >
                            <div className="title font-medium text-base text-[#50945D]">
                                Xem lịch sử thay đổi
                            </div>
                            <div
                                className={`transform transition-transform ${
                                    isShow ? "rotate-0" : "rotate-180"
                                }`}
                            >
                                <X2ChevronDown />
                            </div>
                        </div>
                        {isShow && (
                            <div className="list-history bg-[#F6FAF7] p-5 rounded-xl my-3 flex flex-col gap-3">
                                {history.length > 0 ? (
                                    <Timeline>
                                        {history.map((item, index) => (
                                            <Timeline.Item
                                                key={index}
                                                color={"#D0D5DD"}
                                            >
                                                <div className="font-medium text-sm text-[#1D2939]">
                                                    {item.infor_edit}
                                                </div>
                                                <div className="flex items-center font-normal text-base text-[#475467] gap-3">
                                                    <div>{item.created_at}</div>
                                                    <div className="w-[6px] h-[6px] rounded-full bg-[#475467]"></div>
                                                    <div>{item.full_name}</div>
                                                </div>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <div className="font-medium text-sm text-[#1D2939]">
                                        Chưa có lịch sử chỉnh sửa
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <div className="wrapper-from">
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
                    <MyTextField
                        label="Mã lịch hẹn"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="id"
                        placeholder=""
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
                    />
                    <MyTextField
                        label="Số điện thoại"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="phone_number"
                        placeholder="Nhập số điện thoại"
                        handleChange={handleOnchange}
                        values={formData}
                        validate={VALIDATE}
                        disabled={true}
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
                        disabled={true}
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
                        disabled={true}
                    />
                    <MyDatePickerMui
                        label="Ngày hẹn"
                        errors={errors}
                        required={KEY_REQUIRED}
                        configUI={{
                            width: "calc(50% - 12px)",
                        }}
                        name="date"
                        placeholder="Chọn ngày hẹn"
                        handleChange={handleOnchangeDate}
                        disablePastDates={true}
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
                    <Stack
                        direction={"column"}
                        spacing={1.5}
                        alignItems={"flex-start"}
                        sx={{
                            width: "100%",
                            height: "fit-content",
                        }}
                    >
                        <SelectGroup
                            label="Tên dịch vụ"
                            title="Danh sách dịch vụ"
                            initTitle="Chọn dịch vụ"
                            name="list_service_id"
                            availableOptions={service}
                            initialSelectedOptions={selectedService}
                            onSelectedOptionsChange={handleServiceChange}
                            validate={VALIDATE}
                            errors={errors}
                            required={KEY_REQUIRED}
                            disabled={isView}
                            configUI={{
                                width: "100%",
                            }}
                        />
                    </Stack>
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
                {isView ? (
                    <Stack
                        direction={"row"}
                        justifyContent={"flex-end"}
                        alignItems={"center"}
                        gap={2}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 1)",
                            padding: "12px 0px",
                            width: "100%",
                            "& button": "fit-content",
                        }}
                    >
                        {/* <ButtonCore
                            title="Xóa lịch hẹn"
                            type="remove"
                            onClick={() => {
                                togglePopup("remove");
                            }}
                        /> */}
                        <ButtonCore
                            title="Chỉnh sửa lịch hẹn"
                            type="bgWhite"
                            onClick={actions.handelSave}
                        />
                        {formData.status_schedule_id != "15" && (
                            <ButtonCore
                                title="Thanh toán (Tạo đơn hàng)"
                                onClick={handleNavigate}
                            />
                        )}
                    </Stack>
                ) : (
                    <ActionsEditPage actions={actions} isView={isView} />
                )}
            </div>
        </>
    );
}
