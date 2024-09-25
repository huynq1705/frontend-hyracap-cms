import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, PaginationProps, Pagination } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import TopTableCustom from "@/components/top-table";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import palette from "@/theme/palette-common";
import MySelect from "@/components/input-custom-v2/select";
import { formatDate } from "@/utils/date-time";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import apiAccountOrderService from "@/api/apiAccountOrder";
import { KeySearchType } from "@/types/types";
import EmptyIcon from "@/components/icons/empty";
import moment from "moment";
import ButtonCore from "@/components/button/core";
import MyTextField from "@/components/input-custom-v2/text-field";
interface ColumnProps {
    refetch?: () => void;
    actions: {
        [key: string]: (...args: any) => void;
    };
}


const CustomCardList = ({ dataConvert, actions }: any) => {
    const { hasPermission } = usePermissionCheck("account");
    const navigate = useNavigate();
    return (
        <div className=" flex md:hidden flex-col space-y-4">
            {dataConvert.map((item: any, index: any) => (
                <div
                    key={item.id}
                    className="border border-solid border-gray-4 shadow rounded-lg mb-4"
                >
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">STT</span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{index + 1}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Mã đơn hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.order_id}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Khách hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.order_detail?.order?.customer?.full_name}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Điểm đánh giá
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.star || "- -"}</span>
                        </div>
                    </div>



                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">Thời gian đánh giá</span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.evaluation_time ? formatDate(item?.evaluation_time, "DDMMYYYY") : "- -"}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
const getColumns = (props: ColumnProps) => {
    const navigate = useNavigate();
    // const userInfo = useSelector(selectUserInfo);
    const { T } = useCustomTranslation();
    const { hasPermission } = usePermissionCheck("account");
    const { pathname } = useLocation();
    const { refetch, actions } = props;
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
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.order_detail?.order_id}
                </Typography.Text>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: "full_name",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.order_detail?.order?.customer?.full_name}
                </Typography.Text>
            ),
        },
        {
            title: "Điểm đánh giá",
            dataIndex: "phone_number",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.star || "- -"}
                </Typography.Text>
            ),
        },
        {
            title: "Thời gian đánh giá",
            dataIndex: "evaluation_time",
            // render: (_: any, d: any) => <TransactionStatus d={d} />,
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.evaluation_time ? formatDate(d?.evaluation_time, "DDMMYYYY") : "- -"}
                </Typography.Text>
            ),
        },

        // {
        //     title: T("action"),
        //     width: 120,
        //     dataIndex: "actions",
        //     fixed: "right" as const,
        //     shadows: " box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.5);",
        //     zIndex: 100,
        //     render: (_: any, d: any) => (
        //         <>
        //             {/* check permission */}
        //             <Stack
        //                 direction={"row"}
        //                 sx={{
        //                     gap: "16px",
        //                     justifyContent: "flex-start",
        //                     alignItems: "center",
        //                     px: "9px",
        //                     boxShadow: "",
        //                 }}
        //             >
        //                 {hasPermission.getDetail && (
        //                     <ActionButton
        //                         type="view"
        //                         // onClick={() => actions.openEditConfirm(true, "detail", d)}
        //                         onClick={() => { navigate(`/admin/management-employee-detail/${d?.id}`); }}
        //                     />
        //                 )}
        //                 {hasPermission.update && (
        //                     <ActionButton
        //                         type="edit"
        //                         onClick={() => actions.openEditConfirm(true, "edit", d)}
        //                     />
        //                 )}
        //                 {hasPermission.delete && (
        //                     <ActionButton
        //                         type="remove"
        //                         onClick={() =>
        //                             actions.openRemoveConfirm(true, d?.id, d?.full_name)
        //                         }
        //                     />
        //                 )}
        //             </Stack>
        //         </>
        //     ),
        // },
    ];
    return columns;
};

interface ListRequestDepositProps {
    authorizedPermissions?: any;
}

const PageEvaluate = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { getAccountOrder } = apiAccountOrderService();
    const nowDay = moment().format("YYYY-MM-DD")
    const startWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const endWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
    const startMonth = moment().startOf('month').format('YYYY-MM-DD')
    const endMonth = moment().endOf('month').format('YYYY-MM-DD')
    const { T } = useCustomTranslation();
    const dispatch = useDispatch();
    const { code } = useParams();
    const { pathname } = useLocation();
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [popup, setPopup] = useState({
        remove: false,
        data: { ...INIT_EMPLOYEE, role_id: 2 },
        status: "create",
    });
    const [popupRemove, setPopupRemove] = useState({
        remove: false,
        code: "",
        name: "",
    });

    const [keySearch, setKeySearch] = useState<KeySearchType>({
        startDate: nowDay,
        endDate: nowDay,
        star: "",
        filter: `account_id__eq__${code}`
    })
    const { isLoading, isError, refetch, data } = useQuery({
        queryKey: ["GET_ACCOUNT_ORDER", { ...keySearch, pageSize, take: pageSize, page: currentPage }, pathname],
        queryFn: () => getAccountOrder({ ...keySearch, pageSize, take: pageSize, page: currentPage }),
        keepPreviousData: true,
    });

    const dataConvert = useMemo(() => {
        if (data && data.data && Array.isArray(data.data))
            return data.data
        return [];
    }, [data]);
    const onChangeKey = (name: string, value: any) => {
        setKeySearch({ ...keySearch, [name]: value })
    }

    const togglePopup = (
        params: boolean,
        status: string,
        data: typeof INIT_EMPLOYEE,
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
            code_item: typeof INIT_EMPLOYEE,
        ) => {
            togglePopup(key_popup, status, code_item);
        },
        openRemoveConfirm: (
            key_popup: boolean,
            code_item: string,
            name: string,
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

    const VALIDATE = {
        full_name: "Họ và tên không được chứa kí tự đặc biệt.",
        phone_number: "Thông tin bắt buộc, vui lòng điền đầy đủ.",
    };


    const handleToday = () => {
        setKeySearch({
            ...keySearch,
            startDate: nowDay,
            endDate: nowDay,
        })
    }
    const handleWeek = () => {
        setKeySearch({
            ...keySearch,
            startDate: startWeek,
            endDate: endWeek,
        })
    }
    const handleMonth = () => {

        setKeySearch({
            ...keySearch,
            startDate: startMonth,
            endDate: endMonth,
        })
    }
    const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };
    const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {

        setPageSize(pageSize)
    };
    useEffect(() => {
        setTotalItems(data?.meta?.itemCount || 1)
    }, [data])
    return (
        <Stack
            spacing={2}
            className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'>
            <Typography.Text style={{ fontSize: 18, fontWeight: "500", lineHeight: "36px" }}>
                Quản lý đánh giá
            </Typography.Text>
            <Box sx={{ width: '100%', height: 1, borderBottom: 1, borderColor: '#D0D5DD' }} />
            <Stack width="100%" sx={{ boxShadow: 'none', marginTop: 0, pt: 0, gap: 2 }}>
                <div className="flex flex-col gap-2  items-start  md:flex-row-reverse md:justify-between md:items-end">
                    <Stack>
                        <Stack direction={"row"} alignItems={"flex-end"} spacing={2}>
                            <ButtonCore
                                title="Hôm nay"
                                type={(keySearch.startDate === nowDay && keySearch.endDate === nowDay) ? "default" : "bgWhite"}
                                onClick={handleToday}
                                styles={{ marginBottom: 8 }}
                            />
                            <ButtonCore
                                title="Tuần này"
                                type={(keySearch.startDate === startWeek && keySearch.endDate === endWeek) ? "default" : "bgWhite"}
                                onClick={handleWeek}
                                styles={{ marginBottom: 8 }}
                            />
                            <ButtonCore
                                title="Tháng này"
                                type={(keySearch.startDate === startMonth && keySearch.endDate === endMonth) ? "default" : "bgWhite"}
                                onClick={handleMonth}
                                styles={{ marginBottom: 8 }}
                            />
                        </Stack>
                    </Stack>
                   <div
                    className="flex flex-row flex-wrap items-end gap-4 md:flex-nowrap"
                     >
                        <MyDatePicker
                            label={"Từ ngày"}
                            errors={[]}
                            required={[]}
                            widthBox={"fit-content"}
                            name="startDate"
                            placeholder="Tất cả"
                            handleChange={onChangeKey}
                            values={keySearch}
                            validate={VALIDATE}
                            type="select-one"
                            itemsPerPage={5}
                        />
                        <MyDatePicker
                            label={"Đến ngày"}
                            errors={[]}
                            required={[]}
                            widthBox={"fit-content"}
                            name="endDate"
                            placeholder="Tất cả"
                            handleChange={onChangeKey}
                            values={keySearch}
                            validate={VALIDATE}
                            type="select-one"
                            itemsPerPage={5}
                        />
                        <MyTextField
                            label={"Điểm đánh giá"}
                            errors={[]}
                            required={[]}
                            widthBox={"fit-content"}
                            name="star"
                            placeholder="Tất cả"
                            handleChange={(e) => onChangeKey(e.target.name, e.target.value)}
                            values={keySearch}
                            validate={VALIDATE}
                            type="number"
                            
                        />
                    </div>
                 
                </div>



                {/* <Card> */}
                {dataConvert.length < 1 && (
                    <div className=" md:hidden flex justify-center items-center py-20  " style={{ borderTop: "2px solid #F2F4F7" }} >
                        <div className="flex flex-col">
                            <EmptyIcon />
                            <p className="text-center mt-3">Không có dữ liệu</p>
                        </div>
                    </div>
                )}
                <CustomCardList dataConvert={dataConvert} actions={actions} />
                <Table
                    size="middle"
                    bordered
                    // rowSelection={rowSelection}
                    loading={isLoading}
                    dataSource={dataConvert}
                    columns={getColumns({
                        refetch,
                        actions
                    })}
                    locale={{
                        emptyText: (
                            <div className="flex justify-center items-center">
                                <div className="flex flex-col">
                                    <EmptyIcon />
                                    <p className="text-center mt-3">Không có dữ liệu</p>
                                </div>
                            </div>
                        ),
                    }}
                    pagination={false}
                    // scroll={{ x: "100%", y: "calc(70vh - 274px)" }}
                    className="custom-table hidden md:block"
                // style={{ height: "calc(70vh - 274px)" }}

                />
                <Pagination
                    // className="custom-pagination-page absolute bottom-0 w-full pr-8"
                    pageSize={pageSize}
                    current={currentPage}
                    showQuickJumper
                    defaultCurrent={10}
                    showSizeChanger
                    locale={{
                        items_per_page: "bản ghi/trang",
                        jump_to: "Đến",
                        page: "trang",
                    }}
                    onShowSizeChange={onShowSizeChange}
                    total={totalItems}
                    onChange={onChangePage}
                    showTotal={(total, range) => {
                        return `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;
                    }}
                />
            </Stack>

            <PopupConfirmRemove
                listItem={[popupRemove.code]}
                // listItem={selectedRowKeys}
                open={popupRemove.remove}
                handleClose={() =>
                    setPopupRemove((prev) => ({ ...prev, remove: false }))
                }
                refetch={refetch}
                name_item={[popupRemove.name]}
            />
        </Stack>
    );
};

export default PageEvaluate;
