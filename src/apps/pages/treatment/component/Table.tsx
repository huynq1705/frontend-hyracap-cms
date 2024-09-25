import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Box, Stack } from "@mui/material";
import {
    Avatar,
    Empty,
    Pagination,
    PaginationProps,
    Table,
    Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import { KeySearchType } from "@/types/types";
import {
    convertObjToParam,
    handleGetPage,
    parseQueryParams,
} from "@/utils/filter";
import apiTreatmentCardService from "@/api/apiTreamentCard.service";
import ModalEdit from "./ModalEdit";
import { selectPage } from "@/redux/selectors/page.slice";
import EmptyIcon from "@/components/icons/empty";
import { formatCurrency } from "@/utils";
import CStatus from "@/components/status";
import { formatDate } from "@/utils/date-time";
import SearchBoxTable from "@/components/search-box-table";

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
                    {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            STT
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{index + 1}</span>
                        </div>
                    </div> */}
                    <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <div>
                            <span className="font-medium text-gray-9 text-sm">
                                STT
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <span>{index + 1}</span>
                            </div>
                        </div>
                        <div className="min-w-[80px]">
                            <span className="font-medium text-gray-9 text-sm">
                                Trạng thái
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <CStatus
                                    type={item?.status === 1 ? "success" : "error"}
                                    name={
                                        item?.status === 1 ? "Active" : "Inactive"
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên thẻ liệu trình
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.name ?? "Không có tên"}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mệnh giá
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {formatCurrency(item?.denominations ?? 0)}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Giá bán
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{formatCurrency(item?.price ?? 0)}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng buổi
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.total_treatment ?? "Không có"}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Ghi chú
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.note ?? ""}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Hạn sử dụng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.use_time === null
                                    ? "Không giới hạn"
                                    : item?.use_time + " ngày" ?? "--"}
                            </span>
                        </div>
                    </div>

                    {/* <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <CStatus
                                type={item?.status === 1 ? "success" : "error"}
                                name={
                                    item?.status === 1 ? "Active" : "Inactive"
                                }
                            />
                        </div>
                    </div> */}

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
                                            `/admin/treatment/view/${item?.id}`
                                        );
                                        actions.togglePopup("edit");
                                    }}
                                />
                                <ActionButton
                                    type="edit"
                                    onClick={() => {
                                        navigate(
                                            `/admin/treatment/edit/${item?.id}`
                                        );
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
    const { hasPermission } = usePermissionCheck("treatment");
    const { actions } = props;
    const columns: any = [
        {
            title: "STT",
            dataIndex: "treatment",

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
            title: "Tên thẻ liệu trình",
            dataIndex: "treatment",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                    }}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {item?.name ?? "--"}
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 220,
        },
        {
            title: "Mệnh giá",
            dataIndex: "treatment",
            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatCurrency(item?.denominations ?? 0)}
                    </Typography>
                </Stack>
            ),
            width: 220,
        },
        {
            title: "Giá bán",
            dataIndex: "treatment",

            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatCurrency(item?.price ?? 0)}
                    </Typography>
                </Stack>
            ),
            width: 220,
        },
        {
            title: "Tổng buổi",
            dataIndex: "treatment",

            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                    }}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {item?.total_treatment ?? "--"}
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 120,
        },
        {
            title: "Hạn sử dụng",
            dataIndex: "treatment",

            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                    }}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {item?.use_time === null
                                ? "Không giới hạn"
                                : item?.use_time + " ngày" ?? "--"}
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 120,
        },
        {
            title: "Trạng thái",
            dataIndex: "treatment",
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                    }}
                >
                    <CStatus
                        type={item?.status === 1 ? "success" : "error"}
                        name={
                            item?.status === 1 ? "Active" : "Inactive"
                        }
                    />
                    {/* <Stack direction={"row"} gap={"24px"}>
                        <div className="w-28 h-7 rounded-2xl relative overflow-hidden">
                            <div
                                className="absolute top-0 right-0 left-0 bottom-0 z-2 opacity-20"
                                style={{
                                    background:
                                        item?.status === 1
                                            ? "#217732"
                                            : "#F04438",
                                }}
                            ></div>
                            <Stack
                                direction={"row"}
                                className="absolute top-0 right-0 left-2 bottom-0 z-3 transparent text-sm flex items-center justify-start gap-2"
                                sx={{
                                    color:
                                        item?.status === 1
                                            ? "#217732"
                                            : "#F04438",
                                }}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background:
                                            item?.status === 1
                                                ? "#217732"
                                                : "#F04438",
                                    }}
                                ></div>
                                <p className="min-w-10">
                                    {item?.status === 1 ? "Active" : "--"}
                                </p>
                            </Stack>
                        </div>
                    </Stack> */}
                </Stack>
            ),
            width: 150,
        },
        {
            title: "Ghi chú",
            dataIndex: "treatment",
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        cursor: "pointer",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                    }}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {item?.note ?? "--"}
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 220,
        },
    ];
    {
        // (hasPermission.update || hasPermission.delete) &&
        columns.push({
            title: T("action"),
            width: 120,
            dataIndex: "actions",
            fixed: "right" as const,
            render: (_: any, d: any) => (
                <>
                    {/* check permission */}
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
                            {/* {hasPermission.update && ( */}
                            <ActionButton
                                type="view"
                                onClick={() => {
                                    navigate(`/admin/treatment/view/${d?.id}`);
                                    actions.togglePopup("edit");
                                }}
                            />
                            {/* )} */}
                            {/* {hasPermission.delete && ( */}
                            <ActionButton
                                type="edit"
                                onClick={() => {
                                    navigate(`/admin/treatment/edit/${d?.id}`);
                                    actions.togglePopup("edit");
                                }}
                            />
                            {/* )} */}
                            {/* {hasPermission.delete && ( */}
                            <ActionButton
                                type="remove"
                                onClick={() => {
                                    actions.openRemoveConfirm("remove", d?.id);
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
interface ListTreatmentProps {
    authorizedPermissions?: any;
}
const keywords = ["create", "view", "edit"];

const ListTreatment = (props: ListTreatmentProps) => {
    const { T } = useCustomTranslation();
    const { code } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [keySearch, setKeySearch] = useState<KeySearchType>({});
    const { pathname, search } = useLocation();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const handleGetParam = () => {
        const params: any = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        if (!params["page"]) params["page"] = 1;
        if (!params["take"]) params["take"] = 10;
        return params;
    };
    const page = useSelector(selectPage);
    const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
    const param_payload = useMemo(() => {
        return handleGetParam();
    }, [searchParams]);
    const { getTreatmentCard } = apiTreatmentCardService();
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        upload: false,
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_TREATMENT_CARD", param_payload, pathname],
        queryFn: () => getTreatmentCard(param_payload),
        keepPreviousData: true,
    });
    const dataConvert = useMemo(() => {
        if (data && data.data && Array.isArray(data.data))
            return data.data.map((item) => ({ ...item, key: item?.id }));
        return [];
    }, [data]);
    const selectedRowLabels = useMemo(() => {
        return dataConvert
            .filter((item) => selectedRowKeys.includes(item.key))
            .map((item) => item.name);
    }, [selectedRowKeys]);
    const togglePopup = (params: keyof typeof popup) => {
        setPopup((prev) => ({ ...prev, [params]: !prev[params] }));
    };
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

    // search
    useEffect(() => {
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);

        if (!code && !pathname.includes("create")) return;
        if (pathname.includes("view") && !popup.edit) {
            navigate(`/admin/treatment/view/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("edit") && !popup.edit) {
            navigate(`/admin/treatment/edit/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("create") && !popup.edit) {
            togglePopup("edit");
            return;
        }
    }, [window.location.href]);
    useEffect(() => {
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);
    }, [window.location.href]);
    const text_search = useMemo(
        () => keySearch?.text?.toString() ?? "",
        [keySearch?.text, pathname]
    );
    return (
        <>
            <Box className="custom-table-wrapper">
                <div className="w-1/3">
                    <SearchBoxTable
                        keySearch={text_search}
                        setKeySearch={(value?: string) => {
                            setKeySearch((prev) => ({
                                ...prev,
                                text: value || "",
                            }));
                        }}
                        handleSearch={handleSearch}
                        placeholder="Tìm theo thẻ liệu trình"
                    />
                </div>
                {search.includes("text") && key_search?.text && (
                    <div>
                        {dataConvert.length
                            ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.text}'`
                            : `Không tìm thấy nội dung nào phù hợp với '${key_search?.text}'`}
                    </div>
                )}
                <CustomCardList dataConvert={dataConvert} actions={actions} />

                {dataConvert.length < 1 && (
                    <Empty
                        className="hidden max-sm:block w-full justify-center items-center"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
                {/* <Card> */}
                <Table
                    size="middle"
                    bordered
                    locale={{
                        emptyText: (
                            <div className="flex justify-center items-center py-20">
                                <div className="flex flex-col">
                                    <EmptyIcon />
                                    <p className="text-center mt-3">
                                        Không có dữ liệu
                                    </p>
                                </div>
                            </div>
                        ),
                    }}
                    // rowSelection={rowSelection}
                    loading={isLoading}
                    dataSource={dataConvert}
                    columns={getColumns({
                        actions,
                    })}
                    pagination={false}
                    scroll={{ x: "100%" }}
                    className="custom-table hidden md:block sm:max-h-[calc(100vh-200px)]"
                />

                {/* </Card> */}
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
        </>
    );
};

export default ListTreatment;
