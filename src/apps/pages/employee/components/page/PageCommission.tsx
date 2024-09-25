import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table, Pagination, PaginationProps } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import usePermissionCheck from "@/hooks/usePermission";
import { INIT_EMPLOYEE } from "@/constants/init-state/employee";
import palette from "@/theme/palette-common";

import MyDatePicker from "@/components/input-custom-v2/calendar";
import apiCommissionsService from "@/api/apiCommissions";
import dayjs from "dayjs";
import EmptyIcon from "@/components/icons/empty";
import PopupConfirmAccept from "@/components/popup/confirm-accept";
import AppConfig from "@/common/AppConfig";
import { from } from "rxjs";
import ButtonCore from "@/components/button/core";
import DownIcon from "@/components/icons/download";
import { formatCurrency } from "@/utils";
import moment from "moment";


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
                            Mã nhân viên
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.account_id}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">Họ và tên</span>
                        <div className="text-gray-9 text-base py-1">
                            <span className="font-medium" style={{ color: "#50945d" }}>
                                {item.full_name}
                            </span>
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
                            Mã đơn hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.order_id}</span>
                        </div>
                    </div>

                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Dịch vụ/sản phẩm
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.name_service || "- -"}</span>
                        </div>
                    </div>



                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tên khách hàng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span>{item?.name_customer}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Số điện thoại KH
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {item?.phone_number_customer}</span>
                        </div>
                    </div>
                    <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup  px-3 py-2">
                        <span className="font-medium text-gray-9 text-sm">
                            Tổng tiền hoa hồng
                        </span>
                        <div className="text-gray-9 text-base py-1">
                            <span> {formatCurrency(item?.total_commission)}</span>
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
            title: "Mã nhân viên",
            dataIndex: "id",
            width: 118,
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.account_id}
                </Typography.Text>
            ),
        },
        {
            title: T("fullName"),
            dataIndex: "full_name",
            width: 182,
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d.full_name}
                </Typography.Text>
            ),
        },
        {
            title: "Chức vụ",
            dataIndex: "position",
            width: 124,
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.position}
                </Typography.Text>
            ),
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "order_id",
            width: 124,
            // render: (_: any, d: any) => <TransactionStatus d={d} />,
            render: (_: any, d: any) => (
                <Stack
                    onClick={() => navigate(`/admin/order/view/${d.order_id}`)}
                >
                    <Typography.Text

                        style={{
                            fontSize: "14px",
                            color: palette.primary,
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        {d?.order_id}
                    </Typography.Text>
                </Stack>
            ),
        },
        {
            title: "Dịch vụ/sản phẩm",
            width: 220,
            dataIndex: "name_service",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.name_service}
                </Typography.Text>
            ),
        },
        {
            title: "Tên khách hàng",
            width: 205,
            dataIndex: "name_customer",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.name_customer}
                </Typography.Text>
            ),
        },
        {
            title: "Số điện thoại KH",
            width: 160,
            dataIndex: "phone_number_customer",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {d?.phone_number_customer}
                </Typography.Text>
            ),
        },
        {
            title: "Tổng tiền hoa hồng",
            width: 164,
            dataIndex: "total_commission",
            render: (_: any, d: any) => (
                <Typography.Text
                    style={{
                        fontSize: "14px",
                        color: palette.textQuaternary,
                    }}
                >
                    {formatCurrency(d?.total_commission)}
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



const PageCommission = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const nowDay = moment().format("YYYY-MM-DD")
    const startWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const endWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
    const startMonth = moment().startOf('month').format('YYYY-MM-DD')
    const endMonth = moment().endOf('month').format('YYYY-MM-DD')
    const { getCommissions } = apiCommissionsService();
    const { T } = useCustomTranslation();
    const { code } = useParams();
    const { pathname } = useLocation();
    const [exportToExcel, setExportToExcel] = useState(false);
    const [date, setDate] = useState({
        from: nowDay,
        to: nowDay
    });

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


    const { isLoading, isError, refetch, data } = useQuery({
        queryKey: ["GET_COMMISSION", { staff_id: code, limit: pageSize, page: currentPage }, pathname],
        queryFn: () => getCommissions({ staff_id: code, from: date.from, to: date.to, limit: pageSize, page: currentPage }),
        keepPreviousData: true,
    });

    // const dataConvert = useMemo(() => {
    //     setTotalItems(data?.meta?.itemCount || 1)
    // }, [data]);

    useEffect(() => {

        if (date.to) {
            if (date.from <= date.to) {
                // setDate({...date ,index : 5})
                refetch()
            }
            else {
                setDate({ ...date, to: "" })
            }
        }
    }, [date]);
    useEffect(() => {
        setTotalItems(data?.meta?.itemCount || 1)
    }, [data])
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
    const handleOnchangeDate = (name: string, value: any) => {
        setDate({ ...date, [name]: value })
        // if(name === "to"){
        //     setDate({ ...date, [name]: value  })
        // }else {

        // }
    }
    const dataConvert = useMemo(() => {
        if (data && Array.isArray(data?.data?.list_commissions))
            return data.data?.list_commissions
        return [];
    }, [data]);

    const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };
    const onShowSizeChange: PaginationProps["onShowSizeChange"] = (current, pageSize) => {
        setPageSize(pageSize)

    };
    const handleToday = () => {
        setDate({
            from: nowDay,
            to: nowDay,
        })
    }
    const handleWeek = () => {
        setDate({
            from: startWeek,
            to: endWeek,
        })
    }
    const handleMonth = () => {

        setDate({
            from: startMonth,
            to: endMonth,
        })
    }


    return (
        <Stack
            spacing={2}
            className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'
        >
            <div className="flex justify-between items-center">
                <Typography.Text style={{ fontSize: 18, fontWeight: "500" }}>
                    Hoa hồng
                </Typography.Text>
                <ButtonCore
                    title={T("export-to-excel")}
                    icon={<DownIcon />}
                    type="bgWhite"
                    onClick={() => { setExportToExcel(true) }}
                />
            </div>

            <Box sx={{ width: '100%', height: 1, borderBottom: 1, borderColor: '#D0D5DD' }} />
            <Stack width="100%" sx={{ boxShadow: 'none', marginTop: 0, pt: 0, gap: 2, }}  >
                <div className="flex flex-col gap-2  items-start  md:flex-row-reverse md:justify-between md:items-end">
                    <Stack direction={"row"} alignItems={"flex-end"} spacing={2}>
                        <ButtonCore
                            title="Hôm nay"
                            type={(date.from === nowDay && date.to === nowDay) ? "default" : "bgWhite"}
                            onClick={handleToday}
                            styles={{ marginBottom: 8 }}
                        />
                        <ButtonCore
                            title="Tuần này"
                            type={(date.from === startWeek && date.to === endWeek) ? "default" : "bgWhite"}
                            onClick={handleWeek}
                            styles={{ marginBottom: 8 }}
                        />
                        <ButtonCore
                            title="Tháng này"
                            type={(date.from === startMonth && date.to === endMonth) ? "default" : "bgWhite"}
                            onClick={handleMonth}
                            styles={{ marginBottom: 8 }}
                        />
                    </Stack>
                    <Stack direction={"row"} alignItems={"flex-end"} spacing={2}>
                        <MyDatePicker
                            label={"Từ ngày"}
                            errors={[]}
                            required={[]}
                            name="from"
                            placeholder="Tất cả"
                            handleChange={handleOnchangeDate}
                            values={date}
                            validate={VALIDATE}
                            type="select-one"
                            itemsPerPage={5}
                            formatCalendar="DD/MM/YYYY"
                            formatInput="YYYY-MM-DD"
                        />
                        <MyDatePicker
                            label={"Đến ngày"}
                            errors={[]}
                            required={[]}
                            name="to"
                            placeholder="Tất cả"
                            handleChange={handleOnchangeDate}
                            values={date}
                            validate={VALIDATE}
                            type="select-one"
                            itemsPerPage={5}
                            formatCalendar="DD/MM/YYYY"
                            formatInput="YYYY-MM-DD"
                            minDate={dayjs(date.from)}
                        />

                    </Stack>

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
                    loading={isLoading}
                    dataSource={dataConvert}
                    columns={getColumns({
                        refetch,
                        actions,
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
                {/* </Card> */}
                <Pagination
                    // className="custom-pagination bg-white max-lg::overflow-hidden"
                    // className="absolute bottom-0 w-full pr-8"
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
            {exportToExcel &&
                <PopupConfirmAccept
                    data={AppConfig.COMMISSION.EXPORT_COMMISSION}
                    handleClose={() => { setExportToExcel(false) }}
                    keySearch={{
                        from: date.from,
                        to: date.to,
                        account_id: Number(code)
                    }}
                    open
                />
            }
        </Stack>
    );
};

export default PageCommission;
