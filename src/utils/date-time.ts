import dayjs from "dayjs";
import moment from "moment";
// covert time create
export const showTimeStart = (createAt: string) => {
  const b = moment().format();
  const a = moment(createAt, "YYYY-MM-DD");
  const c = -a.diff(b, "minutes");
  let result = createAt;
  if (c < 1440) {
    result = moment(result).fromNow();
  } else if (c < 2880) {
    result = "Đã tạo ngày hôm qua";
  } else {
    const date = moment(result).date();
    const month = moment(result).month() + 1;
    const year = moment(result).year();
    result = `Đã tạo ${date} thg ${month} năm ${year}`;
  }
  return result;
};
// lấy ngày đầu tháng
export function returnFirstDayOfTheMonth(dateInput?: string | Date) {
  let date = new Date();
  if (dateInput)
    date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  date.setDate(1);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
type DateFormat =
  | "YYYYMM"
  | "DDMMYY"
  | "YYYYMMDD"
  | "DDMMYYYYvsHHMM"
  | "DDMMYYYY";

export function formatDate(date: string | Date, format: DateFormat): string {
  const d = new Date(date);

//   if (isNaN(d.getTime())) {
//     throw new Error("Invalid date");
//   }

  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  switch (format) {
    case "YYYYMM":
      return `Tháng ${month}/${year}`;
    case "YYYYMMDD":
      return `${year}-${month}-${day}`;
    case "DDMMYYYYvsHHMM":
      return `${day}/${month}/${year}, ${hours}:${minutes}`;
    case "DDMMYYYY":
      return `${day}/${month}/${year}`;
    case "DDMMYY":
      return `${day}/${month}/${year.slice(2, 4)}, ${hours}:${minutes}`;
    default:
      throw new Error("Invalid format type");
  }
}

export const formatTime = (time: string): string => {
  return dayjs(time, "HH:mm:ss").format("HH:mm:ss");
};

//  convert datetime to date
export const convertDateTimeToDate = (date_time: string | Date) => {
  const dateValue = date_time instanceof Date ? date_time : new Date(date_time);
  // Ví dụ giá trị datetime

  dateValue.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây thành 0
  dateValue.setDate(dateValue.getDate() + 1);
  return dateValue.toISOString().split("T")[0]; // Đây là ngày (date) dưới dạng chuỗi, ví dụ '2023-11-03'
};
function addTime(date: Date, value: number, type: string): Date {
  const result = new Date(date);
  switch (type) {
    case "days":
      result.setDate(result.getDate() + value);
      break;
    case "hours":
      result.setHours(result.getHours() + value);
      break;
    case "minutes":
      result.setMinutes(result.getMinutes() + value);
      break;
    case "months":
      result.setMonth(result.getMonth() + value);
      break;
    case "years":
      result.setFullYear(result.getFullYear() + value);
      break;
    default:
      throw new Error(
        "Invalid type. Valid types are days, hours, minutes, months, and years.",
      );
  }

  return result;
}

export function getDateRange(
  value1: number,
  type1: number,
  value2: number,
  type2: number,
): { min_date: string; max_date: string } {
  let type_min = "";
  let type_max = "";
  if (type1 === 0) type_min = "hours";
  if (type1 === 1) type_min = "minutes";
  if (type1 === 2) type_min = "days";
  // -----------
  if (type2 === 0) type_max = "hours";
  if (type2 === 1) type_max = "minutes";
  if (type2 === 2) type_max = "days";
  if (type2 === 3) type_max = "months";
  if (type2 === 4) type_max = "years";

  const today = new Date();
  const baseDate = addTime(today, 0, "days"); // Adjust the base date
  const minDate = addTime(baseDate, value1, type_min);
  const maxDate = addTime(baseDate, value2, type_max);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return {
    min_date: formatDate(minDate),
    max_date: formatDate(maxDate),
  };
}
const days = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

export const getWeekDates = (date: string) => {
  const current = new Date(date);
  const weekDates: { nameDate:string,date:string}[] = [];

  // Tính ngày đầu tuần (thứ Hai)
  const firstDay = new Date(current.setDate(current.getDate() - current.getDay() + 1));

  // Thêm các ngày trong tuần vào mảng weekDates
  for (let i = 0; i < 7; i++) {
    weekDates.push({ nameDate: days[i], date: moment(firstDay).format("YYYY-MM-DD") });
    firstDay.setDate(firstDay.getDate() + 1);
  }

  return weekDates;
}