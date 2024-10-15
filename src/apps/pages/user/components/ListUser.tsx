import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Pagination, Empty } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import apiAccountService from "@/api/Account.service";
import PopupCreateAdmin from "./PopupCreateAdmin";
import { formatDate } from "@/utils/date-time";
import CStatus from "@/components/status";
import { KeySearchType, OptionSelect } from "@/types/types";
import {
    convertObjToParam,
    handleGetPage,
    handleGetParam,
} from "@/utils/filter";
import { setTotalItems } from "@/redux/slices/page.slice";
import { useDispatch } from "react-redux";
import SearchBoxTable from "@/components/search-box-table";
import EmptyIcon from "@/components/icons/empty";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
interface ColumnProps {
    hasPermissionConfirmed: boolean;
    hasPermissionView: boolean;
    refetch?: () => void;
    actions: {
        [key: string]: (...args: any) => void;
    };
    indexItem: number;
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
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mã người dùng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.sub}</span>
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
                                {`${item?.firstName}` +
                                    " " +
                                    `${item?.lastName}`}
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
                            <span>{item?.position}</span>
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

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Trạng thái tài khoản
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <CStatus
                                type={(() => {
                                    switch (item?.kycStatus) {
                                        case "NONE":
                                            return "info";
                                        case "VERIFIED":
                                            return "success";
                                        case "VERIFYING":
                                            return "warning";
                                        case "REJECTED":
                                            return "error";
                                        default:
                                            return "error";
                                    }
                                })()}
                                name={(() => {
                                    switch (item?.kycStatus) {
                                        case "NONE":
                                            return "Chưa xác thực";
                                        case "VERIFIED":
                                            return "Đã xác thực";
                                        case "VERIFYING":
                                            return "Đang xác thực";
                                        case "REJECTED":
                                            return "Từ chối xác thực";
                                        default:
                                            return "Từ chối xác thực";
                                    }
                                })()}
                            />
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
    const { actions, indexItem } = props;
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
                    {index + 1 + indexItem}
                </Typography>
            ),
            width: 46,
        },
        {
            title: "Mã người dùng",
            dataIndex: "stt",
            render: (_: any, item: any, index: number) => (
                <Typography
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                        lineHeight: "22px",
                    }}
                >
                    {item.sub}
                </Typography>
            ),
            width: 100,
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
                            {`${item?.firstName}` + " " + `${item?.lastName}`}
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
        {
            title: `Trạng thái tài khoản`,
            width: 124,
            dataIndex: "verified",
            render: (_: any, d: any) => (
                <Stack
                    direction={"row"}
                    spacing={"6px"}
                    alignItems={"center"}
                    borderRadius={4}
                    p={1}
                    bgcolor={palette.bgPrimary}
                    sx={{
                        width: "fit-content",
                    }}
                >
                    <CStatus
                        type={(() => {
                            switch (d?.kycStatus) {
                                case "NONE":
                                    return "info";
                                case "VERIFIED":
                                    return "success";
                                case "VERIFYING":
                                    return "warning";
                                case "REJECTED":
                                    return "error";
                                default:
                                    return "error"; // giá trị mặc định nếu kycStatus không khớp
                            }
                        })()}
                        name={(() => {
                            switch (d?.kycStatus) {
                                case "NONE":
                                    return "Chưa xác thực";
                                case "VERIFIED":
                                    return "Đã xác thực";
                                case "VERIFYING":
                                    return "Đang xác thực";
                                case "REJECTED":
                                    return "Từ chối xác thực";
                                default:
                                    return "Từ chối xác thực"; // giá trị mặc định nếu kycStatus không khớp
                            }
                        })()}
                    />
                </Stack>
            ),
        },
        {
            title: "Thao tác",
            width: 120,
            dataIndex: "actions",
            fixed: "right" as const,
            shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
            zIndex: 100,
            render: (_: any, d: any) => (
                <>
                    {/* check permission */}
                    <Stack
                        direction={"row"}
                        sx={{
                            gap: "16px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            px: "9px",
                            // position: 'absolute',
                            // right: 0,
                            // top: 0,
                            // bottom: 0
                        }}
                    >
                        {hasPermission.getDetail && (
                            <ActionButton
                                type="view"
                                onClick={() =>
                                    actions.openEditConfirm(true, "detail", d)
                                }
                            />
                        )}
                        {hasPermission.update && (
                            <ActionButton
                                type="edit"
                                onClick={() =>
                                    actions.openEditConfirm(true, "edit", d)
                                }
                            />
                        )}
                        {hasPermission.delete && (
                            <ActionButton
                                type="remove"
                                onClick={() =>
                                    actions.openRemoveConfirm(
                                        true,
                                        d?.id,
                                        d?.full_name
                                    )
                                }
                            />
                        )}
                    </Stack>
                </>
            ),
        },
    ];
    return columns;
};

interface ListRequestDepositProps {
    authorizedPermissions?: any;
}

const ListUser = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getAccount } = apiAccountService();
    const { T } = useCustomTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // search
    const [listRole] = React.useState<OptionSelect>([
        { label: "Tất cả", value: "" },
        { label: "Quản lý", value: "Quản lý" },
        { label: "Admin", value: "Admin" },
    ]);
    const [popup, setPopup] = useState({
        remove: false,
        data: INIT_EMPLOYEE,
        status: "create",
    });
    const [popupRemove, setPopupRemove] = useState({
        remove: false,
        code: "",
        name: "",
    });
    const [searchParams] = useSearchParams();
    const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
    const [keySearchText, setKeySearchText] = useState<any>(key_search.text);
    const [keySearch, setKeySearch] = useState<KeySearchType>({
        status__eq: "",
        position__like: "",
        type__eq: "0",
        key_search,
    });
    const param_payload = useMemo(() => {
        return handleGetParam(searchParams, "user_positions__isnull");
    }, [searchParams]);
    const { isLoading, isError, refetch, data } = useQuery({
        queryKey: ["GET_ACCOUNT", param_payload, pathname],
        queryFn: () => getAccount(param_payload),
        keepPreviousData: true,
    });

    const dataConvert = useMemo(() => {
        dispatch(setTotalItems(data?.meta?.itemCount || 1));
        if (data && data.data && Array.isArray(data.data))
            return data.data.map((item) => ({
                ...item,
                key: item?.id,
            }));

        return [];
    }, [data]);

    const togglePopup = (
        params: boolean,
        status: string,
        data: typeof INIT_EMPLOYEE
    ) => {
        setPopup((prev) => ({
            ...prev,
            remove: params,
            data: data,
            status: status,
        }));
    };
    const actions = {
        openEditConfirm: (
            key_popup: boolean,
            status: string,
            code_item: typeof INIT_EMPLOYEE
        ) => {
            togglePopup(key_popup, status, code_item);
        },
        openRemoveConfirm: (
            key_popup: boolean,
            code_item: string,
            name: string
        ) => {
            togglePopupRemove(key_popup, code_item, name);
        },
    };
    const togglePopupRemove = (params: boolean, code: string, name: string) => {
        setPopupRemove((prev) => ({
            ...prev,
            remove: params,
            code: code,
            name: name,
        }));
    };
    /////search
    const handleSearch = () => {
        let filter = convertObjToParam(keySearch, {
            page: 1,
            take: pageSize,
            text: keySearchText,
        });
        let url = `${pathname}${filter}`;
        navigate(url);
    };

    const reset = () => {
        setKeySearchText("");

        setKeySearch({
            ...keySearch,
            status__eq: "",
            position__like: "",
        });
        // setPopup((prev) => ({ ...prev, remove: false }));

        navigate("/admin/users");
        // refetch();
    };
    useEffect(() => {
        setPopup({
            remove: pathname.includes("create"),
            data: INIT_EMPLOYEE,
            status: "create",
        });
    }, [pathname]);
    return (
        <>
            <Box width="100%" className="custom-table-wrapper">
                <div className="w-full flex-wrap md:flex items-start justify-start gap-4 ">
                    {/* <div className="max-sm:w-full w-1/3"> */}
                    <SearchBoxTable
                        keySearch={keySearchText}
                        setKeySearch={setKeySearchText}
                        handleSearch={handleSearch}
                        placeholder="Tìm theo tên, mã người dùng, sđt"
                    />
                </div>

                {/* <Card> */}
                <CustomCardList dataConvert={dataConvert} actions={actions} />
                {dataConvert.length < 1 && (
                    <div
                        className=" md:hidden flex justify-center items-center py-20  "
                        style={{ borderTop: "2px solid #F2F4F7" }}
                    >
                        <div className="flex flex-col">
                            <EmptyIcon />
                            <p className="text-center mt-3">Không có dữ liệu</p>
                        </div>
                    </div>
                )}
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
                        refetch,
                        hasPermissionConfirmed:
                            authorizedPermissions?.confirmed,
                        hasPermissionView: authorizedPermissions?.view,
                        actions,
                        indexItem: pageSize * (currentPage - 1),
                    })}
                    pagination={false}
                    scroll={{ x: "100%" }}
                    className="custom-table hidden md:block"
                    // style={{ height: "calc(100vh - 333px)" }}
                />
            </Box>
            {popup.remove && (
                <PopupCreateAdmin
                    status={popup.status}
                    handleClose={() =>
                        popup.status === "create"
                            ? navigate(`/admin/users?${searchParams}`)
                            : setPopup((prev) => ({ ...prev, remove: false }))
                    }
                    refetch={() => {
                        if (pathname.includes("create")) {
                            reset();
                        } else {
                            setPopup((prev) => ({ ...prev, remove: false }));
                            refetch();
                        }
                    }}
                    data={popup.data}
                />
            )}

            <PopupConfirmRemove
                listItem={[popupRemove.code]}
                open={popupRemove.remove}
                handleClose={() =>
                    setPopupRemove((prev) => ({ ...prev, remove: false }))
                }
                refetch={refetch}
                name_item={[popupRemove.name]}
            />
        </>
    );
};

export default ListUser;