import apiAccountService from "@/api/Account.service";
import apiScheduleService from "@/api/apiSchedule.service";
import apiServiceSpaServicerService from "@/api/apiServiceSpa.service";
import styles from "@/assets/styles/make-an-appointment.module.scss";
import ButtonCore from "@/components/button/core";
import MyDatePicker from "@/components/input-custom-v2/calendar";
import MySelect from "@/components/input-custom-v2/select";
import MySelectTwoItem from "@/components/input-custom-v2/select/index-v2";
import MyTextField from "@/components/input-custom-v2/text-field";
import MyTextareaAutosize from "@/components/input-custom-v2/textarea-autosize";
import { INIT_MAKE_AN_APPOINTMENT } from "@/constants/init-state/make-an-appointment";
import useCustomTranslation from "@/hooks/useCustomTranslation";
import { setGlobalNoti } from "@/redux/slices/app.slice";
import { OptionSelect } from "@/types/types";
import { getKeyPage } from "@/utils";
import {
  createRangeTime,
  isCurrentTimeInRange,
} from "@/utils/create-list-range-time";
import { formatDate, getDateRange } from "@/utils/date-time";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import PopupToast from "./components/popup-toast";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import apiCustomerSourceService from "@/api/apiCustomerSource.service";
import ListStaff from "./components/list-staff";
import { values } from "lodash";
import DetailMakeAnAppointmentPage from "./components/detail";
import { m } from "framer-motion";
import moment from "moment";
import apiCompanyService from "@/api/apiCompany";
const KEY_REQUIRED: string[] = [
  "full_name",
  "phone_number",
  "date_time",
  "range_time",
];
const VALIDATE = {
  phone_number: "Số điện thoại không hợp lệ. Vui lòng nhập lại.",
  full_name:
    "Vui lòng nhập họ và tên. Họ và tên không được chứa kí tự đặc biệt",
  date_time: "Vui lòng chọn ngày hẹn",
  range_time: "Vui lòng chọn khung giờ",
};
const date = new Date();
const dateFormat = "DD-MM-YYYY";
const MakeAnAppointmentPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const { code } = useParams();
  const dispatch = useDispatch();
  const { T, t } = useCustomTranslation();
  const { pathname } = useLocation();
  const [id, setId] = useState(0);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>(INIT_MAKE_AN_APPOINTMENT);
  const [employee, setEmployee] = useState<any>([]);
  const [service, setService] = useState<OptionSelect>([]);
  const [configDate, setConfigDate] = useState({
    time_open: "08:00:00",
    time_close: "23:59:59",
    time_slot: 30,
    time_booking_min: 1,
    unit_time_booking_min: 0,
    time_booking_max: 10,
    unit_time_booking_max: 0,
    list_account_id: "",
    status: 0,
  });
  const [data, setData] = useState<any>({});
  const { getService } = apiServiceSpaServicerService();
  const { postScheduleUser, getConfig } = apiScheduleService();
  const { getCompanyDetail } = apiCompanyService();
  const { getAccount } = apiAccountService();
  const [info, setInfo] = useState<any>(null);
  const title_page = T(getKeyPage(pathname, "key"));
  const { min_date, max_date } = useMemo(() => {
    const {
      time_booking_max,
      time_booking_min,
      unit_time_booking_max,
      unit_time_booking_min,
    } = configDate;
    return getDateRange(
      time_booking_min,
      unit_time_booking_min,
      time_booking_max,
      unit_time_booking_max,
    );
  }, [configDate]);
  // fn: function
  const getDataInit = () => {
    getAllService();
    getAllEmployee();
    getConfigSchedule();
    getDetailCompany();
  };
  const getConfigSchedule = async () => {
    try {
      const response = await getConfig();
      if (response) {
        setConfigDate(response);
      }
    } catch (err) {}
  };

  const getAllService = async () => {
    try {
      const param: any = {
        page: 1,
        take: 999,
        filter: "status__eq__1,is_book_online__eq__1",
      };
      const response = await getService(param);
      if (response) {
        setService(
          response.data.map((it) => ({
            value: it.id.toString(),
            label: it.name,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const getAllEmployee = async () => {
    try {
      const param: any = {
        page: 1,
        take: 999,
        filter: "type__eq__1",
      };
      const response = await getAccount(param);
      if (response) {
        setEmployee(
          response.data.map((it) => ({
            value: it.id.toString(),
            label: it.full_name,
            image: `${import.meta.env.VITE_APP_URL_IMG}${it.image}`,
            note: it.note,
          })),
        );
      }
    } catch (e) {
      throw e;
    }
  };
  const getDetailCompany = async () => {
    try {
      const response = await getCompanyDetail(1);

      if (response.data) setInfo(response.data);
    } catch (e) {
      throw e;
    }
  };
  const handleOnchange = (e: any) => {
    const { name, value, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOnchangeDate = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    const daysOfWeek: any = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const currentDayIndex: any = new Date(value).getDay();
    const key: keyof typeof info.opening_and_closing_hour =
      daysOfWeek[currentDayIndex];
    const time = info.opening_and_closing_hour[key];
    const [open, close, is_active] = time.split("-");
    setConfigDate((prev) => {
      if (is_active === "ACTIVE")
        return { ...prev, time_close: close, time_open: open };
      return { ...prev, time_close: "00:00:00", time_open: "00:00:00" };
    });
  };
  const onSubmit = async () => {
    try {
      const response = await postScheduleUser(formData, KEY_REQUIRED);

      if (response.statusCode === 200) {
        const employee_item = employee.find(
          (item: any) => formData.staff_id[0] == item.value,
        );
        const new_data = {
          id: response.data.id,
          phone_number: formData.phone_number,
          email: formData.email,
          rang_time: formData.range_time,
          services: service
            .filter((x) => formData.service_id.includes(x.value))
            .map((x) => x.label)
            .join(", "),
          note: formData.note,
          staff: {
            full_name: employee_item?.label,
            image: employee_item?.image,
          },
        };
        setId(response.data.id);
        setData(new_data);
        setOpen(true);
        return;
      }
      if (response.statusCode === 407)
        return dispatch(
          setGlobalNoti({
            type: "info",
            message: `Bạn đã tạo 1 lịch hẹn trước đó rồi`,
          }),
        );
      dispatch(
        setGlobalNoti({
          type: "error",
          message: `Tạo ${title_page} thất bại`,
        }),
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  const isMobile = useMemo(() => {
    return window.innerWidth < 601;
  }, [window.innerWidth]);
  const RANGE_TIME = useMemo(() => {
    const isCheck =
      formData.date_time &&
      formatDate(formData.date_time, "YYYYMMDD") ===
        formatDate(date, "YYYYMMDD");
    const range_time = createRangeTime(
      configDate.time_slot,
      configDate.time_open,
      configDate.time_close,
    );
    if (isCheck)
      return range_time.map((it) => ({
        ...it,
        isDisable: isCurrentTimeInRange(it.value),
      }));
    return range_time;
  }, [configDate, formData.date_time]);
  useEffect(() => {
    getDataInit();
  }, []);
  const disabledDate = (current: any) => {
    const minDate = moment(min_date);
    const maxDate = moment(max_date);
    return current && (current < minDate || current > maxDate);
  };

  if (code) return <DetailMakeAnAppointmentPage data={data} />;
  return (
    <>
      <div className={styles.wrapper}>
        <img
          src="/src/assets/images/make-an-appointment_bg.png"
          alt=""
          className={styles.bg_mobile}
        />
        <div className={styles.banner}>
          <div className={clsx(styles.content, code && styles.detail)}>
            <img src="/src/assets/images/logo-remove-bg.png" alt="" />
            {!code && (
              <>
                <div>
                  <span>Đặt lịch hẹn</span>
                </div>
                <p>Mitu Spa kính chào quý khách</p>
              </>
            )}
          </div>
          {!code && (
            <img
              src="/src/assets/images/make-an-appointment_banner_follower.png"
              alt=""
            />
          )}
        </div>
        <div className={clsx(styles.form, code && styles.detail)}>
          {code && (
            <div className="w-full">
              <div className="flex flex-row items-center mb-8 gap-8">
                <FontAwesomeIcon icon={faChevronLeft} />
                <h2>Chi tiết lịch hẹn</h2>
              </div>
              <Box
                sx={{
                  backgroundColor: "#F4F8EE",
                }}
                className="w-full rounded-xl p-3 gap-3 flex flex-col"
              >
                <h4>THÔNG TIN CỦA SPA</h4>
                <div className="flex justify-between">
                  <span>Tên spa:</span>
                  <span>{info?.company_name ?? "spa"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số điện thoại:</span>
                  <span>{info?.phone_number ?? "0367093876"} </span>
                </div>
                <div className="flex justify-between">
                  <span>Địa chỉ:</span>
                  <span>{info?.address ?? "76 Nguyễn Chí Thanh"} </span>
                </div>
              </Box>
            </div>
          )}
          {/* id */}
          {code && (
            <MyTextField
              label="Mã lịch hẹn"
              errors={errors}
              required={code ? [] : KEY_REQUIRED}
              configUI={{
                width: isMobile ? "100%" : "calc(50% - 8px)",
              }}
              name="code"
              placeholder="Nhập họ và tên"
              handleChange={handleOnchange}
              values={{ code }}
              validate={VALIDATE}
              disabled={code}
            />
          )}
          {/* full_name */}
          <MyTextField
            label="Họ và tên"
            errors={errors}
            required={code ? [] : KEY_REQUIRED}
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
            }}
            name="full_name"
            placeholder="Nhập họ và tên"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={code}
          />

          {/* phone_number */}
          <MyTextField
            label="Số điện thoại"
            errors={errors}
            required={code ? [] : KEY_REQUIRED}
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
            }}
            name="phone_number"
            placeholder="Nhập số điện thoại"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={code}
          />
          {/* email */}
          <MyTextField
            label="Email"
            errors={errors}
            required={code ? [] : KEY_REQUIRED}
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
            }}
            name="email"
            placeholder="Nhập email (Không bắt buộc)"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={code}
          />
          {/* date_time */}
          <MyDatePicker
            label={"Ngày hẹn"}
            errors={errors}
            required={code ? [] : KEY_REQUIRED}
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
            }}
            name="date_time"
            placeholder="Chọn ngày hẹn"
            handleChange={handleOnchangeDate}
            values={formData}
            validate={VALIDATE}
            minDate={dayjs(min_date, dateFormat)}
            maxDate={dayjs(max_date, dateFormat)}
            format={dateFormat}
            disabledDate={disabledDate}
            disabled={code}
          />

          {/* range_time */}
          <MySelectTwoItem
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
              numberItemPerRow: isMobile ? 1 : 2,
            }}
            label="Khung giờ"
            name="range_time"
            handleChange={handleOnchangeDate}
            values={formData}
            options={RANGE_TIME}
            errors={errors}
            validate={VALIDATE}
            required={code ? [] : KEY_REQUIRED}
            itemsPerPage={5} // Adjust items per page as needed
            disabled={
              !!(!formData.date_time || code || !info.opening_and_closing_hour)
            }
          />
          {/* service_id */}
          <MySelect
            configUI={{
              width: isMobile ? "100%" : "calc(50% - 8px)",
            }}
            label="Dịch vụ"
            name="service_id"
            placeholder="Chọn dịch vụ"
            handleChange={handleOnchange}
            values={formData}
            options={service}
            errors={errors}
            validate={VALIDATE}
            required={KEY_REQUIRED}
            itemsPerPage={5}
            type="select-multi"
            disabled={code} // Adjust items per page as needed
          />

          <ListStaff
            data={employee}
            ids={formData.staff_id}
            setIDS={(value: any[]) => {
              setFormData((prev: any) => ({ ...prev, staff_id: value }));
            }}
          />
          {/* description */}
          <MyTextareaAutosize
            label="Yêu cầu/ ghi chú"
            errors={errors}
            required={KEY_REQUIRED}
            configUI={{
              width: "100%",
              minRows: 5,
            }}
            name="note"
            placeholder="Để lại lời nhắn nếu bạn có bất kì yêu cầu nào dành cho chúng mình nhé!"
            handleChange={handleOnchange}
            values={formData}
            validate={VALIDATE}
            disabled={code}
          />
          {!code && (
            <div className="flex justify-end w-full mt-4">
              <ButtonCore
                title="Đặt lịch"
                styles={{
                  width: isMobile ? "100%" : "30%",
                  height: "48px",
                }}
                onClick={onSubmit}
              />
            </div>
          )}
        </div>
        <div className={styles.bottom}></div>
      </div>
      <PopupToast
        handleClose={() => {
          setOpen(false);
          setFormData(INIT_MAKE_AN_APPOINTMENT);
        }}
        open={open}
        data={formData}
        code={id}
      />
    </>
  );
};
export default MakeAnAppointmentPage;
