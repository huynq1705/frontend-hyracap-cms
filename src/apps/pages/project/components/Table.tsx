import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import PopupConfirmImport from "@/components/popup/confirm-import";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { formatCurrency } from "@/utils";
import usePermissionCheck from "@/hooks/usePermission";
import SearchBoxTable from "@/components/search-box-table";
import ActionButton from "@/components/button/action";
import { KeySearchType } from "@/types/types";
import {
    convertObjToParam,
    handleGetPage,
    parseQueryParams,
} from "@/utils/filter";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import EmptyIcon from "@/components/icons/empty";
import { setTotalItems } from "@/redux/slices/page.slice";
import apiProjectService from "@/api/project.service";
import CStatus from "@/components/status";

interface ColumnProps {
    actions: {
        [key: string]: (...args: any) => void;
    };
}
const CustomCardList = ({ dataConvert, actions }: any) => {
    const { hasPermission } = usePermissionCheck("customer");
    const navigate = useNavigate();

    return (
        <div className=" flex md:hidden flex-col space-y-4">
            {dataConvert.map((item: any, index: any) => (
                <div
                    key={item.id}
                    className="border border-solid border-gray-4 shadow rounded-lg mb-4"
                >
                    <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <div>
                            <span className="font-medium text-gray-9 text-sm">
                                STT
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <span>{index + 1}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên dự án
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.name ?? "- -"}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Lĩnh vực
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.industries
                                    ?.map((industry: any) => industry.name)
                                    .join(", ") ?? "- -"}
                            </span>
                        </div>
                    </div>
                    <div className="min-w-[80px]">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <CStatus
                                type={
                                    item?.status === 0
                                        ? "success"
                                        : item?.status === 1
                                        ? "info"
                                        : "warning"
                                }
                                name={
                                    item?.status === 0
                                        ? "Đã hoàn thành"
                                        : item?.status === 1
                                        ? "Đang gọi vốn"
                                        : item?.status === 2
                                        ? "Đã đầu tư"
                                        : "Không xác định"
                                }
                            />
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng tiền gọi vốn
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.industries
                                    ?.map((industry: any) => industry.name)
                                    .join(", ") ?? "- -"}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng tiền đã huy động
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {formatCurrency(item?.capital_raising_target) ??
                                    "- -"}
                            </span>
                        </div>
                    </div>

                    {(hasPermission.update || hasPermission.delete) && (
                        <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                            <span className="font-medium text-gray-9 text-sm">
                                Thao tác
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <div className="flex items-center g-8 justify-start space-x-4">
                                    {hasPermission.getDetail && (
                                        <ActionButton
                                            type="view"
                                            onClick={() => {
                                                navigate(
                                                    `/admin/project/view/${item?.id}`
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
                                                    `/admin/project/edit/${item?.id}`
                                                );
                                                actions.togglePopup("edit");
                                            }}
                                        />
                                    )}
                                    {hasPermission.delete && (
                                        <ActionButton
                                            type="remove"
                                            onClick={() => {
                                                actions.openRemoveConfirm(
                                                    "remove",
                                                    item?.id
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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
    const { hasPermission } = usePermissionCheck("project");

    const { actions } = props;
    const columns: any = [
        {
            title: "STT",
            dataIndex: "project",

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
            title: "Tên dự án",
            dataIndex: "project",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {item?.name ?? "- -"}
                </Typography>
            ),
            width: 220,
        },
        {
            title: "Lĩnh vực",
            dataIndex: "project",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {item?.industries
                        ?.map((industry: any) => industry.name)
                        .join(", ") ?? "- -"}
                </Typography>
            ),
            width: 150,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    <CStatus
                        type={
                            item?.status === 0
                                ? "success"
                                : item?.status === 1
                                ? "info"
                                : "warning"
                        }
                        name={
                            item?.status === 0
                                ? "Đã hoàn thành"
                                : item?.status === 1
                                ? "Đang gọi vốn"
                                : item?.status === 2
                                ? "Đã đầu tư"
                                : "Không xác định"
                        }
                    />
                </Typography>
            ),
            width: 150,
        },
        {
            title: "Tổng tiền gọi vốn",
            dataIndex: "project",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {formatCurrency(item?.capital_raising_target) ?? "- -"}
                </Typography>
            ),
            width: 150,
        },
        {
            title: "Tổng tiền đã huy động",
            dataIndex: "project",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {formatCurrency(item?.mobilized_fund) ?? "- -"}
                </Typography>
            ),
            width: 150,
        },
    ];
    {
        (hasPermission.update || hasPermission.delete) &&
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
                                }}
                            >
                                {hasPermission.getDetail && (
                                    <ActionButton
                                        type="view"
                                        onClick={() => {
                                            navigate(
                                                `/admin/project/view/${d?.id}`
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
                                                `/admin/project/edit/${d?.id}`
                                            );
                                            actions.togglePopup("edit");
                                        }}
                                    />
                                )}
                                {hasPermission.delete && (
                                    <ActionButton
                                        type="remove"
                                        onClick={() => {
                                            actions.openRemoveConfirm(
                                                "remove",
                                                d?.id
                                            );
                                        }}
                                    />
                                )}
                            </Stack>
                        )}
                    </>
                ),
            });
    }
    return columns;
};

interface ProjectTableProps {
    authorizedPermissions?: any;
}

const ProjectTable = (props: ProjectTableProps) => {
    const { code } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const dispatch = useDispatch();
    // --state
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
    const [popup, setPopup] = useState({
        edit: false,
        remove: false,
        upload: false,
        create_category: false,
    });
    // search
    const [keySearch, setKeySearch] = useState<KeySearchType>({});

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { getProject } = apiProjectService();
    //permissions
    const { hasPermission } = usePermissionCheck("project");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_PROJECT", param_payload, pathname],
        queryFn: () => getProject(param_payload),
        keepPreviousData: true,
    });
    console.log("data", data);
    // convert data
    const dataConvert = useMemo(() => {
        const data_res = data?.data;
        if (data && data?.meta) {
            dispatch(setTotalItems(data?.meta?.itemCount ?? 1));
        }
        if (data_res && Array.isArray(data_res))
            return data_res.map((item) => ({ ...item, key: item?.id }));
        return [];
    }, [data]);
    console.log("dataConvert", dataConvert);

    const selectedRowLabels = useMemo(() => {
        return dataConvert
            .filter((item) => selectedRowKeys.includes(item.key))
            .map((item) => item.name);
    }, [selectedRowKeys]);
    const togglePopup = (params: keyof typeof popup, value?: boolean) => {
        setPopup((prev) => ({ ...prev, [params]: value ?? !prev[params] }));
    };
    // search
    useEffect(() => {
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);
        if (pathname.includes("add_category") && !popup.create_category) {
            togglePopup("create_category");
            return;
        }

        if (!code && !pathname.includes("create")) return;
        if (pathname.includes("view") && !popup.edit) {
            navigate(`/admin/project/view/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("edit") && !popup.edit) {
            navigate(`/admin/project/edit/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("create") && !popup.edit) {
            togglePopup("edit");
            return;
        }
    }, [window.location.href]);
    // search
    const handleSearch = () => {
        let filter = convertObjToParam(keySearch, {
            page: currentPage,
            take: pageSize,
            name__ilike: keySearch?.text?.toString().trim(),
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
        refetch();
    }, [window.location.href]);
    return (
        <>
            <Box className="h-full">
                <Box className="custom-table-wrapper shadow">
                    <div className="md:flex items-end  justify-between space-y-4 flex-wrap">
                        <div className="w-full md:w-1/3">
                            <SearchBoxTable
                                keySearch={text_search}
                                setKeySearch={(value?: string) => {
                                    setKeySearch((prev) => ({
                                        ...prev,
                                        text: value || "",
                                    }));
                                }}
                                handleSearch={handleSearch}
                                placeholder="Tìm theo mã chức vụ, tên chức vụ"
                            />
                        </div>
                    </div>
                    {search.includes("text") && key_search?.text && (
                        <div>
                            {dataConvert.length
                                ? `Có ${page.totalItems} kết quả cho từ khóa '${key_search?.text}'`
                                : `Không tìm thấy nội dung nào phù hợp với '${key_search?.text}'`}
                        </div>
                    )}
                    {/* <Card> */}
                    <Table
                        size="middle"
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
                        bordered
                        // rowSelection={rowSelection}
                        loading={isLoading}
                        dataSource={dataConvert}
                        columns={getColumns({
                            actions,
                        })}
                        pagination={false}
                        scroll={{ x: "100%" }}
                        className="custom-table custom-table hidden md:block"
                    />

                    {/* mobile */}
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
                </Box>
            </Box>
            <PopupConfirmRemove
                listItem={selectedRowKeys}
                open={popup.remove}
                handleClose={() => {
                    togglePopup("remove");
                }}
                refetch={refetch}
                name_item={selectedRowLabels}
            />
            {/*  */}
            <PopupConfirmImport
                open={popup.upload}
                handleClose={() => {
                    togglePopup("upload");
                }}
                refetch={refetch}
            />
        </>
    );
};

export default ProjectTable;
