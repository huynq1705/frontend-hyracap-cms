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
import CStatus from "@/components/status";
import apiCommonService from "@/api/apiCommon.service";
import { useDispatch, useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";
import EmptyIcon from "@/components/icons/empty";
import { setTotalItems } from "@/redux/slices/page.slice";
import apiContractService from "@/api/apiContract.service";
import ModalEditContract from "./ModalEdit";

interface ColumnProps {
    actions: {
        [key: string]: (...args: any) => void;
    };
    indexItem: number;
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
                                Mã hợp đồng
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <span>{item?.contract_id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <div>
                            <span className="font-medium text-gray-9 text-sm">
                                STT
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <span>{index + 1}</span>
                            </div>
                        </div>
                        {/* <div className="min-w-[80px]">
                            <span className="font-medium text-gray-9 text-sm">
                                Trạng thái
                            </span>
                            <div className="text-gray-9 text-base py-1">
                                <CStatus
                                    type={item?.status ? "success" : "error"}
                                    name={item?.status ? "Active" : "Inactive"}
                                />
                            </div>
                        </div> */}
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Khách hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {" "}
                                {item?.user.firstName +
                                    " " +
                                    item?.user.lastName}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mã sản phẩm
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.id}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Thời hạn
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {item?.duration + " Tháng"}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Vốn đầu tư
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{formatCurrency(Number(item?.capital))}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mức lãi suất hiện tại
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {(
                                    item?.product.current_interest_rate * 100
                                ).toFixed(2) + " %"}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng lãi dự kiến
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {" "}
                                {formatCurrency(
                                    Number(item?.profit_before_tax)
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng lãi hiện tại
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {" "}
                                {formatCurrency(Number(item?.current_profit))}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên sản phẩm
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.product.name}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Danh mục sản phẩm
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.product.category.name}</span>
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
                                                    `/admin/contract/view/${item?.id}`
                                                );
                                                actions.togglePopup("edit");
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
    const { hasPermission } = usePermissionCheck("contract");

    const { actions, indexItem } = props;
    const columns: any = [
        {
            title: "STT",
            dataIndex: "contract",

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
                        {index + 1 + indexItem}
                    </Typography>
                </Stack>
            ),
            width: 50,
        },
        {
            title: "Mã hợp đồng",
            dataIndex: "contract",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "left",
                        }}
                    >
                        {item?.contract_id}
                    </Typography>
                </Stack>
            ),
            width: 200,
        },

        {
            title: "Khách hàng",
            dataIndex: "user",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "left",
                        }}
                    >
                        {item?.user.firstName + " " + item?.user.lastName}
                    </Typography>
                </Stack>
            ),
            width: 120,
        },
        {
            title: "Vốn đầu tư",
            dataIndex: "capital",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatCurrency(Number(d?.capital))}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Thời hạn",
            dataIndex: "duration",
            fixed: "left" as const,
            render: (_: any, item: any) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {item?.duration + " Tháng"}
                </Typography>
            ),
            width: 100,
        },
        {
            title: "Mức lãi suất hiện tại",
            dataIndex: "current_interest_rate",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {(d?.product.current_interest_rate * 100).toFixed(2) +
                            " %"}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Tổng lãi dự tính",
            dataIndex: "profit_before_tax",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatCurrency(Number(d?.profit_before_tax))}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Tổng lãi hiện tại",
            dataIndex: "current_profit",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatCurrency(Number(d?.current_profit))}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {d?.product.name}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: "Danh mục sản phẩm",
            dataIndex: "category",
            width: 120,
            render: (_: any, d: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {d?.product.category.name}
                    </Typography>
                </Stack>
            ),
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
                                                `/admin/contract/view/${d?.id}`
                                            );
                                            actions.togglePopup("edit");
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

interface CTableProps {
    authorizedPermissions?: any;
}

const CTable = (props: CTableProps) => {
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
    const { getStatistics } = apiCommonService();
    const { getContract } = apiContractService();
    //permissions
    const { hasPermission } = usePermissionCheck("contract");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_CONTRACT", param_payload, pathname],
        queryFn: () => getContract(param_payload),
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

    const selectedRowLabels = useMemo(() => {
        return dataConvert
            .filter((item) => selectedRowKeys.includes(item.key))
            .map((item) => item.product.name);
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
            navigate(`/admin/contract/view/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("edit") && !popup.edit) {
            navigate(`/admin/contract/edit/${code}`);
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
    // useEffect(() => {
    //     refetch();
    // }, [window.location.href]);
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
                                placeholder="Tìm theo mã hợp đồng, tên khách hàng"
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
                            indexItem: pageSize * (currentPage - 1),
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

            {/*  */}
            {popup.edit && (
                <ModalEditContract
                    open={popup.edit}
                    toggle={(param) => {
                        togglePopup(param);
                        navigate(`/admin/contract`);
                    }}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default CTable;
