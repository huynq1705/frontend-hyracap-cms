import React, { useState, useEffect, useMemo } from "react";
import { Typography, Table } from "antd";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PopupConfirmRemove from "@/components/popup/confirm-remove";
import PopupEditCalendar from "../popup/EditCalendar"
import ButtonCore from "@/components/button/core";

import moment from "moment";
import { getWeekDates } from "@/utils/date-time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { handleGetParam } from "@/utils/filter";
import apiWorkScheduleService from "@/api/apiWorkSchedule";
import { ResponseWorkScheduleItem } from "@/types/workSchedule";
import { INIT_WORK_SCHEDULE } from "@/constants/init-state/work_schedule";
import DateSchedule from "../custom-datetime-picker";
import { KeySearchType } from "@/types/types";
import EmptyIcon from "@/components/icons/empty";

interface ListRequestDepositProps {
    authorizedPermissions?: any;
}

interface DayOfWeek {
    date: string;      // Ngày (định dạng YYYY-MM-DD)
    nameDate: string;  // Tên ngày (Thứ Hai, Thứ Ba,...)
}

const days = ["Thứ hai","Thứ ba" ,"Thứ tư","Thứ năm","Thứ sáu","Thứ bảy","Chủ nhật"]

const CustomCardList = ({ dataConvert, actions, code }: any) => {
    const navigate = useNavigate();
    console.log(dataConvert);
    
    return (
        <div className=" flex md:hidden flex-col space-y-4">
            {days.map((item: any, index: any) => {
                let today = dataConvert?.[item].date === moment().format("YYYY-MM-DD")
                return (
                    <div
                        key={item.id}
                        className="border border-solid border-gray-4 shadow rounded-lg mb-4"
                    >
                        <div className="border-b border-t-0 border-x-0 border-solid border-gray-4 last:border-none animate-fadeup even:bg-gray-1 px-3 py-2">
                            {/* <span className="font-medium text-gray-9 text-sm">
                            STT
                        </span> */}
                            <div className="flex flex-row justify-between">
                                <span className="font-medium text-gray-9 text-sm">
                                    {item}
                                </span>
                                {
                                    today &&
                                    <span className="font-bold text-[#50945D] text-sm">
                                        Hôm nay
                                    </span>
                                }
                          </div>

                        </div>

                        <Box p={0.5}>
                            {
                                dataConvert?.[item]?.calendar?.list_off_shift || dataConvert?.[item]?.calendar?.list_work_shift ?
                                    <Box
                                        onClick={() => actions({ remove: true, data: dataConvert?.[item]?.calendar })}
                                    >

                                        <Stack sx={{ borderLeft: 4, borderColor: "#50945D" }}>
                                            {
                                                dataConvert?.[item]?.calendar?.list_work_shift?.map((itemContent: any) => (
                                                    <Stack
                                                        p={1} alignItems={"flex-start"} justifyContent={"flex-start"} bgcolor={"#F6FAF7"} >
                                                        <Typography
                                                            style={{ fontSize: "14px", fontWeight: 500 }}
                                                        >
                                                            {/* {moment(dataConvert?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                            {itemContent?.content || "chưa có nội dung"}
                                                        </Typography>
                                                        <Typography
                                                            style={{ fontSize: "14px", fontWeight: 500 }}
                                                        >
                                                            {/* {moment(dataConvert?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                            {itemContent?.start_time?.slice(0, 5)} - {itemContent?.end_time?.slice(0, 5)}
                                                        </Typography>
                                                    </Stack>
                                                ))

                                            }
                                        </Stack>
                                        <Stack sx={{ borderLeft: 4, borderColor: '#F04438' }} >
                                            {
                                                dataConvert?.[item]?.calendar?.list_off_shift?.map((itemContent: any) => (
                                                    <Stack
                                                        p={1} alignItems={"flex-start"} justifyContent={"flex-start"} bgcolor={"#FEF6F5F2"} >
                                                        <Typography
                                                            style={{ fontSize: "14px", fontWeight: 500 }}
                                                        >
                                                            {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                            {itemContent?.content || "chưa có nội dung"}
                                                        </Typography>
                                                        <Typography
                                                            style={{ fontSize: "14px", fontWeight: 500 }}
                                                        >
                                                            {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                            {itemContent?.start_time?.slice(0, 5)} - {itemContent?.end_time?.slice(0, 5)}
                                                        </Typography>
                                                    </Stack>
                                                ))

                                            }
                                        </Stack>

                                    </Box>
                                    :
                                    <Box minHeight={62} className="relative">
                                        <ButtonCore
                                            onClick={() => actions({ remove: true, data: { ...INIT_WORK_SCHEDULE, date: dataConvert[item].date, account_id: Number(code) } })}
                                            icon={<FontAwesomeIcon
                                                icon={faPlusSquare}
                                                style={{ width: 28, height: 28, color: '#50945D' }}
                                            />}
                                            type="remove"
                                            styles={{
                                                width: 28, height: 28,
                                                border: 'none', color: '#50945D',
                                                position: 'absolute', top: 8, right: 8,
                                                display: 'flex', alignContent: 'center',
                                                justifyContent: 'center'
                                            }}

                                        />
                                    </Box>
                            }
                        </Box>
                    </div>
                )
            })}
        </div>
    );
};

const PageCalendar = (props: ListRequestDepositProps) => {
    const { authorizedPermissions } = props;
    const { T } = useCustomTranslation();
    const { getWorkSchedule } = apiWorkScheduleService();
    const { name, code } = useParams();
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const [weeks, setWeeks] = useState<DayOfWeek[]>(getWeekDates(moment().format("YYYY-MM-DD")))
    const param_payload = useMemo(() => {
        return handleGetParam(searchParams, `account_id__eq__${code}`);
    }, [searchParams]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["GET_SCHEDULE", { ...param_payload, filter: param_payload.filter + `,date__gte__${weeks[0].date},date__lte__${weeks[6].date}` }, pathname],
        queryFn: () => getWorkSchedule({ ...param_payload, filter: param_payload.filter + `,date__gte__${weeks[0].date},date__lte__${weeks[6].date}` }),
        keepPreviousData: true,
    });
    const [popup, setPopup] = useState({
        remove: false,
        data: INIT_WORK_SCHEDULE,
        status: "create"
    });
    const [popupRemove, setPopupRemove] = useState({
        remove: false,
        code: "",
        name: ""
    });


    // convert data

    function convertToCalendar(daysOfWeek: DayOfWeek[], tasks: ResponseWorkScheduleItem[]): any[] {

        const res = daysOfWeek.map(day => {
            const calendar = tasks
                .find(task => moment(task.date).format("YYYY-MM-DD") === day.date)
            return {
                date: day.date,
                nameDate: day.nameDate,
                calendar: calendar
            };
        });
        const result: any = {};
        res.forEach(item => {
            const { nameDate, date, calendar } = item;

            result[nameDate] = { date, nameDate, calendar };
        });
        return [
            {
                ...result
            },
        ]
    }
    const dataConvert = useMemo(() => {
        const data_res = data?.data;
        if (data_res && Array.isArray(data_res)) {
            return convertToCalendar(weeks, data_res);
        }
        return [];
    }, [data]);

    const columns = [
        {
            title: "-",
            dataIndex: "stt",
            width: 160,
            render: (_: any, d: any) => (
             <Stack sx={{position :"absolute" ,top:0,bottom:0,left:0,right:0,}}>
                    <Stack
                        direction={"column"}
                        sx={{ p: "12px", minHeight: 72 }}
                    >
                        <Typography
                            style={{ fontSize: "14px", fontWeight: 500 }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            style={{ fontSize: "14px" }}
                        >
                            {code}
                        </Typography>
                    </Stack>
             </Stack>
            ),
        },
        ...weeks.map(item => (
            {
                title: () => (
                    <Stack alignItems={'center'} justifyContent={"center"}>
                        <Typography
                            style={{
                                fontSize: "14px", fontWeight: "400", padding: "0 10px", borderRadius: 4,
                                ...(item.date === moment(new Date()).format("YYYY-MM-DD")) && { color: "white", backgroundColor: '#50945D', }
                            }}>
                            {item.nameDate}
                        </Typography>
                    </Stack>
                ),
                dataIndex: item?.nameDate,
                render: (_: any, d: any) => (
                    <Box
                        minHeight={100}
                    >
                        {
                            d?.[item.nameDate]?.calendar?.list_off_shift || d?.[item.nameDate]?.calendar?.list_work_shift ?
                                <Box onClick={() => setPopup({ ...popup, remove: true, data: d?.[item.nameDate]?.calendar })}>

                                    <Stack sx={{ borderLeft: 4, borderColor: "#50945D" }}>
                                        {
                                            d?.[item.nameDate]?.calendar?.list_work_shift?.map((itemContent: any) => (
                                                <Stack
                                                    p={1} alignItems={"flex-start"} justifyContent={"flex-start"} bgcolor={"#F6FAF7"} >
                                                    <Typography
                                                        style={{ fontSize: "14px", fontWeight: 500 }}
                                                    >
                                                        {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                        {itemContent?.content || "chưa có nội dung"}
                                                    </Typography>
                                                    <Typography
                                                        style={{ fontSize: "14px", fontWeight: 500 }}
                                                    >
                                                        {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                        {itemContent?.start_time?.slice(0, 5)} - {itemContent?.end_time?.slice(0, 5)}
                                                    </Typography>
                                                </Stack>
                                            ))

                                        }
                                    </Stack>
                                    <Stack sx={{ borderLeft: 4, borderColor: '#F04438' }} >
                                        {
                                            d?.[item.nameDate]?.calendar?.list_off_shift?.map((itemContent: any) => (
                                                <Stack
                                                    p={1} alignItems={"flex-start"} justifyContent={"flex-start"} bgcolor={"#FEF6F5F2"} >
                                                    <Typography
                                                        style={{ fontSize: "14px", fontWeight: 500 }}
                                                    >
                                                        {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                        {itemContent?.content || "chưa có nội dung"}
                                                    </Typography>
                                                    <Typography
                                                        style={{ fontSize: "14px", fontWeight: 500 }}
                                                    >
                                                        {/* {moment(d?.created_time).format("DD-MM-YYYY HH:mm:ss")} */}
                                                        {itemContent?.start_time?.slice(0, 5)} - {itemContent?.end_time?.slice(0, 5)}
                                                    </Typography>
                                                </Stack>
                                            ))

                                        }
                                    </Stack>
                               
                                </Box>
                                :
                                <Box minHeight={62}>
                                    <ButtonCore
                                        onClick={() => setPopup({ ...popup, remove: true, data: { ...INIT_WORK_SCHEDULE, date: item.date, account_id: Number(code) } })}
                                        icon={<FontAwesomeIcon
                                            icon={faPlusSquare}
                                            style={{ width: 28, height: 28, color: '#50945D' }}
                                        />}
                                        type="remove"
                                        styles={{
                                            width: 28, height: 28,
                                            border: 'none', color: '#50945D',
                                            position: 'absolute', top: 8, right: 8,
                                            display: 'flex', alignContent: 'center',
                                            justifyContent: 'center'
                                        }} />
                                </Box>
                        }
                    </Box>
                ),
            }))

    ];
   
    return (
        <Stack
            spacing={2}
            className='overflow-y-auto p-4 w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-250px)]'
        >
            <div
            className="flex flex-row items-center flex-wrap justify-between gap-4 md:flex-nowrap" 
           >
                <Typography.Text style={{ fontSize: 18, fontWeight: "500"}} className="md:flex-1" >
                    Lịch làm việc
                </Typography.Text>
                <DateSchedule
                    selectedWeek={weeks}
                    setSelectedWeek={setWeeks}
                />
                <ButtonCore
                    title="Tạo lịch mới"
                    type="default"
                    onClick={() => setPopup({ ...popup, remove: true, data: { ...INIT_WORK_SCHEDULE, account_id: Number(code) } })}
                />
            </div>
            {/* <Box sx={{ width: '100%', height: 1, borderBottom: 1, borderColor: '#D0D5DD' }} /> */}
            {/* {dataConvert.length < 1 && (
                <div className=" md:hidden flex justify-center items-center py-20  " style={{ borderTop: "2px solid #F2F4F7" }} >
                    <div className="flex flex-col">
                        <EmptyIcon />
                        <p className="text-center mt-3">Không có dữ liệu</p>
                    </div>
                </div>
            )} */}
            <CustomCardList dataConvert={dataConvert[0]} actions={setPopup}  code={code}/>

            <Box width="100%" sx={{ marginTop: 0, pt: 0 }}>
                <Table
                    size="middle"
                    bordered
                    // rowSelection={rowSelection}
                    locale={{
                        emptyText: (
                            <div className="flex justify-center items-center py-20">
                                <div className="flex flex-col">
                                    <EmptyIcon />
                                    <p className="text-center mt-3">Không có dữ liệu</p>
                                </div>
                            </div>
                        ),
                    }}
                    loading={isLoading}
                    dataSource={dataConvert}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: "100%", y: "calc(100vh - 379px)" }}
                    className="custom-table-calendar hidden md:block"
                    style={{ height: "calc(100vh - 379px)" }}
                />
            </Box>
            {
                popup.remove &&
                <PopupEditCalendar
                    handleClose={() => setPopup((prev) => ({ ...prev, remove: false }))}
                    data={popup.data}
                    refetch={refetch}

                />
            }
            <PopupConfirmRemove
                listItem={[popupRemove.code]}
                // listItem={selectedRowKeys}
                open={popupRemove.remove}
                handleClose={() => setPopupRemove((prev) => ({ ...prev, remove: false }))}
                refetch={refetch}
                name_item={[popupRemove.name]}
            />

        </Stack>
    );
};

export default React.memo(PageCalendar);