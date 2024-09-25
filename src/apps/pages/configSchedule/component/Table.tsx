import ButtonCore from "@/components/button/core";
import MySelect from "@/components/input-custom-v2/select";
import MyTextField from "@/components/input-custom-v2/text-field";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
    Box,
    formControlClasses,
    ListItem,
    ListItemText,
    Stack,
    TextField,
} from "@mui/material";
import { Button, List, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusScheduleSelect from "./StatusScheduleTable";
import CSwitch from "@/components/custom/CSwitch";
import apiAccountService from "@/api/Account.service";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import { OptionSelect } from "@/types/types";
import { INIT_APPOINTMENT_STATUS } from "@/constants/init-state/appointment_status";
import TimeSelect from "./CustomTimeSelect";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { useDispatch } from "react-redux";
import { getKeyPage } from "@/utils";
import apiScheduleService from "@/api/apiSchedule.service";
import AddIcon from "@/components/icons/add_icon";
import AqualIcon from "@/components/icons/aqual_icon";

const timeSlot = [
    { value: "5", label: "5 phút" },
    { value: "10", label: "10 phút" },
    { value: "15", label: "15 phút" },
    { value: "30", label: "30 phút" },
    { value: "60", label: "60 phút" },
];
const unitTime = [
    { value: "0", label: "Giờ" },
    { value: "1", label: "Phút" },
    { value: "2", label: "Ngày" },
    { value: "3", label: "Tháng" },
    { value: "4", label: "Năm" },
];
interface OptionScheduleStatus {
    key: string;
    value: string;
    color: string;
}
interface StaffOption {
    id: number;
    full_name: string;
}
const KEY_REQUIRED: string[] = [];
const VALIDATE = {};
const ConfigSchedule = () => {
    const { T, t } = useCustomTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const title_page = T(getKeyPage(pathname, "key"));
    const { getConfig, putConfig } = apiScheduleService();

    const { getAccount } = apiAccountService();
    const {
        getAppointmentStatus,
        postAppointmentStatus,
        deleteAppointmentStatus,
    } = apiAppointmentStatusService();

    const [staffAccount, setStaffAccount] = useState<StaffOption[]>([]);
    const [staffAccountSelect, setStaffAccountSelect] = useState<StaffOption[]>(
        []
    );
    const [errors, setErrors] = useState<string[]>([]);
    const [dataStatus, setDataStatus] = useState<OptionScheduleStatus[]>([]);
    const [deleteStatus, setDeleteStatus] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        id: 0,
        time_open: "",
        time_close: "",
        time_slot: 60,
        time_booking_min: 30,
        unit_time_booking_min: 0,
        time_booking_max: 30,
        unit_time_booking_max: 0,
        list_account_id: "",
        status_schedule_id: 15,
        status: 1,
    });
    const [appointmentStatus, setAppointmentStatus] = useState<
        OptionScheduleStatus[]
    >([]);

    const handleOnchange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleOnchangeData = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [searchTerm, setSearchTerm] = useState("");
    const getAllStaffAccount = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const response = await getAccount(param);
            if (response) {
                setStaffAccount(
                    response.data.map((it) => ({
                        id: it.id,
                        full_name: it.full_name,
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
                        key: it.id.toString(),
                        value: it.name,
                        color: it.color,
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
                setFormData(response);
            }
        } catch (err) {}
    };
    const filteredData = staffAccount.filter((item) =>
        item.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelectStaff = (staff: StaffOption) => {
        setStaffAccountSelect((prev) => [...prev, staff]);
    };
    const handleClearSelectStaff = () => {
        setStaffAccountSelect([]);
    };
    const handlerRemoveSelectStaff = (staff: StaffOption) => {
        setStaffAccountSelect((prev) => {
            const isSelected = prev.some((item) => item.id === staff.id);

            if (isSelected) {
                return prev.filter((item) => item.id !== staff.id);
            } else {
                return prev;
            }
        });
    };
    const convertTo24Hour = (time: string): string => {
        const [timePart, amPm] = time.split(" ");
        const [hour, minute] = timePart.split(":").map(Number);

        let hour24 = hour;
        if (amPm === "PM" && hour !== 12) {
            hour24 += 12;
        } else if (amPm === "AM" && hour === 12) {
            hour24 = 0;
        }

        const formattedHour = hour24.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");

        return `${formattedHour}:${formattedMinute}:00`;
    };
    const handleTimeOpenSelect = (value: string) => {
        const convertedValue = convertTo24Hour(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            time_open: convertedValue,
        }));
    };
    const handleTimeCloseSelect = (value: string) => {
        const convertedValue = convertTo24Hour(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            time_close: convertedValue,
        }));
    };
    const isSelected = (staff: StaffOption) =>
        staffAccountSelect.some((item) => item.id === staff.id);
    const handleCreateStatus = (
        options: OptionScheduleStatus[],
        deleteStatus: string[]
    ) => {
        const newDataStatus = options.map((option) => ({
            key: option.key,
            value: option.value,
            color: option.color,
        }));
        setDataStatus(newDataStatus);
        setDeleteStatus(deleteStatus);
    };
    const handleCreateConfig = async () => {
        try {
            const code = formData.id.toString();
            const data = {
                time_open: formData.time_open,
                time_close: formData.time_close,
                time_slot: formData.time_slot,
                time_booking_min: formData.time_booking_min,
                unit_time_booking_min: formData.unit_time_booking_min,
                time_booking_max: formData.time_booking_max,
                unit_time_booking_max: formData.unit_time_booking_max,
                list_account_id: formData.list_account_id,
                status_schedule_id: formData.status_schedule_id,
                status: formData.status,
            };
            const response = await putConfig(data, KEY_REQUIRED, code);
            switch (response) {
                case true: {
                    if (deleteStatus.length > 0) {
                        try {
                            const response = await deleteAppointmentStatus(
                                deleteStatus
                            );
                            if (!response) {
                                setDeleteStatus([]);
                                dispatch(
                                    setGlobalNoti({
                                        type: "error",
                                        message: `Xóa trạng thái thất bại`,
                                    })
                                );
                            }
                        } catch (e) {
                            throw e;
                        }
                    }
                    if (dataStatus.length > 0) {
                        try {
                            const data = dataStatus
                                ?.filter((item) => item.value !== "")
                                .map((item) => ({
                                    name: item.value,
                                    color: item.color,
                                    is_active: true,
                                }));
                            const response = await postAppointmentStatus(data);
                            if (response.status) {
                                setDataStatus([]);
                                dispatch(
                                    setGlobalNoti({
                                        type: "success",
                                        message: `Tạo trạng thái lịch hẹn thành công`,
                                    })
                                );
                            }
                        } catch (e) {
                            throw e;
                        }
                    }
                    navigate("/admin/schedule");
                    setFormData({
                        id: 0,
                        time_open: "",
                        time_close: "",
                        time_slot: 60,
                        time_booking_min: 30,
                        unit_time_booking_min: 0,
                        time_booking_max: 30,
                        unit_time_booking_max: 0,
                        list_account_id: "",
                        status_schedule_id: 15,
                        status: 1,
                    });
                    dispatch(
                        setGlobalNoti({
                            type: "success",
                            message: `${title_page} thành công`,
                        })
                    );
                    break;
                }
                case false: {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: `${title_page} thất bại`,
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
            console.error("==>", error);
        }
    };
    useEffect(() => {
        const accountIds = staffAccountSelect
            .map((staff) => staff.id)
            .join(",");
        if (formData.list_account_id !== accountIds) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                list_account_id: accountIds,
            }));
        }
    }, [staffAccountSelect]);

    useEffect(() => {
        if (staffAccount.length > 0 && formData.list_account_id) {
            const list_account_id = formData.list_account_id
                .split(",")
                .map(Number);

            const selectedStaff = staffAccount.filter((staff) =>
                list_account_id.includes(staff.id)
            );

            if (
                JSON.stringify(selectedStaff) !==
                JSON.stringify(staffAccountSelect)
            ) {
                setStaffAccountSelect(selectedStaff);
            }
        }
    }, [staffAccount, formData]);
    useEffect(() => {
        getAllStaffAccount();
        getAllAppointmentStatus();
        getConfigSchedule();
    }, []);
    return (
        <Stack>
            <Stack direction={"row"} gap={2} className="p-4 bg-white">
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                        color: "#50945D",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/admin/schedule");
                    }}
                >
                    Quản lý lịch hẹn
                </Typography.Title>
                <img src="/src/assets/icons/chevron-right-icon.svg" alt="" />
                <Typography.Title
                    level={4}
                    style={{
                        fontSize: "14px",
                        lineHeight: "22px",
                        margin: "0",
                    }}
                >
                    Cấu hình lịch hẹn
                </Typography.Title>
            </Stack>
            <Stack
                spacing={2}
                sx={{
                    p: 2,
                    width: "100%",
                }}
            >
                <Stack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={"row"}
                >
                    <Typography.Title
                        level={4}
                        style={{
                            fontSize: "24px",
                            lineHeight: "40px",
                            margin: "0",
                        }}
                    >
                        Cài đặt lịch hẹn
                    </Typography.Title>

                    <Stack
                        alignItems={"center"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        sx={{ gap: "12px" }}
                    >
                        <ButtonCore
                            title={T("cancel")}
                            type="bgWhite"
                            onClick={() => {
                                navigate("/admin/schedule");
                            }}
                        />
                        <ButtonCore
                            onClick={handleCreateConfig}
                            title={"Hoàn tất"}
                        />
                    </Stack>
                </Stack>
                <Box
                    sx={{
                        borderRadius: 3,
                        bgcolor: "#ffff",
                        py: 2,
                    }}
                >
                    <Stack
                        direction={"column"}
                        sx={{
                            width: "100%",
                            px: 2,
                        }}
                    >
                        {/* <Stack
                            direction={{ md: "row", sm: "column" }}
                            gap={2}
                            sx={{
                                width: "calc(100% - 24px)",
                            }}
                        >
                            <Stack
                                gap={1}
                                sx={{
                                    width: {
                                        md: "50%",
                                        sm: "100%",
                                    },
                                }}
                            >
                                <label className="label">Giờ mở cửa</label>
                                <TimeSelect
                                    initialValue={formData.time_open}
                                    label="Chọn giờ mở cửa"
                                    onSelect={handleTimeOpenSelect}
                                />
                            </Stack>
                            <Stack
                                gap={1}
                                sx={{
                                    width: {
                                        md: "50%",
                                        sm: "100%",
                                    },
                                }}
                            >
                                <label className="label">Giờ đóng cửa</label>
                                <TimeSelect
                                    initialValue={formData.time_close}
                                    label="Chọn giờ đóng cửa"
                                    onSelect={handleTimeCloseSelect}
                                />
                            </Stack>
                        </Stack> */}
                        <Stack
                            sx={{
                                width: { md: "calc(100% - 24px)", sm: "100%" },
                            }}
                        >
                            <MySelect
                                configUI={{
                                    width: "calc(50% - 12px)",
                                }}
                                label="Khoảng giờ"
                                name="time_slot"
                                handleChange={handleOnchange}
                                values={formData}
                                options={timeSlot}
                                errors={[]}
                                validate={{}}
                                required={[]}
                                itemsPerPage={5}
                                disabled={false}
                                placeholder="Chọn khoảng giờ"
                            />
                        </Stack>
                        <Stack
                            direction={{ md: "row", sm: "column" }}
                            gap={2}
                            sx={{
                                width: { md: "calc(100% - 24px)", sm: "100%" },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "end",
                                    width: { md: "50%", sm: "100%" },
                                }}
                            >
                                <MyTextField
                                    label="Thời gian đặt online cách tối thiểu"
                                    errors={[]}
                                    required={[]}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="time_booking_min"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={{}}
                                    disabled={false}
                                />
                                <Box
                                    sx={{
                                        width: "calc(50% - 12px)",
                                    }}
                                >
                                    <MySelect
                                        name="unit_time_booking_min"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        options={unitTime.slice(0, 3)}
                                        errors={[]}
                                        validate={{}}
                                        required={[]}
                                        itemsPerPage={5}
                                        disabled={false}
                                        placeholder="Chọn đơn vị"
                                    />
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "end",
                                    width: { md: "50%", sm: "100%" },
                                }}
                            >
                                <MyTextField
                                    label="Thời gian đặt online cách tối đa"
                                    errors={[]}
                                    required={[]}
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    name="time_booking_max"
                                    placeholder="Nhập"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    validate={{}}
                                    disabled={false}
                                />
                                <Box
                                    sx={{
                                        width: "calc(50% - 12px)",
                                    }}
                                >
                                    <MySelect
                                        name="unit_time_booking_max"
                                        handleChange={handleOnchange}
                                        values={formData}
                                        options={unitTime}
                                        errors={[]}
                                        validate={{}}
                                        required={[]}
                                        itemsPerPage={5}
                                        disabled={false}
                                        placeholder="Chọn đơn vị"
                                    />
                                </Box>
                            </Box>
                        </Stack>
                        <Stack
                            direction={"column"}
                            gap={2}
                            sx={{
                                width: "100%",
                            }}
                        >
                            <Stack
                                direction={{ md: "row", sm: "column" }}
                                gap={2}
                                sx={{
                                    width: {
                                        md: "calc(100% - 24px)",
                                        sm: "100%",
                                    },
                                }}
                            >
                                <Stack
                                    sx={{
                                        border: "1px solid #D0D5DD",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        width: { sm: "100%", md: "50%" },
                                    }}
                                >
                                    <Stack
                                        className="items-center rounded-tl-xl rounded-tr-xl bg-[#F9FAFB] p-2 max-h-[52px]"
                                        direction={"row"}
                                        gap={2}
                                    >
                                        <label className="label w-fit">
                                            Danh sách NV
                                        </label>
                                        <Stack sx={{ width: "100%" }}>
                                            <TextField
                                                placeholder="Tìm nhân viên"
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                sx={{ my: 1, height: "36px" }}
                                            />
                                        </Stack>
                                    </Stack>
                                    <List
                                        style={{
                                            overflow: "auto",
                                            height: "300px",
                                        }}
                                    >
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, index) => (
                                                <ListItem
                                                    key={index}
                                                    style={{
                                                        opacity: isSelected(
                                                            item
                                                        )
                                                            ? 0.5
                                                            : 1,
                                                        cursor: "pointer",
                                                        borderBottom:
                                                            "1px solid #D0D5DD",
                                                    }}
                                                    onClick={() =>
                                                        handleSelectStaff(item)
                                                    }
                                                >
                                                    <div
                                                        className="p-2 rounded-full bg-[#F6FAF7] mr-3"
                                                        style={{
                                                            pointerEvents:
                                                                isSelected(item)
                                                                    ? "none"
                                                                    : "auto",
                                                        }}
                                                    >
                                                        <AddIcon />
                                                    </div>
                                                    <ListItemText
                                                        primary={item.full_name}
                                                    />
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem>
                                                <ListItemText primary="Không tìm thấy kết quả" />
                                            </ListItem>
                                        )}
                                    </List>
                                </Stack>
                                <Stack
                                    direction={"column"}
                                    sx={{
                                        border: "1px solid #D0D5DD",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        width: { sm: "100%", md: "50%" },
                                    }}
                                >
                                    <Stack
                                        className="justify-between items-center rounded-tl-xl rounded-tr-xl bg-[#F9FAFB] p-2 min-h-[52px]"
                                        direction={"row"}
                                        gap={2}
                                    >
                                        <label className="label">
                                            Nhân viên không hiển thị
                                        </label>
                                        <label
                                            className="text-sm font-normal text-[#217732] cursor-pointer"
                                            onClick={handleClearSelectStaff}
                                        >
                                            Bỏ chọn tất cả
                                        </label>
                                    </Stack>
                                    {staffAccountSelect.length > 0 ? (
                                        <List
                                            style={{
                                                overflow: "auto",
                                                height: "300px",
                                            }}
                                        >
                                            {staffAccountSelect.map(
                                                (item, index) => (
                                                    <ListItem
                                                        key={index}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderBottom:
                                                                "1px solid #D0D5DD",
                                                        }}
                                                        onClick={() =>
                                                            handlerRemoveSelectStaff(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            style={{
                                                                pointerEvents:
                                                                    isSelected(
                                                                        item
                                                                    )
                                                                        ? "none"
                                                                        : "auto",
                                                            }}
                                                            className="p-2 h-8 w-8 flex justify-center items-center rounded-full bg-[#F6FAF7] mr-3"
                                                        >
                                                            <AqualIcon />
                                                        </div>

                                                        <ListItemText
                                                            primary={
                                                                item.full_name
                                                            }
                                                        />
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                    ) : (
                                        <Stack
                                            style={{
                                                borderTop: "1px solid #D0D5DD",
                                                backgroundColor: "#F9FAFB",
                                                flexGrow: 1,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                className="w-32 h-32"
                                                src="/src/assets/images/empty.png"
                                                alt=""
                                            />
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack
                            sx={{
                                width: "100%",
                            }}
                        >
                            <StatusScheduleSelect
                                label="Danh sách trạng thái lịch hẹn"
                                title="Danh sách trạng thái lịch hẹn"
                                initTitle="Chọn dịch vụ"
                                name="service_list"
                                initialSelectedOptions={appointmentStatus}
                                onSelectedOptionsChange={handleCreateStatus}
                                validate={{}}
                                errors={[]}
                                required={[]}
                                disabled={false}
                                configUI={{
                                    width: "100%",
                                }}
                            />
                        </Stack>
                        <Stack
                            direction={{ md: "row", sm: "column" }}
                            gap={2}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "calc(100%)",
                            }}
                        >
                            <Stack
                                width={{ md: "50%", sm: "100%" }}
                                direction={"column"}
                                gap={2}
                            >
                                <label className="label">
                                    Tự động chuyển trạng thái thanh toán đơn
                                    hàng
                                </label>
                                <Box height={32}>
                                    <CSwitch
                                        disabled={false}
                                        checked={!!formData.status}
                                        value={formData.status}
                                        name="status"
                                        onChange={(e) => {
                                            handleOnchangeData(
                                                e.target.name,
                                                !formData.status ? 1 : 0
                                            );
                                        }}
                                    />
                                </Box>
                            </Stack>
                            <Stack
                                width={{ md: "50%", sm: "100%" }}
                                direction={"column"}
                                gap={2}
                            >
                                <MySelect
                                    label="Trạng thái muốn chuyển"
                                    name="status_schedule_id"
                                    handleChange={handleOnchange}
                                    values={formData}
                                    options={appointmentStatus.map(
                                        (status) => ({
                                            value: status.key,
                                            label: status.value,
                                        })
                                    )}
                                    errors={[]}
                                    validate={{}}
                                    required={[]}
                                    itemsPerPage={5}
                                    disabled={false}
                                    placeholder="Chọn"
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    );
};

export default ConfigSchedule;
