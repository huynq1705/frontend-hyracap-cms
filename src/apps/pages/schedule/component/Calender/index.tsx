import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Table } from "antd";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "/src/assets/styles/schedule.scss";
import DndWrapper from "../DndWrapper";
import { formatDate } from "@/utils/date-time";
import apiScheduleService from "@/api/apiSchedule.service";
import { INIT_SCHEDULE } from "@/constants/init-state/schedule";
import ModalListSchedule from "../ModalListSchedule";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { getKeyPage } from "@/utils";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { selectUserInfo } from "@/redux/selectors/user.selector";
import apiAccountService from "@/api/Account.service";
import { OptionSelect } from "@/types/types";
import { createRangeTime } from "@/utils/create-list-range-time";
import dayjs from "dayjs";

type Event = {
    id: number;
    id_editor: number;
    content: string;
    date: string;
    from: string;
    to: string;
    type: number;
    platform: number;
    customer_id: number;
    customer_name: string;
    creator_id: number;
    status_schedule_id: number;
    staff_id: number;
    list_service_id: number[];
    employee: string;
    phone_number: string;
    eventColor: string;
};

type DataType = {
    key: number;
    employee: string;
    [key: string]: any;
};
interface OptionTime {
    value: string;
    label: string;
}

const generateTimeSlotsConfig = (
    timeSlot: number,
    timeOpen: string,
    timeClose: string
) => {
    const times = [];
    const [openHour, openMinute] = timeOpen.split(":").slice(0, 2).map(Number);
    const [closeHour, closeMinute] = timeClose
        .split(":")
        .slice(0, 2)
        .map(Number);

    let currentHour = openHour;
    let currentMinute = openMinute;

    const openInMinutes = openHour * 60 + openMinute;
    const closeInMinutes = closeHour * 60 + closeMinute;

    while (currentHour * 60 + currentMinute <= closeInMinutes) {
        const formattedHour = currentHour.toString().padStart(2, "0");
        const formattedMinute = currentMinute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);

        currentMinute += timeSlot;

        if (currentMinute >= 60) {
            currentMinute -= 60;
            currentHour += 1;
        }

        if (currentHour * 60 + currentMinute > closeInMinutes) {
            break;
        }
    }

    return times;
};

export interface CalenderTableProps {
    data: any;
    actions: {
        [key: string]: (...args: any) => void;
    };
    selectedDate: moment.Moment;
    onEventsChange?: (events: any) => void;
}

const CalenderTable = (props: CalenderTableProps) => {
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { data, actions, selectedDate, onEventsChange } = props;
    const { getConfig, getScheduleDay, putScheduleCalender } =
        apiScheduleService();
    const [schedule, setSchedule] = useState<Event[]>([]);
    const { pathname } = useLocation();
    const { T, t } = useCustomTranslation();
    const title_page = T(getKeyPage(pathname, "key"));
    const [errors, setErrors] = useState<string[]>([]);
    const userInfo = useSelector(selectUserInfo);
    const [staffAccount, setStaffAccount] = useState<OptionSelect>([]);
    const { getAccount } = apiAccountService();
    const [events, setEvents] = useState<Event[]>(schedule);
    const [employees, setEmployees] = useState<
        { id: number; full_name: string }[]
    >([{ id: 0, full_name: "Lịch Khác" }]);
    const [configData, setConfigData] = useState({
        time_open: "",
        time_close: "",
        time_slot: 30,
        time_booking_min: 1,
        unit_time_booking_min: 0,
        time_booking_max: 10,
        unit_time_booking_max: 0,
        list_account_id: "",
        status: 0,
    });

    const convertTimeFormat = (time: string | null | undefined): string => {
        if (!time) {
            return "";
        }
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const getAllSchedule = async () => {
        try {
            const param = {
                page: 1,
                take: 20,
            };
            const date = selectedDate.format("YYYY-MM-DD");
            const response = await getScheduleDay(param, date);
            if (response) {
                console.log("response", response);

                const newEvents: Event[] = response.data.map((item: any) => ({
                    id: item?.id,
                    id_editor: item?.creator?.id,
                    content: item?.content,
                    date: item?.date,
                    from: convertTimeFormat(item?.time),
                    to: convertTimeFormat(item?.time),
                    type: item?.type,
                    platform: item?.platform,
                    customer_id: item?.customer?.id,
                    customer_name: item?.customer?.full_name,
                    creator_id: item?.creator?.id,
                    status_schedule_id: item?.status_schedule?.id,
                    staff_id: item?.staff?.id,
                    list_service_id:
                        item?.schedule_service?.map(
                            (service: any) => service.service?.id
                        ) || [],
                    employee: item?.staff?.full_name,
                    phone_number: item?.customer?.phone_number,
                    eventColor: item?.status_schedule.color,
                }));
                setSchedule(newEvents);
            }
        } catch (e) {
            throw e;
        }
    };
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
                const uniqueEmployees = Array.from(
                    new Set(
                        response.data.map((item) => ({
                            id: item.id,
                            full_name: item.full_name,
                        }))
                    )
                );
                setEmployees([
                    { id: 0, full_name: "Lịch Khác" },
                    ...uniqueEmployees,
                ]);
            }
        } catch (e) {
            throw e;
        }
    };
    const getConfigSchedule = async () => {
        try {
            const response = await getConfig();
            if (response) {
                setConfigData(response);
            }
        } catch (err) {}
    };
    const timeSlots = generateTimeSlotsConfig(
        configData.time_slot,
        configData.time_open,
        configData.time_close
    );
    const getIndexOfTimeSlot = (timeSlot: string) => {
        return timeSlots.indexOf(timeSlot);
    };

    const getEventsInCell = (staffId: number, timeSlot: string) => {
        const timeSlotDate = new Date(`1970-01-01T${timeSlot}:00`);
        return events.filter((event) => {
            const eventStartDate = new Date(`1970-01-01T${event.from}:00`);

            if (event.status_schedule_id === 17) {
                return (
                    staffId === 0 &&
                    timeSlotDate.getTime() === eventStartDate.getTime()
                );
            } else {
                return (
                    event.staff_id === staffId &&
                    timeSlotDate.getTime() === eventStartDate.getTime()
                );
            }
        });
    };

    useEffect(() => {
        getAllStaffAccount();
        getAllSchedule();
    }, [selectedDate, code]);
    useEffect(() => {
        setEvents(schedule);
    }, [schedule]);
    useEffect(() => {
        getConfigSchedule();
    }, []);

    const DraggableEvent = ({ event }: { event: Event }) => {
        const [{ isDragging }, dragRef] = useDrag({
            type: "event",
            item: { event },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const handleClick = () => {
            navigate(`/admin/schedule/view/${event.id}`);
            actions.togglePopup("edit");
        };

        return (
            <div
                ref={dragRef}
                onClick={handleClick}
                style={{
                    cursor: "move",
                    opacity: isDragging ? 0.5 : 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "4px",
                    width: "100%",
                    backgroundColor: `${event.eventColor}10`,
                    borderLeft: `2px solid ${event.eventColor}`,
                    padding: "8px",
                    height: "100%",
                }}
                className="event-tag"
            >
                <p className="desc-event">{event.id}</p>
                <p className="desc-employee">{event.customer_name}</p>
                <div className="flex items-center gap-1">
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.27773 4.8499C0.86296 4.12667 0.662688 3.53611 0.54193 2.93747C0.363331 2.05211 0.772049 1.18725 1.44913 0.635399C1.73529 0.402165 2.06333 0.481851 2.23255 0.785432L2.61458 1.4708C2.91738 2.01404 3.06878 2.28566 3.03875 2.57363C3.00872 2.8616 2.80454 3.09614 2.39617 3.56521L1.27773 4.8499ZM1.27773 4.8499C2.11727 6.31378 3.43476 7.632 4.90034 8.47251M4.90034 8.47251C5.62357 8.88728 6.21414 9.08756 6.81277 9.20831C7.69813 9.38691 8.563 8.97819 9.11485 8.30111C9.34808 8.01495 9.26839 7.68691 8.96481 7.51769L8.27945 7.13567C7.73621 6.83286 7.46458 6.68146 7.17661 6.71149C6.88865 6.74152 6.65411 6.94571 6.18503 7.35408L4.90034 8.47251Z"
                            stroke={event.eventColor}
                            stroke-linejoin="round"
                        />
                        <path
                            d="M5.75012 2.61399C6.37281 2.87842 6.87181 3.37742 7.13624 4.0001M6.03627 0.5C7.58383 0.946595 8.80357 2.16627 9.25022 3.7138"
                            stroke={event.eventColor}
                            stroke-linecap="round"
                        />
                    </svg>
                    <p className="desc-event">{event.phone_number}</p>
                </div>
                <div className="flex items-center gap-1">
                    <svg
                        width="10"
                        height="12"
                        viewBox="0 0 10 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.75 4.68421C0.75 2.94746 0.75 2.07908 1.26256 1.53954C1.77513 1 2.60008 1 4.25 1L5.75 1C7.39992 1 8.22487 1 8.73744 1.53954C9.25 2.07908 9.25 2.94746 9.25 4.68421V7.31579C9.25 9.05254 9.25 9.92092 8.73744 10.4605C8.22487 11 7.39992 11 5.75 11L4.25 11C2.60008 11 1.77513 11 1.26256 10.4605C0.75 9.92092 0.75 9.05254 0.75 7.31579L0.75 4.68421Z"
                            stroke={event.eventColor}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M3 1L3.0411 1.2466C3.14087 1.84522 3.19075 2.14453 3.40056 2.32227C3.61037 2.5 3.91381 2.5 4.52069 2.5L5.47931 2.5C6.08619 2.5 6.38963 2.5 6.59944 2.32227C6.80925 2.14453 6.85913 1.84522 6.9589 1.2466L7 1"
                            stroke={event.eventColor}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M3 8H5M3 5.5L7 5.5"
                            stroke={event.eventColor}
                            stroke-linecap="round"
                        />
                    </svg>
                    <p className="desc-event">{event.content}</p>
                </div>
                <div className="flex items-center gap-1">
                    <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.99994 1.99512C5.21409 1.99512 5.38769 2.16872 5.38769 2.38287V4.76057L6.91824 5.52585C7.10979 5.62162 7.18743 5.85453 7.09165 6.04608C6.99588 6.23762 6.76297 6.31526 6.57143 6.21949L4.82653 5.34704C4.69516 5.28135 4.61218 5.14709 4.61218 5.00022V2.38287C4.61218 2.16872 4.78579 1.99512 4.99994 1.99512Z"
                            fill={event.eventColor}
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.02551 5C1.02551 2.80495 2.80495 1.02551 5 1.02551C7.19505 1.02551 8.97449 2.80495 8.97449 5C8.97449 5.34395 8.93079 5.67771 8.84866 5.996C8.8014 6.17916 8.87276 6.37635 9.03658 6.47093C9.24633 6.59203 9.51584 6.49701 9.58011 6.2635C9.69085 5.86119 9.75 5.4375 9.75 5C9.75 2.37665 7.62335 0.25 5 0.25C2.37665 0.25 0.25 2.37665 0.25 5C0.25 7.62335 2.37665 9.75 5 9.75C6.53084 9.75 7.89254 9.02582 8.76122 7.90136C8.89727 7.72524 8.83565 7.47428 8.64291 7.363C8.46411 7.25977 8.23734 7.31539 8.10858 7.47678C7.38035 8.38958 6.25848 8.97449 5 8.97449C2.80495 8.97449 1.02551 7.19505 1.02551 5Z"
                            fill={event.eventColor}
                        />
                    </svg>
                    <p className="desc-event">{event.from}</p>
                </div>
            </div>
        );
    };

    const DroppableCell = ({
        staffId,
        timeSlot,
    }: {
        staffId: number;
        timeSlot: string;
    }) => {
        const [{ isOver }, dropRef] = useDrop({
            accept: "event",
            drop: async (item: { event: Event }) => {
                console.log("Dropped item:", item);
                console.log("On cell:", { staffId, timeSlot });

                const startTimeIndex = getIndexOfTimeSlot(timeSlot);
                const to = timeSlots[startTimeIndex + 1] || timeSlot[0];
                const droppedEmployee = employees.find(
                    (emp) => emp.id === staffId
                );
                const staff_Id = droppedEmployee
                    ? droppedEmployee.full_name
                    : item.event.employee;
                const updatedEvent = {
                    ...item.event,
                    employee: staff_Id,
                    staff_id: staffId,
                    from: timeSlot,
                    to,
                };
                console.log("updatedEvent:", updatedEvent);

                setEvents((prevEvents) => {
                    const updatedEvents = prevEvents.map((evt) =>
                        evt === item.event ? updatedEvent : evt
                    );
                    console.log("Updated events:", updatedEvents);
                    return updatedEvents;
                });
                try {
                    const formatToFullTime = (time: string): string => {
                        if (!time.includes(":")) {
                            throw new Error("Invalid time format");
                        }
                        const parts = time.split(":");
                        return parts.length === 2 ? `${time}:00` : time;
                    };
                    const formData = {
                        id_schedule: updatedEvent?.id ?? null,
                        id_editor: userInfo?.id,
                        schedule: {
                            content: updatedEvent?.content,
                            date: formatDate(updatedEvent?.date, "YYYYMMDD"),
                            time: formatToFullTime(updatedEvent?.from),
                            to: null,
                            type: updatedEvent?.type,
                            platform: updatedEvent?.platform,
                            customer_id: updatedEvent?.customer_id,
                            creator_id: updatedEvent?.creator_id,
                            status_schedule_id: updatedEvent.status_schedule_id,
                            staff_id: updatedEvent.staff_id,
                            list_service_id: updatedEvent.list_service_id,
                        },
                    };
                    const KEY_REQUIRED: any = [];
                    const response = await putScheduleCalender(
                        formData,
                        KEY_REQUIRED
                    );
                    switch (response) {
                        case true: {
                            navigate("/admin/schedule");
                            dispatch(
                                setGlobalNoti({
                                    type: "success",
                                    message: `Cập nhật ${title_page} thành công`,
                                })
                            );
                            break;
                        }
                        case false: {
                            dispatch(
                                setGlobalNoti({
                                    type: "error",
                                    message: `Cập nhật ${title_page} thất bại`,
                                })
                            );
                            break;
                        }
                    }
                } catch (error) {
                    dispatch(
                        setGlobalNoti({
                            type: "error",
                            message: "updateError",
                        })
                    );
                    console.error(error);
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        });

        return (
            <div
                ref={dropRef}
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    width: "100%",
                    backgroundColor: isOver ? "#D3D3D3" : "#FCFCFD",
                    position: "relative",
                }}
            ></div>
        );
    };

    const renderEvent = (
        events: Event[],
        staffId: number,
        timeSlot: string
    ) => {
        const handleClick = () => {
            if (actions.togglePopup) {
                actions.togglePopup("listSchedule");
            }
            if (onEventsChange) {
                onEventsChange(events);
            }
        };
        if (events.length === 1) {
            return (
                <div
                    style={{
                        position: "relative",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <DraggableEvent key={events[0].from} event={events[0]} />
                    <DroppableCell staffId={staffId} timeSlot={timeSlot} />
                </div>
            );
        } else if (events.length > 1) {
            return (
                <div
                    style={{
                        position: "relative",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <DraggableEvent key={events[0].from} event={events[0]} />
                    <div
                        style={{
                            cursor: "pointer",
                            color: "#1D2939",
                            borderLeft: "2px solid #344054",
                            backgroundColor: "#F2F4F7",
                            width: "100%",
                            height: "100%",
                            paddingLeft: "10px",
                        }}
                        onClick={handleClick}
                    >
                        + {events.length - 1} lịch khác
                    </div>
                    <DroppableCell staffId={staffId} timeSlot={timeSlot} />
                </div>
            );
        } else {
            return <DroppableCell staffId={staffId} timeSlot={timeSlot} />;
        }
    };

    const handleClickCreate = (timeSlot: string, id: any) => {
        const range_time = `${timeSlot}`;
        const today = dayjs().format("YYYY-MM-DD");
        const date = selectedDate.isBefore(today, "day")
            ? ""
            : selectedDate.format("YYYY-MM-DD");
        console.log("startTimeIndex", timeSlot);
        navigate(`/admin/schedule/create`, {
            state: {
                id: id,
                time: range_time,
                date: date,
            },
        });
        actions.togglePopup("edit");
    };

    const columns: DataType["columns"] = [
        {
            title: "",
            dataIndex: "employee",
            key: "employee",
            width: 180,
            backgroundColor: "#FCFCFD",
            fixed: "left",
            render: (text: any) => (
                <div
                    style={{
                        minWidth: "164px",
                        height: "100%",
                        boxSizing: "border-box",
                        padding: "12px",
                        boxShadow: "0px 28px 32px 1px #0000001F",
                    }}
                >
                    {text}
                </div>
            ),
        },
        ...timeSlots.map((time) => ({
            title: <div style={{ textAlign: "center" }}>{time}</div>,
            dataIndex: time,
            key: time,
            width: 100,
            render: (text: any, record: any, d: any) => {
                const events = getEventsInCell(record.key, time);
                return (
                    <div
                        style={{
                            height: "150px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            width: "180px",
                            backgroundColor: "#FCFCFD",
                            position: "relative",
                        }}
                    >
                        {events.length > 0 ? (
                            renderEvent(events, record.key, time)
                        ) : (
                            <>
                                <DroppableCell
                                    staffId={record.key}
                                    timeSlot={time}
                                />
                                <img
                                    onClick={() =>
                                        handleClickCreate(time, record.key)
                                    }
                                    className="icon-add cursor-pointer"
                                    src="/assets/icons/add-icon.svg"
                                    alt=""
                                />
                            </>
                        )}
                    </div>
                );
            },
        })),
    ];

    const dataSource = employees.map((employee) => ({
        key: employee.id,
        employee: employee.full_name,
        ...timeSlots.reduce((acc, time) => ({ ...acc, [time]: null }), {}),
    }));

    return (
        <DndWrapper>
            <Table
                size="middle"
                bordered
                dataSource={dataSource}
                columns={columns}
                scroll={{ x: "max-content", y: "max-content" }}
                pagination={false}
                className="custom-table-schedule custom-table-calender"
            />
        </DndWrapper>
    );
};

export default CalenderTable;
