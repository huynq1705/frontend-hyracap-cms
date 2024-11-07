import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import advancedFormat from "dayjs/plugin/advancedFormat";
import minMax from "dayjs/plugin/minMax";
import "antd/dist/reset.css";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { ClickAwayListener } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { formatDateV2 } from "@/utils/date-time";
import { handleGetPage } from "@/utils/filter";
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const SingleCalendarDateRangePicker = () => {
    const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const filterV2 = queryParams.get("filter");
    let filter = window.location.search;
    // const [searchParams] = useSearchParams();
    // const { currentPage, pageSize, key_search } = handleGetPage(searchParams);
    const disabledDate = (currentDate: Dayjs) => {
        return currentDate && currentDate.isAfter(dayjs(), "day");
    };
    useEffect(() => {
        if (filter.includes("created_at__between")) {
            const createdAtFilter = filterV2
                ?.split(",")
                .find((param) => param.includes("created_at__between"));
            if (createdAtFilter) {
                const dateRange = createdAtFilter
                    .split("__between__")[1]
                    .split("vs");
                const startDate = dayjs(dateRange[0], "YYYY-MM-DD");
                const endDate = dayjs(dateRange[1], "YYYY-MM-DD");
                setSelectedDates([startDate, endDate]);
            }
        }
    }, []);

    const handleChange = (date: Dayjs | null) => {
        if (!date) return;

        if (selectedDates.length === 0) {
            setSelectedDates([date]);
            setIsPickerOpen(true);
        } else if (selectedDates.length === 1) {
            const startDate = selectedDates[0];
            const endDate = date;
            if (endDate.isBefore(startDate)) {
                setSelectedDates([endDate, startDate]);
            } else {
                setSelectedDates([startDate, endDate]);
            }
            setIsPickerOpen(false);
        } else {
            setSelectedDates([date]);
            setIsPickerOpen(true);
        }
    };

    const getDayClass = (currentDate: Dayjs) => {
        if (
            selectedDates.length > 0 &&
            (currentDate.isSame(selectedDates[0], "day") ||
                (selectedDates[1] &&
                    currentDate.isSame(selectedDates[1], "day")))
        ) {
            return "!bg-[#090D14] !text-white font-bold";
        }
        if (
            selectedDates.length === 2 &&
            currentDate.isBetween(
                selectedDates[0],
                selectedDates[1],
                null,
                "[]"
            )
        ) {
            return "!bg-[#F9FAFB] !text-[#101828] font-bold";
        }
        return "";
    };

    const getPlaceholder = () => {
        if (selectedDates.length === 1) {
            return `Ngày ${selectedDates[0].format("DD/MM/YYYY")}`;
        }
        if (selectedDates.length === 2) {
            return `${selectedDates[0].format(
                "DD/MM/YYYY"
            )} - ${selectedDates[1].format("DD/MM/YYYY")}`;
        }
        return "Chọn";
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (selectedDates.length === 2) {
            event.preventDefault();
        }
    };
    useEffect(() => {
        filter = window.location.search;
        if (selectedDates.length === 2) {
            let updatedFilter = filter;
            const hasCreatedAt = filter.includes("created_at__between");

            if (hasCreatedAt) {
                updatedFilter = updatedFilter.replace(
                    /created_at__between__\d{4}-\d{2}-\d{2}vs\d{4}-\d{2}-\d{2}/,
                    `created_at__between__${formatDateV2(
                        selectedDates[0].toDate()
                    )}vs${formatDateV2(selectedDates[1].toDate())}`
                );
            } else {
                if (filter === "") {
                    updatedFilter = `?&filter=created_at__between__${formatDateV2(
                        selectedDates[0].toDate()
                    )}vs${formatDateV2(selectedDates[1].toDate())}`;
                } else if (filter.endsWith("=")) {
                    updatedFilter += `created_at__between__${formatDateV2(
                        selectedDates[0].toDate()
                    )}vs${formatDateV2(selectedDates[1].toDate())}`;
                } else {
                    updatedFilter += `,created_at__between__${formatDateV2(
                        selectedDates[0].toDate()
                    )}vs${formatDateV2(selectedDates[1].toDate())}`;
                }
            }
            navigate(`${pathname}${updatedFilter}`);
        }
    }, [selectedDates, filter, filterV2, pathname, navigate]);

    return (
        <div className="flex-1">
            <ClickAwayListener onClickAway={() => setIsPickerOpen(false)}>
                <div>
                    <DatePicker
                        open={isPickerOpen}
                        onChange={handleChange}
                        value={
                            selectedDates.length === 1
                                ? selectedDates[0]
                                : undefined
                        }
                        placeholder={getPlaceholder()}
                        dateRender={(currentDate: any) => {
                            const dayClass = getDayClass(currentDate);
                            return (
                                <div
                                    className={`ant-picker-cell-inner ${dayClass}`}
                                >
                                    {currentDate.date()}
                                </div>
                            );
                        }}
                        disabledDate={disabledDate}
                        onClick={() => setIsPickerOpen(true)}
                        className={
                            selectedDates.length === 2
                                ? "placeholder-black"
                                : ""
                        }
                        onKeyDown={handleKeyDown}
                        style={{
                            pointerEvents:
                                selectedDates.length === 2 ? "auto" : "auto",
                            color:
                                selectedDates.length === 2
                                    ? "black"
                                    : "initial",
                        }}
                    />
                </div>
            </ClickAwayListener>
        </div>
    );
};

export default SingleCalendarDateRangePicker;
