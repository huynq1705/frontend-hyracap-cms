import moment from "moment";
import "react-calendar-timeline/lib/Timeline.css";
import { StatusScheduleArray } from "@/types/appointmentStatus";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import apiAppointmentStatusService from "@/api/apiAppointmentStatus.service";
import { Box, Stack, Tab, useMediaQuery } from "@mui/material";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Empty, Pagination, PaginationProps, Table, Typography } from "antd";
import { KeySearchType, OptionSelect } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
    convertObjToParam,
    handleGetPage,
    parseQueryParams,
} from "@/utils/filter";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import apiScheduleService from "@/api/apiSchedule.service";
import CalenderTable from "./Calender";
import ModalEdit from "./ModalEdit";
import ModalListSchedule from "./ModalListSchedule";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import { formatDate } from "@/utils/date-time";
import SearchBoxTable from "@/components/search-box-table";
import StatusCard from "@/components/status-card";
import DateSchedule from "./custom-datetime-picker";
import { selectPage } from "@/redux/selectors/page.slice";
import { setTotalItems } from "@/redux/slices/page.slice";
import MySelect from "@/components/input-custom-v2/select";
import apiAccountService from "@/api/Account.service";
import SelectSearchInput from "@/components/input-custom-v2/select/select-search-add";
import CustomSelectCheckbox from "@/components/input-custom-v2/select/multi-select-checkbox";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import { setSubTab } from "@/redux/slices/checkPanigation.slice";

const statusDefaults = [
    {
        id: 0,
        name: "Tổng lịch hẹn",
        color: "#BF3DD9",
        total: 0,
    },
    {
        id: 0,
        name: "Đặt hẹn",
        color: "#BF3DD9",
        total: 0,
    },
    {
        id: 0,
        name: "Đặt online",
        color: "#BF3DD9",
        total: 0,
    },
    {
        id: 0,
        name: "Chưa đến",
        color: "#0D63F3",
        total: 0,
    },
    {
        id: 0,
        name: "Đã đến",
        color: "#0D63F3",
        total: 0,
    },
    {
        id: 0,
        name: "Đang dịch vụ",
        color: "#DE8208",
        total: 0,
    },
    {
        id: 0,
        name: "Đã hoàn thành",
        color: "#50945D",
        total: 0,
    },
    {
        id: 0,
        name: "Đã hủy",
        color: "#D83D32",
        total: 0,
    },
    {
        id: 0,
        name: "Lịch khác",
        color: "#475467",
        total: 0,
    },
];
interface ColumnProps {
    actions: {
        [key: string]: (...args: any) => void;
    };
}
const CustomCardList = ({ dataConvert, actions }: any) => {
    const navigate = useNavigate();
    return (
        <div className=" flex md:hidden flex-col space-y-4">
            {dataConvert.map((item: any, index: any) => (
                <div
                    key={item.id}
                    className="border border-solid border-gray-4 shadow rounded-lg mb-4"
                >
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            STT
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{index + 1}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mã đặt hẹn
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.id}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên khách hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.customer?.full_name}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Số điện thoại
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.customer?.phone_number}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Loại lịch hẹn
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.type}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Dịch vụ
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.schedule_service?.length
                                    ? item.schedule_service
                                          .map((x: any) => x?.service?.name)
                                          .filter((x: any) => x)
                                          .join(", ")
                                    : "- -"}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Nhân viên thực hiện
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.staff?.full_name
                                    ? item?.staff?.full_name
                                    : "- -"}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <div className="h-7 rounded-2xl relative overflow-hidden w-32">
                                <div
                                    className="absolute top-0 right-0 left-0 bottom-0 z-5 opacity-10"
                                    style={{
                                        background:
                                            item?.status_schedule?.color ??
                                            "transparent",
                                    }}
                                ></div>
                                <Stack
                                    direction={"row"}
                                    className="absolute top-0 right-0 left-0 bottom-0 z-6 transparent text-sm flex items-center  gap-2 px-2"
                                    sx={{
                                        color:
                                            item?.status_schedule?.color ??
                                            "black",
                                    }}
                                >
                                    <div
                                        className="w-[6px] h-[6px] rounded-full"
                                        style={{
                                            background:
                                                item?.status_schedule?.color ??
                                                "transparent",
                                        }}
                                    ></div>
                                    <p className="flex-grow-1">
                                        {item?.status_schedule?.name ?? "- -"}
                                    </p>
                                </Stack>
                            </div>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Người tạo lịch
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.creator?.full_name ?? "Đang cập nhật"}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Ngày tạo
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {formatDate(
                                    `${item?.created_at}`,
                                    "DDMMYYYYvsHHMM"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Nền tảng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>Online</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Thao tác
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <div className="flex items-center g-8 justify-start space-x-4">
                                <ActionButton
                                    type="view"
                                    onClick={() => {
                                        navigate(
                                            `/admin/schedule/view/${item?.id}`
                                        );
                                        actions.togglePopup("edit");
                                    }}
                                />
                                <ActionButton
                                    type="edit"
                                    onClick={() => {
                                        navigate(
                                            `/admin/schedule/edit/${item?.id}`
                                        );
                                        actions.togglePopup("edit");
                                    }}
                                />
                                <ActionButton
                                    type="remove"
                                    onClick={() => {
                                        actions.openRemoveConfirm(
                                            "remove",
                                            item?.id
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const getColumns = (props: ColumnProps) => {
    const navigate = useNavigate();
    const { T } = useCustomTranslation();
    const { pathname } = useLocation();
    //permissions
    const { hasPermission } = usePermissionCheck("schedule");

    const { actions } = props;
    const columns: any = [
        {
            title: "STT",
            dataIndex: "product",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {index + 1}
                    </Typography>
                </Stack>
            ),
            width: 50,
        },
        {
            title: "Mã đặt hẹn",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.id}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Tên khách hàng",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.customer?.full_name}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Số điện thoại",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.customer?.phone_number}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Loại lịch hẹn",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.type === 0 ? "Nhân sự tạo" : "Khách hàng tạo"}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Dịch vụ",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => {
                const content = item?.schedule_service?.length
                    ? item.schedule_service
                          .map((x: any) => x?.service?.name)
                          .filter((x: any) => x)
                          .join(", ")
                    : "- -";

                return (
                    <Stack direction={"column"} spacing={1}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "var(--text-color-three)",
                                textAlign: "center",
                            }}
                        >
                            {content}
                        </Typography>
                    </Stack>
                );
            },
            width: 150,
        },
        {
            title: "Nhân viên thực hiện",
            dataIndex: "schedule",
            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.staff?.full_name
                            ? item?.staff?.full_name
                            : "- -"}
                    </Typography>
                </Stack>
            ),
            width: 170,
        },
        {
            title: "Trạng thái",
            dataIndex: "color",
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"center"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                    }}
                >
                    <Stack direction={"row"} gap={"24px"}>
                        <div className="h-7 rounded-2xl relative overflow-hidden w-32">
                            <div
                                className="absolute top-0 right-0 left-0 bottom-0 z-5 opacity-10"
                                style={{
                                    background:
                                        item?.status_schedule?.color ??
                                        "transparent",
                                }}
                            ></div>
                            <Stack
                                direction={"row"}
                                className="absolute top-0 right-0 left-0 bottom-0 z-6 transparent text-sm flex items-center  gap-2 px-2"
                                sx={{
                                    color:
                                        item?.status_schedule?.color ?? "black",
                                }}
                            >
                                <div
                                    className="w-[6px] h-[6px] rounded-full"
                                    style={{
                                        background:
                                            item?.status_schedule?.color ??
                                            "transparent",
                                    }}
                                ></div>
                                <p className="flex-grow-1">
                                    {item?.status_schedule?.name ?? "- -"}
                                </p>
                            </Stack>
                        </div>
                    </Stack>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Người tạo lịch",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {item?.creator?.full_name ?? "Đang cập nhật"}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Ngày tạo",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "center",
                        }}
                    >
                        {formatDate(`${item?.created_at}`, "DDMMYYYYvsHHMM")}
                    </Typography>
                </Stack>
            ),
            width: 150,
        },
    ];
    {
        (hasPermission.update || hasPermission.delete) &&
            columns.push({
                title: T("action"),
                width: 100,
                dataIndex: "actions",
                fixed: "right" as const,
                render: (_: any, d: any) => (
                    <>
                        {true && (
                            <Stack
                                direction={"row"}
                                sx={{
                                    gap: "12px",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    paddingLeft: "8px",
                                    paddingRight: "8px",
                                }}
                            >
                                {hasPermission.getDetail && (
                                    <ActionButton
                                        type="view"
                                        onClick={() => {
                                            navigate(
                                                `/admin/schedule/view/${d?.id}`
                                            );
                                            actions.togglePopup("edit");
                                        }}
                                    />
                                )}
                                {hasPermission.update && (
                                    <ActionButton
                                        type="edit"
                                        onClick={() => {
                                            navigate(
                                                `/admin/schedule/edit/${d?.id}`
                                            );
                                            actions.togglePopup("edit");
                                        }}
                                    />
                                )}
                                {/* {hasPermission.delete && ( */}
                                <ActionButton
                                    type="remove"
                                    onClick={() => {
                                        actions.openRemoveConfirm(
                                            "remove",
                                            d?.id
                                        );
                                    }}
                                />
                                {/* )} */}
                            </Stack>
                        )}
                    </>
                ),
            });
    }
    return columns;
};

const keywords = ["create", "view", "edit"];

const CTable = () => {
    const { code } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { pathname, search } = useLocation();
    const [formData, setFormData] = useState<StatusScheduleArray[]>([]);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [scheduleList, setScheduleList] = useState<any>([]);
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        upload: false,
        listSchedule: false,
        getLink: false,
    });

    const [subTabSchedule, setSubTabSchedule] = useState("1");
    const { getScheduleDay } = apiScheduleService();
    const { getAccount } = apiAccountService();
    const { getAppointmentStatus } = apiAppointmentStatusService();

    const [staffAccount, setStaffAccount] = useState<OptionSelect>([]);
    const [staffAccountCheckbox, setStaffAccountCheckbox] =
        useState<string>("");
    const [statusFilter, setStatusFilter] = useState<OptionSelect>([]);
    const [statusFilterCheckbox, setStatusFilterCheckbox] =
        useState<string>("");

    const handleEventsChange = (newEvents: Event[]) => {
        setScheduleList(newEvents);
    };
    const getAllSchedule = async () => {
        try {
            const param = {
                page: 1,
                take: 999,
            };
            const date = selectedDate.format("YYYY-MM-DD");
            const response = await getScheduleDay(param, date);

            if (response.data && Array.isArray(response.data)) {
                const data_res = response.data;
                const totalAppointments = data_res.length;

                const statusNameCountMap = data_res.reduce(
                    (
                        acc: {
                            [key: string]: {
                                id: number;
                                color: string;
                                total: number;
                            };
                        },
                        item: any
                    ) => {
                        if (item.type === 0) {
                            acc["Đặt hẹn"] = acc["Đặt hẹn"] || {
                                id: 0,
                                color: "",
                                total: 0,
                            };
                            acc["Đặt hẹn"].total += 1;
                        } else if (item.type === 1) {
                            acc["Đặt online"] = acc["Đặt online"] || {
                                id: 0,
                                color: "",
                                total: 0,
                            };
                            acc["Đặt online"].total += 1;
                        }
                        const statusName =
                            item.status_schedule?.name || "Unknown";
                        if (!acc[statusName]) {
                            acc[statusName] = {
                                id: item.status_schedule?.id || 0,
                                color: item.status_schedule?.color || "",
                                total: 0,
                            };
                        }
                        acc[statusName].total += 1;

                        return acc;
                    },
                    {}
                );
                const updatedStatusDefaults = statusDefaults.map((status) => {
                    const statusData = statusNameCountMap[status.name];
                    if (status.name === "Tổng lịch hẹn") {
                        return { ...status, total: totalAppointments };
                    } else if (statusData) {
                        // Cập nhật cho Đặt hẹn và Đặt online
                        if (
                            status.name === "Đặt hẹn" ||
                            status.name === "Đặt online"
                        ) {
                            return {
                                ...status,
                                total: statusData.total,
                            };
                        } else {
                            // Cập nhật cho các trạng thái khác
                            return {
                                ...status,
                                id: statusData.id,
                                color: statusData.color,
                                total: statusData.total,
                            };
                        }
                    } else {
                        // Giữ nguyên nếu không có dữ liệu
                        return status;
                    }
                });

                setFormData(updatedStatusDefaults);
            }
        } catch (e) {
            throw e;
        }
    };

    console.log("formData====?>>>", formData);
    const page = useSelector(selectPage);

    // search
    const handleGetParam = () => {
        const params: any = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        if (!params["page"]) params["page"] = 1;
        if (!params["take"]) params["take"] = 10;
        return params;
    };
    const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
    const param_payload = useMemo(() => {
        return handleGetParam();
    }, [searchParams]);
    // search
    const [keySearch, setKeySearch] = useState<KeySearchType>({});
    const [flagSearch, setFlagSearch] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [status, setStatus] = useState<string>();
    const date = selectedDate.format("YYYY-MM-DD");
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: [
            "GET_SCHEDULE",
            param_payload,
            date,
            staffAccountCheckbox,
            statusFilterCheckbox,
        ],
        queryFn: () =>
            getScheduleDay(
                param_payload,
                date,
                staffAccountCheckbox,
                statusFilterCheckbox
            ),
        keepPreviousData: true,
    });
    const dataConvert = useMemo(() => {
        const data_res = data?.data;
        if (data && data?.meta) {
            dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
        }
        if (data_res && Array.isArray(data_res))
            return data_res.map((item) => ({ ...item, key: item?.id }));
        return [];
    }, [data]);

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
                        value: it.id.toString(),
                        label: it.full_name,
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
                setStatusFilter(
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
    const selectedRowLabels = useMemo(() => {
        return dataConvert
            .filter((item) => selectedRowKeys.includes(item.key))
            .map((item) => item.content);
    }, [selectedRowKeys]);

    const isSmallScreen = useMediaQuery("(max-width: 640px)");
    const handleChangeSubTab = (
        event: React.SyntheticEvent,
        newValue: string
    ) => {
        setSubTabSchedule(newValue);
    };
    const stringFilter = (value: string[]) => {
        const result = value.join(";");
        return result;
    };
    const handleFilterStaff = (value: string[]) => {
        setStaffAccountCheckbox(stringFilter(value));
    };
    const handleFilterStatus = (value: string[]) => {
        setStatusFilterCheckbox(stringFilter(value));
    };
    const togglePopup = (params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    };

    useEffect(() => {
        getAllSchedule();
        getAllStaffAccount();
        getAllAppointmentStatus();
    }, [code, selectedDate]);
    useEffect(() => {
        refetch();
    }, [selectedDate, refetch, statusFilterCheckbox, staffAccountCheckbox]);
    // search
    useEffect(() => {
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);
    }, []);
    useEffect(() => {
        if (flagSearch) handleSearch();
    }, [flagSearch]);
    // search
    useEffect(() => {
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);
        if (!code && !pathname.includes("create")) return;
        if (pathname.includes("view")) {
            navigate(`/admin/schedule/view/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("edit")) {
            navigate(`/admin/schedule/edit/${code}`);
            togglePopup("edit");
        }
    }, [window.location.href]);
    // search
    const handleSearch = () => {
        let filter = convertObjToParam(keySearch, {
            page: currentPage,
            take: pageSize,
            text: keySearch?.text?.toString().trim(),
        });
        let url = `${pathname}${filter}`;
        navigate(url);
    };
    const actions = {
        openRemoveConfirm: (key_popup: string, code_item: string) => {
            togglePopup(key_popup as keyof typeof popup);
            setSelectedRowKeys([code_item]);
        },
        togglePopup,
    };
    const text_search = useMemo(
        () => keySearch?.text?.toString() ?? "",
        [keySearch?.text, pathname]
    );
    useEffect(() => {
        let st = keywords.some((keyword) => pathname.includes(keyword));
        setPopup({ ...popup, edit: st });
    }, [pathname]);
    useEffect(() => {
        if (isSmallScreen) {
            setSubTabSchedule("2");
        }
    }, [isSmallScreen]);
    useEffect(() => {
        if (subTabSchedule === "1" && pathname.includes("schedule")) {
            dispatch(setSubTab(true));
        } else {
            dispatch(setSubTab(false));
        }
    }, [subTabSchedule, pathname, dispatch]);
    useEffect(() => {
        return () => {
            dispatch(setSubTab(false));
        };
    }, []);
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "max-content",
                    typography: "body1",

                    bgcolor: "#fff",
                }}
            >
                <TabContext value={subTabSchedule}>
                    {!isSmallScreen && (
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                onChange={handleChangeSubTab}
                                aria-label="lab API tabs example"
                            >
                                <Tab
                                    icon={
                                        <Box
                                            component="img"
                                            src={
                                                subTabSchedule === "1"
                                                    ? "/assets/images/date-picker-icon-active.svg"
                                                    : "/assets/images/date-picker-icon.svg"
                                            }
                                            alt="Hamburger Icon"
                                            sx={{ width: 24, height: 24 }}
                                        />
                                    }
                                    iconPosition="start"
                                    label="Xem theo lịch"
                                    value="1"
                                />
                                <Tab
                                    icon={
                                        <Box
                                            component="img"
                                            src={
                                                subTabSchedule === "2"
                                                    ? "/assets/images/hamburger-icon-active.svg"
                                                    : "/assets/images/hamburger-icon.svg"
                                            }
                                            alt="Hamburger Icon"
                                            sx={{ width: 24, height: 24 }}
                                        />
                                    }
                                    iconPosition="start"
                                    label="Xem theo danh sách"
                                    value="2"
                                />
                            </TabList>
                        </Box>
                    )}
                    <Stack
                        direction={{ sm: "column", lg: "row" }}
                        className="p-4"
                        gap={2}
                    >
                        <SearchBoxTable
                            keySearch={text_search}
                            setKeySearch={(value?: string) => {
                                setKeySearch((prev) => ({
                                    ...prev,
                                    text: value || "",
                                }));
                            }}
                            handleSearch={handleSearch}
                            placeholder="Tìm theo lịch trong ngày của nhân viên"
                        />
                        <div className="flex gap-3 w-full">
                            {subTabSchedule === "2" && (
                                <CustomSelectCheckbox
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    label="Nhân viên"
                                    name="staffFilter"
                                    placeholder="Chọn"
                                    handleChange={handleFilterStaff}
                                    values={formData}
                                    options={staffAccount}
                                    disabled={false}
                                />
                            )}
                            {subTabSchedule === "2" && (
                                <CustomSelectCheckbox
                                    configUI={{
                                        width: "calc(50% - 12px)",
                                    }}
                                    label="Trạng thái"
                                    name="statusFilter"
                                    placeholder="Chọn"
                                    handleChange={handleFilterStatus}
                                    values={formData}
                                    options={statusFilter}
                                    disabled={false}
                                />
                            )}
                        </div>
                        <Stack
                            direction={"column"}
                            className={`flex ${
                                subTabSchedule === "2" ? "" : "justify-end mb-1"
                            }`}
                        >
                            <DateSchedule
                                label={
                                    subTabSchedule === "2"
                                        ? "Ngày hẹn"
                                        : undefined
                                }
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        </Stack>
                    </Stack>
                    <div className="w-full flex gap-4 flex-wrap p-4 overflow-x-scroll">
                        {formData.map((item) => (
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    setStatus(item.id?.toString());
                                    setSubTabSchedule("2");
                                }}
                            >
                                <StatusCard
                                    key={item.name}
                                    statusData={item}
                                    customCss="max-sm:w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]   "
                                />
                            </div>
                        ))}
                    </div>
                    {search.includes("text") && key_search?.text && (
                        <div>
                            {dataConvert.length
                                ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.text}'`
                                : `Không tìm thấy nội dung nào phù hợp với '${key_search?.text}'`}
                        </div>
                    )}
                    <TabPanel
                        sx={{
                            padding: 0,
                            display:
                                isSmallScreen && subTabSchedule === "1"
                                    ? "none"
                                    : "block",
                        }}
                        value="1"
                    >
                        <Box className="custom-table-wrapper-schedule">
                            <CalenderTable
                                actions={actions}
                                data={dataConvert}
                                selectedDate={selectedDate}
                                onEventsChange={handleEventsChange}
                            />
                        </Box>
                    </TabPanel>
                    <TabPanel sx={{ padding: 0 }} value="2">
                        <Box className="custom-table-wrapper">
                            <CustomCardList
                                dataConvert={dataConvert}
                                actions={actions}
                            />
                            {dataConvert.length < 1 && (
                                <Empty
                                    className="hidden max-sm:block w-full justify-center items-center"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}
                            <Table
                                size="middle"
                                bordered
                                // rowSelection={rowSelection}
                                loading={isLoading}
                                dataSource={dataConvert}
                                columns={getColumns({
                                    actions,
                                })}
                                pagination={false}
                                scroll={{
                                    x: "100%",
                                    y: "100%",
                                }}
                                className="custom-table custom-table-schedule hidden md:block sm:max-h-[calc(100vh-200px)]"
                            />
                        </Box>
                    </TabPanel>
                </TabContext>
            </Box>
            <ModalEdit
                open={popup.edit}
                toggle={togglePopup}
                refetch={refetch}
            />
            <PopupConfirmRemove
                listItem={selectedRowKeys}
                open={popup.remove}
                handleClose={() => togglePopup("remove")}
                refetch={refetch}
                name_item={selectedRowLabels}
            />
            <ModalListSchedule
                events={scheduleList}
                open={popup.listSchedule}
                toggle={togglePopup}
                refetch={refetch}
            />
        </>
    );
};

export default CTable;
