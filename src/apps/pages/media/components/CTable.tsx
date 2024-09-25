import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Space, PaginationProps, Pagination, Image } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import ActionButton from "@/components/button/action";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import SearchBoxTable from "@/components/search-box-table";
import apiAccountService from "@/api/Account.service";
import { INIT_PAYMENT_METHOD } from "@/constants/init-state/payment_menthod";
import apiPaymentMethodService from "@/api/apiPayment.service";
import CStatus from "@/components/status";
import { convertObjToParam, handleGetParam } from "@/utils/filter";
import { KeySearchType } from "@/types/types";
import { formatDate } from "@/utils/date-time";
import PopupEditMedia from "./popups/Edit"
interface ColumnProps {
    setOpenView: (open: boolean) => void;
    setTransaction: (transaction: any) => void;
    hasPermissionConfirmed: boolean;
    hasPermissionView: boolean;
    refetch?: () => void;
    actions: {
        [key: string]: (...args: any) => void;
    };
}


const getColumns = (props: ColumnProps) => {
    const navigate = useNavigate();
    // const userInfo = useSelector(selectUserInfo);
    const { T } = useCustomTranslation();
    const { hasPermission } = usePermissionCheck("product");
    const { pathname } = useLocation();
    const {
        setOpenView,
        setTransaction,
        hasPermissionConfirmed,
        hasPermissionView,
        refetch,
        actions,
    } = props;
    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            render: (_: any, item: any, index: number) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {index + 1}
                </Typography.Text>
            ),
            width: 46,
        },
        // {
        //     title: "Mã ",
        //     dataIndex: "id",
        //     width: 160,
        //     render: (_: any, d: any) => (
        //         <Typography.Text
        //             style={{
        //                 fontSize: "14px",
        //                 fontWeight: 400,
        //                 color: palette.textQuaternary
        //             }}
        //         >
        //             {d?.id}
        //         </Typography.Text>
        //     ),
        // },
        {
            title: "Ảnh",
            dataIndex: "name",
            width : 82,
            render: (_: any, d: any) => (
                <Stack alignItems={"center"} justifyContent={"center"} p={1}>
                    <Image 
                        src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                        alt={d?.name}
                        style={{borderRadius:12,height:64,width:64}}

                    />
                </Stack>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatDate(`${item?.created_at}`, "DDMMYYYY")}
                    </Typography>
            ),
            width: 132,
        },
        {
            title: "Ngày hiệu lực",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatDate(`${item?.created_at}`, "DDMMYYYY")}
                    </Typography>
                </Stack>
            ),
            width: 132,
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "schedule",

            render: (_: any, item: any, index: number) => (
                <Stack direction={"column"} spacing={1}>
                    <Typography
                        style={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "var(--text-color-three)",
                        }}
                    >
                        {formatDate(`${item?.created_at}`, "DDMMYYYY")}
                    </Typography>
                </Stack>
            ),
            width: 132,
        },
        {
            title: T("status"),
            width: 124,
            dataIndex: "status",
            render: (_: any, d: any) => (
                <Stack>
                    {/* <CSwitch checked={!!d?.status} /> */}
                    <CStatus
                        type={d?.status ? "success" : "error"}
                        name={d?.status ? "Active" : "Inactive"}
                    />
                </Stack>
            ),
        },
        {
            title: T("action"),
            width: 120,
            dataIndex: "actions",
            fixed: "right" as const,
            shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
            zIndex: 76,
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
                            boxShadow: "",
                        }}
                    >
                        {/* {hasPermission.getDetail && (
              <ActionButton
                type="view"
                onClick={() => actions.openEditConfirm(true, "detail", d)}
              />
            )} */}
                        {hasPermission.update && (
                            <ActionButton
                                type="edit"
                                onClick={() => actions.openEditConfirm(true, "edit", d)}
                            />
                        )}
                        {hasPermission.delete && (
                            <ActionButton
                                type="remove"
                                onClick={() => actions.openRemoveConfirm(true, d?.id)}
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

const ListMedia = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getPaymentMethod } = apiPaymentMethodService();
    const { T } = useCustomTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [openView, setOpenView] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<any>(null);
    const [flagSearch, setFlagSearch] = useState<boolean>(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [popup, setPopup] = useState({
        remove: false,
        data: INIT_PAYMENT_METHOD,
        status: "create",
    });
    const [popupRemove, setPopupRemove] = useState({
        remove: false,
        code: "",
    });
    const [searchParams] = useSearchParams();
    const [keySearch, setKeySearch] = useState<KeySearchType>({
        status__eq: ""
    });
    const param_payload = useMemo(() => {
        return handleGetParam(searchParams);
    }, [searchParams]);
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_PAYMENT_METHOD", param_payload, pathname],
        queryFn: () => getPaymentMethod(param_payload),
        keepPreviousData: true,
    });
    const [page, setPage] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPage: 1,
        totalItem: 1,
    });

    useEffect(() => {
        refetch();
    }, [flagSearch]);

    const togglePopup = (
        params: boolean,
        status: string,
        data: typeof INIT_PAYMENT_METHOD,
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
            code_item: typeof INIT_PAYMENT_METHOD,
        ) => {
            togglePopup(key_popup, status, code_item);
        },
        openRemoveConfirm: (key_popup: boolean, code_item: string) => {
            togglePopupRemove(key_popup, code_item);
        },
    };
    const togglePopupRemove = (params: boolean, code: string) => {
        setPopupRemove((prev) => ({ ...prev, remove: params, code: code }));
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const VALIDATE = {
        full_name: "Họ và tên không được chứa kí tự đặc biệt.",
        phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    };
    const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
        setPage((prev) => ({ ...prev, currentPage: pageNumber }));
        setFlagSearch(true);
    };
    const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
        current,
        pageSize,
    ) => {
        setPage((prev) => ({ ...prev, pageSize }));
        setFlagSearch(true);
    };
    const handleSearch = () => {
        let filter = convertObjToParam(keySearch, {
            page: page.currentPage,
            take: page.pageSize,
        });
        let url = `${pathname}${filter}`;
        navigate(url);
    };
    const handleOnChangeSearch = (value?: string) => {
        if (value) {
            setKeySearch({ ...keySearch, name__like: value });
        } else {
            const { name__like, ...rest } = keySearch;
            const filteredRest: { [key: string]: string } = Object.keys(rest).reduce((acc, key) => {
                acc[key] = String(rest[key]);
                return acc;
            }, {} as { [key: string]: string });
            setKeySearch(filteredRest);
        }
    }
    const handleOnChangeSearchStatus = (name: string, value?: string) => {
        setKeySearch({ ...keySearch, [name]: value });
        let filter = convertObjToParam({ ...keySearch, [name]: value }, {
            page: page.currentPage,
            take: page.pageSize,
        });
        let url = `${pathname}${filter}`;
        navigate(url)
    }
    return (
        <>
            <Box width="100%" className="custom-table-wrapper">
                <Stack direction={"row"}     spacing={2}>
                    <SearchBoxTable
                        keySearch={keySearch?.name__like}
                        setKeySearch={handleOnChangeSearch}
                        handleSearch={handleSearch}
                        placeholder="Tìm theo tên phương thức thanh toán"
                    />
                    <MySelect
                        options={[
                            { label: "Tất cả", value: "" },
                            { label: "Inactive", value: "0" },
                            { label: "Active", value: "1" }
                        ]}
                        label={T("status")}
                        errors={[]}
                        required={[]}
                        configUI={{
                            width: "calc(25% - 12px)",
                        }}
                        name="status__eq"
                        placeholder="Nguyễn Văn A"
                        handleChange={(e) => {
                            handleOnChangeSearchStatus(e.target.name, e.target.value)

                        }}
                        values={keySearch}
                        validate={VALIDATE}
                        type="select-one"
                        itemsPerPage={5}
                    // inputStyle={{height:36}}
                    />
                </Stack>
                {/* <Card> */}
                <Table
                    size="middle"
                    bordered
                    // rowSelection={rowSelection}
                    loading={isLoading}
                    dataSource={data && Array.isArray(data?.data) ? data.data : []}
                    columns={getColumns({
                        setOpenView,
                        refetch,
                        setTransaction,
                        hasPermissionConfirmed: authorizedPermissions?.confirmed,
                        hasPermissionView: authorizedPermissions?.view,
                        actions,
                    })}
                    pagination={false}
                    scroll={{ x: "100%", y: "calc(100vh - 340px)" }}
                    className="custom-table"
                    style={{ height: "calc(100vh - 340px)" }}
                />
                {/* <Pagination
                    className="custom-pagination"
                    pageSize={page.pageSize}
                    current={page.currentPage}
                    showQuickJumper
                    defaultCurrent={10}
                    showSizeChanger
                    locale={{
                        items_per_page: 'bản ghi/trang',
                        jump_to: 'Đến',
                        page: 'trang',
                    }}
                    onShowSizeChange={onShowSizeChange}
                    total={page.totalItem}
                    onChange={onChangePage}
                    showTotal={(total, range) => {
                        return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
                    }}
                /> */}
                {/* </Card> */}
            </Box>
            {popup.remove && (
                <PopupEditMedia
                    // listItem={selectedRowKeys}
                    status={popup.status}
                    handleClose={() => setPopup((prev) => ({ ...prev, remove: false }))}
                    refetch={refetch}
                    data={popup.data}
                />
            )}

            <PopupConfirmRemove
                listItem={[popupRemove.code]}
                // listItem={selectedRowKeys}
                open={popupRemove.remove}
                handleClose={() =>
                    setPopupRemove((prev) => ({ ...prev, remove: false }))
                }
                refetch={refetch}
                name_item={[popupRemove.code]}
            />
        </>
    );
};

export default ListMedia;
