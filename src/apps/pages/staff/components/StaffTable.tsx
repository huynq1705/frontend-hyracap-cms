import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Pagination, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import { formatDate } from "@/utils/date-time";
import CStatus from "@/components/status";
import { KeySearchType, OptionSelect } from "@/types/types";
import {
    convertObjToParam,
    handleGetPage,
    handleGetParam,
    parseQueryParams,
} from "@/utils/filter";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch, useSelector } from "react-redux";
import SearchBoxTable from "@/components/search-box-table";
import EmptyIcon from "@/components/icons/empty";
import apiStaffService from "@/api/apiStaff.service";
import { INIT_STAFF } from "@/constants/init-state/staff";
import ModalEditStaff from "./ModalEdit";
import { selectPage } from "@/redux/selectors/page.slice";
interface ColumnProps {
    actions: {
        [key: string]: (...args: any) => void;
    };
}

const VALIDATE = {
    full_name: "Họ và tên không được chứa kí tự đặc biệt.",
    phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
};
const CustomCardList = ({ dataConvert, actions }: any) => {
    const { hasPermission } = usePermissionCheck("service");
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
                            Họ và tên
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span
                                className="font-medium"
                                style={{ color: "#50945d" }}
                            >
                                {`${item?.first_name}` +
                                    " " +
                                    `${item?.last_name}`}
                            </span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên đăng nhập
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.username}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Số điện thoại
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.phone}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Email
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.email}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Chức vụ
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {item?.current_staff_position.position.name}
                            </span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Ngày tham gia
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>
                                {formatDate(item?.created_at, "DDMMYY")}
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
                                            onClick={() =>
                                                actions.openEditConfirm(
                                                    true,
                                                    "detail",
                                                    item
                                                )
                                            }
                                        />
                                    )}
                                    {hasPermission.update && (
                                        <ActionButton
                                            type="edit"
                                            onClick={() =>
                                                actions.openEditConfirm(
                                                    true,
                                                    "edit",
                                                    item
                                                )
                                            }
                                        />
                                    )}
                                    {hasPermission.delete && (
                                        <ActionButton
                                            type="remove"
                                            onClick={() =>
                                                actions.openRemoveConfirm(
                                                    true,
                                                    item?.id,
                                                    item?.name
                                                )
                                            }
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
    const { hasPermission } = usePermissionCheck("product");
    const { actions } = props;
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            render: (_: any, item: any, index: number) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                        lineHeight: "22px",
                    }}
                >
                    {index + 1}
                </Typography>
            ),
            width: 46,
        },
        {
            title: T("fullName"),
            dataIndex: "full_name",
            // fixed: "left" as const,
            render: (_: any, item: any) => (
                <Stack
                    direction={"row"}
                    spacing={1}
                    justifyContent={"flex-start"}
                    sx={{
                        alignItems: "center",
                        // cursor: "pointer",
                    }}
                    // onClick={() => navigate(`${pathname}/edit/${item?.sh_code}`)}
                >
                    <Stack direction={"column"}>
                        <Typography
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                // color: "var(--text-color-primary)",
                            }}
                        >
                            {`${item?.first_name}` + " " + `${item?.last_name}`}
                        </Typography>
                    </Stack>
                </Stack>
            ),
            width: 182,
        },
        {
            title: T("email"),
            dataIndex: "email",
            width: 240,
            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                            textAlign: "left",
                        }}
                    >
                        {item?.email}
                    </Typography>
                </Stack>
            ),
        },
        {
            width: 175,
            title: T("phone_number"),
            dataIndex: "phone_number",
            render: (_: any, item: any) => (
                <Typography style={{ textAlign: "left" }}>
                    {item?.phone ?? "- -"}
                </Typography>
            ),
        },
        {
            title: T("position"),
            dataIndex: "create_at",
            width: 200,
            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {item?.current_staff_position.position.name}
                    </Typography>
                </Stack>
            ),
        },
        {
            title: T("joining_date"),
            dataIndex: "create_at",
            width: 144,
            render: (_: any, item: any) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatDate(item?.created_at, "DDMMYY")}
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
                // fixed: "center" as const,
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
                                                `/admin/staff/view/${d?.id}`
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
                                                `/admin/staff/edit/${d?.id}`
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

interface ListStaffProps {
    authorizedPermissions?: any;
}

const StaffTable = (props: ListStaffProps) => {
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
    });
    // search
    const [keySearch, setKeySearch] = useState<KeySearchType>({});

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const { getStaff } = apiStaffService();
    //permissions
    const { hasPermission } = usePermissionCheck("staff");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_STAFF", param_payload, pathname],
        queryFn: () => getStaff(param_payload),
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
            .map((item) => item.last_name);
    }, [selectedRowKeys]);
    const togglePopup = (params: keyof typeof popup, value?: boolean) => {
        setPopup((prev) => ({ ...prev, [params]: value ?? !prev[params] }));
    };
    // search
    useEffect(() => {
        console.log("code", code);
        const new_key_search = parseQueryParams(param_payload);
        setKeySearch(new_key_search);

        if (!code && !pathname.includes("create")) return;
        if (pathname.includes("view") && !popup.edit) {
            navigate(`/admin/staff/view/${code}`);
            togglePopup("edit");
        }
        if (pathname.includes("edit") && !popup.edit) {
            navigate(`/admin/staff/edit/${code}`);
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
                                placeholder="Tìm theo mã sản phẩm, tên sản phẩm, nhãn hiệu"
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

            {/*  */}
            {popup.edit && (
                <ModalEditStaff
                    open={popup.edit}
                    toggle={(param) => {
                        togglePopup(param);
                        navigate(`/admin/staff`);
                    }}
                    refetch={refetch}
                />
            )}
            {/*  */}
            <PopupConfirmRemove
                listItem={selectedRowKeys}
                open={popup.remove}
                handleClose={() => {
                    togglePopup("remove");
                }}
                refetch={refetch}
                name_item={selectedRowLabels}
            />
        </>
    );
};

export default StaffTable;
